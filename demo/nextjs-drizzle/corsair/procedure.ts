import { createCorsairTRPC } from 'corsair'
import { config } from '@/corsair.config'

export type DatabaseContext = {
  db: typeof config.db
  schema: Exclude<typeof config.schema, undefined>
  userId?: string
}

const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t
