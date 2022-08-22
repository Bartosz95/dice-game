import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import Carusel from './carousel'

export default props => {

  const welcomeDiv = <div className='welcome'>Welcome to dice game!</div>
  
  const abstract = <div className='abstract'>
    Dice game is a simple game when you play with other users. 
    The aim of the game is to score the highest number of points. 
    Check the tutorial below to learn how to play. 
    You need to know that game is only avaiable for login users.
  </div>

  const figuresDescription = <div className="figureDescription">
    <div className="figureDescriptionIntroTitle">How to calculate figures ?</div>
    <div className="figureDescriptionIntroText">
      As you know there are a 13 figures. 
      Every figure has different number of points. 
      You will find a description how to calculate every figure below.
    </div>

    <div className='figure'>
      <div className='figureTitle'>Numbers</div>
      <div className='figureText'>
      The first six figures are numbers. For count of every figure you count how many dices do you have with specyfic number.
      Then you multiply number of dices with choosen number
      For instans if you count number six you and you have 3 dices with number six you score is 3 x 6 = 18.
      This score appears in table if you choose it. 
      Rest of dices are omited.
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>3x</div>
      <div className='figureText'>
      You can count This figure only if you have 3 dices with the same numbers.
      It you have it it is counted similar like numbers above.
      For example if you have 3 dices with number 5 you will get 3 x 5 = 15 points.
      If you have more then 3 dices with the some number addicional dices are omited.
      If you have less than 3 dices with the same number will get 0 points.
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>4x</div>
      <div className='figureText'>
      This figure is counting similarly like 3x but you need to have 4 dices with the same number. 
      Then you multiply number on the dices with 4.
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>Full</div>
      <div className='figureText'>
      For this figure you have to have 2 number of dices with the same number and also 3 dices with the same number. 
      It doesn't metter what numbers you have.
      It is only important to have this specyfic scheme like [ 2, 2, 3, 3, 3 ] or [ 1, 1, 1, 5, 5 ]
      If you have it you will get 25 points.
      If you dont't you will get 0 points.
      </div>
    </div>

    <div className='figure'>
    <div className='figureTitle'>Small Strit</div>
      <div className='figureText'>
      For this figure you have to have exactly dices with [ 1, 2, 3, 4, 5 ].
      If you have it you get 30 points. 
      If you don't you will get 0 points.
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>Big Strit</div>
      <div className='figureText'>
      For this figure you have to have exactly scheme like [ 2, 3, 4, 5, 6 ]
      If you have it you will get 40 points.
      If you don't you will get 0 points.
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>General</div>
      <div className='figureText'>
      For this figure you have to roll have all dices with the same number. 
      If you do that you will get 50 points!
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>Chance</div>
      <div className='figureText'>
      If you do not have any specific figure this is chance for you. 
      Simply add all numbers on dices.
      </div> 
    </div>

    <div className='figure'>
      <div className='figureTitle'>Bonus</div>
      <div className='figureText'>
      There is one more rule for this game. 
      If you add all points from numbers figures (the first described figure) and the result will be at least 64 you get extra 35 points!
      </div>
    </div>
  </div>
  
  const rules = <div className='rules'>
    <div className="rulesTitle">Rules:</div>
    <div className="rulesText">
      If you have never played dice you have to learn about few basic rules. 
      The game has 13 turns. 
      In every turn you have to throw dices and match the best figure from table. 
      You can choose every figure only one time. 
      The amount of figures is the same as turns 13 what means in th end of the day you will choose all figures. 
      In every turn you can roll the dices up to three time.
      For the first time you roll all the five dices.
      Next you check wheher you have any figure to match.
      If you decide to choose figure mark it on the table, if not you can choose dices and roll them again.
      For the secound and thirt time you can choose how many dices you want to roll.
      If you roll the last time you have to choose a figure.
      If you choose a figure you need to wait for others.
      In short it is all. 
      In next section you will find a description how the figures from table are counting.
    </div>
  </div>
  
  const summary = <div className='summary'>
    <div className="summaryTitle">Jump to game!</div>
    <div className="summaryText">
    And this is all what you have to know :) 
    Let's play a game. 
    For do that you need to be login.
    And go then to New Game tab to create New game.
    In Your Game Tab you will find your games.
    Games in green in that tab inform you that others players waiting for your turn. 
    You will also see Your Games text in green if you have some games where others waiting for you. 
    </div>
  </div>

  const tutorial = <div className='tutorial'>
    {rules}
    {figuresDescription}
  </div>

  return <Container className="mainContainer"> 
    {welcomeDiv}
    <Carusel/>
    {abstract}
    {tutorial}
    {summary}
  </Container>
}