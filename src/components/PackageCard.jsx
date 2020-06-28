import React, { Component } from "react";

import { connect } from "react-redux";
import { PackageDetailsRenderStates } from "../redux/actions";

class PackageCard extends Component
{
    createCarrierLink()
    {
        const carrier = this.props.details.carrier;
        const tracking = this.props.details.tracking;

        if (carrier === "FedEx")
            return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${tracking}`;
        else if (carrier === "UPS")
            return `https://www.ups.com/track?loc=en_US&tracknum=${tracking}&requester=WT/trackdetails`;
        else if (carrier === "USPS")
            return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${tracking}`;

        // We should never reach this case
        return "#";
    }

    render()
    {
        // Search bar will tell us our render state
        const renderState = this.props.detailsRenderState;
        
        switch (renderState)
        {
            case PackageDetailsRenderStates.LOADING:
                return this.renderLoadingCard();

            case PackageDetailsRenderStates.ERROR:
                return this.renderErrorCard();

            case PackageDetailsRenderStates.NORMAL:
                return this.renderMainCard();

            case PackageDetailsRenderStates.HIDDEN:
            default:
                return null;
        }
    }

    renderErrorCard()
    {
        return (
            <div>
                <div className="card">
                    <div className="card-header">Package Details</div>

                    <div className="card-body text-center">
                        <div className="text-danger">
                            <i className="card-alert-icon fa fa-exclamation-triangle" aria-hidden="true" />
                            <h5>Oops!</h5>
                        </div>

                        <span className="pkg-detail-text">
                            Please double check your tracking number and try again.
                        </span>
                    </div>
                </div>

                <div className="gap-space"></div>
            </div>
        );
    }

    renderLoadingCard()
    {
        return (
            <div>
                <div className="card">
                    <div className="card-header">Package Details</div>

                    <div className="card-body text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>

                <div className="gap-space"></div>
            </div>
        );
    }

    renderMainCard()
    {
        return (
            <b>Testing</b>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state.detailsCard
});
export default connect(mapStateToProps)(PackageCard);
