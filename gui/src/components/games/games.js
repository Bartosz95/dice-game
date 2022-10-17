import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import './games.css'

import SingleGameDiv from './singleGameDiv'
import CreateDiv from './createDiv'
import AlertMessage from '../alerts/AlertMessage'
import useHttpRequest from '../../hooks/useHttpRequest';

export default props => {

  const [ games, setGames ] = useState([])
  const [ deleteMessage, setDeleteMessage ] = useState(null)
  const { alertMessage, renderContent, fetchData, setAlertMessage } = useHttpRequest()

  useEffect(() => {
    setTimeout(() => setDeleteMessage(null), 7000)
    fetchData({ url: `${props.config.DICE_GAME_API}/game` }, props.keycloak, body => setGames(body))
  }, [props.keycloak.authenticated, deleteMessage] )

  const deleteGame = async id => {
    const requestOptions = {
      url: `${props.config.DICE_GAME_API}/game/${id}`,
      method: 'DELETE'
    };
    fetchData(requestOptions, props.keycloak, body => setDeleteMessage(body))
  }

  const gamesDiv = games.map(game => <SingleGameDiv key={game._id} game={game} deleteGame={deleteGame}/>)

  const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''

  const content = games.length > 0 ? gamesDiv : <CreateDiv/>

  return <Container className="mainContainer">
    {alert}
    {deleteMessage ? <AlertMessage elems={deleteMessage} /> : ''}
    {renderContent ? content : '' }
  </Container>
}