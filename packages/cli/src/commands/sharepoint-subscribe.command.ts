import BaseCommand from './base.command'
import type { CommandActionData } from '@/index.types'
import { runSharepointSubscribe } from '@/lib/microsoft/sharepoint'

export default class SharepointSubscribeCommand extends BaseCommand {
	getName(): string {
		return 'sharepoint-subscribe';
	}

	getDescription(): string {
		return 'Subscribe SharePoint webhooks (alias for: subscribe sharepoint)';
	}

	async action({}: CommandActionData) {
		await runSharepointSubscribe({ cwd: process.cwd() });
	}
}
