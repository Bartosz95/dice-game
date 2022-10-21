import { useEffect, Fragment } from 'react';
import { Routes, Route  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth-slice';
import { initConfig } from './store/config-action';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useKeycloak } from '@react-keycloak/web'

import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home';
import Games from './components/games/Games';
import Create from './components/create/Create';
import Game from './components/game/Game';

export default () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initConfig())
  }, [dispatch])


  const { keycloak } = useKeycloak()

  useEffect(() => {
    const loadUserInfo = async () => {
      if(keycloak.authenticated) {
        const userInfo = await keycloak.loadUserInfo()
        dispatch(
          authActions.setUserInfo({
            userInfo
          })
        );
      } else {
        dispatch(
          authActions.setUserInfo({
            userInfo: {}
          })
        );
      }
    }
    loadUserInfo()
  }, [keycloak.authenticated])


  return <Fragment>
    <Navbar/>
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/games" element={ <Games/> } />
      <Route path="/create" element={ <Create/> } />
      <Route path="/:id" element={ <Game/> } />
    </Routes>
  </Fragment>
}