import React, { Component } from "react";

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
          Dodaj przedmiot
          </button>
      </div>
    )
  };
}