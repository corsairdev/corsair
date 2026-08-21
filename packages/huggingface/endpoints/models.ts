import { logEventFromContext } from 'corsair/core';
import { encodePath, splitRepoId } from '../client';
import type { HuggingFaceEndpoints } from '../index';
import { hubCommitRequestOptions, req, summarize } from './helpers';

export const list: HuggingFaceEndpoints['modelsList'] = async (ctx, input) => {
	const response = await req(ctx, '/api/models', {
		method: 'GET',
		query: { ...input },
	});
	await logEventFromContext(
		ctx,
		'huggingface.models.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const get: HuggingFaceEndpoints['modelsGet'] = async (ctx, input) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const path = input.revision
		? `/api/models/${namespace}/${repo}/revision/${encodeURIComponent(input.revision)}`
		: `/api/models/${namespace}/${repo}`;
	const response = await req(ctx, path, {
		method: 'GET',
		query: { full: input.full },
	});
	await logEventFromContext(
		ctx,
		'huggingface.models.get',
		summarize(input),
		'completed',
	);
	return response;
};

export const getScan: HuggingFaceEndpoints['modelsGetScan'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/models/${namespace}/${repo}/scan`, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'huggingface.models.getScan',
		summarize(input),
		'completed',
	);
	return response;
};

export const getCompare: HuggingFaceEndpoints['modelsGetCompare'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/compare/${encodeURIComponent(input.compare)}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.getCompare',
		summarize(input),
		'completed',
	);
	return response;
};

export const listCommits: HuggingFaceEndpoints['modelsListCommits'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/commits/${encodeURIComponent(input.revision)}`,
		{
			method: 'GET',
			query: { limit: input.limit, p: input.p },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.listCommits',
		summarize(input),
		'completed',
	);
	return response;
};

export const listRefs: HuggingFaceEndpoints['modelsListRefs'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/models/${namespace}/${repo}/refs`, {
		method: 'GET',
		query: { include_prs: input.includePullRequests },
	});
	await logEventFromContext(
		ctx,
		'huggingface.models.listRefs',
		summarize(input),
		'completed',
	);
	return response;
};

export const listPathsInfo: HuggingFaceEndpoints['modelsListPathsInfo'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/models/${namespace}/${repo}/paths-info/${encodeURIComponent(input.revision)}`,
			{
				method: 'POST',
				body: { paths: input.paths, expand: input.expand },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.models.listPathsInfo',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getTreeSize: HuggingFaceEndpoints['modelsGetTreeSize'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const p = input.path ? encodePath(input.path) : '';
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/treesize/${encodeURIComponent(input.revision)}/${p}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.getTreeSize',
		summarize(input),
		'completed',
	);
	return response;
};

export const getJwt: HuggingFaceEndpoints['modelsGetJwt'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/models/${namespace}/${repo}/jwt`, {
		method: 'GET',
		query: { write: input.write, expire_at: input.expireAt },
	});
	await logEventFromContext(
		ctx,
		'huggingface.models.getJwt',
		summarize(input),
		'completed',
	);
	return response;
};

export const getXetReadToken: HuggingFaceEndpoints['modelsGetXetReadToken'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/models/${namespace}/${repo}/xet-read-token/${encodeURIComponent(input.revision)}`,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.models.getXetReadToken',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getNotebook: HuggingFaceEndpoints['modelsGetNotebook'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/notebook/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.getNotebook',
		summarize(input),
		'completed',
	);
	return response;
};

export const getResolve: HuggingFaceEndpoints['modelsGetResolve'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const headers = input.xetFileInfo
		? { Accept: 'application/vnd.xet-fileinfo+json' }
		: undefined;
	// Model resolve is at /{namespace}/{repo}/resolve/... (no models/ prefix)
	const response = await req(
		ctx,
		`/${namespace}/${repo}/resolve/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
		{
			method: 'GET',
			headers,
			rawText: true,
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.getResolve',
		summarize(input),
		'completed',
	);
	return response;
};

export const getResolveCache: HuggingFaceEndpoints['modelsGetResolveCache'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const headers = input.xetFileInfo
			? { Accept: 'application/vnd.xet-fileinfo+json' }
			: undefined;
		const response = await req(
			ctx,
			`/api/resolve-cache/models/${namespace}/${repo}/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
			{
				method: 'GET',
				headers,
				rawText: true,
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.models.getResolveCache',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createBranch: HuggingFaceEndpoints['modelsCreateBranch'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	// HF Hub POST /api/models/{ns}/{repo}/branch/{newBranchName} — the new
	// branch name lives in the URL segment; the body carries the starting point.
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/branch/${encodeURIComponent(input.branch)}`,
		{
			method: 'POST',
			body: {
				startingPoint: input.startingPoint ?? input.revision,
				emptyBranch: input.emptyBranch,
				overwrite: input.overwrite,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.createBranch',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteBranch: HuggingFaceEndpoints['modelsDeleteBranch'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/branch/${encodeURIComponent(input.branch)}`,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.deleteBranch',
		summarize(input),
		'completed',
	);
	return response;
};

export const createCommit: HuggingFaceEndpoints['modelsCreateCommit'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/commit/${encodeURIComponent(input.revision)}`,
		hubCommitRequestOptions(input),
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.createCommit',
		summarize(input),
		'completed',
	);
	return response;
};

export const createTag: HuggingFaceEndpoints['modelsCreateTag'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/tag/${encodeURIComponent(input.revision)}`,
		{
			method: 'POST',
			// HF Hub create-tag body uses `tag` (not `key`) for the tag name
			body: { tag: input.tag, message: input.message },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.createTag',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteTag: HuggingFaceEndpoints['modelsDeleteTag'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/models/${namespace}/${repo}/tag/${encodeURIComponent(input.tag)}`,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.models.deleteTag',
		summarize(input),
		'completed',
	);
	return response;
};

export const checkUploadMethod: HuggingFaceEndpoints['modelsCheckUploadMethod'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/models/${namespace}/${repo}/preupload/${encodeURIComponent(input.revision)}`,
			{
				method: 'POST',
				body: {
					files: input.files,
					gitAttributes: input.gitAttributes,
					gitIgnore: input.gitIgnore,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.models.checkUploadMethod',
			summarize(input),
			'completed',
		);
		return response;
	};

export const updateSettings: HuggingFaceEndpoints['modelsUpdateSettings'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const { repoId: _r, extra, ...rest } = input;
		const response = await req(
			ctx,
			`/api/models/${namespace}/${repo}/settings`,
			{
				method: 'PUT',
				body: { ...rest, ...extra },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.models.updateSettings',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getTagsByType: HuggingFaceEndpoints['modelsGetTagsByType'] =
	async (ctx, input) => {
		const response = await req(ctx, '/api/models-tags-by-type', {
			method: 'GET',
			query: { type: input.type },
		});
		await logEventFromContext(
			ctx,
			'huggingface.models.getTagsByType',
			summarize(input),
			'completed',
		);
		return response;
	};
