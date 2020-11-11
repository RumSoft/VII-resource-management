import React, { Component } from "react";
import { ResourceService, NotificationService } from "../../Services";
import { ResourceRow } from "../ListRows";
import EntityList from "./EntityList";
import "./index.scss";
import CreateRequestModal from "./CreateRequestModal"

export default class ResourceList extends Component {
    state = {
        resources: [],
        isModalOpen: false
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

    resourceDeleted(resource) {
        ResourceService.deleteResource(resource.id)
            .then(() => {
                NotificationService.success(`Usunięto zasób ${resource.name}`);
                this.setState({
                    resource: this.state.resource.filter((x) => x.id !== resource.id),
                });
            })
            .catch((e) => {
                NotificationService.apiError(e, "Nie udało się usunąć zasobu");
            });
    }

    resourceChanged(resource) {
        window.location = `/resource/edit?resourceId=${resource.id}`;
    }

    render() {
        const { resources } = this.state;

        return (<>
            <CreateRequestModal
                isOpen={this.state.isModalOpen}
                onClose={() => this.setState({ isModalOpen: false })}
                onSuccess={() => this.fetchResources()}
                resource={this.state.requestResource}
            />

            <EntityList
                onReloadClick={() => this.fetchResources()}
                onAddClick={() => {
                    window.location = "/resource/add";
                }}
                entities={resources}
                entityName="resources"
                entityMapFunc={(x) => (
                    <ResourceRow
                        onDelete={(resource) => this.resourceDeleted(resource)}
                        onChange={(resource) => this.resourceChanged(resource)}
                        onRequest={(resource) => this.setState({ isModalOpen: true, requestResource: resource })}
                        key={x.id}
                        resource={x}
                    />
                )}
                title="Zasoby"
            /></>
        );
    }
}
