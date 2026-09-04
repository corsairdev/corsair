import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class TeamsCommand extends BaseCommand {
	getName(): string {
		return 'teams';
	}

	getDescription(): string {
		return 'Subscribe Teams webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'teams');
	}
}
