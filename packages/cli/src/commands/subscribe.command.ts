import BaseCommand from './base.command'
import type { CommandActionData, CommandOption } from '@/index.types'
import TeamsCommand from '@/commands/subscribe/teams.command'
import SharepointCommand from '@/commands/subscribe/sharepoint.command'
import OutlookCommand from '@/commands/subscribe/outlook.command'
import { runOutlookSubscribe } from '@/lib/microsoft/subscribe-microsoft'

export default class SubscribeCommand extends BaseCommand {
	getName(): string {
		return 'subscribe';
	}

	getDescription(): string {
		return 'Subscribe to various kinds of webhooks';
	}

	getOptions(): CommandOption[] {
		return [
			{
				short: '-p',
				long: '--plugin <id>',
				description: 'Plugin id (legacy: prefer `corsair subscribe <plugin>`)',
			},
		];
	}

	getSubCommands(): BaseCommand[] {
		return [
			new SharepointCommand(),
			new TeamsCommand(),
			new OutlookCommand(),
		];
	}

	async action({ options }: CommandActionData) {
		if (!options.plugin) return;

		if (options.plugin === 'outlook') {
			await runOutlookSubscribe({ cwd: process.cwd() });
			return;
		}

		console.error(
			`[#corsair]: Unknown plugin for subscribe: '${options.plugin}'. Supported: outlook`,
		);
		process.exit(1);
	}
}
