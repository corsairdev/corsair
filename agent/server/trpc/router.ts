import { initTRPC } from '@trpc/server';
import z from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// tRPC initialization
// ─────────────────────────────────────────────────────────────────────────────

const t = initTRPC.context<{}>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// ─────────────────────────────────────────────────────────────────────────────
// Router definition
// ─────────────────────────────────────────────────────────────────────────────

export const appRouter = router({
	// ── Agent prompt ─────────────────────────────────────────────────────────
	prompt: publicProcedure
		.input(z.object({ input: z.string() }))
		.output(z.string())
		.mutation(async ({ input }) => {
			return input.input;
		}),
	promptQuery: publicProcedure
		.input(z.object({ input: z.string() }))
		.output(z.string())
		.query(async ({ input }) => {
			return input.input;
		}),
});

export type AppRouter = typeof appRouter;
