import React, { Component } from "react";
import { AttributeRow } from "../ListRows";
import {
  AttributeService,
  Events,
  EventService,
  NotificationService,
} from "../../Services";
import { Modal, Button, Input, Confirm, Label, Checkbox } from "semantic-ui-react";
import { GithubPicker } from 'react-color';
import "./index.scss";

export default class AttributeList extends Component {
  state = {
    isModalOpen: false,
    isEdit: null, // 0 = add, 1 = edit
    newName: "",
    isDeleteDialogOpen: false,
    color: "#e8e8e8"

  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  addAttributeClick() {
    const { newName } = this.state;
    const color = this.state.color !== "#e8e8e8" ? this.state.color : null;
    const attribute = { name: newName, color: color }

    AttributeService.addAttribute(attribute)
      .then(() => {
        NotificationService.success(`Dodano atrybut "${newName}"`);
        this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" });
        EventService.Emit(Events.Dashboard_ReloadAttributes);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać atrybutu");
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        }
        else {
          this.setState({ errors: {} });
        }
      })
  }

  changeAttributeClick() {
    let attr = { ...this.state.passedAttribute };
    attr.name = this.state.newName;
    attr.color = this.state.color !== "#e8e8e8" ? this.state.color : null;
    AttributeService.editAttribute(attr)
      .then(() => {
        NotificationService.success(
          `Pomyślnie zmieniono nazwę atrybutu na ${attr.name}`
        );
        this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" });
        EventService.Emit(Events.Dashboard_ReloadAttributes);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się edytować atrybutu");
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        }
        else {
          this.setState({ errors: {} });
        }
      })
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

  colorConfiguration = {
    "#e8e8e8": { name: "brak koloru" },
    "#d5deff": { name: "fioletowy" },
    "#d9fffd": { name: "niebieski" },
    "#ceffc5": { name: "zielony" },
    "#fff3b6": { name: "żółty" },
    "#ffd5ad": { name: "pomarańczowy" },
    "#ffb3b3": { name: "czerwony" },
  };


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
    const errors = this.state.errors ?? {};
    const colorTable = this.colorConfiguration[this.state.color];

    return (
      <Modal
        className="modalDialog"
        open={this.state.isModalOpen}
        size="mini"
        closeOnDocumentClick={true}
        onCancel={() => this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" })}
        onClose={() => this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" })}
      >
        <Modal.Header>
          {this.state.isEdit ? "Edycja" : "Dodawanie nowego"} atrybutu{" "}
          {this.state.isEdit && this.state.passedAttribute.name}
        </Modal.Header>

        <Modal.Content>
          <p className="fieldLabel"><b>Nazwa atrybutu</b></p>
          <Input
            fluid
            type="text"
            name="newName"
            placeholder="nowa nazwa"
            value={this.state.newName}
            onChange={(e) => this.handleChange(e)}
          />
          {errors["Name"] && (
            <Label
              className="errorMessage"
              basic color="red" pointing>
              {errors["Name"][0]}
            </Label>
          )}

          <p className="fieldLabel"><b>Kolor</b></p>
          <GithubPicker
            width="187px"
            triangle="hide"
            color={this.state.color ?? "#fff"}
            colors={["#e8e8e8", "#d5deff", "#d9fffd", "#ceffc5", "#fff3b6", "#ffd5ad", "#ffb3b3"]}
            onChangeComplete={(color) => this.setState({ color: color.hex })}
          />
          <p className="fieldLabel"><b>Podgląd</b></p>
          <Label size="large" style={{ backgroundColor: this.state.color }}>{this.state.newName || "podgląd"}</Label>
        </Modal.Content>

        <Modal.Actions>
          <Button
            color="black"
            onClick={() => this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" })}
          >
            Anuluj
          </Button>
          <Button
            content={this.state.isEdit ? "Zapisz atrybut" : "Dodaj atrybut"}
            labelPosition="right"
            icon="checkmark"
            onClick={() => {

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
                color: attr.color,
                isColorPickerOpen: attr.color !== null
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
