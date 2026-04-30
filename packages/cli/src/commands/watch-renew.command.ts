import BaseCommand from './base.command';
import type { CommandActionData } from '@/index.types';

export default class WatchRenewCommand extends BaseCommand {
	getName(): string {
		return 'watch-renew';
	}
	getDescription(): string {
		return 'Renew Google webhook subscriptions';
	}
	async action({}: CommandActionData) {
		const { runGoogleSubscribe } = await import('../google/subscribe-google');
		await runGoogleSubscribe({ cwd: process.cwd() });
	}
}
