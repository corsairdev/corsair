import BaseCommand from './base.command';
import { runWebhookSubscription } from '../utils/subscription';

export default class AuthCommand extends BaseCommand {
	getName(): string {
		return 'auth';
	}
	getDescription(): string {
		return 'Run plugin auth flows';
	}
	getOptions(): Array<{ flags: string; description: string }> {
		return [
			{ flags: '--plugin <id>', description: 'Plugin id' },
			{ flags: '--tenant <id>', description: 'Tenant id for auth' },
			{ flags: '--code <code>', description: 'OAuth code to exchange' },
			{ flags: '--session <id>', description: 'Session id for local auth state' },
			{ flags: '--credentials', description: 'Show credential status' },
			{ flags: '--webhook', description: 'Run webhook subscription setup' },
			{ flags: '--listen', description: 'Listen for callback only' },
			{ flags: '--collect', description: 'Collect auth response from listener' },
		];
	}
	async action(options: {
		plugin?: string;
		tenant?: string;
		code?: string;
		session?: string;
		credentials?: boolean;
		webhook?: boolean;
		listen?: boolean;
		collect?: boolean;
	}) {
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
