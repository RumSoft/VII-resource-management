import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ResourceManager from "../../Components/ResourceManager";
import { ResourceService, NotificationService } from "../../Services/";
import Title from "../Title";

import "./index.scss";

export default class AddResurcePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }
  addResource(res) {
    ResourceService.addResource(res)
      .then((response) => {
        NotificationService.success(`Dodano zasób ${res.name}`);
        this.setState({ redirect: true });
      })
      .catch((e) => {
        NotificationService.apiError(
          e,
          `Nie udało się dodać danych zasobu ${res.name}`
        );
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        } else {
          this.setState({ errors: {} });
        }
      });
  }

  render() {
    return (
      <>
        <Title>Dodaj zasób</Title>
        {this.state.redirect && <Redirect to="/dashboard" />}
        <ResourceManager
          onSave={(res) => this.addResource(res)}
          errors={this.state.errors}
        />
      </>
    );
  }
}
