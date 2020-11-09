import React, { Component } from "react";
import { NotificationService, RequestService } from "../../Services";
import { RequestRow } from "../ListRows";
import EntityList from "./EntityList";
import "./index.scss";

export default class RequestList extends Component {
    state = {
        requests: [],
    };
    componentDidMount() {
        this.fetchRequests();
    }

    fetchRequests() {
        RequestService.getList().then((result) => {
            const requests = result && result.data;
            this.setState({ requests });
        });
    }

    addRequestClick() {
        let resourceId = prompt("Podaj id zasobu");
        let takerId = prompt("Podaj id odbiorcy");
        let quantity = prompt("Podaj ilość zasobu, którą chcesz przekazać")
        if (!resourceId || !takerId || !quantity) return;

        RequestService.addRequest(resourceId, takerId, quantity)
            .then(() => {
                NotificationService.success(`Dodano przekazanie zasobu o id "${resourceId}" w ilości "${quantity}" użytkownikowi o id "${takerId}"`);
                this.fetchRequests();
            })
            .catch((e) => {
                NotificationService.apiError(e, "Nie udało się dodać przekazania zasobu");
            });
    }

    requestChanged(request, action) {
        RequestService.editRequest(request.id, action)
            .then(() => {
                NotificationService.success(
                    `Pomyślnie zmieniono tryb przekazania zasobu o id`,
                    ` → ${request.id}`
                );
                /* stricte nic sie nie zmienia, wiec nie ma sensu albo ja jestem glupi
                 this.setState({
                   requests: this.state.requests.map((x) => {
                     if (x.id === room.id) x.name = room.name;
                     return x;
                   }),
                 }); */
            })
            .catch((e) => {
                NotificationService.apiError(e, "Nie udało się zmienić trybu przekazania zasobu");
            });
    }

    render() {
        const { requests } = this.state;
        return (
            <EntityList
                onReloadClick={() => this.fetchRequests()}
                onAddClick={() => this.addRequestClick()}
                entities={requests}
                entityName="requests"
                entityMapFunc={(x) => (
                    <RequestRow
                        onChange={(request) => this.requestChanged(request)}
                        key={x.id}
                        request={x}
                    />
                )}
                title="Przekazania"
            />
        );
    }
}
