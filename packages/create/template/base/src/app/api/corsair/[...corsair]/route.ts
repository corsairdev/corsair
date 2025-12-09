import { fetchRequestHandler } from "@corsair-ai/core";
import { corsairRouter } from "@/corsair/index";
import { plugins } from "@/corsair/procedure";
import { db } from "@/db";
import { getSession } from "@/better-auth/server";

const handler = async (req: Request) => {
  const session = await getSession();

  return fetchRequestHandler({
    endpoint: "/api/corsair",
    req,
    router: corsairRouter,
    createContext: () => {
      return {
        userId: session?.user?.id,
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
