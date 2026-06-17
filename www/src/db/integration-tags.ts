import { asc, eq, inArray } from 'drizzle-orm';

import type { DB } from '@/db';
import type { IntegrationTagSummary } from '@/db/integration-tag-definitions';
import { integrationTags, tags } from '@/db/schema';

export async function fetchIntegrationTagsByIntegrationIds(
	db: DB,
	integrationIds: string[],
): Promise<Map<string, IntegrationTagSummary[]>> {
	if (integrationIds.length === 0) {
		return new Map();
	}

	const rows = await db
		.select({
			integrationId: integrationTags.integrationId,
			slug: tags.slug,
			name: tags.name,
			color: tags.color,
		})
		.from(integrationTags)
		.innerJoin(tags, eq(integrationTags.tagId, tags.id))
		.where(inArray(integrationTags.integrationId, integrationIds))
		.orderBy(asc(tags.name));

	const tagsByIntegration = new Map<string, IntegrationTagSummary[]>();

	for (const row of rows) {
		const existing = tagsByIntegration.get(row.integrationId) ?? [];
		existing.push({
			slug: row.slug,
			name: row.name,
			color: row.color,
		});
		tagsByIntegration.set(row.integrationId, existing);
	}

	return tagsByIntegration;
}

export async function fetchIntegrationTags(
	db: DB,
	integrationId: string,
): Promise<IntegrationTagSummary[]> {
	const tagsByIntegration = await fetchIntegrationTagsByIntegrationIds(db, [
		integrationId,
	]);

	return tagsByIntegration.get(integrationId) ?? [];
}
