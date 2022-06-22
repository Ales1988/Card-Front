import React from "react"

export default function FormLabel(props: {
  label: string
  text: string | undefined
}) {
  return (
    <div className="form-group">
      <label>params.label</label>
      <input className="form-control" id="login" value={props.text} disabled />
    </div>
  )
}
