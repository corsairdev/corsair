import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://circleci.com/docs/api/v2/openapi.json
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const Id = z.string();

export const CircleCIVcsInfo = z
	.object({
		vcs_url: S,
		provider: S,
		default_branch: S,
	})
	.loose();
export type CircleCIVcsInfo = z.infer<typeof CircleCIVcsInfo>;

export const CircleCIProjectEntity = z
	.object({
		id: Id,
		slug: S,
		name: S,
		organization_name: S,
		organization_id: S,
		organization_slug: S,
		vcs_info: CircleCIVcsInfo.nullable().optional(),
	})
	.loose();
export type CircleCIProjectEntity = z.infer<typeof CircleCIProjectEntity>;

export const CircleCIContextEnvVarEntity = z
	.object({
		variable: Id,
		context_id: S,
		created_at: S,
		updated_at: S,
		truncated_value: S,
	})
	.loose();
export type CircleCIContextEnvVarEntity = z.infer<
	typeof CircleCIContextEnvVarEntity
>;

export const CircleCIContextRestrictionEntity = z
	.object({
		id: Id,
		context_id: S,
		name: S,
		restriction_type: S,
		restriction_value: S,
		project_id: S,
	})
	.loose();
export type CircleCIContextRestrictionEntity = z.infer<
	typeof CircleCIContextRestrictionEntity
>;

export const CircleCIContextEntity = z
	.object({
		id: Id,
		name: S,
		created_at: S,
	})
	.loose();
export type CircleCIContextEntity = z.infer<typeof CircleCIContextEntity>;

export const CircleCIProjectEnvVarEntity = z
	.object({
		name: Id,
		value: S,
		'created-at': S,
		created_at: S,
	})
	.loose();
export type CircleCIProjectEnvVarEntity = z.infer<
	typeof CircleCIProjectEnvVarEntity
>;

export const CircleCIScheduleTimetable = z
	.object({
		'per-hour': N,
		'hours-of-day': z.array(z.number()).nullable().optional(),
		'days-of-week': z.array(z.string()).nullable().optional(),
		'days-of-month': z.array(z.number()).nullable().optional(),
		months: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type CircleCIScheduleTimetable = z.infer<
	typeof CircleCIScheduleTimetable
>;

export const CircleCIScheduleActor = z
	.object({
		id: S,
		avatar_url: S,
		login: S,
		name: S,
	})
	.loose();
export type CircleCIScheduleActor = z.infer<typeof CircleCIScheduleActor>;

export const CircleCIScheduleEntity = z
	.object({
		id: Id,
		name: S,
		description: S,
		'project-slug': S,
		'created-at': S,
		'updated-at': S,
		actor: CircleCIScheduleActor.nullable().optional(),
		parameters: z.record(z.string(), z.unknown()).nullable().optional(),
		timetable: CircleCIScheduleTimetable.nullable().optional(),
	})
	.loose();
export type CircleCIScheduleEntity = z.infer<typeof CircleCIScheduleEntity>;

export const CircleCIGroupEntity = z
	.object({
		id: Id,
		name: S,
		description: S,
	})
	.loose();
export type CircleCIGroupEntity = z.infer<typeof CircleCIGroupEntity>;

export const CircleCIOrbAllowlistEntryEntity = z
	.object({
		id: Id,
		name: S,
		prefix: S,
		auth: S,
	})
	.loose();
export type CircleCIOrbAllowlistEntryEntity = z.infer<
	typeof CircleCIOrbAllowlistEntryEntity
>;

export const CircleCISourceRepo = z
	.object({
		full_name: S,
		external_id: S,
	})
	.loose();
export type CircleCISourceRepo = z.infer<typeof CircleCISourceRepo>;

export const CircleCIConfigSource = z
	.object({
		provider: S,
		repo: CircleCISourceRepo.nullable().optional(),
		file_path: S,
	})
	.loose();
export type CircleCIConfigSource = z.infer<typeof CircleCIConfigSource>;

export const CircleCICheckoutSource = z
	.object({
		provider: S,
		repo: CircleCISourceRepo.nullable().optional(),
	})
	.loose();
export type CircleCICheckoutSource = z.infer<typeof CircleCICheckoutSource>;

export const CircleCIPipelineDefinitionEntity = z
	.object({
		id: Id,
		name: S,
		description: S,
		created_at: S,
		config_source: CircleCIConfigSource.nullable().optional(),
		checkout_source: CircleCICheckoutSource.nullable().optional(),
	})
	.loose();
export type CircleCIPipelineDefinitionEntity = z.infer<
	typeof CircleCIPipelineDefinitionEntity
>;
