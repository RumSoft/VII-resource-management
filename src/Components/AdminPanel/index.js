import React, { Component } from "react";
import { AttributeService, NotificationService, RoomService, UserService } from "../../Services";
import { AttributeRow, RoomRow, UserRow } from "../ListRows";
import { CardContent, Card, Box } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: [],
      rooms: [],
      users: [],

    };
  }

  componentDidMount() {
    this.fetchAttributes();
    this.fetchRooms();
    this.fetchUsers();
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

  fetchUsers() {
    UserService.getList().then((result) => {
      const users = result && result.data;
      this.setState({ users });
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

  userChanged(user) {
    this.setState({
      users: this.state.users.map((x) => {
        if (x.id === user.id) x.name = user.name;
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

  userDeleted(id) {
    this.setState({
      users: this.state.users.filter((x) => x.id !== id),
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
        this.fetchRooms();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać pokoju");
      });
  }

  addUserClick(e) {
    let userFirstName = prompt("Podaj imię użytkownika");
    let userLastName = prompt("Podaj nazwisko użytkownika");
    let userAddressEmail = prompt("Podaj adres email użytkownikaa");
    if (!userFirstName || !userLastName || !userAddressEmail) return;

    UserService.addUser(userFirstName, userLastName, userAddressEmail)
      .then(() => {
        NotificationService.success(`Dodano użytkownika "${userFirstName}" "${userLastName}" o adresie "${userAddressEmail}"`);
        this.fetchUsers();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać uzytkownika");
      });
  }

  render() {
    return (
      <div>
        <p> Logged in as Admin.</p>
        <div className="container-fluid d-flex">
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
          <Box m={1}>
            <Card>
              <CardContent>
                {this.state.users.map((x) => (
                  <UserRow
                    onDelete={(id) => this.userDeleted(id)}
                    onChange={(user) => this.userChanged(user)}
                    key={x.id}
                    data={x}
                  />
                ))}
                <button onClick={() => this.addUserClick()}>
                  Dodaj użytkownika
                </button>
              </CardContent>
            </Card>
          </Box>
        </div>
        <Link to="/user/add" >
          <button>Dodaj usera</button>
        </Link>
        <Link to="/user/edit" >
          <button>Edytuj usera (temp)</button>
        </Link>
      </div>
    );
  }
}
