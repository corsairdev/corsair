import { z } from 'zod';

// Inputs use the Transformations API's own parameter names. Outputs are
// `.loose()` and the documented optionals nullish, so a field RudderStack adds or
// omits cannot fail a call that has already happened. Every shape here comes from
// https://www.rudderstack.com/docs/api/transformation-api/
//
// Two things are worth knowing before reading the models:
//
// - The routes answer with different container keys: `/transformations` wraps its
//   rows in `transformations`, `/transformations/{id}/versions` in
//   `TransformationVersions` with a capital T, `/libraries` in `libraries`, and
//   `/libraries/{id}/versions` in `libraryVersions`. The models follow each route
//   rather than pretending they match.
// - Publishing is not a separate resource. `publish` is a query flag on create and
//   update, except for a specific older revision, which the Publish API handles.

const IdSchema = z.string().min(1);

/** The languages RudderStack accepts for transformation and library code. */
export const RUDDERSTACK_LANGUAGES = ['javascript', 'pythonfaas'] as const;

const LanguageSchema = z
	.enum(RUDDERSTACK_LANGUAGES)
	.describe(
		'javascript or pythonfaas. A resource cannot change language after it is created.',
	);

const JsonValueSchema: z.ZodType<
	string | number | boolean | null | unknown[] | { [key: string]: unknown }
> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

// ── transformations ───────────────────────────────────────────────────────

/** A destination a transformation is connected to. */
const ConnectedDestinationSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		enabled: z.boolean().nullish(),
	})
	.loose();

export const TransformationSchema = z
	.object({
		id: z.string().nullish(),
		versionId: z
			.string()
			.nullish()
			.describe('Identifies this revision; pass it to libraries.publish.'),
		name: z.string().nullish(),
		description: z.string().nullish(),
		code: z.string().nullish().describe('The JavaScript or Python code.'),
		codeVersion: z
			.string()
			.nullish()
			.describe('Always "1" for API calls, as RudderStack sends it.'),
		language: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		workspaceId: z
			.union([z.string(), JsonObjectSchema])
			.nullish()
			.describe('A string ID or a workspace object, depending on the route.'),
		destinations: z.array(ConnectedDestinationSchema).nullish(),
	})
	.loose();

export type RudderStackTransformation = z.infer<typeof TransformationSchema>;

const TransformationsListInputSchema = z.object({});

/** `GET /transformations` returns only the published transformations. */
const TransformationsListResponseSchema = z
	.object({
		transformations: z.array(TransformationSchema).nullish(),
	})
	.loose();

export type TransformationsListResponse = z.infer<
	typeof TransformationsListResponseSchema
>;

const TransformationCreateInputSchema = z.object({
	name: z.string().min(1).describe('The transformation name.'),
	language: LanguageSchema,
	description: z.string().optional(),
	code: z.string().optional().describe('The transformation code.'),
	publish: z
		.boolean()
		.optional()
		.describe(
			'True makes the code live for incoming traffic and allows destinations to be connected. Defaults to false, which only creates a revision.',
		),
	destinationIds: z
		.array(IdSchema)
		.optional()
		.describe('Destinations to connect. Ignored unless publish is true.'),
	events: z
		.array(JsonObjectSchema)
		.optional()
		.describe('JSON events to test the code against while creating it.'),
});

export type TransformationCreateInput = z.infer<
	typeof TransformationCreateInputSchema
>;

const TransformationCreateResponseSchema = TransformationSchema;

export type TransformationCreateResponse = z.infer<
	typeof TransformationCreateResponseSchema
>;

const TransformationGetInputSchema = z.object({
	id: IdSchema.describe('The published transformation ID.'),
});

const TransformationGetResponseSchema = TransformationSchema;

export type TransformationGetResponse = z.infer<
	typeof TransformationGetResponseSchema
>;

const TransformationUpdateInputSchema = z.object({
	id: IdSchema.describe('The transformation to update.'),
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	code: z.string().optional(),
	publish: z
		.boolean()
		.optional()
		.describe(
			'True publishes the new revision, making it live. False only creates a revision. Defaults to false.',
		),
});

