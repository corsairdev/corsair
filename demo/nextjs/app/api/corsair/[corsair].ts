import { createNextApiHandler } from 'corsair'
import { corsairRouter } from '@/corsair/trpc'
import { db } from '@/corsair/db'
import { schema } from '@/corsair/types'

// export API handler
export default createNextApiHandler({
  router: corsairRouter,
  createContext: () => {
    return {
      userId: '123',
      db,
      schema,
    }
  },
})
