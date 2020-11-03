import React, { Component } from "react";
import { AttributeService, NotificationService } from "../../Services";
import { AttributeRow } from "../ListRows";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: [],
    };
  }

  componentDidMount() {
    this.fetchAttributes();
  }

  fetchAttributes() {
    AttributeService.getList().then((result) => {
      const attributes = result.data;
      this.setState({ attributes });
    });
  }

  attributeChanged(attr) {
    this.setState({
      attributes: this.state.attributes.map((x) => {
        if (x.id === attr.id) x.name = attr.name;
        return x;
      }),
    });
  }

  attributeDeleted(id) {
    this.setState({
      attributes: this.state.attributes.filter((x) => x.id !== id),
    });
  }

  addAttributeClick(e) {
    let attributeName = prompt("Podaj nazwę nowego atrybutu");
    if (!attributeName) return;

    AttributeService.addAttribute(attributeName)
      .then(() => {
        NotificationService.success(`Dodano atrybut "${attributeName}"`);
        this.fetchAttributes();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać atrybutu");
      });
  }

  render() {
    return (
      <div>
        Logged in as Admin.
        {this.state.attributes.map((x) => (
          <AttributeRow
            onDelete={(id) => this.attributeDeleted(id)}
            onChange={(attr) => this.attributeChanged(attr)}
            key={x.id}
            data={x}
          />
        ))}
        <button onClick={() => this.addAttributeClick()}>Dodaj atrybut</button>
      </div>
    );
  }
}
