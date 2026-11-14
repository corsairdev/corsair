import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, CustomFields, Forms, Subscribers, Tags } from './endpoints';
import type { KitEndpointInputs, KitEndpointOutputs } from './endpoints/types';
import {
	KitEndpointInputSchemas,
	KitEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KitSchema } from './schema';

export type KitPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKitPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kitEndpointsNested>;
};

export type KitContext = CorsairPluginContext<
	typeof KitSchema,
	KitPluginOptions
>;

export type KitKeyBuilderContext = KeyBuilderContext<KitPluginOptions>;

export type KitBoundEndpoints = BindEndpoints<typeof kitEndpointsNested>;

type KitEndpoint<K extends keyof KitEndpointOutputs> = CorsairEndpoint<
	KitContext,
	KitEndpointInputs[K],
	KitEndpointOutputs[K]
>;

export type KitEndpoints = {
	accountGet: KitEndpoint<'accountGet'>;
	subscribersList: KitEndpoint<'subscribersList'>;
	subscribersGet: KitEndpoint<'subscribersGet'>;
	subscribersCreate: KitEndpoint<'subscribersCreate'>;
	subscribersUpdate: KitEndpoint<'subscribersUpdate'>;
	subscribersUnsubscribe: KitEndpoint<'subscribersUnsubscribe'>;
	tagsList: KitEndpoint<'tagsList'>;
	tagsCreate: KitEndpoint<'tagsCreate'>;
	tagsUpdate: KitEndpoint<'tagsUpdate'>;
	tagsTagSubscriber: KitEndpoint<'tagsTagSubscriber'>;
	tagsUntagSubscriber: KitEndpoint<'tagsUntagSubscriber'>;
	customFieldsList: KitEndpoint<'customFieldsList'>;
	customFieldsCreate: KitEndpoint<'customFieldsCreate'>;
	customFieldsUpdate: KitEndpoint<'customFieldsUpdate'>;
	formsList: KitEndpoint<'formsList'>;
	formsSubscribe: KitEndpoint<'formsSubscribe'>;
};

const kitEndpointsNested = {
	account: {
		get: Account.get,
	},
	subscribers: {
		list: Subscribers.list,
		get: Subscribers.get,
		create: Subscribers.create,
		update: Subscribers.update,
		unsubscribe: Subscribers.unsubscribe,
	},
	tags: {
		list: Tags.list,
		create: Tags.create,
		update: Tags.update,
		tagSubscriber: Tags.tagSubscriber,
		untagSubscriber: Tags.untagSubscriber,
	},
	customFields: {
		list: CustomFields.list,
		create: CustomFields.create,
		update: CustomFields.update,
	},
	forms: {
		list: Forms.list,
		subscribe: Forms.subscribe,
	},
} as const;

