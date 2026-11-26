import { logEventFromContext } from 'corsair/core';
import { resolveFileInput } from 'corsair/http';
import type { PubloraRequestOptions } from '../client';
import {
	compactBody,
	compactQuery,
	makePubloraRequest,
	segment,
} from '../client';
import type { PubloraEndpoints } from '../index';
import type { PubloraEndpointInputs, PubloraEndpointOutputs } from './types';
import {
	PubloraEndpointInputSchemas,
	PubloraEndpointOutputSchemas,
} from './types';
import type { PubloraExtraInputSchemas } from './types-extra';

/**
 * Handlers for the routes added after the first version. Each one parses its
 * input, calls one Publora route, parses the reply against its output schema
 * and logs identifiers only (no post or comment text, URLs or secrets).
 */

type ExtraKey = keyof typeof PubloraExtraInputSchemas;

type Request = {
	path: string;
	options?: PubloraRequestOptions;
	/** Identifiers and counts for the event log. */
	audit?: Record<string, unknown>;
};

/** Accept value the Company approval routes need to return declined reviews. */
export const COMPANY_APPROVAL_ACCEPT =
	'application/vnd.publora.company-approval.v2+json, application/json';

/** Biggest file the multipart uploads take (Publora: covers and thumbnails are images). */
const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

// unknown: the raw reply before its output schema has checked it.
function decode(raw: unknown): unknown {
	// Core parses only application/json; the approval v2 media type
	// (application/vnd.publora.company-approval.v2+json) arrives as text.
	if (typeof raw !== 'string') return raw;
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}

/** Company commands require Idempotency-Key; one is generated when not given. */
function companyKey(key: string | undefined): string {
	return key ?? globalThis.crypto.randomUUID();
}

function define<K extends ExtraKey>(
	operation: K,
	event: string,
	build: (input: PubloraEndpointInputs[K]) => Request | Promise<Request>,
): PubloraEndpoints[K] {
	const handler = async (
		ctx: Parameters<PubloraEndpoints[K]>[0],
		rawInput: unknown,
	): Promise<PubloraEndpointOutputs[K]> => {
		const input = PubloraEndpointInputSchemas[operation].parse(
			rawInput,
		) as PubloraEndpointInputs[K];
		const request = await build(input);
		const raw = await makePubloraRequest<unknown>(
			request.path,
			ctx.key,
			request.options ?? {},
		);
		const result = PubloraEndpointOutputSchemas[operation].parse(
			decode(raw),
		) as PubloraEndpointOutputs[K];
		await logEventFromContext(
			ctx,
			`publora.${event}`,
			request.audit ?? {},
			'completed',
		);
		return result;
	};
	return handler as unknown as PubloraEndpoints[K];
}

/** Copies only the named keys that are set: ids, enums, counts. */
function pick(
	input: Record<string, unknown>,
	keys: readonly string[],
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const key of keys) {
		if (input[key] !== undefined) out[key] = input[key];
	}
	return out;
}

function flag(value: boolean | undefined): 'true' | undefined {
	return value ? 'true' : undefined;
}

function bool(value: boolean | undefined): 'true' | 'false' | undefined {
	return value === undefined ? undefined : value ? 'true' : 'false';
}

// ---------------------------------------------------------------------------
// Connections, limits, logs
// ---------------------------------------------------------------------------

/** POST /test-connection/{platformId} */
export const testConnection = define(
	'testConnection',
	'accounts.testConnection',
	(input) => ({
		path: `test-connection/${segment(input.platformId)}`,
		options: { method: 'POST' },
		audit: pick(input, ['platformId']),
	}),
);

/** GET /platform-limits */
export const getPlatformLimits = define(
	'getPlatformLimits',
	'accounts.getPlatformLimits',
	() => ({ path: 'platform-limits' }),
);

/** GET /post-logs/{postGroupId} */
export const getPostLogs = define('getPostLogs', 'posts.getLogs', (input) => ({
	path: `post-logs/${segment(input.postGroupId)}`,
	audit: pick(input, ['postGroupId']),
}));

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

/** POST /attach-media/{postGroupId} */
export const attachMedia = define('attachMedia', 'media.attach', (input) => ({
	path: `attach-media/${segment(input.postGroupId)}`,
	options: {
		method: 'POST',
		idempotencyKey: input.idempotencyKey,
		body: compactBody({ file: input.file, fileName: input.fileName }),
	},
	audit: pick(input, ['postGroupId']),
}));

