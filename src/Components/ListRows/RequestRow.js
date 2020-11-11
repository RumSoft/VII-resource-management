import React, { Component } from "react";
import { Button, Card, CardContent, CardDescription, Icon } from "semantic-ui-react";
import "./RequestRow.scss";

export default class RequestRow extends Component {


    handleDeleteClick() {
        this.props.onDelete && this.props.onDelete(this.props.request);
    }

    render() {
        const { userInfo, taker, owner, resource, id } = this.props.request;
        let row = "";

        let isOther = !userInfo.isTaker && !userInfo.isOwner;
        let header = "";
        let footer = "";

        if (isOther) {
            header = <CardDescription>
                {`Użytkownik ${owner.FirstName} ${owner.LastName} chce przekazać użytkownikowi ${taker.FirstName} ${taker.LastName}`}
            </CardDescription>
        } else if (userInfo.isTaker) {
            header = <CardDescription>
                {`Użytkownik ${owner.FirstName} ${owner.LastName} chce Ci przekazać`}
            </CardDescription>
            footer = <CardDescription>
                <div className='ui two buttons'>
                    <Button basic color="green" onClick={() => alert("123")}>
                        👌🏿 zaakceptuj
                    </Button>
                    <Button basic color="red" onClick={() => alert("321")}>
                        <Icon name="x" />odrzuć
                    </Button>
                </div>
            </CardDescription>
        } else {
            header = <CardDescription>
                {`Wysłano prośbę do użytkownika ${taker.FirstName} ${taker.LastName}`}
            </CardDescription>
            footer = <CardDescription>
                <div className='ui two buttons'>
                    <Button basic color="white" disabled>oczekiwanie</Button>
                    <Button basic color="red" onClick={() => alert("5555")}>
                        <Icon name="ban" />anuluj
                    </Button>
                </div>
            </CardDescription>
        }

        return (
            <Card>
                <CardContent>
                    {header}
                    <CardDescription>{`nazwa: ${resource.name}, pokój: ${resource.room.name}, atrybuty: ${resource.attributes.name}`} </CardDescription>
                    <CardDescription>{`x${resource.quantity}`}</CardDescription>
                    {footer}
                </CardContent>
            </Card>

        );
    }
}
