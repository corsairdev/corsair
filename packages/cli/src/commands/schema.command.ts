import type { AnyCorsairInstance } from 'corsair';
import { getSchema } from 'corsair';
import BaseCommand from './base.command';
import { getCorsairInstance } from '../utils/corsair-instance';

export default class SchemaCommand extends BaseCommand {
	getName(): string {
		return 'schema';
	}
	getDescription(): string {
		return 'Show schema for a specific path';
	}
	getArguments(): Array<{ name: string; description?: string }> {
		return [{ name: '<path>', description: 'Endpoint/webhook/db path' }];
	}
	async action(schemaPath?: string) {
		if (!schemaPath) {
			console.error('[#corsair]: Usage: corsair schema <path>');
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd: process.cwd() });
		const result = getSchema(instance as AnyCorsairInstance, schemaPath);
		console.log(result);
	}
}
