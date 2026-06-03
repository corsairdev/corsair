import BaseCommand from '../base.command'
import type { CommandActionData } from '../../index.types'
import { runOnedriveSubscribe } from '../../lib/microsoft/subscribe-microsoft'

export default class OnedriveCommand extends BaseCommand {
	getName(): string {
		return 'onedrive';
	}

	getDescription(): string {
		return 'Subscribe OneDrive webhooks';
	}

	async action({}: CommandActionData) {
		await runOnedriveSubscribe({ cwd: process.cwd() });
	}
}
