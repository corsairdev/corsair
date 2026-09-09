import {
	CodeInterpreterExecution,
	CodeInterpreterFile,
	CodeInterpreterSession,
} from './database';

export const CodeInterpreterSchema = {
	version: '1.0.0',
	entities: {
		sessions: CodeInterpreterSession,
		files: CodeInterpreterFile,
		executions: CodeInterpreterExecution,
	},
} as const;

