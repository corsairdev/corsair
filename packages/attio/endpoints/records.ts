import { logEventFromContext } from 'corsair/core';
import { makeAttioRequest } from '../client';
import type { AttioEndpoints } from '../index';
import type { AttioEndpointOutputs } from './types';

export const list: AttioEndpoints['recordsList'] = async (ctx, input) => {
	const { object_slug } = input;
	const response = await makeAttioRequest<AttioEndpointOutputs['recordsList']>(
		`v2/objects/${object_slug}/records/query`,
		ctx.key,
		{ method: 'POST', body: {} },
	);

	if (response.data && ctx.db.records) {
		try {
			for (const record of response.data) {
				const entityId =
					typeof record.id === 'string' ? record.id : record.id.record_id;
				await ctx.db.records.upsertByEntityId(entityId, record);
			}
		} catch (error) {
			console.warn('Failed to save records to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'attio.records.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: AttioEndpoints['recordsGet'] = async (ctx, input) => {
	const { object_slug, record_id } = input;
	const response = await makeAttioRequest<{
		data: AttioEndpointOutputs['recordsGet'];
	}>(`v2/objects/${object_slug}/records/${record_id}`, ctx.key, {
		method: 'GET',
	});

	const result = response.data;

	if (result && ctx.db.records) {
		try {
			const entityId =
				typeof result.id === 'string' ? result.id : result.id.record_id;
			await ctx.db.records.upsertByEntityId(entityId, result);
		} catch (error) {
			console.warn('Failed to save record to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'attio.records.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: AttioEndpoints['recordsCreate'] = async (ctx, input) => {
	const { object_slug, values } = input;
	const response = await makeAttioRequest<{
		data: AttioEndpointOutputs['recordsCreate'];
	}>(`v2/objects/${object_slug}/records`, ctx.key, {
		method: 'POST',
		body: {
			data: {
				values,
			},
		},
	});

	const result = response.data;

	if (result && ctx.db.records) {
		try {
			const entityId =
				typeof result.id === 'string' ? result.id : result.id.record_id;
			await ctx.db.records.upsertByEntityId(entityId, result);
		} catch (error) {
			console.warn('Failed to save record to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'attio.records.create',
		{ ...input },
		'completed',
	);
	return result;
};
