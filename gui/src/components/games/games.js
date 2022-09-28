import { useState, useEffect } from 'react';
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
        if((body.level === 'warning') || (body.level === 'error') || (body.level === "info")) {
          return setAlertMessage(body)
        }
        setGames(body)
        setAlertMessage(null)
        setRenderContent(true)
      }
    } catch (err) {
      console.log(err)
      setAlertMessage(err)
    } 
  }

  const deleteGame = async id => {
    try {
      if(props.keycloak.authenticated) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.keycloak.token}`
            }
        };
        const response = await fetch(`${props.config.DICE_GAME_API}/game/${id}`, requestOptions)
        const body = await response.json();
        window.location.reload(false);
      }
    } catch (err) {
        console.log(err)
    }
  }

  useEffect(() => { getGames() })

  const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''  

  const gamesDiv = games.map(game => <SingleGameDiv key={game._id} game={game} deleteGame={deleteGame}/>)

  const content = games.length > 0 ? gamesDiv : <CreateDiv/>

  return <Container className="mainContainer">
    {alert}
    {renderContent ? content : '' }
  </Container>
}