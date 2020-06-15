class SavedCard extends React.Component {
    constructor(props)
    {
        super(props);

        this.saveManager = new PackageSaved();
        this.state = { saved: this.saveManager.getAll() };
    }

    onPackageSavedUpdate = () => this.setState({ saved: this.saveManager.getAll() });

    render()
    {
        return (
            <div>
                <div className="card">
                    <div className="card-header">Saved Packages</div>

                    <div className="card-body">
                        { [ ...this.renderPackages() ] }
                    </div>
                </div>
            </div>
        );
    }

    *renderPackages()
    {
        for (const [i, [tracking, carrier]] of Object.entries(this.state.saved))
        {
            const divider = (i == this.state.saved.length - 1) ? null : <hr />;
            yield (
                <div key={ tracking }>
                    <h6 className="d-inline-block">{ tracking }</h6>
                    <span className="float-right">
                        <span className="badge badge-pill badge-info save-badge">{ carrier }</span>
                        <button
                            className="btn btn-sm btn-primary float-right icon-fix" type="button">
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </span>
                    { divider }
                </div>
            );
        }
    }
}

const domContainer = document.querySelector("#saved-container");
const savedCard = React.createRef();
ReactDOM.render(React.createElement(SavedCard, { ref: savedCard }), domContainer);
