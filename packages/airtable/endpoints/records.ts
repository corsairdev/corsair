import { logEventFromContext } from 'corsair/core';
import { makeAirtableRequest } from '../client';
import type { AirtableEndpoints } from '../index';
import type { AirtableEndpointOutputs } from './types';

const tablePath = (input: { baseId: string; tableIdOrName: string }) =>
	`${encodeURIComponent(input.baseId)}/${encodeURIComponent(input.tableIdOrName)}`;

export const create: AirtableEndpoints['recordsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeAirtableRequest<
		AirtableEndpointOutputs['recordsCreate']
	>(tablePath(input), ctx.key, {
		method: 'POST',
		body: {
			records: [{ fields: input.fields }],
			typecast: input.typecast,
		},
	});

	if (response.records && ctx.db.records) {
		try {
			for (const record of response.records) {
				await ctx.db.records.upsertByEntityId(record.id, {
					...record,
					baseId: input.baseId,
					tableId: input.tableIdOrName,
				});
			}
		} catch (error) {
			console.warn('Failed to save records to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'airtable.records.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const createOrUpdate: AirtableEndpoints['recordsCreateOrUpdate'] =
	async (ctx, input) => {
		const response = await makeAirtableRequest<
			AirtableEndpointOutputs['recordsCreateOrUpdate']
		>(tablePath(input), ctx.key, {
			method: 'PATCH',
			body: {
				records: [{ fields: input.fields }],
				performUpsert: {
					fieldsToMergeOn: input.fieldsToMergeOn,
				},
				typecast: input.typecast,
			},
		});

		if (response.records && ctx.db.records) {
			try {
				for (const record of response.records) {
					await ctx.db.records.upsertByEntityId(record.id, {
						...record,
						baseId: input.baseId,
						tableId: input.tableIdOrName,
					});
				}
			} catch (error) {
				console.warn('Failed to save records to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'airtable.records.createOrUpdate',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteRecord: AirtableEndpoints['recordsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeAirtableRequest<
		AirtableEndpointOutputs['recordsDelete']
	>(`${tablePath(input)}/${encodeURIComponent(input.recordId)}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.records && response.deleted && response.id) {
		try {
			await ctx.db.records.deleteByEntityId(response.id);
		} catch (error) {
			console.warn('Failed to delete records from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'airtable.records.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: AirtableEndpoints['recordsGet'] = async (ctx, input) => {
	const response = await makeAirtableRequest<
		AirtableEndpointOutputs['recordsGet']
	>(`${tablePath(input)}/${encodeURIComponent(input.recordId)}`, ctx.key, {
		method: 'GET',
		query: {
			returnFieldsByFieldId: input.returnFieldsByFieldId,
		},
	});

	if (ctx.db.records) {
		try {
			await ctx.db.records.upsertByEntityId(response.id, {
				...response,
				baseId: input.baseId,
				tableId: input.tableIdOrName,
			});
		} catch (error) {
			console.warn('Failed to save records to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'airtable.records.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const search: AirtableEndpoints['recordsSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeAirtableRequest<
		AirtableEndpointOutputs['recordsSearch']
	>(tablePath(input), ctx.key, {
		method: 'GET',
		query: {
			...input,
			sort: input.sort
				?.map((sort) => `${sort.field}:${sort.direction}`)
				.join(','),
			fields: input.fields?.join(','),
		},
	});

	if (response.records && ctx.db.records) {
		try {
			for (const record of response.records) {
				await ctx.db.records.upsertByEntityId(record.id, {
					...record,
					baseId: input.baseId,
					tableId: input.tableIdOrName,
				});
			}
		} catch (error) {
			console.warn('Failed to save records to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'airtable.records.search',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: AirtableEndpoints['recordsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeAirtableRequest<
		AirtableEndpointOutputs['recordsUpdate']
	>(tablePath(input), ctx.key, {
		method: 'PATCH',
		body: {
			records: [
				{
					id: input.recordId,
					fields: input.fields,
				},
			],
			typecast: input.typecast,
		},
	});

	if (response.records && ctx.db.records) {
		try {
			for (const record of response.records) {
				await ctx.db.records.upsertByEntityId(record.id, {
					...record,
					baseId: input.baseId,
					tableId: input.tableIdOrName,
				});
			}
		} catch (error) {
			console.warn('Failed to save records to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'airtable.records.update',
		{ ...input },
		'completed',
	);
	return response;
};