export type TransformationUpdateInput = z.infer<
	typeof TransformationUpdateInputSchema
>;

const TransformationUpdateResponseSchema = TransformationSchema;

export type TransformationUpdateResponse = z.infer<
	typeof TransformationUpdateResponseSchema
>;

const TransformationDeleteInputSchema = z.object({
	id: IdSchema.describe(
		'The published transformation to delete. Its revisions are never deleted.',
	),
});

const TransformationDeleteResponseSchema = z.object({}).loose();

export type TransformationDeleteResponse = z.infer<
	typeof TransformationDeleteResponseSchema
>;

const VersionQuerySchema = z.object({
	count: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many revisions to return. Defaults to the first 5.'),
	orderBy: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Order on createdAt. Defaults to asc.'),
});

const TransformationVersionsInputSchema = VersionQuerySchema.extend({
	id: IdSchema.describe('The transformation whose revisions to list.'),
});

export type TransformationVersionsInput = z.infer<
	typeof TransformationVersionsInputSchema
>;

// The container key is capitalised on this route alone.
const TransformationVersionsResponseSchema = z
	.object({
		TransformationVersions: z.array(TransformationSchema).nullish(),
	})
	.loose();

export type TransformationVersionsResponse = z.infer<
	typeof TransformationVersionsResponseSchema
>;

const TransformationVersionInputSchema = z.object({
	id: IdSchema.describe('The transformation ID.'),
	versionId: IdSchema.describe('The revision to read.'),
});

export type TransformationVersionInput = z.infer<
	typeof TransformationVersionInputSchema
>;

const TransformationVersionResponseSchema = TransformationSchema;

export type TransformationVersionResponse = z.infer<
	typeof TransformationVersionResponseSchema
>;

const DestinationBodySchema = z.object({
	destinationId: IdSchema.describe('The destination to act on.'),
});

const TransformationConnectInputSchema = DestinationBodySchema.extend({
	id: IdSchema.describe(
		'The transformation to connect. It must be published, or RudderStack answers 400 "Transformation is not published".',
	),
});

export type TransformationConnectInput = z.infer<
	typeof TransformationConnectInputSchema
>;

const TransformationConnectResponseSchema = TransformationSchema;

export type TransformationConnectResponse = z.infer<
	typeof TransformationConnectResponseSchema
>;

const TransformationDisconnectInputSchema = TransformationConnectInputSchema;

export type TransformationDisconnectInput = z.infer<
	typeof TransformationDisconnectInputSchema
>;

/**
 * Disconnect answers with the transformation and, unlike connect, without a
 * `destinations` array, since the last connection was just removed. The model is
 * the same because the field is optional either way.
 */
const TransformationDisconnectResponseSchema = TransformationSchema;

export type TransformationDisconnectResponse = z.infer<
	typeof TransformationDisconnectResponseSchema
>;

// ── libraries ─────────────────────────────────────────────────────────────

export const LibrarySchema = z
	.object({
		id: z.string().nullish(),
		versionId: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		code: z.string().nullish(),
		language: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		importName: z
			.string()
			.nullish()
			.describe(
				'The name a transformation imports this library by. It cannot be changed after creation.',
			),
		isPublished: z.boolean().nullish().describe('Present on revision rows.'),
	})
	.loose();

export type RudderStackLibrary = z.infer<typeof LibrarySchema>;

const LibraryCreateInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.describe('The library name, used as the module name when imported.'),
	language: LanguageSchema,
	code: z.string().min(1).describe('The library code.'),
	description: z.string().optional(),
	publish: z
		.boolean()
		.optional()
		.describe('True publishes the library immediately. Defaults to false.'),
});

export type LibraryCreateInput = z.infer<typeof LibraryCreateInputSchema>;

const LibraryCreateResponseSchema = LibrarySchema;

export type LibraryCreateResponse = z.infer<typeof LibraryCreateResponseSchema>;

