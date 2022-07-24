import React, { useEffect, useState } from 'react';
import { DropdownButton, Dropdown, Button } from 'react-bootstrap';
import './userBar.css'
const UserBar = props => {

  const [username, setUsername] = useState("")

  const login = <Button variant="success" className="userBar" onClick={ () => props.keycloak.login() }>Login</Button>

  const dropdown = <DropdownButton variant='secondary' title={username} className="userBar">
    <Dropdown.Item onClick={ () => props.keycloak.logout() }>Logout</Dropdown.Item>
    <Dropdown.Item onClick={ () => props.keycloak.accountManagement() }>Account</Dropdown.Item>
  </DropdownButton > 

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

  return props.keycloak.authenticated ? dropdown : login
}
export default UserBar;