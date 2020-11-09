import React, { Component } from "react";
//import { ResourceRow } from "../ListRows";
import { Grid } from "semantic-ui-react";
import { RequestList, ResourceList } from "../List";

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
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <ResourceList />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <RequestList />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    )
  };
}