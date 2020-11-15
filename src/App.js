import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
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
  QueryPage,
  AboutPage,
} from "./Pages";

import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./Components/Navbar";
import LogViewPage from "./Pages/LogViewPage";
import { Events, EventService } from "./Services";
import { Loader } from "semantic-ui-react";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
    };

    EventService.Subscribe(Events.API_RequestStarted, () => {
      this.setState({ isBusy: true });
    });
    EventService.Subscribe(Events.API_RequestEnded, () => {
      this.setState({ isBusy: false });
    });
  }

  renderRequestLoading() {
    return (
      <div className="busy-indicator">
        <Loader active>Wczytywanko</Loader>
      </div>
    );
  }

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
        <Route path="/logs" component={LogViewPage} />
        <Route path="/query" component={QueryPage} />
        <Route path="/about" component={AboutPage} />
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
        {this.state.isBusy && this.renderRequestLoading()}
      </main>
    );
  }
}

export default App;
