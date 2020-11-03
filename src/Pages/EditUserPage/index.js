import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";
import UserManager from "../../Components/UserManager"


export default class AddUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //...this.props.user,
            id: "d912bda6-b413-4eb6-f953-08d8802fee4d",
            firstName: "dd",
            lastName: "dd",
            emailAddress: "awdawdaw",
            redirect: false
        };
    }

    editUser(user) {
        console.log(user);
        //UserService.EditUser(this.state.user.id, {
        console.log(this.state.id)
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
            id: "d912bda6-b413-4eb6-f953-08d8802fee4d",
            firstName: "dd",
            lastName: "dd",
            emailAddress: "awdawdaw",
        }


        return <div>
            <UserManager onSave={(user) => this.editUser(user)} edit user={user} />
        </div>

    }

}