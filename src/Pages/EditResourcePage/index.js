import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ResourceManager from "../../Components/ResourceManager";
import ResourceService from "../../Services/ResourceService";

import "./index.scss";

export default class AddResurcePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            resource: null
        };
    }

    componentDidMount() {
        let id = new URLSearchParams(window.location.search.toLowerCase()).get(
            "resourceid"
        );
        console.log(id);
        ResourceService.getResource(id).then((res) => {
            this.setState({ resource: res.data });
        });
    }

    editResource(res) {
        //TodoL
    }
    render() {
        const { resource, redirect } = this.state;

        return <>
            {redirect && <Redirect to="/dashboard" />}
            { resource && (
                <ResourceManager onSave={(r) => this.editResource(r)} edit resource={resource} />
            )}
        </>
    }
}