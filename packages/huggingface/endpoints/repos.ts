import { logEventFromContext } from 'corsair/core';
import { encodePath, splitRepoId } from '../client';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const create: HuggingFaceEndpoints['reposCreate'] = async (
	ctx,
	input,
) => {
	const { extra, ...rest } = input;
	const response = await req(ctx, '/api/repos/create', {
		method: 'POST',
		body: { ...rest, ...extra },
	});
	await logEventFromContext(
		ctx,
		'huggingface.repos.create',
		summarize(input),
		'completed',
	);
	return response;
};

export const listFiles: HuggingFaceEndpoints['reposListFiles'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const p = input.path ? encodePath(input.path) : '';
	const response = await req(
		ctx,
		`/api/${input.repoType}s/${namespace}/${repo}/tree/${encodeURIComponent(input.revision)}/${p}`,
		{
			method: 'GET',
			query: {
				recursive: input.recursive,
				expand: input.expand,
				cursor: input.cursor,
				limit: input.limit,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.repos.listFiles',
		summarize(input),
		'completed',
	);
	return response;
};

export const getResolve: HuggingFaceEndpoints['reposGetResolve'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const prefix =
		input.repoType === 'model'
			? ''
			: input.repoType === 'dataset'
				? 'datasets/'
				: 'spaces/';
	const headers = input.xetFileInfo
		? { Accept: 'application/vnd.xet-fileinfo+json' }
		: undefined;
	const response = await req(
		ctx,
		`/${prefix}${namespace}/${repo}/resolve/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
		{
			method: 'GET',
			headers,
			rawText: true,
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.repos.getResolve',
		summarize(input),
		'completed',
	);
	return response;
};

export const requestAccess: HuggingFaceEndpoints['reposRequestAccess'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const prefix =
		input.repoType === 'model'
			? ''
			: input.repoType === 'dataset'
				? 'datasets/'
				: 'spaces/';
	const response = await req(ctx, `/${prefix}${namespace}/${repo}/ask-access`, {
		method: 'POST',
		body: input.fields ?? {},
	});
	await logEventFromContext(
		ctx,
		'huggingface.repos.requestAccess',
		summarize(input),
		'completed',
	);
	return response;
};
