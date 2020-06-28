import React, { Component } from "react";

import { connect } from "react-redux";
import { savedPackageRemove } from "../redux/actions";

class SavedCard extends Component
{
    onPackageDelete(tracking)
    {
        this.props.savedPackageRemove(tracking);

        // TODO: do we need to replace this code?
        // In the case the saved bookmark is on display in package details right now
        // if (this.pkgCard.state.tracking === tracking)
        //     this.pkgCard.setState({ isBookmarked: false });
    }

    render()
    {
        if (this.props.saved.length === 0)
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
        for (const [i, data] of Object.entries(this.sortedPackages()))
        {
            const { tracking, carrier, name } = data;

            const pkgView = () => {}; // TODO: send action to load package details... need to change search to use thunk
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

    sortedPackages()
    {
        // Ensure we do not mutate our local prop state
        const savedCopy = [...this.props.saved];

        // We want to sort is so that named packages (alphetical) comes first;
        // then comes unnamed packages (displayed by alphabetical tracking number)
        return savedCopy.sort((a, b) => {
            // Both packages are named
            if (a.name && b.name)
                return a.name.localeCompare(b.name);

            // Only one of the packages is named
            if (a.name || b.name)
                return a.name ? -1 : 1;

            // Neither package is named, so compare tracking #
            return a.tracking.localeCompare(b.tracking);
        });
    }
}

// TODO: ensure redux-persist saves only savedCard reducer
const mapStateToProps = (state) => ({ saved: state.savedCard });
const mapDispatchToProps = (dispatch) => ({
    savedPackageRemove: (tracking) => dispatch(savedPackageRemove(tracking))
});
export default connect(mapStateToProps, mapDispatchToProps)(SavedCard);
