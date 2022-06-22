import React, { useEffect, useState } from "react";
import { Game, joinGame, openGames } from "./gameService";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import { NavLink } from "react-router-dom";

export default function OpenGames() {
  //Open con mayuscola, no confundere con openGames con minuscola

  const errorHandler = useErrorHandler();

  const [games, setGames] = useState<Game[]>(); //games es un array de tipo Game donde voy a tener todos los games devuelots con la promesa openGames
  useEffect(() => {
    openGames().then((res) => {
      setGames(res);
    });
  }, []); //Gracias a [] Ejecuto el setGames solo cuando renderizo el componente.

  //Funcion que me va a ejectuar la promesa joinGame en gameService.ts
  const joinClick = async (gameId: number) => {
    errorHandler.cleanRestValidations();

    if (errorHandler.hasErrors()) {
      return;
    }

    try {
      await joinGame({
        //Llamo la promesa que va a hacer el put al game para aggregar el nuevo usuario a la partita
        gameId,
      });
    } catch (error) {
      errorHandler.processRestValidations(error);
    }
  };

  return (
    <div>
      <h1>Lista de partidas disponibles </h1>

      <ol>
        {games?.map(
          (
            game //Muestro el elenco de games y a cada uno asigno un NavLink. NOTA:
          ) => (
            //El NavLink va a ejecutar la funciòn joinClick, ademas ma a navegar a /Game/ y pasa a esa nueva ventana el state
            <li>
              {game ? " - " + game.game_name : ""}{" "}
              <NavLink
                to="/Game/"
                state={game.id}
                onClick={() => joinClick(game.id)}
                className="menu_item btn btn-sm btn-link"
              >
                Unirse
              </NavLink>
              <br />
            </li>
          )
        )}
      </ol>
    </div>
  );
}
