import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';

import User from './user/user'

export default props => {

  const [currentUser, setCurrentUser] = useState({})
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    try {
      if(props.keycloak.authenticated && users.length === 0) {
        const userInfo = await props.keycloak.loadUserInfo()
        setCurrentUser(userInfo)
        const requestOptions = {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${props.keycloak.token}`
          }
        };
        const response = await fetch(`${props.keycloak.authServerUrl}/admin/realms/${props.keycloak.realm}/users`, requestOptions)
        const body = await response.json()
        setUsers(body.filter(user => user.id !== userInfo.sub))
      }
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => { getUsers() })

  const selectUser = selectedUser => {
    const a = users.map(user => {
      if(user.id === selectedUser.id) {
        if(!user.selected) {
          user.selected = true
        } else {
          user.selected = false
        }
        return user 
      } else {
        return user
      }
    })
    setUsers(a)
  }

  const createGame = async () => {
    try {
      if(props.keycloak.authenticated) {
        let selectedUsers = users.filter(user => user.selected === true).map(user => user.id)
        selectedUsers.push(currentUser.sub)
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.keycloak.token}`
          },
          body: JSON.stringify({ userIDs: selectedUsers })
        }
        const response = await fetch(`${props.config.DICE_GAME_API}/game`, requestOptions)
        const body = await response.json();
        window.location.href = `/${body._id}`        
      }
    } catch (err) {
        console.log(err)
    }
  }

  const userList = users.map(user => <User
    key={user.id}
    user_props={user}
    selectUser={selectUser.bind(this)}
  />)

  const createButton = <Button
    onClick={ createGame }
    variant="success">
      Create
  </Button>

  return <><Container>
    Select users: 
    { userList }
     
    </Container>
    {createButton}
  </>
}