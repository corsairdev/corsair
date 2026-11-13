import { z } from 'zod';

// Access levels supported across Grist orgs, workspaces, and docs
export const AccessSchema = z.enum(['owners', 'editors', 'viewers']);
export type Access = z.infer<typeof AccessSchema>;

// Grist user representation
export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	picture: z.string().nullable().optional(),
});
export type User = z.infer<typeof UserSchema>;

// Grist organization representation
export const OrgSchema = z.object({
	id: z.number(),
	name: z.string(),
	domain: z.string().nullable().optional(),
	owner: UserSchema.nullable().optional(),
	access: AccessSchema.optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});
export type Org = z.infer<typeof OrgSchema>;

// Grist workspace representation
export const WorkspaceSchema = z.object({
	id: z.number(),
	name: z.string(),
	access: AccessSchema.optional(),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

// Grist document representation
export const DocSchema = z.object({
	id: z.string(),
	name: z.string(),
	access: AccessSchema.optional(),
	isPinned: z.boolean().optional(),
	urlId: z.string().nullable().optional(),
});
export type Doc = z.infer<typeof DocSchema>;

// Workspace with documents list
export const WorkspaceWithDocsSchema = WorkspaceSchema.extend({
	docs: z.array(DocSchema).optional(),
});
export type WorkspaceWithDocs = z.infer<typeof WorkspaceWithDocsSchema>;

// ==========================================
// Orgs
// ==========================================

export const OrgsListInputSchema = z.object({}).strict();
export type OrgsListInput = z.infer<typeof OrgsListInputSchema>;
export const OrgsListOutputSchema = z.array(OrgSchema);
export type OrgsListResponse = z.infer<typeof OrgsListOutputSchema>;

export const OrgsGetInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
	})
	.strict();
export type OrgsGetInput = z.infer<typeof OrgsGetInputSchema>;
export const OrgsGetOutputSchema = OrgSchema;
export type OrgsGetResponse = z.infer<typeof OrgsGetOutputSchema>;

export const OrgsUpdateInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
		name: z.string().optional(),
	})
	.strict();
export type OrgsUpdateInput = z.infer<typeof OrgsUpdateInputSchema>;
// unknown because the provider returns an empty body or arbitrary status JSON
export const OrgsUpdateOutputSchema = z.unknown().optional();
export type OrgsUpdateResponse = z.infer<typeof OrgsUpdateOutputSchema>;

export const OrgsDeleteInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
		name: z.string(),
	})
	.strict();
export type OrgsDeleteInput = z.infer<typeof OrgsDeleteInputSchema>;
// unknown because the provider returns an empty response body on successful deletion
export const OrgsDeleteOutputSchema = z.unknown().optional();
export type OrgsDeleteResponse = z.infer<typeof OrgsDeleteOutputSchema>;

export const OrgsListAccessInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
	})
	.strict();
export type OrgsListAccessInput = z.infer<typeof OrgsListAccessInputSchema>;
export const OrgsListAccessOutputSchema = z.object({
	users: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			email: z.string().optional(),
			access: AccessSchema.optional(),
		}),
	),
});
export type OrgsListAccessResponse = z.infer<typeof OrgsListAccessOutputSchema>;

export const OrgsModifyAccessInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
		users: z.record(
			z.string(),
			z.union([z.enum(['owners', 'editors', 'viewers', 'members']), z.null()]),
		),
	})
	.strict();
export type OrgsModifyAccessInput = z.infer<typeof OrgsModifyAccessInputSchema>;
// unknown because the provider returns empty content on success
export const OrgsModifyAccessOutputSchema = z.unknown().optional();
export type OrgsModifyAccessResponse = z.infer<
	typeof OrgsModifyAccessOutputSchema
>;

export const OrgsGetUsageInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
	})
	.strict();
export type OrgsGetUsageInput = z.infer<typeof OrgsGetUsageInputSchema>;
// unknown because organization usage metrics vary across subscription tiers
export const OrgsGetUsageOutputSchema = z.record(z.string(), z.unknown());
export type OrgsGetUsageResponse = z.infer<typeof OrgsGetUsageOutputSchema>;

// ==========================================
// Workspaces
// ==========================================

export const WorkspacesListInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
	})
	.strict();
export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;
export const WorkspacesListOutputSchema = z.array(WorkspaceWithDocsSchema);
export type WorkspacesListResponse = z.infer<typeof WorkspacesListOutputSchema>;

export const WorkspacesCreateInputSchema = z
	.object({
		orgId: z.union([z.string(), z.number()]),
		name: z.string(),
	})
	.strict();
export type WorkspacesCreateInput = z.infer<typeof WorkspacesCreateInputSchema>;
export const WorkspacesCreateOutputSchema = z.number();
export type WorkspacesCreateResponse = z.infer<
	typeof WorkspacesCreateOutputSchema
>;

export const WorkspacesGetInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
	})
	.strict();
export type WorkspacesGetInput = z.infer<typeof WorkspacesGetInputSchema>;
export const WorkspacesGetOutputSchema = WorkspaceWithDocsSchema;
export type WorkspacesGetResponse = z.infer<typeof WorkspacesGetOutputSchema>;

export const WorkspacesUpdateInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
		name: z.string(),
	})
	.strict();
export type WorkspacesUpdateInput = z.infer<typeof WorkspacesUpdateInputSchema>;
// unknown because the provider returns empty content on 200
export const WorkspacesUpdateOutputSchema = z.unknown().optional();
export type WorkspacesUpdateResponse = z.infer<
	typeof WorkspacesUpdateOutputSchema
>;

export const WorkspacesDeleteInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
	})
	.strict();
