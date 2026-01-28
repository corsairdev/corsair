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
		ctx.options.token,
		{ query: queryParams },
	);

	if (result && ctx.db.releases) {
		try {
			for (const release of result) {
				await ctx.db.releases.upsert(release.id.toString(), {
					id: release.id,
					nodeId: release.nodeId,
					url: release.url,
					htmlUrl: release.htmlUrl,
					assetsUrl: release.assetsUrl,
					uploadUrl: release.uploadUrl,
					tarballUrl: release.tarballUrl,
					zipballUrl: release.zipballUrl,
					tagName: release.tagName,
					targetCommitish: release.targetCommitish,
					name: release.name,
					body: release.body,
					draft: release.draft,
					prerelease: release.prerelease,
					createdAt: new Date(release.createdAt),
					publishedAt: release.publishedAt ? new Date(release.publishedAt) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save releases to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.releases.list', { ...input }, 'completed');
	return result;
};

export const get: GithubEndpoints['releasesGet'] = async (ctx, input) => {
	const { owner, repo, releaseId } = input;
	const endpoint = `/repos/${owner}/${repo}/releases/${releaseId}`;
	const result = await makeGithubRequest<ReleaseGetResponse>(
		endpoint,
		ctx.options.token,
	);

	if (result && ctx.db.releases) {
		try {
			await ctx.db.releases.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				url: result.url,
				htmlUrl: result.htmlUrl,
				assetsUrl: result.assetsUrl,
				uploadUrl: result.uploadUrl,
				tarballUrl: result.tarballUrl,
				zipballUrl: result.zipballUrl,
				tagName: result.tagName,
				targetCommitish: result.targetCommitish,
				name: result.name,
				body: result.body,
				draft: result.draft,
				prerelease: result.prerelease,
				createdAt: new Date(result.createdAt),
				publishedAt: result.publishedAt ? new Date(result.publishedAt) : null,
			});
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.releases.get', { ...input }, 'completed');
	return result;
};

export const create: GithubEndpoints['releasesCreate'] = async (ctx, input) => {
	const { owner, repo, ...body } = input;
	const endpoint = `/repos/${owner}/${repo}/releases`;
	const result = await makeGithubRequest<ReleaseCreateResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	if (result && ctx.db.releases) {
		try {
			await ctx.db.releases.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				url: result.url,
				htmlUrl: result.htmlUrl,
				assetsUrl: result.assetsUrl,
				uploadUrl: result.uploadUrl,
				tarballUrl: result.tarballUrl,
				zipballUrl: result.zipballUrl,
				tagName: result.tagName,
				targetCommitish: result.targetCommitish,
				name: result.name,
				body: result.body,
				draft: result.draft,
				prerelease: result.prerelease,
				createdAt: new Date(result.createdAt),
				publishedAt: result.publishedAt ? new Date(result.publishedAt) : null,
			});
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.releases.create', { ...input }, 'completed');
	return result;
};

export const update: GithubEndpoints['releasesUpdate'] = async (ctx, input) => {
	const { owner, repo, releaseId, ...body } = input;
	const endpoint = `/repos/${owner}/${repo}/releases/${releaseId}`;
	const result = await makeGithubRequest<ReleaseUpdateResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'PATCH', body },
	);

	if (result && ctx.db.releases) {
		try {
			await ctx.db.releases.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				url: result.url,
				htmlUrl: result.htmlUrl,
				assetsUrl: result.assetsUrl,
				uploadUrl: result.uploadUrl,
				tarballUrl: result.tarballUrl,
				zipballUrl: result.zipballUrl,
				tagName: result.tagName,
				targetCommitish: result.targetCommitish,
				name: result.name,
				body: result.body,
				draft: result.draft,
				prerelease: result.prerelease,
				createdAt: new Date(result.createdAt),
				publishedAt: result.publishedAt ? new Date(result.publishedAt) : null,
			});
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.releases.update', { ...input }, 'completed');
	return result;
};
