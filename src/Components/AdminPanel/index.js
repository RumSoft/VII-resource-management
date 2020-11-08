import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { AttributeList, RoomList, UserList } from "../List";

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
          <Grid>
            <Grid.Column mobile={16} tablet={8} computer={3}>
              <AttributeList />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <AttributeList />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={5} computer={3}>
              <UserList />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={6} computer={3}>
              <RoomList />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={5} computer={3}>
              <AttributeList />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}
