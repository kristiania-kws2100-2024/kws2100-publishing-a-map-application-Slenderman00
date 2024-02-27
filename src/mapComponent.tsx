import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "./ol.css";
import { Map, Overlay, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke, Circle } from "ol/style";
import Select from "ol/interaction/Select";
import { click, pointerMove } from "ol/events/condition";

const MapComponent: React.FC = () => {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const vectorSourceDistricts = new VectorSource({
      format: new GeoJSON(),
      url: "src/assets/Sivilforsvarsdistrikter.geojson",
      wrapX: false,
    });

    const vectorSourcePoints = new VectorSource({
      format: new GeoJSON(),
      url: "src/assets/Offentlige tilfluktsrom.geojson",
      wrapX: false,
    });

    const vectorLayerDistricts = new VectorLayer({
      source: vectorSourceDistricts,
      style: new Style({
        stroke: new Stroke({
          color: "#0000ff",
          width: 2,
        }),
      }),
    });

    const vectorLayerPoints = new VectorLayer({
      source: vectorSourcePoints,
      style: (feature) => {
        return new Style({
          image: new Circle({
            radius: feature.get("plasser") / 1000 + 5,
            fill: new Fill({
              color: "#ff00ff",
            }),
          }),
        });
      },
    });

    const overlay = new Overlay({
      element: overlayRef.current,
      positioning: "bottom-center",
      stopEvent: false,
    });

    const hoverPoint = new Select({
      condition: pointerMove,
      layers: [vectorLayerPoints],
      style: (feature) => {
        return new Style({
          image: new Circle({
            radius: feature.get("plasser") / 1000 + 10,
            fill: new Fill({
              color: "#0000ff",
            }),
          }),
        });
      },
    });

    const selectPoint = new Select({
      condition: click,
      layers: [vectorLayerPoints],
    });

    selectPoint.on("select", (e) => {
      if (e.selected.length > 0) {
        let feature = e.selected[0];
        let properties = feature.getProperties();
        setSelectedFeature(properties.adresse);
        overlay.setPosition(e.mapBrowserEvent.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    let map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayerDistricts,
        vectorLayerPoints,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    map.addInteraction(selectPoint);
    map.addInteraction(hoverPoint);
    map.addOverlay(overlay);

    return () => {
      //Makes sure it does not generate multiple maps
      map.setTarget();
    };
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "800px", border: "4px solid red" }}
      />
      {selectedFeature && (
        <div
          ref={overlayRef}
          className="overlay"
          style={{ backgroundColor: "yellow"}}
        >
          <p>Address: {selectedFeature}</p>
        </div>
      )}
    </>
  );
};

export default MapComponent;
