import { z } from 'zod';

// Inputs use linkhut's own parameter names. Outputs are `.loose()` and their
// optional fields `.nullish()`, so a field linkhut adds or leaves out cannot
// fail a call that has already happened. Field reference:
// https://docs.linkhut.org

const TIMESTAMP_FORMAT =
	'UTC time as CCYY-MM-DDThh:mm:ssZ, for example 1984-09-01T14:21:31Z';

export const LinkhutTimestampSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, TIMESTAMP_FORMAT)
	.describe(TIMESTAMP_FORMAT);

export const LinkhutYesNoSchema = z.enum(['yes', 'no']);

export const LinkhutPostSchema = z
	.object({
		description: z.string(),
		extended: z.string(),
		// MD5 of the url (checked live on ln.ht, 11-26), the same value as
		// posts.allHashes `url`. Kept a plain string.
		hash: z.string(),
		href: z.string(),
		// MD5 of the bookmark's update time with `meta: 'yes'`; null without it.
		// posts.recent always sends it.
		meta: z.string().nullish(),
		others: z
			.number()
			.int()
			.nullish()
			.describe('How many other users saved the same url.'),
		shared: LinkhutYesNoSchema,
		tags: z.string(),
		time: z.string(),
		toread: LinkhutYesNoSchema,
	})
	.loose();

export const LinkhutResultCodeSchema = z
	.object({ result_code: z.literal('done') })
	.loose();

// ── posts.lastUpdated ─────────────────────────────────────────────────────

const PostsLastUpdatedInputSchema = z.object({});

export type PostsLastUpdatedInput = z.input<typeof PostsLastUpdatedInputSchema>;

const PostsLastUpdatedResponseSchema = z
	.object({
		update_time: z
			.string()
			.nullish()
			.describe(
				'Time of the last bookmark added or changed, UTC. 1970-01-01T00:00:00Z for an account with no bookmarks.',
			),
	})
	.loose();

export type PostsLastUpdatedResponse = z.infer<
	typeof PostsLastUpdatedResponseSchema
>;

// ── posts.add ─────────────────────────────────────────────────────────────

const PostsAddInputSchema = z.object({
	url: z.string().url().describe('The bookmark URL.'),
	description: z.string().describe('The bookmark title.'),
	extended: z.string().optional().describe('Notes for the bookmark.'),
	tags: z
		.array(z.string().trim().min(1))
		.optional()
		.describe(
			'Sent comma delimited, as the API asks. A post in a response lists its tags space delimited.',
		),
	dt: LinkhutTimestampSchema.optional().describe(
		'The creation time to record for the bookmark.',
	),
	replace: LinkhutYesNoSchema.optional().describe(
		"'yes' updates the bookmark already saved for this url and fails when there is none; every field is rewritten, so an omitted `extended` or `tags` becomes empty, `shared` becomes yes and `toread` no, and `dt` is ignored. Omitted or 'no', a new bookmark is created and the call fails when the url is already saved.",
	),
	shared: LinkhutYesNoSchema.optional().describe(
		"'no' makes the bookmark private. Omitted counts as 'yes' (public).",
	),
	toread: LinkhutYesNoSchema.optional().describe(
		"'yes' marks the bookmark as unread. Omitted counts as 'no'.",
	),
});

export type PostsAddInput = z.input<typeof PostsAddInputSchema>;

export type PostsAddResponse = z.infer<typeof LinkhutResultCodeSchema>;

// ── posts.delete ──────────────────────────────────────────────────────────

const PostsDeleteInputSchema = z.object({
	url: z.string().url().describe('The URL of the bookmark to delete.'),
});

export type PostsDeleteInput = z.input<typeof PostsDeleteInputSchema>;

export type PostsDeleteResponse = z.infer<typeof LinkhutResultCodeSchema>;

// ── posts.get ─────────────────────────────────────────────────────────────

