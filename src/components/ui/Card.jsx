import React, { Component } from "react";

class Card extends Component
{
    render()
    {
        return (
            <div>
                <div className="card" ref={ this.props.innerRef }>
                    <div className="card-header">{ this.props.header }</div>
                    { this.renderCardBody() }
                </div>

                {/* For adding space/visual gap below a card where necessary */}
                { this.props.useGapSpace ? <div className="gap-space"></div> : null }
            </div>
        );
    }

    renderCardBody()
    {
        // Card body with some basic detail texts, used as the 'empty card' when there are errors with
        // package details or no saved packages
        if (this.props.detailIcon && this.props.detailHeader && this.props.detailLevel)
            return (
                <div className="card-body text-center">
                    <div className={ "text-" + this.props.detailLevel }>
                        <i className={ "card-alert-icon fa fa-" + this.props.detailIcon } aria-hidden="true" />
                        <h5>{ this.props.detailHeader }</h5>
                    </div>

                    <span className="pkg-detail-text">
                        { this.props.children }
                    </span>
                </div>
            );

        // Standard blank card body is rendered with the children, supporting centering
        return (
            <div className={ "card-body" + (this.props.textCenter ? " text-center" : "") }>
                { this.props.children }
            </div>
        );
    }
}

export default Card;
