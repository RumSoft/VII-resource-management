import React, { Component } from "react";
import { UserRow } from "../ListRows";
import { Button, Confirm, List } from "semantic-ui-react";
import {
  Events,
  EventService,
  NotificationService,
  UserService,
} from "../../Services";
import "./index.scss";
import { Link } from "react-router-dom";

export default class UserList extends Component {
  state = {
    isDeleteDialogOpen: false,
  };

  deleteUserClicked(user) {
    UserService.deleteUser(user.id)
      .then(() => {
        NotificationService.success(`Usunięto użytkownika ${user.fullname}`);
        EventService.Emit(Events.Dashboard_ReloadUsers);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć użytkownika");
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
          this.setState({ isDeleteDialogOpen: !this.state.isDeleteDialogOpen })
        }
        onConfirm={() => this.deleteUserClicked(this.state.passedUser)}
        content={`Czy usunąć użytkownika ${this.state.passedUser?.firstName} ${this.state.passedUser?.lastName} ?`}
        cancelButton="Nie"
        confirmButton="Tak"
      />
    );
  }

  renderContent() {
    return (
      <>
        <List style={{ width: "100%", padding: "5px" }}>
          {this.props.users.map((x) => (
            <List.Item>
              <UserRow key={x.id} user={x} isAdmin={"true"} />
            </List.Item>
          ))}{" "}
          <List.Item>
            <Button
              color="green"
              style={{ margin: "auto" }}
              as={Link}
              to="/user/add"
            >
              Dodaj użytkownika
            </Button>
          </List.Item>
        </List>
      </>
    );
  }

  render() {
    return (
      <>
        {this.renderConfirm()}
        {this.renderContent()}
      </>
    );
  }
}
