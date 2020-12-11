import React, { Component } from "react";
import LoginPanel from "../../Components/LoginPanel";
import Title from "../Title";
import "./index.scss";

export default class LoginPage extends Component {
  render() {
    return (
      <>
        <Title>Logowanko</Title>
        <LoginPanel />;
      </>
    );
  }
}
