import { Alert } from "react-bootstrap";

export default (props) => {
  const message = props.elems.message || "Something is wrong. Try later.";

  let level = props.elems.level;

  if (level !== "info" && level !== "warning" && level !== "error") {
    level = "error";
  }
  if (level === "error") {
    level = "danger";
  }

  return <Alert variant={level}>{message}</Alert>;
};
