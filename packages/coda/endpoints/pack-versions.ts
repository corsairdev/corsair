import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packVersionsList'] = async (ctx, input) => {
	const { packId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packVersionsList']
	>(`packs/${encodeURIComponent(packId)}/versions`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.packVersions.list',
		{ ...input },
		'completed',
	);
	return response;
};

const getNext: CodaEndpoints['packVersionsGetNext'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packVersionsGetNext']
	>(`packs/${encodeURIComponent(packId)}/nextVersion`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packVersions.getNext',
		{ ...input },
		'completed',
	);
	return response;
};

const getDiff: CodaEndpoints['packVersionsGetDiff'] = async (ctx, input) => {
	const { packId, basePackVersion, targetPackVersion } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packVersionsGetDiff']
	>(
		`packs/${encodeURIComponent(packId)}/versions/${encodeURIComponent(basePackVersion)}/diff/${encodeURIComponent(targetPackVersion)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'coda.packVersions.getDiff',
		{ ...input },
		'completed',
	);
	return response;
};

const register: CodaEndpoints['packVersionsRegister'] = async (ctx, input) => {
	const { packId, packVersion, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packVersionsRegister']
	>(
		`packs/${encodeURIComponent(packId)}/versions/${encodeURIComponent(packVersion)}/register`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'coda.packVersions.register',
		{ ...input },
		'completed',
	);
	return response;
};

const uploadComplete: CodaEndpoints['packVersionsUploadComplete'] = async (
	ctx,
	input,
) => {
	const { packId, packVersion, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packVersionsUploadComplete']
	>(
		`packs/${encodeURIComponent(packId)}/versions/${encodeURIComponent(packVersion)}/uploadComplete`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'coda.packVersions.uploadComplete',
		{ ...input },
		'completed',
	);
	return response;
};

const uploadSourceCode: CodaEndpoints['packVersionsUploadSourceCode'] = async (
	ctx,
	input,
) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packVersionsUploadSourceCode']
	>(`packs/${encodeURIComponent(packId)}/uploadSourceCode`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packVersions.uploadSourceCode',
		{ ...input },
		'completed',
	);
	return response;
};

const sourceCodeUploadComplete: CodaEndpoints['packVersionsSourceCodeUploadComplete'] =
	async (ctx, input) => {
		const { packId, packVersion, ...body } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['packVersionsSourceCodeUploadComplete']
		>(
			`packs/${encodeURIComponent(packId)}/versions/${encodeURIComponent(packVersion)}/sourceCode/uploadComplete`,
			ctx.key,
			{ method: 'POST', body },
		);
		await logEventFromContext(
			ctx,
			'coda.packVersions.sourceCodeUploadComplete',
			{ ...input },
			'completed',
		);
		return response;
	};

const getSourceCode: CodaEndpoints['packVersionsGetSourceCode'] = async (
	ctx,
	input,
) => {
	const { packId, packVersion } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packVersionsGetSourceCode']
	>(
		`packs/${encodeURIComponent(packId)}/versions/${encodeURIComponent(packVersion)}/sourceCode`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'coda.packVersions.getSourceCode',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackVersions = {
	list,
	getNext,
	getDiff,
	register,
	uploadComplete,
	uploadSourceCode,
	sourceCodeUploadComplete,
	getSourceCode,
};
