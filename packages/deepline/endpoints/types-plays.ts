import { z } from 'zod';
import { PathSegmentSchema } from './types';

// Play lifecycle, editing, trigger and share-page contracts. Shapes follow the
// Deepline SDK (client-core.ts, types.ts, shared_libs/plays/*-contract.ts) and
// the live API as read on 2026-11-17. Outputs check the fields callers act on
// and keep any extra fields the API adds.

const PlayNameSchema = PathSegmentSchema.describe(
	'Play name, or prebuilt reference such as prebuilt/<name>, as returned by plays.list.',
);
const OwnedPlayNameSchema = PathSegmentSchema.describe(
	'Name of a Play owned by this workspace, as returned by plays.list. Prebuilt Plays are read-only.',
);
const RevisionIdSchema = z.string().trim().min(1);

// ——— Location (settings) ———

const PlayFolderSchema = z
	.string()
	.min(1)
	.max(128)
	.refine(
		(value) =>
			value === value.trim() &&
			value !== '.' &&
			value !== '..' &&
			!/[\\/\u0000-\u001f\u007f]/u.test(value),
		'Folder names must be trimmed, cannot be . or .., and cannot contain slashes or control characters.',
	);
export const PlayPathInputSchema = z
	.union([
		z.null(),
		z.strictObject({
			root: z
				.enum(['person', 'team'])
				.describe(
					"person is the creator's personal root; team is the shared Team library.",
				),
			folders: z
				.array(PlayFolderSchema)
				.max(16)
				.optional()
				.describe('Folder names below the root, outermost first.'),
		}),
	])
	.describe("Play location. null means the creator's personal root.");
const PlayPathSchema = z.union([
	z.null(),
	z.looseObject({
		root: z.enum(['person', 'team']),
		folders: z.array(z.string()).optional(),
	}),
]);

// ——— Cost ———

export const PlayCostEstimateSchema = z.union([
	z.looseObject({
		status: z.literal('available'),
		source: z.string(),
		unit: z.string(),
		lowCredits: z.number(),
		highCredits: z.number(),
		sampleRunCount: z.number(),
		basedOnRunId: z.string().nullish(),
		modelVersion: z.string(),
	}),
	z.looseObject({
		status: z.literal('unavailable'),
		reason: z.string(),
		message: z.string(),
		modelVersion: z.string().optional(),
	}),
]);
export const GetPlayCostInputSchema = z.strictObject({ name: PlayNameSchema });
export const GetPlayCostOutputSchema = z.looseObject({
	reference: z.string(),
	costEstimate: PlayCostEstimateSchema,
	observedCost: z.looseObject({ status: z.string() }).nullish(),
});

// ——— Location paths ———

export const ListPlayPathsInputSchema = z.strictObject({
	root: z
		.enum(['person', 'team'])
		.optional()
		.describe('Only list Plays under this root.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Plays to inspect on this page, 1-100.'),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe('cursor from the previous page.'),
});
export const ListPlayPathsOutputSchema = z.looseObject({
	paths: z.array(
		z.looseObject({
			path: PlayPathSchema,
			ownerUserId: z.string().nullish(),
			ownerName: z.string().nullish(),
			playName: z.string(),
		}),
	),
	cursor: z.string().nullable(),
	hasMore: z.boolean(),
	roots: z
		.array(z.looseObject({ value: z.string(), label: z.string() }))
		.optional(),
});

// ——— Pin, delete, restore, clear history ———

export const SetPlayPinnedInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
	pinned: z
		.boolean()
		.describe('true sorts the Play before unpinned Plays; false unpins it.'),
});
export const SetPlayPinnedOutputSchema = z.looseObject({
	name: z.string(),
	pinned: z.boolean(),
});

export const DeletePlayInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
});
export const DeletePlayOutputSchema = z.looseObject({
	archived: z.boolean(),
	alreadyArchived: z.boolean(),
	name: z.string(),
	archivedBindingCount: z.number(),
});

