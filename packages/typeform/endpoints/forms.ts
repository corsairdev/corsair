import { logEventFromContext } from 'corsair/core';
import type { TypeformEndpoints } from '..';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const list: TypeformEndpoints['formsList'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsList']
	>('/forms', ctx.key, {
		method: 'GET',
		query: { ...input },
	});

	if (response.items && ctx.db.forms) {
		for (const form of response.items) {
			const id = form.id;
			if (id) {
				try {
					// id is narrowed to string; spread + override to satisfy DB entity requirement
					await ctx.db.forms.upsertByEntityId(id, { ...form, id });
				} catch (error) {
					console.warn('Failed to save form to database:', error);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.forms.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: TypeformEndpoints['formsGet'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsGet']
	>(`/forms/${input.form_id}`, ctx.key);

	const id = response.id;
	if (id && ctx.db.forms) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.forms.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save form to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.forms.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: TypeformEndpoints['formsCreate'] = async (ctx, input) => {
	const { ...body } = input;
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsCreate']
	>('/forms', ctx.key, {
		method: 'POST',
		body: body,
	});

	const createId = response.id;
	if (createId && ctx.db.forms) {
		try {
			// createId narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.forms.upsertByEntityId(createId, {
				...response,
				id: createId,
			});
		} catch (error) {
			console.warn('Failed to save form to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.forms.create',
		{ title: input.title },
		'completed',
	);

	return response;
};

export const update: TypeformEndpoints['formsUpdate'] = async (ctx, input) => {
	const { form_id, ...body } = input;
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsUpdate']
	>(`/forms/${form_id}`, ctx.key, {
		method: 'PUT',
		body: body,
	});

	const updateId = response.id;
	if (updateId && ctx.db.forms) {
		try {
			// updateId narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.forms.upsertByEntityId(updateId, {
				...response,
				id: updateId,
			});
		} catch (error) {
			console.warn('Failed to save form to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.forms.update',
		{ form_id },
		'completed',
	);

	return response;
};

export const patch: TypeformEndpoints['formsPatch'] = async (ctx, input) => {
	const { form_id, operations } = input;
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsPatch']
	>(`/forms/${form_id}`, ctx.key, {
		method: 'PATCH',
		body: operations,
	});

	// PATCH /forms returns 204 No Content; re-fetch to sync DB
	if (ctx.db.forms) {
		try {
			const updated = await makeTypeformRequest<
				TypeformEndpointOutputs['formsGet']
			>(`/forms/${form_id}`, ctx.key);
			const id = updated.id;
			if (id) {
				await ctx.db.forms.upsertByEntityId(id, { ...updated, id });
			}
		} catch (error) {
			console.warn(
				'Failed to re-fetch form after patch for database sync:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.forms.patch',
		{ form_id },
		'completed',
	);

	return response;
};

export const deleteForm: TypeformEndpoints['formsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsDelete']
	>(`/forms/${input.form_id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.forms) {
		try {
			await ctx.db.forms.deleteByEntityId(input.form_id);
		} catch (error) {
			console.warn('Failed to delete form from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.forms.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const getMessages: TypeformEndpoints['formsGetMessages'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsGetMessages']
	>(`/forms/${input.form_id}/messages`, ctx.key);

	await logEventFromContext(
		ctx,
		'typeform.forms.getMessages',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateMessages: TypeformEndpoints['formsUpdateMessages'] = async (
	ctx,
	input,
) => {
	const { form_id, ...body } = input;
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['formsUpdateMessages']
	>(`/forms/${form_id}/messages`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'typeform.forms.updateMessages',
		{ form_id },
		'completed',
	);

	return response;
};
