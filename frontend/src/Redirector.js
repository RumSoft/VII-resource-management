import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { EventService, NotificationService } from "./Services";
import Events from "./Services/Events";

export default class Redirector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectUrl: "",
    };

    this.config = {
      redirectParam: "requested_url",
      loginPage: "/login",
    };

    EventService.Subscribe(Events.Auth_Login, () => this._handleLogin());
    EventService.Subscribe(Events.Auth_Logout, () => this._handleLogout());
    EventService.Subscribe(Events.Auth_Unauthorized, () =>
      this._handleUnauthorized()
    );
    EventService.Subscribe(Events.Redirect, (url) => this._handleRedirect(url));
  }

  render() {
    const redirect = this.state.redirectUrl;
    return <>{redirect && <Redirect to={redirect} />}</>;
  }

  _handleLogin() {
    const params = new URLSearchParams(window.location.search);
    const requestedURL = params.get(this.config.redirectParam);
    this._setUrl(requestedURL || "/");
    NotificationService.success("Zalogowano");
  }

  _handleLogout() {
    this._setUrl("/");
    NotificationService.success("Wylogowano");
  }

  _handleUnauthorized() {
    const { search, pathname } = window.location;
    const link = pathname + search;
    const url = `${this.config.loginPage}?${this.config.redirectParam}=${link}`;
    this._setUrl(url);

    NotificationService.close("login-required");
    NotificationService.info(
      "Wymagane logowanie",
      "Zaloguj się aby zobaczyć żądaną stronę",
      { toastId: "login-required" }
    );
  }

  _handleRedirect(url) {
    this._setUrl(url);
  }

  _setUrl(url) {
    this.setState({ redirectUrl: "" }, () => {
      this.setState({ redirectUrl: url });
    }); // hack to force reload
  }
}
