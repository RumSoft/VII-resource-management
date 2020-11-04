import React, { Component } from "react";
import { NotificationService } from "../../Services";
import { Grid } from "@material-ui/core";
import AttributeList from "../List/AttributeList";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    return (
      <div>
        <p> Logged in as Admin.</p>
        <div class="container-fluid d-flex">
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12} md={6} lg={3}>
              <AttributeList />
            </Grid>
            <Grid item sm={6} xs={12} md={6} lg={3}>
              <AttributeList />
            </Grid>
            <Grid item sm={4} xs={12} md={4} lg={2}>
              <AttributeList />
            </Grid>
            <Grid item sm={4} xs={6} md={4} lg={2}>
              <AttributeList />
            </Grid>
            <Grid item sm={4} xs={6} md={4} lg={2}>
              <AttributeList />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}
