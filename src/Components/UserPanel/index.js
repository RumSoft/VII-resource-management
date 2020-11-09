import React, { Component } from "react";
//import { ResourceRow } from "../ListRows";
import ResourceServise from "../../Services/ResourceService";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: []
    };
  }

  componentDidMount() {
    ResourceServise.getList()
      .then((res) => {
        this.setState({ resources: res.data });
      });
  }

  handleEdit() {
    window.location = "/resource/edit?resourceId=34096198-9fd0-4b24-2d42-08d88440dd3b";
  }

  addResource() {
    window.location = "/resource/add";
  }

  render() {
    //  console.log(this.state.resources);

    return (
      <div>
        <p> Logged in as User.</p>
        {this.state.resources.map((x) => {
          return <div key={x.id} >
            {x.id} - {x.name} - {x.quantity} - {x.room === null ? "POKÓJ==NULL" : x.room.name}: {x.attributes.map((x) => { return `"${x.name}",` })}
            <button type="button" onClick={() => this.handleDelete()}>
              X
            </button>
            < br />
          </div>
        })
        }
        <button onClick={() => this.addResource()}>
          Dodaj zasób
          </button>
        <button onClick={() => this.handleEdit()}>
          Edytuj zasób (temp)
            </button>
      </div >
    )
  };
}