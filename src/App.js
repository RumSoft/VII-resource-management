import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Redirector from "./Redirector";
import {
  Dashboard,
  ErrorPage,
  HomePage,
  LoginPage,
  TestPage,
  AddUserPage,
  EditUserPage,
  NewPasswordPage,
  AddResourcePage,
  EditResourcePage,
} from "./Pages";

import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./Components/Navbar";

class App extends Component {
  renderRouting() {
    return (
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/login" component={LoginPage} />
        <Route path="/newPassword" component={NewPasswordPage} />
        <Route path="/test" component={TestPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/user/add" component={AddUserPage} />
        <Route path="/user/edit" component={EditUserPage} />
        <Route path="/resource/add" component={AddResourcePage} />
        <Route path="/resource/edit" component={EditResourcePage} />
        <Route component={ErrorPage} />
      </Switch>
    );
  }

  render() {
    return (
      <main>
        <ToastContainer />
        <Redirector />
        <Navbar content={this.renderRouting()} />
      </main>
    );
  }
}

export default App;