/** POST /upload-instagram-cover (multipart: cover, postGroupId) */
export const uploadInstagramCover = define(
	'uploadInstagramCover',
	'media.uploadInstagramCover',
	async (input) => {
		const cover = await resolveFileInput(input.cover, {
			maxBytes: UPLOAD_MAX_BYTES,
			fallbackName: 'cover.jpg',
		});
		return {
			path: 'upload-instagram-cover',
			options: {
				method: 'POST',
				formData: { cover: cover.file, postGroupId: input.postGroupId },
			},
			audit: { postGroupId: input.postGroupId, contentType: cover.contentType },
		};
	},
);

/** POST /upload-youtube-thumbnail (multipart: thumbnail, postGroupId) */
export const uploadYoutubeThumbnail = define(
	'uploadYoutubeThumbnail',
	'media.uploadYoutubeThumbnail',
	async (input) => {
		const thumbnail = await resolveFileInput(input.thumbnail, {
			// Publora takes at most 2 MB for a YouTube thumbnail.
			maxBytes: 2 * 1024 * 1024,
			fallbackName: 'thumbnail.jpg',
		});
		return {
			path: 'upload-youtube-thumbnail',
			options: {
				method: 'POST',
				formData: {
					thumbnail: thumbnail.file,
					postGroupId: input.postGroupId,
				},
			},
			audit: {
				postGroupId: input.postGroupId,
				contentType: thumbnail.contentType,
			},
		};
	},
);

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

/** POST /webhooks/{id}/regenerate-secret */
export const regenerateWebhookSecret = define(
	'regenerateWebhookSecret',
	'webhooks.regenerateSecret',
	(input) => ({
		path: `webhooks/${segment(input.id)}/regenerate-secret`,
		options: { method: 'POST' },
		audit: pick(input, ['id']),
	}),
);

// ---------------------------------------------------------------------------
// Mastodon and Bluesky analytics
// ---------------------------------------------------------------------------

/** POST /post-statistics */
export const analyticsPostStatistics = define(
	'analyticsPostStatistics',
	'analytics.postStatistics',
	(input) => ({
		path: 'post-statistics',
		options: { method: 'POST', body: { posts: input.posts } },
		audit: { count: input.posts.length },
	}),
);

/** POST /profile-statistics */
export const analyticsProfileStatistics = define(
	'analyticsProfileStatistics',
	'analytics.profileStatistics',
	(input) => ({
		path: 'profile-statistics',
		options: {
			method: 'POST',
			body: { platform: input.platform, platformId: input.platformId },
		},
		audit: pick(input, ['platform', 'platformId']),
	}),
);

// ---------------------------------------------------------------------------
// LinkedIn
// ---------------------------------------------------------------------------

/** POST /linkedin-post-statistics */
export const linkedinPostStatistics = define(
	'linkedinPostStatistics',
	'linkedin.postStatistics',
	(input) => ({
		path: 'linkedin-post-statistics',
		options: { method: 'POST', body: compactBody({ ...input }) },
		audit: pick(input, ['platformId', 'postedId', 'queryType']),
	}),
);

/** POST /linkedin-account-statistics */
export const linkedinAccountStatistics = define(
	'linkedinAccountStatistics',
	'linkedin.accountStatistics',
	(input) => ({
		path: 'linkedin-account-statistics',
		options: { method: 'POST', body: compactBody({ ...input }) },
		audit: pick(input, ['platformId', 'queryType', 'aggregation']),
	}),
);

/** POST /linkedin-profile-summary */
export const linkedinProfileSummary = define(
	'linkedinProfileSummary',
	'linkedin.profileSummary',
	(input) => ({
		path: 'linkedin-profile-summary',
		options: { method: 'POST', body: compactBody({ ...input }) },
		audit: pick(input, ['platformId']),
	}),
);

/** POST /linkedin-followers */
export const linkedinFollowers = define(
	'linkedinFollowers',
	'linkedin.followers',
	(input) => ({
		path: 'linkedin-followers',
		options: { method: 'POST', body: compactBody({ ...input }) },
		audit: pick(input, ['platformId', 'period']),
	}),
);

/** GET /linkedin-mentionables */
export const linkedinMentionables = define(
	'linkedinMentionables',
	'linkedin.mentionables',
	(input) => ({
		path: 'linkedin-mentionables',
		options: { query: compactQuery({ q: input.q, limit: input.limit }) },
		audit: pick(input, ['limit']),
	}),
);

