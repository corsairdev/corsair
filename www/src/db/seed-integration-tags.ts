import 'dotenv/config';

import { sql } from 'drizzle-orm';

import { db, pool } from '@/db';
import {
	assignIntegrationTagSlugs,
	INTEGRATION_TAG_DEFINITIONS,
} from '@/db/integration-tag-definitions';
import { integrations, integrationTags, tags } from '@/db/schema';

async function seedTags() {
	for (const definition of INTEGRATION_TAG_DEFINITIONS) {
		await db
			.insert(tags)
			.values({
				name: definition.name,
				slug: definition.slug,
				color: definition.color,
			})
			.onConflictDoUpdate({
				target: tags.slug,
				set: {
					name: definition.name,
					color: definition.color,
					updatedAt: new Date(),
				},
			});
	}

	console.log(`Upserted ${INTEGRATION_TAG_DEFINITIONS.length} tag(s).`);

	return db.select().from(tags);
}

async function seedIntegrationTags(allTags: (typeof tags.$inferSelect)[]) {
	const tagIdBySlug = new Map(allTags.map((tag) => [tag.slug, tag.id]));
	const allIntegrations = await db
		.select({
			id: integrations.id,
			slug: integrations.slug,
			name: integrations.name,
			description: integrations.description,
		})
		.from(integrations);

	await db.delete(integrationTags);

	const rows: (typeof integrationTags.$inferInsert)[] = [];
	const distribution = new Map<number, number>();

	for (const integration of allIntegrations) {
		const tagSlugs = assignIntegrationTagSlugs(integration);
		distribution.set(
			tagSlugs.length,
			(distribution.get(tagSlugs.length) ?? 0) + 1,
		);

		for (const tagSlug of tagSlugs) {
			const tagId = tagIdBySlug.get(tagSlug);
			if (!tagId) {
				throw new Error(`Missing tag for slug: ${tagSlug}`);
			}

			rows.push({
				integrationId: integration.id,
				tagId,
			});
		}
	}

	const batchSize = 500;
	for (let i = 0; i < rows.length; i += batchSize) {
		await db.insert(integrationTags).values(rows.slice(i, i + batchSize));
	}

	console.log(
		`Assigned ${rows.length} integration tag row(s) across ${allIntegrations.length} integration(s).`,
	);
	console.log('Tags per integration:');
	for (const [count, integrationsWithCount] of [...distribution.entries()].sort(
		(a, b) => a[0] - b[0],
	)) {
		console.log(`  ${count}: ${integrationsWithCount}`);
	}

	const tagCounts = await db
		.select({
			name: tags.name,
			color: tags.color,
			count: sql<number>`count(${integrationTags.id})::int`,
		})
		.from(tags)
		.leftJoin(integrationTags, sql`${integrationTags.tagId} = ${tags.id}`)
		.groupBy(tags.id, tags.name, tags.color)
		.orderBy(sql`count(${integrationTags.id}) desc`);

	console.log('\nTag usage:');
	for (const row of tagCounts) {
		console.log(
			`  ${String(row.count).padStart(4)}  ${row.name} (${row.color})`,
		);
	}
}

async function main() {
	const allTags = await seedTags();
	await seedIntegrationTags(allTags);
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await pool.end();
	});
