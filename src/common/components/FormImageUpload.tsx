import React from "react"
import { getPictureUrl } from "../../profile/profileService"
import { ErrorHandler } from "../utils/ErrorHandler"
import ErrorLabel from "./ErrorLabel"
import ImageUpload from "./ImageUpload"

export default function FromImageUpload(props: {
  picture: string
  name: string
  errorHandler: ErrorHandler
  onImageChanged: (image: string) => any
}) {
  return (
    <div className="form-group">
      <label>Profile Picture</label>
      <ImageUpload
        src={getPictureUrl(props.picture)}
        onChange={props.onImageChanged}
      />
      <ErrorLabel message={props.errorHandler.getErrorText("image")} />
    </div>
  )
}
