import BaseCommand from './base.command';
import type { CommandActionData, CommandOption } from '@/index.types';
import { runWebhookSubscription } from '../utils/subscription';

export default class AuthCommand extends BaseCommand {
	getName(): string {
		return 'auth';
	}
	getDescription(): string {
		return 'Run plugin auth flows';
	}
	getOptions(): CommandOption[] {
		return [
			{ short: '-p', long: '--plugin <id>', description: 'Plugin id' },
			{ short: '-t', long: '--tenant <id>', description: 'Tenant id for auth' },
			{ short: '-c', long: '--code <code>', description: 'OAuth code to exchange' },
			{ short: '-s', long: '--session <id>', description: 'Session id for local auth state' },
			{ short: '-C', long: '--credentials', description: 'Show credential status' },
			{ short: '-w', long: '--webhook', description: 'Run webhook subscription setup' },
			{ short: '-l', long: '--listen', description: 'Listen for callback only' },
			{ short: '-x', long: '--collect', description: 'Collect auth response from listener' },
		];
	}
	async action({ options }: CommandActionData) {
		const cwd = process.cwd();
		if (options.webhook) {
			if (!options.plugin) {
				console.error('[#corsair]: --webhook requires --plugin=<id>.');
				process.exit(1);
			}
			await runWebhookSubscription(cwd, options.plugin);
			return;
		}
		const { runAuth } = await import('../auth');
		await runAuth({
			cwd,
			pluginId: options.plugin,
			tenantId: options.tenant,
			code: options.code,
			credentials: options.credentials,
			listen: options.listen,
			collect: options.collect,
			sessionId: options.session,
		});
	}
}
