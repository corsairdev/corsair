import * as billing from './billing';
import * as datasets from './datasets';
import * as executions from './executions';
import * as health from './health';
import * as plays from './plays';
import * as runs from './runs';
import * as search from './search';
import * as tools from './tools';
export const endpoints = {
	datasets,
	health,
	tools,
	search,
	executions,
	plays,
	runs,
	billing,
} as const;
