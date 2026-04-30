import type { AnyCorsairInstance } from 'corsair';
import { listOperations } from 'corsair';
import BaseCommand from './base.command';
import { getCorsairInstance } from '../utils/corsair-instance';
import { parseListArgs } from '../utils/arg-parsers';

export default class ListCommand extends BaseCommand {
	getName(): string {
		return 'list';
	}
	getDescription(): string {
		return 'List available operations';
	}
	getOptions(): Array<{ flags: string; description: string }> {
		return [
			{ flags: '--plugin <id>', description: 'Filter by plugin id' },
			{ flags: '--type <api|webhooks|db>', description: 'Filter by operation type' },
		];
	}
	async action(options: { plugin?: string; type?: 'api' | 'webhooks' | 'db' }) {
		const { plugin, type } = parseListArgs([
			options.plugin ? `--plugin=${options.plugin}` : '',
			options.type ? `--type=${options.type}` : '',
		]);
		const instance = await getCorsairInstance({ cwd: process.cwd() });
		const result = listOperations(instance as AnyCorsairInstance, { plugin, type });
		if (type === 'db') {
			console.log(
				'[#corsair]: NOTE: Every DB query listed here has both .search() and .list() methods available.\n',
			);
		}
		console.log(result);
	}
}
