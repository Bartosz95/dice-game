import React from "react";
import { Button } from "react-bootstrap";

import classes from "./create.module.css";

export default (props) => (
  <Button
    onClick={() => props.selectUser(props.user_props)}
    variant={props.user_props.selected ? "secondary" : "outline-secondary"}
    id={props.user_props.id}
    className={classes.user}
  >
    {props.user_props.username}
  </Button>
);
