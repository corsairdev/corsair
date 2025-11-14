const processRef = (globalThis as any).process
import { render } from 'ink'
import React from 'react'
import path from 'path'
import { loadConfig, loadEnv, getResolvedPaths } from './config.js'
import { eventBus } from './watch/core/event-bus.js'
import { CorsairEvent } from './watch/types/events.js'
import { CorsairUI } from './watch/ui/renderer.js'
import './watch/core/state-machine.js'
import './watch/handlers/query-generator.js'
import './watch/handlers/user-input-handler.js'
import './watch/handlers/error-handler.js'
import { tryLoadUnifiedSchema } from './schema-loader.js'

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

  console.clear()
  console.log('Corsair Operation\n')

  const { waitUntilExit } = render(
    React.createElement(CorsairUI, { warnings: [] })
  )

  const operationName = name!.trim()
  const prompt = (instructions && instructions.trim()) || operationName
  const functionName = kind === 'query' ? 'corsairQuery' : 'corsairMutation'
  const fakeFile =
    kind === 'query'
      ? path.join(paths.queriesDir, `${operationName}.ts`)
      : path.join(paths.mutationsDir, `${operationName}.ts`)
  const lineNumber = 1

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

  if (instructions && instructions.trim().length > 0) {
    setTimeout(() => {
      eventBus.emit(CorsairEvent.USER_COMMAND, {
        command: 'submit_operation_config',
        args: { configurationRules: instructions },
      })
    }, 50)
  }

  await waitUntilExit()
}
