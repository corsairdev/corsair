import BaseCommand from './base.command';

export default class SharepointSubscribeCommand extends BaseCommand {
	getName(): string {
		return 'sharepoint-subscribe';
	}
	getDescription(): string {
		return 'Subscribe SharePoint webhooks';
	}
	async action() {
		const { runSharepointSubscribe } = await import('../microsoft/subscribe-microsoft');
		await runSharepointSubscribe({ cwd: process.cwd() });
	}
}
