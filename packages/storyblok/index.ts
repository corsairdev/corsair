import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Assets,
	Components,
	DatasourceEntries,
	Datasources,
	Releases,
	Spaces,
	Stories,
	Tags,
	Webhooks,
} from './endpoints';
import type {
	StoryblokEndpointInputs,
	StoryblokEndpointOutputs,
} from './endpoints/types';
import {
	StoryblokEndpointInputSchemas,
	StoryblokEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { StoryblokSchema } from './schema';

/**
 * A Storyblok token belongs to a user, and every Management API route is scoped
 * to one space on one regional host, so both are account settings rather than
 * per-call arguments.
 */
export const storyblokAuthConfig = {
	api_key: {
		account: ['space_id', 'region'] as const,
	},
} as const satisfies PluginAuthConfig;

export type StoryblokPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** The space id every route sits under. Read from the account when omitted. */
	spaceId?: number;
	/**
	 * Which regional host serves the space: `eu`, `us`, `ca`, `ap` or `cn`.
	 * A space only answers on its own host, so this defaults to `eu`.
	 */
	region?: 'eu' | 'us' | 'ca' | 'ap' | 'cn';
	hooks?: InternalStoryblokPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof storyblokEndpointsNested>;
};

export type StoryblokContext = CorsairPluginContext<
	typeof StoryblokSchema,
	StoryblokPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// StoryblokEndpoint, and passing them back would make the type circular.
	undefined,
	typeof storyblokAuthConfig
>;

export type StoryblokKeyBuilderContext = KeyBuilderContext<
	StoryblokPluginOptions,
	typeof storyblokAuthConfig
>;

export type StoryblokBoundEndpoints = BindEndpoints<
	typeof storyblokEndpointsNested
>;

type StoryblokEndpoint<K extends keyof StoryblokEndpointOutputs> =
	CorsairEndpoint<
		StoryblokContext,
		StoryblokEndpointInputs[K],
		StoryblokEndpointOutputs[K]
	>;

export type StoryblokEndpoints = {
	storiesList: StoryblokEndpoint<'storiesList'>;
	storiesGet: StoryblokEndpoint<'storiesGet'>;
	storiesCreate: StoryblokEndpoint<'storiesCreate'>;
	storiesUpdate: StoryblokEndpoint<'storiesUpdate'>;
	storiesPublish: StoryblokEndpoint<'storiesPublish'>;
	storiesUnpublish: StoryblokEndpoint<'storiesUnpublish'>;
	storiesDelete: StoryblokEndpoint<'storiesDelete'>;
	spacesList: StoryblokEndpoint<'spacesList'>;
	spacesGet: StoryblokEndpoint<'spacesGet'>;
	componentsList: StoryblokEndpoint<'componentsList'>;
	componentsCreate: StoryblokEndpoint<'componentsCreate'>;
	componentsUpdate: StoryblokEndpoint<'componentsUpdate'>;
	componentsDelete: StoryblokEndpoint<'componentsDelete'>;
	datasourcesList: StoryblokEndpoint<'datasourcesList'>;
	datasourcesGet: StoryblokEndpoint<'datasourcesGet'>;
	datasourcesCreate: StoryblokEndpoint<'datasourcesCreate'>;
	datasourcesUpdate: StoryblokEndpoint<'datasourcesUpdate'>;
	datasourcesDelete: StoryblokEndpoint<'datasourcesDelete'>;
	datasourceEntriesList: StoryblokEndpoint<'datasourceEntriesList'>;
	datasourceEntriesGet: StoryblokEndpoint<'datasourceEntriesGet'>;
	datasourceEntriesCreate: StoryblokEndpoint<'datasourceEntriesCreate'>;
	datasourceEntriesUpdate: StoryblokEndpoint<'datasourceEntriesUpdate'>;
	datasourceEntriesDelete: StoryblokEndpoint<'datasourceEntriesDelete'>;
	tagsList: StoryblokEndpoint<'tagsList'>;
	tagsCreate: StoryblokEndpoint<'tagsCreate'>;
	tagsUpdate: StoryblokEndpoint<'tagsUpdate'>;
	tagsDelete: StoryblokEndpoint<'tagsDelete'>;
	webhooksList: StoryblokEndpoint<'webhooksList'>;
	webhooksGet: StoryblokEndpoint<'webhooksGet'>;
	webhooksCreate: StoryblokEndpoint<'webhooksCreate'>;
	webhooksUpdate: StoryblokEndpoint<'webhooksUpdate'>;
	webhooksDelete: StoryblokEndpoint<'webhooksDelete'>;
	webhooksListActions: StoryblokEndpoint<'webhooksListActions'>;
	assetsList: StoryblokEndpoint<'assetsList'>;
	assetsGet: StoryblokEndpoint<'assetsGet'>;
	assetsUpdate: StoryblokEndpoint<'assetsUpdate'>;
	assetsDelete: StoryblokEndpoint<'assetsDelete'>;
	assetsBulkDelete: StoryblokEndpoint<'assetsBulkDelete'>;
	releasesList: StoryblokEndpoint<'releasesList'>;
	releasesGet: StoryblokEndpoint<'releasesGet'>;
	releasesCreate: StoryblokEndpoint<'releasesCreate'>;
	releasesUpdate: StoryblokEndpoint<'releasesUpdate'>;
	releasesDelete: StoryblokEndpoint<'releasesDelete'>;
};

