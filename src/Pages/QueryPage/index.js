import React, { Component } from "react";

export default class QueryPage extends Component {
  render() {
    return (
      <div>
        query <b>{window.location.search}</b>, todo work in progress
      </div>
    );
  }
}
