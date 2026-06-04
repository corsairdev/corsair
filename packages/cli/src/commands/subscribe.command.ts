import type { CommandActionData, CommandOption } from '../index.types';
import { runOutlookSubscribe } from '../lib/microsoft/subscribe-microsoft';
import BaseCommand from './base.command';
import OutlookCommand from './subscribe/outlook.command';
import SharepointCommand from './subscribe/sharepoint.command';
import TeamsCommand from './subscribe/teams.command';

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
		return [new SharepointCommand(), new TeamsCommand(), new OutlookCommand()];
	}

	async action({ options }: CommandActionData) {
		if (!options.plugin) {
			console.error(
				'Usage: corsair subscribe --plugin=<id> or corsair subscribe <plugin>',
			);
			console.error('[#corsair]: Supported: outlook');
			process.exit(1);
		}

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