const LibrariesListInputSchema = z.object({});

const LibrariesListResponseSchema = z
	.object({
		libraries: z.array(LibrarySchema).nullish(),
	})
	.loose();

export type LibrariesListResponse = z.infer<typeof LibrariesListResponseSchema>;

const LibraryGetInputSchema = z.object({
	id: IdSchema.describe('The published library ID.'),
});

const LibraryGetResponseSchema = LibrarySchema;

export type LibraryGetResponse = z.infer<typeof LibraryGetResponseSchema>;

const LibraryVersionsInputSchema = VersionQuerySchema.extend({
	id: IdSchema.describe('The library whose revisions to list.'),
});

export type LibraryVersionsInput = z.infer<typeof LibraryVersionsInputSchema>;

const LibraryVersionsResponseSchema = z
	.object({
		libraryVersions: z.array(LibrarySchema).nullish(),
	})
	.loose();

export type LibraryVersionsResponse = z.infer<
	typeof LibraryVersionsResponseSchema
>;

const LibraryVersionInputSchema = z.object({
	id: IdSchema.describe('The library ID.'),
	versionId: IdSchema.describe('The revision to read.'),
});

export type LibraryVersionInput = z.infer<typeof LibraryVersionInputSchema>;

const LibraryVersionResponseSchema = LibrarySchema;

export type LibraryVersionResponse = z.infer<
	typeof LibraryVersionResponseSchema
>;

const LibraryUpdateInputSchema = z.object({
	id: IdSchema.describe('The library to update.'),
	code: z.string().min(1).describe('The updated library code.'),
	language: LanguageSchema.describe(
		"The library's language. It cannot be changed from the one it was created with.",
	),
	description: z.string().optional(),
	publish: z
		.boolean()
		.optional()
		.describe('True publishes the new revision. Defaults to false.'),
});

export type LibraryUpdateInput = z.infer<typeof LibraryUpdateInputSchema>;

const LibraryUpdateResponseSchema = LibrarySchema;

export type LibraryUpdateResponse = z.infer<typeof LibraryUpdateResponseSchema>;

const LibraryDeleteInputSchema = z.object({
	id: IdSchema.describe('The library to delete.'),
});

const LibraryDeleteResponseSchema = z.object({}).loose();

export type LibraryDeleteResponse = z.infer<typeof LibraryDeleteResponseSchema>;

// ── libraries.publish ─────────────────────────────────────────────────────

const PublishTransformationEntrySchema = z.object({
	versionId: IdSchema.describe('The transformation revision to publish.'),
	testInput: z
		.array(JsonObjectSchema)
		.optional()
		.describe('Events to run the revision against before publishing it.'),
});

const PublishLibraryEntrySchema = z.object({
	versionId: IdSchema.describe('The library revision to publish.'),
});

/**
 * The route is `/libraries/publish`, but it publishes transformations as well as
 * libraries; RudderStack documents at least one of the two arrays and runs the
 * code on its servers before anything goes live, so a failing test rejects the
 * whole call.
 */
const PublishInputSchema = z
	.object({
		transformations: z.array(PublishTransformationEntrySchema).optional(),
		libraries: z.array(PublishLibraryEntrySchema).optional(),
	})
	.superRefine((value, ctx) => {
		if (!value.transformations?.length && !value.libraries?.length) {
			ctx.addIssue({
				code: 'custom',
				path: ['transformations'],
				message:
					'Give at least one transformation or library revision; RudderStack rejects a publish with neither.',
			});
		}
	});

export type PublishInput = z.infer<typeof PublishInputSchema>;

const PublishResponseSchema = z
	.object({
		published: z
			.boolean()
			.nullish()
			.describe('True when every revision passed and went live.'),
	})
	.loose();

