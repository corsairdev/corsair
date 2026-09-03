import { z } from 'zod';

// Apis
export const ApisCreateSchemaInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	type: z.enum([
		'proto:2',
		'proto:3',
		'graphql',
		'openapi:3_1',
		'openapi:3',
		'openapi:2',
		'openapi:1',
		'raml:1',
		'raml:0_8',
		'wsdl:2',
		'wsdl:1',
		'asyncapi:2',
	]),
	files: z.array(
		z.object({
			path: z.string().optional(),
			root: z
				.object({
					enabled: z.boolean().optional(),
				})
				.optional(),
			content: z.string().optional(),
		}),
	),
});

export const ApisCreateSchemaOutputSchema = z.object({
	id: z.string().optional(),
	type: z
		.enum([
			'proto:2',
			'proto:3',
			'graphql',
			'openapi:3_1',
			'openapi:3',
			'openapi:2',
			'openapi:1',
			'raml:1',
			'raml:0_8',
			'wsdl:2',
			'wsdl:1',
			'asyncapi:2',
		])
		.optional(),
	files: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				path: z.string().optional(),
				createdAt: z.string().optional(),
				root: z
					.object({
						enabled: z.boolean().optional(),
					})
					.optional(),
				createdBy: z.string().optional(),
				updatedAt: z.string().optional(),
				updatedBy: z.string().optional(),
			}),
		)
		.optional(),
	createdAt: z.string().optional(),
	createdBy: z.string().optional(),
	updatedAt: z.string().optional(),
	updatedBy: z.string().optional(),
});

export const ApisCreateCollectionFromSchemaInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	body: z
		.union([
			z.object({
				data: z
					.object({
						collectionId: z.string().optional(),
					})
					.optional(),
				operationType: z.enum(['COPY_COLLECTION']).optional(),
			}),
			z.object({
				data: z
					.object({
						info: z
							.object({
								name: z.string().optional(),
								schema: z
									.enum([
										'https://schema.postman.com/json/collection/v2.1.0/collection.json',
									])
									.optional(),
							})
							.optional(),
						item: z.array(z.unknown()).optional(),
					})
					.optional(),
				operationType: z.enum(['CREATE_NEW']).optional(),
			}),
			z.object({
				name: z.string().optional(),
				operationType: z.enum(['GENERATE_FROM_SCHEMA']).optional(),
				options: z.record(z.string(), z.unknown()).optional(),
			}),
		])
		.optional(),
});

export const ApisCreateCollectionFromSchemaOutputSchema = z.object({
	id: z.string().optional(),
});

export const ApisGetCommentsInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
});

export const ApisGetCommentsOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number().int().optional(),
				threadId: z.number().int().optional(),
				status: z.enum(['Open', 'Resolved']).optional(),
				createdBy: z.number().int().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				body: z.string().optional(),
			}),
		)
		.optional(),
});

export const ApisGetInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	include: z
		.array(z.enum(['collections', 'versions', 'schemas', 'gitInfo']))
		.optional(),
});

export const ApisGetOutputSchema = z.union([
	z.object({
		id: z.string().optional(),
		name: z.string().optional(),
		summary: z.string().optional(),
		createdAt: z.string().optional(),
		createdBy: z.number().int().optional(),
		updatedAt: z.string().optional(),
		updatedBy: z.number().int().optional(),
		description: z.string().optional(),
	}),
	z.object({
		id: z.string().optional(),
		name: z.string().optional(),
		summary: z.string().optional(),
		createdAt: z.string().optional(),
		createdBy: z.number().int().optional(),
		updatedAt: z.string().optional(),
		updatedBy: z.number().int().optional(),
		description: z.string().optional(),
		gitInfo: z
			.object({
				domain: z.string().nullable().optional(),
				repository: z.string().optional(),
				organization: z.string().optional(),
				schemaFolder: z.string().optional(),
				collectionFolder: z.string().optional(),
			})
			.optional(),
		schemas: z
			.array(
				z.object({
					id: z.string().optional(),
				}),
			)
			.optional(),
		versions: z
			.array(
				z.object({
					id: z.string().optional(),
					name: z.string().optional(),
				}),
			)
			.optional(),
		collections: z
			.array(
				z.object({
					id: z.string().optional(),
				}),
			)
			.optional(),
	}),
]);

export const ApisGetSchemaInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	schemaId: z.string().min(1, 'SchemaId is required'),
	versionId: z.string().optional(),
	bundled: z.boolean().optional(),
});

export const ApisGetSchemaOutputSchema = z.union([
	z.object({
		id: z.string().optional(),
		type: z.string().optional(),
		files: z
			.object({
				data: z
					.array(
						z.object({
							id: z.string().optional(),
							name: z.string().optional(),
							path: z.string().optional(),
							createdAt: z.string().optional(),
							createdBy: z.string().optional(),
							updatedAt: z.string().optional(),
							updatedBy: z.string().optional(),
						}),
					)
					.optional(),
				meta: z
					.object({
						nextPath: z.string().optional(),
					})
					.optional(),
			})
			.optional(),
		createdAt: z.string().optional(),
		createdBy: z.string().optional(),
		updatedAt: z.string().optional(),
		updatedBy: z.string().optional(),
	}),
	z.object({
		id: z.string().optional(),
		type: z.string().optional(),
		createdBy: z.string().optional(),
		updatedBy: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		content: z.string().optional(),
	}),
]);

export const ApisGetVersionInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	versionId: z.string().min(1, 'VersionId is required'),
});

export const ApisGetVersionOutputSchema = z.object({
	version: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			releaseNotes: z.string().optional(),
			schemas: z
				.array(
					z.object({
						id: z.string().optional(),
						type: z.string().optional(),
					}),
				)
				.optional(),
			collections: z
				.array(
					z.object({
						id: z.string().optional(),
						type: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});

export const ApisListVersionsInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	cursor: z.string().optional(),
	limit: z.number().int().optional(),
});

export const ApisListVersionsOutputSchema = z.object({
	meta: z
		.object({
			limit: z.number().int().optional(),
			total: z.number().int().optional(),
			nextCursor: z.string().optional(),
		})
		.optional(),
	versions: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				releaseNotes: z.string().optional(),
			}),
		)
		.optional(),
});

export const ApisListInputSchema = z.object({
	workspaceId: z.string(),
	createdBy: z.number().int().optional(),
	cursor: z.string().optional(),
	description: z.string().optional(),
	limit: z.number().int().optional(),
});

export const ApisListOutputSchema = z.object({
	apis: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				summary: z.string().optional(),
				createdAt: z.string().optional(),
				createdBy: z.number().int().optional(),
				updatedAt: z.string().optional(),
				updatedBy: z.number().int().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			limit: z.number().int().optional(),
			total: z.number().int().optional(),
			nextCursor: z.string().optional(),
		})
		.optional(),
});

export const ApisGetSchemaFileContentsInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	schemaId: z.string().min(1, 'SchemaId is required'),
	filePath: z.string().min(1, 'FilePath is required'),
	versionId: z.string().optional(),
});

export const ApisGetSchemaFileContentsOutputSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	path: z.string().optional(),
	content: z.string().optional(),
	createdAt: z.string().optional(),
	createdBy: z.string().optional(),
	updatedAt: z.string().optional(),
	updatedBy: z.string().optional(),
});

export const ApisGetSchemaFilesInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	schemaId: z.string().min(1, 'SchemaId is required'),
	versionId: z.string().optional(),
	limit: z.number().int().optional(),
	cursor: z.string().optional(),
});

export const ApisGetSchemaFilesOutputSchema = z.object({
	meta: z
		.object({
			nextCursor: z.string().optional(),
		})
		.optional(),
	files: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				path: z.string().optional(),
				createdAt: z.string().optional(),
				createdBy: z.number().int().optional(),
				updatedAt: z.string().optional(),
				updatedBy: z.number().int().optional(),
			}),
		)
		.optional(),
});

export const ApisCreateInputSchema = z.object({
	workspaceId: z.string(),
	name: z.string(),
	summary: z.string().optional(),
	description: z.string().optional(),
});

export const ApisCreateOutputSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	summary: z.string().optional(),
	createdAt: z.string().optional(),
	createdBy: z.number().int().optional(),
	updatedAt: z.string().optional(),
	updatedBy: z.number().int().optional(),
	description: z.string().optional(),
});

export const ApisCreateOrUpdateSchemaFileInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	schemaId: z.string().min(1, 'SchemaId is required'),
	filePath: z.string().min(1, 'FilePath is required'),
	name: z.string().optional(),
	root: z
		.object({
			enabled: z.boolean().optional(),
		})
		.optional(),
	content: z.string().optional(),
});

export const ApisCreateOrUpdateSchemaFileOutputSchema = z.object({
	createdBy: z.string().optional(),
	createdAt: z.string().optional(),
	root: z
		.object({
			enabled: z.boolean().optional(),
		})
		.optional(),
	name: z.string().optional(),
	path: z.string().optional(),
	updatedBy: z.string().optional(),
	id: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const ApisDeleteSchemaFileInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	schemaId: z.string().min(1, 'SchemaId is required'),
	filePath: z.string().min(1, 'FilePath is required'),
});

export const ApisDeleteSchemaFileOutputSchema = z.unknown().optional();

export const ApisRemoveInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
});

export const ApisRemoveOutputSchema = z.unknown().optional();

export const ApisDeleteCommentInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	commentId: z.number().int(),
});

export const ApisDeleteCommentOutputSchema = z.unknown().optional();

export const ApisUpdateInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	name: z.string(),
	summary: z.string().optional(),
	description: z.string().optional(),
});

export const ApisUpdateOutputSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	summary: z.string().optional(),
	createdAt: z.string().optional(),
	createdBy: z.string().optional(),
	updatedAt: z.string().optional(),
	updatedBy: z.string().optional(),
	description: z.string().optional(),
});

export const ApisUpdateCommentInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	commentId: z.number().int(),
	body: z.string(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const ApisUpdateCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

// Specs
export const SpecsGetInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
});

export const SpecsGetOutputSchema = z.object({
	id: z.string().optional(),
	fileFormat: z.enum(['json', 'yaml', 'proto', 'graphql', 'smithy']).optional(),
	name: z.string().optional(),
	type: z
		.enum([
			'OPENAPI:2.0',
			'OPENAPI:3.0',
			'OPENAPI:3.1',
			'ASYNCAPI:2.0',
			'ASYNCAPI:3.0',
			'PROTOBUF:2',
			'PROTOBUF:3',
			'GRAPHQL',
			'SMITHY:2.0',
		])
		.optional(),
	createdBy: z.number().int().optional(),
	updatedBy: z.number().int().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const SpecsListInputSchema = z.object({
	workspaceId: z.string(),
	cursor: z.string().optional(),
	limit: z.number().int().optional(),
});

export const SpecsListOutputSchema = z.object({
	meta: z
		.object({
			nextCursor: z.string().nullable().optional(),
		})
		.optional(),
	specs: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				type: z
					.enum([
						'OPENAPI:2.0',
						'OPENAPI:3.0',
						'OPENAPI:3.1',
						'ASYNCAPI:2.0',
						'ASYNCAPI:3.0',
						'PROTOBUF:2',
						'PROTOBUF:3',
						'GRAPHQL',
						'SMITHY:2.0',
					])
					.optional(),
				createdBy: z.number().int().optional(),
				updatedBy: z.number().int().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
			}),
		)
		.optional(),
});

export const SpecsGetDefinitionInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
});

export const SpecsGetDefinitionOutputSchema = z.record(z.string(), z.unknown());

export const SpecsGetFileInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	filePath: z.string().min(1, 'FilePath is required'),
});

export const SpecsGetFileOutputSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	path: z.string().optional(),
	createdBy: z.number().int().optional(),
	updatedBy: z.number().int().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	type: z.enum(['ROOT', 'DEFAULT']).optional(),
	content: z.string().optional(),
});

export const SpecsGetGeneratedCollectionsInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	elementType: z.enum(['collection']),
	limit: z.number().int().optional(),
	cursor: z.string().optional(),
});

export const SpecsGetGeneratedCollectionsOutputSchema = z.object({
	collections: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				state: z
					.enum(['in-sync', 'out-of-sync', 'sync-in-progress'])
					.optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				createdBy: z.number().int().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().nullable().optional(),
		})
		.optional(),
});

export const SpecsGetFilesInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
});

export const SpecsGetFilesOutputSchema = z.object({
	files: z
		.array(
			z.object({
				id: z.string().optional(),
				path: z.string().optional(),
				name: z.string().optional(),
				createdBy: z.number().int().optional(),
				updatedBy: z.number().int().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				type: z.enum(['ROOT', 'DEFAULT']).optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().nullable().optional(),
		})
		.optional(),
});

export const SpecsCreateInputSchema = z.object({
	workspaceId: z.string(),
	name: z.string(),
	type: z.enum([
		'OPENAPI:2.0',
		'OPENAPI:3.0',
		'OPENAPI:3.1',
		'ASYNCAPI:2.0',
		'ASYNCAPI:3.0',
		'PROTOBUF:2',
		'PROTOBUF:3',
		'GRAPHQL',
		'SMITHY:2.0',
	]),
	files: z.array(
		z.union([
			z.object({
				path: z.string(),
				content: z.string(),
				type: z.enum(['DEFAULT', 'ROOT']),
			}),
			z.object({
				path: z.string(),
				content: z.string(),
			}),
		]),
	),
});

export const SpecsCreateOutputSchema = z.object({
	name: z.string().optional(),
	type: z
		.enum([
			'OPENAPI:2.0',
			'OPENAPI:3.0',
			'OPENAPI:3.1',
			'ASYNCAPI:2.0',
			'ASYNCAPI:3.0',
			'PROTOBUF:2',
			'PROTOBUF:3',
			'GRAPHQL',
			'SMITHY:2.0',
		])
		.optional(),
	id: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	createdBy: z.number().int().optional(),
	updatedBy: z.number().int().optional(),
});

export const SpecsDeleteFileInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	filePath: z.string().min(1, 'FilePath is required'),
});

export const SpecsDeleteFileOutputSchema = z.unknown().optional();

export const SpecsRemoveInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
});

export const SpecsRemoveOutputSchema = z.unknown().optional();

export const SpecsGenerateCollectionInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	elementType: z.enum(['collection']),
	name: z.string(),
	options: z.object({
		requestNameSource: z.enum(['Fallback', 'URL']).optional(),
		indentCharacter: z.enum(['Tab', 'Space']).optional(),
		parametersResolution: z.string().optional(),
		folderStrategy: z.enum(['Paths', 'Tags']).optional(),
		includeAuthInfoInExample: z.boolean().optional(),
		enableOptionalParameters: z.boolean().optional(),
		keepImplicitHeaders: z.boolean().optional(),
		includeDeprecated: z.boolean().optional(),
		alwaysInheritAuthentication: z.boolean().optional(),
		nestedFolderHierarchy: z.boolean().optional(),
	}),
});

export const SpecsGenerateCollectionOutputSchema = z.object({
	taskId: z.string().optional(),
	url: z.string().optional(),
});

export const SpecsCreateFileInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	path: z.string(),
	content: z.string(),
});

