import React, { Component } from "react";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
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
          <Link to={`/user/edit?userId=${id}`}>
            <button className="list-row__actions__edit">E</button>
          </Link>
          <Tooltip title="Usuń">
            <button
              className="list-row__actions__delete"
              onClick={() => this.handleDeleteClick()}
            >
              X
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }
}