export const RestorePlayInputSchema = z.strictObject({
	name: OwnedPlayNameSchema.describe(
		'Name of a Play this workspace previously moved to Trash.',
	),
});
export const RestorePlayOutputSchema = z.looseObject({
	restored: z.boolean(),
	alreadyActive: z.boolean().optional(),
	name: z.string(),
});

export const ClearPlayHistoryInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
	tableNamespaces: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Dataset keys (ctx.dataset names) to clear. Omit to clear every sheet found for the Play.',
		),
});
export const ClearPlayHistoryOutputSchema = z.looseObject({
	playName: z.string(),
	deletedRuns: z.number(),
	droppedTables: z.array(z.string()),
});

// ——— Settings ———

export const GetPlaySettingsInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
});
export const PlaySettingsResultSchema = z.looseObject({
	playDefinitionId: z.string(),
	ownerUserId: z.string().nullish(),
	ownerName: z.string().nullish(),
	settings: z.looseObject({
		path: PlayPathSchema.optional(),
		displayName: z.string().nullish(),
	}),
});
export const GetPlaySettingsOutputSchema = PlaySettingsResultSchema;

export const UpdatePlaySettingsInputSchema = z
	.strictObject({
		name: OwnedPlayNameSchema,
		path: PlayPathInputSchema.optional().describe(
			"New location. null moves it to the creator's personal root. Omit to keep the current location.",
		),
		displayName: z
			.string()
			.trim()
			.max(256)
			.nullable()
			.optional()
			.describe(
				'Name shown in the UI. null or an empty string uses the name derived from the identifier. Omit to keep the current one.',
			),
	})
	.refine(
		(input) => input.path !== undefined || input.displayName !== undefined,
		'Supply at least one setting: path or displayName.',
	);
export const UpdatePlaySettingsOutputSchema = PlaySettingsResultSchema;

// ——— Versions ———

export const PlayRevisionSchema = z.looseObject({
	_id: z.string().optional(),
	version: z.number(),
	description: z.string().nullish(),
	createdAt: z.number().optional(),
	updatedAt: z.number().optional(),
	isLive: z.boolean().optional(),
	isWorking: z.boolean().optional(),
});
export const ListPlayVersionsInputSchema = z.strictObject({
	name: PlayNameSchema,
	full: z
		.boolean()
		.optional()
		.describe(
			'Include each revision’s source code and pipeline. Large; leave unset for summaries.',
		),
});
export const ListPlayVersionsOutputSchema = z.looseObject({
	versions: z.array(PlayRevisionSchema),
	playName: z.string().optional(),
	definitionName: z.string().optional(),
	revisionWindow: z
		.looseObject({ order: z.string(), complete: z.boolean() })
		.optional(),
});

export const PublishPlayVersionInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
	revisionId: RevisionIdSchema.optional().describe(
		'Revision _id from plays.versions.list to make live. Omit to make the current working revision live.',
	),
});
export const PublishPlayVersionOutputSchema = z.looseObject({
	success: z.boolean(),
	name: z.string(),
	liveVersion: z.number().nullish(),
});

// ——— Triggers (cron schedule and inbound webhook) ———

const SecretNameSchema = z
	.string()
	.regex(
		/^[A-Z][A-Z0-9_]{1,63}$/,
		'Secret names are uppercase letters, digits, and underscores, starting with a letter.',
	);
export const PlayCronTriggerInputSchema = z
	.strictObject({
		schedule: z
			.string()
			.trim()
			.min(1)
			.max(256)
			.describe('Standard 5-field cron expression, e.g. "0 9 * * 1-5".'),
		timezone: z
			.string()
			.trim()
			.min(1)
			.max(64)
			.optional()
			.describe('IANA timezone such as America/New_York. Omitted means UTC.'),
		input: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('Static JSON object passed as the input of every cron run.'),
	})
	.describe('Cron trigger: runs the Play on a schedule.');
