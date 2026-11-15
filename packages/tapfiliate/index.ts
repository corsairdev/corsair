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
import {
	Affiliates,
	Conversions,
	Customers,
	Payments,
	Programs,
} from './endpoints';
import type {
	TapfiliateEndpointInputs,
	TapfiliateEndpointOutputs,
} from './endpoints/types';
import {
	TapfiliateEndpointInputSchemas,
	TapfiliateEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TapfiliateSchema } from './schema';

export type TapfiliatePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTapfiliatePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tapfiliateEndpointsNested>;
};

export type TapfiliateContext = CorsairPluginContext<
	typeof TapfiliateSchema,
	TapfiliatePluginOptions
>;

export type TapfiliateKeyBuilderContext =
	KeyBuilderContext<TapfiliatePluginOptions>;

export type TapfiliateBoundEndpoints = BindEndpoints<
	typeof tapfiliateEndpointsNested
>;

type TapfiliateEndpoint<K extends keyof TapfiliateEndpointOutputs> =
	CorsairEndpoint<
		TapfiliateContext,
		TapfiliateEndpointInputs[K],
		TapfiliateEndpointOutputs[K]
	>;

export type TapfiliateEndpoints = {
	affiliatesList: TapfiliateEndpoint<'affiliatesList'>;
	affiliatesGet: TapfiliateEndpoint<'affiliatesGet'>;
	affiliatesCreate: TapfiliateEndpoint<'affiliatesCreate'>;
	affiliatesRemove: TapfiliateEndpoint<'affiliatesRemove'>;
	affiliatesBalances: TapfiliateEndpoint<'affiliatesBalances'>;
	affiliatesPayments: TapfiliateEndpoint<'affiliatesPayments'>;
	affiliatesPrograms: TapfiliateEndpoint<'affiliatesPrograms'>;
	affiliatesCustomFields: TapfiliateEndpoint<'affiliatesCustomFields'>;
	programsList: TapfiliateEndpoint<'programsList'>;
	programsGet: TapfiliateEndpoint<'programsGet'>;
	programsAffiliates: TapfiliateEndpoint<'programsAffiliates'>;
	programsAddAffiliate: TapfiliateEndpoint<'programsAddAffiliate'>;
	programsGetAffiliate: TapfiliateEndpoint<'programsGetAffiliate'>;
	programsUpdateAffiliate: TapfiliateEndpoint<'programsUpdateAffiliate'>;
	programsApproveAffiliate: TapfiliateEndpoint<'programsApproveAffiliate'>;
	programsDisapproveAffiliate: TapfiliateEndpoint<'programsDisapproveAffiliate'>;
	conversionsList: TapfiliateEndpoint<'conversionsList'>;
	conversionsGet: TapfiliateEndpoint<'conversionsGet'>;
	conversionsCreate: TapfiliateEndpoint<'conversionsCreate'>;
	conversionsUpdate: TapfiliateEndpoint<'conversionsUpdate'>;
	conversionsRemove: TapfiliateEndpoint<'conversionsRemove'>;
	commissionsList: TapfiliateEndpoint<'commissionsList'>;
	commissionsGet: TapfiliateEndpoint<'commissionsGet'>;
	commissionsUpdate: TapfiliateEndpoint<'commissionsUpdate'>;
	commissionsApprove: TapfiliateEndpoint<'commissionsApprove'>;
	commissionsDisapprove: TapfiliateEndpoint<'commissionsDisapprove'>;
	customersList: TapfiliateEndpoint<'customersList'>;
	customersGet: TapfiliateEndpoint<'customersGet'>;
	customersCreate: TapfiliateEndpoint<'customersCreate'>;
	customersUpdate: TapfiliateEndpoint<'customersUpdate'>;
	customersRemove: TapfiliateEndpoint<'customersRemove'>;
	customersCancel: TapfiliateEndpoint<'customersCancel'>;
	customersUncancel: TapfiliateEndpoint<'customersUncancel'>;
	paymentsList: TapfiliateEndpoint<'paymentsList'>;
	paymentsGet: TapfiliateEndpoint<'paymentsGet'>;
	paymentsCreate: TapfiliateEndpoint<'paymentsCreate'>;
	paymentsCancel: TapfiliateEndpoint<'paymentsCancel'>;
	balancesList: TapfiliateEndpoint<'balancesList'>;
	clicksList: TapfiliateEndpoint<'clicksList'>;
	clicksCreate: TapfiliateEndpoint<'clicksCreate'>;
	clicksGet: TapfiliateEndpoint<'clicksGet'>;
};

