import { BrowserToolExecution, BrowserToolTask } from './database';

export const BrowserToolSchema = {
	version: '1.0.0',
	entities: {
		executions: BrowserToolExecution,
		tasks: BrowserToolTask,
	},
} as const;
