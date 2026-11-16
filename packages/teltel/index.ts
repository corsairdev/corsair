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
import { Campaigns, Contacts, Numbers, Sms } from './endpoints';
import type {
	TeltelEndpointInputs,
	TeltelEndpointOutputs,
} from './endpoints/types';
import {
	TeltelEndpointInputSchemas,
	TeltelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TeltelSchema } from './schema';

export type TeltelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTeltelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof teltelEndpointsNested>;
};

export type TeltelContext = CorsairPluginContext<
	typeof TeltelSchema,
	TeltelPluginOptions
>;

export type TeltelKeyBuilderContext = KeyBuilderContext<TeltelPluginOptions>;

export type TeltelBoundEndpoints = BindEndpoints<typeof teltelEndpointsNested>;

type TeltelEndpoint<K extends keyof TeltelEndpointOutputs> = CorsairEndpoint<
	TeltelContext,
	TeltelEndpointInputs[K],
	TeltelEndpointOutputs[K]
>;

export type TeltelEndpoints = {
	accountBalance: TeltelEndpoint<'accountBalance'>;
	smsSend: TeltelEndpoint<'smsSend'>;
	smsSendBulk: TeltelEndpoint<'smsSendBulk'>;
	smsReportsList: TeltelEndpoint<'smsReportsList'>;
	smsReportsGet: TeltelEndpoint<'smsReportsGet'>;
	inboxList: TeltelEndpoint<'inboxList'>;
	inboxGet: TeltelEndpoint<'inboxGet'>;
	campaignsList: TeltelEndpoint<'campaignsList'>;
	campaignsGet: TeltelEndpoint<'campaignsGet'>;
	campaignsCreate: TeltelEndpoint<'campaignsCreate'>;
	campaignsUpdate: TeltelEndpoint<'campaignsUpdate'>;
	campaignsAction: TeltelEndpoint<'campaignsAction'>;
	campaignsRemove: TeltelEndpoint<'campaignsRemove'>;
	contactsList: TeltelEndpoint<'contactsList'>;
	contactsGet: TeltelEndpoint<'contactsGet'>;
	contactsCreate: TeltelEndpoint<'contactsCreate'>;
	contactsCreateBulk: TeltelEndpoint<'contactsCreateBulk'>;
	contactsUpdate: TeltelEndpoint<'contactsUpdate'>;
	contactsRemove: TeltelEndpoint<'contactsRemove'>;
	contactGroupsList: TeltelEndpoint<'contactGroupsList'>;
	contactGroupsGet: TeltelEndpoint<'contactGroupsGet'>;
	contactGroupsCreate: TeltelEndpoint<'contactGroupsCreate'>;
	contactGroupsUpdate: TeltelEndpoint<'contactGroupsUpdate'>;
	contactGroupsRemove: TeltelEndpoint<'contactGroupsRemove'>;
	contactGroupsContacts: TeltelEndpoint<'contactGroupsContacts'>;
	callsList: TeltelEndpoint<'callsList'>;
	callsCreate: TeltelEndpoint<'callsCreate'>;
	numbersList: TeltelEndpoint<'numbersList'>;
	numbersGet: TeltelEndpoint<'numbersGet'>;
	numbersUpdate: TeltelEndpoint<'numbersUpdate'>;
	numberCountriesList: TeltelEndpoint<'numberCountriesList'>;
	numberCountryGet: TeltelEndpoint<'numberCountryGet'>;
	priceGroupsList: TeltelEndpoint<'priceGroupsList'>;
	usersList: TeltelEndpoint<'usersList'>;
};

const teltelEndpointsNested = {
	account: {
		balance: Sms.accountBalance,
	},
	sms: {
		send: Sms.smsSend,
		sendBulk: Sms.smsSendBulk,
	},
	smsReports: {
		list: Sms.smsReportsList,
		get: Sms.smsReportsGet,
	},
	inbox: {
		list: Sms.inboxList,
		get: Sms.inboxGet,
	},
	campaigns: {
		list: Campaigns.list,
		get: Campaigns.get,
		create: Campaigns.create,
		update: Campaigns.update,
		action: Campaigns.action,
		delete: Campaigns.remove,
	},
	contacts: {
		list: Contacts.contactsList,
		get: Contacts.contactsGet,
		create: Contacts.contactsCreate,
		createBulk: Contacts.contactsCreateBulk,
		update: Contacts.contactsUpdate,
		delete: Contacts.contactsRemove,
	},
	contactGroups: {
		list: Contacts.groupsList,
		get: Contacts.groupsGet,
		create: Contacts.groupsCreate,
		update: Contacts.groupsUpdate,
		delete: Contacts.groupsRemove,
		contacts: Contacts.groupsContacts,
	},
	calls: {
		list: Numbers.callsList,
		create: Numbers.callsCreate,
	},
	numbers: {
		list: Numbers.numbersList,
		get: Numbers.numbersGet,
		update: Numbers.numbersUpdate,
	},
	numberCountries: {
		list: Numbers.countriesList,
		get: Numbers.countryGet,
	},
	priceGroups: {
		list: Numbers.priceGroupsList,
	},
	users: {
		list: Numbers.usersList,
	},
} as const;

