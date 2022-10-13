import { Button } from 'react-bootstrap';
import './sendButtons.css'

const getVariant = (game, chosenFigure) => game.isYourTurn && chosenFigure ? "success" : "outline-secondary"

const getClassName = (game) => `chooseFigureButton ${game.isYourTurn ? '' : 'hide'}`

const isDisabled = (game, chosenFigure) => (game.numberOfRoll === 0) || !chosenFigure || !game.isYourTurn

const getText = (game, chosenFigure) => {
    if(!game.isYourTurn) {
        return ""
    }else if(game.numberOfRoll === 0) {
        return "You have to roll all dice"
    } else if(chosenFigure) {
        return "Save figure"
    } else {
        return "Choose figure to save"
    }
}

export default props => <Button 
    onClick={props.chooseFigure} 
    variant={getVariant(props.game, props.chosenFigure)}
    className={getClassName(props.game) }
    disabled={isDisabled(props.game, props.chosenFigure)}>
        {getText(props.game, props.chooseFigure)}
</Button>