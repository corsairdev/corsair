import 'server-only';

import type { ComboData } from '@/lib/combo-types';
import {
	getCatalogComboByMemberIds,
	getCatalogComboRouteKeys,
	getCatalogCombosList,
	getWorksWith as getWorksWithFromDb,
} from '@/server/catalog-combo-cache';

export { getCatalogComboRouteKeys };

export type {
	ComboAction,
	ComboData,
	ComboFaq,
	ComboKbApp,
	ComboKbTool,
	ComboTrigger,
	ComboWorkflow,
	ComboWorksWithItem,
	ConnectStep,
} from '@/lib/combo-types';
export { comboCountsFor, worksWithFor } from '@/lib/combo-types';

export async function getComboData(
	slug: string,
	other: string,
): Promise<ComboData | null> {
	return getCatalogComboByMemberIds(slug, other);
}

export function getComboCanonical(combo: ComboData): string {
	return `/integrations/${combo.slugA}/and/${combo.slugB}`;
}

export async function getComboCanonicalUrls(): Promise<string[]> {
	const keys = await getCatalogComboRouteKeys();
	return keys.map(({ slugA, slugB }) => `/integrations/${slugA}/and/${slugB}`);
}

export async function getWorksWith(integrationId: string) {
	return getWorksWithFromDb(integrationId);
}

export async function getAllCombos(): Promise<ComboData[]> {
	return getCatalogCombosList();
}
