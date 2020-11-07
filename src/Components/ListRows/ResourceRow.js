import React, { Component } from "react";
import "./ResourceRow.scss";

export default class ResourceRow extends Component {


    render() {
        const { name, quantity, attributes, room } = this.props.resource;
        return (
            <div className="list-row">
                <div className="list-row__content">{name}{quantity}{attributes.name}{room.name}</div>
            </div>
        );
    }
}
