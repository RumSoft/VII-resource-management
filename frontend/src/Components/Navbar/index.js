import React, { Component } from "react";
import { Link } from "react-router-dom";
import { EventService } from "../../Services";
import AuthService from "../../Services/AuthService";
import Events from "../../Services/Events";
import "./index.scss";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: AuthService.isLogged(),
    };

    EventService.Subscribe(Events.Auth_Login, () => {
      this.setState({ isLogged: true });
    });

    EventService.Subscribe(Events.Auth_Logout, () => {
      this.setState({ isLogged: false });
    });
  }

  renderTopMenu() {
    return (
      <>
        <Menu.Item as={Link} to="/">
          <Icon name="home" />
          Home
        </Menu.Item>

        <Menu.Item as={Link} to="/dashboard">
          <Icon name="columns" />
          Panel
        </Menu.Item>
        {AuthService.isAdmin() && <>
          <Menu.Item as={Link} to="/query">
            <Icon name="search" />
          Wyszukiwanie
        </Menu.Item>

          <Menu.Item as={Link} to="/logs">
            <Icon name="bug" />
            Logi
          </Menu.Item>
        </>}


      </>
    );
  }

  renderBottomMenu() {
    return (
      <>
        {this.state.isLogged ? (
          <Menu.Item
            as="a"
            to="/logout"
            onClick={() => AuthService.logout()}
            className="bottom-aligned"
          >
            <Icon name="sign-out" />
            Wyloguj
          </Menu.Item>
        ) : (
            <Menu.Item as={Link} to="/login">
              <Icon name="sign-in" />
            Zaloguj
            </Menu.Item>
          )}
      </>
    );
  }

  render() {
    return (
      <Sidebar.Pushable
        as={Segment}
        style={{
          minHeight: "100vh",
          border: "none",
          borderRadius: "0",
        }}
      >
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={true}
          width="thin"
          className="sidebar-menu"
        >
          <div className="top-aligned">{this.renderTopMenu()}</div>
          <div className="bottom-aligned">{this.renderBottomMenu()}</div>
        </Sidebar>
        <Sidebar.Pusher style={{ overflow: "unset" }}>
          <Segment basic style={{ position: "relative" }}>
            {this.props.content}
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
