import type { CommandActionData } from '../../index.types';
import BaseCommand from '../base.command';

export default class OnedriveCommand extends BaseCommand {
	getName(): string {
		return 'onedrive';
	}

	getDescription(): string {
		return 'Subscribe OneDrive webhooks';
	}

	async action({}: CommandActionData) {
		const { runOnedriveSubscribe } = await import(
			'../../lib/microsoft/subscribe-microsoft'
		);
		await runOnedriveSubscribe({ cwd: process.cwd() });
	}
}
