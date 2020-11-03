import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";
import UserManager from "../../Components/UserManager"

export default class AddUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "d912bda6-b413-4eb6-f953-08d8802fee4d",
            firstName: "testoweimie",
            lastName: "testowenazwisko",
            emailAddress: "testowymail",
            redirect: false
        };
    }

    editUser(user) {
        UserService.EditUser(this.state.id, {
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        }).then((e) => {
            NotificationService.success(`Zmieniono dane użytkownika ${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress} na ${user.firstName} ${user.lastName} o adresie ${user.emailAddress}`);
            this.setState({ redirect: true });
        }).catch((e) => {
            NotificationService.apiError(e, "Edycja użytkownika nie powiodła się");
        });
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to="/dashboard" />
        }
        let user = {
            id: this.state.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            emailAddress: this.state.emailAddress,
        }

        return <div>
            <UserManager onSave={(user) => this.editUser(user)} edit user={user} />
        </div>

    }

}