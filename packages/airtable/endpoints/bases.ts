import { logEventFromContext } from 'corsair/core';
import { makeAirtableRequest } from '../client';
import type { AirtableEndpoints } from '../index';
import type { AirtableEndpointOutputs } from './types';

export const getMany: AirtableEndpoints['basesGetMany'] = async (
	ctx,
	input,
) => {
	const response = await makeAirtableRequest<
		AirtableEndpointOutputs['basesGetMany']
	>('meta/bases', ctx.key, {
		method: 'GET',
		query: {
			offset: input.offset,
		},
	});

	if (response.bases && ctx.db.bases) {
		try {
			for (const base of response.bases) {
				await ctx.db.bases.upsertByEntityId(base.id, {
					...base,
				});
			}
		} catch (error) {
			console.warn('Failed to save bases to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'airtable.bases.getMany',
		{ ...input },
		'completed',
	);
	return response;
};

export const getSchema: AirtableEndpoints['basesGetSchema'] = async (
	ctx,
	input,
) => {
	const response = await makeAirtableRequest<
		AirtableEndpointOutputs['basesGetSchema']
	>(`meta/bases/${input.baseId}/tables`, ctx.key, {
		method: 'GET',
		query: {
			include: input.include?.join(','),
		},
	});

	await logEventFromContext(
		ctx,
		'airtable.bases.getSchema',
		{ ...input },
		'completed',
	);
	return response;
};
