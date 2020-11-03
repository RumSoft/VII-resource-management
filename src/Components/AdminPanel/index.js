import React, { Component } from "react";
import { AttributeService, NotificationService } from "../../Services";
import { AttributeRow } from "../ListRows";
import {
  CardContent,
  Card,
  Box,
  CardHeader,
  Tooltip,
  Fab,
  IconButton,
  Grid,
} from "@material-ui/core";
import AttributeList from "../List/AttributeList";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
