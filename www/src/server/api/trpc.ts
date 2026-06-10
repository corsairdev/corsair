import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { db } from '@/db';
import { auth } from '@/lib/auth';
import { getSession } from '@/lib/auth-server';

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
	const session = await auth.api.getSession({
		headers: opts.req.headers,
	});

	return { db, session };
};

export async function createCallerContext() {
	const session = await getSession();
	return { db, session };
}

const t = initTRPC
	.context<Awaited<ReturnType<typeof createTRPCContext>>>()
	.create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({
		ctx: {
			...ctx,
			session: ctx.session,
			user: ctx.session.user,
		},
	});
});