export type PublishResponse = z.infer<typeof PublishResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RudderStackTransformationEndpointInputs = {
	transformationsList: z.infer<typeof TransformationsListInputSchema>;
	transformationsCreate: TransformationCreateInput;
	transformationsGet: z.infer<typeof TransformationGetInputSchema>;
	transformationsUpdate: TransformationUpdateInput;
	transformationsDelete: z.infer<typeof TransformationDeleteInputSchema>;
	transformationsListVersions: TransformationVersionsInput;
	transformationsGetVersion: TransformationVersionInput;
	transformationsConnect: TransformationConnectInput;
	transformationsDisconnect: TransformationDisconnectInput;
	librariesCreate: LibraryCreateInput;
	librariesList: z.infer<typeof LibrariesListInputSchema>;
	librariesGet: z.infer<typeof LibraryGetInputSchema>;
	librariesListVersions: LibraryVersionsInput;
	librariesGetVersion: LibraryVersionInput;
	librariesUpdate: LibraryUpdateInput;
	librariesDelete: z.infer<typeof LibraryDeleteInputSchema>;
	librariesPublish: PublishInput;
};

export type RudderStackTransformationEndpointOutputs = {
	transformationsList: TransformationsListResponse;
	transformationsCreate: TransformationCreateResponse;
	transformationsGet: TransformationGetResponse;
	transformationsUpdate: TransformationUpdateResponse;
	transformationsDelete: TransformationDeleteResponse;
	transformationsListVersions: TransformationVersionsResponse;
	transformationsGetVersion: TransformationVersionResponse;
	transformationsConnect: TransformationConnectResponse;
	transformationsDisconnect: TransformationDisconnectResponse;
	librariesCreate: LibraryCreateResponse;
	librariesList: LibrariesListResponse;
	librariesGet: LibraryGetResponse;
	librariesListVersions: LibraryVersionsResponse;
	librariesGetVersion: LibraryVersionResponse;
	librariesUpdate: LibraryUpdateResponse;
	librariesDelete: LibraryDeleteResponse;
	librariesPublish: PublishResponse;
};

export const RudderStackTransformationEndpointInputSchemas = {
	transformationsList: TransformationsListInputSchema,
	transformationsCreate: TransformationCreateInputSchema,
	transformationsGet: TransformationGetInputSchema,
	transformationsUpdate: TransformationUpdateInputSchema,
	transformationsDelete: TransformationDeleteInputSchema,
	transformationsListVersions: TransformationVersionsInputSchema,
	transformationsGetVersion: TransformationVersionInputSchema,
	transformationsConnect: TransformationConnectInputSchema,
	transformationsDisconnect: TransformationDisconnectInputSchema,
	librariesCreate: LibraryCreateInputSchema,
	librariesList: LibrariesListInputSchema,
	librariesGet: LibraryGetInputSchema,
	librariesListVersions: LibraryVersionsInputSchema,
	librariesGetVersion: LibraryVersionInputSchema,
	librariesUpdate: LibraryUpdateInputSchema,
	librariesDelete: LibraryDeleteInputSchema,
	librariesPublish: PublishInputSchema,
} as const;

export const RudderStackTransformationEndpointOutputSchemas = {
	transformationsList: TransformationsListResponseSchema,
	transformationsCreate: TransformationCreateResponseSchema,
	transformationsGet: TransformationGetResponseSchema,
	transformationsUpdate: TransformationUpdateResponseSchema,
	transformationsDelete: TransformationDeleteResponseSchema,
	transformationsListVersions: TransformationVersionsResponseSchema,
	transformationsGetVersion: TransformationVersionResponseSchema,
	transformationsConnect: TransformationConnectResponseSchema,
	transformationsDisconnect: TransformationDisconnectResponseSchema,
	librariesCreate: LibraryCreateResponseSchema,
	librariesList: LibrariesListResponseSchema,
	librariesGet: LibraryGetResponseSchema,
	librariesListVersions: LibraryVersionsResponseSchema,
	librariesGetVersion: LibraryVersionResponseSchema,
	librariesUpdate: LibraryUpdateResponseSchema,
	librariesDelete: LibraryDeleteResponseSchema,
	librariesPublish: PublishResponseSchema,
} as const;
