import BaseCommand from './base.command';
import type { CommandActionData } from '@/index.types';

export default class TeamsSubscribeCommand extends BaseCommand {
	getName(): string {
		return 'teams-subscribe';
	}
	getDescription(): string {
		return 'Subscribe Teams webhooks';
	}
	async action({}: CommandActionData) {
		const { runTeamsSubscribe } = await import('../microsoft/subscribe-microsoft');
		await runTeamsSubscribe({ cwd: process.cwd() });
	}
}
