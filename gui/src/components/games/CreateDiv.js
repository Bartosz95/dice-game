import { Button } from "react-bootstrap";

import classes from "./games.module.css";

export default () => (
  <div className={classes.createInfo}>
    <div>It looks like you don't have any game.</div>
    <Button variant="success" className={classes.createBtn} href="/create">
      Create new one!
    </Button>
  </div>
);
