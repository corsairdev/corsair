import { z } from 'zod';

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const FigmaUserSchema = z.object({
	id: z.string(),
	handle: z.string().optional(),
	img_url: z.string().optional(),
});

const FigmaReactionSchema = z.object({
	user: FigmaUserSchema.optional(),
	emoji: z.string().optional(),
	created_at: z.string().optional(),
});

const FigmaCommentSchema = z.object({
	id: z.string(),
	uuid: z.string().nullable().optional(),
	message: z.string().optional(),
	file_key: z.string().optional(),
	order_id: z.string().nullable().optional(),
	parent_id: z.string().nullable().optional(),
	reactions: z.array(FigmaReactionSchema).optional(),
	created_at: z.string().optional(),
	// any: client_meta has multiple valid shapes (absolute coords, node-relative, or region)
	client_meta: z.unknown().optional(),
	resolved_at: z.string().nullable().optional(),
	user: FigmaUserSchema.optional(),
});

const FigmaWebhookConfigSchema = z.object({
	id: z.string(),
	status: z.enum(['ACTIVE', 'PAUSED']).optional(),
	context: z.enum(['team', 'project', 'file']).nullable().optional(),
	team_id: z.string().nullable().optional(),
	endpoint: z.string().optional(),
	passcode: z.string().optional(),
	client_id: z.string().nullable().optional(),
	context_id: z.string().nullable().optional(),
	event_type: z.string().optional(),
	description: z.string().nullable().optional(),
});

const FigmaComponentSchema = z.object({
	key: z.string(),
	file_key: z.string().optional(),
	node_id: z.string().optional(),
	thumbnail_url: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	containing_frame: z
		.object({ name: z.string().optional(), node_id: z.string().optional() })
		.optional(),
	user: FigmaUserSchema.optional(),
});

// ── Comments ──────────────────────────────────────────────────────────────────

const CommentsAddInputSchema = z.object({
	message: z.string(),
	file_key: z.string(),
	comment_id: z.string().optional(),
	// any: client_meta can be absolute coords, node-relative, or region object
	client_meta: z.unknown().optional(),
});

const CommentsAddResponseSchema = FigmaCommentSchema;

const CommentsDeleteInputSchema = z.object({
	file_key: z.string(),
	comment_id: z.string(),
});

const CommentsDeleteResponseSchema = z.object({
	status: z.number().optional(),
	error: z.boolean().optional(),
});

const CommentsListInputSchema = z.object({
	file_key: z.string(),
	as_md: z.boolean().optional(),
});

const CommentsListResponseSchema = z.object({
	comments: z.array(FigmaCommentSchema).optional(),
});

const CommentsGetReactionsInputSchema = z.object({
	file_key: z.string(),
	comment_id: z.string(),
	cursor: z.string().optional(),
});

const CommentsGetReactionsResponseSchema = z.object({
	reactions: z.array(FigmaReactionSchema).optional(),
	pagination: z.object({ cursor: z.string().optional() }).optional(),
});

const CommentsAddReactionInputSchema = z.object({
	file_key: z.string(),
	comment_id: z.string(),
	emoji: z.string(),
});

const CommentsAddReactionResponseSchema = z.object({
	status: z.number().optional(),
	error: z.boolean().optional(),
});

const CommentsDeleteReactionInputSchema = z.object({
	file_key: z.string(),
	comment_id: z.string(),
	emoji: z.string(),
});

const CommentsDeleteReactionResponseSchema = z.object({
	status: z.number().optional(),
	error: z.boolean().optional(),
});

// ── Webhooks ──────────────────────────────────────────────────────────────────

const WebhooksCreateInputSchema = z.object({
	event_type: z.string(),
	endpoint: z.string(),
	passcode: z.string(),
	status: z.enum(['ACTIVE', 'PAUSED']).optional(),
	context: z.string().optional(),
	context_id: z.string().optional(),
	team_id: z.string().optional(),
	description: z.string().optional(),
});

const WebhooksCreateResponseSchema = FigmaWebhookConfigSchema;

const WebhooksDeleteInputSchema = z.object({
	webhook_id: z.string(),
});

const WebhooksDeleteResponseSchema = z.object({
	id: z.string().optional(),
	status: z.enum(['ACTIVE', 'PAUSED']).optional(),
	context: z.enum(['team', 'project', 'file']).nullable().optional(),
	team_id: z.string().nullable().optional(),
	endpoint: z.string().optional(),
	passcode: z.string().optional(),
	client_id: z.string().nullable().optional(),
	context_id: z.string().nullable().optional(),
	event_type: z.string().optional(),
	description: z.string().nullable().optional(),
});

const WebhooksGetInputSchema = z.object({
	webhook_id: z.string(),
});

const WebhooksGetResponseSchema = z.object({
	id: z.string(),
	status: z.enum(['ACTIVE', 'PAUSED']).optional(),
	context: z.enum(['team', 'project', 'file']).nullable().optional(),
	team_id: z.string().nullable().optional(),
	endpoint: z.string().optional(),
	passcode: z.string().optional(),
	client_id: z.string().nullable().optional(),
	context_id: z.string().nullable().optional(),
	event_type: z.string().optional(),
	description: z.string().nullable().optional(),
});

const WebhooksListInputSchema = z.object({
	context: z.string().optional(),
	context_id: z.string().optional(),
});

const WebhooksListResponseSchema = z.object({
	webhooks: z.array(FigmaWebhookConfigSchema).optional(),
});

const WebhooksGetRequestsInputSchema = z.object({
	webhook_id: z.string(),
});

const WebhooksGetRequestsResponseSchema = z.object({
	requests: z
		.array(
			z.object({
				id: z.string(),
				webhook_id: z.string(),
				status: z.string().optional(),
				created_at: z.string().optional(),
				error: z.object({}).passthrough().optional(),
			}),
		)
		.optional(),
});

