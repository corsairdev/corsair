import { logEventFromContext } from '../../utils/events';
import type { GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type {
	ReleaseCreateResponse,
	ReleaseGetResponse,
	ReleasesListResponse,
	ReleaseUpdateResponse,
} from './types';

export const list: GithubEndpoints['releasesList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/releases`;
	const result = await makeGithubRequest<ReleasesListResponse>(
		endpoint,
		ctx.key,
		{ query: queryParams },
	);

	await logEventFromContext(
		ctx,
		'github.releases.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GithubEndpoints['releasesGet'] = async (ctx, input) => {
	const { owner, repo, releaseId } = input;
	const endpoint = `/repos/${owner}/${repo}/releases/${releaseId}`;
	const result = await makeGithubRequest<ReleaseGetResponse>(
		endpoint,
		ctx.key,
	);

	if (result && ctx.db.releases) {
		try {
			await ctx.db.releases.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.releases.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GithubEndpoints['releasesCreate'] = async (ctx, input) => {
	const { owner, repo, tagName, targetCommitish, ...rest } = input;
	const endpoint = `/repos/${owner}/${repo}/releases`;
	const body: Record<string, unknown> = {
		...rest,
		tag_name: tagName,
		target_commitish: targetCommitish,
	};
	const result = await makeGithubRequest<ReleaseCreateResponse>(
		endpoint,
		ctx.key,
		{ method: 'POST', body },
	);

	if (result && ctx.db.releases) {
		try {
			await ctx.db.releases.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.releases.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GithubEndpoints['releasesUpdate'] = async (ctx, input) => {
	const { owner, repo, releaseId, tagName, targetCommitish, ...rest } = input;
	const endpoint = `/repos/${owner}/${repo}/releases/${releaseId}`;
	const body: Record<string, unknown> = { ...rest };
	if (typeof tagName === 'string') {
		body.tag_name = tagName;
	}
	if (typeof targetCommitish === 'string') {
		body.target_commitish = targetCommitish;
	}
	const result = await makeGithubRequest<ReleaseUpdateResponse>(
		endpoint,
		ctx.key,
		{ method: 'PATCH', body },
	);

	if (result && ctx.db.releases) {
		try {
			await ctx.db.releases.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.releases.update',
		{ ...input },
		'completed',
	);
	return result;
};
