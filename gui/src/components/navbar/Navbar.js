import React, { useState, useEffect }  from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import './navbar.css'

import UserBar from './userBar/UserBar';

export default props => {

    const [isNew, setIsNew] = useState(0)

    const checkNewGames = async () => {
        try {
            if(props.keycloak.authenticated) {
              const requestOptions = {
                headers: {
                    'Authorization': `Bearer ${props.keycloak.token}`
                }
              };
              const response = await fetch(`${props.config.DICE_GAME_API}/game/isnew`, requestOptions)
              const body = await response.json()
              if((body.level === 'warning') || (body.level === 'error') || (body.level === "info")) {
                return console.log(body)
              }
              console.log(body)
              setIsNew(body.numberOfNewGames)
            }
          } catch (err) {
            console.log(err)
          }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            checkNewGames()
        }, 5000);
        return () => clearInterval(interval);
    },[props]);

    return <Navbar className="nav bg-light">
    <Nav className="navbar-collapse">     

        <Nav.Link href="/" className="logo"><img src="img/logo.png"/></Nav.Link>
        
        <Nav.Link href="/" className="link-secondary navLink">Home</Nav.Link>
        
        {props.keycloak.authenticated ?  <Nav.Link href="/games" className={`link-secondary navLink ${ isNew !== 0 ? 'yourGameNewText' : ''}`} >Your Games</Nav.Link> : ''}
        
        {props.keycloak.authenticated ? <Nav.Link href="/create" className="link-secondary navLink">New Game</Nav.Link>: ''}
    
    </Nav>
    <Nav className="justify-content-end userBar">

        <UserBar className="" keycloak={props.keycloak}/>
    
    </Nav>
    
    </Navbar>
}