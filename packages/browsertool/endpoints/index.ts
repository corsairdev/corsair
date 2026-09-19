import {
	createTask,
	getOutputFile,
	getSession,
	stopTask,
	watchTask,
} from './handlers';

export const BrowserTool = {
	createTask,
	watchTask,
	stopTask,
	getSession,
	getOutputFile,
};

export * from './types';
