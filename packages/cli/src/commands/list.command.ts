import type { AnyCorsairInstance } from 'corsair'
import { listOperations } from 'corsair'
import BaseCommand from './base.command'
import type { CommandActionData, CommandOption } from '@/index.types'
import { getCorsairInstance } from '@/utils/corsair-instance'

export default class ListCommand extends BaseCommand {
	getName(): string {
		return 'list';
	}

	getDescription(): string {
		return 'List available operations';
	}

	getOptions(): CommandOption[] {
		return [
			{ short: '-p', long: '--plugin <id>', description: 'Filter by plugin id' },
			{ short: '-t', long: '--type <api|webhooks|db>', description: 'Filter by operation type' },
		];
	}

	async action({ options }: CommandActionData) {
		const { plugin, type } = options
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
