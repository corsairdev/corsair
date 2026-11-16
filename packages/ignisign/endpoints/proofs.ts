import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { makeIgnisignBinaryRequest } from '../client';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const downloadSignatureByType: IgnisignEndpoint<
	'proofs.downloadSignatureByType'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['proofs.downloadSignatureByType'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/signature-type/${encodeURIComponent(parsedInput.signatureType)}`;
	const binaryResponse = await makeIgnisignBinaryRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const parsed =
		IgnisignEndpointOutputSchemas['proofs.downloadSignatureByType'].parse(
			binaryResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.proofs.downloadSignatureByType',
		{
			documentId: parsedInput.documentId,
			signatureType: parsedInput.signatureType,
			size: parsed.size,
		},
		'completed',
	);
	return parsed;
};

export const downloadLowLevelSignatureProof: IgnisignEndpoint<
	'proofs.downloadLowLevelSignatureProof'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['proofs.downloadLowLevelSignatureProof'].parse(
			input,
		);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/signature-type/${encodeURIComponent(parsedInput.signatureType)}/signers/${encodeURIComponent(parsedInput.signerId)}`;
	const binaryResponse = await makeIgnisignBinaryRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const parsed =
		IgnisignEndpointOutputSchemas[
			'proofs.downloadLowLevelSignatureProof'
		].parse(binaryResponse);
	await logEventFromContext(
		ctx,
		'ignisign.proofs.downloadLowLevelSignatureProof',
		{
			documentId: parsedInput.documentId,
			signatureType: parsedInput.signatureType,
			signerId: parsedInput.signerId,
			size: parsed.size,
		},
		'completed',
	);
	return parsed;
};

export const ProofsEndpoints = {
	downloadSignatureByType,
	downloadLowLevelSignatureProof,
} as const;
