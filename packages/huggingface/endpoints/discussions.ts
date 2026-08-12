import { logEventFromContext } from 'corsair/core';
import { splitRepoId } from '../client';
import type { HuggingFaceEndpoints } from '../index';
import { hubRepoTypeSegment, req, summarize } from './helpers';

export const list: HuggingFaceEndpoints['discussionsList'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions`,
		{
			method: 'GET',
			query: { status: input.status, type: input.type, p: input.p },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.discussions.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const get: HuggingFaceEndpoints['discussionsGet'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions/${input.discussionNum}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'huggingface.discussions.get',
		summarize(input),
		'completed',
	);
	return response;
};

export const create: HuggingFaceEndpoints['discussionsCreate'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions`,
		{
			method: 'POST',
			body: {
				title: input.title,
				description: input.description ?? '',
				pullRequest: input.pullRequest,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.discussions.create',
		summarize(input),
		'completed',
	);
	return response;
};

export const createComment: HuggingFaceEndpoints['discussionsCreateComment'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions/${input.discussionNum}/comment`,
			{
				method: 'POST',
				body: { comment: input.comment },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.discussions.createComment',
			summarize(input),
			'completed',
		);
		return response;
	};

export const changeStatus: HuggingFaceEndpoints['discussionsChangeStatus'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions/${input.discussionNum}/status`,
			{
				method: 'POST',
				body: { status: input.status },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.discussions.changeStatus',
			summarize(input),
			'completed',
		);
		return response;
	};

export const updateTitle: HuggingFaceEndpoints['discussionsUpdateTitle'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions/${input.discussionNum}/title`,
			{
				method: 'POST',
				body: { title: input.title },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.discussions.updateTitle',
			summarize(input),
			'completed',
		);
		return response;
	};

export const pin: HuggingFaceEndpoints['discussionsPin'] = async (
	ctx,
	input,
) => {
	const { namespace, repo } = splitRepoId(input.repoId);
	const response = await req(
		ctx,
		`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions/${input.discussionNum}/pin`,
		{
			method: 'POST',
			body: { pinned: input.pinned },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.discussions.pin',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteDiscussion: HuggingFaceEndpoints['discussionsDelete'] =
	async (ctx, input) => {
		const { namespace, repo } = splitRepoId(input.repoId);
		const response = await req(
			ctx,
			`/api/${hubRepoTypeSegment(input.repoType)}/${namespace}/${repo}/discussions/${input.discussionNum}`,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'huggingface.discussions.delete',
			summarize(input),
			'completed',
		);
		return response;
	};
