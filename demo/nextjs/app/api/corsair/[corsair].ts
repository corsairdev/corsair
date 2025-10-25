/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import createNextApiHandler from "corsair/trpc/server";
import { corsairRouter } from "@/corsair/trpc";

// export API handler
export default createNextApiHandler({
  router: corsairRouter,
  createContext: () => ({}),
});
