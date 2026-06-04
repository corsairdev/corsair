import type { AnyCorsairInstance } from 'corsair';
import { getSchema } from 'corsair';
import type { CommandActionData, CommandArgument } from '../index.types';
import { getCorsairInstance } from '../utils/corsair-instance';
import BaseCommand from './base.command';

export default class SchemaCommand extends BaseCommand {
	getName(): string {
		return 'schema';
	}

	getDescription(): string {
		return 'Show schema for a specific path';
	}

	getArguments(): CommandArgument[] {
		return [{ name: '<path>', description: 'Endpoint/webhook/db path' }];
	}

	async action({ args }: CommandActionData) {
		const schemaPath = args[0];
		if (!schemaPath) {
			console.error('[#corsair]: Usage: corsair schema <path>');
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd: process.cwd() });
		const result = getSchema(instance as AnyCorsairInstance, schemaPath);
		console.log(result);
	}
}
