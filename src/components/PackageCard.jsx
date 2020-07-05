import React, { Component } from "react";

import { connect } from "react-redux";
import {
    savedPackageAdd,
    savedPackageRemove,

    PackageDetailsRenderStates
} from "../redux/actions";

import Card from "./ui/Card";
import PackageMap from "./PackageMap";

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

        // Ref to the rendered main card and collapse for assiting the expand animation
        this.mainCard = React.createRef();
        this.mainCardCollapse = React.createRef();
    }

    componentDidUpdate(oldProps)
    {
        // Workaround to prevent the transition animation from occurring on first page load
        // which is an issue when using the style directly
        document.body.style.transition = "margin-top 300ms ease-in-out";

        if (oldProps.detailsRenderState != this.props.detailsRenderState)
        {
            if (this.props.detailsRenderState === PackageDetailsRenderStates.NORMAL)
            {
                // Whenever the main card is re-rendered switching from some other render state
                // to the normal render state, we need to reset the UI element states
                this.setState({
                    isBookmarkHover: false,
                    isExpanded: false
                });

                // We also need to adjust the body styling so there is not too much extra margin
                // when we display a large amount of information in the card
                document.body.style.marginTop = "5%";
            }
            else
                // Revert it back to the original body styling otherwise as there's not much content
                document.body.style.marginTop = "15%";
        }
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

        // Deleting existing bookmark is a simple redux action
        if (this.isBookmarked())
        {
            this.props.savedPackageRemove(tracking);
            return;
        }

        // Otherwise prompt for a name to associate with the new bookmark
        // Used window.bootbox as bootbox npm package requires bootstrap lib (not used by project)
        window.bootbox.prompt({
            title: "Let's give it a name!",
            placeholder: "e.g. Amazon Package (optional)",
            callback: (result) => {
                // Cancel button clicked
                if (result === null)
                    return;

                // Add the bookmark; empty name is OK - it will be rendered differently
                const name = result.trim();
                this.props.savedPackageAdd(tracking, carrier, name);
            }
        });
    }

    hasPreviousDetails = () => this.props.details.previousDetails && this.props.details.previousDetails.length > 0;

    isBookmarked = () => this.props.details.tracking && (this.props.details.tracking in this.props.saved);

    invertUIState = (stateKey, callback = null) => this.setState({ [stateKey]: !this.state[stateKey] }, callback);

    onCollapseClick()
    {
        this.invertUIState("isExpanded", () => {
            // After the collapse/expansion animation completes, and we are expanded state,
            // we want to trigger a scroll animation to see all the details
            //
            // Otherwise, we use a scroll animation to bring the page back to the top

            if (this.state.isExpanded)
            {
                const collapseStyle = window.getComputedStyle(this.mainCardCollapse.current, null);

                let animationSpeed = collapseStyle.getPropertyValue("transition-duration");
                animationSpeed = Number.parseFloat(animationSpeed.split(" ")[0]);

                const offsetTime = 0.02;
                setTimeout(this.scrollToDetails.bind(this), (animationSpeed + offsetTime) * 1000);
            }
            else
            {
                window.scrollTo({
                    behavior: "smooth",
                    top: 0
                });
            }
        });
    }

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
            <Card
                header="Package Details"
                detailIcon="exclamation-triangle"
                detailHeader="Oops!"
                detailLevel="danger"
                useGapSpace>

                Please double check your tracking number and try again.
            </Card>
        );
    }

    renderLoadingCard()
    {
        return (
            <Card
                header="Package Details"
                useGapSpace
                textCenter>

                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </Card>
        );
    }

    renderMainCard()
    {
        return (
            <Card
                header="Package Details"
                innerRef={ this.mainCard }
                useGapSpace>

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

                    ref={ this.mainCardCollapse }
                    onClick={ this.onCollapseClick.bind(this) }
                    disabled={ !this.hasPreviousDetails() }>
                    <i
                        className={ "fa fa-chevron-" + (this.state.isExpanded ? "up" : "down") }
                        aria-hidden="true" />
                </button>

                {/* Render the package details from the redux state */}
                <div className="collapse" id="pkg-detail-collapse">
                    { [ ...this.renderMainCardDetails() ] }
                </div>

                <hr />

                {/* Map showing the most recent locations the package has been along its route */}
                <PackageMap markers={ this.props.details.locationMarkers } />
            </Card>
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

    scrollToDetails()
    {
        // We check if the UI collapse is still expanded state, in case that the user
        // quickly collapsed the element before animation finished
        if (this.state.isExpanded && this.mainCard.current && this.mainCardCollapse.current)
        {
            const mainCardRect = this.mainCard.current.getBoundingClientRect();
            const mainCardTop = mainCardRect.top + window.pageYOffset;
            const offset = 15;

            window.scrollTo({
                behavior: "smooth",
                top: mainCardTop - offset
            });
        }
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
