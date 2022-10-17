import { useState, useEffect }  from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import './navbar.css'

import UserBar from './UserBar';
import useHttpRequest from '../../hooks/useHttpRequest';

export default props => {

    const [numberOfYourTurn, setNumberOfYourTurn] = useState(0)
    const { fetchData } = useHttpRequest()

    useEffect(() => {
        const interval = setInterval(() => {
          fetchData( 
            { url: `${props.config.DICE_GAME_API}/game/ping`}, 
            props.keycloak, 
            body => { setNumberOfYourTurn(body.numberOfYourTurn)}
          )
        }, 5000);
        return () => clearInterval(interval);
    }, [ props.keycloak.authenticated ] );

    return <Navbar className="nav bg-light">
      <Nav className="navbar-collapse">     

          <Nav.Link href="/" className="logo"><img src="img/logo.png"/></Nav.Link>
          
          <Nav.Link href="/" className="link-secondary navLink">Home</Nav.Link>
          
          {props.keycloak.authenticated && <Nav.Link href="/games" className={`link-secondary navLink ${ numberOfYourTurn !== 0 ? 'yourGameNewText' : ''}`} >Your Games</Nav.Link>}
          
          {props.keycloak.authenticated && <Nav.Link href="/create" className="link-secondary navLink">New Game</Nav.Link>}
      
      </Nav>
      <Nav className="justify-content-end userBar">
          <UserBar keycloak={props.keycloak}/>
      </Nav>
    </Navbar>
}