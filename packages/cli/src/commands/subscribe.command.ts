import BaseCommand from './base.command';
import type { CommandActionData, CommandOption } from '../index.types';
import TeamsCommand from './subscribe/teams.command';
import SharepointCommand from './subscribe/sharepoint.command';
import OutlookCommand from './subscribe/outlook.command';
import OnedriveCommand from './subscribe/onedrive.command';

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
			new OnedriveCommand(),
		];
	}

	async action({ options }: CommandActionData) {
		if (!options.plugin) {
			console.error(
				'Usage: corsair subscribe --plugin=<id> or corsair subscribe <plugin>',
			);
			console.error(
				'[#corsair]: Supported: outlook, sharepoint, teams, onedrive',
			);
			process.exit(1);
		}

		if (options.plugin === 'outlook') {
			const { runOutlookSubscribe } = await import(
				'../lib/microsoft/subscribe-microsoft'
			);
			await runOutlookSubscribe({ cwd: process.cwd() });
			return;
		}

		if (options.plugin === 'sharepoint') {
			const { runSharepointSubscribe } = await import(
				'../lib/microsoft/subscribe-microsoft'
			);
			await runSharepointSubscribe({ cwd: process.cwd() });
			return;
		}

		if (options.plugin === 'teams') {
			const { runTeamsSubscribe } = await import(
				'../lib/microsoft/subscribe-microsoft'
			);
			await runTeamsSubscribe({ cwd: process.cwd() });
			return;
		}

		if (options.plugin === 'onedrive') {
			const { runOnedriveSubscribe } = await import(
				'../lib/microsoft/subscribe-microsoft'
			);
			await runOnedriveSubscribe({ cwd: process.cwd() });
			return;
		}

		console.error(
			`[#corsair]: Unknown plugin for subscribe: '${options.plugin}'. Supported: outlook, sharepoint, teams, onedrive`,
		);
		process.exit(1);
	}
}
