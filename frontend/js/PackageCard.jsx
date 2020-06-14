class PackageCard extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            status: null,
            lastUpdate: null,
            previousDetails: null
        };
    }

    onSearchBarInput(tracking)
    {
        // TODO:
    }

    render()
    {
        return (
            <div className="card">
                <div className="card-header">
                    Package Details
                </div>

                <div className="card-body">
                    <h5 className="card-title">In Transit</h5>
                    <span id="pkg-detail-track">
                        Tracking Number: { }
                        <a href="#" target="_blank" title="View on CARRIER NAME">
                            <span id="pkg-detail-num">11020239320299</span>
                        </a>
                    </span>
                    <span className="badge badge-pill badge-info float-right">FedEx</span>

                    <hr />

                    <span id="pkg-detail-text">
                        With supporting text below as a natural lead-in to additional content.
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
