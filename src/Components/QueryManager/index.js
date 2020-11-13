import React, { Component } from "react";
import { Card, Table, Header, Form } from "semantic-ui-react"
import { QueryService } from "../../Services"
import qs from "query-string";
import "./index.scss"

export default class QueryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entityList: [],
            type: null
        };
    }

    componentDidMount() {
        const queryParams = qs.parse(window.location.search);
        this.setState({ name: queryParams.name })
        this.setState({ type: queryParams.type })

        QueryService.search(window.location.search)
            .then((res) => {
                const entityList = res && res.data;
                console.log("POSZED REQUEST")
                this.setState({ entityList })
            })
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

    renderRow(x) {
        const { type } = this.state;
        console.log(x)
        return (
            <Table.Row key={x.id}>
                {type === "rooms" && <Table.Cell>{x.id}</Table.Cell>}
                {(type === "rooms" || type === "attributes") && <Table.Cell>{x.name}</Table.Cell>}
                {(type === "rooms" || type === "attributes") && <Table.Cell>{x.resourceCount}</Table.Cell>}
            </Table.Row>)
    }

    render() {
        const { entityList, type } = this.state;
        console.log(entityList)
        return (<>
            <Header as="h1">Wyszukiwanie i filtrowanie</Header>
            <Card className="query-search"  >
                <Card.Content>
                    <Form widths='equal'>
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

            <Table>
                <Table.Header>
                    <Table.Row>
                        {type === "rooms" && <Table.HeaderCell>ID</Table.HeaderCell>}
                        {(type === "rooms" || type === "attributes") && <Table.HeaderCell>Nazwa</Table.HeaderCell>}
                        {(type === "rooms" || type === "attributes") && <Table.HeaderCell>Ilość zasobów</Table.HeaderCell>}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {/* <Table.Row>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>Nazwa</Table.Cell>
                        <Table.Cell>420</Table.Cell>
                    </Table.Row> */}
                    {/* {console.log(entityList == [])} */}
                    {entityList && entityList.length ? entityList.map((x) => this.renderRow(x)) : <Table.Row><Table.Cell>BRAK DANYCH!!!!</Table.Cell></Table.Row>}
                </Table.Body>
            </Table>
            {/* {this.state.entityList && this.state.entityList.map(x => <span key={x.id}>{x.name}<br /></span>)} */}
        </>

        );
    }
}
