import 'dotenv/config';

import { execSync } from 'child_process';
import { resolve } from 'path';
import { inArray } from 'drizzle-orm';

import { db, pool } from '@/db';
import { integrations } from '@/db/schema';

const PACKAGES_DIR = resolve(import.meta.dirname, '../../../packages');

const SLUG_ALIASES: Record<string, string[]> = {
	onedrive: ['one_drive'],
	openweathermap: ['weathermap'],
	sharepoint: ['share_point'],
	teams: ['microsoft_teams'],
};

function getWrittenIntegrationIds(): string[] {
	const output = execSync(
		`grep -rh "^\\s*id: '" ${PACKAGES_DIR}/*/index.ts | sed "s/.*id: '\\([^']*\\)'.*/\\1/"`,
	)
		.toString()
		.trim();

	if (!output) return [];

	return [...new Set(output.split('\n').filter(Boolean))];
}

function getSlugsToHide(ids: string[]): string[] {
	const slugs = new Set<string>();

	for (const id of ids) {
		slugs.add(id);
		for (const alias of SLUG_ALIASES[id] ?? []) {
			slugs.add(alias);
		}
	}

	return [...slugs];
}

async function main() {
	const ids = getWrittenIntegrationIds();
	const slugsToHide = getSlugsToHide(ids);

	const existingRows = await db
		.select({ slug: integrations.slug })
		.from(integrations)
		.where(inArray(integrations.slug, slugsToHide));

	const existingSlugs = existingRows.map((row) => row.slug);

	if (existingSlugs.length === 0) {
		console.log('No matching integrations found in the database.');
		return;
	}

	const result = await db
		.update(integrations)
		.set({ show: false })
		.where(inArray(integrations.slug, existingSlugs))
		.returning({ slug: integrations.slug });

	console.log(
		`Marked ${result.length} written integration(s) as show=false (${ids.length} package id(s), ${slugsToHide.length} slug(s) checked).`,
	);
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await pool.end();
	});
