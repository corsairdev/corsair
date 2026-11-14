import { z } from 'zod';

// Shared ID schema
// `.` and `..` are refused: encodeURIComponent keeps them and URL parsing drops them from the path.
export const FeltIdSchema = z
	.string()
	.min(1)
	.refine((id) => id !== '.' && id !== '..', {
		message: 'An id cannot be "." or "..".',
	});

// Felt documents timestamps on sources and credentials as unix integers; a string is accepted too so a format change does not break parsing.
const FeltTimestampSchema = z.union([z.number(), z.string()]);

// GeoJSON FeatureCollection, as returned for map elements and element groups.
export const GeoJsonSchema = z
	.object({
		type: z.string(),
		// `unknown` because GeoJSON features contain arbitrary geometry and property objects.
		features: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export type GeoJson = z.infer<typeof GeoJsonSchema>;

// Standard deleted response schema for 204 No Content endpoints
export const FeltDeletedResponseSchema = z
	.object({
		success: z.boolean(),
		id: z.string().optional(),
	})
	.passthrough();

export type FeltDeletedResponse = z.infer<typeof FeltDeletedResponseSchema>;

// ── Users ──────────────────────────────────────────────────────────────────

export const UserSchema = z
	.object({
		id: z.string(),
		email: z.string().optional(),
		name: z.string().optional(),
	})
	// passthrough because user profiles may include additional workspace roles and avatar fields.
	.passthrough();

export type User = z.infer<typeof UserSchema>;

export const UsersGetCurrentInputSchema = z.object({}).strict();
export type UsersGetCurrentInput = z.infer<typeof UsersGetCurrentInputSchema>;

export const UsersGetCurrentResponseSchema = UserSchema;
export type UsersGetCurrentResponse = z.infer<
	typeof UsersGetCurrentResponseSchema
>;

// ── Maps ───────────────────────────────────────────────────────────────────

export const MapTableSettingsSchema = z
	.object({
		default_table_layer_id: z.string().nullable().optional(),
		viewers_can_open_table: z.boolean().optional(),
	})
	.passthrough();

export const MapViewerPermissionsSchema = z
	.object({
		can_duplicate_map: z.boolean().optional(),
		can_export_data: z.boolean().optional(),
		can_see_map_presence: z.boolean().optional(),
	})
	.passthrough();

// Responses send null for permissions and table settings nobody has set (live run 11-13).
const MapTableSettingsOutputSchema = z
	.object({
		default_table_layer_id: z.string().nullable().optional(),
		viewers_can_open_table: z.boolean().nullable().optional(),
	})
	.passthrough();

const MapViewerPermissionsOutputSchema = z
	.object({
		can_duplicate_map: z.boolean().nullable().optional(),
		can_export_data: z.boolean().nullable().optional(),
		can_see_map_presence: z.boolean().nullable().optional(),
	})
	.passthrough();

export const MapSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		title: z.string().optional(),
		url: z.string().optional(),
		public_access: z.string().optional(),
		basemap: z.string().optional(),
		description: z.string().nullable().optional(),
		thumbnail_url: z.string().nullable().optional(),
		project_id: z.string().nullable().optional(),
		folder_id: z.string().nullable().optional(),
		created_at: z.string().optional(),
		visited_at: z.string().nullable().optional(),
		// `unknown` because nested layers/elements in the map object are untyped JSON arrays from the provider.
		layers: z.array(z.unknown()).optional(),
		// `unknown` because element groups in map detail can contain arbitrary GeoJSON styling objects.
		element_groups: z.array(z.unknown()).optional(),
		// Felt returns the map's elements as one GeoJSON FeatureCollection, not an array.
		elements: GeoJsonSchema.optional(),
		// `unknown` because layer groups in map detail can contain nested layer definitions.
		layer_groups: z.array(z.unknown()).optional(),
		table_settings: MapTableSettingsOutputSchema.nullable().optional(),
		viewer_permissions: MapViewerPermissionsOutputSchema.nullable().optional(),
	})
	// passthrough because maps can contain extensible links and custom settings.
	.passthrough();

export type FeltMap = z.infer<typeof MapSchema>;

export const MapReferenceSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		url: z.string().optional(),
		public_access: z.string().optional(),
		project_id: z.string().nullable().optional(),
		folder_id: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export type MapReference = z.infer<typeof MapReferenceSchema>;

export const MapsCreateInputSchema = z
	.object({
		title: z.string().optional(),
		basemap: z.string().optional(),
		description: z.string().optional(),
		lat: z.number().optional(),
		lon: z.number().optional(),
		zoom: z.number().optional(),
		public_access: z
			.enum([
				'private',
				'view_only',
				'view_and_comment',
				'view_comment_and_edit',
			])
			.optional(),
		layer_urls: z.array(z.string()).optional(),
		workspace_id: z.string().optional(),
	})
	.strict();

export type MapsCreateInput = z.infer<typeof MapsCreateInputSchema>;
export const MapsCreateResponseSchema = MapSchema;
export type MapsCreateResponse = z.infer<typeof MapsCreateResponseSchema>;

export const MapsGetInputSchema = z
	.object({
		map_id: FeltIdSchema,
	})
	.strict();

export type MapsGetInput = z.infer<typeof MapsGetInputSchema>;
export const MapsGetResponseSchema = MapSchema;
export type MapsGetResponse = z.infer<typeof MapsGetResponseSchema>;

export const MapsUpdateInputSchema = z
	.object({
		map_id: FeltIdSchema,
		title: z.string().optional(),
		basemap: z.string().optional(),
		description: z.string().optional(),
		public_access: z
			.enum([
				'private',
				'view_only',
				'view_and_comment',
				'view_comment_and_edit',
			])
			.optional(),
		table_settings: MapTableSettingsSchema.optional(),
		viewer_permissions: MapViewerPermissionsSchema.optional(),
	})
	.strict();

export type MapsUpdateInput = z.infer<typeof MapsUpdateInputSchema>;
export const MapsUpdateResponseSchema = MapSchema;
export type MapsUpdateResponse = z.infer<typeof MapsUpdateResponseSchema>;

export const MapsDeleteInputSchema = z
	.object({
		map_id: FeltIdSchema,
	})
	.strict();

export type MapsDeleteInput = z.infer<typeof MapsDeleteInputSchema>;
export const MapsDeleteResponseSchema = FeltDeletedResponseSchema;
export type MapsDeleteResponse = z.infer<typeof MapsDeleteResponseSchema>;

export const MapsDuplicateInputSchema = z
	.object({
		map_id: FeltIdSchema,
		title: z.string().optional(),
		destination: z
			.object({
				folder_id: z.string().optional(),
				project_id: z.string().optional(),
			})
			.optional(),
	})
	.strict();

export type MapsDuplicateInput = z.infer<typeof MapsDuplicateInputSchema>;
export const MapsDuplicateResponseSchema = MapSchema;
export type MapsDuplicateResponse = z.infer<typeof MapsDuplicateResponseSchema>;

export const MapsMoveInputSchema = z
	.object({
		map_id: FeltIdSchema,
		project_id: z.string().optional(),
		folder_id: z.string().optional(),
	})
	.strict();

export type MapsMoveInput = z.infer<typeof MapsMoveInputSchema>;
export const MapsMoveResponseSchema = MapSchema;
export type MapsMoveResponse = z.infer<typeof MapsMoveResponseSchema>;