const storyblokEndpointsNested = {
	stories: {
		list: Stories.list,
		get: Stories.get,
		create: Stories.create,
		update: Stories.update,
		publish: Stories.publish,
		unpublish: Stories.unpublish,
		delete: Stories.remove,
	},
	spaces: {
		list: Spaces.list,
		get: Spaces.get,
	},
	components: {
		list: Components.list,
		create: Components.create,
		update: Components.update,
		delete: Components.remove,
	},
	datasources: {
		list: Datasources.list,
		get: Datasources.get,
		create: Datasources.create,
		update: Datasources.update,
		delete: Datasources.remove,
	},
	datasourceEntries: {
		list: DatasourceEntries.list,
		get: DatasourceEntries.get,
		create: DatasourceEntries.create,
		update: DatasourceEntries.update,
		delete: DatasourceEntries.remove,
	},
	tags: {
		list: Tags.list,
		create: Tags.create,
		update: Tags.update,
		delete: Tags.remove,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
		listActions: Webhooks.listActions,
	},
	assets: {
		list: Assets.list,
		get: Assets.get,
		update: Assets.update,
		delete: Assets.remove,
		bulkDelete: Assets.bulkDelete,
	},
	releases: {
		list: Releases.list,
		get: Releases.get,
		create: Releases.create,
		update: Releases.update,
		delete: Releases.remove,
	},
} as const;

