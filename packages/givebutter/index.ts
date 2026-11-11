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
import type {
	GivebutterEndpointInputs,
	GivebutterEndpointOutputs,
} from './endpoints';
import {
	Activities,
	Campaigns,
	Contacts,
	ContactTags,
	DiscountCodes,
	Funds,
	GivebutterEndpointInputSchemas,
	GivebutterEndpointOutputSchemas,
	HouseholdContacts,
	Households,
	Members,
	Messages,
	Payouts,
	Plans,
	Pledges,
	Sso,
	Teams,
	TicketItems,
	Tickets,
	Transactions,
	WebhookActivities,
	Webhooks,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { GivebutterSchema } from './schema';

export type GivebutterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGivebutterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof givebutterEndpointsNested>;
};

export type GivebutterContext = CorsairPluginContext<
	typeof GivebutterSchema,
	GivebutterPluginOptions
>;
export type GivebutterKeyBuilderContext =
	KeyBuilderContext<GivebutterPluginOptions>;
export type GivebutterBoundEndpoints = BindEndpoints<
	typeof givebutterEndpointsNested
>;
type GivebutterEndpoint<K extends keyof GivebutterEndpointOutputs> =
	CorsairEndpoint<
		GivebutterContext,
		GivebutterEndpointInputs[K],
		GivebutterEndpointOutputs[K]
	>;

export type GivebutterEndpoints = {
	[K in keyof GivebutterEndpointOutputs]: GivebutterEndpoint<K>;
};

const givebutterEndpointsNested = {
	campaigns: {
		list: Campaigns.list,
		create: Campaigns.create,
		get: Campaigns.get,
		update: Campaigns.update,
		delete: Campaigns.delete,
	},
	discountCodes: {
		list: DiscountCodes.list,
		create: DiscountCodes.create,
		get: DiscountCodes.get,
		update: DiscountCodes.update,
		delete: DiscountCodes.delete,
	},
	members: { list: Members.list, get: Members.get, delete: Members.delete },
	teams: { list: Teams.list, get: Teams.get, delete: Teams.delete },
	ticketItems: {
		list: TicketItems.list,
		create: TicketItems.create,
		get: TicketItems.get,
	},
	tickets: { list: Tickets.list, get: Tickets.get },
	sso: { account: Sso.account, campaign: Sso.campaign },
	contacts: {
		list: Contacts.list,
		create: Contacts.create,
		get: Contacts.get,
		update: Contacts.update,
		delete: Contacts.delete,
		restore: Contacts.restore,
	},
	activities: {
		list: Activities.list,
		create: Activities.create,
		get: Activities.get,
		update: Activities.update,
		delete: Activities.delete,
	},
	contactTags: {
		add: ContactTags.add,
		remove: ContactTags.remove,
		sync: ContactTags.sync,
	},
	funds: {
		list: Funds.list,
		create: Funds.create,
		get: Funds.get,
		update: Funds.update,
		delete: Funds.delete,
	},
	households: {
		list: Households.list,
		create: Households.create,
		get: Households.get,
		update: Households.update,
		delete: Households.delete,
	},
	householdContacts: {
		list: HouseholdContacts.list,
		add: HouseholdContacts.add,
		get: HouseholdContacts.get,
		remove: HouseholdContacts.remove,
	},
	messages: { list: Messages.list, get: Messages.get },
	payouts: { list: Payouts.list, get: Payouts.get },
	pledges: { list: Pledges.list, get: Pledges.get },
	plans: { list: Plans.list, get: Plans.get },
	transactions: {
		list: Transactions.list,
		create: Transactions.create,
		get: Transactions.get,
		update: Transactions.update,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		get: Webhooks.get,
		update: Webhooks.update,
		delete: Webhooks.delete,
		activities: { list: WebhookActivities.list, get: WebhookActivities.get },
	},
} as const;

