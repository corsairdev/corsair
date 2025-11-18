import { promises as fs } from 'fs'
import { exec } from 'child_process'
import path from 'path'
import { promisify } from 'util'
import { tool } from 'ai'
import z from 'zod'

const execAsync = promisify(exec)

async function updateBarrelFile(targetPath: string) {
  if (!targetPath.endsWith('.ts')) {
    return
  }

  const dir = path.dirname(targetPath)
  const fileName = path.basename(targetPath, '.ts')

  if (fileName === 'index' || fileName === '@index') {
    return
  }

  const exportLine = `export * from './${fileName}'\n`
  const barrelCandidates = ['index.ts', '@index.ts']

  let updatedExisting = false

  for (const barrelName of barrelCandidates) {
    const barrelPath = path.join(dir, barrelName)

    try {
      const existing = await fs.readFile(barrelPath, 'utf8')
      if (!existing.includes(exportLine)) {
        await fs.appendFile(barrelPath, exportLine)
      }
      updatedExisting = true
    } catch {}
  }

  if (!updatedExisting) {
    const barrelPath = path.join(dir, 'index.ts')
    await fs.writeFile(barrelPath, exportLine)
  }
}

async function validateTypeScriptFile(pwd: string) {
  const cwd = process.cwd()
  const normalizedPwd = pwd.split(path.sep).join(path.posix.sep)

  const command = `npx tsc --noEmit --pretty false 2>&1 | grep "${normalizedPwd}" || true`

  const result = await execAsync(command, {
    cwd,
    maxBuffer: 10 * 1024 * 1024,
  }).catch(error => {
    const execError = error as { stdout?: string; stderr?: string }
    return {
      stdout: execError.stdout ?? '',
      stderr: execError.stderr ?? '',
    }
  })

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()

  if (!output) {
    return { success: true, errors: '' }
  }

  return { success: false, errors: output }
}

export const writeFile = (pwd: string) =>
  tool({
    description:
      'Write the full contents of the target TypeScript file. Returns build errors for that file or success message. If there are errors, you MUST call this tool again with corrected code.',
    inputSchema: z.object({
      code: z.string().describe('The exact code to insert into the file.'),
    }),
    execute: async ({ code }) => {
      const targetPath = path.resolve(process.cwd(), pwd)

      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, code, 'utf8')

      await updateBarrelFile(targetPath)

      const validation = await validateTypeScriptFile(pwd)

      if (!validation.success) {
        const errorMessage = `BUILD FAILED - TypeScript compilation errors found:\n\n${validation.errors}\n\nPlease fix these errors and call write_file again with corrected code.`
        console.log('[WRITE_FILE] Error message:', errorMessage)
        return errorMessage
      }

      return 'SUCCESS - File written and TypeScript compilation passed with zero errors.'
    },
  })
