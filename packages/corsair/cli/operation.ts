import { z } from 'zod'
import { loadConfig, getResolvedPaths } from './config.js'
import { Schema } from './watch/handlers/schema-handler.js'
import { operationGeneratorPrompt } from '../llm/prompts/operation-generator.js'
import { llm } from '../llm/index.js'
import { fileWriteHandler } from './watch/handlers/file-write-handler.js'
const processRef = (globalThis as any).process

type ParsedArgs = {
  instructions?: string
  name?: string
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-i' || arg === '--instructions') {
      const val = argv[i + 1]
      if (val && !val.startsWith('-')) {
        args.instructions = val
        i++
      } else {
        args.instructions = ''
      }
    } else if (arg === '-n' || arg === '--name') {
      const val = argv[i + 1]
      if (val && !val.startsWith('-')) {
        args.name = val
        i++
      }
    }
  }
  return args
}

function kebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export async function runOperation(type: 'query' | 'mutation') {
  const argv = processRef.argv.slice(3)
  const { instructions = '', name } = parseArgs(argv)

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    console.error('❌ Missing required -n <name>')
    processRef.exit(1)
  }
  const operationName = name as string
  const instructionsStr: string = instructions ?? ''

  const cfg = loadConfig()
  const { schemaFile, queriesDir, mutationsDir } = getResolvedPaths(cfg)

  const schemaParser = new Schema(schemaFile)
  await schemaParser.parse(true)
  const schema = schemaParser.getSchema() ?? { tables: [] }

  const responseSchema = z.object({
    input_type: z.string(),
    function: z.string(),
    notes: z.string().optional(),
    pseudocode: z.string().optional(),
    function_name: z.string().optional(),
  })

  let llmResult: z.infer<typeof responseSchema> | null = null
  try {
    llmResult = await llm({
      provider: 'openai',
      prompt: operationGeneratorPrompt({ type, name: operationName, schema }),
      schema: responseSchema,
      message: instructionsStr,
    })
  } catch {}

  const inputType =
    llmResult?.input_type && llmResult.input_type.trim().length > 0
      ? llmResult.input_type
      : 'z.object({})'
  const handler =
    llmResult?.function && llmResult.function.trim().length > 0
      ? llmResult.function
      : 'async ({ input, ctx }) => { return null }'

  const operation = {
    operationName,
    operationType: type as 'query' | 'mutation',
    prompt: typeof instructions === 'string' ? instructions : '',
    inputType,
    handler,
    pseudocode: llmResult?.pseudocode,
    functionNameSuggestion: llmResult?.function_name,
  }

  await fileWriteHandler.writeOperationToFile(operation)

  const baseDir = type === 'query' ? queriesDir : mutationsDir
  const file = `${baseDir}/${kebabCase(operationName)}.ts`
  console.log(`✅ ${type} created: ${file}`)
}
