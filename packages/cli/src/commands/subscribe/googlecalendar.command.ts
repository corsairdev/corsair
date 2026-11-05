import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class GooglecalendarCommand extends BaseCommand {
	getName(): string {
		return 'googlecalendar';
	}

	getDescription(): string {
		return 'Subscribe Google Calendar webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'googlecalendar');
	}
}
