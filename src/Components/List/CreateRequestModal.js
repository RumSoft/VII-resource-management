import React, { Component } from "react";
import { UserService, RequestService, NotificationService } from "../../Services";
import { Modal, Button, Grid, Form, Radio } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import "./index.scss";

export default class CreateRequestModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUser: null,
            splitquantity: null
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

    sendRequest() {
        const sentQuantity = this.state.splitquantity ?? this.props.resource.quantity;
        RequestService.addRequest({
            resourceId: this.props.resource.id,
            takerId: this.state.selectedUser.id,
            quantity: sentQuantity
        }).then(() => {
            NotificationService.success(`Wysłano zasób ${this.props.resource.name} w ilości ${sentQuantity}`);
            this.props.onSuccess();
        }).catch((e) => {
            NotificationService.apiError(e, "Nie udało się wysłać zasobu");
        })
    }

    handleClosing() {
        this.setState({ splitquantity: null, selectedUser: null })
        this.props.onClose();
    }

    render() {
        const { isOpen, resource } = this.props;
        const startingquantity = resource?.quantity;
        return (
            <Modal open={isOpen} closeOnDocumentClick={true} onClose={() => this.handleClosing()}>
                <Modal.Header>Tutaj będzie Trade Request</Modal.Header>
                <Modal.Content>
                    <Grid columns="2">
                        <Grid.Column>
                            <div> Tutaj będzie komponent Przemka</div>
                            <div className="quantity-slider">
                                <label>Ilość: <b>{this.state?.splitquantity || startingquantity}</b></label>
                                {startingquantity > 1 &&
                                    <Slider
                                        color="blue"
                                        discrete
                                        settings={{
                                            start: startingquantity,
                                            min: 1,
                                            max: startingquantity,
                                            step: 1,
                                            onChange: value => { this.setState({ splitquantity: value }) }
                                        }}
                                    />
                                }
                            </div>
                        </Grid.Column>

                        <Grid.Column>
                            <Form>
                                <Form.Field>
                                    {this.state.selectedUser
                                        ? <span>Wybrano użytkownika: <b> {this.state.selectedUser.firstName} {this.state.selectedUser.lastName}</b></span>
                                        : "Wybierz użytkownika"}
                                </Form.Field>
                                <Form.Field>
                                    {this.state.users.filter((x) => x.id !== resource?.owner.id).map(x =>
                                        <Radio
                                            key={x.id}
                                            name="selectedUser"
                                            checked={this.state.selectedUser === x}
                                            label={`${x.firstName} ${x.lastName} ${x.emailAddress}`}
                                            onChange={() => this.setState({ selectedUser: x })}
                                        />
                                    )}
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => this.handleClosing()}>
                        Anuluj
        </Button>
                    <Button
                        content="Wyślij"
                        disabled={this.state.selectedUser === null}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => { this.sendRequest(); this.handleClosing(); }}
                        positive
                    />
                </Modal.Actions>
            </Modal >
        )
    }
}