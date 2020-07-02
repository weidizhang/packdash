import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

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
            }
        ];

        for (const { location, position } of markers)
            yield (
                <Marker key={ location } position={ position }>
                    <Popup>{ location }</Popup>
                </Marker>
            );
    }
}

export default PackageMap;
