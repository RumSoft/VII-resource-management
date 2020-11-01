import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import TestPage from "./Pages/TestPage";
import ErrorPage from "./Pages/ErrorPage";
import Navbar from "./Components/Navbar";

class App extends Component {
  render() {
    return (
      <main>
        <Navbar />
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/login" component={LoginPage} />
          <Route path="/test" component={TestPage} />
          <Route component={ErrorPage} />
        </Switch>
      </main>
    );
  }
}

export default App;
