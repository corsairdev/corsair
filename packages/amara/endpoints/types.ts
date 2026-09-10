import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared response shapes (official Amara API — permissive where fields null)
// ─────────────────────────────────────────────────────────────────────────────

export const PaginationMetaSchema = z
	.object({
		previous: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
		offset: z.number().optional(),
		limit: z.number().optional(),
		total_count: z.number().optional(),
	})
	.loose();

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

const PaginationInput = {
	limit: z.number().int().positive().optional().describe('Page size'),
	offset: z.number().int().nonnegative().optional().describe('Result offset'),
};

export const VideoLanguageSummarySchema = z
	.object({
		code: z.string().optional(),
		name: z.string().optional(),
		published: z.boolean().optional(),
		dir: z.string().nullable().optional(),
		subtitles_uri: z.string().optional(),
		resource_uri: z.string().optional(),
	})
	.loose();

export const VideoSchema = z
	.object({
		id: z.string(),
		video_type: z.string().nullable().optional(),
		primary_audio_language_code: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		thumbnail: z.string().nullable().optional(),
		created: z.string().nullable().optional(),
		team: z.string().nullable().optional(),
		project: z.string().nullable().optional(),
		all_urls: z.array(z.string()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		languages: z.array(VideoLanguageSummarySchema).optional(),
		activity_uri: z.string().optional(),
		urls_uri: z.string().optional(),
		subtitle_languages_uri: z.string().optional(),
		resource_uri: z.string().optional(),
	})
	.loose();

export type Video = z.infer<typeof VideoSchema>;

export const VideoListResponseSchema = z
	.object({
		meta: PaginationMetaSchema.optional(),
		objects: z.array(VideoSchema).optional(),
	})
	.loose();

export type VideoListResponse = z.infer<typeof VideoListResponseSchema>;

export const VideoUrlSchema = z
	.object({
		created: z.string().nullable().optional(),
		url: z.string().optional(),
		primary: z.boolean().optional(),
		original: z.boolean().optional(),
		id: z.number().optional(),
		resource_uri: z.string().optional(),
		videoid: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
	})
	.loose();

export type VideoUrl = z.infer<typeof VideoUrlSchema>;

export const VideoUrlListResponseSchema = z
	.object({
		meta: PaginationMetaSchema.optional(),
		objects: z.array(VideoUrlSchema).optional(),
	})
	.loose();

export type VideoUrlListResponse = z.infer<typeof VideoUrlListResponseSchema>;

export const SubtitleVersionSchema = z
	.object({
		author: z
			.object({
				id: z.string().optional(),
				username: z.string().optional(),
				uri: z.string().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		published: z.boolean().optional(),
		version_number: z.number().optional(),
		created: z.string().nullable().optional(),
	})
	.loose();

export const SubtitleLanguageSchema = z
	.object({
		created: z.string().nullable().optional(),
		language_code: z.string().optional(),
		is_primary_audio_language: z.boolean().optional(),
		is_rtl: z.boolean().optional(),
		soft_limit_cpl: z.number().nullable().optional(),
		soft_limit_cps: z.number().nullable().optional(),
		soft_limit_lines: z.number().nullable().optional(),
		soft_limit_max_duration: z.number().nullable().optional(),
		soft_limit_min_duration: z.number().nullable().optional(),
		published: z.boolean().optional(),
		name: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		subtitle_count: z.number().optional(),
		subtitles_complete: z.boolean().optional(),
		versions: z.array(SubtitleVersionSchema).optional(),
		subtitles_uri: z.string().optional(),
		resource_uri: z.string().optional(),
	})
	.loose();

export type SubtitleLanguage = z.infer<typeof SubtitleLanguageSchema>;

export const SubtitleLanguageListResponseSchema = z
	.object({
		meta: PaginationMetaSchema.optional(),
		objects: z.array(SubtitleLanguageSchema).optional(),
	})
	.loose();

export type SubtitleLanguageListResponse = z.infer<
	typeof SubtitleLanguageListResponseSchema
>;

export const SubtitleCueSchema = z
	.object({
		start: z.number().optional(),
		end: z.number().optional(),
		text: z.string().optional(),
		meta: z.record(z.string(), z.unknown()).optional(),
		position: z.number().optional(),
	})
	.loose();

export const SubtitlesResourceSchema = z
	.object({
		version_number: z.number().nullable().optional(),
		sub_format: z.string().nullable().optional(),
		subtitles: z
			.union([z.array(SubtitleCueSchema), z.string()])
			.nullable()
			.optional(),
		author: z
			.object({
				id: z.string().optional(),
				username: z.string().optional(),
				uri: z.string().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		created: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		language: z
			.object({
				code: z.string().optional(),
				dir: z.string().nullable().optional(),
				name: z.string().optional(),
			})
			.loose()
			.optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		notes_uri: z.string().optional(),
		resource_uri: z.string().optional(),
		site_uri: z.string().optional(),
		title: z.string().nullable().optional(),
		video_description: z.string().nullable().optional(),
		video_title: z.string().nullable().optional(),
		actions_uri: z.string().optional(),
	})
	.loose();

export type SubtitlesResource = z.infer<typeof SubtitlesResourceSchema>;

export const SubtitleActionSchema = z
	.object({
		action: z.string(),
		label: z.string().optional(),
		complete: z.boolean().nullable().optional(),
	})
	.loose();

export const SubtitleActionsListSchema = z.array(SubtitleActionSchema);

export type SubtitleActionsList = z.infer<typeof SubtitleActionsListSchema>;

export const SubtitleNoteSchema = z
	.object({
		body: z.string().optional(),
		created: z.string().nullable().optional(),
		user: z
			.object({
				id: z.string().optional(),
				username: z.string().optional(),
				uri: z.string().optional(),
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();

export const SubtitleNotesListResponseSchema = z
	.object({
		meta: PaginationMetaSchema.optional(),
		objects: z.array(SubtitleNoteSchema).optional(),
	})
	.loose();

export type SubtitleNotesListResponse = z.infer<
	typeof SubtitleNotesListResponseSchema
>;

export const ActivityUserSchema = z
	.object({
		id: z.string().optional(),
		username: z.string().optional(),
		uri: z.string().optional(),
	})
	.loose();

export const ActivitySchema = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		type: z.union([z.number(), z.string()]).optional(),
		type_name: z.string().optional(),
		created: z.string().nullable().optional(),
		video: z.string().nullable().optional(),
		video_uri: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		language_url: z.string().nullable().optional(),
		// Live probes return a user object; legacy list responses may use a string id.
		user: z.union([ActivityUserSchema, z.string()]).nullable().optional(),
		comment: z.string().nullable().optional(),
		new_video_title: z.string().nullable().optional(),
		resource_uri: z.string().optional(),
	})
	.loose();

export type Activity = z.infer<typeof ActivitySchema>;

export const ActivityListResponseSchema = z
	.object({
		meta: PaginationMetaSchema.optional(),
		objects: z.array(ActivitySchema).optional(),
	})
	.loose();

export type ActivityListResponse = z.infer<typeof ActivityListResponseSchema>;

export const UserSchema = z
	.object({
		username: z.string().nullable().optional(),
		id: z.string().optional(),
		full_name: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		biography: z.string().nullable().optional(),
		homepage: z.string().nullable().optional(),
		avatar: z.string().nullable().optional(),
		languages: z.array(z.string()).optional(),
		num_videos: z.number().optional(),
		resource_uri: z.string().optional(),
		created_by: z.string().nullable().optional(),
		is_partner: z.boolean().optional(),
		activity_uri: z.string().optional(),
	})
	.loose();

export type User = z.infer<typeof UserSchema>;

export const TeamSchema = z
	.object({
		name: z.string().optional(),
		slug: z.string().optional(),
		type: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		team_visibility: z.string().nullable().optional(),
		video_visibility: z.string().nullable().optional(),
		is_visible: z.boolean().optional(),
		membership_policy: z.string().nullable().optional(),
		video_policy: z.string().nullable().optional(),
		activity_uri: z.string().optional(),
		members_uri: z.string().optional(),
		projects_uri: z.string().optional(),
		applications_uri: z.string().nullable().optional(),
		languages_uri: z.string().nullable().optional(),
		tasks_uri: z.string().nullable().optional(),
		resource_uri: z.string().optional(),
	})
	.loose();

export type Team = z.infer<typeof TeamSchema>;

export const TeamListResponseSchema = z
	.object({
		meta: PaginationMetaSchema.optional(),
		objects: z.array(TeamSchema).optional(),
	})
	.loose();

export type TeamListResponse = z.infer<typeof TeamListResponseSchema>;

export const TeamLanguagesSchema = z
	.object({
		preferred: z.string().optional(),
		blacklisted: z.string().optional(),
	})
	.loose();

export type TeamLanguages = z.infer<typeof TeamLanguagesSchema>;

export const LanguagesListResponseSchema = z
	.object({
		languages: z.record(z.string(), z.string()),
	})
	.loose();

export type LanguagesListResponse = z.infer<typeof LanguagesListResponseSchema>;

/** Empty DELETE / action responses normalised by the client to `{ ok: true }`. */
export const EmptyOkSchema = z
	.object({
		ok: z.literal(true).optional(),
	})
	.loose();

export type EmptyOk = z.infer<typeof EmptyOkSchema>;

export const MessageSendResponseSchema = z.object({}).loose();

export type MessageSendResponse = z.infer<typeof MessageSendResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Videos — inputs
// ─────────────────────────────────────────────────────────────────────────────

export const VideosListInputSchema = z.object({
	sort: z.string().optional().describe('List ordering (mapped to order_by)'),
	team: z.string().optional(),
	limit: PaginationInput.limit,
	owner: z.string().optional(),
	offset: PaginationInput.offset,
	archive: z.union([z.string(), z.boolean()]).optional(),
	project: z.string().optional(),
	language: z.string().optional(),
	video_id: z.string().optional(),
	video_url: z.string().optional(),
});
export type VideosListInput = z.infer<typeof VideosListInputSchema>;

export const VideosViewDetailsInputSchema = z.object({
	video_id: z.string().min(1),
});
export type VideosViewDetailsInput = z.infer<
	typeof VideosViewDetailsInputSchema
>;

export const VideosCreateInputSchema = z.object({
	video_url: z.string().min(1),
	title: z.string().min(1),
	team: z.string().optional(),
	project: z.string().optional(),
	duration: z.number().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	thumbnail: z.string().optional(),
	description: z.string().optional(),
	primary_audio_language_code: z.string().optional(),
});
export type VideosCreateInput = z.infer<typeof VideosCreateInputSchema>;

export const VideosUpdateInputSchema = z.object({
	video_id: z.string().min(1),
	title: z.string().optional(),
	description: z.string().optional(),
	duration: z.number().optional(),
	team: z.string().nullable().optional(),
	project: z.string().nullable().optional(),
	thumbnail: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	primary_audio_language_code: z.string().optional(),
});
export type VideosUpdateInput = z.infer<typeof VideosUpdateInputSchema>;

export const VideosListActivityInputSchema = z.object({
	video_id: z.string().min(1),
	...PaginationInput,
});
export type VideosListActivityInput = z.infer<
	typeof VideosListActivityInputSchema
>;

export const VideosListUrlsInputSchema = z.object({
	video_id: z.string().min(1),
	...PaginationInput,
});
export type VideosListUrlsInput = z.infer<typeof VideosListUrlsInputSchema>;

export const VideosAddUrlInputSchema = z.object({
	video_id: z.string().min(1),
	url: z.string().min(1),
	primary: z.boolean().optional(),
});
export type VideosAddUrlInput = z.infer<typeof VideosAddUrlInputSchema>;

export const VideosGetUrlInputSchema = z.object({
	video_id: z.string().min(1),
	url_id: z.union([z.string(), z.number()]),
});
export type VideosGetUrlInput = z.infer<typeof VideosGetUrlInputSchema>;

export const VideosDeleteUrlInputSchema = VideosGetUrlInputSchema;
export type VideosDeleteUrlInput = z.infer<typeof VideosDeleteUrlInputSchema>;

export const VideosMakeUrlPrimaryInputSchema = z.object({
	video_id: z.string().min(1),
	url_id: z.union([z.string(), z.number()]),
	primary: z.boolean(),
});
export type VideosMakeUrlPrimaryInput = z.infer<
	typeof VideosMakeUrlPrimaryInputSchema
>;

export const VideosGetUrlDetailsInputSchema = z.object({
	url: z.string().min(1).describe('Public video URL to look up'),
});
export type VideosGetUrlDetailsInput = z.infer<
	typeof VideosGetUrlDetailsInputSchema
>;

export const VideosListSubtitleLanguagesInputSchema = z.object({
	video_id: z.string().min(1),
	...PaginationInput,
});
export type VideosListSubtitleLanguagesInput = z.infer<
	typeof VideosListSubtitleLanguagesInputSchema
>;

export const VideosGetSubtitleLanguageDetailsInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
});
export type VideosGetSubtitleLanguageDetailsInput = z.infer<
	typeof VideosGetSubtitleLanguageDetailsInputSchema
>;

export const VideosCreateSubtitleLanguageInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
	is_primary_audio_language: z.boolean().optional(),
	soft_limit_cpl: z.number().nullable().optional(),
	soft_limit_cps: z.number().nullable().optional(),
	soft_limit_lines: z.number().nullable().optional(),
	soft_limit_max_duration: z.number().nullable().optional(),
	soft_limit_min_duration: z.number().nullable().optional(),
	subtitles_complete: z.boolean().optional(),
});
export type VideosCreateSubtitleLanguageInput = z.infer<
	typeof VideosCreateSubtitleLanguageInputSchema
>;

export const VideosUpdateSubtitleLanguageInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
	is_primary_audio_language: z.boolean().optional(),
	soft_limit_cpl: z.number().nullable().optional(),
	soft_limit_cps: z.number().nullable().optional(),
	soft_limit_lines: z.number().nullable().optional(),
	soft_limit_max_duration: z.number().nullable().optional(),
	soft_limit_min_duration: z.number().nullable().optional(),
	subtitles_complete: z.boolean().optional(),
});
export type VideosUpdateSubtitleLanguageInput = z.infer<
	typeof VideosUpdateSubtitleLanguageInputSchema
>;

export const VideosFetchSubtitlesDataInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
	format: z.string().optional().describe('Subtitle format (default json)'),
	sub_format: z.string().optional().describe('Alias for format'),
});
export type VideosFetchSubtitlesDataInput = z.infer<
	typeof VideosFetchSubtitlesDataInputSchema
