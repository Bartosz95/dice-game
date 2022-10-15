import { useEffect, useState, Fragment } from 'react';
import { NavDropdown, Dropdown, Nav } from 'react-bootstrap';

const UserBar = props => {

  const [username, setUsername] = useState("")

  const login = <Nav.Link
    variant="outline-secondary" 
    className="userBarBtn"
    onClick={props.keycloak.login} >
      Login
  </Nav.Link >

  const logout = <Dropdown.Item 
    className="navItem"
    onClick={() => { 
      props.keycloak.logout(); 
      window.location.href = `/` }}>
      Logout
  </Dropdown.Item>

  const accountManagement = <Dropdown.Item 
    className="navItem"
    onClick={props.keycloak.accountManagement}>
      Account
  </Dropdown.Item>

  const dropdown = <NavDropdown 
    title={username} 
    variant='outline-secondary' 
    className="userBarBtn">
    {logout}
  </NavDropdown > 

  const load = async () => {
    if(props.keycloak.authenticated) {
      const userInfo = await props.keycloak.loadUserInfo()
      setUsername(userInfo.preferred_username)
    }
   
  }

  useEffect(() => { load() }, [ props.keycloak.authenticated ])

  return <Fragment>{props.keycloak.authenticated ? dropdown : login}</Fragment>
}
export default UserBar;