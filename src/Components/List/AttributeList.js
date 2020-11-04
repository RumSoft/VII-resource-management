import React, { Component } from "react";
import { AttributeRow } from "../ListRows";
import { AttributeService, NotificationService } from "../../Services";
import EntityList from "./EntityList";
import "./index.scss";

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

  addAttributeClick() {
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
      .then(() => {
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
      <EntityList
        onReloadClick={() => this.fetchAttributes()}
        onAddClick={() => this.addAttributeClick()}
        entities={attributes}
        entityName="attributes"
        entityMapFunc={(x) => (
          <AttributeRow
            onDelete={(attr) => this.attributeDeleted(attr)}
            onChange={(attr) => this.attributeChanged(attr)}
            key={x.id}
            attribute={x}
          />
        )}
        title="Atrybuty"
      />
    );
  }
}
