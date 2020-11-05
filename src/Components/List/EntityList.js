import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CardContent, Card, Tooltip, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import ContentLoader from "react-content-loader";
import classNames from "classnames";
import "./index.scss";

export default class EntityList extends Component {
  renderHeader() {
    const { onReloadClick, onAddClick, entityName, title } = this.props;

    return (
      <div className="list__header">
        <div className={classNames({ transparent: !onReloadClick })}>
          <Tooltip title="Odśwież listę">
            <IconButton color="primary" onClick={() => onReloadClick()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div>
          {entityName ? (
            <Link to={`/query?type=${entityName}`}>
              <h3 className="title">{title}</h3>
            </Link>
          ) : (
            <h3 className="title">{title}</h3>
          )}
        </div>
        <div className={classNames({ transparent: !onAddClick })}>
          <Tooltip title="Dodaj">
            <IconButton color="primary" onClick={() => onAddClick()}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    );
  }

  renderContent() {
    const { entities, entityMapFunc } = this.props;

    if (entities && entities.length)
      if (entityMapFunc) return entities.map((x) => entityMapFunc(x));
      else throw "no entityMapFunc prop passed into EntityList component!";

    return (
      <ContentLoader viewBox="0 0 100 70">
        {Array(7)
          .fill()
          .map((_, i) => (
            <rect x="0" y={i * 10} rx="0" ry="0" width="100" height="7" />
          ))}
      </ContentLoader>
    );
  }

  render() {
    const { entityName } = this.props;

    return (
      <Card className={`list ${entityName && "entityName-list"}`}>
        <CardContent>
          {this.renderHeader()}
          <hr />
        </CardContent>
        <CardContent>{this.renderContent()}</CardContent>
      </Card>
    );
  }
}
