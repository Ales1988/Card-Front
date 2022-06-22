import { useForceUpdate } from "./Tools"
import { useState } from "react"

interface IError {
  response?: {
    data?: {
      error?: string
      messages?: {
        path: string
        message: string
      }[]
    }
  }
}

export class ErrorHandler {
  constructor(forceUpdate: () => any) {
    this.forceUpdate = forceUpdate
  }

  private forceUpdate: () => any

  // Es un error genérico en el form, no asociado a ningún componente visual
  public errorMessage?: string = undefined

  // Son errores de los componentes visuales, es un map
  // la clave es el campo con error, el contenido es el mensaje
  public errors: Map<string, string> = new Map<string, string>()

  // Procesa errores rest y llena errors de acuerdo a los resultados
  public processRestValidations(err: any) {
    const data = err as IError

    if (this.errors && this.errors.size > 0) {
      this.cleanRestValidations()
      this.forceUpdate()
    }
    if (!data.response || !data.response.data) {
      this.errorMessage =
        "Problemas de conexión, verifique conexión a internet."
      this.forceUpdate()
      return
    }
    if (data.response.data.messages) {
      for (const error of data.response.data.messages) {
        this.errors.set(error.path, error.message)
      }
    } else if (typeof data.response.data.error === "string") {
      this.errorMessage = data.response.data.error
    } else {
      this.errorMessage = "Problemas internos del servidor"
    }
    this.forceUpdate()
  }

  public addError(component: string, message: string) {
    this.errors.set(component, message)
    this.forceUpdate()
  }

  // Limpia las validaciones actuales de errores
  public cleanRestValidations() {
    this.errorMessage = undefined
    this.errors.clear()
    this.forceUpdate()
  }

  // Devuelve el texto del error de un elemento
  public getErrorText(item: string): string | undefined {
    return this.errors.get(item)
  }

  public getErrorClass(component: string, baseClass: string): string {
    return baseClass + (this.getErrorText(component) ? " is-invalid" : "")
  }

  public hasErrors(): boolean {
    return this.errors.size > 0 && !this.errorMessage
  }
}

export function useErrorHandler(): ErrorHandler {
  const forceUpdate = useForceUpdate()
  return useState(new ErrorHandler(forceUpdate))[0]
}
