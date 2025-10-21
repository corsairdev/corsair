// ============================================
// USAGE EXAMPLES
// ============================================

// MUTATIONS DEFINITION (same for all frameworks)
// lib/corsair/mutations.ts
// const mutations = {
//   "get user": {
//     prompt: "get user",
//     input_type: z.object({ id: z.string() }),
//     response_type: z.object({ name: z.string(), email: z.string() }),
//     handler: async (input) => {
//       return { name: "John", email: "john@example.com" };
//     },
//   },
// } as const;

// CLIENT (same for all frameworks)
// lib/corsair/client.ts
// import { createCorsairClient } from "corsair";
// const corsair = createCorsairClient(mutations);
// export const useCorsairMutation = corsair.useMutation;

// ============================================
// FRAMEWORK-SPECIFIC ROUTE HANDLERS
// ============================================

// 1. NEXT.JS
// app/api/corsair/route.ts
// import { createNextJsHandler } from "corsair";
// import { mutations } from "@/lib/corsair/mutations";
// const handler = createNextJsHandler(mutations);
// export { handler as POST };

// 2. EXPRESS
// routes/corsair.ts
// import express from "express";
// import { createExpressHandler } from "corsair";
// import { mutations } from "./lib/corsair/mutations";

// const router = express.Router();
// router.post("/api/corsair", createExpressHandler(mutations));

// 3. FASTIFY
// routes/corsair.ts
// import { FastifyInstance } from "fastify";
// import { createFastifyHandler } from "corsair";
// import { mutations } from "./lib/corsair/mutations";

// export async function corsairRoutes(fastify: FastifyInstance) {
//   fastify.post("/api/corsair", createFastifyHandler(mutations));
// }

// 4. HONO
// routes/corsair.ts
// import { Hono } from "hono";
// import { createHonoHandler } from "corsair";
// import { mutations } from "./lib/corsair/mutations";

// const app = new Hono();
// app.post("/api/corsair", createHonoHandler(mutations));

// 5. CLOUDFLARE WORKERS
// worker.ts
// import { createCloudflareHandler } from "corsair";
// import { mutations } from "./lib/corsair/mutations";

// const corsairHandler = createCloudflareHandler(mutations);

// export default {
//   async fetch(request: Request): Promise<Response> {
//     const url = new URL(request.url);
//     if (url.pathname === "/api/corsair" && request.method === "POST") {
//       return corsairHandler(request);
//     }
//     return new Response("Not found", { status: 404 });
//   },
// };

// ============================================
// CLIENT USAGE (same in any React framework)
// ============================================

// Works in: Next.js, Vite, CRA, Remix, etc.
// import { useCorsairMutation } from "@/lib/corsair/client";

// function MyComponent() {
//   const getUserMutation = useCorsairMutation("get user", {
//     endpoint: "/api/corsair", // customize endpoint if needed
//   });

//   return (
//     <button onClick={() => getUserMutation.mutate({ id: "123" })}>
//       Get User
//     </button>
//   );
// }
