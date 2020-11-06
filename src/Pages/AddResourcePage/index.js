import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ResourceManager from "../../Components/ResourceManager";

import "./index.scss";

export default class AddResurcePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        };
    }

    addResource(res) {
        console.log(`Mock res added!\nName: ${res.name} Room: ${res.room}\nPass it to ResourceController.addResource`);
        this.setState({ redirect: true });
    }
    render() {
        return <>
            {this.state.redirect && <Redirect to="/dashboard" />}
            <ResourceManager onSave={(res) => this.addResource(res)} />
        </>
    }
}

// import React, { Component } from "react";
// import { UserService, NotificationService } from "../../Services";
// import { Redirect } from "react-router-dom";
// import UserManager from "../../Components/UserManager";

// export default class AddUserPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       redirect: false,
//     };
//   }

//   addUser(user) {
//     UserService.addUser(user)
//       .then((e) => {
//         NotificationService.success(
//           `Dodano użytkownika ${user.firstName} ${user.lastName} o adresie ${user.emailAddress}`
//         );
//         this.setState({ redirect: true });
//       })
//       .catch((e) => {
//         NotificationService.apiError(e, "Nie udało się dodać użytkownika");
//       });
//   }

//   render() {
//     if (this.state.redirect) {
//       return <Redirect to="/dashboard" />;
//     }

//     return (
//       <>
//         {this.state.redirect && <Redirect to="/dashboard" />}
//         <UserManager onSave={(user) => this.addUser(user)} />
//       </>
//     );
//   }
// }
