import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DangerLabel from "../common/components/DangerLabel";
import Form from "../common/components/Form";
import FormAcceptButton from "../common/components/FormAcceptButton";
import FormButton from "../common/components/FormButton";
import FormButtonBar from "../common/components/FormButtonBar";
import FormInput from "../common/components/FormInput";
import FormTitle from "../common/components/FormTitle";
import GlobalContent from "../common/components/GlobalContent";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import "../styles.css";
import { newGame } from "./gameService";

export default function NewGame() {
  const [game_name, setGameName] = useState("");
  const history = useNavigate();
  const errorHandler = useErrorHandler();

  const registerClick = async () => {
    errorHandler.cleanRestValidations();

    if (errorHandler.hasErrors()) {
      return;
    }

    try {
      let game = await newGame({
        //En game voy a tener el game que POST con newGame en el back
        game_name,
      });

      history("/Game", {
        state: game.id, //Voy a la pagina donde se juega pasando el id del game creado para poder jugar al game que he creado
      });
    } catch (error) {
      errorHandler.processRestValidations(error);
    }
  };

  return (
    <GlobalContent>
      <FormTitle>Crea una nueva partida</FormTitle>

      <Form>
        <FormInput
          label="Nombre de la partida"
          name="gameName"
          errorHandler={errorHandler}
          onChange={(event) => setGameName(event.target.value)}
        />

        <DangerLabel message={errorHandler.errorMessage} />

        <FormButtonBar>
          <FormAcceptButton label="Crea partida" onClick={registerClick} />
          <FormButton label="Cancelar" onClick={() => history("/")} />
        </FormButtonBar>
      </Form>
    </GlobalContent>
  );
}
