import {
	CircleCIContextEntity,
	CircleCIGroupEntity,
	CircleCIOrbAllowlistEntryEntity,
	CircleCIPipelineDefinitionEntity,
	CircleCIProjectEntity,
	CircleCIProjectEnvVarEntity,
	CircleCIScheduleEntity,
} from './database';

export const CircleCISchema = {
	version: '1.0.0',
	entities: {
		projects: CircleCIProjectEntity,
		contexts: CircleCIContextEntity,
		projectEnvVars: CircleCIProjectEnvVarEntity,
		schedules: CircleCIScheduleEntity,
		groups: CircleCIGroupEntity,
		orbAllowlistEntries: CircleCIOrbAllowlistEntryEntity,
		pipelineDefinitions: CircleCIPipelineDefinitionEntity,
	},
} as const;

export * from './database';
