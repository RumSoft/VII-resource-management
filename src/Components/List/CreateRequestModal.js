import React, { Component } from "react";
import { UserService } from "../../Services";
import { Modal, Button, Grid, Form, Radio } from "semantic-ui-react";
import "./index.scss";

export default class CreateRequestModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers() {
        UserService.getList().then((result) => {
            const users = result && result.data;
            this.setState({ users });
        });
    }

    render() {

        const { isOpen } = this.props;
        return (
            <Modal open={isOpen} closeOnDocumentClick={true} onClose={() => { this.props.onClose() }}>
                <Modal.Header>Tutaj będzie Trade Request</Modal.Header>
                {/* <Modal.Content>
                <Input
                    type="text"
                    name="newName"
                    placeholder="nowa nazwa"
                    value={this.state.newName}
                    onChange={(e) => this.handleChange(e)}
                />
            </Modal.Content> */}
                <Modal.Content>
                    <Grid columns="2">
                        <Grid.Column>
                            <div> Tutaj będzie komponent Przemka</div>
                            <div>A tutaj suwak</div>
                        </Grid.Column>

                        <Grid.Column>
                            Tutaj będzie userlist
                            <Form>
                                <Form.Field>
                                    Selected user: <b>{this.state.selectedUser}</b>
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => { this.props.onClose() }}>
                        Anuluj
        </Button>
                    <Button
                        content="XD"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => { this.props.onClose() }}
                        positive
                    />
                </Modal.Actions>
            </Modal >
        )
    }
}