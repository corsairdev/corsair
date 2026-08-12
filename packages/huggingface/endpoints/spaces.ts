import { logEventFromContext } from 'corsair/core';
import { encodePath, splitRepoId } from '../client';
import type { HuggingFaceEndpoints } from '../index';
import { hubCommitRequestOptions, req, summarize } from './helpers';

export const list: HuggingFaceEndpoints['spacesList'] = async (ctx, input) => {
	const response = await req(ctx, '/api/spaces', {
		method: 'GET',
		query: { ...input },
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const get: HuggingFaceEndpoints['spacesGet'] = async (ctx, input) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const path = input.revision
		? `/api/spaces/${namespace}/${repo}/revision/${encodeURIComponent(input.revision)}`
		: `/api/spaces/${namespace}/${repo}`;
	const response = await req(ctx, path, {
		method: 'GET',
		query: { full: input.full },
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.get',
		summarize(input),
		'completed',
	);
	return response;
};

export const getScan: HuggingFaceEndpoints['spacesGetScan'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/spaces/${namespace}/${repo}/scan`, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.getScan',
		summarize(input),
		'completed',
	);
	return response;
};

export const getCompare: HuggingFaceEndpoints['spacesGetCompare'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/compare/${encodeURIComponent(input.compare)}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.getCompare',
		summarize(input),
		'completed',
	);
	return response;
};

export const listCommits: HuggingFaceEndpoints['spacesListCommits'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/commits/${encodeURIComponent(input.revision)}`,
		{
			method: 'GET',
			query: { limit: input.limit, p: input.p },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.listCommits',
		summarize(input),
		'completed',
	);
	return response;
};

export const listRefs: HuggingFaceEndpoints['spacesListRefs'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/spaces/${namespace}/${repo}/refs`, {
		method: 'GET',
		query: { include_prs: input.includePullRequests },
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.listRefs',
		summarize(input),
		'completed',
	);
	return response;
};

export const listPathsInfo: HuggingFaceEndpoints['spacesListPathsInfo'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/paths-info/${encodeURIComponent(input.revision)}`,
			{
				method: 'POST',
				body: { paths: input.paths, expand: input.expand },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.listPathsInfo',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getTreeSize: HuggingFaceEndpoints['spacesGetTreeSize'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const p = input.path ? encodePath(input.path) : '';
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/treesize/${encodeURIComponent(input.revision)}/${p}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.getTreeSize',
		summarize(input),
		'completed',
	);
	return response;
};

export const getJwt: HuggingFaceEndpoints['spacesGetJwt'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/spaces/${namespace}/${repo}/jwt`, {
		method: 'GET',
		query: { write: input.write, expire_at: input.expireAt },
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.getJwt',
		summarize(input),
		'completed',
	);
	return response;
};

export const getXetReadToken: HuggingFaceEndpoints['spacesGetXetReadToken'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/xet-read-token/${encodeURIComponent(input.revision)}`,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.getXetReadToken',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getNotebook: HuggingFaceEndpoints['spacesGetNotebook'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/notebook/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.getNotebook',
		summarize(input),
		'completed',
	);
	return response;
};

export const getResolve: HuggingFaceEndpoints['spacesGetResolve'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const prefix = 'spaces/';
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
		'huggingface.spaces.getResolve',
		summarize(input),
		'completed',
	);
	return response;
};

export const getResolveCache: HuggingFaceEndpoints['spacesGetResolveCache'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const headers = input.xetFileInfo
			? { Accept: 'application/vnd.xet-fileinfo+json' }
			: undefined;
		const response = await req(
			ctx,
			`/api/resolve-cache/spaces/${namespace}/${repo}/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
			{
				method: 'GET',
				headers,
				rawText: true,
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.getResolveCache',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createBranch: HuggingFaceEndpoints['spacesCreateBranch'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	// HF Hub POST /api/spaces/{ns}/{repo}/branch/{newBranchName} — the new
	// branch name lives in the URL segment; the body carries the starting point.
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/branch/${encodeURIComponent(input.branch)}`,
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
		'huggingface.spaces.createBranch',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteBranch: HuggingFaceEndpoints['spacesDeleteBranch'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/branch/${encodeURIComponent(input.branch)}`,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.deleteBranch',
		summarize(input),
		'completed',
	);
	return response;
};

export const createCommit: HuggingFaceEndpoints['spacesCreateCommit'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/commit/${encodeURIComponent(input.revision)}`,
		hubCommitRequestOptions(input),
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.createCommit',
		summarize(input),
		'completed',
	);
	return response;
};

export const createTag: HuggingFaceEndpoints['spacesCreateTag'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/tag/${encodeURIComponent(input.revision)}`,
		{
			method: 'POST',
			// HF Hub create-tag body uses `tag` (not `key`) for the tag name
			body: { tag: input.tag, message: input.message },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.createTag',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteTag: HuggingFaceEndpoints['spacesDeleteTag'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/tag/${encodeURIComponent(input.tag)}`,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.deleteTag',
		summarize(input),
		'completed',
	);
	return response;
};

export const checkUploadMethod: HuggingFaceEndpoints['spacesCheckUploadMethod'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/preupload/${encodeURIComponent(input.revision)}`,
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
			'huggingface.spaces.checkUploadMethod',
			summarize(input),
			'completed',
		);
		return response;
	};

export const updateSettings: HuggingFaceEndpoints['spacesUpdateSettings'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const { repoId: _r, extra, ...rest } = input;
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/settings`,
			{
				method: 'PUT',
				body: { ...rest, ...extra },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.updateSettings',
			summarize(input),
			'completed',
		);
		return response;
	};

export const listHardware: HuggingFaceEndpoints['spacesListHardware'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/spaces/hardware', { method: 'GET' });
	await logEventFromContext(
		ctx,
		'huggingface.spaces.listHardware',
		summarize(input),
		'completed',
	);
	return response;
};

export const getMetrics: HuggingFaceEndpoints['spacesGetMetrics'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/spaces/${namespace}/${repo}/metrics`, {
		method: 'GET',
		// SSE stream held open by the Hub; collect events for a bounded window.
		sse: true,
		timeoutMs: 10_000,
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.getMetrics',
		summarize(input),
		'completed',
	);
	return response;
};

export const getEvents: HuggingFaceEndpoints['spacesGetEvents'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/spaces/${namespace}/${repo}/events`, {
		method: 'GET',
		// SSE stream held open by the Hub; collect events for a bounded window.
		sse: true,
		timeoutMs: 10_000,
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.getEvents',
		summarize(input),
		'completed',
	);
	return response;
};

export const listLfsFiles: HuggingFaceEndpoints['spacesListLfsFiles'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/spaces/${namespace}/${repo}/lfs-files`,
		{
			method: 'GET',
			query: { cursor: input.cursor, limit: input.limit },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.spaces.listLfsFiles',
		summarize(input),
		'completed',
	);
	return response;
};

export const getXetWriteToken: HuggingFaceEndpoints['spacesGetXetWriteToken'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/xet-write-token/${encodeURIComponent(input.revision)}`,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.getXetWriteToken',
			summarize(input),
			'completed',
		);
		return response;
	};

