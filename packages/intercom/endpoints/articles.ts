import { logEventFromContext } from 'corsair/core';
import type { IntercomEndpoints } from '..';
import { makeIntercomRequest } from '../client';
import type { IntercomEndpointOutputs } from './types';

export const get: IntercomEndpoints['articlesGet'] = async (ctx, input) => {
	const { id, ...query } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['articlesGet']
	>(`articles/${id}`, ctx.key, {
		query,
	});

	if (result && ctx.db.articles) {
		try {
			await ctx.db.articles.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save article to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.articles.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: IntercomEndpoints['articlesList'] = async (ctx, input) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['articlesList']
	>('articles', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result?.data && ctx.db.articles) {
		try {
			for (const article of result.data) {
				await ctx.db.articles.upsertByEntityId(article.id, article);
			}
		} catch (error) {
			console.warn('Failed to save articles to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.articles.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: IntercomEndpoints['articlesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['articlesCreate']
	>('articles', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result && ctx.db.articles) {
		try {
			await ctx.db.articles.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save article to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.articles.create',
		{ title: input.title },
		'completed',
	);
	return result;
};

export const update: IntercomEndpoints['articlesUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['articlesUpdate']
	>(`articles/${id}`, ctx.key, {
		method: 'PUT',
		body: body,
	});

	if (result && ctx.db.articles) {
		try {
			await ctx.db.articles.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to update article in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.articles.update',
		{ id },
		'completed',
	);
	return result;
};

export const deleteArticle: IntercomEndpoints['articlesDelete'] = async (
	ctx,
	input,
) => {
	const { id } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['articlesDelete']
	>(`articles/${id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'intercom.articles.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: IntercomEndpoints['articlesSearch'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['articlesSearch']
	>('articles/search', ctx.key, {
		query: input,
	});

	if (result?.data && ctx.db.articles) {
		try {
			for (const article of result.data) {
				await ctx.db.articles.upsertByEntityId(article.id, article);
			}
		} catch (error) {
			console.warn('Failed to save articles to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.articles.search',
		{ phrase: input.phrase },
		'completed',
	);
	return result;
};
