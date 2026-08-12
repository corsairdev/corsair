import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const getAvatar: HuggingFaceEndpoints['organizationsGetAvatar'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/api/organizations/${encodeURIComponent(input.name)}/avatar`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.organizations.getAvatar',
		summarize(input),
		'completed',
	);
	return response;
};

export const getMembers: HuggingFaceEndpoints['organizationsGetMembers'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/api/organizations/${encodeURIComponent(input.name)}/members`,
			{
				method: 'GET',
				query: { search: input.search, limit: input.limit, page: input.page },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.organizations.getMembers',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getSocials: HuggingFaceEndpoints['organizationsGetSocials'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/api/organizations/${encodeURIComponent(input.name)}/socials`,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.organizations.getSocials',
			summarize(input),
			'completed',
		);
		return response;
	};
