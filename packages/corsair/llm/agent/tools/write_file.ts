import { tool } from 'ai'
import z from 'zod'

export const writeFile = (pwd: string) =>
  tool({
    description: 'Get the plugins for the current project',
    inputSchema: z.object({
      code: z.string().describe('The exact code to insert into the file.'),
    }),
    execute: async ({ code }) => {
      // after it's done writing the file with the relevant code, it needs to validate the file. we can do that with a bash command
      // you just have to pass in the directory to the file that we're building. that's the "pwd"
      // notice that "pwd" is not known to the agent at all. we're passing it outside the agent's context. it's not important to the agent at all
      // npx tsc --noEmit --pretty false 2>&1 | grep "corsair/mutations/create-track.ts" || true
      // npx tsc --noEmit --pretty false 2>&1 | grep pwd || true
      return { plugins: [] }
    },
  })
