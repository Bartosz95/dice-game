import React from 'react';
import { Accordion, Button } from 'react-bootstrap';

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
        const userInfo = await props.keycloak.loadUserInfo()
        const response = await fetch(`${process.env.REACT_APP_DICE_GAME_API}/user/${userInfo.sub}/game/${props.game._id}`, requestOptions)
        const body = await response.json();
      }
    } catch (err) {
        console.log(err)
    }
  }

  return <Accordion.Item eventKey={props.game._id}>
    <Accordion.Header>Game {props.game._id}</Accordion.Header>
    <Accordion.Body>
      {props.game.isActive ? "Active" : "Disactive"}<br/>
      Players: {props.game.playerIDs.join(', ')}<br/>
      <Button variant="outline-success"  href={`/${props.game._id}`} >Play</Button>
      <Button variant="outline-danger" onClick={deleteGame}>Delete</Button>{' '}
    </Accordion.Body>
  </Accordion.Item>
}