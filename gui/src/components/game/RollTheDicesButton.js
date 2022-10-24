import { useEffect, useReducer } from "react";
import { Button } from "react-bootstrap";
import classes from "./sendButtons.module.css";

const reducer = (previousState, action) => {
  const { isYourTurn, numberOfRoll, isAnyDiceSelected, isFigureSelected } =
    action;
  if (!isYourTurn) {
    return {
      variant: "outline-secondary",
      className: `${classes.rollTheDicesButton} ${classes.hide}`,
      disabled: true,
      value: "",
    };
  } else if (numberOfRoll === 3) {
    return {
      variant: "outline-secondary",
      className: classes.rollTheDicesButton,
      disabled: true,
      value: "You don't have next roll",
    };
  } else if (isFigureSelected) {
    return {
      variant: "outline-secondary",
      className: classes.rollTheDicesButton,
      disabled: true,
      value: "You cannot roll dice if you choose a figure",
    };
  } else if (numberOfRoll !== 0 && !isAnyDiceSelected) {
    return {
      variant: "outline-secondary",
      className: classes.rollTheDicesButton,
      disabled: true,
      value: "Choose dice to roll",
    };
  } else if (numberOfRoll === 0) {
    return {
      variant: "success",
      className: classes.rollTheDicesButton,
      disabled: false,
      value: "Roll all dice",
    };
  } else if (numberOfRoll === 1) {
    return {
      variant: "success",
      className: classes.rollTheDicesButton,
      disabled: false,
      value: "Roll dice secound time",
    };
  } else if (numberOfRoll === 2) {
    return {
      variant: "success",
      className: classes.rollTheDicesButton,
      disabled: false,
      value: "Roll dice last time",
    };
  } else {
    return {
      variant: "outline-secondary",
      className: `${classes.rollTheDicesButton} ${classes.hide}`,
      disabled: true,
      value: "",
    };
  }
};

const initialState = {
  variant: "outline-secondary",
  className: `${classes.rollTheDicesButton} ${classes.hide}`,
  disabled: true,
  value: "",
};

const RollTheDicesButton = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(props);
  }, [props]);

  return (
    <Button
      variant={state.variant}
      className={state.className}
      disabled={state.disabled}
      onClick={props.rollTheDices}
    >
      {state.value}
    </Button>
  );
};

export default RollTheDicesButton;
