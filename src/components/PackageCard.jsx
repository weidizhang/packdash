import React, { Component } from "react";

import { connect } from "react-redux";
import {
    savedPackageAdd,
    savedPackageRemove,

    PackageDetailsRenderStates
} from "../redux/actions";

class PackageCard extends Component
{
    constructor(props)
    {
        super(props);

        // Local state for UI elements such as hovers
        this.state = {
            isBookmarkHover: false,
            isExpanded: false
        };
    }

    componentDidUpdate(oldProps)
    {
        if (oldProps.detailsRenderState != this.props.detailsRenderState &&
                this.props.detailsRenderState === PackageDetailsRenderStates.NORMAL)
            // Whenever the main card is re-rendered switching from some other render state
            // to the normal render state, we need to reset the UI element states
            this.setState({
                isBookmarkHover: false,
                isExpanded: false
            });
    }

    createCarrierLink()
    {
        const { carrier, tracking } = this.props.details;

        if (carrier === "FedEx")
            return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${tracking}`;
        else if (carrier === "UPS")
            return `https://www.ups.com/track?loc=en_US&tracknum=${tracking}&requester=WT/trackdetails`;
        else if (carrier === "USPS")
            return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${tracking}`;

        // We should never reach this case
        return "#";
    }

    handleBookmarkClick()
    {
        const { tracking, carrier } = this.props.details;
        const name = null;

        if (!this.isBookmarked())
            this.props.savedPackageAdd(tracking, carrier, name);
        else
            this.props.savedPackageRemove(tracking);

        console.log(this.props);
    }

    hasPreviousDetails = () => this.props.details.previousDetails && this.props.details.previousDetails.length > 0;

    isBookmarked = () => this.props.details.tracking && (this.props.details.tracking in this.props.saved);

    invertUIState = (stateKey) => this.setState({ [stateKey]: !this.state[stateKey] });

    render()
    {
        // Search trigger actions will tell us our render state
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
            <div>
                <div className="card">
                    <div className="card-header">Package Details</div>

                    <div className="card-body">
                        {/* Status and Bookmarking */}
                        <div>
                            <h5 className="card-title d-inline-block">{ this.props.details.status }</h5>

                            <a
                                href="#" id="pkg-save" className="float-right icon-fix"

                                title={ this.isBookmarked() ? "Remove from Saved Packages" : "Add to Saved Packages" }
                                style={{
                                    color: this.isBookmarked() ? "gold" : "#6c757d",
                                    opacity: this.state.isBookmarkHover ? 0.5 : 1.0
                                }}
                                onClick={ this.handleBookmarkClick.bind(this) }
                                onMouseEnter={ () => this.invertUIState("isBookmarkHover") }
                                onMouseLeave={ () => this.invertUIState("isBookmarkHover") }
                                >

                                <i
                                    className="fa fa-bookmark"
                                    aria-hidden="true" />
                            </a>
                        </div>

                        {/* Carrier Info */}
                        <div>
                            <span id="pkg-detail-track">
                                Tracking Number: { }
                                <a
                                    target="_blank"
                                    href={ this.createCarrierLink() }
                                    title={ "View on " +  this.props.details.carrier }>

                                    <span id="pkg-detail-num">
                                        { this.props.details.tracking }
                                    </span>
                                </a>
                            </span>
                            <span className="badge badge-pill badge-info float-right">
                                { this.props.details.carrier }
                            </span>
                        </div>

                        <hr />

                        {/* Most recent carrier event or detail */}
                        <span className="pkg-detail-text">
                            { this.props.details.lastUpdate }
                        </span>

                        {/* Expand to show all carrier events or details */}
                        <button
                            className="btn btn-sm btn-primary float-right icon-fix" type="button"
                            data-toggle="collapse" data-target="#pkg-detail-collapse" aria-expanded="false"
                            aria-controls="pkg-detail-collapse"

                            onClick={ () => this.invertUIState("isExpanded") }
                            disabled={ !this.hasPreviousDetails() }>
                            <i
                                className={ "fa fa-chevron-" + (this.state.isExpanded ? "up" : "down") }
                                aria-hidden="true" />
                        </button>

                        <div className="collapse" id="pkg-detail-collapse">
                            { [ ...this.renderMainCardDetails() ] }
                        </div>
                    </div>
                </div>

                <div className="gap-space"></div>
            </div>
        );
    }

    *renderMainCardDetails()
    {
        if (!this.hasPreviousDetails())
            return null;

        for (const detail of this.props.details.previousDetails)
            yield (
                <div key={ detail }>
                    <hr />
                    <span className="pkg-detail-text">
                        { detail }
                    </span>
                </div>
            );
    }
}

const mapStateToProps = (state) => ({
    ...state.detailsCard,
    saved: { ...state.savedCard }
});
const mapDispatchToProps = (dispatch) => ({
    savedPackageAdd:
        (tracking, carrier, name) => dispatch(savedPackageAdd(tracking, carrier, name)),
    savedPackageRemove:
        (tracking) => dispatch(savedPackageRemove(tracking))
});
export default connect(mapStateToProps, mapDispatchToProps)(PackageCard);
