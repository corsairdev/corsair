import { setupCorsair } from 'corsair'
import BaseCommand from './base.command'
import type { CommandActionData, CommandArgument, CommandOption } from '@/index.types'
import { getCorsairInstance } from '@/utils/corsair-instance'

export default class SetupCommand extends BaseCommand {
	getName(): string {
		return 'setup';
	}

	getDescription(): string {
		return 'Initialize Corsair and set plugin credentials';
	}

	getOptions(): CommandOption[] {
		return [
			{ short: '-b', long: '--backfill', description: 'Seed data while initializing' },
			{ short: '-t', long: '--tenant <id>', description: 'Tenant id for multi-tenant setup' },
			{ short: '-p', long: '--plugin <id>', description: 'Plugin id for credentials' },
		];
	}

	getArguments(): CommandArgument[] {
		return [{ name: '[credentials...]', description: 'Credential pairs like key=value' }];
	}

	async action({ options }: CommandActionData) {
		const cwd = process.cwd();
		const backfill = options.backfill || this.hasLegacyBackfillFlag();
		const tenantId = options.tenant;
		const instance = await getCorsairInstance({ cwd });

		await setupCorsair(instance as Parameters<typeof setupCorsair>[0], {
			backfill,
			tenantId,
			caller: 'cli',
		});
	}

	private hasLegacyBackfillFlag(): boolean {
		const setupIdx = process.argv.indexOf('setup');
		const rawArgs = setupIdx >= 0 ? process.argv.slice(setupIdx + 1) : [];
		return rawArgs.some((arg) => arg === '-backfill');
	}

}
