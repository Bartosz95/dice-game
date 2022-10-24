import { Fragment } from "react";
import { NavDropdown, Dropdown, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";

import classes from "./navbar.module.css";

const UserBar = () => {
  const { keycloak } = useKeycloak();
  const { userInfo } = useSelector((state) => state.auth);

  const loginDiv = (
    <Nav.Link
      variant="outline-secondary"
      className={classes.userBarBtn}
      onClick={keycloak.login}
    >
      Login
    </Nav.Link>
  );

  const logoutDiv = (
    <Dropdown.Item
      className={classes.navItem}
      onClick={() => {
        keycloak.logout();
        window.location.href = `/`;
      }}
    >
      Logout
    </Dropdown.Item>
  );

  const accountManagementDiv = (
    <Dropdown.Item
      className={classes.navItem}
      onClick={keycloak.accountManagement}
    >
      Account
    </Dropdown.Item>
  );

  const dropdown = (
    <NavDropdown
      title={userInfo.preferred_username}
      variant="outline-secondary"
      className={classes.userBarBtn}
    >
      {logoutDiv}
    </NavDropdown>
  );

  return <Fragment>{keycloak.authenticated ? dropdown : loginDiv}</Fragment>;
};

export default UserBar;
