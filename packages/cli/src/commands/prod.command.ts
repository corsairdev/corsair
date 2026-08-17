import type { CorsairDatabase } from 'corsair/db';
import type { DevIntegrationRow, HubConfig } from 'corsair/hub';
import {
	buildMigrationPayload,
	generateProdKek,
	postMigrationToHub,
} from 'corsair/hub';
import type { CommandActionData, CommandOption } from '../index.types';
import { extractInternalConfig } from '../utils/corsair';
import BaseCommand from './base.command';

function errorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

function parseConfigLike(value: unknown): Record<string, unknown> {
	if (!value) return {};
	if (typeof value === 'string') {
		try {
			return JSON.parse(value) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	return value as Record<string, unknown>;
}

async function readIntegrationRows(
	database: CorsairDatabase,
): Promise<DevIntegrationRow[]> {
	const rows = await database.db
		.selectFrom('corsair_integrations')
		.select(['name', 'dek', 'config'])
		.execute();
	return rows.map((row) => ({
		name: row.name,
		dek: row.dek,
		config: parseConfigLike(row.config),
	}));
}

function printProdSetup(prodKek: string): void {
	console.log(`
[corsair]: Production master key generated. Set these in your PRODUCTION
environment, then redeploy:

  CORSAIR_KEK=${prodKek}

Also set CORSAIR_API_KEY and CORSAIR_SIGNING_SECRET from the Hub's
"Activate production" dialog.

This key was generated locally and is shown ONCE — it is never sent to the Hub.
It is your production master key; store it safely. Once production is deployed,
re-run this command with --kek set to the CORSAIR_KEK value above to migrate your
integration credentials:

  npx corsair prod --kek <the CORSAIR_KEK above>
`);
}

export default class ProdCommand extends BaseCommand {
	getName(): string {
		return 'prod';
	}

	getDescription(): string {
		return 'Migrate your local integration credentials to production';
	}

	getOptions(): CommandOption[] {
		return [
			{
				short: '-k',
				long: '--kek <kek>',
				description:
					'Production master key (KEK) to re-key credentials with. Omit on the first run to generate one.',
			},
		];
	}

	async action({ options }: CommandActionData): Promise<void> {
		const kek =
			typeof options.kek === 'string' ? options.kek.trim() : undefined;
		const cwd = process.cwd();

		let internal: Awaited<ReturnType<typeof extractInternalConfig>>;
		try {
			internal = await extractInternalConfig(cwd);
		} catch (err) {
			console.error(`[corsair]: ${errorMessage(err)}`);
			process.exit(1);
		}

		const hub = internal.hub;
		if (!hub) {
			console.error(
				'[corsair]: Hub is not configured. Add hub: { projectApiKey, signingSecret } to createCorsair().',
			);
			process.exit(1);
		}

		// Phase 1: no KEK yet — mint one and print the prod setup instructions.
		if (!kek) {
			printProdSetup(generateProdKek());
			return;
		}

		// Phase 2: re-key the local integrations and push them to prod via the Hub.
		if (!internal.database) {
			console.error(
				'[corsair]: No database configured. Credential migration needs access to your local corsair_integrations table.',
			);
			process.exit(1);
		}

		let payload: Awaited<ReturnType<typeof buildMigrationPayload>>;
		try {
			const rows = await readIntegrationRows(internal.database);
			payload = await buildMigrationPayload(rows, internal.kek, kek);
		} catch (err) {
			console.error(
				`[corsair]: Could not prepare credentials — ${errorMessage(err)}`,
			);
			process.exit(1);
		}

		if (payload.integrations.length === 0) {
			console.log('[corsair]: No integration credentials found to migrate.');
			return;
		}

		console.log(
			`[corsair]: Migrating ${payload.integrations.length} integration(s) to production ...`,
		);

		let result: Awaited<ReturnType<typeof postMigrationToHub>>;
		try {
			result = await postMigrationToHub({ hub: hub as HubConfig, payload });
		} catch (err) {
			console.error(
				`[corsair]: Migration failed — ${errorMessage(err)}. Fix production and re-run.`,
			);
			process.exit(1);
		}

		if (!result.ok) {
			console.error(
				`[corsair]: Production rejected the migration — ${result.error ?? 'unknown error'}. Fix production and re-run.`,
			);
			process.exit(1);
		}

		console.log(
			`[corsair]: ✓ Migrated ${result.migrated ?? payload.integrations.length} integration(s) to production.`,
		);
	}
}
