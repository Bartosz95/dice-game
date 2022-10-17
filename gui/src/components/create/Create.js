import { useState, useEffect, Fragment } from 'react';
import { Container, Button, Form } from 'react-bootstrap';

import './create.css'

import User from './User'
import AlertMessage from '../alerts/AlertMessage'
import useHttpRequest from '../../hooks/useHttpRequest'

export default props => {

  const [ user, setUser ] = useState(null)
  const [ users, setUsers ] = useState([])
  const [ gameName, setGameName ] = useState('')
  const { alertMessage, renderContent, fetchData } = useHttpRequest()
  
  const setUserInfo = async () => {
    if(props.keycloak.authenticated) {
      const user = await props.keycloak.loadUserInfo()
      setUser(user)
      const requestOptions = {
        url: `${props.keycloak.authServerUrl}/admin/realms/${props.keycloak.realm}/users`
      };
      fetchData(requestOptions, props.keycloak, body => setUsers(body.filter(u => u.id !== user.sub)))
    }
  }

  useEffect(() => { 
    setUserInfo() 
  },[props.keycloak.authenticated])

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
    
    selectedUsers.push({ id: user.sub, username: user.preferred_username})
    
    const requestOptions = {
      url: `${props.config.DICE_GAME_API}/game`,
      method: 'POST',
      body:  {
        name: gameName,
        users: selectedUsers 
      }
    }
    fetchData(requestOptions, props.keycloak, body => window.location.href = `/${body._id}`)
  }

  const handleChange = async event => {
    setGameName(event.target.value)
  }

  return <Container className="mainContainer">
    
    {alertMessage ? <AlertMessage elems={alertMessage} /> : ''}

    <Form className="gameNameForm">
      <Form.Label>Write game name</Form.Label>
      <Form.Control type="name" placeholder="name" onChange={handleChange} />
    </Form>

    {userList}

    <div className="createGameDiv">And play the game!<br/>
    <Button className="createGameBtn" variant="success" onClick={createGame}>Create</Button>
    </div>
    
    </Container>

}