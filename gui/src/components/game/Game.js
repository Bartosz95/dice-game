import { useState, useEffect, Fragment } from 'react';
import { Container,  Row, Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import useHttpRequest from '../../hooks/useHttpRequest'
import { useSelector } from 'react-redux';

import './game.css'
import Dice from './dice/dice'
import GameTable from './table/GameTable'
import AlertMessage from '../alerts/AlertMessage'
import WinMessage from "./WinMessage";
import RollTheDicesButton from "./RollTheDicesButton"
import ChooseFigureButton from './ChooseFigureButton';
import TurnInfo from './TurnInfo';

export default () => {

    const { gameID } = useParams()
    
    const { DICE_GAME_API }  = useSelector(state => state.config);

    const defaultGameParam = {
        currentPlayer: '',
        gameID: '',
        indexOfFirstPlayer: 0,
        isActive: true,
        isYourTurn: true,
        mug: [],
        name: '' ,
        numberOfRoll: 0,
        numberOfTurn: 0,
        playerIDs:[],
        players: []
    }

    const [ game, setGame ] = useState(defaultGameParam)
    const [ dicesToChange, setDicesToChange ] = useState([])
    const [ chosenFigure, setChosenFigure ] = useState(null)
    const [ notReload, setNotReload ] = useState(false)
    const { alertMessage, renderContent, fetchData } = useHttpRequest()
    

    const setupGameCallback = body => {

        const { game: newGame, _id: gameID } = body
        
        const players = []
        for (const [id, value] of Object.entries(newGame.players)) {
            players.push({
                id,
                username: value.username,
                table: value.table,
            })
        }
        const mug = []
        for (const [id, value] of Object.entries(newGame.mug)) {
            mug.push({
                id,
                value: value,
                roll: false
            })
        }
        setGame({...newGame, mug, players, gameID: gameID || game.gameID})
        setDicesToChange([])
        setChosenFigure(null)
    }

    useEffect(() => {
        fetchData({ url: `${DICE_GAME_API}/game/${gameID}` }, setupGameCallback)
    }, [DICE_GAME_API, fetchData]);

    const markDiceToRoll = diceID => {
        if((game.numberOfRoll === 0) || (game.numberOfRoll === 3)) 
            return;
        
        const newDicesToChange = dicesToChange.includes(diceID) ? dicesToChange.filter(dice => dice !== diceID) : dicesToChange.concat(diceID)
        setDicesToChange(newDicesToChange) 
    }

    const setupNewMug = body => {

        const mug = []
        for (const [id, value] of Object.entries(body.game.mug)) {
            mug.push({
                id,
                value: value,
                roll: false
            })
        }
        setGame(game => { return {...game, mug, numberOfRoll: body.game.numberOfRoll } })
        setDicesToChange([])
        setChosenFigure(null)
        setNotReload(false)
    }

    const rollTheDices = () => {
        const requestOptions = {
            url: `${DICE_GAME_API}/game/${game.gameID}`,
            method: 'POST',
            body: { dicesToChange: dicesToChange }
        };
        setNotReload(true)
        fetchData(requestOptions, setupNewMug)
        

    }

    const markFigureTochoose = figureID => {
        setChosenFigure(chosenFigure === figureID ? null : figureID)
    }

    const chooseFigure = async () =>  {
        const requestOptions = {
            url: `${DICE_GAME_API}/game/${game.gameID}`,
            method: 'POST',
            body: { chosenFigure: chosenFigure }
        };
        fetchData(requestOptions, setupGameCallback)
    }

    const alertDiv = alertMessage && <AlertMessage elems={alertMessage} />

    const tablDiv = <GameTable 
        chosenFigure={chosenFigure} 
        game={game}
        markFigureTochoose={markFigureTochoose}
    />

    const dicesDiv = !(game.numberOfTurn === 0 && game.numberOfRoll === 0) && game.mug.map(dice => <Dice 
        key={dice.id}
        dice_props={dice}
        isYourTurn={game.isYourTurn}
        numberOfRoll={game.numberOfRoll}
        markDiceToRoll={markDiceToRoll}
    />)

    const playDiv = <Fragment>
        <Fragment>
            <div className="gameName">{game.gameName}</div>
            <TurnInfo numberOfRoll={game.numberOfRoll} numberOfTurn={game.numberOfTurn}/>
        </Fragment>
        <div className="dices">{dicesDiv}</div>
        <div className='buttonsDiv'>
            <RollTheDicesButton
                isYourTurn={game.isYourTurn}
                numberOfRoll={game.numberOfRoll}
                isAnyDiceSelected={dicesToChange.length !== 0}
                isFigureSelected={!!chosenFigure}
                rollTheDices={rollTheDices}
            />
            <ChooseFigureButton 
                isYourTurn={game.isYourTurn}
                numberOfRoll={game.numberOfRoll}
                isFigureSelected={!!chosenFigure}
                chooseFigure={chooseFigure}
            />
        </div>
    </Fragment>

    const winMessageDiv = <WinMessage elems={game.players} />

    const content = <Row>
        <Col>{game.isActive ? playDiv : winMessageDiv}</Col>
        <Col>{tablDiv}</Col>
    </Row>

    return <Container fluid className="mainContainer dice-game-container">
        {alertDiv}
        {renderContent || notReload ? content : <div className="spinner"><Spinner animation="border" variant="secondary" /></div> }
    </Container>
}