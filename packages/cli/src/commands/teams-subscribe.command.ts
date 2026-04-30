import BaseCommand from './base.command';

export default class TeamsSubscribeCommand extends BaseCommand {
	getName(): string {
		return 'teams-subscribe';
	}
	getDescription(): string {
		return 'Subscribe Teams webhooks';
	}
	async action() {
		const { runTeamsSubscribe } = await import('../microsoft/subscribe-microsoft');
		await runTeamsSubscribe({ cwd: process.cwd() });
	}
}
