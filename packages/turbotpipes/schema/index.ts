import {
	TurbotPipesActorSchema,
	TurbotPipesConnectionSchema,
	TurbotPipesDatatankSchema,
	TurbotPipesOrgSchema,
	TurbotPipesProcessSchema,
	TurbotPipesQuerySchema,
	TurbotPipesUserSchema,
	TurbotPipesWorkspaceSchema,
} from './database';

export const TurbotPipesSchema = {
	version: '1.0.0',
	entities: {
		actor: TurbotPipesActorSchema,
		user: TurbotPipesUserSchema,
		org: TurbotPipesOrgSchema,
		workspace: TurbotPipesWorkspaceSchema,
		connection: TurbotPipesConnectionSchema,
		query: TurbotPipesQuerySchema,
		datatank: TurbotPipesDatatankSchema,
		process: TurbotPipesProcessSchema,
	},
} as const;

export * from './database';
