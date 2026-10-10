import { z } from 'zod';

const PaginationInputSchema = z.object({
	length: z.number().int().positive().optional(),
	page: z.number().int().nonnegative().optional(),
});

const TimestampSchema = z.union([z.string(), z.number()]).nullish();

const TimestampOrFlagSchema = z
	.union([z.string(), z.number(), z.boolean()])
	.nullish();

export const ClientSchema = z.looseObject({
	clientIdentifier: z.string(),
	userCount: z.number().nullish(),
	metadata: z.unknown().optional(),
	created: TimestampSchema,
	updated: TimestampSchema,
});

export const UserSchema = z.looseObject({
	identifier: z.string().nullish(),
	clientIdentifier: z.string().nullish(),
	metadata: z.unknown().optional(),
	name: z.string().nullish(),
	avatar: z.string().nullish(),
	testMode: z.boolean().nullish(),
	created: TimestampSchema,
	updated: TimestampSchema,
});

export const CourseSchema = z.looseObject({
	id: z.number(),
	title: z.string().nullish(),
	description: z.string().nullish(),
	image: z.string().nullish(),
	imageAltText: z.string().nullish(),
	imageSource: z.number().nullish(),
	thumbnail: z.string().nullish(),
	thumbnailRevision: z.string().nullish(),
	thumbnailOutdated: z.boolean().nullish(),
	start: z.unknown().optional(),
	timeEstimateMinutes: z.number().nullish(),
	finish: z.unknown().optional(),
	theme: z.unknown().optional(),
	clientId: z.number().nullish(),
	active: z.boolean().nullish(),
	identified: z.boolean().nullish(),
	private: z.boolean().nullish(),
	paid: z.boolean().nullish(),
	domain: z.boolean().nullish(),
	price: z.number().nullish(),
	key: z.string().nullish(),
	source: z.string().nullish(),
	identifier: z.string().nullish(),
	clientIdentifier: z.string().nullish(),
	language: z.string().nullish(),
	revision: z.union([z.string(), z.number()]).nullish(),
	collabSeq: z.number().nullish(),
	published: TimestampOrFlagSchema,
	narrationsGenerated: TimestampSchema,
	narrationLanguage: z.string().nullish(),
	created: TimestampSchema,
	updated: TimestampSchema,
	type: z.string().nullish(),
	legacy: z.boolean().nullish(),
	documentFlow: z.string().nullish(),
	deleted: TimestampOrFlagSchema,
	folderId: z.number().nullish(),
	parentId: z.number().nullish(),
	themeId: z.number().nullish(),
	draftId: z.number().nullish(),
	startScreenId: z.number().nullish(),
	finishScreenId: z.number().nullish(),
	sequence: z.number().nullish(),
});

export const TrackingSchema = z.looseObject({
	id: z.number(),
	commenced: TimestampSchema,
	completed: TimestampSchema,
	feedback: z.string().nullish(),
	email: z.string().nullish(),
	identifier: z.string().nullish(),
	clientIdentifier: z.string().nullish(),
	passed: z.boolean().nullish(),
	score: z.number().nullish(),
	progress_percent: z.number().nullish(),
	total_time: z.number().nullish(),
	language: z.string().nullish(),
	scorm: z.boolean().nullish(),
	success: z.boolean().nullish(),
	score_percent: z.number().nullish(),
	last_activity: TimestampSchema,
	runtime_errors: z.number().nullish(),
	has_progress_signal: z.boolean().nullish(),
	progress_status: z.string().nullish(),
	attempt_count: z.number().nullish(),
});

export const CoassembleEndpointInputSchemas = {
	getClients: PaginationInputSchema,

	getCourses: PaginationInputSchema.extend({
		identifier: z.string().optional(),
		clientIdentifier: z.string().optional(),
		title: z.string().optional(),
		deleted: z.boolean().optional(),
	}),

	getTrackings: PaginationInputSchema.extend({
		id: z.number().int(),
		identifier: z.string().optional(),
		clientIdentifier: z.string().optional(),
		start: z.string().optional(),
		end: z.string().optional(),
	}),

	getUsers: PaginationInputSchema.extend({
		clientIdentifier: z.string().optional(),
	}),
} as const;

export const CoassembleEndpointOutputSchemas = {
	getClients: z.array(ClientSchema),
	getCourses: z.array(CourseSchema),
	getTrackings: z.array(TrackingSchema),
	getUsers: z.array(UserSchema),
} as const;

export type GetClientsInput = z.infer<
	typeof CoassembleEndpointInputSchemas.getClients
>;

export type GetClientsResponse = z.infer<
	typeof CoassembleEndpointOutputSchemas.getClients
>;

export type GetCoursesInput = z.infer<
	typeof CoassembleEndpointInputSchemas.getCourses
>;

export type GetCoursesResponse = z.infer<
	typeof CoassembleEndpointOutputSchemas.getCourses
>;

export type GetTrackingsInput = z.infer<
	typeof CoassembleEndpointInputSchemas.getTrackings
>;

export type GetTrackingsResponse = z.infer<
	typeof CoassembleEndpointOutputSchemas.getTrackings
>;

export type GetUsersInput = z.infer<
	typeof CoassembleEndpointInputSchemas.getUsers
>;

export type GetUsersResponse = z.infer<
	typeof CoassembleEndpointOutputSchemas.getUsers
>;

export type CoassembleEndpointInputs = {
	getClients: GetClientsInput;
	getCourses: GetCoursesInput;
	getTrackings: GetTrackingsInput;
	getUsers: GetUsersInput;
};

export type CoassembleEndpointOutputs = {
	getClients: GetClientsResponse;
	getCourses: GetCoursesResponse;
	getTrackings: GetTrackingsResponse;
	getUsers: GetUsersResponse;
};

export const {
	getClients: GetClientsInputSchema,
	getCourses: GetCoursesInputSchema,
	getTrackings: GetTrackingsInputSchema,
	getUsers: GetUsersInputSchema,
} = CoassembleEndpointInputSchemas;

export const {
	getClients: GetClientsResponseSchema,
	getCourses: GetCoursesResponseSchema,
	getTrackings: GetTrackingsResponseSchema,
	getUsers: GetUsersResponseSchema,
} = CoassembleEndpointOutputSchemas;
