import React from "react"
import { Button } from 'react-bootstrap';
import './user.css'

export default props => {
    return <Button
    onClick={() => props.selectUser(props.user_props)} 
    variant={ props.user_props.selected ? "outline-success" : "outline-secondary"}
    id={props.user_props.id}
    className="user">
    {props.user_props.username}
</Button>}
