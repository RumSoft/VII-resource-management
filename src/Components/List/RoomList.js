import React, { Component } from "react";
import {
  Events,
  EventService,
  NotificationService,
  RoomService,
} from "../../Services";
import { RoomRow } from "../ListRows";
import { Modal, Button, Input, Confirm, Label } from "semantic-ui-react";
import "./index.scss";

export default class RoomList extends Component {
  state = {
    isModalOpen: false,
    isEdit: null, // 0 = add, 1 = edit
    newName: "",
    isDeleteDialogOpen: false,
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  addRoomClick() {
    RoomService.addRoom(this.state.newName)
      .then(() => {
        NotificationService.success(`Dodano pokój "${this.state.newName}"`);
        this.setState({ isModalOpen: false, errors: {}, newName: "" });
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
    RoomService.editRoom(room)
      .then(() => {
        NotificationService.success(`Pomyślnie zmieniono nazwę pokoju na ${room.name}`);
        this.setState({ isModalOpen: false, errors: {}, newName: "" });
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
  renderEditModal() {
    const errors = this.state.errors ?? {};
    return (
      <Modal
        open={this.state.isModalOpen}
        size="mini"
        closeOnDocumentClick={true}
        onCancel={() => this.setState({ isModalOpen: false, errors: {}, newName: "" })}
        onClose={() => this.setState({ isModalOpen: false, errors: {}, newName: "" })}
      >
        <Modal.Header>
          Podaj {this.state.isEdit && "nową"} nazwę pokoju{" "}
          {this.state.isEdit && this.state.passedRoom.name}
        </Modal.Header>
        <Modal.Content>
          <Input
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
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="black"
            onClick={() => this.setState({ isModalOpen: false, errors: {}, newName: "" })}
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

  renderEditConfirm() {
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
        {this.renderEditModal()}
        {this.renderEditConfirm()}
        {this.renderContent()}
      </>
    );
  }
}