const PostsGetInputSchema = z.object({
	tag: z
		.string()
		.optional()
		.describe(
			'One tag, or several separated by spaces or commas. Without `dt`, `url` or `hashes`, a tag searches every day.',
		),
	dt: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/,
			'A UTC day as CCYY-MM-DD, or a CCYY-MM-DDThh:mm:ssZ time on that day',
		)
		.optional()
		.describe(
			'The day to list, CCYY-MM-DD (a full CCYY-MM-DDThh:mm:ssZ time is cut to its day; linkhut reads only a day). With no argument at all, the most recent day that has a bookmark.',
		),
	url: z.string().url().optional().describe('The one bookmark to look up.'),
	hashes: z
		.array(z.string().regex(/^[0-9a-f]{32}$/))
		.min(1)
		.optional()
		.describe(
			'URL MD5 values. Several are joined with a space on the wire, which is what the `+` in the docs decodes to.',
		),
	meta: z
		.literal('yes')
		.optional()
		.describe(
			"Set to 'yes' to add the change-detection signature to each post.",
		),
});

export type PostsGetInput = z.input<typeof PostsGetInputSchema>;

const PostsGetResponseSchema = z
	.object({
		posts: z.array(LinkhutPostSchema).describe('The posts of one day.'),
	})
	.loose();

export type PostsGetResponse = z.infer<typeof PostsGetResponseSchema>;

// ── posts.recent ──────────────────────────────────────────────────────────

const PostsRecentInputSchema = z.object({
	tag: z.string().optional().describe('Only posts with this tag.'),
	count: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe(
			'How many posts to return. Default 15, maximum 100. Omitted, no count is sent and the default applies.',
		),
});

export type PostsRecentInput = z.input<typeof PostsRecentInputSchema>;

const PostsRecentResponseSchema = z
	.object({
		posts: z
			.array(LinkhutPostSchema)
			.describe(
				'The most recent posts. There is no offset, so this is the first page only.',
			),
	})
	.loose();

export type PostsRecentResponse = z.infer<typeof PostsRecentResponseSchema>;

// ── posts.dates ───────────────────────────────────────────────────────────

const PostsDatesInputSchema = z.object({
	tag: z.string().optional().describe('Only count posts with this tag.'),
});

export type PostsDatesInput = z.input<typeof PostsDatesInputSchema>;

const PostsDatesResponseSchema = z
	.object({
		dates: z
			.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.number().int())
			.describe('Number of posts saved per day, UTC.'),
	})
	.loose();

export type PostsDatesResponse = z.infer<typeof PostsDatesResponseSchema>;

// ── posts.all ─────────────────────────────────────────────────────────────

const PostsAllInputSchema = z.object({
	tag: z.string().optional().describe('Only posts with this tag.'),
	start: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Offset of the first post to return. Omitted counts as 0.'),
	results: z
		.number()
		.int()
		.min(1)
		.max(100000)
		.optional()
		.describe(
			'Page size. The API allows up to 100000 and answers 1000 when this is omitted, so 1000 is sent whenever it is unset.',
		),
	fromdt: LinkhutTimestampSchema.optional().describe(
		'Only posts saved at this time or later.',
	),
	todt: LinkhutTimestampSchema.optional().describe(
		'Only posts saved at this time or earlier.',
	),
	meta: z
		.literal('yes')
		.optional()
		.describe(
			"Set to 'yes' to add the change-detection signature to each post.",
		),
});

export type PostsAllInput = z.input<typeof PostsAllInputSchema>;

const PostsAllResponseSchema = z
	.object({
		posts: z.array(LinkhutPostSchema),
		start: z.number().int().describe('The offset this page was read from.'),
		results: z.number().int().describe('The page size that was requested.'),
		nextStart: z
			.number()
			.int()
			.nullish()
			.describe(
				'Offset of the next page while this one is full; null on the last page.',
			),
	})
	.loose();

export type PostsAllResponse = z.infer<typeof PostsAllResponseSchema>;

// ── posts.allHashes ───────────────────────────────────────────────────────

const PostsAllHashesInputSchema = z.object({});

export type PostsAllHashesInput = z.input<typeof PostsAllHashesInputSchema>;

export const LinkhutPostHashSchema = z
	.object({
		url: z.string().describe('MD5 of the bookmark url (the post `hash`).'),
		meta: z
			.string()
			.describe(
				"MD5 of the bookmark's update time; it changes when the bookmark changes.",
			),
	})
	.loose();

const PostsAllHashesResponseSchema = z
	.object({
		hashes: z
			.array(LinkhutPostHashSchema)
			.describe('One entry per bookmark, newest first.'),
	})
	.loose();

export type PostsAllHashesResponse = z.infer<
	typeof PostsAllHashesResponseSchema
>;