const tapfiliateEndpointsNested = {
	affiliates: {
		list: Affiliates.list,
		get: Affiliates.get,
		create: Affiliates.create,
		delete: Affiliates.remove,
		balances: Affiliates.balances,
		payments: Affiliates.payments,
		programs: Affiliates.programs,
		customFields: Affiliates.customFields,
	},
	programs: {
		list: Programs.list,
		get: Programs.get,
		affiliates: Programs.affiliates,
		addAffiliate: Programs.addAffiliate,
		getAffiliate: Programs.getAffiliate,
		updateAffiliate: Programs.updateAffiliate,
		approveAffiliate: Programs.approveAffiliate,
		disapproveAffiliate: Programs.disapproveAffiliate,
	},
	conversions: {
		list: Conversions.conversionsList,
		get: Conversions.conversionsGet,
		create: Conversions.conversionsCreate,
		update: Conversions.conversionsUpdate,
		delete: Conversions.conversionsRemove,
	},
	commissions: {
		list: Conversions.commissionsList,
		get: Conversions.commissionsGet,
		update: Conversions.commissionsUpdate,
		approve: Conversions.commissionsApprove,
		disapprove: Conversions.commissionsDisapprove,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		delete: Customers.remove,
		cancel: Customers.cancel,
		uncancel: Customers.uncancel,
	},
	payments: {
		list: Payments.paymentsList,
		get: Payments.paymentsGet,
		create: Payments.paymentsCreate,
		cancel: Payments.paymentsCancel,
	},
	balances: {
		list: Payments.balancesList,
	},
	clicks: {
		list: Payments.clicksList,
		create: Payments.clicksCreate,
		get: Payments.clicksGet,
	},
} as const;

