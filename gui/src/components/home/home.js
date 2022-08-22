import React, { Component } from 'react';
import { Container } from 'react-bootstrap';


export default class Home extends Component {

  componentDidMount() {
  }


  render() { return <Container className="mainContainer"> 
    <div className='welcome'>Welcome to dice game!</div>

    <div>Dice game is a simple game when you play dices and try to get the best result. Check the tutorial below and try it. It is important to login before play dice.</div>

    <div>Rules:</div>
    <div>If you login here first time you probably don't have any game and you need to create some.Go to <></></div>

  </Container>}
}