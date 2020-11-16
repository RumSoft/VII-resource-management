import React, { Component } from "react";
import QueryManager from "../../Components/QueryManager";
import Title from "../Title";

export default class QueryPage extends Component {
  render() {
    return (
      <>
        <Title>Wyszukiwanko</Title>
        <QueryManager />
      </>
    );
  }
}
