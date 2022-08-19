import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';

import './games.css'

import GameInfo from './gameInfo'
import CreateInfo from './createInfo'
import AlertMessage from '../alerts/AlertMessage'

export default props => {

  const [games, setGames] = useState([])
  const [alertMessage, setAlertMessage] = useState(null)

  const getGames = async () => {
    try {
      if(props.keycloak.authenticated && games.length === 0) {
        const requestOptions = {
          headers: {
              'Authorization': `Bearer ${props.keycloak.token}`
          }
        };
        const response = await fetch(`${props.config.DICE_GAME_API}/game`, requestOptions)
        const body = await response.json()
        if((body.level === 'warning') || (body.level === 'error')) {
          return setAlertMessage(body)
        }
        setGames([...body,...body,...body,...body,...body])
      }
    } catch (err) {
      console.log(err)
      setAlertMessage(err)
    }
    
  }

  useEffect(() => { getGames() })

  const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''  

  const gamesDiv = games.map(game => <GameInfo key={game._id} game={game} keycloak={props.keycloak} />)

  return <Container className="mainContainer">
    {alert}
    { games.length > 0 ? gamesDiv : <CreateInfo/> }
  </Container>
}