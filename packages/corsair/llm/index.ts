import { z } from 'zod'
import { openai } from './providers/openai.js'

export type Providers = 'openai'

export const llm = async <T>({
  provider,
  prompt,
  schema,
  message,
}: {
  provider: Providers
  prompt: string
  schema: z.ZodSchema<T>
  message: string
}): Promise<T | null> => {
  if (provider === 'openai') {
    return openai({ prompt, schema, message })
  }

  throw new Error(`Provider ${provider} not supported`)
}
