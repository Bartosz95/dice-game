import { useEffect, useReducer } from "react";
import { Button } from "react-bootstrap";

import classes from "./dice.module.css";

const reducer = (previousState, action) => {
  const style = [classes.dice, !previousState.isSelected && classes.diceToRoll];
  switch (action.type) {
    case "SELECT_DICE":
      return {
        ...previousState,
        isSelected: !previousState.isSelected,
        className: style.join(" "),
      };
    case "SET_STATE":
      return action.state;
    default:
      return previousState;
  }
};

const getInitialState = (props) => {
  if (
    props.numberOfRoll === 0 ||
    props.numberOfRoll === 3 ||
    !props.isYourTurn
  ) {
    return {
      id: props.dice_props.id,
      value: props.dice_props.value,
      isSelected: false,
      variant: "outline-secondary",
      className: classes.dice,
      disabled: true,
    };
  } else {
    return {
      id: props.dice_props.id,
      value: props.dice_props.value,
      isSelected: false,
      variant: "success",
      className: classes.dice,
      disabled: false,
    };
  }
};

const Dice = (props) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(props));

  const clickAction = (e) => {
    dispatch({ type: "SELECT_DICE" });
    props.markDiceToRoll(state.id);
    e.target.blur();
  };

  useEffect(
    () => dispatch({ type: "SET_STATE", state: getInitialState(props) }),
    [props.numberOfRoll]
  );

  return (
    <Button
      id={state.id}
      variant={state.variant}
      className={state.className}
      disabled={state.disabled}
      onClick={clickAction}
    >
      {state.value}
    </Button>
  );
};

export default Dice;
