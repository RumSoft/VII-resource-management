import React, { Component } from "react";
//import { ResourceRow } from "../ListRows";
import { Grid } from "semantic-ui-react";
import RequestList from "../List/RequestList"
import RequestService from "../../Services/RequestService";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    return (
      <div>
        <p> Logged in as User.</p>
        <div className="container-fluid d-flex">
          <Grid>
            <Grid.Column mobile={16} tablet={8} computer={3}>
              <RequestList />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    )
  };
}