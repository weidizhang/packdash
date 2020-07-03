import React, { Component } from "react";
import { Map, TileLayer, Marker, Polyline, Popup } from "react-leaflet";

import L, { latLngBounds } from "leaflet";
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
    autoFitBounds()
    {
        if (!this.props.markers || this.props.markers.length == 0)
            // No markers means we will default the bounds to the center of the contiguous US
            return latLngBounds([ 39.50, -98.35 ]);

        const markers = this.props.markers;
        const bounds = latLngBounds(markers[0].position);
        for (const { position } of markers)
            bounds.extend(position);

        // Add some padding to see every marker
        return bounds.pad(0.5);
    }

    render()
    {
        return (
            <Map bounds={ this.autoFitBounds() }>
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
        const markers = this.props.markers;
        for (const [i, { eventText, position }] of Object.entries(markers))
        {
            // The two keys have to be unique, so we use -i and i instead of i for both

            const polyline = (i > 0) ?
                                <Polyline key={ -i } positions={ [ position, markers[i-1].position ] } weight={ 4 } /> :
                                null;
            yield (
                <>
                    <Marker key={ i } position={ position }>
                        <Popup>{ eventText }</Popup>
                    </Marker>
                    { polyline }
                </>
            );
        }
    }
}

export default PackageMap;
