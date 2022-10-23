import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";

import "./games.css";

import SingleGameDiv from "./SingleGameDiv";
import CreateDiv from "./CreateDiv";
import AlertMessage from "../alerts/AlertMessage";
import useHttpRequest from "../../hooks/useHttpRequest";

export default () => {
  const { DICE_GAME_API } = useSelector((state) => state.config);
  const { keycloak } = useKeycloak();

  const [games, setGames] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const { alertMessage, renderContent, fetchData } = useHttpRequest();

  useEffect(() => {
    setTimeout(() => setDeleteMessage(null), 7000);
    fetchData({ url: `${DICE_GAME_API}/game` }, (body) => setGames(body));
  }, [deleteMessage, DICE_GAME_API, fetchData, keycloak.authenticated]);

  const deleteGame = async (id) => {
    const requestOptions = {
      url: `${DICE_GAME_API}/game/${id}`,
      method: "DELETE",
    };
    fetchData(requestOptions, (body) => setDeleteMessage(body));
  };

  const gamesDiv = games.map((game) => (
    <SingleGameDiv key={game._id} game={game} deleteGame={deleteGame} />
  ));

  const content = games.length > 0 ? gamesDiv : <CreateDiv />;

  return (
    <Container className="mainContainer">
      {alertMessage && <AlertMessage elems={alertMessage} />}
      {deleteMessage && <AlertMessage elems={deleteMessage} />}
      {renderContent ? (
        content
      ) : (
        <div className="spinner">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
    </Container>
  );
};
