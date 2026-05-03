import BaseCommand from './base.command'
import type { CommandActionData } from '@/index.types'
import { runTeamsSubscribe } from '@/lib/microsoft/teams'

export default class TeamsSubscribeCommand extends BaseCommand {
	getName(): string {
		return 'teams-subscribe';
	}

	getDescription(): string {
		return 'Subscribe Teams webhooks (alias for: subscribe teams)';
	}

	async action({}: CommandActionData) {
		await runTeamsSubscribe({ cwd: process.cwd() });
	}
}
