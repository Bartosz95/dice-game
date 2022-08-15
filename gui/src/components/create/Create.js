import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';

export default props => {

  const [userId, setUserId] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  const getUsers = async () => {
    try {
      if(props.keycloak.authenticated && users.length === 0) {
        const requestOptions = {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${props.keycloak.token}`
          }
        };
        const response = await fetch(`${props.keycloak.authServerUrl}/admin/realms/${props.keycloak.realm}/users`, requestOptions)
        const body = await response.json()
        setUsers(body)
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
        const userInfo = await props.keycloak.loadUserInfo()
        setUserId(userInfo.sub)
        const response = await fetch(`${props.config.DICE_GAME_API}/user/${userInfo.sub}/game`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.keycloak.token}`
          },
          body: JSON.stringify({ userIDs: selectedUsers }),
          mode: 'no-cors'
        })
        const body = await response.json();
        window.location.href = `/${body._id}`        
      }
    } catch (err) {
        console.log(err)
    }
  }

  const playerlist = <ListGroup>{
    users.map(user =>  <ListGroup.Item 
      key={user.id} 
      action
      variant={selectedUsers.indexOf(user.id) === -1 ? "" : "success"}
      disabled={user.id === userId}
      onClick={() => {selectUser(user)}}>
        {user.username}
    </ListGroup.Item>) 
    }</ListGroup>


  const createButton = <Button
    onClick={ createGame }
    variant="success">
      Create
  </Button>

  return <><Container>
    Selected users: {selectedUsers}
      { playerlist } 
    </Container>
    {createButton}
  </>
}