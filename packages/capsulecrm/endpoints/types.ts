import { z } from 'zod';

export const EntitySchema = z.enum(['parties', 'opportunities', 'kases']);
export const JsonSchema = z.object({}).loose();
export const SuccessSchema = z.object({ success: z.literal(true) });
export const AttachmentDownloadSchema = z.object({
	filename: z.string().optional(),
	contentType: z.string().optional(),
	contentBase64: z.string(),
});
export const AttachmentUploadSchema = z
	.object({
		upload: z.object({ token: z.string() }).loose(),
	})
	.loose();

export const PartiesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		since: z.string().optional(),
		embed: z.string().optional(),
	})
	.loose();
export type PartiesListInput = z.infer<typeof PartiesListInputSchema>;
export const PartiesListOutputSchema = JsonSchema;
export type PartiesListOutput = z.infer<typeof PartiesListOutputSchema>;

export const PartiesGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type PartiesGetInput = z.infer<typeof PartiesGetInputSchema>;
export const PartiesGetOutputSchema = JsonSchema;
export type PartiesGetOutput = z.infer<typeof PartiesGetOutputSchema>;

export const PartiesCreateInputSchema = z
	.object({
		type: z.enum(['person', 'organisation']),
	})
	.loose();
export type PartiesCreateInput = z.infer<typeof PartiesCreateInputSchema>;
export const PartiesCreateOutputSchema = JsonSchema;
export type PartiesCreateOutput = z.infer<typeof PartiesCreateOutputSchema>;

export const PartiesUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type PartiesUpdateInput = z.infer<typeof PartiesUpdateInputSchema>;
export const PartiesUpdateOutputSchema = JsonSchema;
export type PartiesUpdateOutput = z.infer<typeof PartiesUpdateOutputSchema>;

export const PartiesDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type PartiesDeleteInput = z.infer<typeof PartiesDeleteInputSchema>;
export const PartiesDeleteOutputSchema = SuccessSchema;
export type PartiesDeleteOutput = z.infer<typeof PartiesDeleteOutputSchema>;

