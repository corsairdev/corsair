import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { appEnvPath, makeIgnisignRequest } from '../client';
import type {
	SignatureRequestPublishResponse,
	SignatureRequestsPaginate,
	SignatureRequestsStatusContainer,
} from './types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const createInOneCall: IgnisignEndpoint<
	'signatureRequests.createInOneCall'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.createInOneCall'].parse(
			input,
		);
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(
		'/v4/signature-requests/one-call-sign',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput as Record<string, unknown>,
		},
	);
	const response =
		IgnisignEndpointOutputSchemas['signatureRequests.createInOneCall'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.createInOneCall',
		{
			status: response.status ?? 'CREATED',
			signersCount: parsedInput.signers.length,
			documentsCount: parsedInput.documents.length,
		},
		'completed',
	);
	return response;
};

export const init: IgnisignEndpoint<'signatureRequests.init'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.init'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signature-requests`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		body: {},
	});
	const response =
		IgnisignEndpointOutputSchemas['signatureRequests.init'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.init',
		{ appId: parsedInput.appId, appEnv: parsedInput.appEnv },
		'completed',
	);
	return response;
};

export const initSignerSetup: IgnisignEndpoint<
	'signatureRequests.initSignerSetup'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.initSignerSetup'].parse(
			input,
		);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signer-setup`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		body: {},
	});
	const response =
		IgnisignEndpointOutputSchemas['signatureRequests.initSignerSetup'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.initSignerSetup',
		{ appId: parsedInput.appId, appEnv: parsedInput.appEnv },
		'completed',
	);
	return response;
};

export const list: IgnisignEndpoint<'signatureRequests.list'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.list'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signature-requests`;
	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.page !== undefined) {
		query.page = parsedInput.page;
	}
	const response = await makeIgnisignRequest<SignatureRequestsPaginate>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signatureRequests.list'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.list',
		{ count: parsed.signatureRequests.length },
		'completed',
	);
	return parsed;
};

export const getContext: IgnisignEndpoint<
	'signatureRequests.getContext'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.getContext'].parse(input);
	const endpoint = `/v4/signature-requests/${encodeURIComponent(parsedInput.signatureRequestId)}/context`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const response =
		IgnisignEndpointOutputSchemas['signatureRequests.getContext'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.getContext',
		{ signatureRequestId: parsedInput.signatureRequestId },
		'completed',
	);
	return response;
};

export const update: IgnisignEndpoint<'signatureRequests.update'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.update'].parse(input);
	const { signatureRequestId, ...body } = parsedInput;
	const endpoint = `/v4/signature-requests/${encodeURIComponent(signatureRequestId)}`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const response =
		IgnisignEndpointOutputSchemas['signatureRequests.update'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.update',
		{ signatureRequestId },
		'completed',
	);
	return response;
};

export const publish: IgnisignEndpoint<'signatureRequests.publish'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.publish'].parse(input);
	const endpoint = `/v4/signature-requests/${encodeURIComponent(parsedInput.signatureRequestId)}/publish`;
	const response = await makeIgnisignRequest<SignatureRequestPublishResponse>(
		endpoint,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signatureRequests.publish'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.publish',
		{ signatureRequestId: parsedInput.signatureRequestId },
		'completed',
	);
	return parsed;
};

export const close: IgnisignEndpoint<'signatureRequests.close'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.close'].parse(input);
	const endpoint = `/v4/signature-requests/${encodeURIComponent(parsedInput.signatureRequestId)}/close`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		body: {},
	});
	const response =
		IgnisignEndpointOutputSchemas['signatureRequests.close'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.close',
		{ signatureRequestId: parsedInput.signatureRequestId },
		'completed',
	);
	return response;
};

export const getStatus: IgnisignEndpoint<
	'signatureRequests.getStatus'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatureRequests.getStatus'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signature-requests/status`;
	const response = await makeIgnisignRequest<SignatureRequestsStatusContainer>(
		endpoint,
		ctx.key,
		{
			method: 'POST',
			body: { signatureRequestIds: parsedInput.signatureRequestIds },
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signatureRequests.getStatus'].parse(
			response,
		);
	await logEventFromContext(
		ctx,
		'ignisign.signatureRequests.getStatus',
		{ count: parsed.signatureRequests.length },
		'completed',
	);
	return parsed;
};

export const SignatureRequestsEndpoints = {
	createInOneCall,
	init,
	initSignerSetup,
	list,
	getContext,
	update,
	publish,
	close,
	getStatus,
} as const;
