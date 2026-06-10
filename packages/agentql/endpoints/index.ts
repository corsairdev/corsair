import { createRemoteBrowserSession } from './browser-sessions';
import { query } from './query-data';
import { get as getUsage } from './usage';

export const BrowserSessions = {
	createRemoteBrowserSession,
};

export const Data = {
	query,
};

export const Usage = {
	get: getUsage,
};

export * from './types';
