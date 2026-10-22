import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const getOauthConfig: CodaEndpoints['packConnectionsGetOauthConfig'] = async (
	ctx,
	input,
) => {
	const { packId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packConnectionsGetOauthConfig']
	>(`packs/${encodeURIComponent(packId)}/oauthConfig`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.packConnections.getOauthConfig',
		{ ...input },
		'completed',
	);
	return response;
};

const setOauthConfig: CodaEndpoints['packConnectionsSetOauthConfig'] = async (
	ctx,
	input,
) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packConnectionsSetOauthConfig']
	>(`packs/${encodeURIComponent(packId)}/oauthConfig`, ctx.key, {
		method: 'PUT',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packConnections.setOauthConfig',
		{ packId: input.packId },
		'completed',
	);
	return response;
};

const getSystemConnection: CodaEndpoints['packConnectionsGetSystemConnection'] =
	async (ctx, input) => {
		const { packId } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['packConnectionsGetSystemConnection']
		>(`packs/${encodeURIComponent(packId)}/systemConnection`, ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'coda.packConnections.getSystemConnection',
			{ ...input },
			'completed',
		);
		return response;
	};

const setSystemConnection: CodaEndpoints['packConnectionsSetSystemConnection'] =
	async (ctx, input) => {
		const { packId, ...body } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['packConnectionsSetSystemConnection']
		>(`packs/${encodeURIComponent(packId)}/systemConnection`, ctx.key, {
			method: 'PUT',
			body,
		});
		await logEventFromContext(
			ctx,
			'coda.packConnections.setSystemConnection',
			{ packId: input.packId },
			'completed',
		);
		return response;
	};

const patchSystemConnection: CodaEndpoints['packConnectionsPatchSystemConnection'] =
	async (ctx, input) => {
		const { packId, body } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['packConnectionsPatchSystemConnection']
		>(`packs/${encodeURIComponent(packId)}/systemConnection`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			'coda.packConnections.patchSystemConnection',
			{ packId: input.packId },
			'completed',
		);
		return response;
	};

export const PackConnections = {
	getOauthConfig,
	setOauthConfig,
	getSystemConnection,
	setSystemConnection,
	patchSystemConnection,
};
