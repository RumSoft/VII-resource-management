import React, { Component } from "react";
import { NotificationService, RoomService } from "../../Services";
import { RoomRow } from "../ListRows";
import EntityList from "./EntityList";
import { Modal, Button, Input, Confirm } from 'semantic-ui-react';
import "./index.scss";

export default class RoomList extends Component {
  state = {
    rooms: null,
    isModalOpen: false,
    isEdit: null, // 0 = add, 1 = edit
    newName: "",
    isDeleteDialogOpen: false
  };
  componentDidMount() {
    this.fetchRooms();
  }

  fetchRooms() {
    RoomService.getList().then((result) => {
      const rooms = result && result.data;
      this.setState({ rooms });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  addRoomClick() {
    RoomService.addRoom(this.state.newName)
      .then(() => {
        NotificationService.success(`Dodano pokój "${this.state.newName}"`);
        this.fetchRooms();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać pokoju");
      }).finally(() => this.setState({ newName: "" }));
  }

  changeRoomClicked() {
    let room = { ...this.state.passedRoom };
    room.name = this.state.newName;
    RoomService.editRoom(room)
      .then(() => {
        NotificationService.success(`Pomyślnie zmieniono nazwę pokoju na ${room.name}`);
        this.setState({
          rooms: this.state.rooms.map((x) => {
            if (x.id === room.id) x.name = room.name;
            return x;
          }),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się pokoju atrybutu");
      }).finally(() => this.setState({ newName: "" }));
  }

  deleteRoomClicked(room) {
    RoomService.deleteRoom(room.id)
      .then(() => {
        NotificationService.success(`Usunięto pokój ${room.name}`);
        this.setState({
          rooms: this.state.rooms.filter((x) => x.id !== room.id),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć pokoju");
      }).finally(() => this.setState({ isDeleteDialogOpen: false }));
  }

  render() {
    const { rooms } = this.state;
    return (<>
      <Modal open={this.state.isModalOpen} size="mini" onClose={() => this.setState({ isModalOpen: false, newName: "" })}>
        <Modal.Header>Podaj {this.state.isEdit && "nową"} nazwę pokoju {this.state.isEdit && this.state.passedRoom.name}</Modal.Header>
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
            content={this.state.isEdit ? "Zapisz pokój" : "Dodaj pokój"}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              this.setState({ isModalOpen: false });
              if (this.state.newName !== "") {
                this.state.isEdit ? this.changeRoomClicked() : this.addRoomClick();
              }
            }}
            positive
          />
        </Modal.Actions>
      </Modal>

      < Confirm
        className="confirmDialog"
        size="mini"
        open={this.state.isDeleteDialogOpen}
        onCancel={() => this.setState({ isDeleteDialogOpen: !this.state.isDeleteDialogOpen })}
        onConfirm={() => this.deleteRoomClicked(this.state.passedRoom)}
        content={(`Czy usunąć zasób ${this.state.passedRoom?.name}?`)}
        cancelButton="Nie"
        confirmButton="Tak"
      />

      <EntityList
        onReloadClick={() => this.fetchRooms()}
        onAddClick={() => this.setState({ isModalOpen: true, isEdit: false })}
        entities={rooms}
        entityName="rooms"
        entityMapFunc={(x) => (
          <RoomRow
            onDelete={(room) => this.setState({ isDeleteDialogOpen: true, passedRoom: room })}
            onChange={(room) => this.setState({ isModalOpen: true, isEdit: true, passedRoom: room, newName: room.name })}
            key={x.id}
            room={x}
          />
        )}
        title="Pokoje"
      />
    </>
    );
  }
}
