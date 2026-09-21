export * from './types';

import type { EndpointPathsOf } from 'corsair/core';

export const endpointMeta = {
	'Account.get': {
		riskLevel: 'read' as const,
		description: 'Get account details',
	},
	'Organizations.list': {
		riskLevel: 'read' as const,
		description: 'List organizations',
	},
	'Organizations.get': {
		riskLevel: 'read' as const,
		description: 'Get organization',
	},
	'Repositories.list': {
		riskLevel: 'read' as const,
		description: 'List repositories',
	},
	'Repositories.get': {
		riskLevel: 'read' as const,
		description: 'Get repository',
	},
	'Repositories.languages': {
		riskLevel: 'read' as const,
		description: 'Get repository languages',
	},
	'Analysis.getConfig': {
		riskLevel: 'read' as const,
		description: 'Get analysis configuration',
	},
	'Analysis.tools': {
		riskLevel: 'read' as const,
		description: 'List analysis tools',
	},
	'Analysis.patterns': {
		riskLevel: 'read' as const,
		description: 'List analysis patterns',
	},
	'Commits.list': { riskLevel: 'read' as const, description: 'List commits' },
	'Issues.list': { riskLevel: 'read' as const, description: 'List issues' },
} as const satisfies Record<
	EndpointPathsOf<typeof import('./tree').codacyEndpointsNested>,
	{ riskLevel: 'read' | 'write' | 'destructive'; description: string }
>;

export { codacyEndpointsNested, Endpoints } from './tree';
export type { CodacyEndpoints } from './types';
