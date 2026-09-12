import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import { db } from '@/db';
import type { IntegrationDetailData } from '@/lib/integration-page.types';
import type { IntegrationCatalogEntry } from '@/lib/integrations-catalog.types';
import { appRouter } from '@/server/api/root';

export const CATALOG_INTEGRATIONS_CACHE_TAG = 'catalog-integrations';

export function catalogIntegrationCacheTag(id: string) {
	return `catalog-integration:${id}`;
}

function createPublicCaller() {
	return appRouter.createCaller({ db, session: null });
}

function getCachedCatalogIntegrationsList() {
	return unstable_cache(
		async () => createPublicCaller().catalogIntegrations.list(),
		['catalog-integrations-list'],
		{
			revalidate: 60,
			tags: [CATALOG_INTEGRATIONS_CACHE_TAG],
		},
	)();
}

function getCachedCatalogIntegrationIds() {
	return unstable_cache(
		async () => createPublicCaller().catalogIntegrations.ids(),
		['catalog-integration-ids'],
		{
			revalidate: 60,
			tags: [CATALOG_INTEGRATIONS_CACHE_TAG],
		},
	)();
}

function getCachedCatalogIntegrationById(id: string) {
	return unstable_cache(
		async () => createPublicCaller().catalogIntegrations.getById({ id }),
		['catalog-integration-detail', id],
		{
			revalidate: 60,
			tags: [catalogIntegrationCacheTag(id), CATALOG_INTEGRATIONS_CACHE_TAG],
		},
	)();
}

// At build time Vercel preview environments have no DATABASE_URL, so the
// catalog queries fail. Fall back to empty only when no database is configured;
// when a DB is configured, propagate the error so runtime outages surface.
const noDB = !process.env.DATABASE_URL;

export const getCatalogIntegrationsList = cache(
	async (): Promise<IntegrationCatalogEntry[]> => {
		try {
			return await getCachedCatalogIntegrationsList();
		} catch (err) {
			if (noDB) return [];
			throw err;
		}
	},
);

export const getCatalogIntegrationIds = cache(async (): Promise<string[]> => {
	try {
		return await getCachedCatalogIntegrationIds();
	} catch (err) {
		if (noDB) return [];
		throw err;
	}
});

export const getCatalogIntegrationById = cache(
	async (id: string): Promise<IntegrationDetailData | null> => {
		try {
			return await getCachedCatalogIntegrationById(id);
		} catch (err) {
			if (noDB) return null;
			throw err;
		}
	},
);
