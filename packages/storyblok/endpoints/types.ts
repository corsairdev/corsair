import { z } from 'zod';

/**
 * Storyblok's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field Storyblok adds or omits cannot fail a
 * read that already succeeded.
 *
 * Every route sits under `/v1/spaces/:space_id`, so the space is an account
 * setting rather than an argument on each call.
 *
 * Contract: https://www.storyblok.com/docs/api/management
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

const RecordId = z.number().int().describe('A Storyblok numeric id.');

const Timestamp = z.string().describe('ISO 8601.');

/** Storyblok's own attributes are a caller-defined map, so their keys are open. */
const AttributesSchema = z.record(z.string(), z.unknown()); // unknown: any JSON

/**
 * `page` counts from 1 and `per_page` is 1 to 1000, defaulting to 25. The totals
 * arrive in response headers, which `corsair/http` cannot return alongside a
 * body, so they are not part of the output; page until an array comes back
 * empty or short instead.
 */
const paging = {
	page: z.number().int().min(1).optional().describe('Page number, from 1.'),
	per_page: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Entries per page, up to 1000. Defaults to 25.'),
};

// ── Record schemas ────────────────────────────────────────────────────────

const StorySchema = z
	.object({
		id: RecordId.nullish(),
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		full_slug: z.string().nullish(),
		path: z.string().nullish(),
		parent_id: z.number().nullish(),
		group_id: z.string().nullish(),
		is_folder: z.boolean().nullish(),
		is_startpage: z.boolean().nullish(),
		published: z.boolean().nullish(),
		published_at: Timestamp.nullish(),
		first_published_at: Timestamp.nullish(),
		unpublished_changes: z.boolean().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
		deleted_at: Timestamp.nullish(),
		sort_by_date: Timestamp.nullish(),
		tag_list: z.array(z.string()).nullish(),
		release_ids: z.array(z.number()).nullish(),
		position: z.number().nullish(),
		content: AttributesSchema.nullish(),
		meta_data: AttributesSchema.nullish(),
		alternates: z.array(AttributesSchema).nullish(),
		breadcrumbs: z.array(AttributesSchema).nullish(),
		translated_slugs: z.array(AttributesSchema).nullish(),
		localized_paths: z.array(AttributesSchema).nullish(),
		default_root: z.string().nullish(),
		disable_fe_editor: z.boolean().nullish(),
		preview_token: AttributesSchema.nullish(),
		stage: AttributesSchema.nullish(),
		last_author: AttributesSchema.nullish(),
		last_author_id: z.number().nullish(),
	})
	.loose();

export type StoryblokStory = z.infer<typeof StorySchema>;

const SpaceSchema = z
	.object({
		id: RecordId.nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		uniq_domain: z.string().nullish(),
		plan: z.string().nullish(),
		plan_level: z.number().nullish(),
		role: z.string().nullish(),
		owner_id: z.number().nullish(),
		parent_id: z.number().nullish(),
		stories_count: z.number().nullish(),
		assets_count: z.number().nullish(),
		trial: z.boolean().nullish(),
		default_root: z.string().nullish(),
		created_at: Timestamp.nullish(),
		limits: AttributesSchema.nullish(),
		options: AttributesSchema.nullish(),
		environments: z.array(AttributesSchema).nullish(),
	})
	.loose();

export type StoryblokSpace = z.infer<typeof SpaceSchema>;

