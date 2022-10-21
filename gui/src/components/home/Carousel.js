import { Carousel } from 'react-bootstrap';
import './home.css'

export default () => <Carousel variant="dark" className="carMain">
      <Carousel.Item >
        <img
          className="d-block w-100 carItem"
          src="/img/login.png"
          alt="First slide"
        />
        <Carousel.Caption className="loginCarousel">
          <h3>Login</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carItem"
          src="/img/create1.png"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>create a game</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carItem"
          src="/img/tom1.png"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>and play!</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>