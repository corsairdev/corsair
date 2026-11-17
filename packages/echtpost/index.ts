import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { EchtpostContext } from './context';
import {
	accountCredits,
	accountGet,
	CardsListOutputSchema,
	ContactsListOutputSchema,
	cardsCancel,
	cardsCreate,
	cardsCreateFromTemplate,
	cardsGet,
	cardsList,
	cardsPreviewFit,
	contactsCreate,
	contactsDelete,
	contactsGet,
	contactsList,
	contactsUpdate,
	GroupsListOutputSchema,
	groupsCreate,
	groupsDelete,
	groupsGet,
	groupsList,
	groupsUpdate,
	listTemplates,
	MotivesListOutputSchema,
	motivesGet,
	motivesList,
	templatesGet,
} from './endpoints';
import {
	CancelSchema,
	CardCreateInputSchema,
	CardFromTemplateInputSchema,
	CardIdInputSchema,
	CardSchema,
	CardsListInputSchema,
	ContactCreateInputSchema,
	ContactIdInputSchema,
	ContactSchema,
	ContactsListInputSchema,
	ContactUpdateInputSchema,
	CreditsSchema,
	DeletedSchema,
	EmptyInputSchema,
	GroupCreateInputSchema,
	GroupIdInputSchema,
	GroupSchema,
	GroupsListInputSchema,
	GroupUpdateInputSchema,
	ListTemplatesInputSchema,
	ListTemplatesResponseSchema,
	MeSchema,
	MotiveIdInputSchema,
	MotiveSchema,
	MotivesListInputSchema,
	PreviewFitInputSchema,
	PreviewFitSchema,
	TemplateIdInputSchema,
	TemplateSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EchtpostSchema } from './schema';

export type { EchtpostContext };

export type EchtpostPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEchtpostPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof echtpostEndpointsNested>;
};

export type EchtpostKeyBuilderContext =
	KeyBuilderContext<EchtpostPluginOptions>;

const echtpostEndpointsNested = {
	account: {
		get: accountGet,
		credits: accountCredits,
	},
	contacts: {
		list: contactsList,
		get: contactsGet,
		create: contactsCreate,
		update: contactsUpdate,
		delete: contactsDelete,
	},
	groups: {
		list: groupsList,
		get: groupsGet,
		create: groupsCreate,
		update: groupsUpdate,
		delete: groupsDelete,
	},
	templates: {
		list: listTemplates,
		get: templatesGet,
	},
	motives: {
		list: motivesList,
		get: motivesGet,
	},
	cards: {
		list: cardsList,
		get: cardsGet,
		create: cardsCreate,
		createFromTemplate: cardsCreateFromTemplate,
		previewFit: cardsPreviewFit,
		cancel: cardsCancel,
	},
} as const;

const echtpostWebhooksNested = {} as const;

export const echtpostEndpointSchemas = {
	'account.get': { input: EmptyInputSchema, output: MeSchema },
	'account.credits': { input: EmptyInputSchema, output: CreditsSchema },
	'contacts.list': {
		input: ContactsListInputSchema,
		output: ContactsListOutputSchema,
	},
	'contacts.get': { input: ContactIdInputSchema, output: ContactSchema },
	'contacts.create': { input: ContactCreateInputSchema, output: ContactSchema },
	'contacts.update': { input: ContactUpdateInputSchema, output: ContactSchema },
	'contacts.delete': { input: ContactIdInputSchema, output: DeletedSchema },
	'groups.list': {
		input: GroupsListInputSchema,
		output: GroupsListOutputSchema,
	},
	'groups.get': { input: GroupIdInputSchema, output: GroupSchema },
	'groups.create': { input: GroupCreateInputSchema, output: GroupSchema },
	'groups.update': { input: GroupUpdateInputSchema, output: GroupSchema },
	'groups.delete': { input: GroupIdInputSchema, output: DeletedSchema },
	'templates.list': {
		input: ListTemplatesInputSchema,
		output: ListTemplatesResponseSchema,
	},
	'templates.get': { input: TemplateIdInputSchema, output: TemplateSchema },
	'motives.list': {
		input: MotivesListInputSchema,
		output: MotivesListOutputSchema,
	},
	'motives.get': { input: MotiveIdInputSchema, output: MotiveSchema },
	'cards.list': { input: CardsListInputSchema, output: CardsListOutputSchema },
	'cards.get': { input: CardIdInputSchema, output: CardSchema },
	'cards.create': { input: CardCreateInputSchema, output: CardSchema },
	'cards.createFromTemplate': {
		input: CardFromTemplateInputSchema,
		output: CardSchema,
	},
	'cards.previewFit': {
		input: PreviewFitInputSchema,
		output: PreviewFitSchema,
	},
	'cards.cancel': { input: CardIdInputSchema, output: CancelSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof echtpostEndpointsNested
>;

const echtpostEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get the account, user, API key metadata and balance.',
	},
	'account.credits': {
		riskLevel: 'read',
		description: 'Get the credit balance, cards left and price per card.',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts (postcard recipients), with filters and paging.',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get one contact by id.',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact with a postal address.',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact; fields left out stay as they are.',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact.',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List contact groups.',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Get one group by id.',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a contact group.',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Rename a group or change its external id.',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a group.',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List saved Echtpost postcard templates.',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get one saved template by id.',
	},
	'motives.list': {
		riskLevel: 'read',
		description:
			'List the postcard motives (front designs) the account can use.',
	},
	'motives.get': {
		riskLevel: 'read',
		description: 'Get one motive and what text fields it allows.',
	},
	'cards.list': {
		riskLevel: 'read',
		description: 'List cards, filtered by status, delivery date or motive.',
	},
	'cards.get': {
		riskLevel: 'read',
		description: 'Get one card and its status.',
	},
	'cards.create': {
		riskLevel: 'destructive',
		description:
			'Print and post a real postcard to each recipient; the account is billed per card.',
	},
	'cards.createFromTemplate': {
		riskLevel: 'destructive',
		description:
			'Print and post a real postcard from a saved template; the account is billed per card.',
	},
	'cards.previewFit': {
		riskLevel: 'read',
		description:
			'Check whether card text fits at a font and size, without creating a card.',
	},
	'cards.cancel': {
		riskLevel: 'destructive',
		description:
			'Cancel a card that has not been printed yet; it cannot be restored.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof echtpostEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const echtpostAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEchtpostPlugin<T extends EchtpostPluginOptions> = CorsairPlugin<
	'echtpost',
	typeof EchtpostSchema,
	typeof echtpostEndpointsNested,
	typeof echtpostWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEchtpostPlugin = BaseEchtpostPlugin<EchtpostPluginOptions>;

export type ExternalEchtpostPlugin<T extends EchtpostPluginOptions> =
	BaseEchtpostPlugin<T>;

export function echtpost<const T extends EchtpostPluginOptions>(
	incomingOptions: EchtpostPluginOptions & T = {} as EchtpostPluginOptions & T,
): ExternalEchtpostPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'echtpost',
		authConfig: echtpostAuthConfig,
		schema: EchtpostSchema,
		options,
		hooks: options.hooks,
		endpoints: echtpostEndpointsNested,
		webhooks: echtpostWebhooksNested,
		endpointMeta: echtpostEndpointMeta,
		endpointSchemas: echtpostEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EchtpostKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('echtpost', 'api_key');
		},
	} satisfies InternalEchtpostPlugin;
}
