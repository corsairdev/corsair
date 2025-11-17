import { Experimental_Agent as Agent, stepCountIs } from 'ai'
import { readFile, writeFile } from './tools'

export const promptAgent = (pwd: string) =>
  new Agent({
    model: 'openai/gpt-4o',
    tools: {
      readFile: readFile(pwd),
      writeFile: writeFile(pwd),
    },
    stopWhen: stepCountIs(20),
  })
