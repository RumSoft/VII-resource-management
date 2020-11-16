import React, { Component } from "react";
import {
  Events,
  EventService,
  NotificationService,
  RoomService,
} from "../../Services";
import { RoomRow } from "../ListRows";
import { Modal, Button, Input, Confirm, Label } from "semantic-ui-react";
import { GithubPicker } from 'react-color';
import "./index.scss";

export default class RoomList extends Component {
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

  addRoomClick() {
    const { newName } = this.state;
    const color = this.state.color !== "#e8e8e8" ? this.state.color : null;
    const room = { name: newName, color: color }

    RoomService.addRoom(room)
      .then(() => {
        NotificationService.success(`Dodano pokój "${newName}"`);
        this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" });
        EventService.Emit(Events.Dashboard_ReloadRooms);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać pokoju");
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        }
        else {
          this.setState({ errors: {} });
        }
      })
  }

  changeRoomClicked() {
    let room = { ...this.state.passedRoom };
    room.name = this.state.newName;
    room.color = this.state.color !== "#e8e8e8" ? this.state.color : null;
    RoomService.editRoom(room)
      .then(() => {
        NotificationService.success(`Pomyślnie zmieniono nazwę pokoju na ${room.name}`);
        this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" });
        EventService.Emit(Events.Dashboard_ReloadRooms);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się pokoju atrybutu");
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        }
        else {
          this.setState({ errors: {} });
        }
      })
  }

  deleteRoomClicked(room) {
    RoomService.deleteRoom(room.id)
      .then(() => {
        NotificationService.success(`Usunięto pokój ${room.name}`);
        EventService.Emit(Events.Dashboard_ReloadRooms);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć pokoju");
      })
      .finally(() => this.setState({ isDeleteDialogOpen: false }));
  }

  //#region rendering
  renderModal() {
    const errors = this.state.errors ?? {};
    return (
      <Modal
        open={this.state.isModalOpen}
        size="mini"
        closeOnDocumentClick={true}
        onCancel={() => this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" })}
        onClose={() => this.setState({ isModalOpen: false, errors: {}, newName: "", color: "#e8e8e8" })}
      >
        <Modal.Header>
          {this.state.isEdit ? "Edycja" : "Dodawanie nowego"} pokoju{" "}
          {this.state.isEdit && this.state.passedRoom.name}
        </Modal.Header>

        <Modal.Content>
          <p className="fieldLabel"><b>Nazwa pokoju</b></p>
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
            content={this.state.isEdit ? "Zapisz pokój" : "Dodaj pokój"}
            labelPosition="right"
            icon="checkmark"
            onClick={() => {
              if (this.state.newName !== "") {
                this.state.isEdit
                  ? this.changeRoomClicked()
                  : this.addRoomClick();
              }
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
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
        onConfirm={() => this.deleteRoomClicked(this.state.passedRoom)}
        content={`Czy usunąć zasób ${this.state.passedRoom?.name}?`}
        cancelButton="Nie"
        confirmButton="Tak"
      />
    );
  }

  renderContent() {
    return (
      <>
        {this.props.rooms?.map((x) => (
          <RoomRow
            key={x.id}
            room={x}
            onChange={(room) =>
              this.setState({
                isModalOpen: true,
                isEdit: true,
                passedRoom: room,
                newName: room.name,
                color: room.color,
                isColorPickerOpen: room.color !== null
              })
            }
            onDelete={(room) =>
              this.setState({ isDeleteDialogOpen: true, passedRoom: room })
            }
          />
        ))}

        <div className="list-row room-row">
          <Button
            color="green"
            style={{ margin: "auto" }}
            onClick={() => this.setState({ isModalOpen: true, isEdit: false })}
          >
            Dodaj pokój
          </Button>
        </div>
      </>
    );
  }
  //#endregion

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
