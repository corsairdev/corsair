import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

async function upsertRelease(
	ctx: Parameters<GithubWebhooks['releasePublished']['handler']>[0],
	release: Parameters<
		GithubWebhooks['releasePublished']['handler']
	>[1]['payload']['release'],
	deletedAt?: Date | null,
) {
	if (!ctx.db.releases) return;
	await ctx.db.releases.upsertByEntityId(release.id.toString(), {
		id: release.id,
		nodeId: release.node_id,
		url: release.url,
		htmlUrl: release.html_url,
		assetsUrl: release.assets_url,
		uploadUrl: release.upload_url,
		tarballUrl: release.tarball_url,
		zipballUrl: release.zipball_url,
		tagName: release.tag_name,
		targetCommitish: release.target_commitish,
		name: release.name,
		body: release.body,
		draft: release.draft,
		prerelease: release.prerelease,
		createdAt: release.created_at ? new Date(release.created_at) : null,
		publishedAt: release.published_at ? new Date(release.published_at) : null,
		deletedAt: deletedAt ?? null,
	});
}

export const releasePublished: GithubWebhooks['releasePublished'] = {
	match: createGithubEventMatch('release', 'published'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'published')
			return { success: false, data: undefined };
		console.log('GitHub Release Published:', {
			tag: event.release.tag_name,
			repository: event.repository.full_name,
		});
		try {
			await upsertRelease(ctx, event.release);
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
		return { success: true, data: event };
	},
};

export const releaseCreated: GithubWebhooks['releaseCreated'] = {
	match: createGithubEventMatch('release', 'created'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'created') return { success: false, data: undefined };
		console.log('GitHub Release Created:', {
			tag: event.release.tag_name,
			repository: event.repository.full_name,
		});
		try {
			await upsertRelease(ctx, event.release);
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
		return { success: true, data: event };
	},
};

export const releaseEdited: GithubWebhooks['releaseEdited'] = {
	match: createGithubEventMatch('release', 'edited'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'edited') return { success: false, data: undefined };
		console.log('GitHub Release Edited:', {
			tag: event.release.tag_name,
			repository: event.repository.full_name,
		});
		try {
			await upsertRelease(ctx, event.release);
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
		return { success: true, data: event };
	},
};

export const releaseDeleted: GithubWebhooks['releaseDeleted'] = {
	match: createGithubEventMatch('release', 'deleted'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'deleted') return { success: false, data: undefined };
		console.log('GitHub Release Deleted:', {
			tag: event.release.tag_name,
			repository: event.repository.full_name,
		});
		try {
			await upsertRelease(ctx, event.release, new Date());
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
		return { success: true, data: event };
	},
};

export const releasePrereleased: GithubWebhooks['releasePrereleased'] = {
	match: createGithubEventMatch('release', 'prereleased'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'prereleased')
			return { success: false, data: undefined };
		console.log('GitHub Release Pre-released:', {
			tag: event.release.tag_name,
			repository: event.repository.full_name,
		});
		try {
			await upsertRelease(ctx, event.release);
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
		return { success: true, data: event };
	},
};

export const releaseReleased: GithubWebhooks['releaseReleased'] = {
	match: createGithubEventMatch('release', 'released'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'released') return { success: false, data: undefined };
		console.log('GitHub Release Released:', {
			tag: event.release.tag_name,
			repository: event.repository.full_name,
		});
		try {
			await upsertRelease(ctx, event.release);
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
		return { success: true, data: event };
	},
};

export const releaseUnpublished: GithubWebhooks['releaseUnpublished'] = {
	match: createGithubEventMatch('release', 'unpublished'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'unpublished')
			return { success: false, data: undefined };
		console.log('GitHub Release Unpublished:', {
			tag: event.release.tag_name,
			repository: event.repository.full_name,
		});
		try {
			await upsertRelease(ctx, event.release);
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
		return { success: true, data: event };
	},
};
