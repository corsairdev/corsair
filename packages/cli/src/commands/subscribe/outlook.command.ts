import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class OutlookCommand extends BaseCommand {
	getName(): string {
		return 'outlook';
	}

	getDescription(): string {
		return 'Subscribe Outlook webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'outlook');
	}
}
