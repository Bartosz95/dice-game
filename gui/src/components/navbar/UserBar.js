import { Fragment } from "react";
import { NavDropdown, Dropdown, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";

export default () => {
  const { keycloak } = useKeycloak();
  const { userInfo } = useSelector((state) => state.auth);

  const loginDiv = (
    <Nav.Link
      variant="outline-secondary"
      className="userBarBtn"
      onClick={keycloak.login}
    >
      Login
    </Nav.Link>
  );

  const logoutDiv = (
    <Dropdown.Item
      className="navItem"
      onClick={() => {
        keycloak.logout();
        window.location.href = `/`;
      }}
    >
      Logout
    </Dropdown.Item>
  );

  const accountManagementDiv = (
    <Dropdown.Item className="navItem" onClick={keycloak.accountManagement}>
      Account
    </Dropdown.Item>
  );

  const dropdown = (
    <NavDropdown
      title={userInfo.preferred_username}
      variant="outline-secondary"
      className="userBarBtn"
    >
      {logoutDiv}
    </NavDropdown>
  );

  return <Fragment>{keycloak.authenticated ? dropdown : loginDiv}</Fragment>;
};
