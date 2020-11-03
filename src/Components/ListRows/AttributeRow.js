import React, { Component } from "react";
import { NotificationService } from "../../Services";
import AttributeService from "../../Services/AttributeService";
import "./AttributeRow.scss";

export default class AttributeRow extends Component {
  handleEditClick() {
    const { name, id } = this.props.data;

    let newAttributeName = prompt("Podaj nową nazwę atrybutu.", name);

    if (newAttributeName !== null) {
      AttributeService.editAttribute(id, newAttributeName)
        .then(() => {
          NotificationService.success(
            `Pomyślnie zmieniono nazwę atrybutu`,
            `${name} → ${newAttributeName}`
          );
        })
        .catch((e) => {
          NotificationService.apiError(e, "Nie udało się edytować atrybutu");
        });
    }
  }

  handleDeleteClick() {
    const { id, name } = this.props.data;
    AttributeService.deleteAttribute(id)
      .then((res) => {
        NotificationService.info(`Usunięto atrybut ${name}`);
        this.props.onDelete && this.props.onDelete(id);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć atrybutu");
      });
  }

  render() {
    const { name, id } = this.props.data;
    return (
      <div>
        {id}&gt; {name}
        <button onClick={() => this.handleEditClick()}>Edytuj</button>
        <button onClick={() => this.handleDeleteClick()}>Usuń</button>
      </div>
    );
  }
}