const WebhooksUpdateInputSchema = z.object({
	webhook_id: z.string(),
	event_type: z.string().optional(),
	endpoint: z.string().optional(),
	passcode: z.string().optional(),
	status: z.enum(['ACTIVE', 'PAUSED']).optional(),
	description: z.string().optional(),
});

const WebhooksUpdateResponseSchema = FigmaWebhookConfigSchema;

// ── Dev Resources ─────────────────────────────────────────────────────────────

const DevResourcesCreateInputSchema = z.object({
	dev_resources: z.array(
		z.object({
			url: z.string(),
			name: z.string(),
			node_id: z.string(),
			file_key: z.string(),
		}),
	),
});

const DevResourcesCreateResponseSchema = z.object({
	links_created: z
		.array(
			z.object({
				id: z.string(),
				url: z.string(),
				name: z.string(),
				node_id: z.string(),
				file_key: z.string(),
			}),
		)
		.optional(),
	errors: z
		.array(
			z.object({
				error: z.string(),
				node_id: z.string().optional(),
				file_key: z.string().optional(),
			}),
		)
		.optional(),
});

const DevResourcesDeleteInputSchema = z.object({
	file_key: z.string(),
	dev_resource_id: z.string(),
});

const DevResourcesDeleteResponseSchema = z.object({});

const DevResourcesGetInputSchema = z.object({
	file_key: z.string(),
	node_ids: z.string().optional(),
});

const DevResourcesGetResponseSchema = z.object({
	dev_resources: z
		.array(
			z.object({
				id: z.string(),
				url: z.string(),
				name: z.string(),
				node_id: z.string(),
				file_key: z.string(),
			}),
		)
		.optional(),
});

const DevResourcesUpdateInputSchema = z.object({
	dev_resources: z.array(
		z.object({
			id: z.string(),
			url: z.string().optional(),
			name: z.string().optional(),
		}),
	),
});

const DevResourcesUpdateResponseSchema = z.object({
	links_updated: z
		.array(
			z.object({
				id: z.string(),
				url: z.string().optional(),
				name: z.string().optional(),
			}),
		)
		.optional(),
	errors: z
		.array(
			z.object({
				error: z.string(),
				dev_resource_id: z.string().optional(),
			}),
		)
		.optional(),
});

// ── Variables ─────────────────────────────────────────────────────────────────

const VariablesCreateModifyDeleteInputSchema = z.object({
	file_key: z.string(),
	// any: variable change objects have polymorphic structure based on action type
	variables: z.array(z.unknown()).optional(),
	// any: variable change objects have polymorphic structure based on action type
	variableModes: z.array(z.unknown()).optional(),
	// any: variable change objects have polymorphic structure based on action type
	variableModeValues: z.array(z.unknown()).optional(),
	// any: variable change objects have polymorphic structure based on action type
	variableCollections: z.array(z.unknown()).optional(),
});

const VariablesCreateModifyDeleteResponseSchema = z.object({
	meta: z
		.object({
			tempIdToRealId: z.record(z.string()).optional(),
		})
		.optional(),
	status: z.number().optional(),
	error: z.boolean().optional(),
});

const VariablesGetLocalInputSchema = z.object({
	file_key: z.string(),
});

const VariablesGetLocalResponseSchema = z.object({
	meta: z
		.object({
			// any: variable data structure is deeply nested and provider-defined
			variables: z.record(z.unknown()).optional(),
			// any: variable data structure is deeply nested and provider-defined
			variableCollections: z.record(z.unknown()).optional(),
		})
		.optional(),
	status: z.number().optional(),
	error: z.boolean().optional(),
});

const VariablesGetPublishedInputSchema = z.object({
	file_key: z.string(),
});

const VariablesGetPublishedResponseSchema = z.object({
	meta: z
		.object({
			// any: variable data structure is deeply nested and provider-defined
			variables: z.record(z.unknown()).optional(),
			// any: variable data structure is deeply nested and provider-defined
			variableCollections: z.record(z.unknown()).optional(),
		})
		.optional(),
	status: z.number().optional(),
	error: z.boolean().optional(),
});

// ── Components ────────────────────────────────────────────────────────────────

const ComponentsGetInputSchema = z.object({
	key: z.string(),
});

const ComponentsGetResponseSchema = z.object({
	meta: z
		.object({
			component: FigmaComponentSchema.optional(),
		})
		.optional(),
	status: z.number().optional(),
});

const ComponentSetsGetInputSchema = z.object({
	key: z.string(),
});

