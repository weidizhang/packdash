import React, { Component } from "react";

class RowContainer extends Component
{
    render()
    {
        return (
            <div className="row">
                <div className="col-md-8 mx-auto">
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default RowContainer;
