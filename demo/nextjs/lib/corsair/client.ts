import {
  createCorsairQueryClient,
  createCorsairMutationClient,
  createCorsairServerQueryClient,
  createCorsairServerMutationClient,
} from "../../../../packages/corsair/client";
import { mutations } from "./mutations";
import { queries } from "./queries";
import { cache } from "react";
import { createServerContext } from "./context";

// Client-side hooks (for use in client components)
const queryClient = createCorsairQueryClient(queries);
const mutationClient = createCorsairMutationClient(mutations);

export const useCorsairQuery = queryClient.useQuery;
export const useCorsairMutation = mutationClient.useMutation;

// Use React's cache() to ensure the same context is used across a single request
const getServerContext = cache(createServerContext);

// Server-side functions (for use in server components)
const serverQueryClient = createCorsairServerQueryClient(
  queries,
  getServerContext
);
const serverMutationClient = createCorsairServerMutationClient(
  mutations,
  getServerContext
);

export const corsairQuery = serverQueryClient.query;
export const corsairMutation = serverMutationClient.mutate;
