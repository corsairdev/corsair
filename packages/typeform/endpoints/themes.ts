import { logEventFromContext } from 'corsair/core';
import type { TypeformEndpoints } from '..';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const list: TypeformEndpoints['themesList'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['themesList']
	>('/themes', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	if (response.items && ctx.db.themes) {
		for (const theme of response.items) {
			const id = theme.id;
			if (id) {
				try {
					// id narrowed to string; spread + override to satisfy DB entity requirement
					await ctx.db.themes.upsertByEntityId(id, { ...theme, id });
				} catch (error) {
					console.warn('Failed to save theme to database:', error);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.themes.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: TypeformEndpoints['themesGet'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['themesGet']
	>(`/themes/${input.theme_id}`, ctx.key);

	const id = response.id;
	if (id && ctx.db.themes) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.themes.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save theme to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.themes.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: TypeformEndpoints['themesCreate'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['themesCreate']
	>('/themes', ctx.key, {
		method: 'POST',
		body: input,
	});

	const id = response.id;
	if (id && ctx.db.themes) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.themes.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save theme to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.themes.create',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const update: TypeformEndpoints['themesUpdate'] = async (ctx, input) => {
	const { theme_id, ...body } = input;
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['themesUpdate']
	>(`/themes/${theme_id}`, ctx.key, {
		method: 'PUT',
		body: body,
	});

	const id = response.id;
	if (id && ctx.db.themes) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.themes.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save theme to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.themes.update',
		{ theme_id },
		'completed',
	);

	return response;
};

export const patch: TypeformEndpoints['themesPatch'] = async (ctx, input) => {
	const { theme_id, ...body } = input;
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['themesPatch']
	>(`/themes/${theme_id}`, ctx.key, {
		method: 'PATCH',
		body: body,
	});

	const id = response.id;
	if (id && ctx.db.themes) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.themes.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save theme to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.themes.patch',
		{ theme_id },
		'completed',
	);

	return response;
};

export const deleteTheme: TypeformEndpoints['themesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['themesDelete']
	>(`/themes/${input.theme_id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.themes) {
		try {
			await ctx.db.themes.deleteByEntityId(input.theme_id);
		} catch (error) {
			console.warn('Failed to delete theme from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.themes.delete',
		{ ...input },
		'completed',
	);

	return response;
};
