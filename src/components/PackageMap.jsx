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
    constructor(props)
    {
        super(props);

        // Ref used to automatically open the most recent event marker on the map
        this.lastMarker = React.createRef();
    }

    autoFitBounds()
    {
        if (!this.props.markers || this.props.markers.length == 0)
            // No markers means we will default the bounds to the center of the contiguous US
            return latLngBounds([ 39.50, -98.35 ]);

        // Use the last 3 markers (most recent locations) as the focus area for better UX
        const markers = this.props.markers.slice(Math.max(0, this.props.markers.length - 3));
        const bounds = latLngBounds(markers[0].position);
        for (const { position } of markers)
            bounds.extend(position);

        // Originally planned to use .pad(...) to expand markers but does not seem necessary.
        return bounds;
    }

    componentDidUpdate()
    {
        // Automatically open the most recent event marker on the map
        if (this.lastMarker.current)
        {
            const lastMarkerElement = this.lastMarker.current.leafletElement;
            lastMarkerElement.openPopup();
        }
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
            const polyline = (i > 0) ?
                                <Polyline positions={ [ position, markers[i-1].position ] } weight={ 4 } /> :
                                null;
            yield (
                <div key={ i }>
                    <Marker position={ position } ref={ this.lastMarker }>
                        <Popup>{ eventText }</Popup>
                    </Marker>
                    { polyline }
                </div>
            );
        }
    }
}

export default PackageMap;
