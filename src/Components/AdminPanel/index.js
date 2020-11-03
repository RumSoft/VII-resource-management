import React, { Component } from "react";
import { AttributeService, NotificationService } from "../../Services";
import { AttributeRow } from "../ListRows";
import {
  CardContent,
  Card,
  Box,
  CardHeader,
  Tooltip,
  Fab,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import AttributeList from "../List/AttributeList";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: [],
    };
  }

  addAttributeClick(e) {
    let attributeName = prompt("Podaj nazwę nowego atrybutu");
    if (!attributeName) return;

    AttributeService.addAttribute(attributeName)
      .then(() => {
        NotificationService.success(`Dodano atrybut "${attributeName}"`);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać atrybutu");
      });
  }

  render() {
    return (
      <div>
        <p> Logged in as Admin.</p>
        <div class="container-fluid d-flex">
          <Box m={1}>
            <AttributeList />
          </Box>
        </div>
      </div>
    );
  }
}
