import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ResourceManager from "../../Components/ResourceManager";
import ResourceServise from "../../Services/ResourceService";

import "./index.scss";

export default class AddResurcePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }
    addResource(res) {
        ResourceServise.addResource(res.name, res.quantity, res.attributes, res.room)
            .then((res) => {
                console.log(`Res added!\nName: ${res.name} Room: ${res.room} Quantity: ${res.quantity} Attributes: ${res.attributes}\nPass it to ResourceController.addResource`);
                this.setState({ redirect: true });
            })
            .catch((e) => {
                console.log(e.response);
            })

    }

    render() {
        return <>
            {this.state.redirect && <Redirect to="/dashboard" />}
            <ResourceManager onSave={(res) => this.addResource(res)} />
        </>
    }
}