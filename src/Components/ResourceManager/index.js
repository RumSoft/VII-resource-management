import React, { Component } from "react";
import "./index.scss";

export default class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   ...this.props.resource
        };
    }

    handleSave(e) {
        e.preventDefault();
        this.props.onSave(this.state)
    }

    render() {
        return <div className="usermanager-form">
            <h2>Resource manager</h2>
            <form onSubmit={(e) => this.handleSave(e)}>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">
                        Zapisz zasób
                        </button>
                </div>
            </form>
        </div>
    }
}