export const SpecsCreateFileOutputSchema = z.object({
	createdAt: z.string().optional(),
	createdBy: z.number().int().optional(),
	id: z.string().optional(),
	path: z.string().optional(),
	updatedAt: z.string().optional(),
	updatedBy: z.number().int().optional(),
	type: z.enum(['DEFAULT', 'ROOT']).optional(),
});

export const SpecsSyncWithCollectionInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	collectionUid: z.string(),
});

export const SpecsSyncWithCollectionOutputSchema = z.object({
	taskId: z.string().optional(),
	url: z.string().optional(),
});

export const SpecsUpdateFileInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	filePath: z.string().min(1, 'FilePath is required'),
	name: z.string().optional(),
	type: z.enum(['DEFAULT', 'ROOT']).optional(),
	content: z.string().optional(),
});

export const SpecsUpdateFileOutputSchema = z.object({
	createdAt: z.string().optional(),
	createdBy: z.number().int().optional(),
	id: z.string().optional(),
	path: z.string().optional(),
	updatedAt: z.string().optional(),
	updatedBy: z.number().int().optional(),
	type: z.enum(['DEFAULT', 'ROOT']).optional(),
});

export const SpecsUpdateInputSchema = z.object({
	specId: z.string().min(1, 'SpecId is required'),
	name: z.string(),
});

export const SpecsUpdateOutputSchema = z.object({
	id: z.string().optional(),
	type: z
		.enum([
			'OPENAPI:2.0',
			'OPENAPI:3.0',
			'OPENAPI:3.1',
			'ASYNCAPI:2.0',
			'ASYNCAPI:3.0',
			'PROTOBUF:2',
			'PROTOBUF:3',
			'GRAPHQL',
			'SMITHY:2.0',
		])
		.optional(),
	createdBy: z.number().int().optional(),
	updatedBy: z.number().int().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	name: z.string().optional(),
});

// Collections
export const CollectionsListInputSchema = z.object({
	workspace: z.string().optional(),
	name: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
});

export const CollectionsListOutputSchema = z.object({
	collections: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				owner: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				uid: z.string().optional(),
				fork: z
					.object({
						label: z.string().optional(),
						createdAt: z.string().optional(),
						from: z.string().optional(),
					})
					.optional(),
				isPublic: z.boolean().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			total: z.number().optional(),
			offset: z.number().optional(),
			limit: z.number().optional(),
		})
		.optional(),
});

export const CollectionsListForkedInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().optional(),
	direction: z.enum(['asc', 'desc']).optional(),
});

export const CollectionsListForkedOutputSchema = z.object({
	data: z
		.array(
			z.object({
				forkName: z.string().optional(),
				forkId: z.string().optional(),
				sourceId: z.string().optional(),
				createdAt: z.string().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			total: z.number().optional(),
			nextCursor: z.string().nullable().optional(),
			inaccessibleFork: z.number().optional(),
		})
		.optional(),
});

export const CollectionsGetUpdateStatusInputSchema = z.object({
	taskId: z.string().min(1, 'TaskId is required'),
});

export const CollectionsGetUpdateStatusOutputSchema = z.object({
	id: z.string().optional(),
	status: z.enum(['successful', 'failed', 'in-progress']).optional(),
});

export const CollectionsGetCommentsInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsGetCommentsOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number().int().optional(),
				threadId: z.number().int().optional(),
				status: z.enum(['Open', 'Resolved']).optional(),
				createdBy: z.number().int().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				body: z.string().optional(),
			}),
		)
		.optional(),
});

export const CollectionsGetPullRequestsInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsGetPullRequestsOutputSchema = z.object({
	data: z
		.array(
			z.object({
				createdAt: z.string().optional(),
				createdBy: z.string().optional(),
				description: z.string().optional(),
				destinationId: z.string().optional(),
				href: z.string().optional(),
				id: z.string().optional(),
				sourceId: z.string().optional(),
				status: z.enum(['open', 'approved', 'declined', 'merged']).optional(),
				comment: z.string().optional(),
				title: z.string().optional(),
				updatedBy: z.string().optional(),
				updatedAt: z.string().optional(),
			}),
		)
		.optional(),
});

export const CollectionsGetRolesInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsGetRolesOutputSchema = z.object({
	group: z
		.array(
			z.object({
				role: z.enum(['VIEWER', 'EDITOR']).optional(),
				id: z.number().optional(),
			}),
		)
		.optional(),
	team: z
		.array(
			z.object({
				role: z.enum(['VIEWER', 'EDITOR']).optional(),
				id: z.number().optional(),
			}),
		)
		.optional(),
	user: z
		.array(
			z.object({
				role: z.enum(['VIEWER', 'EDITOR']).optional(),
				id: z.number().optional(),
			}),
		)
		.optional(),
});

export const CollectionsGetForksInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	cursor: z.string().optional(),
	limit: z.number().int().optional(),
	direction: z.enum(['asc', 'desc']).optional(),
});

export const CollectionsGetForksOutputSchema = z.object({
	data: z
		.array(
			z.object({
				createdAt: z.string().optional(),
				createdBy: z.string().optional(),
				forkId: z.string().optional(),
				forkName: z.string().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().nullable().optional(),
			total: z.number().optional(),
		})
		.optional(),
});

export const CollectionsGetDuplicationStatusInputSchema = z.object({
	taskId: z.string().min(1, 'TaskId is required'),
});

export const CollectionsGetDuplicationStatusOutputSchema = z.object({
	task: z
		.object({
			id: z.string().optional(),
			status: z.enum(['processing', 'completed', 'failed']).optional(),
			reason: z.string().nullable().optional(),
		})
		.optional(),
});

export const CollectionsGetFolderCommentsInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	folderId: z.string().min(1, 'FolderId is required'),
});

export const CollectionsGetFolderCommentsOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number().int().optional(),
				threadId: z.number().int().optional(),
				status: z.enum(['Open', 'Resolved']).optional(),
				createdBy: z.number().int().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				body: z.string().optional(),
			}),
		)
		.optional(),
});

export const CollectionsGetFolderInputSchema = z.object({
	folderId: z.string().min(1, 'FolderId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
	ids: z.boolean().optional(),
	uid: z.boolean().optional(),
	populate: z.boolean().optional(),
});

export const CollectionsGetFolderOutputSchema = z.object({
	model_id: z.string().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	data: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			owner: z.string().optional(),
			lastUpdatedBy: z.string().optional(),
			lastRevision: z.number().int().optional(),
			collection: z.string().optional(),
		})
		.optional(),
});

export const CollectionsGetGeneratedSpecsInputSchema = z.object({
	collectionUid: z.string().min(1, 'CollectionUid is required'),
	elementType: z.enum(['spec']),
});

export const CollectionsGetGeneratedSpecsOutputSchema = z.object({
	specs: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				state: z
					.enum(['in-sync', 'out-of-sync', 'sync-in-progress'])
					.optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				createdBy: z.number().int().optional(),
				updatedBy: z.number().int().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().nullable().optional(),
		})
		.optional(),
});

export const CollectionsGetRequestCommentsInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	requestId: z.string().min(1, 'RequestId is required'),
});

export const CollectionsGetRequestCommentsOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number().int().optional(),
				threadId: z.number().int().optional(),
				status: z.enum(['Open', 'Resolved']).optional(),
				createdBy: z.number().int().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				body: z.string().optional(),
			}),
		)
		.optional(),
});

export const CollectionsGetRequestInputSchema = z.object({
	requestId: z.string().min(1, 'RequestId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
	ids: z.boolean().optional(),
	uid: z.boolean().optional(),
	populate: z.boolean().optional(),
});

export const CollectionsGetRequestOutputSchema = z.object({
	model_id: z.string().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	data: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			owner: z.string().optional(),
			lastRevision: z.number().int().optional(),
			lastUpdatedBy: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
		})
		.optional(),
});

export const CollectionsGetResponseCommentsInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	responseId: z.string().min(1, 'ResponseId is required'),
});

export const CollectionsGetResponseCommentsOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number().int().optional(),
				threadId: z.number().int().optional(),
				status: z.enum(['Open', 'Resolved']).optional(),
				createdBy: z.number().int().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				body: z.string().optional(),
			}),
		)
		.optional(),
});

export const CollectionsGetResponseInputSchema = z.object({
	responseId: z.string().min(1, 'ResponseId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
	ids: z.boolean().optional(),
	uid: z.boolean().optional(),
	populate: z.boolean().optional(),
});

export const CollectionsGetResponseOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			request: z.string().optional(),
			name: z.string().optional(),
			owner: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			lastRevision: z.number().int().optional(),
			lastUpdatedBy: z.string().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
});

export const CollectionsGetSourceStatusInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsGetSourceStatusOutputSchema = z.object({
	collection: z
		.object({
			collectionUid: z
				.object({
					isSourceAhead: z.boolean().optional(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsCreateInputSchema = z.object({
	workspace: z.string(),
	collection: z
		.object({
			info: z.object({
				name: z.string(),
				description: z.string().optional(),
				schema: z.enum([
					'https://schema.postman.com/json/collection/v2.1.0/collection.json',
				]),
			}),
			item: z.array(
				z.object({
					name: z.string().optional(),
					description: z.string().nullable().optional(),
					variable: z.array(z.unknown()).optional(),
					event: z.array(z.unknown()).optional(),
					request: z
						.object({
							url: z.unknown().optional(),
							auth: z.unknown().optional(),
							method: z.string().optional(),
							description: z.string().nullable().optional(),
							header: z.array(z.unknown()).optional(),
							body: z.unknown().optional(),
						})
						.optional(),
					response: z.array(z.unknown()).optional(),
					protocolProfileBehavior: z
						.object({
							strictSSL: z.boolean().optional(),
							followRedirects: z.boolean().optional(),
							maxRedirects: z.number().optional(),
							disableBodyPruning: z.boolean().optional(),
							disableUrlEncoding: z.boolean().optional(),
							disabledSystemHeaders: z.unknown().optional(),
							insecureHTTPParser: z.boolean().optional(),
							followOriginalHttpMethod: z.boolean().optional(),
							followAuthorizationHeader: z.boolean().optional(),
							protocolVersion: z.enum(['http1', 'http2', 'auto']).optional(),
							removeRefererHeaderOnRedirect: z.boolean().optional(),
							tlsPreferServerCiphers: z.boolean().optional(),
							tlsDisabledProtocols: z.array(z.string()).optional(),
							tlsCipherSelection: z.array(z.string()).optional(),
						})
						.optional(),
				}),
			),
			event: z
				.array(
					z.object({
						listen: z.enum(['test', 'prerequest']),
						script: z
							.object({
								type: z.string().optional(),
								exec: z.array(z.string()).optional(),
							})
							.optional(),
					}),
				)
				.optional(),
			variable: z
				.array(
					z.object({
						key: z.string().optional(),
						value: z
							.union([z.string(), z.boolean(), z.number().int()])
							.optional(),
						description: z.string().optional(),
						disabled: z.boolean().optional(),
					}),
				)
				.optional(),
			auth: z
				.object({
					type: z.enum([
						'noauth',
						'basic',
						'bearer',
						'apikey',
						'digest',
						'oauth1',
						'oauth2',
						'hawk',
						'awsv4',
						'ntlm',
						'edgegrid',
					]),
					noauth: z.unknown().optional(),
					apikey: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					awsv4: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					basic: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					bearer: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					digest: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					edgegrid: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					hawk: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					ntlm: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					oauth1: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					oauth2: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
				})
				.optional(),
			protocolProfileBehavior: z
				.object({
					strictSSL: z.boolean().optional(),
					followRedirects: z.boolean().optional(),
					maxRedirects: z.number().optional(),
					disableBodyPruning: z.boolean().optional(),
					disableUrlEncoding: z.boolean().optional(),
					disabledSystemHeaders: z
						.object({
							'cache-control': z.boolean().optional(),
							'postman-token': z.boolean().optional(),
							'content-type': z.boolean().optional(),
							'content-length': z.boolean().optional(),
							'accept-encoding': z.boolean().optional(),
							connection: z.boolean().optional(),
							host: z.boolean().optional(),
						})
						.optional(),
					insecureHTTPParser: z.boolean().optional(),
					followOriginalHttpMethod: z.boolean().optional(),
					followAuthorizationHeader: z.boolean().optional(),
					protocolVersion: z.enum(['http1', 'http2', 'auto']).optional(),
					removeRefererHeaderOnRedirect: z.boolean().optional(),
					tlsPreferServerCiphers: z.boolean().optional(),
					tlsDisabledProtocols: z.array(z.string()).optional(),
					tlsCipherSelection: z.array(z.string()).optional(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsCreateOutputSchema = z.object({
	collection: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const CollectionsCreateCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	body: z.string(),
	threadId: z.number().int().optional(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsCreateCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const CollectionsCreateFolderInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	name: z.string().optional(),
	folder: z.string().optional(),
});

export const CollectionsCreateFolderOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			order: z.array(z.string()).optional(),
			owner: z.string().optional(),
			folder: z.string().nullable().optional(),
			folders: z.array(z.string()).optional(),
			requests: z.array(z.string()).optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			collection: z.string().optional(),
			description: z.string().optional(),
			folders_order: z.array(z.string()).optional(),
			lastUpdatedBy: z.string().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
	revision: z.number().optional(),
});

export const CollectionsCreateFolderCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	folderId: z.string().min(1, 'FolderId is required'),
	body: z.string(),
	threadId: z.number().int().optional(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsCreateFolderCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const CollectionsCreatePullRequestInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	title: z.string(),
	description: z.string().optional(),
	reviewers: z.array(z.string()),
	destinationId: z.string(),
});

export const CollectionsCreatePullRequestOutputSchema = z.object({
	createdAt: z.string().optional(),
	createdBy: z.string().optional(),
	description: z.string().optional(),
	destinationId: z.string().optional(),
	id: z.string().optional(),
	sourceId: z.string().optional(),
	status: z.string().optional(),
	title: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const CollectionsCreateRequestCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	requestId: z.string().min(1, 'RequestId is required'),
	body: z.string(),
	threadId: z.number().int().optional(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsCreateRequestCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const CollectionsCreateResponseInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	request: z.string(),
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	method: z
		.enum([
			'GET',
			'PUT',
			'POST',
			'PATCH',
			'DELETE',
			'COPY',
			'HEAD',
			'OPTIONS',
			'LINK',
			'UNLINK',
			'PURGE',
			'LOCK',
			'UNLOCK',
			'PROPFIND',
			'VIEW',
		])
		.optional(),
	headers: z
		.array(
			z.object({
				key: z.string(),
				value: z.string(),
				description: z.string().nullable().optional(),
			}),
		)
		.optional(),
	dataMode: z
		.enum(['raw', 'urlencoded', 'formdata', 'binary', 'graphql'])
		.optional(),
	rawModeData: z.string().nullable().optional(),
	dataOptions: z
		.object({
			raw: z
				.object({
					language: z.string().optional(),
				})
				.optional(),
			urlencoded: z.record(z.string(), z.unknown()).optional(),
			params: z.record(z.string(), z.unknown()).optional(),
			binary: z.record(z.string(), z.unknown()).optional(),
			graphql: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
	responseCode: z
		.object({
			code: z.number().optional(),
			name: z.string().optional(),
		})
		.optional(),
	status: z.string().nullable().optional(),
	time: z.string().optional(),
	cookies: z.string().nullable().optional(),
	mime: z.string().nullable().optional(),
	text: z.string().optional(),
	language: z.string().optional(),
	rawDataType: z.string().nullable().optional(),
	requestObject: z.string().optional(),
});

export const CollectionsCreateResponseOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			owner: z.string().optional(),
			request: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			lastUpdatedBy: z.string().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
	revision: z.number().optional(),
});

export const CollectionsCreateResponseCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	responseId: z.string().min(1, 'ResponseId is required'),
	body: z.string(),
	threadId: z.number().int().optional(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsCreateResponseCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const CollectionsRemoveInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsRemoveOutputSchema = z.object({
	collection: z
		.object({
			id: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const CollectionsDeleteFolderInputSchema = z.object({
	folderId: z.string().min(1, 'FolderId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsDeleteFolderOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			owner: z.string().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
	revision: z.number().optional(),
});

export const CollectionsDeleteFolderCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	folderId: z.string().min(1, 'FolderId is required'),
	commentId: z.number().int(),
});

export const CollectionsDeleteFolderCommentOutputSchema = z
	.unknown()
	.optional();

export const CollectionsDeleteRequestCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	requestId: z.string().min(1, 'RequestId is required'),
	commentId: z.number().int(),
});

export const CollectionsDeleteRequestCommentOutputSchema = z
	.unknown()
	.optional();

export const CollectionsDeleteResponseInputSchema = z.object({
	responseId: z.string().min(1, 'ResponseId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsDeleteResponseOutputSchema = z.object({
	model_id: z.string().optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	data: z
		.object({
			id: z.string().optional(),
			owner: z.string().optional(),
		})
		.optional(),
	revision: z.number().optional(),
});

export const CollectionsDeleteResponseCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	responseId: z.string().min(1, 'ResponseId is required'),
	commentId: z.number().int(),
});

export const CollectionsDeleteResponseCommentOutputSchema = z
	.unknown()
	.optional();

export const CollectionsDeleteCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	commentId: z.number().int(),
});

export const CollectionsDeleteCommentOutputSchema = z.unknown().optional();

export const CollectionsDuplicateInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	workspace: z.string(),
	suffix: z.string().optional(),
});

export const CollectionsDuplicateOutputSchema = z.object({
	task: z
		.object({
			id: z.string().optional(),
			status: z.enum(['processing', 'completed', 'failed']).optional(),
			reason: z.string().nullable().optional(),
		})
		.optional(),
});

export const CollectionsForkInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	workspace: z.string(),
	label: z.string(),
});

export const CollectionsForkOutputSchema = z.object({
	collection: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			fork: z
				.object({
					label: z.string().optional(),
					createdAt: z.string().optional(),
					from: z.string().optional(),
				})
				.optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const CollectionsGenerateSpecInputSchema = z.object({
	collectionUid: z.string().min(1, 'CollectionUid is required'),
	elementType: z.enum(['spec']),
	name: z.string(),
	type: z.enum(['OPENAPI:2.0', 'OPENAPI:3.0', 'OPENAPI:3.1']).optional(),
	format: z.enum(['JSON', 'YAML']).optional(),
});

export const CollectionsGenerateSpecOutputSchema = z.object({
	taskId: z.string().optional(),
	url: z.string().optional(),
});

export const CollectionsCreateRequestInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	folder: z.string().optional(),
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	method: z
		.enum([
			'GET',
			'PUT',
			'POST',
			'PATCH',
			'DELETE',
			'COPY',
			'HEAD',
			'OPTIONS',
			'LINK',
			'UNLINK',
			'PURGE',
			'LOCK',
			'UNLOCK',
			'PROPFIND',
			'VIEW',
		])
		.optional(),
	url: z.string().nullable().optional(),
	headerData: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
	queryParams: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
				description: z.string().optional(),
				enabled: z.boolean().optional(),
			}),
		)
		.optional(),
	dataMode: z
		.enum(['raw', 'urlencoded', 'formdata', 'binary', 'graphql'])
		.optional(),
	data: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
				description: z.string().optional(),
				enabled: z.boolean().optional(),
				type: z.enum(['text', 'file']).optional(),
				uuid: z.string().optional(),
			}),
		)
		.optional(),
	rawModeData: z.string().nullable().optional(),
	graphqlModeData: z
		.object({
			query: z.string().optional(),
			variables: z.string().optional(),
		})
		.optional(),
	dataOptions: z
		.object({
			raw: z
				.object({
					language: z.string().optional(),
				})
				.optional(),
			urlencoded: z.record(z.string(), z.unknown()).optional(),
			params: z.record(z.string(), z.unknown()).optional(),
			binary: z.record(z.string(), z.unknown()).optional(),
			graphql: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
	auth: z
		.object({
			type: z.enum([
				'basic',
				'bearer',
				'apikey',
				'digest',
				'oauth1',
				'oauth2',
				'hawk',
				'awsv4',
				'ntlm',
				'edgegrid',
				'jwt',
				'asap',
				'noauth',
			]),
			apikey: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			awsv4: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			basic: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			bearer: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			digest: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			edgegrid: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			hawk: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			ntlm: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			oauth1: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			oauth2: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			jwt: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			asap: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	events: z
		.array(
			z.object({
				listen: z.enum(['test', 'prerequest']).optional(),
				script: z
					.object({
						id: z.string().optional(),
						type: z.string().optional(),
						exec: z.array(z.string()).optional(),
					})
					.optional(),
			}),
		)
		.optional(),
});

export const CollectionsCreateRequestOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			owner: z.string().optional(),
			folder: z.string().nullable().optional(),
			responses: z.array(z.string()).optional(),
			collection: z.string().optional(),
			responses_order: z.array(z.string()).optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			lastUpdatedBy: z.string().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
	revision: z.number().optional(),
});

export const CollectionsMergeForkInputSchema = z.object({
	destination: z.string(),
	source: z.string(),
	strategy: z.enum(['deleteSource', 'updateSourceWithDestination']).optional(),
});

export const CollectionsMergeForkOutputSchema = z.object({
	collection: z
		.object({
			id: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const CollectionsPullChangesInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsPullChangesOutputSchema = z.object({
	collection: z
		.object({
			destinationId: z.string().optional(),
			sourceId: z.string().optional(),
		})
		.optional(),
});

export const CollectionsReplaceInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	collection: z
		.object({
			info: z.object({
				name: z.string(),
				_postman_id: z.string().optional(),
				description: z.string().optional(),
				schema: z.enum([
					'https://schema.postman.com/json/collection/v2.1.0/collection.json',
				]),
				updatedAt: z.string().optional(),
				createdAt: z.string().optional(),
				lastUpdatedBy: z.string().optional(),
				uid: z.string().optional(),
			}),
			item: z.array(
				z.object({
					id: z.string(),
					name: z.string().optional(),
					description: z.string().nullable().optional(),
					variable: z.array(z.unknown()).optional(),
					event: z.array(z.unknown()).optional(),
					request: z
						.object({
							url: z.unknown().optional(),
							auth: z.unknown().optional(),
							method: z.string().optional(),
							description: z.string().nullable().optional(),
							header: z.array(z.unknown()).optional(),
							body: z.unknown().optional(),
						})
						.optional(),
					response: z.array(z.unknown()).optional(),
					protocolProfileBehavior: z
						.object({
							strictSSL: z.boolean().optional(),
							followRedirects: z.boolean().optional(),
							maxRedirects: z.number().optional(),
							disableBodyPruning: z.boolean().optional(),
							disableUrlEncoding: z.boolean().optional(),
							disabledSystemHeaders: z.unknown().optional(),
							insecureHTTPParser: z.boolean().optional(),
							followOriginalHttpMethod: z.boolean().optional(),
							followAuthorizationHeader: z.boolean().optional(),
							protocolVersion: z.enum(['http1', 'http2', 'auto']).optional(),
							removeRefererHeaderOnRedirect: z.boolean().optional(),
							tlsPreferServerCiphers: z.boolean().optional(),
							tlsDisabledProtocols: z.array(z.string()).optional(),
							tlsCipherSelection: z.array(z.string()).optional(),
						})
						.optional(),
					createdAt: z.string().optional(),
					updatedAt: z.string().optional(),
					uid: z.string().optional(),
				}),
			),
			event: z
				.array(
					z.object({
						id: z.string().optional(),
						listen: z.enum(['test', 'prerequest']),
						script: z
							.object({
								id: z.string().optional(),
								type: z.string().optional(),
								exec: z.array(z.string()).optional(),
							})
							.optional(),
					}),
				)
				.optional(),
			variable: z
				.array(
					z.union([
						z.object({
							key: z.string().optional(),
							value: z
								.union([z.string(), z.boolean(), z.number().int()])
								.optional(),
							disabled: z.boolean().optional(),
						}),
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							secret: z.boolean().optional(),
							source: z
								.object({
									postman: z.unknown().optional(),
									provider: z.enum(['postman']).optional(),
								})
								.optional(),
							description: z.string().optional(),
						}),
					]),
				)
				.optional(),
			auth: z
				.object({
					type: z.enum([
						'basic',
						'bearer',
						'apikey',
						'digest',
						'oauth1',
						'oauth2',
						'hawk',
						'awsv4',
						'ntlm',
						'edgegrid',
						'jwt',
						'asap',
					]),
					apikey: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					awsv4: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					basic: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					bearer: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					digest: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					edgegrid: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					hawk: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					ntlm: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					oauth1: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					oauth2: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					jwt: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
					asap: z
						.array(
							z.object({
								key: z.string(),
								value: z.union([z.string(), z.array(z.unknown())]).optional(),
								type: z
									.enum([
										'string',
										'boolean',
										'number',
										'array',
										'object',
										'any',
									])
									.optional(),
							}),
						)
						.optional(),
				})
				.optional(),
			protocolProfileBehavior: z
				.object({
					strictSSL: z.boolean().optional(),
					followRedirects: z.boolean().optional(),
					maxRedirects: z.number().optional(),
					disableBodyPruning: z.boolean().optional(),
					disableUrlEncoding: z.boolean().optional(),
					disabledSystemHeaders: z
						.object({
							'cache-control': z.boolean().optional(),
							'postman-token': z.boolean().optional(),
							'content-type': z.boolean().optional(),
							'content-length': z.boolean().optional(),
							'accept-encoding': z.boolean().optional(),
							connection: z.boolean().optional(),
							host: z.boolean().optional(),
						})
						.optional(),
					insecureHTTPParser: z.boolean().optional(),
					followOriginalHttpMethod: z.boolean().optional(),
					followAuthorizationHeader: z.boolean().optional(),
					protocolVersion: z.enum(['http1', 'http2', 'auto']).optional(),
					removeRefererHeaderOnRedirect: z.boolean().optional(),
					tlsPreferServerCiphers: z.boolean().optional(),
					tlsDisabledProtocols: z.array(z.string()).optional(),
					tlsCipherSelection: z.array(z.string()).optional(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsReplaceOutputSchema = z.object({
	collection: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const CollectionsSyncWithSchemaInputSchema = z.object({
	apiId: z.string().min(1, 'ApiId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
});

export const CollectionsSyncWithSchemaOutputSchema = z.object({
	taskId: z.string().optional(),
});

export const CollectionsSyncWithSpecInputSchema = z.object({
	collectionUid: z.string().min(1, 'CollectionUid is required'),
	specId: z.string(),
});

export const CollectionsSyncWithSpecOutputSchema = z.object({
	taskId: z.string().optional(),
	url: z.string().optional(),
});

export const CollectionsTransferFoldersInputSchema = z.object({
	ids: z.array(z.string()),
	mode: z.enum(['copy', 'move']),
	target: z.object({
		id: z.string(),
		model: z.enum(['collection', 'folder', 'request']),
	}),
	location: z.object({
		id: z.string().nullable().optional(),
		model: z.string().nullable().optional(),
		position: z.enum(['start', 'end', 'before', 'after']),
	}),
});

export const CollectionsTransferFoldersOutputSchema = z.object({
	ids: z.array(z.string()).optional(),
});

export const CollectionsTransformToOpenapiInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	format: z.enum(['json', 'yaml']).optional(),
});

export const CollectionsTransformToOpenapiOutputSchema = z.object({
	output: z.string().optional(),
});

export const CollectionsUpdateInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	collection: z.unknown().optional(),
});

export const CollectionsUpdateOutputSchema = z.object({
	collection: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),
});

export const CollectionsUpdateRequestInputSchema = z.object({
	requestId: z.string().min(1, 'RequestId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	method: z
		.enum([
			'GET',
			'PUT',
			'POST',
			'PATCH',
			'DELETE',
			'COPY',
			'HEAD',
			'OPTIONS',
			'LINK',
			'UNLINK',
			'PURGE',
			'LOCK',
			'UNLOCK',
			'PROPFIND',
			'VIEW',
		])
		.optional(),
	url: z.string().nullable().optional(),
	headerData: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
	queryParams: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
				description: z.string().optional(),
				enabled: z.boolean().optional(),
			}),
		)
		.optional(),
	dataMode: z
		.enum(['raw', 'urlencoded', 'formdata', 'binary', 'graphql'])
		.optional(),
	data: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
				description: z.string().optional(),
				enabled: z.boolean().optional(),
				type: z.enum(['text', 'file']).optional(),
				uuid: z.string().optional(),
			}),
		)
		.optional(),
	rawModeData: z.string().nullable().optional(),
	graphqlModeData: z
		.object({
			query: z.string().optional(),
			variables: z.string().optional(),
		})
		.optional(),
	dataOptions: z
		.object({
			raw: z
				.object({
					language: z.string().optional(),
				})
				.optional(),
			urlencoded: z.record(z.string(), z.unknown()).optional(),
			params: z.record(z.string(), z.unknown()).optional(),
			binary: z.record(z.string(), z.unknown()).optional(),
			graphql: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
	auth: z
		.object({
			type: z.enum([
				'basic',
				'bearer',
				'apikey',
				'digest',
				'oauth1',
				'oauth2',
				'hawk',
				'awsv4',
				'ntlm',
				'edgegrid',
				'jwt',
				'asap',
				'noauth',
			]),
			apikey: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			awsv4: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			basic: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			bearer: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			digest: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			edgegrid: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			hawk: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			ntlm: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			oauth1: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			oauth2: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			jwt: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
			asap: z
				.array(
					z.object({
						key: z.string(),
						value: z.union([z.string(), z.array(z.unknown())]).optional(),
						type: z
							.enum(['string', 'boolean', 'number', 'array', 'object', 'any'])
							.optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	events: z
		.array(
			z.object({
				listen: z.enum(['test', 'prerequest']).optional(),
				script: z
					.object({
						id: z.string().optional(),
						type: z.string().optional(),
						exec: z.array(z.string()).optional(),
					})
					.optional(),
			}),
		)
		.optional(),
});

export const CollectionsUpdateRequestOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			owner: z.string().optional(),
			lastUpdatedBy: z.string().optional(),
			lastRevision: z.number().int().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
	revision: z.number().optional(),
});

export const CollectionsUpdateFolderInputSchema = z.object({
	folderId: z.string().min(1, 'FolderId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
	name: z.string().optional(),
	description: z.string().optional(),
});

export const CollectionsUpdateFolderOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			owner: z.string().optional(),
			lastUpdatedBy: z.string().optional(),
			lastRevision: z.number().int().optional(),
			collection: z.string().optional(),
			folder: z.string().nullable().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
	revision: z.number().optional(),
});

export const CollectionsUpdateFolderCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	folderId: z.string().min(1, 'FolderId is required'),
	commentId: z.number().int(),
	body: z.string(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsUpdateFolderCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const CollectionsUpdateRequestCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	requestId: z.string().min(1, 'RequestId is required'),
	commentId: z.number().int(),
	body: z.string(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsUpdateRequestCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const CollectionsUpdateResponseInputSchema = z.object({
	responseId: z.string().min(1, 'ResponseId is required'),
	collectionId: z.string().min(1, 'CollectionId is required'),
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	method: z
		.enum([
			'GET',
			'PUT',
			'POST',
			'PATCH',
			'DELETE',
			'COPY',
			'HEAD',
			'OPTIONS',
			'LINK',
			'UNLINK',
			'PURGE',
			'LOCK',
			'UNLOCK',
			'PROPFIND',
			'VIEW',
		])
		.optional(),
	headers: z
		.array(
			z.object({
				key: z.string(),
				value: z.string(),
				description: z.string().nullable().optional(),
			}),
		)
		.optional(),
	dataMode: z
		.enum(['raw', 'urlencoded', 'formdata', 'binary', 'graphql'])
		.optional(),
	rawModeData: z.string().nullable().optional(),
	dataOptions: z
		.object({
			raw: z
				.object({
					language: z.string().optional(),
				})
				.optional(),
			urlencoded: z.record(z.string(), z.unknown()).optional(),
			params: z.record(z.string(), z.unknown()).optional(),
			binary: z.record(z.string(), z.unknown()).optional(),
			graphql: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
	responseCode: z
		.object({
			code: z.number().optional(),
			name: z.string().optional(),
		})
		.optional(),
	status: z.string().nullable().optional(),
	time: z.string().optional(),
	cookies: z.string().nullable().optional(),
	mime: z.string().nullable().optional(),
	text: z.string().optional(),
	language: z.string().optional(),
	rawDataType: z.string().nullable().optional(),
	requestObject: z.string().optional(),
});

export const CollectionsUpdateResponseOutputSchema = z.object({
	data: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			owner: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			lastRevision: z.number().int().optional(),
			lastUpdatedBy: z.string().optional(),
		})
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	model_id: z.string().optional(),
});

export const CollectionsUpdateResponseCommentInputSchema = z.object({
	collectionId: z.string().min(1, 'CollectionId is required'),
	responseId: z.string().min(1, 'ResponseId is required'),
	commentId: z.number().int(),
	body: z.string(),
	tags: z
		.object({
			'{{userName}}': z
				.object({
					type: z.enum(['user']),
					id: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const CollectionsUpdateResponseCommentOutputSchema = z.object({
	data: z
		.object({
			id: z.number().int().optional(),
			threadId: z.number().int().optional(),
			createdBy: z.number().int().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			body: z.string().optional(),
		})
		.optional(),
});

// Groups
export const GroupsListInputSchema = z.object({}).optional();

export const GroupsListOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number().optional(),
				teamId: z.number().optional(),
				name: z.string().optional(),
				summary: z.string().optional(),
				createdBy: z.number().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				members: z.array(z.number()).optional(),
				roles: z.array(z.string()).optional(),
			}),
		)
		.optional(),
});

// Mocks
export const MocksListInputSchema = z.object({
	teamId: z.string().optional(),
	workspace: z.string().optional(),
});

export const MocksListOutputSchema = z.object({
	mocks: z
		.array(
			z.object({
				id: z.string().optional(),
				owner: z.string().optional(),
				uid: z.string().optional(),
				collection: z.string().optional(),
				mockUrl: z.string().optional(),
				name: z.string().optional(),
				config: z
					.object({
						delay: z.unknown().optional(),
						headers: z.array(z.string()).optional(),
						matchBody: z.boolean().optional(),
						matchHeader: z.boolean().optional(),
						matchQueryParams: z.boolean().optional(),
						matchWildcards: z.boolean().optional(),
						serverResponseId: z.string().nullable().optional(),
					})
					.optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				isPublic: z.boolean().optional(),
				deactivated: z.boolean().optional(),
				environment: z.string().optional(),
			}),
		)
		.optional(),
});

export const MocksCreateInputSchema = z.object({
	workspace: z.string(),
	mock: z
		.object({
			collection: z.string(),
			environment: z.string().optional(),
			name: z.string().optional(),
			private: z.boolean().optional(),
		})
		.optional(),
});

export const MocksCreateOutputSchema = z.object({
	mock: z
		.object({
			id: z.string().optional(),
			owner: z.string().optional(),
			uid: z.string().optional(),
			collection: z.string().optional(),
			mockUrl: z.string().optional(),
			name: z.string().optional(),
			config: z
				.object({
					delay: z
						.object({
							type: z.enum(['fixed']).optional(),
							preset: z.enum(['1', '2']).optional(),
							duration: z.number().int().optional(),
						})
						.optional(),
					headers: z.array(z.string()).optional(),
					matchBody: z.boolean().optional(),
					matchHeader: z.boolean().optional(),
					matchQueryParams: z.boolean().optional(),
					matchWildcards: z.boolean().optional(),
					serverResponseId: z.string().nullable().optional(),
				})
				.optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			environment: z.string().optional(),
		})
		.optional(),
});

export const MocksDeleteServerResponseInputSchema = z.object({
	mockId: z.string().min(1, 'MockId is required'),
	serverResponseId: z.string().min(1, 'ServerResponseId is required'),
});

export const MocksDeleteServerResponseOutputSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	statusCode: z.number().optional(),
	headers: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
			}),
		)
		.optional(),
	language: z.enum(['text', 'javascript', 'json', 'html', 'xml']).optional(),
	body: z.string().optional(),
	createdBy: z.string().optional(),
	updatedBy: z.string().optional(),
	createdAt: z.string().optional(),
});

export const MocksCreateServerResponseInputSchema = z.object({
	mockId: z.string().min(1, 'MockId is required'),
	serverResponse: z
		.object({
			name: z.string(),
			statusCode: z.number().int(),
			headers: z
				.array(
					z.object({
						key: z.string().optional(),
						value: z.string().optional(),
					}),
				)
				.optional(),
			language: z
				.enum(['text', 'javascript', 'json', 'html', 'xml'])
				.optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const MocksCreateServerResponseOutputSchema = z.object({
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	statusCode: z.number().optional(),
	headers: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
			}),
		)
		.optional(),
	language: z.enum(['text', 'javascript', 'json', 'html', 'xml']).optional(),
	body: z.string().optional(),
	createdBy: z.string().optional(),
	updatedBy: z.string().optional(),
	mock: z.string().optional(),
});

export const MocksPublishInputSchema = z.object({
	mockId: z.string().min(1, 'MockId is required'),
});

export const MocksPublishOutputSchema = z.object({
	mock: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
});

export const MocksUpdateInputSchema = z.object({
	mockId: z.string().min(1, 'MockId is required'),
	mock: z
		.object({
			name: z.string().optional(),
			environment: z.string().optional(),
			description: z.string().optional(),
			private: z.boolean().optional(),
			versionTag: z.string().optional(),
			collection: z.string().optional(),
			config: z
				.object({
					serverResponseId: z.string().nullable().optional(),
				})
				.optional(),
		})
		.optional(),
});

export const MocksUpdateOutputSchema = z.object({
	mock: z
		.object({
			id: z.string().optional(),
			owner: z.string().optional(),
			uid: z.string().optional(),
			collection: z.string().optional(),
			mockUrl: z.string().optional(),
			name: z.string().optional(),
			config: z
				.object({
					delay: z
						.object({
							type: z.enum(['fixed']).optional(),
							preset: z.enum(['1', '2']).optional(),
							duration: z.number().int().optional(),
						})
						.optional(),
					headers: z.array(z.string()).optional(),
					matchBody: z.boolean().optional(),
					matchHeader: z.boolean().optional(),
					matchQueryParams: z.boolean().optional(),
					matchWildcards: z.boolean().optional(),
					serverResponseId: z.string().nullable().optional(),
				})
				.optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			environment: z.string().optional(),
		})
		.optional(),
});

export const MocksUpdateServerResponseInputSchema = z.object({
	mockId: z.string().min(1, 'MockId is required'),
	serverResponseId: z.string().min(1, 'ServerResponseId is required'),
	serverResponse: z
		.object({
			name: z.string().optional(),
			statusCode: z.number().int().optional(),
			headers: z
				.array(
					z.object({
						key: z.string().optional(),
						value: z.string().optional(),
					}),
				)
				.optional(),
			language: z
				.enum(['text', 'javascript', 'json', 'html', 'xml'])
				.optional(),
			body: z.string().optional(),
		})
		.optional(),
});

export const MocksUpdateServerResponseOutputSchema = z.object({
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	statusCode: z.number().optional(),
	headers: z
		.array(
			z.object({
				key: z.string().optional(),
				value: z.string().optional(),
			}),
		)
		.optional(),
	language: z.enum(['text', 'javascript', 'json', 'html', 'xml']).optional(),
	body: z.string().optional(),
	createdBy: z.string().optional(),
	updatedBy: z.string().optional(),
	mock: z.string().optional(),
});

// Monitors
export const MonitorsListInputSchema = z.object({
	workspace: z.string().optional(),
	active: z.boolean().optional(),
	owner: z.number().int().optional(),
	collectionUid: z.string().optional(),
	environmentUid: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().int().optional(),
});

export const MonitorsListOutputSchema = z.object({
	monitors: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				active: z.boolean().optional(),
				uid: z.string().optional(),
				owner: z.number().int().optional(),
				collectionUid: z.string().optional(),
				environmentUid: z.string().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().nullable().optional(),
			limit: z.number().int().optional(),
		})
		.optional(),
});

export const MonitorsGetInputSchema = z.object({
	monitorId: z.string().min(1, 'MonitorId is required'),
});

export const MonitorsGetOutputSchema = z.object({
	monitor: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			uid: z.string().optional(),
			owner: z.number().int().optional(),
			active: z.boolean().optional(),
			notificationLimit: z.number().optional(),
			collectionUid: z.string().optional(),
			environmentUid: z.string().optional(),
			jobId: z.string().optional(),
			options: z
				.object({
					followRedirects: z.boolean().optional(),
					requestDelay: z.number().optional(),
					requestTimeout: z.number().optional(),
					strictSSL: z.boolean().optional(),
				})
				.optional(),
			notifications: z
				.object({
					onError: z.array(z.unknown()).optional(),
					onFailure: z.array(z.unknown()).optional(),
				})
				.optional(),
			distribution: z
				.array(
					z.object({
						region: z
							.enum([
								'us-east',
								'us-west',
								'ap-southeast',
								'ca-central',
								'eu-central',
								'sa-east',
								'uk',
								'us-east-staticip',
								'us-west-staticip',
							])
							.optional(),
					}),
				)
				.optional(),
			schedule: z
				.object({
					cron: z.string().optional(),
					nextRun: z.string().optional(),
					timezone: z.string().optional(),
				})
				.optional(),
			retry: z
				.object({
					attempts: z.number().optional(),
				})
				.optional(),
			lastRun: z
				.object({
					status: z.string().optional(),
					startedAt: z.string().optional(),
					finishedAt: z.string().optional(),
					stats: z
						.object({
							assertions: z.unknown().optional(),
							requests: z.unknown().optional(),
							runCount: z.number().int().optional(),
							errorCount: z.number().int().optional(),
							abortedCount: z.number().int().optional(),
							responseLatency: z.number().int().optional(),
							responseSize: z.number().int().optional(),
						})
						.optional(),
				})
				.optional(),
		})
		.optional(),
});

export const MonitorsCreateInputSchema = z.object({
	workspace: z.string(),
	monitor: z
		.object({
			name: z.string(),
			active: z.boolean().optional(),
			notificationLimit: z.number().optional(),
			collection: z.string(),
			environment: z.string().optional(),
			retry: z
				.object({
					attempts: z.number().optional(),
				})
				.optional(),
			options: z
				.object({
					followRedirects: z.boolean().optional(),
					requestDelay: z.number().optional(),
					requestTimeout: z.number().optional(),
					strictSSL: z.boolean().optional(),
				})
				.optional(),
			schedule: z.object({
				cron: z.string().optional(),
				timezone: z.string().optional(),
			}),
			distribution: z
				.array(
					z.object({
						region: z
							.enum([
								'us-east',
								'us-west',
								'ap-southeast',
								'ca-central',
								'eu-central',
								'sa-east',
								'uk',
								'us-east-staticip',
								'us-west-staticip',
							])
							.optional(),
					}),
				)
				.optional(),
			notifications: z
				.object({
					onError: z
						.array(
							z.object({
								email: z.string().optional(),
							}),
						)
						.optional(),
					onFailure: z
						.array(
							z.object({
								email: z.string().optional(),
							}),
						)
						.optional(),
				})
				.optional(),
		})
		.optional(),
});

export const MonitorsCreateOutputSchema = z.object({
	monitor: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			active: z.boolean().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const MonitorsRemoveInputSchema = z.object({
	monitorId: z.string().min(1, 'MonitorId is required'),
});

export const MonitorsRemoveOutputSchema = z.object({
	monitor: z
		.object({
			id: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const MonitorsRunInputSchema = z.object({
	monitorId: z.string().min(1, 'MonitorId is required'),
	async: z.boolean().optional(),
});

export const MonitorsRunOutputSchema = z.object({
	run: z
		.object({
			info: z
				.object({
					jobId: z.string().optional(),
					collectionUid: z.string().optional(),
					environmentUid: z.string().optional(),
					monitorId: z.string().optional(),
					name: z.string().optional(),
					status: z.string().optional(),
					startedAt: z.string().optional(),
					finishedAt: z.string().optional(),
				})
				.optional(),
			stats: z
				.object({
					assertions: z
						.object({
							total: z.number().optional(),
							failed: z.number().optional(),
						})
						.optional(),
					requests: z
						.object({
							total: z.number().optional(),
							failed: z.number().optional(),
						})
						.optional(),
					runCount: z.number().int().optional(),
					errorCount: z.number().int().optional(),
					abortedCount: z.number().int().optional(),
					responseLatency: z.number().int().optional(),
					responseSize: z.number().int().optional(),
				})
				.optional(),
			executions: z
				.array(
					z.object({
						id: z.number().optional(),
						item: z.unknown().optional(),
						request: z.unknown().optional(),
						response: z.unknown().optional(),
						errors: z.array(z.unknown()).optional(),
					}),
				)
				.optional(),
			failures: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.optional(),
});

export const MonitorsUpdateInputSchema = z.object({
	monitorId: z.string().min(1, 'MonitorId is required'),
	monitor: z
		.object({
			name: z.string().optional(),
			active: z.boolean().optional(),
			notificationLimit: z.number().optional(),
			retry: z
				.object({
					attempts: z.number().optional(),
				})
				.optional(),
			options: z
				.object({
					followRedirects: z.boolean().optional(),
					requestDelay: z.number().optional(),
					requestTimeout: z.number().optional(),
					strictSSL: z.boolean().optional(),
				})
				.optional(),
			schedule: z
				.object({
					cron: z.string().optional(),
					timezone: z.string().optional(),
				})
				.optional(),
			distribution: z
				.array(
					z.object({
						region: z
							.enum([
								'us-east',
								'us-west',
								'ap-southeast',
								'ca-central',
								'eu-central',
								'sa-east',
								'uk',
								'us-east-staticip',
								'us-west-staticip',
							])
							.optional(),
					}),
				)
				.optional(),
			notifications: z
				.object({
					onError: z
						.array(
							z.object({
								email: z.string().optional(),
							}),
						)
						.optional(),
					onFailure: z
						.array(
							z.object({
								email: z.string().optional(),
							}),
						)
						.optional(),
				})
				.optional(),
		})
		.optional(),
});

export const MonitorsUpdateOutputSchema = z.object({
	monitor: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			active: z.boolean().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

// Users
export const UsersListInputSchema = z.object({
	groupId: z.number().int().optional(),
});

export const UsersListOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				username: z.string().optional(),
				email: z.string().optional(),
				roles: z.array(z.string()).optional(),
				joinedAt: z.string().optional(),
			}),
		)
		.optional(),
});

export const UsersGetInputSchema = z.object({
	userId: z.number().int(),
});

export const UsersGetOutputSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	username: z.string().optional(),
	email: z.string().optional(),
	roles: z.array(z.string()).optional(),
	joinedAt: z.string().optional(),
});

// Workspaces
export const WorkspacesListInputSchema = z.object({
	type: z.enum(['personal', 'team', 'private', 'public', 'partner']).optional(),
	createdBy: z.number().int().optional(),
	include: z.enum(['mocks:deactivated', 'scim']).optional(),
	elementType: z.enum(['collection', 'specification']).optional(),
	elementId: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().int().optional(),
});

export const WorkspacesListOutputSchema = z.object({
	workspaces: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				type: z
					.enum(['personal', 'team', 'private', 'public', 'partner'])
					.optional(),
				visibility: z
					.enum(['personal', 'team', 'private', 'public', 'partner'])
					.optional(),
				createdBy: z.string().optional(),
				about: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				scim: z
					.object({
						createdBy: z.string().optional(),
					})
					.optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().optional(),
		})
		.optional(),
});

export const WorkspacesGetActivityInputSchema = z.object({
	workspaceId: z.string().min(1, 'WorkspaceId is required'),
	userId: z.number().int().optional(),
	elementType: z
		.enum(['collection', 'workspace', 'environment', 'mock', 'monitor'])
		.optional(),
	limit: z.number().int().optional(),
	cursor: z.string().optional(),
});

export const WorkspacesGetActivityOutputSchema = z.object({
	data: z
		.array(
			z.object({
				workspaceId: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				id: z.number().int().optional(),
				user: z
					.object({
						id: z.number().int().optional(),
						username: z.string().optional(),
						isPartner: z.boolean().optional(),
						name: z.string().optional(),
					})
					.optional(),
				action: z.enum(['create', 'update', 'destroy']).optional(),
				elementType: z.string().optional(),
				trigger: z.string().optional(),
				elementId: z.string().optional(),
				elementName: z.string().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().nullable().optional(),
		})
		.optional(),
});

export const WorkspacesGetInputSchema = z.object({
	workspaceId: z.string().min(1, 'WorkspaceId is required'),
	include: z.string().optional(),
});

export const WorkspacesGetOutputSchema = z.object({
	workspace: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			type: z
				.enum(['personal', 'team', 'private', 'public', 'partner'])
				.optional(),
			// Live-verified: the API returns null when no description is set.
			description: z.string().nullable().optional(),
			visibility: z
				.enum(['personal', 'team', 'private', 'public', 'partner'])
				.optional(),
			createdBy: z.string().optional(),
			updatedBy: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			about: z.string().optional(),
			team: z.string().optional(),
			collections: z
				.array(
					z.object({
						id: z.string().optional(),
						name: z.string().optional(),
						uid: z.string().optional(),
					}),
				)
				.optional(),
			environments: z
				.array(
					z.object({
						id: z.string().optional(),
						name: z.string().optional(),
						uid: z.string().optional(),
					}),
				)
				.optional(),
			mocks: z
				.array(
					z.object({
						id: z.string().optional(),
						name: z.string().optional(),
						uid: z.string().optional(),
						deactivated: z.boolean().optional(),
					}),
				)
				.optional(),
			monitors: z
				.array(
					z.object({
						id: z.string().optional(),
						name: z.string().optional(),
						uid: z.string().optional(),
						deactivated: z.boolean().optional(),
					}),
				)
				.optional(),
			specs: z
				.array(
					z.object({
						id: z.string().optional(),
						name: z.string().optional(),
						uid: z.string().optional(),
					}),
				)
				.optional(),
			scim: z
				.object({
					createdBy: z.string().optional(),
					updatedBy: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
});

export const WorkspacesGetGlobalVariablesInputSchema = z.object({
	workspaceId: z.string().min(1, 'WorkspaceId is required'),
});

export const WorkspacesGetGlobalVariablesOutputSchema = z.object({
	values: z
		.array(
			z.object({
				key: z.string().optional(),
				type: z.enum(['default', 'secret']).optional(),
				value: z.string().optional(),
				enabled: z.boolean().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
});

export const WorkspacesGetRolesInputSchema = z.object({
	workspaceId: z.string().min(1, 'WorkspaceId is required'),
	include: z.enum(['scim']).optional(),
});

export const WorkspacesGetRolesOutputSchema = z.object({
	roles: z
		.array(
			z.object({
				id: z.string().optional(),
				user: z.array(z.string()).optional(),
				usergroup: z.array(z.string()).optional(),
				partner: z.array(z.string()).optional(),
				displayName: z.string().optional(),
			}),
		)
		.optional(),
});

export const WorkspacesCreateInputSchema = z.object({
	workspace: z
		.object({
			name: z.string(),
			type: z.enum(['personal', 'private', 'public', 'team', 'partner']),
			description: z.string().optional(),
			about: z.string().optional(),
			teamId: z.string().optional(),
		})
		.optional(),
});

export const WorkspacesCreateOutputSchema = z.object({
	workspace: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});

export const WorkspacesRemoveInputSchema = z.object({
	workspaceId: z.string().min(1, 'WorkspaceId is required'),
});

export const WorkspacesRemoveOutputSchema = z.object({
	workspace: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
});

export const WorkspacesUpdateGlobalVariablesInputSchema = z.object({
	workspaceId: z.string().min(1, 'WorkspaceId is required'),
	values: z
		.array(
			z.object({
				key: z.string().optional(),
				type: z.enum(['default', 'secret']).optional(),
				value: z.string().optional(),
				enabled: z.boolean().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
});

export const WorkspacesUpdateGlobalVariablesOutputSchema = z.object({
	values: z
		.array(
			z.object({
				key: z.string().optional(),
				type: z.enum(['default', 'secret']).optional(),
				value: z.string().optional(),
				enabled: z.boolean().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
});

export const WorkspacesUpdateInputSchema = z.object({
	workspaceId: z.string().min(1, 'WorkspaceId is required'),
	workspace: z
		.object({
			name: z.string().optional(),
			type: z.enum(['private', 'personal', 'team', 'public']).optional(),
			description: z.string().optional(),
			about: z.string().optional(),
		})
		.optional(),
});

export const WorkspacesUpdateOutputSchema = z.object({
	workspace: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});

// Account
export const AccountMeInputSchema = z.object({}).optional();

export const AccountMeOutputSchema = z.object({
	user: z
		.object({
			id: z.number().optional(),
			sub: z.string().optional(),
			username: z.string().optional(),
			email: z.string().optional(),
			fullName: z.string().optional(),
			avatar: z.string().nullable().optional(),
			isPublic: z.boolean().optional(),
			emailVerified: z.boolean().optional(),
			teamId: z.number().int().optional(),
			teamName: z.string().optional(),
			teamDomain: z.string().optional(),
			roles: z.array(z.string()).optional(),
		})
		.optional(),
	operations: z
		.array(
			z.object({
				limit: z.number().optional(),
				name: z.string().optional(),
				overage: z.number().optional(),
				usage: z.number().optional(),
			}),
		)
		.optional(),
});

// Billing
export const BillingGetAccountInputSchema = z.object({}).optional();

export const BillingGetAccountOutputSchema = z.object({
	billingEmail: z.string().optional(),
	id: z.number().int().optional(),
	state: z.string().optional(),
	teamId: z.number().int().optional(),
	salesChannel: z.enum(['SELF_SERVE', 'SALES_SERVE']).optional(),
	slots: z
		.object({
			available: z.number().int().optional(),
			consumed: z.number().int().optional(),
			total: z.number().int().optional(),
			unbilled: z.number().int().optional(),
		})
		.optional(),
});

export const BillingListInvoicesInputSchema = z.object({
	accountId: z.string().min(1, 'AccountId is required'),
	status: z.enum(['PAID']),
});

export const BillingListInvoicesOutputSchema = z.object({
	data: z.array(
		z.object({
			id: z.string().optional(),
			status: z.string().optional(),
			issuedAt: z.string().optional(),
			totalAmount: z
				.object({
					value: z.number().int().optional(),
					currency: z.string().optional(),
				})
				.optional(),
			links: z
				.object({
					web: z.unknown().optional(),
				})
				.optional(),
		}),
	),
});

// AccessKeys
export const AccessKeysListInputSchema = z.object({
	collectionId: z.string().optional(),
	cursor: z.string().optional(),
});

export const AccessKeysListOutputSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.string().optional(),
				token: z.string().optional(),
				status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
				teamId: z.number().int().optional(),
				userId: z.number().int().optional(),
				collectionId: z.string().optional(),
				expiresAfter: z.string().optional(),
				lastUsedAt: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				deletedAt: z.string().nullable().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			nextCursor: z.string().optional(),
			prevCursor: z.string().optional(),
		})
		.optional(),
});

// Environments
export const EnvironmentsGetForksInputSchema = z.object({
	environmentId: z.string().min(1, 'EnvironmentId is required'),
	cursor: z.string().optional(),
	direction: z.enum(['asc', 'desc']).optional(),
	limit: z.number().int().optional(),
	sort: z.enum(['createdAt']).optional(),
});

export const EnvironmentsGetForksOutputSchema = z.object({
	data: z
		.array(
			z.object({
				forkId: z.string().optional(),
				forkName: z.string().optional(),
				createdAt: z.string().optional(),
				createdBy: z.string().optional(),
				updatedAt: z.string().optional(),
			}),
		)
		.optional(),
	meta: z
		.object({
			total: z.number().optional(),
			nextCursor: z.string().nullable().optional(),
		})
		.optional(),
});

export const EnvironmentsGetInputSchema = z.object({
	environmentId: z.string().min(1, 'EnvironmentId is required'),
});

export const EnvironmentsGetOutputSchema = z.object({
	environment: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			owner: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			values: z
				.array(
					z.union([
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							description: z.string().optional(),
						}),
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							secret: z.boolean().optional(),
							source: z.unknown().optional(),
							description: z.string().optional(),
						}),
					]),
				)
				.optional(),
			isPublic: z.boolean().optional(),
		})
		.optional(),
});

export const EnvironmentsCreateInputSchema = z.object({
	workspace: z.string(),
	environment: z
		.object({
			name: z.string(),
			values: z
				.array(
					z.union([
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							description: z.string().optional(),
						}),
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							secret: z.boolean().optional(),
							source: z
								.object({
									postman: z.unknown().optional(),
									provider: z.enum(['postman']).optional(),
								})
								.optional(),
							description: z.string().optional(),
						}),
					]),
				)
				.optional(),
		})
		.optional(),
});

export const EnvironmentsCreateOutputSchema = z.object({
	environment: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const EnvironmentsRemoveInputSchema = z.object({
	environmentId: z.string().min(1, 'EnvironmentId is required'),
});

export const EnvironmentsRemoveOutputSchema = z.object({
	environment: z
		.object({
			id: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const EnvironmentsForkInputSchema = z.object({
	environmentId: z.string().min(1, 'EnvironmentId is required'),
	workspaceId: z.string(),
	forkName: z.string(),
});

export const EnvironmentsForkOutputSchema = z.object({
	environment: z
		.object({
			uid: z.string().optional(),
			name: z.string().optional(),
			forkName: z.string().optional(),
		})
		.optional(),
});

export const EnvironmentsMergeForkInputSchema = z.object({
	environmentId: z.string().min(1, 'EnvironmentId is required'),
	source: z.string(),
	deleteSource: z.boolean().optional(),
});

export const EnvironmentsMergeForkOutputSchema = z.object({
	environment: z
		.object({
			uid: z.string().optional(),
		})
		.optional(),
});

export const EnvironmentsReplaceInputSchema = z.object({
	environmentId: z.string().min(1, 'EnvironmentId is required'),
	environment: z
		.object({
			name: z.string().optional(),
			values: z
				.array(
					z.union([
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							description: z.string().optional(),
						}),
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							secret: z.boolean().optional(),
							source: z
								.object({
									postman: z.unknown().optional(),
									provider: z.enum(['postman']).optional(),
								})
								.optional(),
							description: z.string().optional(),
						}),
					]),
				)
				.optional(),
		})
		.optional(),
});

export const EnvironmentsReplaceOutputSchema = z.object({
	environment: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const EnvironmentsUpdateInputSchema = z.object({
	environmentId: z.string().min(1, 'EnvironmentId is required'),
	body: z
		.union([
			z.array(
				z.object({
					op: z.string(),
					path: z.string(),
					value: z.union([
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							description: z.string().optional(),
						}),
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							secret: z.boolean().optional(),
							source: z
								.object({
									postman: z.unknown().optional(),
									provider: z.enum(['postman']).optional(),
								})
								.optional(),
							description: z.string().optional(),
						}),
					]),
				}),
			),
			z.array(
				z.object({
					op: z.string(),
					path: z.string(),
					value: z.string(),
				}),
			),
			z.array(
				z.object({
					op: z.string(),
					path: z.string(),
					value: z.string(),
				}),
			),
			z.array(
				z.object({
					op: z.string(),
					path: z.string(),
				}),
			),
		])
		.optional(),
});

export const EnvironmentsUpdateOutputSchema = z.object({
	environment: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			owner: z.string().optional(),
			createdAt: z.string().optional(),
			updatedAt: z.string().optional(),
			values: z
				.array(
					z.union([
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							description: z.string().optional(),
						}),
						z.object({
							enabled: z.boolean().optional(),
							key: z.string().optional(),
							value: z.string().optional(),
							type: z.enum(['secret', 'default']).optional(),
							secret: z.boolean().optional(),
							source: z.unknown().optional(),
							description: z.string().optional(),
						}),
					]),
				)
				.optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

export const EnvironmentsListInputSchema = z.object({
	workspace: z.string().optional(),
});

export const EnvironmentsListOutputSchema = z.object({
	environments: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				owner: z.string().optional(),
				uid: z.string().optional(),
				isPublic: z.boolean().optional(),
			}),
		)
		.optional(),
});

