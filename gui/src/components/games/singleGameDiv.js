import React from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';

import './games.css'

export default props => {

  console.log(props)

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

  const gameName = <h1>{props.game.name}</h1>

  const players = <div>Players:<br/><ListGroup variant="flush">{props.game.players.map(player => <ListGroup.Item key={props.game._id+player._id}>{player.username}</ListGroup.Item>)}</ListGroup></div>

  const playBtn = <Button variant="outline-success" className="playBtn" href={`/${props.game._id}`} disabled={props.game.isActive ? false : true}>Play</Button>

  const deleteBtn = <Button variant="outline-danger" className="deleteBtn" onClick={deleteGame}>Delete</Button>

  return <div key={props.game._id} className="gameInfo">
    {gameName}
    {players}
    {playBtn}
    {deleteBtn}
  </div>
}