export const MapImageExportParamsSchema = z
	.object({
		legend: z
			.object({
				visible: z.boolean().optional(),
				show_title: z.boolean().optional(),
				show_description: z.boolean().optional(),
				show_components: z.boolean().optional(),
			})
			.strict()
			.optional(),
		show_scale_bar: z.boolean().optional(),
		units: z.enum(['metric', 'us_standard']).optional(),
		output: z
			.object({
				format: z.enum(['png', 'jpg', 'pdf', 'svg']).optional(),
				width_px: z.number(),
				height_px: z.number(),
				pixel_ratio: z.number().optional(),
				jpg_quality: z.number().optional(),
			})
			.strict(),
		// `unknown` because view object accepts arbitrary viewport bounds or center/zoom coordinates.
		view: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export const MapsExportImageInputSchema = z
	.object({
		map_id: FeltIdSchema,
		legend: z
			.object({
				visible: z.boolean().optional(),
				show_title: z.boolean().optional(),
				show_description: z.boolean().optional(),
				show_components: z.boolean().optional(),
			})
			.strict()
			.optional(),
		show_scale_bar: z.boolean().optional(),
		units: z.enum(['metric', 'us_standard']).optional(),
		output: z
			.object({
				format: z.enum(['png', 'jpg', 'pdf', 'svg']).optional(),
				width_px: z.number(),
				height_px: z.number(),
				pixel_ratio: z.number().optional(),
				jpg_quality: z.number().optional(),
			})
			.strict(),
		// `unknown` because view object accepts arbitrary viewport bounds or center/zoom coordinates.
		view: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export type MapsExportImageInput = z.infer<typeof MapsExportImageInputSchema>;

export const MapImageExportSchema = z
	.object({
		id: z.string(),
		filename: z.string().optional(),
		download_url: z.string().nullable().optional(),
		status: z.string().optional(),
		expires_at: z.string().optional(),
		// `unknown` because the echoed output settings mirror the request and may gain fields.
		output: z.record(z.string(), z.unknown()).optional(),
		rendered_bounds: z.array(z.number()).optional(),
	})
	.passthrough();

export type MapImageExport = z.infer<typeof MapImageExportSchema>;
export const MapsExportImageResponseSchema = MapImageExportSchema;
export type MapsExportImageResponse = z.infer<
	typeof MapsExportImageResponseSchema
>;

export const MapsCreateEmbedTokenInputSchema = z
	.object({
		map_id: FeltIdSchema,
		user_email: z.string(),
	})
	.strict();

export type MapsCreateEmbedTokenInput = z.infer<
	typeof MapsCreateEmbedTokenInputSchema
>;

export const EmbedTokenSchema = z
	.object({
		token: z.string(),
		expires_at: z.string().optional(),
	})
	.passthrough();

export type EmbedToken = z.infer<typeof EmbedTokenSchema>;
export const MapsCreateEmbedTokenResponseSchema = EmbedTokenSchema;
export type MapsCreateEmbedTokenResponse = z.infer<
	typeof MapsCreateEmbedTokenResponseSchema
>;

// ── Layers ─────────────────────────────────────────────────────────────────

export const LayerMetadataSchema = z
	.object({
		attribution_text: z.string().nullable().optional(),
		attribution_url: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		license: z.string().nullable().optional(),
		source_abbreviation: z.string().nullable().optional(),
		source_name: z.string().nullable().optional(),
		source_url: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
	})
	.passthrough();

export const LayerAttributeSchema = z
	.object({
		name: z.string(),
		type: z
			.enum([
				'INTEGER',
				'REAL',
				'TEXT',
				'BOOLEAN',
				'DATE',
				'DATETIME',
				'GEOMETRY',
			])
			.or(z.string())
			.optional(),
	})
	.passthrough();

export const LayerSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		name: z.string().optional(),
		caption: z.string().nullable().optional(),
		geometry_type: z
			.enum(['Line', 'Point', 'Polygon', 'Raster'])
			.or(z.string())
			.nullable()
			.optional(),
		hide_from_legend: z.boolean().nullable().optional(),
		is_spreadsheet: z.boolean().nullable().optional(),
		last_refreshed_at: z.string().nullable().optional(),
		next_refresh_at: z.string().nullable().optional(),
		legend_display: z
			.enum(['default', 'name_only'])
			.or(z.string())
			.nullable()
			.optional(),
		legend_visibility: z
			.enum(['hide', 'show'])
			.or(z.string())
			.nullable()
			.optional(),
		ordering_key: z.number().nullable().optional(),
		paused_reason: z.string().nullable().optional(),
		progress: z.number().optional(),
		refresh_period: z.string().optional(),
		refresh_status: z.string().optional(),
		status: z.string().optional(),
		// `unknown` because layer style conforms to the dynamic Felt Style Language specification.
		style: z.record(z.string(), z.unknown()).optional(),
		tile_url: z.string().nullable().optional(),
		metadata: LayerMetadataSchema.optional(),
		attributes: z.array(LayerAttributeSchema).nullable().optional(),
	})
	// passthrough because layers contain provider links and dynamic spatial metadata.
	.passthrough();

export type FeltLayer = z.infer<typeof LayerSchema>;

export const LayersListInputSchema = z
	.object({
		map_id: FeltIdSchema,
		include_uploading: z.boolean().optional(),
	})
	.strict();

export type LayersListInput = z.infer<typeof LayersListInputSchema>;
export const LayersListResponseSchema = z.array(LayerSchema);
export type LayersListResponse = z.infer<typeof LayersListResponseSchema>;

export const LayersGetInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
	})
	.strict();

export type LayersGetInput = z.infer<typeof LayersGetInputSchema>;
export const LayersGetResponseSchema = LayerSchema;
export type LayersGetResponse = z.infer<typeof LayersGetResponseSchema>;

export const LayerUpdateItemSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		caption: z.string().optional(),
		subtitle: z.string().optional(),
		layer_group_id: z.string().nullable().optional(),
		legend_display: z.enum(['default', 'name_only']).optional(),
		legend_visibility: z.enum(['hide', 'show']).optional(),
		ordering_key: z.number().optional(),
		refresh_period: z
			.enum([
				'15 min',
				'30 min',
				'hour',
				'3 hours',
				'6 hours',
				'12 hours',
				'day',
				'week',
				'month',
				'disabled',
			])
			.optional(),
		metadata: LayerMetadataSchema.optional(),
	})
	.strict();

export const LayersUpdateInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layers: z.array(LayerUpdateItemSchema),
	})
	.strict();

export type LayersUpdateInput = z.infer<typeof LayersUpdateInputSchema>;
export const LayersUpdateResponseSchema = z.array(LayerSchema);
export type LayersUpdateResponse = z.infer<typeof LayersUpdateResponseSchema>;

export const LayersDeleteInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
	})
	.strict();

export type LayersDeleteInput = z.infer<typeof LayersDeleteInputSchema>;
export const LayersDeleteResponseSchema = FeltDeletedResponseSchema;
export type LayersDeleteResponse = z.infer<typeof LayersDeleteResponseSchema>;

export const LayersUploadInputSchema = z
	.object({
		map_id: FeltIdSchema,
		name: z.string(),
		import_url: z.string().optional(),
		lat: z.number().optional(),
		lng: z.number().optional(),
		zoom: z.number().optional(),
		metadata: LayerMetadataSchema.optional(),
		// `unknown` because interpretation hints accept dynamic geodata hint objects.
		hints: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.strict();

export type LayersUploadInput = z.infer<typeof LayersUploadInputSchema>;

export const UploadResponseSchema = z
	.object({
		layer_id: z.string(),
		layer_group_id: z.string().optional(),
		// Felt returns null url and presigned_attributes for URL imports and URL refreshes.
		url: z.string().nullable().optional(),
		type: z.string().optional(),
		// `unknown` because presigned attributes are provider-specific S3 parameters.
		presigned_attributes: z
			.record(z.string(), z.unknown())
			.nullable()
			.optional(),
	})
	.passthrough();

export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export const LayersUploadResponseSchema = UploadResponseSchema;
export type LayersUploadResponse = z.infer<typeof LayersUploadResponseSchema>;

// Felt picks the import by `from`: a dataset of a source, a SQL query on a source, or a STAC asset.
export const LayersAddFromSourceInputSchema = z.discriminatedUnion('from', [
	z
		.object({
			map_id: FeltIdSchema,
			from: z.literal('dataset'),
			dataset_id: FeltIdSchema,
		})
		.strict(),
	z
		.object({
			map_id: FeltIdSchema,
			from: z.literal('sql'),
			source_id: FeltIdSchema,
			query: z.string().min(1),
		})
		.strict(),
	z
		.object({
			map_id: FeltIdSchema,
			from: z.literal('stac'),
			source_id: FeltIdSchema,
			stac_asset_url: z.string().min(1),
		})
		.strict(),
]);

export type LayersAddFromSourceInput = z.infer<
	typeof LayersAddFromSourceInputSchema
>;

export const AddSourceLayerAcceptedSchema = z
	.object({
		status: z.string(),
		// `unknown` because links object contains hypermedia URLs from the Felt API.
		links: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type AddSourceLayerAccepted = z.infer<
	typeof AddSourceLayerAcceptedSchema
>;
export const LayersAddFromSourceResponseSchema = AddSourceLayerAcceptedSchema;
export type LayersAddFromSourceResponse = z.infer<
	typeof LayersAddFromSourceResponseSchema
>;

export const LayersRefreshInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
	})
	.strict();

export type LayersRefreshInput = z.infer<typeof LayersRefreshInputSchema>;
// Felt answers a refresh with an upload response (presigned S3 fields for file layers), not the layer.
export const LayersRefreshResponseSchema = UploadResponseSchema;
export type LayersRefreshResponse = z.infer<typeof LayersRefreshResponseSchema>;

export const LayersUpdateStyleInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		// `unknown` because style is an arbitrary JSON specification conforming to Felt Style Language.
		style: z.record(z.string(), z.unknown()),
	})
	.strict();

