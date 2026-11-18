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
import {
	Account,
	Addressbook,
	Automations,
	Billing,
	Campaigns,
	ContactLists,
	Contacts,
	Email,
	Fax,
	Geo,
	Messaging,
	Mms,
	Numbers,
	Post,
	Sms,
	Uploads,
	Voice,
} from './endpoints';
import type {
	ClickSendEndpointInputs,
	ClickSendEndpointOutputs,
} from './endpoints/types';
import {
	ClickSendEndpointInputSchemas,
	ClickSendEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClickSendSchema } from './schema';

// ── Auth Config ───────────────────────────────────────────────────────────────

export const clicksendAuthConfig = {
	api_key: {
		account: ['username'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type ClickSendPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** ClickSend API Key (or username:apiKey combo) */
	key?: string;
	/** ClickSend API Key */
	apiKey?: string;
	/** ClickSend Username */
	username?: string;
	hooks?: InternalClickSendPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the ClickSend plugin.
	 * Controls what the AI agent is allowed to do.
	 */
	permissions?: PluginPermissionsConfig<typeof clickSendEndpointsNested>;
};

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type ClickSendContext = CorsairPluginContext<
	typeof ClickSendSchema,
	ClickSendPluginOptions,
	undefined,
	typeof clicksendAuthConfig
>;

export type ClickSendKeyBuilderContext = KeyBuilderContext<
	ClickSendPluginOptions,
	typeof clicksendAuthConfig
>;

// ── Endpoint Types ────────────────────────────────────────────────────

type ClickSendEndpoint<K extends keyof ClickSendEndpointOutputs> =
	CorsairEndpoint<
		ClickSendContext,
		ClickSendEndpointInputs[K],
		ClickSendEndpointOutputs[K]
	>;

export type ClickSendEndpoints = {
	accountGet: ClickSendEndpoint<'accountGet'>;
	accountUpdate: ClickSendEndpoint<'accountUpdate'>;
	smsSend: ClickSendEndpoint<'smsSend'>;
	smsHistory: ClickSendEndpoint<'smsHistory'>;
	smsInbound: ClickSendEndpoint<'smsInbound'>;
	smsReceipts: ClickSendEndpoint<'smsReceipts'>;
	smsPrice: ClickSendEndpoint<'smsPrice'>;
	smsHistoryExport: ClickSendEndpoint<'smsHistoryExport'>;
	smsReceiptGet: ClickSendEndpoint<'smsReceiptGet'>;
	smsReceiptCreateTest: ClickSendEndpoint<'smsReceiptCreateTest'>;
	smsReceiptsMarkRead: ClickSendEndpoint<'smsReceiptsMarkRead'>;
	smsInboundCreateTest: ClickSendEndpoint<'smsInboundCreateTest'>;
	smsInboundMarkRead: ClickSendEndpoint<'smsInboundMarkRead'>;
	smsInboundMarkReadOne: ClickSendEndpoint<'smsInboundMarkReadOne'>;
	smsCancel: ClickSendEndpoint<'smsCancel'>;
	smsCancelAll: ClickSendEndpoint<'smsCancelAll'>;
	smsStatistics: ClickSendEndpoint<'smsStatistics'>;
	smsTemplatesCreate: ClickSendEndpoint<'smsTemplatesCreate'>;
	smsTemplatesList: ClickSendEndpoint<'smsTemplatesList'>;
	smsTemplatesGet: ClickSendEndpoint<'smsTemplatesGet'>;
	smsTemplatesUpdate: ClickSendEndpoint<'smsTemplatesUpdate'>;
	smsTemplatesDelete: ClickSendEndpoint<'smsTemplatesDelete'>;
	smsStrippedStringsList: ClickSendEndpoint<'smsStrippedStringsList'>;
	smsStrippedStringsGet: ClickSendEndpoint<'smsStrippedStringsGet'>;
	smsStrippedStringsCreate: ClickSendEndpoint<'smsStrippedStringsCreate'>;
	smsStrippedStringsUpdate: ClickSendEndpoint<'smsStrippedStringsUpdate'>;
	smsStrippedStringsDelete: ClickSendEndpoint<'smsStrippedStringsDelete'>;
	smsEmailSmsCreate: ClickSendEndpoint<'smsEmailSmsCreate'>;
	smsEmailSmsList: ClickSendEndpoint<'smsEmailSmsList'>;
	voiceSend: ClickSendEndpoint<'voiceSend'>;
	voiceHistory: ClickSendEndpoint<'voiceHistory'>;
	voiceCancelAll: ClickSendEndpoint<'voiceCancelAll'>;
	voiceHistoryExport: ClickSendEndpoint<'voiceHistoryExport'>;
	voiceLanguages: ClickSendEndpoint<'voiceLanguages'>;
	voiceStatistics: ClickSendEndpoint<'voiceStatistics'>;
	voiceReceiptsMarkRead: ClickSendEndpoint<'voiceReceiptsMarkRead'>;
	mmsSend: ClickSendEndpoint<'mmsSend'>;
	mmsPrice: ClickSendEndpoint<'mmsPrice'>;
	mmsHistory: ClickSendEndpoint<'mmsHistory'>;
	mmsHistoryExport: ClickSendEndpoint<'mmsHistoryExport'>;
	mmsReceipts: ClickSendEndpoint<'mmsReceipts'>;
	mmsReceiptsMarkRead: ClickSendEndpoint<'mmsReceiptsMarkRead'>;
	campaignsSmsPrice: ClickSendEndpoint<'campaignsSmsPrice'>;
	campaignsSmsSend: ClickSendEndpoint<'campaignsSmsSend'>;
	campaignsSmsList: ClickSendEndpoint<'campaignsSmsList'>;
	campaignsSmsGet: ClickSendEndpoint<'campaignsSmsGet'>;
	campaignsSmsUpdate: ClickSendEndpoint<'campaignsSmsUpdate'>;
	campaignsSmsCancel: ClickSendEndpoint<'campaignsSmsCancel'>;
	campaignsMmsList: ClickSendEndpoint<'campaignsMmsList'>;
	campaignsMmsSend: ClickSendEndpoint<'campaignsMmsSend'>;
	campaignsMmsPrice: ClickSendEndpoint<'campaignsMmsPrice'>;
	campaignsMmsUpdate: ClickSendEndpoint<'campaignsMmsUpdate'>;
	campaignsMmsCancel: ClickSendEndpoint<'campaignsMmsCancel'>;
	emailAddressesCreate: ClickSendEndpoint<'emailAddressesCreate'>;
	emailAddressesList: ClickSendEndpoint<'emailAddressesList'>;
	emailAddressesGet: ClickSendEndpoint<'emailAddressesGet'>;
	emailAddressesDelete: ClickSendEndpoint<'emailAddressesDelete'>;
	emailAddressesSendToken: ClickSendEndpoint<'emailAddressesSendToken'>;
	emailAddressesVerify: ClickSendEndpoint<'emailAddressesVerify'>;
	emailTemplatesList: ClickSendEndpoint<'emailTemplatesList'>;
	emailTemplatesGet: ClickSendEndpoint<'emailTemplatesGet'>;
	emailTemplatesCreate: ClickSendEndpoint<'emailTemplatesCreate'>;
	emailTemplatesUpdate: ClickSendEndpoint<'emailTemplatesUpdate'>;
	emailTemplatesDelete: ClickSendEndpoint<'emailTemplatesDelete'>;
	emailMasterTemplatesList: ClickSendEndpoint<'emailMasterTemplatesList'>;
	emailMasterTemplatesGet: ClickSendEndpoint<'emailMasterTemplatesGet'>;
	emailMasterTemplatesListInCategory: ClickSendEndpoint<'emailMasterTemplatesListInCategory'>;
	emailMasterCategoriesList: ClickSendEndpoint<'emailMasterCategoriesList'>;
	emailMasterCategoriesGet: ClickSendEndpoint<'emailMasterCategoriesGet'>;
	emailReceiptRulesList: ClickSendEndpoint<'emailReceiptRulesList'>;
	emailReceiptRulesCreate: ClickSendEndpoint<'emailReceiptRulesCreate'>;
	emailReceiptRulesGet: ClickSendEndpoint<'emailReceiptRulesGet'>;
	emailReceiptRulesUpdate: ClickSendEndpoint<'emailReceiptRulesUpdate'>;
	emailReceiptRulesDelete: ClickSendEndpoint<'emailReceiptRulesDelete'>;
	emailCampaignsGet: ClickSendEndpoint<'emailCampaignsGet'>;
	faxReceiptsCreateTest: ClickSendEndpoint<'faxReceiptsCreateTest'>;
	faxReceiptsList: ClickSendEndpoint<'faxReceiptsList'>;
	faxReceiptsGet: ClickSendEndpoint<'faxReceiptsGet'>;
	faxReceiptsMarkRead: ClickSendEndpoint<'faxReceiptsMarkRead'>;
	faxReceiptRulesList: ClickSendEndpoint<'faxReceiptRulesList'>;
	faxReceiptRulesCreate: ClickSendEndpoint<'faxReceiptRulesCreate'>;
	faxReceiptRulesGet: ClickSendEndpoint<'faxReceiptRulesGet'>;
	faxReceiptRulesUpdate: ClickSendEndpoint<'faxReceiptRulesUpdate'>;
	faxReceiptRulesDelete: ClickSendEndpoint<'faxReceiptRulesDelete'>;
	faxInboundRulesList: ClickSendEndpoint<'faxInboundRulesList'>;
	faxInboundRulesCreate: ClickSendEndpoint<'faxInboundRulesCreate'>;
	faxInboundRulesGet: ClickSendEndpoint<'faxInboundRulesGet'>;
	faxInboundRulesUpdate: ClickSendEndpoint<'faxInboundRulesUpdate'>;
	faxInboundRulesDelete: ClickSendEndpoint<'faxInboundRulesDelete'>;
	contactListsGetAll: ClickSendEndpoint<'contactListsGetAll'>;
	contactListsCreate: ClickSendEndpoint<'contactListsCreate'>;
	contactListsUpdate: ClickSendEndpoint<'contactListsUpdate'>;
	contactListsDelete: ClickSendEndpoint<'contactListsDelete'>;
	contactListsGet: ClickSendEndpoint<'contactListsGet'>;
	contactsCreate: ClickSendEndpoint<'contactsCreate'>;
	contactsList: ClickSendEndpoint<'contactsList'>;
	contactsGet: ClickSendEndpoint<'contactsGet'>;
	contactsUpdate: ClickSendEndpoint<'contactsUpdate'>;
	contactsDelete: ClickSendEndpoint<'contactsDelete'>;
	contactsCopy: ClickSendEndpoint<'contactsCopy'>;
	contactsTransfer: ClickSendEndpoint<'contactsTransfer'>;
	contactsImport: ClickSendEndpoint<'contactsImport'>;
	contactsImportFields: ClickSendEndpoint<'contactsImportFields'>;
	contactsImportPreview: ClickSendEndpoint<'contactsImportPreview'>;
	contactsRemoveOptedOut: ClickSendEndpoint<'contactsRemoveOptedOut'>;
	contactsSearch: ClickSendEndpoint<'contactsSearch'>;
	contactsSuggestions: ClickSendEndpoint<'contactsSuggestions'>;
	rechargeTransactions: ClickSendEndpoint<'rechargeTransactions'>;
	rechargeTransactionGet: ClickSendEndpoint<'rechargeTransactionGet'>;
	rechargePackages: ClickSendEndpoint<'rechargePackages'>;
	rechargePurchase: ClickSendEndpoint<'rechargePurchase'>;
	rechargeCreditCardGet: ClickSendEndpoint<'rechargeCreditCardGet'>;
	rechargeCreditCardUpdate: ClickSendEndpoint<'rechargeCreditCardUpdate'>;
	subaccountsList: ClickSendEndpoint<'subaccountsList'>;
	subaccountsGet: ClickSendEndpoint<'subaccountsGet'>;
	subaccountsCreate: ClickSendEndpoint<'subaccountsCreate'>;
	subaccountsUpdate: ClickSendEndpoint<'subaccountsUpdate'>;
	subaccountsDelete: ClickSendEndpoint<'subaccountsDelete'>;
	subaccountsRegenKey: ClickSendEndpoint<'subaccountsRegenKey'>;
	resellerAccountsList: ClickSendEndpoint<'resellerAccountsList'>;
	resellerSettingsGet: ClickSendEndpoint<'resellerSettingsGet'>;
	resellerSettingsUpdate: ClickSendEndpoint<'resellerSettingsUpdate'>;
	referralAccountsList: ClickSendEndpoint<'referralAccountsList'>;
	countriesList: ClickSendEndpoint<'countriesList'>;
	countriesGlobalList: ClickSendEndpoint<'countriesGlobalList'>;
	countriesPricing: ClickSendEndpoint<'countriesPricing'>;
	countriesUserCountriesGet: ClickSendEndpoint<'countriesUserCountriesGet'>;
	countriesUserCountriesSelect: ClickSendEndpoint<'countriesUserCountriesSelect'>;
	countriesUserCountriesAgree: ClickSendEndpoint<'countriesUserCountriesAgree'>;
	timezonesList: ClickSendEndpoint<'timezonesList'>;
	deliveryIssuesList: ClickSendEndpoint<'deliveryIssuesList'>;
	deliveryIssuesCreate: ClickSendEndpoint<'deliveryIssuesCreate'>;
	postLettersSend: ClickSendEndpoint<'postLettersSend'>;
	postLettersHistory: ClickSendEndpoint<'postLettersHistory'>;
	postLettersHistoryExport: ClickSendEndpoint<'postLettersHistoryExport'>;
	postLettersPrice: ClickSendEndpoint<'postLettersPrice'>;
	postLettersDetectAddress: ClickSendEndpoint<'postLettersDetectAddress'>;
	postReturnAddressesCreate: ClickSendEndpoint<'postReturnAddressesCreate'>;
	postReturnAddressesList: ClickSendEndpoint<'postReturnAddressesList'>;
	postReturnAddressesGet: ClickSendEndpoint<'postReturnAddressesGet'>;
	postReturnAddressesUpdate: ClickSendEndpoint<'postReturnAddressesUpdate'>;
	postReturnAddressesDelete: ClickSendEndpoint<'postReturnAddressesDelete'>;
	postDirectMailSend: ClickSendEndpoint<'postDirectMailSend'>;
	postDirectMailSearchLocations: ClickSendEndpoint<'postDirectMailSearchLocations'>;
	numbersList: ClickSendEndpoint<'numbersList'>;
	numbersSearch: ClickSendEndpoint<'numbersSearch'>;
	numbersBuy: ClickSendEndpoint<'numbersBuy'>;
	smsInboundRulesList: ClickSendEndpoint<'smsInboundRulesList'>;
	smsInboundRulesCreate: ClickSendEndpoint<'smsInboundRulesCreate'>;
	smsInboundRulesGet: ClickSendEndpoint<'smsInboundRulesGet'>;
	smsInboundRulesUpdate: ClickSendEndpoint<'smsInboundRulesUpdate'>;
	smsInboundRulesDelete: ClickSendEndpoint<'smsInboundRulesDelete'>;
	smsReceiptRulesList: ClickSendEndpoint<'smsReceiptRulesList'>;
	smsReceiptRulesCreate: ClickSendEndpoint<'smsReceiptRulesCreate'>;
	smsReceiptRulesGet: ClickSendEndpoint<'smsReceiptRulesGet'>;
	smsReceiptRulesUpdate: ClickSendEndpoint<'smsReceiptRulesUpdate'>;
	smsReceiptRulesDelete: ClickSendEndpoint<'smsReceiptRulesDelete'>;
	voiceReceiptRulesList: ClickSendEndpoint<'voiceReceiptRulesList'>;
	voiceReceiptRulesCreate: ClickSendEndpoint<'voiceReceiptRulesCreate'>;
	voiceReceiptRulesGet: ClickSendEndpoint<'voiceReceiptRulesGet'>;
	voiceReceiptRulesUpdate: ClickSendEndpoint<'voiceReceiptRulesUpdate'>;
	voiceReceiptRulesDelete: ClickSendEndpoint<'voiceReceiptRulesDelete'>;
	uploadsUpload: ClickSendEndpoint<'uploadsUpload'>;
	uploadsUploadDocument: ClickSendEndpoint<'uploadsUploadDocument'>;
};

export type ClickSendBoundEndpoints = BindEndpoints<
	typeof clickSendEndpointsNested
>;

// ── Endpoint Tree ─────────────────────────────────────────────────────────────

const clickSendEndpointsNested = {
	account: {
		get: Account.get,
		update: Account.update,
	},
	sms: {
		send: Sms.send,
		history: Sms.history,
		inbound: Sms.inbound,
		receipts: Sms.receipts,
		price: Messaging.priceSms,
		historyExport: Messaging.exportSmsHistory,
		receiptGet: Messaging.getSmsReceipt,
		receiptCreateTest: Messaging.createSmsTestReceipt,
		receiptsMarkRead: Messaging.markSmsReceiptsRead,
		inboundCreateTest: Messaging.createSmsTestInbound,
		inboundMarkRead: Messaging.markSmsInboundRead,
		inboundMarkReadOne: Messaging.markSmsInboundReadOne,
		cancel: Messaging.cancelSms,
		cancelAll: Messaging.cancelAllSms,
		statistics: Messaging.smsStatistics,
	},
	smsTemplates: {
		create: Messaging.createSmsTemplate,
		list: Messaging.listSmsTemplates,
		get: Messaging.getSmsTemplate,
		update: Messaging.updateSmsTemplate,
		delete: Messaging.deleteSmsTemplate,
	},
	smsStrippedStrings: {
		list: Messaging.listSmsStrippedStrings,
		get: Messaging.getSmsStrippedString,
		create: Messaging.createSmsStrippedString,
		update: Messaging.updateSmsStrippedString,
		delete: Messaging.deleteSmsStrippedString,
	},
	smsEmailSms: {
		create: Messaging.createSmsAllowedEmail,
		list: Messaging.listSmsAllowedEmails,
	},
	voice: {
		send: Voice.send,
		history: Voice.history,
		cancelAll: Messaging.cancelAllVoice,
		historyExport: Messaging.exportVoiceHistory,
		languages: Messaging.listVoiceLanguages,
		statistics: Messaging.voiceStatistics,
		receiptsMarkRead: Messaging.markVoiceReceiptsRead,
	},
	mms: {
		send: Mms.sendMms,
		price: Mms.priceMms,
		history: Mms.historyMms,
		historyExport: Mms.exportMmsHistory,
		receipts: Mms.listMmsReceipts,
		receiptsMarkRead: Mms.markMmsReceiptsRead,
	},
	campaigns: {
		sms: {
			price: Campaigns.priceSmsCampaign,
			send: Campaigns.sendSmsCampaign,
			list: Campaigns.listSmsCampaigns,
			get: Campaigns.getSmsCampaign,
			update: Campaigns.updateSmsCampaign,
			cancel: Campaigns.cancelSmsCampaign,
		},
		mms: {
			list: Campaigns.listMmsCampaigns,
			send: Campaigns.sendMmsCampaign,
			price: Campaigns.priceMmsCampaign,
			update: Campaigns.updateMmsCampaign,
			cancel: Campaigns.cancelMmsCampaign,
		},
	},
	emailAddresses: {
		create: Email.createEmailAddress,
		list: Email.listEmailAddresses,
		get: Email.getEmailAddress,
		delete: Email.deleteEmailAddress,
		sendToken: Email.sendEmailVerificationToken,
		verify: Email.verifyEmailAddress,
	},
	emailTemplates: {
		list: Email.listEmailTemplates,
		get: Email.getEmailTemplate,
		create: Email.createEmailTemplate,
		update: Email.updateEmailTemplate,
		delete: Email.deleteEmailTemplate,
	},
	emailMasterTemplates: {
		list: Email.listEmailMasterTemplates,
		get: Email.getEmailMasterTemplate,
		listInCategory: Email.listEmailMasterTemplatesInCategory,
	},
	emailMasterCategories: {
		list: Email.listEmailMasterCategories,
		get: Email.getEmailMasterCategory,
	},
	emailReceiptRules: {
		list: Email.listEmailReceiptRules,
		create: Email.createEmailReceiptRule,
		get: Email.getEmailReceiptRule,
		update: Email.updateEmailReceiptRule,
		delete: Email.deleteEmailReceiptRule,
	},
	emailCampaigns: {
		get: Email.getEmailCampaign,
	},
	faxReceipts: {
		createTest: Fax.createFaxTestReceipt,
		list: Fax.listFaxReceipts,
		get: Fax.getFaxReceipt,
		markRead: Fax.markFaxReceiptsRead,
	},
	faxReceiptRules: {
		list: Fax.listFaxReceiptRules,
		create: Fax.createFaxReceiptRule,
		get: Fax.getFaxReceiptRule,
		update: Fax.updateFaxReceiptRule,
		delete: Fax.deleteFaxReceiptRule,
	},
	faxInboundRules: {
		list: Fax.listFaxInboundRules,
		create: Fax.createFaxInboundRule,
		get: Fax.getFaxInboundRule,
		update: Fax.updateFaxInboundRule,
		delete: Fax.deleteFaxInboundRule,
	},
	contactLists: {
		getAll: ContactLists.getAll,
		create: ContactLists.create,
		update: ContactLists.update,
		delete: ContactLists.delete,
		get: ContactLists.get,
	},
	contacts: {
		create: Contacts.create,
		list: Contacts.list,
		get: Contacts.get,
		update: Contacts.update,
		delete: Contacts.delete,
		copy: Contacts.copy,
		transfer: Contacts.transfer,
		import: Contacts.import,
		importFields: Contacts.importFields,
		importPreview: Contacts.importPreview,
		removeOptedOut: Contacts.removeOptedOut,
		search: Contacts.search,
		suggestions: Contacts.suggestions,
	},
	recharge: {
		transactions: Billing.listRechargeTransactions,
		transactionGet: Billing.getRechargeTransaction,
		packages: Billing.listRechargePackages,
		purchase: Billing.purchaseRechargePackage,
		creditCardGet: Billing.getRechargeCreditCard,
		creditCardUpdate: Billing.updateRechargeCreditCard,
	},
	subaccounts: {
		list: Billing.listSubaccounts,
		get: Billing.getSubaccount,
		create: Billing.createSubaccount,
		update: Billing.updateSubaccount,
		delete: Billing.deleteSubaccount,
		regenKey: Billing.regenSubaccountApiKey,
	},
	reseller: {
		accountsList: Billing.listResellerAccounts,
		settingsGet: Billing.getResellerSettings,
		settingsUpdate: Billing.updateResellerSettings,
	},
	referral: {
		accountsList: Billing.listReferralAccounts,
	},
	countries: {
		list: Geo.listCountries,
		globalList: Geo.listGlobalSendingCountries,
		pricing: Geo.getCountryPricing,
		userCountriesGet: Geo.getUserCountries,
		userCountriesSelect: Geo.selectUserCountries,
		userCountriesAgree: Geo.agreeUserCountriesRules,
	},
	timezones: {
		list: Geo.listTimezones,
	},
	deliveryIssues: {
		list: Geo.listDeliveryIssues,
		create: Geo.createDeliveryIssue,
	},
	postLetters: {
		send: Post.sendPostLetter,
		history: Post.getPostLettersHistory,
		historyExport: Post.exportPostLettersHistory,
		price: Post.calculatePostLettersPrice,
		detectAddress: Post.detectPostAddress,
	},
	postReturnAddresses: {
		create: Post.createPostReturnAddress,
		list: Post.listPostReturnAddresses,
		get: Post.getPostReturnAddress,
		update: Post.updatePostReturnAddress,
		delete: Post.deletePostReturnAddress,
	},
	postDirectMail: {
		send: Post.sendPostDirectMail,
		searchLocations: Post.searchPostDirectMailLocations,
	},
	numbers: {
		list: Numbers.listNumbers,
		search: Numbers.searchNumbers,
		buy: Numbers.buyNumber,
	},
	smsInboundRules: {
		list: Automations.listSmsInboundRules,
		create: Automations.createSmsInboundRule,
		get: Automations.getSmsInboundRule,
		update: Automations.updateSmsInboundRule,
		delete: Automations.deleteSmsInboundRule,
	},
	smsReceiptRules: {
		list: Automations.listSmsReceiptRules,
		create: Automations.createSmsReceiptRule,
		get: Automations.getSmsReceiptRule,
		update: Automations.updateSmsReceiptRule,
		delete: Automations.deleteSmsReceiptRule,
	},
	voiceReceiptRules: {
		list: Automations.listVoiceReceiptRules,
		create: Automations.createVoiceReceiptRule,
		get: Automations.getVoiceReceiptRule,
		update: Automations.updateVoiceReceiptRule,
		delete: Automations.deleteVoiceReceiptRule,
	},
	uploads: {
		upload: Uploads.uploadFile,
		uploadDocument: Uploads.uploadDocument,
	},
} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const clickSendEndpointSchemas = {
	'account.get': {
		input: ClickSendEndpointInputSchemas.accountGet,
		output: ClickSendEndpointOutputSchemas.accountGet,
	},
	'account.update': {
		input: Account.AccountUpdateInputSchema,
		output: Account.AccountUpdateResponseSchema,
	},
	'sms.send': {
		input: ClickSendEndpointInputSchemas.smsSend,
		output: ClickSendEndpointOutputSchemas.smsSend,
	},
	'sms.history': {
		input: ClickSendEndpointInputSchemas.smsHistory,
		output: ClickSendEndpointOutputSchemas.smsHistory,
	},
	'sms.inbound': {
		input: ClickSendEndpointInputSchemas.smsInbound,
		output: ClickSendEndpointOutputSchemas.smsInbound,
	},
	'sms.receipts': {
		input: ClickSendEndpointInputSchemas.smsReceipts,
		output: ClickSendEndpointOutputSchemas.smsReceipts,
	},
	'sms.price': {
		input: Messaging.SmsPriceInputSchema,
		output: Messaging.SmsPriceResponseSchema,
	},
	'sms.historyExport': {
		input: Messaging.SmsHistoryExportInputSchema,
		output: Messaging.SmsHistoryExportResponseSchema,
	},
	'sms.receiptGet': {
		input: Messaging.SmsReceiptGetInputSchema,
		output: Messaging.SmsReceiptGetResponseSchema,
	},
	'sms.receiptCreateTest': {
		input: Messaging.SmsReceiptCreateTestInputSchema,
		output: Messaging.SmsReceiptCreateTestResponseSchema,
	},
	'sms.receiptsMarkRead': {
		input: Messaging.SmsReceiptsMarkReadInputSchema,
		output: Messaging.SmsReceiptsMarkReadResponseSchema,
	},
	'sms.inboundCreateTest': {
		input: Messaging.SmsInboundCreateTestInputSchema,
		output: Messaging.SmsInboundCreateTestResponseSchema,
	},
	'sms.inboundMarkRead': {
		input: Messaging.SmsInboundMarkReadInputSchema,
		output: Messaging.SmsInboundMarkReadResponseSchema,
	},
	'sms.inboundMarkReadOne': {
		input: Messaging.SmsInboundMarkReadOneInputSchema,
		output: Messaging.SmsInboundMarkReadOneResponseSchema,
	},
	'sms.cancel': {
		input: Messaging.SmsCancelInputSchema,
		output: Messaging.SmsCancelResponseSchema,
	},
	'sms.cancelAll': {
		input: Messaging.SmsCancelAllInputSchema,
		output: Messaging.SmsCancelAllResponseSchema,
	},
	'sms.statistics': {
		input: Messaging.SmsStatisticsInputSchema,
		output: Messaging.SmsStatisticsResponseSchema,
	},
	'smsTemplates.create': {
		input: Messaging.SmsTemplateCreateInputSchema,
		output: Messaging.SmsTemplateCreateResponseSchema,
	},
	'smsTemplates.list': {
		input: Messaging.SmsTemplatesListInputSchema,
		output: Messaging.SmsTemplatesListResponseSchema,
	},
	'smsTemplates.get': {
		input: Messaging.SmsTemplateGetInputSchema,
		output: Messaging.SmsTemplateGetResponseSchema,
	},
	'smsTemplates.update': {
		input: Messaging.SmsTemplateUpdateInputSchema,
		output: Messaging.SmsTemplateUpdateResponseSchema,
	},
	'smsTemplates.delete': {
		input: Messaging.SmsTemplateDeleteInputSchema,
		output: Messaging.SmsTemplateDeleteResponseSchema,
	},
	'smsStrippedStrings.list': {
		input: Messaging.SmsStrippedStringsListInputSchema,
		output: Messaging.SmsStrippedStringsListResponseSchema,
	},
	'smsStrippedStrings.get': {
		input: Messaging.SmsStrippedStringGetInputSchema,
		output: Messaging.SmsStrippedStringGetResponseSchema,
	},
	'smsStrippedStrings.create': {
		input: Messaging.SmsStrippedStringCreateInputSchema,
		output: Messaging.SmsStrippedStringCreateResponseSchema,
	},
	'smsStrippedStrings.update': {
		input: Messaging.SmsStrippedStringUpdateInputSchema,
		output: Messaging.SmsStrippedStringUpdateResponseSchema,
	},
	'smsStrippedStrings.delete': {
		input: Messaging.SmsStrippedStringDeleteInputSchema,
		output: Messaging.SmsStrippedStringDeleteResponseSchema,
	},
	'smsEmailSms.create': {
		input: Messaging.SmsAllowedEmailCreateInputSchema,
		output: Messaging.SmsAllowedEmailCreateResponseSchema,
	},
	'smsEmailSms.list': {
		input: Messaging.SmsAllowedEmailsListInputSchema,
		output: Messaging.SmsAllowedEmailsListResponseSchema,
	},
	'voice.send': {
		input: ClickSendEndpointInputSchemas.voiceSend,
		output: ClickSendEndpointOutputSchemas.voiceSend,
	},
	'voice.history': {
		input: ClickSendEndpointInputSchemas.voiceHistory,
		output: ClickSendEndpointOutputSchemas.voiceHistory,
	},
	'voice.cancelAll': {
		input: Messaging.VoiceCancelAllInputSchema,
		output: Messaging.VoiceCancelAllResponseSchema,
	},
	'voice.historyExport': {
		input: Messaging.VoiceHistoryExportInputSchema,
		output: Messaging.VoiceHistoryExportResponseSchema,
	},
	'voice.languages': {
		input: Messaging.VoiceLanguagesListInputSchema,
		output: Messaging.VoiceLanguagesListResponseSchema,
	},
	'voice.statistics': {
		input: Messaging.VoiceStatisticsInputSchema,
		output: Messaging.VoiceStatisticsResponseSchema,
	},
	'voice.receiptsMarkRead': {
		input: Messaging.VoiceReceiptsMarkReadInputSchema,
		output: Messaging.VoiceReceiptsMarkReadResponseSchema,
	},
	'mms.send': {
		input: Mms.MmsSendInputSchema,
		output: Mms.MmsSendResponseSchema,
	},
	'mms.price': {
		input: Mms.MmsPriceInputSchema,
		output: Mms.MmsPriceResponseSchema,
	},
	'mms.history': {
		input: Mms.MmsHistoryInputSchema,
		output: Mms.MmsHistoryResponseSchema,
	},
	'mms.historyExport': {
		input: Mms.MmsHistoryExportInputSchema,
		output: Mms.MmsHistoryExportResponseSchema,
	},
	'mms.receipts': {
		input: Mms.MmsReceiptsListInputSchema,
		output: Mms.MmsReceiptsListResponseSchema,
	},
	'mms.receiptsMarkRead': {
		input: Mms.MmsReceiptsMarkReadInputSchema,
		output: Mms.MmsReceiptsMarkReadResponseSchema,
	},
	'campaigns.sms.price': {
		input: Campaigns.PriceSmsCampaignInputSchema,
		output: Campaigns.PriceSmsCampaignResponseSchema,
	},
	'campaigns.sms.send': {
		input: Campaigns.SendSmsCampaignInputSchema,
		output: Campaigns.SendSmsCampaignResponseSchema,
	},
	'campaigns.sms.list': {
		input: Campaigns.ListSmsCampaignsInputSchema,
		output: Campaigns.ListSmsCampaignsResponseSchema,
	},
	'campaigns.sms.get': {
		input: Campaigns.GetSmsCampaignInputSchema,
		output: Campaigns.GetSmsCampaignResponseSchema,
	},
	'campaigns.sms.update': {
		input: Campaigns.UpdateSmsCampaignInputSchema,
		output: Campaigns.UpdateSmsCampaignResponseSchema,
	},
	'campaigns.sms.cancel': {
		input: Campaigns.CancelSmsCampaignInputSchema,
		output: Campaigns.CancelSmsCampaignResponseSchema,
	},
	'campaigns.mms.list': {
		input: Campaigns.ListMmsCampaignsInputSchema,
		output: Campaigns.ListMmsCampaignsResponseSchema,
	},
	'campaigns.mms.send': {
		input: Campaigns.SendMmsCampaignInputSchema,
		output: Campaigns.SendMmsCampaignResponseSchema,
	},
	'campaigns.mms.price': {
		input: Campaigns.PriceMmsCampaignInputSchema,
		output: Campaigns.PriceMmsCampaignResponseSchema,
	},
	'campaigns.mms.update': {
		input: Campaigns.UpdateMmsCampaignInputSchema,
		output: Campaigns.UpdateMmsCampaignResponseSchema,
	},
	'campaigns.mms.cancel': {
		input: Campaigns.CancelMmsCampaignInputSchema,
		output: Campaigns.CancelMmsCampaignResponseSchema,
	},
	'emailAddresses.create': {
		input: Email.EmailAddressCreateInputSchema,
		output: Email.EmailAddressCreateResponseSchema,
	},
	'emailAddresses.list': {
		input: Email.EmailAddressListInputSchema,
		output: Email.EmailAddressListResponseSchema,
	},
	'emailAddresses.get': {
		input: Email.EmailAddressGetInputSchema,
		output: Email.EmailAddressGetResponseSchema,
	},
	'emailAddresses.delete': {
		input: Email.EmailAddressDeleteInputSchema,
		output: Email.EmailAddressDeleteResponseSchema,
	},
	'emailAddresses.sendToken': {
		input: Email.EmailVerificationTokenSendInputSchema,
		output: Email.EmailVerificationTokenSendResponseSchema,
	},
	'emailAddresses.verify': {
		input: Email.EmailAddressVerifyInputSchema,
		output: Email.EmailAddressVerifyResponseSchema,
	},
	'emailTemplates.list': {
		input: Email.EmailTemplateListInputSchema,
		output: Email.EmailTemplateListResponseSchema,
	},
	'emailTemplates.get': {
		input: Email.EmailTemplateGetInputSchema,
		output: Email.EmailTemplateGetResponseSchema,
	},
	'emailTemplates.create': {
		input: Email.EmailTemplateCreateInputSchema,
		output: Email.EmailTemplateCreateResponseSchema,
	},
	'emailTemplates.update': {
		input: Email.EmailTemplateUpdateInputSchema,
		output: Email.EmailTemplateUpdateResponseSchema,
	},
	'emailTemplates.delete': {
		input: Email.EmailTemplateDeleteInputSchema,
		output: Email.EmailTemplateDeleteResponseSchema,
	},
	'emailMasterTemplates.list': {
		input: Email.EmailMasterTemplateListInputSchema,
		output: Email.EmailMasterTemplateListResponseSchema,
	},
	'emailMasterTemplates.get': {
		input: Email.EmailMasterTemplateGetInputSchema,
		output: Email.EmailMasterTemplateGetResponseSchema,
	},
	'emailMasterTemplates.listInCategory': {
		input: Email.EmailMasterTemplatesInCategoryListInputSchema,
		output: Email.EmailMasterTemplatesInCategoryListResponseSchema,
	},
	'emailMasterCategories.list': {
		input: Email.EmailMasterCategoryListInputSchema,
		output: Email.EmailMasterCategoryListResponseSchema,
	},
	'emailMasterCategories.get': {
		input: Email.EmailMasterCategoryGetInputSchema,
		output: Email.EmailMasterCategoryGetResponseSchema,
	},
	'emailReceiptRules.list': {
		input: Email.EmailReceiptRuleListInputSchema,
		output: Email.EmailReceiptRuleListResponseSchema,
	},
	'emailReceiptRules.create': {
		input: Email.EmailReceiptRuleCreateInputSchema,
		output: Email.EmailReceiptRuleCreateResponseSchema,
	},
	'emailReceiptRules.get': {
		input: Email.EmailReceiptRuleGetInputSchema,
		output: Email.EmailReceiptRuleGetResponseSchema,
	},
	'emailReceiptRules.update': {
		input: Email.EmailReceiptRuleUpdateInputSchema,
		output: Email.EmailReceiptRuleUpdateResponseSchema,
	},
	'emailReceiptRules.delete': {
		input: Email.EmailReceiptRuleDeleteInputSchema,
		output: Email.EmailReceiptRuleDeleteResponseSchema,
	},
	'emailCampaigns.get': {
		input: Email.EmailCampaignGetInputSchema,
		output: Email.EmailCampaignGetResponseSchema,
	},
	'faxReceipts.createTest': {
		input: Fax.FaxTestReceiptCreateInputSchema,
		output: Fax.FaxTestReceiptCreateResponseSchema,
	},
	'faxReceipts.list': {
		input: Fax.FaxReceiptListInputSchema,
		output: Fax.FaxReceiptListResponseSchema,
	},
	'faxReceipts.get': {
		input: Fax.FaxReceiptGetInputSchema,
		output: Fax.FaxReceiptGetResponseSchema,
	},
	'faxReceipts.markRead': {
		input: Fax.FaxReceiptsMarkReadInputSchema,
		output: Fax.FaxReceiptsMarkReadResponseSchema,
	},
	'faxReceiptRules.list': {
		input: Fax.FaxReceiptRuleListInputSchema,
		output: Fax.FaxReceiptRuleListResponseSchema,
	},
	'faxReceiptRules.create': {
		input: Fax.FaxReceiptRuleCreateInputSchema,
		output: Fax.FaxReceiptRuleCreateResponseSchema,
	},
	'faxReceiptRules.get': {
		input: Fax.FaxReceiptRuleGetInputSchema,
		output: Fax.FaxReceiptRuleGetResponseSchema,
	},
	'faxReceiptRules.update': {
		input: Fax.FaxReceiptRuleUpdateInputSchema,
		output: Fax.FaxReceiptRuleUpdateResponseSchema,
	},
	'faxReceiptRules.delete': {
		input: Fax.FaxReceiptRuleDeleteInputSchema,
		output: Fax.FaxReceiptRuleDeleteResponseSchema,
	},
	'faxInboundRules.list': {
		input: Fax.FaxInboundRuleListInputSchema,
		output: Fax.FaxInboundRuleListResponseSchema,
	},
	'faxInboundRules.create': {
		input: Fax.FaxInboundRuleCreateInputSchema,
		output: Fax.FaxInboundRuleCreateResponseSchema,
	},
	'faxInboundRules.get': {
		input: Fax.FaxInboundRuleGetInputSchema,
		output: Fax.FaxInboundRuleGetResponseSchema,
	},
	'faxInboundRules.update': {
		input: Fax.FaxInboundRuleUpdateInputSchema,
		output: Fax.FaxInboundRuleUpdateResponseSchema,
	},
	'faxInboundRules.delete': {
		input: Fax.FaxInboundRuleDeleteInputSchema,
		output: Fax.FaxInboundRuleDeleteResponseSchema,
	},
	'contactLists.getAll': {
		input: ClickSendEndpointInputSchemas.contactListsGetAll,
		output: ClickSendEndpointOutputSchemas.contactListsGetAll,
	},
	'contactLists.create': {
		input: ClickSendEndpointInputSchemas.contactListsCreate,
		output: ClickSendEndpointOutputSchemas.contactListsCreate,
	},
	'contactLists.update': {
		input: Addressbook.AddressbookUpdateContactListInputSchema,
		output: Addressbook.AddressbookUpdateContactListResponseSchema,
	},
	'contactLists.delete': {
		input: Addressbook.AddressbookDeleteContactListInputSchema,
		output: Addressbook.AddressbookDeleteContactListResponseSchema,
	},
	'contactLists.get': {
		input: Addressbook.AddressbookGetContactListInputSchema,
		output: Addressbook.AddressbookGetContactListResponseSchema,
	},
	'contacts.create': {
		input: ClickSendEndpointInputSchemas.contactsCreate,
		output: ClickSendEndpointOutputSchemas.contactsCreate,
	},
	'contacts.list': {
		input: ClickSendEndpointInputSchemas.contactsList,
		output: ClickSendEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: Addressbook.AddressbookGetContactInputSchema,
		output: Addressbook.AddressbookGetContactResponseSchema,
	},
	'contacts.update': {
		input: Addressbook.AddressbookUpdateContactInputSchema,
		output: Addressbook.AddressbookUpdateContactResponseSchema,
	},
	'contacts.delete': {
		input: Addressbook.AddressbookDeleteContactInputSchema,
		output: Addressbook.AddressbookDeleteContactResponseSchema,
	},
	'contacts.copy': {
		input: Addressbook.AddressbookCopyContactInputSchema,
		output: Addressbook.AddressbookCopyContactResponseSchema,
	},
	'contacts.transfer': {
		input: Addressbook.AddressbookTransferContactInputSchema,
		output: Addressbook.AddressbookTransferContactResponseSchema,
	},
	'contacts.import': {
		input: Addressbook.AddressbookImportContactsInputSchema,
		output: Addressbook.AddressbookImportContactsResponseSchema,
	},
	'contacts.importFields': {
		input: Addressbook.AddressbookListImportFieldsInputSchema,
		output: Addressbook.AddressbookListImportFieldsResponseSchema,
	},
	'contacts.importPreview': {
		input: Addressbook.AddressbookPreviewCsvImportInputSchema,
		output: Addressbook.AddressbookPreviewCsvImportResponseSchema,
	},
	'contacts.removeOptedOut': {
		input: Addressbook.AddressbookRemoveOptedOutContactsInputSchema,
		output: Addressbook.AddressbookRemoveOptedOutContactsResponseSchema,
	},
	'contacts.search': {
		input: Addressbook.AddressbookSearchContactsListsInputSchema,
		output: Addressbook.AddressbookSearchContactsListsResponseSchema,
	},
	'contacts.suggestions': {
		input: Addressbook.AddressbookGetContactSuggestionsInputSchema,
		output: Addressbook.AddressbookGetContactSuggestionsResponseSchema,
	},
	'recharge.transactions': {
		input: Billing.BillingListRechargeTransactionsInputSchema,
		output: Billing.BillingListRechargeTransactionsResponseSchema,
	},
	'recharge.transactionGet': {
		input: Billing.BillingGetRechargeTransactionInputSchema,
		output: Billing.BillingGetRechargeTransactionResponseSchema,
	},
	'recharge.packages': {
		input: Billing.BillingListRechargePackagesInputSchema,
		output: Billing.BillingListRechargePackagesResponseSchema,
	},
	'recharge.purchase': {
		input: Billing.BillingPurchaseRechargePackageInputSchema,
		output: Billing.BillingPurchaseRechargePackageResponseSchema,
	},
	'recharge.creditCardGet': {
		input: Billing.BillingGetRechargeCreditCardInputSchema,
		output: Billing.BillingGetRechargeCreditCardResponseSchema,
	},
	'recharge.creditCardUpdate': {
		input: Billing.BillingUpdateRechargeCreditCardInputSchema,
		output: Billing.BillingUpdateRechargeCreditCardResponseSchema,
	},
	'subaccounts.list': {
		input: Billing.BillingListSubaccountsInputSchema,
		output: Billing.BillingListSubaccountsResponseSchema,
	},
	'subaccounts.get': {
		input: Billing.BillingGetSubaccountInputSchema,
		output: Billing.BillingGetSubaccountResponseSchema,
	},
	'subaccounts.create': {
		input: Billing.BillingCreateSubaccountInputSchema,
		output: Billing.BillingCreateSubaccountResponseSchema,
	},
	'subaccounts.update': {
		input: Billing.BillingUpdateSubaccountInputSchema,
		output: Billing.BillingUpdateSubaccountResponseSchema,
	},
	'subaccounts.delete': {
		input: Billing.BillingDeleteSubaccountInputSchema,
		output: Billing.BillingDeleteSubaccountResponseSchema,
	},
	'subaccounts.regenKey': {
		input: Billing.BillingRegenSubaccountApiKeyInputSchema,
		output: Billing.BillingRegenSubaccountApiKeyResponseSchema,
	},
	'reseller.accountsList': {
		input: Billing.BillingListResellerAccountsInputSchema,
		output: Billing.BillingListResellerAccountsResponseSchema,
	},
	'reseller.settingsGet': {
		input: Billing.BillingGetResellerSettingsInputSchema,
		output: Billing.BillingGetResellerSettingsResponseSchema,
	},
	'reseller.settingsUpdate': {
		input: Billing.BillingUpdateResellerSettingsInputSchema,
		output: Billing.BillingUpdateResellerSettingsResponseSchema,
	},
	'referral.accountsList': {
		input: Billing.BillingListReferralAccountsInputSchema,
		output: Billing.BillingListReferralAccountsResponseSchema,
	},
	'countries.list': {
		input: Geo.GeoListCountriesInputSchema,
		output: Geo.GeoListCountriesResponseSchema,
	},
	'countries.globalList': {
		input: Geo.GeoListGlobalSendingCountriesInputSchema,
		output: Geo.GeoListGlobalSendingCountriesResponseSchema,
	},
	'countries.pricing': {
		input: Geo.GeoGetCountryPricingInputSchema,
		output: Geo.GeoGetCountryPricingResponseSchema,
	},
	'countries.userCountriesGet': {
		input: Geo.GeoGetUserCountriesInputSchema,
		output: Geo.GeoGetUserCountriesResponseSchema,
	},
	'countries.userCountriesSelect': {
		input: Geo.GeoSelectUserCountriesInputSchema,
		output: Geo.GeoSelectUserCountriesResponseSchema,
	},
	'countries.userCountriesAgree': {
		input: Geo.GeoAgreeUserCountriesRulesInputSchema,
		output: Geo.GeoAgreeUserCountriesRulesResponseSchema,
	},
	'timezones.list': {
		input: Geo.GeoListTimezonesInputSchema,
		output: Geo.GeoListTimezonesResponseSchema,
	},
	'deliveryIssues.list': {
		input: Geo.GeoListDeliveryIssuesInputSchema,
		output: Geo.GeoListDeliveryIssuesResponseSchema,
	},
	'deliveryIssues.create': {
		input: Geo.GeoCreateDeliveryIssueInputSchema,
		output: Geo.GeoCreateDeliveryIssueResponseSchema,
	},
	'postLetters.send': {
		input: Post.PostLettersSendInputSchema,
		output: Post.PostLettersSendResponseSchema,
	},
	'postLetters.history': {
		input: Post.PostLettersHistoryInputSchema,
		output: Post.PostLettersHistoryResponseSchema,
	},
	'postLetters.historyExport': {
		input: Post.PostLettersHistoryExportInputSchema,
		output: Post.PostLettersHistoryExportResponseSchema,
	},
	'postLetters.price': {
		input: Post.PostLettersPriceInputSchema,
		output: Post.PostLettersPriceResponseSchema,
	},
	'postLetters.detectAddress': {
		input: Post.PostLettersDetectAddressInputSchema,
		output: Post.PostLettersDetectAddressResponseSchema,
	},
	'postReturnAddresses.create': {
		input: Post.PostReturnAddressCreateInputSchema,
		output: Post.PostReturnAddressCreateResponseSchema,
	},
	'postReturnAddresses.list': {
		input: Post.PostReturnAddressesListInputSchema,
		output: Post.PostReturnAddressesListResponseSchema,
	},
	'postReturnAddresses.get': {
		input: Post.PostReturnAddressGetInputSchema,
		output: Post.PostReturnAddressGetResponseSchema,
	},
	'postReturnAddresses.update': {
		input: Post.PostReturnAddressUpdateInputSchema,
		output: Post.PostReturnAddressUpdateResponseSchema,
	},
	'postReturnAddresses.delete': {
		input: Post.PostReturnAddressDeleteInputSchema,
		output: Post.EmptyResultSchema,
	},
	'postDirectMail.send': {
		input: Post.PostDirectMailSendInputSchema,
		output: Post.PostDirectMailSendResponseSchema,
	},
	'postDirectMail.searchLocations': {
		input: Post.PostDirectMailSearchLocationsInputSchema,
		output: Post.PostDirectMailSearchLocationsResponseSchema,
	},
	'numbers.list': {
		input: Numbers.NumbersListInputSchema,
		output: Numbers.NumbersListResponseSchema,
	},
	'numbers.search': {
		input: Numbers.NumbersSearchInputSchema,
		output: Numbers.NumbersSearchResponseSchema,
	},
	'numbers.buy': {
		input: Numbers.NumbersBuyInputSchema,
		output: Numbers.NumbersBuyResponseSchema,
	},
	'smsInboundRules.list': {
		input: Automations.SmsInboundRulesListInputSchema,
		output: Automations.SmsInboundRulesListResponseSchema,
	},
	'smsInboundRules.create': {
		input: Automations.SmsInboundRuleCreateInputSchema,
		output: Automations.SmsInboundRuleCreateResponseSchema,
	},
	'smsInboundRules.get': {
		input: Automations.SmsInboundRuleGetInputSchema,
		output: Automations.SmsInboundRuleGetResponseSchema,
	},
	'smsInboundRules.update': {
		input: Automations.SmsInboundRuleUpdateInputSchema,
		output: Automations.SmsInboundRuleUpdateResponseSchema,
	},
	'smsInboundRules.delete': {
		input: Automations.SmsInboundRuleDeleteInputSchema,
		output: Automations.SmsInboundRuleDeleteResponseSchema,
	},
	'smsReceiptRules.list': {
		input: Automations.SmsReceiptRulesListInputSchema,
		output: Automations.SmsReceiptRulesListResponseSchema,
	},
	'smsReceiptRules.create': {
		input: Automations.SmsReceiptRuleCreateInputSchema,
		output: Automations.SmsReceiptRuleCreateResponseSchema,
	},
	'smsReceiptRules.get': {
		input: Automations.SmsReceiptRuleGetInputSchema,
		output: Automations.SmsReceiptRuleGetResponseSchema,
	},
	'smsReceiptRules.update': {
		input: Automations.SmsReceiptRuleUpdateInputSchema,
		output: Automations.SmsReceiptRuleUpdateResponseSchema,
	},
	'smsReceiptRules.delete': {
		input: Automations.SmsReceiptRuleDeleteInputSchema,
		output: Automations.SmsReceiptRuleDeleteResponseSchema,
	},
	'voiceReceiptRules.list': {
		input: Automations.VoiceReceiptRulesListInputSchema,
		output: Automations.VoiceReceiptRulesListResponseSchema,
	},
	'voiceReceiptRules.create': {
		input: Automations.VoiceReceiptRuleCreateInputSchema,
		output: Automations.VoiceReceiptRuleCreateResponseSchema,
	},
	'voiceReceiptRules.get': {
		input: Automations.VoiceReceiptRuleGetInputSchema,
		output: Automations.VoiceReceiptRuleGetResponseSchema,
	},
	'voiceReceiptRules.update': {
		input: Automations.VoiceReceiptRuleUpdateInputSchema,
		output: Automations.VoiceReceiptRuleUpdateResponseSchema,
	},
	'voiceReceiptRules.delete': {
		input: Automations.VoiceReceiptRuleDeleteInputSchema,
		output: Automations.VoiceReceiptRuleDeleteResponseSchema,
	},
	'uploads.upload': {
		input: Uploads.UploadFileInputSchema,
		output: Uploads.UploadFileResponseSchema,
	},
	'uploads.uploadDocument': {
		input: Uploads.UploadDocumentInputSchema,
		output: Uploads.UploadDocumentResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clickSendEndpointsNested
>;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const clickSendEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Retrieve ClickSend account details and credit balance',
	},
	'account.update': {
		riskLevel: 'write',
		description: 'Update ClickSend account profile fields',
	},
	'sms.send': {
		riskLevel: 'write',
		description: 'Send one or more SMS messages',
	},
	'sms.history': {
		riskLevel: 'read',
		description: 'List sent SMS message history with pagination',
	},
	'sms.inbound': {
		riskLevel: 'read',
		description: 'List received inbound SMS messages with pagination',
	},
	'sms.receipts': {
		riskLevel: 'read',
		description: 'List SMS delivery receipts with pagination',
	},
	'sms.price': {
		riskLevel: 'write',
		description: 'Calculate the price of SMS messages without sending',
	},
	'sms.historyExport': {
		riskLevel: 'read',
		description: 'Export SMS history to a downloadable file',
	},
	'sms.receiptGet': {
		riskLevel: 'read',
		description: 'Retrieve a single SMS delivery receipt by message ID',
	},
	'sms.receiptCreateTest': {
		riskLevel: 'write',
		description: 'Create a test SMS delivery receipt for a webhook URL',
	},
	'sms.receiptsMarkRead': {
		riskLevel: 'write',
		description: 'Mark SMS delivery receipts as read',
	},
	'sms.inboundCreateTest': {
		riskLevel: 'write',
		description: 'Create a test inbound SMS message',
	},
	'sms.inboundMarkRead': {
		riskLevel: 'write',
		description: 'Mark inbound SMS messages as read',
	},
	'sms.inboundMarkReadOne': {
		riskLevel: 'write',
		description: 'Mark a single inbound SMS message as read',
	},
	'sms.cancel': {
		riskLevel: 'write',
		description: 'Cancel a scheduled SMS message',
	},
	'sms.cancelAll': {
		riskLevel: 'write',
		description: 'Cancel all scheduled SMS messages',
	},
	'sms.statistics': {
		riskLevel: 'read',
		description: 'Retrieve SMS usage statistics',
	},
	'smsTemplates.create': {
		riskLevel: 'write',
		description: 'Create an SMS message template',
	},
	'smsTemplates.list': {
		riskLevel: 'read',
		description: 'List SMS templates with pagination',
	},
	'smsTemplates.get': {
		riskLevel: 'read',
		description: 'Retrieve a single SMS template',
	},
	'smsTemplates.update': {
		riskLevel: 'write',
		description: 'Update an SMS template',
	},
	'smsTemplates.delete': {
		riskLevel: 'write',
		description: 'Delete an SMS template',
	},
	'smsStrippedStrings.list': {
		riskLevel: 'read',
		description: 'List email-to-SMS stripped-string rules',
	},
	'smsStrippedStrings.get': {
		riskLevel: 'read',
		description: 'Retrieve a single stripped-string rule',
	},
	'smsStrippedStrings.create': {
		riskLevel: 'write',
		description: 'Create an email-to-SMS stripped-string rule',
	},
	'smsStrippedStrings.update': {
		riskLevel: 'write',
		description: 'Update an email-to-SMS stripped-string rule',
	},
	'smsStrippedStrings.delete': {
		riskLevel: 'write',
		description: 'Delete an email-to-SMS stripped-string rule',
	},
	'smsEmailSms.create': {
		riskLevel: 'write',
		description: 'Allow an email address for email-to-SMS',
	},
	'smsEmailSms.list': {
		riskLevel: 'read',
		description: 'List allowed email-to-SMS addresses',
	},
	'voice.send': {
		riskLevel: 'write',
		description: 'Initiate outbound text-to-speech voice call',
	},
	'voice.history': {
		riskLevel: 'read',
		description: 'List voice call history with pagination',
	},
	'voice.cancelAll': {
		riskLevel: 'write',
		description: 'Cancel all scheduled voice calls',
	},
	'voice.historyExport': {
		riskLevel: 'read',
		description: 'Export voice history to a downloadable file',
	},
	'voice.languages': {
		riskLevel: 'read',
		description: 'List available voice-call languages',
	},
	'voice.statistics': {
		riskLevel: 'read',
		description: 'Retrieve voice usage statistics',
	},
	'voice.receiptsMarkRead': {
		riskLevel: 'write',
		description: 'Mark voice delivery receipts as read',
	},
	'mms.send': {
		riskLevel: 'write',
		description: 'Send one or more MMS messages with media',
	},
	'mms.price': {
		riskLevel: 'write',
		description: 'Calculate the price of MMS messages without sending',
	},
	'mms.history': {
		riskLevel: 'read',
		description: 'List MMS message history with pagination',
	},
	'mms.historyExport': {
		riskLevel: 'read',
		description: 'Export MMS history to a downloadable file',
	},
	'mms.receipts': {
		riskLevel: 'read',
		description: 'List MMS delivery receipts with pagination',
	},
	'mms.receiptsMarkRead': {
		riskLevel: 'write',
		description: 'Mark MMS delivery receipts as read',
	},
	'campaigns.sms.price': {
		riskLevel: 'write',
		description: 'Calculate the price of an SMS campaign',
	},
	'campaigns.sms.send': {
		riskLevel: 'write',
		description: 'Create and send an SMS campaign to a contact list',
	},
	'campaigns.sms.list': {
		riskLevel: 'read',
		description: 'List SMS campaigns with pagination and filters',
	},
	'campaigns.sms.get': {
		riskLevel: 'read',
		description: 'Retrieve a single SMS campaign by ID',
	},
	'campaigns.sms.update': {
		riskLevel: 'write',
		description: 'Update a scheduled SMS campaign',
	},
	'campaigns.sms.cancel': {
		riskLevel: 'write',
		description: 'Cancel a scheduled SMS campaign',
	},
	'campaigns.mms.list': {
		riskLevel: 'read',
		description: 'List MMS campaigns',
	},
	'campaigns.mms.send': {
		riskLevel: 'write',
		description: 'Create and send an MMS campaign to a contact list',
	},
	'campaigns.mms.price': {
		riskLevel: 'write',
		description: 'Calculate the price of an MMS campaign',
	},
	'campaigns.mms.update': {
		riskLevel: 'write',
		description: 'Update a scheduled MMS campaign',
	},
	'campaigns.mms.cancel': {
		riskLevel: 'write',
		description: 'Cancel a scheduled MMS campaign',
	},
	'emailAddresses.create': {
		riskLevel: 'write',
		description: 'Register a new allowed sender email address',
	},
	'emailAddresses.list': {
		riskLevel: 'read',
		description: 'List allowed sender email addresses',
	},
	'emailAddresses.get': {
		riskLevel: 'read',
		description: 'Retrieve a single allowed email address by ID',
	},
	'emailAddresses.delete': {
		riskLevel: 'write',
		description: 'Delete an allowed email address by ID',
	},
	'emailAddresses.sendToken': {
		riskLevel: 'write',
		description: 'Send a verification token to an allowed email address',
	},
	'emailAddresses.verify': {
		riskLevel: 'write',
		description: 'Verify an allowed email address with its activation token',
	},
	'emailTemplates.list': {
		riskLevel: 'read',
		description: 'List user email templates',
	},
	'emailTemplates.get': {
		riskLevel: 'read',
		description: 'Retrieve a single user email template by ID',
	},
	'emailTemplates.create': {
		riskLevel: 'write',
		description: 'Create a user email template from a master template',
	},
	'emailTemplates.update': {
		riskLevel: 'write',
		description: 'Update a user email template',
	},
	'emailTemplates.delete': {
		riskLevel: 'write',
		description: 'Delete a user email template by ID',
	},
	'emailMasterTemplates.list': {
		riskLevel: 'read',
		description: 'List ClickSend master email templates',
	},
	'emailMasterTemplates.get': {
		riskLevel: 'read',
		description: 'Retrieve a single master email template by ID',
	},
	'emailMasterTemplates.listInCategory': {
		riskLevel: 'read',
		description: 'List master email templates within a category',
	},
	'emailMasterCategories.list': {
		riskLevel: 'read',
		description: 'List master email template categories',
	},
	'emailMasterCategories.get': {
		riskLevel: 'read',
		description: 'Retrieve a single master template category by ID',
	},
	'emailReceiptRules.list': {
		riskLevel: 'read',
		description: 'List email delivery receipt automation rules',
	},
	'emailReceiptRules.create': {
		riskLevel: 'write',
		description: 'Create an email delivery receipt automation rule',
	},
	'emailReceiptRules.get': {
		riskLevel: 'read',
		description: 'Retrieve a single email receipt automation rule',
	},
	'emailReceiptRules.update': {
		riskLevel: 'write',
		description: 'Update an email delivery receipt automation rule',
	},
	'emailReceiptRules.delete': {
		riskLevel: 'write',
		description: 'Delete an email delivery receipt automation rule',
	},
	'emailCampaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve a single email campaign by ID',
	},
	'faxReceipts.createTest': {
		riskLevel: 'write',
		description: 'Create a test fax delivery receipt for a callback URL',
	},
	'faxReceipts.list': {
		riskLevel: 'read',
		description: 'List fax delivery receipts with pagination',
	},
	'faxReceipts.get': {
		riskLevel: 'read',
		description: 'Retrieve a single fax receipt by message ID',
	},
	'faxReceipts.markRead': {
		riskLevel: 'write',
		description: 'Mark fax delivery receipts as read',
	},
	'faxReceiptRules.list': {
		riskLevel: 'read',
		description: 'List fax receipt automation rules',
	},
	'faxReceiptRules.create': {
		riskLevel: 'write',
		description: 'Create a fax receipt automation rule',
	},
	'faxReceiptRules.get': {
		riskLevel: 'read',
		description: 'Retrieve a single fax receipt automation rule',
	},
	'faxReceiptRules.update': {
		riskLevel: 'write',
		description: 'Update a fax receipt automation rule',
	},
	'faxReceiptRules.delete': {
		riskLevel: 'write',
		description: 'Delete a fax receipt automation rule',
	},
	'faxInboundRules.list': {
		riskLevel: 'read',
		description: 'List fax inbound automation rules',
	},
	'faxInboundRules.create': {
		riskLevel: 'write',
		description: 'Create a fax inbound automation rule',
	},
	'faxInboundRules.get': {
		riskLevel: 'read',
		description: 'Retrieve a single fax inbound automation rule',
	},
	'faxInboundRules.update': {
		riskLevel: 'write',
		description: 'Update a fax inbound automation rule',
	},
	'faxInboundRules.delete': {
		riskLevel: 'write',
		description: 'Delete a fax inbound automation rule',
	},
	'contactLists.getAll': {
		riskLevel: 'read',
		description: 'Retrieve all contact lists with pagination',
	},
	'contactLists.create': {
		riskLevel: 'write',
		description: 'Create a new contact list',
	},
	'contactLists.update': {
		riskLevel: 'write',
		description: 'Rename a contact list by ID',
	},
	'contactLists.delete': {
		riskLevel: 'write',
		description: 'Delete a contact list by ID',
	},
	'contactLists.get': {
		riskLevel: 'read',
		description: 'Retrieve a single contact list by ID',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Add a new contact to a specific list',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts within a specific contact list',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve a single contact from a list',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update contact fields within a list',
	},
	'contacts.delete': {
		riskLevel: 'write',
		description: 'Delete a contact from a list',
	},
	'contacts.copy': {
		riskLevel: 'write',
		description: 'Copy a contact from one list to another',
	},
	'contacts.transfer': {
		riskLevel: 'write',
		description: 'Move a contact from one list to another',
	},
	'contacts.import': {
		riskLevel: 'write',
		description: 'Bulk-import contacts into a list from a file URL',
	},
	'contacts.importFields': {
		riskLevel: 'read',
		description: 'List valid import field mappings for a list',
	},
	'contacts.importPreview': {
		riskLevel: 'write',
		description: 'Preview the first row of a CSV import file',
	},
	'contacts.removeOptedOut': {
		riskLevel: 'write',
		description: 'Remove opted-out contacts from a list',
	},
	'contacts.search': {
		riskLevel: 'read',
		description: 'Search contact lists and contacts by keyword',
	},
	'contacts.suggestions': {
		riskLevel: 'read',
		description: 'List suggested contacts across lists',
	},
	'recharge.transactions': {
		riskLevel: 'read',
		description: 'List recharge transactions with pagination',
	},
	'recharge.transactionGet': {
		riskLevel: 'read',
		description: 'Retrieve a single recharge transaction',
	},
	'recharge.packages': {
		riskLevel: 'read',
		description: 'List available recharge packages and currency',
	},
	'recharge.purchase': {
		riskLevel: 'write',
		description: 'Purchase a recharge package by ID',
	},
	'recharge.creditCardGet': {
		riskLevel: 'read',
		description: 'Retrieve the stored recharge credit card',
	},
	'recharge.creditCardUpdate': {
		riskLevel: 'write',
		description: 'Replace the stored recharge credit card',
	},
	'subaccounts.list': {
		riskLevel: 'read',
		description: 'List subaccounts with pagination',
	},
	'subaccounts.get': {
		riskLevel: 'read',
		description: 'Retrieve a single subaccount',
	},
	'subaccounts.create': {
		riskLevel: 'write',
		description: 'Create a new subaccount',
	},
	'subaccounts.update': {
		riskLevel: 'write',
		description: 'Update subaccount contact fields',
	},
	'subaccounts.delete': {
		riskLevel: 'write',
		description: 'Delete a subaccount',
	},
	'subaccounts.regenKey': {
		riskLevel: 'write',
		description: 'Regenerate a subaccount API key',
	},
	'reseller.accountsList': {
		riskLevel: 'read',
		description: 'List reseller child accounts',
	},
	'reseller.settingsGet': {
		riskLevel: 'read',
		description: 'Retrieve reseller settings',
	},
	'reseller.settingsUpdate': {
		riskLevel: 'write',
		description: 'Update reseller settings',
	},
	'referral.accountsList': {
		riskLevel: 'read',
		description: 'List referral accounts',
	},
	'countries.list': {
		riskLevel: 'read',
		description: 'List supported countries as code/value pairs',
	},
	'countries.globalList': {
		riskLevel: 'read',
		description: 'List global sending destination countries',
	},
	'countries.pricing': {
		riskLevel: 'read',
		description: 'Retrieve per-country pricing for a currency',
	},
	'countries.userCountriesGet': {
		riskLevel: 'read',
		description: 'List enabled global-sending countries',
	},
	'countries.userCountriesSelect': {
		riskLevel: 'write',
		description: 'Select enabled global-sending countries',
	},
	'countries.userCountriesAgree': {
		riskLevel: 'write',
		description: 'Agree to sending-country compliance rules',
	},
	'timezones.list': {
		riskLevel: 'read',
		description: 'List supported timezone names',
	},
	'deliveryIssues.list': {
		riskLevel: 'read',
		description: 'List delivery issues with pagination',
	},
	'deliveryIssues.create': {
		riskLevel: 'write',
		description: 'Report a message delivery issue',
	},
	'postLetters.send': {
		riskLevel: 'write',
		description: 'Send a physical post letter to recipients',
	},
	'postLetters.history': {
		riskLevel: 'read',
		description: 'List post letter history with pagination',
	},
	'postLetters.historyExport': {
		riskLevel: 'read',
		description: 'Export post letter history to a downloadable file',
	},
	'postLetters.price': {
		riskLevel: 'write',
		description: 'Calculate post letter price without sending',
	},
	'postLetters.detectAddress': {
		riskLevel: 'write',
		description: 'Detect a structured address from PDF content or text',
	},
	'postReturnAddresses.create': {
		riskLevel: 'write',
		description: 'Create a post return address',
	},
	'postReturnAddresses.list': {
		riskLevel: 'read',
		description: 'List post return addresses with pagination',
	},
	'postReturnAddresses.get': {
		riskLevel: 'read',
		description: 'Retrieve a single post return address by ID',
	},
	'postReturnAddresses.update': {
		riskLevel: 'write',
		description: 'Update a post return address by ID',
	},
	'postReturnAddresses.delete': {
		riskLevel: 'write',
		description: 'Delete a post return address by ID',
	},
	'postDirectMail.send': {
		riskLevel: 'write',
		description: 'Send a direct mail campaign',
	},
	'postDirectMail.searchLocations': {
		riskLevel: 'read',
		description: 'Search direct mail delivery locations by country',
	},
	'numbers.list': {
		riskLevel: 'read',
		description: 'List owned dedicated numbers',
	},
	'numbers.search': {
		riskLevel: 'read',
		description: 'Search available dedicated numbers by country',
	},
	'numbers.buy': {
		riskLevel: 'write',
		description: 'Purchase a dedicated number',
	},
	'smsInboundRules.list': {
		riskLevel: 'read',
		description: 'List SMS inbound automation rules',
	},
	'smsInboundRules.create': {
		riskLevel: 'write',
		description: 'Create an SMS inbound automation rule',
	},
	'smsInboundRules.get': {
		riskLevel: 'read',
		description: 'Retrieve an SMS inbound automation rule',
	},
	'smsInboundRules.update': {
		riskLevel: 'write',
		description: 'Update an SMS inbound automation rule',
	},
	'smsInboundRules.delete': {
		riskLevel: 'write',
		description: 'Delete an SMS inbound automation rule',
	},
	'smsReceiptRules.list': {
		riskLevel: 'read',
		description: 'List SMS receipt automation rules',
	},
	'smsReceiptRules.create': {
		riskLevel: 'write',
		description: 'Create an SMS receipt automation rule',
	},
	'smsReceiptRules.get': {
		riskLevel: 'read',
		description: 'Retrieve an SMS receipt automation rule',
	},
	'smsReceiptRules.update': {
		riskLevel: 'write',
		description: 'Update an SMS receipt automation rule',
	},
	'smsReceiptRules.delete': {
		riskLevel: 'write',
		description: 'Delete an SMS receipt automation rule',
	},
	'voiceReceiptRules.list': {
		riskLevel: 'read',
		description: 'List voice receipt automation rules',
	},
	'voiceReceiptRules.create': {
		riskLevel: 'write',
		description: 'Create a voice receipt automation rule',
	},
	'voiceReceiptRules.get': {
		riskLevel: 'read',
		description: 'Retrieve a voice receipt automation rule',
	},
	'voiceReceiptRules.update': {
		riskLevel: 'write',
		description: 'Update a voice receipt automation rule',
	},
	'voiceReceiptRules.delete': {
		riskLevel: 'write',
		description: 'Delete a voice receipt automation rule',
	},
	'uploads.upload': {
		riskLevel: 'write',
		description: 'Upload and convert a file for messaging services',
	},
	'uploads.uploadDocument': {
		riskLevel: 'write',
		description: 'Upload a document for fax and post services',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof clickSendEndpointsNested
>;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const;

export type BaseClickSendPlugin<T extends ClickSendPluginOptions> =
	CorsairPlugin<
		'clicksend',
		typeof ClickSendSchema,
		typeof clickSendEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof clicksendAuthConfig
	>;

export type InternalClickSendPlugin =
	BaseClickSendPlugin<ClickSendPluginOptions>;

export type ExternalClickSendPlugin<T extends ClickSendPluginOptions> =
	BaseClickSendPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function clicksend<const T extends ClickSendPluginOptions>(
	incomingOptions: ClickSendPluginOptions & T = {} as ClickSendPluginOptions &
		T,
): ExternalClickSendPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		key:
			incomingOptions.key ??
			(incomingOptions.username && incomingOptions.apiKey
				? `${incomingOptions.username}:${incomingOptions.apiKey}`
				: incomingOptions.apiKey),
	};
	return {
		id: 'clicksend',
		schema: ClickSendSchema,
		options: options,
		hooks: options.hooks,
		endpoints: clickSendEndpointsNested,
		authConfig: clicksendAuthConfig,
		endpointMeta: clickSendEndpointMeta,
		endpointSchemas: clickSendEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClickSendKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.apiKey) {
				return options.apiKey;
			}
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				try {
					const res = await ctx.keys.get_api_key();
					return res ?? '';
				} catch {
					return '';
				}
			}

			return '';
		},
	} satisfies InternalClickSendPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AccountGetInput,
	AccountGetResponse,
	ClickSendEndpointInputs,
	ClickSendEndpointOutputs,
	ContactListsCreateInput,
	ContactListsCreateResponse,
	ContactListsGetAllInput,
	ContactListsGetAllResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsListInput,
	ContactsListResponse,
	SmsHistoryInput,
	SmsHistoryResponse,
	SmsInboundInput,
	SmsInboundResponse,
	SmsMessageInput,
	SmsReceiptsInput,
	SmsReceiptsResponse,
	SmsSendInput,
	SmsSendResponse,
	VoiceHistoryInput,
	VoiceHistoryResponse,
	VoiceMessageInput,
	VoiceSendInput,
	VoiceSendResponse,
} from './endpoints/types';
