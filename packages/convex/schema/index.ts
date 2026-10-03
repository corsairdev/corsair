import {
	ConvexDeployKeySchema,
	ConvexDeploymentSchema,
	ConvexProjectSchema,
} from './database';

export const ConvexSchema = {
	version: '1.0.0',
	entities: {
		projects: ConvexProjectSchema,
		deployments: ConvexDeploymentSchema,
		deployKeys: ConvexDeployKeySchema,
	},
} as const;
