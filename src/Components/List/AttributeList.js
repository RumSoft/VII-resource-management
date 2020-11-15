import React, { Component } from "react";
import { AttributeRow } from "../ListRows";
import {
  AttributeService,
  Events,
  EventService,
  NotificationService,
} from "../../Services";
import { Modal, Button, Input, Confirm } from "semantic-ui-react";
import "./index.scss";

export default class AttributeList extends Component {
  state = {
    isModalOpen: false,
    isEdit: null, // 0 = add, 1 = edit
    newName: "",
    isDeleteDialogOpen: false,
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  addAttributeClick() {
    AttributeService.addAttribute(this.state.newName)
      .then(() => {
        NotificationService.success(`Dodano atrybut "${this.state.newName}"`);
        EventService.Emit(Events.Dashboard_ReloadAttributes);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać atrybutu");
      })
      .finally(() => this.setState({ newName: "" }));
  }

  changeAttributeClick() {
    let attr = { ...this.state.passedAttribute };
    attr.name = this.state.newName;
    AttributeService.editAttribute(attr)
      .then(() => {
        NotificationService.success(
          `Pomyślnie zmieniono nazwę atrybutu na ${attr.name}`
        );
        EventService.Emit(Events.Dashboard_ReloadAttributes);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się edytować atrybutu");
      })
      .finally(() => this.setState({ newName: "" }));
  }

  deleteAttributeClicked(attr) {
    AttributeService.deleteAttribute(attr.id)
      .then(() => {
        NotificationService.success(`Usunięto atrybut ${attr.name}`);
        EventService.Emit(Events.Dashboard_ReloadAttributes);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć atrybutu");
      })
      .finally(() => this.setState({ isDeleteDialogOpen: false }));
  }

  renderConfirm() {
    return (
      <Confirm
        className="confirmDialog"
        size="mini"
        open={this.state.isDeleteDialogOpen}
        onCancel={() =>
          this.setState({
            isDeleteDialogOpen: !this.state.isDeleteDialogOpen,
          })
        }
        onConfirm={() =>
          this.deleteAttributeClicked(this.state.passedAttribute)
        }
        content={`Czy usunąć zasób ${this.state.passedAttribute?.name}?`}
        cancelButton="Nie"
        confirmButton="Tak"
      />
    );
  }

  renderModal() {
    return (
      <Modal
        open={this.state.isModalOpen}
        size="mini"
        closeOnDocumentClick={true}
        onClose={() => this.setState({ isModalOpen: false, newName: "" })}
      >
        <Modal.Header>
          Podaj {this.state.isEdit && "nową"} nazwę atrybutu{" "}
          {this.state.isEdit && this.state.passedAttribute.name}
        </Modal.Header>
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
          <Button
            color="black"
            onClick={() => this.setState({ isModalOpen: false, newName: "" })}
          >
            Anuluj
          </Button>
          <Button
            content={this.state.isEdit ? "Zapisz atrybut" : "Dodaj atrybut"}
            labelPosition="right"
            icon="checkmark"
            onClick={() => {
              this.setState({ isModalOpen: false });
              if (this.state.newName !== "") {
                this.state.isEdit
                  ? this.changeAttributeClick()
                  : this.addAttributeClick();
              }
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }

  renderContent() {
    return (
      <>
        {this.props.attributes.map((x) => (
          <AttributeRow
            onDelete={(attr) =>
              this.setState({ isDeleteDialogOpen: true, passedAttribute: attr })
            }
            onChange={(attr) =>
              this.setState({
                isModalOpen: true,
                isEdit: true,
                passedAttribute: attr,
                newName: attr.name,
              })
            }
            key={x.id}
            attribute={x}
          />
        ))}
        <div className="list-row">
          <Button
            color="green"
            style={{ margin: "auto" }}
            onClick={() => this.setState({ isModalOpen: true, isEdit: false })}
          >
            Dodaj atrybut
          </Button>
        </div>
      </>
    );
  }

  render() {
    return (
      <>
        {this.renderConfirm()}
        {this.renderModal()}
        {this.renderContent()}
      </>
    );
  }
}
