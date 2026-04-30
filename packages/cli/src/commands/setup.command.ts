import { setupCorsair } from 'corsair';
import BaseCommand from './base.command';
import { getCorsairInstance } from '../utils/corsair-instance';
import { parseSetupOptions } from '../utils/arg-parsers';

export default class SetupCommand extends BaseCommand {
	getName(): string {
		return 'setup';
	}
	getDescription(): string {
		return 'Initialize Corsair and set plugin credentials';
	}
	getOptions(): Array<{ flags: string; description: string }> {
		return [
			{ flags: '--backfill', description: 'Seed data while initializing' },
			{ flags: '--plugin <id>', description: 'Plugin id for credentials' },
		];
	}
	getArguments(): Array<{ name: string; description?: string }> {
		return [{ name: '[credentials...]', description: 'Credential pairs like key=value' }];
	}
	async action(
		credentials: string[] = [],
		options: { backfill?: boolean; plugin?: string },
	) {
		const cwd = process.cwd();
		const { backfill, credentials: parsedCredentials } = parseSetupOptions({
			...options,
			credentials,
		});
		const instance = await getCorsairInstance({ cwd });
		await setupCorsair(instance as Parameters<typeof setupCorsair>[0], {
			backfill,
			credentials: parsedCredentials,
			caller: 'cli',
		});
	}
}
