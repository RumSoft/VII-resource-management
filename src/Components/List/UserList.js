import React, { Component } from "react";
import { UserRow } from "../ListRows";
import { NotificationService, UserService } from "../../Services";
import EntityList from "./EntityList";
import { Confirm } from 'semantic-ui-react';
import "./index.scss";

export default class UserList extends Component {
  state = {
    users: null,
    isDeleteDialogOpen: false
  };
  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    UserService.getList().then((result) => {
      const users = result && result.data;
      this.setState({ users });
    });
  }

  deleteUserClicked(user) {
    console.log(user)
    UserService.deleteUser(user.id)
      .then(() => {
        NotificationService.success(`Usunięto użytkownika ${user.fullname}`);
        this.setState({
          users: this.state.users.filter((x) => x.id !== user.id),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć użytkownika");
      }).finally(() => this.setState({ isDeleteDialogOpen: false }));
  }

  render() {
    const { users } = this.state;
    return (<>
      < Confirm
        className="confirmDialog"
        size="mini"
        open={this.state.isDeleteDialogOpen}
        onCancel={() => this.setState({ isDeleteDialogOpen: !this.state.isDeleteDialogOpen })}
        onConfirm={() => this.deleteUserClicked(this.state.passedUser)}
        content={(`Czy usunąć użytkownika ${this.state.passedUser?.firstName} ${this.state.passedUser?.lastName} ?`)}
        cancelButton="Nie"
        confirmButton="Tak"
      />
      <EntityList
        onReloadClick={() => this.fetchUsers()}
        onAddClick={() => {
          //todo: fix this
          window.location = "/user/add";
        }}
        entities={users}
        entityName="users"
        entityMapFunc={(x) => (
          <UserRow
            onDelete={(user) => this.setState({ isDeleteDialogOpen: true, passedUser: user })}
            key={x.id}
            user={x}
          />
        )}
        title="Użytkownicy"
      />
    </>
    );
  }
}
