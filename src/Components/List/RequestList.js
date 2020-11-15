import React, { Component } from "react";
import { Events, EventService, RequestService } from "../../Services";
import { RequestRow } from "../ListRows";
import EntityList from "./EntityList";
import "./index.scss";

export default class RequestList extends Component {
  constructor(props) {
    super(props);

    EventService.Subscribe(Events.User_RequestAction, () => {
      this.fetchRequests();
    });
  }

  state = {
    requests: [],
  };

  componentDidMount() {
    this.fetchRequests();
  }

  fetchRequests() {
    RequestService.getList().then((result) => {
      const requests = result && result.data;
      this.setState({ requests });
    });
  }

  render() {
    const { requests } = this.state;

    return (
      <EntityList
        onReloadClick={() => this.fetchRequests()}
        entities={requests}
        entityName="traderequests"
        entityMapFunc={(x) => <RequestRow fluid key={x.id} request={x} />}
        title="Przekazania"
      />
    );
  }
}
