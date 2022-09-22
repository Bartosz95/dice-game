import { useEffect, useState, Fragment } from 'react';
import { NavDropdown, Dropdown, Nav } from 'react-bootstrap';

const UserBar = props => {

  const [username, setUsername] = useState("")

  const login = <Nav.Link  onClick={ () => props.keycloak.login() } variant="outline-secondary" className="userBarBtn">Login</Nav.Link >

  const dropdown = <NavDropdown title={username} variant='outline-secondary' className="userBarBtn" >
    <Dropdown.Item onClick={ () => props.keycloak.logout() } className="navItem">Logout</Dropdown.Item>
    {/* <Dropdown.Item onClick={ () => props.keycloak.accountManagement() }className="navItem">Account</Dropdown.Item> */} 
  </NavDropdown > 

  const load = async () => {
    try {
      if(props.keycloak.authenticated) {
        const userInfo = await props.keycloak.loadUserInfo()
        setUsername(userInfo.preferred_username)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { load() })

  return <Fragment>{props.keycloak.authenticated ? dropdown : login}</Fragment>
}
export default UserBar;