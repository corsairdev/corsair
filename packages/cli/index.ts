#!/usr/bin/env node

import { Command } from 'commander';
import { runAgentOperation } from './commands/operation.js';

const program = new Command();

program
	.name('corsair')
	.description('Corsair CLI - Type-safe database operations with AI assistance')
	.version('1.0.0');

program
	.command('check')
	.description('Run TypeScript type checking on query and mutation files')
	.action(async () => {
		const { check } = await import('./commands/check.js');
		await check();
	});

program
	.command('fix')
	.description('Fix type errors by regenerating files with errors')
	.action(async () => {
		const { fix } = await import('./commands/fix.js');
		await fix();
	});

program
	.command('schema')
	.description('Get the schema')
	.action(async () => {
		const { getSchema } = await import('./utils/schema.js');
		const response = await getSchema();

		console.log(response?.db);
	});

program
	.command('query')
	.description('Create a new query')
	.requiredOption('-n, --name <name>', 'Operation name')
	.option('-i, --instructions <instructions>', 'Additional instructions')
	.option('-u, --update', 'Update/regenerate existing query file')
	.action(
		async (options: {
			name: string;
			instructions: string;
			update: boolean;
		}) => {
			await runAgentOperation(
				'query',
				options.name,
				options.instructions,
				options.update,
			);
		},
	);

program
	.command('mutation')
	.description('Create a new mutation')
	.requiredOption('-n, --name <name>', 'Operation name')
	.option('-i, --instructions <instructions>', 'Additional instructions')
	.option('-u, --update', 'Update/regenerate existing mutation file')
	.action(
		async (options: {
			name: string;
			instructions: string;
			update: boolean;
		}) => {
			await runAgentOperation(
				'mutation',
				options.name,
				options.instructions,
				options.update,
			);
		},
	);

program
	.command('list')
	.description('List all queries and mutations with their details')
	.option('-q, --queries', 'List only queries')
	.option('-m, --mutations', 'List only mutations')
	.option('-f, --filter <filter>', 'Filter operations by search string')
	.action(
		async (options: {
			queries: boolean;
			mutations: boolean;
			filter: string;
		}) => {
			const { list } = await import('./commands/list.js');
			await list({
				queries: options.queries,
				mutations: options.mutations,
				filter: options.filter,
			});
		},
	);

program.parse();

process.on('unhandledRejection', (error) => {
	console.error('❌ Fatal error:', error);
	process.exit(1);
});
