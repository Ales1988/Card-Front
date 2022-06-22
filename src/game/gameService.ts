import axios, { responseEncoding } from "axios";
import { environment } from "../app/environment/environment";
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
axios.defaults.headers.common["Content-Type"] = "application/json";

//ESTRUCTURA DE UN GAME
export interface Game {
  id: number;
  player1_id: number;
  player2_id: number;
  game_name: string;
  cards_deck: string[];
  cards_hand_p1: string[];
  cards_hand_p2: string[];
  cards_won_p1: string[];
  cards_won_p2: string[];
  cards_played: string[];
  active_player: number;
  points_player1: number;
  points_player2: number;
}

//CREA UN NUEVO GAME
export async function newGame(params: { game_name: string }): Promise<Game> {
  const res = (await axios.post(environment.backendUrl + "/games", params))
    .data;

  let game: Game = {
    id: res.game.id,
    player1_id: res.game.player1_id,
    player2_id: res.game.player2_id,
    game_name: res.game.game_name,
    cards_deck: res.game.cards_decks,
    cards_hand_p1: res.game.cards_hand_p1,
    cards_hand_p2: res.game.cards_hand_p2,
    cards_won_p1: res.game.cards_won_p1,
    cards_won_p2: res.game.cards_won_p2,
    cards_played: res.game.cards_played,
    active_player: res.game.active_player,
    points_player1: res.game.points_player1,
    points_player2: res.game.points_player2,
  };
  return game;
}

//BUSCO TODOS LOS GAMES DONDE FALTA UN JUGADOR
export async function openGames(): Promise<Game[]> {
  const res = (await axios.get(environment.backendUrl + "/games?search=nil"))
    .data;

  let numeroGames = res.games.length; //Recupero length de mi response, osea cuantos game devuelvo
  let game = new Array<Game>();

  for (let i = 0; i < numeroGames; i++) {
    game[i] = {
      id: res.games[i].id,
      player1_id: res.games[i].player1_id,
      player2_id: res.games[i].player2_id,
      game_name: res.games[i].game_name,
      cards_deck: res.games[i].cards_decks,
      cards_hand_p1: res.games[i].cards_hand_p1,
      cards_hand_p2: res.games[i].cards_hand_p2,
      cards_won_p1: res.games[i].cards_won_p1,
      cards_won_p2: res.games[i].cards_won_p2,
      cards_played: res.games[i].cards_played,
      active_player: res.games[i].active_player,
      points_player1: res.games[i].points_player1,
      points_player2: res.games[i].points_player2,
    };
  }

  return game;
}

//ASIGNA EL SEGUNDO JUGADOR A UN GAME
export async function joinGame(params: { gameId: number }): Promise<Game> {
  const res = (
    await axios.put(
      environment.backendUrl + "/games/" + params.gameId + "/join",
      params
    )
  ).data;

  return res;
}

//RECUPERA DATOS DEL GAME
export async function recuperaGame(params: { gameId: number }): Promise<Game> {
  const res = (
    await axios.get(environment.backendUrl + "/games/" + params.gameId)
  ).data;

  let game: Game = {
    id: res.game.id,
    player1_id: res.game.player1_id,
    player2_id: res.game.player2_id,
    game_name: res.game.game_name,
    cards_deck: res.game.cards_decks,
    cards_hand_p1: res.game.cards_hand_p1,
    cards_hand_p2: res.game.cards_hand_p2,
    cards_won_p1: res.game.cards_won_p1,
    cards_won_p2: res.game.cards_won_p2,
    cards_played: res.game.cards_played,
    active_player: res.game.active_player,
    points_player1: res.game.points_player1,
    points_player2: res.game.points_player2,
  };

  return game;
}

//PERMITE ROBAR UNA CARTA
export async function draft(params: { gameId: number }): Promise<Game> {
  const res = (
    await axios.put(
      environment.backendUrl + "/games/" + params.gameId + "/draft"
    )
  ).data;
  return res;
}

//PERMITE DE JUGAR UNA CARTA
export async function play(params: {
  gameId: number;
  card_name: String;
}): Promise<Game> {
  const res = (
    await axios.put(
      environment.backendUrl + "/games/" + params.gameId + "/play",
      params
    )
  ).data;
  return res;
}
