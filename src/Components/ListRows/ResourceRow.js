import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import "./ResourceRow.scss";

export default class ResourceRow extends Component {
    handleDeleteClick() {
        this.props.onDelete && this.props.onDelete(this.props.resource);
    }

    render() {

        const { id, name, quantity, room } = this.props.resource;

        return (
            <div className="list-row resource-row">
                <div className="list-row__content">{name} {quantity} {room && room.name}</div>
                <div className="list-row__actions">
                    <Button
                        circular
                        as={Link}
                        to={`/user/edit?resourceId=${id}`}
                        icon="edit"
                        color="yellow"
                    />
                    <Button
                        circular
                        onClick={() => this.handleDeleteClick()}
                        icon="delete"
                        color="red"
                    />
                </div>
            </div>
        );
    }
}
