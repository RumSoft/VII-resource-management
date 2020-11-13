import React, { Component } from "react";
import { Card, Table, Header, Form } from "semantic-ui-react"
import { QueryService } from "../../Services"
import qs from "query-string";
import "./index.scss"

export default class QueryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryParams: null,
            entityList: null
        };
    }

    componentDidMount() {
        const queryParams = qs.parse(window.location.search);
        this.setState({ queryParams })

        switch (queryParams.type) {
            case "rooms": {
                console.log("Wybrano pokoje")
            }
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let qp = this.state.queryParams
        console.log(qp)
        qp["name"] = this.state.name
        console.log(qp);

        const stringified = qs.stringify(qp);

        console.log(stringified)
        // let params = qs.parse(window.location.search);
        // params.name = this.state?.nameQuery;
        // console.log(params)
        // QueryService.search(window.location.search)
        //     .then((res) => {
        //         const entityList = res && res.data;
        //         this.setState({ entityList })
        //     })


    }

    render() {
        return (<>
            <Header as="h1">Wyszukiwanie i filtrowanie</Header>
            <Card className="query-search"  >
                <Card.Content>
                    {/* <Grid columns={2} stretched > */}
                    <Form widths='equal'>
                        {/* <Grid.Column > */}
                        <Form.Group>
                            <Form.Input

                                label="Nazwa"
                                type="text"
                                placeholder="nazwa"
                                name="name"
                                value={this.state.name}
                                onChange={(e) => this.handleChange(e)}
                            />
                            {/* </Grid.Column> */}

                            {/* <Grid.Column  > */}
                            <Form.Button
                                className="submit-button"
                                label="Szukaj"
                                onClick={(e) => this.handleSubmit(e)}
                            >
                                Szukaj
                        </Form.Button>
                        </Form.Group>
                        {/* </Grid.Column> */}
                    </Form>
                    {/* </Grid> */}
                </Card.Content>
            </Card>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Nazwa</Table.HeaderCell>
                        <Table.HeaderCell>Ilość zasobów</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>Nazwa</Table.Cell>
                        <Table.Cell>420</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            {this.state.entityList && this.state.entityList.map(x => <span key={x.id}>{x.name}<br /></span>)}
        </>

        );
    }
}
