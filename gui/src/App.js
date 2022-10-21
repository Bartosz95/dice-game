import { useEffect, Fragment } from 'react';
import { Routes, Route, Navigate , useLocation } from 'react-router-dom';
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

  const location = useLocation()
  const { keycloak, initialized } = useKeycloak()

  useEffect(() => {
    if(!initialized && location.pathname !== '/home') {
      window.location.replace('/home')
    }
  }, [initialized, location])

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
      <Route path='/' exact element={<Navigate to='home'/>} />        
      <Route path="/home" element={<Home/>} />
      <Route path="/create" element={<Create/>} />
      <Route path="/games" exact element={<Games/>} />
      <Route path="/games/:gameID" element={<Game/>} />
      <Route path='*' element={<Navigate to='/home'/>} />
    </Routes>
  </Fragment>
}