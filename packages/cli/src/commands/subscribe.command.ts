import BaseCommand from './base.command'
import TeamsCommand from '@/commands/sharepoint/teams.command'
import SharepointCommand from '@/commands/sharepoint/sharepoint.command'

export default class SubscribeCommand extends BaseCommand {
	getName(): string {
		return 'subscribe';
	}

	getDescription(): string {
		return 'Subscribe to various kinds of webhooks';
	}

	// getOptions(): CommandOption[] {
	// 	return [{ short: '-p', long: '--plugin <id>', description: 'Plugin id' }];
	// }

	// async action({ options }: CommandActionData) {
	// 	if (options.plugin === 'outlook') {
	// 		const { runOutlookSubscribe } = await import('../microsoft/subscribe-microsoft');
	// 		await runOutlookSubscribe({ cwd: process.cwd() });
	// 		return;
	// 	}
	// 	console.error(
	// 		`[#corsair]: Unknown plugin for subscribe: '${options.plugin ?? '(none)'}'. Supported: outlook`,
	// 	);
	// 	process.exit(1);
	// }

	getSubCommands():BaseCommand[]{
		return [
			new SharepointCommand(),
			new TeamsCommand(),
		]
	}
}
