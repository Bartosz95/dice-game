import { Button } from 'react-bootstrap';
import './dice.css'

export default props => <Button
    id={props.dice_props.id}
    onClick={() => props.markDiceToRoll(props.dice_props.id)}
    variant={((props.numberOfRoll === 0) || (props.numberOfRoll === 3)) ? "outline-secondary" : props.isYourTurn ? "success" : "outline-secondary" } 
    className={`dice${props.dicesToChange.includes(props.dice_props.id) ? ' diceToRoll' : ''}`}
    disabled={(props.numberOfRoll === 0) || (props.numberOfRoll === 3) || !props.isYourTurn} >
    {props.dice_props.value}
</Button>
