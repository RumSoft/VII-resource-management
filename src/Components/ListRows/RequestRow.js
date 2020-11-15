import React, { Component } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  Icon,
  Label,
} from "semantic-ui-react";
import {
  Events,
  EventService,
  NotificationService,
  RequestService,
} from "../../Services";
import "./RequestRow.scss";

export default class RequestRow extends Component {
  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.request);
  }

  actions = {
    cancel: {
      id: 0,
      successText:
        "Anulowano prośbę o przekazanie przedmiotu. Przedmiot powrócił do Twojej listy zasobów",
      failedText: "Nie udało się anulować prośby o przekazanie przedmiotu",
    },
    accept: {
      id: 1,
      successText:
        "Zaakceptowano prośbę o przekazanie przedmiotu. Możesz teraz go znaleźć liście swoich zasobów",
      failedText: "Nie udało się zaakceptować prośby o przekazanie przedmiotu",
    },
    decline: {
      id: 2,
      successText:
        "Anulowano prośbę o przekazanie przedmiotu. Przedmiot powrócił do właściciela",
      failedText: "Nie udało się anulować prośby o przekazanie przedmiotu",
    },
  };

  requestAction(actionName) {
    const action = this.actions[actionName];

    RequestService.editRequest({ id: this.props.request.id, action: action.id })
      .then((res) => {
        EventService.Emit(Events.User_RequestAction);
        NotificationService.success(action.successText);
      })
      .catch((res) => {
        NotificationService.error(res, action.failedText);
      });
  }

  render() {
    const { userInfo, taker, owner, resource } = this.props.request;

    let isOther = !userInfo.isTaker && !userInfo.isOwner;
    let header = "";
    let footer = "";

    if (isOther) {
      header = (
        <CardDescription>
          <span>
            <b>{owner.firstName}</b> <b>{owner.lastName}</b> chce przekazać{" "}
            <b>{taker.firstName}</b> <b>{taker.lastName}</b>
          </span>
        </CardDescription>
      );
    } else if (userInfo.isTaker) {
      header = (
        <CardDescription>
          <span>
            <b>{owner.firstName}</b> <b>{owner.lastName}</b> chce Ci przekazać
          </span>
        </CardDescription>
      );
      footer = (
        <CardContent>
          <div className="ui two buttons">
            <Button
              basic
              color="green"
              onClick={() => this.requestAction("accept")}
            >
              👌🏿 zaakceptuj
            </Button>
            <Button
              basic
              color="red"
              onClick={() => this.requestAction("decline")}
            >
              <Icon name="x" />
              odrzuć
            </Button>
          </div>
        </CardContent>
      );
    } else {
      header = (
        <CardDescription>
          <span>
            Wysłano prośbę do <b>{taker.firstName}</b> <b>{taker.lastName}</b>
          </span>
        </CardDescription>
      );
      footer = (
        <CardContent>
          <div className="ui two buttons">
            <Button basic disabled>
              oczekiwanie
            </Button>
            <Button
              basic
              color="red"
              onClick={() => this.requestAction("cancel")}
            >
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
          <div>{header}</div>
          <CardDescription className="requestResource">
            <Icon name="tag" />
            {resource.name}
          </CardDescription>
          <CardDescription
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Label style={{ backgroundColor: resource.room?.color }}>
              <Icon name="point" />
              {resource.room?.name || "brak pokoju"}
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
                <Label key={x.id} style={{ backgroundColor: x.color }}>
                  {x.name}
                </Label>
              ))
            )}
          </CardDescription>
        </CardContent>
        {footer}
      </Card>
    );
  }
}
