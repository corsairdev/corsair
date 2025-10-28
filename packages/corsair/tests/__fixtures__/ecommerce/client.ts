import {
  createCorsairQueryClient,
  createCorsairMutationClient,
  InferQueriesOutputs,
  InferQueriesInputs,
  InferMutationsOutputs,
  InferMutationsInputs,
} from "../../../core";
import { queries } from "./queries";
import { mutations } from "./mutations";

// Client-side hooks (for use in client components)
const queryClient = createCorsairQueryClient(queries);
const mutationClient = createCorsairMutationClient(mutations);

export const useEcommerceQuery = queryClient.useQuery;
export const useEcommerceMutation = mutationClient.useMutation;

// Type exports for inferred outputs and inputs
export type EcommerceQueryOutputs = InferQueriesOutputs<typeof queries>;
export type EcommerceQueryInputs = InferQueriesInputs<typeof queries>;
export type EcommerceMutationOutputs = InferMutationsOutputs<typeof mutations>;
export type EcommerceMutationInputs = InferMutationsInputs<typeof mutations>;

// Specific type exports for common use cases
export type GetAllUsersInput = EcommerceQueryInputs["get all users"];
export type GetAllUsersOutput = EcommerceQueryOutputs["get all users"];

export type GetUserByIdInput = EcommerceQueryInputs["get user by id"];
export type GetUserByIdOutput = EcommerceQueryOutputs["get user by id"];

export type GetAllProductsInput = EcommerceQueryInputs["get all products"];
export type GetAllProductsOutput = EcommerceQueryOutputs["get all products"];

export type GetProductByIdInput = EcommerceQueryInputs["get product by id"];
export type GetProductByIdOutput = EcommerceQueryOutputs["get product by id"];

export type CreateUserInput = EcommerceMutationInputs["create user"];
export type CreateUserOutput = EcommerceMutationOutputs["create user"];

export type CreateProductInput = EcommerceMutationInputs["create product"];
export type CreateProductOutput = EcommerceMutationOutputs["create product"];

export type CreateOrderInput = EcommerceMutationInputs["create order"];
export type CreateOrderOutput = EcommerceMutationOutputs["create order"];

// Keep original types for backward compatibility
export type EcommerceQueries = typeof queries;
export type EcommerceMutations = typeof mutations;