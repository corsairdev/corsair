import { setupCorsair } from 'corsair';
import BaseCommand from './base.command';
import type { CommandActionData, CommandArgument, CommandOption } from '@/index.types';
import { getCorsairInstance } from '../utils/corsair-instance';
import { parseSetupOptions } from '../utils/arg-parsers';

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
			{ short: '-p', long: '--plugin <id>', description: 'Plugin id for credentials' },
		];
	}
	getArguments(): CommandArgument[] {
		return [{ name: '[credentials...]', description: 'Credential pairs like key=value' }];
	}
	async action({ args, options }: CommandActionData) {
		const cwd = process.cwd();
		const { backfill, credentials: parsedCredentials } = parseSetupOptions({
			...options,
			credentials: args,
		});
		const instance = await getCorsairInstance({ cwd });
		await setupCorsair(instance as Parameters<typeof setupCorsair>[0], {
			backfill,
			credentials: parsedCredentials,
			caller: 'cli',
		});
	}
}
