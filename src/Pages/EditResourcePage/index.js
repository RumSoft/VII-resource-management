import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ResourceManager from "../../Components/ResourceManager";
import { ResourceService, NotificationService } from "../../Services";
import Title from "../Title";

import "./index.scss";

export default class AddResurcePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      resource: null,
    };
  }

  componentDidMount() {
    let id = new URLSearchParams(window.location.search.toLowerCase()).get(
      "resourceid"
    );
    ResourceService.getResource(id).then((res) => {
      this.setState({ resource: res.data });
    });
  }

  editResource(res) {
    ResourceService.editResource(res)
      .then(() => {
        NotificationService.success(`Zmieniono dane zasobu ${res.name}`);
        this.setState({ redirect: true });
      })
      .catch((e) => {
        NotificationService.apiError(
          e,
          `Nie udało się zmienić danych zasobu ${res.name}`
        );
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        } else {
          this.setState({ errors: {} });
        }
      });
  }

  splitResource(res) {
    ResourceService.splitResource(res)
      .then(() => {
        NotificationService.success(
          `Zmieniono część danych zasobu ${res.name}`
        );
        this.setState({ redirect: true });
      })
      .catch((e) => {
        NotificationService.apiError(
          e,
          `Nie udało się zmienić części danych zasobu ${res.name}`
        );
      });
  }

  render() {
    const { resource, redirect } = this.state;

    return (
      <>
        <Title>Edytuj zasób</Title>
        {redirect && <Redirect to="/dashboard" />}
        {resource && (
          <ResourceManager
            onSave={(r, split) =>
              split ? this.splitResource(r) : this.editResource(r)
            }
            edit
            resource={resource}
            errors={this.state.errors}
          />
        )}
      </>
    );
  }
}
