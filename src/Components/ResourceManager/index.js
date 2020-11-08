import React, { Component } from "react";
import {
  RoomService,
  AttributeService,
  NotificationService,
  ResourceService,
} from "../../Services";
import { Redirect } from "react-router-dom";
import { Checkbox, Dropdown, Input } from 'semantic-ui-react'
import "./index.scss";

export default class ResourceManager extends Component {
  constructor(props) {
    super(props);
    const { resource } = this.props;
    this.state = {
      id: resource?.id || null,
      name: resource?.name || [],
      room: resource?.room?.id || -1, // -1 = no room
      rooms: [],
      quantity: resource?.quantity || 1,
      attributes: [],
      selectedAttributes: resource?.attributes.map((x) => x.id) || [],
    };
  }

  componentDidMount() {
    RoomService.getList().then((res) => {
      this.setState({ rooms: res.data });
    });

    AttributeService.getList().then((res) => {
      this.setState({ attributes: res.data });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.name)
  }

  handleDropdownChanged = (e, { value }) => {
    console.log(value)
    this.setState({ room: value });
  }
  handleAttributeChanged(id) {
    const attrList = this.state.selectedAttributes;

    if (attrList.includes(id)) {
      this.setState({
        selectedAttributes: [...attrList.filter((x) => x !== id)],
      });
    } else {
      this.setState({
        selectedAttributes: [...attrList, id],
      });
    }
  }

  handleSave(e) {
    e.preventDefault();
    this.props.onSave({
      id: this.state.id,
      name: this.state.name,
      room: this.state.room === -1 ? null : this.state.room,
      quantity: parseInt(this.state.quantity),
      attributes: this.state.selectedAttributes,
    });
  }

  handleDelete() {
    const { id, name } = this.state;

    if (window.confirm(`Czy usunąć zasób ${name}?`)) {
      ResourceService.deleteResource(id)
        .then(() => {
          NotificationService.success(`Usunięto zasób ${name}`);
          this.setState({ redirect: true });
        })
        .catch((e) => {
          NotificationService.apiError(e, "Nie udało się usunąć zasobu");
        });
    }
  }

  render() {
    const isEdit = this.props.edit;
    let deleteButton;
    const roomsArr = [{ text: "bez pokoju", value: -1 }, ...this.state.rooms.map((x) => ({ ...x, text: x.name, value: x.id }))]

    if (isEdit === true) {
      deleteButton = (
        <>
          <div className="form-group">
            <button
              type="button"
              className="btn btn-danger btn-block"
              onClick={() => this.handleDelete()}
            >
              Usuń zasób
            </button>
          </div>
        </>
      );
    }

    if (this.state.redirect) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className="resourcemanager-form">
        <div className="form-group">
          <h2 className="text-center">
            {isEdit === true ? "Edytowanie" : "Dodawanie"} zasobu
          </h2>

          <div className="form-group">
            Nazwa zasobu
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="nazwa"
              value={this.state.name}
              onChange={(e) => this.handleChange(e)}
            />
          </div>

          <div className="form-group">
            x
            <Dropdown
              selection
              labeled
              placeholder={"Wybierz pokój"}
              value={this.state.room}
              options={roomsArr}
              onChange={this.handleDropdownChanged}

            />
          </div>

          <div className="form-group">
            Ilość
            <Input
              name="quantity"
              type="number"
              value={this.state.quantity}
              onChange={(e) => this.handleChange(e)}
              label="Ilość"
            />
            {/* <TextField
                name="quantity"
                type="number"
                value={this.state.quantity}
                inputProps={{
                  min: "1",
                  step: "1",
                  style: { textAlign: "center" },
                }}
                onChange={(e) => this.handleChange(e)}
                variant="outlined"
              /> */}

          </div>

          {this.state.attributes.map((x) => {
            return (
              <Checkbox
                key={x.id}
                label={x.name}
                checked={this.state.selectedAttributes.includes(x.id)}
                onChange={() => this.handleAttributeChanged(x.id)}
              />
            );
          })}
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={(e) => this.handleSave(e)}
            >
              Zapisz zasób
            </button>
          </div>
          {deleteButton}
        </div>
      </div>
    );
  }
}