// Scim
export const ScimGetResourceTypesInputSchema = z.object({}).optional();

export const ScimGetResourceTypesOutputSchema = z.array(
	z.object({
		schemas: z.array(z.string()).optional(),
		id: z.string().optional(),
		name: z.string().optional(),
		endpoint: z.string().optional(),
		description: z.string().optional(),
		schema: z.string().optional(),
		schemaExtensions: z
			.array(
				z.object({
					schema: z.string().optional(),
					required: z.boolean().optional(),
				}),
			)
			.optional(),
	}),
);

export const ScimGetServiceConfigInputSchema = z.object({}).optional();

export const ScimGetServiceConfigOutputSchema = z.object({
	schemas: z.array(z.string()).optional(),
	documentationUri: z.string().optional(),
	patch: z
		.object({
			supported: z.boolean().optional(),
		})
		.optional(),
	bulk: z
		.object({
			maxOperations: z.number().optional(),
			maxPayloadSize: z.number().optional(),
			supported: z.boolean().optional(),
		})
		.optional(),
	filter: z
		.object({
			maxResults: z.number().optional(),
			supported: z.boolean().optional(),
		})
		.optional(),
	changePassword: z
		.object({
			supported: z.boolean().optional(),
		})
		.optional(),
	sort: z
		.object({
			supported: z.boolean().optional(),
		})
		.optional(),
	authenticationSchemes: z
		.array(
			z.object({
				description: z.string().optional(),
				name: z.string().optional(),
				specUri: z.string().optional(),
				type: z.string().optional(),
			}),
		)
		.optional(),
	etag: z
		.object({
			supported: z.boolean().optional(),
		})
		.optional(),
	meta: z
		.object({
			resourceType: z.string().optional(),
			location: z.string().optional(),
		})
		.optional(),
});

