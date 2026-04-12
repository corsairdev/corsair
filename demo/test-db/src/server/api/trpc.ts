import { initTRPC } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { corsair } from '../corsair';

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
	const tenantId = opts.req.headers.get('x-tenant-id');

	if (!tenantId) {
		throw new Error('x-tenant-id header is required');
	}

	return {
		tenantId,
		corsair,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
