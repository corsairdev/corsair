import { z } from 'zod';
import type * as AccountEndpoints from './account';
import type * as Addressbook from './addressbook';
import type * as Automations from './automations';
import type * as Billing from './billing';
import type * as Campaigns from './campaigns';
import type * as Email from './email';
import type * as Fax from './fax';
import type * as Geo from './geo';
import type * as Messaging from './messaging';
import type * as Mms from './mms';
import type * as Numbers from './numbers';
import type * as Post from './post';
import type * as Uploads from './uploads';

// ── Account ───────────────────────────────────────────────────────────────────

export const AccountGetInputSchema = z.object({});
export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

export const AccountGetResponseSchema = z.object({
	user_id: z.union([z.number(), z.string()]),
	username: z.string(),
	user_email: z.string(),
	user_first_name: z.string().optional(),
	user_last_name: z.string().optional(),
	balance: z.number(),
	currency: z.string().optional(),
});
export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── SMS ───────────────────────────────────────────────────────────────────────

export const SmsMessageInputSchema = z.object({
	to: z
		.string()
		.min(1)
		.describe('Recipient phone number in E.164 international format'),
	body: z.string().min(1).describe('SMS message text'),
	from: z.string().optional().describe('Sender ID or verified phone number'),
	schedule: z
		.number()
		.optional()
		.describe('Epoch timestamp for scheduled sending'),
	source: z.string().optional().describe('Source identifier'),
	custom_string: z.string().optional().describe('Custom reference string'),
	country: z.string().optional().describe('2-letter country code'),
});
export type SmsMessageInput = z.infer<typeof SmsMessageInputSchema>;

export const SmsSendInputSchema = z.object({
	messages: z
		.array(SmsMessageInputSchema)
		.min(1)
		.describe('Array of SMS messages to send'),
});
export type SmsSendInput = z.infer<typeof SmsSendInputSchema>;

export const ClickSendSentMessageSchema = z.object({
	direction: z.string().optional(),
	date: z.number().optional(),
	to: z.string(),
	body: z.string(),
	from: z.string().optional(),
	schedule: z.number().optional(),
	message_id: z.string(),
	message_parts: z.number().optional(),
	message_price: z.string().optional(),
	custom_string: z.string().optional(),
	user_id: z.number().optional(),
	subaccount_id: z.number().optional(),
	country: z.string().optional(),
	carrier: z.string().optional(),
	currency: z.string().optional(),
	status: z.string(),
});
export type ClickSendSentMessage = z.infer<typeof ClickSendSentMessageSchema>;

export const SmsSendResponseSchema = z.object({
	total_price: z.number().optional(),
	total_count: z.number().optional(),
	queued_count: z.number().optional(),
	blocked_count: z.number().optional(),
	messages: z.array(ClickSendSentMessageSchema),
});
export type SmsSendResponse = z.infer<typeof SmsSendResponseSchema>;

export const SmsHistoryInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	date_from: z.number().optional().describe('Start epoch timestamp'),
	date_to: z.number().optional().describe('End epoch timestamp'),
});
export type SmsHistoryInput = z.infer<typeof SmsHistoryInputSchema>;

export const SmsHistoryResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendSentMessageSchema),
});
export type SmsHistoryResponse = z.infer<typeof SmsHistoryResponseSchema>;

export const SmsInboundInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type SmsInboundInput = z.infer<typeof SmsInboundInputSchema>;

export const ClickSendInboundMessageSchema = z.object({
	message_id: z.string(),
	to: z.string(),
	from: z.string(),
	body: z.string(),
	timestamp: z.number().optional(),
	original_message_id: z.string().optional(),
});
export type ClickSendInboundMessage = z.infer<
	typeof ClickSendInboundMessageSchema
>;

export const SmsInboundResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendInboundMessageSchema),
});
export type SmsInboundResponse = z.infer<typeof SmsInboundResponseSchema>;

export const SmsReceiptsInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type SmsReceiptsInput = z.infer<typeof SmsReceiptsInputSchema>;

export const ClickSendDeliveryReceiptSchema = z.object({
	message_id: z.string(),
	status: z.string(),
	status_code: z.string().optional(),
	status_text: z.string().optional(),
	timestamp: z.number().optional(),
	original_message_id: z.string().optional(),
});
export type ClickSendDeliveryReceipt = z.infer<
	typeof ClickSendDeliveryReceiptSchema
