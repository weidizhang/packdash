class PackageCard extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            // For copied state from SearchBar
            carrier: null,
            tracking: null,

            // For fetched API results
            status: null,
            lastUpdate: null,
            previousDetails: null,

            // For component render state information
            isBookmarked: false,
            isBookmarkHover: false,
            isError: false,
            isExpanded: false,
            isLoading: false
        };
        this.mainCardRef = React.createRef();
        this.saveManager = new PackageSaved();
    }

    handleBookmarkClick()
    {
        if (this.saveManager.isSaved(this.state.tracking))
            this.saveManager.removeItem(this.state.tracking);
        else
            this.saveManager.addItem(this.state.tracking, this.state.carrier);

        this.setState({ isBookmarked: !this.state.isBookmarked });
    }

    handleBookmarkHover = () => this.setState({ isBookmarkHover: !this.state.isBookmarkHover });

    handleCollapseClick = () => this.setState({ isExpanded: !this.state.isExpanded });

    hasPreviousDetails = () => this.state.previousDetails && this.state.previousDetails.length > 0;

    onSearchBarInput(carrier, tracking)
    {
        this.setState({ isLoading: true }, () => {
            const pkgAPI = new PackageAPI();
            pkgAPI.getTrackingData(carrier, tracking, (data) => {
                if ("error" in data)
                {
                    // No other states have to be set because of the render order checks
                    this.setState({
                        isError: true,
                        isLoading: false
                    });
                    return;
                }

                this.setState(data);
                this.setState({
                    carrier: carrier,
                    tracking: tracking,

                    // Reset the component states to defaults
                    isBookmarked: this.saveManager.isSaved(tracking),
                    isBookmarkHover: false,
                    isError: false,
                    isExpanded: false,
                    isLoading: false
                });
            });
        });
    }

    render()
    {
        if (this.state.isLoading)
            return this.renderLoadingCard();
        if (this.state.isError)
            return this.renderErrorCard();
        if (!this.state.status)
            return null;

        return this.renderMainCard();
    }

    renderErrorCard()
    {
        return (
            <div>
                <div className="card">
                    <div className="card-header">Package Details</div>

                    <div className="card-body text-center">
                        <div className="text-danger">
                            <i className="fa fa-exclamation-triangle" id="pkg-error" aria-hidden="true" />
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
                <div className="card" ref={ this.mainCardRef }>
                    <div className="card-header">Package Details</div>

                    <div className="card-body">
                        {/* Status and Bookmarking */}
                        <div>
                            <h5 className="card-title d-inline-block">{ this.state.status }</h5>

                            <a
                                href="#" id="pkg-save" className="float-right icon-fix"

                                title={ this.state.isBookmarked ? "Remove from Saved Packages" : "Add to Saved Packages" }
                                style={{
                                    color: this.state.isBookmarked ? "gold" : "#6c757d",
                                    opacity: this.state.isBookmarkHover ? 0.5 : 1.0
                                }}
                                onClick={ this.handleBookmarkClick.bind(this) }
                                onMouseEnter={ this.handleBookmarkHover.bind(this) }
                                onMouseLeave={ this.handleBookmarkHover.bind(this) }>

                                <i
                                    className="fa fa-bookmark"
                                    aria-hidden="true" />
                            </a>
                        </div>

                        {/* Carrier Info */}
                        <div>
                            <span id="pkg-detail-track">
                                Tracking Number: { }
                                <a href="#" target="_blank" title={ "View on " +  this.state.carrier }>
                                    <span id="pkg-detail-num">{ this.state.tracking }</span>
                                </a>
                            </span>
                            <span className="badge badge-pill badge-info float-right">{ this.state.carrier }</span>
                        </div>

                        <hr />

                        {/* Most recent carrier event or detail */}
                        <span className="pkg-detail-text">
                            { this.state.lastUpdate }
                        </span>

                        {/* Expand to show all carrier events or details */}
                        <button
                            className="btn btn-sm btn-primary float-right icon-fix" type="button"
                            data-toggle="collapse" data-target="#pkg-detail-collapse" aria-expanded="false"
                            aria-controls="pkg-detail-collapse"

                            onClick={ this.handleCollapseClick.bind(this) }
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

        for (const detail of this.state.previousDetails)
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
        if (this.state.isExpanded && this.mainCardRef && this.mainCardRef.current)
        {
            const mainCardRect = this.mainCardRef.current.getBoundingClientRect();
            const mainCardTop = mainCardRect.top + window.pageYOffset;
            const offset = 15;

            window.scrollTo({
                behavior: "smooth",
                top: mainCardTop - offset
            });
        }
    }
}

const domContainer = document.querySelector("#pkg-detail-container");
const pkgCard = React.createRef();
ReactDOM.render(React.createElement(PackageCard, { ref: pkgCard }), domContainer);
