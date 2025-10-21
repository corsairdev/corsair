import { createNextJsHandler } from "../../../../../packages/corsair/adapters/nextjs";
import { queries } from "@/lib/corsair/queries";
import { mutations } from "@/lib/corsair/mutations";
import { createContext } from "@/lib/corsair/context";

// Pass BOTH queries and mutations to the handler
const handler = createNextJsHandler(queries, mutations, createContext);

export { handler as POST };
