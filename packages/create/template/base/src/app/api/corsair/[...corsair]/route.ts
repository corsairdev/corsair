import { fetchRequestHandler } from "@corsair-ai/core";
import { corsairRouter } from "@/corsair/index";
import { plugins } from "@/corsair/procedure";
import { db } from "@/db";

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/corsair",
    req,
    router: corsairRouter,
    createContext: () => {
      return {
        // if you add auth, pass the session here
        session: {},
        db,
        plugins,
      };
    },
  });
};

// Export named methods for App Router
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
