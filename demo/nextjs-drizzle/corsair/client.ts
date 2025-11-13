import { createCorsairClient, createCorsairHooks } from 'corsair'
import type { CorsairRouter } from '.'

const { typedClient } = createCorsairClient<CorsairRouter>({
  url: `http://localhost:3000${process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!}`,
})

const {
  useCorsairQuery,
  useCorsairMutation,
  corsairQuery,
  corsairMutation,
  types,
} = createCorsairHooks<CorsairRouter>(typedClient)

export { useCorsairQuery, useCorsairMutation, corsairQuery, corsairMutation }

export type QueryInputs = typeof types.QueryInputs
export type QueryOutputs = typeof types.QueryOutputs
export type MutationInputs = typeof types.MutationInputs
export type MutationOutputs = typeof types.MutationOutputs
