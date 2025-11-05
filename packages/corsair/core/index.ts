export * from './client'
export * from './router'

// we don't need to export these right now, but i'd like to have them available for later if necessary
// export {
//   TRPCClientError,
//   createTRPCClient,
//   httpBatchStreamLink,
//   type CreateTRPCClientOptions,
//   type HTTPBatchLinkOptions,
// } from '@trpc/client'

// export {
//   initTRPC,
//   type inferRouterInputs,
//   type inferRouterOutputs,
//   type AnyTRPCRouter,
// } from '@trpc/server'

// export {
//   useQuery,
//   useMutation,
//   type UseQueryOptions,
//   type UseMutationOptions,
// } from '@tanstack/react-query'

export { createNextApiHandler } from '@trpc/server/adapters/next'

export { z } from 'zod'
export { default as superjson } from 'superjson'
