import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import { savePacks } from './persist';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packsList'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['packsList']>(
		'packs',
		ctx.key,
		{ method: 'GET', query: input },
	);
	await savePacks(ctx, response.items, true);
	await logEventFromContext(ctx, 'coda.packs.list', { ...input }, 'completed');
	return response;
};

const get: CodaEndpoints['packsGet'] = async (ctx, input) => {
	const { packId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['packsGet']>(
		`packs/${encodeURIComponent(packId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await savePacks(ctx, [response]);
	await logEventFromContext(ctx, 'coda.packs.get', { ...input }, 'completed');
	return response;
};

const create: CodaEndpoints['packsCreate'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['packsCreate']>(
		'packs',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'coda.packs.create',
		{ ...input },
		'completed',
	);
	return response;
};

const update: CodaEndpoints['packsUpdate'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['packsUpdate']>(
		`packs/${encodeURIComponent(packId)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(
		ctx,
		'coda.packs.update',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['packsDelete'] = async (ctx, input) => {
	const { packId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['packsDelete']>(
		`packs/${encodeURIComponent(packId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.packs.delete',
		{ ...input },
		'completed',
	);
	return response;
};

const getConfigurationSchema: CodaEndpoints['packsGetConfigurationSchema'] =
	async (ctx, input) => {
		const { packId } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['packsGetConfigurationSchema']
		>(`packs/${encodeURIComponent(packId)}/configurations/schema`, ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'coda.packs.getConfigurationSchema',
			{ ...input },
			'completed',
		);
		return response;
	};

export const Packs = {
	list,
	get,
	create,
	update,
	delete: deleteOne,
	getConfigurationSchema,
};
