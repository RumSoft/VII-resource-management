import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";

import "./index.scss";

export default class AddUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            emailAddress: ""
        };
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        UserService.AddUser({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            emailAddress: this.state.emailAddress
        }).then((e) => {
            NotificationService.success(`Dodano użytkownika "${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress}"`);
        }).catch((e) => {
            NotificationService.apiError(e, "Nie udało się dodać użytkownika");
        });

    }
    render() {
        return (

            <div className="adduser-form">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <h2 className="text-center">Dodawanie użytkownika</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            placeholder="imię"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="nazwisko"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="emailAddress"
                            placeholder="e-mail"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block">
                            Dodaj użytkownika
                        </button>
                    </div>
                </form>
            </div>

        );
    }
}
