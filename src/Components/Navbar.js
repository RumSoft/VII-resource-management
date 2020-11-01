import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../Services/AuthService";

export default class Navbar extends Component {
  logout() {
    localStorage.clear();

    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <ul class="nav-ul">
          <li class="nav-li">
            <Link class="nav-link" to="/">
              Home{" "}
            </Link>
          </li>
          <li class="nav-li">
            {!AuthService.checkIfLogged() && (
              <Link class="nav-link" to="/login">
                Login{" "}
              </Link>
            )}
          </li>
          <li class="nav-li">
            {AuthService.checkIfLogged() && (
              <Link class="nav-link" to="/test">
                Test{" "}
              </Link>
            )}
          </li>
          <li class="nav-li">
            {AuthService.checkIfLogged() && (
              <Link class="nav-link" to="/" onClick={() => this.logout()}>
                Logout
              </Link>
            )}
          </li>
        </ul>
      </div>
    );
  }
}
