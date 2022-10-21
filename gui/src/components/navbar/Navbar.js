import { useState, useEffect }  from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web'

import './navbar.css'

import useHttpRequest from '../../hooks/useHttpRequest'
import UserBar from './UserBar';

export default () => {

    const [ numberOfYourTurn, setNumberOfYourTurn ] = useState(0)
    const { fetchData } = useHttpRequest()
    const { keycloak } = useKeycloak()
    const { DICE_GAME_API }  = useSelector(state => state.config);

    useEffect(() => {
        const interval = setInterval(() => {
          fetchData({ url: `${DICE_GAME_API}/game/ping`}, body => { setNumberOfYourTurn(body.numberOfYourTurn)})
        }, 5000);
        return () => clearInterval(interval);
    }, [DICE_GAME_API, fetchData] );

    return <Navbar className="nav bg-light">
      <Nav className="navbar-collapse">     

          <LinkContainer to="/" >
            <Nav.Link className="logo"><img src="img/logo.png"/></Nav.Link>
          </LinkContainer>
          
          <LinkContainer to="/" >
            <Nav.Link className="link-secondary navLink">Home</Nav.Link>
          </LinkContainer>
          
          
          {keycloak.authenticated && <LinkContainer to="/games">
            <Nav.Link className={`link-secondary navLink ${ numberOfYourTurn !== 0 ? 'yourGameNewText' : ''}`} >Your Games</Nav.Link>
          </LinkContainer>}
          
          {keycloak.authenticated && <LinkContainer to="/create">
            <Nav.Link className="link-secondary navLink">New Game</Nav.Link>
          </LinkContainer>}
      
      </Nav>
      <Nav className="justify-content-end userBar">
          <UserBar/>
      </Nav>
    </Navbar>
}