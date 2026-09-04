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

export const getCatalogIntegrationsList = cache(
	async (): Promise<IntegrationCatalogEntry[]> => {
		return getCachedCatalogIntegrationsList();
	},
);

export const getCatalogIntegrationIds = cache(async (): Promise<string[]> => {
	return getCachedCatalogIntegrationIds();
});

export const getCatalogIntegrationById = cache(
	async (id: string): Promise<IntegrationDetailData | null> => {
		try {
			return await getCachedCatalogIntegrationById(id);
		} catch {
			return null;
		}
	},
);
