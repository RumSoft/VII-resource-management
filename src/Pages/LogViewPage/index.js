import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, Dropdown, Select, Table } from "semantic-ui-react";
import { LogService } from "../../Services";
import qs from "query-string";

class LogViewPage extends Component {
  state = {
    logs: [],
    level: 3,
    length: 100,
  };

  logLevels = [
    { key: 2, value: 2, text: "Information" },
    { key: 3, value: 3, text: "Warning" },
    { key: 4, value: 4, text: "Error" },
    { key: 5, value: 5, text: "Critical" },
  ];

  renderRow(x) {
    const date = new Date(x.timeStamp);
    return (
      <Table.Row key={x.id}>
        <Table.Cell>{x.id}</Table.Cell>
        <Table.Cell>{x.message}</Table.Cell>
        <Table.Cell>{x.level}</Table.Cell>
        <Table.Cell>{date.toLocaleString()}</Table.Cell>
        <Table.Cell>
          {x.exception ? x.exception.substring(0, 200) : "-"}
        </Table.Cell>
      </Table.Row>
    );
  }

  changeSearchParams(obj) {
    this.setState({ ...obj }, () => {
      LogService.get(this.state.level, this.state.length)
        .then((res) => {
          this.setState({ logs: res.data });
        })
        .catch((res) => {});
    });
  }

  render() {
    const { logs, level, length } = this.state;

    return (
      <>
        <p>
          {level} {length}
        </p>
        <Card>
          <Card.Content>
            <Dropdown
              placeholder="LogLevel"
              onChange={(e, val) => {
                this.changeSearchParams({ level: val.value });
              }}
              options={this.logLevels}
              value={level}
            />
          </Card.Content>
        </Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>id</Table.HeaderCell>
              <Table.HeaderCell>message</Table.HeaderCell>
              <Table.HeaderCell>level</Table.HeaderCell>
              <Table.HeaderCell>timestamp</Table.HeaderCell>
              <Table.HeaderCell>exception</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {logs ? logs.map((x) => this.renderRow(x)) : <p>brak danych</p>}
          </Table.Body>
        </Table>
      </>
    );
  }

  componentDidMount() {
    const params = qs.parse(window.location.search);
    this.changeSearchParams(params);
  }
}

export default withRouter(LogViewPage);
