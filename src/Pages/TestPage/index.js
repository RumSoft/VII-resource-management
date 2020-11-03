import React, { Component } from "react";
import APIService from "../../Services/APIService";
import "./index.scss";

export default class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: [],
    };
  }

  componentDidMount() {
    APIService.get("Attribute/list").then((result) => {
      const attributes = (result && result.data) || [];
      this.setState({ attributes });
    });
  }

  render() {
    return (
      <div>
        <h1>Test</h1>
        <ul>
          {this.state.attributes.map((att, i) => (
            <li key={att.id}>
              {att.id}: {att.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
