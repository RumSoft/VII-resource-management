import React, { Component } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  Icon,
  Label,
} from "semantic-ui-react";
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
    const { attributes, name, quantity, room, owner } = this.props.resource;
    const { isAdmin } = this.props;
    let topContent = "";

    if (isAdmin) {
      topContent = (
        <CardDescription>
          <Icon name="user" /> {owner.firstName} {owner.lastName}
        </CardDescription>
      );
    }

    return (
      <Card className={`resourceRow ${this.props.fluid ? "row-fluid" : ""}`}>
        <CardContent>
          {topContent}
          <CardDescription>
            <Icon name="tag" />
            <span>
              <b>{name}</b>
            </span>
          </CardDescription>
          <CardDescription
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Label style={{ backgroundColor: room && room.color }}>
              <Icon name="point" />
              {`${room?.name || "brak pokoju"}`}
            </Label>
            <span style={{ marginTop: "auto", marginBottom: "auto" }}>
              <Icon name="stack overflow" /> x{quantity}
            </span>
          </CardDescription>
          <CardDescription className="attributesPanel">
            {attributes.length === 0 ? (
              <Label>brak atrybutów</Label>
            ) : (
              attributes.map((x) => (
                <Label style={{ backgroundColor: x.color }}>{x.name}</Label>
              ))
            )}
          </CardDescription>
        </CardContent>
        {!isAdmin && (
          <CardContent>
            <div className="ui three buttons">
              <Button
                className="button"
                basic
                color="yellow"
                onClick={() => this.handleEditClick()}
              >
                <Icon name="write" /> edytuj
              </Button>
              <Button
                className="button"
                basic
                color="blue"
                onClick={() => this.handleRequestClick()}
              >
                <Icon name="envelope outline" />
                prześlij
              </Button>
              <Button
                className="button"
                basic
                color="red"
                onClick={() => this.handleDeleteClick()}
              >
                <Icon name="x" />
                usuń
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }
}
