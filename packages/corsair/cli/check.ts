import { existsSync, readdirSync } from 'fs'
import { resolve, join } from 'path'
import { loadConfig } from './config.js'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function check() {
  const cfg = loadConfig()

  const queriesPath = resolve(process.cwd(), cfg.paths.queries)
  const mutationsPath = resolve(process.cwd(), cfg.paths.mutations)

  const allFiles: string[] = []

  if (existsSync(queriesPath)) {
    const queryFiles = readdirSync(queriesPath)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => join(queriesPath, file))
    allFiles.push(...queryFiles)
  }

  if (existsSync(mutationsPath)) {
    const mutationFiles = readdirSync(mutationsPath)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => join(mutationsPath, file))
    allFiles.push(...mutationFiles)
  }

  if (allFiles.length === 0) {
    console.log('❌ No query or mutation files found to check')
    process.exit(1)
  }

  console.log(`🔍 Checking TypeScript types for ${allFiles.length} files...\n`)

  let output = ''

  try {
    const result = await execAsync('npx tsc --noEmit --pretty false 2>&1', {
      cwd: process.cwd(),
    })
    output = result.stdout || ''
  } catch (error: any) {
    output = (error.stdout || '') + (error.stderr || '')
  }

  const errors: { file: string; errors: string[] }[] = []

  for (const file of allFiles) {
    const normalizedPath = file.replace(resolve(process.cwd()) + '/', '')
    const fileName = file.split('/').pop()!

    const fileErrors = output
      .split('\n')
      .filter(
        line =>
          line.trim() &&
          (line.includes(normalizedPath) || line.includes(fileName))
      )
      .filter(line => line.includes('error TS'))

    if (fileErrors.length > 0) {
      errors.push({ file, errors: fileErrors })
    }
  }

  if (errors.length > 0) {
    console.log('❌ Type errors found:\n')
    errors.forEach(result => {
      const fileName = result.file.split('/').pop()
      console.log(`📄 ${fileName}:`)
      result.errors.forEach(error => {
        console.log(`   ${error}`)
      })
      console.log()
    })
    process.exit(1)
  } else {
    console.log('✅ All files passed type checking!')
  }
}
