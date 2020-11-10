import React, { Component } from "react";
import { ResourceService } from "../../Services";
import { ResourceRow } from "../ListRows";
import EntityList from "./EntityList";
import "./index.scss";

export default class ResourceList extends Component {
    state = {
        resources: [],
    };
    componentDidMount() {
        this.fetchResources();
    }

    fetchResources() {
        ResourceService.getList().then((result) => {
            const resources = result && result.data;
            this.setState({ resources });
        });
    }

    render() {
        const { resources } = this.state;

        return (
            <EntityList
                onReloadClick={() => this.fetchUsers()}
                onAddClick={() => {
                    window.location = "/resources/add";
                }}
                entities={resources}
                entityName="resources"
                entityMapFunc={(x) => (
                    <ResourceRow
                        key={x.id}
                        resource={x}
                    />
                )}
                title="Zasoby"
            />
        );
    }
}
