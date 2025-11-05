import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

export function createCorsairTRPC<
  TContext extends Record<string, unknown> = Record<string, unknown>
>() {
  const t = initTRPC.context<TContext>().create({
    transformer: superjson,
  })

  return {
    router: t.router,
    procedure: t.procedure,
    middleware: t.middleware,
    mergeRouters: t.mergeRouters,
  }
}
