import React, { Component } from "react";
import { AttributeService, NotificationService, RoomService } from "../../Services";
import { AttributeRow, RoomRow } from "../ListRows";
import { CardContent, Card, Box } from "@material-ui/core";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: [],
      rooms: [],
    };
  }

  componentDidMount() {
    this.fetchAttributes();
    this.fetchRooms();
  }

  fetchAttributes() {
    AttributeService.getList().then((result) => {
      const attributes = result && result.data;
      this.setState({ attributes });
    });
  }

  fetchRooms() {
    RoomService.getList().then((result) => {
      const rooms = result && result.data;
      this.setState({ rooms });
    });
  }

  attributeChanged(attr) {
    this.setState({
      attributes: this.state.attributes.map((x) => {
        if (x.id === attr.id) x.name = attr.name;
        return x;
      }),
    });
  }

  roomChanged(room) {
    this.setState({
      rooms: this.state.rooms.map((x) => {
        if (x.id === room.id) x.name = room.name;
        return x;
      }),
    });
  }

  attributeDeleted(id) {
    this.setState({
      attributes: this.state.attributes.filter((x) => x.id !== id),
    });
  }

  roomDeleted(id) {
    this.setState({
      rooms: this.state.rooms.filter((x) => x.id !== id),
    });
  }

  addAttributeClick(e) {
    let attributeName = prompt("Podaj nazwę nowego atrybutu");
    if (!attributeName) return;

    AttributeService.addAttribute(attributeName)
      .then(() => {
        NotificationService.success(`Dodano atrybut "${attributeName}"`);
        this.fetchAttributes();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać atrybutu");
      });
  }

  addRoomClick(e) {
    let roomName = prompt("Podaj nazwę nowego pokoju");
    if (!roomName) return;

    RoomService.addRoom(roomName)
      .then(() => {
        NotificationService.success(`Dodano pokój "${roomName}"`);
        this.fetchAttributes();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać pokoju");
      });
  }

  render() {
    return (
      <div>
        <p> Logged in as Admin.</p>
        <div class="container-fluid d-flex">
          <Box m={1}>
            <Card>
              {" "}
              <CardContent>
                {this.state.attributes.map((x) => (
                  <AttributeRow
                    onDelete={(id) => this.attributeDeleted(id)}
                    onChange={(attr) => this.attributeChanged(attr)}
                    key={x.id}
                    data={x}
                  />
                ))}
                <button onClick={() => this.addAttributeClick()}>
                  Dodaj atrybut
                </button>
              </CardContent>
            </Card>
          </Box>
          <Box m={1}>
            <Card>
              <CardContent>
                {this.state.rooms.map((x) => (
                  <RoomRow
                    onDelete={(id) => this.roomDeleted(id)}
                    onChange={(room) => this.roomChanged(room)}
                    key={x.id}
                    data={x}
                  />
                ))}
                <button onClick={() => this.addRoomClick()}>
                  Dodaj pokój
                </button>
              </CardContent>
            </Card>
          </Box>
        </div>
      </div>
    );
  }
}
