const tsj = require('ts-json-schema-generator')
const fs = require('fs')

const config = {
  path: 'src/types/app.d.ts',
  tsconfig: 'tsconfig.json',
  type: 'AppUploadData',
}

const output_path = 'src/schema/appUploadSchema.json'

const schema = tsj.createGenerator(config).createSchema(config.type)
const schemaString = JSON.stringify(schema, null, 2)
fs.writeFile(output_path, schemaString, (err: NodeJS.ErrnoException) => {
  if (err) throw err
})
