import { logEventFromContext } from 'corsair/core';
import type { TypeformEndpoints } from '..';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const list: TypeformEndpoints['responsesList'] = async (ctx, input) => {
	const { form_id, fields, response_type, answered_fields, ...rest } = input;

	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['responsesList']
	>(`/forms/${form_id}/responses`, ctx.key, {
		method: 'GET',
		query: {
			...rest,
			// Array params are joined as comma-separated strings for query serialization
			fields: fields?.join(','),
			response_type: response_type?.join(','),
			answered_fields: answered_fields?.join(','),
		},
	});

	if (response.items && ctx.db.responses) {
		for (const item of response.items) {
			if (item.response_id) {
				try {
					await ctx.db.responses.upsertByEntityId(item.response_id, {
						response_id: item.response_id,
						form_id,
						...item,
					});
				} catch (error) {
					console.warn('Failed to save response to database:', error);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.responses.list',
		{ form_id },
		'completed',
	);

	return response;
};

export const deleteResponses: TypeformEndpoints['responsesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['responsesDelete']
	>(`/forms/${input.form_id}/responses`, ctx.key, {
		method: 'DELETE',
		query: { included_response_ids: input.included_response_ids },
	});

	if (ctx.db.responses) {
		const ids = input.included_response_ids
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);
		for (const id of ids) {
			try {
				await ctx.db.responses.deleteByEntityId(id);
			} catch (error) {
				console.warn('Failed to delete response from database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.responses.delete',
		{ form_id: input.form_id },
		'completed',
	);

	return response;
};

export const getAllFiles: TypeformEndpoints['responsesGetAllFiles'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['responsesGetAllFiles']
	>(`/forms/${input.form_id}/responses/files`, ctx.key);

	await logEventFromContext(
		ctx,
		'typeform.responses.getAllFiles',
		{ ...input },
		'completed',
	);

	return response;
};
