import React, { Component } from "react";
import { Button, Card, CardContent, CardDescription, Icon, Label } from "semantic-ui-react";
import "./ResourceRow.scss";

export default class ResourceRow extends Component {
    handleRequestClick() {
        this.props.onRequest && this.props.onRequest(this.props.resource);
    }
    handleEditClick() {
        this.props.onChange && this.props.onChange(this.props.resource);
    }

    handleDeleteClick() {
        this.props.onDelete && this.props.onDelete(this.props.resource);
    }



    render() {

        const { attributes, name, quantity, room, owner } = this.props.resource;
        console.log(this.props.showOwner)

        let content = "";

        if (this.props.showOwner) {
            content = <CardDescription>
                <Label style={{ color: "lightgrey", backgroundColor: "white" }}><Icon name="user" /> {`${owner.firstName} ${owner.lastName} ${owner.emailAddress}`}</Label>
            </CardDescription>
        }

        return (
            <Card className="resourceRow">
                <CardContent>
                    {content}
                    <CardDescription>
                        <Label style={{ backgroundColor: "white" }}><Icon name="tag" />{<span><b>{name}</b></span>}</Label>
                    </CardDescription>
                    <CardDescription>
                        <Label style={{ backgroundColor: room && room.color }}><Icon name="point" />{`${room?.name || 'brak pokoju'}`}</Label>
                        <Label style={{ backgroundColor: "white", float: "right" }}><Icon name="stack overflow" /> {`x${quantity}`} </Label>
                    </CardDescription>
                    <CardDescription className="attributesPanel">
                        {attributes.length === 0 ? <Label style={{ backgroundColor: "white" }}>brak atrybutów</Label> : attributes.map((x) => (
                            <Label style={{ backgroundColor: x.color }}>{x.name}</Label>
                        ))}
                    </CardDescription>
                </CardContent>
                <CardContent>
                    <div className='ui three buttons'>
                        <Button className="button" basic color="yellow" onClick={() => this.handleEditClick()}>
                            <Icon name="write" /> edytuj
                        </Button>
                        <Button className="button" basic color="blue" onClick={() => this.handleRequestClick()}>
                            <Icon name="envelope outline" />prześlij
                        </Button>
                        <Button className="button" basic color="red" onClick={() => this.handleDeleteClick()}>
                            <Icon name="x" />usuń
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }
}
