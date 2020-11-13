import React, { Component } from "react";
import { Card, Table, Header, Form } from "semantic-ui-react";
import { QueryService } from "../../Services";
import qs from "query-string";
import "./index.scss";
import ContentLoader from "react-content-loader";
import PdfRenderer from "../PdfRenderer";

export default class QueryManager extends Component {
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

        QueryService.search(window.location.search).then((res) => {
            const entityList = res && res.data;
            this.setState({ entityList });
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let queryParams = qs.parse(window.location.search);
        queryParams["name"] = this.state.name === "" ? undefined : this.state.name;
        window.location.search = qs.stringify(queryParams);
    }

    columnConfiguration = {
        rooms: [
            {
                name: "Id",
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
    };

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

    render() {
        const { entityList, type } = this.state;
        console.log(entityList);
        const columns = this.columnConfiguration[type];
        const content = this.renderContent(entityList || [], columns);

        return (
            <>
                <Header as="h1">Wyszukiwanie i filtrowanie</Header>
                <Card className="query-search">
                    <Card.Content>
                        <Form widths="equal">
                            <Form.Group>
                                <Form.Input
                                    label="Nazwa"
                                    type="text"
                                    placeholder="nazwa"
                                    name="name"
                                    value={this.state.name}
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <Form.Button
                                    className="submit-button"
                                    label="Szukaj"
                                    onClick={(e) => this.handleSubmit(e)}
                                >
                                    Szukaj
                </Form.Button>
                            </Form.Group>
                        </Form>
                    </Card.Content>
                </Card>

                {/* pdf download button */}
                {entityList && !!entityList.length && <PdfRenderer content={content} />}

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