export type WorkspacesDeleteInput = z.infer<typeof WorkspacesDeleteInputSchema>;
// unknown because the provider returns empty content on 200
export const WorkspacesDeleteOutputSchema = z.unknown().optional();
export type WorkspacesDeleteResponse = z.infer<
	typeof WorkspacesDeleteOutputSchema
>;

export const WorkspacesRemoveInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
	})
	.strict();
export type WorkspacesRemoveInput = z.infer<typeof WorkspacesRemoveInputSchema>;
// unknown because the provider returns empty content on 200
export const WorkspacesRemoveOutputSchema = z.unknown().optional();
export type WorkspacesRemoveResponse = z.infer<
	typeof WorkspacesRemoveOutputSchema
>;

export const WorkspacesUnremoveInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
	})
	.strict();
export type WorkspacesUnremoveInput = z.infer<
	typeof WorkspacesUnremoveInputSchema
>;
// unknown because the provider returns empty content on 200
export const WorkspacesUnremoveOutputSchema = z.unknown().optional();
export type WorkspacesUnremoveResponse = z.infer<
	typeof WorkspacesUnremoveOutputSchema
>;

export const WorkspacesListAccessInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
	})
	.strict();
export type WorkspacesListAccessInput = z.infer<
	typeof WorkspacesListAccessInputSchema
>;
export const WorkspacesListAccessOutputSchema = z.object({
	maxInheritedRole: AccessSchema.optional(),
	users: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			email: z.string().optional(),
			access: AccessSchema.optional(),
			parentAccess: AccessSchema.optional(),
		}),
	),
});
export type WorkspacesListAccessResponse = z.infer<
	typeof WorkspacesListAccessOutputSchema
>;

export const WorkspacesModifyAccessInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
		maxInheritedRole: AccessSchema.optional(),
		users: z.record(
			z.string(),
			z.union([z.enum(['owners', 'editors', 'viewers', 'members']), z.null()]),
		),
	})
	.strict();
export type WorkspacesModifyAccessInput = z.infer<
	typeof WorkspacesModifyAccessInputSchema
>;
// unknown because the provider returns empty content on 200
export const WorkspacesModifyAccessOutputSchema = z.unknown().optional();
export type WorkspacesModifyAccessResponse = z.infer<
	typeof WorkspacesModifyAccessOutputSchema
>;

// ==========================================
// Docs
// ==========================================

export const DocsCreateInputSchema = z
	.object({
		workspaceId: z.number().optional(),
		documentName: z.string().optional(),
		sourceDocumentId: z.string().optional(),
		asTemplate: z.boolean().optional(),
		timezone: z.string().optional(),
	})
	.strict();
export type DocsCreateInput = z.infer<typeof DocsCreateInputSchema>;
export const DocsCreateOutputSchema = z.string();
export type DocsCreateResponse = z.infer<typeof DocsCreateOutputSchema>;

export const DocsCreateInWorkspaceInputSchema = z
	.object({
		workspaceId: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		isPinned: z.boolean().optional(),
	})
	.strict();
export type DocsCreateInWorkspaceInput = z.infer<
	typeof DocsCreateInWorkspaceInputSchema
>;
export const DocsCreateInWorkspaceOutputSchema = z.string();
export type DocsCreateInWorkspaceResponse = z.infer<
	typeof DocsCreateInWorkspaceOutputSchema
>;

export const DocsGetInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsGetInput = z.infer<typeof DocsGetInputSchema>;
export const DocsGetOutputSchema = DocSchema.extend({
	workspace: WorkspaceSchema.optional(),
});
export type DocsGetResponse = z.infer<typeof DocsGetOutputSchema>;

export const DocsUpdateInputSchema = z
	.object({
		docId: z.string().min(1),
		name: z.string().optional(),
		isPinned: z.boolean().optional(),
	})
	.strict();
export type DocsUpdateInput = z.infer<typeof DocsUpdateInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsUpdateOutputSchema = z.unknown().optional();
export type DocsUpdateResponse = z.infer<typeof DocsUpdateOutputSchema>;

export const DocsDeleteInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsDeleteInput = z.infer<typeof DocsDeleteInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsDeleteOutputSchema = z.unknown().optional();
export type DocsDeleteResponse = z.infer<typeof DocsDeleteOutputSchema>;

export const DocsRemoveInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsRemoveInput = z.infer<typeof DocsRemoveInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsRemoveOutputSchema = z.unknown().optional();
export type DocsRemoveResponse = z.infer<typeof DocsRemoveOutputSchema>;

export const DocsUnremoveInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsUnremoveInput = z.infer<typeof DocsUnremoveInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsUnremoveOutputSchema = z.unknown().optional();
export type DocsUnremoveResponse = z.infer<typeof DocsUnremoveOutputSchema>;

export const DocsMoveInputSchema = z
	.object({
		docId: z.string().min(1),
		workspace: z.number(),
	})
	.strict();
export type DocsMoveInput = z.infer<typeof DocsMoveInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsMoveOutputSchema = z.unknown().optional();
export type DocsMoveResponse = z.infer<typeof DocsMoveOutputSchema>;

export const DocsPinInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsPinInput = z.infer<typeof DocsPinInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsPinOutputSchema = z.unknown().optional();
export type DocsPinResponse = z.infer<typeof DocsPinOutputSchema>;

export const DocsUnpinInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsUnpinInput = z.infer<typeof DocsUnpinInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsUnpinOutputSchema = z.unknown().optional();
export type DocsUnpinResponse = z.infer<typeof DocsUnpinOutputSchema>;

export const DocsCopyInputSchema = z
	.object({
		docId: z.string().min(1),
		workspaceId: z.number().optional(),
		documentName: z.string().optional(),
		asTemplate: z.boolean().optional(),
	})
	.strict();