// Webhooks
export const WebhooksCreateInputSchema = z.object({
	workspace: z.string(),
	webhook: z
		.object({
			collection: z.string(),
			environment: z.string().optional(),
			name: z.string(),
		})
		.optional(),
});

export const WebhooksCreateOutputSchema = z.object({
	webhook: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			collection: z.string().optional(),
			webhookUrl: z.string().optional(),
			uid: z.string().optional(),
		})
		.optional(),
});

// Tools
export const ToolsImportOpenapiInputSchema = z.object({
	workspace: z.string(),
	body: z
		.union([
			z.object({
				type: z.enum(['json']),
				input: z.record(z.string(), z.unknown()),
				options: z
					.object({
						requestNameSource: z.enum(['Fallback', 'URL']).optional(),
						indentCharacter: z.enum(['Tab', 'Space']).optional(),
						parametersResolution: z.string().optional(),
						folderStrategy: z.enum(['Paths', 'Tags']).optional(),
						includeAuthInfoInExample: z.boolean().optional(),
						enableOptionalParameters: z.boolean().optional(),
						keepImplicitHeaders: z.boolean().optional(),
						includeDeprecated: z.boolean().optional(),
						alwaysInheritAuthentication: z.boolean().optional(),
						nestedFolderHierarchy: z.boolean().optional(),
					})
					.optional(),
			}),
			z.object({
				type: z.enum(['string']),
				input: z.string(),
				options: z
					.object({
						requestNameSource: z.enum(['Fallback', 'URL']).optional(),
						indentCharacter: z.enum(['Tab', 'Space']).optional(),
						parametersResolution: z.string().optional(),
						folderStrategy: z.enum(['Paths', 'Tags']).optional(),
						includeAuthInfoInExample: z.boolean().optional(),
						enableOptionalParameters: z.boolean().optional(),
						keepImplicitHeaders: z.boolean().optional(),
						includeDeprecated: z.boolean().optional(),
						alwaysInheritAuthentication: z.boolean().optional(),
						nestedFolderHierarchy: z.boolean().optional(),
					})
					.optional(),
			}),
		])
		.optional(),
});

