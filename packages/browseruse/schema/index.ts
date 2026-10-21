import { BrowserUseBrowser, BrowserUseRun } from './database';

export const BrowserUseSchema = {
	version: '1.0.0',
	entities: {
		browsers: BrowserUseBrowser,
		runs: BrowserUseRun,
	},
} as const;

export { BrowserUseBrowser, BrowserUseRun, RunStatus } from './database';
