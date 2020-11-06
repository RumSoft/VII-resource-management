import React, { Component } from "react";
import { Select, MenuItem, TextField, FormControlLabel, Checkbox } from '@material-ui/core'
import { RoomService, AttributeService } from "../../Services"
import { withStyles } from '@material-ui/core/styles';
import "./index.scss";

const CssTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#0275d8',
            },
        },
    },
})(TextField);

export default class ResourceManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   ...this.props.resource
            name: "",
            room: "",
            rooms: [],
            quantity: 1,
            attributes: [],
            selectedAttributes: new Map()
        };
    }

    componentDidMount() {
        RoomService.getList()
            .then((res) => {
                this.setState({ rooms: res.data });
            });

        AttributeService.getList()
            .then((res) => {
                this.setState({ attributes: res.data });
            })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleCheckbox(e) {
        const attribute = e.target.value;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ selectedAttributes: prevState.selectedAttributes.set(attribute, isChecked) }));
    }

    handleSave(e) {
        e.preventDefault();
        let passAttributes = [];
        this.state.selectedAttributes.forEach((v, k) => {
            if (v === true)
                passAttributes.push(parseInt(k));
        })
        this.props.onSave({ name: this.state.name, room: this.state.room === "" ? null : this.state.room, quantity: parseInt(this.state.quantity), attributes: passAttributes });
    }

    render() {
        const isEdit = this.props.edit;

        return <div className="resourcemanager-form">

            <div className="form-group">
                <h2 className="text-center">{isEdit === true ? "Edytowanie" : "Dodawanie"} zasobu</h2>

                <div className="form-group">
                    Nazwa zasobu
                        <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="nazwa"
                        value={this.state.name}
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>

                <div className="form-group">
                    Pokój
                    <Select //TODO: kolor
                        name="room"
                        displayEmpty={true}
                        value={this.state.room}
                        className="form-control"
                        onChange={(e) => this.handleChange(e)}
                    >
                        <MenuItem value={""}>---</MenuItem>
                        {this.state.rooms.map((x) => {
                            return <MenuItem key={x.id} value={x.id} > {x.name}</MenuItem>
                        })}
                    </Select>
                </div>


                <div className="form-group">
                    Ilość
                    <div>
                        <CssTextField
                            name="quantity"
                            type="number"
                            value={this.state.quantity}
                            inputProps={{ min: "1", step: "1", style: { textAlign: 'center' } }}
                            onChange={(e) => this.handleChange(e)}
                            variant="outlined"

                        />
                    </div>
                </div>

                {this.state.attributes.map((x) => {
                    return <FormControlLabel key={x.id}
                        control={< Checkbox value={x.id} onChange={(e) => this.handleCheckbox(e)} />}
                        label={x.name}
                    />

                })}

                <button type="submit" className="btn btn-primary btn-block" onClick={(e) => this.handleSave(e)}>
                    Zapisz zasób
                        </button>
            </div>

        </div >
    }
}