export type LayersUpdateStyleInput = z.infer<
	typeof LayersUpdateStyleInputSchema
>;
export const LayersUpdateStyleResponseSchema = LayerSchema;
export type LayersUpdateStyleResponse = z.infer<
	typeof LayersUpdateStyleResponseSchema
>;

export const LayersPublishInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		name: z.string().optional(),
		feltServerId: z.string().optional(),
	})
	.strict();

export type LayersPublishInput = z.infer<typeof LayersPublishInputSchema>;
export const LayersPublishResponseSchema = LayerSchema;
export type LayersPublishResponse = z.infer<typeof LayersPublishResponseSchema>;

export const LayersCreateCustomExportInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		output_format: z.string(),
		email_on_completion: z.boolean().optional(),
		// `unknown` because each filter is a Felt filter expression (a nested array of operands).
		filters: z.array(z.unknown()).optional(),
	})
	.strict();

export type LayersCreateCustomExportInput = z.infer<
	typeof LayersCreateCustomExportInputSchema
>;

export const CustomExportResponseSchema = z
	.object({
		export_request_id: z.string(),
		poll_endpoint: z.string().optional(),
	})
	.passthrough();

export type CustomExportResponse = z.infer<typeof CustomExportResponseSchema>;
export const LayersCreateCustomExportResponseSchema =
	CustomExportResponseSchema;
export type LayersCreateCustomExportResponse = z.infer<
	typeof LayersCreateCustomExportResponseSchema
>;

export const LayersPollCustomExportInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		export_id: FeltIdSchema,
	})
	.strict();

export type LayersPollCustomExportInput = z.infer<
	typeof LayersPollCustomExportInputSchema
>;

export const CustomExportRequestStatusSchema = z
	.object({
		export_id: z.string(),
		status: z.string(),
		download_url: z.string().nullable().optional(),
		// `unknown` because filters echo the submitted Felt filter expressions (an array).
		filters: z.array(z.unknown()).nullable().optional(),
	})
	.passthrough();

export type CustomExportRequestStatus = z.infer<
	typeof CustomExportRequestStatusSchema
>;
export const LayersPollCustomExportResponseSchema =
	CustomExportRequestStatusSchema;
export type LayersPollCustomExportResponse = z.infer<
	typeof LayersPollCustomExportResponseSchema
>;

export const LayersGetExportLinkInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
	})
	.strict();

export type LayersGetExportLinkInput = z.infer<
	typeof LayersGetExportLinkInputSchema
>;

export const ExportLinkSchema = z
	.object({
		export_link: z.string(),
	})
	.passthrough();

export type ExportLink = z.infer<typeof ExportLinkSchema>;
export const LayersGetExportLinkResponseSchema = ExportLinkSchema;
export type LayersGetExportLinkResponse = z.infer<
	typeof LayersGetExportLinkResponseSchema
>;

export const LayersDuplicateInputSchema = z
	.object({
		// Each item copies one layer (`source_layer_id`) or one layer group (`source_layer_group_id`).
		layers: z.array(
			z.union([
				z
					.object({
						source_layer_id: FeltIdSchema,
						destination_map_id: FeltIdSchema,
					})
					.strict(),
				z
					.object({
						source_layer_group_id: FeltIdSchema,
						destination_map_id: FeltIdSchema,
					})
					.strict(),
			]),
		),
	})
	.strict();

export type LayersDuplicateInput = z.infer<typeof LayersDuplicateInputSchema>;

export const DuplicateLayersResponseSchema = z
	.object({
		layers: z.array(LayerSchema).optional(),
		// `unknown` because layer groups in duplicate responses mirror layer group representations.
		layer_groups: z.array(z.unknown()).optional(),
	})
	.passthrough();

export type DuplicateLayersResponse = z.infer<
	typeof DuplicateLayersResponseSchema
>;
export const LayersDuplicateResponseSchema = DuplicateLayersResponseSchema;
export type LayersDuplicateResponse = z.infer<
	typeof LayersDuplicateResponseSchema
>;

export const LayersListLibraryInputSchema = z
	.object({
		source: z.string().optional(),
	})
	.strict();

export type LayersListLibraryInput = z.infer<
	typeof LayersListLibraryInputSchema
>;

export const LayerLibrarySchema = z
	.object({
		type: z.string().optional(),
		layers: z.array(LayerSchema).optional(),
		// `unknown` because library groups contain library group definitions.
		layer_groups: z.array(z.unknown()).optional(),
	})
	.passthrough();

export type LayerLibrary = z.infer<typeof LayerLibrarySchema>;
export const LayersListLibraryResponseSchema = LayerLibrarySchema;
export type LayersListLibraryResponse = z.infer<
	typeof LayersListLibraryResponseSchema
>;

// ── Layer Groups ───────────────────────────────────────────────────────────

export const LayerGroupSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		caption: z.string().nullable().optional(),
		ordering_key: z.number().nullable().optional(),
		legend_visibility: z
			.enum(['hide', 'show'])
			.or(z.string())
			.nullable()
			.optional(),
		visibility_interaction: z
			.enum(['default', 'slider', 'select', 'multi_select'])
			.or(z.string())
			.nullable()
			.optional(),
		layers: z.array(LayerSchema).optional(),
	})
	.passthrough();

export type LayerGroup = z.infer<typeof LayerGroupSchema>;

export const LayerGroupsListInputSchema = z
	.object({
		map_id: FeltIdSchema,
		include_uploading: z.boolean().optional(),
	})
	.strict();

export type LayerGroupsListInput = z.infer<typeof LayerGroupsListInputSchema>;
export const LayerGroupsListResponseSchema = z.array(LayerGroupSchema);
export type LayerGroupsListResponse = z.infer<
	typeof LayerGroupsListResponseSchema
>;

export const LayerGroupsGetInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_group_id: FeltIdSchema,
	})
	.strict();

export type LayerGroupsGetInput = z.infer<typeof LayerGroupsGetInputSchema>;
export const LayerGroupsGetResponseSchema = LayerGroupSchema;
export type LayerGroupsGetResponse = z.infer<
	typeof LayerGroupsGetResponseSchema
>;

export const LayerGroupUpdateItemSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		caption: z.string().optional(),
		subtitle: z.string().optional(),
		legend_visibility: z.enum(['hide', 'show']).optional(),
		visibility_interaction: z
			.enum(['default', 'slider', 'select', 'multi_select'])
			.nullable()
			.optional(),
		ordering_key: z.number().optional(),
	})
	.strict();

export const LayerGroupsUpdateInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_group_id: FeltIdSchema,
		name: z.string().optional(),
		caption: z.string().optional(),
		subtitle: z.string().optional(),
		legend_visibility: z.enum(['hide', 'show']).optional(),
		visibility_interaction: z
			.enum(['default', 'slider', 'select', 'multi_select'])
			.nullable()
			.optional(),
		ordering_key: z.number().optional(),
	})
	.strict();

export type LayerGroupsUpdateInput = z.infer<
	typeof LayerGroupsUpdateInputSchema
>;
export const LayerGroupsUpdateResponseSchema = LayerGroupSchema;
export type LayerGroupsUpdateResponse = z.infer<
	typeof LayerGroupsUpdateResponseSchema
>;

export const LayerGroupsUpdateBulkInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_groups: z.array(LayerGroupUpdateItemSchema),
	})
	.strict();

export type LayerGroupsUpdateBulkInput = z.infer<
	typeof LayerGroupsUpdateBulkInputSchema