export type DocsCopyInput = z.infer<typeof DocsCopyInputSchema>;
export const DocsCopyOutputSchema = z.string();
export type DocsCopyResponse = z.infer<typeof DocsCopyOutputSchema>;

export const DocsForkInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsForkInput = z.infer<typeof DocsForkInputSchema>;
export const DocsForkOutputSchema = z.string();
export type DocsForkResponse = z.infer<typeof DocsForkOutputSchema>;

export const DocsListAccessInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type DocsListAccessInput = z.infer<typeof DocsListAccessInputSchema>;
export const DocsListAccessOutputSchema = z.object({
	maxInheritedRole: AccessSchema.optional(),
	users: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			email: z.string().optional(),
			access: AccessSchema.optional(),
			parentAccess: AccessSchema.optional(),
		}),
	),
});
export type DocsListAccessResponse = z.infer<typeof DocsListAccessOutputSchema>;

export const DocsModifyAccessInputSchema = z
	.object({
		docId: z.string().min(1),
		maxInheritedRole: AccessSchema.optional(),
		users: z.record(
			z.string(),
			z.union([z.enum(['owners', 'editors', 'viewers', 'members']), z.null()]),
		),
	})
	.strict();
export type DocsModifyAccessInput = z.infer<typeof DocsModifyAccessInputSchema>;
// unknown because the provider returns empty content on 200
export const DocsModifyAccessOutputSchema = z.unknown().optional();
export type DocsModifyAccessResponse = z.infer<
	typeof DocsModifyAccessOutputSchema
>;

export const DocsListSnapshotsInputSchema = z
	.object({
		docId: z.string().min(1),
		raw: z.boolean().optional(),
	})
	.strict();
export type DocsListSnapshotsInput = z.infer<
	typeof DocsListSnapshotsInputSchema
>;
export const DocsListSnapshotsOutputSchema = z.object({
	snapshots: z.array(
		z.object({
			snapshotId: z.string(),
			snapshotTime: z.string(),
			docId: z.string().optional(),
		}),
	),
});
export type DocsListSnapshotsResponse = z.infer<
	typeof DocsListSnapshotsOutputSchema
>;

export const DocsRemoveSnapshotsInputSchema = z
	.object({
		docId: z.string().min(1),
		snapshotIds: z.array(z.string()),
	})
	.strict();
export type DocsRemoveSnapshotsInput = z.infer<
	typeof DocsRemoveSnapshotsInputSchema
>;
// unknown because the provider returns empty content on 200
export const DocsRemoveSnapshotsOutputSchema = z.unknown().optional();
export type DocsRemoveSnapshotsResponse = z.infer<
	typeof DocsRemoveSnapshotsOutputSchema
>;

// ==========================================
// Tables
// ==========================================

export const TablesListInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type TablesListInput = z.infer<typeof TablesListInputSchema>;
export const TablesListOutputSchema = z.object({
	tables: z.array(
		z.object({
			id: z.string(),
			fields: z
				.object({
					tableRef: z.number().optional(),
					onDemand: z.boolean().optional(),
				})
				// passthrough because user-defined metadata fields may be present
				.passthrough(),
		}),
	),
});
export type TablesListResponse = z.infer<typeof TablesListOutputSchema>;

export const TablesCreateInputSchema = z
	.object({
		docId: z.string().min(1),
		tables: z.array(
			z.object({
				id: z.string().optional(),
				columns: z.array(
					z.object({
						id: z.string().optional(),
						// unknown because column definitions and widgets vary
						fields: z.record(z.string(), z.unknown()).optional(),
					}),
				),
			}),
		),
	})
	.strict();
export type TablesCreateInput = z.infer<typeof TablesCreateInputSchema>;
export const TablesCreateOutputSchema = z.object({
	tables: z.array(
		z.object({
			id: z.string(),
		}),
	),
});
export type TablesCreateResponse = z.infer<typeof TablesCreateOutputSchema>;

export const TablesUpdateInputSchema = z
	.object({
		docId: z.string().min(1),
		tables: z.array(
			z.object({
				id: z.string(),
				fields: z
					.object({
						tableId: z.string().optional(),
						onDemand: z.boolean().optional(),
					})
					// passthrough because custom table options may be extended
					.passthrough(),
			}),
		),
	})
	.strict();
export type TablesUpdateInput = z.infer<typeof TablesUpdateInputSchema>;
// unknown because the provider returns empty content on 200
export const TablesUpdateOutputSchema = z.unknown().optional();
export type TablesUpdateResponse = z.infer<typeof TablesUpdateOutputSchema>;

// ==========================================
// Records
// ==========================================

export const RecordsListInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		filter: z.string().optional(),
		sort: z.string().optional(),
		limit: z.number().optional(),
		hidden: z.boolean().optional(),
		cellFormat: z.enum(['raw', 'formatted']).optional(),
	})
	.strict();
export type RecordsListInput = z.infer<typeof RecordsListInputSchema>;
export const RecordsListOutputSchema = z.object({
	records: z.array(
		z.object({
			id: z.number(),
			// unknown because user record fields are dynamic column name to value maps
			fields: z.record(z.string(), z.unknown()),
			// unknown because formula errors map column name to exception details
			errors: z.record(z.string(), z.unknown()).optional(),
		}),
	),
});
export type RecordsListResponse = z.infer<typeof RecordsListOutputSchema>;

export const RecordsAddInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		noparse: z.boolean().optional(),
		records: z.array(
			z.object({
				// unknown because cell values can be strings, numbers, booleans, or lists
				fields: z.record(z.string(), z.unknown()),
			}),
		),
	})
	.strict();
