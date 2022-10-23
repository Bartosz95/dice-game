import React, { Suspense, useEffect, Fragment } from 'react';
import { Routes, Route, Navigate , useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth-slice';
import { initConfig } from './store/config-action';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useKeycloak } from '@react-keycloak/web'

import Navbar from './components/navbar/Navbar'
const Home = React.lazy(() => import('./components/home/Home'));
const Games = React.lazy(() => import('./components/games/Games'));
const Create = React.lazy(() => import('./components/create/Create'));
const Game = React.lazy(() => import('./components/game/Game'));

export default () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initConfig())
  }, [dispatch])

  const { keycloak, initialized } = useKeycloak()

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

  return <Suspense fallback={<div><Spinner /></div>}>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Navigate replace to='home'/>} />        
      <Route path="/home" element={<Home/>} />
      { keycloak.authenticated && <Fragment>
        <Route path="/create" element={<Create/>} /> 
        <Route path="/games" element={<Games/>} />
        <Route path="/games/:gameID" element={<Game/>} /></Fragment> 
      }
      <Route path='*' element={<Navigate replace to='/home'/>} />
    </Routes>
  </Suspense>
}