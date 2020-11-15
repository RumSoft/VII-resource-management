import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "./AttributeRow.scss";

export default class AttributeRow extends Component {
  handleEditClick() {
    this.props.onChange && this.props.onChange(this.props.attribute);
  }

  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.attribute);
  }

  render() {
    const { name, color } = this.props.attribute;
    return (
      <div className="list-row" style={{ backgroundColor: color }}>
        <div className="list-row__content">{name}</div>
        <div className="list-row__actions">
          <Button
            circular
            onClick={() => this.handleEditClick()}
            icon="edit"
            color="yellow"
          />
          <Button
            circular
            onClick={() => this.handleDeleteClick()}
            icon="delete"
            color="red"
          />
        </div>
      </div>
    );
  }
}
