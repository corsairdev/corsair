import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { assertSafePathParam, makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const get: PostmanEndpoints['specsGet'] = async (ctx, input) => {
	const response = await makePostmanRequest<PostmanEndpointOutputs['specsGet']>(
		'/specs/{specId}',
		ctx.key,
		{
			method: 'GET',
			path: {
				specId: input.specId,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'postman.specs.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: PostmanEndpoints['specsList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsList']
	>('/specs', ctx.key, {
		method: 'GET',
		query: {
			workspaceId: input.workspaceId,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getDefinition: PostmanEndpoints['specsGetDefinition'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsGetDefinition']
	>('/specs/{specId}/definitions', ctx.key, {
		method: 'GET',
		path: {
			specId: input.specId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.getDefinition',
		{ ...input },
		'completed',
	);
	return response;
};

export const getFile: PostmanEndpoints['specsGetFile'] = async (ctx, input) => {
	assertSafePathParam('filePath', input.filePath);
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsGetFile']
	>('/specs/{specId}/files/{filePath}', ctx.key, {
		method: 'GET',
		path: {
			specId: input.specId,
			filePath: input.filePath,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.getFile',
		{ ...input },
		'completed',
	);
	return response;
};

export const getGeneratedCollections: PostmanEndpoints['specsGetGeneratedCollections'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['specsGetGeneratedCollections']
		>('/specs/{specId}/generations/{elementType}', ctx.key, {
			method: 'GET',
			path: {
				specId: input.specId,
				elementType: input.elementType,
			},
			query: {
				limit: input.limit,
				cursor: input.cursor,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.specs.getGeneratedCollections',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFiles: PostmanEndpoints['specsGetFiles'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsGetFiles']
	>('/specs/{specId}/files', ctx.key, {
		method: 'GET',
		path: {
			specId: input.specId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.getFiles',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: PostmanEndpoints['specsCreate'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsCreate']
	>('/specs', ctx.key, {
		method: 'POST',
		query: {
			workspaceId: input.workspaceId,
		},
		body: {
			name: input.name,
			type: input.type,
			files: input.files,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteFile: PostmanEndpoints['specsDeleteFile'] = async (
	ctx,
	input,
) => {
	assertSafePathParam('filePath', input.filePath);
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsDeleteFile']
	>('/specs/{specId}/files/{filePath}', ctx.key, {
		method: 'DELETE',
		path: {
			specId: input.specId,
			filePath: input.filePath,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.deleteFile',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: PostmanEndpoints['specsRemove'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsRemove']
	>('/specs/{specId}', ctx.key, {
		method: 'DELETE',
		path: {
			specId: input.specId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const generateCollection: PostmanEndpoints['specsGenerateCollection'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['specsGenerateCollection']
		>('/specs/{specId}/generations/{elementType}', ctx.key, {
			method: 'POST',
			path: {
				specId: input.specId,
				elementType: input.elementType,
			},
			body: {
				name: input.name,
				options: input.options,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.specs.generateCollection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createFile: PostmanEndpoints['specsCreateFile'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsCreateFile']
	>('/specs/{specId}/files', ctx.key, {
		method: 'POST',
		path: {
			specId: input.specId,
		},
		body: {
			path: input.path,
			content: input.content,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.createFile',
		{ specId: input.specId },
		'completed',
	);
	return response;
};

export const syncWithCollection: PostmanEndpoints['specsSyncWithCollection'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['specsSyncWithCollection']
		>('/specs/{specId}/synchronizations', ctx.key, {
			method: 'PUT',
			path: {
				specId: input.specId,
			},
			query: {
				collectionUid: input.collectionUid,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.specs.syncWithCollection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateFile: PostmanEndpoints['specsUpdateFile'] = async (
	ctx,
	input,
) => {
	assertSafePathParam('filePath', input.filePath);
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsUpdateFile']
	>('/specs/{specId}/files/{filePath}', ctx.key, {
		method: 'PATCH',
		path: {
			specId: input.specId,
			filePath: input.filePath,
		},
		body: {
			name: input.name,
			type: input.type,
			content: input.content,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.updateFile',
		{ specId: input.specId, filePath: input.filePath },
		'completed',
	);
	return response;
};

export const update: PostmanEndpoints['specsUpdate'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['specsUpdate']
	>('/specs/{specId}', ctx.key, {
		method: 'PATCH',
		path: {
			specId: input.specId,
		},
		body: {
			name: input.name,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.specs.update',
		{ ...input },
		'completed',
	);
	return response;
};
