import { FileInputSchema } from 'corsair/http';
import { z } from 'zod';

/**
 * Schemas for the routes added after the first version: connection checks,
 * platform limits, post logs, media by reference and multipart uploads,
 * webhook secret rotation, Mastodon/Bluesky and LinkedIn analytics and
 * interactions, and the Agency (Company) API.
 *
 * Inputs are strict; responses are loose (`.loose()`, optional fields) so a
 * field Publora adds later does not fail a call that already ran.
 * Spec: https://docs.publora.com/openapi.json
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

const IdempotencyKeyInput = z
	.string()
	.min(1)
	.max(200)
	.optional()
	.describe(
		'Sent as the Idempotency-Key header. A repeat with the same key and body returns the first result instead of acting twice.',
	);

const PlatformIdInput = z
	.string()
	.min(1)
	.max(512)
	.describe('Connection id from accounts.list (platformId)');

/** `components.schemas.PlatformSettingsInput`, passed through as in posts.create. */
// unknown: settings differ per network and Publora validates the keys itself.
const SettingsRecord = z.record(z.string(), z.record(z.string(), z.unknown()));

// ---------------------------------------------------------------------------
// Connections, limits, logs
// ---------------------------------------------------------------------------

/** POST /test-connection/{platformId} */
const TestConnectionInput = z.object({ platformId: PlatformIdInput });
const LastErrorSchema = z
	.object({ message: S, occurredAt: S })
	.loose()
	.nullable()
	.optional();
const TestConnectionOutput = z
	.object({
		platform: S,
		platformId: S,
		username: S,
		status: S.describe('ok or error'),
		message: S,
		permissions: z.array(z.string()).nullable().optional(),
		permissionsKnown: B,
		tokenExpiresIn: S,
		lastSuccessfulPost: S,
		lastError: LastErrorSchema,
	})
	.loose();

