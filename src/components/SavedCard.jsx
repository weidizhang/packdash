import React, { Component } from "react";

class SavedCard extends Component
{
    constructor(props)
    {
        super(props);

        // Declare it null here as a reminder we should receive it from the instance later
        this.pkgCard = null;
        this.saveManager = null; //new PackageSaved();
        //this.state = { saved: this.saveManager.getAll() };
        this.state = { saved: [] };
    }

    onPackageDelete(tracking)
    {
        this.saveManager.removeItem(tracking);
        this.onPackageSavedUpdate();

        // In the case the saved bookmark is on display in package details right now
        if (this.pkgCard.state.tracking === tracking)
            this.pkgCard.setState({ isBookmarked: false });
    }

    onPackageSavedUpdate = () => this.setState({ saved: this.saveManager.getAll() });

    render()
    {
        if (this.state.saved.length === 0)
            return this.renderBlankCard();
        return this.renderMainCard();
    }

    renderBlankCard()
    {
        return (
            <div>
                <div className="card">
                    <div className="card-header">Saved Packages</div>

                    <div className="card-body text-center">
                        <div className="text-info">
                            <i className="card-alert-icon fa fa-bookmark" aria-hidden="true" />
                            <h5>Your Saved List is Empty!</h5>
                        </div>

                        <span className="pkg-detail-text">
                            To get started, click the bookmark icon to the right of the package status { }
                            after making a search.
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    renderMainCard()
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
        for (const [i, [tracking, data]] of Object.entries(this.state.saved))
        {
            const { carrier, name } = JSON.parse(data);

            const pkgView = () => this.pkgCard.onSearchBarInput(carrier, tracking);
            const pkgDelete = () => this.onPackageDelete(tracking).bind(this);
            
            const divider = (i === this.state.saved.length - 1) ? null : <hr />;
            const header = name ?
                ( <> <a href="#" onClick={ pkgView }>{ name }</a> &mdash; { tracking } </> ) :
                ( <a href="#" onClick={ pkgView }>{ tracking }</a> );

            yield (
                <div key={ tracking }>
                    <h6 className="d-inline-block">
                        { header }
                    </h6>
                    <span className="float-right">
                        <span className="badge badge-pill badge-info save-badge save-badge-no-select">{ carrier }</span>
                        <button
                            className="btn btn-sm btn-primary float-right icon-fix"
                            type="button"
                            onClick={ pkgDelete }>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </span>
                    { divider }
                </div>
            );
        }
    }

    setPkgCardInstance = (obj) => this.pkgCard = obj;
}

export default SavedCard;