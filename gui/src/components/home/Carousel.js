import { Carousel } from "react-bootstrap";
import classes from "./home.module.css";

export default () => (
  <Carousel variant="dark" className={classes.carMain}>
    <Carousel.Item>
      <img
        className="classes.d-block w-100 carItem"
        src="/img/login.png"
        alt="First slide"
      />
      <Carousel.Caption className={classes.loginCarousel}>
        <h3>Login</h3>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="classes.d-block w-100 carItem"
        src="/img/create1.png"
        alt="First slide"
      />
      <Carousel.Caption>
        <h3>create a game</h3>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="classes.d-block w-100 carItem"
        src="/img/tom1.png"
        alt="Second slide"
      />
      <Carousel.Caption>
        <h3>and play!</h3>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
);
