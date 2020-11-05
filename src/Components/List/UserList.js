import React, { Component } from "react";
import { UserRow } from "../ListRows";
import { NotificationService, UserService } from "../../Services";
import EntityList from "./EntityList";
import "./index.scss";

export default class UserList extends Component {
  state = {
    users: [],
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

  userDeleted(user) {
    UserService.deleteUser(user.id)
      .then(() => {
        NotificationService.success(`Usunięto użytkownika ${user.fullname}`);
        this.setState({
          users: this.state.users.filter((x) => x.id !== user.id),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć użytkownika");
      });
  }

  render() {
    const { users } = this.state;
    return (
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
            onDelete={(user) => this.userDeleted(user)}
            onChange={(user) => console.log("user edit click")}
            key={x.id}
            user={x}
          />
        )}
        title="Użytkownicy"
      />
    );
  }
}
