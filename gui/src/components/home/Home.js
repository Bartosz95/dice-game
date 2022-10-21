import { Container, Button } from 'react-bootstrap';
import { useKeycloak } from '@react-keycloak/web'
import { useNavigate } from 'react-router-dom'

import Carusel from './Carousel'

export default () => {

  const { keycloak } = useKeycloak()
  const navigate = useNavigate();

  const welcomeDiv = <div className='welcome'>Welcome to dice game!</div>
  
  const abstract = <div className='abstract'>
    Dice game is a simple game when you play with other users. 
    The aim of the game is to score the highest number of points. 
    Check the tutorial below to learn how to play. 
    You need to know that the game is only available for login users.
  </div>

  const figuresDescription = <div className="figureDescription">
    <div className="figureDescriptionIntroTitle">How to calculate figures ?</div>
    <div className="figureDescriptionIntroText">
      As you know there are 13 figures. 
      Every figure has a different number of points. 
      You will find a description of how to calculate every figure below.
    </div>

    <div className='figure'>
      <div className='figureTitle'>Numbers</div>
      <div className='figureText'>
      The first six figures are numbers. For every figure you count how many dice you have with a specific number.
      Then you multiply number of dices with chosen number
      For instance if you count number six you and you have 3 dice with number six you score is 3 x 6 = 18.
      This score appears in the table if you choose it. 
      Rest of the dice are omitted.
      </div>
      <div className='figureImage'>
        <img src='/img/numbers.png'/> 
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>3x</div>
      <div className='figureText'>
      You can count This figure only if you have 3 dice with the same numbers.
      If you have it it is counted similarly like the numbers above.
      For example if you have 3 dice with number 5 you will get 3 x 5 = 15 points.
      If you have more then 3 dice with the same number additional dice are omitted.
      If you have less than 3 dice with the same number, you will get 0 points.
      </div>
      <div className='figureImage'>
        <img src='/img/3x.png'/> 
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>4x</div>
      <div className='figureText'>
      This figure is counting similarly like 3x but you need to have 4 dice with the same number. 
      Then you multiply the number on the dice with 4. In this example you will get 4 points.
      </div>
      <div className='figureImage'>
        <img src='/img/4x.png'/> 
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>Full</div>
      <div className='figureText'>
      For this figure you have to have 2 numbers of dice with the same number and also 3 dice with the same number. 
      It doesn't matter what numbers you have.
      It is only important to have this specific scheme like [ 2, 2, 3, 3, 3 ] or [ 1, 1, 1, 5, 5 ]
      If you have it you will get 25 points.
      If you don't you will get 0 points.
      </div>
      <div className='figureImage'>
        <img src='/img/full.png'/> 
      </div>
    </div>

    <div className='figure'>
    <div className='figureTitle'>Small Strit</div>
      <div className='figureText'>
      For this figure you have to have exactly dice with [ 1, 2, 3, 4, 5 ].
      If you have it you get 30 points. 
      If you don't you will get 0 points.
      </div>
      <div className='figureImage'>
        <img src='/img/smallstrit.png'/> 
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>Big Strit</div>
      <div className='figureText'>
      For this figure you have to have exactly scheme like [ 2, 3, 4, 5, 6 ]
      If you have it you will get 40 points.
      If you don't you will get 0 points.
      </div>
      <div className='figureImage'>
        <img src='/img/bigstrit.png'/> 
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>General</div>
      <div className='figureText'>
      For this figure you have to roll all dice with the same number. 
      If you do that you will get 50 points!
      </div>
      <div className='figureImage'>
        <img src='/img/bigstrit.png'/> 
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>Chance</div>
      <div className='figureText'>
      If you do not have any specific figure this is a chance for you. 
      Simply add all numbers on dice. 
      In this example you will get 14 points.
      </div> 
      <div className='figureImage'>
        <img src='/img/chance.png'/> 
      </div>
    </div>

    <div className='figure'>
      <div className='figureTitle'>Bonus</div>
      <div className='figureText bonus'>
      There is one more rule for this game. 
      If you add all points from numbers (the first described figure) and the result will be at least 64 you get an extra 35 points!
      </div>
    </div>
  </div>
  
  const rules = <div className='rules'>
    <div className="rulesTitle">Rules:</div>
    <div className="rulesText">
      If you have never played dice you have to learn about a few basic rules. 
      The game has 13 turns. 
      In every turn you have to throw dice and match the best figure from the table. 
      You can choose every figure only one time. 
      The amount of figures is the same as turns 13 which means at the end of the day you will choose all figures. 
      In every turn you can roll the dice up to three times.
      For the first time you roll all the five dice.
      Next you check whether you have any figure to match.
      If you decide to choose a figure, mark it on the table, if not you can choose dice and roll them again.
      For the second and third time you can choose how many dice you want to roll.
      If you roll the last time you have to choose a figure.
      If you choose a figure you need to wait for others.
      In short, that is all. 
      In the next section you will find a description of how the figures from the table are counted.
    </div>
  </div>
  
  const tutorial = <div>
    <div className="tutorialTitle">Tutorial</div>
    <div className="tutorialText">
      How to use this application? It is very simple. Just check the steps below.
    </div>

    <div className="steps">
      <div className="stepsTitle">Login</div>
      <div className="stepsText">
      In the first place you need to be logged in when you want to play this game.
      Press the login button on the top right corner of the page to see a login page.
      If you have an account you can log in yourself now.
      If you don't have any please create one. 
      You can also login with available authentication providers as Google, Facebook ect.
      You can also create an account manually.
      To do that please press the Register button on the bottom of the form.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/login.png" className='stepsImage'/> 
      </div>
    </div>


    <div className="steps">
      <div className="stepsTitle">Register</div>
      <div className="stepsText">
      Register form is quite conventional. 
      You need to give your name and email address. 
      Choose your username carefully because it will be displayed for other users in the game.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/login.png" className='stepsImage'/> 
      </div>
    </div>

    <div className="steps">
      <div className="stepsTitle">Create Game</div>
      <div className="stepsText">
      First go to the New Game tab. 
      You will see game creators like below. 
      Choose the title for your game and add users. 
      After you press the "Create" button you will automatically start playing the game.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/create1.png" className='stepsImage'/> 
      </div>
    </div>


    <div className="steps">
      <div className="stepsTitle">Roll all 5 dices</div>
      <div className="stepsText">
        When you start a new game you will see a page like below.  
        Generally the green fields are interactive.
        First you need to roll all the dice.
        Press the green "Roll all dice" button to make a move.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/tom0.png" className='stepsImage'/> 
      </div>
    </div>

    <div className="steps">
      <div className="stepsTitle">Second roll</div>
      <div className="stepsText">
        Now you can see what dice numbers you have. 
        You have to decide whether you want to choose a figure or continue playing.
        Let's assume that you want to roll the first two dice again.
        Mark them firstly.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/tom1.png" className='stepsImage'/> 
      </div>
    </div>

    <div className="steps">
      <div className="stepsText">
        After you check the dicess press the "Roll the dice" button.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/tom2.png" className='stepsImage'/> 
      </div>
    </div>

    <div className="steps">
      <div className="stepsTitle">Last roll</div>
      <div className="stepsText">
        Now you can see what dice numbers on these devices have changed.
        Let's say that we want to again roll the first two dice. 
        Check them and press the same button.
        Remember it is your last roll in this turn.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/tom3.png" className='stepsImage'/> 
      </div>
    </div>

    <div className="steps">
      <div className="stepsTitle">Choose figure</div>
      <div className="stepsText">
        Now you have to choose a figure. 
        Consider the best option for you and mark the figure on the table.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/choose0.png" className='stepsImage'/> 
      </div>
    </div>

    <div className="steps">
      <div className="stepsText">
      Then press the "Save figure" button to finish your turn. 
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/choose1.png" className='stepsImage'/> 
      </div>

      <div className="steps">
      <div className="stepsTitle">Wait for others</div>
      <div className="stepsText">
        Now you have nothing to do in this turn.
        In the table will appear the result. 
        Also there appears information on how many points you need to gain to get a bonus.
        Wait for others. 
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/jerry0.png" className='stepsImage'/> 
      </div>
    </div>
    </div>

    <div className="steps">
      <div className="stepsText">
        You can watch how other players are playing in real time! 
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/jerry1.png" className='stepsImage'/> 
      </div>
    </div>

    <div className="steps">
      <div className="stepsTitle">Check your games</div>
      <div className="stepsText">
        If you wait for other players you can check your other games.
        To do it go to Your Games page.
        Moreover this text in the tab will be highlighted green if you have any game where other players are waiting for your move.
      </div>
      <div className='stepsImageDiv'>
          <img src="/img/games.png" className='stepsImage'/> 
      </div>
    </div>

  </div>

  const summaryCreateBtn = <Button
      variant="success"
      onClick={() => navigate('/create')}
      className="summaryCreateBtn">
      Create a new game!
  </Button>

  const summaryLoginBtn = <Button 
      variant="secondary"
      className="summaryCreateBtn"
      onClick={keycloak.login} >
      Please login before playing the game.
  </Button>

  const summary = <div className='summary'>
    <div className="summaryTitle">Jump to the game!</div>
    <div className="summaryText">
    And this is all that you have to know.
    Just let's play a game. 
    To do that you need to be logged in.
    And go then to the New Game tab to create New game.
    In Your Game Tab you will find your games.
    Games in green in that tab inform you that other players are waiting for your turn. 
    You will also see Your Games text in green if you have some games where others are waiting for you.
    </div>
    
    {keycloak.authenticated ? summaryCreateBtn : summaryLoginBtn}
  </div>



  return <Container className="mainContainer"> 
    {welcomeDiv}
    <Carusel/>
    {abstract}
    {rules}
    {figuresDescription}
    {tutorial}
    {summary}
  </Container>
}
