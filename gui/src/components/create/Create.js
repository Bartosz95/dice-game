import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Button, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web'

import './create.css'

import User from './User'
import AlertMessage from '../alerts/AlertMessage'
import useHttpRequest from '../../hooks/useHttpRequest'


export default () => {

  const [ users, setUsers ] = useState([])
  const [ gameName, setGameName ] = useState('')
  const { alertMessage, renderContent, fetchData } = useHttpRequest()

  const { keycloak } = useKeycloak()
  const navigate = useNavigate();
  const { DICE_GAME_API }  = useSelector(state => state.config);
  const { userInfo }  = useSelector(state => state.auth);
    

  useEffect(() => {
    if(keycloak.authenticated && userInfo.sub) {
      fetchData({ url: `${keycloak.authServerUrl}/admin/realms/${keycloak.realm}/users`}, body => setUsers(body.filter(user => user.id !== userInfo.sub)))
    }
  },[fetchData, keycloak.authenticated, userInfo])

  const selectUser = selectedUser => {
    const toggleUser = user => {
      user.selected = !user.selected; 
      return user
    }
    setUsers(users => users.map(user => user.id === selectedUser.id ? toggleUser(user) : user))
  }

  const userList = users.length === 0 ? 
    <Fragment>You cannot choose users because you are the only one</Fragment> : 
    <Fragment>
      <div className='selectPlayersText'>Choose players</div>
      <div>{ users.map(user => 
        <User
        key={user.id}
        user_props={user}
        selectUser={selectUser}/>
      )}
      </div>
    </Fragment>

  const createGame = () => {
    
    let selectedUsers = users.filter(user => user.selected === true).map(user => ({ 'id': user.id, username: user.username}))
    
    selectedUsers.push({ id: userInfo.sub, username: userInfo.preferred_username})
    
    const requestOptions = {
      url: `${DICE_GAME_API}/game`,
      method: 'POST',
      body:  {
        name: gameName,
        users: selectedUsers 
      }
    }
    fetchData(requestOptions, body => navigate(`/games/${body._id}`))
    
  }

  const handleChange = async event => {
    setGameName(event.target.value)
  }

  const content = <Fragment>
    <Form className="gameNameForm">
      <Form.Label>Write game name</Form.Label>
      <Form.Control type="name" placeholder="name" onChange={handleChange} />
    </Form>

    {userList}

    <div className="createGameDiv">And play the game!<br/>
    <Button className="createGameBtn" variant="success" onClick={createGame}>Create</Button>
    </div>
  </Fragment>

  return <Container className="mainContainer">
    
    {alertMessage && <AlertMessage elems={alertMessage} />}

    {renderContent && keycloak.authenticated ? content : <div className="spinner"><Spinner animation="border" variant="secondary" /></div>  } 

  </Container>
}