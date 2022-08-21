import React, { Component } from 'react';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import keycloak from './libs/keycloak';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar/Navbar'
import Home from './components/home/home';
import Games from './components/games/games';
import Create from './components/create/Create';
import Game from './components/game/game';

class App extends Component {

  state = { 
    keycloak: keycloak,
    config: {}
  };

  async initKeycloak() {
    try {
      await keycloak.init({ onLoad: 'check-sso' })
      
      if(keycloak.authenticated) {
        this.setState({ keycloak: keycloak })
      } else {
        console.log("not auth")
      }
    } catch (err) {
      console.log(err)
    }
  }

  async initConfigData() {
    try {
      console.log('initConfigData',)
      const data = await fetch('/config.json', {
        headers: {
          'Content-Type': 'application/json',
        }})
        const config = await data.json()
        this.setState({ config: config })
        console.log(config)
      } catch (err) {
        console.log(err)
      }
  }

  componentDidMount() {
    this.initKeycloak()
    this.initConfigData()
    console.log(this.state.config)
  }

  render() {
    return <div>
      <Navbar keycloak={this.state.keycloak} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home keycloak={this.state.keycloak} config={this.state.config} /> } />
          <Route path="/games" element={ <Games keycloak={this.state.keycloak} config={this.state.config} /> } />
          <Route path="/create" element={ <Create keycloak={this.state.keycloak} config={this.state.config} /> } />
          <Route path="/:id" element={ <Game keycloak={this.state.keycloak} config={this.state.config} /> } />
        </Routes>
      </BrowserRouter>
    </div>
  }

}
export default App;