export type RecordsAddInput = z.infer<typeof RecordsAddInputSchema>;
export const RecordsAddOutputSchema = z.object({
	records: z.array(
		z.object({
			id: z.number(),
		}),
	),
});
export type RecordsAddResponse = z.infer<typeof RecordsAddOutputSchema>;

export const RecordsUpdateInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		noparse: z.boolean().optional(),
		records: z.array(
			z.object({
				id: z.number(),
				// unknown because cell values can be strings, numbers, booleans, or lists
				fields: z.record(z.string(), z.unknown()),
			}),
		),
	})
	.strict();
export type RecordsUpdateInput = z.infer<typeof RecordsUpdateInputSchema>;
// unknown because the provider returns empty content on 200
export const RecordsUpdateOutputSchema = z.unknown().optional();
export type RecordsUpdateResponse = z.infer<typeof RecordsUpdateOutputSchema>;

export const RecordsReplaceInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		noparse: z.boolean().optional(),
		onmany: z.enum(['first', 'none', 'all']).optional(),
		noadd: z.boolean().optional(),
		noupdate: z.boolean().optional(),
		allow_empty_require: z.boolean().optional(),
		records: z.array(
			z.object({
				// unknown because lookup criteria match user column values
				require: z.record(z.string(), z.unknown()),
				// unknown because update cell values are dynamic user data
				fields: z.record(z.string(), z.unknown()),
			}),
		),
	})
	.strict();
export type RecordsReplaceInput = z.infer<typeof RecordsReplaceInputSchema>;
// unknown because the provider returns empty content on 200
export const RecordsReplaceOutputSchema = z.unknown().optional();
export type RecordsReplaceResponse = z.infer<typeof RecordsReplaceOutputSchema>;

export const RecordsDeleteInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		recordIds: z.array(z.number()),
	})
	.strict();
export type RecordsDeleteInput = z.infer<typeof RecordsDeleteInputSchema>;
// unknown because the provider returns empty content on 200
export const RecordsDeleteOutputSchema = z.unknown().optional();
export type RecordsDeleteResponse = z.infer<typeof RecordsDeleteOutputSchema>;

// ==========================================
// Columns
// ==========================================

export const ColumnsListInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
	})
	.strict();
export type ColumnsListInput = z.infer<typeof ColumnsListInputSchema>;
export const ColumnsListOutputSchema = z.object({
	columns: z.array(
		z.object({
			id: z.string(),
			// unknown because column configuration schema fields vary by type
			fields: z.record(z.string(), z.unknown()),
		}),
	),
});
export type ColumnsListResponse = z.infer<typeof ColumnsListOutputSchema>;

export const ColumnsAddInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		columns: z.array(
			z.object({
				id: z.string().optional(),
				// unknown because column configuration fields vary
				fields: z.record(z.string(), z.unknown()),
			}),
		),
	})
	.strict();
export type ColumnsAddInput = z.infer<typeof ColumnsAddInputSchema>;
export const ColumnsAddOutputSchema = z.object({
	columns: z.array(
		z.object({
			id: z.string(),
		}),
	),
});
export type ColumnsAddResponse = z.infer<typeof ColumnsAddOutputSchema>;

export const ColumnsUpdateInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		columns: z.array(
			z.object({
				id: z.string(),
				// unknown because column configuration fields vary
				fields: z.record(z.string(), z.unknown()),
			}),
		),
	})
	.strict();
export type ColumnsUpdateInput = z.infer<typeof ColumnsUpdateInputSchema>;
// unknown because the provider returns empty content on 200
export const ColumnsUpdateOutputSchema = z.unknown().optional();
export type ColumnsUpdateResponse = z.infer<typeof ColumnsUpdateOutputSchema>;

export const ColumnsReplaceInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		columns: z.array(
			z.object({
				id: z.string().optional(),
				// unknown because column configuration fields vary
				fields: z.record(z.string(), z.unknown()),
			}),
		),
	})
	.strict();
export type ColumnsReplaceInput = z.infer<typeof ColumnsReplaceInputSchema>;
// unknown because the provider returns empty content on 200
export const ColumnsReplaceOutputSchema = z.unknown().optional();
export type ColumnsReplaceResponse = z.infer<typeof ColumnsReplaceOutputSchema>;

export const ColumnsDeleteInputSchema = z
	.object({
		docId: z.string().min(1),
		tableId: z.string(),
		colId: z.string(),
	})
	.strict();
export type ColumnsDeleteInput = z.infer<typeof ColumnsDeleteInputSchema>;
// unknown because the provider returns empty content on 200
export const ColumnsDeleteOutputSchema = z.unknown().optional();
export type ColumnsDeleteResponse = z.infer<typeof ColumnsDeleteOutputSchema>;

// ==========================================
// SQL
// ==========================================

export const SqlQueryInputSchema = z
	.object({
		docId: z.string().min(1),
		sql: z.string(),
		args: z
			.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
			.optional(),
		timeout: z.number().optional(),
	})
	.strict();
export type SqlQueryInput = z.infer<typeof SqlQueryInputSchema>;
export const SqlQueryOutputSchema = z.object({
	statement: z.string(),
	records: z.array(
		z.object({
			// unknown because SELECT results contain arbitrary query column data
			fields: z.record(z.string(), z.unknown()),
		}),
	),
});
export type SqlQueryResponse = z.infer<typeof SqlQueryOutputSchema>;

export const SqlQueryGetInputSchema = z
	.object({
		docId: z.string().min(1),
		q: z.string(),
	})
	.strict();
export type SqlQueryGetInput = z.infer<typeof SqlQueryGetInputSchema>;
export const SqlQueryGetOutputSchema = z.object({
	statement: z.string().optional(),
	records: z.array(
		z.object({
			// unknown because SELECT results contain arbitrary query column data
			fields: z.record(z.string(), z.unknown()),
		}),
	),
});
export type SqlQueryGetResponse = z.infer<typeof SqlQueryGetOutputSchema>;

