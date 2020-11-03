import React, { Component } from "react";
import UserPanel from "../../Components/UserPanel";
import AdminPanel from "../../Components/AdminPanel";
import { AuthService, Events, EventService } from "../../Services";
import "./index.scss";

const role = "role";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
    };
  }

  componentDidMount() {
    this.setState({ role: window.localStorage.getItem(role) });
    if (!AuthService.isLogged()) EventService.Emit(Events.Auth_Unauthorized);
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        {this.state.role === "User" && <UserPanel />}
        {this.state.role === "Admin" && <AdminPanel />}
      </div>
    );
  }
}