>;
export const LayerGroupsUpdateBulkResponseSchema = z.array(LayerGroupSchema);
export type LayerGroupsUpdateBulkResponse = z.infer<
	typeof LayerGroupsUpdateBulkResponseSchema
>;

export const LayerGroupsDeleteInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_group_id: FeltIdSchema,
	})
	.strict();

export type LayerGroupsDeleteInput = z.infer<
	typeof LayerGroupsDeleteInputSchema
>;
export const LayerGroupsDeleteResponseSchema = FeltDeletedResponseSchema;
export type LayerGroupsDeleteResponse = z.infer<
	typeof LayerGroupsDeleteResponseSchema
>;

export const LayerGroupsPublishInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_group_id: FeltIdSchema,
		name: z.string().optional(),
		feltServerId: z.string().optional(),
	})
	.strict();

export type LayerGroupsPublishInput = z.infer<
	typeof LayerGroupsPublishInputSchema
>;
export const LayerGroupsPublishResponseSchema = LayerGroupSchema;
export type LayerGroupsPublishResponse = z.infer<
	typeof LayerGroupsPublishResponseSchema
>;

// ── Layer Components ───────────────────────────────────────────────────────

export const LayerComponentSchema = z
	.object({
		id: z.string().optional(),
		type: z.string().optional(),
		// `unknown` because layer components represent arbitrary dashboard UI widgets.
		config: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type LayerComponent = z.infer<typeof LayerComponentSchema>;

export const LayerComponentsListInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
	})
	.strict();

export type LayerComponentsListInput = z.infer<
	typeof LayerComponentsListInputSchema
>;
export const LayerComponentsListResponseSchema = z.array(LayerComponentSchema);
export type LayerComponentsListResponse = z.infer<
	typeof LayerComponentsListResponseSchema
>;

export const LayerComponentsCreateInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		// `unknown` because component config is an arbitrary dashboard UI widget specification.
		component: z.record(z.string(), z.unknown()),
	})
	.strict();

export type LayerComponentsCreateInput = z.infer<
	typeof LayerComponentsCreateInputSchema
>;
export const LayerComponentsCreateResponseSchema = LayerComponentSchema;
export type LayerComponentsCreateResponse = z.infer<
	typeof LayerComponentsCreateResponseSchema
>;

export const LayerComponentsGetInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		component_id: FeltIdSchema,
	})
	.strict();

export type LayerComponentsGetInput = z.infer<
	typeof LayerComponentsGetInputSchema
>;
export const LayerComponentsGetResponseSchema = LayerComponentSchema;
export type LayerComponentsGetResponse = z.infer<
	typeof LayerComponentsGetResponseSchema
>;

export const LayerComponentsUpdateInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		component_id: FeltIdSchema,
		// `unknown` because component config is an arbitrary dashboard UI widget specification.
		component: z.record(z.string(), z.unknown()),
	})
	.strict();

export type LayerComponentsUpdateInput = z.infer<
	typeof LayerComponentsUpdateInputSchema
>;
export const LayerComponentsUpdateResponseSchema = LayerComponentSchema;
export type LayerComponentsUpdateResponse = z.infer<
	typeof LayerComponentsUpdateResponseSchema
>;

export const LayerComponentsDeleteInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layer_id: FeltIdSchema,
		component_id: FeltIdSchema,
	})
	.strict();

export type LayerComponentsDeleteInput = z.infer<
	typeof LayerComponentsDeleteInputSchema
>;
export const LayerComponentsDeleteResponseSchema = FeltDeletedResponseSchema;
export type LayerComponentsDeleteResponse = z.infer<
	typeof LayerComponentsDeleteResponseSchema
>;

// ── Elements ───────────────────────────────────────────────────────────────

export const ElementsListInputSchema = z
	.object({
		map_id: FeltIdSchema,
	})
	.strict();

export type ElementsListInput = z.infer<typeof ElementsListInputSchema>;
export const ElementsListResponseSchema = GeoJsonSchema;
export type ElementsListResponse = z.infer<typeof ElementsListResponseSchema>;

export const ElementsUpsertInputSchema = z
	.object({
		map_id: FeltIdSchema,
		type: z.string().optional(),
		// `unknown` because features are GeoJSON Feature objects with variable geometry and properties.
		features: z.array(z.record(z.string(), z.unknown())),
	})
	.strict();

export type ElementsUpsertInput = z.infer<typeof ElementsUpsertInputSchema>;
export const ElementsUpsertResponseSchema = GeoJsonSchema;
export type ElementsUpsertResponse = z.infer<
	typeof ElementsUpsertResponseSchema
>;

export const ElementsDeleteInputSchema = z
	.object({
		map_id: FeltIdSchema,
		element_id: FeltIdSchema,
	})
	.strict();

export type ElementsDeleteInput = z.infer<typeof ElementsDeleteInputSchema>;
export const ElementsDeleteResponseSchema = FeltDeletedResponseSchema;
export type ElementsDeleteResponse = z.infer<
	typeof ElementsDeleteResponseSchema
>;

export const ElementGroupSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		color: z.string().optional(),
		symbol: z.string().nullable().optional(),
		// Felt returns a group's elements as one GeoJSON FeatureCollection.
		elements: GeoJsonSchema.optional(),
	})
	.passthrough();

export type ElementGroup = z.infer<typeof ElementGroupSchema>;

export const ElementsListGroupsInputSchema = z
	.object({
		map_id: FeltIdSchema,
	})
	.strict();

export type ElementsListGroupsInput = z.infer<
	typeof ElementsListGroupsInputSchema
>;
export const ElementsListGroupsResponseSchema = z.array(ElementGroupSchema);
export type ElementsListGroupsResponse = z.infer<
	typeof ElementsListGroupsResponseSchema
>;

export const ElementsGetGroupInputSchema = z
	.object({
		map_id: FeltIdSchema,
		group_id: FeltIdSchema,
	})
	.strict();

export type ElementsGetGroupInput = z.infer<typeof ElementsGetGroupInputSchema>;
export const ElementsGetGroupResponseSchema = GeoJsonSchema;
export type ElementsGetGroupResponse = z.infer<
	typeof ElementsGetGroupResponseSchema
>;

export const ElementGroupParamSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		color: z.string().optional(),
		symbol: z.string().optional(),
	})
	.strict();

export const ElementsUpsertGroupsInputSchema = z
	.object({
		map_id: FeltIdSchema,
		groups: z.array(ElementGroupParamSchema),
	})
	.strict();

export type ElementsUpsertGroupsInput = z.infer<
	typeof ElementsUpsertGroupsInputSchema
>;
export const ElementsUpsertGroupsResponseSchema = z.array(ElementGroupSchema);
export type ElementsUpsertGroupsResponse = z.infer<
	typeof ElementsUpsertGroupsResponseSchema
>;

// ── Comments ───────────────────────────────────────────────────────────────

export const CommentSchema = z
	.object({
		id: z.string().optional(),
		text: z.string().optional(),
		// `unknown` because author profile object contains dynamic user metadata.
		author: z.record(z.string(), z.unknown()).optional(),
		created_at: z.string().optional(),
		resolved: z.boolean().optional(),
	})
	.passthrough();

export const CommentsExportInputSchema = z
	.object({
		map_id: FeltIdSchema,
		format: z.enum(['csv', 'json', 'geojson']).optional(),
	})
	.strict();

export type CommentsExportInput = z.infer<typeof CommentsExportInputSchema>;
// json (default) is an array of threads, geojson a FeatureCollection, csv the file as text.
export const CommentsExportResponseSchema = z.union([
	z.array(CommentSchema),
	GeoJsonSchema,
	z.string(),
]);
export type CommentsExportResponse = z.infer<
	typeof CommentsExportResponseSchema
>;

export const CommentsResolveInputSchema = z
	.object({
		map_id: FeltIdSchema,
		comment_id: FeltIdSchema,
	})
	.strict();

export type CommentsResolveInput = z.infer<typeof CommentsResolveInputSchema>;

export const CommentResolvedSchema = z
	.object({
		comment_id: z.string(),
	})
	.passthrough();

export type CommentResolved = z.infer<typeof CommentResolvedSchema>;
export const CommentsResolveResponseSchema = CommentResolvedSchema;
export type CommentsResolveResponse = z.infer<
	typeof CommentsResolveResponseSchema
