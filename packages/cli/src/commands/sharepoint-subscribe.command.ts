import SharepointCommand from './subscribe/sharepoint.command';

export default class SharepointSubscribeCommand extends SharepointCommand {
	getName(): string {
		return 'sharepoint-subscribe';
	}

	getDescription(): string {
		return 'Subscribe SharePoint webhooks';
	}
}
