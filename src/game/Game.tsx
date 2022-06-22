import React, { useEffect, useState } from "react";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import "../styles.css";
import "./Game.css";
import { recuperaGame, draft, play } from "./gameService";
import { useLocation } from "react-router-dom";
import { useSessionUser } from "../store/userStore";
import Square from "../common/components/Square";
import { AxiosError } from "axios";

export default function Play() {
  const errorHandler = useErrorHandler();
  let location = useLocation(); //Recupero informacion desde el navlink...en particular el id del game que se està jugando
  let gameId = location.state as number; //Recupero gameId desde state que llega con el navLink, asi despues puedo hacer un get al game para recuperarlo desde el back
  const user = useSessionUser(); //Recupero el user

  //Donde guardo en local datos del game
  const [nameGame, setNameGame] = useState<string>("");
  const [cardsHand, setCardsHand] = useState<String[]>([]); //Donde guardo en local las cartas que tiene en mano el jugador
  const [cardsPlayed, setCardsPlayed] = useState<String[]>([]); //Donde guardo en local las cartas jugadas en la mesa
  const [myCard, setMyCard] = useState<number>(2); //Sirve para reconocer qué parte de la mesa es de un jugador y cuál es del otro
  const [hisCard, setHisCard] = useState<number>(2); //Sirve para reconocer qué parte de la mesa es de un jugador y cuál es del otro
  const [myPoints, setMyPoint] = useState<number>(0); //Sirve para mostrar los puntos del jugador
  const [hisPoints, setHisPoint] = useState<number>(0); //Sirve para mostrar los puntos del oponente
  const [turn, setTurn] = useState<string>(""); //Sirve para mostrar a quien toca jugar

  useEffect(() => {
    const interval = setInterval(() => {
      //Me permite ejecutar cada 1000 ms el siguiente codigo donde siguo preguntando al back los datos del game que estoy jugando
      //Eso sirve porque  no tengo otro modo de actualizar la pantalla del jugador que està esperando su turno
      recuperaGame({ gameId }).then((res) => {
        //Ejecuto la promesa que recupera los datos

        setNameGame(res.game_name); //Guardo en local el nombre del game
        setCardsPlayed(res.cards_played); //Guardo en local las cartas jugadas en la mesa

        //Asigno las cartas de la mano segun el id del jugador
        if (user?.id === res.player1_id) {
          setCardsHand(res.cards_hand_p1);
        }
        if (user?.id === res.player2_id) {
          setCardsHand(res.cards_hand_p2);
        }

        //Asigno la parte de mesa
        if (user?.id === res.player1_id) {
          setMyCard(0);
          setHisCard(1);
        }
        if (user?.id === res.player2_id) {
          setMyCard(1);
          setHisCard(0);
        }

        //Recupero puntos
        if (user?.id === res.player1_id) {
          //Si soy el jugador 1
          setMyPoint(res.points_player1); //Mi puntos son los del jugador 1
          setHisPoint(res.points_player2); //Y los puntos del oponente son del jugador 2
        }
        if (user?.id === res.player2_id) {
          //Si soy el jugador 2
          setMyPoint(res.points_player2); //Mi puntos son los del jugador 2
          setHisPoint(res.points_player1); //Y los puntos del oponente son del jugador 1
        }

        //Recupero de quien es el turno
        if (user?.id === res.active_player) {
          setTurn(user.name);
        } else {
          setTurn("Oponente");
        }
      });
    }, 1000); //Aca termina el codigo que se repite cada 1000 ms, justamente cambiando 1000 cambio el intervalo
    return () => clearInterval(interval);
  }, []); //Aca termina useEffect. Las [] me permiten de ejecutar el useEffect solo una volta

  //Funcion que permite a un jugador de robar una carta
  const onClickDraft = async () => {
    if (errorHandler.hasErrors()) {
      return;
    }

    try {
      await draft({
        gameId,
      });
    } catch (error) {
      errorHandler.processRestValidations(error);
      if (error instanceof AxiosError) {
        //Tengo que poner instanceof porque typescript duda que error sea de tipo AxiosError
        alert(error.response?.data.message);
      }
    }
  }; //Termina funcion onClickDraft

  //Funcion que permite a un jugador de jugar una carta
  const onClickPlay = async (card_name: String) => {
    if (errorHandler.hasErrors()) {
      return;
    }

    try {
      await play({
        gameId,
        card_name,
      });
    } catch (error) {
      errorHandler.processRestValidations(error);
      if (error instanceof AxiosError) {
        //Tengo que poner instanceof porque typescript duda que error sea de tipo AxiosError
        alert(error.response?.data.message);
      }
    }
  }; //Termina funcion onClickPlay

  //Se llama al hacer click en una carta ya jugada
  function onClick() {
    alert("No puedes cambiar una carta ya jugada!");
  }

  //Componente board, para mostrar toda la UI
  function Board() {
    return (
      <div>
        <h3>Nombre partida: {nameGame}.</h3>
        <h4>Es el turno de {turn}</h4>
        <h3>Mazo de Cartas</h3>
        <Square onClick={() => onClickDraft()} card="DRAFT" image="retro" />

        <table>
          <h3>Puntos</h3>
          <tr>
            <th>
              {" "}
              <h4>{user?.name}</h4>
            </th>
            <th>
              <h4>Oponente</h4>
            </th>
          </tr>
          <tr>
            <th>
              {" "}
              <h4>{myPoints}</h4>
            </th>
            <th>
              <h4>{hisPoints}</h4>
            </th>
          </tr>

          <tr>
            <th>Tu Carta</th>
            <th>Carta Oponente</th>
          </tr>
          <tr>
            <th>
              <Square
                onClick={() => onClick()}
                card=""
                image={cardsPlayed[myCard]}
              />
            </th>
            <th>
              <Square
                onClick={() => onClick()}
                card=""
                image={cardsPlayed[hisCard]}
              />
            </th>
          </tr>
        </table>
        <h3>Tu Mano</h3>
        <div className="cardHand">
          {cardsHand.map((cardName) => (
            <Square
              onClick={() => onClickPlay(cardName)}
              card=""
              image={cardName}
            />
          ))}
        </div>
      </div>
    );
  }

  return <Board />;
}