// ==========================================
// Attachments
// ==========================================

export const AttachmentsListInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type AttachmentsListInput = z.infer<typeof AttachmentsListInputSchema>;
export const AttachmentsListOutputSchema = z.object({
	records: z.array(
		z.object({
			id: z.number(),
			fields: z
				.object({
					fileName: z.string().optional(),
					fileSize: z.number().optional(),
					timeUploaded: z.string().optional(),
				})
				// passthrough because attachment metadata can carry additional provider attributes
				.passthrough(),
		}),
	),
});
export type AttachmentsListResponse = z.infer<
	typeof AttachmentsListOutputSchema
>;

export const AttachmentsGetInputSchema = z
	.object({
		docId: z.string().min(1),
		attachmentId: z.union([z.string(), z.number()]),
	})
	.strict();
export type AttachmentsGetInput = z.infer<typeof AttachmentsGetInputSchema>;
export const AttachmentsGetOutputSchema = z
	.object({
		fileName: z.string().optional(),
		fileSize: z.number().optional(),
		timeUploaded: z.string().optional(),
	})
	// passthrough because attachment metadata can carry additional provider attributes
	.passthrough();
export type AttachmentsGetResponse = z.infer<typeof AttachmentsGetOutputSchema>;

export const AttachmentsRemoveUnusedInputSchema = z
	.object({
		docId: z.string().min(1),
		verify: z.boolean().optional(),
	})
	.strict();
export type AttachmentsRemoveUnusedInput = z.infer<
	typeof AttachmentsRemoveUnusedInputSchema
>;
// unknown because the provider returns empty content or summary on 200
export const AttachmentsRemoveUnusedOutputSchema = z.unknown().optional();
export type AttachmentsRemoveUnusedResponse = z.infer<
	typeof AttachmentsRemoveUnusedOutputSchema
>;

export const AttachmentsUpdateUsedInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type AttachmentsUpdateUsedInput = z.infer<
	typeof AttachmentsUpdateUsedInputSchema
>;
// unknown because the provider returns empty content or summary on 200
export const AttachmentsUpdateUsedOutputSchema = z.unknown().optional();
export type AttachmentsUpdateUsedResponse = z.infer<
	typeof AttachmentsUpdateUsedOutputSchema
>;

export const AttachmentsVerifyFilesInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type AttachmentsVerifyFilesInput = z.infer<
	typeof AttachmentsVerifyFilesInputSchema
>;
// unknown because the provider returns empty content or verification report on 200
export const AttachmentsVerifyFilesOutputSchema = z.unknown().optional();
export type AttachmentsVerifyFilesResponse = z.infer<
	typeof AttachmentsVerifyFilesOutputSchema
>;

export const AttachmentsGetTransferStatusInputSchema = z
	.object({
		docId: z.string().min(1),
	})
	.strict();
export type AttachmentsGetTransferStatusInput = z.infer<
	typeof AttachmentsGetTransferStatusInputSchema
>;
// unknown because transfer status attributes depend on current transfer progress
export const AttachmentsGetTransferStatusOutputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type AttachmentsGetTransferStatusResponse = z.infer<
	typeof AttachmentsGetTransferStatusOutputSchema
>;

// ==========================================
// Profile
// ==========================================

export const ProfileGetInputSchema = z.object({}).strict();
export type ProfileGetInput = z.infer<typeof ProfileGetInputSchema>;
export const ProfileGetOutputSchema = UserSchema.extend({
	email: z.string().optional(),
});
export type ProfileGetResponse = z.infer<typeof ProfileGetOutputSchema>;

export const ProfileUpdateNameInputSchema = z
	.object({
		name: z.string(),
	})
	.strict();
export type ProfileUpdateNameInput = z.infer<
	typeof ProfileUpdateNameInputSchema
>;
// unknown because the provider returns empty content on 200
export const ProfileUpdateNameOutputSchema = z.unknown().optional();
export type ProfileUpdateNameResponse = z.infer<
	typeof ProfileUpdateNameOutputSchema
>;

export const ProfileUpdateLocaleInputSchema = z
	.object({
		locale: z.string().nullable().optional(),
	})
	.strict();
export type ProfileUpdateLocaleInput = z.infer<
	typeof ProfileUpdateLocaleInputSchema
>;
// unknown because the provider returns empty content on 200
export const ProfileUpdateLocaleOutputSchema = z.unknown().optional();
export type ProfileUpdateLocaleResponse = z.infer<
	typeof ProfileUpdateLocaleOutputSchema
>;

export const ProfileGetApiKeyInputSchema = z.object({}).strict();
export type ProfileGetApiKeyInput = z.infer<typeof ProfileGetApiKeyInputSchema>;
export const ProfileGetApiKeyOutputSchema = z.string();
export type ProfileGetApiKeyResponse = z.infer<
	typeof ProfileGetApiKeyOutputSchema
>;

export const ProfileCreateApiKeyInputSchema = z.object({}).strict();
export type ProfileCreateApiKeyInput = z.infer<
	typeof ProfileCreateApiKeyInputSchema
>;
export const ProfileCreateApiKeyOutputSchema = z.string();
export type ProfileCreateApiKeyResponse = z.infer<
	typeof ProfileCreateApiKeyOutputSchema
>;

export const ProfileDeleteApiKeyInputSchema = z.object({}).strict();
export type ProfileDeleteApiKeyInput = z.infer<
	typeof ProfileDeleteApiKeyInputSchema
>;
// unknown because the provider returns empty content on 200
export const ProfileDeleteApiKeyOutputSchema = z.unknown().optional();
export type ProfileDeleteApiKeyResponse = z.infer<
	typeof ProfileDeleteApiKeyOutputSchema
