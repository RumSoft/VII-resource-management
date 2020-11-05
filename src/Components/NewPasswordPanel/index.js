import React, { Component } from "react";
import { NotificationService, UserService } from "../../Services";
import { Redirect } from "react-router-dom";
import "./index.scss";

export default class NewPasswordPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            repeatedPassword: "",
            token: ""
        }
    }

    componentDidMount() {
        let URLToken = new URLSearchParams(window.location.search.toLowerCase()).get(
            "token"
        );
        this.setState({ token: URLToken });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handlePasswordReset() {
        const { password, repeatedPassword, token } = this.state;

        if (password === repeatedPassword) {
            UserService.NewPassword(token, password)
                .then((e) => {
                    NotificationService.success(`Ustawiono nowe hasło`);
                    this.setState({ redirect: true });
                }).catch((e) => {
                    NotificationService.apiError(e, "Nie udało się ustawić nowego hasła");
                });
        } else { NotificationService.warning("Hasła nie są jednakowe"); }
    }

    render() {
        if (this.state.redirect || this.state.token === null) {
            return <Redirect to="/dashboard" />
        }

        return (
            <div className="newpassword-form">
                <form onSubmit={(e) => this.handlePasswordReset(e)}>
                    <h2 className="text-center">Nowe hasło</h2>
                    <div className="form-group">
                        Podaj nowe hasło
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Podaj hasło"
                            value={this.state.password}
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        Powtórz hasło
                        <input
                            type="password"
                            className="form-control"
                            name="repeatedPassword"
                            placeholder="Powtórz hasło"
                            value={this.state.repeatedPassword}
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block" onClick={(e) => this.handlePasswordReset(e)}>
                            Zaktualizuj hasło
                        </button>
                    </div>
                </form>
            </div >
        )
    }
}