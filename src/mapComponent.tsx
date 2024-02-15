import React, { MutableRefObject, useEffect, useRef } from "react";
import './ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';

const MapComponent: React.FC = () => {
    const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        let map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
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


    return <div ref={mapRef} style={{width: '100%', height: '400px', border: '4px solid red'}} />;
};


export default MapComponent;