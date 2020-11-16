import { parseColor } from "@progress/kendo-drawing";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import "./UserRow.scss";

export default class UserRow extends Component {
  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.user);
  }

  render() {
    const { firstName, lastName, emailAddress, id, role } = this.props.user;
    const { isAdmin } = this.props;
    console.log(isAdmin);

    return (
      <Card className="userRow" style={this.props.style}>
        <div className="userAvatar">
          <Image src="https://loremflickr.com/100/100/cats" circular />
        </div>
        <div className="userProperietes">
          <p className="userName">
            {firstName} {lastName}
          </p>
          <p className="emailAddress">{emailAddress}</p>
        </div>
        <div className="editButton">
          {isAdmin && (
            <Button
              size="big"
              square
              as={Link}
              to={`/user/edit?userId=${id}`}
              icon="edit"
              color="yellow"
              style={{ visibility: role == "Admin" ? "Hidden" : "inherit" }}
            />
          )}
        </div>
      </Card>
    );
  }
}
