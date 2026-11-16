/**
 * Shapes taken from Storyblok's Management API documentation examples at
 * https://www.storyblok.com/docs/api/management. Values keep every documented
 * field type honest, including the nulls Storyblok sends.
 */

export const story = {
	id: 369689,
	uuid: '1a111111-1111-4111-8111-111111111111',
	name: 'Home',
	slug: 'home',
	full_slug: 'home',
	path: '/',
	parent_id: 0,
	group_id: 'a1b2',
	is_folder: false,
	is_startpage: true,
	published: true,
	published_at: '2026-02-01T10:00:00.000Z',
	first_published_at: '2026-02-01T10:00:00.000Z',
	unpublished_changes: false,
	created_at: '2026-01-01T10:00:00.000Z',
	updated_at: '2026-02-01T10:00:00.000Z',
	deleted_at: null,
	sort_by_date: null,
	tag_list: ['home'],
	release_ids: [],
	position: 1,
	content: {
		component: 'page',
		title: 'Welcome',
	},
	meta_data: null,
	alternates: [],
	breadcrumbs: [],
	translated_slugs: null,
	localized_paths: null,
	default_root: 'home',
	disable_fe_editor: false,
	preview_token: null,
	stage: null,
	last_author: null,
	last_author_id: null,
};

export const space = {
	id: 288868932106293,
	name: 'Acme',
	domain: 'acme.example',
	uniq_domain: 'acme',
	plan: 'growth',
	plan_level: 3,
	role: 'admin',
	owner_id: 1,
	parent_id: null,
	stories_count: 42,
	assets_count: 12,
	trial: false,
	default_root: 'home',
	created_at: '2025-01-01T00:00:00.000Z',
	limits: { stories: 1000 },
	options: {},
	environments: [],
};

export const component = {
	id: 12345,
	name: 'page',
	display_name: 'Page',
	real_name: 'page',
	schema: {
		title: { type: 'text', pos: 0 },
	},
	image: null,
	preview_field: 'title',
	preview_tmpl: null,
	is_root: true,
	is_nestable: false,
	icon: 'block-text',
	color: null,
	component_group_uuid: null,
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
};

export const datasource = {
	id: 777,
	name: 'Countries',
	slug: 'countries',
	dimensions: [],
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
};

export const datasourceEntry = {
	id: 888,
	name: 'Netherlands',
	value: 'nl',
	dimension_value: '',
	position: 1,
};

export const tag = {
	id: 5,
	name: 'home',
	taggings_count: 3,
	tag_on_stories: 3,
};

export const webhook = {
	id: 4569,
	name: 'Rebuild Website',
	description: null,
	endpoint: 'https://example.com',
	space_id: 212319,
	secret: '',
	actions: ['story.published'],
	activated: true,
	deleted_at: null,
	created_at: '2024-03-04T07:58:29.513Z',
	updated_at: '2024-03-04T07:58:29.513Z',
};

export const asset = {
	id: 900,
	filename: 'https://a.storyblok.com/f/123/logo.png',
	short_filename: 'logo.png',
	space_id: 288868932106293,
	asset_folder_id: null,
	content_type: 'image/png',
	content_length: 2048,
	alt: 'Logo',
	copyright: null,
	title: 'Logo',
	source: null,
	focus: null,
	locked: false,
	is_private: false,
	publish_at: null,
	expire_at: null,
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
	deleted_at: null,
	file: { url: 'https://a.storyblok.com/f/123/logo.png' },
	meta_data: {},
};

export const release = {
	id: 321,
	uuid: '2b222222-2222-4222-8222-222222222222',
	name: 'Spring launch',
	release_at: '2026-03-01T09:00:00.000Z',
	released: false,
	timezone: 'Europe/Amsterdam',
	public: false,
	owner_id: 1,
	branches_to_deploy: [],
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
};

export const allowedActions = {
	allowed_actions: [
		{ action: 'story.published' },
		{ action: 'story.unpublished' },
		{ action: 'story.deleted' },
	],
};

/** The live 401 body. */
export const authProblem = { error: 'Unauthorized' };

/**
 * GET and DELETE /assets/:id answer the asset itself, with no `asset` wrapper
 * (trimmed from a live run, 11-16).
 */
export const liveBareAsset = {
	id: 242144717887711,
	filename:
		'https://a.storyblok.com/f/296608950365974/1x1/4367b02867/corsair-plugin-test-3.png',
	space_id: 296608950365974,
	created_at: '2026-11-16T05:29:22.763Z',
	updated_at: '2026-11-16T05:29:25.118Z',
	file: null,
	asset_folder_id: null,
	deleted_at: null,
	short_filename: 'corsair-plugin-test-3.png',
	content_length: 70,
	content_type: 'image/png',
	permanently_deleted: false,
	alt: null,
	copyright: null,
	title: null,
	focus: null,
	ext_id: null,
	expire_at: null,
	source: null,
	internal_tag_ids: [],
	locked: false,
	is_private: false,
	publish_at: null,
	meta_data: {},
	internal_tags_list: [],
};