>;

// ==========================================
// Service Accounts
// ==========================================

export const ServiceAccountsListInputSchema = z.object({}).strict();
export type ServiceAccountsListInput = z.infer<
	typeof ServiceAccountsListInputSchema
>;
export const ServiceAccountsListOutputSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		email: z.string().optional(),
	}),
);
export type ServiceAccountsListResponse = z.infer<
	typeof ServiceAccountsListOutputSchema
>;

export const ServiceAccountsCreateInputSchema = z
	.object({
		name: z.string(),
		label: z.string().optional(),
	})
	.strict();
export type ServiceAccountsCreateInput = z.infer<
	typeof ServiceAccountsCreateInputSchema
>;
export const ServiceAccountsCreateOutputSchema = z.object({
	id: z.string(),
	name: z.string(),
	apiKey: z.string().optional(),
});
export type ServiceAccountsCreateResponse = z.infer<
	typeof ServiceAccountsCreateOutputSchema
>;

export const ServiceAccountsGetInputSchema = z
	.object({
		saId: z.union([z.string(), z.number()]),
	})
	.strict();
export type ServiceAccountsGetInput = z.infer<
	typeof ServiceAccountsGetInputSchema
>;
export const ServiceAccountsGetOutputSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().optional(),
});
export type ServiceAccountsGetResponse = z.infer<
	typeof ServiceAccountsGetOutputSchema
>;

export const ServiceAccountsUpdateInputSchema = z
	.object({
		saId: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		label: z.string().optional(),
	})
	.strict();
export type ServiceAccountsUpdateInput = z.infer<
	typeof ServiceAccountsUpdateInputSchema
>;
// unknown because the provider returns empty content on 200
export const ServiceAccountsUpdateOutputSchema = z.unknown().optional();
export type ServiceAccountsUpdateResponse = z.infer<
	typeof ServiceAccountsUpdateOutputSchema
>;

export const ServiceAccountsDeleteInputSchema = z
	.object({
		saId: z.union([z.string(), z.number()]),
	})
	.strict();
export type ServiceAccountsDeleteInput = z.infer<
	typeof ServiceAccountsDeleteInputSchema
>;
// unknown because the provider returns empty content on 200
export const ServiceAccountsDeleteOutputSchema = z.unknown().optional();
export type ServiceAccountsDeleteResponse = z.infer<
	typeof ServiceAccountsDeleteOutputSchema
>;

export const ServiceAccountsRegenerateApiKeyInputSchema = z
	.object({
		saId: z.union([z.string(), z.number()]),
	})
	.strict();
export type ServiceAccountsRegenerateApiKeyInput = z.infer<
	typeof ServiceAccountsRegenerateApiKeyInputSchema
>;
export const ServiceAccountsRegenerateApiKeyOutputSchema = z.string();
export type ServiceAccountsRegenerateApiKeyResponse = z.infer<
	typeof ServiceAccountsRegenerateApiKeyOutputSchema
>;

export const ServiceAccountsDeleteApiKeyInputSchema = z
	.object({
		saId: z.union([z.string(), z.number()]),
	})
	.strict();
export type ServiceAccountsDeleteApiKeyInput = z.infer<
	typeof ServiceAccountsDeleteApiKeyInputSchema
>;
// unknown because the provider returns empty content on 200
export const ServiceAccountsDeleteApiKeyOutputSchema = z.unknown().optional();
export type ServiceAccountsDeleteApiKeyResponse = z.infer<
	typeof ServiceAccountsDeleteApiKeyOutputSchema
>;

// ==========================================
// Templates & Widgets
// ==========================================

export const TemplatesListInputSchema = z.object({}).strict();
export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;
// unknown because template catalog items have varied community metadata
export const TemplatesListOutputSchema = z.unknown();
export type TemplatesListResponse = z.infer<typeof TemplatesListOutputSchema>;

export const TemplatesGetInputSchema = z
	.object({
		templateId: z.union([z.string(), z.number()]),
	})
	.strict();
export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;
// unknown because template structural definition varies per template
export const TemplatesGetOutputSchema = z.unknown();
export type TemplatesGetResponse = z.infer<typeof TemplatesGetOutputSchema>;

export const WidgetsListInputSchema = z.object({}).strict();
export type WidgetsListInput = z.infer<typeof WidgetsListInputSchema>;
// unknown because custom widget registry JSON is community-authored dynamic metadata
export const WidgetsListOutputSchema = z.unknown();
export type WidgetsListResponse = z.infer<typeof WidgetsListOutputSchema>;

// ==========================================
// Users
// ==========================================

export const UsersDisableInputSchema = z
	.object({
		userId: z.union([z.string(), z.number()]),
	})
	.strict();
export type UsersDisableInput = z.infer<typeof UsersDisableInputSchema>;
// unknown because the provider returns empty content on 200
export const UsersDisableOutputSchema = z.unknown().optional();
export type UsersDisableResponse = z.infer<typeof UsersDisableOutputSchema>;

export const UsersEnableInputSchema = z
	.object({
		userId: z.union([z.string(), z.number()]),
	})
	.strict();
export type UsersEnableInput = z.infer<typeof UsersEnableInputSchema>;
// unknown because the provider returns empty content on 200
export const UsersEnableOutputSchema = z.unknown().optional();
export type UsersEnableResponse = z.infer<typeof UsersEnableOutputSchema>;

export const UsersDeleteInputSchema = z
	.object({
		userId: z.union([z.string(), z.number()]),
	})
	.strict();
export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;
// unknown because the provider returns empty content on 200
export const UsersDeleteOutputSchema = z.unknown().optional();
export type UsersDeleteResponse = z.infer<typeof UsersDeleteOutputSchema>;

