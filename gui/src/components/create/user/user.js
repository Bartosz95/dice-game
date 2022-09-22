import React from "react"
import { Button } from 'react-bootstrap';

export default props => <Button
    onClick={() => props.selectUser(props.user_props)} 
    variant={ props.user_props.selected ? "secondary" : "outline-secondary"}
    id={props.user_props.id}
    className={`user${props.user_props.selected ? "" : ""} `}>
    {props.user_props.username}
</Button>
