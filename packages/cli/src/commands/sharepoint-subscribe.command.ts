import BaseCommand from './base.command';
import type { CommandActionData } from '@/index.types';

export default class SharepointSubscribeCommand extends BaseCommand {
	getName(): string {
		return 'sharepoint-subscribe';
	}
	getDescription(): string {
		return 'Subscribe SharePoint webhooks';
	}
	async action({}: CommandActionData) {
		const { runSharepointSubscribe } = await import('../microsoft/subscribe-microsoft');
		await runSharepointSubscribe({ cwd: process.cwd() });
	}
}
