import React, { Component } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  Icon,
  Label,
} from "semantic-ui-react";
import "./RequestRow.scss";

export default class RequestRow extends Component {
  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.request);
  }

  render() {
    const { userInfo, taker, owner, resource } = this.props.request;

    let isOther = !userInfo.isTaker && !userInfo.isOwner;
    let header = "";
    let footer = "";

    if (isOther) {
      header = (
        <CardDescription>
          {
            <span>
              <b>{owner.firstName}</b> <b>{owner.lastName}</b> chce przekazać{" "}
              <b>{taker.firstName}</b> <b>{taker.lastName}</b>
            </span>
          }
        </CardDescription>
      );
    } else if (userInfo.isTaker) {
      header = (
        <CardDescription>
          {
            <span>
              <b>{owner.firstName}</b> <b>{owner.lastName}</b> chce Ci przekazać
            </span>
          }
        </CardDescription>
      );
      footer = (
        <CardContent>
          <div className="ui two buttons">
            <Button basic color="green" onClick={() => alert("123")}>
              👌🏿 zaakceptuj
            </Button>
            <Button basic color="red" onClick={() => alert("321")}>
              <Icon name="x" />
              odrzuć
            </Button>
          </div>
        </CardContent>
      );
    } else {
      header = (
        <CardDescription>
          {
            <span>
              Wysłano prośbę do <b>{taker.firstName}</b> <b>{taker.lastName}</b>
            </span>
          }
        </CardDescription>
      );
      footer = (
        <CardContent>
          <div className="ui two buttons">
            <Button basic color="white" disabled>
              oczekiwanie
            </Button>
            <Button basic color="red" onClick={() => alert("5555")}>
              <Icon name="ban" />
              anuluj
            </Button>
          </div>
        </CardContent>
      );
    }

    return (
      <Card className={`requestRow ${this.props.fluid ? "row-fluid" : ""}`}>
        <CardContent>
          <p>{header}</p>
          <CardDescription className="requestResource">
            <Icon name="tag" />
            {`${resource.name}`}
          </CardDescription>
          <CardDescription
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Label style={{ backgroundColor: resource.room?.color }}>
              <Icon name="point" />
              {`${resource.room?.name || "brak pokoju"}`}
            </Label>
            <span style={{ marginTop: "auto", marginBottom: "auto" }}>
              <Icon name="stack overflow" /> x{resource.quantity}
            </span>
          </CardDescription>
          <CardDescription className="attributesPanel">
            {resource.attributes.length === 0 ? (
              <Label>brak atrybutów</Label>
            ) : (
              resource.attributes.map((x) => (
                <Label style={{ backgroundColor: x.color }}>{x.name}</Label>
              ))
            )}
          </CardDescription>
        </CardContent>
        {footer}
      </Card>
    );
  }
}
