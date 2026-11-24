import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ClaimApp } from '@/lib/claim-apps';
import { toClaimApps } from '@/lib/claim-apps';
import { getCatalogIntegrationsList } from '@/server/catalog-integration-cache';

/**
 * The apps /start offers: the catalog /integrations lists. Without a database
 * (local runs, preview builds) that list is empty, so the picker falls back to
 * the checked-in catalog the database is filled from.
 */
export async function loadStartApps(): Promise<ClaimApp[]> {
	const fromDb = await getCatalogIntegrationsList();
	if (fromDb.length) return toClaimApps(fromDb);
	try {
		const file = path.join(
			process.cwd(),
			'..',
			'explorer',
			'data',
			'catalog.json',
		);
		const { plugins } = JSON.parse(await readFile(file, 'utf8')) as {
			plugins?: Parameters<typeof toClaimApps>[0];
		};
		return toClaimApps(plugins ?? []);
	} catch {
		return [];
	}
}
