import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ResourceManager from "../../Components/ResourceManager";
import { ResourceService, NotificationService } from "../../Services/";

import "./index.scss";

export default class AddResurcePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }
    addResource(res) {
        ResourceService.addResource(res)
            .then((res) => {
                NotificationService.success(`Dodano zasób ${res.name}`);
                this.setState({ redirect: true });
            })
            .catch((e) => {
                NotificationService.apiError(e, `Nie udało się dodać danych zasobu ${res.name}`);
            })

    }

    render() {
        return <>
            {this.state.redirect && <Redirect to="/dashboard" />}
            <ResourceManager onSave={(res) => this.addResource(res)} />
        </>
    }
}