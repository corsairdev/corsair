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

function parseConfig(value: unknown, name: string): Record<string, unknown> {
	if (value == null) return {};
	let config = value;
	if (typeof value === 'string') {
		try {
			config = JSON.parse(value);
		} catch {
			throw new Error(
				`Integration "${name}" has an unreadable config (not valid JSON) — refusing to migrate it as empty.`,
			);
		}
	}
	if (typeof config !== 'object' || config === null || Array.isArray(config)) {
		throw new Error(`Integration "${name}" has an unexpected config type.`);
	}
	return config as Record<string, unknown>;
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
		config: parseConfig(row.config, row.name),
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
re-run this command with --kek to migrate your integration credentials
(the corsair CLI is @corsair-dev/cli — install it if you haven't):

  pnpm corsair prod --kek <the CORSAIR_KEK above>
  npx corsair prod --kek <the CORSAIR_KEK above>
  yarn corsair prod --kek <the CORSAIR_KEK above>
  bunx corsair prod --kek <the CORSAIR_KEK above>
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

		if (!internal.kek?.trim()) {
			console.error(
				'[corsair]: No development CORSAIR_KEK configured. Set CORSAIR_KEK to the key your dev credentials were created with, then re-run.',
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

		const { integrations, skipped } = payload;

		if (skipped.length > 0) {
			console.log(
				`\n[corsair]: Skipping ${skipped.length} integration(s) with nothing to migrate:`,
			);
			for (const row of skipped) {
				console.log(`             • ${row.name} (${row.reason})`);
			}
		}

		if (integrations.length === 0) {
			console.log('\n[corsair]: No integration credentials to migrate.');
			return;
		}

		const names = integrations.map((integration) => integration.name);
		console.log(
			`\n[corsair]: Migrating ${names.length} integration(s) to production:`,
		);
		for (const name of names) {
			console.log(`             • ${name}`);
		}
		console.log('\n[corsair]: Delivering to production via the Hub …');

		let result: Awaited<ReturnType<typeof postMigrationToHub>>;
		try {
			result = await postMigrationToHub({
				hub: hub as HubConfig,
				payload: { integrations },
			});
		} catch (err) {
			console.error(
				`\n[corsair]: Migration failed — ${errorMessage(err)}. Fix production and re-run.`,
			);
			process.exit(1);
		}

		if (!result.ok) {
			console.error(
				`\n[corsair]: Production rejected the migration — ${result.error ?? 'unknown error'}. Fix production and re-run.`,
			);
			process.exit(1);
		}

		console.log(
			`\n[corsair]: ✓ Migrated ${result.migrated ?? names.length} integration(s) to production.\n`,
		);
		console.log(
			'           Add these to your production corsair.ts so the migrated',
		);
		console.log(
			'           credentials are used (match the authType/options you use in dev):\n',
		);
		console.log('             plugins: [');
		for (const name of names) {
			console.log(`               ${name}(),`);
		}
		console.log('             ],\n');
	}
}
