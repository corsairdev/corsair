import {
  createTRPCClient,
  httpBatchStreamLink,
  httpSubscriptionLink,
  splitLink,
} from "@trpc/client";
import { AnyRouter } from "@trpc/server";
import superjson from "superjson";

export const transformer = superjson;

// Initialize the tRPC client
export const trpc = <T extends AnyRouter>(url: string) =>
  createTRPCClient<T>({
    links: [
      splitLink({
        condition: (op) => op.type === "subscription",
        true: httpSubscriptionLink({
          url: url + "/api/corsair",
          transformer,
        }),
        // @ts-expect-error - TODO: fix this
        false: httpBatchStreamLink({
          url: url + "/api/corsair",
          transformer,
        }),
      }),
    ],
  });
