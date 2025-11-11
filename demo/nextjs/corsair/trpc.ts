import { createCorsairTRPC } from 'corsair'
import type { db } from '../db'

export type DatabaseContext = {
  db: typeof db
  schema: Exclude<typeof db._.schema, undefined>
  userId?: string
}

const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t