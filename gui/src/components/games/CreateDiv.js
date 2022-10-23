import { Button } from "react-bootstrap";

import "./games.css";

export default () => (
  <div className="createInfo">
    <div>It looks like you don't have any game.</div>
    <Button variant="success" className="createBtn" href="/create">
      Create new one!
    </Button>
  </div>
);
