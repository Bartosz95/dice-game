import React, { useState, useEffect } from 'react';
import { Container, Button, Form } from 'react-bootstrap';

import './create.css'

import User from './user/user'
import AlertMessage from '../alerts/AlertMessage'

export default props => {

  const [alertMessage, setAlertMessage] = useState(null)
  const [currentUser, setCurrentUser] = useState({})
  const [gameName, setGameName] = useState('')
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
        if((body.level === 'warning') || (body.level === 'error')) {
          return setAlertMessage(body)
        }
        setUsers(body.filter(user => user.id !== userInfo.sub))
      }
    } catch(err) {
      console.log(err)
      setAlertMessage(err)
    }
  }

  useEffect(() => { getUsers() })

  const selectUser = selectedUser => {
    setUsers(users.map(user => {
      if(user.id === selectedUser.id) {
        if(!user.selected) {
          user.selected = true
        } else {
          user.selected = false
        }
         
      } 
      return user
    }))
  }

  const createGame = async () => {
    try {
      if(gameName === '') return setAlertMessage({
        message: 'Game name should be not empty',
        level: 'warning'}
      )
      if(props.keycloak.authenticated) {
        let selectedUsers = users.filter(user => user.selected === true).map(user => ({ 'id': user.id, username: user.username}))
        
        selectedUsers.push({ id: currentUser.sub, username: currentUser.preferred_username})
        
        const payload = { 
          name: gameName,
          users: selectedUsers 
        }
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.keycloak.token}`
          },
          body: JSON.stringify(payload)
        }
        const response = await fetch(`${props.config.DICE_GAME_API}/game`, requestOptions)
        
        const body = await response.json();
        if((body.level === 'warning') || (body.level === 'error')) {
          return setAlertMessage(body)
        } 
        window.location.href = `/${body._id}`
  
      } 
    } catch (err) {
      console.log(err)
      setAlertMessage(err)
    }
  }

  const handleChange = async e => {
    setGameName(e.target.value)
  }

  const alert = alertMessage ? <AlertMessage elems={alertMessage} /> : ''

  const gameNameForm = <Form className="gameNameForm">
    <Form.Label>Write game name</Form.Label>
    <Form.Control type="name" placeholder="name" onChange={handleChange.bind(this)} />
  </Form>

  const userList = <><div className='selectPlayersText'>Choose players</div><div>{users.map(user => <User
    key={user.id}
    user_props={user}
    selectUser={selectUser.bind(this)}
  />)}</div></>

  const createButton = <div className="createGameDiv">And play the game!<br/><Button
    onClick={ createGame }
    className="createGameBtn"
    variant="success">
      Create
  </Button></div>

  return <Container className="mainContainer">
    {alert}
    {gameNameForm}
    {userList}
    {createButton}
    </Container>

}