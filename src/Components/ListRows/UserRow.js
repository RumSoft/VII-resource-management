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
    const { firstName, lastName, emailAddress, id } = this.props.user;
    const { isAdmin } = this.props;
    let content = "";
    console.log(isAdmin);

    if (isAdmin) {
      content = <Button
        size="big"
        square
        as={Link}
        to={`/user/edit?userId=${id}`}
        icon="edit"
        color="yellow" />
    }

    return (
      <Card className="userRow">
        <div style={{ display: "inline-flex" }}>
          <div className="userAvatar">
            <Image src="http://placekitten.com/200/300" style={{ width: "60px", height: "60px" }} circular />
          </div>
          <div className="userProperietes">
            <span><span className="userName">{firstName} {lastName}</span> <br></br> <span style={{ color: "gray" }}>{emailAddress}</span></span>
          </div>
          <div className="editButton">
            {content}
          </div>
        </div>
      </Card>
    );
  }
}
