import React, { Component } from "react";
import { Button, Divider, Transition } from "semantic-ui-react";
import {
  AttributeService,
  Events,
  EventService,
  RequestService,
  ResourceService,
  RoomService,
  UserService,
} from "../../Services";
import ResourceRequestDashboard from "../Dashboards/ResourceRequestDashboard";
import UserRoomAttributeDashboard from "../Dashboards/UserRoomAttributeDashboard";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleTab: 0,
    };

    EventService.Subscribe(Events.Dashboard_ReloadRooms, () =>
      this.fetchRooms()
    );
    EventService.Subscribe(Events.Dashboard_ReloadAttributes, () => {
      this.fetchAttributes();
    });
    EventService.Subscribe(Events.Dashboard_ReloadUsers, () => {
      this.fetchUsers();
    });
  }

  componentDidMount() {
    this.fetchRequests();
    this.fetchResources();
    this.fetchRooms();
    this.fetchUsers();
    this.fetchAttributes();
  }

  //#region fetches
  fetchRequests() {
    RequestService.getList().then((res) => {
      this.setState({ requests: res.data });
    });
  }

  fetchResources() {
    ResourceService.getList().then((res) => {
      this.setState({ resources: res.data });
    });
  }

  fetchRooms() {
    RoomService.getList().then((res) => {
      this.setState({ rooms: res.data });
    });
  }

  fetchUsers() {
    UserService.getList().then((res) => {
      this.setState({ users: res.data });
    });
  }

  fetchAttributes() {
    AttributeService.getList().then((res) => {
      this.setState({ attributes: res.data });
    });
  }
  //#endregion

  showLeftCard() {
    if (this.state.visibleTab !== 0) {
      this.setState({ visibleTab: 1 }, () => {
        this.setState({ visibleTab: 0 });
      }); //cos nie dziala XD
    }
  }

  showRightCard() {
    if (this.state.visibleTab !== 2) {
      this.setState({ visibleTab: 1 }, () => {
        this.setState({ visibleTab: 2 });
      }); //cos nie dziala XD
    }
  }

  render() {
    return (
      <div>
        <p>Zalogowano jako administrator</p>
        <div className="container-fluid d-flex">
          <Button onClick={() => this.showLeftCard()}>
            1 Przedmioty oraz przekazania przedmiotów
          </Button>
          <Button onClick={() => this.showRightCard()}>
            2 Użytkownicy, pokoje oraz atrybuty
          </Button>
          <Divider />
          <Transition.Group animation="fade right" duration={500}>
            {this.state.visibleTab === 0 && (
              <ResourceRequestDashboard
                isAdmin
                requests={this.state.requests}
                resources={this.state.resources}
              />
            )}
            {this.state.visibleTab === 2 && (
              <UserRoomAttributeDashboard
                attributes={this.state.attributes}
                rooms={this.state.rooms}
                users={this.state.users}
              />
            )}
          </Transition.Group>
        </div>
      </div>
    );
  }
}