/** POST /linkedin-reactions */
export const linkedinAddReaction = define(
	'linkedinAddReaction',
	'linkedin.addReaction',
	(input) => ({
		path: 'linkedin-reactions',
		options: {
			method: 'POST',
			body: {
				postedId: input.postedId,
				reactionType: input.reactionType,
				platformId: input.platformId,
			},
		},
		audit: pick(input, ['platformId', 'postedId', 'reactionType']),
	}),
);

/** DELETE /linkedin-reactions (ids as query parameters, as the spec allows) */
export const linkedinRemoveReaction = define(
	'linkedinRemoveReaction',
	'linkedin.removeReaction',
	(input) => ({
		path: 'linkedin-reactions',
		options: {
			method: 'DELETE',
			query: { postedId: input.postedId, platformId: input.platformId },
		},
		audit: pick(input, ['platformId', 'postedId']),
	}),
);

/** POST /linkedin-reshare */
export const linkedinReshare = define(
	'linkedinReshare',
	'linkedin.reshare',
	(input) => ({
		path: 'linkedin-reshare',
		options: { method: 'POST', body: compactBody({ ...input }) },
		audit: pick(input, ['platformId', 'parent', 'visibility']),
	}),
);

/** POST /linkedin-comments */
export const linkedinCreateComment = define(
	'linkedinCreateComment',
	'linkedin.createComment',
	(input) => ({
		path: 'linkedin-comments',
		options: { method: 'POST', body: compactBody({ ...input }) },
		audit: pick(input, ['platformId', 'postedId', 'parentComment']),
	}),
);

/** DELETE /linkedin-comments (ids as query parameters, as the spec allows) */
export const linkedinDeleteComment = define(
	'linkedinDeleteComment',
	'linkedin.deleteComment',
	(input) => ({
		path: 'linkedin-comments',
		options: {
			method: 'DELETE',
			query: {
				postedId: input.postedId,
				commentId: input.commentId,
				platformId: input.platformId,
			},
		},
		audit: pick(input, ['platformId', 'postedId', 'commentId']),
	}),
);

// ---------------------------------------------------------------------------
// Agency (Company) API
// ---------------------------------------------------------------------------

/** GET /company/contexts/v2 */
export const companyListContexts = define(
	'companyListContexts',
	'company.listContexts',
	() => ({ path: 'company/contexts/v2' }),
);

/** GET /company/accounts/{accountId}/workspaces/{workspaceId}/context */
export const companyGetWorkspaceContext = define(
	'companyGetWorkspaceContext',
	'company.getWorkspaceContext',
	(input) => ({
		path: `company/accounts/${segment(input.accountId)}/workspaces/${segment(input.workspaceId)}/context`,
		audit: pick(input, ['accountId', 'workspaceId']),
	}),
);

/** GET /company/connections */
export const companyListConnections = define(
	'companyListConnections',
	'company.listConnections',
	(input) => ({
		path: 'company/connections',
		options: {
			workspaceId: input.workspaceId,
			query: compactQuery({
				includeLinkedinReconnectRecommended:
					input.includeLinkedinReconnectRecommended ? '1' : undefined,
			}),
		},
		audit: pick(input, ['workspaceId']),
	}),
);

/** GET /company/platforms */
export const companyListPlatforms = define(
	'companyListPlatforms',
	'company.listPlatforms',
	(input) => ({
		path: 'company/platforms',
		options: {
			query: compactQuery({
				includeXPremiumLimits: flag(input.includeXPremiumLimits),
			}),
		},
	}),
);

const groupPath = (postGroupId: string) =>
	`company/post-groups/${segment(postGroupId)}`;

/** POST /company/post-groups */
export const companyCreateDraft = define(
	'companyCreateDraft',
	'company.posts.createDraft',
	(input) => {
		const { workspaceId, idempotencyKey, ...fields } = input;
		return {
			path: 'company/post-groups',
			options: {
				method: 'POST',
				workspaceId,
				idempotencyKey: companyKey(idempotencyKey),
				body: compactBody(fields),
			},
			audit: {
				workspaceId,
				fields: Object.keys(compactBody(fields)),
			},
		};
	},
);

/** PATCH /company/post-groups/{postGroupId} */
export const companyUpdateDraft = define(
	'companyUpdateDraft',
	'company.posts.updateDraft',
	(input) => {
		const { workspaceId, postGroupId, idempotencyKey, ...fields } = input;
		return {
			path: groupPath(postGroupId),
			options: {
				method: 'PATCH',
				workspaceId,
				idempotencyKey: companyKey(idempotencyKey),
				body: compactBody(fields),
			},
			audit: {
				workspaceId,
				postGroupId,
				fields: Object.keys(compactBody(fields)),
			},
		};
	},
);

