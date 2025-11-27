import { dualKeyOperationsMap } from 'corsair'
import { router } from './procedure'
import * as queries from './queries'
import * as mutations from './mutations'

export const corsairRouter = router({
  ...dualKeyOperationsMap(queries),
  ...dualKeyOperationsMap(mutations),
})

export type CorsairRouter = typeof corsairRouter
