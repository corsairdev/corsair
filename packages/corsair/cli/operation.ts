const processRef = (globalThis as any).process
import path from 'path'
import { loadConfig, loadEnv, getResolvedPaths } from './config.js'
import { eventBus } from './watch/core/event-bus.js'
import { CorsairEvent } from './watch/types/events.js'
import './watch/core/state-machine.js'
import './watch/handlers/query-generator.js'
import './watch/handlers/error-handler.js'
import { tryLoadUnifiedSchema } from './schema-loader.js'
import {
  fileWriteHandler,
  type OperationToWrite,
} from './watch/handlers/file-write-handler.js'

type OpKind = 'query' | 'mutation'

function parseArgs(argv: string[]): { name?: string; instructions?: string } {
  let name: string | undefined
  let instructions: string | undefined
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if ((arg === '-n' || arg === '--name') && i + 1 < argv.length) {
      name = argv[i + 1]
      i++
      continue
    }
    if ((arg === '-i' || arg === '--instructions') && i + 1 < argv.length) {
      instructions = argv[i + 1]
      i++
      continue
    }
  }
  return { name, instructions }
}

export async function runOperation(kind: OpKind) {
  const argv = processRef.argv.slice(3)
  const { name, instructions } = parseArgs(argv)

  if (!name || name.trim().length === 0) {
    console.error('❌ Missing required name. Use -n "<operation name>".')
    processRef.exit(1)
  }

  const cfg = loadConfig()
  loadEnv(cfg.envFile ?? '.env.local')
  const paths = getResolvedPaths(cfg)

  const { schema } = await tryLoadUnifiedSchema()
  if (schema) {
    eventBus.emit(CorsairEvent.SCHEMA_LOADED, { schema })
  }

  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let spinnerIndex = 0
  let spinnerInterval: NodeJS.Timeout | undefined

  let resolveDone: (() => void) | undefined
  let rejectDone: ((error: Error) => void) | undefined
  const done = new Promise<void>((resolve, reject) => {
    resolveDone = resolve
    rejectDone = reject
  })

  const startSpinner = (label: string) => {
    if (spinnerInterval) return
    processRef.stdout.write(`${label} ${spinnerFrames[spinnerIndex]}`)
    spinnerInterval = setInterval(() => {
      spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length
      processRef.stdout.write(`\r${label} ${spinnerFrames[spinnerIndex]}`)
    }, 80)
  }

  const stopSpinner = () => {
    if (!spinnerInterval) return
    clearInterval(spinnerInterval)
    spinnerInterval = undefined
    processRef.stdout.write('\r')
  }

  eventBus.once(CorsairEvent.LLM_ANALYSIS_FAILED, data => {
    stopSpinner()
    console.error(
      `LLM analysis failed for ${data.operationType} "${data.operationName}": ${data.error}`
    )
    rejectDone?.(new Error(data.error))
  })

  eventBus.once(CorsairEvent.LLM_ANALYSIS_COMPLETE, data => {
    stopSpinner()
    const raw = data.response
    const inputType = fileWriteHandler.parseInputTypeFromLLM(raw.input_type)
    const handler = fileWriteHandler.parseHandlerFromLLM(raw.function)

    const operationToWrite: OperationToWrite = {
      operationName: data.operation.operationName,
      operationType: data.operation.operationType,
      prompt: data.operation.prompt,
      inputType,
      handler,
      pseudocode: raw.pseudocode,
      functionNameSuggestion: raw.function_name,
      targetFilePath: data.operation.file,
    }

    fileWriteHandler
      .writeOperationToFile(operationToWrite)
      .then(() => {
        const opName = data.operation.operationName
        const finalPath =
          fileWriteHandler.getOperationFilePath(operationToWrite)
        const cwd = processRef.cwd()
        const displayPath = finalPath.startsWith(cwd + path.sep)
          ? finalPath.slice(cwd.length + 1)
          : finalPath

        const inputSchema = raw.input_type
        const outputTypeValue = (raw as any).output_type
        const outputType =
          (typeof outputTypeValue === 'string' &&
          outputTypeValue.trim().length > 0
            ? outputTypeValue
            : null) ||
          (data.operation.operationType === 'query'
            ? `InferQueriesOutputs<typeof queries>["${opName}"]`
            : `InferMutationsOutputs<typeof mutations>["${opName}"]`)

        const accent = '\x1b[36m'
        const label = '\x1b[90m'
        const value = '\x1b[33m'
        const reset = '\x1b[0m'

        console.log('')
        console.log(
          `${accent}┌───────────────────── Corsair Operation ─────────────────────┐${reset}`
        )
        console.log(
          `${accent}│${reset} ${label}Name        ${reset}${value}${opName}${reset}`
        )
        console.log(
          `${accent}│${reset} ${label}Input props ${reset}${value}${inputSchema}${reset}`
        )
        console.log(
          `${accent}│${reset} ${label}Output type ${reset}${value}${outputType}${reset}`
        )
        console.log(
          `${accent}│${reset} ${label}File        ${reset}${value}${displayPath}${reset}`
        )
        console.log(
          `${accent}└──────────────────────────────────────────────────────────────┘${reset}`
        )

        resolveDone?.()
      })
      .catch(error => {
        console.error(
          `Failed to write operation "${operationToWrite.operationName}":`,
          error
        )
        rejectDone?.(error instanceof Error ? error : new Error(String(error)))
      })
  })

  const operationName = name!.trim()
  const prompt = (instructions && instructions.trim()) || operationName
  const functionName = kind === 'query' ? 'corsairQuery' : 'corsairMutation'
  const fakeFile =
    kind === 'query'
      ? path.join(paths.queriesDir, `${operationName}.ts`)
      : path.join(paths.mutationsDir, `${operationName}.ts`)
  const lineNumber = 1

  startSpinner(
    `Generating ${kind === 'query' ? 'query' : 'mutation'} "${operationName}"`
  )

  eventBus.emit(
    kind === 'query'
      ? CorsairEvent.NEW_QUERY_ADDED
      : CorsairEvent.NEW_MUTATION_ADDED,
    {
      operationName,
      functionName,
      prompt,
      file: fakeFile,
      lineNumber,
    }
  )

  setTimeout(() => {
    eventBus.emit(CorsairEvent.USER_COMMAND, {
      command: 'submit_operation_config',
      args: { configurationRules: instructions },
    })
  }, 50)

  await done
}
