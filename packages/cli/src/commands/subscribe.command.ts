import BaseCommand from './base.command'
import TeamsCommand from '@/commands/subscribe/teams.command'
import SharepointCommand from '@/commands/subscribe/sharepoint.command'
import OutlookCommand from '@/commands/subscribe/outlook.command'

export default class SubscribeCommand extends BaseCommand {
	getName(): string {
		return 'subscribe';
	}

	getDescription(): string {
		return 'Subscribe to various kinds of webhooks';
	}

	getSubCommands():BaseCommand[]{
		return [
			new SharepointCommand(),
			new TeamsCommand(),
			new OutlookCommand(),
		]
	}
}