export const tapfiliateEndpointSchemas = {
	'affiliates.list': {
		input: TapfiliateEndpointInputSchemas.affiliatesList,
		output: TapfiliateEndpointOutputSchemas.affiliatesList,
	},
	'affiliates.get': {
		input: TapfiliateEndpointInputSchemas.affiliatesGet,
		output: TapfiliateEndpointOutputSchemas.affiliatesGet,
	},
	'affiliates.create': {
		input: TapfiliateEndpointInputSchemas.affiliatesCreate,
		output: TapfiliateEndpointOutputSchemas.affiliatesCreate,
	},
	'affiliates.delete': {
		input: TapfiliateEndpointInputSchemas.affiliatesRemove,
		output: TapfiliateEndpointOutputSchemas.affiliatesRemove,
	},
	'affiliates.balances': {
		input: TapfiliateEndpointInputSchemas.affiliatesBalances,
		output: TapfiliateEndpointOutputSchemas.affiliatesBalances,
	},
	'affiliates.payments': {
		input: TapfiliateEndpointInputSchemas.affiliatesPayments,
		output: TapfiliateEndpointOutputSchemas.affiliatesPayments,
	},
	'affiliates.programs': {
		input: TapfiliateEndpointInputSchemas.affiliatesPrograms,
		output: TapfiliateEndpointOutputSchemas.affiliatesPrograms,
	},
	'affiliates.customFields': {
		input: TapfiliateEndpointInputSchemas.affiliatesCustomFields,
		output: TapfiliateEndpointOutputSchemas.affiliatesCustomFields,
	},
	'programs.list': {
		input: TapfiliateEndpointInputSchemas.programsList,
		output: TapfiliateEndpointOutputSchemas.programsList,
	},
	'programs.get': {
		input: TapfiliateEndpointInputSchemas.programsGet,
		output: TapfiliateEndpointOutputSchemas.programsGet,
	},
	'programs.affiliates': {
		input: TapfiliateEndpointInputSchemas.programsAffiliates,
		output: TapfiliateEndpointOutputSchemas.programsAffiliates,
	},
	'programs.addAffiliate': {
		input: TapfiliateEndpointInputSchemas.programsAddAffiliate,
		output: TapfiliateEndpointOutputSchemas.programsAddAffiliate,
	},
	'programs.getAffiliate': {
		input: TapfiliateEndpointInputSchemas.programsGetAffiliate,
		output: TapfiliateEndpointOutputSchemas.programsGetAffiliate,
	},
	'programs.updateAffiliate': {
		input: TapfiliateEndpointInputSchemas.programsUpdateAffiliate,
		output: TapfiliateEndpointOutputSchemas.programsUpdateAffiliate,
	},
	'programs.approveAffiliate': {
		input: TapfiliateEndpointInputSchemas.programsApproveAffiliate,
		output: TapfiliateEndpointOutputSchemas.programsApproveAffiliate,
	},
	'programs.disapproveAffiliate': {
		input: TapfiliateEndpointInputSchemas.programsDisapproveAffiliate,
		output: TapfiliateEndpointOutputSchemas.programsDisapproveAffiliate,
	},
	'conversions.list': {
		input: TapfiliateEndpointInputSchemas.conversionsList,
		output: TapfiliateEndpointOutputSchemas.conversionsList,
	},
	'conversions.get': {
		input: TapfiliateEndpointInputSchemas.conversionsGet,
		output: TapfiliateEndpointOutputSchemas.conversionsGet,
	},
	'conversions.create': {
		input: TapfiliateEndpointInputSchemas.conversionsCreate,
		output: TapfiliateEndpointOutputSchemas.conversionsCreate,
	},
	'conversions.update': {
		input: TapfiliateEndpointInputSchemas.conversionsUpdate,
		output: TapfiliateEndpointOutputSchemas.conversionsUpdate,
	},
	'conversions.delete': {
		input: TapfiliateEndpointInputSchemas.conversionsRemove,
		output: TapfiliateEndpointOutputSchemas.conversionsRemove,
	},
	'commissions.list': {
		input: TapfiliateEndpointInputSchemas.commissionsList,
		output: TapfiliateEndpointOutputSchemas.commissionsList,
	},
	'commissions.get': {
		input: TapfiliateEndpointInputSchemas.commissionsGet,
		output: TapfiliateEndpointOutputSchemas.commissionsGet,
	},
	'commissions.update': {
		input: TapfiliateEndpointInputSchemas.commissionsUpdate,
		output: TapfiliateEndpointOutputSchemas.commissionsUpdate,
	},
	'commissions.approve': {
		input: TapfiliateEndpointInputSchemas.commissionsApprove,
		output: TapfiliateEndpointOutputSchemas.commissionsApprove,
	},
	'commissions.disapprove': {
		input: TapfiliateEndpointInputSchemas.commissionsDisapprove,
		output: TapfiliateEndpointOutputSchemas.commissionsDisapprove,
	},
	'customers.list': {
		input: TapfiliateEndpointInputSchemas.customersList,
		output: TapfiliateEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: TapfiliateEndpointInputSchemas.customersGet,
		output: TapfiliateEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: TapfiliateEndpointInputSchemas.customersCreate,
		output: TapfiliateEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: TapfiliateEndpointInputSchemas.customersUpdate,
		output: TapfiliateEndpointOutputSchemas.customersUpdate,
	},
	'customers.delete': {
		input: TapfiliateEndpointInputSchemas.customersRemove,
		output: TapfiliateEndpointOutputSchemas.customersRemove,
	},
	'customers.cancel': {
		input: TapfiliateEndpointInputSchemas.customersCancel,
		output: TapfiliateEndpointOutputSchemas.customersCancel,
	},
	'customers.uncancel': {
		input: TapfiliateEndpointInputSchemas.customersUncancel,
		output: TapfiliateEndpointOutputSchemas.customersUncancel,
	},
	'payments.list': {
		input: TapfiliateEndpointInputSchemas.paymentsList,
		output: TapfiliateEndpointOutputSchemas.paymentsList,
	},
	'payments.get': {
		input: TapfiliateEndpointInputSchemas.paymentsGet,
		output: TapfiliateEndpointOutputSchemas.paymentsGet,
	},
	'payments.create': {
		input: TapfiliateEndpointInputSchemas.paymentsCreate,
		output: TapfiliateEndpointOutputSchemas.paymentsCreate,
	},
	'payments.cancel': {
		input: TapfiliateEndpointInputSchemas.paymentsCancel,
		output: TapfiliateEndpointOutputSchemas.paymentsCancel,
	},
	'balances.list': {
		input: TapfiliateEndpointInputSchemas.balancesList,
		output: TapfiliateEndpointOutputSchemas.balancesList,
	},
	'clicks.list': {
		input: TapfiliateEndpointInputSchemas.clicksList,
		output: TapfiliateEndpointOutputSchemas.clicksList,
	},
	'clicks.create': {
		input: TapfiliateEndpointInputSchemas.clicksCreate,
		output: TapfiliateEndpointOutputSchemas.clicksCreate,
	},
	'clicks.get': {
		input: TapfiliateEndpointInputSchemas.clicksGet,
		output: TapfiliateEndpointOutputSchemas.clicksGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tapfiliateEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const tapfiliateEndpointMeta = {
	'affiliates.list': {
		riskLevel: 'read',
		description:
			'List affiliates, newest first, 25 per page, filtered by email, referral code, click, parent or group',
	},
	'affiliates.get': {
		riskLevel: 'read',
		description:
			'Read one affiliate with their company, address, custom fields and metadata',
	},
	'affiliates.create': {
		riskLevel: 'write',
		description:
			'Create an affiliate and run the Affiliate created triggers; the new affiliate joins no program until you add it to one',
	},
	'affiliates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete an affiliate; their personal data is cleared and the record is locked',
	},
	'affiliates.balances': {
		riskLevel: 'read',
		description: "Read one affiliate's balance per currency",
	},
	'affiliates.payments': {
		riskLevel: 'read',
		description: "List one affiliate's payments, newest first",
	},
	'affiliates.programs': {
		riskLevel: 'read',
		description:
			'List the programs an affiliate belongs to, with the coupon, approval state and referral link for each',
	},
	'affiliates.customFields': {
		riskLevel: 'read',
		description:
			'List the custom fields on your signup form, whose IDs affiliate creates take',
	},
	'programs.list': {
		riskLevel: 'read',
		description: 'List your programs, archived ones included, 25 per page',
	},
	'programs.get': {
		riskLevel: 'read',
		description:
			'Read one program, including an archived one, with its currency, cookie time and status',
	},
	'programs.affiliates': {
		riskLevel: 'read',
		description:
			"List a program's affiliates in every approval state, with each one's coupon and referral link",
	},
	'programs.addAffiliate': {
		riskLevel: 'write',
		description:
			'Add an existing affiliate to a program, approved by default, or pending or disapproved explicitly',
	},
	'programs.getAffiliate': {
		riskLevel: 'read',
		description:
			'Read one affiliate within a program, with their program-specific coupon and approval state',
	},
	'programs.updateAffiliate': {
		riskLevel: 'write',
		description:
			"Change an affiliate's coupon in a program; null removes it and omitting it changes nothing",
	},
	'programs.approveAffiliate': {
		riskLevel: 'write',
		description:
			'Approve an affiliate for a program and email them when the program notifies on approval',
	},
	'programs.disapproveAffiliate': {
		riskLevel: 'write',
		description:
			'Disapprove an affiliate for a program; they keep the record but earn nothing there',
	},
	'conversions.list': {
		riskLevel: 'read',
		description:
			'List conversions with their commissions, newest first, filtered by program, affiliate, external ID or date',
	},
	'conversions.get': {
		riskLevel: 'read',
		description:
			'Read one conversion with every commission, including MLM levels, and its fraud warnings',
	},
	'conversions.create': {
		riskLevel: 'write',
		description:
			'Track a conversion and create its commissions, attributed through a coupon, click, referral code, asset or tracking ID',
	},
	'conversions.update': {
		riskLevel: 'write',
		description:
			"Change a conversion's amount, external ID or metadata; commissions change only with recalculate_commissions and a numeric amount",
	},
	'conversions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a conversion with all of its commissions and metadata',
	},
	'commissions.list': {
		riskLevel: 'read',
		description:
			'List commissions, filtered by affiliate, status or whether they are paid',
	},
	'commissions.get': {
		riskLevel: 'read',
		description:
			'Read one commission of any kind: regular, recurring, MLM level or bonus',
	},
	'commissions.update': {
		riskLevel: 'write',
		description: "Change a commission's amount or comment",
	},
	'commissions.approve': {
		riskLevel: 'write',
		description:
			'Approve a commission, also when it was disapproved before, and fire the commission triggers',
	},
	'commissions.disapprove': {
		riskLevel: 'write',
		description:
			'Disapprove a commission from pending or approved, which removes it from the affiliate balance',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers, newest first, filtered by program, customer ID, affiliate or date range',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Read one customer with the click it was tracked from and its current fraud warnings',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a customer attributed to an affiliate; no commission is created until a conversion arrives',
	},
	'customers.update': {
		riskLevel: 'write',
		description: "Change a customer's customer_id or replace its metadata",
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a customer and its metadata; its conversions and commissions stay but lose the link',
	},
	'customers.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a customer, which stops its automatic recurring commissions; another call can reactivate it',
	},
	'customers.uncancel': {
		riskLevel: 'write',
		description:
			'Reactivate a canceled customer, restoring recurring commissions from now without back-filling',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List payments that were not canceled, newest first',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Read one payment with its affiliate, amount and currency',
	},
	'payments.create': {
		riskLevel: 'write',
		description:
			'Record one payment or an array of payments; Tapfiliate creates none when any entry is invalid',
	},
	'payments.cancel': {
		riskLevel: 'write',
		description:
			"Cancel a payment, which removes it from the affiliate's balance without reversing an outside payout",
	},
	'balances.list': {
		riskLevel: 'read',
		description:
			'List what you owe each affiliate with a non-zero balance, per currency',
	},
	'clicks.list': {
		riskLevel: 'read',
		description:
			'List clicks on your programs, filtered by program, affiliate or date; needs the click-report feature on your plan',
	},
	'clicks.create': {
		riskLevel: 'write',
		description:
			'Record a click and return its ID for use as click_id when creating a conversion',
	},
	'clicks.get': {
		riskLevel: 'read',
		description:
			'Read one click with its device details, country and metadata, plus its affiliate and program',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof tapfiliateEndpointsNested
>;

export type BaseTapfiliatePlugin<T extends TapfiliatePluginOptions> =
	CorsairPlugin<
		'tapfiliate',
		typeof TapfiliateSchema,
		typeof tapfiliateEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTapfiliatePlugin =
	BaseTapfiliatePlugin<TapfiliatePluginOptions>;

export type ExternalTapfiliatePlugin<T extends TapfiliatePluginOptions> =
	BaseTapfiliatePlugin<T>;

export function tapfiliate<const T extends TapfiliatePluginOptions>(
	incomingOptions: TapfiliatePluginOptions & T = {} as TapfiliatePluginOptions &
		T,
): ExternalTapfiliatePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tapfiliate',
		schema: TapfiliateSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tapfiliateEndpointsNested,
		webhooks: {},
		endpointMeta: tapfiliateEndpointMeta,
		endpointSchemas: tapfiliateEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TapfiliateKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('tapfiliate', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTapfiliatePlugin;
}

export { TapfiliateAPIError } from './client';

export type {
	AffiliatesCreateInput,
	AffiliatesCreateResponse,
	AffiliatesCustomFieldsResponse,
	AffiliatesGetInput,
	AffiliatesListInput,
	AffiliatesListResponse,
	AffiliatesPaymentsResponse,
	AffiliatesProgramsResponse,
	BalancesListInput,
	BalancesListResponse,
	ClicksCreateInput,
	ClicksCreateResponse,
	ClicksGetInput,
	ClicksGetResponse,
	ClicksListInput,
	ClicksListResponse,
	CommissionsApproveInput,
	CommissionsGetInput,
	CommissionsListInput,
	CommissionsListResponse,
	CommissionsUpdateInput,
	ConversionsCreateInput,
	ConversionsCreateResponse,
	ConversionsGetInput,
	ConversionsListInput,
	ConversionsListResponse,
	ConversionsUpdateInput,
	CustomersCancelInput,
	CustomersCreateInput,
	CustomersGetInput,
	CustomersListInput,
	CustomersListResponse,
	CustomersUpdateInput,
	DeletedResponse,
	PaymentsCancelInput,
	PaymentsCreateInput,
	PaymentsCreateResponse,
	PaymentsGetInput,
	PaymentsListInput,
	PaymentsListResponse,
	ProgramsAddAffiliateInput,
	ProgramsAffiliateApprovalInput,
	ProgramsAffiliatesInput,
	ProgramsGetAffiliateInput,
	ProgramsGetInput,
	ProgramsListInput,
	ProgramsListResponse,
	ProgramsUpdateAffiliateInput,
	TapfiliateAffiliate,
	TapfiliateAffiliation,
	TapfiliateCommission,
	TapfiliateConversion,
	TapfiliateCustomer,
	TapfiliateEndpointInputs,
	TapfiliateEndpointOutputs,
	TapfiliatePayment,
	TapfiliateProgram,
	TapfiliateProgramAffiliate,
} from './endpoints/types';
