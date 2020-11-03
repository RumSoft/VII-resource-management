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
  Skeleton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import "./index.scss";
import { AttributeService, NotificationService } from "../../Services";
import ContentLoader from "react-content-loader";
import { Link } from "react-router-dom";

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

  addAttributeClick(e) {
    let attributeName = prompt("Podaj nazwę nowego atrybutu");
    if (!attributeName) return;

    AttributeService.addAttribute(attributeName)
      .then(() => {
        NotificationService.success(`Dodano atrybut "${attributeName}"`);
        this.fetchAttributes();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać atrybutu");
      });
  }

  attributeChanged(attr) {
    AttributeService.editAttribute(attr.id, attr.name)
      .then(() => {
        NotificationService.success(
          `Pomyślnie zmieniono nazwę atrybutu`,
          ` → ${attr.name}`
        );
        this.setState({
          attributes: this.state.attributes.map((x) => {
            if (x.id === attr.id) x.name = attr.name;
            return x;
          }),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się edytować atrybutu");
      });
  }

  attributeDeleted(attr) {
    AttributeService.deleteAttribute(attr.id)
      .then((res) => {
        NotificationService.success(`Usunięto atrybut ${attr.name}`);
        this.setState({
          attributes: this.state.attributes.filter((x) => x.id !== attr.id),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć atrybutu");
      });
  }

  render() {
    const { attributes } = this.state;
    return (
      <Card className="list attribute-list">
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
              <Link to="/query?type=attributes">
                <h3 className="title">Atrybuty</h3>
              </Link>
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
          {attributes && attributes.length ? (
            attributes.map((x) => (
              <AttributeRow
                onDelete={(id) => this.attributeDeleted(id)}
                onChange={(attr) => this.attributeChanged(attr)}
                key={x.id}
                attribute={x}
              />
            ))
          ) : (
            <ContentLoader viewBox="0 0 100 70">
              {Array(7)
                .fill()
                .map((_, i) => (
                  <rect x="0" y={i * 10} rx="0" ry="0" width="100" height="7" />
                ))}
            </ContentLoader>
          )}
        </CardContent>
      </Card>
    );
  }
}
