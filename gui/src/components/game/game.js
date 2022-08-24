import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Badge } from 'react-bootstrap';

import './game.css'
import Dice from './dice/dice'
import GameTable from './table/GameTable'
import AlertMessage from '../alerts/AlertMessage'
import WinMessage from "./winMessage/WinMessage";

export default props => {

    const [ currentUser, setCurrentUser] = useState({})
    const [ currentPlayer, setCurrentPlayer] = useState('')
    const [ currentPlayerUsername, setCurrentPlayerUsername] = useState('')
    const [ isYourTurn, setIsYourTurn ] = useState(false)
    const [ isActive, setIsActive] = useState(true)
    const [ mug, setMug] = useState([])
    const [ numberOfRoll, setNumberOfRoll] = useState(null)
    const [ numberOfTurn, setNumberOfTurn] = useState(null)
    const [ players, setPlayers] = useState([])
    const [ gameID, setGameID] = useState(null)
    const [ gameName, setGameName] = useState('')
    const [ dicesToChange, setDicesToChange] = useState([])
    const [ chosenFigure, setChosenFigure] = useState(null)
    const [ alertMessage, setAlertMessage] = useState(null)
    const [ renderGame, setRenderGame] = useState(false)

    const getGame = async (force) => {
        try {
            if(props.keycloak.authenticated && (force || currentPlayer === '' || !isYourTurn)) {

                const userInfo = await props.keycloak.loadUserInfo()
                setCurrentUser(userInfo)

                const gameID = window.location.pathname.split('/').at(-1)
                setGameID(gameID)
                const requestOptions = {
                    headers: {
                        'Authorization': `Bearer ${props.keycloak.token}`
                    }
                };
                const response = await fetch(`${props.config.DICE_GAME_API}/game/${gameID}`, requestOptions)
                let body = await response.json();
                if((body.level === 'warning') || (body.level === 'error')) {
                    setRenderGame(false)
                    return setAlertMessage(body)
                } else if(!body._id) {
                    throw new Error('Somting went wrong, try later.')
                } else {
                    setRenderGame(true)
                }
                
                const game = body.game
                const players = []
                for (const [playerID, value] of Object.entries(game.players)) {
                    players.push({
                        id: playerID,
                        username: value.username,
                        table: value.table,
                    })
                }
                const mug = []
                for (const [gameID, value] of Object.entries(game.mug)) {
                    mug.push({
                        id: gameID,
                        value: value,
                        roll: false
                    })
                }
                setGameName(game.name)
                setCurrentPlayer(game.currentPlayer)
                setCurrentPlayerUsername(game.players[game.currentPlayer].username)
                setIsYourTurn(game.currentPlayer === userInfo.sub)
                setIsActive(game.isActive)
                setNumberOfRoll(game.numberOfRoll)
                setNumberOfTurn(game.numberOfTurn)
                setPlayers(players)

                setMug(mug)
                setDicesToChange([])
                setChosenFigure(null)
            }
        } catch (err) {
            console.log(err)
            setRenderGame(false)
            return setAlertMessage(err)
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            getGame()
        }, 2000);
        return () => clearInterval(interval);
      },[props, currentPlayer, isYourTurn]);

    const markDiceToRoll = diceID => {
        if((numberOfRoll === 0) || (numberOfRoll === 3)) 
            return;
        
        const newDicesToChange = dicesToChange.includes(diceID) ? dicesToChange.filter(dice => dice !== diceID) : dicesToChange.concat(diceID)
        setDicesToChange(newDicesToChange) 

        const dice = mug.find(dice => dice.id === diceID)
        dice.roll = !dice.roll
        setMug(mug)
    }

    const rollTheDices = async () => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.keycloak.token}`
                },
                body: JSON.stringify({ numbersToChange: dicesToChange })
            };
            // todo change playerID and gameID later 
            const response = await fetch(`${props.config.DICE_GAME_API}/game/${gameID}`, requestOptions)
            const body = await response.json();
            if((body.level === 'warning') || (body.level === 'error')) {
                return setAlertMessage(body)
            } 
            getGame(true)
        
        } catch (err) {
            console.log(err)
            setAlertMessage(err.message)
        }
    }

    const markFigureTochoose = async (figureID) => {
        setChosenFigure(chosenFigure === figureID ? null : figureID)
    }

    const chooseFigure = async () =>  {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.keycloak.token}`
                },
                body: JSON.stringify({ chosenFigure: chosenFigure })
            };
            // todo change playerID and gameID later 
            const response = await fetch(`${props.config.DICE_GAME_API}/game/${gameID}`, requestOptions)
            const body = await response.json();
            if((body.level === 'warning') || (body.level === 'error')) {
                return setAlertMessage(body)
            }
            getGame(true)
        } catch (err) {
            console.log(err)
            setAlertMessage(err.message)
        }
    }

    const rollTheDicesButtonText = () => {
        if(!isYourTurn) {
            return ''
        } else if(numberOfRoll === 3) {
            return "You don't have next roll" 
        } else if(chosenFigure) {
            return "You cannot roll dices if you choose a figure"
        } else if(numberOfRoll === 0) {
            return "Roll all dices" 
        } else if (dicesToChange.length === 0 ) {
            return "Choose dices to roll"
        } else if (numberOfRoll === 1) {
            return "Roll dices secound time"
        } else if (numberOfRoll === 2){
            return "Roll dices last time"
        } else {
            return ""
        }
    }

    const isRollTheDicesBtnActive = () => {
        if(!isYourTurn) {
            return false
        } else if(numberOfRoll === 3) {
            return false
        } else if ((dicesToChange.length === 0) && numberOfRoll !== 0) {
            return false
        } else return true
    }

    const chooseFigureButtonText = () => {
        if(!isYourTurn) {
            return ""
        }else if(numberOfRoll === 0) {
            return "You have to roll all dices"
        } else if(chosenFigure) {
            return "Save figure"
        } else {
            return "Choose figure to save"
        }
    }

    const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''

    const gameNameDiv = <div className="gameName">{gameName}</div>

    const numberOfRollText = <div className="numberOfRoll">Roll: {numberOfRoll}</div>

    const numberOfTurnText = <div className="turn" >Turn: {numberOfTurn}</div>

    const turnInfoDiv = <Badge pill bg="light" text="dark" className="turnInfoDiv">{numberOfRollText}<br/>{numberOfTurnText}</Badge>

    const winMessage = <WinMessage elems={players} />

    const table =<GameTable 
            players={players}
            numberOfRoll={numberOfRoll}
            currentUser={currentUser}
            currentPlayer={currentPlayer}
            isYourTurn={isYourTurn}
            chosenFigure={chosenFigure} 
            markFigureTochoose={markFigureTochoose.bind(this)}
    />

    const dices = mug.map(dice => <Dice 
        key={dice.id}
        isYourTurn={isYourTurn}
        dice_props={dice}
        numberOfRoll={numberOfRoll} 
        markDiceToRoll={markDiceToRoll.bind(this)}
    />)

    const rollTheDicesButton = <Button 
        onClick={rollTheDices.bind(this)} 
        variant={ isRollTheDicesBtnActive() ?  "success" : "outline-secondary"}
        className={`rollTheDicesButton ${isYourTurn ? '' : 'hide'}`}
        disabled={!isRollTheDicesBtnActive()}>
        {rollTheDicesButtonText()}
    </Button>

    const chooseFigureButton = <Button 
        onClick={chooseFigure.bind(this)} 
        variant={ isYourTurn && chosenFigure ? "success" : "outline-secondary"}
        className={`chooseFigureButton ${isYourTurn ? '' : 'hide'}`}
        disabled={(numberOfRoll === 0) || !chosenFigure || !isYourTurn}>
        {chooseFigureButtonText()}
    </Button>

    const play = <div>
        <div>
            {gameNameDiv}
            {turnInfoDiv}
        </div>
        <div className="dices">{numberOfTurn === 0 && numberOfRoll === 0 ? '' : dices}</div>
        <div className='buttonsDiv'>{rollTheDicesButton}{chooseFigureButton}</div>
        
        
    </div>

    const game = <Row>
        <Col>{isActive ? play : winMessage}</Col>
        <Col>{table}</Col>
    </Row>

    return <Container fluid className="mainContainer dice-game-container">
        {alert}
        {renderGame ? game : '' }
        
    </Container>
}