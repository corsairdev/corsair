import type { CommandActionData } from '../../index.types';
import { runWebhookSubscription } from '../../utils/subscription';
import BaseCommand from '../base.command';

export default class SharepointCommand extends BaseCommand {
	getName(): string {
		return 'sharepoint';
	}

	getDescription(): string {
		return 'Subscribe SharePoint webhooks';
	}

	async action({}: CommandActionData) {
		await runWebhookSubscription(process.cwd(), 'sharepoint');
	}
}
