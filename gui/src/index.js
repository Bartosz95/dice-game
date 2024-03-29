import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ReactKeycloakProvider } from "@react-keycloak/web";

import store from "./store/index";
import keycloak from "./keycloak";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ReactKeycloakProvider>
);
