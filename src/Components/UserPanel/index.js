import React, { Component } from "react";
import { ResourceRow } from "../ListRows";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addResource() {
    window.location = "/resource/add";
  }

  render() {
    return (
      <div>
        <p> Logged in as User.</p>
        <button onClick={() => this.addResource()}>
          Dodaj zasób
          </button>
      </div>
    )
  };
}