// ==========================================
// Session
// ==========================================

export const SessionGetActiveInputSchema = z.object({}).strict();
export type SessionGetActiveInput = z.infer<typeof SessionGetActiveInputSchema>;
export const SessionGetActiveOutputSchema = z.object({
	user: UserSchema.optional(),
	org: OrgSchema.optional(),
	// unknown because error details if any are arbitrary provider error JSON
	orgError: z.unknown().optional(),
});
export type SessionGetActiveResponse = z.infer<
	typeof SessionGetActiveOutputSchema
>;

export const SessionGetAllInputSchema = z.object({}).strict();
export type SessionGetAllInput = z.infer<typeof SessionGetAllInputSchema>;
// unknown because active session map contains arbitrary multi-account user records
export const SessionGetAllOutputSchema = z.unknown();
export type SessionGetAllResponse = z.infer<typeof SessionGetAllOutputSchema>;

export const SessionSetActiveInputSchema = z
	.object({
		email: z.string(),
		org: z.string().optional(),
	})
	.strict();
export type SessionSetActiveInput = z.infer<typeof SessionSetActiveInputSchema>;
export const SessionSetActiveOutputSchema = z.object({
	email: z.string().optional(),
});
export type SessionSetActiveResponse = z.infer<
	typeof SessionSetActiveOutputSchema
>;

// ==========================================
// Mappings
// ==========================================

export const GristEndpointInputSchemas = {
	'orgs.list': OrgsListInputSchema,
	'orgs.get': OrgsGetInputSchema,
	'orgs.update': OrgsUpdateInputSchema,
	'orgs.delete': OrgsDeleteInputSchema,
	'orgs.listAccess': OrgsListAccessInputSchema,
	'orgs.modifyAccess': OrgsModifyAccessInputSchema,
	'orgs.getUsage': OrgsGetUsageInputSchema,

	'workspaces.list': WorkspacesListInputSchema,
	'workspaces.create': WorkspacesCreateInputSchema,
	'workspaces.get': WorkspacesGetInputSchema,
	'workspaces.update': WorkspacesUpdateInputSchema,
	'workspaces.delete': WorkspacesDeleteInputSchema,
	'workspaces.remove': WorkspacesRemoveInputSchema,
	'workspaces.unremove': WorkspacesUnremoveInputSchema,
	'workspaces.listAccess': WorkspacesListAccessInputSchema,
	'workspaces.modifyAccess': WorkspacesModifyAccessInputSchema,

	'docs.create': DocsCreateInputSchema,
	'docs.createInWorkspace': DocsCreateInWorkspaceInputSchema,
	'docs.get': DocsGetInputSchema,
	'docs.update': DocsUpdateInputSchema,
	'docs.delete': DocsDeleteInputSchema,
	'docs.remove': DocsRemoveInputSchema,
	'docs.unremove': DocsUnremoveInputSchema,
	'docs.move': DocsMoveInputSchema,
	'docs.pin': DocsPinInputSchema,
	'docs.unpin': DocsUnpinInputSchema,
	'docs.copy': DocsCopyInputSchema,
	'docs.fork': DocsForkInputSchema,
	'docs.listAccess': DocsListAccessInputSchema,
	'docs.modifyAccess': DocsModifyAccessInputSchema,
	'docs.listSnapshots': DocsListSnapshotsInputSchema,
	'docs.removeSnapshots': DocsRemoveSnapshotsInputSchema,

	'tables.list': TablesListInputSchema,
	'tables.create': TablesCreateInputSchema,
	'tables.update': TablesUpdateInputSchema,

	'records.list': RecordsListInputSchema,
	'records.add': RecordsAddInputSchema,
	'records.update': RecordsUpdateInputSchema,
	'records.replace': RecordsReplaceInputSchema,
	'records.delete': RecordsDeleteInputSchema,

	'columns.list': ColumnsListInputSchema,
	'columns.add': ColumnsAddInputSchema,
	'columns.update': ColumnsUpdateInputSchema,
	'columns.replace': ColumnsReplaceInputSchema,
	'columns.delete': ColumnsDeleteInputSchema,

	'sql.query': SqlQueryInputSchema,
	'sql.queryGet': SqlQueryGetInputSchema,

	'attachments.list': AttachmentsListInputSchema,
	'attachments.get': AttachmentsGetInputSchema,
	'attachments.removeUnused': AttachmentsRemoveUnusedInputSchema,
	'attachments.updateUsed': AttachmentsUpdateUsedInputSchema,
	'attachments.verifyFiles': AttachmentsVerifyFilesInputSchema,
	'attachments.getTransferStatus': AttachmentsGetTransferStatusInputSchema,

	'profile.get': ProfileGetInputSchema,
	'profile.updateName': ProfileUpdateNameInputSchema,
	'profile.updateLocale': ProfileUpdateLocaleInputSchema,
	'profile.getApiKey': ProfileGetApiKeyInputSchema,
	'profile.createApiKey': ProfileCreateApiKeyInputSchema,
	'profile.deleteApiKey': ProfileDeleteApiKeyInputSchema,

	'serviceAccounts.list': ServiceAccountsListInputSchema,
	'serviceAccounts.create': ServiceAccountsCreateInputSchema,
	'serviceAccounts.get': ServiceAccountsGetInputSchema,
	'serviceAccounts.update': ServiceAccountsUpdateInputSchema,
	'serviceAccounts.delete': ServiceAccountsDeleteInputSchema,
	'serviceAccounts.regenerateApiKey':
		ServiceAccountsRegenerateApiKeyInputSchema,
	'serviceAccounts.deleteApiKey': ServiceAccountsDeleteApiKeyInputSchema,

	'templates.list': TemplatesListInputSchema,
	'templates.get': TemplatesGetInputSchema,

	'widgets.list': WidgetsListInputSchema,

	'users.disable': UsersDisableInputSchema,
	'users.enable': UsersEnableInputSchema,
	'users.delete': UsersDeleteInputSchema,

	'session.getActive': SessionGetActiveInputSchema,
	'session.getAll': SessionGetAllInputSchema,
	'session.setActive': SessionSetActiveInputSchema,
} as const;

