import { createCorsairClient, createCorsairHooks } from 'corsair'
import type { CorsairRouter } from './trpc'

const { typedClient } = createCorsairClient<CorsairRouter>({
  url: '/api/corsair',
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
