import React from 'react';
import { Nav } from 'react-bootstrap';
import './navbar.css'

import UserBar from './userBar/UserBar';

export default props => <div>
    <Nav className="nav">
        <Nav.Item>
            <Nav.Link href="/" className="logo"><img src="img/logo.png"/></Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/" className="link-secondary navLink">Home</Nav.Link>
        </Nav.Item>
        {props.keycloak.authenticated ? <Nav.Item>
            <Nav.Link href="/games" className="link-secondary navLink">Your Games</Nav.Link>
        </Nav.Item> : ''}
        {props.keycloak.authenticated ? <Nav.Item>
            <Nav.Link href="/create" className="link-secondary navLink">New Game</Nav.Link>
        </Nav.Item> : ''}
        {props.keycloak.authenticated ? <UserBar className="userBar float-right" keycloak={props.keycloak} /> : ''}
    </Nav>
    
    
</div>