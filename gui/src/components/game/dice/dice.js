import React from "react"
import { Button } from 'react-bootstrap';
import './dice.css'

export default props => <Button onClick={() => props.markDiceToRoll(props.dice_props.id)} 
    variant={((props.numberOfRoll === 0) || (props.numberOfRoll === 3)) ? "outline-secondary" : "success" } 
    className={` dice${props.dice_props.roll ? ' diceToRoll' : ''}`}
    id={props.dice_props.id}
    disabled={(props.numberOfRoll === 0) || (props.numberOfRoll === 3)} >
    {props.dice_props.value}
</Button>
