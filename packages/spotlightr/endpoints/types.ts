import { z } from 'zod';

/**
 * Spotlightr's REST responses are barely documented: the reference page lists
 * the request parameters and gives no response body except the metrics one.
 * The schemas here are therefore built to accept what the routes plausibly
 * return without inventing fields:
 *
 * - the metrics route is typed from a real response, field for field;
 * - `api/videos` and `getViews` answer a Laravel page object (`total`,
 *   `current_page`, `last_page`, `data`, ...), checked live on 11-16; the
 *   other list routes return a bare array of objects. Records are `.loose()`
 *   so the fields Spotlightr sends pass through;
 * - a write returns a URL string, a bare id, an object or an empty body,
 *   which is typed as a union.
 *
 * Video ids are the numeric ids the API returns (`2051234`), not the base64
 * form in watch URLs (`MjA1MTIzNA==`): a base64 id matches no video.
 */

/** A numeric video id; numeric strings are accepted as well. */
const VideoId = z
	.union([z.number().int(), z.string().regex(/^\d+$/)])
	.describe(
		'Numeric video ID, as videos.list returns it (the base64 ID in a watch URL is its encoded form and is not accepted)',
	);

/** The paging fields Spotlightr's Laravel page objects carry. */
const pageFields = {
	total: z.number().nullish(),
	per_page: z.union([z.number(), z.string()]).nullish(),
	current_page: z.number().nullish(),
	last_page: z.number().nullish(),
	from: z.number().nullish(),
	to: z.number().nullish(),
	// The page URLs carry the request's vooKey; the client masks it.
	next_page_url: z.string().nullish(),
	prev_page_url: z.string().nullish(),
};

const Page = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page number, from 1; see last_page in the answer');

/** The one documented response body, copied from a live answer. */
const VideoMetricsSchema = z
	.object({
		loads: z.number(),
		watched: z.number(),
		plays: z.number(),
		playRate: z.number(),
		// Spotlightr's own spelling: "completition", not "completion".
		completitionRate: z.number(),
		shares: z.number(),
	})
	.loose();
export type VideoMetricsOutput = z.output<typeof VideoMetricsSchema>;

/** A video or project record. Spotlightr sends more fields than are listed. */
const VideoSchema = z
	.object({
		id: z.union([z.number(), z.string()]).nullish(),
		name: z.string().nullish(),
		videoGroup: z.union([z.number(), z.string()]).nullish(),
	})
	.loose();
export type VideoOutput = z.output<typeof VideoSchema>;

const GroupSchema = z
	.object({
		id: z.union([z.number(), z.string()]).nullish(),
		name: z.string().nullish(),
	})
	.loose();
export type GroupOutput = z.output<typeof GroupSchema>;

const ViewSchema = z
	.object({
		id: z.union([z.number(), z.string()]).nullish(),
		customViewerID: z.string().nullish(),
		percentWatched: z.number().nullish(),
	})
	.loose();
export type ViewOutput = z.output<typeof ViewSchema>;

/** `api/user/domain` answers bare strings (live, 11-16); objects are kept too. */
const DomainSchema = z.union([
	z.string(),
	z
		.object({
			domain: z.string().nullish(),
		})
		.loose(),
]);

const StudentSchema = z
	.object({
		email: z.string().nullish(),
		id: z.union([z.number(), z.string()]).nullish(),
	})
	.loose();

const AccessSchema = z
	.object({
		id: z.union([z.number(), z.string()]).nullish(),
		email: z.string().nullish(),
	})
	.loose();

/**
 * A write answer. `createVideo` documents exactly one thing: the response is the
 * new video's watch URL, as a bare string. Other writes answer an object, so
 * both shapes are accepted and nothing else is promised.
 */
const WriteResultSchema = z.union([
	z.string(),
	// projects.create answers the new project's id as a bare number.
	z.number(),
	z.object({}).loose(),
	z.array(z.object({}).loose()),
	// updateSettings answers an empty body.
	z.null(),
	z.undefined(),
]);
export type WriteResultOutput = z.output<typeof WriteResultSchema>;

const BoolFlagSchema = z
	.union([z.boolean(), z.number(), z.string()])
	.describe('Spotlightr accepts 1/0, true/false, or the strings');

// ---------------------------------------------------------------------------
// videos
// ---------------------------------------------------------------------------

const ListVideosInputSchema = z.object({
	video_id: VideoId.optional().describe('Only this video (numeric ID)'),
	video_group: z
		.number()
		.int()
		.optional()
		.describe('Only videos in this project'),
	page: Page,
});
export type ListVideosInput = z.input<typeof ListVideosInputSchema>;

/** `api/videos` answers `{ videos: { total, per_page: 1000, ..., data } }`. */
const VideosOutputSchema = z
	.object({
		videos: z.object({ ...pageFields, data: z.array(VideoSchema) }).loose(),
	})
	.loose();
export type VideosOutput = z.output<typeof VideosOutputSchema>;

