import 'server-only'
import { corsairRouter } from './trpc'
import { createServerContext } from './context'

export async function corsairQuery(route: any, input: any): Promise<any> {
  const caller = corsairRouter.createCaller(createServerContext()) as any
  return caller[route].query(input)
}
