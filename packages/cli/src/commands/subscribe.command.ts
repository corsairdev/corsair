import BaseCommand from './base.command';
import type { CommandActionData, CommandOption } from '@/index.types';

export default class SubscribeCommand extends BaseCommand {
	getName(): string {
		return 'subscribe';
	}
	getDescription(): string {
		return 'Legacy subscribe command';
	}
	getOptions(): CommandOption[] {
		return [{ short: '-p', long: '--plugin <id>', description: 'Plugin id' }];
	}
	async action({ options }: CommandActionData) {
		if (options.plugin === 'outlook') {
			const { runOutlookSubscribe } = await import('../microsoft/subscribe-microsoft');
			await runOutlookSubscribe({ cwd: process.cwd() });
			return;
		}
		console.error(
			`[#corsair]: Unknown plugin for subscribe: '${options.plugin ?? '(none)'}'. Supported: outlook`,
		);
		process.exit(1);
	}
}
