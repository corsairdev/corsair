import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
	fetchCatalogIntegrationById,
	fetchCatalogIntegrationIds,
	fetchCatalogIntegrationsList,
} from '@/db/catalog-integrations';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const catalogIntegrationsRouter = createTRPCRouter({
	list: publicProcedure.query(async ({ ctx }) => {
		return fetchCatalogIntegrationsList(ctx.db);
	}),

	ids: publicProcedure.query(async ({ ctx }) => {
		return fetchCatalogIntegrationIds(ctx.db);
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const integration = await fetchCatalogIntegrationById(ctx.db, input.id);

			if (!integration) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Integration not found',
				});
			}

			return integration;
		}),
});
