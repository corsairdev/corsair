#!/usr/bin/env node

// developer prompts with something like "pnpm corsair query -n 'get all albums by artist id' -i 'make sure to return in descending order alphabetically'"
// create the file in `@/corsair/queries/get-all-albums-by-artist-id`
// update index.ts in /queries or /mutations with reference to file
// start agent
// when agent is done, let the developer know
// if agent runs X (set X to 5 maybe for now) amount of times and still can't get it right, let the developer know

async function main() {
  const command = process.argv[2]

  if (
    !command ||
    !['generate', 'check', 'migrate', 'watch', 'query', 'mutation'].includes(
      command
    )
  ) {
    console.log('Corsair CLI\n')
    console.log('Usage:')
    console.log(
      '  corsair generate             - Generate migrations from schema'
    )
    console.log(
      '  corsair check                - Test migrations in a transaction'
    )
    console.log('  corsair migrate              - Apply migrations to database')
    console.log(
      '  corsair watch                - Watch for changes and generate API routes'
    )
    console.log('')
    console.log(
      '  corsair query    -n <name> [-i <instructions>]     Create a new query'
    )
    console.log(
      '  corsair mutation -n <name> [-i <instructions>]     Create a new mutation\n'
    )
    process.exit(1)
  }

  switch (command) {
    case 'generate': {
      const { generate } = await import('./generate.js')
      await generate()
      break
    }
    case 'check': {
      const { check } = await import('./check.js')
      await check()
      break
    }
    case 'migrate': {
      const { migrate } = await import('./migrate.js')
      await migrate()
      break
    }
    case 'watch': {
      const { watch } = await import('./watch/index.js')
      await watch()
      break
    }
    case 'query': {
      const { runOperation } = await import('./operation.js')
      await runOperation('query')
      break
    }
    case 'mutation': {
      const { runOperation } = await import('./operation.js')
      await runOperation('mutation')
      break
    }
    case 'test': {
      const { promptAgent } = await import('.././llm/agent/index.js')
      const { agentPrompt } = await import(
        '../llm/agent/prompts/agent-prompt.js'
      )
      // convert schema to testSchema (get the schema from the CLI)
      const testSchema = {}
      // get request from cli (that's the prompt name and any other commands - like "get all artists by album id")
      const request = ''
      // you'll need to move this from the "test" to "query" / "mutation"

      const pwd = 'corsair/mutations/create-track.ts'
      const result = await promptAgent(pwd).generate({
        prompt: agentPrompt(request, testSchema, {
          dbType: 'postgres',
          framework: 'nextjs',
          operation: 'mutation',
          orm: 'drizzle',
        }),
      })

      break
    }
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
