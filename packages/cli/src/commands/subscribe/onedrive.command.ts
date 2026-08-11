import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class OnedriveCommand extends BaseCommand {
	getName(): string {
		return 'onedrive';
	}

	getDescription(): string {
		return 'Subscribe OneDrive webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'onedrive');
	}
}
