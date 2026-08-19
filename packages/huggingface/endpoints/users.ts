import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const getAvatar: HuggingFaceEndpoints['usersGetAvatar'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/api/users/${encodeURIComponent(input.username)}/avatar`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.users.getAvatar',
		summarize(input),
		'completed',
	);
	return response;
};

export const getOverview: HuggingFaceEndpoints['usersGetOverview'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/api/users/${encodeURIComponent(input.username)}/overview`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.users.getOverview',
		summarize(input),
		'completed',
	);
	return response;
};

export const getSocials: HuggingFaceEndpoints['usersGetSocials'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/api/users/${encodeURIComponent(input.username)}/socials`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.users.getSocials',
		summarize(input),
		'completed',
	);
	return response;
};