/** GET /platform-limits */
const PlatformLimitsOutput = z
	.object({
		success: B,
		schemaVersion: N,
		source: S,
		packageVersion: S,
		limitsLastUpdated: S,
		supportedPlatforms: z.array(z.string()).nullable().optional(),
		// unknown: per-platform limit objects, documented as free-form JSON.
		platforms: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();

/** GET /post-logs/{postGroupId} */
const PostLogsInput = z.object({
	postGroupId: z.string().min(1).describe('Post group id'),
});
const PostLogSchema = z
	.object({
		_id: S,
		postGroupId: S,
		platform: S,
		postId: S,
		event: S,
		error: S,
		httpStatus: N,
		retryCount: N,
		// unknown: free-form diagnostic metadata per event.
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		createdAt: S,
		updatedAt: S,
	})
	.loose();
const PostLogsOutput = z
	.object({ success: B, logs: z.array(PostLogSchema).nullable().optional() })
	.loose();

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

/** POST /attach-media/{postGroupId} */
const AttachMediaInput = z.object({
	postGroupId: z.string().min(1).describe('Draft or scheduled post group id'),
	file: z
		.object({
			download_url: z
				.string()
				.url()
				.describe('HTTPS URL Publora downloads the file from'),
			file_id: z
				.string()
				.min(1)
				.max(512)
				.describe('Stable id of the file; the same id is not attached twice'),
			mime_type: z.string().optional(),
			file_name: z.string().optional(),
		})
		.strict(),
	fileName: z.string().min(1).max(255).optional(),
	idempotencyKey: IdempotencyKeyInput,
});
const PostGroupSummary = z
	.object({
		_id: S,
		status: S,
		content: S,
		platforms: z.array(z.string()).nullable().optional(),
		scheduledTime: S,
	})
	.loose();
const AttachMediaOutput = z
	.object({
		success: B,
		message: S,
		scheduledTime: S,
		postGroup: PostGroupSummary.nullable().optional(),
	})
	.loose();

/** POST /upload-instagram-cover (multipart) */
const UploadInstagramCoverInput = z.object({
	postGroupId: z.string().min(1).describe('Draft or scheduled post group id'),
	cover: FileInputSchema.describe(
		'The cover image (JPEG, PNG or WebP): a public URL, {url}, or {base64}',
	),
});
const UploadInstagramCoverOutput = z
	.object({
		success: B,
		cover: z.object({ mediaId: S, url: S }).loose().nullable().optional(),
		message: S,
	})
	.loose();

/** POST /upload-youtube-thumbnail (multipart) */
const UploadYoutubeThumbnailInput = z.object({
	postGroupId: z.string().min(1).describe('Draft or scheduled post group id'),
	thumbnail: FileInputSchema.describe(
		'JPEG or PNG, at most 2 MB, at least 640x360: a public URL, {url}, or {base64}',
	),
});
const UploadYoutubeThumbnailOutput = z
	.object({
		success: B,
		thumbnail: z.object({ mediaId: S, url: S }).loose().nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

/** POST /webhooks/{id}/regenerate-secret */
const RegenerateSecretInput = z.object({
	id: z.string().min(1).describe('Webhook id (_id)'),
});
const RegenerateSecretOutput = z
	.object({ success: B, secret: z.string() })
	.loose();

// ---------------------------------------------------------------------------
// Mastodon and Bluesky analytics
// ---------------------------------------------------------------------------

const SOCIAL_ANALYTICS_PLATFORMS = ['mastodon', 'bluesky'] as const;

/** POST /post-statistics */
const PostStatisticsInput = z.object({
	posts: z
		.array(
			z.object({
				platform: z.enum(SOCIAL_ANALYTICS_PLATFORMS),
				platformId: PlatformIdInput,
				postedId: z
					.string()
					.min(1)
					.max(512)
					.describe('postedId from posts.get'),
			}),
		)
		.min(1)
		.max(50),
});
const PostMetricsSchema = z
	.object({
		reactions: N,
		comments: N,
		reposts: N,
		quotes: N,
		saves: N,
		impressions: N,
		reach: N,
		clicks: N,
	})
	.loose();
const PostStatisticsOutput = z
	.object({
		success: B,
		stats: z
			.record(z.string(), PostMetricsSchema.nullable())
			.nullable()
			.optional(),
		rateLimited: B,
		issues: z.record(z.string(), z.string()).nullable().optional(),
	})
	.loose();

/** POST /profile-statistics */
const ProfileStatisticsInput = z.object({
	platform: z.enum(SOCIAL_ANALYTICS_PLATFORMS),
	platformId: PlatformIdInput,
});
const ProfileStatisticsOutput = z
	.object({
		success: B,
		profile: z
			.object({ followers: N, following: N, posts: N })
			.loose()
			.nullable()
			.optional(),
		cached: B,
		fetchedAt: S,
		rateLimited: B,
		unavailable: S,
	})
	.loose();

// ---------------------------------------------------------------------------
// LinkedIn
// ---------------------------------------------------------------------------

const LINKEDIN_METRICS = [
	'IMPRESSION',
	'MEMBERS_REACHED',
	'RESHARE',
	'REACTION',
	'COMMENT',
] as const;

const LINKEDIN_REACTIONS = [
	'LIKE',
	'PRAISE',
	'EMPATHY',
	'INTEREST',
	'APPRECIATION',
	'ENTERTAINMENT',
] as const;

const LinkedInDate = z.object({
	year: z.number().int(),
	month: z.number().int().min(1).max(12),
	day: z.number().int().min(1).max(31),
});
const LinkedInDateRange = z
	.object({ start: LinkedInDate.optional(), end: LinkedInDate.optional() })
	.optional()
	.describe('Date range as { start: {year, month, day}, end: {...} }');

const LinkedInQueryTypes = z
	.union([z.array(z.enum(LINKEDIN_METRICS)).min(1), z.literal('ALL')])
	.optional()
	.describe('Several metrics at once, or "ALL" for all five');

const LinkedInPostedId = z
	.string()
	.min(1)
	.describe('LinkedIn post URN (postedId from posts.get)');

/** POST /linkedin-post-statistics */
const LinkedInPostStatisticsInput = z.object({
	postedId: LinkedInPostedId,
	platformId: PlatformIdInput,
	queryType: z.enum(LINKEDIN_METRICS).optional(),
	queryTypes: LinkedInQueryTypes,
});
const LinkedInPostStatisticsOutput = z
	.object({
		success: B,
		count: N,
		metrics: z.record(z.string(), z.number()).nullable().optional(),
		cached: B,
	})
	.loose();

/** POST /linkedin-account-statistics */
const LinkedInAccountStatisticsInput = z.object({
	platformId: PlatformIdInput,
	queryType: z.enum(LINKEDIN_METRICS).optional(),
	queryTypes: LinkedInQueryTypes,
	aggregation: z.enum(['TOTAL', 'DAILY']).optional(),
	dateRange: LinkedInDateRange,
});
const LinkedInAccountStatisticsOutput = z
	.object({
		success: B,
		// unknown: TOTAL gives numbers, DAILY can give per-day series.
		metrics: z.record(z.string(), z.unknown()).nullable().optional(),
		aggregation: S,
		cached: B,
	})
	.loose();

/** POST /linkedin-profile-summary */
const LinkedInProfileSummaryInput = z.object({
	platformId: PlatformIdInput,
	dateRange: LinkedInDateRange,
});
const LinkedInProfileSummaryOutput = z
	.object({
		success: B,
		partialData: B,
		profile: z
			.object({
				followers: z
					.object({ total: N, periodGrowth: N })
					.loose()
					.nullable()
					.optional(),
				posts: z
					.object({
						totalImpressions: N,
						totalReactions: N,
						totalComments: N,
						totalReshares: N,
						totalMembersReached: N,
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable()
			.optional(),
		errors: z
			.array(z.object({ metric: S, error: S }).loose())
			.nullable()
			.optional(),
	})
	.loose();

/** POST /linkedin-followers */
const LinkedInFollowersInput = z.object({
	platformId: PlatformIdInput,
	period: z.enum(['lifetime', 'daily']).optional(),
	dateRange: LinkedInDateRange,
});
const LinkedInFollowersOutput = z
	.object({
		success: B,
		followersCount: N,
		data: z
			.array(z.object({ date: S, count: N }).loose())
			.nullable()
			.optional(),
		totalGrowth: N,
		cached: B,
	})
	.loose();

/** GET /linkedin-mentionables */
const LinkedInMentionablesInput = z.object({
	q: z.string().optional().describe('Name to search for'),
	limit: z.number().int().min(1).max(100).optional(),
});
const LinkedInMentionablesOutput = z
	.object({
		success: B,
		people: z
			.array(
				z
					.object({
						personId: S,
						name: S,
						profileUrl: S,
						profilePicture: S,
						source: S,
						lastSeenAt: S,
						mention: S,
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const UrnTranslated = z
	.object({ from: S, to: S })
	.loose()
	.nullable()
	.optional();
const ReactionSchema = z
	.object({ reactionType: S, actor: S, object: S })
	.loose()
	.nullable()
	.optional();

/** POST /linkedin-reactions */
const LinkedInAddReactionInput = z.object({
	postedId: LinkedInPostedId,
	reactionType: z.enum(LINKEDIN_REACTIONS),
	platformId: PlatformIdInput,
});
/** DELETE /linkedin-reactions */
const LinkedInRemoveReactionInput = z.object({
	postedId: LinkedInPostedId,
	platformId: PlatformIdInput,
});
const LinkedInReactionOutput = z
	.object({
		success: B,
		reaction: ReactionSchema,
		urnTranslated: UrnTranslated,
	})
	.loose();

/** POST /linkedin-reshare */
const LinkedInReshareInput = z.object({
	platformId: PlatformIdInput,
	parent: z.string().min(1).describe('URN of the LinkedIn post to reshare'),
	commentary: z.string().optional(),
	visibility: z.enum(['PUBLIC', 'CONNECTIONS']).optional(),
});
const LinkedInReshareOutput = z
	.object({
		success: B,
		reshare: z.object({ id: S }).loose().nullable().optional(),
	})
	.loose();

/** POST /linkedin-comments */
const LinkedInCreateCommentInput = z
	.object({
		postedId: LinkedInPostedId,
		message: z
			.string()
			.max(10000)
			.describe(
				'Comment text; may be empty only with imageUrl. Mentions: @{urn:li:person:ID|Name}',
			),
		platformId: PlatformIdInput,
		parentComment: z
			.string()
			.min(1)
			.optional()
			.describe('Comment URN to reply to'),
		imageUrl: z.string().url().optional(),
	})
	.refine((v) => /\S/.test(v.message) || Boolean(v.imageUrl?.trim()), {
		message: 'message must not be blank unless imageUrl is set',
	});
const LinkedInCreateCommentOutput = z
	.object({
		success: B,
		comment: z
			.object({ id: S, message: S, imageUrn: S, actor: S, object: S })
			.loose()
			.nullable()
			.optional(),
	})
	.loose();

/** DELETE /linkedin-comments */
const LinkedInDeleteCommentInput = z.object({
	postedId: LinkedInPostedId,
	commentId: z.string().min(1).describe('Comment id or URN'),
	platformId: PlatformIdInput,
});
const LinkedInDeleteCommentOutput = z
	.object({ success: B, deleted: S })
	.loose();

// ---------------------------------------------------------------------------
// Agency (Company) API
// ---------------------------------------------------------------------------

/** Company ids are 24-character hex strings (MongoDB ObjectIds). */
const HexId = z
	.string()
	.regex(/^[a-f0-9]{24}$/, 'expected a 24-character hex id');

const WorkspaceIdInput = HexId.describe(
	'Workspace id from company.listContexts (accounts[].workspaces[].id), sent as X-Publora-Workspace-Id',
);

const CompanyIdempotencyKey = z
	.string()
	.min(1)
	.max(255)
	.regex(/^[!-+--~]{1,255}$/, 'printable ASCII without spaces or commas')
	.optional()
	.describe(
		'Idempotency-Key header (required by Publora; generated when omitted). Send the same key and body to retry after an uncertain response.',
	);

const CompanyScheduledTime = z
	.string()
	.regex(
		/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/,
		'UTC time with milliseconds, e.g. 2026-12-01T15:00:00.000Z',
	);

const COMPANY_COMMENT_PLATFORMS = [
	'twitter',
	'threads',
	'bluesky',
	'tiktok',
	'instagram',
	'mastodon',
	'youtube',
	'linkedin',
	'telegram',
	'facebook',
] as const;

const COMPANY_WEBHOOK_EVENTS = ['post.published', 'post.failed'] as const;

/** Envelope of every Company reply: `{ success: true, data }`. */
function companyEnvelope<T extends z.ZodType>(data: T) {
	return z.object({ success: B, data }).loose();
}

const CommandResult = z
	.object({
		result: S.describe('applied, or replayed for an identical retry'),
		accountId: S,
		workspaceId: S,
		groupId: S,
		postIds: z.array(z.string()).nullable().optional(),
	})
	.loose();

// Contexts --------------------------------------------------------------------

/** GET /company/contexts/v2 */
const CompanyContextsInput = z.object({});
const CompanyWorkspace = z
	.object({
		id: S,
		name: S,
		// unknown: capability flags (canWriteDrafts, canScheduleOrPublish, ...), more are added over time.
		capabilities: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
const CompanyAccount = z
	.object({
		id: S,
		membershipId: S,
		name: S,
		logoUrl: S,
		kind: S,
		status: S,
		// unknown: billing snapshot, read as is.
		billing: z.record(z.string(), z.unknown()).nullable().optional(),
		accountRole: S,
		presentationMode: S,
		runtimeMode: S,
		publishingPaused: B,
		commandVersion: N,
		// unknown: account-level capability flags.
		capabilities: z.record(z.string(), z.unknown()).nullable().optional(),
		workspaces: z.array(CompanyWorkspace).nullable().optional(),
	})
	.loose();
const CompanyContextsOutput = companyEnvelope(
	z
		.object({
			schemaVersion: N,
			defaultContext: z
				.object({ accountId: S, workspaceId: S })
				.loose()
				.nullable()
				.optional(),
			singleContext: B,
			accounts: z.array(CompanyAccount).nullable().optional(),
		})
		.loose(),
);

/** GET /company/accounts/{accountId}/workspaces/{workspaceId}/context */
const CompanyWorkspaceContextInput = z.object({
	accountId: HexId.describe('Account id from company.listContexts'),
	workspaceId: HexId.describe('Workspace id from company.listContexts'),
});

/** GET /company/connections */
const CompanyConnectionsInput = z.object({
	workspaceId: WorkspaceIdInput,
	includeLinkedinReconnectRecommended: z
		.boolean()
		.optional()
		.describe('Add linkedinReconnectRecommended to LinkedIn channels'),
});
const CompanyConnection = z
	.object({
		id: S,
		accountId: S,
		workspaceId: S,
		platform: S,
		platformId: S,
		username: S,
		displayName: S,
		profileImageUrl: S,
		profileUrl: S,
		connectionSubtype: S,
		subscriptionType: S,
		status: S.describe('active or reconnect_required'),
		lastSuccessfulPost: S,
		lastErrorAt: S,
		addedAt: S,
		linkedinReconnectRecommended: B,
		activationStatus: S,
	})
	.loose();
const CompanyConnectionsOutput = companyEnvelope(
	z
		.object({
			accountId: S,
			workspaceId: S,
			items: z.array(CompanyConnection).nullable().optional(),
		})
		.loose(),
);

/** GET /company/platforms */
const CompanyPlatformsInput = z.object({
	includeXPremiumLimits: z
		.boolean()
		.optional()
		.describe('Add X character limits per subscription type'),
});
const CompanyPlatformsOutput = companyEnvelope(
	z
		.object({
			publishablePlatforms: z.array(z.string()).nullable().optional(),
			connectOnlyPlatforms: z.array(z.string()).nullable().optional(),
			// unknown: per-platform variants, media and settings limits.
			basicVariants: z.record(z.string(), z.unknown()).nullable().optional(),
			// unknown: X limits by subscription type, when asked for.
			xPostCharacterLimits: z
				.record(z.string(), z.unknown())
				.nullable()
				.optional(),
		})
		.loose(),
);

// Post groups -------------------------------------------------------------------

const CompanyDraftFields = {
	content: z.string().max(100000).optional().describe('Base post text'),
	notes: z.string().max(10000).optional().describe('Internal notes'),
	topic: z.string().max(500).optional(),
	platforms: z
		.array(z.string().min(1).max(300))
		.max(20)
		.optional()
		.describe(
			'Channel keys from company.listConnections (<platform>-<platformId>)',
		),
	platformContents: z
		.record(
			z.string(),
			z.object({ content: z.string().max(100000), isBase: z.boolean() }),
		)
		.optional()
		.describe('Per-channel text keyed by channel key'),
	isPlatformSpecific: z.boolean().optional(),
	sameContent: z.boolean().optional(),
	platformSettings: SettingsRecord.optional().describe(
		'Per-network settings (threads, tiktok, instagram, youtube, linkedin, telegram, twitter); discover them with company.listPlatforms',
	),
	videoTimestamp: z.number().min(0).max(86400).optional(),
	firstComment: z
		.object({
			text: z.string().max(25000),
			platforms: z.array(z.enum(COMPANY_COMMENT_PLATFORMS)).optional(),
		})
		.nullable()
		.optional()
		.describe('One first comment under the published post; null clears it'),
	repostSourceSnapshot: z
		.object({
			postedId: z.string().regex(/^urn:li:(share|ugcPost):[0-9]+$/),
			commentary: z.string().max(30000),
			authorName: z.string().nullable().optional(),
			publishedAt: z.string().nullable().optional(),
			capturedAt: z.string(),
		})
		.nullable()
		.optional()
		.describe('LinkedIn post shown as the review preview of a reshare'),
};

/** POST /company/post-groups */
const CompanyCreateDraftInput = z.object({
	workspaceId: WorkspaceIdInput,
	idempotencyKey: CompanyIdempotencyKey,
	...CompanyDraftFields,
});
/** PATCH /company/post-groups/{postGroupId} */
const CompanyUpdateDraftInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: HexId.describe('Post group id'),
	idempotencyKey: CompanyIdempotencyKey,
	...CompanyDraftFields,
});
const CompanyDraftOutput = companyEnvelope(CommandResult);

const PostGroupIdField = HexId.describe('Post group id');

/** GET /company/post-groups/{postGroupId} */
const CompanyGetPostGroupInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
	includeApproval: z
		.boolean()
		.optional()
		.describe('Add the client review (declined reviews included)'),
	includePublishDeferral: z.boolean().optional(),
	includeRepostSource: z.boolean().optional(),
});
const CompanyGroup = z
	.object({
		id: S,
		accountId: S,
		workspaceId: S,
		// unknown: review summary, read as is.
		approval: z.record(z.string(), z.unknown()).nullable().optional(),
		scheduledTime: S,
		platforms: z.array(z.string()).nullable().optional(),
		// unknown: per-channel text records.
		platformContents: z.record(z.string(), z.unknown()).nullable().optional(),
		isPlatformSpecific: B,
		sameContent: B,
		topic: S,
		content: S,
		notes: S,
		videoTimestamp: N,
		mediaFileIds: z.array(z.string()).nullable().optional(),
		postIds: z.array(z.string()).nullable().optional(),
		status: S,
		processingStatus: S,
		// unknown: per-network settings as stored.
		platformSettings: z.record(z.string(), z.unknown()).nullable().optional(),
		errorMessage: S,
		createdAt: S,
		updatedAt: S,
	})
	.loose();
const CompanyChannelPost = z
	.object({
		id: S,
		postGroupId: S,
		content: S,
		platform: S,
		platformId: S,
		status: S,
		error: z
			.object({ code: S, message: S, platformStatusCode: N })
			.loose()
			.nullable()
			.optional(),
		postedId: S,
		permalink: S,
		publishedAt: S,
		createdAt: S,
		updatedAt: S,
	})
	.loose();
const CompanyGetPostGroupOutput = companyEnvelope(
	z
		.object({
			group: CompanyGroup,
			posts: z.array(CompanyChannelPost).nullable().optional(),
		})
		.loose(),
);

/** POST .../schedule and .../reschedule */
const CompanyScheduleInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
	scheduledTime: CompanyScheduledTime.describe(
		'UTC time with milliseconds. To publish now send the current time, and the same value on retries.',
	),
	includeValidationDetails: z
		.boolean()
		.optional()
		.describe('Add validationErrors to a failed publishing check'),
	idempotencyKey: CompanyIdempotencyKey,
});
const CompanyScheduleOutput = companyEnvelope(
	z
		.object({
			result: S,
			accountId: S,
			workspaceId: S,
			groupId: S,
			scheduledTime: S,
			postCount: N,
		})
		.loose(),
);

/** POST .../unschedule */
const CompanyGroupCommandInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
	idempotencyKey: CompanyIdempotencyKey,
});
const CompanyUnscheduleOutput = companyEnvelope(
	z
		.object({
			result: S,
			accountId: S,
			workspaceId: S,
			groupId: S,
			status: S,
			postCount: N,
		})
		.loose(),
);

/** POST .../recover */
const CompanyRecoverOutput = companyEnvelope(
	z
		.object({
			result: S,
			accountId: S,
			workspaceId: S,
			sourceGroupId: S,
			groupId: S,
			status: S,
			postIds: z.array(z.string()).nullable().optional(),
			recoveredPlatforms: z.array(z.string()).nullable().optional(),
			excludedPlatforms: z.array(z.unknown()).nullable().optional(),
			mediaCount: N,
		})
		.loose(),
);

// Approval ----------------------------------------------------------------------

const CompanyApproval = z
	.object({
		result: S,
		postGroupId: S,
		status: S.describe(
			'none, pending, approved, changes_requested, declined or outdated',
		),
		requestedAt: S,
		decidedAt: S,
		expiresAt: S,
		reviewId: S,
		managerComment: S,
		reviewUrl: S.describe('Private review page for the client'),
		expired: B,
		// unknown: decision details (comment, decidedBy), read as is.
		decision: z.unknown().optional(),
		notificationStatus: S,
		// unknown: requested publication time and its state.
		publication: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
const CompanyApprovalOutput = companyEnvelope(CompanyApproval);

/** GET .../approval */
const CompanyGetApprovalInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
});

/** POST .../approval */
const CompanyRequestApprovalInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
	managerComment: z.string().max(5000).optional(),
	scheduledTime: CompanyScheduledTime.nullable()
		.optional()
		.describe('Publication time shown to the client'),
	idempotencyKey: CompanyIdempotencyKey,
});

/** POST .../approval/notification */
const CompanyRetryNotificationInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
});
const CompanyRetryNotificationOutput = companyEnvelope(
	z.object({ notificationStatus: S }).loose(),
);

// Media -------------------------------------------------------------------------

/** GET .../media */
const CompanyListMediaInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
});
const CompanyMediaItem = z
	.object({
		id: S,
		url: S,
		type: S,
		mimeType: S,
		status: S,
		purpose: S,
	})
	.loose();
const CompanyListMediaOutput = companyEnvelope(
	z
		.object({
			accountId: S,
			workspaceId: S,
			postGroupId: S,
			mediaFileIds: z.array(z.string()).nullable().optional(),
			items: z.array(CompanyMediaItem).nullable().optional(),
		})
		.loose(),
);

/** POST .../media/reservations */
const CompanyReserveMediaInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
	fileName: z.string().min(1).max(255),
	contentType: z.enum([
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
		'image/tiff',
		'image/avif',
		'video/mp4',
		'video/quicktime',
		'video/webm',
		'application/pdf',
	]),
	sizeBytes: z.number().int().min(1).describe('Exact byte size of the file'),
	type: z.enum(['image', 'video', 'document']).optional(),
	purpose: z
		.literal('youtube_thumbnail')
		.optional()
		.describe('Reserve a YouTube thumbnail instead of post media'),
	idempotencyKey: CompanyIdempotencyKey,
});
const CompanyReserveMediaOutput = companyEnvelope(
	z
		.object({
			accountId: S,
			workspaceId: S,
			mediaFileId: S,
			postGroupId: S,
			uploadUrl: S.describe(
				'PUT the bytes here with every uploadHeaders entry',
			),
			uploadHeaders: z.record(z.string(), z.string()).nullable().optional(),
			fileUrl: S,
			contentType: S,
			type: S,
			sizeBytes: N,
			expiresAt: S,
			status: S,
		})
		.loose(),
);

