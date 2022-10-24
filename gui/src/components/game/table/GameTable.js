import React from "react";
import { Table } from "react-bootstrap";
import classes from "./GameTable.module.css";

const GameTable = (props) => {
  const { markFigureTochoose, chosenFigure } = props;
  const { players, currentPlayer, numberOfRoll, isYourTurn } = props.game;

  const canBeSelected = (player, figure) => {
    return (
      numberOfRoll !== 0 &&
      isYourTurn &&
      player.id === currentPlayer &&
      player.table[figure] === null &&
      figure !== "bonus" &&
      figure !== "to bonus" &&
      figure !== "total"
    );
  };

  const isFigureSelected = (player, figure) => {
    return canBeSelected(player, figure) && figure === chosenFigure;
  };

  const getStyle = (player, figure) => {
    const cellStyle = ["table-success"];
    if (isFigureSelected(player, figure)) {
      cellStyle.push(classes["selected-cell"]);
    } else if (canBeSelected(player, figure)) {
      cellStyle.push(classes["can-be-select-cell"]);
    } else {
      return "";
    }
    return cellStyle.join(" ");
  };

  const cellText = (player, figure) => {
    if (canBeSelected(player, figure)) {
      if (isFigureSelected(player, figure)) {
        return figure;
      }
      return <div className={classes["can-be-select-text"]}>{figure}</div>;
    }
    return "";
  };

  const cellClass = (player, figure) => {
    if (canBeSelected(player, figure)) {
      if (isFigureSelected(player, figure)) {
        return classes["select-cell-text"];
      }
      return classes["can-be-select-cell-text"];
    }
    return "";
  };

  const head = [];
  const body = [];
  head.push(<th key="#"></th>);

  if (players[0]) {
    for (const player of players) {
      const style = [
        classes["my-row-style"],
        player.id === currentPlayer && classes["table-success"],
      ];
      head.push(
        <th key={player.id} className={`table-success ${style.join(" ")}`}>
          {player.username}
        </th>
      );
    }

    for (const figure of Object.keys(players[0].table)) {
      const row = [];
      row.push(
        <td key={`f${figure}`} className={classes.figureNameRow}>
          {figure}
        </td>
      );

      for (const player of players) {
        const style = [classes["my-row-style"], getStyle(player, figure)];
        row.push(
          <td
            key={`p${player.id}f${figure}`}
            onClick={
              canBeSelected(player, figure)
                ? () => markFigureTochoose(figure)
                : () => {}
            }
            className={`${style.join(" ")}`}
          >
            <div className={cellClass(player, figure)}>
              {" "}
              {cellText(player, figure)}
            </div>
            {player.table[figure]}
          </td>
        );
      }
      body.push(<tr key={`r${figure}`}>{row}</tr>);
    }
  }

  return (
    <Table bordered>
      <thead>
        <tr>{head}</tr>
      </thead>
      <tbody>{body}</tbody>
    </Table>
  );
};

export default GameTable;
