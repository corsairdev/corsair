import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class GmailCommand extends BaseCommand {
	getName(): string {
		return 'gmail';
	}

	getDescription(): string {
		return 'Subscribe Gmail webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'gmail');
	}
}
