import React from "react"
import { ErrorHandler } from "../utils/ErrorHandler"
import ErrorLabel from "./ErrorLabel"

export default function FormInput(props: {
  label: string
  name: string
  errorHandler: ErrorHandler
  value?: string | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any
}) {
  return (
    <div className="form-group">
      <label>{props.label}</label>
      <input
        id={props.name}
        type="text"
        value={props.value}
        onChange={props.onChange}
        className={props.errorHandler.getErrorClass(props.name, "form-control")}
      ></input>
      <ErrorLabel message={props.errorHandler.getErrorText(props.name)} />
    </div>
  )
}
