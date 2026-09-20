import { logEventFromContext } from 'corsair/core';
import {
	kagglePath,
	makeKaggleBinaryRequest,
	makeKaggleRequest,
} from '../client';
import type { KaggleEndpoints } from '../index';
import { cacheCompetitions } from './persist';
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

	await cacheCompetitions(ctx, result);
	await logEventFromContext(ctx, 'kaggle.competitions.list', {}, 'completed');
	return result;
};

export const listFiles: KaggleEndpoints['competitionsListFiles'] = async (
	ctx,
	input,
) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['competitionsListFiles']
	>(kagglePath('competitions', 'data', 'list', input.id), ctx.key, {
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
			kagglePath('competitions', 'data', 'download-all', input.id),
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
		kagglePath('competitions', 'data', 'download', input.id, input.fileName),
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
		>(kagglePath('competitions', input.id, 'leaderboard', 'view'), ctx.key, {
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
			kagglePath('competitions', input.id, 'leaderboard', 'download'),
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
			// Kaggle v1: POST /competitions/submission-url
			// Competition slug + upload metadata belong in the body (not the path).
			'/competitions/submission-url',
			ctx.key,
			{
				method: 'POST',
				body: {
					competitionName: input.competitionName,
					contentLength: input.contentLength,
					lastModifiedEpochSeconds: input.lastModifiedEpochSeconds,
					fileName: input.fileName,
				},
				username: ctx.options.username,
			},
		);

		await logEventFromContext(
			ctx,
			'kaggle.competitions.generateSubmissionUrl',
			{ competitionId: input.competitionName },
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
	>(kagglePath('competitions', 'submissions', 'submit', input.id), ctx.key, {
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