export const storyblokEndpointSchemas = {
	'stories.list': {
		input: StoryblokEndpointInputSchemas.storiesList,
		output: StoryblokEndpointOutputSchemas.storiesList,
	},
	'stories.get': {
		input: StoryblokEndpointInputSchemas.storiesGet,
		output: StoryblokEndpointOutputSchemas.storiesGet,
	},
	'stories.create': {
		input: StoryblokEndpointInputSchemas.storiesCreate,
		output: StoryblokEndpointOutputSchemas.storiesCreate,
	},
	'stories.update': {
		input: StoryblokEndpointInputSchemas.storiesUpdate,
		output: StoryblokEndpointOutputSchemas.storiesUpdate,
	},
	'stories.publish': {
		input: StoryblokEndpointInputSchemas.storiesPublish,
		output: StoryblokEndpointOutputSchemas.storiesPublish,
	},
	'stories.unpublish': {
		input: StoryblokEndpointInputSchemas.storiesUnpublish,
		output: StoryblokEndpointOutputSchemas.storiesUnpublish,
	},
	'stories.delete': {
		input: StoryblokEndpointInputSchemas.storiesDelete,
		output: StoryblokEndpointOutputSchemas.storiesDelete,
	},
	'spaces.list': {
		input: StoryblokEndpointInputSchemas.spacesList,
		output: StoryblokEndpointOutputSchemas.spacesList,
	},
	'spaces.get': {
		input: StoryblokEndpointInputSchemas.spacesGet,
		output: StoryblokEndpointOutputSchemas.spacesGet,
	},
	'components.list': {
		input: StoryblokEndpointInputSchemas.componentsList,
		output: StoryblokEndpointOutputSchemas.componentsList,
	},
	'components.create': {
		input: StoryblokEndpointInputSchemas.componentsCreate,
		output: StoryblokEndpointOutputSchemas.componentsCreate,
	},
	'components.update': {
		input: StoryblokEndpointInputSchemas.componentsUpdate,
		output: StoryblokEndpointOutputSchemas.componentsUpdate,
	},
	'components.delete': {
		input: StoryblokEndpointInputSchemas.componentsDelete,
		output: StoryblokEndpointOutputSchemas.componentsDelete,
	},
	'datasources.list': {
		input: StoryblokEndpointInputSchemas.datasourcesList,
		output: StoryblokEndpointOutputSchemas.datasourcesList,
	},
	'datasources.get': {
		input: StoryblokEndpointInputSchemas.datasourcesGet,
		output: StoryblokEndpointOutputSchemas.datasourcesGet,
	},
	'datasources.create': {
		input: StoryblokEndpointInputSchemas.datasourcesCreate,
		output: StoryblokEndpointOutputSchemas.datasourcesCreate,
	},
	'datasources.update': {
		input: StoryblokEndpointInputSchemas.datasourcesUpdate,
		output: StoryblokEndpointOutputSchemas.datasourcesUpdate,
	},
	'datasources.delete': {
		input: StoryblokEndpointInputSchemas.datasourcesDelete,
		output: StoryblokEndpointOutputSchemas.datasourcesDelete,
	},
	'datasourceEntries.list': {
		input: StoryblokEndpointInputSchemas.datasourceEntriesList,
		output: StoryblokEndpointOutputSchemas.datasourceEntriesList,
	},
	'datasourceEntries.get': {
		input: StoryblokEndpointInputSchemas.datasourceEntriesGet,
		output: StoryblokEndpointOutputSchemas.datasourceEntriesGet,
	},
	'datasourceEntries.create': {
		input: StoryblokEndpointInputSchemas.datasourceEntriesCreate,
		output: StoryblokEndpointOutputSchemas.datasourceEntriesCreate,
	},
	'datasourceEntries.update': {
		input: StoryblokEndpointInputSchemas.datasourceEntriesUpdate,
		output: StoryblokEndpointOutputSchemas.datasourceEntriesUpdate,
	},
	'datasourceEntries.delete': {
		input: StoryblokEndpointInputSchemas.datasourceEntriesDelete,
		output: StoryblokEndpointOutputSchemas.datasourceEntriesDelete,
	},
	'tags.list': {
		input: StoryblokEndpointInputSchemas.tagsList,
		output: StoryblokEndpointOutputSchemas.tagsList,
	},
	'tags.create': {
		input: StoryblokEndpointInputSchemas.tagsCreate,
		output: StoryblokEndpointOutputSchemas.tagsCreate,
	},
	'tags.update': {
		input: StoryblokEndpointInputSchemas.tagsUpdate,
		output: StoryblokEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: StoryblokEndpointInputSchemas.tagsDelete,
		output: StoryblokEndpointOutputSchemas.tagsDelete,
	},
	'webhooks.list': {
		input: StoryblokEndpointInputSchemas.webhooksList,
		output: StoryblokEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: StoryblokEndpointInputSchemas.webhooksGet,
		output: StoryblokEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: StoryblokEndpointInputSchemas.webhooksCreate,
		output: StoryblokEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: StoryblokEndpointInputSchemas.webhooksUpdate,
		output: StoryblokEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: StoryblokEndpointInputSchemas.webhooksDelete,
		output: StoryblokEndpointOutputSchemas.webhooksDelete,
	},
	'webhooks.listActions': {
		input: StoryblokEndpointInputSchemas.webhooksListActions,
		output: StoryblokEndpointOutputSchemas.webhooksListActions,
	},
	'assets.list': {
		input: StoryblokEndpointInputSchemas.assetsList,
		output: StoryblokEndpointOutputSchemas.assetsList,
	},
	'assets.get': {
		input: StoryblokEndpointInputSchemas.assetsGet,
		output: StoryblokEndpointOutputSchemas.assetsGet,
	},
	'assets.update': {
		input: StoryblokEndpointInputSchemas.assetsUpdate,
		output: StoryblokEndpointOutputSchemas.assetsUpdate,
	},
	'assets.delete': {
		input: StoryblokEndpointInputSchemas.assetsDelete,
		output: StoryblokEndpointOutputSchemas.assetsDelete,
	},
	'assets.bulkDelete': {
		input: StoryblokEndpointInputSchemas.assetsBulkDelete,
		output: StoryblokEndpointOutputSchemas.assetsBulkDelete,
	},
	'releases.list': {
		input: StoryblokEndpointInputSchemas.releasesList,
		output: StoryblokEndpointOutputSchemas.releasesList,
	},
	'releases.get': {
		input: StoryblokEndpointInputSchemas.releasesGet,
		output: StoryblokEndpointOutputSchemas.releasesGet,
	},
	'releases.create': {
		input: StoryblokEndpointInputSchemas.releasesCreate,
		output: StoryblokEndpointOutputSchemas.releasesCreate,
	},
	'releases.update': {
		input: StoryblokEndpointInputSchemas.releasesUpdate,
		output: StoryblokEndpointOutputSchemas.releasesUpdate,
	},
	'releases.delete': {
		input: StoryblokEndpointInputSchemas.releasesDelete,
		output: StoryblokEndpointOutputSchemas.releasesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof storyblokEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const storyblokEndpointMeta = {
	'stories.list': {
		riskLevel: 'read',
		description:
			"List stories with filters for slug, tag, parent, publication state and release. This route omits each story's content unless with_summary is set",
	},
	'stories.get': {
		riskLevel: 'read',
		description:
			'Read one story with its full content, published state, tags and version ids',
	},
	'stories.create': {
		riskLevel: 'write',
		description:
			'Create a story, optionally publishing it or grouping it in a release in the same call',
	},
	'stories.update': {
		riskLevel: 'write',
		description:
			"Replace a story's fields and content. Sending publish also publishes it; without it the change stays a draft",
	},
	'stories.publish': {
		riskLevel: 'write',
		description:
			'Publish a story, or add it to a release with release_id. Storyblok implements this as a GET, but it changes published state',
	},
	'stories.unpublish': {
		riskLevel: 'write',
		description:
			'Unpublish a story, so the Content Delivery API stops serving it. Storyblok implements this as a GET',
	},
	'stories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a story and trash it. Storyblok keeps it in the trash, but this plugin does not wrap a restore, so treat it as permanent',
	},
	'spaces.list': {
		riskLevel: 'read',
		description:
			'List the spaces the token can reach, which is how a space id is found',
	},
	'spaces.get': {
		riskLevel: 'read',
		description:
			'Read the configured space: its plan, counts, environments and defaults',
	},
	'components.list': {
		riskLevel: 'read',
		description:
			'List the components that define content types, with their field schemas',
	},
	'components.create': {
		riskLevel: 'write',
		description:
			'Create a component, which is the field schema a content type uses. Its name is the key content references',
	},
	'components.update': {
		riskLevel: 'write',
		description:
			"Replace a component's field schema. Existing content is not migrated, so a removed field loses its data",
	},
	'components.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a component. Content that uses it can no longer render, and this cannot be undone',
	},
	'datasources.list': {
		riskLevel: 'read',
		description:
			'List the datasources on the space, such as reusable option lists',
	},
	'datasources.get': {
		riskLevel: 'read',
		description: 'Read one datasource with its dimensions',
	},
	'datasources.create': {
		riskLevel: 'write',
		description:
			'Create a datasource, whose slug is what content uses to reference it',
	},
	'datasources.update': {
		riskLevel: 'write',
		description: 'Replace a datasource name and slug',
	},
	'datasources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a datasource along with its entries. Content that references it is left pointing at nothing',
	},
	'datasourceEntries.list': {
		riskLevel: 'read',
		description:
			'List datasource entries, optionally only those of one datasource or one dimension value',
	},
	'datasourceEntries.get': {
		riskLevel: 'read',
		description: 'Read one datasource entry with its name, value and position',
	},
	'datasourceEntries.create': {
		riskLevel: 'write',
		description: 'Add an entry to a datasource',
	},
	'datasourceEntries.update': {
		riskLevel: 'write',
		description: "Replace a datasource entry's name and value",
	},
	'datasourceEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a datasource entry; content using that option loses it',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the tags on the space with how many stories carry each',
	},
	'tags.create': {
		riskLevel: 'write',
		description:
			'Create a tag, optionally attaching it to a story as it is created',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Rename a tag, which updates every story that carries it',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a tag, removing it from every story that carried it. This cannot be undone',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhook endpoints on the space',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook endpoint with its actions and activation',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a webhook endpoint for the given actions, optionally with a secret Storyblok signs each delivery with',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Replace a webhook endpoint, its action list or its activation',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook endpoint, so Storyblok stops posting to its URL',
	},
	'webhooks.listActions': {
		riskLevel: 'read',
		description:
			'List the action names a webhook may subscribe to, read from Storyblok so a new event needs no plugin change',
	},
	'assets.list': {
		riskLevel: 'read',
		description: 'List assets with a search and a folder filter',
	},
	'assets.get': {
		riskLevel: 'read',
		description: 'Read one asset with its file details and metadata',
	},
	'assets.update': {
		riskLevel: 'write',
		description:
			"Change an asset's metadata: alt text, title, copyright, focus point, privacy and publish window. Uploading new bytes is a separate flow and is not wrapped",
	},
	'assets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one asset, so any content referencing it shows a broken file',
	},
	'assets.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete several assets in one call, with the same effect as deleting each',
	},
	'releases.list': {
		riskLevel: 'read',
		description: 'List releases with their schedules and released state',
	},
	'releases.get': {
		riskLevel: 'read',
		description:
			'Read one release with its schedule, released state and the branches it deploys',
	},
	'releases.create': {
		riskLevel: 'write',
		description:
			'Create a release that stories can be grouped into and published together',
	},
	'releases.update': {
		riskLevel: 'write',
		description:
			'Change a release, or publish it in the same call with do_release',
	},
	'releases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a release. The stories grouped in it stay, but the grouping is gone',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof storyblokEndpointsNested
