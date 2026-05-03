import BaseCommand from './base.command'
import OutlookCommand from '@/commands/sharepoint/outlook.command'
import SharepointCommand from '@/commands/sharepoint/sharepoint.command'
import TeamsCommand from '@/commands/sharepoint/teams.command'

export default class SubscribeCommand extends BaseCommand {
	getName(): string {
		return 'subscribe';
	}

	getDescription(): string {
		return 'Subscribe to various kinds of webhooks';
	}

	getSubCommands(): BaseCommand[] {
		return [
			new OutlookCommand(),
			new SharepointCommand(),
			new TeamsCommand(),
		]
	}
}
