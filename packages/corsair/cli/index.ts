#!/usr/bin/env node

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
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
