class SearchBar extends React.Component {
    constructor(props)
    {
        super(props);

        this.pkgCard = window.pkgCard.current;
        this.state = {
            carrier: null,
            tracking: ""
        };
    }

    detectCarrier(tracking)
    {
        if (!tracking)
            return null;

        // Regular expressions found from https://stackoverflow.com/questions/619977/regular-expression-patterns-for-tracking-numbers
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
                if (tracking.match(regex))
                    return carrier;

        return null;
    }

    handleClick()
    {
        this.pkgCard.onSearchBarInput(this.state.carrier, this.state.tracking);

        // Reset the state to default state
        this.setState({
            carrier: null,
            tracking: ""
        });
    }

    handleKeyDown(e)
    {
        if (e.key === "Enter" && this.state.carrier !== null)
            this.handleClick();
    }

    handleInputChange(e)
    {
        const eventValue = e.target.value.trim();
        this.setState({
            tracking: eventValue,
            carrier: this.detectCarrier(eventValue)
        });
    }

    render()
    {
        return (
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter a tracking number from FedEx, USPS, or UPS"
                    value={ this.state.tracking }
                    onChange={ this.handleInputChange.bind(this) } 
                    onKeyDown={ this.handleKeyDown.bind(this) } />

                    <div className="input-group-append">
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            disabled={ this.state.carrier === null }
                            onClick={ this.handleClick.bind(this) }>

                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>

                    <span className="badge badge-pill badge-info" id="search-carrier-badge">
                        { this.state.carrier }
                    </span>
            </div>
        );
    }
}

const domContainer = document.querySelector("#search-container");
ReactDOM.render(React.createElement(SearchBar), domContainer);