export const PlayWebhookAuthInputSchema = z.discriminatedUnion('type', [
	z
		.strictObject({
			type: z
				.literal('standard-webhooks')
				.describe('Verify Standard Webhooks (or Svix) signatures.'),
			headerFamily: z
				.enum(['standard', 'svix'])
				.describe(
					'standard reads webhook-id/-timestamp/-signature headers; svix reads svix-* headers.',
				),
			signingSecrets: z
				.array(SecretNameSchema)
				.min(1)
				.max(4)
				.describe(
					'Names (not values) of 1-4 workspace secrets holding the signing secrets.',
				),
			toleranceSeconds: z
				.number()
				.int()
				.min(1)
				.max(3600)
				.optional()
				.describe('Allowed timestamp skew in seconds, 1-3600.'),
		})
		.describe('Standard Webhooks signature verification.'),
	z
		.strictObject({
			type: z.literal('hmac').describe('Verify an HMAC signature header.'),
			secretEnv: SecretNameSchema.describe(
				'Name (not value) of the workspace secret holding the HMAC key.',
			),
			header: z
				.string()
				.trim()
				.min(1)
				.max(128)
				.optional()
				.describe('Header that carries the signature.'),
			signaturePrefix: z
				.string()
				.max(64)
				.optional()
				.describe('Prefix before the signature value, such as sha256=.'),
		})
		.describe('HMAC signature verification.'),
]);
export const PlayWebhookTriggerInputSchema = z
	.strictObject({
		auth: PlayWebhookAuthInputSchema.nullable()
			.optional()
			.describe(
				'Signature verification. Omit or null for an unsigned webhook.',
			),
	})
	.describe('Inbound webhook trigger: an HTTP POST to its URL starts a run.');

export const PlayTriggerConfigViewSchema = z.looseObject({
	name: z.string(),
	playDefinitionId: z.string(),
	liveRevisionId: z.string().nullable(),
	liveVersion: z.number().nullable(),
	readOnly: z
		.looseObject({ reason: z.string(), message: z.string() })
		.nullable(),
	cron: z
		.looseObject({
			bindingId: z.string().nullable(),
			schedule: z.string(),
			timezone: z.string().nullish(),
			input: z.record(z.string(), z.unknown()).nullish(),
			status: z.string().nullish(),
			nextScheduledAt: z.number().nullish(),
			lastScheduledAt: z.number().nullish(),
		})
		.nullable(),
	webhook: z
		.looseObject({
			bindingId: z.string().nullable(),
			url: z.string().nullable(),
			status: z.string().nullish(),
			auth: z.looseObject({ type: z.string() }).nullish(),
		})
		.nullable(),
});
export const GetPlayTriggersInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
});
export const GetPlayTriggersOutputSchema = PlayTriggerConfigViewSchema;

export const UpdatePlayTriggersInputSchema = z
	.strictObject({
		name: OwnedPlayNameSchema,
		cron: PlayCronTriggerInputSchema.nullable()
			.optional()
			.describe('Desired cron trigger. null removes it; omit to keep it.'),
		webhook: PlayWebhookTriggerInputSchema.nullable()
			.optional()
			.describe('Desired webhook trigger. null removes it; omit to keep it.'),
		expectedRevisionId: RevisionIdSchema.optional().describe(
			'liveRevisionId from plays.triggers.get. The update is refused (409) if the live revision changed.',
		),
	})
	.refine(
		(input) => input.cron !== undefined || input.webhook !== undefined,
		'Provide cron and/or webhook. Use null to remove a trigger.',
	);
export const UpdatePlayTriggersOutputSchema = z.looseObject({
	changed: z.boolean(),
	revisionId: z.string().nullable(),
	version: z.number().nullable(),
	triggers: PlayTriggerConfigViewSchema,
});

