import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import './games.css'

import SingleGameDiv from './singleGameDiv'
import CreateDiv from './createDiv'
import AlertMessage from '../alerts/AlertMessage'

export default props => {

  const [games, setGames] = useState([])
  const [alertMessage, setAlertMessage] = useState(null)
  const [renderContent, setRenderContent] = useState(false)

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
        setGames(body)
        setRenderContent(true)
      }
    } catch (err) {
      console.log(err)
      setAlertMessage(err)
    }
    
  }

  
  useEffect(() => { getGames() })

  const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''  

  const gamesDiv = games.map(game => <SingleGameDiv key={game._id} game={game} keycloak={props.keycloak} />)

  const content = games.length > 0 ? gamesDiv : <CreateDiv/>

  return <Container className="mainContainer">
    {alert}
    {renderContent ? content : '' }
  </Container>
}