/** POST .../media/{mediaFileId}/complete and DELETE .../media/{mediaFileId} */
const CompanyMediaFileInput = z.object({
	workspaceId: WorkspaceIdInput,
	postGroupId: PostGroupIdField,
	mediaFileId: HexId.describe('mediaFileId from company.posts.reserveMedia'),
});
const CompanyCompleteMediaOutput = companyEnvelope(
	z
		.object({
			accountId: S,
			workspaceId: S,
			mediaFileId: S,
			postGroupId: S,
			status: S,
			contentType: S,
			type: S,
			sizeBytes: N,
			purpose: S,
			fileUrl: S,
			// unknown: probe metadata (dimensions, duration ...).
			metadata: z.record(z.string(), z.unknown()).nullable().optional(),
			bytesProbedAt: S,
		})
		.loose(),
);
const CompanyRemoveMediaOutput = companyEnvelope(
	z
		.object({
			accountId: S,
			workspaceId: S,
			mediaFileId: S,
			postGroupId: S,
			status: S,
			deletionAfter: S,
		})
		.loose(),
);

// Webhooks ----------------------------------------------------------------------

const CompanyWebhook = z
	.object({
		id: S,
		name: S,
		url: S,
		events: z.array(z.string()).nullable().optional(),
		isActive: B,
		failureCount: N,
		lastTriggeredAt: S,
		createdAt: S,
		updatedAt: S,
	})
	.loose();

