import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class GoogledriveCommand extends BaseCommand {
	getName(): string {
		return 'googledrive';
	}

	getDescription(): string {
		return 'Subscribe Google Drive webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'googledrive');
	}
}
