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
            isLoading: false
        };
    }

    onSearchBarInput(carrier, tracking)
    {
        const pkgAPI = new PackageAPI();
        pkgAPI.getTrackingData(carrier, tracking, (json) => {
            this.setState(json);
            this.setState({
                carrier: carrier,
                tracking: tracking
            });
        });
    }

    render()
    {
        if (this.state.isLoading)
            return this.renderLoadingCard();
        if (!this.state.status)
            return ( null );

        return this.renderMainCard();
    }

    renderLoadingCard()
    {
        // TODO:
        return ( null );
    }

    renderMainCard()
    {
        return (
            <div className="card">
                <div className="card-header">Package Details</div>

                <div className="card-body">
                    <h5 className="card-title">{ this.state.status }</h5>
                    <span id="pkg-detail-track">
                        Tracking Number: { }
                        <a href="#" target="_blank" title={ "View on " +  this.state.carrier }>
                            <span id="pkg-detail-num">{ this.state.tracking }</span>
                        </a>
                    </span>
                    <span className="badge badge-pill badge-info float-right">{ this.state.carrier }</span>

                    <hr />

                    <span id="pkg-detail-text">
                        { this.state.lastUpdate }
                    </span>

                    <button className="btn btn-sm btn-primary float-right" id="expand-fix" type="button"
                        data-toggle="collapse" data-target="#pkg-detail-collapse" aria-expanded="false"
                        aria-controls="pkg-detail-collapse">
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    </button>

                    <div className="collapse" id="pkg-detail-collapse">
                        <hr />
                        Additional Details
                    </div>
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector("#pkg-detail-container");
const pkgCard = React.createRef();
ReactDOM.render(React.createElement(PackageCard, { ref: pkgCard }), domContainer);
