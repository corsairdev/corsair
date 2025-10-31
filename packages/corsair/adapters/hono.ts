import { executeCorsairMutation } from '../api/mutation'
import { CorsairMutations } from '../core/types'
import { Context } from 'hono'

export function createHonoHandler<TMutations extends CorsairMutations>(
  mutations: TMutations
) {
  return async (c: Context) => {
    const body = await c.req.json()
    const result = await executeCorsairMutation(mutations, body)

    if (result.success) {
      return c.json(result.data)
    } else {
      const status = result.error.includes('validation') ? 400 : 500
      return c.json({ message: result.error, errors: result.errors }, status)
    }
  }
}
