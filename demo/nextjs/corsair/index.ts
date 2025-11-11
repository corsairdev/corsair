import * as queries from './queries'
import * as mutations from './mutations'

import { operationsMap, createCorsairTRPC } from 'corsair'
import type { db } from '../db'

export type DatabaseContext = {
  db: typeof db
  schema: Exclude<typeof db._.schema, undefined>
  userId?: string
}

const t = createCorsairTRPC<DatabaseContext>()
const { router, procedure } = t

export const corsairRouter = router({
  ...operationsMap(queries),
  ...operationsMap(mutations),
})

export type CorsairRouter = typeof corsairRouter

export { procedure }
