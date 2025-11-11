import { router } from './trpc'
import { mutations, queries } from './operations'

export type { DatabaseContext } from './trpc'
export { procedure } from './trpc'

export const corsairRouter = router({
  ...queries,
  ...mutations,
})

export type CorsairRouter = typeof corsairRouter
