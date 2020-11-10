import React, { Component } from "react";
import { AttributeRow } from "../ListRows";
import { AttributeService, NotificationService } from "../../Services";
import EntityList from "./EntityList";
import { Modal, Button, Input } from 'semantic-ui-react';
import "./index.scss";

export default class AttributeList extends Component {
  state = {
    attributes: null,
    isModalOpen: false,
    addOrEdit: null, // 0 = add, 1 = edit
    newName: ""
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  addAttributeClick() {
    AttributeService.addAttribute(this.state.newName)
      .then(() => {
        NotificationService.success(`Dodano atrybut "${this.state.newName}"`);
        this.fetchAttributes();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać atrybutu");
      }).finally(() => this.setState({ newName: "" }));
  }

  handleAttributeChanged(attr) {
    this.setState({ isModalOpen: true, addOrEdit: true, editedAttribute: attr, newName: attr.name })
  }

  attributeChanged() {
    let attr = this.state.editedAttribute;
    attr.name = this.state.newName;
    AttributeService.editAttribute(attr)
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
      }).finally(() => this.setState({ newName: "" }));;
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
    return (<>
      <Modal open={this.state.isModalOpen} size="mini">
        <Modal.Header>Podaj {this.state.addOrEdit && "nową"} nazwę atrybutu {this.state.addOrEdit && this.state.editedAttribute.name}</Modal.Header>
        <Modal.Content>
          <Input
            type="text"
            name="newName"
            placeholder="nowa nazwa"
            value={this.state.newName}
            onChange={(e) => this.handleChange(e)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.setState({ isModalOpen: false, newName: "" })}>
            Anuluj
        </Button>
          <Button
            content={this.state.addOrEdit ? "Zapisz atrybut" : "Dodaj atrybut"}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              this.setState({ isModalOpen: false });
              if (this.state.newName !== "") {
                this.state.addOrEdit ? this.attributeChanged() : this.addAttributeClick();
              }
            }}
            positive
          />
        </Modal.Actions>
      </Modal>

      <EntityList
        onReloadClick={() => this.fetchAttributes()}
        onAddClick={() => this.setState({ isModalOpen: true, addOrEdit: false })}
        entities={attributes}
        entityName="attributes"
        entityMapFunc={(x) => (
          <AttributeRow
            onDelete={(attr) => this.attributeDeleted(attr)}
            onChange={(attr) => this.handleAttributeChanged(attr)}
            key={x.id}
            attribute={x}
          />
        )}
        title="Atrybuty"
      />
    </>
    );
  }
}
