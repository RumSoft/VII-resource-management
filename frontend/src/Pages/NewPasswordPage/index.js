import React, { Component } from "react";
import NewPasswordPanel from "../../Components/NewPasswordPanel";
import Title from "../Title";
import "./index.scss";
const authTokenKey = "auth_token";
const roleKey = "role";

export default class NewPasswordPage extends Component {
  constructor(props) {
    super(props);
    window.localStorage.removeItem(authTokenKey);
    window.localStorage.removeItem(roleKey);
  }

  render() {
    return (
      <>
        <Title>Nowe hasło</Title>
        <NewPasswordPanel />
      </>
    );
  }
}