export const PartiesSearchInputSchema = z
	.object({
		q: z.string().min(1),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type PartiesSearchInput = z.infer<typeof PartiesSearchInputSchema>;
export const PartiesSearchOutputSchema = JsonSchema;
export type PartiesSearchOutput = z.infer<typeof PartiesSearchOutputSchema>;

export const PartiesListDeletedInputSchema = z
	.object({
		since: z.string().min(1),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
	})
	.loose();
export type PartiesListDeletedInput = z.infer<
	typeof PartiesListDeletedInputSchema
>;
export const PartiesListDeletedOutputSchema = JsonSchema;
export type PartiesListDeletedOutput = z.infer<
	typeof PartiesListDeletedOutputSchema
>;

export const PartiesListEmployeesInputSchema = z
	.object({
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type PartiesListEmployeesInput = z.infer<
	typeof PartiesListEmployeesInputSchema
>;
export const PartiesListEmployeesOutputSchema = JsonSchema;
export type PartiesListEmployeesOutput = z.infer<
	typeof PartiesListEmployeesOutputSchema
>;

export const PartiesListOpportunitiesInputSchema = z
	.object({
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type PartiesListOpportunitiesInput = z.infer<
	typeof PartiesListOpportunitiesInputSchema
>;
export const PartiesListOpportunitiesOutputSchema = JsonSchema;
export type PartiesListOpportunitiesOutput = z.infer<
	typeof PartiesListOpportunitiesOutputSchema
>;

export const PartiesListProjectsInputSchema = z
	.object({
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type PartiesListProjectsInput = z.infer<
	typeof PartiesListProjectsInputSchema
>;
export const PartiesListProjectsOutputSchema = JsonSchema;
export type PartiesListProjectsOutput = z.infer<
	typeof PartiesListProjectsOutputSchema
>;

export const OpportunitiesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		since: z.string().optional(),
		embed: z.string().optional(),
	})
	.loose();
export type OpportunitiesListInput = z.infer<
	typeof OpportunitiesListInputSchema
>;
export const OpportunitiesListOutputSchema = JsonSchema;
export type OpportunitiesListOutput = z.infer<
	typeof OpportunitiesListOutputSchema
>;

export const OpportunitiesGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type OpportunitiesGetInput = z.infer<typeof OpportunitiesGetInputSchema>;
export const OpportunitiesGetOutputSchema = JsonSchema;
export type OpportunitiesGetOutput = z.infer<
	typeof OpportunitiesGetOutputSchema
>;

export const OpportunitiesCreateInputSchema = z.object({}).loose();
export type OpportunitiesCreateInput = z.infer<
	typeof OpportunitiesCreateInputSchema
>;
export const OpportunitiesCreateOutputSchema = JsonSchema;
export type OpportunitiesCreateOutput = z.infer<
	typeof OpportunitiesCreateOutputSchema
>;

export const OpportunitiesUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type OpportunitiesUpdateInput = z.infer<
	typeof OpportunitiesUpdateInputSchema
>;
export const OpportunitiesUpdateOutputSchema = JsonSchema;
export type OpportunitiesUpdateOutput = z.infer<
	typeof OpportunitiesUpdateOutputSchema
>;

export const OpportunitiesDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type OpportunitiesDeleteInput = z.infer<
	typeof OpportunitiesDeleteInputSchema
>;
export const OpportunitiesDeleteOutputSchema = SuccessSchema;
export type OpportunitiesDeleteOutput = z.infer<
	typeof OpportunitiesDeleteOutputSchema
>;

export const OpportunitiesSearchInputSchema = z
	.object({
		q: z.string().min(1),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type OpportunitiesSearchInput = z.infer<
	typeof OpportunitiesSearchInputSchema
>;
export const OpportunitiesSearchOutputSchema = JsonSchema;
export type OpportunitiesSearchOutput = z.infer<
	typeof OpportunitiesSearchOutputSchema
>;

export const OpportunitiesListDeletedInputSchema = z
	.object({
		since: z.string().min(1),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
	})
	.loose();
export type OpportunitiesListDeletedInput = z.infer<
	typeof OpportunitiesListDeletedInputSchema
>;
export const OpportunitiesListDeletedOutputSchema = JsonSchema;
export type OpportunitiesListDeletedOutput = z.infer<
	typeof OpportunitiesListDeletedOutputSchema
>;

export const OpportunitiesListPartiesInputSchema = z
	.object({
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type OpportunitiesListPartiesInput = z.infer<
	typeof OpportunitiesListPartiesInputSchema
>;
export const OpportunitiesListPartiesOutputSchema = JsonSchema;
export type OpportunitiesListPartiesOutput = z.infer<
	typeof OpportunitiesListPartiesOutputSchema
>;

export const OpportunitiesAddPartyInputSchema = z
	.object({
		id: z.number().int(),
		partyId: z.number().int(),
	})
	.loose();
export type OpportunitiesAddPartyInput = z.infer<
	typeof OpportunitiesAddPartyInputSchema
>;
export const OpportunitiesAddPartyOutputSchema = SuccessSchema;
export type OpportunitiesAddPartyOutput = z.infer<
	typeof OpportunitiesAddPartyOutputSchema
>;

export const OpportunitiesDeletePartyInputSchema = z
	.object({
		id: z.number().int(),
		partyId: z.number().int(),
	})
	.loose();
export type OpportunitiesDeletePartyInput = z.infer<
	typeof OpportunitiesDeletePartyInputSchema
>;
export const OpportunitiesDeletePartyOutputSchema = SuccessSchema;
export type OpportunitiesDeletePartyOutput = z.infer<
	typeof OpportunitiesDeletePartyOutputSchema
>;

export const OpportunitiesListProjectsInputSchema = z
	.object({
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type OpportunitiesListProjectsInput = z.infer<
	typeof OpportunitiesListProjectsInputSchema
>;
export const OpportunitiesListProjectsOutputSchema = JsonSchema;
export type OpportunitiesListProjectsOutput = z.infer<
	typeof OpportunitiesListProjectsOutputSchema
>;

export const ProjectsListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		since: z.string().optional(),
		embed: z.string().optional(),
	})
	.loose();
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export const ProjectsListOutputSchema = JsonSchema;
export type ProjectsListOutput = z.infer<typeof ProjectsListOutputSchema>;

export const ProjectsGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export const ProjectsGetOutputSchema = JsonSchema;
export type ProjectsGetOutput = z.infer<typeof ProjectsGetOutputSchema>;

export const ProjectsCreateInputSchema = z.object({}).loose();
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export const ProjectsCreateOutputSchema = JsonSchema;
export type ProjectsCreateOutput = z.infer<typeof ProjectsCreateOutputSchema>;

export const ProjectsUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;
export const ProjectsUpdateOutputSchema = JsonSchema;
export type ProjectsUpdateOutput = z.infer<typeof ProjectsUpdateOutputSchema>;

export const ProjectsDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;
export const ProjectsDeleteOutputSchema = SuccessSchema;
export type ProjectsDeleteOutput = z.infer<typeof ProjectsDeleteOutputSchema>;

export const ProjectsSearchInputSchema = z
	.object({
		q: z.string().min(1),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type ProjectsSearchInput = z.infer<typeof ProjectsSearchInputSchema>;
export const ProjectsSearchOutputSchema = JsonSchema;
export type ProjectsSearchOutput = z.infer<typeof ProjectsSearchOutputSchema>;

export const ProjectsListDeletedInputSchema = z
	.object({
		since: z.string().min(1),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
	})
	.loose();
export type ProjectsListDeletedInput = z.infer<
	typeof ProjectsListDeletedInputSchema
>;
export const ProjectsListDeletedOutputSchema = JsonSchema;
export type ProjectsListDeletedOutput = z.infer<
	typeof ProjectsListDeletedOutputSchema
>;

export const ProjectsListPartiesInputSchema = z
	.object({
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type ProjectsListPartiesInput = z.infer<
	typeof ProjectsListPartiesInputSchema
>;
export const ProjectsListPartiesOutputSchema = JsonSchema;
export type ProjectsListPartiesOutput = z.infer<
	typeof ProjectsListPartiesOutputSchema
>;

export const ProjectsAddPartyInputSchema = z
	.object({
		id: z.number().int(),
		partyId: z.number().int(),
	})
	.loose();
export type ProjectsAddPartyInput = z.infer<typeof ProjectsAddPartyInputSchema>;
export const ProjectsAddPartyOutputSchema = SuccessSchema;
export type ProjectsAddPartyOutput = z.infer<
	typeof ProjectsAddPartyOutputSchema
>;

export const ProjectsDeletePartyInputSchema = z
	.object({
		id: z.number().int(),
		partyId: z.number().int(),
	})
	.loose();
export type ProjectsDeletePartyInput = z.infer<
	typeof ProjectsDeletePartyInputSchema
>;
export const ProjectsDeletePartyOutputSchema = SuccessSchema;
export type ProjectsDeletePartyOutput = z.infer<
	typeof ProjectsDeletePartyOutputSchema
>;

export const TasksListInputSchema = z
	.object({
		status: z.string().optional(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type TasksListInput = z.infer<typeof TasksListInputSchema>;
export const TasksListOutputSchema = JsonSchema;
export type TasksListOutput = z.infer<typeof TasksListOutputSchema>;

export const TasksGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;
export const TasksGetOutputSchema = JsonSchema;
export type TasksGetOutput = z.infer<typeof TasksGetOutputSchema>;

export const TasksCreateInputSchema = z.object({}).loose();
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;
export const TasksCreateOutputSchema = JsonSchema;
export type TasksCreateOutput = z.infer<typeof TasksCreateOutputSchema>;

export const TasksUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;
export const TasksUpdateOutputSchema = JsonSchema;
export type TasksUpdateOutput = z.infer<typeof TasksUpdateOutputSchema>;

export const TasksDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;
export const TasksDeleteOutputSchema = SuccessSchema;
export type TasksDeleteOutput = z.infer<typeof TasksDeleteOutputSchema>;

export const EntriesListByDateInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type EntriesListByDateInput = z.infer<
	typeof EntriesListByDateInputSchema
>;
export const EntriesListByDateOutputSchema = JsonSchema;
export type EntriesListByDateOutput = z.infer<
	typeof EntriesListByDateOutputSchema
>;

export const EntriesListForEntityInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type EntriesListForEntityInput = z.infer<
	typeof EntriesListForEntityInputSchema
>;
export const EntriesListForEntityOutputSchema = JsonSchema;
export type EntriesListForEntityOutput = z.infer<
	typeof EntriesListForEntityOutputSchema
>;

export const EntriesGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type EntriesGetInput = z.infer<typeof EntriesGetInputSchema>;
export const EntriesGetOutputSchema = JsonSchema;
export type EntriesGetOutput = z.infer<typeof EntriesGetOutputSchema>;

export const EntriesCreateInputSchema = z
	.object({
		content: z.string().min(1),
		type: z.literal('note').optional(),
	})
	.loose();
export type EntriesCreateInput = z.infer<typeof EntriesCreateInputSchema>;
export const EntriesCreateOutputSchema = JsonSchema;
export type EntriesCreateOutput = z.infer<typeof EntriesCreateOutputSchema>;

export const EntriesUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type EntriesUpdateInput = z.infer<typeof EntriesUpdateInputSchema>;
export const EntriesUpdateOutputSchema = JsonSchema;
export type EntriesUpdateOutput = z.infer<typeof EntriesUpdateOutputSchema>;

export const EntriesDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type EntriesDeleteInput = z.infer<typeof EntriesDeleteInputSchema>;
export const EntriesDeleteOutputSchema = SuccessSchema;
export type EntriesDeleteOutput = z.infer<typeof EntriesDeleteOutputSchema>;

export const CategoriesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;
export const CategoriesListOutputSchema = JsonSchema;
export type CategoriesListOutput = z.infer<typeof CategoriesListOutputSchema>;

export const CategoriesGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type CategoriesGetInput = z.infer<typeof CategoriesGetInputSchema>;
export const CategoriesGetOutputSchema = JsonSchema;
export type CategoriesGetOutput = z.infer<typeof CategoriesGetOutputSchema>;

export const CategoriesCreateInputSchema = z.object({}).loose();
export type CategoriesCreateInput = z.infer<typeof CategoriesCreateInputSchema>;
export const CategoriesCreateOutputSchema = JsonSchema;
export type CategoriesCreateOutput = z.infer<
	typeof CategoriesCreateOutputSchema
>;

export const CategoriesUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type CategoriesUpdateInput = z.infer<typeof CategoriesUpdateInputSchema>;
export const CategoriesUpdateOutputSchema = JsonSchema;
export type CategoriesUpdateOutput = z.infer<
	typeof CategoriesUpdateOutputSchema
>;

export const CategoriesDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type CategoriesDeleteInput = z.infer<typeof CategoriesDeleteInputSchema>;
export const CategoriesDeleteOutputSchema = SuccessSchema;
export type CategoriesDeleteOutput = z.infer<
	typeof CategoriesDeleteOutputSchema
>;

export const MilestonesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type MilestonesListInput = z.infer<typeof MilestonesListInputSchema>;
export const MilestonesListOutputSchema = JsonSchema;
export type MilestonesListOutput = z.infer<typeof MilestonesListOutputSchema>;

export const MilestonesGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type MilestonesGetInput = z.infer<typeof MilestonesGetInputSchema>;
export const MilestonesGetOutputSchema = JsonSchema;
export type MilestonesGetOutput = z.infer<typeof MilestonesGetOutputSchema>;

export const MilestonesCreateInputSchema = z.object({}).loose();
export type MilestonesCreateInput = z.infer<typeof MilestonesCreateInputSchema>;
export const MilestonesCreateOutputSchema = JsonSchema;
export type MilestonesCreateOutput = z.infer<
	typeof MilestonesCreateOutputSchema
>;

export const MilestonesUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type MilestonesUpdateInput = z.infer<typeof MilestonesUpdateInputSchema>;
export const MilestonesUpdateOutputSchema = JsonSchema;
export type MilestonesUpdateOutput = z.infer<
	typeof MilestonesUpdateOutputSchema
>;

export const MilestonesDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type MilestonesDeleteInput = z.infer<typeof MilestonesDeleteInputSchema>;
export const MilestonesDeleteOutputSchema = SuccessSchema;
export type MilestonesDeleteOutput = z.infer<
	typeof MilestonesDeleteOutputSchema
>;

export const TitlesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type TitlesListInput = z.infer<typeof TitlesListInputSchema>;
export const TitlesListOutputSchema = JsonSchema;
export type TitlesListOutput = z.infer<typeof TitlesListOutputSchema>;

export const TitlesCreateInputSchema = z.object({}).loose();
export type TitlesCreateInput = z.infer<typeof TitlesCreateInputSchema>;
export const TitlesCreateOutputSchema = JsonSchema;
export type TitlesCreateOutput = z.infer<typeof TitlesCreateOutputSchema>;

export const TitlesDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type TitlesDeleteInput = z.infer<typeof TitlesDeleteInputSchema>;
export const TitlesDeleteOutputSchema = SuccessSchema;
export type TitlesDeleteOutput = z.infer<typeof TitlesDeleteOutputSchema>;

export const CustomFieldsListInputSchema = z
	.object({
		entity: EntitySchema,
	})
	.loose();
export type CustomFieldsListInput = z.infer<typeof CustomFieldsListInputSchema>;
export const CustomFieldsListOutputSchema = JsonSchema;
export type CustomFieldsListOutput = z.infer<
	typeof CustomFieldsListOutputSchema
>;

export const CustomFieldsGetInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
	})
	.loose();
export type CustomFieldsGetInput = z.infer<typeof CustomFieldsGetInputSchema>;
export const CustomFieldsGetOutputSchema = JsonSchema;
export type CustomFieldsGetOutput = z.infer<typeof CustomFieldsGetOutputSchema>;

export const CustomFieldsCreateInputSchema = z
	.object({
		entity: EntitySchema,
	})
	.loose();
export type CustomFieldsCreateInput = z.infer<
	typeof CustomFieldsCreateInputSchema
>;
export const CustomFieldsCreateOutputSchema = JsonSchema;
export type CustomFieldsCreateOutput = z.infer<
	typeof CustomFieldsCreateOutputSchema
>;

export const CustomFieldsUpdateInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
	})
	.loose();
export type CustomFieldsUpdateInput = z.infer<
	typeof CustomFieldsUpdateInputSchema
>;
export const CustomFieldsUpdateOutputSchema = JsonSchema;
export type CustomFieldsUpdateOutput = z.infer<
	typeof CustomFieldsUpdateOutputSchema
>;

export const CustomFieldsDeleteInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
	})
	.loose();
export type CustomFieldsDeleteInput = z.infer<
	typeof CustomFieldsDeleteInputSchema
>;
export const CustomFieldsDeleteOutputSchema = SuccessSchema;
export type CustomFieldsDeleteOutput = z.infer<
	typeof CustomFieldsDeleteOutputSchema
>;

export const LostReasonsListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type LostReasonsListInput = z.infer<typeof LostReasonsListInputSchema>;
export const LostReasonsListOutputSchema = JsonSchema;
export type LostReasonsListOutput = z.infer<typeof LostReasonsListOutputSchema>;

export const LostReasonsGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type LostReasonsGetInput = z.infer<typeof LostReasonsGetInputSchema>;
export const LostReasonsGetOutputSchema = JsonSchema;
export type LostReasonsGetOutput = z.infer<typeof LostReasonsGetOutputSchema>;

export const LostReasonsCreateInputSchema = z.object({}).loose();
export type LostReasonsCreateInput = z.infer<
	typeof LostReasonsCreateInputSchema
>;
export const LostReasonsCreateOutputSchema = JsonSchema;
export type LostReasonsCreateOutput = z.infer<
	typeof LostReasonsCreateOutputSchema
>;

export const LostReasonsUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type LostReasonsUpdateInput = z.infer<
	typeof LostReasonsUpdateInputSchema
>;
export const LostReasonsUpdateOutputSchema = JsonSchema;
export type LostReasonsUpdateOutput = z.infer<
	typeof LostReasonsUpdateOutputSchema
>;

export const LostReasonsDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type LostReasonsDeleteInput = z.infer<
	typeof LostReasonsDeleteInputSchema
>;
export const LostReasonsDeleteOutputSchema = SuccessSchema;
export type LostReasonsDeleteOutput = z.infer<
	typeof LostReasonsDeleteOutputSchema
>;

export const StagesListInputSchema = z
	.object({
		status: z.string().optional(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type StagesListInput = z.infer<typeof StagesListInputSchema>;
export const StagesListOutputSchema = JsonSchema;
export type StagesListOutput = z.infer<typeof StagesListOutputSchema>;

export const StagesGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type StagesGetInput = z.infer<typeof StagesGetInputSchema>;
export const StagesGetOutputSchema = JsonSchema;
export type StagesGetOutput = z.infer<typeof StagesGetOutputSchema>;

export const StagesCreateInputSchema = z.object({}).loose();
export type StagesCreateInput = z.infer<typeof StagesCreateInputSchema>;
export const StagesCreateOutputSchema = JsonSchema;
export type StagesCreateOutput = z.infer<typeof StagesCreateOutputSchema>;

export const StagesUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type StagesUpdateInput = z.infer<typeof StagesUpdateInputSchema>;
export const StagesUpdateOutputSchema = JsonSchema;
export type StagesUpdateOutput = z.infer<typeof StagesUpdateOutputSchema>;

export const StagesDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type StagesDeleteInput = z.infer<typeof StagesDeleteInputSchema>;
export const StagesDeleteOutputSchema = SuccessSchema;
export type StagesDeleteOutput = z.infer<typeof StagesDeleteOutputSchema>;

export const TracksGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type TracksGetInput = z.infer<typeof TracksGetInputSchema>;
export const TracksGetOutputSchema = JsonSchema;
export type TracksGetOutput = z.infer<typeof TracksGetOutputSchema>;

export const TracksCreateInputSchema = z
	.object({
		embed: z.string().optional(),
	})
	.loose();
export type TracksCreateInput = z.infer<typeof TracksCreateInputSchema>;
export const TracksCreateOutputSchema = JsonSchema;
export type TracksCreateOutput = z.infer<typeof TracksCreateOutputSchema>;

export const TracksUpdateInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type TracksUpdateInput = z.infer<typeof TracksUpdateInputSchema>;
export const TracksUpdateOutputSchema = JsonSchema;
export type TracksUpdateOutput = z.infer<typeof TracksUpdateOutputSchema>;

export const TracksDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type TracksDeleteInput = z.infer<typeof TracksDeleteInputSchema>;
export const TracksDeleteOutputSchema = SuccessSchema;
export type TracksDeleteOutput = z.infer<typeof TracksDeleteOutputSchema>;

export const TracksListForEntityInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type TracksListForEntityInput = z.infer<
	typeof TracksListForEntityInputSchema
>;
export const TracksListForEntityOutputSchema = JsonSchema;
export type TracksListForEntityOutput = z.infer<
	typeof TracksListForEntityOutputSchema
>;

export const TrackDefinitionsListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type TrackDefinitionsListInput = z.infer<
	typeof TrackDefinitionsListInputSchema
>;
export const TrackDefinitionsListOutputSchema = JsonSchema;
export type TrackDefinitionsListOutput = z.infer<
	typeof TrackDefinitionsListOutputSchema
>;

export const TrackDefinitionsGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type TrackDefinitionsGetInput = z.infer<
	typeof TrackDefinitionsGetInputSchema
>;
export const TrackDefinitionsGetOutputSchema = JsonSchema;
export type TrackDefinitionsGetOutput = z.infer<
	typeof TrackDefinitionsGetOutputSchema
>;

export const TrackDefinitionsCreateInputSchema = z.object({}).loose();
export type TrackDefinitionsCreateInput = z.infer<
	typeof TrackDefinitionsCreateInputSchema
>;
export const TrackDefinitionsCreateOutputSchema = JsonSchema;
export type TrackDefinitionsCreateOutput = z.infer<
	typeof TrackDefinitionsCreateOutputSchema
>;

export const TrackDefinitionsUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type TrackDefinitionsUpdateInput = z.infer<
	typeof TrackDefinitionsUpdateInputSchema
>;
export const TrackDefinitionsUpdateOutputSchema = JsonSchema;
export type TrackDefinitionsUpdateOutput = z.infer<
	typeof TrackDefinitionsUpdateOutputSchema
>;

export const TrackDefinitionsDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type TrackDefinitionsDeleteInput = z.infer<
	typeof TrackDefinitionsDeleteInputSchema
>;
export const TrackDefinitionsDeleteOutputSchema = SuccessSchema;
export type TrackDefinitionsDeleteOutput = z.infer<
	typeof TrackDefinitionsDeleteOutputSchema
>;

export const BoardsListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type BoardsListInput = z.infer<typeof BoardsListInputSchema>;
export const BoardsListOutputSchema = JsonSchema;
export type BoardsListOutput = z.infer<typeof BoardsListOutputSchema>;

export const BoardsGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type BoardsGetInput = z.infer<typeof BoardsGetInputSchema>;
export const BoardsGetOutputSchema = JsonSchema;
export type BoardsGetOutput = z.infer<typeof BoardsGetOutputSchema>;

export const BoardsUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type BoardsUpdateInput = z.infer<typeof BoardsUpdateInputSchema>;
export const BoardsUpdateOutputSchema = JsonSchema;
export type BoardsUpdateOutput = z.infer<typeof BoardsUpdateOutputSchema>;

export const BoardsDeleteInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type BoardsDeleteInput = z.infer<typeof BoardsDeleteInputSchema>;
export const BoardsDeleteOutputSchema = SuccessSchema;
export type BoardsDeleteOutput = z.infer<typeof BoardsDeleteOutputSchema>;

export const BoardsRestoreInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type BoardsRestoreInput = z.infer<typeof BoardsRestoreInputSchema>;
export const BoardsRestoreOutputSchema = SuccessSchema;
export type BoardsRestoreOutput = z.infer<typeof BoardsRestoreOutputSchema>;

export const BoardsListStagesInputSchema = z
	.object({
		id: z.number().int(),
		status: z.string().optional(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type BoardsListStagesInput = z.infer<typeof BoardsListStagesInputSchema>;
export const BoardsListStagesOutputSchema = JsonSchema;
export type BoardsListStagesOutput = z.infer<
	typeof BoardsListStagesOutputSchema
>;

export const PipelinesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type PipelinesListInput = z.infer<typeof PipelinesListInputSchema>;
export const PipelinesListOutputSchema = JsonSchema;
export type PipelinesListOutput = z.infer<typeof PipelinesListOutputSchema>;

export const PipelinesGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type PipelinesGetInput = z.infer<typeof PipelinesGetInputSchema>;
export const PipelinesGetOutputSchema = JsonSchema;
export type PipelinesGetOutput = z.infer<typeof PipelinesGetOutputSchema>;

export const PipelinesUpdateInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type PipelinesUpdateInput = z.infer<typeof PipelinesUpdateInputSchema>;
export const PipelinesUpdateOutputSchema = JsonSchema;
export type PipelinesUpdateOutput = z.infer<typeof PipelinesUpdateOutputSchema>;

export const PipelinesListMilestonesInputSchema = z
	.object({
		id: z.number().int(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type PipelinesListMilestonesInput = z.infer<
	typeof PipelinesListMilestonesInputSchema
>;
export const PipelinesListMilestonesOutputSchema = JsonSchema;
export type PipelinesListMilestonesOutput = z.infer<
	typeof PipelinesListMilestonesOutputSchema
>;

export const UsersListInputSchema = z
	.object({
		embed: z.string().optional(),
	})
	.loose();
export type UsersListInput = z.infer<typeof UsersListInputSchema>;
export const UsersListOutputSchema = JsonSchema;
export type UsersListOutput = z.infer<typeof UsersListOutputSchema>;

export const UsersGetCurrentInputSchema = z
	.object({
		embed: z.string().optional(),
	})
	.loose();
export type UsersGetCurrentInput = z.infer<typeof UsersGetCurrentInputSchema>;
export const UsersGetCurrentOutputSchema = JsonSchema;
export type UsersGetCurrentOutput = z.infer<typeof UsersGetCurrentOutputSchema>;

export const UsersGetInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;
export const UsersGetOutputSchema = JsonSchema;
export type UsersGetOutput = z.infer<typeof UsersGetOutputSchema>;

export const UsersUpdateInputSchema = z
	.object({
		id: z.number().int(),
		embed: z.string().optional(),
	})
	.loose();
export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;
export const UsersUpdateOutputSchema = JsonSchema;
export type UsersUpdateOutput = z.infer<typeof UsersUpdateOutputSchema>;

export const TeamsListInputSchema = z
	.object({
		embed: z.string().optional(),
	})
	.loose();
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;
export const TeamsListOutputSchema = JsonSchema;
export type TeamsListOutput = z.infer<typeof TeamsListOutputSchema>;

export const SiteGetInputSchema = z.object({}).loose();
export type SiteGetInput = z.infer<typeof SiteGetInputSchema>;
export const SiteGetOutputSchema = JsonSchema;
export type SiteGetOutput = z.infer<typeof SiteGetOutputSchema>;

export const RestHooksListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type RestHooksListInput = z.infer<typeof RestHooksListInputSchema>;
export const RestHooksListOutputSchema = JsonSchema;
export type RestHooksListOutput = z.infer<typeof RestHooksListOutputSchema>;

export const AttachmentsGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type AttachmentsGetInput = z.infer<typeof AttachmentsGetInputSchema>;
export const AttachmentsGetOutputSchema = AttachmentDownloadSchema;
export type AttachmentsGetOutput = z.infer<typeof AttachmentsGetOutputSchema>;

export const AttachmentsUploadInputSchema = z
	.object({
		filename: z.string().min(1),
		contentType: z.string().min(1),
		contentBase64: z.string().min(1),
	})
	.loose();
export type AttachmentsUploadInput = z.infer<
	typeof AttachmentsUploadInputSchema
>;
export const AttachmentsUploadOutputSchema = AttachmentUploadSchema;
export type AttachmentsUploadOutput = z.infer<
	typeof AttachmentsUploadOutputSchema
>;

export const ActivityTypesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type ActivityTypesListInput = z.infer<
	typeof ActivityTypesListInputSchema
>;
export const ActivityTypesListOutputSchema = JsonSchema;
export type ActivityTypesListOutput = z.infer<
	typeof ActivityTypesListOutputSchema
>;

export const ActivityTypesGetInputSchema = z
	.object({
		id: z.number().int(),
	})
	.loose();
export type ActivityTypesGetInput = z.infer<typeof ActivityTypesGetInputSchema>;
export const ActivityTypesGetOutputSchema = JsonSchema;
export type ActivityTypesGetOutput = z.infer<
	typeof ActivityTypesGetOutputSchema
>;

export const ActivityTypesListIconsInputSchema = z.object({}).loose();
export type ActivityTypesListIconsInput = z.infer<
	typeof ActivityTypesListIconsInputSchema
>;
export const ActivityTypesListIconsOutputSchema = JsonSchema;
export type ActivityTypesListIconsOutput = z.infer<
	typeof ActivityTypesListIconsOutputSchema
>;

export const CountriesListInputSchema = z.object({}).loose();
export type CountriesListInput = z.infer<typeof CountriesListInputSchema>;
export const CountriesListOutputSchema = JsonSchema;
export type CountriesListOutput = z.infer<typeof CountriesListOutputSchema>;

export const CurrenciesListInputSchema = z.object({}).loose();
export type CurrenciesListInput = z.infer<typeof CurrenciesListInputSchema>;
export const CurrenciesListOutputSchema = JsonSchema;
export type CurrenciesListOutput = z.infer<typeof CurrenciesListOutputSchema>;

export const GoalsListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type GoalsListInput = z.infer<typeof GoalsListInputSchema>;
export const GoalsListOutputSchema = JsonSchema;
export type GoalsListOutput = z.infer<typeof GoalsListOutputSchema>;

export const TagsListInputSchema = z
	.object({
		entity: EntitySchema,
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
	})
	.loose();
export type TagsListInput = z.infer<typeof TagsListInputSchema>;
export const TagsListOutputSchema = JsonSchema;
export type TagsListOutput = z.infer<typeof TagsListOutputSchema>;

export const TagsGetInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
	})
	.loose();
export type TagsGetInput = z.infer<typeof TagsGetInputSchema>;
export const TagsGetOutputSchema = JsonSchema;
export type TagsGetOutput = z.infer<typeof TagsGetOutputSchema>;

export const TagsUpdateInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
	})
	.loose();
export type TagsUpdateInput = z.infer<typeof TagsUpdateInputSchema>;
export const TagsUpdateOutputSchema = JsonSchema;
export type TagsUpdateOutput = z.infer<typeof TagsUpdateOutputSchema>;

export const TagsDeleteInputSchema = z
	.object({
		entity: EntitySchema,
		id: z.number().int(),
	})
	.loose();
export type TagsDeleteInput = z.infer<typeof TagsDeleteInputSchema>;
export const TagsDeleteOutputSchema = SuccessSchema;
export type TagsDeleteOutput = z.infer<typeof TagsDeleteOutputSchema>;

export const FiltersRunInputSchema = z
	.object({
		entity: EntitySchema,
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		embed: z.string().optional(),
		conditions: z.array(z.object({}).loose()).min(1),
	})
	.loose();
export type FiltersRunInput = z.infer<typeof FiltersRunInputSchema>;
export const FiltersRunOutputSchema = JsonSchema;
export type FiltersRunOutput = z.infer<typeof FiltersRunOutputSchema>;

export const CapsuleCrmEndpointInputSchemas = {
	partiesList: PartiesListInputSchema,
	partiesGet: PartiesGetInputSchema,
	partiesCreate: PartiesCreateInputSchema,
	partiesUpdate: PartiesUpdateInputSchema,
	partiesDelete: PartiesDeleteInputSchema,
	partiesSearch: PartiesSearchInputSchema,
	partiesListDeleted: PartiesListDeletedInputSchema,
	partiesListEmployees: PartiesListEmployeesInputSchema,
	partiesListOpportunities: PartiesListOpportunitiesInputSchema,
	partiesListProjects: PartiesListProjectsInputSchema,
	opportunitiesList: OpportunitiesListInputSchema,
	opportunitiesGet: OpportunitiesGetInputSchema,
	opportunitiesCreate: OpportunitiesCreateInputSchema,
	opportunitiesUpdate: OpportunitiesUpdateInputSchema,
	opportunitiesDelete: OpportunitiesDeleteInputSchema,
	opportunitiesSearch: OpportunitiesSearchInputSchema,
	opportunitiesListDeleted: OpportunitiesListDeletedInputSchema,
	opportunitiesListParties: OpportunitiesListPartiesInputSchema,
	opportunitiesAddParty: OpportunitiesAddPartyInputSchema,
	opportunitiesDeleteParty: OpportunitiesDeletePartyInputSchema,
	opportunitiesListProjects: OpportunitiesListProjectsInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsSearch: ProjectsSearchInputSchema,
	projectsListDeleted: ProjectsListDeletedInputSchema,
	projectsListParties: ProjectsListPartiesInputSchema,
	projectsAddParty: ProjectsAddPartyInputSchema,
	projectsDeleteParty: ProjectsDeletePartyInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	entriesListByDate: EntriesListByDateInputSchema,
	entriesListForEntity: EntriesListForEntityInputSchema,
	entriesGet: EntriesGetInputSchema,
	entriesCreate: EntriesCreateInputSchema,
	entriesUpdate: EntriesUpdateInputSchema,
	entriesDelete: EntriesDeleteInputSchema,
	categoriesList: CategoriesListInputSchema,
	categoriesGet: CategoriesGetInputSchema,
	categoriesCreate: CategoriesCreateInputSchema,
	categoriesUpdate: CategoriesUpdateInputSchema,
	categoriesDelete: CategoriesDeleteInputSchema,
	milestonesList: MilestonesListInputSchema,
	milestonesGet: MilestonesGetInputSchema,
	milestonesCreate: MilestonesCreateInputSchema,
	milestonesUpdate: MilestonesUpdateInputSchema,
	milestonesDelete: MilestonesDeleteInputSchema,
	titlesList: TitlesListInputSchema,
	titlesCreate: TitlesCreateInputSchema,
	titlesDelete: TitlesDeleteInputSchema,
	customFieldsList: CustomFieldsListInputSchema,
	customFieldsGet: CustomFieldsGetInputSchema,
	customFieldsCreate: CustomFieldsCreateInputSchema,
	customFieldsUpdate: CustomFieldsUpdateInputSchema,
	customFieldsDelete: CustomFieldsDeleteInputSchema,
	lostReasonsList: LostReasonsListInputSchema,
	lostReasonsGet: LostReasonsGetInputSchema,
	lostReasonsCreate: LostReasonsCreateInputSchema,
	lostReasonsUpdate: LostReasonsUpdateInputSchema,
	lostReasonsDelete: LostReasonsDeleteInputSchema,
	stagesList: StagesListInputSchema,
	stagesGet: StagesGetInputSchema,
	stagesCreate: StagesCreateInputSchema,
	stagesUpdate: StagesUpdateInputSchema,
	stagesDelete: StagesDeleteInputSchema,
	tracksGet: TracksGetInputSchema,
	tracksCreate: TracksCreateInputSchema,
	tracksUpdate: TracksUpdateInputSchema,
	tracksDelete: TracksDeleteInputSchema,
	tracksListForEntity: TracksListForEntityInputSchema,
	trackDefinitionsList: TrackDefinitionsListInputSchema,
	trackDefinitionsGet: TrackDefinitionsGetInputSchema,
	trackDefinitionsCreate: TrackDefinitionsCreateInputSchema,
	trackDefinitionsUpdate: TrackDefinitionsUpdateInputSchema,
	trackDefinitionsDelete: TrackDefinitionsDeleteInputSchema,
	boardsList: BoardsListInputSchema,
	boardsGet: BoardsGetInputSchema,
	boardsUpdate: BoardsUpdateInputSchema,
	boardsDelete: BoardsDeleteInputSchema,
	boardsRestore: BoardsRestoreInputSchema,
	boardsListStages: BoardsListStagesInputSchema,
	pipelinesList: PipelinesListInputSchema,
	pipelinesGet: PipelinesGetInputSchema,
	pipelinesUpdate: PipelinesUpdateInputSchema,
	pipelinesListMilestones: PipelinesListMilestonesInputSchema,
	usersList: UsersListInputSchema,
	usersGetCurrent: UsersGetCurrentInputSchema,
	usersGet: UsersGetInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	teamsList: TeamsListInputSchema,
	siteGet: SiteGetInputSchema,
	restHooksList: RestHooksListInputSchema,
	attachmentsGet: AttachmentsGetInputSchema,
	attachmentsUpload: AttachmentsUploadInputSchema,
	activityTypesList: ActivityTypesListInputSchema,
	activityTypesGet: ActivityTypesGetInputSchema,
	activityTypesListIcons: ActivityTypesListIconsInputSchema,
	countriesList: CountriesListInputSchema,
	currenciesList: CurrenciesListInputSchema,
	goalsList: GoalsListInputSchema,
	tagsList: TagsListInputSchema,
	tagsGet: TagsGetInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	filtersRun: FiltersRunInputSchema,
} as const;

export const CapsuleCrmEndpointOutputSchemas = {
	partiesList: PartiesListOutputSchema,
	partiesGet: PartiesGetOutputSchema,
	partiesCreate: PartiesCreateOutputSchema,
	partiesUpdate: PartiesUpdateOutputSchema,
	partiesDelete: PartiesDeleteOutputSchema,
	partiesSearch: PartiesSearchOutputSchema,
	partiesListDeleted: PartiesListDeletedOutputSchema,
	partiesListEmployees: PartiesListEmployeesOutputSchema,
	partiesListOpportunities: PartiesListOpportunitiesOutputSchema,
	partiesListProjects: PartiesListProjectsOutputSchema,
	opportunitiesList: OpportunitiesListOutputSchema,
	opportunitiesGet: OpportunitiesGetOutputSchema,
	opportunitiesCreate: OpportunitiesCreateOutputSchema,
	opportunitiesUpdate: OpportunitiesUpdateOutputSchema,
	opportunitiesDelete: OpportunitiesDeleteOutputSchema,
	opportunitiesSearch: OpportunitiesSearchOutputSchema,
	opportunitiesListDeleted: OpportunitiesListDeletedOutputSchema,
	opportunitiesListParties: OpportunitiesListPartiesOutputSchema,
	opportunitiesAddParty: OpportunitiesAddPartyOutputSchema,
	opportunitiesDeleteParty: OpportunitiesDeletePartyOutputSchema,
	opportunitiesListProjects: OpportunitiesListProjectsOutputSchema,
	projectsList: ProjectsListOutputSchema,
	projectsGet: ProjectsGetOutputSchema,
	projectsCreate: ProjectsCreateOutputSchema,
	projectsUpdate: ProjectsUpdateOutputSchema,
	projectsDelete: ProjectsDeleteOutputSchema,
	projectsSearch: ProjectsSearchOutputSchema,
	projectsListDeleted: ProjectsListDeletedOutputSchema,
	projectsListParties: ProjectsListPartiesOutputSchema,
	projectsAddParty: ProjectsAddPartyOutputSchema,
	projectsDeleteParty: ProjectsDeletePartyOutputSchema,
	tasksList: TasksListOutputSchema,
	tasksGet: TasksGetOutputSchema,
	tasksCreate: TasksCreateOutputSchema,
	tasksUpdate: TasksUpdateOutputSchema,
	tasksDelete: TasksDeleteOutputSchema,
	entriesListByDate: EntriesListByDateOutputSchema,
	entriesListForEntity: EntriesListForEntityOutputSchema,
	entriesGet: EntriesGetOutputSchema,
	entriesCreate: EntriesCreateOutputSchema,
	entriesUpdate: EntriesUpdateOutputSchema,
	entriesDelete: EntriesDeleteOutputSchema,
	categoriesList: CategoriesListOutputSchema,
	categoriesGet: CategoriesGetOutputSchema,
	categoriesCreate: CategoriesCreateOutputSchema,
	categoriesUpdate: CategoriesUpdateOutputSchema,
	categoriesDelete: CategoriesDeleteOutputSchema,
	milestonesList: MilestonesListOutputSchema,
	milestonesGet: MilestonesGetOutputSchema,
	milestonesCreate: MilestonesCreateOutputSchema,
	milestonesUpdate: MilestonesUpdateOutputSchema,
	milestonesDelete: MilestonesDeleteOutputSchema,
	titlesList: TitlesListOutputSchema,
	titlesCreate: TitlesCreateOutputSchema,
	titlesDelete: TitlesDeleteOutputSchema,
	customFieldsList: CustomFieldsListOutputSchema,
	customFieldsGet: CustomFieldsGetOutputSchema,
	customFieldsCreate: CustomFieldsCreateOutputSchema,
	customFieldsUpdate: CustomFieldsUpdateOutputSchema,
	customFieldsDelete: CustomFieldsDeleteOutputSchema,
	lostReasonsList: LostReasonsListOutputSchema,
	lostReasonsGet: LostReasonsGetOutputSchema,
	lostReasonsCreate: LostReasonsCreateOutputSchema,
	lostReasonsUpdate: LostReasonsUpdateOutputSchema,
	lostReasonsDelete: LostReasonsDeleteOutputSchema,
	stagesList: StagesListOutputSchema,
	stagesGet: StagesGetOutputSchema,
	stagesCreate: StagesCreateOutputSchema,
	stagesUpdate: StagesUpdateOutputSchema,
	stagesDelete: StagesDeleteOutputSchema,
	tracksGet: TracksGetOutputSchema,
	tracksCreate: TracksCreateOutputSchema,
	tracksUpdate: TracksUpdateOutputSchema,
	tracksDelete: TracksDeleteOutputSchema,
	tracksListForEntity: TracksListForEntityOutputSchema,
	trackDefinitionsList: TrackDefinitionsListOutputSchema,
	trackDefinitionsGet: TrackDefinitionsGetOutputSchema,
	trackDefinitionsCreate: TrackDefinitionsCreateOutputSchema,
	trackDefinitionsUpdate: TrackDefinitionsUpdateOutputSchema,
	trackDefinitionsDelete: TrackDefinitionsDeleteOutputSchema,
	boardsList: BoardsListOutputSchema,
	boardsGet: BoardsGetOutputSchema,
	boardsUpdate: BoardsUpdateOutputSchema,
	boardsDelete: BoardsDeleteOutputSchema,
	boardsRestore: BoardsRestoreOutputSchema,
	boardsListStages: BoardsListStagesOutputSchema,
	pipelinesList: PipelinesListOutputSchema,
	pipelinesGet: PipelinesGetOutputSchema,
	pipelinesUpdate: PipelinesUpdateOutputSchema,
	pipelinesListMilestones: PipelinesListMilestonesOutputSchema,
	usersList: UsersListOutputSchema,
	usersGetCurrent: UsersGetCurrentOutputSchema,
	usersGet: UsersGetOutputSchema,
	usersUpdate: UsersUpdateOutputSchema,
	teamsList: TeamsListOutputSchema,
	siteGet: SiteGetOutputSchema,
	restHooksList: RestHooksListOutputSchema,
	attachmentsGet: AttachmentsGetOutputSchema,
	attachmentsUpload: AttachmentsUploadOutputSchema,
	activityTypesList: ActivityTypesListOutputSchema,
	activityTypesGet: ActivityTypesGetOutputSchema,
	activityTypesListIcons: ActivityTypesListIconsOutputSchema,
	countriesList: CountriesListOutputSchema,
	currenciesList: CurrenciesListOutputSchema,
	goalsList: GoalsListOutputSchema,
	tagsList: TagsListOutputSchema,
	tagsGet: TagsGetOutputSchema,
	tagsUpdate: TagsUpdateOutputSchema,
	tagsDelete: TagsDeleteOutputSchema,
	filtersRun: FiltersRunOutputSchema,
} as const;

export type CapsuleCrmEndpointInputs = {
	partiesList: PartiesListInput;
	partiesGet: PartiesGetInput;
	partiesCreate: PartiesCreateInput;
	partiesUpdate: PartiesUpdateInput;
	partiesDelete: PartiesDeleteInput;
	partiesSearch: PartiesSearchInput;
	partiesListDeleted: PartiesListDeletedInput;
	partiesListEmployees: PartiesListEmployeesInput;
	partiesListOpportunities: PartiesListOpportunitiesInput;
	partiesListProjects: PartiesListProjectsInput;
	opportunitiesList: OpportunitiesListInput;
	opportunitiesGet: OpportunitiesGetInput;
	opportunitiesCreate: OpportunitiesCreateInput;
	opportunitiesUpdate: OpportunitiesUpdateInput;
	opportunitiesDelete: OpportunitiesDeleteInput;
	opportunitiesSearch: OpportunitiesSearchInput;
	opportunitiesListDeleted: OpportunitiesListDeletedInput;
	opportunitiesListParties: OpportunitiesListPartiesInput;
	opportunitiesAddParty: OpportunitiesAddPartyInput;
	opportunitiesDeleteParty: OpportunitiesDeletePartyInput;
	opportunitiesListProjects: OpportunitiesListProjectsInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	projectsSearch: ProjectsSearchInput;
	projectsListDeleted: ProjectsListDeletedInput;
	projectsListParties: ProjectsListPartiesInput;
	projectsAddParty: ProjectsAddPartyInput;
	projectsDeleteParty: ProjectsDeletePartyInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	entriesListByDate: EntriesListByDateInput;
	entriesListForEntity: EntriesListForEntityInput;
	entriesGet: EntriesGetInput;
	entriesCreate: EntriesCreateInput;
	entriesUpdate: EntriesUpdateInput;
	entriesDelete: EntriesDeleteInput;
	categoriesList: CategoriesListInput;
	categoriesGet: CategoriesGetInput;
	categoriesCreate: CategoriesCreateInput;
	categoriesUpdate: CategoriesUpdateInput;
	categoriesDelete: CategoriesDeleteInput;
	milestonesList: MilestonesListInput;
	milestonesGet: MilestonesGetInput;
	milestonesCreate: MilestonesCreateInput;
	milestonesUpdate: MilestonesUpdateInput;
	milestonesDelete: MilestonesDeleteInput;
	titlesList: TitlesListInput;
	titlesCreate: TitlesCreateInput;
	titlesDelete: TitlesDeleteInput;
	customFieldsList: CustomFieldsListInput;
	customFieldsGet: CustomFieldsGetInput;
	customFieldsCreate: CustomFieldsCreateInput;
	customFieldsUpdate: CustomFieldsUpdateInput;
	customFieldsDelete: CustomFieldsDeleteInput;
	lostReasonsList: LostReasonsListInput;
	lostReasonsGet: LostReasonsGetInput;
	lostReasonsCreate: LostReasonsCreateInput;
	lostReasonsUpdate: LostReasonsUpdateInput;
	lostReasonsDelete: LostReasonsDeleteInput;
	stagesList: StagesListInput;
	stagesGet: StagesGetInput;
	stagesCreate: StagesCreateInput;
	stagesUpdate: StagesUpdateInput;
	stagesDelete: StagesDeleteInput;
	tracksGet: TracksGetInput;
	tracksCreate: TracksCreateInput;
	tracksUpdate: TracksUpdateInput;
	tracksDelete: TracksDeleteInput;
	tracksListForEntity: TracksListForEntityInput;
	trackDefinitionsList: TrackDefinitionsListInput;
	trackDefinitionsGet: TrackDefinitionsGetInput;
	trackDefinitionsCreate: TrackDefinitionsCreateInput;
	trackDefinitionsUpdate: TrackDefinitionsUpdateInput;
	trackDefinitionsDelete: TrackDefinitionsDeleteInput;
	boardsList: BoardsListInput;
	boardsGet: BoardsGetInput;
	boardsUpdate: BoardsUpdateInput;
	boardsDelete: BoardsDeleteInput;
	boardsRestore: BoardsRestoreInput;
	boardsListStages: BoardsListStagesInput;
	pipelinesList: PipelinesListInput;
	pipelinesGet: PipelinesGetInput;
	pipelinesUpdate: PipelinesUpdateInput;
	pipelinesListMilestones: PipelinesListMilestonesInput;
	usersList: UsersListInput;
	usersGetCurrent: UsersGetCurrentInput;
	usersGet: UsersGetInput;
	usersUpdate: UsersUpdateInput;
	teamsList: TeamsListInput;
	siteGet: SiteGetInput;
	restHooksList: RestHooksListInput;
	attachmentsGet: AttachmentsGetInput;
	attachmentsUpload: AttachmentsUploadInput;
	activityTypesList: ActivityTypesListInput;
	activityTypesGet: ActivityTypesGetInput;
	activityTypesListIcons: ActivityTypesListIconsInput;
	countriesList: CountriesListInput;
	currenciesList: CurrenciesListInput;
	goalsList: GoalsListInput;
	tagsList: TagsListInput;
	tagsGet: TagsGetInput;
	tagsUpdate: TagsUpdateInput;
	tagsDelete: TagsDeleteInput;
	filtersRun: FiltersRunInput;
};

export type CapsuleCrmEndpointOutputs = {
	partiesList: PartiesListOutput;
	partiesGet: PartiesGetOutput;
	partiesCreate: PartiesCreateOutput;
	partiesUpdate: PartiesUpdateOutput;
	partiesDelete: PartiesDeleteOutput;
	partiesSearch: PartiesSearchOutput;
	partiesListDeleted: PartiesListDeletedOutput;
	partiesListEmployees: PartiesListEmployeesOutput;
	partiesListOpportunities: PartiesListOpportunitiesOutput;
	partiesListProjects: PartiesListProjectsOutput;
	opportunitiesList: OpportunitiesListOutput;
	opportunitiesGet: OpportunitiesGetOutput;
	opportunitiesCreate: OpportunitiesCreateOutput;
	opportunitiesUpdate: OpportunitiesUpdateOutput;
	opportunitiesDelete: OpportunitiesDeleteOutput;
	opportunitiesSearch: OpportunitiesSearchOutput;
	opportunitiesListDeleted: OpportunitiesListDeletedOutput;
	opportunitiesListParties: OpportunitiesListPartiesOutput;
	opportunitiesAddParty: OpportunitiesAddPartyOutput;
	opportunitiesDeleteParty: OpportunitiesDeletePartyOutput;
	opportunitiesListProjects: OpportunitiesListProjectsOutput;
	projectsList: ProjectsListOutput;
	projectsGet: ProjectsGetOutput;
	projectsCreate: ProjectsCreateOutput;
	projectsUpdate: ProjectsUpdateOutput;
	projectsDelete: ProjectsDeleteOutput;
	projectsSearch: ProjectsSearchOutput;
	projectsListDeleted: ProjectsListDeletedOutput;
	projectsListParties: ProjectsListPartiesOutput;
	projectsAddParty: ProjectsAddPartyOutput;
	projectsDeleteParty: ProjectsDeletePartyOutput;
	tasksList: TasksListOutput;
	tasksGet: TasksGetOutput;
	tasksCreate: TasksCreateOutput;
	tasksUpdate: TasksUpdateOutput;
	tasksDelete: TasksDeleteOutput;
	entriesListByDate: EntriesListByDateOutput;
	entriesListForEntity: EntriesListForEntityOutput;
	entriesGet: EntriesGetOutput;
	entriesCreate: EntriesCreateOutput;
	entriesUpdate: EntriesUpdateOutput;
	entriesDelete: EntriesDeleteOutput;
	categoriesList: CategoriesListOutput;
	categoriesGet: CategoriesGetOutput;
	categoriesCreate: CategoriesCreateOutput;
	categoriesUpdate: CategoriesUpdateOutput;
	categoriesDelete: CategoriesDeleteOutput;
	milestonesList: MilestonesListOutput;
	milestonesGet: MilestonesGetOutput;
	milestonesCreate: MilestonesCreateOutput;
	milestonesUpdate: MilestonesUpdateOutput;
	milestonesDelete: MilestonesDeleteOutput;
	titlesList: TitlesListOutput;
	titlesCreate: TitlesCreateOutput;
	titlesDelete: TitlesDeleteOutput;
	customFieldsList: CustomFieldsListOutput;
	customFieldsGet: CustomFieldsGetOutput;
	customFieldsCreate: CustomFieldsCreateOutput;
	customFieldsUpdate: CustomFieldsUpdateOutput;
	customFieldsDelete: CustomFieldsDeleteOutput;
	lostReasonsList: LostReasonsListOutput;
	lostReasonsGet: LostReasonsGetOutput;
	lostReasonsCreate: LostReasonsCreateOutput;
	lostReasonsUpdate: LostReasonsUpdateOutput;
	lostReasonsDelete: LostReasonsDeleteOutput;
	stagesList: StagesListOutput;
	stagesGet: StagesGetOutput;
	stagesCreate: StagesCreateOutput;
	stagesUpdate: StagesUpdateOutput;
	stagesDelete: StagesDeleteOutput;
	tracksGet: TracksGetOutput;
	tracksCreate: TracksCreateOutput;
	tracksUpdate: TracksUpdateOutput;
	tracksDelete: TracksDeleteOutput;
	tracksListForEntity: TracksListForEntityOutput;
	trackDefinitionsList: TrackDefinitionsListOutput;
	trackDefinitionsGet: TrackDefinitionsGetOutput;
	trackDefinitionsCreate: TrackDefinitionsCreateOutput;
	trackDefinitionsUpdate: TrackDefinitionsUpdateOutput;
	trackDefinitionsDelete: TrackDefinitionsDeleteOutput;
	boardsList: BoardsListOutput;
	boardsGet: BoardsGetOutput;
	boardsUpdate: BoardsUpdateOutput;
	boardsDelete: BoardsDeleteOutput;
	boardsRestore: BoardsRestoreOutput;
	boardsListStages: BoardsListStagesOutput;
	pipelinesList: PipelinesListOutput;
	pipelinesGet: PipelinesGetOutput;
	pipelinesUpdate: PipelinesUpdateOutput;
	pipelinesListMilestones: PipelinesListMilestonesOutput;
	usersList: UsersListOutput;
	usersGetCurrent: UsersGetCurrentOutput;
	usersGet: UsersGetOutput;
	usersUpdate: UsersUpdateOutput;
	teamsList: TeamsListOutput;
	siteGet: SiteGetOutput;
	restHooksList: RestHooksListOutput;
	attachmentsGet: AttachmentsGetOutput;
	attachmentsUpload: AttachmentsUploadOutput;
	activityTypesList: ActivityTypesListOutput;
	activityTypesGet: ActivityTypesGetOutput;
	activityTypesListIcons: ActivityTypesListIconsOutput;
	countriesList: CountriesListOutput;
	currenciesList: CurrenciesListOutput;
	goalsList: GoalsListOutput;
	tagsList: TagsListOutput;
	tagsGet: TagsGetOutput;
	tagsUpdate: TagsUpdateOutput;
	tagsDelete: TagsDeleteOutput;
	filtersRun: FiltersRunOutput;
};
