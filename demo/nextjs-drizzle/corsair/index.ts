import { dualKeyOperationsMap } from 'corsair'
import { router } from './procedure'
import * as mutations from './mutations'
import * as queries from './queries'

export const corsairRouter = router({
  ...dualKeyOperationsMap(queries),
  ...dualKeyOperationsMap(mutations),
})

export type CorsairRouter = typeof corsairRouter
