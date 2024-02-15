import React, { useEffect, useRef } from "react";
import './ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';

const MapComponent: React.FC = () => {
    //We are giving it a random id to allow for the possibility of multiple maps.
    const _id = 'map' + (Math.floor((Math.random() * 9999) + 1)).toString();

    //This is dumb. The whole point of component based development is for the components to be independent and avoid using the global DOM id space.
    useEffect(() => {
        let map = new Map({
            target: _id,
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


    return <div id={_id} style={{width: '100%', height: '400px', border: '4px solid red'}} />;
};


export default MapComponent;