>;

export const SmsReceiptsResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendDeliveryReceiptSchema),
});
export type SmsReceiptsResponse = z.infer<typeof SmsReceiptsResponseSchema>;

// ── Voice ─────────────────────────────────────────────────────────────────────

export const VoiceMessageInputSchema = z.object({
	to: z.string().min(1).describe('Recipient phone number in E.164 format'),
	body: z.string().min(1).describe('Text to be spoken to the recipient'),
	voice: z.enum(['female', 'male']).optional().describe('Voice gender'),
	lang: z.string().optional().describe('Language code (e.g. en-us, en-gb)'),
	schedule: z
		.number()
		.optional()
		.describe('Epoch timestamp for scheduled call'),
	require_input: z
		.number()
		.int()
		.optional()
		.describe('Whether user must press a key to hear message'),
	machine_detection: z
		.number()
		.int()
		.optional()
		.describe('Whether to detect answering machine'),
});
export type VoiceMessageInput = z.infer<typeof VoiceMessageInputSchema>;

export const VoiceSendInputSchema = z.object({
	messages: z.array(VoiceMessageInputSchema).min(1),
});
export type VoiceSendInput = z.infer<typeof VoiceSendInputSchema>;

export const ClickSendVoiceMessageSchema = z.object({
	to: z.string(),
	body: z.string(),
	voice: z.string().optional(),
	lang: z.string().optional(),
	message_id: z.string(),
	status: z.string(),
	date: z.number().optional(),
});
export type ClickSendVoiceMessage = z.infer<typeof ClickSendVoiceMessageSchema>;

export const VoiceSendResponseSchema = z.object({
	total_price: z.number().optional(),
	total_count: z.number().optional(),
	queued_count: z.number().optional(),
	messages: z.array(ClickSendVoiceMessageSchema),
});
export type VoiceSendResponse = z.infer<typeof VoiceSendResponseSchema>;

export const VoiceHistoryInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type VoiceHistoryInput = z.infer<typeof VoiceHistoryInputSchema>;

export const VoiceHistoryResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendVoiceMessageSchema),
});
export type VoiceHistoryResponse = z.infer<typeof VoiceHistoryResponseSchema>;

// ── Contacts & Lists ──────────────────────────────────────────────────────────

export const ContactListsGetAllInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type ContactListsGetAllInput = z.infer<
	typeof ContactListsGetAllInputSchema
>;

export const ClickSendContactListSchema = z.object({
	list_id: z.number().int().positive(),
	list_name: z.string(),
	contact_count: z.number().optional(),
});
export type ClickSendContactList = z.infer<typeof ClickSendContactListSchema>;

export const ContactListsGetAllResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendContactListSchema),
});
export type ContactListsGetAllResponse = z.infer<
	typeof ContactListsGetAllResponseSchema
>;

export const ContactListsCreateInputSchema = z.object({
	list_name: z.string().min(1).describe('Name for the contact list'),
});
export type ContactListsCreateInput = z.infer<
	typeof ContactListsCreateInputSchema
>;

export const ContactListsCreateResponseSchema = ClickSendContactListSchema;
export type ContactListsCreateResponse = z.infer<
	typeof ContactListsCreateResponseSchema
>;

export const ContactsCreateInputSchema = z.object({
	list_id: z.number().int().positive().describe('Target contact list ID'),
	phone_number: z.string().min(1).describe('Phone number of the contact'),
	first_name: z.string().optional().describe('First name'),
	last_name: z.string().optional().describe('Last name'),
	email: z.string().email().optional().describe('Email address'),
});
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

export const ClickSendContactSchema = z.object({
	contact_id: z.number().int().positive(),
	list_id: z.number().int().positive(),
	phone_number: z.string(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().optional(),
});
export type ClickSendContact = z.infer<typeof ClickSendContactSchema>;

export const ContactsCreateResponseSchema = ClickSendContactSchema;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

export const ContactsListInputSchema = z.object({
	list_id: z
		.number()
		.int()
		.positive()
		.describe('List ID to fetch contacts from'),
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactsListResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendContactSchema),
});
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

// ── Aggregate Input & Output Types ────────────────────────────────────────────

