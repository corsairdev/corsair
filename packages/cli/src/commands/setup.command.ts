import { setupCorsair } from 'corsair';
import type {
	CommandActionData,
	CommandArgument,
	CommandOption,
} from '../index.types';
import {
	getSetupRawArgs,
	parseSetupCredentials,
} from '../lib/setup-credentials';
import { extractInternalConfig } from '../utils/corsair';
import { getCorsairInstance } from '../utils/corsair-instance';
import BaseCommand from './base.command';

export default class SetupCommand extends BaseCommand {
	protected allowUnknownOptions(): boolean {
		return true;
	}

	getName(): string {
		return 'setup';
	}

	getDescription(): string {
		return 'Initialize Corsair and set plugin credentials';
	}

	getOptions(): CommandOption[] {
		return [
			{
				short: '-b',
				long: '--backfill',
				description: 'Seed data while initializing',
			},
			{
				short: '-t',
				long: '--tenant <id>',
				description: 'Tenant id for multi-tenant setup',
			},
			{
				short: '-p',
				long: '--plugin <id>',
				description: 'Plugin id for credentials',
			},
		];
	}

	getArguments(): CommandArgument[] {
		return [
			{
				name: '[credentials...]',
				description: 'Credential pairs like key=value',
			},
		];
	}

	async action({ options }: CommandActionData) {
		const cwd = process.cwd();
		const backfill = options.backfill || this.hasLegacyBackfillFlag();
		const tenantId = options.tenant;
		const instance = await getCorsairInstance({ cwd });
		const internal = await extractInternalConfig(cwd);
		const credentials = parseSetupCredentials(
			getSetupRawArgs(),
			internal.plugins.map((p) => p.id),
		);

		await setupCorsair(instance as Parameters<typeof setupCorsair>[0], {
			backfill,
			tenantId,
			credentials,
			caller: 'cli',
		});
	}

	private hasLegacyBackfillFlag(): boolean {
		const setupIdx = process.argv.indexOf('setup');
		const rawArgs = setupIdx >= 0 ? process.argv.slice(setupIdx + 1) : [];
		return rawArgs.some((arg) => arg === '-backfill');
	}
}
