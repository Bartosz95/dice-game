import React from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';

import './games.css'

export default props => {

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

  console.log(props)

  const players = <ListGroup variant="flush">{props.game.playerIDs.map(player => <ListGroup.Item key={player}>player</ListGroup.Item>)}</ListGroup>

  const playBtn = <Button variant="outline-success" className="playBtn" href={`/${props.game._id}`} disabled={props.game.isActive ? false : true}>Play</Button>

  const deleteBtn = <Button variant="outline-danger" className="deleteBtn" onClick={deleteGame}>Delete</Button>

  return <p key={props.game._id} className="gameInfo">
    Game {props.game.name}<br/>
    Players: 
    {players}
    {playBtn}
    {deleteBtn}
    
  </p>
}