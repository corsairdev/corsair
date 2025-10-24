import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createNextApiHandler } from "@trpc/server/adapters/next";

const transformer = superjson;

const t = initTRPC.create({
  transformer,
});

export const { procedure: action, router } = t;

export default createNextApiHandler;
