import React, { Component } from "react";
import { Map, TileLayer, Marker, Polyline, Popup } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Required fixes for display marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

class PackageMap extends Component
{
    render()
    {
        const position = [51.505, -0.09];
        return (
            <Map center={ position } zoom={ 13 }>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />

                { [ ...this.renderMarkers() ] }
            </Map>
        );
    }

    *renderMarkers()
    {
        const markers = [
            {
                location: "abc, zzz",
                position: [51.505, -0.09]
            },
            {
                location: "zzz, yyy",
                position: [51.519, -0.09]
            },
            {
                location: "fff, yyy",
                position: [51.495, -0.09]
            }
        ];

        for (const [i, { location, position }] of Object.entries(markers))
        {
            const polyline = (i > 0) ?
                                <Polyline key={ i } positions={ [ position, markers[i-1].position ] } weight={ 4 } /> :
                                null;
            yield (
                <>
                    <Marker key={ i } position={ position }>
                        <Popup>{ location }</Popup>
                    </Marker>
                    { polyline }
                </>
            );
        }
    }
}

export default PackageMap;
