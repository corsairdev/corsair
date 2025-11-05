import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import type {
  CorsairQueries,
  CorsairMutations,
  CorsairPrompt,
  InferOperationInput,
  InferOperationOutput,
} from "./types";

type ClientOptions = {
  endpoint?: string;
  validate?: boolean;
};

type QueryClientOptions<TQueries extends CorsairQueries<any>, P extends keyof TQueries> =
  Omit<UseQueryOptions<InferOperationOutput<TQueries, P>>, "queryKey" | "queryFn"> & ClientOptions;

type MutationClientOptions<TMutations extends CorsairMutations<any>, P extends keyof TMutations> =
  Omit<
    UseMutationOptions<
      InferOperationOutput<TMutations, P>,
      Error,
      void
    >,
    "mutationFn"
  > & ClientOptions;

async function fetchOperation(
  endpoint: string,
  operationType: "query" | "mutation",
  prompt: string,
  input: any
): Promise<any> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      input,
      operation: operationType,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

export function createCorsairQueryClient<TQueries extends CorsairQueries<any>>(
  queries: TQueries
) {
  return {
    useQuery: <P extends keyof TQueries>(
      prompt: CorsairPrompt<P>,
      input: InferOperationInput<TQueries, P>,
      options?: QueryClientOptions<TQueries, P>
    ) => {
      const {
        endpoint = "/api/corsair",
        validate = true,
        ...queryOptions
      } = options || {};

      const query = queries[prompt];

      return useQuery<InferOperationOutput<TQueries, P>>({
        queryKey: [prompt, input],
        queryFn: async () => {
          if (validate) {
            query.input_type.parse(input);
          }

          const data = await fetchOperation(endpoint, "query", query.prompt, input);

          if (validate && query.response_type) {
            return query.response_type.parse(data);
          }

          return data;
        },
        ...queryOptions,
      });
    },
  };
}

export function createCorsairMutationClient<TMutations extends CorsairMutations<any>>(
  mutations: TMutations
) {
  return {
    useMutation: <P extends keyof TMutations>(
      prompt: CorsairPrompt<P>,
      input: InferOperationInput<TMutations, P>,
      options?: MutationClientOptions<TMutations, P>
    ) => {
      const {
        endpoint = "/api/corsair",
        validate = true,
        ...mutationOptions
      } = options || {};

      const mutation = mutations[prompt];

      return useMutation<
        InferOperationOutput<TMutations, P>,
        Error,
        void
      >({
        ...mutationOptions,
        mutationFn: async () => {
          if (validate) {
            mutation.input_type.parse(input);
          }

          const data = await fetchOperation(endpoint, "mutation", mutation.prompt, input);

          if (validate && mutation.response_type) {
            return mutation.response_type.parse(data);
          }

          return data;
        },
      });
    },
  };
}