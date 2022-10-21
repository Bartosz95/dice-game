import { Fragment } from 'react';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import dateFormat from "dateformat";

import './games.css'

export default props => {

  const { checked, _id, isYourTurn, isActive, createdAt } = props.game

  const game = { 
    ...props.game,
    dateText: dateFormat(new Date(createdAt), "d.mm.yyyy hh:MM"),
    playerClassName: isYourTurn ? 'isYourTurnSingleGameDiv' : '',
    className: `gameInfo ${isYourTurn ? 'isYourTurnSingleGameDiv' : ''} ${checked ? 'isChecked' : ''}`,
    disabled: !isActive
  }
  
  const playersDiv = <Fragment>
    <div className="playersLabelText">Players:<br/></div>
    <ListGroup variant="flush"> { game.players.map(player => 
      <ListGroup.Item 
        key={game._id+player._id} 
        className={game.playerClassName}>
          {player.username}
        </ListGroup.Item>
      )}</ListGroup>
  </Fragment>

  return <div key={game._id} className={game.className}>
      <div className='name'>{game.name}</div>
      <Badge pill bg="secondary" className='turnInfo'>{game.numberOfTurn}</Badge>
      <div className='gameDate'>{game.dateText}</div>
      {playersDiv}
      <LinkContainer to={`/game/${game._id}`}>
        <Button variant="outline-success" className="playBtn" disabled={game.disabled}>Play</Button>
      </LinkContainer>
      <Button variant="outline-danger" className="deleteBtn" onClick={() => props.deleteGame(_id)}>Delete</Button>
  </div>
}