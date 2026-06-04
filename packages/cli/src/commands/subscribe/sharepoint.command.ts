import type { CommandActionData } from '../../index.types';
import { runSharepointSubscribe } from '../../lib/microsoft/sharepoint';
import BaseCommand from '../base.command';

export default class SharepointCommand extends BaseCommand {
	getName(): string {
		return 'sharepoint';
	}

	getDescription(): string {
		return 'Subscribe SharePoint webhooks';
	}

	async action({}: CommandActionData) {
		await runSharepointSubscribe({ cwd: process.cwd() });
	}
}