>;

export const VideosCreateSubtitlesInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
	title: z.string().optional(),
	action: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	subtitles: z.union([z.string(), z.array(z.unknown())]).optional(),
	sub_format: z.string().optional(),
	description: z.string().optional(),
	subtitles_url: z.string().optional(),
});
export type VideosCreateSubtitlesInput = z.infer<
	typeof VideosCreateSubtitlesInputSchema
>;

export const VideosListSubtitleActionsInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
});
export type VideosListSubtitleActionsInput = z.infer<
	typeof VideosListSubtitleActionsInputSchema
>;

export const VideosPerformSubtitleActionInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
	action: z.string().min(1),
});
export type VideosPerformSubtitleActionInput = z.infer<
	typeof VideosPerformSubtitleActionInputSchema
>;

export const VideosListSubtitleNotesInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
	...PaginationInput,
});
export type VideosListSubtitleNotesInput = z.infer<
	typeof VideosListSubtitleNotesInputSchema
>;

export const VideosAddSubtitleNoteInputSchema = z.object({
	video_id: z.string().min(1),
	language_code: z.string().min(1),
	body: z.string().min(1),
});
export type VideosAddSubtitleNoteInput = z.infer<
	typeof VideosAddSubtitleNoteInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Users / teams / activity / languages / messages
