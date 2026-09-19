import { z } from 'zod';

const DocsumoEnvelopeSchema = z
	.object({
		status: z.string().optional(),
		status_code: z.number().optional(),
		message: z.string().optional(),
		error: z.string().optional(),
		error_code: z.string().optional(),
	})
	.loose();

export const TablesAddRowInputSchema = z.object({
	ddid: z.string().min(1),
});
export type TablesAddRowInput = z.infer<typeof TablesAddRowInputSchema>;

export const TablesAddRowOutputSchema = DocsumoEnvelopeSchema.extend({
	data: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type TablesAddRowOutput = z.infer<typeof TablesAddRowOutputSchema>;

export const TablesDeleteInputSchema = z.object({
	dd_ids: z.array(z.string().min(1)).min(1),
});
export type TablesDeleteInput = z.infer<typeof TablesDeleteInputSchema>;

export const TablesDeleteOutputSchema = DocsumoEnvelopeSchema;
export type TablesDeleteOutput = z.infer<typeof TablesDeleteOutputSchema>;

export const TablesGetDataInputSchema = z.object({
	ddid: z.string().min(1),
});
export type TablesGetDataInput = z.infer<typeof TablesGetDataInputSchema>;

export const TablesGetDataOutputSchema = DocsumoEnvelopeSchema.extend({
	data: z
		.object({
			data: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.loose()
		.optional(),
});
export type TablesGetDataOutput = z.infer<typeof TablesGetDataOutputSchema>;

export const FoldersCreateInputSchema = z.object({
	folder_name: z.string().min(1),
	type: z.string().min(1),
});
export type FoldersCreateInput = z.infer<typeof FoldersCreateInputSchema>;

export const FoldersCreateOutputSchema = DocsumoEnvelopeSchema.extend({
	data: z.record(z.string(), z.unknown()).optional(),
});
export type FoldersCreateOutput = z.infer<typeof FoldersCreateOutputSchema>;

export const DocumentTypesGetEnabledInputSchema = z.object({});
export type DocumentTypesGetEnabledInput = z.infer<
	typeof DocumentTypesGetEnabledInputSchema
>;

export const DocumentTypesGetEnabledOutputSchema = DocsumoEnvelopeSchema.extend(
	{
		data: z.record(z.string(), z.unknown()).optional(),
	},
);
export type DocumentTypesGetEnabledOutput = z.infer<
	typeof DocumentTypesGetEnabledOutputSchema
>;

export const DocumentTypesListEnabledInputSchema = z.object({});
export type DocumentTypesListEnabledInput = z.infer<
	typeof DocumentTypesListEnabledInputSchema
>;

export const DocumentTypesListEnabledOutputSchema =
	DocsumoEnvelopeSchema.extend({
		data: z
			.object({
				document: z
					.array(
						z
							.object({
								title: z.string().optional(),
								doc_type: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose()
			.optional(),
	});
export type DocumentTypesListEnabledOutput = z.infer<
	typeof DocumentTypesListEnabledOutputSchema
>;

export const DocumentsListAllInputSchema = z.object({
	view: z.enum(['files', 'folder', 'all_files']).optional(),
	folder_id: z.string().optional(),
	limit: z.number().int().min(0).max(20).optional(),
	offset: z.number().int().min(0).optional(),
	doc_type: z.string().optional(),
	status: z.enum(['reviewing', 'processed', 'erred']).optional(),
	q: z.string().optional(),
	sort_by: z.enum(['created_date.asc', 'created_date.desc']).optional(),
	created_date: z.string().optional(),
});
export type DocumentsListAllInput = z.infer<typeof DocumentsListAllInputSchema>;

export const DocumentsListAllOutputSchema = DocsumoEnvelopeSchema.extend({
	data: z
		.object({
			documents: z.array(z.record(z.string(), z.unknown())).optional(),
			limit: z.number().optional(),
			offset: z.number().optional(),
			total: z.number().optional(),
		})
		.loose()
		.optional(),
});
export type DocumentsListAllOutput = z.infer<
	typeof DocumentsListAllOutputSchema
>;

export const UserGetDocumentTypesInputSchema = z.object({});
export type UserGetDocumentTypesInput = z.infer<
	typeof UserGetDocumentTypesInputSchema
>;

export const UserGetDocumentTypesOutputSchema = DocsumoEnvelopeSchema.extend({
	data: z
		.object({
			document_types: z
				.array(
					z
						.object({
							title: z.string().optional(),
							value: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
			email: z.string().optional(),
			full_name: z.string().optional(),
			monthly_doc_current: z.number().optional(),
			monthly_doc_limit: z.number().optional(),
			user_id: z.string().optional(),
		})
		.loose()
		.optional(),
});
export type UserGetDocumentTypesOutput = z.infer<
	typeof UserGetDocumentTypesOutputSchema
>;

export const AgentsListExternalInputSchema = z.object({
	type: z.enum(['all', 'doctype', 'casetype']).optional(),
});
export type AgentsListExternalInput = z.infer<
	typeof AgentsListExternalInputSchema
>;

export const AgentsListExternalOutputSchema = DocsumoEnvelopeSchema.extend({
	data: z
		.object({
			agents: z.array(z.record(z.string(), z.unknown())).optional(),
			disabled_agents: z.array(z.unknown()).optional(),
		})
		.loose()
		.optional(),
});
export type AgentsListExternalOutput = z.infer<
	typeof AgentsListExternalOutputSchema
>;

export const AgentsListCasesInputSchema = z.object({
	casetype_id: z.string().min(1),
	limit: z.number().int().min(0).max(100).optional(),
	offset: z.number().int().min(0).optional(),
	sort_by: z
		.enum([
			'created_date.asc',
			'created_date.desc',
			'modified_date.asc',
			'modified_date.desc',
		])
		.optional(),
	stage_id: z.array(z.string()).optional(),
	assigned_to: z.array(z.string()).optional(),
	workflow_state: z.array(z.string()).optional(),
	created_date_from: z.string().optional(),
	created_date_to: z.string().optional(),
	modified_date_from: z.string().optional(),
	modified_date_to: z.string().optional(),
});
export type AgentsListCasesInput = z.infer<typeof AgentsListCasesInputSchema>;

export const AgentsListCasesOutputSchema = DocsumoEnvelopeSchema.extend({
	data: z
		.object({
			cases: z.array(z.record(z.string(), z.unknown())).optional(),
			pagination: z
				.object({
					limit: z.number().optional(),
					offset: z.number().optional(),
					total: z.number().optional(),
				})
				.loose()
				.optional(),
		})
		.loose()
		.optional(),
});
export type AgentsListCasesOutput = z.infer<typeof AgentsListCasesOutputSchema>;

export const AnalyticsMcaAnalysisInputSchema = z.object({
	doc_ids: z.array(z.string().min(1)).min(1),
	mca_list_db_table: z.string().optional(),
	non_mca_list_db_table: z.string().optional(),
	allow_partial: z.boolean().optional(),
	webhook: z.boolean().optional(),
});
export type AnalyticsMcaAnalysisInput = z.infer<
	typeof AnalyticsMcaAnalysisInputSchema
>;

export const AnalyticsMcaAnalysisOutputSchema = z
	.object({
		account_summaries: z
			.array(z.array(z.record(z.string(), z.unknown())))
			.optional(),
		status: z.string().optional(),
		status_code: z.number().optional(),
		message: z.string().optional(),
	})
	.loose();
export type AnalyticsMcaAnalysisOutput = z.infer<
	typeof AnalyticsMcaAnalysisOutputSchema
>;

export type DocsumoEndpointInputs = {
	tablesAddRow: TablesAddRowInput;
	tablesDelete: TablesDeleteInput;
	tablesGetData: TablesGetDataInput;
	foldersCreate: FoldersCreateInput;
	documentTypesGetEnabled: DocumentTypesGetEnabledInput;
	documentTypesListEnabled: DocumentTypesListEnabledInput;
	documentsListAll: DocumentsListAllInput;
	userGetDocumentTypes: UserGetDocumentTypesInput;
	agentsListExternal: AgentsListExternalInput;
	agentsListCases: AgentsListCasesInput;
	analyticsMcaAnalysis: AnalyticsMcaAnalysisInput;
};

export type DocsumoEndpointOutputs = {
	tablesAddRow: TablesAddRowOutput;
	tablesDelete: TablesDeleteOutput;
	tablesGetData: TablesGetDataOutput;
	foldersCreate: FoldersCreateOutput;
	documentTypesGetEnabled: DocumentTypesGetEnabledOutput;
	documentTypesListEnabled: DocumentTypesListEnabledOutput;
	documentsListAll: DocumentsListAllOutput;
	userGetDocumentTypes: UserGetDocumentTypesOutput;
	agentsListExternal: AgentsListExternalOutput;
	agentsListCases: AgentsListCasesOutput;
	analyticsMcaAnalysis: AnalyticsMcaAnalysisOutput;
};

export const DocsumoEndpointInputSchemas = {
	tablesAddRow: TablesAddRowInputSchema,
	tablesDelete: TablesDeleteInputSchema,
	tablesGetData: TablesGetDataInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	documentTypesGetEnabled: DocumentTypesGetEnabledInputSchema,
	documentTypesListEnabled: DocumentTypesListEnabledInputSchema,
	documentsListAll: DocumentsListAllInputSchema,
	userGetDocumentTypes: UserGetDocumentTypesInputSchema,
	agentsListExternal: AgentsListExternalInputSchema,
	agentsListCases: AgentsListCasesInputSchema,
	analyticsMcaAnalysis: AnalyticsMcaAnalysisInputSchema,
} as const;

export const DocsumoEndpointOutputSchemas = {
	tablesAddRow: TablesAddRowOutputSchema,
	tablesDelete: TablesDeleteOutputSchema,
	tablesGetData: TablesGetDataOutputSchema,
	foldersCreate: FoldersCreateOutputSchema,
	documentTypesGetEnabled: DocumentTypesGetEnabledOutputSchema,
	documentTypesListEnabled: DocumentTypesListEnabledOutputSchema,
	documentsListAll: DocumentsListAllOutputSchema,
	userGetDocumentTypes: UserGetDocumentTypesOutputSchema,
	agentsListExternal: AgentsListExternalOutputSchema,
	agentsListCases: AgentsListCasesOutputSchema,
	analyticsMcaAnalysis: AnalyticsMcaAnalysisOutputSchema,
} as const;
