import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent, stepCountIs } from 'ai';
import {
	getExistingOperations,
	readFile,
	writeFile,
} from './tools/index.js';

type OperationDirs = {
	queriesDir: string;
	mutationsDir: string;
};

export const promptAgent = (pwd: string, operationDirs: OperationDirs) =>
	new Agent({
		model: openai('gpt-4.1'),
		tools: {
			read_file: readFile(pwd),
			write_file: writeFile(pwd),
			get_existing_operations: getExistingOperations(operationDirs),
		},
		stopWhen: stepCountIs(20),
	});
