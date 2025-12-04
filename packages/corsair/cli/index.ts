#!/usr/bin/env node

import { Command } from 'commander'
import { runAgentOperation } from './operation.js'

const program = new Command()

program
  .name('corsair')
  .description('Corsair CLI - Type-safe database operations with AI assistance')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize a new Corsair project with necessary files')
  .action(async () => {
    const { init } = await import('./init.js')
    await init()
  })

program
  .command('check')
  .description('Run TypeScript type checking on query and mutation files')
  .action(async () => {
    const { check } = await import('./check.js')
    await check()
  })

program
  .command('fix')
  .description('Fix type errors by regenerating files with errors')
  .action(async () => {
    const { fix } = await import('./fix.js')
    await fix()
  })

program
  .command('watch')
  .description('Watch for changes and generate API routes')
  .action(async () => {
    const { watch } = await import('../watch/index.js')
    await watch()
  })

program
  .command('query')
  .description('Create a new query')
  .requiredOption('-n, --name <name>', 'Operation name')
  .option('-i, --instructions <instructions>', 'Additional instructions')
  .option('-u, --update', 'Update/regenerate existing query file')
  .action(async options => {
    await runAgentOperation(
      'query',
      options.name,
      options.instructions,
      options.update
    )
  })

program
  .command('mutation')
  .description('Create a new mutation')
  .requiredOption('-n, --name <name>', 'Operation name')
  .option('-i, --instructions <instructions>', 'Additional instructions')
  .option('-u, --update', 'Update/regenerate existing mutation file')
  .action(async options => {
    await runAgentOperation(
      'mutation',
      options.name,
      options.instructions,
      options.update
    )
  })

program
  .command('list')
  .description('List all queries and mutations with their details')
  .option('-q, --queries', 'List only queries')
  .option('-m, --mutations', 'List only mutations')
  .option('-f, --filter <filter>', 'Filter operations by search string')
  .action(async options => {
    const { list } = await import('./list.js')
    await list({
      queries: options.queries,
      mutations: options.mutations,
      filter: options.filter,
    })
  })

program.parse()

process.on('unhandledRejection', error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