>;

export const CommentsDeleteInputSchema = z
	.object({
		map_id: FeltIdSchema,
		comment_id: FeltIdSchema,
	})
	.strict();

export type CommentsDeleteInput = z.infer<typeof CommentsDeleteInputSchema>;
export const CommentsDeleteResponseSchema = FeltDeletedResponseSchema;
export type CommentsDeleteResponse = z.infer<
	typeof CommentsDeleteResponseSchema
>;

// ── Projects ───────────────────────────────────────────────────────────────

export const ProjectSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		name: z.string(),
		visibility: z.enum(['workspace', 'private']).or(z.string()).optional(),
		max_inherited_permission: z
			.enum(['view_only', 'view_and_contribute', 'view_and_edit'])
			.or(z.string())
			.optional(),
		maps: z.array(MapReferenceSchema).optional(),
	})
	.passthrough();

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectReferenceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string().optional(),
		visibility: z.string().optional(),
		max_inherited_permission: z.string().optional(),
	})
	.passthrough();

export type ProjectReference = z.infer<typeof ProjectReferenceSchema>;

export const ProjectsListInputSchema = z
	.object({
		workspace_id: z.string().optional(),
	})
	.strict();

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export const ProjectsListResponseSchema = z.array(ProjectReferenceSchema);
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

export const ProjectsCreateInputSchema = z
	.object({
		name: z.string(),
		// Required by Felt: "workspace" or "private". A plain string because the docs generator rejects enum values in examples.
		visibility: z.string().min(1),
		max_inherited_permission: z
			.enum(['view_only', 'view_and_contribute', 'view_and_edit'])
			.optional(),
	})
	.strict();

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export const ProjectsCreateResponseSchema = ProjectSchema;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

export const ProjectsGetInputSchema = z
	.object({
		project_id: FeltIdSchema,
	})
	.strict();

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export const ProjectsGetResponseSchema = ProjectSchema;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

export const ProjectsUpdateInputSchema = z
	.object({
		project_id: FeltIdSchema,
		name: z.string().optional(),
		visibility: z.enum(['workspace', 'private']).optional(),
		max_inherited_permission: z
			.enum(['view_only', 'view_and_contribute', 'view_and_edit'])
			.optional(),
	})
	.strict();

export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;
export const ProjectsUpdateResponseSchema = ProjectSchema;
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

export const ProjectsDeleteInputSchema = z
	.object({
		project_id: FeltIdSchema,
	})
	.strict();

export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;
export const ProjectsDeleteResponseSchema = FeltDeletedResponseSchema;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

// ── Sources ────────────────────────────────────────────────────────────────

export const SourceDatasetSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		created_at: FeltTimestampSchema.optional(),
		updated_at: FeltTimestampSchema.optional(),
		description: z.string().nullable().optional(),
		geometry_type: z.string().nullable().optional(),
		inspection_status: z.string().optional(),
	})
	.passthrough();

export const SourceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string().optional(),
		created_at: FeltTimestampSchema.nullable().optional(),
		updated_at: FeltTimestampSchema.nullable().optional(),
		last_synced_at: FeltTimestampSchema.nullable().optional(),
		sync_status: z.string().optional(),
		// Felt sends "enabled" or "paused".
		automatic_sync: z.string().optional(),
		owner_id: z.string().optional(),
		workspace_id: z.string().optional(),
		// `unknown` because connection settings vary widely per database/warehouse provider.
		// Felt documents it as nullable.
		connection: z.record(z.string(), z.unknown()).nullable().optional(),
		datasets: z.array(SourceDatasetSchema).optional(),
	})
	.passthrough();

export type Source = z.infer<typeof SourceSchema>;

export const SourceReferenceSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		connection_type: z.string().optional(),
		created_at: FeltTimestampSchema.nullable().optional(),
		updated_at: FeltTimestampSchema.nullable().optional(),
		last_synced_at: FeltTimestampSchema.nullable().optional(),
		sync_status: z.string().optional(),
		// Felt sends "enabled" or "paused".
		automatic_sync: z.string().optional(),
	})
	.passthrough();

export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const SourcesListInputSchema = z
	.object({
		workspace_id: z.string().optional(),
	})
	.strict();

export type SourcesListInput = z.infer<typeof SourcesListInputSchema>;
export const SourcesListResponseSchema = z.array(SourceReferenceSchema);
export type SourcesListResponse = z.infer<typeof SourcesListResponseSchema>;

