import { promises as fs } from 'fs'
import { exec } from 'child_process'
import path from 'path'
import { promisify } from 'util'
import { tool } from 'ai'
import z from 'zod'

const execAsync = promisify(exec)

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
      'Write the full contents of the target TypeScript file. Returns build errors for that file.',
    inputSchema: z.object({
      code: z.string().describe('The exact code to insert into the file.'),
    }),
    execute: async ({ code }) => {
      const targetPath = path.resolve(process.cwd(), pwd)

      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, code, 'utf8')

      const validation = await validateTypeScriptFile(pwd)

      if (!validation.success) {
        return validation.errors
      }

      return 'success'
    },
  })