/** GET /company/webhooks */
const CompanyListWebhooksInput = z.object({ workspaceId: WorkspaceIdInput });
const CompanyListWebhooksOutput = companyEnvelope(
	z
		.object({
			accountId: S,
			workspaceId: S,
			items: z.array(CompanyWebhook).nullable().optional(),
		})
		.loose(),
);

const CompanyWebhookUrl = z
	.string()
	.url()
	.max(2048)
	.regex(/^https?:\/\//, 'http(s) URL');
const CompanyWebhookEvents = z
	.array(z.enum(COMPANY_WEBHOOK_EVENTS))
	.min(1)
	.max(2);

/** POST /company/webhooks */
const CompanyCreateWebhookInput = z.object({
	workspaceId: WorkspaceIdInput,
	name: z.string().min(1).max(100),
	url: CompanyWebhookUrl,
	events: CompanyWebhookEvents,
	isActive: z.boolean().optional(),
	idempotencyKey: CompanyIdempotencyKey,
});
const CompanyWebhookSecretOutput = companyEnvelope(
	z
		.object({
			accountId: S,
			workspaceId: S,
			webhook: CompanyWebhook,
			secret: z.string().describe('Signing secret, shown only in this reply'),
		})
		.loose(),
);

/** PATCH /company/webhooks/{webhookId} */
const CompanyUpdateWebhookInput = z
	.object({
		workspaceId: WorkspaceIdInput,
		webhookId: HexId.describe('Subscription id from company.webhooks.list'),
		name: z.string().min(1).max(100).optional(),
		url: CompanyWebhookUrl.optional(),
		events: CompanyWebhookEvents.optional(),
		isActive: z.boolean().optional(),
		idempotencyKey: CompanyIdempotencyKey,
	})
	.refine(
		(v) =>
			v.name !== undefined ||
			v.url !== undefined ||
			v.events !== undefined ||
			v.isActive !== undefined,
		{ message: 'send at least one of name, url, events, isActive' },
	);
const CompanyUpdateWebhookOutput = companyEnvelope(
	z.object({ accountId: S, workspaceId: S, webhook: CompanyWebhook }).loose(),
);

/** DELETE /company/webhooks/{webhookId} and POST .../regenerate-secret */
const CompanyWebhookCommandInput = z.object({
	workspaceId: WorkspaceIdInput,
	webhookId: HexId.describe('Subscription id from company.webhooks.list'),
	idempotencyKey: CompanyIdempotencyKey,
});
const CompanyDeleteWebhookOutput = companyEnvelope(
	z.object({ accountId: S, workspaceId: S, webhookId: S, deleted: B }).loose(),
);

// ---------------------------------------------------------------------------

export const PubloraExtraInputSchemas = {
	testConnection: TestConnectionInput,
	getPlatformLimits: z.object({}),
	getPostLogs: PostLogsInput,
	attachMedia: AttachMediaInput,
	uploadInstagramCover: UploadInstagramCoverInput,
	uploadYoutubeThumbnail: UploadYoutubeThumbnailInput,
	regenerateWebhookSecret: RegenerateSecretInput,
	analyticsPostStatistics: PostStatisticsInput,
	analyticsProfileStatistics: ProfileStatisticsInput,
	linkedinPostStatistics: LinkedInPostStatisticsInput,
	linkedinAccountStatistics: LinkedInAccountStatisticsInput,
	linkedinProfileSummary: LinkedInProfileSummaryInput,
	linkedinFollowers: LinkedInFollowersInput,
	linkedinMentionables: LinkedInMentionablesInput,
	linkedinAddReaction: LinkedInAddReactionInput,
	linkedinRemoveReaction: LinkedInRemoveReactionInput,
	linkedinReshare: LinkedInReshareInput,
	linkedinCreateComment: LinkedInCreateCommentInput,
	linkedinDeleteComment: LinkedInDeleteCommentInput,
	companyListContexts: CompanyContextsInput,
	companyGetWorkspaceContext: CompanyWorkspaceContextInput,
	companyListConnections: CompanyConnectionsInput,
	companyListPlatforms: CompanyPlatformsInput,
	companyCreateDraft: CompanyCreateDraftInput,
	companyUpdateDraft: CompanyUpdateDraftInput,
	companyGetPostGroup: CompanyGetPostGroupInput,
	companySchedule: CompanyScheduleInput,
	companyReschedule: CompanyScheduleInput,
	companyUnschedule: CompanyGroupCommandInput,
	companyRecover: CompanyGroupCommandInput,
	companyGetApproval: CompanyGetApprovalInput,
	companyRequestApproval: CompanyRequestApprovalInput,
	companyCancelApproval: CompanyGroupCommandInput,
	companyRetryApprovalNotification: CompanyRetryNotificationInput,
	companyListMedia: CompanyListMediaInput,
	companyReserveMedia: CompanyReserveMediaInput,
	companyCompleteMedia: CompanyMediaFileInput,
	companyRemoveMedia: CompanyMediaFileInput,
	companyListWebhooks: CompanyListWebhooksInput,
	companyCreateWebhook: CompanyCreateWebhookInput,
	companyUpdateWebhook: CompanyUpdateWebhookInput,
	companyDeleteWebhook: CompanyWebhookCommandInput,
	companyRegenerateWebhookSecret: CompanyWebhookCommandInput,
} as const;

export const PubloraExtraOutputSchemas = {
	testConnection: TestConnectionOutput,
	getPlatformLimits: PlatformLimitsOutput,
	getPostLogs: PostLogsOutput,
	attachMedia: AttachMediaOutput,
	uploadInstagramCover: UploadInstagramCoverOutput,
	uploadYoutubeThumbnail: UploadYoutubeThumbnailOutput,
	regenerateWebhookSecret: RegenerateSecretOutput,
	analyticsPostStatistics: PostStatisticsOutput,
	analyticsProfileStatistics: ProfileStatisticsOutput,
	linkedinPostStatistics: LinkedInPostStatisticsOutput,
	linkedinAccountStatistics: LinkedInAccountStatisticsOutput,
	linkedinProfileSummary: LinkedInProfileSummaryOutput,
	linkedinFollowers: LinkedInFollowersOutput,
	linkedinMentionables: LinkedInMentionablesOutput,
	linkedinAddReaction: LinkedInReactionOutput,
	linkedinRemoveReaction: LinkedInReactionOutput,
	linkedinReshare: LinkedInReshareOutput,
	linkedinCreateComment: LinkedInCreateCommentOutput,
	linkedinDeleteComment: LinkedInDeleteCommentOutput,
	companyListContexts: CompanyContextsOutput,
	companyGetWorkspaceContext: CompanyContextsOutput,
	companyListConnections: CompanyConnectionsOutput,
	companyListPlatforms: CompanyPlatformsOutput,
	companyCreateDraft: CompanyDraftOutput,
	companyUpdateDraft: CompanyDraftOutput,
	companyGetPostGroup: CompanyGetPostGroupOutput,
	companySchedule: CompanyScheduleOutput,
	companyReschedule: CompanyScheduleOutput,
	companyUnschedule: CompanyUnscheduleOutput,
	companyRecover: CompanyRecoverOutput,
	companyGetApproval: CompanyApprovalOutput,
	companyRequestApproval: CompanyApprovalOutput,
	companyCancelApproval: CompanyApprovalOutput,
	companyRetryApprovalNotification: CompanyRetryNotificationOutput,
	companyListMedia: CompanyListMediaOutput,
	companyReserveMedia: CompanyReserveMediaOutput,
	companyCompleteMedia: CompanyCompleteMediaOutput,
	companyRemoveMedia: CompanyRemoveMediaOutput,
	companyListWebhooks: CompanyListWebhooksOutput,
	companyCreateWebhook: CompanyWebhookSecretOutput,
	companyUpdateWebhook: CompanyUpdateWebhookOutput,
	companyDeleteWebhook: CompanyDeleteWebhookOutput,
	companyRegenerateWebhookSecret: CompanyWebhookSecretOutput,
} as const;

type ExtraKey = keyof typeof PubloraExtraInputSchemas;

export type PubloraExtraInputs = {
	[K in ExtraKey]: z.infer<(typeof PubloraExtraInputSchemas)[K]>;
};

export type PubloraExtraOutputs = {
	[K in ExtraKey]: z.infer<(typeof PubloraExtraOutputSchemas)[K]>;
};