/** GET /company/post-groups/{postGroupId} */
export const companyGetPostGroup = define(
	'companyGetPostGroup',
	'company.posts.get',
	(input) => ({
		path: groupPath(input.postGroupId),
		options: {
			workspaceId: input.workspaceId,
			// Declined reviews come back only with the approval v2 media type.
			accept: input.includeApproval ? COMPANY_APPROVAL_ACCEPT : undefined,
			query: compactQuery({
				includeApproval: bool(input.includeApproval),
				includePublishDeferral: bool(input.includePublishDeferral),
				includeRepostSource: bool(input.includeRepostSource),
			}),
		},
		audit: pick(input, ['workspaceId', 'postGroupId']),
	}),
);

function scheduleCommand(command: 'schedule' | 'reschedule') {
	return (input: PubloraEndpointInputs['companySchedule']): Request => ({
		path: `${groupPath(input.postGroupId)}/${command}`,
		options: {
			method: 'POST',
			workspaceId: input.workspaceId,
			idempotencyKey: companyKey(input.idempotencyKey),
			query: compactQuery({
				includeValidationDetails: flag(input.includeValidationDetails),
			}),
			body: { scheduledTime: input.scheduledTime },
		},
		audit: pick(input, ['workspaceId', 'postGroupId', 'scheduledTime']),
	});
}

/** POST /company/post-groups/{postGroupId}/schedule */
export const companySchedule = define(
	'companySchedule',
	'company.posts.schedule',
	scheduleCommand('schedule'),
);

/** POST /company/post-groups/{postGroupId}/reschedule */
export const companyReschedule = define(
	'companyReschedule',
	'company.posts.reschedule',
	scheduleCommand('reschedule'),
);

function groupCommand(command: 'unschedule' | 'recover' | 'approval') {
	return (input: PubloraEndpointInputs['companyUnschedule']): Request => ({
		path: `${groupPath(input.postGroupId)}/${command}`,
		options: {
			method: command === 'approval' ? 'DELETE' : 'POST',
			workspaceId: input.workspaceId,
			idempotencyKey: companyKey(input.idempotencyKey),
			accept: command === 'approval' ? COMPANY_APPROVAL_ACCEPT : undefined,
			body: {},
		},
		audit: pick(input, ['workspaceId', 'postGroupId']),
	});
}

/** POST /company/post-groups/{postGroupId}/unschedule */
export const companyUnschedule = define(
	'companyUnschedule',
	'company.posts.unschedule',
	groupCommand('unschedule'),
);

/** POST /company/post-groups/{postGroupId}/recover */
export const companyRecover = define(
	'companyRecover',
	'company.posts.recover',
	groupCommand('recover'),
);

/** GET /company/post-groups/{postGroupId}/approval */
export const companyGetApproval = define(
	'companyGetApproval',
	'company.posts.getApproval',
	(input) => ({
		path: `${groupPath(input.postGroupId)}/approval`,
		options: {
			workspaceId: input.workspaceId,
			accept: COMPANY_APPROVAL_ACCEPT,
		},
		audit: pick(input, ['workspaceId', 'postGroupId']),
	}),
);

/** POST /company/post-groups/{postGroupId}/approval */
export const companyRequestApproval = define(
	'companyRequestApproval',
	'company.posts.requestApproval',
	(input) => ({
		path: `${groupPath(input.postGroupId)}/approval`,
		options: {
			method: 'POST',
			workspaceId: input.workspaceId,
			idempotencyKey: companyKey(input.idempotencyKey),
			accept: COMPANY_APPROVAL_ACCEPT,
			body: compactBody({
				managerComment: input.managerComment,
				scheduledTime: input.scheduledTime,
			}),
		},
		audit: pick(input, ['workspaceId', 'postGroupId', 'scheduledTime']),
	}),
);

/** DELETE /company/post-groups/{postGroupId}/approval */
export const companyCancelApproval = define(
	'companyCancelApproval',
	'company.posts.cancelApproval',
	groupCommand('approval'),
);

/** POST /company/post-groups/{postGroupId}/approval/notification (not keyed) */
export const companyRetryApprovalNotification = define(
	'companyRetryApprovalNotification',
	'company.posts.retryApprovalNotification',
	(input) => ({
		path: `${groupPath(input.postGroupId)}/approval/notification`,
		options: { method: 'POST', workspaceId: input.workspaceId, body: {} },
		audit: pick(input, ['workspaceId', 'postGroupId']),
	}),
);

