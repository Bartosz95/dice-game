import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import Carusel from './carousel'

export default props => {

  const welcomeDiv = <div className='welcome'>Welcome to dice game!</div>
  
  const description = <><div>Dice game is a simple game when you play dices and try to get the best result. Check the tutorial below and try it. It is important to login before play dice.</div>

  <div>Rules:</div>
  <div>If you login here first time you probably don't have any game and you need to create some.Go to <></></div></>

  return <Container className="mainContainer"> 
    {welcomeDiv}
    <Carusel/>
    {description}
  </Container>
}