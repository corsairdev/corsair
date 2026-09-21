import {
	getAccount,
	getOrganization,
	list as listOrganizations,
} from './account';
import { getConfig, listPatterns, listTools } from './analysis';
import { list as listCommits, listIssues } from './commits';
import { get as getRepository, languages, list } from './repositories';

export const Endpoints = {
	// Account
	accountGet: getAccount,
	// Organizations
	organizationList: listOrganizations,
	organizationGet: getOrganization,
	// Repositories
	repositoryList: list,
	repositoryGet: getRepository,
	repositoryLanguages: languages,
	// Analysis
	analysisConfigGet: getConfig,
	toolList: listTools,
	patternList: listPatterns,
	// Commits & Issues
	commitList: listCommits,
	issueList: listIssues,
} as const;

export const codacyEndpointsNested = {
	Account: {
		get: Endpoints.accountGet,
	},
	Organizations: {
		list: Endpoints.organizationList,
		get: Endpoints.organizationGet,
	},
	Repositories: {
		list: Endpoints.repositoryList,
		get: Endpoints.repositoryGet,
		languages: Endpoints.repositoryLanguages,
	},
	Analysis: {
		getConfig: Endpoints.analysisConfigGet,
		tools: Endpoints.toolList,
		patterns: Endpoints.patternList,
	},
	Commits: {
		list: Endpoints.commitList,
	},
	Issues: {
		list: Endpoints.issueList,
	},
} as const;

export type CodacyEndpointsNested = typeof codacyEndpointsNested;
