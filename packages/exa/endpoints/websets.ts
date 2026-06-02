import { logEventFromContext } from 'corsair/core';
import { makeExaRequest } from '../client';
import type { ExaEndpoints } from '../index';
import type { ExaEndpointOutputs } from './types';

export const createWebset: ExaEndpoints['websetsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeExaRequest<ExaEndpointOutputs['websetsCreate']>(
		'websets/v0/websets',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	if (ctx.db.websets) {
		try {
			await ctx.db.websets.upsertByEntityId(result.id, {
				id: result.id,
				status: result.status,
				externalId: result.externalId,
				createdAt: new Date(result.createdAt),
			});
		} catch (error) {
			console.warn('Failed to save webset to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.websets.create',
		{ externalId: input.externalId },
		'completed',
	);
	return result;
};

export const getWebset: ExaEndpoints['websetsGet'] = async (ctx, input) => {
	const result = await makeExaRequest<ExaEndpointOutputs['websetsGet']>(
		`websets/v0/websets/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (ctx.db.websets) {
		try {
			await ctx.db.websets.upsertByEntityId(result.id, {
				id: result.id,
				status: result.status,
				externalId: result.externalId,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
			});
		} catch (error) {
			console.warn('Failed to save webset to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.websets.get',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const deleteWebset: ExaEndpoints['websetsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeExaRequest<ExaEndpointOutputs['websetsDelete']>(
		`websets/v0/websets/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (result.deleted && ctx.db.websets) {
		try {
			await ctx.db.websets.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete webset from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.websets.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
