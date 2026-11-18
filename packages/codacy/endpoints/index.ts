export * from './types';

import { get as getAccount } from './account';
import { getConfig as getAnalysisConfig } from './analysis';
import {
	get as getOrganization,
	list as listOrganizations,
} from './organizations';
import { get as getPattern, list as listPatterns } from './patterns';
import {
	get as getRepository,
	list as listRepositories,
	languages as repositoryLanguages,
} from './repositories';
import { list as listTools } from './tools';

export const Endpoints = {
	// Account
	accountGet: getAccount,
	// Organizations
	organizationList: listOrganizations,
	organizationGet: getOrganization,
	// Repositories
	repositoryList: listRepositories,
	repositoryGet: getRepository,
	repositoryLanguages,
	// Analysis
	analysisConfigGet: getAnalysisConfig,
	// Tools
	toolList: listTools,
	// Patterns
	patternList: listPatterns,
	patternGet: getPattern,
} as const;
