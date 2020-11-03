import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";
import UserManager from "../../Components/UserManager"

export default class AddUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    addUser(user) {
        console.log(user);
        UserService.AddUser({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        }).then((e) => {
            NotificationService.success(`Dodano użytkownika ${user.firstName} ${user.lastName} o adresie ${user.emailAddress}`);
            this.setState({ redirect: true });
        }).catch((e) => {
            NotificationService.apiError(e, "Nie udało się dodać użytkownika");
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/dashboard" />
        }

        return (
            <UserManager onSave={(user) => this.addUser(user)} />
        );
    }
}
