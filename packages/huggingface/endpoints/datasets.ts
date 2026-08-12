import { logEventFromContext } from 'corsair/core';
import { encodePath, HF_DATASETS_SERVER_BASE, splitRepoId } from '../client';
import type { HuggingFaceEndpoints } from '../index';
import {
	hubCommitRequestOptions,
	hubRepoTypeSegment,
	req,
	summarize,
} from './helpers';

export const list: HuggingFaceEndpoints['datasetsList'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/datasets', {
		method: 'GET',
		query: { ...input },
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const get: HuggingFaceEndpoints['datasetsGet'] = async (ctx, input) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const path = input.revision
		? `/api/datasets/${namespace}/${repo}/revision/${encodeURIComponent(input.revision)}`
		: `/api/datasets/${namespace}/${repo}`;
	const response = await req(ctx, path, {
		method: 'GET',
		query: { full: input.full },
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.get',
		summarize(input),
		'completed',
	);
	return response;
};

export const getScan: HuggingFaceEndpoints['datasetsGetScan'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/datasets/${namespace}/${repo}/scan`, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getScan',
		summarize(input),
		'completed',
	);
	return response;
};

export const getCompare: HuggingFaceEndpoints['datasetsGetCompare'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/datasets/${namespace}/${repo}/compare/${encodeURIComponent(input.compare)}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getCompare',
		summarize(input),
		'completed',
	);
	return response;
};

export const listCommits: HuggingFaceEndpoints['datasetsListCommits'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/datasets/${namespace}/${repo}/commits/${encodeURIComponent(input.revision)}`,
		{
			method: 'GET',
			query: { limit: input.limit, p: input.p },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.datasets.listCommits',
		summarize(input),
		'completed',
	);
	return response;
};

export const listRefs: HuggingFaceEndpoints['datasetsListRefs'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/datasets/${namespace}/${repo}/refs`, {
		method: 'GET',
		query: { include_prs: input.includePullRequests },
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.listRefs',
		summarize(input),
		'completed',
	);
	return response;
};

export const listPathsInfo: HuggingFaceEndpoints['datasetsListPathsInfo'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/paths-info/${encodeURIComponent(input.revision)}`,
			{
				method: 'POST',
				body: { paths: input.paths, expand: input.expand },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.listPathsInfo',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getTreeSize: HuggingFaceEndpoints['datasetsGetTreeSize'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const p = input.path ? encodePath(input.path) : '';
	const response = await req(
		ctx,
		`/api/datasets/${namespace}/${repo}/treesize/${encodeURIComponent(input.revision)}/${p}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getTreeSize',
		summarize(input),
		'completed',
	);
	return response;
};

export const getJwt: HuggingFaceEndpoints['datasetsGetJwt'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(ctx, `/api/datasets/${namespace}/${repo}/jwt`, {
		method: 'GET',
		query: { write: input.write, expire_at: input.expireAt },
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getJwt',
		summarize(input),
		'completed',
	);
	return response;
};

export const getXetReadToken: HuggingFaceEndpoints['datasetsGetXetReadToken'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/xet-read-token/${encodeURIComponent(input.revision)}`,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.getXetReadToken',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getNotebook: HuggingFaceEndpoints['datasetsGetNotebook'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/datasets/${namespace}/${repo}/notebook/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getNotebook',
		summarize(input),
		'completed',
	);
	return response;
};

export const getResolve: HuggingFaceEndpoints['datasetsGetResolve'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const headers = input.xetFileInfo
		? { Accept: 'application/vnd.xet-fileinfo+json' }
		: undefined;
	const response = await req(
		ctx,
		`/datasets/${namespace}/${repo}/resolve/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
		{
			method: 'GET',
			headers,
			rawText: true,
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getResolve',
		summarize(input),
		'completed',
	);
	return response;
};

export const getResolveCache: HuggingFaceEndpoints['datasetsGetResolveCache'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const headers = input.xetFileInfo
			? { Accept: 'application/vnd.xet-fileinfo+json' }
			: undefined;
		const response = await req(
			ctx,
			`/api/resolve-cache/datasets/${namespace}/${repo}/${encodeURIComponent(input.revision)}/${encodePath(input.path)}`,
			{
				method: 'GET',
				headers,
				rawText: true,
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.getResolveCache',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createBranch: HuggingFaceEndpoints['datasetsCreateBranch'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		// HF Hub POST /api/datasets/{ns}/{repo}/branch/{newBranchName} — the new
		// branch name lives in the URL segment; the body carries the starting point.
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/branch/${encodeURIComponent(input.branch)}`,
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
			'huggingface.datasets.createBranch',
			summarize(input),
			'completed',
		);
		return response;
	};

export const deleteBranch: HuggingFaceEndpoints['datasetsDeleteBranch'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/branch/${encodeURIComponent(input.branch)}`,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.deleteBranch',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createCommit: HuggingFaceEndpoints['datasetsCreateCommit'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/commit/${encodeURIComponent(input.revision)}`,
			hubCommitRequestOptions(input),
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.createCommit',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createTag: HuggingFaceEndpoints['datasetsCreateTag'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/datasets/${namespace}/${repo}/tag/${encodeURIComponent(input.revision)}`,
		{
			method: 'POST',
			// HF Hub create-tag body uses `tag` (not `key`) for the tag name
			body: { tag: input.tag, message: input.message },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.datasets.createTag',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteTag: HuggingFaceEndpoints['datasetsDeleteTag'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/datasets/${namespace}/${repo}/tag/${encodeURIComponent(input.tag)}`,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.datasets.deleteTag',
		summarize(input),
		'completed',
	);
	return response;
};

export const checkUploadMethod: HuggingFaceEndpoints['datasetsCheckUploadMethod'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/preupload/${encodeURIComponent(input.revision)}`,
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
			'huggingface.datasets.checkUploadMethod',
			summarize(input),
			'completed',
		);
		return response;
	};

export const updateSettings: HuggingFaceEndpoints['datasetsUpdateSettings'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const { repoId: _r, extra, ...rest } = input;
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/settings`,
			{
				method: 'PUT',
				body: { ...rest, ...extra },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.updateSettings',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getTagsByType: HuggingFaceEndpoints['datasetsGetTagsByType'] =
	async (ctx, input) => {
		const response = await req(ctx, '/api/datasets-tags-by-type', {
			method: 'GET',
			query: { type: input.type },
		});
		await logEventFromContext(
			ctx,
			'huggingface.datasets.getTagsByType',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getLeaderboard: HuggingFaceEndpoints['datasetsGetLeaderboard'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/leaderboard`,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.getLeaderboard',
			summarize(input),
			'completed',
		);
		return response;
	};

export const squashCommits: HuggingFaceEndpoints['datasetsSquashCommits'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/super-squash/${encodeURIComponent(input.revision)}`,
			{
				method: 'POST',
				body: { message: input.message },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.squashCommits',
			summarize(input),
			'completed',
		);
		return response;
	};

export const listAccessRequests: HuggingFaceEndpoints['datasetsListAccessRequests'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/user-access-request/${input.status}`,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.listAccessRequests',
			summarize(input),
			'completed',
		);
		return response;
	};

export const handleAccessRequest: HuggingFaceEndpoints['datasetsHandleAccessRequest'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/datasets/${namespace}/${repo}/user-access-request/handle`,
			{
				method: 'POST',
				body: { user: input.user, userId: input.userId, status: input.status },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.handleAccessRequest',
			summarize(input),
			'completed',
		);
		return response;
	};

export const checkValidity: HuggingFaceEndpoints['datasetsCheckValidity'] =
	async (ctx, input) => {
		const response = await req(ctx, '/is-valid', {
			method: 'GET',
			baseUrl: HF_DATASETS_SERVER_BASE,
			query: {
				dataset: input.dataset,
				config: input.config,
				split: input.split,
			},
		});
		await logEventFromContext(
			ctx,
			'huggingface.datasets.checkValidity',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getCroissant: HuggingFaceEndpoints['datasetsGetCroissant'] =
	async (ctx, input) => {
		const response = await req(ctx, '/croissant', {
			method: 'GET',
			baseUrl: HF_DATASETS_SERVER_BASE,
			query: {
				dataset: input.dataset,
				config: input.config,
				split: input.split,
			},
		});
		await logEventFromContext(
			ctx,
			'huggingface.datasets.getCroissant',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getInfo: HuggingFaceEndpoints['datasetsGetInfo'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/info', {
		method: 'GET',
		baseUrl: HF_DATASETS_SERVER_BASE,
		query: { dataset: input.dataset, config: input.config, split: input.split },
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getInfo',
		summarize(input),
		'completed',
	);
	return response;
};

export const getSize: HuggingFaceEndpoints['datasetsGetSize'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/size', {
		method: 'GET',
		baseUrl: HF_DATASETS_SERVER_BASE,
		query: { dataset: input.dataset, config: input.config, split: input.split },
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getSize',
		summarize(input),
		'completed',
	);
	return response;
};

export const listSplits: HuggingFaceEndpoints['datasetsListSplits'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/splits', {
		method: 'GET',
		baseUrl: HF_DATASETS_SERVER_BASE,
		query: { dataset: input.dataset, config: input.config, split: input.split },
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.listSplits',
		summarize(input),
		'completed',
	);
	return response;
};

export const listParquetFiles: HuggingFaceEndpoints['datasetsListParquetFiles'] =
	async (ctx, input) => {
		const response = await req(ctx, '/parquet', {
			method: 'GET',
			baseUrl: HF_DATASETS_SERVER_BASE,
			query: {
				dataset: input.dataset,
				config: input.config,
				split: input.split,
			},
		});
		await logEventFromContext(
			ctx,
			'huggingface.datasets.listParquetFiles',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getFirstRows: HuggingFaceEndpoints['datasetsGetFirstRows'] =
	async (ctx, input) => {
		const response = await req(ctx, '/first-rows', {
			method: 'GET',
			baseUrl: HF_DATASETS_SERVER_BASE,
			query: {
				dataset: input.dataset,
				config: input.config,
				split: input.split,
			},
		});
		await logEventFromContext(
			ctx,
			'huggingface.datasets.getFirstRows',
			summarize(input),
			'completed',
		);
		return response;
	};

export const getRows: HuggingFaceEndpoints['datasetsGetRows'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/rows', {
		method: 'GET',
		baseUrl: HF_DATASETS_SERVER_BASE,
		query: {
			dataset: input.dataset,
			config: input.config,
			split: input.split,
			offset: input.offset,
			length: input.length,
		},
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.getRows',
		summarize(input),
		'completed',
	);
	return response;
};

export const getStatistics: HuggingFaceEndpoints['datasetsGetStatistics'] =
	async (ctx, input) => {
		const response = await req(ctx, '/statistics', {
			method: 'GET',
			baseUrl: HF_DATASETS_SERVER_BASE,
			query: {
				dataset: input.dataset,
				config: input.config,
				split: input.split,
			},
		});
		await logEventFromContext(
			ctx,
			'huggingface.datasets.getStatistics',
			summarize(input),
			'completed',
		);
		return response;
	};

export const filterRows: HuggingFaceEndpoints['datasetsFilterRows'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/filter', {
		method: 'GET',
		baseUrl: HF_DATASETS_SERVER_BASE,
		query: {
			dataset: input.dataset,
			config: input.config,
			split: input.split,
			where: input.where,
			orderby: input.orderby,
			offset: input.offset,
			length: input.length,
		},
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.filterRows',
		summarize(input),
		'completed',
	);
	return response;
};

export const search: HuggingFaceEndpoints['datasetsSearch'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/search', {
		method: 'GET',
		baseUrl: HF_DATASETS_SERVER_BASE,
		query: {
			dataset: input.dataset,
			config: input.config,
			split: input.split,
			query: input.query,
			offset: input.offset,
			length: input.length,
		},
	});
	await logEventFromContext(
		ctx,
		'huggingface.datasets.search',
		summarize(input),
		'completed',
	);
	return response;
};

export const createSqlConsoleEmbed: HuggingFaceEndpoints['datasetsCreateSqlConsoleEmbed'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/sql-console/embed`,
			{
				method: 'POST',
				body: { title: input.title, sql: input.sql, private: input.private },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.createSqlConsoleEmbed',
			summarize(input),
			'completed',
		);
		return response;
	};

export const updateSqlConsoleEmbed: HuggingFaceEndpoints['datasetsUpdateSqlConsoleEmbed'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/sql-console/embed/${encodeURIComponent(input.embedId)}`,
			{
				method: 'PATCH',
				body: { title: input.title, sql: input.sql, private: input.private },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.datasets.updateSqlConsoleEmbed',
			summarize(input),
			'completed',
		);
		return response;
	};