// ── posts.suggest ─────────────────────────────────────────────────────────

const PostsSuggestInputSchema = z.object({
	url: z.string().url().describe('The URL to suggest tags for.'),
});

export type PostsSuggestInput = z.input<typeof PostsSuggestInputSchema>;

const PostsSuggestResponseSchema = z
	.object({
		popular: z.array(z.string()).describe('Tags many bookmarks share.'),
		recommended: z.array(z.string()).describe('Tags linkhut recommends.'),
	})
	.loose();

export type PostsSuggestResponse = z.infer<typeof PostsSuggestResponseSchema>;

// ── tags.get ──────────────────────────────────────────────────────────────

const TagsGetInputSchema = z.object({});

export type TagsGetInput = z.input<typeof TagsGetInputSchema>;

const TagsGetResponseSchema = z
	.record(z.string(), z.number().int())
	.describe('Tag name to number of bookmarks that carry it.');

export type TagsGetResponse = z.infer<typeof TagsGetResponseSchema>;

// ── tags.delete ───────────────────────────────────────────────────────────

const TagsDeleteInputSchema = z.object({
	tag: z.string().min(1).describe('The tag to delete from every bookmark.'),
});

export type TagsDeleteInput = z.input<typeof TagsDeleteInputSchema>;

export type TagsDeleteResponse = z.infer<typeof LinkhutResultCodeSchema>;

// ── tags.rename ───────────────────────────────────────────────────────────

const TagsRenameInputSchema = z.object({
	old: z.string().min(1).describe('The tag to rename.'),
	new: z.string().min(1).describe('The name it takes on every bookmark.'),
});

export type TagsRenameInput = z.input<typeof TagsRenameInputSchema>;

export type TagsRenameResponse = z.infer<typeof LinkhutResultCodeSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type LinkhutEndpointInputs = {
	postsLastUpdated: PostsLastUpdatedInput;
	postsAdd: PostsAddInput;
	postsDelete: PostsDeleteInput;
	postsGet: PostsGetInput;
	postsRecent: PostsRecentInput;
	postsDates: PostsDatesInput;
	postsAll: PostsAllInput;
	postsAllHashes: PostsAllHashesInput;
	postsSuggest: PostsSuggestInput;
	tagsGet: TagsGetInput;
	tagsDelete: TagsDeleteInput;
	tagsRename: TagsRenameInput;
};

export type LinkhutEndpointOutputs = {
	postsLastUpdated: PostsLastUpdatedResponse;
	postsAdd: PostsAddResponse;
	postsDelete: PostsDeleteResponse;
	postsGet: PostsGetResponse;
	postsRecent: PostsRecentResponse;
	postsDates: PostsDatesResponse;
	postsAll: PostsAllResponse;
	postsAllHashes: PostsAllHashesResponse;
	postsSuggest: PostsSuggestResponse;
	tagsGet: TagsGetResponse;
	tagsDelete: TagsDeleteResponse;
	tagsRename: TagsRenameResponse;
};

export const LinkhutEndpointInputSchemas = {
	postsLastUpdated: PostsLastUpdatedInputSchema,
	postsAdd: PostsAddInputSchema,
	postsDelete: PostsDeleteInputSchema,
	postsGet: PostsGetInputSchema,
	postsRecent: PostsRecentInputSchema,
	postsDates: PostsDatesInputSchema,
	postsAll: PostsAllInputSchema,
	postsAllHashes: PostsAllHashesInputSchema,
	postsSuggest: PostsSuggestInputSchema,
	tagsGet: TagsGetInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	tagsRename: TagsRenameInputSchema,
} as const;

export const LinkhutEndpointOutputSchemas = {
	postsLastUpdated: PostsLastUpdatedResponseSchema,
	postsAdd: LinkhutResultCodeSchema,
	postsDelete: LinkhutResultCodeSchema,
	postsGet: PostsGetResponseSchema,
	postsRecent: PostsRecentResponseSchema,
	postsDates: PostsDatesResponseSchema,
	postsAll: PostsAllResponseSchema,
	postsAllHashes: PostsAllHashesResponseSchema,
	postsSuggest: PostsSuggestResponseSchema,
	tagsGet: TagsGetResponseSchema,
	tagsDelete: LinkhutResultCodeSchema,
	tagsRename: LinkhutResultCodeSchema,
} as const;