export const squashCommits: HuggingFaceEndpoints['spacesSquashCommits'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/super-squash/${encodeURIComponent(input.revision)}`,
			{
				method: 'POST',
				body: { message: input.message },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.squashCommits',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createSecret: HuggingFaceEndpoints['spacesCreateSecret'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/spaces/${namespace}/${repo}/secrets`, {
		method: 'POST',
		body: {
			key: input.key,
			value: input.value,
			description: input.description,
		},
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.createSecret',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteSecret: HuggingFaceEndpoints['spacesDeleteSecret'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/spaces/${namespace}/${repo}/secrets`, {
		method: 'DELETE',
		body: { key: input.key },
	});
	await logEventFromContext(
		ctx,
		'huggingface.spaces.deleteSecret',
		summarize(input),
		'completed',
	);
	return response;
};

export const createVariable: HuggingFaceEndpoints['spacesCreateVariable'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/variables`,
			{
				method: 'POST',
				body: {
					key: input.key,
					value: input.value,
					description: input.description,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.createVariable',
			summarize(input),
			'completed',
		);
		return response;
	};

export const deleteVariable: HuggingFaceEndpoints['spacesDeleteVariable'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/spaces/${namespace}/${repo}/variables`,
			{
				method: 'DELETE',
				body: { key: input.key },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.spaces.deleteVariable',
			summarize(input),
			'completed',
		);
		return response;
	};