export const GristEndpointOutputSchemas = {
	'orgs.list': OrgsListOutputSchema,
	'orgs.get': OrgsGetOutputSchema,
	'orgs.update': OrgsUpdateOutputSchema,
	'orgs.delete': OrgsDeleteOutputSchema,
	'orgs.listAccess': OrgsListAccessOutputSchema,
	'orgs.modifyAccess': OrgsModifyAccessOutputSchema,
	'orgs.getUsage': OrgsGetUsageOutputSchema,

	'workspaces.list': WorkspacesListOutputSchema,
	'workspaces.create': WorkspacesCreateOutputSchema,
	'workspaces.get': WorkspacesGetOutputSchema,
	'workspaces.update': WorkspacesUpdateOutputSchema,
	'workspaces.delete': WorkspacesDeleteOutputSchema,
	'workspaces.remove': WorkspacesRemoveOutputSchema,
	'workspaces.unremove': WorkspacesUnremoveOutputSchema,
	'workspaces.listAccess': WorkspacesListAccessOutputSchema,
	'workspaces.modifyAccess': WorkspacesModifyAccessOutputSchema,

	'docs.create': DocsCreateOutputSchema,
	'docs.createInWorkspace': DocsCreateInWorkspaceOutputSchema,
	'docs.get': DocsGetOutputSchema,
	'docs.update': DocsUpdateOutputSchema,
	'docs.delete': DocsDeleteOutputSchema,
	'docs.remove': DocsRemoveOutputSchema,
	'docs.unremove': DocsUnremoveOutputSchema,
	'docs.move': DocsMoveOutputSchema,
	'docs.pin': DocsPinOutputSchema,
	'docs.unpin': DocsUnpinOutputSchema,
	'docs.copy': DocsCopyOutputSchema,
	'docs.fork': DocsForkOutputSchema,
	'docs.listAccess': DocsListAccessOutputSchema,
	'docs.modifyAccess': DocsModifyAccessOutputSchema,
	'docs.listSnapshots': DocsListSnapshotsOutputSchema,
	'docs.removeSnapshots': DocsRemoveSnapshotsOutputSchema,

	'tables.list': TablesListOutputSchema,
	'tables.create': TablesCreateOutputSchema,
	'tables.update': TablesUpdateOutputSchema,

	'records.list': RecordsListOutputSchema,
	'records.add': RecordsAddOutputSchema,
	'records.update': RecordsUpdateOutputSchema,
	'records.replace': RecordsReplaceOutputSchema,
	'records.delete': RecordsDeleteOutputSchema,

	'columns.list': ColumnsListOutputSchema,
	'columns.add': ColumnsAddOutputSchema,
	'columns.update': ColumnsUpdateOutputSchema,
	'columns.replace': ColumnsReplaceOutputSchema,
	'columns.delete': ColumnsDeleteOutputSchema,

	'sql.query': SqlQueryOutputSchema,
	'sql.queryGet': SqlQueryGetOutputSchema,

	'attachments.list': AttachmentsListOutputSchema,
	'attachments.get': AttachmentsGetOutputSchema,
	'attachments.removeUnused': AttachmentsRemoveUnusedOutputSchema,
	'attachments.updateUsed': AttachmentsUpdateUsedOutputSchema,
	'attachments.verifyFiles': AttachmentsVerifyFilesOutputSchema,
	'attachments.getTransferStatus': AttachmentsGetTransferStatusOutputSchema,

	'profile.get': ProfileGetOutputSchema,
	'profile.updateName': ProfileUpdateNameOutputSchema,
	'profile.updateLocale': ProfileUpdateLocaleOutputSchema,
	'profile.getApiKey': ProfileGetApiKeyOutputSchema,
	'profile.createApiKey': ProfileCreateApiKeyOutputSchema,
	'profile.deleteApiKey': ProfileDeleteApiKeyOutputSchema,

	'serviceAccounts.list': ServiceAccountsListOutputSchema,
	'serviceAccounts.create': ServiceAccountsCreateOutputSchema,
	'serviceAccounts.get': ServiceAccountsGetOutputSchema,
	'serviceAccounts.update': ServiceAccountsUpdateOutputSchema,
	'serviceAccounts.delete': ServiceAccountsDeleteOutputSchema,
	'serviceAccounts.regenerateApiKey':
		ServiceAccountsRegenerateApiKeyOutputSchema,
	'serviceAccounts.deleteApiKey': ServiceAccountsDeleteApiKeyOutputSchema,

	'templates.list': TemplatesListOutputSchema,
	'templates.get': TemplatesGetOutputSchema,

	'widgets.list': WidgetsListOutputSchema,

	'users.disable': UsersDisableOutputSchema,
	'users.enable': UsersEnableOutputSchema,
	'users.delete': UsersDeleteOutputSchema,

	'session.getActive': SessionGetActiveOutputSchema,
	'session.getAll': SessionGetAllOutputSchema,
	'session.setActive': SessionSetActiveOutputSchema,
} as const;

export type GristEndpointInputs = {
	[K in keyof typeof GristEndpointInputSchemas]: z.infer<
		(typeof GristEndpointInputSchemas)[K]
	>;
};

export type GristEndpointOutputs = {
	[K in keyof typeof GristEndpointOutputSchemas]: z.infer<
		(typeof GristEndpointOutputSchemas)[K]
	>;
};
