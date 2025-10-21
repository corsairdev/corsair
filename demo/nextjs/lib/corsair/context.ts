import { NextRequest } from "next/server";
import { db, DatabaseContext } from "./db";
import * as schema from "./schema";

export async function createContext(
  request: NextRequest
): Promise<DatabaseContext> {
  // however you want to get the user id
  const userId = "await getUserIdFromRequest(request);";

  return {
    db,
    schema,
    userId,
  };
}
