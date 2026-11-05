import type { CommandActionData, CommandOption } from '../../index.types';
import { fetchCloudOpTree, resolveCloudConfig } from '../../lib/cloud/client';
import { formatOpTree } from '../../lib/cloud/op-tree';
import BaseCommand from '../base.command';

export default class CloudListCommand extends BaseCommand {
	getName(): string {
		return 'list';
	}

	getDescription(): string {
		return 'List every op a Corsair Cloud project exposes';
	}

	getOptions(): CommandOption[] {
		return [
			{
				short: '-u',
				long: '--url <url>',
				description: 'Corsair Cloud base URL',
			},
			{
				short: '-k',
				long: '--key <key>',
				description: 'Corsair Cloud project key',
			},
		];
	}

	async action({ options }: CommandActionData) {
		const config = resolveCloudConfig(options);
		const tree = await fetchCloudOpTree(config);
		console.log(formatOpTree(tree));
	}
}
