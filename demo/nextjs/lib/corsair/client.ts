import {
  createCorsairQueryClient,
  createCorsairMutationClient,
} from "../../../../packages/corsair/client";
import { mutations } from "./mutations";
import { queries } from "./queries";

const queryClient = createCorsairQueryClient(queries);
const mutationClient = createCorsairMutationClient(mutations);

export const useCorsairQuery = queryClient.useQuery;
export const useCorsairMutation = mutationClient.useMutation;
