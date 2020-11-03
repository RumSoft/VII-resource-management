import React, { Component } from "react";
import { Link } from "react-router-dom";
import { EventService } from "../../Services";
import AuthService from "../../Services/AuthService";
import Events from "../../Services/Events";
import "./index.scss";

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
    const isLogged = this.state.isLogged;
    return (
      <nav className="navbar navbar-expand-sm bg-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              Zarządzanie
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/test" className="nav-link">
              Test
            </Link>
          </li>
          {isLogged ? (
            <li className="nav-item">
              <Link
                to="/#"
                className="nav-link"
                onClick={() => AuthService.logout()}
              >
                Logout
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    );
  }
}