export const givebutterEndpointSchemas = {
	'campaigns.list': {
		input: GivebutterEndpointInputSchemas.listCampaigns,
		output: GivebutterEndpointOutputSchemas.listCampaigns,
	},
	'campaigns.create': {
		input: GivebutterEndpointInputSchemas.createCampaign,
		output: GivebutterEndpointOutputSchemas.createCampaign,
	},
	'campaigns.get': {
		input: GivebutterEndpointInputSchemas.getCampaign,
		output: GivebutterEndpointOutputSchemas.getCampaign,
	},
	'campaigns.update': {
		input: GivebutterEndpointInputSchemas.updateCampaign,
		output: GivebutterEndpointOutputSchemas.updateCampaign,
	},
	'campaigns.delete': {
		input: GivebutterEndpointInputSchemas.deleteCampaign,
		output: GivebutterEndpointOutputSchemas.deleteCampaign,
	},
	'discountCodes.list': {
		input: GivebutterEndpointInputSchemas.listDiscountCodes,
		output: GivebutterEndpointOutputSchemas.listDiscountCodes,
	},
	'discountCodes.create': {
		input: GivebutterEndpointInputSchemas.createDiscountCode,
		output: GivebutterEndpointOutputSchemas.createDiscountCode,
	},
	'discountCodes.get': {
		input: GivebutterEndpointInputSchemas.getDiscountCode,
		output: GivebutterEndpointOutputSchemas.getDiscountCode,
	},
	'discountCodes.update': {
		input: GivebutterEndpointInputSchemas.updateDiscountCode,
		output: GivebutterEndpointOutputSchemas.updateDiscountCode,
	},
	'discountCodes.delete': {
		input: GivebutterEndpointInputSchemas.deleteDiscountCode,
		output: GivebutterEndpointOutputSchemas.deleteDiscountCode,
	},
	'members.list': {
		input: GivebutterEndpointInputSchemas.listMembers,
		output: GivebutterEndpointOutputSchemas.listMembers,
	},
	'members.get': {
		input: GivebutterEndpointInputSchemas.getMember,
		output: GivebutterEndpointOutputSchemas.getMember,
	},
	'members.delete': {
		input: GivebutterEndpointInputSchemas.deleteMember,
		output: GivebutterEndpointOutputSchemas.deleteMember,
	},
	'teams.list': {
		input: GivebutterEndpointInputSchemas.listTeams,
		output: GivebutterEndpointOutputSchemas.listTeams,
	},
	'teams.get': {
		input: GivebutterEndpointInputSchemas.getTeam,
		output: GivebutterEndpointOutputSchemas.getTeam,
	},
	'teams.delete': {
		input: GivebutterEndpointInputSchemas.deleteTeam,
		output: GivebutterEndpointOutputSchemas.deleteTeam,
	},
	'ticketItems.list': {
		input: GivebutterEndpointInputSchemas.listTicketItems,
		output: GivebutterEndpointOutputSchemas.listTicketItems,
	},
	'ticketItems.create': {
		input: GivebutterEndpointInputSchemas.createTicketItem,
		output: GivebutterEndpointOutputSchemas.createTicketItem,
	},
	'ticketItems.get': {
		input: GivebutterEndpointInputSchemas.getTicketItem,
		output: GivebutterEndpointOutputSchemas.getTicketItem,
	},
	'tickets.list': {
		input: GivebutterEndpointInputSchemas.listTickets,
		output: GivebutterEndpointOutputSchemas.listTickets,
	},
	'tickets.get': {
		input: GivebutterEndpointInputSchemas.getTicket,
		output: GivebutterEndpointOutputSchemas.getTicket,
	},
	'sso.account': {
		input: GivebutterEndpointInputSchemas.getSsoAccount,
		output: GivebutterEndpointOutputSchemas.getSsoAccount,
	},
	'sso.campaign': {
		input: GivebutterEndpointInputSchemas.getSsoCampaign,
		output: GivebutterEndpointOutputSchemas.getSsoCampaign,
	},
	'contacts.list': {
		input: GivebutterEndpointInputSchemas.listContacts,
		output: GivebutterEndpointOutputSchemas.listContacts,
	},
	'contacts.create': {
		input: GivebutterEndpointInputSchemas.createContact,
		output: GivebutterEndpointOutputSchemas.createContact,
	},
	'contacts.get': {
		input: GivebutterEndpointInputSchemas.getContact,
		output: GivebutterEndpointOutputSchemas.getContact,
	},
	'contacts.update': {
		input: GivebutterEndpointInputSchemas.updateContact,
		output: GivebutterEndpointOutputSchemas.updateContact,
	},
	'contacts.delete': {
		input: GivebutterEndpointInputSchemas.deleteContact,
		output: GivebutterEndpointOutputSchemas.deleteContact,
	},
	'contacts.restore': {
		input: GivebutterEndpointInputSchemas.restoreContact,
		output: GivebutterEndpointOutputSchemas.restoreContact,
	},
	'activities.list': {
		input: GivebutterEndpointInputSchemas.listActivities,
		output: GivebutterEndpointOutputSchemas.listActivities,
	},
	'activities.create': {
		input: GivebutterEndpointInputSchemas.createActivity,
		output: GivebutterEndpointOutputSchemas.createActivity,
	},
	'activities.get': {
		input: GivebutterEndpointInputSchemas.getActivity,
		output: GivebutterEndpointOutputSchemas.getActivity,
	},
	'activities.update': {
		input: GivebutterEndpointInputSchemas.updateActivity,
		output: GivebutterEndpointOutputSchemas.updateActivity,
	},
	'activities.delete': {
		input: GivebutterEndpointInputSchemas.deleteActivity,
		output: GivebutterEndpointOutputSchemas.deleteActivity,
	},
	'contactTags.add': {
		input: GivebutterEndpointInputSchemas.addTags,
		output: GivebutterEndpointOutputSchemas.addTags,
	},
	'contactTags.remove': {
		input: GivebutterEndpointInputSchemas.removeTags,
		output: GivebutterEndpointOutputSchemas.removeTags,
	},
	'contactTags.sync': {
		input: GivebutterEndpointInputSchemas.syncTags,
		output: GivebutterEndpointOutputSchemas.syncTags,
	},
	'funds.list': {
		input: GivebutterEndpointInputSchemas.listFunds,
		output: GivebutterEndpointOutputSchemas.listFunds,
	},
	'funds.create': {
		input: GivebutterEndpointInputSchemas.createFund,
		output: GivebutterEndpointOutputSchemas.createFund,
	},
	'funds.get': {
		input: GivebutterEndpointInputSchemas.getFund,
		output: GivebutterEndpointOutputSchemas.getFund,
	},
	'funds.update': {
		input: GivebutterEndpointInputSchemas.updateFund,
		output: GivebutterEndpointOutputSchemas.updateFund,
	},
	'funds.delete': {
		input: GivebutterEndpointInputSchemas.deleteFund,
		output: GivebutterEndpointOutputSchemas.deleteFund,
	},
	'households.list': {
		input: GivebutterEndpointInputSchemas.listHouseholds,
		output: GivebutterEndpointOutputSchemas.listHouseholds,
	},
	'households.create': {
		input: GivebutterEndpointInputSchemas.createHousehold,
		output: GivebutterEndpointOutputSchemas.createHousehold,
	},
	'households.get': {
		input: GivebutterEndpointInputSchemas.getHousehold,
		output: GivebutterEndpointOutputSchemas.getHousehold,
	},
	'households.update': {
		input: GivebutterEndpointInputSchemas.updateHousehold,
		output: GivebutterEndpointOutputSchemas.updateHousehold,
	},
	'households.delete': {
		input: GivebutterEndpointInputSchemas.deleteHousehold,
		output: GivebutterEndpointOutputSchemas.deleteHousehold,
	},
	'householdContacts.list': {
		input: GivebutterEndpointInputSchemas.listHouseholdContacts,
		output: GivebutterEndpointOutputSchemas.listHouseholdContacts,
	},
	'householdContacts.add': {
		input: GivebutterEndpointInputSchemas.addHouseholdContact,
		output: GivebutterEndpointOutputSchemas.addHouseholdContact,
	},
	'householdContacts.get': {
		input: GivebutterEndpointInputSchemas.getHouseholdContact,
		output: GivebutterEndpointOutputSchemas.getHouseholdContact,
	},
	'householdContacts.remove': {
		input: GivebutterEndpointInputSchemas.removeHouseholdContact,
		output: GivebutterEndpointOutputSchemas.removeHouseholdContact,
	},
	'messages.list': {
		input: GivebutterEndpointInputSchemas.listMessages,
		output: GivebutterEndpointOutputSchemas.listMessages,
	},
	'messages.get': {
		input: GivebutterEndpointInputSchemas.getMessage,
		output: GivebutterEndpointOutputSchemas.getMessage,
	},
	'payouts.list': {
		input: GivebutterEndpointInputSchemas.listPayouts,
		output: GivebutterEndpointOutputSchemas.listPayouts,
	},
	'payouts.get': {
		input: GivebutterEndpointInputSchemas.getPayout,
		output: GivebutterEndpointOutputSchemas.getPayout,
	},
	'pledges.list': {
		input: GivebutterEndpointInputSchemas.listPledges,
		output: GivebutterEndpointOutputSchemas.listPledges,
	},
	'pledges.get': {
		input: GivebutterEndpointInputSchemas.getPledge,
		output: GivebutterEndpointOutputSchemas.getPledge,
	},
	'plans.list': {
		input: GivebutterEndpointInputSchemas.listPlans,
		output: GivebutterEndpointOutputSchemas.listPlans,
	},
	'plans.get': {
		input: GivebutterEndpointInputSchemas.getPlan,
		output: GivebutterEndpointOutputSchemas.getPlan,
	},
	'transactions.list': {
		input: GivebutterEndpointInputSchemas.listTransactions,
		output: GivebutterEndpointOutputSchemas.listTransactions,
	},
	'transactions.create': {
		input: GivebutterEndpointInputSchemas.createTransaction,
		output: GivebutterEndpointOutputSchemas.createTransaction,
	},
	'transactions.get': {
		input: GivebutterEndpointInputSchemas.getTransaction,
		output: GivebutterEndpointOutputSchemas.getTransaction,
	},
	'transactions.update': {
		input: GivebutterEndpointInputSchemas.updateTransaction,
		output: GivebutterEndpointOutputSchemas.updateTransaction,
	},
	'webhooks.list': {
		input: GivebutterEndpointInputSchemas.listWebhooks,
		output: GivebutterEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.create': {
		input: GivebutterEndpointInputSchemas.createWebhook,
		output: GivebutterEndpointOutputSchemas.createWebhook,
	},
	'webhooks.get': {
		input: GivebutterEndpointInputSchemas.getWebhook,
		output: GivebutterEndpointOutputSchemas.getWebhook,
	},
	'webhooks.update': {
		input: GivebutterEndpointInputSchemas.updateWebhook,
		output: GivebutterEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.delete': {
		input: GivebutterEndpointInputSchemas.deleteWebhook,
		output: GivebutterEndpointOutputSchemas.deleteWebhook,
	},
	'webhooks.activities.list': {
		input: GivebutterEndpointInputSchemas.listWebhookActivities,
		output: GivebutterEndpointOutputSchemas.listWebhookActivities,
	},
	'webhooks.activities.get': {
		input: GivebutterEndpointInputSchemas.getWebhookActivity,
		output: GivebutterEndpointOutputSchemas.getWebhookActivity,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof givebutterEndpointsNested
>;

const givebutterEndpointMeta = {
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List fundraising campaigns.',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description: 'Create a fundraising campaign.',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Get a fundraising campaign.',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description: 'Update a fundraising campaign.',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a fundraising campaign.',
	},
	'discountCodes.list': {
		riskLevel: 'read',
		description: 'List a campaign’s discount codes.',
	},
	'discountCodes.create': {
		riskLevel: 'write',
		description: 'Create a campaign discount code.',
	},
	'discountCodes.get': {
		riskLevel: 'read',
		description: 'Get a campaign discount code.',
	},
	'discountCodes.update': {
		riskLevel: 'write',
		description: 'Update a campaign discount code.',
	},
	'discountCodes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign discount code.',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List a campaign’s members.',
	},
	'members.get': { riskLevel: 'read', description: 'Get a campaign member.' },
	'members.delete': {
		riskLevel: 'destructive',
		description: 'Remove a campaign member.',
	},
	'teams.list': { riskLevel: 'read', description: 'List a campaign’s teams.' },
	'teams.get': { riskLevel: 'read', description: 'Get a campaign team.' },
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Remove a campaign team.',
	},
	'ticketItems.list': {
		riskLevel: 'read',
		description: 'List a campaign’s ticket items.',
	},
	'ticketItems.create': {
		riskLevel: 'write',
		description: 'Create a campaign ticket item.',
	},
	'ticketItems.get': {
		riskLevel: 'read',
		description: 'Get a campaign ticket item.',
	},
	'tickets.list': { riskLevel: 'read', description: 'List issued tickets.' },
	'tickets.get': { riskLevel: 'read', description: 'Get an issued ticket.' },
	'sso.account': { riskLevel: 'read', description: 'Get the SSO account.' },
	'sso.campaign': {
		riskLevel: 'read',
		description: 'Get a campaign through the SSO API.',
	},
	'contacts.list': { riskLevel: 'read', description: 'List contacts.' },
	'contacts.create': { riskLevel: 'write', description: 'Create a contact.' },
	'contacts.get': { riskLevel: 'read', description: 'Get a contact.' },
	'contacts.update': { riskLevel: 'write', description: 'Update a contact.' },
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact.',
	},
	'contacts.restore': {
		riskLevel: 'write',
		description: 'Restore a deleted contact.',
	},
	'activities.list': {
		riskLevel: 'read',
		description: 'List contact activities.',
	},
	'activities.create': {
		riskLevel: 'write',
		description: 'Create a contact activity.',
	},
	'activities.get': {
		riskLevel: 'read',
		description: 'Get a contact activity.',
	},
	'activities.update': {
		riskLevel: 'write',
		description: 'Update a contact activity.',
	},
	'activities.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact activity.',
	},
	'contactTags.add': {
		riskLevel: 'write',
		description: 'Add tags to a contact.',
	},
	'contactTags.remove': {
		riskLevel: 'write',
		description: 'Remove tags from a contact.',
	},
	'contactTags.sync': {
		riskLevel: 'write',
		description: 'Replace a contact’s tags.',
	},
	'funds.list': { riskLevel: 'read', description: 'List funds.' },
	'funds.create': { riskLevel: 'write', description: 'Create a fund.' },
	'funds.get': { riskLevel: 'read', description: 'Get a fund.' },
	'funds.update': { riskLevel: 'write', description: 'Update a fund.' },
	'funds.delete': { riskLevel: 'destructive', description: 'Delete a fund.' },
	'households.list': { riskLevel: 'read', description: 'List households.' },
	'households.create': {
		riskLevel: 'write',
		description: 'Create a household.',
	},
	'households.get': { riskLevel: 'read', description: 'Get a household.' },
	'households.update': {
		riskLevel: 'write',
		description: 'Update a household.',
	},
	'households.delete': {
		riskLevel: 'destructive',
		description: 'Delete a household.',
	},
	'householdContacts.list': {
		riskLevel: 'read',
		description: 'List contacts in a household.',
	},
	'householdContacts.add': {
		riskLevel: 'write',
		description: 'Add a contact to a household.',
	},
	'householdContacts.get': {
		riskLevel: 'read',
		description: 'Get a household contact.',
	},
	'householdContacts.remove': {
		riskLevel: 'destructive',
		description: 'Remove a contact from a household.',
	},
	'messages.list': { riskLevel: 'read', description: 'List messages.' },
	'messages.get': { riskLevel: 'read', description: 'Get a message.' },
	'payouts.list': { riskLevel: 'read', description: 'List payouts.' },
	'payouts.get': { riskLevel: 'read', description: 'Get a payout.' },
	'pledges.list': { riskLevel: 'read', description: 'List pledges.' },
	'pledges.get': { riskLevel: 'read', description: 'Get a pledge.' },
	'plans.list': { riskLevel: 'read', description: 'List recurring plans.' },
	'plans.get': { riskLevel: 'read', description: 'Get a recurring plan.' },
	'transactions.list': { riskLevel: 'read', description: 'List transactions.' },
	'transactions.create': {
		riskLevel: 'write',
		description: 'Create an offline transaction.',
	},
	'transactions.get': { riskLevel: 'read', description: 'Get a transaction.' },
	'transactions.update': {
		riskLevel: 'write',
		description: 'Update a transaction.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List outbound webhook registrations.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create an outbound webhook registration.',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get an outbound webhook registration.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update an outbound webhook registration.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete an outbound webhook registration.',
	},
	'webhooks.activities.list': {
		riskLevel: 'read',
		description: 'List outbound webhook activities.',
	},
	'webhooks.activities.get': {
		riskLevel: 'read',
		description: 'Get an outbound webhook activity.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof givebutterEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';
export const givebutterAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseGivebutterPlugin<T extends GivebutterPluginOptions> =
	CorsairPlugin<
		'givebutter',
		typeof GivebutterSchema,
		typeof givebutterEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalGivebutterPlugin =
	BaseGivebutterPlugin<GivebutterPluginOptions>;
export type ExternalGivebutterPlugin<T extends GivebutterPluginOptions> =
	BaseGivebutterPlugin<T>;

export function givebutter<const T extends GivebutterPluginOptions>(
	incomingOptions: GivebutterPluginOptions & T = {} as GivebutterPluginOptions &
		T,
): ExternalGivebutterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'givebutter',
		authConfig: givebutterAuthConfig,
		schema: GivebutterSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: givebutterEndpointsNested,
		webhooks: {},
		endpointMeta: givebutterEndpointMeta,
		endpointSchemas: givebutterEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: GivebutterKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('givebutter', 'api_key');
			const key =
				options.key ??
				(ctx.authType === 'api_key' ? await ctx.keys.get_api_key() : undefined);
			if (!key) throw new AuthMissingError('givebutter', 'api_key');
			return key;
		},
	} satisfies InternalGivebutterPlugin;
}

export type {
	GivebutterEndpointInputs,
	GivebutterEndpointOutputs,
} from './endpoints';
