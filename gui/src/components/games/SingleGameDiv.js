import { ListGroup, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";

import classes from "./games.module.css";

const SingleGameDiv = (props) => {
  const { checked, _id, isYourTurn, isActive, createdAt } = props.game;
  const navigate = useNavigate();

  const style = [
    classes.gameInfo,
    isYourTurn && classes.isYourTurnSingleGameDiv,
    checked && classes.isChecked,
  ];

  console.log(style.join(" "));

  const game = {
    ...props.game,
    dateText: dateFormat(new Date(createdAt), "d.mm.yyyy hh:MM"),
    playerClassName: isYourTurn && classes.isYourTurnSingleGameDiv,
    className: style.join(" "),
    disabled: !isActive,
  };

  return (
    <div key={game._id} className={game.className}>
      <div className={classes.name}>{game.name}</div>

      <Badge pill bg="secondary" className={classes.turnInfo}>
        {game.numberOfTurn}
      </Badge>

      <div className={classes.gameDate}>{game.dateText}</div>

      <div className={classes.playersLabelText}>
        Players:
        <br />
      </div>
      <ListGroup variant="flush">
        {" "}
        {game.players.map((player) => (
          <ListGroup.Item
            key={game._id + player._id}
            className={game.playerClassName}
          >
            {player.username}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Button
        variant="outline-success"
        className={classes.playBtn}
        onClick={() => navigate(`/games/${game._id}`)}
        disabled={game.disabled}
      >
        Play
      </Button>

      <Button
        variant="outline-danger"
        className={classes.deleteBtn}
        onClick={() => props.deleteGame(_id)}
      >
        Delete
      </Button>
    </div>
  );
};

export default SingleGameDiv;
