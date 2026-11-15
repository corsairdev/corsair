import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { makeIgnisignRequest } from '../client';
import type { Signature, SignatureImages } from './types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const list: IgnisignEndpoint<'signatures.list'> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatures.list'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/signatures`;
	const response = await makeIgnisignRequest<Signature[]>(endpoint, ctx.key, {
		method: 'GET',
	});
	const parsed =
		IgnisignEndpointOutputSchemas['signatures.list'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signatures.list',
		{ documentId: parsedInput.documentId, count: parsed.length },
		'completed',
	);
	return parsed;
};

export const get: IgnisignEndpoint<'signatures.get'> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatures.get'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/signatures/${encodeURIComponent(parsedInput.signatureId)}`;
	const response = await makeIgnisignRequest<Signature>(endpoint, ctx.key, {
		method: 'GET',
	});
	const parsed =
		IgnisignEndpointOutputSchemas['signatures.get'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signatures.get',
		{
			documentId: parsedInput.documentId,
			signatureId: parsedInput.signatureId,
		},
		'completed',
	);
	return parsed;
};

export const getImages: IgnisignEndpoint<'signatures.getImages'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signatures.getImages'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/img-signatures`;
	const response = await makeIgnisignRequest<SignatureImages>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signatures.getImages'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signatures.getImages',
		{
			documentId: parsedInput.documentId,
			signaturesCount: parsed.signatures.length,
		},
		'completed',
	);
	return parsed;
};

export const SignaturesEndpoints = {
	list,
	get,
	getImages,
} as const;
