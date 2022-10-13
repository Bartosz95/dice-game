import { Component, Fragment } from 'react';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import keycloak from './libs/keycloak';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar/Navbar'
import Home from './components/home/home';
import Games from './components/games/games';
import Create from './components/create/Create';
import Game from './components/game/Game';

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
      }
    } catch (err) {
      console.log(err)
    }
  }

  async initConfigData() {
    try {
      const data = await fetch('/config.json', {
        headers: {
          'Content-Type': 'application/json',
        }})
        const config = await data.json()
        this.setState({ config: config })
      } catch (err) {
        console.log(err)
      }
  }

  componentDidMount() {
    this.initKeycloak()
    this.initConfigData()
  }

  render() {
    return <Fragment>
      <Navbar keycloak={this.state.keycloak} config={this.state.config} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home keycloak={this.state.keycloak} config={this.state.config} /> } />
          <Route path="/games" element={ <Games keycloak={this.state.keycloak} config={this.state.config} /> } />
          <Route path="/create" element={ <Create keycloak={this.state.keycloak} config={this.state.config} /> } />
          <Route path="/:id" element={ <Game keycloak={this.state.keycloak} config={this.state.config} /> } />
        </Routes>
      </BrowserRouter>
    </Fragment>
  }

}
export default App;