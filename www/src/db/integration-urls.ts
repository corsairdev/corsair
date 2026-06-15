import { and, eq, inArray } from 'drizzle-orm';
import type { DB } from '@/db';
import type { IntegrationUrlType, IntegrationUrls } from '@/db/schema';
import { integrationUrls } from '@/db/schema';

const URL_TYPE_TO_FIELD = {
	issue: 'issueUrl',
	pr: 'prUrl',
	docs: 'docsUrl',
} as const satisfies Record<IntegrationUrlType, keyof IntegrationUrls>;

const FIELD_TO_URL_TYPE = {
	issueUrl: 'issue',
	prUrl: 'pr',
	docsUrl: 'docs',
} as const satisfies Record<keyof IntegrationUrls, IntegrationUrlType>;

export function emptyIntegrationUrls(): IntegrationUrls {
	return { issueUrl: null, prUrl: null, docsUrl: null };
}

export function integrationUrlsFromRows(
	rows: { type: IntegrationUrlType; url: string }[],
): IntegrationUrls {
	const urls = emptyIntegrationUrls();

	for (const row of rows) {
		const field = URL_TYPE_TO_FIELD[row.type];
		urls[field] = row.url;
	}

	return urls;
}

export async function fetchIntegrationUrlsByIntegrationIds(
	db: DB,
	integrationIds: string[],
): Promise<Map<string, IntegrationUrls>> {
	if (integrationIds.length === 0) {
		return new Map();
	}

	const rows = await db
		.select({
			integrationId: integrationUrls.integrationId,
			type: integrationUrls.type,
			url: integrationUrls.url,
		})
		.from(integrationUrls)
		.where(inArray(integrationUrls.integrationId, integrationIds));

	const urlsByIntegration = new Map<string, IntegrationUrls>();

	for (const integrationId of integrationIds) {
		urlsByIntegration.set(integrationId, emptyIntegrationUrls());
	}

	for (const row of rows) {
		const urls = urlsByIntegration.get(row.integrationId)!;
		const field = URL_TYPE_TO_FIELD[row.type];
		urls[field] = row.url;
	}

	return urlsByIntegration;
}

export async function fetchIntegrationUrls(
	db: DB,
	integrationId: string,
): Promise<IntegrationUrls> {
	const urlsByIntegration = await fetchIntegrationUrlsByIntegrationIds(db, [
		integrationId,
	]);

	return urlsByIntegration.get(integrationId) ?? emptyIntegrationUrls();
}

export async function upsertIntegrationUrls(
	db: DB,
	integrationId: string,
	urls: IntegrationUrls,
) {
	for (const field of Object.keys(
		FIELD_TO_URL_TYPE,
	) as (keyof IntegrationUrls)[]) {
		const type = FIELD_TO_URL_TYPE[field];
		const url = urls[field];

		if (!url) {
			await db
				.delete(integrationUrls)
				.where(
					and(
						eq(integrationUrls.integrationId, integrationId),
						eq(integrationUrls.type, type),
					),
				);
			continue;
		}

		await db
			.insert(integrationUrls)
			.values({ integrationId, type, url })
			.onConflictDoUpdate({
				target: [integrationUrls.integrationId, integrationUrls.type],
				set: { url, updatedAt: new Date() },
			});
	}
}

export async function clearContributorIntegrationUrls(
	db: DB,
	integrationId: string,
) {
	await db
		.delete(integrationUrls)
		.where(
			and(
				eq(integrationUrls.integrationId, integrationId),
				inArray(integrationUrls.type, ['issue', 'pr']),
			),
		);
}
