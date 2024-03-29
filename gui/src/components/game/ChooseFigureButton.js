import { useEffect, useReducer } from "react";
import { Button } from "react-bootstrap";
import classes from "./sendButtons.module.css";

const reducer = (previousState, action) => {
  const { isYourTurn, numberOfRoll, isFigureSelected } = action;

  if (!isYourTurn) {
    return {
      variant: "outline-secondary",
      className: `${classes.chooseFigureButton} ${classes.hide}`,
      disabled: true,
      value: "",
    };
  } else if (numberOfRoll === 0) {
    return {
      variant: "outline-secondary",
      className: classes.chooseFigureButton,
      disabled: true,
      value: "You have to roll all dice",
    };
  } else if (!isFigureSelected) {
    return {
      variant: "outline-secondary",
      className: classes.chooseFigureButton,
      disabled: true,
      value: "Choose figure to save",
    };
  } else {
    return {
      variant: "success",
      className: classes.chooseFigureButton,
      disabled: false,
      value: "Save figure",
    };
  }
};

const initialState = {
  variant: "outline-secondary",
  className: `${classes.chooseFigureButton} ${classes.hide}`,
  disabled: true,
  value: "",
};

const ChooseFigureButton = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(props);
  }, [props]);

  return (
    <Button
      variant={state.variant}
      className={state.className}
      disabled={state.disabled}
      onClick={props.chooseFigure}
    >
      {state.value}
    </Button>
  );
};

export default ChooseFigureButton;