const CreateVideoInputSchema = z
	.object({
		name: z.string().min(1).describe('Name of the video'),
		url: z
			.string()
			.optional()
			.describe(
				'Any hosted video link (YouTube, Vimeo, Drive); wins over `file`',
			),
		file: z
			.instanceof(Blob)
			.optional()
			.describe('Video file to upload, used when `url` is absent'),
		custom_s3: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('0, or the ID of a custom storage integration'),
		hls: z
			.boolean()
			.optional()
			.describe('Encode to HLS (true) or leave the source unsecured (false)'),
		video_group: z
			.number()
			.int()
			.optional()
			.describe('Project to file it under'),
		create: z
			.boolean()
			.optional()
			.describe('true confirms the write; false is a dry run'),
		player_settings: VideoId.optional().describe(
			"Another of your videos' numeric ID to copy player settings from",
		),
	})
	.superRefine((value, ctx) => {
		// The reference requires `URL` unless a file is sent.
		if (value.url === undefined && value.file === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass either `url` or `file`',
				path: ['url'],
			});
		}
	});
export type CreateVideoInput = z.input<typeof CreateVideoInputSchema>;

const CreateVideoOutputSchema = WriteResultSchema;

const VideoSourceInputSchema = z.object({
	video_id: VideoId.describe(
		'Numeric ID of the video whose source is replaced',
	),
	url: z.string().min(1).describe('New URL for the source'),
});
export type VideoSourceInput = z.input<typeof VideoSourceInputSchema>;

const DeleteVideoInputSchema = z.object({
	video_ids: z
		.array(z.union([z.number(), z.string()]))
		.min(1)
		.describe('IDs of the videos to delete'),
});
export type DeleteVideoInput = z.input<typeof DeleteVideoInputSchema>;

const TopVideosInputSchema = z.object({
	days: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Reporting window; default 30'),
	total: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many to return; default 3'),
});
export type TopVideosInput = z.input<typeof TopVideosInputSchema>;

const TopVideosOutputSchema = z.array(VideoSchema);

const MetricsInputSchema = z.object({
	video_id: VideoId,
});
export type MetricsInput = z.input<typeof MetricsInputSchema>;

const ViewsInputSchema = z.object({
	video_id: VideoId,
	custom_viewer_id: z
		.string()
		.optional()
		.describe('ID or email of a known viewer'),
	only_watched: z.boolean().optional().describe('Only views past 1% watched'),
	all_views: z.boolean().optional().describe('Skip pagination'),
	page: Page.describe('Page number, from 1; 30 views a page'),
});
export type ViewsInput = z.input<typeof ViewsInputSchema>;

/** `getViews` answers a page object with a `summary` beside the rows. */
const ViewsOutputSchema = z
	.object({
		...pageFields,
		data: z.array(ViewSchema),
		summary: z.object({ totalTime: z.number().nullish() }).loose().nullish(),
	})
	.loose();

const PlayerSettingsInputSchema = z.object({
	video_id: VideoId,
	settings: z
		.record(
			z.string(),
			z.union([z.string(), z.number(), z.boolean(), z.null()]),
		)
		.describe('Only the keys to change'),
});
export type PlayerSettingsInput = z.input<typeof PlayerSettingsInputSchema>;

// ---------------------------------------------------------------------------
// projects
// ---------------------------------------------------------------------------

const ListGroupsInputSchema = z.object({});
export type ListGroupsInput = z.input<typeof ListGroupsInputSchema>;

const GroupsOutputSchema = z.array(GroupSchema);

const CreateGroupInputSchema = z.object({
	name: z.string().min(1).describe('Name of the project'),
});
export type CreateGroupInput = z.input<typeof CreateGroupInputSchema>;

// ---------------------------------------------------------------------------
// domains
// ---------------------------------------------------------------------------

const ListDomainsInputSchema = z.object({});
export type ListDomainsInput = z.input<typeof ListDomainsInputSchema>;

const DomainsOutputSchema = z.array(DomainSchema);

const AddDomainInputSchema = z.object({
	domain: z.string().min(1).describe('Domain to allow, e.g. "example.com"'),
});
export type AddDomainInput = z.input<typeof AddDomainInputSchema>;

// ---------------------------------------------------------------------------
// students and access
// ---------------------------------------------------------------------------

const CreateStudentInputSchema = z.object({
	email: z.email().describe("Student's email address"),
	password: z.string().min(1).describe("Student's password"),
	course_id: z.number().int().describe('Course or gallery ID'),
	never: z.boolean().describe('true never expires; `expires` is then ignored'),
	unlocks: z.number().int().min(0).describe('0 for unlimited'),
	time: z.number().int().min(0).describe('0 for unlimited'),
	expires: z
		.union([z.iso.date(), z.literal('0000-00-00')])
		.describe(
			'YYYY-MM-DD, or the literal "0000-00-00" the reference uses when `never` is true',
		),
});
export type CreateStudentInput = z.input<typeof CreateStudentInputSchema>;

