import type { CommandActionData } from '../index.types';
import BaseCommand from './base.command';
import CloudListCommand from './cloud/list.command';
import CloudPullCommand from './cloud/pull.command';

export default class CloudCommand extends BaseCommand {
	getName(): string {
		return 'cloud';
	}

	getDescription(): string {
		return 'Corsair Cloud: discover and type a hosted project (list, pull)';
	}

	getSubCommands(): BaseCommand[] {
		return [new CloudListCommand(), new CloudPullCommand()];
	}

	async action({}: CommandActionData) {
		console.error('[#corsair]: Usage: corsair cloud <list|pull>');
		process.exit(1);
	}
}
