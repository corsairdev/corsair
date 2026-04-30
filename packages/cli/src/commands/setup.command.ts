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
			{ short: '-p', long: '--plugin <id>', description: 'Plugin id for credentials' },
		];
	}

	getArguments(): CommandArgument[] {
		return [{ name: '[credentials...]', description: 'Credential pairs like key=value' }];
	}

	async action({ args, options }: CommandActionData) {
		const cwd = process.cwd();
		const { backfill, plugin } = options;

		const parsedCredentials = this.parseCredentials(args);
		const instance = await getCorsairInstance({ cwd });

		await setupCorsair(
			instance as Parameters<typeof setupCorsair>[0],
			{
				backfill,
				credentials: {
					[plugin]: parsedCredentials,
				},
				caller: 'cli',
			}
		);
	}

	private parseCredentials(
		args: CommandActionData['args']
	): Record<string, string> {
		return args
			.map(arg => arg.split('='))
			.reduce<Record<string, string>>((acc, [key, value]) => {
				if (!key || value === undefined) return acc;
				acc[key] = value;
				return acc;
			}, {});
	}
}
