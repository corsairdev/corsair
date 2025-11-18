#!/usr/bin/env node

import { Command } from 'commander'
import { kebabToCamelCase, toKebabCase } from './utils.js'

// developer prompts with something like "pnpm corsair query -n 'get all albums by artist id' -i 'make sure to return in descending order alphabetically'"
// create the file in `@/corsair/queries/get-all-albums-by-artist-id`
// update index.ts in /queries or /mutations with reference to file
// start agent
// when agent is done, let the developer know
// if agent runs X (set X to 5 maybe for now) amount of times and still can't get it right, let the developer know
// if there are any error while building the generated file, give the errors back to llm to correct them

type OpKind = 'query' | 'mutation'

async function runAgentOperation(
  kind: OpKind,
  name: string,
  instructions?: string
) {
  const { loadConfig, loadEnv } = await import('./config.js')
  const { loadSchema } = await import('./schema-loader.js')
  const { promptAgent } = await import('../llm/agent/index.js')
  const { promptBuilder } = await import(
    '../llm/agent/prompts/prompt-builder.js'
  )

  const cfg = loadConfig()
  loadEnv(cfg.envFile ?? '.env.local')

  const kebabCaseName = toKebabCase(name.trim())
  const camelCaseName = kebabToCamelCase(kebabCaseName)

  const baseDir = kind === 'query' ? cfg.paths.queries : cfg.paths.mutations
  const pwd = `${baseDir}/${kebabCaseName}.ts`
  const prompt = promptBuilder(
    camelCaseName,
    await loadSchema(),
    {
      dbType: 'postgres',
      framework: 'nextjs',
      operation: kind,
      orm: 'drizzle',
    },
    instructions
  )

  await promptAgent(pwd).generate({ prompt })

  console.log(
    `✅ Agent finished generating ${kind} "${camelCaseName}" at ${pwd}.`
  )
}

const program = new Command()

program
  .name('corsair')
  .description('Corsair CLI - Type-safe database operations with AI assistance')
  .version('1.0.0')

program
  .command('generate')
  .description('Generate migrations from schema')
  .action(async () => {
    const { generate } = await import('./generate.js')
    await generate()
  })

program
  .command('check')
  .description('Test migrations in a transaction')
  .action(async () => {
    const { check } = await import('./check.js')
    await check()
  })

program
  .command('migrate')
  .description('Apply migrations to database')
  .action(async () => {
    const { migrate } = await import('./migrate.js')
    await migrate()
  })

program
  .command('watch')
  .description('Watch for changes and generate API routes')
  .action(async () => {
    const { watch } = await import('./watch/index.js')
    await watch()
  })

program
  .command('query')
  .description('Create a new query')
  .requiredOption('-n, --name <name>', 'Operation name')
  .option('-i, --instructions <instructions>', 'Additional instructions')
  .action(async options => {
    await runAgentOperation('query', options.name, options.instructions)
  })

program
  .command('mutation')
  .description('Create a new mutation')
  .requiredOption('-n, --name <name>', 'Operation name')
  .option('-i, --instructions <instructions>', 'Additional instructions')
  .action(async options => {
    await runAgentOperation('mutation', options.name, options.instructions)
  })

program.parse()

process.on('unhandledRejection', error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
