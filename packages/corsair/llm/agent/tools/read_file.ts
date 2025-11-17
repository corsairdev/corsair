import { tool } from 'ai'
import z from 'zod'

export const readFile = tool({
  description: 'Get the plugins for the current project',
  inputSchema: z.object({
    project: z.string().describe('The project to get the plugins for'),
  }),
  execute: async ({ project }) => {
    return { plugins: [] }
  },
})
