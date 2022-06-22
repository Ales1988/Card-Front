import axios, { AxiosError } from "axios";
import { environment } from "../app/environment/environment";
import { updateSessionToken, cleanupSessionToken } from "../store/tokenStore";
import { cleanupSessionUser, updateSessionUser } from "../store/userStore";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
axios.defaults.headers.common["Content-Type"] = "application/json";

//DEFINO ESTRUCTURA PARA UN USER
export interface User {
  id: number;
  name: string;
  password: string;
  token: string;
}

//Ej request para el login  http://127.0.0.1:3000/players/Ale/login?password=ale
export async function login(params: {
  login: string;
  password: string;
}): Promise<User> {
  const res = (
    await axios.get(
      environment.backendUrl +
        "/players/" +
        params.login +
        "/login/?password=" +
        params.password
    )
  ).data;

  let user: User = {
    id: res.player.id,
    name: res.player.name,
    password: res.player.password,
    token: res.player.token,
  };

  console.log(res.player.name);
  setCurrentToken(user.token);
  updateSessionToken(user.token);
  updateSessionUser(user);
  return user;
}

// Valores almacenados en LOCAL STORE
function getCurrentToken(): string | undefined {
  const result = localStorage.getItem("token");
  return result ? result : undefined;
}

function setCurrentToken(token: string) {
  localStorage.setItem("token", token);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  axios.defaults.headers.common.Authorization = "bearer " + token;
}

function getCurrentUser(): User | undefined {
  return localStorage.getItem("user") as unknown as User;
}

export async function logout(): Promise<void> {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  try {
    await axios.get(environment.backendUrl + "/v1/user/signout");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    axios.defaults.headers.common.Authorization = "";
    return;
  } catch (err) {
    return;
  } finally {
    cleanupSessionToken();
    cleanupSessionUser();
  }
}

//Registra un nuevo usuario
export async function newUser(params: {
  name: string;
  password: string;
}): Promise<User> {
  const res = (await axios.post(environment.backendUrl + "/players", params))
    .data;

  let user: User = {
    id: res.player.id,
    name: res.player.name,
    password: res.player.password,
    token: res.player.token,
  };

  return user;
}

//Permite al user de cambiar password
export async function changePassword(params: {
  current_password: string;
  new_password: string;
}): Promise<void> {
  try {
    await axios.put(
      environment.backendUrl + "/players/1/change_password",
      params
    );
    return;
  } catch (err) {
    const axiosError = err as AxiosError;

    if (axiosError.response && axiosError.response.status === 401) {
      void logout();
    }
    throw err;
  }
}

if (getCurrentToken()) {
  const currentUser = getCurrentUser();
  const currentToken = getCurrentToken();
  if (currentUser !== undefined && currentToken !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    axios.defaults.headers.common.Authorization = "bearer " + currentToken;
    updateSessionToken(currentToken);
    updateSessionUser(currentUser);
  }
}
