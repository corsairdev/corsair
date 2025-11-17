import { tool } from 'ai'
import z from 'zod'

export const readFile = (pwd: string) =>
  tool({
    description: 'Read the file',
    inputSchema: z.object({}),
    execute: async ({}) => {
      // get the file text using the pwd to get the most recent version of the file
      return `
    `
    },
  })