// ─────────────────────────────────────────────────────────────────────────────

export const UsersGetDataInputSchema = z.object({
	identifier: z.string().min(1).describe('Username, id$…, or "me"'),
});
export type UsersGetDataInput = z.infer<typeof UsersGetDataInputSchema>;

export const UsersGetActivityInputSchema = z.object({
	identifier: z.string().min(1),
	...PaginationInput,
});
export type UsersGetActivityInput = z.infer<typeof UsersGetActivityInputSchema>;

export const TeamsListInputSchema = z.object({
	...PaginationInput,
});
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

export const TeamsGetDetailsInputSchema = z.object({
	slug: z.string().min(1),
});
export type TeamsGetDetailsInput = z.infer<typeof TeamsGetDetailsInputSchema>;

export const TeamsGetLanguagesInputSchema = z.object({
	slug: z.string().min(1),
});
export type TeamsGetLanguagesInput = z.infer<
	typeof TeamsGetLanguagesInputSchema
>;

export const ActivityListInputSchema = z.object({
	team: z.string().optional(),
	type: z.union([z.string(), z.number()]).optional(),
	after: z.string().optional(),
	limit: PaginationInput.limit,
	video: z.string().optional(),
	before: z.string().optional(),
	offset: PaginationInput.offset,
	language: z.string().optional(),
	team_activity: z.union([z.string(), z.boolean()]).optional(),
});
export type ActivityListInput = z.infer<typeof ActivityListInputSchema>;