export type ClickSendEndpointInputs = {
	accountGet: AccountGetInput;
	accountUpdate: AccountEndpoints.AccountUpdateInput;
	smsSend: SmsSendInput;
	smsHistory: SmsHistoryInput;
	smsInbound: SmsInboundInput;
	smsReceipts: SmsReceiptsInput;
	smsPrice: Messaging.SmsPriceInput;
	smsHistoryExport: Messaging.SmsHistoryExportInput;
	smsReceiptGet: Messaging.SmsReceiptGetInput;
	smsReceiptCreateTest: Messaging.SmsReceiptCreateTestInput;
	smsReceiptsMarkRead: Messaging.SmsReceiptsMarkReadInput;
	smsInboundCreateTest: Messaging.SmsInboundCreateTestInput;
	smsInboundMarkRead: Messaging.SmsInboundMarkReadInput;
	smsInboundMarkReadOne: Messaging.SmsInboundMarkReadOneInput;
	smsCancel: Messaging.SmsCancelInput;
	smsCancelAll: Messaging.SmsCancelAllInput;
	smsStatistics: Messaging.SmsStatisticsInput;
	smsTemplatesCreate: Messaging.SmsTemplateCreateInput;
	smsTemplatesList: Messaging.SmsTemplatesListInput;
	smsTemplatesGet: Messaging.SmsTemplateGetInput;
	smsTemplatesUpdate: Messaging.SmsTemplateUpdateInput;
	smsTemplatesDelete: Messaging.SmsTemplateDeleteInput;
	smsStrippedStringsList: Messaging.SmsStrippedStringsListInput;
	smsStrippedStringsGet: Messaging.SmsStrippedStringGetInput;
	smsStrippedStringsCreate: Messaging.SmsStrippedStringCreateInput;
	smsStrippedStringsUpdate: Messaging.SmsStrippedStringUpdateInput;
	smsStrippedStringsDelete: Messaging.SmsStrippedStringDeleteInput;
	smsEmailSmsCreate: Messaging.SmsAllowedEmailCreateInput;
	smsEmailSmsList: Messaging.SmsAllowedEmailsListInput;
	voiceSend: VoiceSendInput;
	voiceHistory: VoiceHistoryInput;
	voiceCancelAll: Messaging.VoiceCancelAllInput;
	voiceHistoryExport: Messaging.VoiceHistoryExportInput;
	voiceLanguages: Messaging.VoiceLanguagesListInput;
	voiceStatistics: Messaging.VoiceStatisticsInput;
	voiceReceiptsMarkRead: Messaging.VoiceReceiptsMarkReadInput;
	mmsSend: Mms.MmsSendInput;
	mmsPrice: Mms.MmsPriceInput;
	mmsHistory: Mms.MmsHistoryInput;
	mmsHistoryExport: Mms.MmsHistoryExportInput;
	mmsReceipts: Mms.MmsReceiptsListInput;
	mmsReceiptsMarkRead: Mms.MmsReceiptsMarkReadInput;
	campaignsSmsPrice: Campaigns.PriceSmsCampaignInput;
	campaignsSmsSend: Campaigns.SendSmsCampaignInput;
	campaignsSmsList: Campaigns.ListSmsCampaignsInput;
	campaignsSmsGet: Campaigns.GetSmsCampaignInput;
	campaignsSmsUpdate: Campaigns.UpdateSmsCampaignInput;
	campaignsSmsCancel: Campaigns.CancelSmsCampaignInput;
	campaignsMmsList: Campaigns.ListMmsCampaignsInput;
	campaignsMmsSend: Campaigns.SendMmsCampaignInput;
	campaignsMmsPrice: Campaigns.PriceMmsCampaignInput;
	campaignsMmsUpdate: Campaigns.UpdateMmsCampaignInput;
	campaignsMmsCancel: Campaigns.CancelMmsCampaignInput;
	emailAddressesCreate: Email.EmailAddressCreateInput;
	emailAddressesList: Email.EmailAddressListInput;
	emailAddressesGet: Email.EmailAddressGetInput;
	emailAddressesDelete: Email.EmailAddressDeleteInput;
	emailAddressesSendToken: Email.EmailVerificationTokenSendInput;
	emailAddressesVerify: Email.EmailAddressVerifyInput;
	emailTemplatesList: Email.EmailTemplateListInput;
	emailTemplatesGet: Email.EmailTemplateGetInput;
	emailTemplatesCreate: Email.EmailTemplateCreateInput;
	emailTemplatesUpdate: Email.EmailTemplateUpdateInput;
	emailTemplatesDelete: Email.EmailTemplateDeleteInput;
	emailMasterTemplatesList: Email.EmailMasterTemplateListInput;
	emailMasterTemplatesGet: Email.EmailMasterTemplateGetInput;
	emailMasterTemplatesListInCategory: Email.EmailMasterTemplatesInCategoryListInput;
	emailMasterCategoriesList: Email.EmailMasterCategoryListInput;
	emailMasterCategoriesGet: Email.EmailMasterCategoryGetInput;
	emailReceiptRulesList: Email.EmailReceiptRuleListInput;
	emailReceiptRulesCreate: Email.EmailReceiptRuleCreateInput;
	emailReceiptRulesGet: Email.EmailReceiptRuleGetInput;
	emailReceiptRulesUpdate: Email.EmailReceiptRuleUpdateInput;
	emailReceiptRulesDelete: Email.EmailReceiptRuleDeleteInput;
	emailCampaignsGet: Email.EmailCampaignGetInput;
	faxReceiptsCreateTest: Fax.FaxTestReceiptCreateInput;
	faxReceiptsList: Fax.FaxReceiptListInput;
	faxReceiptsGet: Fax.FaxReceiptGetInput;
	faxReceiptsMarkRead: Fax.FaxReceiptsMarkReadInput;
	faxReceiptRulesList: Fax.FaxReceiptRuleListInput;
	faxReceiptRulesCreate: Fax.FaxReceiptRuleCreateInput;
	faxReceiptRulesGet: Fax.FaxReceiptRuleGetInput;
	faxReceiptRulesUpdate: Fax.FaxReceiptRuleUpdateInput;
	faxReceiptRulesDelete: Fax.FaxReceiptRuleDeleteInput;
	faxInboundRulesList: Fax.FaxInboundRuleListInput;
	faxInboundRulesCreate: Fax.FaxInboundRuleCreateInput;
	faxInboundRulesGet: Fax.FaxInboundRuleGetInput;
	faxInboundRulesUpdate: Fax.FaxInboundRuleUpdateInput;
	faxInboundRulesDelete: Fax.FaxInboundRuleDeleteInput;
	contactListsGetAll: ContactListsGetAllInput;
	contactListsCreate: ContactListsCreateInput;
	contactListsUpdate: Addressbook.AddressbookUpdateContactListInput;
	contactListsDelete: Addressbook.AddressbookDeleteContactListInput;
	contactListsGet: Addressbook.AddressbookGetContactListInput;
	contactsCreate: ContactsCreateInput;
	contactsList: ContactsListInput;
	contactsGet: Addressbook.AddressbookGetContactInput;
	contactsUpdate: Addressbook.AddressbookUpdateContactInput;
	contactsDelete: Addressbook.AddressbookDeleteContactInput;
	contactsCopy: Addressbook.AddressbookCopyContactInput;
	contactsTransfer: Addressbook.AddressbookTransferContactInput;
	contactsImport: Addressbook.AddressbookImportContactsInput;
	contactsImportFields: Addressbook.AddressbookListImportFieldsInput;
	contactsImportPreview: Addressbook.AddressbookPreviewCsvImportInput;
	contactsRemoveOptedOut: Addressbook.AddressbookRemoveOptedOutContactsInput;
	contactsSearch: Addressbook.AddressbookSearchContactsListsInput;
	contactsSuggestions: Addressbook.AddressbookGetContactSuggestionsInput;
	rechargeTransactions: Billing.BillingListRechargeTransactionsInput;
	rechargeTransactionGet: Billing.BillingGetRechargeTransactionInput;
	rechargePackages: Billing.BillingListRechargePackagesInput;
	rechargePurchase: Billing.BillingPurchaseRechargePackageInput;
	rechargeCreditCardGet: Billing.BillingGetRechargeCreditCardInput;
	rechargeCreditCardUpdate: Billing.BillingUpdateRechargeCreditCardInput;
	subaccountsList: Billing.BillingListSubaccountsInput;
	subaccountsGet: Billing.BillingGetSubaccountInput;
	subaccountsCreate: Billing.BillingCreateSubaccountInput;
	subaccountsUpdate: Billing.BillingUpdateSubaccountInput;
	subaccountsDelete: Billing.BillingDeleteSubaccountInput;
	subaccountsRegenKey: Billing.BillingRegenSubaccountApiKeyInput;
	resellerAccountsList: Billing.BillingListResellerAccountsInput;
	resellerSettingsGet: Billing.BillingGetResellerSettingsInput;
	resellerSettingsUpdate: Billing.BillingUpdateResellerSettingsInput;
	referralAccountsList: Billing.BillingListReferralAccountsInput;
	countriesList: Geo.GeoListCountriesInput;
	countriesGlobalList: Geo.GeoListGlobalSendingCountriesInput;
	countriesPricing: Geo.GeoGetCountryPricingInput;
	countriesUserCountriesGet: Geo.GeoGetUserCountriesInput;
	countriesUserCountriesSelect: Geo.GeoSelectUserCountriesInput;
	countriesUserCountriesAgree: Geo.GeoAgreeUserCountriesRulesInput;
	timezonesList: Geo.GeoListTimezonesInput;
	deliveryIssuesList: Geo.GeoListDeliveryIssuesInput;
	deliveryIssuesCreate: Geo.GeoCreateDeliveryIssueInput;
	postLettersSend: Post.PostLettersSendInput;
	postLettersHistory: Post.PostLettersHistoryInput;
	postLettersHistoryExport: Post.PostLettersHistoryExportInput;
	postLettersPrice: Post.PostLettersPriceInput;
	postLettersDetectAddress: Post.PostLettersDetectAddressInput;
	postReturnAddressesCreate: Post.PostReturnAddressCreateInput;
	postReturnAddressesList: Post.PostReturnAddressesListInput;
	postReturnAddressesGet: Post.PostReturnAddressGetInput;
	postReturnAddressesUpdate: Post.PostReturnAddressUpdateInput;
	postReturnAddressesDelete: Post.PostReturnAddressDeleteInput;
	postDirectMailSend: Post.PostDirectMailSendInput;
	postDirectMailSearchLocations: Post.PostDirectMailSearchLocationsInput;
	numbersList: Numbers.NumbersListInput;
	numbersSearch: Numbers.NumbersSearchInput;
	numbersBuy: Numbers.NumbersBuyInput;
	smsInboundRulesList: Automations.SmsInboundRulesListInput;
	smsInboundRulesCreate: Automations.SmsInboundRuleCreateInput;
	smsInboundRulesGet: Automations.SmsInboundRuleGetInput;
	smsInboundRulesUpdate: Automations.SmsInboundRuleUpdateInput;
	smsInboundRulesDelete: Automations.SmsInboundRuleDeleteInput;
	smsReceiptRulesList: Automations.SmsReceiptRulesListInput;
	smsReceiptRulesCreate: Automations.SmsReceiptRuleCreateInput;
	smsReceiptRulesGet: Automations.SmsReceiptRuleGetInput;
	smsReceiptRulesUpdate: Automations.SmsReceiptRuleUpdateInput;
	smsReceiptRulesDelete: Automations.SmsReceiptRuleDeleteInput;
	voiceReceiptRulesList: Automations.VoiceReceiptRulesListInput;
	voiceReceiptRulesCreate: Automations.VoiceReceiptRuleCreateInput;
	voiceReceiptRulesGet: Automations.VoiceReceiptRuleGetInput;
	voiceReceiptRulesUpdate: Automations.VoiceReceiptRuleUpdateInput;
	voiceReceiptRulesDelete: Automations.VoiceReceiptRuleDeleteInput;
	uploadsUpload: Uploads.UploadFileInput;
	uploadsUploadDocument: Uploads.UploadDocumentInput;
};

