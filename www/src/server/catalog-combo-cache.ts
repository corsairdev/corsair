import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import { db } from '@/db';
import {
	catalogComboSetId,
	fetchAllCatalogCombos,
	fetchCatalogComboByMemberIds,
	fetchCatalogComboRouteKeys,
} from '@/db/catalog-combos';
import type { ComboData } from '@/lib/combo-types';
import { worksWithFor } from '@/lib/combo-types';

export const CATALOG_COMBOS_CACHE_TAG = 'catalog-combos';

function getCachedCatalogCombosList() {
	return unstable_cache(
		async () => fetchAllCatalogCombos(db),
		['catalog-combos-list'],
		{
			revalidate: 60,
			tags: [CATALOG_COMBOS_CACHE_TAG],
		},
	)();
}

function getCachedCatalogComboRouteKeys() {
	return unstable_cache(
		async () => fetchCatalogComboRouteKeys(db),
		['catalog-combo-route-keys'],
		{
			revalidate: 60,
			tags: [CATALOG_COMBOS_CACHE_TAG],
		},
	)();
}

function getCachedCatalogComboByMemberIds(slugA: string, slugB: string) {
	const a = slugA.toLowerCase().trim();
	const b = slugB.toLowerCase().trim();
	const setId = catalogComboSetId([a, b]);
	return unstable_cache(
		async () => fetchCatalogComboByMemberIds(db, a, b),
		['catalog-combo-detail', setId],
		{
			revalidate: 60,
			tags: [CATALOG_COMBOS_CACHE_TAG],
		},
	)();
}

const noDB = !process.env.DATABASE_URL;

export const getCatalogCombosList = cache(async (): Promise<ComboData[]> => {
	try {
		return await getCachedCatalogCombosList();
	} catch (err) {
		if (noDB) return [];
		throw err;
	}
});

export const getCatalogComboRouteKeys = cache(async () => {
	try {
		return await getCachedCatalogComboRouteKeys();
	} catch (err) {
		if (noDB) return [];
		throw err;
	}
});

export const getCatalogComboByMemberIds = cache(
	async (slugA: string, slugB: string): Promise<ComboData | null> => {
		try {
			return await getCachedCatalogComboByMemberIds(slugA, slugB);
		} catch (err) {
			if (noDB) return null;
			throw err;
		}
	},
);

export async function getWorksWith(integrationId: string) {
	const combos = await getCatalogCombosList();
	return worksWithFor({ combos, integrationId });
}
