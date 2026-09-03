import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const list: PostmanEndpoints['mocksList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['mocksList']
	>('/mocks', ctx.key, {
		method: 'GET',
		query: {
			teamId: input.teamId,
			workspace: input.workspace,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.mocks.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: PostmanEndpoints['mocksCreate'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['mocksCreate']
	>('/mocks', ctx.key, {
		method: 'POST',
		query: {
			workspace: input.workspace,
		},
		body: {
			mock: input.mock,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.mocks.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteServerResponse: PostmanEndpoints['mocksDeleteServerResponse'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['mocksDeleteServerResponse']
		>('/mocks/{mockId}/server-responses/{serverResponseId}', ctx.key, {
			method: 'DELETE',
			path: {
				mockId: input.mockId,
				serverResponseId: input.serverResponseId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.mocks.deleteServerResponse',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createServerResponse: PostmanEndpoints['mocksCreateServerResponse'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['mocksCreateServerResponse']
		>('/mocks/{mockId}/server-responses', ctx.key, {
			method: 'POST',
			path: {
				mockId: input.mockId,
			},
			body: {
				serverResponse: input.serverResponse,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.mocks.createServerResponse',
			{ ...input },
			'completed',
		);
		return response;
	};

export const publish: PostmanEndpoints['mocksPublish'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['mocksPublish']
	>('/mocks/{mockId}/publish', ctx.key, {
		method: 'POST',
		path: {
			mockId: input.mockId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.mocks.publish',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: PostmanEndpoints['mocksUpdate'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['mocksUpdate']
	>('/mocks/{mockId}', ctx.key, {
		method: 'PUT',
		path: {
			mockId: input.mockId,
		},
		body: {
			mock: input.mock,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.mocks.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateServerResponse: PostmanEndpoints['mocksUpdateServerResponse'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['mocksUpdateServerResponse']
		>('/mocks/{mockId}/server-responses/{serverResponseId}', ctx.key, {
			method: 'PUT',
			path: {
				mockId: input.mockId,
				serverResponseId: input.serverResponseId,
			},
			body: {
				serverResponse: input.serverResponse,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.mocks.updateServerResponse',
			{ ...input },
			'completed',
		);
		return response;
	};
