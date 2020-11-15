import React, { Component } from "react";
import {
  Events,
  EventService,
  NotificationService,
  RequestService,
  ResourceService,
} from "../../Services";
import ResourceRequestDashboard from "../Dashboards/ResourceRequestDashboard";
import CreateRequestModal from "./CreateRequestModal";
import "./index.scss";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      requests: [],
    };

    EventService.Subscribe(Events.User_RequestAction, () => {
      this.fetchResources();
      this.fetchRequests();
    });
  }

  componentDidMount() {
    this.fetchResources();
    this.fetchRequests();
  }

  fetchRequests() {
    RequestService.getList().then((res) => {
      this.setState({ requests: res.data });
    });
  }

  fetchResources() {
    ResourceService.getList().then((res) => {
      this.setState({ resources: res.data });
    });
  }

  handleResourceDelete(resource) {
    ResourceService.deleteResource(resource.id)
      .then(() => {
        NotificationService.success(`Usunięto zasób ${resource.name}`);
        this.fetchResources();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć zasobu");
      });
  }

  handleCreateRequest(resource) {
    this.setState({
      isModalOpen: true,
      requestResource: resource,
    });
  }

  renderRequestModal() {
    return (
      <CreateRequestModal
        isOpen={this.state.isModalOpen}
        onClose={() => this.setState({ isModalOpen: false })}
        onSuccess={() => EventService.Emit(Events.User_RequestAction)}
        resource={this.state.requestResource}
      />
    );
  }

  render() {
    return (
      <div>
        <p>Zalogowano jako użytkownik</p>
        {this.renderRequestModal()}
        <ResourceRequestDashboard
          isAdmin={false}
          resources={this.state.resources}
          requests={this.state.requests}
          onResourceDeleteClick={(res) => this.handleResourceDelete(res)}
          onTradeRequestClick={(res) => this.handleCreateRequest(res)}
        />
      </div>
    );
  }
}
