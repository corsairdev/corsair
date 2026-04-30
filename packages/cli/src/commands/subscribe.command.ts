import BaseCommand from './base.command';

export default class SubscribeCommand extends BaseCommand {
	getName(): string {
		return 'subscribe';
	}
	getDescription(): string {
		return 'Legacy subscribe command';
	}
	getOptions(): Array<{ flags: string; description: string }> {
		return [{ flags: '--plugin <id>', description: 'Plugin id' }];
	}
	async action(options: { plugin?: string }) {
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
