import { logEventFromContext } from 'corsair/core';
import { makeKaggleBinaryRequest, makeKaggleRequest } from '../client';
import type { KaggleEndpoints } from '../index';
import type { KaggleEndpointOutputs } from './types';

export const list: KaggleEndpoints['competitionsList'] = async (ctx, input) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['competitionsList']
	>('/competitions/list', ctx.key, {
		method: 'GET',
		query: {
			group: input.group,
			category: input.category,
			sortBy: input.sortBy,
			page: input.page,
			search: input.search,
		},
		username: ctx.options.username,
	});

	await logEventFromContext(ctx, 'kaggle.competitions.list', {}, 'completed');
	return result;
};

export const listFiles: KaggleEndpoints['competitionsListFiles'] = async (
	ctx,
	input,
) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['competitionsListFiles']
	>(`/competitions/data/list/${input.id}`, ctx.key, {
		method: 'GET',
		query: {
			pageToken: input.pageToken,
			pageSize: input.pageSize,
		},
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.competitions.listFiles',
		{ competitionId: input.id },
		'completed',
	);
	return result;
};

export const downloadFiles: KaggleEndpoints['competitionsDownloadFiles'] =
	async (ctx, input) => {
		const result = await makeKaggleBinaryRequest(
			`/competitions/data/download-all/${input.id}`,
			ctx.key,
			{ method: 'GET', username: ctx.options.username },
		);

		await logEventFromContext(
			ctx,
			'kaggle.competitions.downloadFiles',
			{ competitionId: input.id, size: result.size },
			'completed',
		);
		return result;
	};

export const downloadFile: KaggleEndpoints['competitionsDownloadFile'] = async (
	ctx,
	input,
) => {
	const result = await makeKaggleBinaryRequest(
		`/competitions/data/download/${input.id}/${encodeURIComponent(input.fileName)}`,
		ctx.key,
		{ method: 'GET', username: ctx.options.username },
	);

	await logEventFromContext(
		ctx,
		'kaggle.competitions.downloadFile',
		{ competitionId: input.id, size: result.size },
		'completed',
	);
	return result;
};

export const viewLeaderboard: KaggleEndpoints['competitionsViewLeaderboard'] =
	async (ctx, input) => {
		const result = await makeKaggleRequest<
			KaggleEndpointOutputs['competitionsViewLeaderboard']
		>(`/competitions/leaderboard/view/${input.id}`, ctx.key, {
			method: 'GET',
			username: ctx.options.username,
		});

		await logEventFromContext(
			ctx,
			'kaggle.competitions.viewLeaderboard',
			{ competitionId: input.id },
			'completed',
		);
		return result;
	};

export const downloadLeaderboard: KaggleEndpoints['competitionsDownloadLeaderboard'] =
	async (ctx, input) => {
		const result = await makeKaggleBinaryRequest(
			`/competitions/leaderboard/download/${input.id}`,
			ctx.key,
			{ method: 'GET', username: ctx.options.username },
		);

		await logEventFromContext(
			ctx,
			'kaggle.competitions.downloadLeaderboard',
			{ competitionId: input.id, size: result.size },
			'completed',
		);
		return result;
	};

export const generateSubmissionUrl: KaggleEndpoints['competitionsGenerateSubmissionUrl'] =
	async (ctx, input) => {
		const result = await makeKaggleRequest<
			KaggleEndpointOutputs['competitionsGenerateSubmissionUrl']
		>(
			// Kaggle v1: POST /competitions/submissions/url/{contentLength}/{lastModifiedDateUtc}
			// Competition slug belongs in the body as competitionName (not a path segment).
			`/competitions/submissions/url/${encodeURIComponent(String(input.contentLength))}/${encodeURIComponent(String(input.lastModifiedDateUtc))}`,
			ctx.key,
			{
				method: 'POST',
				body: { competitionName: input.id },
				username: ctx.options.username,
			},
		);

		await logEventFromContext(
			ctx,
			'kaggle.competitions.generateSubmissionUrl',
			{ competitionId: input.id },
			'completed',
		);
		return result;
	};

export const submit: KaggleEndpoints['competitionsSubmit'] = async (
	ctx,
	input,
) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['competitionsSubmit']
	>(`/competitions/submissions/submit/${input.id}`, ctx.key, {
		method: 'POST',
		body: {
			blobFileTokens: input.blobFileTokens,
			submissionDescription: input.submissionDescription,
		},
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.competitions.submit',
		{ competitionId: input.id },
		'completed',
	);
	return result;
};
