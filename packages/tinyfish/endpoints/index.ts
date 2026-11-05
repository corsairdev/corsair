import {
	cancelRun,
	cancelRuns,
	getRun,
	getRuns,
	getStepHtml,
	getStepScreenshot,
	listRuns,
	run,
	runAsync,
	runBatch,
} from './agent';
import {
	usage as browserUsage,
	createSession,
	terminateSession,
} from './browser';
import { fetch as fetchUrls, usage as fetchUsage } from './fetch';
import {
	create as createProfile,
	remove as deleteProfile,
	get as getProfile,
	list as listProfiles,
	update as updateProfile,
} from './profiles';
import {
	cancel as cancelResearch,
	get as getResearchRun,
	list as listResearchRuns,
	start as startResearch,
} from './research';
import { search, searchUsage } from './search';
import { list as listVaultItems } from './vault';
import { get as getWallet } from './wallet';

export const Search = {
	search,
	usage: searchUsage,
};

export const Fetch = {
	fetch: fetchUrls,
	usage: fetchUsage,
};

export const Browser = {
	createSession,
	terminateSession,
	usage: browserUsage,
};

export const Agent = {
	run,
	runAsync,
	runBatch,
	listRuns,
	getRun,
	getRuns,
	cancelRun,
	cancelRuns,
	getStepScreenshot,
	getStepHtml,
};

export const Research = {
	start: startResearch,
	list: listResearchRuns,
	get: getResearchRun,
	cancel: cancelResearch,
};

export const Profiles = {
	list: listProfiles,
	create: createProfile,
	get: getProfile,
	update: updateProfile,
	delete: deleteProfile,
};

export const Wallet = {
	get: getWallet,
};

export const Vault = {
	list: listVaultItems,
};

export * from './types';