>;

export type BaseStoryblokPlugin<T extends StoryblokPluginOptions> =
	CorsairPlugin<
		'storyblok',
		typeof StoryblokSchema,
		typeof storyblokEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof storyblokAuthConfig
	>;

export type InternalStoryblokPlugin =
	BaseStoryblokPlugin<StoryblokPluginOptions>;

export type ExternalStoryblokPlugin<T extends StoryblokPluginOptions> =
	BaseStoryblokPlugin<T>;

export function storyblok<const T extends StoryblokPluginOptions>(
	incomingOptions: StoryblokPluginOptions & T = {} as StoryblokPluginOptions &
		T,
): ExternalStoryblokPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'storyblok',
		authConfig: storyblokAuthConfig,
		schema: StoryblokSchema,
		options: options,
		hooks: options.hooks,
		endpoints: storyblokEndpointsNested,
		webhooks: {},
		endpointMeta: storyblokEndpointMeta,
		endpointSchemas: storyblokEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: StoryblokKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('storyblok', ctx.authType ?? 'api_key');
		},
	} satisfies InternalStoryblokPlugin;
}

export type { StoryblokRegion } from './client';
export { STORYBLOK_HOSTS, StoryblokAPIError } from './client';

export type {
	AssetWriteResponse,
	ComponentWriteResponse,
	DatasourceEntryWriteResponse,
	DatasourceWriteResponse,
	ReleaseWriteResponse,
	StoriesCreateInput,
	StoriesListInput,
	StoriesUpdateInput,
	StoryblokAsset,
	StoryblokComponent,
	StoryblokDatasource,
	StoryblokDatasourceEntry,
	StoryblokEndpointInputs,
	StoryblokEndpointOutputs,
	StoryblokRelease,
	StoryblokSpace,
	StoryblokStory,
	StoryblokTag,
	StoryblokWebhook,
	WebhooksCreateInput,
} from './endpoints/types';
