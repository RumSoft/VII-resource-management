import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "./AttributeRow.scss";

export default class AttributeRow extends Component {
  handleEditClick() {
    this.props.onChange && this.props.onChange(this.props.attribute);
    // const { name, id } = this.props.attribute;
    // const newAttributeName = prompt("Podaj nową nazwę atrybutu.", name);
    // newAttributeName &&
    //   this.props.onChange &&
    //   this.props.onChange({ id: id, name: newAttributeName });
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
          <Button
            circular
            onClick={() => this.handleEditClick()}
            icon="edit"
            color="blue"
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
