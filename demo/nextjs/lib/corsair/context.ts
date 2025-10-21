import { NextRequest } from "next/server";
import { db, DatabaseContext } from "./db";
import * as schema from "./schema";
import { cookies } from "next/headers";

// Helper function to extract userId from request (for API routes)
async function getUserIdFromRequest(request: NextRequest): Promise<string | undefined> {
  // TODO: Implement your auth logic here
  // Examples:
  // - const session = await getServerSession(authOptions);
  // - const { userId } = auth(); // Clerk
  // - const token = request.headers.get("authorization");

  return undefined;
}

// Helper function to get userId in server components (using cookies/headers)
function getUserIdFromServerContext(): string | undefined {
  // TODO: Implement your auth logic here
  // Examples:
  // - const session = await getServerSession(authOptions);
  // - const { userId } = auth(); // Clerk
  // - const cookieStore = cookies();
  // - const userId = cookieStore.get("userId")?.value;

  return undefined;
}

// Context factory for API routes (receives NextRequest)
export async function createContext(
  request: NextRequest
): Promise<DatabaseContext> {
  const userId = await getUserIdFromRequest(request);

  return {
    db,
    schema,
    userId,
  };
}

// Context factory for server components (no request available)
export function createServerContext(): DatabaseContext {
  const userId = getUserIdFromServerContext();

  return {
    db,
    schema,
    userId,
  };
}
