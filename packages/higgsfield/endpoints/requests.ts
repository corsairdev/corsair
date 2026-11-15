import { logEventFromContext } from 'corsair/core';
import {
	HiggsfieldAPIError,
	makeHiggsfieldRequest,
	requestPath,
} from '../client';
import type { HiggsfieldEndpoints } from '../index';
import {
	HiggsfieldEndpointInputSchemas,
	HiggsfieldEndpointOutputSchemas,
} from './types';

export const status: HiggsfieldEndpoints['requestsStatus'] = async (
	ctx,
	rawInput,
) => {
	const input = HiggsfieldEndpointInputSchemas.requestsStatus.parse(rawInput);
	const response = HiggsfieldEndpointOutputSchemas.requestsStatus.parse(
		await makeHiggsfieldRequest(
			ctx.key,
			requestPath(input.requestId, 'status'),
		),
	);
	await logEventFromContext(
		ctx,
		'higgsfield.requests.status',
		{ requestId: input.requestId, status: response.status },
		'completed',
	);
	return response;
};

/** 202 with an empty body while queued. Higgsfield answers 400 from the moment it starts, and also once it has finished. */
export const cancel: HiggsfieldEndpoints['requestsCancel'] = async (
	ctx,
	rawInput,
) => {
	const input = HiggsfieldEndpointInputSchemas.requestsCancel.parse(rawInput);
	try {
		await makeHiggsfieldRequest(
			ctx.key,
			requestPath(input.requestId, 'cancel'),
			{ method: 'POST' },
		);
	} catch (error) {
		if (error instanceof HiggsfieldAPIError && error.status === 400) {
			error.message +=
				' Only a queued request can be canceled: this one has started or finished, and a request that completes is charged.';
		}
		throw error;
	}
	const response = HiggsfieldEndpointOutputSchemas.requestsCancel.parse({
		request_id: input.requestId,
		status: 'canceled',
	});
	await logEventFromContext(
		ctx,
		'higgsfield.requests.cancel',
		{ requestId: input.requestId },
		'completed',
	);
	return response;
};

export const deleteRequest: HiggsfieldEndpoints['requestsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = HiggsfieldEndpointInputSchemas.requestsDelete.parse(rawInput);
	const response = HiggsfieldEndpointOutputSchemas.requestsDelete.parse(
		await makeHiggsfieldRequest(ctx.key, requestPath(input.requestId), {
			method: 'DELETE',
		}),
	);
	await logEventFromContext(
		ctx,
		'higgsfield.requests.delete',
		{ requestId: input.requestId },
		'completed',
	);
	return response;
};
