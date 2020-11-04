import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CardContent, Card, Tooltip, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import ContentLoader from "react-content-loader";
import "./index.scss";

export default class EntityList extends Component {
  render() {
    const {
      onReloadClick,
      onAddClick,
      entities,
      onEntityDeleted,
      onEntityChanged,
      entityMapFunc,
      entityName,
      title,
    } = this.props;

    return (
      <Card className={`list ${entityName && "entityName-list"}`}>
        <CardContent>
          <div className="list__header">
            <Tooltip title="Odśwież listę">
              <IconButton color="primary" onClick={() => onReloadClick()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <div>
              <Link to={`/query?type=${entityName}`}>
                <h3 className="title">{title}</h3>
              </Link>
            </div>
            <Tooltip title="Dodaj">
              <IconButton color="primary" onClick={() => onAddClick()}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
          <hr />
        </CardContent>
        <CardContent>
          {entities && entities.length ? (
            entities.map((x) => entityMapFunc(x))
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
