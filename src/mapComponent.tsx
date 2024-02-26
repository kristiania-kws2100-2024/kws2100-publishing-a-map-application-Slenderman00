import React, { MutableRefObject, useEffect, useRef } from "react";
import './ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from "ol/layer/Vector";
import Layer from "ol/layer/Layer";
import { OSM, Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke, Circle } from 'ol/style';

const MapComponent: React.FC = () => {
    const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        
        const vectorSourceDistricts = new VectorSource({
            format: new GeoJSON(),
            url: 'src/assets/Sivilforsvarsdistrikter.geojson',
            wrapX: false
        })

        const vectorSourcePoints = new VectorSource({
            format: new GeoJSON(),
            url: 'src/assets/Offentlige tilfluktsrom.geojson',
            wrapX: false
        })

        const vectorLayerDistricts = new VectorLayer({
            source: vectorSourceDistricts,
            style: new Style({
                stroke: new Stroke({
                    color: '#0000ff',
                    width: 2,
                })
            })
        });

        const vectorLayerPoints = new VectorLayer({
            source: vectorSourcePoints,
            style: new Style({
                image: new Circle({
                    radius: 8,
                    fill: new Fill({
                        color: '#ff00ff'
                    })
                }) 
            })
        });


        let map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayerDistricts,
                vectorLayerPoints
            ],
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        });

        return () => {
            //Makes sure it does not generate multiple maps
            map.setTarget();
        }

    }, []);


    return <div ref={mapRef} style={{width: '100%', height: '800px', border: '4px solid red'}} />;
};


export default MapComponent;