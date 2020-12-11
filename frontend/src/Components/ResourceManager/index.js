import React, { Component } from "react";
import {
  RoomService,
  AttributeService,
  NotificationService,
  ResourceService,
} from "../../Services";
import { Redirect } from "react-router-dom";
import {
  Checkbox,
  Dropdown,
  Input,
  Form,
  Button,
  Grid,
  Card,
  List,
  Confirm,
  Label
} from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import "./index.scss";

export default class ResourceManager extends Component {
  constructor(props) {
    super(props);
    const { resource } = this.props;
    this.state = {
      id: resource?.id || null,
      name: resource?.name || "",
      oldname: resource?.name || [],
      room: resource?.room?.id || -1, // -1 = no room
      rooms: [],
      quantity: resource?.quantity || 1,
      oldquantity: resource?.quantity || 1,
      splitquantity: resource?.quantity || 1,
      split: false,
      attributes: [],
      selectedAttributes: resource?.attributes.map((x) => x.id) || [],
      isDeleteDialogOpen: false,
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
  }

  handleDropdownChanged = (e, { value }) => {
    this.setState({ room: value });
  };

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
    this.props.onSave(
      {
        id: this.state.id,
        name: this.state.name,
        room: this.state.room === -1 ? null : this.state.room,
        quantity: this.state.split
          ? parseInt(this.state.splitquantity)
          : parseInt(this.state.quantity || 0),
        attributes: this.state.selectedAttributes,
      },
      this.state.split
    );
  }

  handleDelete() {
    const { id, name } = this.state;

    ResourceService.deleteResource(id)
      .then(() => {
        NotificationService.success(`Usunięto zasób ${name}`);
        this.setState({ redirect: true });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć zasobu");
      });
  }

  handleSplitCheckboxChange(e) {
    this.setState({ split: !this.state.split });
  }

  render() {
    const isEdit = this.props.edit;
    const isSplit = this.state.split;
    const errors = this.props.errors ?? {};
    const roomsArr = [
      {
        text: "bez pokoju",
        value: -1,
        content: <div style={{ padding: "1rem" }}>bez pokoju</div>,
      },
      ...this.state.rooms.map((x) => ({
        ...x,
        text: x.name,
        value: x.id,
        content: (
          <div style={{ backgroundColor: x.color }}>
            <div className="roomDropdownHover">{x.name}</div>
          </div>
        ),
      })),
    ];
    let deleteButton, splitCheckbox;

    if (isEdit === true) {
      deleteButton = (
        <Button
          color="red"
          floated="left"
          type="button"
          className="btn btn-danger btn-block"
          onClick={() =>
            this.setState({
              isDeleteDialogOpen: !this.state.isDeleteDialogOpen,
            })
          }
        >
          Usuń zasób
        </Button>
      );
      splitCheckbox = (
        <Checkbox
          disabled={this.state.oldquantity === 1}
          name="split"
          className="leftlabel"
          toggle
          label="Całość/Część"
          onChange={(e) => this.handleSplitCheckboxChange(e)}
        />
      );
    }

    if (this.state.redirect) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div>
        <Card fluid className="resourcemanager">
          <Card.Content>
            <Card.Header as="h1">
              {isEdit === true ? "Edytowanie" : "Dodawanie"}{" "}
              {isSplit === true && "części"} zasobu {this.state.oldname}
            </Card.Header>
          </Card.Content>

          <Card.Content>
            <Grid columns="2" stackable divided>
              <Grid.Column>
                {splitCheckbox}
                <Form>
                  <Form.Field>
                    <label>Nazwa</label>
                    <Input
                      fluid
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="nazwa"
                      value={this.state.name}
                      onChange={(e) => this.handleChange(e)}
                    />
                    {errors["Name"] && (
                      <Label
                        className="errorMessage"
                        basic color="red" pointing>
                        {errors["Name"][0]}
                      </Label>
                    )}
                  </Form.Field>

                  <Form.Field>
                    <label>Pokój</label>
                    <Input
                      fluid
                      input={
                        <Dropdown
                          fluid
                          selection
                          labeled
                          placeholder={"Wybierz pokój"}
                          value={this.state.room}
                          options={roomsArr}
                          onChange={this.handleDropdownChanged}
                        />
                      }
                    />
                  </Form.Field>

                  {!isSplit && (
                    <Form.Field>
                      <label>Ilość</label>
                      <Input
                        fluid
                        name="quantity"
                        type="number"
                        value={this.state.quantity}
                        onChange={(e) => this.handleChange(e)}
                        min="1"
                        step="1"
                      />
                    </Form.Field>
                  )}
                  {isSplit && (
                    <Form.Field>
                      <label>Ilość: {this.state.splitquantity}</label>
                      <Slider
                        color="blue"
                        discrete
                        value={this.state.splitquantity}
                        settings={{
                          start: parseInt(this.state.splitquantity),
                          min: 1,
                          max: parseInt(this.state.oldquantity),
                          step: 1,
                          onChange: (value) => {
                            this.setState({ splitquantity: value });
                          },
                        }}
                      />

                    </Form.Field>
                  )}
                  {errors["Quantity"] && (
                    <Label
                      className="errorMessage"
                      basic color="red" pointing>
                      {errors["Quantity"][0]}
                    </Label>
                  )}
                </Form>
              </Grid.Column>

              <Grid.Column>
                <List>
                  {this.state.attributes.map((x) => {
                    return (
                      <List.Item
                        key={x.id}
                        style={{ backgroundColor: x.color }}
                      >
                        <Checkbox
                          key={x.id}
                          label={x.name.substring(0, 50)}
                          checked={this.state.selectedAttributes.includes(x.id)}
                          onChange={() => this.handleAttributeChanged(x.id)}
                        />
                      </List.Item>
                    );
                  })}
                </List>
              </Grid.Column>
            </Grid>
          </Card.Content>
          <Card.Content>
            <Button
              color="green"
              floated="right"
              type="submit"
              className="btn btn-primary btn-block"
              onClick={(e) => this.handleSave(e)}
            >
              Zapisz zasób
            </Button>

            {deleteButton}
          </Card.Content>
        </Card>

        <Confirm
          className="confirmDialog"
          open={this.state.isDeleteDialogOpen}
          onCancel={() =>
            this.setState({
              isDeleteDialogOpen: !this.state.isDeleteDialogOpen,
            })
          }
          onConfirm={() => this.handleDelete()}
          content={`Czy usunąć zasób ${this.state.name}?`}
          cancelButton="Nie"
          confirmButton="Tak"
        />
      </div>
    );
  }
}
