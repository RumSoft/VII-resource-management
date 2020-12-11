import React, { Component } from "react";
import Title from "../Title";
import "./index.scss";

export default class ErrorPage extends Component {
  render() {
    return (
      <>
        <Title>Błędzik</Title>
        <h1>Strony nie odnaleziono!</h1>
      </>
    );
  }
}
