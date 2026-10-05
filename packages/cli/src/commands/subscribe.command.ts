import type { CommandActionData, CommandOption } from '../index.types';
import {
	formatSubscribePluginList,
	isSubscribePluginId,
	runWebhookSubscription,
} from '../utils/subscription';
import BaseCommand from './base.command';
import GmailCommand from './subscribe/gmail.command';
import GooglecalendarCommand from './subscribe/googlecalendar.command';
import GoogledriveCommand from './subscribe/googledrive.command';
import GooglesheetsCommand from './subscribe/googlesheets.command';
import OnedriveCommand from './subscribe/onedrive.command';
import OutlookCommand from './subscribe/outlook.command';
import SharepointCommand from './subscribe/sharepoint.command';
import TeamsCommand from './subscribe/teams.command';

export default class SubscribeCommand extends BaseCommand {
	getName(): string {
		return 'subscribe';
	}

	getDescription(): string {
		return 'Subscribe to Microsoft and Google webhook providers';
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
			new GmailCommand(),
			new GoogledriveCommand(),
			new GooglecalendarCommand(),
			new GooglesheetsCommand(),
		];
	}

	async action({ options }: CommandActionData) {
		if (!options.plugin) {
			console.error(
				'Usage: corsair subscribe --plugin=<id> or corsair subscribe <plugin>',
			);
			console.error(`[#corsair]: Supported: ${formatSubscribePluginList()}`);
			process.exit(1);
		}

		if (!isSubscribePluginId(options.plugin)) {
			console.error(
				`[#corsair]: Unknown plugin for subscribe: '${options.plugin}'. Supported: ${formatSubscribePluginList()}`,
			);
			process.exit(1);
		}

		await runWebhookSubscription(process.cwd(), options.plugin);
	}
}
