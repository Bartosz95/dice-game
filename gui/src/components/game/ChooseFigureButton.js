import { useEffect, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import './sendButtons.css'

const reducer = (previousState, action) => {

    if (action.isFigureSelected) {
        return { 
            variant: "success",
            className: "chooseFigureButton",
            disabled: false,
            isFigureSelected: true,
            value: "Save figure"
        }
    } else {
        return { 
            variant: "outline-secondary",
            className: "chooseFigureButton",
            disabled: true,
            isFigureSelected: false,
            value: "Choose figure to save"
        }  
    }
}

const getInitialState = (props) => {

    const { isYourTurn, numberOfRoll } = props.game

    if(!isYourTurn) {
        return {
            variant: "outline-secondary",
            className: "chooseFigureButton hide",
            disabled: true,
            isFigureSelected: false,
            value: "",
        }
    } else if (numberOfRoll === 0) {
        return { 
            variant: "outline-secondary",
            className: "chooseFigureButton",
            disabled: true,
            isFigureSelected: false,
            value: "You have to roll all dice" 
        }
    } else {
        return { 
            variant: "outline-secondary",
            className: "chooseFigureButton",
            disabled: true,
            isFigureSelected: false,
            value: "Choose figure to save",
        }  
    }
}

export default props => {

    const [state, dispatch ] = useReducer(reducer, getInitialState(props))

    useEffect(() => {
        if(props.game.numberOfRoll !== 0) {
            dispatch({type: "SELECT_FIGURE", isFigureSelected: props.isFigureSelected})
        }
    }, [ props.game.numberOfRoll, props.isFigureSelected ])

    return <Button 
        variant={state.variant}
        className={state.className}
        disabled={state.disabled}
        onClick={props.chooseFigure}>
            {state.value}
    </Button> 
}