export const SourcesCreateInputSchema = z
	.object({
		name: z.string(),
		// `unknown` because connection parameters depend on source connection type.
		connection: z.record(z.string(), z.unknown()),
		// `unknown` because permissions object configures role-based access control.
		permissions: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export type SourcesCreateInput = z.infer<typeof SourcesCreateInputSchema>;
export const SourcesCreateResponseSchema = SourceReferenceSchema;
export type SourcesCreateResponse = z.infer<typeof SourcesCreateResponseSchema>;

export const SourcesGetInputSchema = z
	.object({
		source_id: FeltIdSchema,
	})
	.strict();

export type SourcesGetInput = z.infer<typeof SourcesGetInputSchema>;
export const SourcesGetResponseSchema = SourceSchema;
export type SourcesGetResponse = z.infer<typeof SourcesGetResponseSchema>;

export const SourcesUpdateInputSchema = z
	.object({
		source_id: FeltIdSchema,
		name: z.string().optional(),
		// `unknown` because connection parameters depend on source connection type.
		connection: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because permissions object configures role-based access control.
		permissions: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export type SourcesUpdateInput = z.infer<typeof SourcesUpdateInputSchema>;
export const SourcesUpdateResponseSchema = SourceReferenceSchema;
export type SourcesUpdateResponse = z.infer<typeof SourcesUpdateResponseSchema>;

export const SourcesDeleteInputSchema = z
	.object({
		source_id: FeltIdSchema,
	})
	.strict();

export type SourcesDeleteInput = z.infer<typeof SourcesDeleteInputSchema>;
export const SourcesDeleteResponseSchema = FeltDeletedResponseSchema;
export type SourcesDeleteResponse = z.infer<typeof SourcesDeleteResponseSchema>;

export const SourcesSyncInputSchema = z
	.object({
		source_id: FeltIdSchema,
	})
	.strict();

export type SourcesSyncInput = z.infer<typeof SourcesSyncInputSchema>;
export const SourcesSyncResponseSchema = SourceReferenceSchema;
export type SourcesSyncResponse = z.infer<typeof SourcesSyncResponseSchema>;

export const SourceCredentialSchema = z
	.object({
		id: z.string(),
		source_id: z.string().optional(),
		name: z.string().optional(),
		use_case: z.string().optional(),
		created_at: FeltTimestampSchema.nullable().optional(),
		updated_at: FeltTimestampSchema.nullable().optional(),
		// `unknown` because credential parameters vary by secret type.
		credential: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type SourceCredential = z.infer<typeof SourceCredentialSchema>;

export const SourcesCreateCredentialInputSchema = z
	.object({
		source_id: FeltIdSchema,
		name: z.string(),
		// Required by Felt: "source_authentication", "stac_api_authentication" or "stac_asset_fetching".
		use_case: z.string().min(1),
		// `unknown` because credential details depend on authentication type.
		credential: z.record(z.string(), z.unknown()),
	})
	.strict();

export type SourcesCreateCredentialInput = z.infer<
	typeof SourcesCreateCredentialInputSchema
>;
export const SourcesCreateCredentialResponseSchema = SourceCredentialSchema;
export type SourcesCreateCredentialResponse = z.infer<
	typeof SourcesCreateCredentialResponseSchema
>;

export const SourcesUpdateCredentialInputSchema = z
	.object({
		source_id: FeltIdSchema,
		credential_id: FeltIdSchema,
		name: z.string().optional(),
		use_case: z.string().optional(),
		// `unknown` because credential details depend on authentication type.
		credential: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export type SourcesUpdateCredentialInput = z.infer<
	typeof SourcesUpdateCredentialInputSchema
>;
export const SourcesUpdateCredentialResponseSchema = SourceCredentialSchema;
export type SourcesUpdateCredentialResponse = z.infer<
	typeof SourcesUpdateCredentialResponseSchema
>;

export const SourcesDeleteCredentialInputSchema = z
	.object({
		source_id: FeltIdSchema,
		credential_id: FeltIdSchema,
	})
	.strict();

export type SourcesDeleteCredentialInput = z.infer<
	typeof SourcesDeleteCredentialInputSchema
>;
export const SourcesDeleteCredentialResponseSchema = FeltDeletedResponseSchema;
export type SourcesDeleteCredentialResponse = z.infer<
	typeof SourcesDeleteCredentialResponseSchema
>;

// ── Print Pages & Layouts ──────────────────────────────────────────────────

export const PrintLayoutSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		kind: z.string().optional(),
		orientation: z.string().nullable().optional(),
		// `unknown` because contents represent layout template specifications.
		contents: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type PrintLayout = z.infer<typeof PrintLayoutSchema>;

export const PrintPagesListLayoutsInputSchema = z
	.object({
		map_id: FeltIdSchema,
	})
	.strict();

export type PrintPagesListLayoutsInput = z.infer<
	typeof PrintPagesListLayoutsInputSchema
>;
export const PrintPagesListLayoutsResponseSchema = z.array(PrintLayoutSchema);
export type PrintPagesListLayoutsResponse = z.infer<
	typeof PrintPagesListLayoutsResponseSchema
>;

export const PrintPagesCreateLayoutInputSchema = z
	.object({
		map_id: FeltIdSchema,
		// The page to save as a layout; Felt requires it.
		page_id: FeltIdSchema,
		name: z.string().optional(),
	})
	.strict();

export type PrintPagesCreateLayoutInput = z.infer<
	typeof PrintPagesCreateLayoutInputSchema
>;
export const PrintPagesCreateLayoutResponseSchema = PrintLayoutSchema;
export type PrintPagesCreateLayoutResponse = z.infer<
	typeof PrintPagesCreateLayoutResponseSchema
>;

export const PrintPagesUpdateLayoutInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layout_id: FeltIdSchema,
		name: z.string().optional(),
		page_id: z.string().optional(),
	})
	.strict();

export type PrintPagesUpdateLayoutInput = z.infer<
	typeof PrintPagesUpdateLayoutInputSchema
>;
export const PrintPagesUpdateLayoutResponseSchema = PrintLayoutSchema;
export type PrintPagesUpdateLayoutResponse = z.infer<
	typeof PrintPagesUpdateLayoutResponseSchema
>;

export const PrintPagesDeleteLayoutInputSchema = z
	.object({
		map_id: FeltIdSchema,
		layout_id: FeltIdSchema,
	})
	.strict();

export type PrintPagesDeleteLayoutInput = z.infer<
	typeof PrintPagesDeleteLayoutInputSchema
>;
export const PrintPagesDeleteLayoutResponseSchema = FeltDeletedResponseSchema;
export type PrintPagesDeleteLayoutResponse = z.infer<
	typeof PrintPagesDeleteLayoutResponseSchema
>;

export const PrintPageItemSchema = z
	.object({
		id: z.string().optional(),
		type: z.string().optional(),
		align: z.string().optional(),
		color: z.string().nullable().optional(),
		// `unknown` because a border is an object of color and width that Felt may extend.
		border: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.passthrough();

export const PrintPageSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		url: z.string().optional(),
		// `unknown` because page dimensions and margins are flexible JSON objects.
		page: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because export output settings accept format and DPI parameters.
		output: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type PrintPage = z.infer<typeof PrintPageSchema>;

export const PrintPageDetailSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		url: z.string().optional(),
		// `unknown` because page dimensions and margins are flexible JSON objects.
		page: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because export output settings accept format and DPI parameters.
		output: z.record(z.string(), z.unknown()).optional(),
		items: z.array(PrintPageItemSchema).optional(),
	})
	.passthrough();

export type PrintPageDetail = z.infer<typeof PrintPageDetailSchema>;

export const PrintPagesListPagesInputSchema = z
	.object({
		map_id: FeltIdSchema,
	})
	.strict();

export type PrintPagesListPagesInput = z.infer<
	typeof PrintPagesListPagesInputSchema
>;
export const PrintPagesListPagesResponseSchema = z.array(PrintPageSchema);
export type PrintPagesListPagesResponse = z.infer<
	typeof PrintPagesListPagesResponseSchema
>;

export const PrintPagesCreatePageInputSchema = z
	.object({
		map_id: FeltIdSchema,
		name: z.string().optional(),
		layout_id: z.string().optional(),
		// `unknown` because page dimensions and map views are dynamic specifications.
		page: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because export output settings accept format and DPI parameters.
		output: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because map_view configuration accepts flexible zoom and center parameters.
		map_view: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because items are arbitrary print page element specifications.
		items: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.strict();

export type PrintPagesCreatePageInput = z.infer<
	typeof PrintPagesCreatePageInputSchema
>;
export const PrintPagesCreatePageResponseSchema = PrintPageDetailSchema;
export type PrintPagesCreatePageResponse = z.infer<
	typeof PrintPagesCreatePageResponseSchema
>;

export const PrintPagesGetPageInputSchema = z
	.object({
		map_id: FeltIdSchema,
		page_id: FeltIdSchema,
	})
	.strict();

export type PrintPagesGetPageInput = z.infer<
	typeof PrintPagesGetPageInputSchema
>;
export const PrintPagesGetPageResponseSchema = PrintPageDetailSchema;
export type PrintPagesGetPageResponse = z.infer<
	typeof PrintPagesGetPageResponseSchema
>;

export const PrintPagesUpdatePageInputSchema = z
	.object({
		map_id: FeltIdSchema,
		page_id: FeltIdSchema,
		name: z.string().optional(),
		// `unknown` because page dimensions and margins are flexible JSON objects.
		page: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because export output settings accept format and DPI parameters.
		output: z.record(z.string(), z.unknown()).optional(),
		position: z.number().optional(),
	})
	.strict();

export type PrintPagesUpdatePageInput = z.infer<
	typeof PrintPagesUpdatePageInputSchema
>;
export const PrintPagesUpdatePageResponseSchema = PrintPageDetailSchema;
export type PrintPagesUpdatePageResponse = z.infer<
	typeof PrintPagesUpdatePageResponseSchema
>;

export const PrintPagesDeletePageInputSchema = z
	.object({
		map_id: FeltIdSchema,
		page_id: FeltIdSchema,
	})
	.strict();

export type PrintPagesDeletePageInput = z.infer<
	typeof PrintPagesDeletePageInputSchema
>;
export const PrintPagesDeletePageResponseSchema = FeltDeletedResponseSchema;
export type PrintPagesDeletePageResponse = z.infer<
	typeof PrintPagesDeletePageResponseSchema
>;

export const PrintPagesExportPageInputSchema = z
	.object({
		map_id: FeltIdSchema,
		page_id: FeltIdSchema,
	})
	.strict();

export type PrintPagesExportPageInput = z.infer<
	typeof PrintPagesExportPageInputSchema
>;

export const PrintPageExportSchema = z
	.object({
		id: z.string(),
		page_id: z.string().optional(),
		filename: z.string().optional(),
		download_url: z.string().nullable().optional(),
		expires_at: z.string().optional(),
	})
	.passthrough();

export type PrintPageExport = z.infer<typeof PrintPageExportSchema>;
export const PrintPagesExportPageResponseSchema = PrintPageExportSchema;
export type PrintPagesExportPageResponse = z.infer<
	typeof PrintPagesExportPageResponseSchema
>;

export const PrintPagesUpsertItemsInputSchema = z
	.object({
		map_id: FeltIdSchema,
		page_id: FeltIdSchema,
		// `unknown` because print page items are variable layout elements (legends, text, maps).
		items: z.array(z.record(z.string(), z.unknown())),
	})
	.strict();

export type PrintPagesUpsertItemsInput = z.infer<
	typeof PrintPagesUpsertItemsInputSchema
>;
export const PrintPagesUpsertItemsResponseSchema = PrintPageDetailSchema;
export type PrintPagesUpsertItemsResponse = z.infer<
	typeof PrintPagesUpsertItemsResponseSchema
>;

export const PrintPagesDeleteItemInputSchema = z
	.object({
		map_id: FeltIdSchema,
		page_id: FeltIdSchema,
		item_id: FeltIdSchema,
	})
	.strict();

export type PrintPagesDeleteItemInput = z.infer<
	typeof PrintPagesDeleteItemInputSchema
>;
export const PrintPagesDeleteItemResponseSchema = FeltDeletedResponseSchema;
export type PrintPagesDeleteItemResponse = z.infer<
	typeof PrintPagesDeleteItemResponseSchema
>;

// ── Registry Schemas ───────────────────────────────────────────────────────

export const FeltEndpointInputSchemas = {
	usersGetCurrent: UsersGetCurrentInputSchema,
	mapsCreate: MapsCreateInputSchema,
	mapsGet: MapsGetInputSchema,
	mapsUpdate: MapsUpdateInputSchema,
	mapsDelete: MapsDeleteInputSchema,
	mapsDuplicate: MapsDuplicateInputSchema,
	mapsMove: MapsMoveInputSchema,
	mapsExportImage: MapsExportImageInputSchema,
	mapsCreateEmbedToken: MapsCreateEmbedTokenInputSchema,
	layersList: LayersListInputSchema,
	layersGet: LayersGetInputSchema,
	layersUpdate: LayersUpdateInputSchema,
	layersDelete: LayersDeleteInputSchema,
	layersUpload: LayersUploadInputSchema,
	layersAddFromSource: LayersAddFromSourceInputSchema,
	layersRefresh: LayersRefreshInputSchema,
	layersUpdateStyle: LayersUpdateStyleInputSchema,
	layersPublish: LayersPublishInputSchema,
	layersCreateCustomExport: LayersCreateCustomExportInputSchema,
	layersPollCustomExport: LayersPollCustomExportInputSchema,
	layersGetExportLink: LayersGetExportLinkInputSchema,
	layersDuplicate: LayersDuplicateInputSchema,
	layersListLibrary: LayersListLibraryInputSchema,
	layerGroupsList: LayerGroupsListInputSchema,
	layerGroupsGet: LayerGroupsGetInputSchema,
	layerGroupsUpdate: LayerGroupsUpdateInputSchema,
	layerGroupsUpdateBulk: LayerGroupsUpdateBulkInputSchema,
	layerGroupsDelete: LayerGroupsDeleteInputSchema,
	layerGroupsPublish: LayerGroupsPublishInputSchema,
	layerComponentsList: LayerComponentsListInputSchema,
	layerComponentsCreate: LayerComponentsCreateInputSchema,
	layerComponentsGet: LayerComponentsGetInputSchema,
	layerComponentsUpdate: LayerComponentsUpdateInputSchema,
	layerComponentsDelete: LayerComponentsDeleteInputSchema,
	elementsList: ElementsListInputSchema,
	elementsUpsert: ElementsUpsertInputSchema,
	elementsDelete: ElementsDeleteInputSchema,
	elementsListGroups: ElementsListGroupsInputSchema,
	elementsGetGroup: ElementsGetGroupInputSchema,
	elementsUpsertGroups: ElementsUpsertGroupsInputSchema,
	commentsExport: CommentsExportInputSchema,
	commentsResolve: CommentsResolveInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	sourcesList: SourcesListInputSchema,
	sourcesCreate: SourcesCreateInputSchema,
	sourcesGet: SourcesGetInputSchema,
	sourcesUpdate: SourcesUpdateInputSchema,
	sourcesDelete: SourcesDeleteInputSchema,
	sourcesSync: SourcesSyncInputSchema,
	sourcesCreateCredential: SourcesCreateCredentialInputSchema,
	sourcesUpdateCredential: SourcesUpdateCredentialInputSchema,
	sourcesDeleteCredential: SourcesDeleteCredentialInputSchema,
	printPagesListLayouts: PrintPagesListLayoutsInputSchema,
	printPagesCreateLayout: PrintPagesCreateLayoutInputSchema,
	printPagesUpdateLayout: PrintPagesUpdateLayoutInputSchema,
	printPagesDeleteLayout: PrintPagesDeleteLayoutInputSchema,
	printPagesListPages: PrintPagesListPagesInputSchema,
	printPagesCreatePage: PrintPagesCreatePageInputSchema,
	printPagesGetPage: PrintPagesGetPageInputSchema,
	printPagesUpdatePage: PrintPagesUpdatePageInputSchema,
	printPagesDeletePage: PrintPagesDeletePageInputSchema,
	printPagesExportPage: PrintPagesExportPageInputSchema,
	printPagesUpsertItems: PrintPagesUpsertItemsInputSchema,
	printPagesDeleteItem: PrintPagesDeleteItemInputSchema,
} as const;

export const FeltEndpointOutputSchemas = {
	usersGetCurrent: UsersGetCurrentResponseSchema,
	mapsCreate: MapsCreateResponseSchema,
	mapsGet: MapsGetResponseSchema,
	mapsUpdate: MapsUpdateResponseSchema,
	mapsDelete: MapsDeleteResponseSchema,
	mapsDuplicate: MapsDuplicateResponseSchema,
	mapsMove: MapsMoveResponseSchema,
	mapsExportImage: MapsExportImageResponseSchema,
	mapsCreateEmbedToken: MapsCreateEmbedTokenResponseSchema,
	layersList: LayersListResponseSchema,
	layersGet: LayersGetResponseSchema,
	layersUpdate: LayersUpdateResponseSchema,
	layersDelete: LayersDeleteResponseSchema,
	layersUpload: LayersUploadResponseSchema,
	layersAddFromSource: LayersAddFromSourceResponseSchema,
	layersRefresh: LayersRefreshResponseSchema,
	layersUpdateStyle: LayersUpdateStyleResponseSchema,
	layersPublish: LayersPublishResponseSchema,
	layersCreateCustomExport: LayersCreateCustomExportResponseSchema,
	layersPollCustomExport: LayersPollCustomExportResponseSchema,
	layersGetExportLink: LayersGetExportLinkResponseSchema,
	layersDuplicate: LayersDuplicateResponseSchema,
	layersListLibrary: LayersListLibraryResponseSchema,
	layerGroupsList: LayerGroupsListResponseSchema,
	layerGroupsGet: LayerGroupsGetResponseSchema,
	layerGroupsUpdate: LayerGroupsUpdateResponseSchema,
	layerGroupsUpdateBulk: LayerGroupsUpdateBulkResponseSchema,
	layerGroupsDelete: LayerGroupsDeleteResponseSchema,
	layerGroupsPublish: LayerGroupsPublishResponseSchema,
	layerComponentsList: LayerComponentsListResponseSchema,
	layerComponentsCreate: LayerComponentsCreateResponseSchema,
	layerComponentsGet: LayerComponentsGetResponseSchema,
	layerComponentsUpdate: LayerComponentsUpdateResponseSchema,
	layerComponentsDelete: LayerComponentsDeleteResponseSchema,
	elementsList: ElementsListResponseSchema,
	elementsUpsert: ElementsUpsertResponseSchema,
	elementsDelete: ElementsDeleteResponseSchema,
	elementsListGroups: ElementsListGroupsResponseSchema,
	elementsGetGroup: ElementsGetGroupResponseSchema,
	elementsUpsertGroups: ElementsUpsertGroupsResponseSchema,
	commentsExport: CommentsExportResponseSchema,
	commentsResolve: CommentsResolveResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	sourcesList: SourcesListResponseSchema,
	sourcesCreate: SourcesCreateResponseSchema,
	sourcesGet: SourcesGetResponseSchema,
	sourcesUpdate: SourcesUpdateResponseSchema,
	sourcesDelete: SourcesDeleteResponseSchema,
	sourcesSync: SourcesSyncResponseSchema,
	sourcesCreateCredential: SourcesCreateCredentialResponseSchema,
	sourcesUpdateCredential: SourcesUpdateCredentialResponseSchema,
	sourcesDeleteCredential: SourcesDeleteCredentialResponseSchema,
	printPagesListLayouts: PrintPagesListLayoutsResponseSchema,
	printPagesCreateLayout: PrintPagesCreateLayoutResponseSchema,
	printPagesUpdateLayout: PrintPagesUpdateLayoutResponseSchema,
	printPagesDeleteLayout: PrintPagesDeleteLayoutResponseSchema,
	printPagesListPages: PrintPagesListPagesResponseSchema,
	printPagesCreatePage: PrintPagesCreatePageResponseSchema,
	printPagesGetPage: PrintPagesGetPageResponseSchema,
	printPagesUpdatePage: PrintPagesUpdatePageResponseSchema,
	printPagesDeletePage: PrintPagesDeletePageResponseSchema,
	printPagesExportPage: PrintPagesExportPageResponseSchema,
	printPagesUpsertItems: PrintPagesUpsertItemsResponseSchema,
	printPagesDeleteItem: PrintPagesDeleteItemResponseSchema,
} as const;

export type FeltEndpointInputs = {
	usersGetCurrent: UsersGetCurrentInput;
	mapsCreate: MapsCreateInput;
	mapsGet: MapsGetInput;
	mapsUpdate: MapsUpdateInput;
	mapsDelete: MapsDeleteInput;
	mapsDuplicate: MapsDuplicateInput;
	mapsMove: MapsMoveInput;
	mapsExportImage: MapsExportImageInput;
	mapsCreateEmbedToken: MapsCreateEmbedTokenInput;
	layersList: LayersListInput;
	layersGet: LayersGetInput;
	layersUpdate: LayersUpdateInput;
	layersDelete: LayersDeleteInput;
	layersUpload: LayersUploadInput;
	layersAddFromSource: LayersAddFromSourceInput;
	layersRefresh: LayersRefreshInput;
	layersUpdateStyle: LayersUpdateStyleInput;
	layersPublish: LayersPublishInput;
	layersCreateCustomExport: LayersCreateCustomExportInput;
	layersPollCustomExport: LayersPollCustomExportInput;
	layersGetExportLink: LayersGetExportLinkInput;
	layersDuplicate: LayersDuplicateInput;
	layersListLibrary: LayersListLibraryInput;
	layerGroupsList: LayerGroupsListInput;
	layerGroupsGet: LayerGroupsGetInput;
	layerGroupsUpdate: LayerGroupsUpdateInput;
	layerGroupsUpdateBulk: LayerGroupsUpdateBulkInput;
	layerGroupsDelete: LayerGroupsDeleteInput;
	layerGroupsPublish: LayerGroupsPublishInput;
	layerComponentsList: LayerComponentsListInput;
	layerComponentsCreate: LayerComponentsCreateInput;
	layerComponentsGet: LayerComponentsGetInput;
	layerComponentsUpdate: LayerComponentsUpdateInput;
	layerComponentsDelete: LayerComponentsDeleteInput;
	elementsList: ElementsListInput;
	elementsUpsert: ElementsUpsertInput;
	elementsDelete: ElementsDeleteInput;
	elementsListGroups: ElementsListGroupsInput;
	elementsGetGroup: ElementsGetGroupInput;
	elementsUpsertGroups: ElementsUpsertGroupsInput;
	commentsExport: CommentsExportInput;
	commentsResolve: CommentsResolveInput;
	commentsDelete: CommentsDeleteInput;
	projectsList: ProjectsListInput;
	projectsCreate: ProjectsCreateInput;
	projectsGet: ProjectsGetInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	sourcesList: SourcesListInput;
	sourcesCreate: SourcesCreateInput;
	sourcesGet: SourcesGetInput;
	sourcesUpdate: SourcesUpdateInput;
	sourcesDelete: SourcesDeleteInput;
	sourcesSync: SourcesSyncInput;
	sourcesCreateCredential: SourcesCreateCredentialInput;
	sourcesUpdateCredential: SourcesUpdateCredentialInput;
	sourcesDeleteCredential: SourcesDeleteCredentialInput;
	printPagesListLayouts: PrintPagesListLayoutsInput;
	printPagesCreateLayout: PrintPagesCreateLayoutInput;
	printPagesUpdateLayout: PrintPagesUpdateLayoutInput;
	printPagesDeleteLayout: PrintPagesDeleteLayoutInput;
	printPagesListPages: PrintPagesListPagesInput;
	printPagesCreatePage: PrintPagesCreatePageInput;
	printPagesGetPage: PrintPagesGetPageInput;
	printPagesUpdatePage: PrintPagesUpdatePageInput;
	printPagesDeletePage: PrintPagesDeletePageInput;
	printPagesExportPage: PrintPagesExportPageInput;
	printPagesUpsertItems: PrintPagesUpsertItemsInput;
	printPagesDeleteItem: PrintPagesDeleteItemInput;
};

export type FeltEndpointOutputs = {
	usersGetCurrent: UsersGetCurrentResponse;
	mapsCreate: MapsCreateResponse;
	mapsGet: MapsGetResponse;
	mapsUpdate: MapsUpdateResponse;
	mapsDelete: MapsDeleteResponse;
	mapsDuplicate: MapsDuplicateResponse;
	mapsMove: MapsMoveResponse;
	mapsExportImage: MapsExportImageResponse;
	mapsCreateEmbedToken: MapsCreateEmbedTokenResponse;
	layersList: LayersListResponse;
	layersGet: LayersGetResponse;
	layersUpdate: LayersUpdateResponse;
	layersDelete: LayersDeleteResponse;
	layersUpload: LayersUploadResponse;
	layersAddFromSource: LayersAddFromSourceResponse;
	layersRefresh: LayersRefreshResponse;
	layersUpdateStyle: LayersUpdateStyleResponse;
	layersPublish: LayersPublishResponse;
	layersCreateCustomExport: LayersCreateCustomExportResponse;
	layersPollCustomExport: LayersPollCustomExportResponse;
	layersGetExportLink: LayersGetExportLinkResponse;
	layersDuplicate: LayersDuplicateResponse;
	layersListLibrary: LayersListLibraryResponse;
	layerGroupsList: LayerGroupsListResponse;
	layerGroupsGet: LayerGroupsGetResponse;
	layerGroupsUpdate: LayerGroupsUpdateResponse;
	layerGroupsUpdateBulk: LayerGroupsUpdateBulkResponse;
	layerGroupsDelete: LayerGroupsDeleteResponse;
	layerGroupsPublish: LayerGroupsPublishResponse;
	layerComponentsList: LayerComponentsListResponse;
	layerComponentsCreate: LayerComponentsCreateResponse;
	layerComponentsGet: LayerComponentsGetResponse;
	layerComponentsUpdate: LayerComponentsUpdateResponse;
	layerComponentsDelete: LayerComponentsDeleteResponse;
	elementsList: ElementsListResponse;
	elementsUpsert: ElementsUpsertResponse;
	elementsDelete: ElementsDeleteResponse;
	elementsListGroups: ElementsListGroupsResponse;
	elementsGetGroup: ElementsGetGroupResponse;
	elementsUpsertGroups: ElementsUpsertGroupsResponse;
	commentsExport: CommentsExportResponse;
	commentsResolve: CommentsResolveResponse;
	commentsDelete: CommentsDeleteResponse;
	projectsList: ProjectsListResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsGet: ProjectsGetResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsDelete: ProjectsDeleteResponse;
	sourcesList: SourcesListResponse;
	sourcesCreate: SourcesCreateResponse;
	sourcesGet: SourcesGetResponse;
	sourcesUpdate: SourcesUpdateResponse;
	sourcesDelete: SourcesDeleteResponse;
	sourcesSync: SourcesSyncResponse;
	sourcesCreateCredential: SourcesCreateCredentialResponse;
	sourcesUpdateCredential: SourcesUpdateCredentialResponse;
	sourcesDeleteCredential: SourcesDeleteCredentialResponse;
	printPagesListLayouts: PrintPagesListLayoutsResponse;
	printPagesCreateLayout: PrintPagesCreateLayoutResponse;
	printPagesUpdateLayout: PrintPagesUpdateLayoutResponse;
	printPagesDeleteLayout: PrintPagesDeleteLayoutResponse;
	printPagesListPages: PrintPagesListPagesResponse;
	printPagesCreatePage: PrintPagesCreatePageResponse;
	printPagesGetPage: PrintPagesGetPageResponse;
	printPagesUpdatePage: PrintPagesUpdatePageResponse;
	printPagesDeletePage: PrintPagesDeletePageResponse;
	printPagesExportPage: PrintPagesExportPageResponse;
	printPagesUpsertItems: PrintPagesUpsertItemsResponse;
	printPagesDeleteItem: PrintPagesDeleteItemResponse;
};
