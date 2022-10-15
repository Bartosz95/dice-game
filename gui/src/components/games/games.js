import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import './games.css'

import SingleGameDiv from './singleGameDiv'
import CreateDiv from './createDiv'
import AlertMessage from '../alerts/AlertMessage'
import useHttpRequest from '../../hooks/useHttpRequest';

export default props => {

  const [games, setGames] = useState([])
  const { alertMessage, renderContent, fetchData } = useHttpRequest()

  const getGames = async () => {
    const requestOptions = {
      url: `${props.config.DICE_GAME_API}/game`,
    };
    fetchData(requestOptions, props.keycloak, body => setGames(body))
  }

  const deleteGame = async id => {
    const requestOptions = {
      url: `${props.config.DICE_GAME_API}/game/${id}`,
      method: 'DELETE'
    };
    fetchData(requestOptions, props.keycloak, body => window.location.reload(false))
  }

  useEffect(() => { getGames() }, [props.keycloak.authenticated])

  const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''  

  const gamesDiv = games.map(game => <SingleGameDiv key={game._id} game={game} deleteGame={deleteGame}/>)

  const content = games.length > 0 ? gamesDiv : <CreateDiv/>

  return <Container className="mainContainer">
    {alert}
    {renderContent ? content : '' }
  </Container>
}