export const ActivityGetInputSchema = z.object({
	activity_id: z.union([z.string(), z.number()]),
});
export type ActivityGetInput = z.infer<typeof ActivityGetInputSchema>;

export const LanguagesListAvailableInputSchema = z.object({});
export type LanguagesListAvailableInput = z.infer<
	typeof LanguagesListAvailableInputSchema
>;

export const MessagesSendInputSchema = z
	.object({
		subject: z.string().min(1),
		content: z.string().min(1),
		user: z.string().optional(),
		team: z.string().optional(),
	})
	.refine((v) => (v.user !== undefined) !== (v.team !== undefined), {
		message: 'Provide exactly one of user or team',
	});
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint input/output maps
// ─────────────────────────────────────────────────────────────────────────────

export type AmaraEndpointInputs = {
	videosList: VideosListInput;
	videosViewDetails: VideosViewDetailsInput;
	videosCreate: VideosCreateInput;
	videosUpdate: VideosUpdateInput;
	videosListActivity: VideosListActivityInput;
	videosListUrls: VideosListUrlsInput;
	videosAddUrl: VideosAddUrlInput;
	videosGetUrl: VideosGetUrlInput;
	videosDeleteUrl: VideosDeleteUrlInput;
	videosMakeUrlPrimary: VideosMakeUrlPrimaryInput;
	videosGetUrlDetails: VideosGetUrlDetailsInput;
	videosListSubtitleLanguages: VideosListSubtitleLanguagesInput;
	videosGetSubtitleLanguageDetails: VideosGetSubtitleLanguageDetailsInput;
	videosCreateSubtitleLanguage: VideosCreateSubtitleLanguageInput;
	videosUpdateSubtitleLanguage: VideosUpdateSubtitleLanguageInput;
	videosFetchSubtitlesData: VideosFetchSubtitlesDataInput;
	videosCreateSubtitles: VideosCreateSubtitlesInput;
	videosListSubtitleActions: VideosListSubtitleActionsInput;
	videosPerformSubtitleAction: VideosPerformSubtitleActionInput;
	videosListSubtitleNotes: VideosListSubtitleNotesInput;
	videosAddSubtitleNote: VideosAddSubtitleNoteInput;
	usersGetData: UsersGetDataInput;
	usersGetActivity: UsersGetActivityInput;
	teamsList: TeamsListInput;
	teamsGetDetails: TeamsGetDetailsInput;
	teamsGetLanguages: TeamsGetLanguagesInput;
	activityList: ActivityListInput;
	activityGet: ActivityGetInput;
	languagesListAvailable: LanguagesListAvailableInput;
	messagesSend: MessagesSendInput;
};

