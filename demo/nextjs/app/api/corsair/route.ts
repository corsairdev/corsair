import { createNextJsHandler } from "corsair/nextjs";
import { queries } from "@/corsair/queries";
import { mutations } from "@/corsair/mutations";
import { createContext } from "@/corsair/context";

// Pass BOTH queries and mutations to the handler
const handler = createNextJsHandler(queries, mutations, createContext);

export { handler as POST };
