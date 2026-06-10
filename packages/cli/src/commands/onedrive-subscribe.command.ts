import OnedriveCommand from './subscribe/onedrive.command';

export default class OnedriveSubscribeCommand extends OnedriveCommand {
	getName(): string {
		return 'onedrive-subscribe';
	}

	getDescription(): string {
		return 'Subscribe OneDrive webhooks';
	}
}
