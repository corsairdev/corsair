import BaseCommand from '../base.command'
import type { CommandActionData } from '@/index.types'

export default class TeamsCommand extends BaseCommand {
	getName(): string {
		return 'teams';
	}

	getDescription(): string {
		return 'Subscribe Teams webhooks';
	}

	async action({}: CommandActionData) {
		const { runTeamsSubscribe } = await import('@/lib/microsoft/subscribe-microsoft');
		await runTeamsSubscribe({ cwd: process.cwd() });
	}
}
