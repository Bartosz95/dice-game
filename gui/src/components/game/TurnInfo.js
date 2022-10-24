import { Badge } from "react-bootstrap";
import classes from "./turnInfo.module.css";

const TurnInfo = (props) => (
  <Badge pill bg="light" text="dark" className={classes.turnInfoDiv}>
    <div className={classes.numberOfRoll}>Roll: {props.numberOfRoll}</div>
    <br />
    <div className={classes.turn}>Turn: {props.numberOfTurn}</div>
  </Badge>
);

export default TurnInfo;
