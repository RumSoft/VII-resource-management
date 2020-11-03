import { Tooltip } from "@material-ui/core";
import React, { Component } from "react";
import "./AttributeRow.scss";

export default class AttributeRow extends Component {
  handleEditClick() {
    const { name, id } = this.props.attribute;
    const newAttributeName = prompt("Podaj nową nazwę atrybutu.", name);
    newAttributeName &&
      this.props.onChange &&
      this.props.onChange({ id: id, name: newAttributeName });
  }

  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.attribute);
  }

  render() {
    const { name } = this.props.attribute;
    return (
      <div className="list-row">
        <div className="list-row__content">{name}</div>
        <div className="list-row__actions">
          <Tooltip title="Edytuj">
            <button
              className="list-row__actions__edit"
              onClick={() => this.handleEditClick()}
            >
              E
            </button>
          </Tooltip>
          <Tooltip title="Usuń">
            <button
              className="list-row__actions__delete"
              onClick={() => this.handleDeleteClick()}
            >
              X
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }
}
