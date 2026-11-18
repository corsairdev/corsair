import * as auth from './auth';
import * as billing from './billing';
import * as datasets from './datasets';
import * as db from './db';
import * as executions from './executions';
import * as health from './health';
import * as integrations from './integrations';
import * as monitors from './monitors';
import * as notifications from './notifications';
import * as plays from './plays';
import * as runs from './runs';
import * as search from './search';
import * as secrets from './secrets';
import * as tools from './tools';
import * as workspace from './workspace';
export const endpoints = {
	auth,
	datasets,
	db,
	health,
	tools,
	search,
	executions,
	plays,
	runs,
	billing,
	integrations,
	secrets,
	workspace,
	monitors,
	notifications,
} as const;
