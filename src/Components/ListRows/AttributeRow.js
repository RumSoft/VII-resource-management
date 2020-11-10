import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
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
    const { id, name } = this.props.attribute;
    return (
      <div className="list-row">
        <div className="list-row__content">{name}</div>
        <div className="list-row__actions">
          <Button
            circular
            as={Link}
            to={`/attribute/edit?attributeId=${id}`}
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
