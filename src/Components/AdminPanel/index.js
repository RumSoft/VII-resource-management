import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import AttributeList from "../List/AttributeList";
import RoomList from "../List/RoomList";
import UserList from "../List/UserList";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <p> Logged in as Admin.</p>
        <div className="container-fluid d-flex">
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12} md={6} lg={3}>
              <AttributeList />
            </Grid>
            <Grid item sm={6} xs={12} md={6} lg={3}>
              <AttributeList />
            </Grid>
            <Grid item sm={4} xs={12} md={4} lg={2}>
              <UserList />
            </Grid>
            <Grid item sm={4} xs={6} md={4} lg={2}>
              <RoomList />
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
