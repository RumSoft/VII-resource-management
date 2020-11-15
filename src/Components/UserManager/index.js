import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";
import { Card, Form, Button, Confirm, Label } from 'semantic-ui-react'

import "./index.scss";

export default class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.user,
            isDeleteDialogOpen: false
        };
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSave(e) {
        e.preventDefault();
        this.props.onSave(this.state)
    }

    handleReset() {
        UserService.resetPassword(this.state.id)
            .then((e) => {
                NotificationService.success(`Zresetowano hasło użytkownika ${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress}`);
                this.setState({ redirect: true });
            }).catch((e) => {
                NotificationService.apiError(e, "Nie udało się zresetować hasła");
            });
    }

    handleDelete() {
        UserService.deleteUser(this.state.id)
            .then((e) => {
                NotificationService.success(`Usunięto użytkownika ${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress}`);
                this.setState({ redirect: true });
            }).catch((e) => {
                NotificationService.apiError(e, "Nie udało się usunąć użytkownika");
            });
    }

    render() {
        const isEdit = this.props.edit;
        const errors = this.props.errors ?? {};
        console.log(errors)
        let deleteAndResetButton;
        if (isEdit === true) {
            deleteAndResetButton = <>
                <Button
                    fluid
                    color="yellow"
                    onClick={() => this.handleReset()}
                >
                    Przypomnij hasło
                </Button>
                <Button
                    fluid
                    color="red"
                    onClick={() => this.setState({ isDeleteDialogOpen: true })}
                >
                    Usuń użytkownika
                </Button>
            </>
        }
        if (this.state.redirect) {
            return <Redirect to="/dashboard" />
        }

        return (<>
            < Confirm
                className="confirmDialog"
                size="mini"
                open={this.state.isDeleteDialogOpen}
                onCancel={() => this.setState({ isDeleteDialogOpen: !this.state.isDeleteDialogOpen })}
                onConfirm={() => this.handleDelete()}
                content={(`Czy usunąć użytkownika ${this.props.user?.firstName} ${this.props.user?.lastName} ?`)}
                cancelButton="Nie"
                confirmButton="Tak"
            />
            <Card className="usermanager-form">
                <Card.Content>
                    <Card.Header as="h1">
                        {isEdit === true ? "Edytowanie" : "Dodawanie"} użytkownika
                </Card.Header>
                </Card.Content>

                <Card.Content>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                        <Form.Input
                            label="Imię"
                            fluid
                            submit
                            type="text"
                            name="firstName"
                            placeholder="imię"
                            value={this.state.firstName}
                            onChange={(e) => this.handleChange(e)}
                        />
                        {errors["FirstName"] && (
                            <Label
                                className="errorMessage"
                                basic color="red" pointing>
                                {errors["FirstName"][0]}
                            </Label>
                        )}
                        <Form.Input
                            label="Nazwisko"
                            fluid
                            submit
                            type="text"
                            name="lastName"
                            placeholder="nazwisko"
                            value={this.state.lastName}
                            onChange={(e) => this.handleChange(e)}
                        />
                        {errors["LastName"] && (
                            <Label
                                className="errorMessage"
                                basic color="red" pointing>
                                {errors["LastName"][0]}
                            </Label>
                        )}
                        <Form.Input
                            label="Adres e-mail"
                            fluid
                            submit
                            type="text"
                            name="emailAddress"
                            placeholder="e-mail"
                            value={this.state.emailAddress}
                            onChange={(e) => this.handleChange(e)}
                        />
                        {errors["EmailAddress"] && (
                            <Label
                                className="errorMessage"
                                basic color="red" pointing>
                                {errors["EmailAddress"][0]}
                            </Label>
                        )}
                        <Button
                            style={{ display: "none" }} //super hack xD
                            color="green"
                            type="submit"
                            onClick={(e) => this.handleSave(e)}
                        />
                    </Form>
                </Card.Content>

                <Card.Content>
                    <Button
                        fluid
                        color="green"
                        type="submit"
                        onClick={(e) => this.handleSave(e)}
                    >
                        {isEdit === true ? "Zapisz" : "Dodaj"} użytkownika
                </Button>
                    {deleteAndResetButton}
                </Card.Content>
            </Card>
        </>
        )
    }
}