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

  const a = (body) => {
    console.log(body)
    setGames(body)
  }
  useEffect(() => {
    console.log(props.keycloak.authenticated)
    fetchData({ url: `${props.config.DICE_GAME_API}/game` }, props.keycloak, a)
  }, [props.keycloak.authenticated] )

  const deleteGame = async id => {
    const requestOptions = {
      url: `${props.config.DICE_GAME_API}/game/${id}`,
      method: 'DELETE'
    };
    fetchData(requestOptions, props.keycloak, body => window.location.reload(false))
  }

  const gamesDiv = games.map(game => <SingleGameDiv key={game._id} game={game} deleteGame={deleteGame}/>)

  const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''

  const content = games.length > 0 ? gamesDiv : <CreateDiv/>

  return <Container className="mainContainer">
    {alert}
    {renderContent ? content : '' }
  </Container>
}