import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class GooglesheetsCommand extends BaseCommand {
	getName(): string {
		return 'googlesheets';
	}

	getDescription(): string {
		return 'Subscribe Google Sheets webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'googlesheets');
	}
}
