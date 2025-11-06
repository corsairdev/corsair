import { createCorsairTRPC } from 'corsair'
import { type DatabaseContext } from '../types'
import * as queriesModule from '../queries'
import * as mutationsModule from '../mutations'

const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t

type Operation = {
  prompt: string
  input_type: any
  handler: (input: unknown, ctx: DatabaseContext) => Promise<unknown>
}

function isOperation(value: unknown): value is Operation {
  return (
    !!value &&
    typeof value === 'object' &&
    'prompt' in value &&
    'input_type' in value &&
    'handler' in value
  )
}

const queryProcedures: Record<string, any> = {}
for (const value of Object.values(queriesModule) as unknown[]) {
  if (isOperation(value)) {
    queryProcedures[value.prompt] = procedure
      .input((value as Operation).input_type)
      .query(async ({ input, ctx }) => (value as Operation).handler(input, ctx))
  }
}

const mutationProcedures: Record<string, any> = {}
for (const value of Object.values(mutationsModule) as unknown[]) {
  if (isOperation(value)) {
    mutationProcedures[value.prompt] = procedure
      .input((value as Operation).input_type)
      .mutation(async ({ input, ctx }) =>
        (value as Operation).handler(input, ctx)
      )
  }
}

export const corsairProcedureRouter = router({
  ...queryProcedures,
  ...mutationProcedures,
})

export type CorsairProcedureRouter = typeof corsairProcedureRouter
