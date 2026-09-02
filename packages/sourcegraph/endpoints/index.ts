import {
	compareCommits,
	getCommitDetails,
	getFileContents,
	list,
	listFiles,
	listLanguages,
} from './repository';
import { checkSettingsEditPermission } from './site';
import { getCurrent } from './user';

export const Site = {
	checkSettingsEditPermission,
};

export const User = {
	getCurrent,
};

export const Repository = {
	compareCommits,
	getCommitDetails,
	getFileContents,
	list,
	listFiles,
	listLanguages,
};

export * from './types';
