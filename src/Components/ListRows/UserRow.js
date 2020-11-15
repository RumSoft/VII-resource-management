import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import "./UserRow.scss";

export default class UserRow extends Component {
  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.user);
  }

  render() {
    const { firstName, lastName, id } = this.props.user;
    return (
      <div className="list-row room-row">
        <div className="list-row__content">
          {firstName} {lastName}
        </div>
        <div className="list-row__actions">
          <Button
            circular
            as={Link}
            to={`/user/edit?userId=${id}`}
            icon="edit"
            color="yellow"
          />
        </div>
      </div>
    );
  }
}
