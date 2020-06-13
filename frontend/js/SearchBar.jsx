class SearchBar extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            tracking: null
        };
    }

    detectCarrier()
    {
        if (!this.state.tracking)
            return null;

        /* Regular expressions found from https://stackoverflow.com/questions/619977/regular-expression-patterns-for-tracking-numbers */
        const carriers = {
            "UPS": [
                /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/
            ],
            "FedEx": [
                /(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)/,
                /\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/,
                /^[0-9]{15}$/
            ],
            "USPS": [
                /^E\D{1}\d{9}\D{2}$|^9\d{15,21}$/,
                /^91[0-9]+$/,
                /^[A-Za-z]{2}[0-9]+US$/,
                /(\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b)|(\b\d{26}\b)| ^E\D{1}\d{9}\D{2}$|^9\d{15,21}$| ^91[0-9]+$| ^[A-Za-z]{2}[0-9]+US$/i
            ]
        };

        for (const [carrier, regexList] of Object.entries(carriers))
            for (const regex of regexList)
                if (this.state.tracking.match(regex))
                    return carrier;

        return null;
    }

    handleInputChange(e)
    {
        this.setState({ tracking: e.target.value.trim() });
    }

    render()
    {
        return (
            <div className="input-group">
                <input type="text"
                    className="form-control"
                    placeholder="Enter a tracking number from FedEx, USPS, or UPS"
                    onChange={ this.handleInputChange.bind(this) } />

                    <div className="input-group-append">
                        <button type="submit" className="btn btn-secondary">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>

                    <span className="badge badge-pill badge-info" id="search-carrier-badge">
                        { this.detectCarrier() }
                    </span>
            </div>
        );
    }
}

const domContainer = document.querySelector("#search-container");
ReactDOM.render(React.createElement(SearchBar), domContainer);
