import {
  createCorsairQueryClient,
  createCorsairMutationClient,
} from "corsair/core";
import { mutations } from "./mutations";
import { queries } from "./queries";

// Client-side hooks (for use in client components)
const queryClient = createCorsairQueryClient(queries);
const mutationClient = createCorsairMutationClient(mutations);

export const useCorsairQuery = queryClient.useQuery;
export const useCorsairMutation = mutationClient.useMutation;