const ComponentSetsGetResponseSchema = z.object({
	meta: z
		.object({
			component_set: z
				.object({
					key: z.string(),
					name: z.string().optional(),
					description: z.string().optional(),
					thumbnail_url: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	status: z.number().optional(),
});

const ComponentsGetForFileInputSchema = z.object({
	file_key: z.string(),
});

const ComponentsGetForFileResponseSchema = z.object({
	meta: z
		.object({
			components: z.array(FigmaComponentSchema).optional(),
		})
		.optional(),
	status: z.number().optional(),
});

const ComponentSetsGetForFileInputSchema = z.object({
	file_key: z.string(),
});

const ComponentSetsGetForFileResponseSchema = z.object({
	meta: z
		.object({
			component_sets: z
				.array(z.object({ key: z.string(), name: z.string().optional() }))
				.optional(),
		})
		.optional(),
});

const ComponentsGetForTeamInputSchema = z.object({
	team_id: z.string(),
	page_size: z.number().optional(),
	after: z.number().optional(),
	before: z.number().optional(),
});

const ComponentsGetForTeamResponseSchema = z.object({
	meta: z
		.object({
			components: z.array(FigmaComponentSchema).optional(),
		})
		.optional(),
	cursor: z.string().optional(),
});

const ComponentSetsGetForTeamInputSchema = z.object({
	team_id: z.string(),
	page_size: z.number().optional(),
	after: z.number().optional(),
	before: z.number().optional(),
});

const ComponentSetsGetForTeamResponseSchema = z.object({
	meta: z
		.object({
			component_sets: z
				.array(z.object({ key: z.string(), name: z.string().optional() }))
				.optional(),
		})
		.optional(),
	cursor: z.string().optional(),
});

// ── Files ─────────────────────────────────────────────────────────────────────

const FilesGetJSONInputSchema = z.object({
	file_key: z.string(),
	version: z.string().optional(),
	ids: z.string().optional(),
	depth: z.number().optional(),
	geometry: z.string().optional(),
	plugin_data: z.string().optional(),
	branch_data: z.boolean().optional(),
	simplify: z.boolean().optional(),
	include_raw: z.boolean().optional(),
});

const FilesGetJSONResponseSchema = z.object({
	name: z.string().optional(),
	role: z.string().optional(),
	lastModified: z.string().optional(),
	editorType: z.string().optional(),
	thumbnailUrl: z.string().optional(),
	version: z.string().optional(),
	// any: Figma document tree has recursive node structure
	document: z.unknown().optional(),
	// any: Figma document tree has recursive node structure
	components: z.record(z.unknown()).optional(),
	// any: Figma document tree has recursive node structure
	styles: z.record(z.unknown()).optional(),
});

const FilesGetMetadataInputSchema = z.object({
	file_key: z.string(),
});

const FilesGetMetadataResponseSchema = z.object({
	name: z.string().optional(),
	role: z.string().optional(),
	last_modified: z.string().optional(),
	editorType: z.string().optional(),
	thumbnail_url: z.string().optional(),
	version: z.string().optional(),
});

const FilesGetNodesInputSchema = z.object({
	file_key: z.string(),
	ids: z.string(),
	version: z.string().optional(),
	depth: z.number().optional(),
	geometry: z.string().optional(),
	plugin_data: z.string().optional(),
});

const FilesGetNodesResponseSchema = z.object({
	name: z.string().optional(),
	// any: node structure varies by node type
	nodes: z.record(z.unknown()).optional(),
});

const FilesGetStylesInputSchema = z.object({
	file_key: z.string(),
});

const FilesGetStylesResponseSchema = z.object({
	meta: z
		.object({
			styles: z
				.array(
					z.object({
						key: z.string(),
						file_key: z.string().optional(),
						node_id: z.string().optional(),
						style_type: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});

const FilesGetImageFillsInputSchema = z.object({
	file_key: z.string(),
});

const FilesGetImageFillsResponseSchema = z.object({
	meta: z
		.object({
			images: z.record(z.string()).optional(),
		})
		.optional(),
	error: z.boolean().optional(),
});

const FilesGetVersionsInputSchema = z.object({
	file_key: z.string(),
	page_size: z.number().optional(),
	before: z.number().optional(),
	after: z.number().optional(),
});

const FilesGetVersionsResponseSchema = z.object({
	versions: z
		.array(
			z.object({
				id: z.string(),
				created_at: z.string().optional(),
				label: z.string().nullable().optional(),
				description: z.string().nullable().optional(),
				user: FigmaUserSchema.optional(),
			}),
		)
		.optional(),
	pagination: z.object({ cursor: z.string().optional() }).optional(),
});

const FilesRenderImagesInputSchema = z.object({
	file_key: z.string(),
	ids: z.string(),
	scale: z.number().optional(),
	format: z.enum(['jpg', 'png', 'svg', 'pdf']).optional(),
	version: z.string().optional(),
	contents_only: z.boolean().optional(),
	svg_include_id: z.boolean().optional(),
	svg_outline_text: z.boolean().optional(),
	svg_include_node_id: z.boolean().optional(),
	svg_simplify_stroke: z.boolean().optional(),
	use_absolute_bounds: z.boolean().optional(),
});

const FilesRenderImagesResponseSchema = z.object({
	images: z.record(z.string().nullable()).optional(),
	err: z.string().nullable().optional(),
});

const FilesGetProjectFilesInputSchema = z.object({
	project_id: z.string(),
	branch_data: z.boolean().optional(),
});

const FilesGetProjectFilesResponseSchema = z.object({
	name: z.string().optional(),
	files: z
		.array(
			z.object({
				key: z.string(),
				name: z.string().optional(),
				thumbnail_url: z.string().nullable().optional(),
				last_modified: z.string().optional(),
			}),
		)
		.optional(),
});

// ── Styles ────────────────────────────────────────────────────────────────────

const StylesGetInputSchema = z.object({
	key: z.string(),
});

const StylesGetResponseSchema = z.object({
	meta: z
		.object({
			style: z
				.object({
					key: z.string(),
					file_key: z.string().optional(),
					node_id: z.string().optional(),
					style_type: z.string().optional(),
					name: z.string().optional(),
					description: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
});

const StylesGetForTeamInputSchema = z.object({
	team_id: z.string(),
	page_size: z.number().optional(),
	after: z.number().optional(),
	before: z.number().optional(),
});

const StylesGetForTeamResponseSchema = z.object({
	meta: z
		.object({
			styles: z
				.array(
					z.object({
						key: z.string(),
						name: z.string().optional(),
						style_type: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});

// ── Projects ──────────────────────────────────────────────────────────────────

const ProjectsGetTeamProjectsInputSchema = z.object({
	team_id: z.string(),
});

const ProjectsGetTeamProjectsResponseSchema = z.object({
	name: z.string().optional(),
	projects: z
		.array(z.object({ id: z.string(), name: z.string().optional() }))
		.optional(),
});

// ── Users ─────────────────────────────────────────────────────────────────────

const UsersGetCurrentInputSchema = z.object({});

const UsersGetCurrentResponseSchema = z.object({
	id: z.string(),
	handle: z.string().optional(),
	img_url: z.string().optional(),
	email: z.string().optional(),
});

// ── Library Analytics ─────────────────────────────────────────────────────────

const LibraryAnalyticsComponentActionsInputSchema = z.object({
	file_key: z.string(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	group_by: z.string().optional(),
	cursor: z.string().optional(),
});

const LibraryAnalyticsComponentActionsResponseSchema = z.object({
	// any: analytics row structure varies by group_by parameter
	rows: z.array(z.unknown()).optional(),
	cursor: z.string().optional(),
	next_page: z.boolean().optional(),
});

const LibraryAnalyticsComponentUsagesInputSchema = z.object({
	file_key: z.string(),
	group_by: z.string().optional(),
	cursor: z.string().optional(),
});

const LibraryAnalyticsComponentUsagesResponseSchema = z.object({
	// any: analytics row structure varies by group_by parameter
	rows: z.array(z.unknown()).optional(),
	cursor: z.string().optional(),
	next_page: z.boolean().optional(),
});

const LibraryAnalyticsStyleActionsInputSchema = z.object({
	file_key: z.string(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	group_by: z.string().optional(),
	cursor: z.string().optional(),
});

const LibraryAnalyticsStyleActionsResponseSchema = z.object({
	// any: analytics row structure varies by group_by parameter
	rows: z.array(z.unknown()).optional(),
	cursor: z.string().optional(),
	next_page: z.boolean().optional(),
});

const LibraryAnalyticsStyleUsagesInputSchema = z.object({
	file_key: z.string(),
	group_by: z.string().optional(),
	cursor: z.string().optional(),
});

const LibraryAnalyticsStyleUsagesResponseSchema = z.object({
	// any: analytics row structure varies by group_by parameter
	rows: z.array(z.unknown()).optional(),
	cursor: z.string().optional(),
	next_page: z.boolean().optional(),
});

const LibraryAnalyticsVariableActionsInputSchema = z.object({
	file_key: z.string(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	group_by: z.string().optional(),
	cursor: z.string().optional(),
});

const LibraryAnalyticsVariableActionsResponseSchema = z.object({
	// any: analytics row structure varies by group_by parameter
	rows: z.array(z.unknown()).optional(),
	cursor: z.string().optional(),
	next_page: z.boolean().optional(),
});

const LibraryAnalyticsVariableUsagesInputSchema = z.object({
	file_key: z.string(),
	group_by: z.string().optional(),
	cursor: z.string().optional(),
});

const LibraryAnalyticsVariableUsagesResponseSchema = z.object({
	// any: analytics row structure varies by group_by parameter
	rows: z.array(z.unknown()).optional(),
	cursor: z.string().optional(),
	next_page: z.boolean().optional(),
});

// ── Activity Logs ─────────────────────────────────────────────────────────────

const ActivityLogsListInputSchema = z.object({
	start_time: z.number().optional(),
	end_time: z.number().optional(),
	limit: z.number().optional(),
	order: z.string().optional(),
	events: z.string().optional(),
});

const ActivityLogsListResponseSchema = z.object({
	// any: activity log entry structure varies by event type
	activity_logs: z.array(z.unknown()).optional(),
	cursor: z.string().optional(),
	next_page: z.boolean().optional(),
});

// ── Payments ──────────────────────────────────────────────────────────────────

const PaymentsGetInputSchema = z.object({
	user_id: z.string().optional(),
	plugin_id: z.string().optional(),
	widget_id: z.string().optional(),
	community_file_id: z.string().optional(),
	plugin_payment_token: z.string().optional(),
});

const PaymentsGetResponseSchema = z.object({
	meta: z
		.object({
			// any: payment info structure varies by resource type
			payment_information: z.unknown().optional(),
		})
		.optional(),
	status: z.number().optional(),
});

// ── Design Tools ──────────────────────────────────────────────────────────────

const DesignToolsDiscoverResourcesInputSchema = z.object({
	figma_url: z.string().optional(),
	file_key: z.string().optional(),
	team_id: z.string().optional(),
	project_id: z.string().optional(),
	max_depth: z.number().optional(),
});

const DesignToolsDiscoverResourcesResponseSchema = z.object({
	// any: discovered resource structure depends on resource type
	files: z.array(z.unknown()).optional(),
	// any: discovered resource structure depends on resource type
	projects: z.array(z.unknown()).optional(),
	// any: discovered resource structure depends on resource type
	teams: z.array(z.unknown()).optional(),
});

const DesignToolsExtractDesignTokensInputSchema = z.object({
	file_key: z.string(),
	include_variables: z.boolean().optional(),
	include_local_styles: z.boolean().optional(),
	extract_from_nodes: z.string().optional(),
});

const DesignToolsExtractDesignTokensResponseSchema = z.object({
	// any: design token structure varies by token type (color, typography, spacing, etc.)
	tokens: z.record(z.unknown()).optional(),
});

const DesignToolsExtractPrototypeInteractionsInputSchema = z.object({
	file_key: z.string(),
	analyze_components: z.boolean().optional(),
	include_animations: z.boolean().optional(),
});

const DesignToolsExtractPrototypeInteractionsResponseSchema = z.object({
	// any: prototype interaction and flow structure varies by interaction type
	interactions: z.array(z.unknown()).optional(),
	// any: prototype interaction and flow structure varies by interaction type
	flows: z.array(z.unknown()).optional(),
});

const DesignToolsDownloadImagesInputSchema = z.object({
	file_key: z.string(),
	images: z.array(z.object({ node_id: z.string() })),
	scale: z.number().optional(),
	svg_include_id: z.boolean().optional(),
	svg_outline_text: z.boolean().optional(),
	svg_simplify_stroke: z.boolean().optional(),
});

const DesignToolsDownloadImagesResponseSchema = z.object({
	images: z.record(z.string().nullable()).optional(),
});

const DesignToolsDesignTokensToTailwindInputSchema = z.object({
	// any: token input map has dynamic keys and values
	tokens: z.record(z.unknown()),
	prefix: z.string().optional(),
	config_format: z.string().optional(),
	include_font_imports: z.boolean().optional(),
});

const DesignToolsDesignTokensToTailwindResponseSchema = z.object({
	config: z.string().optional(),
	css: z.string().optional(),
});

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type FigmaEndpointInputs = {
	commentsAdd: z.infer<typeof CommentsAddInputSchema>;
	commentsDelete: z.infer<typeof CommentsDeleteInputSchema>;
	commentsList: z.infer<typeof CommentsListInputSchema>;
	commentsGetReactions: z.infer<typeof CommentsGetReactionsInputSchema>;
	commentsAddReaction: z.infer<typeof CommentsAddReactionInputSchema>;
	commentsDeleteReaction: z.infer<typeof CommentsDeleteReactionInputSchema>;
	webhooksCreate: z.infer<typeof WebhooksCreateInputSchema>;
	webhooksDelete: z.infer<typeof WebhooksDeleteInputSchema>;
	webhooksGet: z.infer<typeof WebhooksGetInputSchema>;
	webhooksList: z.infer<typeof WebhooksListInputSchema>;
	webhooksGetRequests: z.infer<typeof WebhooksGetRequestsInputSchema>;
	webhooksUpdate: z.infer<typeof WebhooksUpdateInputSchema>;
	devResourcesCreate: z.infer<typeof DevResourcesCreateInputSchema>;
	devResourcesDelete: z.infer<typeof DevResourcesDeleteInputSchema>;
	devResourcesGet: z.infer<typeof DevResourcesGetInputSchema>;
	devResourcesUpdate: z.infer<typeof DevResourcesUpdateInputSchema>;
	variablesCreateModifyDelete: z.infer<
		typeof VariablesCreateModifyDeleteInputSchema
	>;
	variablesGetLocal: z.infer<typeof VariablesGetLocalInputSchema>;
	variablesGetPublished: z.infer<typeof VariablesGetPublishedInputSchema>;
	componentsGet: z.infer<typeof ComponentsGetInputSchema>;
	componentSetsGet: z.infer<typeof ComponentSetsGetInputSchema>;
	componentsGetForFile: z.infer<typeof ComponentsGetForFileInputSchema>;
	componentSetsGetForFile: z.infer<typeof ComponentSetsGetForFileInputSchema>;
	componentsGetForTeam: z.infer<typeof ComponentsGetForTeamInputSchema>;
	componentSetsGetForTeam: z.infer<typeof ComponentSetsGetForTeamInputSchema>;
	filesGetJSON: z.infer<typeof FilesGetJSONInputSchema>;
	filesGetMetadata: z.infer<typeof FilesGetMetadataInputSchema>;
	filesGetNodes: z.infer<typeof FilesGetNodesInputSchema>;
	filesGetStyles: z.infer<typeof FilesGetStylesInputSchema>;
	filesGetImageFills: z.infer<typeof FilesGetImageFillsInputSchema>;
	filesGetVersions: z.infer<typeof FilesGetVersionsInputSchema>;
	filesRenderImages: z.infer<typeof FilesRenderImagesInputSchema>;
	filesGetProjectFiles: z.infer<typeof FilesGetProjectFilesInputSchema>;
	stylesGet: z.infer<typeof StylesGetInputSchema>;
	stylesGetForTeam: z.infer<typeof StylesGetForTeamInputSchema>;
	projectsGetTeamProjects: z.infer<typeof ProjectsGetTeamProjectsInputSchema>;
	usersGetCurrent: z.infer<typeof UsersGetCurrentInputSchema>;
	libraryAnalyticsComponentActions: z.infer<
		typeof LibraryAnalyticsComponentActionsInputSchema
	>;
	libraryAnalyticsComponentUsages: z.infer<
		typeof LibraryAnalyticsComponentUsagesInputSchema
	>;
	libraryAnalyticsStyleActions: z.infer<
		typeof LibraryAnalyticsStyleActionsInputSchema
	>;
	libraryAnalyticsStyleUsages: z.infer<
		typeof LibraryAnalyticsStyleUsagesInputSchema
	>;
	libraryAnalyticsVariableActions: z.infer<
		typeof LibraryAnalyticsVariableActionsInputSchema
	>;
	libraryAnalyticsVariableUsages: z.infer<
		typeof LibraryAnalyticsVariableUsagesInputSchema
	>;
	activityLogsList: z.infer<typeof ActivityLogsListInputSchema>;
	paymentsGet: z.infer<typeof PaymentsGetInputSchema>;
	designToolsDiscoverResources: z.infer<
		typeof DesignToolsDiscoverResourcesInputSchema
	>;
	designToolsExtractDesignTokens: z.infer<
		typeof DesignToolsExtractDesignTokensInputSchema
	>;
	designToolsExtractPrototypeInteractions: z.infer<
		typeof DesignToolsExtractPrototypeInteractionsInputSchema
	>;
	designToolsDownloadImages: z.infer<
		typeof DesignToolsDownloadImagesInputSchema
	>;
	designToolsDesignTokensToTailwind: z.infer<
		typeof DesignToolsDesignTokensToTailwindInputSchema
	>;
};

export type FigmaEndpointOutputs = {
	commentsAdd: z.infer<typeof CommentsAddResponseSchema>;
	commentsDelete: z.infer<typeof CommentsDeleteResponseSchema>;
	commentsList: z.infer<typeof CommentsListResponseSchema>;
	commentsGetReactions: z.infer<typeof CommentsGetReactionsResponseSchema>;
	commentsAddReaction: z.infer<typeof CommentsAddReactionResponseSchema>;
	commentsDeleteReaction: z.infer<typeof CommentsDeleteReactionResponseSchema>;
	webhooksCreate: z.infer<typeof WebhooksCreateResponseSchema>;
	webhooksDelete: z.infer<typeof WebhooksDeleteResponseSchema>;
	webhooksGet: z.infer<typeof WebhooksGetResponseSchema>;
	webhooksList: z.infer<typeof WebhooksListResponseSchema>;
	webhooksGetRequests: z.infer<typeof WebhooksGetRequestsResponseSchema>;
	webhooksUpdate: z.infer<typeof WebhooksUpdateResponseSchema>;
	devResourcesCreate: z.infer<typeof DevResourcesCreateResponseSchema>;
	devResourcesDelete: z.infer<typeof DevResourcesDeleteResponseSchema>;
	devResourcesGet: z.infer<typeof DevResourcesGetResponseSchema>;
	devResourcesUpdate: z.infer<typeof DevResourcesUpdateResponseSchema>;
	variablesCreateModifyDelete: z.infer<
		typeof VariablesCreateModifyDeleteResponseSchema
	>;
	variablesGetLocal: z.infer<typeof VariablesGetLocalResponseSchema>;
	variablesGetPublished: z.infer<typeof VariablesGetPublishedResponseSchema>;
	componentsGet: z.infer<typeof ComponentsGetResponseSchema>;
	componentSetsGet: z.infer<typeof ComponentSetsGetResponseSchema>;
	componentsGetForFile: z.infer<typeof ComponentsGetForFileResponseSchema>;
	componentSetsGetForFile: z.infer<
		typeof ComponentSetsGetForFileResponseSchema
	>;
	componentsGetForTeam: z.infer<typeof ComponentsGetForTeamResponseSchema>;
	componentSetsGetForTeam: z.infer<
		typeof ComponentSetsGetForTeamResponseSchema
	>;
	filesGetJSON: z.infer<typeof FilesGetJSONResponseSchema>;
	filesGetMetadata: z.infer<typeof FilesGetMetadataResponseSchema>;
	filesGetNodes: z.infer<typeof FilesGetNodesResponseSchema>;
	filesGetStyles: z.infer<typeof FilesGetStylesResponseSchema>;
	filesGetImageFills: z.infer<typeof FilesGetImageFillsResponseSchema>;
	filesGetVersions: z.infer<typeof FilesGetVersionsResponseSchema>;
	filesRenderImages: z.infer<typeof FilesRenderImagesResponseSchema>;
	filesGetProjectFiles: z.infer<typeof FilesGetProjectFilesResponseSchema>;
	stylesGet: z.infer<typeof StylesGetResponseSchema>;
	stylesGetForTeam: z.infer<typeof StylesGetForTeamResponseSchema>;
	projectsGetTeamProjects: z.infer<
		typeof ProjectsGetTeamProjectsResponseSchema
	>;
	usersGetCurrent: z.infer<typeof UsersGetCurrentResponseSchema>;
	libraryAnalyticsComponentActions: z.infer<
		typeof LibraryAnalyticsComponentActionsResponseSchema
	>;
	libraryAnalyticsComponentUsages: z.infer<
		typeof LibraryAnalyticsComponentUsagesResponseSchema
	>;
	libraryAnalyticsStyleActions: z.infer<
		typeof LibraryAnalyticsStyleActionsResponseSchema
	>;
	libraryAnalyticsStyleUsages: z.infer<
		typeof LibraryAnalyticsStyleUsagesResponseSchema
	>;
	libraryAnalyticsVariableActions: z.infer<
		typeof LibraryAnalyticsVariableActionsResponseSchema
	>;
	libraryAnalyticsVariableUsages: z.infer<
		typeof LibraryAnalyticsVariableUsagesResponseSchema
	>;
	activityLogsList: z.infer<typeof ActivityLogsListResponseSchema>;
	paymentsGet: z.infer<typeof PaymentsGetResponseSchema>;
	designToolsDiscoverResources: z.infer<
		typeof DesignToolsDiscoverResourcesResponseSchema
	>;
	designToolsExtractDesignTokens: z.infer<
		typeof DesignToolsExtractDesignTokensResponseSchema
	>;
	designToolsExtractPrototypeInteractions: z.infer<
		typeof DesignToolsExtractPrototypeInteractionsResponseSchema
	>;
	designToolsDownloadImages: z.infer<
		typeof DesignToolsDownloadImagesResponseSchema
	>;
	designToolsDesignTokensToTailwind: z.infer<
		typeof DesignToolsDesignTokensToTailwindResponseSchema
	>;
};

export const FigmaEndpointInputSchemas = {
	commentsAdd: CommentsAddInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	commentsList: CommentsListInputSchema,
	commentsGetReactions: CommentsGetReactionsInputSchema,
	commentsAddReaction: CommentsAddReactionInputSchema,
	commentsDeleteReaction: CommentsDeleteReactionInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGetRequests: WebhooksGetRequestsInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	devResourcesCreate: DevResourcesCreateInputSchema,
	devResourcesDelete: DevResourcesDeleteInputSchema,
	devResourcesGet: DevResourcesGetInputSchema,
	devResourcesUpdate: DevResourcesUpdateInputSchema,
	variablesCreateModifyDelete: VariablesCreateModifyDeleteInputSchema,
	variablesGetLocal: VariablesGetLocalInputSchema,
	variablesGetPublished: VariablesGetPublishedInputSchema,
	componentsGet: ComponentsGetInputSchema,
	componentSetsGet: ComponentSetsGetInputSchema,
	componentsGetForFile: ComponentsGetForFileInputSchema,
	componentSetsGetForFile: ComponentSetsGetForFileInputSchema,
	componentsGetForTeam: ComponentsGetForTeamInputSchema,
	componentSetsGetForTeam: ComponentSetsGetForTeamInputSchema,
	filesGetJSON: FilesGetJSONInputSchema,
	filesGetMetadata: FilesGetMetadataInputSchema,
	filesGetNodes: FilesGetNodesInputSchema,
	filesGetStyles: FilesGetStylesInputSchema,
	filesGetImageFills: FilesGetImageFillsInputSchema,
	filesGetVersions: FilesGetVersionsInputSchema,
	filesRenderImages: FilesRenderImagesInputSchema,
	filesGetProjectFiles: FilesGetProjectFilesInputSchema,
	stylesGet: StylesGetInputSchema,
	stylesGetForTeam: StylesGetForTeamInputSchema,
	projectsGetTeamProjects: ProjectsGetTeamProjectsInputSchema,
	usersGetCurrent: UsersGetCurrentInputSchema,
	libraryAnalyticsComponentActions: LibraryAnalyticsComponentActionsInputSchema,
	libraryAnalyticsComponentUsages: LibraryAnalyticsComponentUsagesInputSchema,
	libraryAnalyticsStyleActions: LibraryAnalyticsStyleActionsInputSchema,
	libraryAnalyticsStyleUsages: LibraryAnalyticsStyleUsagesInputSchema,
	libraryAnalyticsVariableActions: LibraryAnalyticsVariableActionsInputSchema,
	libraryAnalyticsVariableUsages: LibraryAnalyticsVariableUsagesInputSchema,
	activityLogsList: ActivityLogsListInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	designToolsDiscoverResources: DesignToolsDiscoverResourcesInputSchema,
	designToolsExtractDesignTokens: DesignToolsExtractDesignTokensInputSchema,
	designToolsExtractPrototypeInteractions:
		DesignToolsExtractPrototypeInteractionsInputSchema,
	designToolsDownloadImages: DesignToolsDownloadImagesInputSchema,
	designToolsDesignTokensToTailwind:
		DesignToolsDesignTokensToTailwindInputSchema,
} as const;

export const FigmaEndpointOutputSchemas = {
	commentsAdd: CommentsAddResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
	commentsList: CommentsListResponseSchema,
	commentsGetReactions: CommentsGetReactionsResponseSchema,
	commentsAddReaction: CommentsAddReactionResponseSchema,
	commentsDeleteReaction: CommentsDeleteReactionResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	webhooksGet: WebhooksGetResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksGetRequests: WebhooksGetRequestsResponseSchema,
	webhooksUpdate: WebhooksUpdateResponseSchema,
	devResourcesCreate: DevResourcesCreateResponseSchema,
	devResourcesDelete: DevResourcesDeleteResponseSchema,
	devResourcesGet: DevResourcesGetResponseSchema,
	devResourcesUpdate: DevResourcesUpdateResponseSchema,
	variablesCreateModifyDelete: VariablesCreateModifyDeleteResponseSchema,
	variablesGetLocal: VariablesGetLocalResponseSchema,
	variablesGetPublished: VariablesGetPublishedResponseSchema,
	componentsGet: ComponentsGetResponseSchema,
	componentSetsGet: ComponentSetsGetResponseSchema,
	componentsGetForFile: ComponentsGetForFileResponseSchema,
	componentSetsGetForFile: ComponentSetsGetForFileResponseSchema,
	componentsGetForTeam: ComponentsGetForTeamResponseSchema,
	componentSetsGetForTeam: ComponentSetsGetForTeamResponseSchema,
	filesGetJSON: FilesGetJSONResponseSchema,
	filesGetMetadata: FilesGetMetadataResponseSchema,
	filesGetNodes: FilesGetNodesResponseSchema,
	filesGetStyles: FilesGetStylesResponseSchema,
	filesGetImageFills: FilesGetImageFillsResponseSchema,
	filesGetVersions: FilesGetVersionsResponseSchema,
	filesRenderImages: FilesRenderImagesResponseSchema,
	filesGetProjectFiles: FilesGetProjectFilesResponseSchema,
	stylesGet: StylesGetResponseSchema,
	stylesGetForTeam: StylesGetForTeamResponseSchema,
	projectsGetTeamProjects: ProjectsGetTeamProjectsResponseSchema,
	usersGetCurrent: UsersGetCurrentResponseSchema,
	libraryAnalyticsComponentActions:
		LibraryAnalyticsComponentActionsResponseSchema,
	libraryAnalyticsComponentUsages:
		LibraryAnalyticsComponentUsagesResponseSchema,
	libraryAnalyticsStyleActions: LibraryAnalyticsStyleActionsResponseSchema,
	libraryAnalyticsStyleUsages: LibraryAnalyticsStyleUsagesResponseSchema,
	libraryAnalyticsVariableActions:
		LibraryAnalyticsVariableActionsResponseSchema,
	libraryAnalyticsVariableUsages: LibraryAnalyticsVariableUsagesResponseSchema,
	activityLogsList: ActivityLogsListResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	designToolsDiscoverResources: DesignToolsDiscoverResourcesResponseSchema,
	designToolsExtractDesignTokens: DesignToolsExtractDesignTokensResponseSchema,
	designToolsExtractPrototypeInteractions:
		DesignToolsExtractPrototypeInteractionsResponseSchema,
	designToolsDownloadImages: DesignToolsDownloadImagesResponseSchema,
	designToolsDesignTokensToTailwind:
		DesignToolsDesignTokensToTailwindResponseSchema,
} as const;

// ── Named Response Type Exports ───────────────────────────────────────────────

export type CommentsAddResponse = FigmaEndpointOutputs['commentsAdd'];
export type CommentsDeleteResponse = FigmaEndpointOutputs['commentsDelete'];
export type CommentsListResponse = FigmaEndpointOutputs['commentsList'];
export type CommentsGetReactionsResponse =
	FigmaEndpointOutputs['commentsGetReactions'];
export type CommentsAddReactionResponse =
	FigmaEndpointOutputs['commentsAddReaction'];
export type CommentsDeleteReactionResponse =
	FigmaEndpointOutputs['commentsDeleteReaction'];
export type WebhooksCreateResponse = FigmaEndpointOutputs['webhooksCreate'];
export type WebhooksDeleteResponse = FigmaEndpointOutputs['webhooksDelete'];
export type WebhooksGetResponse = FigmaEndpointOutputs['webhooksGet'];
export type WebhooksListResponse = FigmaEndpointOutputs['webhooksList'];
export type WebhooksGetRequestsResponse =
	FigmaEndpointOutputs['webhooksGetRequests'];
export type WebhooksUpdateResponse = FigmaEndpointOutputs['webhooksUpdate'];
export type DevResourcesCreateResponse =
	FigmaEndpointOutputs['devResourcesCreate'];
export type DevResourcesDeleteResponse =
	FigmaEndpointOutputs['devResourcesDelete'];
export type DevResourcesGetResponse = FigmaEndpointOutputs['devResourcesGet'];
export type DevResourcesUpdateResponse =
	FigmaEndpointOutputs['devResourcesUpdate'];
export type VariablesCreateModifyDeleteResponse =
	FigmaEndpointOutputs['variablesCreateModifyDelete'];
export type VariablesGetLocalResponse =
	FigmaEndpointOutputs['variablesGetLocal'];
export type VariablesGetPublishedResponse =
	FigmaEndpointOutputs['variablesGetPublished'];
export type ComponentsGetResponse = FigmaEndpointOutputs['componentsGet'];
export type ComponentSetsGetResponse = FigmaEndpointOutputs['componentSetsGet'];
export type ComponentsGetForFileResponse =
	FigmaEndpointOutputs['componentsGetForFile'];
export type ComponentSetsGetForFileResponse =
	FigmaEndpointOutputs['componentSetsGetForFile'];
export type ComponentsGetForTeamResponse =
	FigmaEndpointOutputs['componentsGetForTeam'];
export type ComponentSetsGetForTeamResponse =
	FigmaEndpointOutputs['componentSetsGetForTeam'];
export type FilesGetJSONResponse = FigmaEndpointOutputs['filesGetJSON'];
export type FilesGetMetadataResponse = FigmaEndpointOutputs['filesGetMetadata'];
export type FilesGetNodesResponse = FigmaEndpointOutputs['filesGetNodes'];
export type FilesGetStylesResponse = FigmaEndpointOutputs['filesGetStyles'];
export type FilesGetImageFillsResponse =
	FigmaEndpointOutputs['filesGetImageFills'];
export type FilesGetVersionsResponse = FigmaEndpointOutputs['filesGetVersions'];
export type FilesRenderImagesResponse =
	FigmaEndpointOutputs['filesRenderImages'];
export type FilesGetProjectFilesResponse =
	FigmaEndpointOutputs['filesGetProjectFiles'];
export type StylesGetResponse = FigmaEndpointOutputs['stylesGet'];
export type StylesGetForTeamResponse = FigmaEndpointOutputs['stylesGetForTeam'];
export type ProjectsGetTeamProjectsResponse =
	FigmaEndpointOutputs['projectsGetTeamProjects'];
export type UsersGetCurrentResponse = FigmaEndpointOutputs['usersGetCurrent'];
export type LibraryAnalyticsComponentActionsResponse =
	FigmaEndpointOutputs['libraryAnalyticsComponentActions'];
export type LibraryAnalyticsComponentUsagesResponse =
	FigmaEndpointOutputs['libraryAnalyticsComponentUsages'];
export type LibraryAnalyticsStyleActionsResponse =
	FigmaEndpointOutputs['libraryAnalyticsStyleActions'];
export type LibraryAnalyticsStyleUsagesResponse =
	FigmaEndpointOutputs['libraryAnalyticsStyleUsages'];
export type LibraryAnalyticsVariableActionsResponse =
	FigmaEndpointOutputs['libraryAnalyticsVariableActions'];
export type LibraryAnalyticsVariableUsagesResponse =
	FigmaEndpointOutputs['libraryAnalyticsVariableUsages'];
export type ActivityLogsListResponse = FigmaEndpointOutputs['activityLogsList'];
export type PaymentsGetResponse = FigmaEndpointOutputs['paymentsGet'];
export type DesignToolsDiscoverResourcesResponse =
	FigmaEndpointOutputs['designToolsDiscoverResources'];
export type DesignToolsExtractDesignTokensResponse =
	FigmaEndpointOutputs['designToolsExtractDesignTokens'];
export type DesignToolsExtractPrototypeInteractionsResponse =
	FigmaEndpointOutputs['designToolsExtractPrototypeInteractions'];
export type DesignToolsDownloadImagesResponse =
	FigmaEndpointOutputs['designToolsDownloadImages'];
export type DesignToolsDesignTokensToTailwindResponse =
	FigmaEndpointOutputs['designToolsDesignTokensToTailwind'];
