import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Grid } from "semantic-ui-react";
import { RequestRow, ResourceRow } from "../ListRows";
import "./ResourceRequestDashboard.scss";

export default class ResourceRequestDashboard extends Component {
  handleResourceDelete(resource) {
    this.props.onResourceDeleteClick &&
      this.props.onResourceDeleteClick(resource);
  }

  handleRequestSend(resource) {
    this.props.onTradeRequestClick && this.props.onTradeRequestClick(resource);
  }

  renderResourceList() {
    const { isAdmin } = this.props;
    return (
      <div>
        <h2>{isAdmin ? "Wszystkie przedmioty" : "Twoje przedmioty"}</h2>
        <ul className="resource-list">
          {this.props.resources?.map((x) => (
            <li className="resource-list__item" key={x.id}>
              <ResourceRow
                fluid
                resource={x}
                isAdmin={this.props.isAdmin}
                onDelete={(resource) => this.handleResourceDelete(resource)}
                onRequest={(resource) => this.handleRequestSend(resource)}
              />
            </li>
          ))}
          {!this.props.isAdmin && (
            <li className="resource-list__item" key={-1}>
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
          )}
        </ul>
      </div>
    );
  }

  renderRequestList() {
    return (
      <div>
        <h2>Przekazania przedmiotów</h2>

        <ul className="request-list">
          {this.props.requests?.map((x) => (
            <li className="request-list__item" key={x.id}>
              <RequestRow
                fluid
                isAdmin={false}
                request={x}
                onDelete={(resource) => this.handleResourceDelete(resource)}
                onRequest={(resource) => this.handleRequestSend(resource)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <Grid divided={true}>
        <Grid.Column mobile={16} computer={10}>
          {this.renderResourceList()}
        </Grid.Column>
        <Grid.Column mobile={16} computer={6}>
          {this.renderRequestList()}
        </Grid.Column>
      </Grid>
    );
  }
}
