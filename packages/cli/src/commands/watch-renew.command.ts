import BaseCommand from './base.command'
import type { CommandActionData } from '../index.types'
import { runGoogleSubscribe } from '../lib/google'

export default class WatchRenewCommand extends BaseCommand {
	getName(): string {
		return 'watch-renew';
	}

	getDescription(): string {
		return 'Renew Google webhook subscriptions';
	}

	async action({}: CommandActionData) {
		await runGoogleSubscribe({ cwd: process.cwd() });
	}
}
