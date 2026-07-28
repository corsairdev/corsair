import { logEventFromContext } from 'corsair/core';

import { makeMailchimpRequest } from '../client';
import type { MailchimpEndpoints } from '../index';
import type { MailchimpEndpointOutputs } from './types';

/* ------------------------------ Interest categories ---------------------- */

export const categoriesList: MailchimpEndpoints['interestCategoriesList'] =
	async (ctx, input) => {
		const response = await makeMailchimpRequest<
			MailchimpEndpointOutputs['interestCategoriesList']
		>(`/lists/${input.list_id}/interest-categories`, ctx.key, {
			method: 'GET',
			query: { count: input.count, offset: input.offset },
		});

		await logEventFromContext(
			ctx,
			'mailchimp.interestCategories.list',
			{ ...input },
			'completed',
		);
		return response;
	};

export const categoriesGet: MailchimpEndpoints['interestCategoriesGet'] =
	async (ctx, input) => {
		const response = await makeMailchimpRequest<
			MailchimpEndpointOutputs['interestCategoriesGet']
		>(
			`/lists/${input.list_id}/interest-categories/${input.interest_category_id}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'mailchimp.interestCategories.get',
			{ ...input },
			'completed',
		);
		return response;
	};

export const categoriesCreate: MailchimpEndpoints['interestCategoriesCreate'] =
	async (ctx, input) => {
		const { list_id, ...body } = input;
		const response = await makeMailchimpRequest<
			MailchimpEndpointOutputs['interestCategoriesCreate']
		>(`/lists/${list_id}/interest-categories`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'mailchimp.interestCategories.create',
			{ ...input },
			'completed',
		);
		return response;
	};

export const categoriesUpdate: MailchimpEndpoints['interestCategoriesUpdate'] =
	async (ctx, input) => {
		const { list_id, interest_category_id, ...body } = input;
		const response = await makeMailchimpRequest<
			MailchimpEndpointOutputs['interestCategoriesUpdate']
		>(
			`/lists/${list_id}/interest-categories/${interest_category_id}`,
			ctx.key,
			{ method: 'PATCH', body },
		);

		await logEventFromContext(
			ctx,
			'mailchimp.interestCategories.update',
			{ ...input },
			'completed',
		);
		return response;
	};

export const categoriesRemove: MailchimpEndpoints['interestCategoriesRemove'] =
	async (ctx, input) => {
		const response = await makeMailchimpRequest<
			MailchimpEndpointOutputs['interestCategoriesRemove']
		>(
			`/lists/${input.list_id}/interest-categories/${input.interest_category_id}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'mailchimp.interestCategories.remove',
			{ ...input },
			'completed',
		);
		return response;
	};

/* --------------------------------- Interests ----------------------------- */

export const interestsList: MailchimpEndpoints['interestsList'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['interestsList']
	>(
		`/lists/${input.list_id}/interest-categories/${input.interest_category_id}/interests`,
		ctx.key,
		{ method: 'GET', query: { count: input.count, offset: input.offset } },
	);

	await logEventFromContext(
		ctx,
		'mailchimp.interests.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const interestsGet: MailchimpEndpoints['interestsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['interestsGet']
	>(
		`/lists/${input.list_id}/interest-categories/${input.interest_category_id}/interests/${input.interest_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'mailchimp.interests.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const interestsCreate: MailchimpEndpoints['interestsCreate'] = async (
	ctx,
	input,
) => {
	const { list_id, interest_category_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['interestsCreate']
	>(
		`/lists/${list_id}/interest-categories/${interest_category_id}/interests`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'mailchimp.interests.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const interestsUpdate: MailchimpEndpoints['interestsUpdate'] = async (
	ctx,
	input,
) => {
	const { list_id, interest_category_id, interest_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['interestsUpdate']
	>(
		`/lists/${list_id}/interest-categories/${interest_category_id}/interests/${interest_id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);

	await logEventFromContext(
		ctx,
		'mailchimp.interests.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const interestsRemove: MailchimpEndpoints['interestsRemove'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['interestsRemove']
	>(
		`/lists/${input.list_id}/interest-categories/${input.interest_category_id}/interests/${input.interest_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'mailchimp.interests.remove',
		{ ...input },
		'completed',
	);
	return response;
};
