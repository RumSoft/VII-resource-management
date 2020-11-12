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

  render() {
    return (
      <Sidebar.Pushable
        as={Segment}
        style={{ minHeight: "100vh", border: "none", borderRadius: "0" }}
      >
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={true}
          width="thin"
          className="flex-container"
        >
          {/* todo icons */}
          <Menu.Item as={Link} to="/">
            <Icon name="gamepad" />
            Home
          </Menu.Item>

          <Menu.Item as={Link} to="/dashboard">
            <Icon name="gamepad" />
            Panel
          </Menu.Item>
          {AuthService.isAdmin() && (
            <Menu.Item as={Link} to="/logs">
              <Icon name="gamepad" />
              Logi
            </Menu.Item>
          )}

          <div className="bottom-aligned">
            {this.state.isLogged ? (
              <Menu.Item
                as="a"
                to="/logout"
                onClick={() => AuthService.logout()}
                className="bottom-aligned"
              >
                <Icon name="gamepad" />
                Wyloguj
              </Menu.Item>
            ) : (
              <Menu.Item as={Link} to="/login">
                <Icon name="gamepad" />
                Zaloguj
              </Menu.Item>
            )}
          </div>
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic>{this.props.content}</Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
