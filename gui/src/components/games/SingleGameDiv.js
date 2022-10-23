import { ListGroup, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import dateFormat from "dateformat";

import './games.css'

export default props => {

  const { checked, _id, isYourTurn, isActive, createdAt } = props.game
  const navigate = useNavigate();

  const game = { 
    ...props.game,
    dateText: dateFormat(new Date(createdAt), "d.mm.yyyy hh:MM"),
    playerClassName: isYourTurn ? 'isYourTurnSingleGameDiv' : '',
    className: `gameInfo ${isYourTurn ? 'isYourTurnSingleGameDiv' : ''} ${checked ? 'isChecked' : ''}`,
    disabled: !isActive
  }

  return <div key={game._id} className={game.className}>
      
      <div className='name'>{game.name}</div>
      
      <Badge pill bg="secondary" className='turnInfo'>{game.numberOfTurn}</Badge>

      <div className='gameDate'>{game.dateText}</div>

      <div className="playersLabelText">Players:<br/></div>
      <ListGroup variant="flush"> { game.players.map(player => 
      <ListGroup.Item 
        key={game._id+player._id} 
        className={game.playerClassName}>
          {player.username}
        </ListGroup.Item>
      )}</ListGroup>
      
      <Button variant="outline-success" className="playBtn" onClick={() => navigate(`/games/${game._id}`)} disabled={game.disabled}>Play</Button>
      
      <Button variant="outline-danger" className="deleteBtn" onClick={() => props.deleteGame(_id)}>Delete</Button>
  </div>
}