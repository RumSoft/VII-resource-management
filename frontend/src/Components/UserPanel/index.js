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
import { Confirm } from "semantic-ui-react"
import "./index.scss";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      requests: [],
      isDeleteDialogOpen: false
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
      })
      .finally(() => this.setState({ isDeleteDialogOpen: false }));
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

  renderConfirm() {
    return (
      <Confirm
        className="confirmDialog"
        size="mini"
        open={this.state.isDeleteDialogOpen}
        onCancel={() =>
          this.setState({
            isDeleteDialogOpen: !this.state.isDeleteDialogOpen,
          })
        }
        onConfirm={() =>
          this.handleResourceDelete(this.state.passedRes)
        }
        content={`Czy usunąć zasób ${this.state.passedRes?.name}?`}
        cancelButton="Nie"
        confirmButton="Tak"
      />
    );
  }

  render() {
    return (
      <div>
        <p>Zalogowano jako użytkownik</p>
        {this.renderRequestModal()}
        {this.renderConfirm()}
        <ResourceRequestDashboard
          isAdmin={false}
          resources={this.state.resources}
          requests={this.state.requests}
          onResourceDeleteClick={(res) => this.setState({ isDeleteDialogOpen: true, passedRes: res })}
          onTradeRequestClick={(res) => this.handleCreateRequest(res)}
        />
      </div>
    );
  }
}
