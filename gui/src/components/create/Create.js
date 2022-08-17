import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';

export default props => {

  const [currentUser, setCurrentUser] = useState({})
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

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

  const selectUser = user => {
    const index = selectedUsers.indexOf(user.id)
    index === -1 ? selectedUsers.push(user.id) : selectedUsers.splice(index, 1)
    setSelectedUsers(selectedUsers)
  }

  const createGame = async () => {
    try {
      if(props.keycloak.authenticated) {
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

  const playerlist = users.map(user =>  <ListGroup.Item
      key={user.id}
      onClick={() => {selectUser(user)}}
      className={selectedUsers.indexOf(user.id) === -1 ? "outline-success": "success"}
      action>
        {user.username}
    </ListGroup.Item>) 


  const createButton = <Button
    onClick={ createGame }
    variant="success">
      Create
  </Button>

  return <><Container>
    Selected users: {selectedUsers}
    <ListGroup>{ playerlist } </ListGroup>
    </Container>
    {createButton}
  </>
}