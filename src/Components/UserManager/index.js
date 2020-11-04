import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";

import "./index.scss";

export default class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.user
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
        UserService.ResetPassword(this.state.id)
            .then((e) => {
                NotificationService.success(`Zresetowano hasło użytkownika ${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress}`);
                this.setState({ redirect: true });
            }).catch((e) => {
                NotificationService.apiError(e, "Nie udało się zresetować hasła");
            });

    }

    handleDelete() {
        if (window.confirm(`Czy usunąć użytkownika ${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress} ?`)) {
            UserService.DeleteUser(this.state.id)
                .then((e) => {
                    NotificationService.success(`Usunięto użytkownika ${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress}`);
                    this.setState({ redirect: true });
                }).catch((e) => {
                    NotificationService.apiError(e, "Nie udało się usunąć użytkownika");
                });
        }
    }

    render() {
        const isEdit = this.props.edit;
        let deleteAndResetButton;
        if (isEdit === true) {
            deleteAndResetButton = <>
                <div className="form-group">
                    <button type="button" className="btn btn-warning btn-block" onClick={() => this.handleReset()}>
                        Przypomnij hasło
        </button>
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-danger btn-block" onClick={() => this.handleDelete()}>
                        Usuń użytkownika
                    </button>
                </div>
            </>
        }
        if (this.state.redirect) {
            return <Redirect to="/dashboard" />
        }

        return (
            <div className="usermanager-form">
                <form onSubmit={(e) => this.handleSave(e)}>
                    <h2 className="text-center">{isEdit === true ? "Edytowanie" : "Dodawanie"} użytkownika</h2>
                    <div className="form-group">
                        Imię
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            placeholder="imię"
                            value={this.state.firstName}
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        Nazwisko
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="nazwisko"
                            value={this.state.lastName}
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        Adres email
                        <input
                            type="text"
                            className="form-control"
                            name="emailAddress"
                            placeholder="e-mail"
                            value={this.state.emailAddress}
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block">
                            {isEdit === true ? "Zapisz" : "Dodaj"} użytkownika
                        </button>
                    </div>
                    {deleteAndResetButton}

                </form>


            </div >
        )
    }
}
