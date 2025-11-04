// Server-side functions only (use in server components and API routes)
import 'server-only'
import {
  createCorsairServerQueryClient,
  createCorsairServerMutationClient,
} from 'corsair/core'
import { mutations } from './operations'
import { queries } from './operations'
import { cache } from 'react'
import { createServerContext } from './context'

// Use React's cache() to ensure the same context is used across a single request
const getServerContext = cache(createServerContext)

// Server-side functions (for use in server components)
const serverQueryClient = createCorsairServerQueryClient(
  queries,
  getServerContext
)
const serverMutationClient = createCorsairServerMutationClient(
  mutations,
  getServerContext
)

export const corsairQuery = serverQueryClient.query
export const corsairMutation = serverMutationClient.mutate
