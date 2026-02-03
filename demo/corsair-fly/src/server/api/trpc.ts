import { initTRPC } from '@trpc/server';
import { db } from '@/db';
import { corsair } from '@/server/corsair';

export const createTRPCContext = async (opts: { headers: Headers }) => {
	return {
		db,
		corsair,
		...opts,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
