import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { appEnvPath, makeIgnisignRequest } from '../client';
import type { SignerCreationResponse, SignersSearchResult } from './types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const create: IgnisignEndpoint<'signers.create'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signers.create'].parse(input);
	const { appId, appEnv, ...body } = parsedInput;
	const endpoint = `${appEnvPath(ctx.key, { appId, appEnv })}/signers`;
	const response = await makeIgnisignRequest<SignerCreationResponse>(
		endpoint,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signers.create'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signers.create',
		{ signerId: parsed.signerId, alreadyExists: parsed.alreadyExists },
		'completed',
	);
	return parsed;
};

export const getDetails: IgnisignEndpoint<'signers.getDetails'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signers.getDetails'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signers/${encodeURIComponent(parsedInput.signerId)}/details`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const response =
		IgnisignEndpointOutputSchemas['signers.getDetails'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.signers.getDetails',
		{ signerId: parsedInput.signerId },
		'completed',
	);
	return response;
};

export const getSummary: IgnisignEndpoint<'signers.getSummary'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signers.getSummary'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signers/${encodeURIComponent(parsedInput.signerId)}`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const response =
		IgnisignEndpointOutputSchemas['signers.getSummary'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.signers.getSummary',
		{ signerId: parsedInput.signerId },
		'completed',
	);
	return response;
};

export const update: IgnisignEndpoint<'signers.update'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signers.update'].parse(input);
	const { appId, appEnv, signerId, ...body } = parsedInput;
	const endpoint = `${appEnvPath(ctx.key, { appId, appEnv })}/signers/${encodeURIComponent(signerId)}`;
	const response = await makeIgnisignRequest<SignerCreationResponse>(
		endpoint,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signers.update'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signers.update',
		{ signerId },
		'completed',
	);
	return parsed;
};

export const revoke: IgnisignEndpoint<'signers.revoke'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signers.revoke'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signers/${encodeURIComponent(parsedInput.signerId)}/revoke`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'DELETE',
	});
	const response =
		IgnisignEndpointOutputSchemas['signers.revoke'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.signers.revoke',
		{ signerId: parsedInput.signerId },
		'completed',
	);
	return response;
};

export const regenerateAuthSecret: IgnisignEndpoint<
	'signers.regenerateAuthSecret'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signers.regenerateAuthSecret'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signers/${encodeURIComponent(parsedInput.signerId)}/regenerate-auth-secret`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'PUT',
		body: {},
	});
	const response =
		IgnisignEndpointOutputSchemas['signers.regenerateAuthSecret'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.signers.regenerateAuthSecret',
		{ signerId: parsedInput.signerId },
		'completed',
	);
	return response;
};

export const search: IgnisignEndpoint<'signers.search'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signers.search'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signers-search`;
	const response = await makeIgnisignRequest<SignersSearchResult>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
			query: { filter: parsedInput.filter },
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signers.search'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signers.search',
		{ total: parsed.total },
		'completed',
	);
	return parsed;
};

export const list: IgnisignEndpoint<'signers.list'> = async (ctx, input) => {
	const parsedInput = IgnisignEndpointInputSchemas['signers.list'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signers-paginate`;
	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.page !== undefined) {
		query.page = parsedInput.page;
	}
	const response = await makeIgnisignRequest<SignersSearchResult>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed = IgnisignEndpointOutputSchemas['signers.list'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signers.list',
		{ total: parsed.total },
		'completed',
	);
	return parsed;
};

export const SignersEndpoints = {
	create,
	getDetails,
	getSummary,
	update,
	revoke,
	regenerateAuthSecret,
	search,
	list,
} as const;