export const ToolsImportOpenapiOutputSchema = z.object({
	collections: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				uid: z.string().optional(),
			}),
		)
		.optional(),
});

// Comments
export const CommentsResolveInputSchema = z.object({
	threadId: z.number().int(),
});

export const CommentsResolveOutputSchema = z.unknown().optional();

// PullRequests
export const PullRequestsReviewInputSchema = z.object({
	pullRequestId: z.string().min(1, 'PullRequestId is required'),
	action: z.enum(['approve', 'decline', 'merge', 'unapprove']),
	comment: z.string().optional(),
});

export const PullRequestsReviewOutputSchema = z.object({
	id: z.string().optional(),
	reviewedBy: z
		.object({
			id: z.number().optional(),
			name: z.string().optional(),
			username: z.string().optional(),
		})
		.optional(),
	status: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const PullRequestsUpdateInputSchema = z.object({
	pullRequestId: z.string().min(1, 'PullRequestId is required'),
	title: z.string(),
	description: z.string().optional(),
	reviewers: z.array(z.string()),
});

export const PullRequestsUpdateOutputSchema = z.object({
	createdAt: z.string().optional(),
	createdBy: z.string().optional(),
	description: z.string().optional(),
	destinationId: z.string().optional(),
	forkType: z.string().optional(),
	id: z.string().optional(),
	sourceId: z.string().optional(),
	status: z.enum(['open', 'approved', 'declined', 'merged']).optional(),
	title: z.string().optional(),
	updatedAt: z.string().optional(),
});

// Aggregate Schemas
export const PostmanEndpointInputSchemas = {
	apisCreateSchema: ApisCreateSchemaInputSchema,
	apisCreateCollectionFromSchema: ApisCreateCollectionFromSchemaInputSchema,
	apisGetComments: ApisGetCommentsInputSchema,
	apisGet: ApisGetInputSchema,
	apisGetSchema: ApisGetSchemaInputSchema,
	specsGet: SpecsGetInputSchema,
	apisGetVersion: ApisGetVersionInputSchema,
	specsList: SpecsListInputSchema,
	apisListVersions: ApisListVersionsInputSchema,
	apisList: ApisListInputSchema,
	collectionsList: CollectionsListInputSchema,
	collectionsListForked: CollectionsListForkedInputSchema,
	groupsList: GroupsListInputSchema,
	mocksList: MocksListInputSchema,
	monitorsList: MonitorsListInputSchema,
	usersList: UsersListInputSchema,
	workspacesList: WorkspacesListInputSchema,
	collectionsGetUpdateStatus: CollectionsGetUpdateStatusInputSchema,
	accountMe: AccountMeInputSchema,
	billingGetAccount: BillingGetAccountInputSchema,
	accessKeysList: AccessKeysListInputSchema,
	collectionsGetComments: CollectionsGetCommentsInputSchema,
	collectionsGetPullRequests: CollectionsGetPullRequestsInputSchema,
	collectionsGetRoles: CollectionsGetRolesInputSchema,
	collectionsGetForks: CollectionsGetForksInputSchema,
	collectionsGetDuplicationStatus: CollectionsGetDuplicationStatusInputSchema,
	environmentsGetForks: EnvironmentsGetForksInputSchema,
	collectionsGetFolderComments: CollectionsGetFolderCommentsInputSchema,
	collectionsGetFolder: CollectionsGetFolderInputSchema,
	collectionsGetGeneratedSpecs: CollectionsGetGeneratedSpecsInputSchema,
	monitorsGet: MonitorsGetInputSchema,
	collectionsGetRequestComments: CollectionsGetRequestCommentsInputSchema,
	collectionsGetRequest: CollectionsGetRequestInputSchema,
	scimGetResourceTypes: ScimGetResourceTypesInputSchema,
	collectionsGetResponseComments: CollectionsGetResponseCommentsInputSchema,
	collectionsGetResponse: CollectionsGetResponseInputSchema,
	apisGetSchemaFileContents: ApisGetSchemaFileContentsInputSchema,
	apisGetSchemaFiles: ApisGetSchemaFilesInputSchema,
	scimGetServiceConfig: ScimGetServiceConfigInputSchema,
	collectionsGetSourceStatus: CollectionsGetSourceStatusInputSchema,
	specsGetDefinition: SpecsGetDefinitionInputSchema,
	specsGetFile: SpecsGetFileInputSchema,
	specsGetGeneratedCollections: SpecsGetGeneratedCollectionsInputSchema,
	specsGetFiles: SpecsGetFilesInputSchema,
	usersGet: UsersGetInputSchema,
	workspacesGetActivity: WorkspacesGetActivityInputSchema,
	workspacesGet: WorkspacesGetInputSchema,
	workspacesGetGlobalVariables: WorkspacesGetGlobalVariablesInputSchema,
	workspacesGetRoles: WorkspacesGetRolesInputSchema,
	environmentsGet: EnvironmentsGetInputSchema,
	collectionsCreate: CollectionsCreateInputSchema,
	collectionsCreateComment: CollectionsCreateCommentInputSchema,
	collectionsCreateFolder: CollectionsCreateFolderInputSchema,
	collectionsCreateFolderComment: CollectionsCreateFolderCommentInputSchema,
	mocksCreate: MocksCreateInputSchema,
	monitorsCreate: MonitorsCreateInputSchema,
	collectionsCreatePullRequest: CollectionsCreatePullRequestInputSchema,
	collectionsCreateRequestComment: CollectionsCreateRequestCommentInputSchema,
	collectionsCreateResponse: CollectionsCreateResponseInputSchema,
	collectionsCreateResponseComment: CollectionsCreateResponseCommentInputSchema,
	specsCreate: SpecsCreateInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	workspacesCreate: WorkspacesCreateInputSchema,
	apisCreate: ApisCreateInputSchema,
	environmentsCreate: EnvironmentsCreateInputSchema,
	apisCreateOrUpdateSchemaFile: ApisCreateOrUpdateSchemaFileInputSchema,
	mocksDeleteServerResponse: MocksDeleteServerResponseInputSchema,
	monitorsRemove: MonitorsRemoveInputSchema,
	specsDeleteFile: SpecsDeleteFileInputSchema,
	collectionsRemove: CollectionsRemoveInputSchema,
	collectionsDeleteFolder: CollectionsDeleteFolderInputSchema,
	collectionsDeleteFolderComment: CollectionsDeleteFolderCommentInputSchema,
	collectionsDeleteRequestComment: CollectionsDeleteRequestCommentInputSchema,
	collectionsDeleteResponse: CollectionsDeleteResponseInputSchema,
	collectionsDeleteResponseComment: CollectionsDeleteResponseCommentInputSchema,
	apisDeleteSchemaFile: ApisDeleteSchemaFileInputSchema,
	specsRemove: SpecsRemoveInputSchema,
	workspacesRemove: WorkspacesRemoveInputSchema,
	collectionsDeleteComment: CollectionsDeleteCommentInputSchema,
	apisRemove: ApisRemoveInputSchema,
	apisDeleteComment: ApisDeleteCommentInputSchema,
	environmentsRemove: EnvironmentsRemoveInputSchema,
	collectionsDuplicate: CollectionsDuplicateInputSchema,
	collectionsFork: CollectionsForkInputSchema,
	specsGenerateCollection: SpecsGenerateCollectionInputSchema,
	collectionsGenerateSpec: CollectionsGenerateSpecInputSchema,
	collectionsCreateRequest: CollectionsCreateRequestInputSchema,
	specsCreateFile: SpecsCreateFileInputSchema,
	environmentsFork: EnvironmentsForkInputSchema,
	mocksCreateServerResponse: MocksCreateServerResponseInputSchema,
	toolsImportOpenapi: ToolsImportOpenapiInputSchema,
	billingListInvoices: BillingListInvoicesInputSchema,
	collectionsMergeFork: CollectionsMergeForkInputSchema,
	environmentsMergeFork: EnvironmentsMergeForkInputSchema,
	mocksPublish: MocksPublishInputSchema,
	collectionsPullChanges: CollectionsPullChangesInputSchema,
	collectionsReplace: CollectionsReplaceInputSchema,
	environmentsReplace: EnvironmentsReplaceInputSchema,
	commentsResolve: CommentsResolveInputSchema,
	pullRequestsReview: PullRequestsReviewInputSchema,
	monitorsRun: MonitorsRunInputSchema,
	collectionsSyncWithSchema: CollectionsSyncWithSchemaInputSchema,
	collectionsSyncWithSpec: CollectionsSyncWithSpecInputSchema,
	specsSyncWithCollection: SpecsSyncWithCollectionInputSchema,
	collectionsTransferFolders: CollectionsTransferFoldersInputSchema,
	collectionsTransformToOpenapi: CollectionsTransformToOpenapiInputSchema,
	collectionsUpdate: CollectionsUpdateInputSchema,
	collectionsUpdateRequest: CollectionsUpdateRequestInputSchema,
	specsUpdateFile: SpecsUpdateFileInputSchema,
	specsUpdate: SpecsUpdateInputSchema,
	workspacesUpdateGlobalVariables: WorkspacesUpdateGlobalVariablesInputSchema,
	collectionsUpdateFolder: CollectionsUpdateFolderInputSchema,
	collectionsUpdateFolderComment: CollectionsUpdateFolderCommentInputSchema,
	mocksUpdate: MocksUpdateInputSchema,
	monitorsUpdate: MonitorsUpdateInputSchema,
	pullRequestsUpdate: PullRequestsUpdateInputSchema,
	collectionsUpdateRequestComment: CollectionsUpdateRequestCommentInputSchema,
	collectionsUpdateResponse: CollectionsUpdateResponseInputSchema,
	collectionsUpdateResponseComment: CollectionsUpdateResponseCommentInputSchema,
	mocksUpdateServerResponse: MocksUpdateServerResponseInputSchema,
	workspacesUpdate: WorkspacesUpdateInputSchema,
	apisUpdate: ApisUpdateInputSchema,
	apisUpdateComment: ApisUpdateCommentInputSchema,
	environmentsUpdate: EnvironmentsUpdateInputSchema,
	environmentsList: EnvironmentsListInputSchema,
} as const;

export const PostmanEndpointOutputSchemas = {
	apisCreateSchema: ApisCreateSchemaOutputSchema,
	apisCreateCollectionFromSchema: ApisCreateCollectionFromSchemaOutputSchema,
	apisGetComments: ApisGetCommentsOutputSchema,
	apisGet: ApisGetOutputSchema,
	apisGetSchema: ApisGetSchemaOutputSchema,
	specsGet: SpecsGetOutputSchema,
	apisGetVersion: ApisGetVersionOutputSchema,
	specsList: SpecsListOutputSchema,
	apisListVersions: ApisListVersionsOutputSchema,
	apisList: ApisListOutputSchema,
	collectionsList: CollectionsListOutputSchema,
	collectionsListForked: CollectionsListForkedOutputSchema,
	groupsList: GroupsListOutputSchema,
	mocksList: MocksListOutputSchema,
	monitorsList: MonitorsListOutputSchema,
	usersList: UsersListOutputSchema,
	workspacesList: WorkspacesListOutputSchema,
	collectionsGetUpdateStatus: CollectionsGetUpdateStatusOutputSchema,
	accountMe: AccountMeOutputSchema,
	billingGetAccount: BillingGetAccountOutputSchema,
	accessKeysList: AccessKeysListOutputSchema,
	collectionsGetComments: CollectionsGetCommentsOutputSchema,
	collectionsGetPullRequests: CollectionsGetPullRequestsOutputSchema,
	collectionsGetRoles: CollectionsGetRolesOutputSchema,
	collectionsGetForks: CollectionsGetForksOutputSchema,
	collectionsGetDuplicationStatus: CollectionsGetDuplicationStatusOutputSchema,
	environmentsGetForks: EnvironmentsGetForksOutputSchema,
	collectionsGetFolderComments: CollectionsGetFolderCommentsOutputSchema,
	collectionsGetFolder: CollectionsGetFolderOutputSchema,
	collectionsGetGeneratedSpecs: CollectionsGetGeneratedSpecsOutputSchema,
	monitorsGet: MonitorsGetOutputSchema,
	collectionsGetRequestComments: CollectionsGetRequestCommentsOutputSchema,
	collectionsGetRequest: CollectionsGetRequestOutputSchema,
	scimGetResourceTypes: ScimGetResourceTypesOutputSchema,
	collectionsGetResponseComments: CollectionsGetResponseCommentsOutputSchema,
	collectionsGetResponse: CollectionsGetResponseOutputSchema,
	apisGetSchemaFileContents: ApisGetSchemaFileContentsOutputSchema,
	apisGetSchemaFiles: ApisGetSchemaFilesOutputSchema,
	scimGetServiceConfig: ScimGetServiceConfigOutputSchema,
	collectionsGetSourceStatus: CollectionsGetSourceStatusOutputSchema,
	specsGetDefinition: SpecsGetDefinitionOutputSchema,
	specsGetFile: SpecsGetFileOutputSchema,
	specsGetGeneratedCollections: SpecsGetGeneratedCollectionsOutputSchema,
	specsGetFiles: SpecsGetFilesOutputSchema,
	usersGet: UsersGetOutputSchema,
	workspacesGetActivity: WorkspacesGetActivityOutputSchema,
	workspacesGet: WorkspacesGetOutputSchema,
	workspacesGetGlobalVariables: WorkspacesGetGlobalVariablesOutputSchema,
	workspacesGetRoles: WorkspacesGetRolesOutputSchema,
	environmentsGet: EnvironmentsGetOutputSchema,
	collectionsCreate: CollectionsCreateOutputSchema,
	collectionsCreateComment: CollectionsCreateCommentOutputSchema,
	collectionsCreateFolder: CollectionsCreateFolderOutputSchema,
	collectionsCreateFolderComment: CollectionsCreateFolderCommentOutputSchema,
	mocksCreate: MocksCreateOutputSchema,
	monitorsCreate: MonitorsCreateOutputSchema,
	collectionsCreatePullRequest: CollectionsCreatePullRequestOutputSchema,
	collectionsCreateRequestComment: CollectionsCreateRequestCommentOutputSchema,
	collectionsCreateResponse: CollectionsCreateResponseOutputSchema,
	collectionsCreateResponseComment:
		CollectionsCreateResponseCommentOutputSchema,
	specsCreate: SpecsCreateOutputSchema,
	webhooksCreate: WebhooksCreateOutputSchema,
	workspacesCreate: WorkspacesCreateOutputSchema,
	apisCreate: ApisCreateOutputSchema,
	environmentsCreate: EnvironmentsCreateOutputSchema,
	apisCreateOrUpdateSchemaFile: ApisCreateOrUpdateSchemaFileOutputSchema,
	mocksDeleteServerResponse: MocksDeleteServerResponseOutputSchema,
	monitorsRemove: MonitorsRemoveOutputSchema,
	specsDeleteFile: SpecsDeleteFileOutputSchema,
	collectionsRemove: CollectionsRemoveOutputSchema,
	collectionsDeleteFolder: CollectionsDeleteFolderOutputSchema,
	collectionsDeleteFolderComment: CollectionsDeleteFolderCommentOutputSchema,
	collectionsDeleteRequestComment: CollectionsDeleteRequestCommentOutputSchema,
	collectionsDeleteResponse: CollectionsDeleteResponseOutputSchema,
	collectionsDeleteResponseComment:
		CollectionsDeleteResponseCommentOutputSchema,
	apisDeleteSchemaFile: ApisDeleteSchemaFileOutputSchema,
	specsRemove: SpecsRemoveOutputSchema,
	workspacesRemove: WorkspacesRemoveOutputSchema,
	collectionsDeleteComment: CollectionsDeleteCommentOutputSchema,
	apisRemove: ApisRemoveOutputSchema,
	apisDeleteComment: ApisDeleteCommentOutputSchema,
	environmentsRemove: EnvironmentsRemoveOutputSchema,
	collectionsDuplicate: CollectionsDuplicateOutputSchema,
	collectionsFork: CollectionsForkOutputSchema,
	specsGenerateCollection: SpecsGenerateCollectionOutputSchema,
	collectionsGenerateSpec: CollectionsGenerateSpecOutputSchema,
	collectionsCreateRequest: CollectionsCreateRequestOutputSchema,
	specsCreateFile: SpecsCreateFileOutputSchema,
	environmentsFork: EnvironmentsForkOutputSchema,
	mocksCreateServerResponse: MocksCreateServerResponseOutputSchema,
	toolsImportOpenapi: ToolsImportOpenapiOutputSchema,
	billingListInvoices: BillingListInvoicesOutputSchema,
	collectionsMergeFork: CollectionsMergeForkOutputSchema,
	environmentsMergeFork: EnvironmentsMergeForkOutputSchema,
	mocksPublish: MocksPublishOutputSchema,
	collectionsPullChanges: CollectionsPullChangesOutputSchema,
	collectionsReplace: CollectionsReplaceOutputSchema,
	environmentsReplace: EnvironmentsReplaceOutputSchema,
	commentsResolve: CommentsResolveOutputSchema,
	pullRequestsReview: PullRequestsReviewOutputSchema,
	monitorsRun: MonitorsRunOutputSchema,
	collectionsSyncWithSchema: CollectionsSyncWithSchemaOutputSchema,
	collectionsSyncWithSpec: CollectionsSyncWithSpecOutputSchema,
	specsSyncWithCollection: SpecsSyncWithCollectionOutputSchema,
	collectionsTransferFolders: CollectionsTransferFoldersOutputSchema,
	collectionsTransformToOpenapi: CollectionsTransformToOpenapiOutputSchema,
	collectionsUpdate: CollectionsUpdateOutputSchema,
	collectionsUpdateRequest: CollectionsUpdateRequestOutputSchema,
	specsUpdateFile: SpecsUpdateFileOutputSchema,
	specsUpdate: SpecsUpdateOutputSchema,
	workspacesUpdateGlobalVariables: WorkspacesUpdateGlobalVariablesOutputSchema,
	collectionsUpdateFolder: CollectionsUpdateFolderOutputSchema,
	collectionsUpdateFolderComment: CollectionsUpdateFolderCommentOutputSchema,
	mocksUpdate: MocksUpdateOutputSchema,
	monitorsUpdate: MonitorsUpdateOutputSchema,
	pullRequestsUpdate: PullRequestsUpdateOutputSchema,
	collectionsUpdateRequestComment: CollectionsUpdateRequestCommentOutputSchema,
	collectionsUpdateResponse: CollectionsUpdateResponseOutputSchema,
	collectionsUpdateResponseComment:
		CollectionsUpdateResponseCommentOutputSchema,
	mocksUpdateServerResponse: MocksUpdateServerResponseOutputSchema,
	workspacesUpdate: WorkspacesUpdateOutputSchema,
	apisUpdate: ApisUpdateOutputSchema,
	apisUpdateComment: ApisUpdateCommentOutputSchema,
	environmentsUpdate: EnvironmentsUpdateOutputSchema,
	environmentsList: EnvironmentsListOutputSchema,
} as const;

export type PostmanEndpointInputs = {
	apisCreateSchema: z.infer<
		typeof PostmanEndpointInputSchemas.apisCreateSchema
	>;
	apisCreateCollectionFromSchema: z.infer<
		typeof PostmanEndpointInputSchemas.apisCreateCollectionFromSchema
	>;
	apisGetComments: z.infer<typeof PostmanEndpointInputSchemas.apisGetComments>;
	apisGet: z.infer<typeof PostmanEndpointInputSchemas.apisGet>;
	apisGetSchema: z.infer<typeof PostmanEndpointInputSchemas.apisGetSchema>;
	specsGet: z.infer<typeof PostmanEndpointInputSchemas.specsGet>;
	apisGetVersion: z.infer<typeof PostmanEndpointInputSchemas.apisGetVersion>;
	specsList: z.infer<typeof PostmanEndpointInputSchemas.specsList>;
	apisListVersions: z.infer<
		typeof PostmanEndpointInputSchemas.apisListVersions
	>;
	apisList: z.infer<typeof PostmanEndpointInputSchemas.apisList>;
	collectionsList: z.infer<typeof PostmanEndpointInputSchemas.collectionsList>;
	collectionsListForked: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsListForked
	>;
	groupsList: z.infer<typeof PostmanEndpointInputSchemas.groupsList>;
	mocksList: z.infer<typeof PostmanEndpointInputSchemas.mocksList>;
	monitorsList: z.infer<typeof PostmanEndpointInputSchemas.monitorsList>;
	usersList: z.infer<typeof PostmanEndpointInputSchemas.usersList>;
	workspacesList: z.infer<typeof PostmanEndpointInputSchemas.workspacesList>;
	collectionsGetUpdateStatus: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetUpdateStatus
	>;
	accountMe: z.infer<typeof PostmanEndpointInputSchemas.accountMe>;
	billingGetAccount: z.infer<
		typeof PostmanEndpointInputSchemas.billingGetAccount
	>;
	accessKeysList: z.infer<typeof PostmanEndpointInputSchemas.accessKeysList>;
	collectionsGetComments: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetComments
	>;
	collectionsGetPullRequests: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetPullRequests
	>;
	collectionsGetRoles: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetRoles
	>;
	collectionsGetForks: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetForks
	>;
	collectionsGetDuplicationStatus: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetDuplicationStatus
	>;
	environmentsGetForks: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsGetForks
	>;
	collectionsGetFolderComments: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetFolderComments
	>;
	collectionsGetFolder: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetFolder
	>;
	collectionsGetGeneratedSpecs: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetGeneratedSpecs
	>;
	monitorsGet: z.infer<typeof PostmanEndpointInputSchemas.monitorsGet>;
	collectionsGetRequestComments: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetRequestComments
	>;
	collectionsGetRequest: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetRequest
	>;
	scimGetResourceTypes: z.infer<
		typeof PostmanEndpointInputSchemas.scimGetResourceTypes
	>;
	collectionsGetResponseComments: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetResponseComments
	>;
	collectionsGetResponse: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetResponse
	>;
	apisGetSchemaFileContents: z.infer<
		typeof PostmanEndpointInputSchemas.apisGetSchemaFileContents
	>;
	apisGetSchemaFiles: z.infer<
		typeof PostmanEndpointInputSchemas.apisGetSchemaFiles
	>;
	scimGetServiceConfig: z.infer<
		typeof PostmanEndpointInputSchemas.scimGetServiceConfig
	>;
	collectionsGetSourceStatus: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGetSourceStatus
	>;
	specsGetDefinition: z.infer<
		typeof PostmanEndpointInputSchemas.specsGetDefinition
	>;
	specsGetFile: z.infer<typeof PostmanEndpointInputSchemas.specsGetFile>;
	specsGetGeneratedCollections: z.infer<
		typeof PostmanEndpointInputSchemas.specsGetGeneratedCollections
	>;
	specsGetFiles: z.infer<typeof PostmanEndpointInputSchemas.specsGetFiles>;
	usersGet: z.infer<typeof PostmanEndpointInputSchemas.usersGet>;
	workspacesGetActivity: z.infer<
		typeof PostmanEndpointInputSchemas.workspacesGetActivity
	>;
	workspacesGet: z.infer<typeof PostmanEndpointInputSchemas.workspacesGet>;
	workspacesGetGlobalVariables: z.infer<
		typeof PostmanEndpointInputSchemas.workspacesGetGlobalVariables
	>;
	workspacesGetRoles: z.infer<
		typeof PostmanEndpointInputSchemas.workspacesGetRoles
	>;
	environmentsGet: z.infer<typeof PostmanEndpointInputSchemas.environmentsGet>;
	collectionsCreate: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreate
	>;
	collectionsCreateComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreateComment
	>;
	collectionsCreateFolder: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreateFolder
	>;
	collectionsCreateFolderComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreateFolderComment
	>;
	mocksCreate: z.infer<typeof PostmanEndpointInputSchemas.mocksCreate>;
	monitorsCreate: z.infer<typeof PostmanEndpointInputSchemas.monitorsCreate>;
	collectionsCreatePullRequest: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreatePullRequest
	>;
	collectionsCreateRequestComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreateRequestComment
	>;
	collectionsCreateResponse: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreateResponse
	>;
	collectionsCreateResponseComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreateResponseComment
	>;
	specsCreate: z.infer<typeof PostmanEndpointInputSchemas.specsCreate>;
	webhooksCreate: z.infer<typeof PostmanEndpointInputSchemas.webhooksCreate>;
	workspacesCreate: z.infer<
		typeof PostmanEndpointInputSchemas.workspacesCreate
	>;
	apisCreate: z.infer<typeof PostmanEndpointInputSchemas.apisCreate>;
	environmentsCreate: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsCreate
	>;
	apisCreateOrUpdateSchemaFile: z.infer<
		typeof PostmanEndpointInputSchemas.apisCreateOrUpdateSchemaFile
	>;
	mocksDeleteServerResponse: z.infer<
		typeof PostmanEndpointInputSchemas.mocksDeleteServerResponse
	>;
	monitorsRemove: z.infer<typeof PostmanEndpointInputSchemas.monitorsRemove>;
	specsDeleteFile: z.infer<typeof PostmanEndpointInputSchemas.specsDeleteFile>;
	collectionsRemove: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsRemove
	>;
	collectionsDeleteFolder: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsDeleteFolder
	>;
	collectionsDeleteFolderComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsDeleteFolderComment
	>;
	collectionsDeleteRequestComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsDeleteRequestComment
	>;
	collectionsDeleteResponse: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsDeleteResponse
	>;
	collectionsDeleteResponseComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsDeleteResponseComment
	>;
	apisDeleteSchemaFile: z.infer<
		typeof PostmanEndpointInputSchemas.apisDeleteSchemaFile
	>;
	specsRemove: z.infer<typeof PostmanEndpointInputSchemas.specsRemove>;
	workspacesRemove: z.infer<
		typeof PostmanEndpointInputSchemas.workspacesRemove
	>;
	collectionsDeleteComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsDeleteComment
	>;
	apisRemove: z.infer<typeof PostmanEndpointInputSchemas.apisRemove>;
	apisDeleteComment: z.infer<
		typeof PostmanEndpointInputSchemas.apisDeleteComment
	>;
	environmentsRemove: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsRemove
	>;
	collectionsDuplicate: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsDuplicate
	>;
	collectionsFork: z.infer<typeof PostmanEndpointInputSchemas.collectionsFork>;
	specsGenerateCollection: z.infer<
		typeof PostmanEndpointInputSchemas.specsGenerateCollection
	>;
	collectionsGenerateSpec: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsGenerateSpec
	>;
	collectionsCreateRequest: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsCreateRequest
	>;
	specsCreateFile: z.infer<typeof PostmanEndpointInputSchemas.specsCreateFile>;
	environmentsFork: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsFork
	>;
	mocksCreateServerResponse: z.infer<
		typeof PostmanEndpointInputSchemas.mocksCreateServerResponse
	>;
	toolsImportOpenapi: z.infer<
		typeof PostmanEndpointInputSchemas.toolsImportOpenapi
	>;
	billingListInvoices: z.infer<
		typeof PostmanEndpointInputSchemas.billingListInvoices
	>;
	collectionsMergeFork: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsMergeFork
	>;
	environmentsMergeFork: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsMergeFork
	>;
	mocksPublish: z.infer<typeof PostmanEndpointInputSchemas.mocksPublish>;
	collectionsPullChanges: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsPullChanges
	>;
	collectionsReplace: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsReplace
	>;
	environmentsReplace: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsReplace
	>;
	commentsResolve: z.infer<typeof PostmanEndpointInputSchemas.commentsResolve>;
	pullRequestsReview: z.infer<
		typeof PostmanEndpointInputSchemas.pullRequestsReview
	>;
	monitorsRun: z.infer<typeof PostmanEndpointInputSchemas.monitorsRun>;
	collectionsSyncWithSchema: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsSyncWithSchema
	>;
	collectionsSyncWithSpec: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsSyncWithSpec
	>;
	specsSyncWithCollection: z.infer<
		typeof PostmanEndpointInputSchemas.specsSyncWithCollection
	>;
	collectionsTransferFolders: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsTransferFolders
	>;
	collectionsTransformToOpenapi: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsTransformToOpenapi
	>;
	collectionsUpdate: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsUpdate
	>;
	collectionsUpdateRequest: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsUpdateRequest
	>;
	specsUpdateFile: z.infer<typeof PostmanEndpointInputSchemas.specsUpdateFile>;
	specsUpdate: z.infer<typeof PostmanEndpointInputSchemas.specsUpdate>;
	workspacesUpdateGlobalVariables: z.infer<
		typeof PostmanEndpointInputSchemas.workspacesUpdateGlobalVariables
	>;
	collectionsUpdateFolder: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsUpdateFolder
	>;
	collectionsUpdateFolderComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsUpdateFolderComment
	>;
	mocksUpdate: z.infer<typeof PostmanEndpointInputSchemas.mocksUpdate>;
	monitorsUpdate: z.infer<typeof PostmanEndpointInputSchemas.monitorsUpdate>;
	pullRequestsUpdate: z.infer<
		typeof PostmanEndpointInputSchemas.pullRequestsUpdate
	>;
	collectionsUpdateRequestComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsUpdateRequestComment
	>;
	collectionsUpdateResponse: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsUpdateResponse
	>;
	collectionsUpdateResponseComment: z.infer<
		typeof PostmanEndpointInputSchemas.collectionsUpdateResponseComment
	>;
	mocksUpdateServerResponse: z.infer<
		typeof PostmanEndpointInputSchemas.mocksUpdateServerResponse
	>;
	workspacesUpdate: z.infer<
		typeof PostmanEndpointInputSchemas.workspacesUpdate
	>;
	apisUpdate: z.infer<typeof PostmanEndpointInputSchemas.apisUpdate>;
	apisUpdateComment: z.infer<
		typeof PostmanEndpointInputSchemas.apisUpdateComment
	>;
	environmentsUpdate: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsUpdate
	>;
	environmentsList: z.infer<
		typeof PostmanEndpointInputSchemas.environmentsList
	>;
};

export type PostmanEndpointOutputs = {
	apisCreateSchema: z.infer<
		typeof PostmanEndpointOutputSchemas.apisCreateSchema
	>;
	apisCreateCollectionFromSchema: z.infer<
		typeof PostmanEndpointOutputSchemas.apisCreateCollectionFromSchema
	>;
	apisGetComments: z.infer<typeof PostmanEndpointOutputSchemas.apisGetComments>;
	apisGet: z.infer<typeof PostmanEndpointOutputSchemas.apisGet>;
	apisGetSchema: z.infer<typeof PostmanEndpointOutputSchemas.apisGetSchema>;
	specsGet: z.infer<typeof PostmanEndpointOutputSchemas.specsGet>;
	apisGetVersion: z.infer<typeof PostmanEndpointOutputSchemas.apisGetVersion>;
	specsList: z.infer<typeof PostmanEndpointOutputSchemas.specsList>;
	apisListVersions: z.infer<
		typeof PostmanEndpointOutputSchemas.apisListVersions
	>;
	apisList: z.infer<typeof PostmanEndpointOutputSchemas.apisList>;
	collectionsList: z.infer<typeof PostmanEndpointOutputSchemas.collectionsList>;
	collectionsListForked: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsListForked
	>;
	groupsList: z.infer<typeof PostmanEndpointOutputSchemas.groupsList>;
	mocksList: z.infer<typeof PostmanEndpointOutputSchemas.mocksList>;
	monitorsList: z.infer<typeof PostmanEndpointOutputSchemas.monitorsList>;
	usersList: z.infer<typeof PostmanEndpointOutputSchemas.usersList>;
	workspacesList: z.infer<typeof PostmanEndpointOutputSchemas.workspacesList>;
	collectionsGetUpdateStatus: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetUpdateStatus
	>;
	accountMe: z.infer<typeof PostmanEndpointOutputSchemas.accountMe>;
	billingGetAccount: z.infer<
		typeof PostmanEndpointOutputSchemas.billingGetAccount
	>;
	accessKeysList: z.infer<typeof PostmanEndpointOutputSchemas.accessKeysList>;
	collectionsGetComments: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetComments
	>;
	collectionsGetPullRequests: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetPullRequests
	>;
	collectionsGetRoles: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetRoles
	>;
	collectionsGetForks: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetForks
	>;
	collectionsGetDuplicationStatus: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetDuplicationStatus
	>;
	environmentsGetForks: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsGetForks
	>;
	collectionsGetFolderComments: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetFolderComments
	>;
	collectionsGetFolder: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetFolder
	>;
	collectionsGetGeneratedSpecs: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetGeneratedSpecs
	>;
	monitorsGet: z.infer<typeof PostmanEndpointOutputSchemas.monitorsGet>;
	collectionsGetRequestComments: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetRequestComments
	>;
	collectionsGetRequest: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetRequest
	>;
	scimGetResourceTypes: z.infer<
		typeof PostmanEndpointOutputSchemas.scimGetResourceTypes
	>;
	collectionsGetResponseComments: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetResponseComments
	>;
	collectionsGetResponse: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetResponse
	>;
	apisGetSchemaFileContents: z.infer<
		typeof PostmanEndpointOutputSchemas.apisGetSchemaFileContents
	>;
	apisGetSchemaFiles: z.infer<
		typeof PostmanEndpointOutputSchemas.apisGetSchemaFiles
	>;
	scimGetServiceConfig: z.infer<
		typeof PostmanEndpointOutputSchemas.scimGetServiceConfig
	>;
	collectionsGetSourceStatus: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGetSourceStatus
	>;
	specsGetDefinition: z.infer<
		typeof PostmanEndpointOutputSchemas.specsGetDefinition
	>;
	specsGetFile: z.infer<typeof PostmanEndpointOutputSchemas.specsGetFile>;
	specsGetGeneratedCollections: z.infer<
		typeof PostmanEndpointOutputSchemas.specsGetGeneratedCollections
	>;
	specsGetFiles: z.infer<typeof PostmanEndpointOutputSchemas.specsGetFiles>;
	usersGet: z.infer<typeof PostmanEndpointOutputSchemas.usersGet>;
	workspacesGetActivity: z.infer<
		typeof PostmanEndpointOutputSchemas.workspacesGetActivity
	>;
	workspacesGet: z.infer<typeof PostmanEndpointOutputSchemas.workspacesGet>;
	workspacesGetGlobalVariables: z.infer<
		typeof PostmanEndpointOutputSchemas.workspacesGetGlobalVariables
	>;
	workspacesGetRoles: z.infer<
		typeof PostmanEndpointOutputSchemas.workspacesGetRoles
	>;
	environmentsGet: z.infer<typeof PostmanEndpointOutputSchemas.environmentsGet>;
	collectionsCreate: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreate
	>;
	collectionsCreateComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreateComment
	>;
	collectionsCreateFolder: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreateFolder
	>;
	collectionsCreateFolderComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreateFolderComment
	>;
	mocksCreate: z.infer<typeof PostmanEndpointOutputSchemas.mocksCreate>;
	monitorsCreate: z.infer<typeof PostmanEndpointOutputSchemas.monitorsCreate>;
	collectionsCreatePullRequest: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreatePullRequest
	>;
	collectionsCreateRequestComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreateRequestComment
	>;
	collectionsCreateResponse: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreateResponse
	>;
	collectionsCreateResponseComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreateResponseComment
	>;
	specsCreate: z.infer<typeof PostmanEndpointOutputSchemas.specsCreate>;
	webhooksCreate: z.infer<typeof PostmanEndpointOutputSchemas.webhooksCreate>;
	workspacesCreate: z.infer<
		typeof PostmanEndpointOutputSchemas.workspacesCreate
	>;
	apisCreate: z.infer<typeof PostmanEndpointOutputSchemas.apisCreate>;
	environmentsCreate: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsCreate
	>;
	apisCreateOrUpdateSchemaFile: z.infer<
		typeof PostmanEndpointOutputSchemas.apisCreateOrUpdateSchemaFile
	>;
	mocksDeleteServerResponse: z.infer<
		typeof PostmanEndpointOutputSchemas.mocksDeleteServerResponse
	>;
	monitorsRemove: z.infer<typeof PostmanEndpointOutputSchemas.monitorsRemove>;
	specsDeleteFile: z.infer<typeof PostmanEndpointOutputSchemas.specsDeleteFile>;
	collectionsRemove: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsRemove
	>;
	collectionsDeleteFolder: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsDeleteFolder
	>;
	collectionsDeleteFolderComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsDeleteFolderComment
	>;
	collectionsDeleteRequestComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsDeleteRequestComment
	>;
	collectionsDeleteResponse: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsDeleteResponse
	>;
	collectionsDeleteResponseComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsDeleteResponseComment
	>;
	apisDeleteSchemaFile: z.infer<
		typeof PostmanEndpointOutputSchemas.apisDeleteSchemaFile
	>;
	specsRemove: z.infer<typeof PostmanEndpointOutputSchemas.specsRemove>;
	workspacesRemove: z.infer<
		typeof PostmanEndpointOutputSchemas.workspacesRemove
	>;
	collectionsDeleteComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsDeleteComment
	>;
	apisRemove: z.infer<typeof PostmanEndpointOutputSchemas.apisRemove>;
	apisDeleteComment: z.infer<
		typeof PostmanEndpointOutputSchemas.apisDeleteComment
	>;
	environmentsRemove: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsRemove
	>;
	collectionsDuplicate: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsDuplicate
	>;
	collectionsFork: z.infer<typeof PostmanEndpointOutputSchemas.collectionsFork>;
	specsGenerateCollection: z.infer<
		typeof PostmanEndpointOutputSchemas.specsGenerateCollection
	>;
	collectionsGenerateSpec: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsGenerateSpec
	>;
	collectionsCreateRequest: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsCreateRequest
	>;
	specsCreateFile: z.infer<typeof PostmanEndpointOutputSchemas.specsCreateFile>;
	environmentsFork: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsFork
	>;
	mocksCreateServerResponse: z.infer<
		typeof PostmanEndpointOutputSchemas.mocksCreateServerResponse
	>;
	toolsImportOpenapi: z.infer<
		typeof PostmanEndpointOutputSchemas.toolsImportOpenapi
	>;
	billingListInvoices: z.infer<
		typeof PostmanEndpointOutputSchemas.billingListInvoices
	>;
	collectionsMergeFork: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsMergeFork
	>;
	environmentsMergeFork: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsMergeFork
	>;
	mocksPublish: z.infer<typeof PostmanEndpointOutputSchemas.mocksPublish>;
	collectionsPullChanges: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsPullChanges
	>;
	collectionsReplace: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsReplace
	>;
	environmentsReplace: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsReplace
	>;
	commentsResolve: z.infer<typeof PostmanEndpointOutputSchemas.commentsResolve>;
	pullRequestsReview: z.infer<
		typeof PostmanEndpointOutputSchemas.pullRequestsReview
	>;
	monitorsRun: z.infer<typeof PostmanEndpointOutputSchemas.monitorsRun>;
	collectionsSyncWithSchema: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsSyncWithSchema
	>;
	collectionsSyncWithSpec: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsSyncWithSpec
	>;
	specsSyncWithCollection: z.infer<
		typeof PostmanEndpointOutputSchemas.specsSyncWithCollection
	>;
	collectionsTransferFolders: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsTransferFolders
	>;
	collectionsTransformToOpenapi: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsTransformToOpenapi
	>;
	collectionsUpdate: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsUpdate
	>;
	collectionsUpdateRequest: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsUpdateRequest
	>;
	specsUpdateFile: z.infer<typeof PostmanEndpointOutputSchemas.specsUpdateFile>;
	specsUpdate: z.infer<typeof PostmanEndpointOutputSchemas.specsUpdate>;
	workspacesUpdateGlobalVariables: z.infer<
		typeof PostmanEndpointOutputSchemas.workspacesUpdateGlobalVariables
	>;
	collectionsUpdateFolder: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsUpdateFolder
	>;
	collectionsUpdateFolderComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsUpdateFolderComment
	>;
	mocksUpdate: z.infer<typeof PostmanEndpointOutputSchemas.mocksUpdate>;
	monitorsUpdate: z.infer<typeof PostmanEndpointOutputSchemas.monitorsUpdate>;
	pullRequestsUpdate: z.infer<
		typeof PostmanEndpointOutputSchemas.pullRequestsUpdate
	>;
	collectionsUpdateRequestComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsUpdateRequestComment
	>;
	collectionsUpdateResponse: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsUpdateResponse
	>;
	collectionsUpdateResponseComment: z.infer<
		typeof PostmanEndpointOutputSchemas.collectionsUpdateResponseComment
	>;
	mocksUpdateServerResponse: z.infer<
		typeof PostmanEndpointOutputSchemas.mocksUpdateServerResponse
	>;
	workspacesUpdate: z.infer<
		typeof PostmanEndpointOutputSchemas.workspacesUpdate
	>;
	apisUpdate: z.infer<typeof PostmanEndpointOutputSchemas.apisUpdate>;
	apisUpdateComment: z.infer<
		typeof PostmanEndpointOutputSchemas.apisUpdateComment
	>;
	environmentsUpdate: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsUpdate
	>;
	environmentsList: z.infer<
		typeof PostmanEndpointOutputSchemas.environmentsList
	>;
};
