import { fetchRequestHandler } from 'corsair'
import { corsairRouter } from '@/corsair'
import { db } from '@/db'

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/corsair',
    req,
    router: corsairRouter,
    createContext: () => {
      return {
        userId: '123',
        db,
        schema: db._.schema!,
      }
    },
  })
}

// Export named methods for App Router
export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const HEAD = handler
export const OPTIONS = handler
