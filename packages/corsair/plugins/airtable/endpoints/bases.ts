import type { AirtableEndpoints } from '..';
import type { AirtableEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeAirtableRequest } from '../client';

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

	if (response.tables && ctx.db.records) {
		try {
			for (const table of response.tables) {
				for (const field of table.fields) {
					await ctx.db.records.upsertByEntityId(field.id, {
						...field,
						baseId: input.baseId,
						tableId: table.id,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save records to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'airtable.bases.getSchema',
		{ ...input },
		'completed',
	);
	return response;
};
