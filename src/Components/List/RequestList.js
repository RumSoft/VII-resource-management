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

    onAction(request) {
        RequestService.editRequest(request)
            .then(() => {
                NotificationService.success(`Zmodyfikowano żądanie`);
            })
            .catch((e) => {
                NotificationService.apiError(e, "Nie udało się zmodyfikować żądania");
            });
    }

    render() {
        const { requests } = this.state;

        return (
            <EntityList
                onReloadClick={() => this.fetchRequests()}
                onAddClick={() => {
                    window.location = "/request/add";
                }}
                entities={requests}
                entityName="requests"
                entityMapFunc={(x) => (
                    <RequestRow
                        onDelete={console.log("ad")}
                        onChange={console.log("xd")}
                        key={x.id}
                        request={x}
                    />
                )}
                title="Przekazania"
            />
        );
    }
}