export type ClickSendEndpointOutputs = {
	accountGet: AccountGetResponse;
	accountUpdate: AccountEndpoints.AccountUpdateResponse;
	smsSend: SmsSendResponse;
	smsHistory: SmsHistoryResponse;
	smsInbound: SmsInboundResponse;
	smsReceipts: SmsReceiptsResponse;
	smsPrice: Messaging.SmsPriceResponse;
	smsHistoryExport: Messaging.SmsHistoryExportResponse;
	smsReceiptGet: Messaging.SmsReceiptGetResponse;
	smsReceiptCreateTest: Messaging.SmsReceiptCreateTestResponse;
	smsReceiptsMarkRead: Messaging.SmsReceiptsMarkReadResponse;
	smsInboundCreateTest: Messaging.SmsInboundCreateTestResponse;
	smsInboundMarkRead: Messaging.SmsInboundMarkReadResponse;
	smsInboundMarkReadOne: Messaging.SmsInboundMarkReadOneResponse;
	smsCancel: Messaging.SmsCancelResponse;
	smsCancelAll: Messaging.SmsCancelAllResponse;
	smsStatistics: Messaging.SmsStatisticsResponse;
	smsTemplatesCreate: Messaging.SmsTemplateCreateResponse;
	smsTemplatesList: Messaging.SmsTemplatesListResponse;
	smsTemplatesGet: Messaging.SmsTemplateGetResponse;
	smsTemplatesUpdate: Messaging.SmsTemplateUpdateResponse;
	smsTemplatesDelete: Messaging.SmsTemplateDeleteResponse;
	smsStrippedStringsList: Messaging.SmsStrippedStringsListResponse;
	smsStrippedStringsGet: Messaging.SmsStrippedStringGetResponse;
	smsStrippedStringsCreate: Messaging.SmsStrippedStringCreateResponse;
	smsStrippedStringsUpdate: Messaging.SmsStrippedStringUpdateResponse;
	smsStrippedStringsDelete: Messaging.SmsStrippedStringDeleteResponse;
	smsEmailSmsCreate: Messaging.SmsAllowedEmailCreateResponse;
	smsEmailSmsList: Messaging.SmsAllowedEmailsListResponse;
	voiceSend: VoiceSendResponse;
	voiceHistory: VoiceHistoryResponse;
	voiceCancelAll: Messaging.VoiceCancelAllResponse;
	voiceHistoryExport: Messaging.VoiceHistoryExportResponse;
	voiceLanguages: Messaging.VoiceLanguagesListResponse;
	voiceStatistics: Messaging.VoiceStatisticsResponse;
	voiceReceiptsMarkRead: Messaging.VoiceReceiptsMarkReadResponse;
	mmsSend: Mms.MmsSendResponse;
	mmsPrice: Mms.MmsPriceResponse;
	mmsHistory: Mms.MmsHistoryResponse;
	mmsHistoryExport: Mms.MmsHistoryExportResponse;
	mmsReceipts: Mms.MmsReceiptsListResponse;
	mmsReceiptsMarkRead: Mms.MmsReceiptsMarkReadResponse;
	campaignsSmsPrice: Campaigns.PriceSmsCampaignResponse;
	campaignsSmsSend: Campaigns.SendSmsCampaignResponse;
	campaignsSmsList: Campaigns.ListSmsCampaignsResponse;
	campaignsSmsGet: Campaigns.GetSmsCampaignResponse;
	campaignsSmsUpdate: Campaigns.UpdateSmsCampaignResponse;
	campaignsSmsCancel: Campaigns.CancelSmsCampaignResponse;
	campaignsMmsList: Campaigns.ListMmsCampaignsResponse;
	campaignsMmsSend: Campaigns.SendMmsCampaignResponse;
	campaignsMmsPrice: Campaigns.PriceMmsCampaignResponse;
	campaignsMmsUpdate: Campaigns.UpdateMmsCampaignResponse;
	campaignsMmsCancel: Campaigns.CancelMmsCampaignResponse;
	emailAddressesCreate: Email.EmailAddressCreateResponse;
	emailAddressesList: Email.EmailAddressListResponse;
	emailAddressesGet: Email.EmailAddressGetResponse;
	emailAddressesDelete: Email.EmailAddressDeleteResponse;
	emailAddressesSendToken: Email.EmailVerificationTokenSendResponse;
	emailAddressesVerify: Email.EmailAddressVerifyResponse;
	emailTemplatesList: Email.EmailTemplateListResponse;
	emailTemplatesGet: Email.EmailTemplateGetResponse;
	emailTemplatesCreate: Email.EmailTemplateCreateResponse;
	emailTemplatesUpdate: Email.EmailTemplateUpdateResponse;
	emailTemplatesDelete: Email.EmailTemplateDeleteResponse;
	emailMasterTemplatesList: Email.EmailMasterTemplateListResponse;
	emailMasterTemplatesGet: Email.EmailMasterTemplateGetResponse;
	emailMasterTemplatesListInCategory: Email.EmailMasterTemplatesInCategoryListResponse;
	emailMasterCategoriesList: Email.EmailMasterCategoryListResponse;
	emailMasterCategoriesGet: Email.EmailMasterCategoryGetResponse;
	emailReceiptRulesList: Email.EmailReceiptRuleListResponse;
	emailReceiptRulesCreate: Email.EmailReceiptRuleCreateResponse;
	emailReceiptRulesGet: Email.EmailReceiptRuleGetResponse;
	emailReceiptRulesUpdate: Email.EmailReceiptRuleUpdateResponse;
	emailReceiptRulesDelete: Email.EmailReceiptRuleDeleteResponse;
	emailCampaignsGet: Email.EmailCampaignGetResponse;
	faxReceiptsCreateTest: Fax.FaxTestReceiptCreateResponse;
	faxReceiptsList: Fax.FaxReceiptListResponse;
	faxReceiptsGet: Fax.FaxReceiptGetResponse;
	faxReceiptsMarkRead: Fax.FaxReceiptsMarkReadResponse;
	faxReceiptRulesList: Fax.FaxReceiptRuleListResponse;
	faxReceiptRulesCreate: Fax.FaxReceiptRuleCreateResponse;
	faxReceiptRulesGet: Fax.FaxReceiptRuleGetResponse;
	faxReceiptRulesUpdate: Fax.FaxReceiptRuleUpdateResponse;
	faxReceiptRulesDelete: Fax.FaxReceiptRuleDeleteResponse;
	faxInboundRulesList: Fax.FaxInboundRuleListResponse;
	faxInboundRulesCreate: Fax.FaxInboundRuleCreateResponse;
	faxInboundRulesGet: Fax.FaxInboundRuleGetResponse;
	faxInboundRulesUpdate: Fax.FaxInboundRuleUpdateResponse;
	faxInboundRulesDelete: Fax.FaxInboundRuleDeleteResponse;
	contactListsGetAll: ContactListsGetAllResponse;
	contactListsCreate: ContactListsCreateResponse;
	contactListsUpdate: Addressbook.AddressbookUpdateContactListResponse;
	contactListsDelete: Addressbook.AddressbookDeleteContactListResponse;
	contactListsGet: Addressbook.AddressbookGetContactListResponse;
	contactsCreate: ContactsCreateResponse;
	contactsList: ContactsListResponse;
	contactsGet: Addressbook.AddressbookGetContactResponse;
	contactsUpdate: Addressbook.AddressbookUpdateContactResponse;
	contactsDelete: Addressbook.AddressbookDeleteContactResponse;
	contactsCopy: Addressbook.AddressbookCopyContactResponse;
	contactsTransfer: Addressbook.AddressbookTransferContactResponse;
	contactsImport: Addressbook.AddressbookImportContactsResponse;
	contactsImportFields: Addressbook.AddressbookListImportFieldsResponse;
	contactsImportPreview: Addressbook.AddressbookPreviewCsvImportResponse;
	contactsRemoveOptedOut: Addressbook.AddressbookRemoveOptedOutContactsResponse;
	contactsSearch: Addressbook.AddressbookSearchContactsListsResponse;
	contactsSuggestions: Addressbook.AddressbookGetContactSuggestionsResponse;
	rechargeTransactions: Billing.BillingListRechargeTransactionsResponse;
	rechargeTransactionGet: Billing.BillingGetRechargeTransactionResponse;
	rechargePackages: Billing.BillingListRechargePackagesResponse;
	rechargePurchase: Billing.BillingPurchaseRechargePackageResponse;
	rechargeCreditCardGet: Billing.BillingGetRechargeCreditCardResponse;
	rechargeCreditCardUpdate: Billing.BillingUpdateRechargeCreditCardResponse;
	subaccountsList: Billing.BillingListSubaccountsResponse;
	subaccountsGet: Billing.BillingGetSubaccountResponse;
	subaccountsCreate: Billing.BillingCreateSubaccountResponse;
	subaccountsUpdate: Billing.BillingUpdateSubaccountResponse;
	subaccountsDelete: Billing.BillingDeleteSubaccountResponse;
	subaccountsRegenKey: Billing.BillingRegenSubaccountApiKeyResponse;
	resellerAccountsList: Billing.BillingListResellerAccountsResponse;
	resellerSettingsGet: Billing.BillingGetResellerSettingsResponse;
	resellerSettingsUpdate: Billing.BillingUpdateResellerSettingsResponse;
	referralAccountsList: Billing.BillingListReferralAccountsResponse;
	countriesList: Geo.GeoListCountriesResponse;
	countriesGlobalList: Geo.GeoListGlobalSendingCountriesResponse;
	countriesPricing: Geo.GeoGetCountryPricingResponse;
	countriesUserCountriesGet: Geo.GeoGetUserCountriesResponse;
	countriesUserCountriesSelect: Geo.GeoSelectUserCountriesResponse;
	countriesUserCountriesAgree: Geo.GeoAgreeUserCountriesRulesResponse;
	timezonesList: Geo.GeoListTimezonesResponse;
	deliveryIssuesList: Geo.GeoListDeliveryIssuesResponse;
	deliveryIssuesCreate: Geo.GeoCreateDeliveryIssueResponse;
	postLettersSend: Post.PostLettersSendResponse;
	postLettersHistory: Post.PostLettersHistoryResponse;
	postLettersHistoryExport: Post.PostLettersHistoryExportResponse;
	postLettersPrice: Post.PostLettersPriceResponse;
	postLettersDetectAddress: Post.PostLettersDetectAddressResponse;
	postReturnAddressesCreate: Post.PostReturnAddressCreateResponse;
	postReturnAddressesList: Post.PostReturnAddressesListResponse;
	postReturnAddressesGet: Post.PostReturnAddressGetResponse;
	postReturnAddressesUpdate: Post.PostReturnAddressUpdateResponse;
	postReturnAddressesDelete: Post.EmptyResult;
	postDirectMailSend: Post.PostDirectMailSendResponse;
	postDirectMailSearchLocations: Post.PostDirectMailSearchLocationsResponse;
	numbersList: Numbers.NumbersListResponse;
	numbersSearch: Numbers.NumbersSearchResponse;
	numbersBuy: Numbers.NumbersBuyResponse;
	smsInboundRulesList: Automations.SmsInboundRulesListResponse;
	smsInboundRulesCreate: Automations.SmsInboundRuleCreateResponse;
	smsInboundRulesGet: Automations.SmsInboundRuleGetResponse;
	smsInboundRulesUpdate: Automations.SmsInboundRuleUpdateResponse;
	smsInboundRulesDelete: Automations.SmsInboundRuleDeleteResponse;
	smsReceiptRulesList: Automations.SmsReceiptRulesListResponse;
	smsReceiptRulesCreate: Automations.SmsReceiptRuleCreateResponse;
	smsReceiptRulesGet: Automations.SmsReceiptRuleGetResponse;
	smsReceiptRulesUpdate: Automations.SmsReceiptRuleUpdateResponse;
	smsReceiptRulesDelete: Automations.SmsReceiptRuleDeleteResponse;
	voiceReceiptRulesList: Automations.VoiceReceiptRulesListResponse;
	voiceReceiptRulesCreate: Automations.VoiceReceiptRuleCreateResponse;
	voiceReceiptRulesGet: Automations.VoiceReceiptRuleGetResponse;
	voiceReceiptRulesUpdate: Automations.VoiceReceiptRuleUpdateResponse;
	voiceReceiptRulesDelete: Automations.VoiceReceiptRuleDeleteResponse;
	uploadsUpload: Uploads.UploadFileResponse;
	uploadsUploadDocument: Uploads.UploadDocumentResponse;
};

export const ClickSendEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	smsSend: SmsSendInputSchema,
	smsHistory: SmsHistoryInputSchema,
	smsInbound: SmsInboundInputSchema,
	smsReceipts: SmsReceiptsInputSchema,
	voiceSend: VoiceSendInputSchema,
	voiceHistory: VoiceHistoryInputSchema,
	contactListsGetAll: ContactListsGetAllInputSchema,
	contactListsCreate: ContactListsCreateInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsList: ContactsListInputSchema,
} as const;

export const ClickSendEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	smsSend: SmsSendResponseSchema,
	smsHistory: SmsHistoryResponseSchema,
	smsInbound: SmsInboundResponseSchema,
	smsReceipts: SmsReceiptsResponseSchema,
	voiceSend: VoiceSendResponseSchema,
	voiceHistory: VoiceHistoryResponseSchema,
	contactListsGetAll: ContactListsGetAllResponseSchema,
	contactListsCreate: ContactListsCreateResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsList: ContactsListResponseSchema,
} as const;
