import React, { Component } from "react";
import {
  UserService,
  RequestService,
  NotificationService,
} from "../../Services";
import { Modal, Button, Grid, Form, Radio, List } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import "./index.scss";
import { ResourceRow, UserRow } from "../ListRows";

export default class CreateRequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: null,
      splitquantity: null,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    UserService.getList().then((result) => {
      const users = result && result.data;
      this.setState({ users });
    });
  }

  sendRequest() {
    const sentQuantity =
      this.state.splitquantity ?? this.props.resource.quantity;
    RequestService.addRequest({
      resourceId: this.props.resource.id,
      takerId: this.state.selectedUser.id,
      quantity: sentQuantity,
    })
      .then(() => {
        NotificationService.success(
          `Wysłano zasób ${this.props.resource.name} w ilości ${sentQuantity}`
        );
        this.props.onSuccess();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się wysłać zasobu");
      });
  }

  handleClosing() {
    this.setState({ splitquantity: null, selectedUser: null });
    this.props.onClose();
  }

  render() {
    const { isOpen, resource } = this.props;
    const startingquantity = resource?.quantity;
    return (
      <Modal
        open={isOpen}
        closeOnDocumentClick={true}
        onClose={() => this.handleClosing()}
      >
        <Modal.Header>Przekaż zasób</Modal.Header>
        <Modal.Content>
          <Grid columns="2" divided>
            <Grid.Column as={Form}>
              <Form.Field>Wybrany zasób:</Form.Field>
              <div>
                <ResourceRow isAdmin fluid resource={resource} />
              </div>
              <div className="quantity-slider">
                <label>
                  Ilość: <b>{this.state?.splitquantity || startingquantity}</b>
                </label>
                {startingquantity > 1 && (
                  <Slider
                    color="blue"
                    discrete
                    settings={{
                      start: startingquantity,
                      min: 1,
                      max: startingquantity,
                      step: 1,
                      onChange: (value) => {
                        this.setState({ splitquantity: value });
                      },
                    }}
                  />
                )}
              </div>
            </Grid.Column>

            <Grid.Column>
              <Form>
                <Form.Field>
                  {this.state.selectedUser ? (
                    <span>
                      Wybrano użytkownika:{" "}
                      <b>
                        {" "}
                        {this.state.selectedUser.firstName}{" "}
                        {this.state.selectedUser.lastName}
                      </b>
                    </span>
                  ) : (
                    "Wybierz użytkownika"
                  )}
                </Form.Field>
                <Form.Field>
                  <List>
                    {this.state.users
                      .filter((x) => x.id !== resource?.owner.id)
                      .map((x) => (
                        <List.Item>
                          <div
                            onClick={() => this.setState({ selectedUser: x })}
                          >
                            <UserRow
                              user={x}
                              style={{
                                backgroundColor:
                                  this.state.selectedUser?.id == x.id &&
                                  "rgba(0,0,0,0.1)",
                              }}
                            />
                          </div>
                        </List.Item>
                      ))}
                  </List>
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => this.handleClosing()}>
            Anuluj
          </Button>
          <Button
            content="Wyślij"
            disabled={this.state.selectedUser === null}
            labelPosition="right"
            icon="checkmark"
            onClick={() => {
              this.sendRequest();
              this.handleClosing();
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
