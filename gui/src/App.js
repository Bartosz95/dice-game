import {  useState, useEffect, Fragment } from 'react';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import Keycloak from 'keycloak-js'
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar/Navbar'
import Home from './components/home/home';
import Games from './components/games/games';
import Create from './components/create/Create';
import Game from './components/game/Game';

const ckey = new Keycloak()

export default () => {
  
  const [ keycloak, setKeycloak ] = useState(ckey)
  const [ config, setConfig ] = useState({})

  const initKeycloak = async () => {
    try {
      await ckey.init({ onLoad: 'check-sso' })
      setKeycloak(ckey)
      } catch (err) {
      console.log(err)
    }
  }

  const initConfigData = async () => {
    try {
      const data = await fetch('/config.json', {
        headers: {
          'Content-Type': 'application/json',
        }})
        const conf = await data.json()
        setConfig(conf)
      } catch (err) {
        console.log(err)
      }
  }

  useEffect(() => {
    initKeycloak()
    initConfigData()
  }, [])

  return <div>
    <Navbar keycloak={keycloak} config={config} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home keycloak={keycloak} config={config} /> } />
        <Route path="/games" element={ <Games keycloak={keycloak} config={config} /> } />
        <Route path="/create" element={ <Create keycloak={keycloak} config={config} /> } />
        <Route path="/:id" element={ <Game keycloak={keycloak} config={config} /> } />
      </Routes>
    </BrowserRouter>
  </div>
}