const ComponentSchema = z
	.object({
		id: RecordId.nullish(),
		name: z.string().nullish(),
		display_name: z.string().nullish(),
		real_name: z.string().nullish(),
		schema: AttributesSchema.nullish(),
		image: z.string().nullish(),
		preview_field: z.string().nullish(),
		preview_tmpl: z.string().nullish(),
		is_root: z.boolean().nullish(),
		is_nestable: z.boolean().nullish(),
		icon: z.string().nullish(),
		color: z.string().nullish(),
		component_group_uuid: z.string().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type StoryblokComponent = z.infer<typeof ComponentSchema>;

const DatasourceSchema = z
	.object({
		id: RecordId.nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		dimensions: z.array(AttributesSchema).nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type StoryblokDatasource = z.infer<typeof DatasourceSchema>;

const DatasourceEntrySchema = z
	.object({
		id: RecordId.nullish(),
		name: z.string().nullish(),
		value: z.string().nullish(),
		dimension_value: z.string().nullish(),
		position: z.number().nullish(),
	})
	.loose();

export type StoryblokDatasourceEntry = z.infer<typeof DatasourceEntrySchema>;

const TagSchema = z
	.object({
		id: RecordId.nullish(),
		name: z.string().nullish(),
		taggings_count: z.number().nullish(),
		tag_on_stories: z.number().nullish(),
	})
	.loose();

export type StoryblokTag = z.infer<typeof TagSchema>;

const WebhookSchema = z
	.object({
		id: RecordId.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		endpoint: z.string().nullish(),
		space_id: z.number().nullish(),
		secret: z.string().nullish(),
		actions: z.array(z.string()).nullish(),
		activated: z.boolean().nullish(),
		deleted_at: Timestamp.nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type StoryblokWebhook = z.infer<typeof WebhookSchema>;

const AssetSchema = z
	.object({
		id: RecordId.nullish(),
		filename: z.string().nullish(),
		short_filename: z.string().nullish(),
		space_id: z.number().nullish(),
		asset_folder_id: z.number().nullish(),
		content_type: z.string().nullish(),
		content_length: z.number().nullish(),
		alt: z.string().nullish(),
		copyright: z.string().nullish(),
		title: z.string().nullish(),
		source: z.string().nullish(),
		focus: z.string().nullish(),
		locked: z.boolean().nullish(),
		is_private: z.boolean().nullish(),
		publish_at: Timestamp.nullish(),
		expire_at: Timestamp.nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
		deleted_at: Timestamp.nullish(),
		file: AttributesSchema.nullish(),
		meta_data: AttributesSchema.nullish(),
	})
	.loose();

export type StoryblokAsset = z.infer<typeof AssetSchema>;

const ReleaseSchema = z
	.object({
		id: RecordId.nullish(),
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		release_at: Timestamp.nullish(),
		released: z.boolean().nullish(),
		timezone: z.string().nullish(),
		public: z.boolean().nullish(),
		owner_id: z.number().nullish(),
		branches_to_deploy: z.array(z.number()).nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type StoryblokRelease = z.infer<typeof ReleaseSchema>;

// ── stories ───────────────────────────────────────────────────────────────

const StoriesListInputSchema = z.object({
	...paging,
	text_search: z
		.string()
		.optional()
		.describe('Search the name, slug and content of every story.'),
	by_slugs: z
		.string()
		.optional()
		.describe(
			'Full slugs to include, comma separated. A trailing * matches a prefix, as in posts/*.',
		),
	excluding_slugs: z.string().optional(),
	by_ids: z.string().optional().describe('Story ids, comma separated.'),
	by_uuids: z.string().optional().describe('Story UUIDs, comma separated.'),
	with_tag: z.string().optional().describe('Tag names, comma separated.'),
	is_published: z
		.boolean()
		.optional()
		.describe('True for published stories only, false for drafts only.'),
	folder_only: z.boolean().optional(),
	story_only: z.boolean().optional(),
	with_parent: z
		.number()
		.int()
		.optional()
		.describe('Only stories under this parent id.'),
	starts_with: z
		.string()
		.optional()
		.describe('Only slugs starting with this value.'),
	in_trash: z.boolean().optional().describe('Only deleted stories.'),
	in_release: z
		.number()
		.int()
		.optional()
		.describe('Only stories grouped in this release.'),
	with_summary: z
		.boolean()
		.optional()
		.describe(
			'Include a content_summary. Without it this route omits the content field entirely.',
		),
	sort_by: z
		.string()
		.optional()
		.describe(
			'Sorting, such as created_at:desc or content.my_field:asc:float.',
		),
	favourite: z.boolean().optional(),
});

export type StoriesListInput = z.infer<typeof StoriesListInputSchema>;

const StoriesListResponseSchema = z
	.object({ stories: z.array(StorySchema) })
	.loose();

export type StoriesListResponse = z.infer<typeof StoriesListResponseSchema>;

const StoryTargetSchema = z.object({
	story_id: RecordId.describe('The numeric story id.'),
});

export type StoryTargetInput = z.infer<typeof StoryTargetSchema>;

const StoriesGetResponseSchema = z.object({ story: StorySchema }).loose();

export type StoriesGetResponse = z.infer<typeof StoriesGetResponseSchema>;

/** The writable part of a story. `content` is the schema's own JSON. */
const storyBody = {
	name: z.string().min(1).describe('The story name, which the UI shows.'),
	slug: z
		.string()
		.min(1)
		.describe(
			'The URL segment. Storyblok derives full_slug from this and the parent.',
		),
	content: AttributesSchema.describe(
		'The story content: a component key naming the content type plus that component\'s fields, keyed by field name, such as { component: "page", title: "Welcome" }.',
	),
	parent_id: z.number().int().nullish(),
	group_id: z.string().nullish(),
	is_startpage: z.boolean().optional(),
	disable_fe_editor: z.boolean().optional(),
	meta_data: AttributesSchema.nullish(),
	tag_list: z.array(z.string()).nullish(),
};

const StoriesCreateInputSchema = z.object({
	...storyBody,
	publish: z
		.boolean()
		.optional()
		.describe('Publish in the same call rather than leaving a draft.'),
	release_id: z
		.number()
		.int()
		.optional()
		.describe('Group the story in this release instead of publishing it.'),
});

export type StoriesCreateInput = z.infer<typeof StoriesCreateInputSchema>;

const StoryWriteResponseSchema = z.object({ story: StorySchema }).loose();

export type StoryWriteResponse = z.infer<typeof StoryWriteResponseSchema>;

const StoriesUpdateInputSchema = z.object({
	story_id: RecordId,
	...storyBody,
	publish: z.boolean().optional(),
	release_id: z.number().int().optional(),
	lang: z
		.string()
		.optional()
		.describe('Update this language version rather than the default one.'),
	force_update: z
		.string()
		.optional()
		.describe("Storyblok's own override flag, passed through as sent."),
});

export type StoriesUpdateInput = z.infer<typeof StoriesUpdateInputSchema>;

const StoriesPublishInputSchema = z.object({
	story_id: RecordId,
	release_id: z
		.number()
		.int()
		.optional()
		.describe('Add the story to this release instead of publishing it now.'),
});

export type StoriesPublishInput = z.infer<typeof StoriesPublishInputSchema>;

const StoriesDeleteResponseSchema = z.object({ story: StorySchema }).loose();

export type StoriesDeleteResponse = z.infer<typeof StoriesDeleteResponseSchema>;

// ── spaces ────────────────────────────────────────────────────────────────

const SpacesListInputSchema = z.object({ ...paging });

export type SpacesListInput = z.infer<typeof SpacesListInputSchema>;

const SpacesListResponseSchema = z
	.object({ spaces: z.array(SpaceSchema) })
	.loose();

export type SpacesListResponse = z.infer<typeof SpacesListResponseSchema>;

const SpacesGetInputSchema = z.object({});

export type SpacesGetInput = z.infer<typeof SpacesGetInputSchema>;

const SpacesGetResponseSchema = z.object({ space: SpaceSchema }).loose();

export type SpacesGetResponse = z.infer<typeof SpacesGetResponseSchema>;

// ── components ────────────────────────────────────────────────────────────

const ComponentsListInputSchema = z.object({
	...paging,
	search: z.string().optional(),
});

export type ComponentsListInput = z.infer<typeof ComponentsListInputSchema>;

const ComponentsListResponseSchema = z
	.object({ components: z.array(ComponentSchema) })
	.loose();

export type ComponentsListResponse = z.infer<
	typeof ComponentsListResponseSchema
>;

/** `schema` is the field definition map: field name to type and options. */
const componentBody = {
	name: z
		.string()
		.min(1)
		.describe('The technical name, which content uses as its component key.'),
	display_name: z.string().nullish(),
	schema: AttributesSchema.describe(
		'Field name to its definition, such as { title: { type: "text" } }.',
	),
	is_root: z.boolean().optional(),
	is_nestable: z.boolean().optional(),
	preview_field: z.string().nullish(),
	preview_tmpl: z.string().nullish(),
	icon: z.string().nullish(),
	color: z.string().nullish(),
	component_group_uuid: z.string().nullish(),
};

const ComponentsCreateInputSchema = z.object(componentBody);

export type ComponentsCreateInput = z.infer<typeof ComponentsCreateInputSchema>;

const ComponentWriteResponseSchema = z
	.object({ component: ComponentSchema })
	.loose();

export type ComponentWriteResponse = z.infer<
	typeof ComponentWriteResponseSchema
>;

const ComponentTargetSchema = z.object({ component_id: RecordId });

export type ComponentTargetInput = z.infer<typeof ComponentTargetSchema>;

const ComponentsUpdateInputSchema = z.object({
	component_id: RecordId,
	...componentBody,
});

export type ComponentsUpdateInput = z.infer<typeof ComponentsUpdateInputSchema>;

// ── datasources ───────────────────────────────────────────────────────────

const DatasourcesListInputSchema = z.object({ ...paging });

export type DatasourcesListInput = z.infer<typeof DatasourcesListInputSchema>;

const DatasourcesListResponseSchema = z
	.object({ datasources: z.array(DatasourceSchema) })
	.loose();

export type DatasourcesListResponse = z.infer<
	typeof DatasourcesListResponseSchema
>;

const DatasourceTargetSchema = z.object({ datasource_id: RecordId });

export type DatasourceTargetInput = z.infer<typeof DatasourceTargetSchema>;

const DatasourceWriteResponseSchema = z
	.object({ datasource: DatasourceSchema })
	.loose();

export type DatasourceWriteResponse = z.infer<
	typeof DatasourceWriteResponseSchema
>;

const datasourceBody = {
	name: z.string().min(1),
	slug: z
		.string()
		.min(1)
		.describe('The identifier content uses to reference the datasource.'),
};

const DatasourcesCreateInputSchema = z.object(datasourceBody);

export type DatasourcesCreateInput = z.infer<
	typeof DatasourcesCreateInputSchema
>;

const DatasourcesUpdateInputSchema = z.object({
	datasource_id: RecordId,
	...datasourceBody,
});

export type DatasourcesUpdateInput = z.infer<
	typeof DatasourcesUpdateInputSchema
>;

// ── datasourceEntries ─────────────────────────────────────────────────────

const DatasourceEntriesListInputSchema = z.object({
	...paging,
	datasource_id: RecordId.optional().describe(
		'Only entries of this datasource.',
	),
	dimension: z
		.union([z.number().int(), z.string().regex(/^\d+$/)])
		.optional()
		.describe(
			'The numeric id of a dimension; entries then carry that dimension_value.',
		),
});

export type DatasourceEntriesListInput = z.infer<
	typeof DatasourceEntriesListInputSchema
>;

const DatasourceEntriesListResponseSchema = z
	.object({ datasource_entries: z.array(DatasourceEntrySchema) })
	.loose();

export type DatasourceEntriesListResponse = z.infer<
	typeof DatasourceEntriesListResponseSchema
>;

const DatasourceEntryTargetSchema = z.object({ datasource_entry_id: RecordId });

export type DatasourceEntryTargetInput = z.infer<
	typeof DatasourceEntryTargetSchema
>;

const DatasourceEntryWriteResponseSchema = z
	.object({ datasource_entry: DatasourceEntrySchema })
	.loose();

export type DatasourceEntryWriteResponse = z.infer<
	typeof DatasourceEntryWriteResponseSchema
>;

const datasourceEntryBody = {
	name: z.string().min(1),
	value: z.string(),
	datasource_id: RecordId.describe('The datasource this entry belongs to.'),
};

const DatasourceEntriesCreateInputSchema = z.object(datasourceEntryBody);

export type DatasourceEntriesCreateInput = z.infer<
	typeof DatasourceEntriesCreateInputSchema
>;

const DatasourceEntriesUpdateInputSchema = z.object({
	datasource_entry_id: RecordId,
	...datasourceEntryBody,
	dimension_value: z
		.string()
		.optional()
		.describe('The value for the dimension named by dimension_id.'),
	dimension_id: z
		.number()
		.int()
		.optional()
		.describe('The dimension whose value dimension_value sets.'),
});

export type DatasourceEntriesUpdateInput = z.infer<
	typeof DatasourceEntriesUpdateInputSchema
>;

// ── tags ──────────────────────────────────────────────────────────────────

const TagsListInputSchema = z.object({ ...paging });

export type TagsListInput = z.infer<typeof TagsListInputSchema>;

const TagsListResponseSchema = z.object({ tags: z.array(TagSchema) }).loose();

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

const TagsCreateInputSchema = z.object({
	name: z.string().min(1),
	story_id: z
		.number()
		.int()
		.optional()
		.describe('Attach the new tag to this story as it is created.'),
});

export type TagsCreateInput = z.infer<typeof TagsCreateInputSchema>;

const TagTargetSchema = z.object({
	tag_id: z.string().describe('The tag id or name.'),
});

export type TagTargetInput = z.infer<typeof TagTargetSchema>;

const TagWriteResponseSchema = z.object({ tag: TagSchema }).loose();

export type TagWriteResponse = z.infer<typeof TagWriteResponseSchema>;

const TagsUpdateInputSchema = z.object({
	tag_id: z.string(),
	name: z.string().min(1),
});

export type TagsUpdateInput = z.infer<typeof TagsUpdateInputSchema>;

// ── webhooks ──────────────────────────────────────────────────────────────

const WebhooksListInputSchema = z.object({ ...paging });

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z
	.object({ webhook_endpoints: z.array(WebhookSchema) })
	.loose();

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksGetInputSchema = z.object({ webhook_endpoint_id: RecordId });

export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

const WebhooksGetResponseSchema = z
	.object({ webhook_endpoint: WebhookSchema })
	.loose();

export type WebhooksGetResponse = z.infer<typeof WebhooksGetResponseSchema>;

const webhookBody = {
	name: z.string().nullish(),
	description: z.string().nullish(),
	endpoint: z.string().describe('The HTTPS URL Storyblok posts to.'),
	actions: z
		.array(z.string())
		.min(1)
		.describe(
			'The events to send, such as story.published. webhooks.listActions returns the accepted values.',
		),
	activated: z.boolean().optional().describe('Defaults to true when creating.'),
	secret: z
		.string()
		.nullish()
		.describe('When set, Storyblok signs each delivery with it.'),
};

const WebhooksCreateInputSchema = z.object(webhookBody);

export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

const WebhookWriteResponseSchema = z
	.object({ webhook_endpoint: WebhookSchema })
	.loose();

export type WebhookWriteResponse = z.infer<typeof WebhookWriteResponseSchema>;

const WebhooksUpdateInputSchema = z.object({
	webhook_endpoint_id: RecordId,
	...webhookBody,
});

export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

const WebhooksListActionsInputSchema = z.object({});

export type WebhooksListActionsInput = z.infer<
	typeof WebhooksListActionsInputSchema
>;

const WebhooksListActionsResponseSchema = z
	.object({
		allowed_actions: z.array(z.object({ action: z.string() }).loose()),
	})
	.loose();

export type WebhooksListActionsResponse = z.infer<
	typeof WebhooksListActionsResponseSchema
>;

// ── assets ────────────────────────────────────────────────────────────────

const AssetsListInputSchema = z.object({
	...paging,
	search: z.string().optional(),
	in_folder: z.number().int().optional(),
});

export type AssetsListInput = z.infer<typeof AssetsListInputSchema>;

const AssetsListResponseSchema = z
	.object({ assets: z.array(AssetSchema) })
	.loose();

export type AssetsListResponse = z.infer<typeof AssetsListResponseSchema>;

const AssetTargetSchema = z.object({ asset_id: RecordId });

export type AssetTargetInput = z.infer<typeof AssetTargetSchema>;

const AssetsGetResponseSchema = z.object({ asset: AssetSchema }).loose();

export type AssetsGetResponse = z.infer<typeof AssetsGetResponseSchema>;

const AssetsUpdateInputSchema = z.object({
	asset_id: RecordId,
	filename: z.string().optional(),
	alt: z.string().nullish(),
	copyright: z.string().nullish(),
	title: z.string().nullish(),
	focus: z.string().nullish(),
	is_private: z.boolean().optional(),
	publish_at: z.string().nullish(),
	expire_at: z.string().nullish(),
});

export type AssetsUpdateInput = z.infer<typeof AssetsUpdateInputSchema>;

const AssetWriteResponseSchema = z.object({ asset: AssetSchema }).loose();

export type AssetWriteResponse = z.infer<typeof AssetWriteResponseSchema>;

const AssetsBulkDeleteInputSchema = z.object({
	ids: z.array(RecordId).min(1).describe('The asset ids to delete.'),
});

export type AssetsBulkDeleteInput = z.infer<typeof AssetsBulkDeleteInputSchema>;

const AssetsBulkDeleteResponseSchema = z
	.object({
		deleted: z.number().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type AssetsBulkDeleteResponse = z.infer<
	typeof AssetsBulkDeleteResponseSchema
>;

// ── releases ──────────────────────────────────────────────────────────────

const ReleasesListInputSchema = z.object({ ...paging });

export type ReleasesListInput = z.infer<typeof ReleasesListInputSchema>;

const ReleasesListResponseSchema = z
	.object({ releases: z.array(ReleaseSchema) })
	.loose();

export type ReleasesListResponse = z.infer<typeof ReleasesListResponseSchema>;

const ReleaseTargetSchema = z.object({ release_id: RecordId });

export type ReleaseTargetInput = z.infer<typeof ReleaseTargetSchema>;

const ReleasesGetResponseSchema = z.object({ release: ReleaseSchema }).loose();

export type ReleasesGetResponse = z.infer<typeof ReleasesGetResponseSchema>;

const releaseBody = {
	name: z.string().min(1),
	release_at: z.string().nullish().describe('When to release it, ISO 8601.'),
	timezone: z.string().nullish(),
	public: z.boolean().optional(),
};

const ReleasesCreateInputSchema = z.object(releaseBody);

export type ReleasesCreateInput = z.infer<typeof ReleasesCreateInputSchema>;

const ReleaseWriteResponseSchema = z.object({ release: ReleaseSchema }).loose();

export type ReleaseWriteResponse = z.infer<typeof ReleaseWriteResponseSchema>;

const ReleasesUpdateInputSchema = z.object({
	release_id: RecordId,
	...releaseBody,
	do_release: z
		.boolean()
		.optional()
		.describe('Release now rather than saving the schedule.'),
});

export type ReleasesUpdateInput = z.infer<typeof ReleasesUpdateInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type StoryblokEndpointInputs = {
	storiesList: StoriesListInput;
	storiesGet: StoryTargetInput;
	storiesCreate: StoriesCreateInput;
	storiesUpdate: StoriesUpdateInput;
	storiesPublish: StoriesPublishInput;
	storiesUnpublish: StoryTargetInput;
	storiesDelete: StoryTargetInput;
	spacesList: SpacesListInput;
	spacesGet: SpacesGetInput;
	componentsList: ComponentsListInput;
	componentsCreate: ComponentsCreateInput;
	componentsUpdate: ComponentsUpdateInput;
	componentsDelete: ComponentTargetInput;
	datasourcesList: DatasourcesListInput;
	datasourcesGet: DatasourceTargetInput;
	datasourcesCreate: DatasourcesCreateInput;
	datasourcesUpdate: DatasourcesUpdateInput;
	datasourcesDelete: DatasourceTargetInput;
	datasourceEntriesList: DatasourceEntriesListInput;
	datasourceEntriesGet: DatasourceEntryTargetInput;
	datasourceEntriesCreate: DatasourceEntriesCreateInput;
	datasourceEntriesUpdate: DatasourceEntriesUpdateInput;
	datasourceEntriesDelete: DatasourceEntryTargetInput;
	tagsList: TagsListInput;
	tagsCreate: TagsCreateInput;
	tagsUpdate: TagsUpdateInput;
	tagsDelete: TagTargetInput;
	webhooksList: WebhooksListInput;
	webhooksGet: WebhooksGetInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksGetInput;
	webhooksListActions: WebhooksListActionsInput;
	assetsList: AssetsListInput;
	assetsGet: AssetTargetInput;
	assetsUpdate: AssetsUpdateInput;
	assetsDelete: AssetTargetInput;
	assetsBulkDelete: AssetsBulkDeleteInput;
	releasesList: ReleasesListInput;
	releasesGet: ReleaseTargetInput;
	releasesCreate: ReleasesCreateInput;
	releasesUpdate: ReleasesUpdateInput;
	releasesDelete: ReleaseTargetInput;
};

export type StoryblokEndpointOutputs = {
	storiesList: StoriesListResponse;
	storiesGet: StoriesGetResponse;
	storiesCreate: StoryWriteResponse;
	storiesUpdate: StoryWriteResponse;
	storiesPublish: StoryWriteResponse;
	storiesUnpublish: StoryWriteResponse;
	storiesDelete: StoriesDeleteResponse;
	spacesList: SpacesListResponse;
	spacesGet: SpacesGetResponse;
	componentsList: ComponentsListResponse;
	componentsCreate: ComponentWriteResponse;
	componentsUpdate: ComponentWriteResponse;
	componentsDelete: ComponentWriteResponse;
	datasourcesList: DatasourcesListResponse;
	datasourcesGet: DatasourceWriteResponse;
	datasourcesCreate: DatasourceWriteResponse;
	datasourcesUpdate: DatasourceWriteResponse;
	datasourcesDelete: DatasourceWriteResponse;
	datasourceEntriesList: DatasourceEntriesListResponse;
	datasourceEntriesGet: DatasourceEntryWriteResponse;
	datasourceEntriesCreate: DatasourceEntryWriteResponse;
	datasourceEntriesUpdate: DatasourceEntryWriteResponse;
	datasourceEntriesDelete: DatasourceEntryWriteResponse;
	tagsList: TagsListResponse;
	tagsCreate: TagWriteResponse;
	tagsUpdate: TagWriteResponse;
	tagsDelete: TagWriteResponse;
	webhooksList: WebhooksListResponse;
	webhooksGet: WebhooksGetResponse;
	webhooksCreate: WebhookWriteResponse;
	webhooksUpdate: WebhookWriteResponse;
	webhooksDelete: WebhookWriteResponse;
	webhooksListActions: WebhooksListActionsResponse;
	assetsList: AssetsListResponse;
	assetsGet: AssetsGetResponse;
	assetsUpdate: AssetWriteResponse;
	assetsDelete: AssetWriteResponse;
	assetsBulkDelete: AssetsBulkDeleteResponse;
	releasesList: ReleasesListResponse;
	releasesGet: ReleasesGetResponse;
	releasesCreate: ReleaseWriteResponse;
	releasesUpdate: ReleaseWriteResponse;
	releasesDelete: ReleaseWriteResponse;
};

export const StoryblokEndpointInputSchemas = {
	storiesList: StoriesListInputSchema,
	storiesGet: StoryTargetSchema,
	storiesCreate: StoriesCreateInputSchema,
	storiesUpdate: StoriesUpdateInputSchema,
	storiesPublish: StoriesPublishInputSchema,
	storiesUnpublish: StoryTargetSchema,
	storiesDelete: StoryTargetSchema,
	spacesList: SpacesListInputSchema,
	spacesGet: SpacesGetInputSchema,
	componentsList: ComponentsListInputSchema,
	componentsCreate: ComponentsCreateInputSchema,
	componentsUpdate: ComponentsUpdateInputSchema,
	componentsDelete: ComponentTargetSchema,
	datasourcesList: DatasourcesListInputSchema,
	datasourcesGet: DatasourceTargetSchema,
	datasourcesCreate: DatasourcesCreateInputSchema,
	datasourcesUpdate: DatasourcesUpdateInputSchema,
	datasourcesDelete: DatasourceTargetSchema,
	datasourceEntriesList: DatasourceEntriesListInputSchema,
	datasourceEntriesGet: DatasourceEntryTargetSchema,
	datasourceEntriesCreate: DatasourceEntriesCreateInputSchema,
	datasourceEntriesUpdate: DatasourceEntriesUpdateInputSchema,
	datasourceEntriesDelete: DatasourceEntryTargetSchema,
	tagsList: TagsListInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsDelete: TagTargetSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksGetInputSchema,
	webhooksListActions: WebhooksListActionsInputSchema,
	assetsList: AssetsListInputSchema,
	assetsGet: AssetTargetSchema,
	assetsUpdate: AssetsUpdateInputSchema,
	assetsDelete: AssetTargetSchema,
	assetsBulkDelete: AssetsBulkDeleteInputSchema,
	releasesList: ReleasesListInputSchema,
	releasesGet: ReleaseTargetSchema,
	releasesCreate: ReleasesCreateInputSchema,
	releasesUpdate: ReleasesUpdateInputSchema,
	releasesDelete: ReleaseTargetSchema,
} as const;

export const StoryblokEndpointOutputSchemas = {
	storiesList: StoriesListResponseSchema,
	storiesGet: StoriesGetResponseSchema,
	storiesCreate: StoryWriteResponseSchema,
	storiesUpdate: StoryWriteResponseSchema,
	storiesPublish: StoryWriteResponseSchema,
	storiesUnpublish: StoryWriteResponseSchema,
	storiesDelete: StoriesDeleteResponseSchema,
	spacesList: SpacesListResponseSchema,
	spacesGet: SpacesGetResponseSchema,
	componentsList: ComponentsListResponseSchema,
	componentsCreate: ComponentWriteResponseSchema,
	componentsUpdate: ComponentWriteResponseSchema,
	componentsDelete: ComponentWriteResponseSchema,
	datasourcesList: DatasourcesListResponseSchema,
	datasourcesGet: DatasourceWriteResponseSchema,
	datasourcesCreate: DatasourceWriteResponseSchema,
	datasourcesUpdate: DatasourceWriteResponseSchema,
	datasourcesDelete: DatasourceWriteResponseSchema,
	datasourceEntriesList: DatasourceEntriesListResponseSchema,
	datasourceEntriesGet: DatasourceEntryWriteResponseSchema,
	datasourceEntriesCreate: DatasourceEntryWriteResponseSchema,
	datasourceEntriesUpdate: DatasourceEntryWriteResponseSchema,
	datasourceEntriesDelete: DatasourceEntryWriteResponseSchema,
	tagsList: TagsListResponseSchema,
	tagsCreate: TagWriteResponseSchema,
	tagsUpdate: TagWriteResponseSchema,
	tagsDelete: TagWriteResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksGet: WebhooksGetResponseSchema,
	webhooksCreate: WebhookWriteResponseSchema,
	webhooksUpdate: WebhookWriteResponseSchema,
	webhooksDelete: WebhookWriteResponseSchema,
	webhooksListActions: WebhooksListActionsResponseSchema,
	assetsList: AssetsListResponseSchema,
	assetsGet: AssetsGetResponseSchema,
	assetsUpdate: AssetWriteResponseSchema,
	assetsDelete: AssetWriteResponseSchema,
	assetsBulkDelete: AssetsBulkDeleteResponseSchema,
	releasesList: ReleasesListResponseSchema,
	releasesGet: ReleasesGetResponseSchema,
	releasesCreate: ReleaseWriteResponseSchema,
	releasesUpdate: ReleaseWriteResponseSchema,
	releasesDelete: ReleaseWriteResponseSchema,
} as const;