/** GET /company/post-groups/{postGroupId}/media */
export const companyListMedia = define(
	'companyListMedia',
	'company.posts.listMedia',
	(input) => ({
		path: `${groupPath(input.postGroupId)}/media`,
		options: { workspaceId: input.workspaceId },
		audit: pick(input, ['workspaceId', 'postGroupId']),
	}),
);

/** POST /company/post-groups/{postGroupId}/media/reservations */
export const companyReserveMedia = define(
	'companyReserveMedia',
	'company.posts.reserveMedia',
	(input) => {
		const { workspaceId, postGroupId, idempotencyKey, ...fields } = input;
		return {
			path: `${groupPath(postGroupId)}/media/reservations`,
			options: {
				method: 'POST',
				workspaceId,
				idempotencyKey: companyKey(idempotencyKey),
				body: compactBody(fields),
			},
			audit: pick(input, [
				'workspaceId',
				'postGroupId',
				'contentType',
				'sizeBytes',
				'purpose',
			]),
		};
	},
);

/** POST /company/post-groups/{postGroupId}/media/{mediaFileId}/complete (not keyed) */
export const companyCompleteMedia = define(
	'companyCompleteMedia',
	'company.posts.completeMedia',
	(input) => ({
		path: `${groupPath(input.postGroupId)}/media/${segment(input.mediaFileId)}/complete`,
		options: { method: 'POST', workspaceId: input.workspaceId, body: {} },
		audit: pick(input, ['workspaceId', 'postGroupId', 'mediaFileId']),
	}),
);

/** DELETE /company/post-groups/{postGroupId}/media/{mediaFileId} (not keyed) */
export const companyRemoveMedia = define(
	'companyRemoveMedia',
	'company.posts.removeMedia',
	(input) => ({
		path: `${groupPath(input.postGroupId)}/media/${segment(input.mediaFileId)}`,
		options: { method: 'DELETE', workspaceId: input.workspaceId },
		audit: pick(input, ['workspaceId', 'postGroupId', 'mediaFileId']),
	}),
);

/** GET /company/webhooks */
export const companyListWebhooks = define(
	'companyListWebhooks',
	'company.webhooks.list',
	(input) => ({
		path: 'company/webhooks',
		options: { workspaceId: input.workspaceId },
		audit: pick(input, ['workspaceId']),
	}),
);

/** POST /company/webhooks */
export const companyCreateWebhook = define(
	'companyCreateWebhook',
	'company.webhooks.create',
	(input) => ({
		path: 'company/webhooks',
		options: {
			method: 'POST',
			workspaceId: input.workspaceId,
			idempotencyKey: companyKey(input.idempotencyKey),
			body: compactBody({
				name: input.name,
				url: input.url,
				events: input.events,
				isActive: input.isActive,
			}),
		},
		audit: { workspaceId: input.workspaceId, events: input.events },
	}),
);

/** PATCH /company/webhooks/{webhookId} */
export const companyUpdateWebhook = define(
	'companyUpdateWebhook',
	'company.webhooks.update',
	(input) => ({
		path: `company/webhooks/${segment(input.webhookId)}`,
		options: {
			method: 'PATCH',
			workspaceId: input.workspaceId,
			idempotencyKey: companyKey(input.idempotencyKey),
			body: compactBody({
				name: input.name,
				url: input.url,
				events: input.events,
				isActive: input.isActive,
			}),
		},
		audit: pick(input, ['workspaceId', 'webhookId', 'isActive']),
	}),
);

/** DELETE /company/webhooks/{webhookId} (body `{}`, required by the spec) */
export const companyDeleteWebhook = define(
	'companyDeleteWebhook',
	'company.webhooks.delete',
	(input) => ({
		path: `company/webhooks/${segment(input.webhookId)}`,
		options: {
			method: 'DELETE',
			workspaceId: input.workspaceId,
			idempotencyKey: companyKey(input.idempotencyKey),
			body: {},
		},
		audit: pick(input, ['workspaceId', 'webhookId']),
	}),
);

/** POST /company/webhooks/{webhookId}/regenerate-secret */
export const companyRegenerateWebhookSecret = define(
	'companyRegenerateWebhookSecret',
	'company.webhooks.regenerateSecret',
	(input) => ({
		path: `company/webhooks/${segment(input.webhookId)}/regenerate-secret`,
		options: {
			method: 'POST',
			workspaceId: input.workspaceId,
			idempotencyKey: companyKey(input.idempotencyKey),
			body: {},
		},
		audit: pick(input, ['workspaceId', 'webhookId']),
	}),
);
