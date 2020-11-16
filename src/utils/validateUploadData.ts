import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import * as schema from '../schema/appUploadSchema.json'

const ajv = new Ajv({ schemas: [schema] })
addFormats(ajv)

const validate = ajv.compile(schema.definitions.AppUploadData)

const validateUploadData = (data: any) => {
  const isValid = validate(data)
  if (!isValid) {
    return {
      valid: false,
      errors: validate.errors,
    }
  }

  return {
    valid: true,
    errors: null,
  }
}

export default validateUploadData
