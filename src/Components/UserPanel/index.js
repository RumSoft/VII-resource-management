import React, { Component } from "react";
//import { ResourceRow } from "../ListRows";
import { Grid } from "semantic-ui-react";
import { RequestList, ResourceList } from "../List";
import { ResourceService } from "../../Services";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: []
    };
  }

  componentDidMount() {
    ResourceService.getList()
      .then((res) => {
        this.setState({ resources: res.data });
      });
  }

  handleEdit() {
    window.location = "/resource/edit?resourceId=4a784cb1-5340-4b60-fd1d-08d884f6727c";
  }

  addResource() {
    window.location = "/resource/add";
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