export type AmaraEndpointOutputs = {
	videosList: VideoListResponse;
	videosViewDetails: Video;
	videosCreate: Video;
	videosUpdate: Video;
	videosListActivity: ActivityListResponse;
	videosListUrls: VideoUrlListResponse;
	videosAddUrl: VideoUrl;
	videosGetUrl: VideoUrl;
	videosDeleteUrl: EmptyOk;
	videosMakeUrlPrimary: VideoUrl;
	videosGetUrlDetails: VideoListResponse;
	videosListSubtitleLanguages: SubtitleLanguageListResponse;
	videosGetSubtitleLanguageDetails: SubtitleLanguage;
	videosCreateSubtitleLanguage: SubtitleLanguage;
	videosUpdateSubtitleLanguage: SubtitleLanguage;
	videosFetchSubtitlesData: SubtitlesResource;
	videosCreateSubtitles: SubtitlesResource;
	videosListSubtitleActions: SubtitleActionsList;
	videosPerformSubtitleAction: EmptyOk;
	videosListSubtitleNotes: SubtitleNotesListResponse;
	videosAddSubtitleNote: z.infer<typeof SubtitleNoteSchema>;
	usersGetData: User;
	usersGetActivity: ActivityListResponse;
	teamsList: TeamListResponse;
	teamsGetDetails: Team;
	teamsGetLanguages: TeamLanguages;
	activityList: ActivityListResponse;
	activityGet: Activity;
	languagesListAvailable: LanguagesListResponse;
	messagesSend: MessageSendResponse;
};

