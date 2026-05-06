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

	async action({ options }: CommandActionData) {
		const cwd = process.cwd();
		const { backfill } = options;
		const credentials = this.parseCredentialsFromArgv();
		const instance = await getCorsairInstance({ cwd });

		await setupCorsair(
			instance as Parameters<typeof setupCorsair>[0],
			{ backfill, credentials, caller: 'cli' }
		);
	}

	private parseCredentialsFromArgv(): Record<string, Record<string, string>> {
		const credentials: Record<string, Record<string, string>> = {};
		let currentPlugin: string | null = null;

		const setupIdx = process.argv.indexOf('setup');
		const rawArgs = setupIdx >= 0 ? process.argv.slice(setupIdx + 1) : [];

		for (let i = 0; i < rawArgs.length; i++) {
			const arg = rawArgs[i]!;

			if (arg === '--plugin' || arg === '-p') {
				currentPlugin = rawArgs[++i] ?? null;
				if (currentPlugin && !credentials[currentPlugin]) credentials[currentPlugin] = {};
				continue;
			}
			if (arg.startsWith('--plugin=') || arg.startsWith('-p=')) {
				currentPlugin = arg.slice(arg.indexOf('=') + 1);
				if (!credentials[currentPlugin]) credentials[currentPlugin] = {};
				continue;
			}
			if (arg.startsWith('-')) continue;
			if (currentPlugin && arg.includes('=')) {
				const eqIdx = arg.indexOf('=');
				credentials[currentPlugin]![arg.slice(0, eqIdx)] = arg.slice(eqIdx + 1);
			}
		}

		return credentials;
	}
}
