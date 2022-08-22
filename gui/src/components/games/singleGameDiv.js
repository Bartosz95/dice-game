import React from 'react';
import { ListGroup, Button, Form, Badge } from 'react-bootstrap';
import dateFormat, { masks } from "dateformat";

import './games.css'

export default props => {

  const isChecked = props.game.checked || false

  const date = new Date(props.game.createdAt)
  const dateText = dateFormat(date, "d.mm.yyyy hh:MM")

  const deleteGame = async () => {
    try {
      if(props.keycloak.authenticated) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.keycloak.token}`
            }
        };
        const response = await fetch(`${props.config.DICE_GAME_API}/game/${props.game._id}`, requestOptions)
        const body = await response.json();
      }
    } catch (err) {
        console.log(err)
    }
  }

  const gameName = <div className='name'>{props.game.name}</div>

  const turn = <Badge pill bg="secondary" className='turnInfo'>{props.game.numberOfTurn}</Badge>

  const gameDate = <div className='gameDate'>{dateText}</div>

  const players = <div><div className="playersLabelText">Players:<br/></div><ListGroup variant="flush">{props.game.players.map(player => <ListGroup.Item key={props.game._id+player._id} className={`${props.game.isYourTurn ? 'isYourTurnSingleGameDiv' :''}`}>{player.username}</ListGroup.Item>)}</ListGroup></div>

  const playBtn = <Button variant="outline-success" className="playBtn" href={`/${props.game._id}`} disabled={props.game.isActive ? false : true}>Play</Button>

  const deleteBtn = <Button variant="outline-danger" className="deleteBtn" onClick={deleteGame}>Delete</Button>

  return <div key={props.game._id} className={`gameInfo ${props.game.isYourTurn ? 'isYourTurnSingleGameDiv' :''} ${isChecked ? '' : 'isChecked'}`}>
    {gameName}
    {turn}
    {gameDate}
    {players}
    {playBtn}
    {deleteBtn}
  </div>
}