export const ListPlayTriggerInventoryInputSchema = z.strictObject({
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe('continueCursor from the previous page.'),
});
export const ListPlayTriggerInventoryOutputSchema = z.looseObject({
	page: z.array(
		z.looseObject({
			bindingId: z.string(),
			name: z.string(),
			type: z.string(),
			status: z.string(),
			cron: z.string().nullish(),
			timezone: z.string().nullish(),
			nextScheduledAt: z.number().nullish(),
		}),
	),
	continueCursor: z.string(),
	isDone: z.boolean(),
});

export const GetPlayTriggerHistoryInputSchema = z.strictObject({
	bindingId: z
		.string()
		.min(1)
		.describe('Trigger bindingId from plays.triggers.inventory.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(30)
		.optional()
		.describe('Recent runs to return, 1-30.'),
});
export const GetPlayTriggerHistoryOutputSchema = z.looseObject({
	recentRuns: z.array(
		z.looseObject({
			workflowId: z.string(),
			runId: z.string().nullable(),
			status: z.string(),
			createdAt: z.number(),
			startedAt: z.number().nullish(),
			finishedAt: z.number().nullish(),
		}),
	),
	truncated: z.boolean(),
	cronInput: z.record(z.string(), z.unknown()).nullish(),
});

// ——— Public share page ———

const SeoIndexingSchema = z
	.enum(['index', 'noindex'])
	.describe('Whether search engines may index the public page.');
export const SharePageStatusSchema = z.looseObject({
	playName: z.string(),
	share: z
		.looseObject({
			shareSlug: z.string(),
			orgSlug: z.string(),
			publishedRevisionId: z.string(),
			publishedVersion: z.number(),
			visibility: z.string(),
			seoIndexing: z.string(),
			showAverageDeeplineCost: z.boolean().optional(),
			showAverageLatency: z.boolean().optional(),
			publicPath: z.string(),
			canonicalPath: z.string().optional(),
		})
		.nullable(),
	publishedCopy: z.unknown().optional(),
	revisions: z.array(
		z.looseObject({
			revisionId: z.string(),
			version: z.number(),
			isLive: z.boolean().optional(),
			isWorking: z.boolean().optional(),
			isPublished: z.boolean().optional(),
		}),
	),
	warning: z.string().nullish(),
});

export const GetSharePageInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
	revisionId: RevisionIdSchema.optional().describe(
		'Keep this revision in the returned revision picker even if it is older.',
	),
});
export const PublishSharePageInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
	revisionId: RevisionIdSchema.describe(
		'Revision to publish or repoint the public page to (from plays.share.get revisions).',
	),
	acknowledgedUnlisted: z
		.literal(true)
		.describe(
			'Must be true: confirms the page will be publicly viewable by anyone with the link.',
		),
	showAverageDeeplineCost: z
		.boolean()
		.optional()
		.describe('Show the average Deepline credit cost on the page.'),
	showAverageLatency: z
		.boolean()
		.optional()
		.describe('Show the average run latency on the page.'),
	seoIndexing: SeoIndexingSchema.optional(),
});
export const UpdateSharePageInputSchema = z
	.strictObject({
		name: OwnedPlayNameSchema,
		showAverageDeeplineCost: z
			.boolean()
			.optional()
			.describe('Show the average Deepline credit cost on the page.'),
		showAverageLatency: z
			.boolean()
			.optional()
			.describe('Show the average run latency on the page.'),
		seoIndexing: SeoIndexingSchema.optional(),
	})
	.refine(
		(input) =>
			input.showAverageDeeplineCost !== undefined ||
			input.showAverageLatency !== undefined ||
			input.seoIndexing !== undefined,
		'Supply at least one share setting.',
	);
export const UnpublishSharePageInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
});
export const RegenerateSharePageInputSchema = z.strictObject({
	name: OwnedPlayNameSchema,
	revisionId: RevisionIdSchema.optional().describe(
		'Revision whose page copy to regenerate. Omit for the published revision.',
	),
});
