import React, { Component } from "react";
//import { ResourceRow } from "../ListRows";
import { Grid } from "semantic-ui-react";
import { RequestList, ResourceList } from "../List";
import { RequestService, ResourceService } from "../../Services";
import { RequestRow, ResourceRow } from "../ListRows";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      requests: [],
    };
  }

  componentDidMount() {
    ResourceService.getList().then((res) => {
      this.setState({ resources: res.data });
    });
    RequestService.getList().then((res) => {
      this.setState({ requests: res.data });
    });
  }

  render() {
    return (
      <div>
        <p> Logged in as User.</p>
        <div className="container-fluid d-flex">
          <Grid>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Grid doubling stackable columns={3}>
                {this.state?.resources?.map((x) => (
                  <Grid.Column mobile={8}>
                    <ResourceRow fluid resource={x} />
                  </Grid.Column>
                ))}
              </Grid>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Grid doubling stackable columns={3}>
                {this.state?.requests?.map((x) => (
                  <Grid.Column>
                    <RequestRow fluid request={x} />
                  </Grid.Column>
                ))}
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}