export const AmaraEndpointInputSchemas = {
	videosList: VideosListInputSchema,
	videosViewDetails: VideosViewDetailsInputSchema,
	videosCreate: VideosCreateInputSchema,
	videosUpdate: VideosUpdateInputSchema,
	videosListActivity: VideosListActivityInputSchema,
	videosListUrls: VideosListUrlsInputSchema,
	videosAddUrl: VideosAddUrlInputSchema,
	videosGetUrl: VideosGetUrlInputSchema,
	videosDeleteUrl: VideosDeleteUrlInputSchema,
	videosMakeUrlPrimary: VideosMakeUrlPrimaryInputSchema,
	videosGetUrlDetails: VideosGetUrlDetailsInputSchema,
	videosListSubtitleLanguages: VideosListSubtitleLanguagesInputSchema,
	videosGetSubtitleLanguageDetails: VideosGetSubtitleLanguageDetailsInputSchema,
	videosCreateSubtitleLanguage: VideosCreateSubtitleLanguageInputSchema,
	videosUpdateSubtitleLanguage: VideosUpdateSubtitleLanguageInputSchema,
	videosFetchSubtitlesData: VideosFetchSubtitlesDataInputSchema,
	videosCreateSubtitles: VideosCreateSubtitlesInputSchema,
	videosListSubtitleActions: VideosListSubtitleActionsInputSchema,
	videosPerformSubtitleAction: VideosPerformSubtitleActionInputSchema,
	videosListSubtitleNotes: VideosListSubtitleNotesInputSchema,
	videosAddSubtitleNote: VideosAddSubtitleNoteInputSchema,
	usersGetData: UsersGetDataInputSchema,
	usersGetActivity: UsersGetActivityInputSchema,
	teamsList: TeamsListInputSchema,
	teamsGetDetails: TeamsGetDetailsInputSchema,
	teamsGetLanguages: TeamsGetLanguagesInputSchema,
	activityList: ActivityListInputSchema,
	activityGet: ActivityGetInputSchema,
	languagesListAvailable: LanguagesListAvailableInputSchema,
	messagesSend: MessagesSendInputSchema,
} as const;

export const AmaraEndpointOutputSchemas = {
	videosList: VideoListResponseSchema,
	videosViewDetails: VideoSchema,
	videosCreate: VideoSchema,
	videosUpdate: VideoSchema,
	videosListActivity: ActivityListResponseSchema,
	videosListUrls: VideoUrlListResponseSchema,
	videosAddUrl: VideoUrlSchema,
	videosGetUrl: VideoUrlSchema,
	videosDeleteUrl: EmptyOkSchema,
	videosMakeUrlPrimary: VideoUrlSchema,
	videosGetUrlDetails: VideoListResponseSchema,
	videosListSubtitleLanguages: SubtitleLanguageListResponseSchema,
	videosGetSubtitleLanguageDetails: SubtitleLanguageSchema,
	videosCreateSubtitleLanguage: SubtitleLanguageSchema,
	videosUpdateSubtitleLanguage: SubtitleLanguageSchema,
	videosFetchSubtitlesData: SubtitlesResourceSchema,
	videosCreateSubtitles: SubtitlesResourceSchema,
	videosListSubtitleActions: SubtitleActionsListSchema,
	videosPerformSubtitleAction: EmptyOkSchema,
	videosListSubtitleNotes: SubtitleNotesListResponseSchema,
	videosAddSubtitleNote: SubtitleNoteSchema,
	usersGetData: UserSchema,
	usersGetActivity: ActivityListResponseSchema,
	teamsList: TeamListResponseSchema,
	teamsGetDetails: TeamSchema,
	teamsGetLanguages: TeamLanguagesSchema,
	activityList: ActivityListResponseSchema,
	activityGet: ActivitySchema,
	languagesListAvailable: LanguagesListResponseSchema,
	messagesSend: MessageSendResponseSchema,
} as const;
