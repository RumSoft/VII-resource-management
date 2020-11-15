import React, { Component } from "react";
import { UserRow } from "../ListRows";
import {
  Events,
  EventService,
  NotificationService,
  UserService,
} from "../../Services";
import { Button, Confirm } from "semantic-ui-react";
import "./index.scss";
import { Link } from "react-router-dom";

export default class UserList extends Component {
  state = {
    isDeleteDialogOpen: false,
  };

  deleteUserClicked(user) {
    console.log(user);
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
        {this.props.users.map((x) => (
          <UserRow key={x.id} user={x} />
        ))}
        <div className="list-row room-row">
          <Button
            color="green"
            style={{ margin: "auto" }}
            as={Link}
            to="/user/add"
          >
            Dodaj użytkownika
          </Button>
        </div>
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