export const teltelEndpointSchemas = {
	'account.balance': {
		input: TeltelEndpointInputSchemas.accountBalance,
		output: TeltelEndpointOutputSchemas.accountBalance,
	},
	'sms.send': {
		input: TeltelEndpointInputSchemas.smsSend,
		output: TeltelEndpointOutputSchemas.smsSend,
	},
	'sms.sendBulk': {
		input: TeltelEndpointInputSchemas.smsSendBulk,
		output: TeltelEndpointOutputSchemas.smsSendBulk,
	},
	'smsReports.list': {
		input: TeltelEndpointInputSchemas.smsReportsList,
		output: TeltelEndpointOutputSchemas.smsReportsList,
	},
	'smsReports.get': {
		input: TeltelEndpointInputSchemas.smsReportsGet,
		output: TeltelEndpointOutputSchemas.smsReportsGet,
	},
	'inbox.list': {
		input: TeltelEndpointInputSchemas.inboxList,
		output: TeltelEndpointOutputSchemas.inboxList,
	},
	'inbox.get': {
		input: TeltelEndpointInputSchemas.inboxGet,
		output: TeltelEndpointOutputSchemas.inboxGet,
	},
	'campaigns.list': {
		input: TeltelEndpointInputSchemas.campaignsList,
		output: TeltelEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: TeltelEndpointInputSchemas.campaignsGet,
		output: TeltelEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.create': {
		input: TeltelEndpointInputSchemas.campaignsCreate,
		output: TeltelEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: TeltelEndpointInputSchemas.campaignsUpdate,
		output: TeltelEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.action': {
		input: TeltelEndpointInputSchemas.campaignsAction,
		output: TeltelEndpointOutputSchemas.campaignsAction,
	},
	'campaigns.delete': {
		input: TeltelEndpointInputSchemas.campaignsRemove,
		output: TeltelEndpointOutputSchemas.campaignsRemove,
	},
	'contacts.list': {
		input: TeltelEndpointInputSchemas.contactsList,
		output: TeltelEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: TeltelEndpointInputSchemas.contactsGet,
		output: TeltelEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: TeltelEndpointInputSchemas.contactsCreate,
		output: TeltelEndpointOutputSchemas.contactsCreate,
	},
	'contacts.createBulk': {
		input: TeltelEndpointInputSchemas.contactsCreateBulk,
		output: TeltelEndpointOutputSchemas.contactsCreateBulk,
	},
	'contacts.update': {
		input: TeltelEndpointInputSchemas.contactsUpdate,
		output: TeltelEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: TeltelEndpointInputSchemas.contactsRemove,
		output: TeltelEndpointOutputSchemas.contactsRemove,
	},
	'contactGroups.list': {
		input: TeltelEndpointInputSchemas.contactGroupsList,
		output: TeltelEndpointOutputSchemas.contactGroupsList,
	},
	'contactGroups.get': {
		input: TeltelEndpointInputSchemas.contactGroupsGet,
		output: TeltelEndpointOutputSchemas.contactGroupsGet,
	},
	'contactGroups.create': {
		input: TeltelEndpointInputSchemas.contactGroupsCreate,
		output: TeltelEndpointOutputSchemas.contactGroupsCreate,
	},
	'contactGroups.update': {
		input: TeltelEndpointInputSchemas.contactGroupsUpdate,
		output: TeltelEndpointOutputSchemas.contactGroupsUpdate,
	},
	'contactGroups.delete': {
		input: TeltelEndpointInputSchemas.contactGroupsRemove,
		output: TeltelEndpointOutputSchemas.contactGroupsRemove,
	},
	'contactGroups.contacts': {
		input: TeltelEndpointInputSchemas.contactGroupsContacts,
		output: TeltelEndpointOutputSchemas.contactGroupsContacts,
	},
	'calls.list': {
		input: TeltelEndpointInputSchemas.callsList,
		output: TeltelEndpointOutputSchemas.callsList,
	},
	'calls.create': {
		input: TeltelEndpointInputSchemas.callsCreate,
		output: TeltelEndpointOutputSchemas.callsCreate,
	},
	'numbers.list': {
		input: TeltelEndpointInputSchemas.numbersList,
		output: TeltelEndpointOutputSchemas.numbersList,
	},
	'numbers.get': {
		input: TeltelEndpointInputSchemas.numbersGet,
		output: TeltelEndpointOutputSchemas.numbersGet,
	},
	'numbers.update': {
		input: TeltelEndpointInputSchemas.numbersUpdate,
		output: TeltelEndpointOutputSchemas.numbersUpdate,
	},
	'numberCountries.list': {
		input: TeltelEndpointInputSchemas.numberCountriesList,
		output: TeltelEndpointOutputSchemas.numberCountriesList,
	},
	'numberCountries.get': {
		input: TeltelEndpointInputSchemas.numberCountryGet,
		output: TeltelEndpointOutputSchemas.numberCountryGet,
	},
	'priceGroups.list': {
		input: TeltelEndpointInputSchemas.priceGroupsList,
		output: TeltelEndpointOutputSchemas.priceGroupsList,
	},
	'users.list': {
		input: TeltelEndpointInputSchemas.usersList,
		output: TeltelEndpointOutputSchemas.usersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof teltelEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const teltelEndpointMeta = {
	'account.balance': {
		riskLevel: 'read',
		description:
			'Read the account balance, its credit limit and the outstanding amount where one is owed',
	},
	'sms.send': {
		riskLevel: 'destructive',
		description:
			'Send one SMS from a verified number or sender ID, charging the account per part',
	},
	'sms.sendBulk': {
		riskLevel: 'destructive',
		description:
			'Send many SMS in one call; a partial result answers 207 with the messages that failed',
	},
	'smsReports.list': {
		riskLevel: 'read',
		description:
			'List outbound messages with their state, price and delivery details, filtered by number or date',
	},
	'smsReports.get': {
		riskLevel: 'read',
		description: 'Read one outbound message report by ID',
	},
	'inbox.list': {
		riskLevel: 'read',
		description: 'List inbound messages with their sender and handler',
	},
	'inbox.get': {
		riskLevel: 'read',
		description: 'Read one inbound message by ID',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List SMS campaigns with their state, sender and rate',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Read one SMS campaign by ID',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create an SMS campaign for a set of contact groups; it does not send until `campaigns.action` starts it',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description: "Change a campaign's title, sender, groups, message or rate",
	},
	'campaigns.action': {
		riskLevel: 'destructive',
		description:
			'Start, pause or stop a campaign; start sends to every contact in its groups',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an SMS campaign and its history',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with their group and custom fields',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact by ID',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Add a contact to a contact group',
	},
	'contacts.createBulk': {
		riskLevel: 'write',
		description:
			'Add many contacts in one call; a partial result reports which entries failed',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: "Change a contact's phone, group or custom fields",
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contact',
	},
	'contactGroups.list': {
		riskLevel: 'read',
		description: 'List contact groups with their contact counts',
	},
	'contactGroups.get': {
		riskLevel: 'read',
		description: 'Read one contact group by ID',
	},
	'contactGroups.create': {
		riskLevel: 'write',
		description: 'Create a contact group',
	},
	'contactGroups.update': {
		riskLevel: 'write',
		description: 'Rename a contact group',
	},
	'contactGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contact group and its contacts',
	},
	'contactGroups.contacts': {
		riskLevel: 'read',
		description: 'List the contacts in one group',
	},
	'calls.list': {
		riskLevel: 'read',
		description:
			'List calls with their duration, cost and hangup reason, filtered by direction or start time',
	},
	'calls.create': {
		riskLevel: 'destructive',
		description:
			'Place a click-to-call between two numbers, which bills per minute once answered',
	},
	'numbers.list': {
		riskLevel: 'read',
		description:
			'List the DID numbers on the account with their renewal date and SMS settings',
	},
	'numbers.get': {
		riskLevel: 'read',
		description: 'Read one DID number by ID',
	},
	'numbers.update': {
		riskLevel: 'write',
		description: "Change a number's auto-renew or SMS handler URL and email",
	},
	'numberCountries.list': {
		riskLevel: 'read',
		description:
			'List the countries numbers can be ordered in, with their prefix and SMS support',
	},
	'numberCountries.get': {
		riskLevel: 'read',
		description: 'Read one number country by ID',
	},
	'priceGroups.list': {
		riskLevel: 'read',
		description: "List a country's price groups, whose IDs an order takes",
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List the account users with their login and email; their API keys are left out',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof teltelEndpointsNested>;

export type BaseTeltelPlugin<T extends TeltelPluginOptions> = CorsairPlugin<
	'teltel',
	typeof TeltelSchema,
	typeof teltelEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTeltelPlugin = BaseTeltelPlugin<TeltelPluginOptions>;

export type ExternalTeltelPlugin<T extends TeltelPluginOptions> =
	BaseTeltelPlugin<T>;

export function teltel<const T extends TeltelPluginOptions>(
	incomingOptions: TeltelPluginOptions & T = {} as TeltelPluginOptions & T,
): ExternalTeltelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'teltel',
		schema: TeltelSchema,
		options: options,
		hooks: options.hooks,
		endpoints: teltelEndpointsNested,
		webhooks: {},
		endpointMeta: teltelEndpointMeta,
		endpointSchemas: teltelEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TeltelKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('teltel', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTeltelPlugin;
}

export type { TeltelErrorDetails } from './client';
export { teltelErrorDetails } from './client';

export type {
	CallCreateInput,
	CampaignCreateInput,
	CampaignsListResponse,
	ContactsListResponse,
	InboxGetInput,
	InboxListResponse,
	MetaResult,
	NumbersGetInput,
	NumbersListResponse,
	PriceGroupsListResponse,
	SmsReportsListResponse,
	SmsSendBulkInput,
	SmsSendInput,
	TelTELCall,
	TelTELCampaign,
	TelTELContact,
	TelTELContactGroup,
	TelTELNumberCountry,
	TelTELPhoneNumber,
	TelTELSmsReport,
	TelTELUser,
	TeltelEndpointInputs,
	TeltelEndpointOutputs,
} from './endpoints/types';
