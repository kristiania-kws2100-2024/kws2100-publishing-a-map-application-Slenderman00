import React, { useEffect } from "react";
import './ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';

const MapComponent: React.FC = () => {

    //This is dumb.
    useEffect(() => {

        let map = new Map({
            target: 'map',
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

    return <div id="map" style={{width: '100%', height: '400px', border: '4px solid red'}} />;
};


export default MapComponent;