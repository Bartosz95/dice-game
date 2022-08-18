import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import './navbar.css'

import UserBar from './userBar/UserBar';

export default props => <Navbar>
    <Nav className="nav bg-light navbar-collapse">     

        <Nav.Link href="/" className="logo"><img src="img/logo.png"/></Nav.Link>
        
        <Nav.Link href="/" className="link-secondary navLink">Home</Nav.Link>
        
        {props.keycloak.authenticated ?  <Nav.Link href="/games" className="link-secondary navLink">Your Games</Nav.Link> : ''}
        
        {props.keycloak.authenticated ? <Nav.Link href="/create" className="link-secondary navLink">New Game</Nav.Link>: ''}
    
    </Nav>
    <Nav className="nav justify-content-end bg-light userBar">

        <UserBar className="" keycloak={props.keycloak}/>
    
    </Nav>
    
    </Navbar>