import type {
	AuthTypes,
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
	Campaigns,
	Contacts,
	Tags,
	Testimonials,
	WallOfLove,
	Widgets,
} from './endpoints';
import type {
	EndorsalEndpointInputs,
	EndorsalEndpointOutputs,
} from './endpoints/types';
import {
	EndorsalEndpointInputSchemas,
	EndorsalEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EndorsalSchema } from './schema';

export type EndorsalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEndorsalPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endorsalEndpointsNested>;
};

export type EndorsalContext = CorsairPluginContext<
	typeof EndorsalSchema,
	EndorsalPluginOptions
>;

export type EndorsalKeyBuilderContext =
	KeyBuilderContext<EndorsalPluginOptions>;
export type EndorsalBoundEndpoints = BindEndpoints<
	typeof endorsalEndpointsNested
>;

type Endpoint<K extends keyof EndorsalEndpointOutputs> = CorsairEndpoint<
	EndorsalContext,
	EndorsalEndpointInputs[K],
	EndorsalEndpointOutputs[K]
>;

export type EndorsalEndpoints = {
	testimonialsList: Endpoint<'testimonialsList'>;
	testimonialsGet: Endpoint<'testimonialsGet'>;
	testimonialsCreate: Endpoint<'testimonialsCreate'>;
	testimonialsUpdate: Endpoint<'testimonialsUpdate'>;
	testimonialsDelete: Endpoint<'testimonialsDelete'>;
	testimonialsAddTags: Endpoint<'testimonialsAddTags'>;
	testimonialsSearch: Endpoint<'testimonialsSearch'>;
	testimonialsByTag: Endpoint<'testimonialsByTag'>;
	testimonialsByContact: Endpoint<'testimonialsByContact'>;
	contactsList: Endpoint<'contactsList'>;
	contactsCreate: Endpoint<'contactsCreate'>;
	contactsGet: Endpoint<'contactsGet'>;
	contactsUpdate: Endpoint<'contactsUpdate'>;
	contactsArchive: Endpoint<'contactsArchive'>;
	contactsSearch: Endpoint<'contactsSearch'>;
	tagsList: Endpoint<'tagsList'>;
	tagsCreate: Endpoint<'tagsCreate'>;
	tagsGet: Endpoint<'tagsGet'>;
	tagsUpdate: Endpoint<'tagsUpdate'>;
	tagsDelete: Endpoint<'tagsDelete'>;
	widgetsList: Endpoint<'widgetsList'>;
	widgetsGet: Endpoint<'widgetsGet'>;
	wallOfLoveGet: Endpoint<'wallOfLoveGet'>;
	campaignsList: Endpoint<'campaignsList'>;
	campaignsGet: Endpoint<'campaignsGet'>;
};

const endorsalEndpointsNested = {
	testimonials: {
		get: Testimonials.list,
		byId: {
			get: Testimonials.get,
			patch: Testimonials.update,
			delete: Testimonials.remove,
			tag: { post: Testimonials.addTags },
		},
		post: Testimonials.create,
		search: { post: Testimonials.search },
	},
	contacts: {
		get: Contacts.list,
		post: Contacts.create,
		byId: {
			get: Contacts.get,
			patch: Contacts.update,
			delete: Contacts.archive,
		},
		search: { post: Contacts.search },
		testimonials: { get: Testimonials.byContact },
	},
	tags: {
		get: Tags.list,
		post: Tags.create,
		byId: {
			get: Tags.get,
			patch: Tags.update,
			delete: Tags.remove,
		},
		testimonials: { get: Testimonials.byTag },
	},
	widgets: {
		get: Widgets.list,
		byId: { get: Widgets.get },
	},
	wallOfLove: { get: WallOfLove.get },
	autorequests: {
		campaigns: {
			get: Campaigns.list,
			byId: { get: Campaigns.get },
		},
	},
} as const;

