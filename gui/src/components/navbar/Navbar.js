import { useState, useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";

import classes from "./navbar.module.css";

import useHttpRequest from "../../hooks/useHttpRequest";
import UserBar from "./UserBar";

const NavBar = () => {
  const [numberOfYourTurn, setNumberOfYourTurn] = useState(0);
  const { fetchData } = useHttpRequest();
  const { keycloak } = useKeycloak();
  const { DICE_GAME_API } = useSelector((state) => state.config);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData({ url: `${DICE_GAME_API}/game/ping` }, (body) => {
        setNumberOfYourTurn(body.numberOfYourTurn);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [DICE_GAME_API, fetchData]);

  return (
    <Navbar className={`nav bg-light ${classes.nav} `}>
      <Nav className="navbar-collapse">
        <LinkContainer to="/home">
          <Nav.Link className={classes.logo}>
            <img src="img/logo.png" />
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/home">
          <Nav.Link className={`link-secondary navLink ${classes.navLink}`}>
            Home
          </Nav.Link>
        </LinkContainer>

        {keycloak.authenticated && (
          <LinkContainer to="/create">
            <Nav.Link className={`link-secondary navLink ${classes.navLink}`}>
              New Game
            </Nav.Link>
          </LinkContainer>
        )}

        {keycloak.authenticated && (
          <LinkContainer to="/games">
            <Nav.Link
              className={`link-secondary navLink ${classes.navLink} ${
                numberOfYourTurn !== 0 ? classes.yourGameNewText : ""
              }`}
            >
              Your Games
            </Nav.Link>
          </LinkContainer>
        )}
      </Nav>
      <Nav className={`justify-content-end ${classes.userBar}`}>
        <UserBar />
      </Nav>
    </Navbar>
  );
};

export default NavBar;
