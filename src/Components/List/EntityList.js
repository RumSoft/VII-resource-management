import React, { Component } from "react";
import { Link } from "react-router-dom";
import ContentLoader from "react-content-loader";
import classNames from "classnames";
import "./index.scss";
import { Button, Card } from "semantic-ui-react";

export default class EntityList extends Component {
  renderHeader() {
    const { onReloadClick, onAddClick, entityName, title } = this.props;

    return (
      <div className="list__header">
        <div className={classNames({ transparent: !onReloadClick })}>
          <Button circular icon="refresh" onClick={() => onReloadClick()} />
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
          <Button
            circular
            icon="add"
            color="green"
            onClick={() => onAddClick()}
          />
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
      <Card fluid className={`list ${entityName && "entityName-list"}`}>
        <Card.Content>{this.renderHeader()}</Card.Content>
        <Card.Content>{this.renderContent()}</Card.Content>
      </Card>
    );
  }
}
