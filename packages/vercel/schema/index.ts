import {
	VercelAliasSchema,
	VercelDeploymentSchema,
	VercelDomainSchema,
	VercelEnvVariableSchema,
	VercelProjectSchema,
	VercelTeamSchema,
} from './database';

export const VercelSchema = {
	version: '1.0.0',
	entities: {
		deployments: VercelDeploymentSchema,
		projects: VercelProjectSchema,
		envs: VercelEnvVariableSchema,
		domains: VercelDomainSchema,
		aliases: VercelAliasSchema,
		teams: VercelTeamSchema,
	},
} as const;
