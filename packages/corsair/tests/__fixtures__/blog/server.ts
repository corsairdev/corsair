import {
  createCorsairServerQueryClient,
  createCorsairServerMutationClient,
} from "../../../core";
import { queries } from "./queries";
import { mutations } from "./mutations";
import { createDefaultBlogContext, BlogContext } from "./context";

// Mock cache function for testing (in real app this would be React's cache)
const mockCache = <T extends (...args: any[]) => any>(fn: T): T => {
  let cachedResult: ReturnType<T> | undefined;
  return ((...args: Parameters<T>) => {
    if (cachedResult === undefined) {
      cachedResult = fn(...args);
    }
    return cachedResult;
  }) as T;
};

// Use mock cache to ensure the same context is used across a single request
const getServerContext = mockCache(createDefaultBlogContext);

// Server-side functions (for use in server components)
const serverQueryClient = createCorsairServerQueryClient(
  queries,
  getServerContext
);

const serverMutationClient = createCorsairServerMutationClient(
  mutations,
  getServerContext
);

export const blogQuery = serverQueryClient.query;
export const blogMutation = serverMutationClient.mutate;

// Context utilities for testing
export const createBlogServerContext = (
  userId?: string,
  userRole?: "author" | "admin" | "moderator"
): (() => BlogContext) => {
  return mockCache(() => createDefaultBlogContext());
};

// Server functions with custom context
export const createBlogServerFunctions = (
  contextFactory: () => BlogContext
) => {
  const customQueryClient = createCorsairServerQueryClient(
    queries,
    contextFactory
  );
  const customMutationClient = createCorsairServerMutationClient(
    mutations,
    contextFactory
  );

  return {
    query: customQueryClient.query,
    mutate: customMutationClient.mutate,
  };
};
