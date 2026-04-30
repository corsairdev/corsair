import BaseCommand from './base.command';

export default class WatchRenewCommand extends BaseCommand {
	getName(): string {
		return 'watch-renew';
	}
	getDescription(): string {
		return 'Renew Google webhook subscriptions';
	}
	async action() {
		const { runGoogleSubscribe } = await import('../google/subscribe-google');
		await runGoogleSubscribe({ cwd: process.cwd() });
	}
}