const GetAccessInputSchema = z.object({
	email: z.email(),
	course_id: z.number().int(),
});
export type GetAccessInput = z.input<typeof GetAccessInputSchema>;

const AccessOutputSchema = z.union([z.array(AccessSchema), AccessSchema]);

const UpdateAccessInputSchema = z.object({
	access_id: z.number().int().describe('Access record ID'),
	expire: z.boolean().describe('true expires the record now'),
});
export type UpdateAccessInput = z.input<typeof UpdateAccessInputSchema>;

const UpdateCodeInputSchema = z.object({
	code_id: z.number().int().describe('Gallery access code ID'),
	expires: z.boolean().describe('true expires the code now'),
});
export type UpdateCodeInput = z.input<typeof UpdateCodeInputSchema>;

// ---------------------------------------------------------------------------
// search and assets
// ---------------------------------------------------------------------------

const SearchInputSchema = z.object({
	query: z.string().min(1).describe('Text to search for across the account'),
});
export type SearchInput = z.input<typeof SearchInputSchema>;

const SearchOutputSchema = z.union([
	z.array(z.object({}).loose()),
	z.record(
		z.string(),
		z.union([z.array(z.object({}).loose()), z.number(), z.string()]),
	),
]);

const UploadAssetInputSchema = z.object({
	file: z.instanceof(Blob).describe('File to upload'),
});
export type UploadAssetInput = z.input<typeof UploadAssetInputSchema>;

export type SpotlightrEndpointInputs = {
	listVideos: ListVideosInput;
	createVideo: CreateVideoInput;
	updateVideoSource: VideoSourceInput;
	deleteVideos: DeleteVideoInput;
	listTopVideos: TopVideosInput;
	getVideoMetrics: MetricsInput;
	listViews: ViewsInput;
	updatePlayerSettings: PlayerSettingsInput;
	listGroups: ListGroupsInput;
	createGroup: CreateGroupInput;
	listDomains: ListDomainsInput;
	addDomain: AddDomainInput;
	createStudent: CreateStudentInput;
	getAccess: GetAccessInput;
	updateAccess: UpdateAccessInput;
	updateAccessCode: UpdateCodeInput;
	search: SearchInput;
	uploadAsset: UploadAssetInput;
};

export type SpotlightrEndpointOutputs = {
	listVideos: VideosOutput;
	createVideo: WriteResultOutput;
	updateVideoSource: WriteResultOutput;
	deleteVideos: WriteResultOutput;
	listTopVideos: z.output<typeof TopVideosOutputSchema>;
	getVideoMetrics: z.output<typeof VideoMetricsSchema>;
	listViews: z.output<typeof ViewsOutputSchema>;
	updatePlayerSettings: WriteResultOutput;
	listGroups: z.output<typeof GroupsOutputSchema>;
	createGroup: WriteResultOutput;
	listDomains: z.output<typeof DomainsOutputSchema>;
	addDomain: WriteResultOutput;
	createStudent: WriteResultOutput;
	getAccess: z.output<typeof AccessOutputSchema>;
	updateAccess: WriteResultOutput;
	updateAccessCode: WriteResultOutput;
	search: z.output<typeof SearchOutputSchema>;
	uploadAsset: WriteResultOutput;
};

export const SpotlightrEndpointInputSchemas = {
	listVideos: ListVideosInputSchema,
	createVideo: CreateVideoInputSchema,
	updateVideoSource: VideoSourceInputSchema,
	deleteVideos: DeleteVideoInputSchema,
	listTopVideos: TopVideosInputSchema,
	getVideoMetrics: MetricsInputSchema,
	listViews: ViewsInputSchema,
	updatePlayerSettings: PlayerSettingsInputSchema,
	listGroups: ListGroupsInputSchema,
	createGroup: CreateGroupInputSchema,
	listDomains: ListDomainsInputSchema,
	addDomain: AddDomainInputSchema,
	createStudent: CreateStudentInputSchema,
	getAccess: GetAccessInputSchema,
	updateAccess: UpdateAccessInputSchema,
	updateAccessCode: UpdateCodeInputSchema,
	search: SearchInputSchema,
	uploadAsset: UploadAssetInputSchema,
} as const;

export const SpotlightrEndpointOutputSchemas = {
	listVideos: VideosOutputSchema,
	createVideo: CreateVideoOutputSchema,
	updateVideoSource: WriteResultSchema,
	deleteVideos: WriteResultSchema,
	listTopVideos: TopVideosOutputSchema,
	getVideoMetrics: VideoMetricsSchema,
	listViews: ViewsOutputSchema,
	updatePlayerSettings: WriteResultSchema,
	listGroups: GroupsOutputSchema,
	createGroup: WriteResultSchema,
	listDomains: DomainsOutputSchema,
	addDomain: WriteResultSchema,
	createStudent: WriteResultSchema,
	getAccess: AccessOutputSchema,
	updateAccess: WriteResultSchema,
	updateAccessCode: WriteResultSchema,
	search: SearchOutputSchema,
	uploadAsset: WriteResultSchema,
} as const;
