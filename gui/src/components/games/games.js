import React, { useState, useEffect } from 'react';
import { Container, Accordion, Button } from 'react-bootstrap';

import GameInfo from './gameInfo'

export default props => {

  const [games, setGames] = useState([])

  const getGames = async () => {
    try {
      if(props.keycloak.authenticated && games.length === 0) {
        const userInfo = await props.keycloak.loadUserInfo()
        console.log(props.keycloak)
        console.log(props.keycloak.token)
  
        const requestOptions = {
          headers: {
              'Authorization': `Bearer ${props.keycloak.token}`
          }
        };
        const response = await fetch(`${process.env.REACT_APP_DICE_GAME_API}/user/${userInfo.sub}/game`, requestOptions)
        const body = await response.json()
        setGames(body)
      }
    } catch (err) {
      console.log(err)
    }
    
  }

  useEffect(() => { getGames() })

  return <Container>
    <Accordion>
      { games.length > 0 ? games.map(game => <GameInfo key={game._id} game={game} keycloak={props.keycloak} />) : <Button variant="outline-success" href='/create' >Create game</Button> }
    </Accordion>
  </Container>
}