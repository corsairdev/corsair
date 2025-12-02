import 'dotenv/config'

import { spawn } from 'child_process'
import { existsSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  loadConfig,
  loadEnv,
  checkDatabaseUrl,
  getResolvedPaths,
} from './config.js'

// Get the path to corsair's drizzle-kit
function getCorsairDrizzleKitPath(): string {
  // This file is in dist/cli/generate.js, so we go up to the package root
  const currentFilePath = fileURLToPath(import.meta.url)
  const packageRoot = resolve(dirname(currentFilePath), '../..')
  return join(packageRoot, 'node_modules/.bin/drizzle-kit')
}

async function runDrizzleCommand(
  command: 'pull' | 'generate',
  config: { schema: string; out: string; dialect: string; url: string }
): Promise<boolean> {
  return new Promise(resolve => {
    const drizzleKitPath = getCorsairDrizzleKitPath()
    const args: string[] = [command]

    if (command === 'pull') {
      // pull command needs database URL and output directory
      args.push('--dialect', config.dialect)
      args.push('--out', config.out)
      args.push('--url', config.url)
    } else {
      // generate command needs schema, output, and dialect
      args.push('--schema', config.schema)
      args.push('--out', config.out)
      args.push('--dialect', config.dialect)
    }

    const child = spawn(drizzleKitPath, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
      env: process.env,
    })

    child.on('close', code => {
      resolve(code === 0)
    })
  })
}

export async function generate() {
  console.log('🔧 Generating migrations...\n')

  const cfg = loadConfig()
  loadEnv('.env.local')
  checkDatabaseUrl(cfg.connection)

  const { schemaFile } = getResolvedPaths(cfg)
  const outPath = resolve(process.cwd(), 'drizzle')

  // Create drizzle output directory for snapshot.json
  if (!existsSync(outPath)) {
    mkdirSync(outPath, { recursive: true })
  }

  const drizzleConfig = {
    schema: schemaFile,
    out: outPath,
    dialect: 'postgresql' as const,
    url: process.env.DATABASE_URL!,
  }

  try {
    // Pull current schema from database
    console.log('📥 Pulling current schema from database...\n')
    const pullSuccess = await runDrizzleCommand('pull', drizzleConfig)

    if (!pullSuccess) {
      console.error('❌ Failed to pull schema from database')
      process.exit(1)
    }

    // Generate migration
    console.log('\n📝 Generating migration files...\n')
    const generateSuccess = await runDrizzleCommand('generate', drizzleConfig)

    if (!generateSuccess) {
      console.error('❌ Failed to generate migrations')
      rmSync(outPath, { recursive: true, force: true })
      process.exit(1)
    }

    // Copy SQL files to ./corsair/sql directory
    const sqlDir = resolve(process.cwd(), 'corsair/sql')

    if (!existsSync(sqlDir)) {
      mkdirSync(sqlDir, { recursive: true })
    }

    if (existsSync(outPath)) {
      const files = readdirSync(outPath)
      const sqlFiles = files.filter(file => file.endsWith('.sql'))

      for (const file of sqlFiles) {
        const srcPath = join(outPath, file)
        const destPath = join(sqlDir, file)
        copyFileSync(srcPath, destPath)
      }

      console.log(`\n✅ Migration files saved to ${sqlDir}/`)
    }

    // Clean up drizzle folder (including snapshot.json and meta)
    if (existsSync(outPath)) {
      rmSync(outPath, { recursive: true, force: true })
    }

    console.log('\n🔍 Checking for conflicts...\n')

    // Run check
    const { check } = await import('./check.js')
    await check()
  } catch (error) {
    // Clean up drizzle folder on error
    if (existsSync(outPath)) {
      rmSync(outPath, { recursive: true, force: true })
    }
    throw error
  }
}
