import { z } from 'zod';

const EmptyInputSchema = z.object({}).strict();

const CheckSiteSettingsEditPermissionInputSchema = EmptyInputSchema;

const CheckSiteSettingsEditPermissionResponseSchema = z
	.object({
		site: z
			.object({
				id: z.string().optional(),
				siteID: z.string().optional(),
				canReloadSite: z.boolean().optional(),
				viewerCanAdminister: z.boolean().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		currentUser: z
			.object({
				siteAdmin: z.boolean().optional(),
				viewerCanAdminister: z.boolean().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		canEditSiteSettings: z.boolean(),
	})
	.loose();

const CompareCommitsInputSchema = z
	.object({
		repo: z.string(),
		base: z.string(),
		head: z.string(),
		first: z.number().int().min(1).max(1000).optional(),
	})
	.strict();

const FileDiffSchema = z
	.object({
		oldPath: z.string().nullable().optional(),
		newPath: z.string().nullable().optional(),
		stat: z
			.object({
				added: z.number().optional(),
				changed: z.number().optional(),
				deleted: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const CompareCommitsResponseSchema = z
	.object({
		repository: z
			.object({
				comparison: z
					.object({
						range: z
							.object({
								expr: z.string().optional(),
							})
							.loose()
							.nullable()
							.optional(),
						fileDiffs: z
							.object({
								nodes: z.array(FileDiffSchema).optional(),
								totalCount: z.number().nullable().optional(),
								pageInfo: z
									.object({
										hasNextPage: z.boolean().optional(),
										endCursor: z.string().nullable().optional(),
									})
									.loose()
									.optional(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable(),
	})
	.loose();

const GetCommitDetailsInputSchema = z
	.object({
		repo: z.string(),
		rev: z.string(),
	})
	.strict();

const SignatureSchema = z
	.object({
		date: z.string().optional(),
		person: z
			.object({
				name: z.string().nullable().optional(),
				email: z.string().nullable().optional(),
				displayName: z.string().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();

const GetCommitDetailsResponseSchema = z
	.object({
		repository: z
			.object({
				commit: z
					.object({
						oid: z.string(),
						abbreviatedOID: z.string().optional(),
						message: z.string().optional(),
						subject: z.string().optional(),
						body: z.string().nullable().optional(),
						url: z.string().optional(),
						canonicalURL: z.string().optional(),
						author: SignatureSchema.optional(),
						committer: SignatureSchema.nullable().optional(),
					})
					.loose()
					.nullable(),
			})
			.loose()
			.nullable(),
	})
	.loose();

const GetCurrentUserInputSchema = EmptyInputSchema;

const GetCurrentUserResponseSchema = z
	.object({
		currentUser: z
			.object({
				id: z.string().optional(),
				username: z.string().optional(),
				displayName: z.string().nullable().optional(),
				email: z.string().nullable().optional(),
				siteAdmin: z.boolean().optional(),
				viewerCanAdminister: z.boolean().optional(),
				avatarURL: z.string().nullable().optional(),
				url: z.string().optional(),
				createdAt: z.string().optional(),
			})
			.loose()
			.nullable(),
	})
	.loose();

const GetFileContentsInputSchema = z
	.object({
		repo_name: z.string(),
		file_path: z.string(),
	})
	.strict();

const GetFileContentsResponseSchema = z
	.object({
		repository: z
			.object({
				name: z.string().optional(),
				defaultBranch: z
					.object({
						displayName: z.string().nullable().optional(),
					})
					.loose()
					.nullable()
					.optional(),
				commit: z
					.object({
						oid: z.string().optional(),
						file: z
							.object({
								name: z.string().optional(),
								path: z.string().optional(),
								content: z.string().optional(),
								binary: z.boolean().optional(),
								byteSize: z.number().optional(),
							})
							.loose()
							.nullable(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable(),
	})
	.loose();

const ListRepositoriesInputSchema = z
	.object({
		first: z.number().int().min(1).max(1000),
		after: z.string().optional(),
	})
	.strict();

const ListRepositoriesResponseSchema = z
	.object({
		repositories: z
			.object({
				nodes: z
					.array(
						z
							.object({
								name: z.string(),
								url: z.string().optional(),
								description: z.string().nullable().optional(),
								language: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				totalCount: z.number().nullable().optional(),
				pageInfo: z
					.object({
						hasNextPage: z.boolean().optional(),
						endCursor: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
			})
			.loose(),
	})
	.loose();

const ListRepositoryFilesInputSchema = z
	.object({
		repo_name: z.string(),
		path: z.string().optional(),
		rev: z.string().optional(),
		recursive: z.boolean().optional(),
	})
	.strict();

const ListRepositoryFilesResponseSchema = z
	.object({
		repository: z
			.object({
				commit: z
					.object({
						tree: z
							.object({
								path: z.string().optional(),
								isRoot: z.boolean().optional(),
								entries: z
									.array(
										z
											.object({
												name: z.string().optional(),
												path: z.string().optional(),
												isDirectory: z.boolean().optional(),
											})
											.loose(),
									)
									.optional(),
							})
							.loose()
							.nullable(),
					})
					.loose()
					.nullable(),
			})
			.loose()
			.nullable(),
	})
	.loose();

const ListRepositoryLanguagesInputSchema = z
	.object({
		repoName: z.string(),
	})
	.strict();

const ListRepositoryLanguagesResponseSchema = z
	.object({
		repository: z
			.object({
				name: z.string().optional(),
				language: z.string().nullable().optional(),
				commit: z
					.object({
						languages: z.array(z.string()).optional(),
						languageStatistics: z
							.array(
								z
									.object({
										name: z.string().optional(),
										totalBytes: z.number().optional(),
										totalLines: z.number().optional(),
									})
									.loose(),
							)
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable(),
	})
	.loose();

export const SourcegraphEndpointInputSchemas = {
	checkSiteSettingsEditPermission: CheckSiteSettingsEditPermissionInputSchema,
	compareCommits: CompareCommitsInputSchema,
	getCommitDetails: GetCommitDetailsInputSchema,
	getCurrentUser: GetCurrentUserInputSchema,
	getFileContents: GetFileContentsInputSchema,
	listRepositories: ListRepositoriesInputSchema,
	listRepositoryFiles: ListRepositoryFilesInputSchema,
	listRepositoryLanguages: ListRepositoryLanguagesInputSchema,
} as const;

export const SourcegraphEndpointOutputSchemas = {
	checkSiteSettingsEditPermission:
		CheckSiteSettingsEditPermissionResponseSchema,
	compareCommits: CompareCommitsResponseSchema,
	getCommitDetails: GetCommitDetailsResponseSchema,
	getCurrentUser: GetCurrentUserResponseSchema,
	getFileContents: GetFileContentsResponseSchema,
	listRepositories: ListRepositoriesResponseSchema,
	listRepositoryFiles: ListRepositoryFilesResponseSchema,
	listRepositoryLanguages: ListRepositoryLanguagesResponseSchema,
} as const;

export type SourcegraphEndpointInputs = {
	[K in keyof typeof SourcegraphEndpointInputSchemas]: z.infer<
		(typeof SourcegraphEndpointInputSchemas)[K]
	>;
};

export type SourcegraphEndpointOutputs = {
	[K in keyof typeof SourcegraphEndpointOutputSchemas]: z.infer<
		(typeof SourcegraphEndpointOutputSchemas)[K]
	>;
};

export type CheckSiteSettingsEditPermissionInput = z.infer<
	typeof CheckSiteSettingsEditPermissionInputSchema
>;
export type CheckSiteSettingsEditPermissionResponse = z.infer<
	typeof CheckSiteSettingsEditPermissionResponseSchema
>;
export type CompareCommitsInput = z.infer<typeof CompareCommitsInputSchema>;
export type CompareCommitsResponse = z.infer<
	typeof CompareCommitsResponseSchema
>;
export type GetCommitDetailsInput = z.infer<typeof GetCommitDetailsInputSchema>;
export type GetCommitDetailsResponse = z.infer<
	typeof GetCommitDetailsResponseSchema
>;
export type GetCurrentUserInput = z.infer<typeof GetCurrentUserInputSchema>;
export type GetCurrentUserResponse = z.infer<
	typeof GetCurrentUserResponseSchema
>;
export type GetFileContentsInput = z.infer<typeof GetFileContentsInputSchema>;
export type GetFileContentsResponse = z.infer<
	typeof GetFileContentsResponseSchema
>;
export type ListRepositoriesInput = z.infer<typeof ListRepositoriesInputSchema>;
export type ListRepositoriesResponse = z.infer<
	typeof ListRepositoriesResponseSchema
>;
export type ListRepositoryFilesInput = z.infer<
	typeof ListRepositoryFilesInputSchema
>;
export type ListRepositoryFilesResponse = z.infer<
	typeof ListRepositoryFilesResponseSchema
>;
export type ListRepositoryLanguagesInput = z.infer<
	typeof ListRepositoryLanguagesInputSchema
>;
export type ListRepositoryLanguagesResponse = z.infer<
	typeof ListRepositoryLanguagesResponseSchema
>;
