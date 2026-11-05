import { BrowserUseBrowser, BrowserUseRun } from './database';

export const BrowserUseSchema = {
	version: '1.0.0',
	entities: {
		browsers: BrowserUseBrowser,
		runs: BrowserUseRun,
	},
} as const; // as is necessary: this must stay a literal. A wider type is not practical.

export { BrowserUseBrowser, BrowserUseRun, RunStatus } from './database';
