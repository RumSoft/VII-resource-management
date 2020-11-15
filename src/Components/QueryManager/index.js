import React, { Component } from "react";
import { Card, Table, Header, Form, Label, Dropdown } from "semantic-ui-react";
import { QueryService } from "../../Services";
import qs from "query-string";
import "./index.scss";
import ContentLoader from "react-content-loader";
import PdfRenderer from "../PdfRenderer";
import { withRouter } from "react-router-dom";

class QueryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entityList: null,
            type: null,
        };
    }

    componentDidMount() {
        const queryParams = qs.parse(window.location.search);
        this.setState({ name: queryParams.name });
        this.setState({ type: queryParams.type });
        this.fetchEntityList();
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit() {
        const { type, name, parentName } = this.state;
        let queryParams = qs.parse(window.location.search);
        queryParams["type"] = type === "" ? undefined : type;
        queryParams["name"] = name === "" ? undefined : name;
        queryParams["parentName"] = parentName === "" ? undefined : parentName;
        const stringified = qs.stringify(queryParams);
        this.props.history.push({
            search: stringified
        })
        this.fetchEntityList();
    }

    fetchEntityList() {
        QueryService.search(window.location.search).then((res) => {
            const entityList = res && res.data;
            this.setState({ entityList });
        });
    }

    columnConfiguration = {
        rooms: [
            {
                name: "ID",
                selector: (x) => x.id,
            },
            {
                name: "Nazwa",
                selector: (x) => x.name,
            },
            {
                name: "Ilość zasobów",
                selector: (x) => x.resourceCount,
            },
        ],
        attributes: [
            {
                name: "Nazwa",
                selector: (x) => x.name,
            },
            {
                name: "Ilość zasobów",
                selector: (x) => x.resourceCount,
            },
        ],
        users: [
            {
                name: "ID",
                selector: (x) => x.id.substring(0, x.id.indexOf('-')) + "...",
            },
            {
                name: "Imie",
                selector: (x) => x.firstName,
            },
            {
                name: "Nazwisko",
                selector: (x) => x.lastName,
            },
            {
                name: "Adres e-mail",
                selector: (x) => x.emailAddress,
            },
            {
                name: "Ostatnie logowanie",
                selector: (x) => x.lastLoginAt,
            },
            {
                name: "Data rejestracji",
                selector: (x) => x.registeredAt,
            },
            {
                name: "Ilość zasobów",
                selector: (x) => x.resourceCount,
            },
        ],
        resources: [
            {
                name: "ID",
                selector: (x) => x.id.substring(0, x.id.indexOf('-')) + "...",
            },
            {
                name: "Nazwa",
                selector: (x) => x.name,
            },
            {
                name: "Ilość",
                selector: (x) => x.quantity,
            },
            {
                name: "Właściciel",
                selector: (x) => x.owner.firstName + " " + x.owner.lastName,
            },
            {
                name: "E-mail",
                selector: (x) => x.owner.emailAddress,
            },
            {
                name: "Atrybuty",
                selector: (x) => x.attributes.length ? x.attributes.map(y => <Label style={{ backgroundColor: y.color }}>{y.name}</Label>) : <Label>brak atrybutów</Label>,
            },
            {
                name: "Pokój",
                selector: (x) => <Label style={{ backgroundColor: x.room && x.room.color }} > {`${x.room?.name || 'brak pokoju'}`}</Label >
            },
        ],
        traderequests: [
            {
                name: "Właściciel",
                selector: (x) => x.owner.firstName + " " + x.owner.lastName,
            },
            {
                name: "Odbiorca",
                selector: (x) => x.taker.firstName + " " + x.taker.lastName,
            },
            {
                name: "ID zasobu",
                selector: (x) => x.resource.id.substring(0, x.resource.id.indexOf('-')) + "...",
            },
            {
                name: "Nazwa",
                selector: (x) => x.resource.name,
            },
            {
                name: "Ilość",
                selector: (x) => x.resource.quantity,
            },
            {
                name: "Atrybuty",
                selector: (x) => x.resource.attributes.length ? x.resource.attributes.map(y => <Label style={{ backgroundColor: y.color }}>{y.name}</Label>) : <Label>brak atrybutów</Label>,
            },
            {
                name: "Pokój",
                selector: (x) => <Label style={{ backgroundColor: x.room && x.room.color }} > {`${x.resource.room?.name || 'brak pokoju'}`}</Label >
            },
        ],
    };

    headerConfiguration = {
        rooms: { name: "Pokoje" },
        attributes: { name: "Atrybuty" },
        users: { name: "Użytkownicy" },
        resources: { name: "Zasoby" },
        traderequests: { name: "Przekazanie" }
    }

    fieldsConfiguration = {
        rooms: { showParentTextfield: false },
        attributes: { showParentTextfield: false },
        users: { showParentTextfield: false },
        resources: { showParentTextfield: true },
        traderequests: { showParentTextfield: true }
    }
    renderLoading() {
        return (
            <Card fluid>
                <Card.Content>
                    <ContentLoader viewBox="0 0 100 20">
                        {Array(7)
                            .fill()
                            .map((_, i) => (
                                <rect x="1" y={i * 2 + 2} width="100" height="1" />
                            ))}
                    </ContentLoader>
                </Card.Content>
            </Card>
        );
    }

    renderNoData() {
        return (
            <Card fluid>
                <Card.Content>
                    <p>Brak danych</p>
                </Card.Content>
            </Card>
        );
    }

    renderContent(entityList, columns) {
        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        {columns &&
                            columns.map((x) => <Table.HeaderCell>{x.name}</Table.HeaderCell>)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {entityList.map((x) => (
                        <Table.Row>
                            {columns.map((y) => (
                                <Table.Cell>{y.selector(x)} </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }

    changeSearchParams(obj) {
        this.setState({ ...obj, entityList: null, name: "", parentName: "" }, () => {
            this.handleSubmit();
        });
    }

    render() {

        const { entityList, type } = this.state;
        const columns = this.columnConfiguration[type];
        const header = this.headerConfiguration[type];
        const content = this.renderContent(entityList || [], columns);
        const optionsArray = [
            { text: "użytkownicy", value: "users" },
            { text: "zasoby", value: "resources" },
            { text: "pokoje", value: "rooms" },
            { text: "atrybuty", value: "attributes" },
            { text: "przekazania", value: "traderequests" }];
        const fields = this.fieldsConfiguration[type];

        return (
            <>
                <Header as="h1">Wyszukiwanie i filtrowanie</Header>
                <Card className="query-search">
                    <Card.Content>
                        <Form widths="equal">
                            <Form.Group>
                                <Form.Input
                                    fluid
                                    label="Typ"
                                    input={<Dropdown
                                        fluid
                                        selection
                                        labeled
                                        placeholder="wybierz typ"
                                        value={this.state.type}
                                        options={optionsArray}
                                        onChange={(e, val) => {
                                            this.changeSearchParams({ type: val.value });
                                        }}
                                    />}
                                />
                                <Form.Input
                                    label="Nazwa"
                                    type="text"
                                    placeholder="nazwa"
                                    name="name"
                                    value={this.state.name}
                                    onChange={(e) => this.handleChange(e)}
                                />
                                {fields?.showParentTextfield &&
                                    < Form.Input
                                        label="Właściciel"
                                        type="text"
                                        placeholder="właściciel"
                                        name="parentName"
                                        value={this.state.parentName}
                                        onChange={(e) => this.handleChange(e)}
                                    />}
                                <Form.Button
                                    className="submit-button"
                                    label="Szukaj"
                                    onClick={() => this.handleSubmit()}
                                >
                                    Szukaj
                                </Form.Button>
                            </Form.Group>
                        </Form>
                    </Card.Content>
                </Card>

                {/* pdf download button */}
                {entityList && !!entityList.length && <PdfRenderer header={header.name} content={content} />}

                <Header as="h3">{header?.name}</Header>

                {/* content loader */}
                {!entityList && this.renderLoading()}

                {/* no data */}
                {entityList && !entityList.length && this.renderNoData()}

                {/* table with data*/}
                {entityList && !!entityList.length && content}
            </>
        );
    }
}
export default withRouter(QueryManager)