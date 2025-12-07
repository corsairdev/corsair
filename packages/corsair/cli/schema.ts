import { exec } from 'child_process'
import { schemaLoaderCLI } from './utils/schema-loader-cli.js'
import { promisify } from 'util'

const execAsync = promisify(exec)

const body = schemaLoaderCLI
  .toString()
  .slice(
    schemaLoaderCLI.toString().indexOf('{') + 1,
    schemaLoaderCLI.toString().lastIndexOf('}')
  )
  .trim()

// i can't figure out if this is the smartest or dumbest code i've ever written
export const schema = async () => {
  try {
    const code = `
import { config } from './corsair.config.js'

${body}

const formattedConfig = {
  ...config,
  db: undefined,
}
// console.log(JSON.stringify(formattedConfig, null, 2))

console.log(JSON.stringify(dbSchema, null, 2))
`

    const result = await execAsync(
      `tsx --conditions=react-server -e "${code.replace(/"/g, '\\"')}"`,
      {
        cwd: process.cwd(),
      }
    )

    console.log(result.stdout)
  } catch (error) {
    console.error('Error extracting schema:', error)
  }
}
