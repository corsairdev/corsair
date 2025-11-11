import superjson from 'superjson'
import type { TRPCClientError, CreateTRPCClientOptions } from '@trpc/client'
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client'
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { useQuery, useMutation } from '@tanstack/react-query'
import type {
  inferRouterInputs,
  inferRouterOutputs,
  AnyTRPCRouter,
} from '@trpc/server'
import { routeKeyMapping } from './utils'

// Generic client factory function
export function createCorsairClient<TRouter extends AnyTRPCRouter>(options: {
  url: string
  transformer?: any // tRPC's transformer type is complex and requires 'any' for compatibility
  clientOptions?: Partial<CreateTRPCClientOptions<TRouter>>
  linkOptions?: any // tRPC's link options type is complex and requires 'any' for compatibility
}) {
  const baseClient = createTRPCClient<TRouter>({
    links: [
      httpBatchStreamLink({
        url: options.url,
        transformer: options.transformer || superjson,
        ...(options.linkOptions || {}),
      }),
    ],
    ...(options.clientOptions || {}),
  })

  type RouterInputs = inferRouterInputs<TRouter>
  type RouterOutputs = inferRouterOutputs<TRouter>

  const typedClient = baseClient as unknown as StronglyTypedClient<TRouter>

  type RouterDef = TRouter['_def']
  type RouterProcedures = RouterDef['procedures']

  // Helper to check if a procedure is a mutation
  type IsMutation<T> = T extends { _def: { type: 'mutation' } } ? true : false

  // Extract mutation routes automatically
  type MutationRoutes = {
    [K in keyof RouterProcedures]: IsMutation<RouterProcedures[K]> extends true
      ? K
      : never
  }[keyof RouterProcedures]

  // Extract query routes automatically
  type QueryRoutes = Exclude<keyof RouterInputs, MutationRoutes>

  return {
    baseClient,
    typedClient,
    types: {} as {
      RouterInputs: RouterInputs
      RouterOutputs: RouterOutputs
      QueryRoutes: QueryRoutes
      MutationRoutes: MutationRoutes
    },
  }
}

type StronglyTypedClient<TRouter extends AnyTRPCRouter> = {
  [K in keyof inferRouterInputs<TRouter>]: {
    query: (
      input: inferRouterInputs<TRouter>[K]
    ) => Promise<inferRouterOutputs<TRouter>[K]>
    mutate: (
      input: inferRouterInputs<TRouter>[K]
    ) => Promise<inferRouterOutputs<TRouter>[K]>
  }
}

export function createCorsairHooks<TRouter extends AnyTRPCRouter>(
  typedClient: StronglyTypedClient<TRouter>
) {
  type RouterInputs = inferRouterInputs<TRouter>
  type RouterOutputs = inferRouterOutputs<TRouter>

  type RouterDef = TRouter['_def']
  type RouterProcedures = RouterDef['procedures']

  type IsMutation<T> = T extends { _def: { type: 'mutation' } } ? true : false

  type MutationRoutes = {
    [K in keyof RouterProcedures]: IsMutation<RouterProcedures[K]> extends true
      ? K
      : never
  }[keyof RouterProcedures]

  type QueryRoutes = Exclude<keyof RouterInputs, MutationRoutes>

  function useCorsairQuery<TRoute extends QueryRoutes>(
    route: TRoute,
    input: RouterInputs[TRoute],
    options?: Omit<
      UseQueryOptions<RouterOutputs[TRoute], TRPCClientError<TRouter>>,
      'queryKey' | 'queryFn'
    >
  ) {
    return useQuery<RouterOutputs[TRoute], TRPCClientError<TRouter>>({
      queryKey: [route, input],
      queryFn: async () => {
        // Convert natural language route to camelCase for HTTP request
        const camelCaseRoute = (route as string)
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^\w/, c => c.toLowerCase())

        return typedClient[camelCaseRoute as TRoute].query(input)
      },
      ...options,
    })
  }

  function useCorsairMutation<TRoute extends MutationRoutes>(
    route: TRoute,
    options?: Omit<
      UseMutationOptions<
        RouterOutputs[TRoute],
        TRPCClientError<TRouter>,
        RouterInputs[TRoute]
      >,
      'mutationFn'
    >
  ) {
    return useMutation<
      RouterOutputs[TRoute],
      TRPCClientError<TRouter>,
      RouterInputs[TRoute]
    >({
      mutationFn: async (input: RouterInputs[TRoute]) => {
        // Convert natural language route to camelCase for HTTP request
        const camelCaseRoute = (route as string)
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^\w/, c => c.toLowerCase())

        return typedClient[camelCaseRoute as TRoute].mutate(input)
      },
      ...options,
    })
  }

  async function corsairQuery<TRoute extends QueryRoutes>(
    route: TRoute,
    input: RouterInputs[TRoute]
  ): Promise<RouterOutputs[TRoute]> {
    // Convert natural language route to camelCase for HTTP request
    const camelCaseRoute = (route as string)
      .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
      .replace(/^\w/, c => c.toLowerCase())

    return typedClient[camelCaseRoute as TRoute].query(input)
  }

  async function corsairMutation<TRoute extends MutationRoutes>(
    route: TRoute,
    input: RouterInputs[TRoute]
  ): Promise<RouterOutputs[TRoute]> {
    // Convert natural language route to camelCase for HTTP request
    const camelCaseRoute = (route as string)
      .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
      .replace(/^\w/, c => c.toLowerCase())

    return typedClient[camelCaseRoute as TRoute].mutate(input)
  }

  return {
    useCorsairQuery,
    useCorsairMutation,
    corsairQuery,
    corsairMutation,
    types: {} as {
      QueryInputs: { [K in QueryRoutes]: RouterInputs[K] }
      QueryOutputs: { [K in QueryRoutes]: RouterOutputs[K] }
      MutationInputs: { [K in MutationRoutes]: RouterInputs[K] }
      MutationOutputs: { [K in MutationRoutes]: RouterOutputs[K] }
    },
  }
}
