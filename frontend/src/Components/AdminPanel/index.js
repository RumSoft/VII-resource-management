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
import "./index.scss";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleTab: 1,
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

  transition = {
    duration: 500,
    type1: "fade right",
    type2: "fade left",
  };

  showLeftCard() {
    this.setState({ visibleTab: 1 });
  }

  showRightCard() {
    this.setState({ visibleTab: 2 });
  }

  render() {
    const visible1 = this.state.visibleTab === 1;
    const visible2 = this.state.visibleTab === 2;
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
          <div style={{ position: "relative" }}>
            <Transition
              visible={visible1}
              animation={this.transition.type1}
              duration={this.transition.duration}
            >
              <div className="admin-panel-item">
                <ResourceRequestDashboard
                  isAdmin
                  requests={this.state.requests}
                  resources={this.state.resources}
                />
              </div>
            </Transition>
            <Transition
              visible={visible2}
              animation={this.transition.type2}
              duration={this.transition.duration}
            >
              <div className="admin-panel-item">
                <UserRoomAttributeDashboard
                  attributes={this.state.attributes}
                  rooms={this.state.rooms}
                  users={this.state.users}
                />
              </div>
            </Transition>
          </div>
        </div>
      </div>
    );
  }
}
