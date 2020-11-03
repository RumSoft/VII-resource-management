import React, { Component } from "react";
import { AttributeRow } from "../ListRows";
import {
  CardContent,
  Card,
  Box,
  CardHeader,
  Tooltip,
  Fab,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import "./index.scss";
import { AttributeService } from "../../Services";

export default class AttributeList extends Component {
  state = {
    attributes: [],
  };
  componentDidMount() {
    this.fetchAttributes();
  }

  fetchAttributes() {
    AttributeService.getList().then((result) => {
      const attributes = result && result.data;
      this.setState({ attributes });
    });
  }

  attributeChanged(attr) {
    this.setState({
      attributes: this.state.attributes.map((x) => {
        if (x.id === attr.id) x.name = attr.name;
        return x;
      }),
    });
  }

  attributeDeleted(id) {
    this.setState({
      attributes: this.state.attributes.filter((x) => x.id !== id),
    });
  }

  render() {
    const { attributes } = this.state;
    return (
      <Card className="list attribute-list" style={{ maxWidth: "400px" }}>
        <CardContent>
          <div className="list__header">
            <Tooltip title="Odśwież listę">
              <IconButton
                color="primary"
                onClick={() => this.fetchAttributes()}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <div>
              <h3 className="title">Atrybuty</h3>
            </div>
            <Tooltip title="Dodaj atrybut">
              <IconButton
                color="primary"
                onClick={() => this.addAttributeClick()}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
          <hr />
        </CardContent>
        <CardContent>
          {attributes &&
            attributes.map((x) => (
              <AttributeRow
                onDelete={(id) => this.attributeDeleted(id)}
                onChange={(attr) => this.attributeChanged(attr)}
                key={x.id}
                data={x}
              />
            ))}
        </CardContent>
      </Card>
    );
  }
}
