import {
  createCorsairQueryClient,
  createCorsairMutationClient,
  InferQueriesOutputs,
  InferQueriesInputs,
  InferMutationsOutputs,
  InferMutationsInputs,
} from 'corsair/dist/legacy-core'
import { mutations, queries } from './operations'

// Client-side hooks (for use in client components)
const queryClient = createCorsairQueryClient(queries)
const mutationClient = createCorsairMutationClient(mutations)

export const useCorsairQuery = queryClient.useQuery
export const useCorsairMutation = mutationClient.useMutation

// Type exports for inferred outputs and inputs
export type QueryOutputs = InferQueriesOutputs<typeof queries>
export type QueryInputs = InferQueriesInputs<typeof queries>
export type MutationOutputs = InferMutationsOutputs<typeof mutations>
export type MutationInputs = InferMutationsInputs<typeof mutations>

// Keep original types for backward compatibility
export type Mutations = typeof mutations
export type Queries = typeof queries
