import React, { Component } from "react";

import { connect } from "react-redux";

class PackageCard extends Component
{
    render()
    {
        return this.renderErrorCard();
    }

    renderErrorCard()
    {
        return (
            <div>
                <div className="card">
                    <div className="card-header">Package Details</div>

                    <div className="card-body text-center">
                        <div className="text-danger">
                            <i className="card-alert-icon fa fa-exclamation-triangle" aria-hidden="true" />
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
}

export default connect()(PackageCard);
