import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "./ResourceRow.scss";

export default class ResourceRow extends Component {
    handleRequestClick() {
        this.props.onRequest && this.props.onRequest(this.props.resource);
    }
    handleEditClick() {
        this.props.onChange && this.props.onChange(this.props.resource);
    }

    handleDeleteClick() {
        this.props.onDelete && this.props.onDelete(this.props.resource);
    }

    render() {

        const { name, quantity, room } = this.props.resource;

        return (
            <div className="list-row resource-row">
                <div className="list-row__content">{name} {quantity} {room && room.name}</div>
                <div className="list-row__actions">
                    <Button
                        circular
                        onClick={() => this.handleRequestClick()}
                        icon="mail forward"
                        color="blue"
                    />
                    <Button
                        circular
                        onClick={() => this.handleEditClick()}
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
