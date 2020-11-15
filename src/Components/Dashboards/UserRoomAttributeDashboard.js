import React, { Component } from "react";
import { Card, Grid } from "semantic-ui-react";
import { AttributeList, RoomList, UserList } from "../List";
import "./UserRoomAttributeDashboard.scss";

export default class UserRoomAttributeDashboard extends Component {
  render() {
    return (
      <Grid divided>
        <Grid.Column mobile={16} computer={6}>
          <Card fluid>
            <Card.Content>
              <h2>Użytkownicy</h2>
              <UserList users={this.props.users ?? []} />
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column mobile={16} computer={5}>
          <Card fluid>
            <Card.Content>
              <h2>Pokoje</h2>
              <RoomList rooms={this.props.rooms ?? []} />
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column mobile={16} computer={5}>
          <Card fluid>
            <Card.Content>
              <h2>Atrybuty</h2>
              <AttributeList attributes={this.props.attributes ?? []} />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}
