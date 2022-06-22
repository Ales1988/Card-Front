import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DangerLabel from "../common/components/DangerLabel";
import Form from "../common/components/Form";
import FormAcceptButton from "../common/components/FormAcceptButton";
import FormButton from "../common/components/FormButton";
import FormButtonBar from "../common/components/FormButtonBar";
import FormPassword from "../common/components/FormPassword";
import FormTitle from "../common/components/FormTitle";
import GlobalContent from "../common/components/GlobalContent";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import "../styles.css";
import { changePassword } from "./userService";

export default function Password() {
  const history = useNavigate();
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const errorHandler = useErrorHandler();

  const updatePasswordClick = async () => {
    errorHandler.cleanRestValidations();

    if (!current_password) {
      errorHandler.addError("currentPassword", "No puede estar vacío");
    }
    if (!new_password) {
      errorHandler.addError("newPassword", "No puede estar vacío");
    }
    if (new_password !== newPassword2) {
      errorHandler.addError("newPassword2", "Las contraseñas no coinciden");
    }

    if (errorHandler.hasErrors()) {
      return;
    }

    try {
      await changePassword({
        current_password,
        new_password,
      });
      history("/");
    } catch (error) {
      errorHandler.processRestValidations(error);
    }
  };

  return (
    <GlobalContent>
      <FormTitle>Cambiar Password</FormTitle>

      <Form>
        <FormPassword
          label="Password Actual"
          name="currentPassword"
          errorHandler={errorHandler}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />

        <FormPassword
          label="Nuevo Password"
          name="newPassword"
          errorHandler={errorHandler}
          onChange={(event) => setNewPassword(event.target.value)}
        />

        <FormPassword
          label="Repetir Password"
          name="newPassword2"
          errorHandler={errorHandler}
          onChange={(event) => setNewPassword2(event.target.value)}
        />

        <DangerLabel message={errorHandler.errorMessage} />

        <FormButtonBar>
          <FormAcceptButton label="Cambiar" onClick={updatePasswordClick} />
          <FormButton label="Cancelar" onClick={() => history("/")} />
        </FormButtonBar>
      </Form>
    </GlobalContent>
  );
}