export const endorsalEndpointSchemas = {
	'testimonials.get': {
		input: EndorsalEndpointInputSchemas.testimonialsList,
		output: EndorsalEndpointOutputSchemas.testimonialsList,
	},
	'testimonials.byId.get': {
		input: EndorsalEndpointInputSchemas.testimonialsGet,
		output: EndorsalEndpointOutputSchemas.testimonialsGet,
	},
	'testimonials.post': {
		input: EndorsalEndpointInputSchemas.testimonialsCreate,
		output: EndorsalEndpointOutputSchemas.testimonialsCreate,
	},
	'testimonials.byId.patch': {
		input: EndorsalEndpointInputSchemas.testimonialsUpdate,
		output: EndorsalEndpointOutputSchemas.testimonialsUpdate,
	},
	'testimonials.byId.delete': {
		input: EndorsalEndpointInputSchemas.testimonialsDelete,
		output: EndorsalEndpointOutputSchemas.testimonialsDelete,
	},
	'testimonials.byId.tag.post': {
		input: EndorsalEndpointInputSchemas.testimonialsAddTags,
		output: EndorsalEndpointOutputSchemas.testimonialsAddTags,
	},
	'testimonials.search.post': {
		input: EndorsalEndpointInputSchemas.testimonialsSearch,
		output: EndorsalEndpointOutputSchemas.testimonialsSearch,
	},
	'contacts.get': {
		input: EndorsalEndpointInputSchemas.contactsList,
		output: EndorsalEndpointOutputSchemas.contactsList,
	},
	'contacts.post': {
		input: EndorsalEndpointInputSchemas.contactsCreate,
		output: EndorsalEndpointOutputSchemas.contactsCreate,
	},
	'contacts.byId.get': {
		input: EndorsalEndpointInputSchemas.contactsGet,
		output: EndorsalEndpointOutputSchemas.contactsGet,
	},
	'contacts.byId.patch': {
		input: EndorsalEndpointInputSchemas.contactsUpdate,
		output: EndorsalEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.byId.delete': {
		input: EndorsalEndpointInputSchemas.contactsArchive,
		output: EndorsalEndpointOutputSchemas.contactsArchive,
	},
	'contacts.search.post': {
		input: EndorsalEndpointInputSchemas.contactsSearch,
		output: EndorsalEndpointOutputSchemas.contactsSearch,
	},
	'contacts.testimonials.get': {
		input: EndorsalEndpointInputSchemas.testimonialsByContact,
		output: EndorsalEndpointOutputSchemas.testimonialsByContact,
	},
	'tags.get': {
		input: EndorsalEndpointInputSchemas.tagsList,
		output: EndorsalEndpointOutputSchemas.tagsList,
	},
	'tags.post': {
		input: EndorsalEndpointInputSchemas.tagsCreate,
		output: EndorsalEndpointOutputSchemas.tagsCreate,
	},
	'tags.byId.get': {
		input: EndorsalEndpointInputSchemas.tagsGet,
		output: EndorsalEndpointOutputSchemas.tagsGet,
	},
	'tags.byId.patch': {
		input: EndorsalEndpointInputSchemas.tagsUpdate,
		output: EndorsalEndpointOutputSchemas.tagsUpdate,
	},
	'tags.byId.delete': {
		input: EndorsalEndpointInputSchemas.tagsDelete,
		output: EndorsalEndpointOutputSchemas.tagsDelete,
	},
	'tags.testimonials.get': {
		input: EndorsalEndpointInputSchemas.testimonialsByTag,
		output: EndorsalEndpointOutputSchemas.testimonialsByTag,
	},
	'widgets.get': {
		input: EndorsalEndpointInputSchemas.widgetsList,
		output: EndorsalEndpointOutputSchemas.widgetsList,
	},
	'widgets.byId.get': {
		input: EndorsalEndpointInputSchemas.widgetsGet,
		output: EndorsalEndpointOutputSchemas.widgetsGet,
	},
	'wallOfLove.get': {
		input: EndorsalEndpointInputSchemas.wallOfLoveGet,
		output: EndorsalEndpointOutputSchemas.wallOfLoveGet,
	},
	'autorequests.campaigns.get': {
		input: EndorsalEndpointInputSchemas.campaignsList,
		output: EndorsalEndpointOutputSchemas.campaignsList,
	},
	'autorequests.campaigns.byId.get': {
		input: EndorsalEndpointInputSchemas.campaignsGet,
		output: EndorsalEndpointOutputSchemas.campaignsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof endorsalEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const endorsalEndpointMeta = {
	'testimonials.get': {
		riskLevel: 'read',
		description: 'List testimonials for the configured property',
	},
	'testimonials.byId.get': {
		riskLevel: 'read',
		description: 'Retrieve a testimonial by ID',
	},
	'testimonials.post': {
		riskLevel: 'write',
		description: 'Create a testimonial',
	},
	'testimonials.byId.patch': {
		riskLevel: 'write',
		description: 'Update testimonial fields',
	},
	'testimonials.byId.delete': {
		riskLevel: 'destructive',
		description: 'Delete a testimonial',
	},
	'testimonials.byId.tag.post': {
		riskLevel: 'write',
		description: 'Add tags to a testimonial',
	},
	'testimonials.search.post': {
		riskLevel: 'read',
		description: 'Search testimonials with AND-combined match conditions',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'List contacts for the configured property',
	},
	'contacts.post': {
		riskLevel: 'destructive',
		description:
			'Create a contact; with campaignID, enroll it in an AutoRequest campaign that emails the contact. Destructive because that enrollment sends email',
	},
	'contacts.byId.get': {
		riskLevel: 'read',
		description: 'Retrieve a contact by ID',
	},
	'contacts.byId.patch': {
		riskLevel: 'write',
		description: 'Update contact fields',
	},
	'contacts.byId.delete': {
		riskLevel: 'destructive',
		description: 'Archive a contact',
	},
	'contacts.search.post': {
		riskLevel: 'read',
		description: 'Search contacts with AND-combined match conditions',
	},
	'contacts.testimonials.get': {
		riskLevel: 'read',
		description: 'List testimonials for a contact',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'List tags for the configured property',
	},
	'tags.post': {
		riskLevel: 'write',
		description: 'Create a tag or product tag',
	},
	'tags.byId.get': { riskLevel: 'read', description: 'Retrieve a tag by ID' },
	'tags.byId.patch': { riskLevel: 'write', description: 'Update tag fields' },
	'tags.byId.delete': { riskLevel: 'destructive', description: 'Delete a tag' },
	'tags.testimonials.get': {
		riskLevel: 'read',
		description: 'List testimonials associated with a tag',
	},
	'widgets.get': {
		riskLevel: 'read',
		description: 'List widgets for the configured property',
	},
	'widgets.byId.get': {
		riskLevel: 'read',
		description: 'Retrieve a widget and its testimonials, optionally rendered',
	},
	'wallOfLove.get': {
		riskLevel: 'read',
		description:
			'Retrieve a Wall of Love and its testimonials, optionally rendered',
	},
	'autorequests.campaigns.get': {
		riskLevel: 'read',
		description: 'List AutoRequest campaigns',
	},
	'autorequests.campaigns.byId.get': {
		riskLevel: 'read',
		description: 'Retrieve an AutoRequest campaign by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endorsalEndpointsNested>;

export const endorsalAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseEndorsalPlugin<T extends EndorsalPluginOptions> = CorsairPlugin<
	'endorsal',
	typeof EndorsalSchema,
	typeof endorsalEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalEndorsalPlugin = BaseEndorsalPlugin<EndorsalPluginOptions>;
export type ExternalEndorsalPlugin<T extends EndorsalPluginOptions> =
	BaseEndorsalPlugin<T>;

export function endorsal<const T extends EndorsalPluginOptions>(
	incomingOptions: EndorsalPluginOptions & T = {} as EndorsalPluginOptions & T,
): ExternalEndorsalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	return {
		id: 'endorsal',
		authConfig: endorsalAuthConfig,
		schema: EndorsalSchema,
		options,
		hooks: options.hooks,
		endpoints: endorsalEndpointsNested,
		webhooks: {},
		endpointMeta: endorsalEndpointMeta,
		endpointSchemas: endorsalEndpointSchemas,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: EndorsalKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) return options.key;
			const apiKey = ctx.keys ? await ctx.keys.get_api_key() : null;
			if (apiKey) return apiKey;
			// Every route, GETs included, answers 401 without a key.
			throw new AuthMissingError('endorsal', 'api_key');
		},
	} satisfies InternalEndorsalPlugin;
}

export type {
	EndorsalEndpointInputs,
	EndorsalEndpointName,
	EndorsalEndpointOutputs,
} from './endpoints/types';