export const kitEndpointSchemas = {
	'account.get': {
		input: KitEndpointInputSchemas.accountGet,
		output: KitEndpointOutputSchemas.accountGet,
	},
	'subscribers.list': {
		input: KitEndpointInputSchemas.subscribersList,
		output: KitEndpointOutputSchemas.subscribersList,
	},
	'subscribers.get': {
		input: KitEndpointInputSchemas.subscribersGet,
		output: KitEndpointOutputSchemas.subscribersGet,
	},
	'subscribers.create': {
		input: KitEndpointInputSchemas.subscribersCreate,
		output: KitEndpointOutputSchemas.subscribersCreate,
	},
	'subscribers.update': {
		input: KitEndpointInputSchemas.subscribersUpdate,
		output: KitEndpointOutputSchemas.subscribersUpdate,
	},
	'subscribers.unsubscribe': {
		input: KitEndpointInputSchemas.subscribersUnsubscribe,
		output: KitEndpointOutputSchemas.subscribersUnsubscribe,
	},
	'tags.list': {
		input: KitEndpointInputSchemas.tagsList,
		output: KitEndpointOutputSchemas.tagsList,
	},
	'tags.create': {
		input: KitEndpointInputSchemas.tagsCreate,
		output: KitEndpointOutputSchemas.tagsCreate,
	},
	'tags.update': {
		input: KitEndpointInputSchemas.tagsUpdate,
		output: KitEndpointOutputSchemas.tagsUpdate,
	},
	'tags.tagSubscriber': {
		input: KitEndpointInputSchemas.tagsTagSubscriber,
		output: KitEndpointOutputSchemas.tagsTagSubscriber,
	},
	'tags.untagSubscriber': {
		input: KitEndpointInputSchemas.tagsUntagSubscriber,
		output: KitEndpointOutputSchemas.tagsUntagSubscriber,
	},
	'customFields.list': {
		input: KitEndpointInputSchemas.customFieldsList,
		output: KitEndpointOutputSchemas.customFieldsList,
	},
	'customFields.create': {
		input: KitEndpointInputSchemas.customFieldsCreate,
		output: KitEndpointOutputSchemas.customFieldsCreate,
	},
	'customFields.update': {
		input: KitEndpointInputSchemas.customFieldsUpdate,
		output: KitEndpointOutputSchemas.customFieldsUpdate,
	},
	'forms.list': {
		input: KitEndpointInputSchemas.formsList,
		output: KitEndpointOutputSchemas.formsList,
	},
	'forms.subscribe': {
		input: KitEndpointInputSchemas.formsSubscribe,
		output: KitEndpointOutputSchemas.formsSubscribe,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof kitEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const kitEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'The account and its user: plan, primary address, timezone and the sending addresses with their verification and DMARC status',
	},
	'subscribers.list': {
		riskLevel: 'read',
		description:
			'Subscribers by state, address or date, cursor-paged, with optional attribution, tags and location',
	},
	'subscribers.get': {
		riskLevel: 'read',
		description: 'One subscriber with their custom field values and location',
	},
	'subscribers.create': {
		riskLevel: 'write',
		description:
			'Create a subscriber, or return the existing one for an address already on the list. Unknown custom field keys are ignored and named in `warnings`',
	},
	'subscribers.update': {
		riskLevel: 'write',
		description:
			'Change a subscriber’s address, first name or custom field values',
	},
	'subscribers.unsubscribe': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unsubscribe a subscriber, which stops every future send to them; re-subscribing takes their own action, not a call',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'Every tag, optionally with its active subscriber count',
	},
	'tags.create': {
		riskLevel: 'write',
		description:
			'Create a tag, or return the existing one when the name is taken',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Rename a tag',
	},
	'tags.tagSubscriber': {
		riskLevel: 'write',
		description: 'Add a tag to an existing subscriber, found by email address',
	},
	'tags.untagSubscriber': {
		riskLevel: 'write',
		description: 'Remove a tag from a subscriber, found by email address',
	},
	'customFields.list': {
		riskLevel: 'read',
		description:
			'Every custom field with the `key` a subscriber’s `fields` map uses',
	},
	'customFields.create': {
		riskLevel: 'write',
		description: 'Create a custom field; Kit derives its `key` from the label',
	},
	'customFields.update': {
		riskLevel: 'write',
		description: 'Change a custom field’s label',
	},
	'forms.list': {
		riskLevel: 'read',
		description:
			'Forms by status, cursor-paged, optionally with each one’s subscriber count',
	},
	'forms.subscribe': {
		// The form's incentive email goes to the subscriber, so this sends.
		riskLevel: 'destructive',
		description:
			'Add an existing subscriber to a form, which applies the form’s incentive and records when they were added. Create the subscriber first',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kitEndpointsNested>;

export type BaseKitPlugin<T extends KitPluginOptions> = CorsairPlugin<
	'kit',
	typeof KitSchema,
	typeof kitEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalKitPlugin = BaseKitPlugin<KitPluginOptions>;

export type ExternalKitPlugin<T extends KitPluginOptions> = BaseKitPlugin<T>;

export function kit<const T extends KitPluginOptions>(
	incomingOptions: KitPluginOptions & T = {} as KitPluginOptions & T,
): ExternalKitPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kit',
		schema: KitSchema,
		options,
		hooks: options.hooks,
		endpoints: kitEndpointsNested,
		webhooks: {},
		endpointMeta: kitEndpointMeta,
		endpointSchemas: kitEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KitKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('kit', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKitPlugin;
}

export { KitAPIError } from './client';

export type {
	AccountGetInput,
	AccountResponse,
	CustomFieldResponse,
	CustomFieldsCreateInput,
	CustomFieldsListInput,
	CustomFieldsListResponse,
	CustomFieldsUpdateInput,
	FormSubscriberResponse,
	FormsListInput,
	FormsListResponse,
	FormsSubscribeInput,
	KitCustomField,
	KitEndpointInputs,
	KitEndpointOutputs,
	KitForm,
	KitPagination,
	KitSubscriber,
	KitSubscriberLocation,
	KitTag,
	SubscriberGetInput,
	SubscriberResponse,
	SubscribersCreateInput,
	SubscribersListInput,
	SubscribersListResponse,
	SubscribersUnsubscribeInput,
	SubscribersUpdateInput,
	SubscriberWriteResponse,
	TaggedResponse,
	TagResponse,
	TagsCreateInput,
	TagsListInput,
	TagsListResponse,
	TagsTagSubscriberInput,
	TagsUntagSubscriberInput,
	TagsUpdateInput,
	UnsubscribedResponse,
} from './endpoints/types';
