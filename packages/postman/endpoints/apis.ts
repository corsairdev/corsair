import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { assertSafePathParam, makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const createSchema: PostmanEndpoints['apisCreateSchema'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisCreateSchema']
	>('/apis/{apiId}/schemas', ctx.key, {
		method: 'POST',
		path: {
			apiId: input.apiId,
		},
		body: {
			type: input.type,
			files: input.files,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.createSchema',
		{ ...input },
		'completed',
	);
	return response;
};

export const createCollectionFromSchema: PostmanEndpoints['apisCreateCollectionFromSchema'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisCreateCollectionFromSchema']
		>('/apis/{apiId}/collections', ctx.key, {
			method: 'POST',
			path: {
				apiId: input.apiId,
			},
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'postman.apis.createCollectionFromSchema',
			{ apiId: input.apiId },
			'completed',
		);
		return response;
	};

export const getComments: PostmanEndpoints['apisGetComments'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisGetComments']
	>('/apis/{apiId}/comments', ctx.key, {
		method: 'GET',
		path: {
			apiId: input.apiId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.getComments',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: PostmanEndpoints['apisGet'] = async (ctx, input) => {
	const response = await makePostmanRequest<PostmanEndpointOutputs['apisGet']>(
		'/apis/{apiId}',
		ctx.key,
		{
			method: 'GET',
			path: {
				apiId: input.apiId,
			},
			query: {
				include: input.include,
			},
		},
	);

	await logEventFromContext(ctx, 'postman.apis.get', { ...input }, 'completed');
	return response;
};

export const getSchema: PostmanEndpoints['apisGetSchema'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisGetSchema']
	>('/apis/{apiId}/schemas/{schemaId}', ctx.key, {
		method: 'GET',
		path: {
			apiId: input.apiId,
			schemaId: input.schemaId,
		},
		query: {
			versionId: input.versionId,
			bundled: input.bundled,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.getSchema',
		{ ...input },
		'completed',
	);
	return response;
};

export const getVersion: PostmanEndpoints['apisGetVersion'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisGetVersion']
	>('/apis/{apiId}/versions/{versionId}', ctx.key, {
		method: 'GET',
		path: {
			apiId: input.apiId,
			versionId: input.versionId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.getVersion',
		{ ...input },
		'completed',
	);
	return response;
};

export const listVersions: PostmanEndpoints['apisListVersions'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisListVersions']
	>('/apis/{apiId}/versions', ctx.key, {
		method: 'GET',
		path: {
			apiId: input.apiId,
		},
		query: {
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.listVersions',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: PostmanEndpoints['apisList'] = async (ctx, input) => {
	const response = await makePostmanRequest<PostmanEndpointOutputs['apisList']>(
		'/apis',
		ctx.key,
		{
			method: 'GET',
			query: {
				workspaceId: input.workspaceId,
				createdBy: input.createdBy,
				cursor: input.cursor,
				description: input.description,
				limit: input.limit,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'postman.apis.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getSchemaFileContents: PostmanEndpoints['apisGetSchemaFileContents'] =
	async (ctx, input) => {
		assertSafePathParam('filePath', input.filePath);
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetSchemaFileContents']
		>('/apis/{apiId}/schemas/{schemaId}/files/{file-path}', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				schemaId: input.schemaId,
				'file-path': input.filePath,
			},
			query: {
				versionId: input.versionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getSchemaFileContents',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSchemaFiles: PostmanEndpoints['apisGetSchemaFiles'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisGetSchemaFiles']
	>('/apis/{apiId}/schemas/{schemaId}/files', ctx.key, {
		method: 'GET',
		path: {
			apiId: input.apiId,
			schemaId: input.schemaId,
		},
		query: {
			versionId: input.versionId,
			limit: input.limit,
			cursor: input.cursor,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.getSchemaFiles',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: PostmanEndpoints['apisCreate'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisCreate']
	>('/apis', ctx.key, {
		method: 'POST',
		query: {
			workspaceId: input.workspaceId,
		},
		body: {
			name: input.name,
			summary: input.summary,
			description: input.description,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const createOrUpdateSchemaFile: PostmanEndpoints['apisCreateOrUpdateSchemaFile'] =
	async (ctx, input) => {
		assertSafePathParam('filePath', input.filePath);
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisCreateOrUpdateSchemaFile']
		>('/apis/{apiId}/schemas/{schemaId}/files/{file-path}', ctx.key, {
			method: 'PUT',
			path: {
				apiId: input.apiId,
				schemaId: input.schemaId,
				'file-path': input.filePath,
			},
			body: {
				name: input.name,
				root: input.root,
				content: input.content,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.createOrUpdateSchemaFile',
			{ apiId: input.apiId, filePath: input.filePath },
			'completed',
		);
		return response;
	};

export const deleteSchemaFile: PostmanEndpoints['apisDeleteSchemaFile'] =
	async (ctx, input) => {
		assertSafePathParam('filePath', input.filePath);
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisDeleteSchemaFile']
		>('/apis/{apiId}/schemas/{schemaId}/files/{file-path}', ctx.key, {
			method: 'DELETE',
			path: {
				apiId: input.apiId,
				schemaId: input.schemaId,
				'file-path': input.filePath,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.deleteSchemaFile',
			{ ...input },
			'completed',
		);
		return response;
	};

export const remove: PostmanEndpoints['apisRemove'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisRemove']
	>('/apis/{apiId}', ctx.key, {
		method: 'DELETE',
		path: {
			apiId: input.apiId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteComment: PostmanEndpoints['apisDeleteComment'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisDeleteComment']
	>('/apis/{apiId}/comments/{commentId}', ctx.key, {
		method: 'DELETE',
		path: {
			apiId: input.apiId,
			commentId: input.commentId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.deleteComment',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: PostmanEndpoints['apisUpdate'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisUpdate']
	>('/apis/{apiId}', ctx.key, {
		method: 'PUT',
		path: {
			apiId: input.apiId,
		},
		body: {
			name: input.name,
			summary: input.summary,
			description: input.description,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateComment: PostmanEndpoints['apisUpdateComment'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisUpdateComment']
	>('/apis/{apiId}/comments/{commentId}', ctx.key, {
		method: 'PUT',
		path: {
			apiId: input.apiId,
			commentId: input.commentId,
		},
		body: {
			body: input.body,
			tags: input.tags,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.updateComment',
		{ ...input },
		'completed',
	);
	return response;
};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://www.postman.com/postman/postman-public-workspace/request/p741q4m/create-relations

export const createRelations: PostmanEndpoints['apisCreateRelations'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisCreateRelations']
	>('/apis/{apiId}/versions/{apiVersionId}/relations', ctx.key, {
		method: 'POST',
		path: {
			apiId: input.apiId,
			apiVersionId: input.apiVersionId,
		},
		body: {
			contracttest: input.contracttest,
			testsuite: input.testsuite,
			documentation: input.documentation,
			mock: input.mock,
			monitor: input.monitor,
			environment: input.environment,
			unclassified: input.unclassified,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.createRelations',
		{ ...input },
		'completed',
	);
	return response;
};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://postman.apidog.io/api-3545666

export const getLinkedRelations: PostmanEndpoints['apisGetLinkedRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetLinkedRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/relations', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getLinkedRelations',
			{ ...input },
			'completed',
		);
		return response;
	};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://developers.zeorouteplanner.com/30daysofpostman/postman-api-9/f/api-relations-6

export const getTestRelations: PostmanEndpoints['apisGetTestRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetTestRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/test', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getTestRelations',
			{ ...input },
			'completed',
		);
		return response;
	};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://www.postman.com/api-evangelist/design/documentation/7t5dxjl/postman-api-openapi

export const getContractTestRelations: PostmanEndpoints['apisGetContractTestRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetContractTestRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/contracttest', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getContractTestRelations',
			{ ...input },
			'completed',
		);
		return response;
	};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://developers.zeorouteplanner.com/30daysofpostman/postman-api-9/f/api-relations-6

export const getIntegrationTestRelations: PostmanEndpoints['apisGetIntegrationTestRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetIntegrationTestRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/integrationtest', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getIntegrationTestRelations',
			{ ...input },
			'completed',
		);
		return response;
	};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://developers.zeorouteplanner.com/30daysofpostman/postman-api-9/f/api-relations-6

export const getTestSuiteRelations: PostmanEndpoints['apisGetTestSuiteRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetTestSuiteRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/testsuite', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getTestSuiteRelations',
			{ ...input },
			'completed',
		);
		return response;
	};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://www.postman.com/postman/postman-blog/request/ok83pe5/get-documentation-relations

export const getDocumentationRelations: PostmanEndpoints['apisGetDocumentationRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetDocumentationRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/documentation', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getDocumentationRelations',
			{ ...input },
			'completed',
		);
		return response;
	};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: https://www.postman.com/cs-demo/john-s-public-workspace/request/c1w17ec/get-environment-relations

export const getEnvironmentRelations: PostmanEndpoints['apisGetEnvironmentRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetEnvironmentRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/environment', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getEnvironmentRelations',
			{ ...input },
			'completed',
		);
		return response;
	};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: INFERRED: singleton GET .../releases/:releaseId and PATCH .../releases/:releaseId are documented (postman-public-workspace); the collection form follows standard REST convention. Response shape kept tolerant.

export const listReleases: PostmanEndpoints['apisListReleases'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisListReleases']
	>('/apis/{apiId}/versions/{apiVersionId}/releases', ctx.key, {
		method: 'GET',
		path: {
			apiId: input.apiId,
			apiVersionId: input.apiVersionId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.apis.listReleases',
		{ ...input },
		'completed',
	);
	return response;
};

// v9-only endpoint, absent from the official v10 OpenAPI spec.
// Verified against: INFERRED: every other documented v9 relation type is served at GET .../relations/<type> (test, testsuite, contracttest, integrationtest, documentation, environment); unclassified follows the same pattern. Response follows the documented array-with-key convention.

export const getUnclassifiedRelations: PostmanEndpoints['apisGetUnclassifiedRelations'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['apisGetUnclassifiedRelations']
		>('/apis/{apiId}/versions/{apiVersionId}/unclassified', ctx.key, {
			method: 'GET',
			path: {
				apiId: input.apiId,
				apiVersionId: input.apiVersionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.apis.getUnclassifiedRelations',
			{ ...input },
			'completed',
		);
		return response;
	};
