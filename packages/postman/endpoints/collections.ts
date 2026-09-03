import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const list: PostmanEndpoints['collectionsList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsList']
	>('/collections', ctx.key, {
		method: 'GET',
		query: {
			workspace: input.workspace,
			name: input.name,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const listForked: PostmanEndpoints['collectionsListForked'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsListForked']
	>('/collections/collection-forks', ctx.key, {
		method: 'GET',
		query: {
			cursor: input.cursor,
			limit: input.limit,
			direction: input.direction,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.listForked',
		{ ...input },
		'completed',
	);
	return response;
};

export const getUpdateStatus: PostmanEndpoints['collectionsGetUpdateStatus'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetUpdateStatus']
		>('/collection-updates-tasks/{taskId}', ctx.key, {
			method: 'GET',
			path: {
				taskId: input.taskId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getUpdateStatus',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getComments: PostmanEndpoints['collectionsGetComments'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsGetComments']
	>('/collections/{collectionId}/comments', ctx.key, {
		method: 'GET',
		path: {
			collectionId: input.collectionId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.getComments',
		{ ...input },
		'completed',
	);
	return response;
};

export const getPullRequests: PostmanEndpoints['collectionsGetPullRequests'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetPullRequests']
		>('/collections/{collectionId}/pull-requests', ctx.key, {
			method: 'GET',
			path: {
				collectionId: input.collectionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getPullRequests',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getRoles: PostmanEndpoints['collectionsGetRoles'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsGetRoles']
	>('/collections/{collectionId}/roles', ctx.key, {
		method: 'GET',
		path: {
			collectionId: input.collectionId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.getRoles',
		{ ...input },
		'completed',
	);
	return response;
};

export const getForks: PostmanEndpoints['collectionsGetForks'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsGetForks']
	>('/collections/{collectionId}/forks', ctx.key, {
		method: 'GET',
		path: {
			collectionId: input.collectionId,
		},
		query: {
			cursor: input.cursor,
			limit: input.limit,
			direction: input.direction,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.getForks',
		{ ...input },
		'completed',
	);
	return response;
};

export const getDuplicationStatus: PostmanEndpoints['collectionsGetDuplicationStatus'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetDuplicationStatus']
		>('/collection-duplicate-tasks/{taskId}', ctx.key, {
			method: 'GET',
			path: {
				taskId: input.taskId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getDuplicationStatus',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFolderComments: PostmanEndpoints['collectionsGetFolderComments'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetFolderComments']
		>('/collections/{collectionId}/folders/{folderId}/comments', ctx.key, {
			method: 'GET',
			path: {
				collectionId: input.collectionId,
				folderId: input.folderId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getFolderComments',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFolder: PostmanEndpoints['collectionsGetFolder'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsGetFolder']
	>('/collections/{collectionId}/folders/{folderId}', ctx.key, {
		method: 'GET',
		path: {
			folderId: input.folderId,
			collectionId: input.collectionId,
		},
		query: {
			ids: input.ids,
			uid: input.uid,
			populate: input.populate,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.getFolder',
		{ ...input },
		'completed',
	);
	return response;
};

export const getGeneratedSpecs: PostmanEndpoints['collectionsGetGeneratedSpecs'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetGeneratedSpecs']
		>('/collections/{collectionUid}/generations/{elementType}', ctx.key, {
			method: 'GET',
			path: {
				collectionUid: input.collectionUid,
				elementType: input.elementType,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getGeneratedSpecs',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getRequestComments: PostmanEndpoints['collectionsGetRequestComments'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetRequestComments']
		>('/collections/{collectionId}/requests/{requestId}/comments', ctx.key, {
			method: 'GET',
			path: {
				collectionId: input.collectionId,
				requestId: input.requestId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getRequestComments',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getRequest: PostmanEndpoints['collectionsGetRequest'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsGetRequest']
	>('/collections/{collectionId}/requests/{requestId}', ctx.key, {
		method: 'GET',
		path: {
			requestId: input.requestId,
			collectionId: input.collectionId,
		},
		query: {
			ids: input.ids,
			uid: input.uid,
			populate: input.populate,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.getRequest',
		{ ...input },
		'completed',
	);
	return response;
};

export const getResponseComments: PostmanEndpoints['collectionsGetResponseComments'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetResponseComments']
		>('/collections/{collectionId}/responses/{responseId}/comments', ctx.key, {
			method: 'GET',
			path: {
				collectionId: input.collectionId,
				responseId: input.responseId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getResponseComments',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getResponse: PostmanEndpoints['collectionsGetResponse'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsGetResponse']
	>('/collections/{collectionId}/responses/{responseId}', ctx.key, {
		method: 'GET',
		path: {
			responseId: input.responseId,
			collectionId: input.collectionId,
		},
		query: {
			ids: input.ids,
			uid: input.uid,
			populate: input.populate,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.getResponse',
		{ ...input },
		'completed',
	);
	return response;
};

export const getSourceStatus: PostmanEndpoints['collectionsGetSourceStatus'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsGetSourceStatus']
		>('/collections/{collectionId}/source-status', ctx.key, {
			method: 'GET',
			path: {
				collectionId: input.collectionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.getSourceStatus',
			{ ...input },
			'completed',
		);
		return response;
	};

export const create: PostmanEndpoints['collectionsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsCreate']
	>('/collections', ctx.key, {
		method: 'POST',
		query: {
			workspace: input.workspace,
		},
		body: {
			collection: input.collection,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const createComment: PostmanEndpoints['collectionsCreateComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsCreateComment']
		>('/collections/{collectionId}/comments', ctx.key, {
			method: 'POST',
			path: {
				collectionId: input.collectionId,
			},
			body: {
				body: input.body,
				threadId: input.threadId,
				tags: input.tags,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.createComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createFolder: PostmanEndpoints['collectionsCreateFolder'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsCreateFolder']
	>('/collections/{collectionId}/folders', ctx.key, {
		method: 'POST',
		path: {
			collectionId: input.collectionId,
		},
		body: {
			name: input.name,
			folder: input.folder,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.createFolder',
		{ ...input },
		'completed',
	);
	return response;
};

export const createFolderComment: PostmanEndpoints['collectionsCreateFolderComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsCreateFolderComment']
		>('/collections/{collectionId}/folders/{folderId}/comments', ctx.key, {
			method: 'POST',
			path: {
				collectionId: input.collectionId,
				folderId: input.folderId,
			},
			body: {
				body: input.body,
				threadId: input.threadId,
				tags: input.tags,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.createFolderComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createPullRequest: PostmanEndpoints['collectionsCreatePullRequest'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsCreatePullRequest']
		>('/collections/{collectionId}/pull-requests', ctx.key, {
			method: 'POST',
			path: {
				collectionId: input.collectionId,
			},
			body: {
				title: input.title,
				description: input.description,
				reviewers: input.reviewers,
				destinationId: input.destinationId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.createPullRequest',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createRequestComment: PostmanEndpoints['collectionsCreateRequestComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsCreateRequestComment']
		>('/collections/{collectionId}/requests/{requestId}/comments', ctx.key, {
			method: 'POST',
			path: {
				collectionId: input.collectionId,
				requestId: input.requestId,
			},
			body: {
				body: input.body,
				threadId: input.threadId,
				tags: input.tags,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.createRequestComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createResponse: PostmanEndpoints['collectionsCreateResponse'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsCreateResponse']
		>('/collections/{collectionId}/responses', ctx.key, {
			method: 'POST',
			path: {
				collectionId: input.collectionId,
			},
			query: {
				request: input.request,
			},
			body: {
				name: input.name,
				description: input.description,
				url: input.url,
				method: input.method,
				headers: input.headers,
				dataMode: input.dataMode,
				rawModeData: input.rawModeData,
				dataOptions: input.dataOptions,
				responseCode: input.responseCode,
				status: input.status,
				time: input.time,
				cookies: input.cookies,
				mime: input.mime,
				text: input.text,
				language: input.language,
				rawDataType: input.rawDataType,
				requestObject: input.requestObject,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.createResponse',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createResponseComment: PostmanEndpoints['collectionsCreateResponseComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsCreateResponseComment']
		>('/collections/{collectionId}/responses/{responseId}/comments', ctx.key, {
			method: 'POST',
			path: {
				collectionId: input.collectionId,
				responseId: input.responseId,
			},
			body: {
				body: input.body,
				threadId: input.threadId,
				tags: input.tags,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.createResponseComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const remove: PostmanEndpoints['collectionsRemove'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsRemove']
	>('/collections/{collectionId}', ctx.key, {
		method: 'DELETE',
		path: {
			collectionId: input.collectionId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteFolder: PostmanEndpoints['collectionsDeleteFolder'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsDeleteFolder']
	>('/collections/{collectionId}/folders/{folderId}', ctx.key, {
		method: 'DELETE',
		path: {
			folderId: input.folderId,
			collectionId: input.collectionId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.deleteFolder',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteFolderComment: PostmanEndpoints['collectionsDeleteFolderComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsDeleteFolderComment']
		>(
			'/collections/{collectionId}/folders/{folderId}/comments/{commentId}',
			ctx.key,
			{
				method: 'DELETE',
				path: {
					collectionId: input.collectionId,
					folderId: input.folderId,
					commentId: input.commentId,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'postman.collections.deleteFolderComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteRequestComment: PostmanEndpoints['collectionsDeleteRequestComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsDeleteRequestComment']
		>(
			'/collections/{collectionId}/requests/{requestId}/comments/{commentId}',
			ctx.key,
			{
				method: 'DELETE',
				path: {
					collectionId: input.collectionId,
					requestId: input.requestId,
					commentId: input.commentId,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'postman.collections.deleteRequestComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteResponse: PostmanEndpoints['collectionsDeleteResponse'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsDeleteResponse']
		>('/collections/{collectionId}/responses/{responseId}', ctx.key, {
			method: 'DELETE',
			path: {
				responseId: input.responseId,
				collectionId: input.collectionId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.deleteResponse',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteResponseComment: PostmanEndpoints['collectionsDeleteResponseComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsDeleteResponseComment']
		>(
			'/collections/{collectionId}/responses/{responseId}/comments/{commentId}',
			ctx.key,
			{
				method: 'DELETE',
				path: {
					collectionId: input.collectionId,
					responseId: input.responseId,
					commentId: input.commentId,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'postman.collections.deleteResponseComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteComment: PostmanEndpoints['collectionsDeleteComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsDeleteComment']
		>('/collections/{collectionId}/comments/{commentId}', ctx.key, {
			method: 'DELETE',
			path: {
				collectionId: input.collectionId,
				commentId: input.commentId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.deleteComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const duplicate: PostmanEndpoints['collectionsDuplicate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsDuplicate']
	>('/collections/{collectionId}/duplicates', ctx.key, {
		method: 'POST',
		path: {
			collectionId: input.collectionId,
		},
		body: {
			workspace: input.workspace,
			suffix: input.suffix,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.duplicate',
		{ ...input },
		'completed',
	);
	return response;
};

export const fork: PostmanEndpoints['collectionsFork'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsFork']
	>('/collections/fork/{collectionId}', ctx.key, {
		method: 'POST',
		path: {
			collectionId: input.collectionId,
		},
		query: {
			workspace: input.workspace,
		},
		body: {
			label: input.label,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.fork',
		{ ...input },
		'completed',
	);
	return response;
};

export const generateSpec: PostmanEndpoints['collectionsGenerateSpec'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsGenerateSpec']
	>('/collections/{collectionUid}/generations/{elementType}', ctx.key, {
		method: 'POST',
		path: {
			collectionUid: input.collectionUid,
			elementType: input.elementType,
		},
		body: {
			name: input.name,
			type: input.type,
			format: input.format,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.generateSpec',
		{ ...input },
		'completed',
	);
	return response;
};

export const createRequest: PostmanEndpoints['collectionsCreateRequest'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsCreateRequest']
		>('/collections/{collectionId}/requests', ctx.key, {
			method: 'POST',
			path: {
				collectionId: input.collectionId,
			},
			query: {
				folder: input.folder,
			},
			body: {
				name: input.name,
				description: input.description,
				method: input.method,
				url: input.url,
				headerData: input.headerData,
				queryParams: input.queryParams,
				dataMode: input.dataMode,
				data: input.data,
				rawModeData: input.rawModeData,
				graphqlModeData: input.graphqlModeData,
				dataOptions: input.dataOptions,
				auth: input.auth,
				events: input.events,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.createRequest',
			{ ...input },
			'completed',
		);
		return response;
	};

export const mergeFork: PostmanEndpoints['collectionsMergeFork'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsMergeFork']
	>('/collections/merge', ctx.key, {
		method: 'POST',
		body: {
			destination: input.destination,
			source: input.source,
			strategy: input.strategy,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.mergeFork',
		{ ...input },
		'completed',
	);
	return response;
};

export const pullChanges: PostmanEndpoints['collectionsPullChanges'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsPullChanges']
	>('/collections/{collectionId}/pulls', ctx.key, {
		method: 'PUT',
		path: {
			collectionId: input.collectionId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.pullChanges',
		{ ...input },
		'completed',
	);
	return response;
};

export const replace: PostmanEndpoints['collectionsReplace'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsReplace']
	>('/collections/{collectionId}', ctx.key, {
		method: 'PUT',
		path: {
			collectionId: input.collectionId,
		},
		body: {
			collection: input.collection,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.replace',
		{ ...input },
		'completed',
	);
	return response;
};

export const syncWithSchema: PostmanEndpoints['collectionsSyncWithSchema'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsSyncWithSchema']
		>(
			'/apis/{apiId}/collections/{collectionId}/sync-with-schema-tasks',
			ctx.key,
			{
				method: 'PUT',
				path: {
					apiId: input.apiId,
					collectionId: input.collectionId,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'postman.collections.syncWithSchema',
			{ ...input },
			'completed',
		);
		return response;
	};

export const syncWithSpec: PostmanEndpoints['collectionsSyncWithSpec'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsSyncWithSpec']
	>('/collections/{collectionUid}/synchronizations', ctx.key, {
		method: 'PUT',
		path: {
			collectionUid: input.collectionUid,
		},
		query: {
			specId: input.specId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.syncWithSpec',
		{ ...input },
		'completed',
	);
	return response;
};

export const transferFolders: PostmanEndpoints['collectionsTransferFolders'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsTransferFolders']
		>('/collection-folders-transfers', ctx.key, {
			method: 'POST',
			body: {
				ids: input.ids,
				mode: input.mode,
				target: input.target,
				location: input.location,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.transferFolders',
			{ ...input },
			'completed',
		);
		return response;
	};

export const transformToOpenapi: PostmanEndpoints['collectionsTransformToOpenapi'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsTransformToOpenapi']
		>('/collections/{collectionId}/transformations', ctx.key, {
			method: 'GET',
			path: {
				collectionId: input.collectionId,
			},
			query: {
				format: input.format,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.transformToOpenapi',
			{ ...input },
			'completed',
		);
		return response;
	};

export const update: PostmanEndpoints['collectionsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsUpdate']
	>('/collections/{collectionId}', ctx.key, {
		method: 'PATCH',
		path: {
			collectionId: input.collectionId,
		},
		body: {
			collection: input.collection,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateRequest: PostmanEndpoints['collectionsUpdateRequest'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsUpdateRequest']
		>('/collections/{collectionId}/requests/{requestId}', ctx.key, {
			method: 'PUT',
			path: {
				requestId: input.requestId,
				collectionId: input.collectionId,
			},
			body: {
				name: input.name,
				description: input.description,
				method: input.method,
				url: input.url,
				headerData: input.headerData,
				queryParams: input.queryParams,
				dataMode: input.dataMode,
				data: input.data,
				rawModeData: input.rawModeData,
				graphqlModeData: input.graphqlModeData,
				dataOptions: input.dataOptions,
				auth: input.auth,
				events: input.events,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.updateRequest',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateFolder: PostmanEndpoints['collectionsUpdateFolder'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['collectionsUpdateFolder']
	>('/collections/{collectionId}/folders/{folderId}', ctx.key, {
		method: 'PUT',
		path: {
			folderId: input.folderId,
			collectionId: input.collectionId,
		},
		body: {
			name: input.name,
			description: input.description,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.collections.updateFolder',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateFolderComment: PostmanEndpoints['collectionsUpdateFolderComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsUpdateFolderComment']
		>(
			'/collections/{collectionId}/folders/{folderId}/comments/{commentId}',
			ctx.key,
			{
				method: 'PUT',
				path: {
					collectionId: input.collectionId,
					folderId: input.folderId,
					commentId: input.commentId,
				},
				body: {
					body: input.body,
					tags: input.tags,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'postman.collections.updateFolderComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateRequestComment: PostmanEndpoints['collectionsUpdateRequestComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsUpdateRequestComment']
		>(
			'/collections/{collectionId}/requests/{requestId}/comments/{commentId}',
			ctx.key,
			{
				method: 'PUT',
				path: {
					collectionId: input.collectionId,
					requestId: input.requestId,
					commentId: input.commentId,
				},
				body: {
					body: input.body,
					tags: input.tags,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'postman.collections.updateRequestComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateResponse: PostmanEndpoints['collectionsUpdateResponse'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsUpdateResponse']
		>('/collections/{collectionId}/responses/{responseId}', ctx.key, {
			method: 'PUT',
			path: {
				responseId: input.responseId,
				collectionId: input.collectionId,
			},
			body: {
				name: input.name,
				description: input.description,
				url: input.url,
				method: input.method,
				headers: input.headers,
				dataMode: input.dataMode,
				rawModeData: input.rawModeData,
				dataOptions: input.dataOptions,
				responseCode: input.responseCode,
				status: input.status,
				time: input.time,
				cookies: input.cookies,
				mime: input.mime,
				text: input.text,
				language: input.language,
				rawDataType: input.rawDataType,
				requestObject: input.requestObject,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.collections.updateResponse',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateResponseComment: PostmanEndpoints['collectionsUpdateResponseComment'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['collectionsUpdateResponseComment']
		>(
			'/collections/{collectionId}/responses/{responseId}/comments/{commentId}',
			ctx.key,
			{
				method: 'PUT',
				path: {
					collectionId: input.collectionId,
					responseId: input.responseId,
					commentId: input.commentId,
				},
				body: {
					body: input.body,
					tags: input.tags,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'postman.collections.updateResponseComment',
			{ ...input },
			'completed',
		);
		return response;
	};
