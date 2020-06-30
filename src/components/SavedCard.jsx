import React, { Component } from "react";

import { connect } from "react-redux";
import { doTrackingSearch, savedPackageRemove } from "../redux/actions";

class SavedCard extends Component
{
    getSavedEntriesCount = () => Object.keys(this.props.saved).length;

    onPackageDelete = (tracking) => this.props.savedPackageRemove(tracking);

    render()
    {
        if (this.getSavedEntriesCount() === 0)
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
        const savedLen = this.getSavedEntriesCount();

        for (const [i, [tracking, data]] of Object.entries(this.sortedPackages()))
        {
            const { carrier, name } = data;

            const pkgView = () => this.props.doTrackingSearch(tracking, carrier);
            const pkgDelete = () => this.onPackageDelete(tracking);

            const divider = (Number.parseInt(i, 10) === savedLen - 1) ? null : <hr />;
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

    sortedPackages()
    {
        // Ensure we do not mutate our local prop state and make it easier to iterate
        // Entry format = [ tracking, data object name and carrier ]
        const savedEntries = Object.entries(this.props.saved);

        // We want to sort is so that named packages (alphetical) comes first;
        // then comes unnamed packages (displayed by alphabetical tracking number)
        return savedEntries.sort((a, b) => {
            // Both packages are named
            if (a[1].name && b[1].name)
                return a[1].name.localeCompare(b[1].name);

            // Only one of the packages is named
            if (a[1].name || b[1].name)
                return a[1].name ? -1 : 1;

            // Neither package is named, so compare tracking #
            return a[0].localeCompare(b[0]);
        });
    }
}

// TODO: ensure redux-persist saves only savedCard reducer
const mapStateToProps = (state) => ({ saved: state.savedCard });
const mapDispatchToProps = (dispatch) => ({
    doTrackingSearch:
        (tracking, carrier) => dispatch(doTrackingSearch(tracking, carrier)),
    savedPackageRemove:
        (tracking) => dispatch(savedPackageRemove(tracking))
});
export default connect(mapStateToProps, mapDispatchToProps)(SavedCard);
