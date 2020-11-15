import React, { Component } from "react";
import { Link } from "react-router-dom";
//import { ResourceRow } from "../ListRows";
import { Button, Card, Grid, Icon } from "semantic-ui-react";
import {
  Events,
  EventService,
  NotificationService,
  RequestService,
  ResourceService,
} from "../../Services";
import CreateRequestModal from "../List/CreateRequestModal";
import { RequestRow, ResourceRow } from "../ListRows";
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

  resourceDeleted(resource) {
    ResourceService.deleteResource(resource.id)
      .then(() => {
        NotificationService.success(`Usunięto zasób ${resource.name}`);
        this.setState({
          resources: this.state.resources.filter((x) => x.id !== resource.id),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć zasobu");
      });
  }

  renderModal() {
    return (
      <CreateRequestModal
        isOpen={this.state.isModalOpen}
        onClose={() => this.setState({ isModalOpen: false })}
        onSuccess={() => EventService.Emit(Events.User_RequestAction)}
        resource={this.state.requestResource}
      />
    );
  }

  renderResourceList() {
    return (
      <div>
        <p>
          <h2>Twoje przedmioty</h2>
        </p>
        <ul className="user-resource-list">
          {this.state?.resources?.map((x) => (
            <li className="user-resource-list__item" key={x.id}>
              <ResourceRow
                fluid
                isAdmin={false}
                resource={x}
                onDelete={(resource) => this.resourceDeleted(resource)}
                onRequest={(resource) =>
                  this.setState({
                    isModalOpen: true,
                    requestResource: resource,
                  })
                }
              />
            </li>
          ))}
          <li className="user-resource-list__item" key={-1}>
            <Card as={Link} to="/resource/add" style={{ width: "100%" }}>
              <div
                style={{
                  margin: "auto",
                  width: "auto",
                  padding: "1rem",
                }}
              >
                <Button circular icon="add" color="green" />
                <h4>Dodaj przedmiot</h4>
              </div>
            </Card>
          </li>
        </ul>
      </div>
    );
  }

  renderRequestList() {
    return (
      <div>
        <p>
          <h2>Przekazania przedmiotów</h2>
        </p>

        <ul className="user-request-list">
          {this.state?.requests?.map((x) => (
            <li className="user-request-list__item" key={x.id}>
              <RequestRow
                fluid
                isAdmin={false}
                request={x}
                onDelete={(resource) => this.resourceDeleted(resource)}
                onRequest={(resource) =>
                  this.setState({
                    isModalOpen: true,
                    requestResource: resource,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderModal()}
        <p>Logged in as User.</p>
        <div className="container-fluid d-flex">
          <Grid divided={true}>
            <Grid.Column mobile={16} computer={10}>
              {this.renderResourceList()}
            </Grid.Column>
            <Grid.Column mobile={16} computer={6}>
              {this.renderRequestList()}
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}
