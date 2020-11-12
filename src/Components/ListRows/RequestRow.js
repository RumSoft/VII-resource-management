import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import "./RequestRow.scss";

export default class RequestRow extends Component {
    handleDeleteClick() {
        this.props.onDelete && this.props.onDelete(this.props.request);
    }

    render() {
        const { taker, owner, resource, id } = this.props.request;

        return (
            <div className="list-row request-row">
                <div className="list-row__content">
                    {taker.firstName} {taker.lastName} {owner.firstName} {owner.lastName} {resource.name} {resource.quantity}
                </div>
                <div className="list-row__actions">
                    <Button
                        circular
                        as={Link}
                        to={`/request/edit?requestId=${id}`}
                        icon="edit"
                        color="yellow"
                    />
                    {/* <Button
                        circular
                        onClick={() => this.handleDeleteClick()}
                        icon="delete"
                        color="red"
                    /> */}
                </div>
            </div>
        );
    }
}
