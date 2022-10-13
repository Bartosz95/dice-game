import { Button } from 'react-bootstrap';
import './sendButtons.css'

const isActive = (game, dicesToChange) => {
    if(!game.isYourTurn) {
        return false
    } else if(game.numberOfRoll === 3) {
        return false
    } else if ((dicesToChange.length === 0) && game.numberOfRoll !== 0) {
        return false
    } else return true
}

const getVariant = (game, dicesToChange) => isActive(game, dicesToChange) ?  "success" : "outline-secondary"

const getClassName = (game) => `rollTheDicesButton ${game.isYourTurn ? '' : 'hide'}`

const isDisabled = (game, dicesToChange) => !isActive(game, dicesToChange)

const getText = (game, dicesToChange, chosenFigure) => {
    if(!game.isYourTurn) {
        return ''
    } else if(game.numberOfRoll === 3) {
        return "You don't have next roll" 
    } else if(chosenFigure) {
        return "You cannot roll dice if you choose a figure"
    } else if(game.numberOfRoll === 0) {
        return "Roll all dice" 
    } else if (dicesToChange.length === 0 ) {
        return "Choose dice to roll"
    } else if (game.numberOfRoll === 1) {
        return "Roll dice secound time"
    } else if (game.numberOfRoll === 2){
        return "Roll dice last time"
    } else {
        return ""
    }
}

export default props => <Button 
    onClick={props.rollTheDices} 
    variant={getVariant(props.game, props.dicesToChange)}
    className={getClassName(props.game, props.dicesToChange)}
    disabled={isDisabled(props.game, props.dicesToChange)}>
        {getText(props.game, props.dicesToChange, props.chosenFigure)}
</Button>
