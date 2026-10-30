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
	Account,
	Archive,
	Automations,
	Contacts,
	Emails,
	Integrations,
	Lists,
	Media,
	Polls,
	Reports,
	SignupForms,
	Surveys,
	Webhooks,
} from './endpoints';
import type {
	BenchmarkEmailEndpointInputs,
	BenchmarkEmailEndpointOutputs,
} from './endpoints/types';
import {
	BenchmarkEmailEndpointInputSchemas,
	BenchmarkEmailEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BenchmarkEmailSchema } from './schema';

export type BenchmarkEmailPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBenchmarkEmailPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof benchmarkEmailEndpointsNested>;
};

export type BenchmarkEmailContext = CorsairPluginContext<
	typeof BenchmarkEmailSchema,
	BenchmarkEmailPluginOptions
>;

export type BenchmarkEmailKeyBuilderContext =
	KeyBuilderContext<BenchmarkEmailPluginOptions>;

export type BenchmarkEmailBoundEndpoints = BindEndpoints<
	typeof benchmarkEmailEndpointsNested
>;

type BenchmarkEmailEndpoint<K extends keyof BenchmarkEmailEndpointOutputs> =
	CorsairEndpoint<
		BenchmarkEmailContext,
		BenchmarkEmailEndpointInputs[K],
		BenchmarkEmailEndpointOutputs[K]
	>;

export type BenchmarkEmailEndpoints = {
	contactsAddContactToList: BenchmarkEmailEndpoint<'contactsAddContactToList'>;
	contactsCleanContactList: BenchmarkEmailEndpoint<'contactsCleanContactList'>;
	contactsCompareContacts: BenchmarkEmailEndpoint<'contactsCompareContacts'>;
	contactsCopyBulkContacts: BenchmarkEmailEndpoint<'contactsCopyBulkContacts'>;
	contactsCopyContact: BenchmarkEmailEndpoint<'contactsCopyContact'>;
	contactsCreateSegmentCriteria: BenchmarkEmailEndpoint<'contactsCreateSegmentCriteria'>;
	contactsCreateSegmentFromContactIDs: BenchmarkEmailEndpoint<'contactsCreateSegmentFromContactIDs'>;
	contactsDeleteContactFromAllListsByID: BenchmarkEmailEndpoint<'contactsDeleteContactFromAllListsByID'>;
	contactsDeleteContactFromList: BenchmarkEmailEndpoint<'contactsDeleteContactFromList'>;
	contactsDeleteContactFromSearch: BenchmarkEmailEndpoint<'contactsDeleteContactFromSearch'>;
	contactsDeleteContactsFromAllLists: BenchmarkEmailEndpoint<'contactsDeleteContactsFromAllLists'>;
	contactsDeleteContactsFromCurrentLists: BenchmarkEmailEndpoint<'contactsDeleteContactsFromCurrentLists'>;
	contactsDeleteSegment: BenchmarkEmailEndpoint<'contactsDeleteSegment'>;
	contactsDeleteSegmentCriteria: BenchmarkEmailEndpoint<'contactsDeleteSegmentCriteria'>;
	contactsDeleteTrashList: BenchmarkEmailEndpoint<'contactsDeleteTrashList'>;
	contactsGetActiveContactCount: BenchmarkEmailEndpoint<'contactsGetActiveContactCount'>;
	contactsGetContactAuditHistory: BenchmarkEmailEndpoint<'contactsGetContactAuditHistory'>;
	contactsGetContactAuditHistoryDetail: BenchmarkEmailEndpoint<'contactsGetContactAuditHistoryDetail'>;
	contactsGetContactDetails: BenchmarkEmailEndpoint<'contactsGetContactDetails'>;
	contactsGetContactImportStatus: BenchmarkEmailEndpoint<'contactsGetContactImportStatus'>;
	contactsGetContactMergeList: BenchmarkEmailEndpoint<'contactsGetContactMergeList'>;
	contactsGetContactsCount: BenchmarkEmailEndpoint<'contactsGetContactsCount'>;
	contactsGetFilteredContacts: BenchmarkEmailEndpoint<'contactsGetFilteredContacts'>;
	contactsGetFilteredContactsWithExtraFields: BenchmarkEmailEndpoint<'contactsGetFilteredContactsWithExtraFields'>;
	contactsGetNonContactCount: BenchmarkEmailEndpoint<'contactsGetNonContactCount'>;
	contactsGetSegmentAutoGenerateName: BenchmarkEmailEndpoint<'contactsGetSegmentAutoGenerateName'>;
	contactsGetSegmentDetails: BenchmarkEmailEndpoint<'contactsGetSegmentDetails'>;
	contactsGetSegmentList: BenchmarkEmailEndpoint<'contactsGetSegmentList'>;
	contactsGetSegmentByID: BenchmarkEmailEndpoint<'contactsGetSegmentByID'>;
	contactsGetSegments: BenchmarkEmailEndpoint<'contactsGetSegments'>;
	contactsGetTrashCount: BenchmarkEmailEndpoint<'contactsGetTrashCount'>;
	contactsGetDownloadSegmentData: BenchmarkEmailEndpoint<'contactsGetDownloadSegmentData'>;
	contactsGetCleanCount: BenchmarkEmailEndpoint<'contactsGetCleanCount'>;
	contactsGetUniqueContactCount: BenchmarkEmailEndpoint<'contactsGetUniqueContactCount'>;
	contactsMergeContactsIntoExistingList: BenchmarkEmailEndpoint<'contactsMergeContactsIntoExistingList'>;
	contactsMergeContactsIntoNewList: BenchmarkEmailEndpoint<'contactsMergeContactsIntoNewList'>;
	contactsMoveBulkContacts: BenchmarkEmailEndpoint<'contactsMoveBulkContacts'>;
	contactsMoveContactToDoNotContactList: BenchmarkEmailEndpoint<'contactsMoveContactToDoNotContactList'>;
	contactsMoveContacts: BenchmarkEmailEndpoint<'contactsMoveContacts'>;
	contactsResendEmails: BenchmarkEmailEndpoint<'contactsResendEmails'>;
	contactsSaveEmailAddress: BenchmarkEmailEndpoint<'contactsSaveEmailAddress'>;
	contactsSaveVerifiedEmailAddresses: BenchmarkEmailEndpoint<'contactsSaveVerifiedEmailAddresses'>;
	contactsSearchContactDetailsByEmail: BenchmarkEmailEndpoint<'contactsSearchContactDetailsByEmail'>;
	contactsSendConfirmEmailVerification: BenchmarkEmailEndpoint<'contactsSendConfirmEmailVerification'>;
	contactsUpdateContactDetails: BenchmarkEmailEndpoint<'contactsUpdateContactDetails'>;
	contactsUpdateSegment: BenchmarkEmailEndpoint<'contactsUpdateSegment'>;
	listsCreateContactList: BenchmarkEmailEndpoint<'listsCreateContactList'>;
	listsDeleteContactList: BenchmarkEmailEndpoint<'listsDeleteContactList'>;
	listsDeleteList: BenchmarkEmailEndpoint<'listsDeleteList'>;
	listsGetContactListDeepView: BenchmarkEmailEndpoint<'listsGetContactListDeepView'>;
	listsGetContactListDetails: BenchmarkEmailEndpoint<'listsGetContactListDetails'>;
	listsGetContactListFieldNames: BenchmarkEmailEndpoint<'listsGetContactListFieldNames'>;
	listsGetContactLists: BenchmarkEmailEndpoint<'listsGetContactLists'>;
	listsGetDeleteListCheck: BenchmarkEmailEndpoint<'listsGetDeleteListCheck'>;
	listsGetListUploadTerms: BenchmarkEmailEndpoint<'listsGetListUploadTerms'>;
	listsGetContactListSummary: BenchmarkEmailEndpoint<'listsGetContactListSummary'>;
	listsRestoreTrashList: BenchmarkEmailEndpoint<'listsRestoreTrashList'>;
	listsUpdateContactList: BenchmarkEmailEndpoint<'listsUpdateContactList'>;
	emailsAddEmailToCommunity: BenchmarkEmailEndpoint<'emailsAddEmailToCommunity'>;
	emailsCopyExistingEmail: BenchmarkEmailEndpoint<'emailsCopyExistingEmail'>;
	emailsDeleteABTestEmail: BenchmarkEmailEndpoint<'emailsDeleteABTestEmail'>;
	emailsDeleteABSplitCampaign: BenchmarkEmailEndpoint<'emailsDeleteABSplitCampaign'>;
	emailsDeleteEmailCampaign: BenchmarkEmailEndpoint<'emailsDeleteEmailCampaign'>;
	emailsGetABSplitDetails: BenchmarkEmailEndpoint<'emailsGetABSplitDetails'>;
	emailsGetABSplitResults: BenchmarkEmailEndpoint<'emailsGetABSplitResults'>;
	emailsGetABTests: BenchmarkEmailEndpoint<'emailsGetABTests'>;
	emailsGetCommunityCategory: BenchmarkEmailEndpoint<'emailsGetCommunityCategory'>;
	emailsGetCommunityEmailByID: BenchmarkEmailEndpoint<'emailsGetCommunityEmailByID'>;
	emailsGetEmailPreview: BenchmarkEmailEndpoint<'emailsGetEmailPreview'>;
	emailsGetEmailRecipientCount: BenchmarkEmailEndpoint<'emailsGetEmailRecipientCount'>;
	emailsGetEmailSpamCheck: BenchmarkEmailEndpoint<'emailsGetEmailSpamCheck'>;
	emailsGetEmailTemplates: BenchmarkEmailEndpoint<'emailsGetEmailTemplates'>;
	emailsGetEmails: BenchmarkEmailEndpoint<'emailsGetEmails'>;
	emailsGetEmailDetails: BenchmarkEmailEndpoint<'emailsGetEmailDetails'>;
	emailsGetTemplateCategoryList: BenchmarkEmailEndpoint<'emailsGetTemplateCategoryList'>;
	emailsGetTemplateCategoryByID: BenchmarkEmailEndpoint<'emailsGetTemplateCategoryByID'>;
	emailsGetTemplateByID: BenchmarkEmailEndpoint<'emailsGetTemplateByID'>;
	emailsInitiateEmailScreenCapture: BenchmarkEmailEndpoint<'emailsInitiateEmailScreenCapture'>;
	emailsPermanentlyDeleteEmailFromTrash: BenchmarkEmailEndpoint<'emailsPermanentlyDeleteEmailFromTrash'>;
	emailsRestoreEmailFromTrash: BenchmarkEmailEndpoint<'emailsRestoreEmailFromTrash'>;
	emailsScheduleEmailCampaign: BenchmarkEmailEndpoint<'emailsScheduleEmailCampaign'>;
	emailsUpdateEmailCampaign: BenchmarkEmailEndpoint<'emailsUpdateEmailCampaign'>;
	emailsGetBadgesList: BenchmarkEmailEndpoint<'emailsGetBadgesList'>;
	emailsGetLayoutList: BenchmarkEmailEndpoint<'emailsGetLayoutList'>;
	emailsGetScheme: BenchmarkEmailEndpoint<'emailsGetScheme'>;
	emailsAddOrUpdateScheme: BenchmarkEmailEndpoint<'emailsAddOrUpdateScheme'>;
	emailsGetRSSHistoryByEmailID: BenchmarkEmailEndpoint<'emailsGetRSSHistoryByEmailID'>;
	emailsShareTemplateToSubAccounts: BenchmarkEmailEndpoint<'emailsShareTemplateToSubAccounts'>;
	archiveAddEmailToArchive: BenchmarkEmailEndpoint<'archiveAddEmailToArchive'>;
	archiveDeleteEmailFromArchive: BenchmarkEmailEndpoint<'archiveDeleteEmailFromArchive'>;
	archiveGetArchiveDomainName: BenchmarkEmailEndpoint<'archiveGetArchiveDomainName'>;
	archiveGetArchiveEmailDetails: BenchmarkEmailEndpoint<'archiveGetArchiveEmailDetails'>;
	archiveGetArchiveEmails: BenchmarkEmailEndpoint<'archiveGetArchiveEmails'>;
	archiveGetArchiveHomeData: BenchmarkEmailEndpoint<'archiveGetArchiveHomeData'>;
	archiveGetArchiveHomePage: BenchmarkEmailEndpoint<'archiveGetArchiveHomePage'>;
	archiveGetArchivePages: BenchmarkEmailEndpoint<'archiveGetArchivePages'>;
	archiveGetDetailsAboutArchivePage: BenchmarkEmailEndpoint<'archiveGetDetailsAboutArchivePage'>;
	archiveGetHTMLForArchiveNewsletter: BenchmarkEmailEndpoint<'archiveGetHTMLForArchiveNewsletter'>;
	archiveGetHTMLForButton: BenchmarkEmailEndpoint<'archiveGetHTMLForButton'>;
	archiveGetImageForButton: BenchmarkEmailEndpoint<'archiveGetImageForButton'>;
	archiveUpdateArchiveHomePage: BenchmarkEmailEndpoint<'archiveUpdateArchiveHomePage'>;
	archiveUpdateArchiveHomePageData: BenchmarkEmailEndpoint<'archiveUpdateArchiveHomePageData'>;
	automationsAddEmailInAutomation: BenchmarkEmailEndpoint<'automationsAddEmailInAutomation'>;
	automationsCopyEmailInAutomation: BenchmarkEmailEndpoint<'automationsCopyEmailInAutomation'>;
	automationsCreateAutomationCopy: BenchmarkEmailEndpoint<'automationsCreateAutomationCopy'>;
	automationsDeleteAutomation: BenchmarkEmailEndpoint<'automationsDeleteAutomation'>;
	automationsDeleteAutomationEmail: BenchmarkEmailEndpoint<'automationsDeleteAutomationEmail'>;
	automationsGetAutomationEmailDetails: BenchmarkEmailEndpoint<'automationsGetAutomationEmailDetails'>;
	automationsGetAutomationDetails: BenchmarkEmailEndpoint<'automationsGetAutomationDetails'>;
	automationsGetAutomationSummaryReport: BenchmarkEmailEndpoint<'automationsGetAutomationSummaryReport'>;
	automationsUpdateEmailContentForAutomation: BenchmarkEmailEndpoint<'automationsUpdateEmailContentForAutomation'>;
	reportsGetABTestReport: BenchmarkEmailEndpoint<'reportsGetABTestReport'>;
	reportsGetAbuseCampaignReportByEmailID: BenchmarkEmailEndpoint<'reportsGetAbuseCampaignReportByEmailID'>;
	reportsGetAbuseReport: BenchmarkEmailEndpoint<'reportsGetAbuseReport'>;
	reportsGetBouncesReportByEmailID: BenchmarkEmailEndpoint<'reportsGetBouncesReportByEmailID'>;
	reportsGetCampaignEngagementList: BenchmarkEmailEndpoint<'reportsGetCampaignEngagementList'>;
	reportsGetCampaignHistoryByEmailID: BenchmarkEmailEndpoint<'reportsGetCampaignHistoryByEmailID'>;
	reportsGetClickContactCount: BenchmarkEmailEndpoint<'reportsGetClickContactCount'>;
	reportsGetClickHeatMapByEmailID: BenchmarkEmailEndpoint<'reportsGetClickHeatMapByEmailID'>;
	reportsGetClickPerformanceByEmailID: BenchmarkEmailEndpoint<'reportsGetClickPerformanceByEmailID'>;
	reportsGetClickPerformanceDetailsByEmail: BenchmarkEmailEndpoint<'reportsGetClickPerformanceDetailsByEmail'>;
	reportsGetClickURLContactCount: BenchmarkEmailEndpoint<'reportsGetClickURLContactCount'>;
	reportsGetClicksReportByEmailID: BenchmarkEmailEndpoint<'reportsGetClicksReportByEmailID'>;
	reportsGetContactReportHistory: BenchmarkEmailEndpoint<'reportsGetContactReportHistory'>;
	reportsGetDownloadReport: BenchmarkEmailEndpoint<'reportsGetDownloadReport'>;
	reportsDownloadContactReport: BenchmarkEmailEndpoint<'reportsDownloadContactReport'>;
	reportsGetEmailOpensByCountryRegion: BenchmarkEmailEndpoint<'reportsGetEmailOpensByCountryRegion'>;
	reportsGetEmailReport: BenchmarkEmailEndpoint<'reportsGetEmailReport'>;
	reportsGetEmailReportForwards: BenchmarkEmailEndpoint<'reportsGetEmailReportForwards'>;
	reportsGetForwardsReportByEmailID: BenchmarkEmailEndpoint<'reportsGetForwardsReportByEmailID'>;
	reportsGetLinkDetailByEmailID: BenchmarkEmailEndpoint<'reportsGetLinkDetailByEmailID'>;
	reportsGetOpenContactCount: BenchmarkEmailEndpoint<'reportsGetOpenContactCount'>;
	reportsGetOpensHourlyReportByEmail: BenchmarkEmailEndpoint<'reportsGetOpensHourlyReportByEmail'>;
	reportsGetOpensLocationReport: BenchmarkEmailEndpoint<'reportsGetOpensLocationReport'>;
	reportsGetOpensLocationReportByEmail: BenchmarkEmailEndpoint<'reportsGetOpensLocationReportByEmail'>;
	reportsGetOpensReport: BenchmarkEmailEndpoint<'reportsGetOpensReport'>;
	reportsGetReportDetailsByABTest: BenchmarkEmailEndpoint<'reportsGetReportDetailsByABTest'>;
	reportsGetReportDetailsByEmailID: BenchmarkEmailEndpoint<'reportsGetReportDetailsByEmailID'>;
	reportsGetReportDownload: BenchmarkEmailEndpoint<'reportsGetReportDownload'>;
	reportsGetReportsForAutoresponders: BenchmarkEmailEndpoint<'reportsGetReportsForAutoresponders'>;
	reportsGetSocialPerformanceReport: BenchmarkEmailEndpoint<'reportsGetSocialPerformanceReport'>;
	reportsGetURLEngagementList: BenchmarkEmailEndpoint<'reportsGetURLEngagementList'>;
	reportsGetURLListByEmailID: BenchmarkEmailEndpoint<'reportsGetURLListByEmailID'>;
	reportsGetUnopensReport: BenchmarkEmailEndpoint<'reportsGetUnopensReport'>;
	reportsGetUnopensReportByEmailID: BenchmarkEmailEndpoint<'reportsGetUnopensReportByEmailID'>;
	reportsGetUnsubscribeReportByEmailID: BenchmarkEmailEndpoint<'reportsGetUnsubscribeReportByEmailID'>;
	reportsGetSaveAsList: BenchmarkEmailEndpoint<'reportsGetSaveAsList'>;
	reportsUpdateListCompilationDetails: BenchmarkEmailEndpoint<'reportsUpdateListCompilationDetails'>;
	signupFormsCopySignupForm: BenchmarkEmailEndpoint<'signupFormsCopySignupForm'>;
	signupFormsCreateSignupForm: BenchmarkEmailEndpoint<'signupFormsCreateSignupForm'>;
	signupFormsGetHTMLSignupForm: BenchmarkEmailEndpoint<'signupFormsGetHTMLSignupForm'>;
	signupFormsGetMagentoHTMLSelected: BenchmarkEmailEndpoint<'signupFormsGetMagentoHTMLSelected'>;
	signupFormsGetMagentoHTMLDropdown: BenchmarkEmailEndpoint<'signupFormsGetMagentoHTMLDropdown'>;
	signupFormsGetSignupFormButtonCode: BenchmarkEmailEndpoint<'signupFormsGetSignupFormButtonCode'>;
	signupFormsGetSignupFormContactFields: BenchmarkEmailEndpoint<'signupFormsGetSignupFormContactFields'>;
	signupFormsGetSignupFormDetails: BenchmarkEmailEndpoint<'signupFormsGetSignupFormDetails'>;
	signupFormsGetSignupFormLink: BenchmarkEmailEndpoint<'signupFormsGetSignupFormLink'>;
	signupFormsGetSignupFormList: BenchmarkEmailEndpoint<'signupFormsGetSignupFormList'>;
	signupFormsGetSignupFormsForContactList: BenchmarkEmailEndpoint<'signupFormsGetSignupFormsForContactList'>;
	signupFormsGetSignupFormForUnbounce: BenchmarkEmailEndpoint<'signupFormsGetSignupFormForUnbounce'>;
	signupFormsGetSignupFormTumbler: BenchmarkEmailEndpoint<'signupFormsGetSignupFormTumbler'>;
	signupFormsGetSignupFormForMagento: BenchmarkEmailEndpoint<'signupFormsGetSignupFormForMagento'>;
	signupFormsGetTemplatesForSignupFormClassic: BenchmarkEmailEndpoint<'signupFormsGetTemplatesForSignupFormClassic'>;
	signupFormsGetTumblerLists: BenchmarkEmailEndpoint<'signupFormsGetTumblerLists'>;
	signupFormsSendTestEmailForSignupForm: BenchmarkEmailEndpoint<'signupFormsSendTestEmailForSignupForm'>;
	surveysDeleteSurvey: BenchmarkEmailEndpoint<'surveysDeleteSurvey'>;
	surveysGetSurveyDetails: BenchmarkEmailEndpoint<'surveysGetSurveyDetails'>;
	surveysGetSurveyTemplateList: BenchmarkEmailEndpoint<'surveysGetSurveyTemplateList'>;
	surveysGetSurveyReportList: BenchmarkEmailEndpoint<'surveysGetSurveyReportList'>;
	surveysGetSurveyFullReport: BenchmarkEmailEndpoint<'surveysGetSurveyFullReport'>;
	surveysGetSurveyIndividualResults: BenchmarkEmailEndpoint<'surveysGetSurveyIndividualResults'>;
	surveysGetSurveyIndividualQuestionResult: BenchmarkEmailEndpoint<'surveysGetSurveyIndividualQuestionResult'>;
	surveysGetSurveyReportAnswerText: BenchmarkEmailEndpoint<'surveysGetSurveyReportAnswerText'>;
	surveysGetSurveyReportAnswerComment: BenchmarkEmailEndpoint<'surveysGetSurveyReportAnswerComment'>;
	surveysGetSurveyReportAnswerOther: BenchmarkEmailEndpoint<'surveysGetSurveyReportAnswerOther'>;
	surveysGetSurveyReportDetail: BenchmarkEmailEndpoint<'surveysGetSurveyReportDetail'>;
	surveysUpdateSurveyStatus: BenchmarkEmailEndpoint<'surveysUpdateSurveyStatus'>;
	pollsCopyPoll: BenchmarkEmailEndpoint<'pollsCopyPoll'>;
	pollsCreatePoll: BenchmarkEmailEndpoint<'pollsCreatePoll'>;
	pollsDeletePoll: BenchmarkEmailEndpoint<'pollsDeletePoll'>;
	pollsGetPollDetails: BenchmarkEmailEndpoint<'pollsGetPollDetails'>;
	pollsGetPolls: BenchmarkEmailEndpoint<'pollsGetPolls'>;
	pollsGetPollPreview: BenchmarkEmailEndpoint<'pollsGetPollPreview'>;
	pollsGetPollResponseReport: BenchmarkEmailEndpoint<'pollsGetPollResponseReport'>;
	pollsUpdatePoll: BenchmarkEmailEndpoint<'pollsUpdatePoll'>;
	mediaDeleteImage: BenchmarkEmailEndpoint<'mediaDeleteImage'>;
	mediaDeleteVideo: BenchmarkEmailEndpoint<'mediaDeleteVideo'>;
	mediaGetVideoDetails: BenchmarkEmailEndpoint<'mediaGetVideoDetails'>;
	mediaGetImages: BenchmarkEmailEndpoint<'mediaGetImages'>;
	mediaGetImageDetails: BenchmarkEmailEndpoint<'mediaGetImageDetails'>;
	mediaGetGiphyImages: BenchmarkEmailEndpoint<'mediaGetGiphyImages'>;
	mediaShareVideo: BenchmarkEmailEndpoint<'mediaShareVideo'>;
	mediaUploadVideo: BenchmarkEmailEndpoint<'mediaUploadVideo'>;
	mediaCreateInbox: BenchmarkEmailEndpoint<'mediaCreateInbox'>;
	mediaDeleteInbox: BenchmarkEmailEndpoint<'mediaDeleteInbox'>;
	mediaGetInboxList: BenchmarkEmailEndpoint<'mediaGetInboxList'>;
	mediaGetInboxMasterResult: BenchmarkEmailEndpoint<'mediaGetInboxMasterResult'>;
	mediaGetInboxDetailResult: BenchmarkEmailEndpoint<'mediaGetInboxDetailResult'>;
	accountAddRemoveInboxTestsFromSubAccount: BenchmarkEmailEndpoint<'accountAddRemoveInboxTestsFromSubAccount'>;
	accountCopyImageToSubAccount: BenchmarkEmailEndpoint<'accountCopyImageToSubAccount'>;
	accountDeleteLinkedAgencyAccount: BenchmarkEmailEndpoint<'accountDeleteLinkedAgencyAccount'>;
	accountGetCommissionList: BenchmarkEmailEndpoint<'accountGetCommissionList'>;
	accountGetLinkedAgencyAccountDetails: BenchmarkEmailEndpoint<'accountGetLinkedAgencyAccountDetails'>;
	accountGetLinkedAgencyAccounts: BenchmarkEmailEndpoint<'accountGetLinkedAgencyAccounts'>;
	accountGetPartnerProfileDetails: BenchmarkEmailEndpoint<'accountGetPartnerProfileDetails'>;
	accountGetReferralsList: BenchmarkEmailEndpoint<'accountGetReferralsList'>;
	accountGetSubAccountHistory: BenchmarkEmailEndpoint<'accountGetSubAccountHistory'>;
	accountGetSubAccounts: BenchmarkEmailEndpoint<'accountGetSubAccounts'>;
	accountGetSubAccountsPlanList: BenchmarkEmailEndpoint<'accountGetSubAccountsPlanList'>;
	accountGetReferralsLevel1List: BenchmarkEmailEndpoint<'accountGetReferralsLevel1List'>;
	accountGetSubAccountBalance: BenchmarkEmailEndpoint<'accountGetSubAccountBalance'>;
	accountGetSubAccountDetails: BenchmarkEmailEndpoint<'accountGetSubAccountDetails'>;
	accountGetSubAccountHistoryDetails: BenchmarkEmailEndpoint<'accountGetSubAccountHistoryDetails'>;
	accountLinkAgencyAccount: BenchmarkEmailEndpoint<'accountLinkAgencyAccount'>;
	accountShareListsWithSubAccounts: BenchmarkEmailEndpoint<'accountShareListsWithSubAccounts'>;
	accountUpdateLinkedAgencyAccount: BenchmarkEmailEndpoint<'accountUpdateLinkedAgencyAccount'>;
	accountUpdatePartnerProfile: BenchmarkEmailEndpoint<'accountUpdatePartnerProfile'>;
	accountChangePassword: BenchmarkEmailEndpoint<'accountChangePassword'>;
	accountChangeSecurityPIN: BenchmarkEmailEndpoint<'accountChangeSecurityPIN'>;
	accountCheckIfResponsive: BenchmarkEmailEndpoint<'accountCheckIfResponsive'>;
	accountDisableSecurityPIN: BenchmarkEmailEndpoint<'accountDisableSecurityPIN'>;
	accountGetAllConfirmedEmails: BenchmarkEmailEndpoint<'accountGetAllConfirmedEmails'>;
	accountGetClientAccountSettings: BenchmarkEmailEndpoint<'accountGetClientAccountSettings'>;
	accountGetClientPlanInformation: BenchmarkEmailEndpoint<'accountGetClientPlanInformation'>;
	accountGetCurrentEmailAtTimeOfReset: BenchmarkEmailEndpoint<'accountGetCurrentEmailAtTimeOfReset'>;
	accountGetDMARCList: BenchmarkEmailEndpoint<'accountGetDMARCList'>;
	accountGetListOfConfirmedEmails: BenchmarkEmailEndpoint<'accountGetListOfConfirmedEmails'>;
	accountGetClientDetails: BenchmarkEmailEndpoint<'accountGetClientDetails'>;
	accountGetClientFilterDomain: BenchmarkEmailEndpoint<'accountGetClientFilterDomain'>;
	accountGetClientProfileDetails: BenchmarkEmailEndpoint<'accountGetClientProfileDetails'>;
	accountGetClientsRatingRange: BenchmarkEmailEndpoint<'accountGetClientsRatingRange'>;
	accountLoginRedirectUsingToken: BenchmarkEmailEndpoint<'accountLoginRedirectUsingToken'>;
	accountPatchUpdateClientSettings: BenchmarkEmailEndpoint<'accountPatchUpdateClientSettings'>;
	accountResendConfirmEmail: BenchmarkEmailEndpoint<'accountResendConfirmEmail'>;
	accountSaveSecurityPIN: BenchmarkEmailEndpoint<'accountSaveSecurityPIN'>;
	accountSaveWebsiteDomain: BenchmarkEmailEndpoint<'accountSaveWebsiteDomain'>;
	accountSendPINViaEmail: BenchmarkEmailEndpoint<'accountSendPINViaEmail'>;
	accountSendResetEmail: BenchmarkEmailEndpoint<'accountSendResetEmail'>;
	accountSetResponsive: BenchmarkEmailEndpoint<'accountSetResponsive'>;
	accountUpdateEditProfile: BenchmarkEmailEndpoint<'accountUpdateEditProfile'>;
	accountUpdateResetEmail: BenchmarkEmailEndpoint<'accountUpdateResetEmail'>;
	accountGetNotification: BenchmarkEmailEndpoint<'accountGetNotification'>;
	accountGetWebPageAdsDetail: BenchmarkEmailEndpoint<'accountGetWebPageAdsDetail'>;
	accountGetHelpTopics: BenchmarkEmailEndpoint<'accountGetHelpTopics'>;
	accountGenerateSupportTicket: BenchmarkEmailEndpoint<'accountGenerateSupportTicket'>;
	accountSendSupportFeedback: BenchmarkEmailEndpoint<'accountSendSupportFeedback'>;
	accountGetCommunityDomain: BenchmarkEmailEndpoint<'accountGetCommunityDomain'>;
	accountGetAccountSummary: BenchmarkEmailEndpoint<'accountGetAccountSummary'>;
	integrationsAssignProductToList: BenchmarkEmailEndpoint<'integrationsAssignProductToList'>;
	integrationsConfigureShopifyPurchaseList: BenchmarkEmailEndpoint<'integrationsConfigureShopifyPurchaseList'>;
	integrationsConnectService: BenchmarkEmailEndpoint<'integrationsConnectService'>;
	integrationsDeleteProductAssociation: BenchmarkEmailEndpoint<'integrationsDeleteProductAssociation'>;
	integrationsDisconnectEtsyIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectEtsyIntegration'>;
	integrationsDisconnectEventbriteIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectEventbriteIntegration'>;
	integrationsDisconnectFacebookEvents: BenchmarkEmailEndpoint<'integrationsDisconnectFacebookEvents'>;
	integrationsDisconnectFacebookIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectFacebookIntegration'>;
	integrationsDisconnectInstagramIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectInstagramIntegration'>;
	integrationsDisconnectLinkedInIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectLinkedInIntegration'>;
	integrationsDisconnectPinterestConnection: BenchmarkEmailEndpoint<'integrationsDisconnectPinterestConnection'>;
	integrationsDisconnectSalesforceIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectSalesforceIntegration'>;
	integrationsDisconnectShopify: BenchmarkEmailEndpoint<'integrationsDisconnectShopify'>;
	integrationsDisconnectTwitterIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectTwitterIntegration'>;
	integrationsDisconnectEbayIntegration: BenchmarkEmailEndpoint<'integrationsDisconnectEbayIntegration'>;
	integrationsLogOutTwitterTweets: BenchmarkEmailEndpoint<'integrationsLogOutTwitterTweets'>;
	integrationsGetContactListsForShopify: BenchmarkEmailEndpoint<'integrationsGetContactListsForShopify'>;
	integrationsGetDigiohUsername: BenchmarkEmailEndpoint<'integrationsGetDigiohUsername'>;
	integrationsGetEtsyStoreName: BenchmarkEmailEndpoint<'integrationsGetEtsyStoreName'>;
	integrationsGetEventbriteUsername: BenchmarkEmailEndpoint<'integrationsGetEventbriteUsername'>;
	integrationsGetFacebookAccountHolder: BenchmarkEmailEndpoint<'integrationsGetFacebookAccountHolder'>;
	integrationsGetFacebookAccountName: BenchmarkEmailEndpoint<'integrationsGetFacebookAccountName'>;
	integrationsGetIntegrationAuthURL: BenchmarkEmailEndpoint<'integrationsGetIntegrationAuthURL'>;
	integrationsGetIntegrationConnectionList: BenchmarkEmailEndpoint<'integrationsGetIntegrationConnectionList'>;
	integrationsGetLinkedInToken: BenchmarkEmailEndpoint<'integrationsGetLinkedInToken'>;
	integrationsGetShopifyProducts: BenchmarkEmailEndpoint<'integrationsGetShopifyProducts'>;
	integrationsGetPaypalLists: BenchmarkEmailEndpoint<'integrationsGetPaypalLists'>;
	integrationsGetPaypalLink: BenchmarkEmailEndpoint<'integrationsGetPaypalLink'>;
	integrationsGetPinterestUsername: BenchmarkEmailEndpoint<'integrationsGetPinterestUsername'>;
	integrationsGetSalesforceStatus: BenchmarkEmailEndpoint<'integrationsGetSalesforceStatus'>;
	integrationsGetShopifyProductGrid: BenchmarkEmailEndpoint<'integrationsGetShopifyProductGrid'>;
	integrationsGetTwitterLogin: BenchmarkEmailEndpoint<'integrationsGetTwitterLogin'>;
	integrationsGetUnbounceLink: BenchmarkEmailEndpoint<'integrationsGetUnbounceLink'>;
	integrationsGetUnbounceLists: BenchmarkEmailEndpoint<'integrationsGetUnbounceLists'>;
	integrationsGetEbaySellerID: BenchmarkEmailEndpoint<'integrationsGetEbaySellerID'>;
	integrationsGetEbaySiteList: BenchmarkEmailEndpoint<'integrationsGetEbaySiteList'>;
	integrationsTestEtsyIntegration: BenchmarkEmailEndpoint<'integrationsTestEtsyIntegration'>;
	integrationsTestEventbriteIntegration: BenchmarkEmailEndpoint<'integrationsTestEventbriteIntegration'>;
	integrationsTestFacebookEventsIntegration: BenchmarkEmailEndpoint<'integrationsTestFacebookEventsIntegration'>;
	integrationsTestFacebookIntegration: BenchmarkEmailEndpoint<'integrationsTestFacebookIntegration'>;
	integrationsTestLinkedInConnection: BenchmarkEmailEndpoint<'integrationsTestLinkedInConnection'>;
	integrationsTestPinterestIntegration: BenchmarkEmailEndpoint<'integrationsTestPinterestIntegration'>;
	integrationsTestSalesforceIntegration: BenchmarkEmailEndpoint<'integrationsTestSalesforceIntegration'>;
	integrationsTestTwitterIntegration: BenchmarkEmailEndpoint<'integrationsTestTwitterIntegration'>;
	integrationsTestTwitterTweets: BenchmarkEmailEndpoint<'integrationsTestTwitterTweets'>;
	integrationsTestEbayIntegration: BenchmarkEmailEndpoint<'integrationsTestEbayIntegration'>;
	webhooksCreateWebhook: BenchmarkEmailEndpoint<'webhooksCreateWebhook'>;
	webhooksGetWebhooks: BenchmarkEmailEndpoint<'webhooksGetWebhooks'>;
	webhooksDeleteWebhook: BenchmarkEmailEndpoint<'webhooksDeleteWebhook'>;
	webhooksUpdateWebhook: BenchmarkEmailEndpoint<'webhooksUpdateWebhook'>;
};

const benchmarkEmailEndpointsNested = {
	contacts: {
		addContactToList: Contacts.addContactToList,
		cleanContactList: Contacts.cleanContactList,
		compareContacts: Contacts.compareContacts,
		copyBulkContacts: Contacts.copyBulkContacts,
		copyContact: Contacts.copyContact,
		createSegmentCriteria: Contacts.createSegmentCriteria,
		createSegmentFromContactIDs: Contacts.createSegmentFromContactIDs,
		deleteContactFromAllListsByID: Contacts.deleteContactFromAllListsByID,
		deleteContactFromList: Contacts.deleteContactFromList,
		deleteContactFromSearch: Contacts.deleteContactFromSearch,
		deleteContactsFromAllLists: Contacts.deleteContactsFromAllLists,
		deleteContactsFromCurrentLists: Contacts.deleteContactsFromCurrentLists,
		deleteSegment: Contacts.deleteSegment,
		deleteSegmentCriteria: Contacts.deleteSegmentCriteria,
		deleteTrashList: Contacts.deleteTrashList,
		getActiveContactCount: Contacts.getActiveContactCount,
		getContactAuditHistory: Contacts.getContactAuditHistory,
		getContactAuditHistoryDetail: Contacts.getContactAuditHistoryDetail,
		getContactDetails: Contacts.getContactDetails,
		getContactImportStatus: Contacts.getContactImportStatus,
		getContactMergeList: Contacts.getContactMergeList,
		getContactsCount: Contacts.getContactsCount,
		getFilteredContacts: Contacts.getFilteredContacts,
		getFilteredContactsWithExtraFields:
			Contacts.getFilteredContactsWithExtraFields,
		getNonContactCount: Contacts.getNonContactCount,
		getSegmentAutoGenerateName: Contacts.getSegmentAutoGenerateName,
		getSegmentDetails: Contacts.getSegmentDetails,
		getSegmentList: Contacts.getSegmentList,
		getSegmentByID: Contacts.getSegmentByID,
		getSegments: Contacts.getSegments,
		getTrashCount: Contacts.getTrashCount,
		getDownloadSegmentData: Contacts.getDownloadSegmentData,
		getCleanCount: Contacts.getCleanCount,
		getUniqueContactCount: Contacts.getUniqueContactCount,
		mergeContactsIntoExistingList: Contacts.mergeContactsIntoExistingList,
		mergeContactsIntoNewList: Contacts.mergeContactsIntoNewList,
		moveBulkContacts: Contacts.moveBulkContacts,
		moveContactToDoNotContactList: Contacts.moveContactToDoNotContactList,
		moveContacts: Contacts.moveContacts,
		resendEmails: Contacts.resendEmails,
		saveEmailAddress: Contacts.saveEmailAddress,
		saveVerifiedEmailAddresses: Contacts.saveVerifiedEmailAddresses,
		searchContactDetailsByEmail: Contacts.searchContactDetailsByEmail,
		sendConfirmEmailVerification: Contacts.sendConfirmEmailVerification,
		updateContactDetails: Contacts.updateContactDetails,
		updateSegment: Contacts.updateSegment,
	},
	lists: {
		createContactList: Lists.createContactList,
		deleteContactList: Lists.deleteContactList,
		deleteList: Lists.deleteList,
		getContactListDeepView: Lists.getContactListDeepView,
		getContactListDetails: Lists.getContactListDetails,
		getContactListFieldNames: Lists.getContactListFieldNames,
		getContactLists: Lists.getContactLists,
		getDeleteListCheck: Lists.getDeleteListCheck,
		getListUploadTerms: Lists.getListUploadTerms,
		getContactListSummary: Lists.getContactListSummary,
		restoreTrashList: Lists.restoreTrashList,
		updateContactList: Lists.updateContactList,
	},
	emails: {
		addEmailToCommunity: Emails.addEmailToCommunity,
		copyExistingEmail: Emails.copyExistingEmail,
		deleteABTestEmail: Emails.deleteABTestEmail,
		deleteABSplitCampaign: Emails.deleteABSplitCampaign,
		deleteEmailCampaign: Emails.deleteEmailCampaign,
		getABSplitDetails: Emails.getABSplitDetails,
		getABSplitResults: Emails.getABSplitResults,
		getABTests: Emails.getABTests,
		getCommunityCategory: Emails.getCommunityCategory,
		getCommunityEmailByID: Emails.getCommunityEmailByID,
		getEmailPreview: Emails.getEmailPreview,
		getEmailRecipientCount: Emails.getEmailRecipientCount,
		getEmailSpamCheck: Emails.getEmailSpamCheck,
		getEmailTemplates: Emails.getEmailTemplates,
		getEmails: Emails.getEmails,
		getEmailDetails: Emails.getEmailDetails,
		getTemplateCategoryList: Emails.getTemplateCategoryList,
		getTemplateCategoryByID: Emails.getTemplateCategoryByID,
		getTemplateByID: Emails.getTemplateByID,
		initiateEmailScreenCapture: Emails.initiateEmailScreenCapture,
		permanentlyDeleteEmailFromTrash: Emails.permanentlyDeleteEmailFromTrash,
		restoreEmailFromTrash: Emails.restoreEmailFromTrash,
		scheduleEmailCampaign: Emails.scheduleEmailCampaign,
		updateEmailCampaign: Emails.updateEmailCampaign,
		getBadgesList: Emails.getBadgesList,
		getLayoutList: Emails.getLayoutList,
		getScheme: Emails.getScheme,
		addOrUpdateScheme: Emails.addOrUpdateScheme,
		getRSSHistoryByEmailID: Emails.getRSSHistoryByEmailID,
		shareTemplateToSubAccounts: Emails.shareTemplateToSubAccounts,
	},
	archive: {
		addEmailToArchive: Archive.addEmailToArchive,
		deleteEmailFromArchive: Archive.deleteEmailFromArchive,
		getArchiveDomainName: Archive.getArchiveDomainName,
		getArchiveEmailDetails: Archive.getArchiveEmailDetails,
		getArchiveEmails: Archive.getArchiveEmails,
		getArchiveHomeData: Archive.getArchiveHomeData,
		getArchiveHomePage: Archive.getArchiveHomePage,
		getArchivePages: Archive.getArchivePages,
		getDetailsAboutArchivePage: Archive.getDetailsAboutArchivePage,
		getHTMLForArchiveNewsletter: Archive.getHTMLForArchiveNewsletter,
		getHTMLForButton: Archive.getHTMLForButton,
		getImageForButton: Archive.getImageForButton,
		updateArchiveHomePage: Archive.updateArchiveHomePage,
		updateArchiveHomePageData: Archive.updateArchiveHomePageData,
	},
	automations: {
		addEmailInAutomation: Automations.addEmailInAutomation,
		copyEmailInAutomation: Automations.copyEmailInAutomation,
		createAutomationCopy: Automations.createAutomationCopy,
		deleteAutomation: Automations.deleteAutomation,
		deleteAutomationEmail: Automations.deleteAutomationEmail,
		getAutomationEmailDetails: Automations.getAutomationEmailDetails,
		getAutomationDetails: Automations.getAutomationDetails,
		getAutomationSummaryReport: Automations.getAutomationSummaryReport,
		updateEmailContentForAutomation:
			Automations.updateEmailContentForAutomation,
	},
	reports: {
		getABTestReport: Reports.getABTestReport,
		getAbuseCampaignReportByEmailID: Reports.getAbuseCampaignReportByEmailID,
		getAbuseReport: Reports.getAbuseReport,
		getBouncesReportByEmailID: Reports.getBouncesReportByEmailID,
		getCampaignEngagementList: Reports.getCampaignEngagementList,
		getCampaignHistoryByEmailID: Reports.getCampaignHistoryByEmailID,
		getClickContactCount: Reports.getClickContactCount,
		getClickHeatMapByEmailID: Reports.getClickHeatMapByEmailID,
		getClickPerformanceByEmailID: Reports.getClickPerformanceByEmailID,
		getClickPerformanceDetailsByEmail:
			Reports.getClickPerformanceDetailsByEmail,
		getClickURLContactCount: Reports.getClickURLContactCount,
		getClicksReportByEmailID: Reports.getClicksReportByEmailID,
		getContactReportHistory: Reports.getContactReportHistory,
		getDownloadReport: Reports.getDownloadReport,
		downloadContactReport: Reports.downloadContactReport,
		getEmailOpensByCountryRegion: Reports.getEmailOpensByCountryRegion,
		getEmailReport: Reports.getEmailReport,
		getEmailReportForwards: Reports.getEmailReportForwards,
		getForwardsReportByEmailID: Reports.getForwardsReportByEmailID,
		getLinkDetailByEmailID: Reports.getLinkDetailByEmailID,
		getOpenContactCount: Reports.getOpenContactCount,
		getOpensHourlyReportByEmail: Reports.getOpensHourlyReportByEmail,
		getOpensLocationReport: Reports.getOpensLocationReport,
		getOpensLocationReportByEmail: Reports.getOpensLocationReportByEmail,
		getOpensReport: Reports.getOpensReport,
		getReportDetailsByABTest: Reports.getReportDetailsByABTest,
		getReportDetailsByEmailID: Reports.getReportDetailsByEmailID,
		getReportDownload: Reports.getReportDownload,
		getReportsForAutoresponders: Reports.getReportsForAutoresponders,
		getSocialPerformanceReport: Reports.getSocialPerformanceReport,
		getURLEngagementList: Reports.getURLEngagementList,
		getURLListByEmailID: Reports.getURLListByEmailID,
		getUnopensReport: Reports.getUnopensReport,
		getUnopensReportByEmailID: Reports.getUnopensReportByEmailID,
		getUnsubscribeReportByEmailID: Reports.getUnsubscribeReportByEmailID,
		getSaveAsList: Reports.getSaveAsList,
		updateListCompilationDetails: Reports.updateListCompilationDetails,
	},
	signupForms: {
		copySignupForm: SignupForms.copySignupForm,
		createSignupForm: SignupForms.createSignupForm,
		getHTMLSignupForm: SignupForms.getHTMLSignupForm,
		getMagentoHTMLSelected: SignupForms.getMagentoHTMLSelected,
		getMagentoHTMLDropdown: SignupForms.getMagentoHTMLDropdown,
		getSignupFormButtonCode: SignupForms.getSignupFormButtonCode,
		getSignupFormContactFields: SignupForms.getSignupFormContactFields,
		getSignupFormDetails: SignupForms.getSignupFormDetails,
		getSignupFormLink: SignupForms.getSignupFormLink,
		getSignupFormList: SignupForms.getSignupFormList,
		getSignupFormsForContactList: SignupForms.getSignupFormsForContactList,
		getSignupFormForUnbounce: SignupForms.getSignupFormForUnbounce,
		getSignupFormTumbler: SignupForms.getSignupFormTumbler,
		getSignupFormForMagento: SignupForms.getSignupFormForMagento,
		getTemplatesForSignupFormClassic:
			SignupForms.getTemplatesForSignupFormClassic,
		getTumblerLists: SignupForms.getTumblerLists,
		sendTestEmailForSignupForm: SignupForms.sendTestEmailForSignupForm,
	},
	surveys: {
		deleteSurvey: Surveys.deleteSurvey,
		getSurveyDetails: Surveys.getSurveyDetails,
		getSurveyTemplateList: Surveys.getSurveyTemplateList,
		getSurveyReportList: Surveys.getSurveyReportList,
		getSurveyFullReport: Surveys.getSurveyFullReport,
		getSurveyIndividualResults: Surveys.getSurveyIndividualResults,
		getSurveyIndividualQuestionResult:
			Surveys.getSurveyIndividualQuestionResult,
		getSurveyReportAnswerText: Surveys.getSurveyReportAnswerText,
		getSurveyReportAnswerComment: Surveys.getSurveyReportAnswerComment,
		getSurveyReportAnswerOther: Surveys.getSurveyReportAnswerOther,
		getSurveyReportDetail: Surveys.getSurveyReportDetail,
		updateSurveyStatus: Surveys.updateSurveyStatus,
	},
	polls: {
		copyPoll: Polls.copyPoll,
		createPoll: Polls.createPoll,
		deletePoll: Polls.deletePoll,
		getPollDetails: Polls.getPollDetails,
		getPolls: Polls.getPolls,
		getPollPreview: Polls.getPollPreview,
		getPollResponseReport: Polls.getPollResponseReport,
		updatePoll: Polls.updatePoll,
	},
	media: {
		deleteImage: Media.deleteImage,
		deleteVideo: Media.deleteVideo,
		getVideoDetails: Media.getVideoDetails,
		getImages: Media.getImages,
		getImageDetails: Media.getImageDetails,
		getGiphyImages: Media.getGiphyImages,
		shareVideo: Media.shareVideo,
		uploadVideo: Media.uploadVideo,
		createInbox: Media.createInbox,
		deleteInbox: Media.deleteInbox,
		getInboxList: Media.getInboxList,
		getInboxMasterResult: Media.getInboxMasterResult,
		getInboxDetailResult: Media.getInboxDetailResult,
	},
	account: {
		addRemoveInboxTestsFromSubAccount:
			Account.addRemoveInboxTestsFromSubAccount,
		copyImageToSubAccount: Account.copyImageToSubAccount,
		deleteLinkedAgencyAccount: Account.deleteLinkedAgencyAccount,
		getCommissionList: Account.getCommissionList,
		getLinkedAgencyAccountDetails: Account.getLinkedAgencyAccountDetails,
		getLinkedAgencyAccounts: Account.getLinkedAgencyAccounts,
		getPartnerProfileDetails: Account.getPartnerProfileDetails,
		getReferralsList: Account.getReferralsList,
		getSubAccountHistory: Account.getSubAccountHistory,
		getSubAccounts: Account.getSubAccounts,
		getSubAccountsPlanList: Account.getSubAccountsPlanList,
		getReferralsLevel1List: Account.getReferralsLevel1List,
		getSubAccountBalance: Account.getSubAccountBalance,
		getSubAccountDetails: Account.getSubAccountDetails,
		getSubAccountHistoryDetails: Account.getSubAccountHistoryDetails,
		linkAgencyAccount: Account.linkAgencyAccount,
		shareListsWithSubAccounts: Account.shareListsWithSubAccounts,
		updateLinkedAgencyAccount: Account.updateLinkedAgencyAccount,
		updatePartnerProfile: Account.updatePartnerProfile,
		changePassword: Account.changePassword,
		changeSecurityPIN: Account.changeSecurityPIN,
		checkIfResponsive: Account.checkIfResponsive,
		disableSecurityPIN: Account.disableSecurityPIN,
		getAllConfirmedEmails: Account.getAllConfirmedEmails,
		getClientAccountSettings: Account.getClientAccountSettings,
		getClientPlanInformation: Account.getClientPlanInformation,
		getCurrentEmailAtTimeOfReset: Account.getCurrentEmailAtTimeOfReset,
		getDMARCList: Account.getDMARCList,
		getListOfConfirmedEmails: Account.getListOfConfirmedEmails,
		getClientDetails: Account.getClientDetails,
		getClientFilterDomain: Account.getClientFilterDomain,
		getClientProfileDetails: Account.getClientProfileDetails,
		getClientsRatingRange: Account.getClientsRatingRange,
		loginRedirectUsingToken: Account.loginRedirectUsingToken,
		patchUpdateClientSettings: Account.patchUpdateClientSettings,
		resendConfirmEmail: Account.resendConfirmEmail,
		saveSecurityPIN: Account.saveSecurityPIN,
		saveWebsiteDomain: Account.saveWebsiteDomain,
		sendPINViaEmail: Account.sendPINViaEmail,
		sendResetEmail: Account.sendResetEmail,
		setResponsive: Account.setResponsive,
		updateEditProfile: Account.updateEditProfile,
		updateResetEmail: Account.updateResetEmail,
		getNotification: Account.getNotification,
		getWebPageAdsDetail: Account.getWebPageAdsDetail,
		getHelpTopics: Account.getHelpTopics,
		generateSupportTicket: Account.generateSupportTicket,
		sendSupportFeedback: Account.sendSupportFeedback,
		getCommunityDomain: Account.getCommunityDomain,
		getAccountSummary: Account.getAccountSummary,
	},
	integrations: {
		assignProductToList: Integrations.assignProductToList,
		configureShopifyPurchaseList: Integrations.configureShopifyPurchaseList,
		connectService: Integrations.connectService,
		deleteProductAssociation: Integrations.deleteProductAssociation,
		disconnectEtsyIntegration: Integrations.disconnectEtsyIntegration,
		disconnectEventbriteIntegration:
			Integrations.disconnectEventbriteIntegration,
		disconnectFacebookEvents: Integrations.disconnectFacebookEvents,
		disconnectFacebookIntegration: Integrations.disconnectFacebookIntegration,
		disconnectInstagramIntegration: Integrations.disconnectInstagramIntegration,
		disconnectLinkedInIntegration: Integrations.disconnectLinkedInIntegration,
		disconnectPinterestConnection: Integrations.disconnectPinterestConnection,
		disconnectSalesforceIntegration:
			Integrations.disconnectSalesforceIntegration,
		disconnectShopify: Integrations.disconnectShopify,
		disconnectTwitterIntegration: Integrations.disconnectTwitterIntegration,
		disconnectEbayIntegration: Integrations.disconnectEbayIntegration,
		logOutTwitterTweets: Integrations.logOutTwitterTweets,
		getContactListsForShopify: Integrations.getContactListsForShopify,
		getDigiohUsername: Integrations.getDigiohUsername,
		getEtsyStoreName: Integrations.getEtsyStoreName,
		getEventbriteUsername: Integrations.getEventbriteUsername,
		getFacebookAccountHolder: Integrations.getFacebookAccountHolder,
		getFacebookAccountName: Integrations.getFacebookAccountName,
		getIntegrationAuthURL: Integrations.getIntegrationAuthURL,
		getIntegrationConnectionList: Integrations.getIntegrationConnectionList,
		getLinkedInToken: Integrations.getLinkedInToken,
		getShopifyProducts: Integrations.getShopifyProducts,
		getPaypalLists: Integrations.getPaypalLists,
		getPaypalLink: Integrations.getPaypalLink,
		getPinterestUsername: Integrations.getPinterestUsername,
		getSalesforceStatus: Integrations.getSalesforceStatus,
		getShopifyProductGrid: Integrations.getShopifyProductGrid,
		getTwitterLogin: Integrations.getTwitterLogin,
		getUnbounceLink: Integrations.getUnbounceLink,
		getUnbounceLists: Integrations.getUnbounceLists,
		getEbaySellerID: Integrations.getEbaySellerID,
		getEbaySiteList: Integrations.getEbaySiteList,
		testEtsyIntegration: Integrations.testEtsyIntegration,
		testEventbriteIntegration: Integrations.testEventbriteIntegration,
		testFacebookEventsIntegration: Integrations.testFacebookEventsIntegration,
		testFacebookIntegration: Integrations.testFacebookIntegration,
		testLinkedInConnection: Integrations.testLinkedInConnection,
		testPinterestIntegration: Integrations.testPinterestIntegration,
		testSalesforceIntegration: Integrations.testSalesforceIntegration,
		testTwitterIntegration: Integrations.testTwitterIntegration,
		testTwitterTweets: Integrations.testTwitterTweets,
		testEbayIntegration: Integrations.testEbayIntegration,
	},
	webhooks: {
		createWebhook: Webhooks.createWebhook,
		getWebhooks: Webhooks.getWebhooks,
		deleteWebhook: Webhooks.deleteWebhook,
		updateWebhook: Webhooks.updateWebhook,
	},
} as const;

export const benchmarkEmailEndpointSchemas = {
	'contacts.addContactToList': {
		input: BenchmarkEmailEndpointInputSchemas.contactsAddContactToList,
		output: BenchmarkEmailEndpointOutputSchemas.contactsAddContactToList,
	},
	'contacts.cleanContactList': {
		input: BenchmarkEmailEndpointInputSchemas.contactsCleanContactList,
		output: BenchmarkEmailEndpointOutputSchemas.contactsCleanContactList,
	},
	'contacts.compareContacts': {
		input: BenchmarkEmailEndpointInputSchemas.contactsCompareContacts,
		output: BenchmarkEmailEndpointOutputSchemas.contactsCompareContacts,
	},
	'contacts.copyBulkContacts': {
		input: BenchmarkEmailEndpointInputSchemas.contactsCopyBulkContacts,
		output: BenchmarkEmailEndpointOutputSchemas.contactsCopyBulkContacts,
	},
	'contacts.copyContact': {
		input: BenchmarkEmailEndpointInputSchemas.contactsCopyContact,
		output: BenchmarkEmailEndpointOutputSchemas.contactsCopyContact,
	},
	'contacts.createSegmentCriteria': {
		input: BenchmarkEmailEndpointInputSchemas.contactsCreateSegmentCriteria,
		output: BenchmarkEmailEndpointOutputSchemas.contactsCreateSegmentCriteria,
	},
	'contacts.createSegmentFromContactIDs': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsCreateSegmentFromContactIDs,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsCreateSegmentFromContactIDs,
	},
	'contacts.deleteContactFromAllListsByID': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsDeleteContactFromAllListsByID,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsDeleteContactFromAllListsByID,
	},
	'contacts.deleteContactFromList': {
		input: BenchmarkEmailEndpointInputSchemas.contactsDeleteContactFromList,
		output: BenchmarkEmailEndpointOutputSchemas.contactsDeleteContactFromList,
	},
	'contacts.deleteContactFromSearch': {
		input: BenchmarkEmailEndpointInputSchemas.contactsDeleteContactFromSearch,
		output: BenchmarkEmailEndpointOutputSchemas.contactsDeleteContactFromSearch,
	},
	'contacts.deleteContactsFromAllLists': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsDeleteContactsFromAllLists,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsDeleteContactsFromAllLists,
	},
	'contacts.deleteContactsFromCurrentLists': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsDeleteContactsFromCurrentLists,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsDeleteContactsFromCurrentLists,
	},
	'contacts.deleteSegment': {
		input: BenchmarkEmailEndpointInputSchemas.contactsDeleteSegment,
		output: BenchmarkEmailEndpointOutputSchemas.contactsDeleteSegment,
	},
	'contacts.deleteSegmentCriteria': {
		input: BenchmarkEmailEndpointInputSchemas.contactsDeleteSegmentCriteria,
		output: BenchmarkEmailEndpointOutputSchemas.contactsDeleteSegmentCriteria,
	},
	'contacts.deleteTrashList': {
		input: BenchmarkEmailEndpointInputSchemas.contactsDeleteTrashList,
		output: BenchmarkEmailEndpointOutputSchemas.contactsDeleteTrashList,
	},
	'contacts.getActiveContactCount': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetActiveContactCount,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetActiveContactCount,
	},
	'contacts.getContactAuditHistory': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetContactAuditHistory,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetContactAuditHistory,
	},
	'contacts.getContactAuditHistoryDetail': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsGetContactAuditHistoryDetail,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsGetContactAuditHistoryDetail,
	},
	'contacts.getContactDetails': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetContactDetails,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetContactDetails,
	},
	'contacts.getContactImportStatus': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetContactImportStatus,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetContactImportStatus,
	},
	'contacts.getContactMergeList': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetContactMergeList,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetContactMergeList,
	},
	'contacts.getContactsCount': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetContactsCount,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetContactsCount,
	},
	'contacts.getFilteredContacts': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetFilteredContacts,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetFilteredContacts,
	},
	'contacts.getFilteredContactsWithExtraFields': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsGetFilteredContactsWithExtraFields,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsGetFilteredContactsWithExtraFields,
	},
	'contacts.getNonContactCount': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetNonContactCount,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetNonContactCount,
	},
	'contacts.getSegmentAutoGenerateName': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsGetSegmentAutoGenerateName,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsGetSegmentAutoGenerateName,
	},
	'contacts.getSegmentDetails': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetSegmentDetails,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetSegmentDetails,
	},
	'contacts.getSegmentList': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetSegmentList,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetSegmentList,
	},
	'contacts.getSegmentByID': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetSegmentByID,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetSegmentByID,
	},
	'contacts.getSegments': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetSegments,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetSegments,
	},
	'contacts.getTrashCount': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetTrashCount,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetTrashCount,
	},
	'contacts.getDownloadSegmentData': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetDownloadSegmentData,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetDownloadSegmentData,
	},
	'contacts.getCleanCount': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetCleanCount,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetCleanCount,
	},
	'contacts.getUniqueContactCount': {
		input: BenchmarkEmailEndpointInputSchemas.contactsGetUniqueContactCount,
		output: BenchmarkEmailEndpointOutputSchemas.contactsGetUniqueContactCount,
	},
	'contacts.mergeContactsIntoExistingList': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsMergeContactsIntoExistingList,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsMergeContactsIntoExistingList,
	},
	'contacts.mergeContactsIntoNewList': {
		input: BenchmarkEmailEndpointInputSchemas.contactsMergeContactsIntoNewList,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsMergeContactsIntoNewList,
	},
	'contacts.moveBulkContacts': {
		input: BenchmarkEmailEndpointInputSchemas.contactsMoveBulkContacts,
		output: BenchmarkEmailEndpointOutputSchemas.contactsMoveBulkContacts,
	},
	'contacts.moveContactToDoNotContactList': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsMoveContactToDoNotContactList,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsMoveContactToDoNotContactList,
	},
	'contacts.moveContacts': {
		input: BenchmarkEmailEndpointInputSchemas.contactsMoveContacts,
		output: BenchmarkEmailEndpointOutputSchemas.contactsMoveContacts,
	},
	'contacts.resendEmails': {
		input: BenchmarkEmailEndpointInputSchemas.contactsResendEmails,
		output: BenchmarkEmailEndpointOutputSchemas.contactsResendEmails,
	},
	'contacts.saveEmailAddress': {
		input: BenchmarkEmailEndpointInputSchemas.contactsSaveEmailAddress,
		output: BenchmarkEmailEndpointOutputSchemas.contactsSaveEmailAddress,
	},
	'contacts.saveVerifiedEmailAddresses': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsSaveVerifiedEmailAddresses,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsSaveVerifiedEmailAddresses,
	},
	'contacts.searchContactDetailsByEmail': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsSearchContactDetailsByEmail,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsSearchContactDetailsByEmail,
	},
	'contacts.sendConfirmEmailVerification': {
		input:
			BenchmarkEmailEndpointInputSchemas.contactsSendConfirmEmailVerification,
		output:
			BenchmarkEmailEndpointOutputSchemas.contactsSendConfirmEmailVerification,
	},
	'contacts.updateContactDetails': {
		input: BenchmarkEmailEndpointInputSchemas.contactsUpdateContactDetails,
		output: BenchmarkEmailEndpointOutputSchemas.contactsUpdateContactDetails,
	},
	'contacts.updateSegment': {
		input: BenchmarkEmailEndpointInputSchemas.contactsUpdateSegment,
		output: BenchmarkEmailEndpointOutputSchemas.contactsUpdateSegment,
	},
	'lists.createContactList': {
		input: BenchmarkEmailEndpointInputSchemas.listsCreateContactList,
		output: BenchmarkEmailEndpointOutputSchemas.listsCreateContactList,
	},
	'lists.deleteContactList': {
		input: BenchmarkEmailEndpointInputSchemas.listsDeleteContactList,
		output: BenchmarkEmailEndpointOutputSchemas.listsDeleteContactList,
	},
	'lists.deleteList': {
		input: BenchmarkEmailEndpointInputSchemas.listsDeleteList,
		output: BenchmarkEmailEndpointOutputSchemas.listsDeleteList,
	},
	'lists.getContactListDeepView': {
		input: BenchmarkEmailEndpointInputSchemas.listsGetContactListDeepView,
		output: BenchmarkEmailEndpointOutputSchemas.listsGetContactListDeepView,
	},
	'lists.getContactListDetails': {
		input: BenchmarkEmailEndpointInputSchemas.listsGetContactListDetails,
		output: BenchmarkEmailEndpointOutputSchemas.listsGetContactListDetails,
	},
	'lists.getContactListFieldNames': {
		input: BenchmarkEmailEndpointInputSchemas.listsGetContactListFieldNames,
		output: BenchmarkEmailEndpointOutputSchemas.listsGetContactListFieldNames,
	},
	'lists.getContactLists': {
		input: BenchmarkEmailEndpointInputSchemas.listsGetContactLists,
		output: BenchmarkEmailEndpointOutputSchemas.listsGetContactLists,
	},
	'lists.getDeleteListCheck': {
		input: BenchmarkEmailEndpointInputSchemas.listsGetDeleteListCheck,
		output: BenchmarkEmailEndpointOutputSchemas.listsGetDeleteListCheck,
	},
	'lists.getListUploadTerms': {
		input: BenchmarkEmailEndpointInputSchemas.listsGetListUploadTerms,
		output: BenchmarkEmailEndpointOutputSchemas.listsGetListUploadTerms,
	},
	'lists.getContactListSummary': {
		input: BenchmarkEmailEndpointInputSchemas.listsGetContactListSummary,
		output: BenchmarkEmailEndpointOutputSchemas.listsGetContactListSummary,
	},
	'lists.restoreTrashList': {
		input: BenchmarkEmailEndpointInputSchemas.listsRestoreTrashList,
		output: BenchmarkEmailEndpointOutputSchemas.listsRestoreTrashList,
	},
	'lists.updateContactList': {
		input: BenchmarkEmailEndpointInputSchemas.listsUpdateContactList,
		output: BenchmarkEmailEndpointOutputSchemas.listsUpdateContactList,
	},
	'emails.addEmailToCommunity': {
		input: BenchmarkEmailEndpointInputSchemas.emailsAddEmailToCommunity,
		output: BenchmarkEmailEndpointOutputSchemas.emailsAddEmailToCommunity,
	},
	'emails.copyExistingEmail': {
		input: BenchmarkEmailEndpointInputSchemas.emailsCopyExistingEmail,
		output: BenchmarkEmailEndpointOutputSchemas.emailsCopyExistingEmail,
	},
	'emails.deleteABTestEmail': {
		input: BenchmarkEmailEndpointInputSchemas.emailsDeleteABTestEmail,
		output: BenchmarkEmailEndpointOutputSchemas.emailsDeleteABTestEmail,
	},
	'emails.deleteABSplitCampaign': {
		input: BenchmarkEmailEndpointInputSchemas.emailsDeleteABSplitCampaign,
		output: BenchmarkEmailEndpointOutputSchemas.emailsDeleteABSplitCampaign,
	},
	'emails.deleteEmailCampaign': {
		input: BenchmarkEmailEndpointInputSchemas.emailsDeleteEmailCampaign,
		output: BenchmarkEmailEndpointOutputSchemas.emailsDeleteEmailCampaign,
	},
	'emails.getABSplitDetails': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetABSplitDetails,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetABSplitDetails,
	},
	'emails.getABSplitResults': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetABSplitResults,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetABSplitResults,
	},
	'emails.getABTests': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetABTests,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetABTests,
	},
	'emails.getCommunityCategory': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetCommunityCategory,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetCommunityCategory,
	},
	'emails.getCommunityEmailByID': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetCommunityEmailByID,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetCommunityEmailByID,
	},
	'emails.getEmailPreview': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetEmailPreview,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetEmailPreview,
	},
	'emails.getEmailRecipientCount': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetEmailRecipientCount,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetEmailRecipientCount,
	},
	'emails.getEmailSpamCheck': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetEmailSpamCheck,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetEmailSpamCheck,
	},
	'emails.getEmailTemplates': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetEmailTemplates,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetEmailTemplates,
	},
	'emails.getEmails': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetEmails,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetEmails,
	},
	'emails.getEmailDetails': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetEmailDetails,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetEmailDetails,
	},
	'emails.getTemplateCategoryList': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetTemplateCategoryList,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetTemplateCategoryList,
	},
	'emails.getTemplateCategoryByID': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetTemplateCategoryByID,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetTemplateCategoryByID,
	},
	'emails.getTemplateByID': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetTemplateByID,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetTemplateByID,
	},
	'emails.initiateEmailScreenCapture': {
		input: BenchmarkEmailEndpointInputSchemas.emailsInitiateEmailScreenCapture,
		output:
			BenchmarkEmailEndpointOutputSchemas.emailsInitiateEmailScreenCapture,
	},
	'emails.permanentlyDeleteEmailFromTrash': {
		input:
			BenchmarkEmailEndpointInputSchemas.emailsPermanentlyDeleteEmailFromTrash,
		output:
			BenchmarkEmailEndpointOutputSchemas.emailsPermanentlyDeleteEmailFromTrash,
	},
	'emails.restoreEmailFromTrash': {
		input: BenchmarkEmailEndpointInputSchemas.emailsRestoreEmailFromTrash,
		output: BenchmarkEmailEndpointOutputSchemas.emailsRestoreEmailFromTrash,
	},
	'emails.scheduleEmailCampaign': {
		input: BenchmarkEmailEndpointInputSchemas.emailsScheduleEmailCampaign,
		output: BenchmarkEmailEndpointOutputSchemas.emailsScheduleEmailCampaign,
	},
	'emails.updateEmailCampaign': {
		input: BenchmarkEmailEndpointInputSchemas.emailsUpdateEmailCampaign,
		output: BenchmarkEmailEndpointOutputSchemas.emailsUpdateEmailCampaign,
	},
	'emails.getBadgesList': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetBadgesList,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetBadgesList,
	},
	'emails.getLayoutList': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetLayoutList,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetLayoutList,
	},
	'emails.getScheme': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetScheme,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetScheme,
	},
	'emails.addOrUpdateScheme': {
		input: BenchmarkEmailEndpointInputSchemas.emailsAddOrUpdateScheme,
		output: BenchmarkEmailEndpointOutputSchemas.emailsAddOrUpdateScheme,
	},
	'emails.getRSSHistoryByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.emailsGetRSSHistoryByEmailID,
		output: BenchmarkEmailEndpointOutputSchemas.emailsGetRSSHistoryByEmailID,
	},
	'emails.shareTemplateToSubAccounts': {
		input: BenchmarkEmailEndpointInputSchemas.emailsShareTemplateToSubAccounts,
		output:
			BenchmarkEmailEndpointOutputSchemas.emailsShareTemplateToSubAccounts,
	},
	'archive.addEmailToArchive': {
		input: BenchmarkEmailEndpointInputSchemas.archiveAddEmailToArchive,
		output: BenchmarkEmailEndpointOutputSchemas.archiveAddEmailToArchive,
	},
	'archive.deleteEmailFromArchive': {
		input: BenchmarkEmailEndpointInputSchemas.archiveDeleteEmailFromArchive,
		output: BenchmarkEmailEndpointOutputSchemas.archiveDeleteEmailFromArchive,
	},
	'archive.getArchiveDomainName': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetArchiveDomainName,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetArchiveDomainName,
	},
	'archive.getArchiveEmailDetails': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetArchiveEmailDetails,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetArchiveEmailDetails,
	},
	'archive.getArchiveEmails': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetArchiveEmails,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetArchiveEmails,
	},
	'archive.getArchiveHomeData': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetArchiveHomeData,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetArchiveHomeData,
	},
	'archive.getArchiveHomePage': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetArchiveHomePage,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetArchiveHomePage,
	},
	'archive.getArchivePages': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetArchivePages,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetArchivePages,
	},
	'archive.getDetailsAboutArchivePage': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetDetailsAboutArchivePage,
		output:
			BenchmarkEmailEndpointOutputSchemas.archiveGetDetailsAboutArchivePage,
	},
	'archive.getHTMLForArchiveNewsletter': {
		input:
			BenchmarkEmailEndpointInputSchemas.archiveGetHTMLForArchiveNewsletter,
		output:
			BenchmarkEmailEndpointOutputSchemas.archiveGetHTMLForArchiveNewsletter,
	},
	'archive.getHTMLForButton': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetHTMLForButton,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetHTMLForButton,
	},
	'archive.getImageForButton': {
		input: BenchmarkEmailEndpointInputSchemas.archiveGetImageForButton,
		output: BenchmarkEmailEndpointOutputSchemas.archiveGetImageForButton,
	},
	'archive.updateArchiveHomePage': {
		input: BenchmarkEmailEndpointInputSchemas.archiveUpdateArchiveHomePage,
		output: BenchmarkEmailEndpointOutputSchemas.archiveUpdateArchiveHomePage,
	},
	'archive.updateArchiveHomePageData': {
		input: BenchmarkEmailEndpointInputSchemas.archiveUpdateArchiveHomePageData,
		output:
			BenchmarkEmailEndpointOutputSchemas.archiveUpdateArchiveHomePageData,
	},
	'automations.addEmailInAutomation': {
		input: BenchmarkEmailEndpointInputSchemas.automationsAddEmailInAutomation,
		output: BenchmarkEmailEndpointOutputSchemas.automationsAddEmailInAutomation,
	},
	'automations.copyEmailInAutomation': {
		input: BenchmarkEmailEndpointInputSchemas.automationsCopyEmailInAutomation,
		output:
			BenchmarkEmailEndpointOutputSchemas.automationsCopyEmailInAutomation,
	},
	'automations.createAutomationCopy': {
		input: BenchmarkEmailEndpointInputSchemas.automationsCreateAutomationCopy,
		output: BenchmarkEmailEndpointOutputSchemas.automationsCreateAutomationCopy,
	},
	'automations.deleteAutomation': {
		input: BenchmarkEmailEndpointInputSchemas.automationsDeleteAutomation,
		output: BenchmarkEmailEndpointOutputSchemas.automationsDeleteAutomation,
	},
	'automations.deleteAutomationEmail': {
		input: BenchmarkEmailEndpointInputSchemas.automationsDeleteAutomationEmail,
		output:
			BenchmarkEmailEndpointOutputSchemas.automationsDeleteAutomationEmail,
	},
	'automations.getAutomationEmailDetails': {
		input:
			BenchmarkEmailEndpointInputSchemas.automationsGetAutomationEmailDetails,
		output:
			BenchmarkEmailEndpointOutputSchemas.automationsGetAutomationEmailDetails,
	},
	'automations.getAutomationDetails': {
		input: BenchmarkEmailEndpointInputSchemas.automationsGetAutomationDetails,
		output: BenchmarkEmailEndpointOutputSchemas.automationsGetAutomationDetails,
	},
	'automations.getAutomationSummaryReport': {
		input:
			BenchmarkEmailEndpointInputSchemas.automationsGetAutomationSummaryReport,
		output:
			BenchmarkEmailEndpointOutputSchemas.automationsGetAutomationSummaryReport,
	},
	'automations.updateEmailContentForAutomation': {
		input:
			BenchmarkEmailEndpointInputSchemas.automationsUpdateEmailContentForAutomation,
		output:
			BenchmarkEmailEndpointOutputSchemas.automationsUpdateEmailContentForAutomation,
	},
	'reports.getABTestReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetABTestReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetABTestReport,
	},
	'reports.getAbuseCampaignReportByEmailID': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetAbuseCampaignReportByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetAbuseCampaignReportByEmailID,
	},
	'reports.getAbuseReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetAbuseReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetAbuseReport,
	},
	'reports.getBouncesReportByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetBouncesReportByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetBouncesReportByEmailID,
	},
	'reports.getCampaignEngagementList': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetCampaignEngagementList,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetCampaignEngagementList,
	},
	'reports.getCampaignHistoryByEmailID': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetCampaignHistoryByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetCampaignHistoryByEmailID,
	},
	'reports.getClickContactCount': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetClickContactCount,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetClickContactCount,
	},
	'reports.getClickHeatMapByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetClickHeatMapByEmailID,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetClickHeatMapByEmailID,
	},
	'reports.getClickPerformanceByEmailID': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetClickPerformanceByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetClickPerformanceByEmailID,
	},
	'reports.getClickPerformanceDetailsByEmail': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetClickPerformanceDetailsByEmail,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetClickPerformanceDetailsByEmail,
	},
	'reports.getClickURLContactCount': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetClickURLContactCount,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetClickURLContactCount,
	},
	'reports.getClicksReportByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetClicksReportByEmailID,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetClicksReportByEmailID,
	},
	'reports.getContactReportHistory': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetContactReportHistory,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetContactReportHistory,
	},
	'reports.getDownloadReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetDownloadReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetDownloadReport,
	},
	'reports.downloadContactReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsDownloadContactReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsDownloadContactReport,
	},
	'reports.getEmailOpensByCountryRegion': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetEmailOpensByCountryRegion,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetEmailOpensByCountryRegion,
	},
	'reports.getEmailReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetEmailReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetEmailReport,
	},
	'reports.getEmailReportForwards': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetEmailReportForwards,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetEmailReportForwards,
	},
	'reports.getForwardsReportByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetForwardsReportByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetForwardsReportByEmailID,
	},
	'reports.getLinkDetailByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetLinkDetailByEmailID,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetLinkDetailByEmailID,
	},
	'reports.getOpenContactCount': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetOpenContactCount,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetOpenContactCount,
	},
	'reports.getOpensHourlyReportByEmail': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetOpensHourlyReportByEmail,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetOpensHourlyReportByEmail,
	},
	'reports.getOpensLocationReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetOpensLocationReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetOpensLocationReport,
	},
	'reports.getOpensLocationReportByEmail': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetOpensLocationReportByEmail,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetOpensLocationReportByEmail,
	},
	'reports.getOpensReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetOpensReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetOpensReport,
	},
	'reports.getReportDetailsByABTest': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetReportDetailsByABTest,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetReportDetailsByABTest,
	},
	'reports.getReportDetailsByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetReportDetailsByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetReportDetailsByEmailID,
	},
	'reports.getReportDownload': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetReportDownload,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetReportDownload,
	},
	'reports.getReportsForAutoresponders': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetReportsForAutoresponders,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetReportsForAutoresponders,
	},
	'reports.getSocialPerformanceReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetSocialPerformanceReport,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetSocialPerformanceReport,
	},
	'reports.getURLEngagementList': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetURLEngagementList,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetURLEngagementList,
	},
	'reports.getURLListByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetURLListByEmailID,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetURLListByEmailID,
	},
	'reports.getUnopensReport': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetUnopensReport,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetUnopensReport,
	},
	'reports.getUnopensReportByEmailID': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetUnopensReportByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetUnopensReportByEmailID,
	},
	'reports.getUnsubscribeReportByEmailID': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsGetUnsubscribeReportByEmailID,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsGetUnsubscribeReportByEmailID,
	},
	'reports.getSaveAsList': {
		input: BenchmarkEmailEndpointInputSchemas.reportsGetSaveAsList,
		output: BenchmarkEmailEndpointOutputSchemas.reportsGetSaveAsList,
	},
	'reports.updateListCompilationDetails': {
		input:
			BenchmarkEmailEndpointInputSchemas.reportsUpdateListCompilationDetails,
		output:
			BenchmarkEmailEndpointOutputSchemas.reportsUpdateListCompilationDetails,
	},
	'signupForms.copySignupForm': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsCopySignupForm,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsCopySignupForm,
	},
	'signupForms.createSignupForm': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsCreateSignupForm,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsCreateSignupForm,
	},
	'signupForms.getHTMLSignupForm': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetHTMLSignupForm,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsGetHTMLSignupForm,
	},
	'signupForms.getMagentoHTMLSelected': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetMagentoHTMLSelected,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetMagentoHTMLSelected,
	},
	'signupForms.getMagentoHTMLDropdown': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetMagentoHTMLDropdown,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetMagentoHTMLDropdown,
	},
	'signupForms.getSignupFormButtonCode': {
		input:
			BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormButtonCode,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormButtonCode,
	},
	'signupForms.getSignupFormContactFields': {
		input:
			BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormContactFields,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormContactFields,
	},
	'signupForms.getSignupFormDetails': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormDetails,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormDetails,
	},
	'signupForms.getSignupFormLink': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormLink,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormLink,
	},
	'signupForms.getSignupFormList': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormList,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormList,
	},
	'signupForms.getSignupFormsForContactList': {
		input:
			BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormsForContactList,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormsForContactList,
	},
	'signupForms.getSignupFormForUnbounce': {
		input:
			BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormForUnbounce,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormForUnbounce,
	},
	'signupForms.getSignupFormTumbler': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormTumbler,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormTumbler,
	},
	'signupForms.getSignupFormForMagento': {
		input:
			BenchmarkEmailEndpointInputSchemas.signupFormsGetSignupFormForMagento,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetSignupFormForMagento,
	},
	'signupForms.getTemplatesForSignupFormClassic': {
		input:
			BenchmarkEmailEndpointInputSchemas.signupFormsGetTemplatesForSignupFormClassic,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsGetTemplatesForSignupFormClassic,
	},
	'signupForms.getTumblerLists': {
		input: BenchmarkEmailEndpointInputSchemas.signupFormsGetTumblerLists,
		output: BenchmarkEmailEndpointOutputSchemas.signupFormsGetTumblerLists,
	},
	'signupForms.sendTestEmailForSignupForm': {
		input:
			BenchmarkEmailEndpointInputSchemas.signupFormsSendTestEmailForSignupForm,
		output:
			BenchmarkEmailEndpointOutputSchemas.signupFormsSendTestEmailForSignupForm,
	},
	'surveys.deleteSurvey': {
		input: BenchmarkEmailEndpointInputSchemas.surveysDeleteSurvey,
		output: BenchmarkEmailEndpointOutputSchemas.surveysDeleteSurvey,
	},
	'surveys.getSurveyDetails': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyDetails,
		output: BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyDetails,
	},
	'surveys.getSurveyTemplateList': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyTemplateList,
		output: BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyTemplateList,
	},
	'surveys.getSurveyReportList': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyReportList,
		output: BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyReportList,
	},
	'surveys.getSurveyFullReport': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyFullReport,
		output: BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyFullReport,
	},
	'surveys.getSurveyIndividualResults': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyIndividualResults,
		output:
			BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyIndividualResults,
	},
	'surveys.getSurveyIndividualQuestionResult': {
		input:
			BenchmarkEmailEndpointInputSchemas.surveysGetSurveyIndividualQuestionResult,
		output:
			BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyIndividualQuestionResult,
	},
	'surveys.getSurveyReportAnswerText': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyReportAnswerText,
		output:
			BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyReportAnswerText,
	},
	'surveys.getSurveyReportAnswerComment': {
		input:
			BenchmarkEmailEndpointInputSchemas.surveysGetSurveyReportAnswerComment,
		output:
			BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyReportAnswerComment,
	},
	'surveys.getSurveyReportAnswerOther': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyReportAnswerOther,
		output:
			BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyReportAnswerOther,
	},
	'surveys.getSurveyReportDetail': {
		input: BenchmarkEmailEndpointInputSchemas.surveysGetSurveyReportDetail,
		output: BenchmarkEmailEndpointOutputSchemas.surveysGetSurveyReportDetail,
	},
	'surveys.updateSurveyStatus': {
		input: BenchmarkEmailEndpointInputSchemas.surveysUpdateSurveyStatus,
		output: BenchmarkEmailEndpointOutputSchemas.surveysUpdateSurveyStatus,
	},
	'polls.copyPoll': {
		input: BenchmarkEmailEndpointInputSchemas.pollsCopyPoll,
		output: BenchmarkEmailEndpointOutputSchemas.pollsCopyPoll,
	},
	'polls.createPoll': {
		input: BenchmarkEmailEndpointInputSchemas.pollsCreatePoll,
		output: BenchmarkEmailEndpointOutputSchemas.pollsCreatePoll,
	},
	'polls.deletePoll': {
		input: BenchmarkEmailEndpointInputSchemas.pollsDeletePoll,
		output: BenchmarkEmailEndpointOutputSchemas.pollsDeletePoll,
	},
	'polls.getPollDetails': {
		input: BenchmarkEmailEndpointInputSchemas.pollsGetPollDetails,
		output: BenchmarkEmailEndpointOutputSchemas.pollsGetPollDetails,
	},
	'polls.getPolls': {
		input: BenchmarkEmailEndpointInputSchemas.pollsGetPolls,
		output: BenchmarkEmailEndpointOutputSchemas.pollsGetPolls,
	},
	'polls.getPollPreview': {
		input: BenchmarkEmailEndpointInputSchemas.pollsGetPollPreview,
		output: BenchmarkEmailEndpointOutputSchemas.pollsGetPollPreview,
	},
	'polls.getPollResponseReport': {
		input: BenchmarkEmailEndpointInputSchemas.pollsGetPollResponseReport,
		output: BenchmarkEmailEndpointOutputSchemas.pollsGetPollResponseReport,
	},
	'polls.updatePoll': {
		input: BenchmarkEmailEndpointInputSchemas.pollsUpdatePoll,
		output: BenchmarkEmailEndpointOutputSchemas.pollsUpdatePoll,
	},
	'media.deleteImage': {
		input: BenchmarkEmailEndpointInputSchemas.mediaDeleteImage,
		output: BenchmarkEmailEndpointOutputSchemas.mediaDeleteImage,
	},
	'media.deleteVideo': {
		input: BenchmarkEmailEndpointInputSchemas.mediaDeleteVideo,
		output: BenchmarkEmailEndpointOutputSchemas.mediaDeleteVideo,
	},
	'media.getVideoDetails': {
		input: BenchmarkEmailEndpointInputSchemas.mediaGetVideoDetails,
		output: BenchmarkEmailEndpointOutputSchemas.mediaGetVideoDetails,
	},
	'media.getImages': {
		input: BenchmarkEmailEndpointInputSchemas.mediaGetImages,
		output: BenchmarkEmailEndpointOutputSchemas.mediaGetImages,
	},
	'media.getImageDetails': {
		input: BenchmarkEmailEndpointInputSchemas.mediaGetImageDetails,
		output: BenchmarkEmailEndpointOutputSchemas.mediaGetImageDetails,
	},
	'media.getGiphyImages': {
		input: BenchmarkEmailEndpointInputSchemas.mediaGetGiphyImages,
		output: BenchmarkEmailEndpointOutputSchemas.mediaGetGiphyImages,
	},
	'media.shareVideo': {
		input: BenchmarkEmailEndpointInputSchemas.mediaShareVideo,
		output: BenchmarkEmailEndpointOutputSchemas.mediaShareVideo,
	},
	'media.uploadVideo': {
		input: BenchmarkEmailEndpointInputSchemas.mediaUploadVideo,
		output: BenchmarkEmailEndpointOutputSchemas.mediaUploadVideo,
	},
	'media.createInbox': {
		input: BenchmarkEmailEndpointInputSchemas.mediaCreateInbox,
		output: BenchmarkEmailEndpointOutputSchemas.mediaCreateInbox,
	},
	'media.deleteInbox': {
		input: BenchmarkEmailEndpointInputSchemas.mediaDeleteInbox,
		output: BenchmarkEmailEndpointOutputSchemas.mediaDeleteInbox,
	},
	'media.getInboxList': {
		input: BenchmarkEmailEndpointInputSchemas.mediaGetInboxList,
		output: BenchmarkEmailEndpointOutputSchemas.mediaGetInboxList,
	},
	'media.getInboxMasterResult': {
		input: BenchmarkEmailEndpointInputSchemas.mediaGetInboxMasterResult,
		output: BenchmarkEmailEndpointOutputSchemas.mediaGetInboxMasterResult,
	},
	'media.getInboxDetailResult': {
		input: BenchmarkEmailEndpointInputSchemas.mediaGetInboxDetailResult,
		output: BenchmarkEmailEndpointOutputSchemas.mediaGetInboxDetailResult,
	},
	'account.addRemoveInboxTestsFromSubAccount': {
		input:
			BenchmarkEmailEndpointInputSchemas.accountAddRemoveInboxTestsFromSubAccount,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountAddRemoveInboxTestsFromSubAccount,
	},
	'account.copyImageToSubAccount': {
		input: BenchmarkEmailEndpointInputSchemas.accountCopyImageToSubAccount,
		output: BenchmarkEmailEndpointOutputSchemas.accountCopyImageToSubAccount,
	},
	'account.deleteLinkedAgencyAccount': {
		input: BenchmarkEmailEndpointInputSchemas.accountDeleteLinkedAgencyAccount,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountDeleteLinkedAgencyAccount,
	},
	'account.getCommissionList': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetCommissionList,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetCommissionList,
	},
	'account.getLinkedAgencyAccountDetails': {
		input:
			BenchmarkEmailEndpointInputSchemas.accountGetLinkedAgencyAccountDetails,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountGetLinkedAgencyAccountDetails,
	},
	'account.getLinkedAgencyAccounts': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetLinkedAgencyAccounts,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetLinkedAgencyAccounts,
	},
	'account.getPartnerProfileDetails': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetPartnerProfileDetails,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetPartnerProfileDetails,
	},
	'account.getReferralsList': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetReferralsList,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetReferralsList,
	},
	'account.getSubAccountHistory': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetSubAccountHistory,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetSubAccountHistory,
	},
	'account.getSubAccounts': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetSubAccounts,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetSubAccounts,
	},
	'account.getSubAccountsPlanList': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetSubAccountsPlanList,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetSubAccountsPlanList,
	},
	'account.getReferralsLevel1List': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetReferralsLevel1List,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetReferralsLevel1List,
	},
	'account.getSubAccountBalance': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetSubAccountBalance,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetSubAccountBalance,
	},
	'account.getSubAccountDetails': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetSubAccountDetails,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetSubAccountDetails,
	},
	'account.getSubAccountHistoryDetails': {
		input:
			BenchmarkEmailEndpointInputSchemas.accountGetSubAccountHistoryDetails,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountGetSubAccountHistoryDetails,
	},
	'account.linkAgencyAccount': {
		input: BenchmarkEmailEndpointInputSchemas.accountLinkAgencyAccount,
		output: BenchmarkEmailEndpointOutputSchemas.accountLinkAgencyAccount,
	},
	'account.shareListsWithSubAccounts': {
		input: BenchmarkEmailEndpointInputSchemas.accountShareListsWithSubAccounts,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountShareListsWithSubAccounts,
	},
	'account.updateLinkedAgencyAccount': {
		input: BenchmarkEmailEndpointInputSchemas.accountUpdateLinkedAgencyAccount,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountUpdateLinkedAgencyAccount,
	},
	'account.updatePartnerProfile': {
		input: BenchmarkEmailEndpointInputSchemas.accountUpdatePartnerProfile,
		output: BenchmarkEmailEndpointOutputSchemas.accountUpdatePartnerProfile,
	},
	'account.changePassword': {
		input: BenchmarkEmailEndpointInputSchemas.accountChangePassword,
		output: BenchmarkEmailEndpointOutputSchemas.accountChangePassword,
	},
	'account.changeSecurityPIN': {
		input: BenchmarkEmailEndpointInputSchemas.accountChangeSecurityPIN,
		output: BenchmarkEmailEndpointOutputSchemas.accountChangeSecurityPIN,
	},
	'account.checkIfResponsive': {
		input: BenchmarkEmailEndpointInputSchemas.accountCheckIfResponsive,
		output: BenchmarkEmailEndpointOutputSchemas.accountCheckIfResponsive,
	},
	'account.disableSecurityPIN': {
		input: BenchmarkEmailEndpointInputSchemas.accountDisableSecurityPIN,
		output: BenchmarkEmailEndpointOutputSchemas.accountDisableSecurityPIN,
	},
	'account.getAllConfirmedEmails': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetAllConfirmedEmails,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetAllConfirmedEmails,
	},
	'account.getClientAccountSettings': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetClientAccountSettings,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetClientAccountSettings,
	},
	'account.getClientPlanInformation': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetClientPlanInformation,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetClientPlanInformation,
	},
	'account.getCurrentEmailAtTimeOfReset': {
		input:
			BenchmarkEmailEndpointInputSchemas.accountGetCurrentEmailAtTimeOfReset,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountGetCurrentEmailAtTimeOfReset,
	},
	'account.getDMARCList': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetDMARCList,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetDMARCList,
	},
	'account.getListOfConfirmedEmails': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetListOfConfirmedEmails,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetListOfConfirmedEmails,
	},
	'account.getClientDetails': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetClientDetails,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetClientDetails,
	},
	'account.getClientFilterDomain': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetClientFilterDomain,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetClientFilterDomain,
	},
	'account.getClientProfileDetails': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetClientProfileDetails,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetClientProfileDetails,
	},
	'account.getClientsRatingRange': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetClientsRatingRange,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetClientsRatingRange,
	},
	'account.loginRedirectUsingToken': {
		input: BenchmarkEmailEndpointInputSchemas.accountLoginRedirectUsingToken,
		output: BenchmarkEmailEndpointOutputSchemas.accountLoginRedirectUsingToken,
	},
	'account.patchUpdateClientSettings': {
		input: BenchmarkEmailEndpointInputSchemas.accountPatchUpdateClientSettings,
		output:
			BenchmarkEmailEndpointOutputSchemas.accountPatchUpdateClientSettings,
	},
	'account.resendConfirmEmail': {
		input: BenchmarkEmailEndpointInputSchemas.accountResendConfirmEmail,
		output: BenchmarkEmailEndpointOutputSchemas.accountResendConfirmEmail,
	},
	'account.saveSecurityPIN': {
		input: BenchmarkEmailEndpointInputSchemas.accountSaveSecurityPIN,
		output: BenchmarkEmailEndpointOutputSchemas.accountSaveSecurityPIN,
	},
	'account.saveWebsiteDomain': {
		input: BenchmarkEmailEndpointInputSchemas.accountSaveWebsiteDomain,
		output: BenchmarkEmailEndpointOutputSchemas.accountSaveWebsiteDomain,
	},
	'account.sendPINViaEmail': {
		input: BenchmarkEmailEndpointInputSchemas.accountSendPINViaEmail,
		output: BenchmarkEmailEndpointOutputSchemas.accountSendPINViaEmail,
	},
	'account.sendResetEmail': {
		input: BenchmarkEmailEndpointInputSchemas.accountSendResetEmail,
		output: BenchmarkEmailEndpointOutputSchemas.accountSendResetEmail,
	},
	'account.setResponsive': {
		input: BenchmarkEmailEndpointInputSchemas.accountSetResponsive,
		output: BenchmarkEmailEndpointOutputSchemas.accountSetResponsive,
	},
	'account.updateEditProfile': {
		input: BenchmarkEmailEndpointInputSchemas.accountUpdateEditProfile,
		output: BenchmarkEmailEndpointOutputSchemas.accountUpdateEditProfile,
	},
	'account.updateResetEmail': {
		input: BenchmarkEmailEndpointInputSchemas.accountUpdateResetEmail,
		output: BenchmarkEmailEndpointOutputSchemas.accountUpdateResetEmail,
	},
	'account.getNotification': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetNotification,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetNotification,
	},
	'account.getWebPageAdsDetail': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetWebPageAdsDetail,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetWebPageAdsDetail,
	},
	'account.getHelpTopics': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetHelpTopics,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetHelpTopics,
	},
	'account.generateSupportTicket': {
		input: BenchmarkEmailEndpointInputSchemas.accountGenerateSupportTicket,
		output: BenchmarkEmailEndpointOutputSchemas.accountGenerateSupportTicket,
	},
	'account.sendSupportFeedback': {
		input: BenchmarkEmailEndpointInputSchemas.accountSendSupportFeedback,
		output: BenchmarkEmailEndpointOutputSchemas.accountSendSupportFeedback,
	},
	'account.getCommunityDomain': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetCommunityDomain,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetCommunityDomain,
	},
	'account.getAccountSummary': {
		input: BenchmarkEmailEndpointInputSchemas.accountGetAccountSummary,
		output: BenchmarkEmailEndpointOutputSchemas.accountGetAccountSummary,
	},
	'integrations.assignProductToList': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsAssignProductToList,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsAssignProductToList,
	},
	'integrations.configureShopifyPurchaseList': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsConfigureShopifyPurchaseList,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsConfigureShopifyPurchaseList,
	},
	'integrations.connectService': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsConnectService,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsConnectService,
	},
	'integrations.deleteProductAssociation': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDeleteProductAssociation,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDeleteProductAssociation,
	},
	'integrations.disconnectEtsyIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectEtsyIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectEtsyIntegration,
	},
	'integrations.disconnectEventbriteIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectEventbriteIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectEventbriteIntegration,
	},
	'integrations.disconnectFacebookEvents': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectFacebookEvents,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectFacebookEvents,
	},
	'integrations.disconnectFacebookIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectFacebookIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectFacebookIntegration,
	},
	'integrations.disconnectInstagramIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectInstagramIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectInstagramIntegration,
	},
	'integrations.disconnectLinkedInIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectLinkedInIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectLinkedInIntegration,
	},
	'integrations.disconnectPinterestConnection': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectPinterestConnection,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectPinterestConnection,
	},
	'integrations.disconnectSalesforceIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectSalesforceIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectSalesforceIntegration,
	},
	'integrations.disconnectShopify': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsDisconnectShopify,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectShopify,
	},
	'integrations.disconnectTwitterIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectTwitterIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectTwitterIntegration,
	},
	'integrations.disconnectEbayIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsDisconnectEbayIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsDisconnectEbayIntegration,
	},
	'integrations.logOutTwitterTweets': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsLogOutTwitterTweets,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsLogOutTwitterTweets,
	},
	'integrations.getContactListsForShopify': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsGetContactListsForShopify,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetContactListsForShopify,
	},
	'integrations.getDigiohUsername': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetDigiohUsername,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetDigiohUsername,
	},
	'integrations.getEtsyStoreName': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetEtsyStoreName,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetEtsyStoreName,
	},
	'integrations.getEventbriteUsername': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetEventbriteUsername,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetEventbriteUsername,
	},
	'integrations.getFacebookAccountHolder': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsGetFacebookAccountHolder,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetFacebookAccountHolder,
	},
	'integrations.getFacebookAccountName': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsGetFacebookAccountName,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetFacebookAccountName,
	},
	'integrations.getIntegrationAuthURL': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetIntegrationAuthURL,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetIntegrationAuthURL,
	},
	'integrations.getIntegrationConnectionList': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsGetIntegrationConnectionList,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetIntegrationConnectionList,
	},
	'integrations.getLinkedInToken': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetLinkedInToken,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetLinkedInToken,
	},
	'integrations.getShopifyProducts': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetShopifyProducts,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetShopifyProducts,
	},
	'integrations.getPaypalLists': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetPaypalLists,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetPaypalLists,
	},
	'integrations.getPaypalLink': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetPaypalLink,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetPaypalLink,
	},
	'integrations.getPinterestUsername': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetPinterestUsername,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetPinterestUsername,
	},
	'integrations.getSalesforceStatus': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetSalesforceStatus,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetSalesforceStatus,
	},
	'integrations.getShopifyProductGrid': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetShopifyProductGrid,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsGetShopifyProductGrid,
	},
	'integrations.getTwitterLogin': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetTwitterLogin,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetTwitterLogin,
	},
	'integrations.getUnbounceLink': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetUnbounceLink,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetUnbounceLink,
	},
	'integrations.getUnbounceLists': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetUnbounceLists,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetUnbounceLists,
	},
	'integrations.getEbaySellerID': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetEbaySellerID,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetEbaySellerID,
	},
	'integrations.getEbaySiteList': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsGetEbaySiteList,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsGetEbaySiteList,
	},
	'integrations.testEtsyIntegration': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsTestEtsyIntegration,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsTestEtsyIntegration,
	},
	'integrations.testEventbriteIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsTestEventbriteIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsTestEventbriteIntegration,
	},
	'integrations.testFacebookEventsIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsTestFacebookEventsIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsTestFacebookEventsIntegration,
	},
	'integrations.testFacebookIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsTestFacebookIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsTestFacebookIntegration,
	},
	'integrations.testLinkedInConnection': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsTestLinkedInConnection,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsTestLinkedInConnection,
	},
	'integrations.testPinterestIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsTestPinterestIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsTestPinterestIntegration,
	},
	'integrations.testSalesforceIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsTestSalesforceIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsTestSalesforceIntegration,
	},
	'integrations.testTwitterIntegration': {
		input:
			BenchmarkEmailEndpointInputSchemas.integrationsTestTwitterIntegration,
		output:
			BenchmarkEmailEndpointOutputSchemas.integrationsTestTwitterIntegration,
	},
	'integrations.testTwitterTweets': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsTestTwitterTweets,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsTestTwitterTweets,
	},
	'integrations.testEbayIntegration': {
		input: BenchmarkEmailEndpointInputSchemas.integrationsTestEbayIntegration,
		output: BenchmarkEmailEndpointOutputSchemas.integrationsTestEbayIntegration,
	},
	'webhooks.createWebhook': {
		input: BenchmarkEmailEndpointInputSchemas.webhooksCreateWebhook,
		output: BenchmarkEmailEndpointOutputSchemas.webhooksCreateWebhook,
	},
	'webhooks.getWebhooks': {
		input: BenchmarkEmailEndpointInputSchemas.webhooksGetWebhooks,
		output: BenchmarkEmailEndpointOutputSchemas.webhooksGetWebhooks,
	},
	'webhooks.deleteWebhook': {
		input: BenchmarkEmailEndpointInputSchemas.webhooksDeleteWebhook,
		output: BenchmarkEmailEndpointOutputSchemas.webhooksDeleteWebhook,
	},
	'webhooks.updateWebhook': {
		input: BenchmarkEmailEndpointInputSchemas.webhooksUpdateWebhook,
		output: BenchmarkEmailEndpointOutputSchemas.webhooksUpdateWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof benchmarkEmailEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const benchmarkEmailEndpointMeta = {
	'contacts.addContactToList': {
		riskLevel: 'write',
		description: 'Add a new contact to a specific contact list',
	},
	'contacts.cleanContactList': {
		riskLevel: 'write',
		description:
			'Clean a contact list by removing invalid or bounced addresses',
	},
	'contacts.compareContacts': {
		riskLevel: 'read',
		description: 'Compare contacts across multiple contact lists',
	},
	'contacts.copyBulkContacts': {
		riskLevel: 'write',
		description: 'Copy multiple contacts in bulk to target lists',
	},
	'contacts.copyContact': {
		riskLevel: 'write',
		description: 'Copy a contact to a specific list',
	},
	'contacts.createSegmentCriteria': {
		riskLevel: 'write',
		description: 'Create criteria for a contact segment',
	},
	'contacts.createSegmentFromContactIDs': {
		riskLevel: 'write',
		description: 'Create a segment from a list of contact IDs',
	},
	'contacts.deleteContactFromAllListsByID': {
		riskLevel: 'destructive',
		description: 'Delete a specific contact from all lists',
	},
	'contacts.deleteContactFromList': {
		riskLevel: 'destructive',
		description: 'Delete a contact from a specific list',
	},
	'contacts.deleteContactFromSearch': {
		riskLevel: 'destructive',
		description: 'Delete a contact from the search contact page',
	},
	'contacts.deleteContactsFromAllLists': {
		riskLevel: 'destructive',
		description: 'Delete selected contacts from all lists',
	},
	'contacts.deleteContactsFromCurrentLists': {
		riskLevel: 'destructive',
		description: 'Delete selected contacts from current lists',
	},
	'contacts.deleteSegment': {
		riskLevel: 'destructive',
		description: 'Delete a contact segment',
	},
	'contacts.deleteSegmentCriteria': {
		riskLevel: 'destructive',
		description: 'Delete criteria from a segment',
	},
	'contacts.deleteTrashList': {
		riskLevel: 'destructive',
		description: 'Delete all trash contacts from a list',
	},
	'contacts.getActiveContactCount': {
		riskLevel: 'read',
		description: 'Get the total count of all active contacts',
	},
	'contacts.getContactAuditHistory': {
		riskLevel: 'read',
		description: 'Retrieve audit history for contacts in a list',
	},
	'contacts.getContactAuditHistoryDetail': {
		riskLevel: 'read',
		description:
			'Get detailed audit history for a batch and group of contact changes',
	},
	'contacts.getContactDetails': {
		riskLevel: 'read',
		description: 'Retrieve detailed information for a specific contact',
	},
	'contacts.getContactImportStatus': {
		riskLevel: 'read',
		description: 'Get the status of contact import operations',
	},
	'contacts.getContactMergeList': {
		riskLevel: 'read',
		description: 'Retrieve contact lists that can be merged with a list',
	},
	'contacts.getContactsCount': {
		riskLevel: 'read',
		description: 'Get the count of contacts in specified lists and segments',
	},
	'contacts.getFilteredContacts': {
		riskLevel: 'read',
		description: 'Fetch filtered and paginated contacts from a list',
	},
	'contacts.getFilteredContactsWithExtraFields': {
		riskLevel: 'read',
		description: 'Fetch filtered contacts with custom and extra fields',
	},
	'contacts.getNonContactCount': {
		riskLevel: 'read',
		description: 'Get the count of non-contacts for campaigns',
	},
	'contacts.getSegmentAutoGenerateName': {
		riskLevel: 'read',
		description: 'Get an auto-generated segment name for a list',
	},
	'contacts.getSegmentDetails': {
		riskLevel: 'read',
		description: 'Retrieve contact details from a segment',
	},
	'contacts.getSegmentList': {
		riskLevel: 'read',
		description: 'Retrieve segment lists for a contact list',
	},
	'contacts.getSegmentByID': {
		riskLevel: 'read',
		description: 'Retrieve a contact segment by ID',
	},
	'contacts.getSegments': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of contact segments',
	},
	'contacts.getTrashCount': {
		riskLevel: 'read',
		description: 'Get the count of contacts in the trash',
	},
	'contacts.getDownloadSegmentData': {
		riskLevel: 'read',
		description: 'Download segment data',
	},
	'contacts.getCleanCount': {
		riskLevel: 'read',
		description: 'Get the clean count for a contact list',
	},
	'contacts.getUniqueContactCount': {
		riskLevel: 'read',
		description: 'Get the unique contact count',
	},
	'contacts.mergeContactsIntoExistingList': {
		riskLevel: 'write',
		description: 'Merge contacts into an existing list',
	},
	'contacts.mergeContactsIntoNewList': {
		riskLevel: 'write',
		description: 'Merge contacts into a new list',
	},
	'contacts.moveBulkContacts': {
		riskLevel: 'write',
		description: 'Move multiple contacts in bulk',
	},
	'contacts.moveContactToDoNotContactList': {
		riskLevel: 'destructive',
		description: 'Move a contact to the do-not-contact list',
	},
	'contacts.moveContacts': {
		riskLevel: 'write',
		description: 'Move contacts to a target list',
	},
	'contacts.resendEmails': {
		riskLevel: 'write',
		description: 'Resend emails to contacts in a list',
	},
	'contacts.saveEmailAddress': {
		riskLevel: 'write',
		description: 'Save an email address to a contact list',
	},
	'contacts.saveVerifiedEmailAddresses': {
		riskLevel: 'write',
		description: 'Save verified email addresses to a contact list',
	},
	'contacts.searchContactDetailsByEmail': {
		riskLevel: 'read',
		description: 'Search contact details by email',
	},
	'contacts.sendConfirmEmailVerification': {
		riskLevel: 'write',
		description: 'Send a confirm-email verification message',
	},
	'contacts.updateContactDetails': {
		riskLevel: 'write',
		description: 'Update the details of a contact',
	},
	'contacts.updateSegment': {
		riskLevel: 'write',
		description: 'Update a contact segment',
	},
	'lists.createContactList': {
		riskLevel: 'write',
		description: 'Create a new contact list',
	},
	'lists.deleteContactList': {
		riskLevel: 'destructive',
		description: 'Delete a contact list',
	},
	'lists.deleteList': {
		riskLevel: 'destructive',
		description: 'Delete one or more contact lists',
	},
	'lists.getContactListDeepView': {
		riskLevel: 'read',
		description: 'Fetch a deep view of contact lists',
	},
	'lists.getContactListDetails': {
		riskLevel: 'read',
		description: 'Fetch detailed information for a contact list',
	},
	'lists.getContactListFieldNames': {
		riskLevel: 'read',
		description: 'Retrieve field names and attributes for a contact list',
	},
	'lists.getContactLists': {
		riskLevel: 'read',
		description: 'Retrieve all contact lists',
	},
	'lists.getDeleteListCheck': {
		riskLevel: 'read',
		description: 'Check whether contact lists can be deleted',
	},
	'lists.getListUploadTerms': {
		riskLevel: 'read',
		description: 'Get the terms for contact list uploads',
	},
	'lists.getContactListSummary': {
		riskLevel: 'read',
		description: 'Get the summary of a contact list',
	},
	'lists.restoreTrashList': {
		riskLevel: 'write',
		description: 'Restore a trash list',
	},
	'lists.updateContactList': {
		riskLevel: 'write',
		description: 'Update a contact list',
	},
	'emails.addEmailToCommunity': {
		riskLevel: 'write',
		description: 'Add an email campaign to the public community',
	},
	'emails.copyExistingEmail': {
		riskLevel: 'write',
		description: 'Copy an existing email campaign',
	},
	'emails.deleteABTestEmail': {
		riskLevel: 'destructive',
		description: 'Move an AB test email to trash',
	},
	'emails.deleteABSplitCampaign': {
		riskLevel: 'destructive',
		description: 'Delete an ABSplit campaign configuration from an email',
	},
	'emails.deleteEmailCampaign': {
		riskLevel: 'destructive',
		description: 'Delete an email campaign',
	},
	'emails.getABSplitDetails': {
		riskLevel: 'read',
		description: 'Get AB split test details for an email campaign',
	},
	'emails.getABSplitResults': {
		riskLevel: 'read',
		description: 'Get the results of an AB split test',
	},
	'emails.getABTests': {
		riskLevel: 'read',
		description: 'Retrieve a list of AB tests',
	},
	'emails.getCommunityCategory': {
		riskLevel: 'read',
		description: 'List available community categories',
	},
	'emails.getCommunityEmailByID': {
		riskLevel: 'read',
		description: 'Get a community email by ID',
	},
	'emails.getEmailPreview': {
		riskLevel: 'read',
		description: 'Get the preview of an email campaign',
	},
	'emails.getEmailRecipientCount': {
		riskLevel: 'read',
		description: 'Get the recipient count for an email campaign',
	},
	'emails.getEmailSpamCheck': {
		riskLevel: 'read',
		description: 'Check the spam score for an email campaign',
	},
	'emails.getEmailTemplates': {
		riskLevel: 'read',
		description: 'Retrieve email templates',
	},
	'emails.getEmails': {
		riskLevel: 'read',
		description: 'Retrieve all email campaigns',
	},
	'emails.getEmailDetails': {
		riskLevel: 'read',
		description: 'Get the details of an email campaign',
	},
	'emails.getTemplateCategoryList': {
		riskLevel: 'read',
		description: 'Retrieve the template category list',
	},
	'emails.getTemplateCategoryByID': {
		riskLevel: 'read',
		description: 'Get a template category by ID',
	},
	'emails.getTemplateByID': {
		riskLevel: 'read',
		description: 'Get an email template by ID',
	},
	'emails.initiateEmailScreenCapture': {
		riskLevel: 'write',
		description: 'Initiate an email screen capture process',
	},
	'emails.permanentlyDeleteEmailFromTrash': {
		riskLevel: 'destructive',
		description: 'Permanently delete an email from trash',
	},
	'emails.restoreEmailFromTrash': {
		riskLevel: 'write',
		description: 'Restore an email from trash',
	},
	'emails.scheduleEmailCampaign': {
		riskLevel: 'write',
		description: 'Schedule an email campaign',
	},
	'emails.updateEmailCampaign': {
		riskLevel: 'write',
		description: 'Update an email campaign',
	},
	'emails.getBadgesList': {
		riskLevel: 'read',
		description: 'Retrieve all available email badges',
	},
	'emails.getLayoutList': {
		riskLevel: 'read',
		description: 'Get the email layout list',
	},
	'emails.getScheme': {
		riskLevel: 'read',
		description: 'Retrieve color schemes for email templates',
	},
	'emails.addOrUpdateScheme': {
		riskLevel: 'write',
		description: 'Add or update a color scheme',
	},
	'emails.getRSSHistoryByEmailID': {
		riskLevel: 'read',
		description: 'Get RSS history for an email campaign',
	},
	'emails.shareTemplateToSubAccounts': {
		riskLevel: 'write',
		description: 'Share an email template with sub-accounts',
	},
	'archive.addEmailToArchive': {
		riskLevel: 'write',
		description: 'Add an email campaign to the archive page',
	},
	'archive.deleteEmailFromArchive': {
		riskLevel: 'destructive',
		description: 'Delete an email from the archive',
	},
	'archive.getArchiveDomainName': {
		riskLevel: 'read',
		description: 'Get the archive domain name for the client',
	},
	'archive.getArchiveEmailDetails': {
		riskLevel: 'read',
		description: 'Get the details of an archived email',
	},
	'archive.getArchiveEmails': {
		riskLevel: 'read',
		description: 'Retrieve a list of emails from the archive',
	},
	'archive.getArchiveHomeData': {
		riskLevel: 'read',
		description: 'Get archive home data for a domain and type',
	},
	'archive.getArchiveHomePage': {
		riskLevel: 'read',
		description: 'Get the archive home page',
	},
	'archive.getArchivePages': {
		riskLevel: 'read',
		description: 'Retrieve the list of archive pages',
	},
	'archive.getDetailsAboutArchivePage': {
		riskLevel: 'read',
		description: 'Get details about the archive page',
	},
	'archive.getHTMLForArchiveNewsletter': {
		riskLevel: 'write',
		description: 'Get HTML content for an archive newsletter',
	},
	'archive.getHTMLForButton': {
		riskLevel: 'read',
		description: 'Get HTML content for an archive button',
	},
	'archive.getImageForButton': {
		riskLevel: 'read',
		description: 'Get the image archive button HTML',
	},
	'archive.updateArchiveHomePage': {
		riskLevel: 'write',
		description: 'Update the archive home page',
	},
	'archive.updateArchiveHomePageData': {
		riskLevel: 'write',
		description: 'Update archive home page data',
	},
	'automations.addEmailInAutomation': {
		riskLevel: 'write',
		description: 'Add an email to an automation workflow',
	},
	'automations.copyEmailInAutomation': {
		riskLevel: 'write',
		description: 'Create a copy of an automation email',
	},
	'automations.createAutomationCopy': {
		riskLevel: 'write',
		description: 'Create a copy of an existing automation',
	},
	'automations.deleteAutomation': {
		riskLevel: 'destructive',
		description: 'Delete an automation',
	},
	'automations.deleteAutomationEmail': {
		riskLevel: 'destructive',
		description: 'Delete an automation email from a workflow',
	},
	'automations.getAutomationEmailDetails': {
		riskLevel: 'read',
		description: 'Get details for an automation email',
	},
	'automations.getAutomationDetails': {
		riskLevel: 'read',
		description: 'Get the details of an automation',
	},
	'automations.getAutomationSummaryReport': {
		riskLevel: 'read',
		description: 'Get the summary report of an automation',
	},
	'automations.updateEmailContentForAutomation': {
		riskLevel: 'write',
		description: 'Update email content for an automation',
	},
	'reports.getABTestReport': {
		riskLevel: 'read',
		description: 'Retrieve AB split test reports',
	},
	'reports.getAbuseCampaignReportByEmailID': {
		riskLevel: 'read',
		description: 'Get the abuse campaign report for an email',
	},
	'reports.getAbuseReport': {
		riskLevel: 'read',
		description: 'Get the abuse report with complaint statistics',
	},
	'reports.getBouncesReportByEmailID': {
		riskLevel: 'read',
		description: 'Get the bounces report for an email campaign',
	},
	'reports.getCampaignEngagementList': {
		riskLevel: 'read',
		description: 'Retrieve campaign engagement statistics',
	},
	'reports.getCampaignHistoryByEmailID': {
		riskLevel: 'read',
		description: 'Get campaign history for an email',
	},
	'reports.getClickContactCount': {
		riskLevel: 'read',
		description: 'Get the click contact count for campaigns',
	},
	'reports.getClickHeatMapByEmailID': {
		riskLevel: 'read',
		description: 'Get the click heatmap report for an email',
	},
	'reports.getClickPerformanceByEmailID': {
		riskLevel: 'read',
		description: 'Get click performance for an email campaign',
	},
	'reports.getClickPerformanceDetailsByEmail': {
		riskLevel: 'read',
		description: 'Get click performance details for an email campaign',
	},
	'reports.getClickURLContactCount': {
		riskLevel: 'read',
		description: 'Get the click URL contact count of engagement metrics',
	},
	'reports.getClicksReportByEmailID': {
		riskLevel: 'read',
		description: 'Get the clicks report for an email campaign',
	},
	'reports.getContactReportHistory': {
		riskLevel: 'read',
		description: 'Get engagement history for a contact by email address',
	},
	'reports.getDownloadReport': {
		riskLevel: 'write',
		description: 'Get the download report for a contact list',
	},
	'reports.downloadContactReport': {
		riskLevel: 'read',
		description: 'Download the contact list report',
	},
	'reports.getEmailOpensByCountryRegion': {
		riskLevel: 'read',
		description: 'Get email opens by country and region',
	},
	'reports.getEmailReport': {
		riskLevel: 'read',
		description: 'Get email campaign reports',
	},
	'reports.getEmailReportForwards': {
		riskLevel: 'read',
		description: 'Get the forwards report for an email campaign',
	},
	'reports.getForwardsReportByEmailID': {
		riskLevel: 'read',
		description: 'Get the forwards report for an email campaign by ID',
	},
	'reports.getLinkDetailByEmailID': {
		riskLevel: 'read',
		description: 'Get the link detail report for an email campaign',
	},
	'reports.getOpenContactCount': {
		riskLevel: 'read',
		description: 'Get the count of contacts who opened campaigns',
	},
	'reports.getOpensHourlyReportByEmail': {
		riskLevel: 'read',
		description: 'Get the hourly opens report for an email campaign',
	},
	'reports.getOpensLocationReport': {
		riskLevel: 'read',
		description: 'Get the opens location report for a campaign',
	},
	'reports.getOpensLocationReportByEmail': {
		riskLevel: 'read',
		description: 'Get opens for an email from a specific country',
	},
	'reports.getOpensReport': {
		riskLevel: 'read',
		description: 'Get the opens report for an email campaign',
	},
	'reports.getReportDetailsByABTest': {
		riskLevel: 'read',
		description: 'Get report details for an AB split test',
	},
	'reports.getReportDetailsByEmailID': {
		riskLevel: 'read',
		description: 'Get the detailed report summary for an email campaign',
	},
	'reports.getReportDownload': {
		riskLevel: 'read',
		description: 'Download an email campaign report by type',
	},
	'reports.getReportsForAutoresponders': {
		riskLevel: 'read',
		description: 'Get reports for autoresponders',
	},
	'reports.getSocialPerformanceReport': {
		riskLevel: 'read',
		description: 'Get the social performance report for a campaign',
	},
	'reports.getURLEngagementList': {
		riskLevel: 'read',
		description: 'Retrieve URL engagement statistics',
	},
	'reports.getURLListByEmailID': {
		riskLevel: 'read',
		description: 'Get the URL list for an email campaign',
	},
	'reports.getUnopensReport': {
		riskLevel: 'read',
		description: 'Get the unopens report for an email campaign',
	},
	'reports.getUnopensReportByEmailID': {
		riskLevel: 'read',
		description: 'Get unopens for an email campaign by ID',
	},
	'reports.getUnsubscribeReportByEmailID': {
		riskLevel: 'read',
		description: 'Get the unsubscribe report for an email campaign',
	},
	'reports.getSaveAsList': {
		riskLevel: 'read',
		description: 'Get the save-as-list data',
	},
	'reports.updateListCompilationDetails': {
		riskLevel: 'write',
		description: 'Update list compilation details',
	},
	'signupForms.copySignupForm': {
		riskLevel: 'write',
		description: 'Copy an existing signup form',
	},
	'signupForms.createSignupForm': {
		riskLevel: 'write',
		description: 'Create a new signup form',
	},
	'signupForms.getHTMLSignupForm': {
		riskLevel: 'write',
		description: 'Get the HTML embed code for a signup form',
	},
	'signupForms.getMagentoHTMLSelected': {
		riskLevel: 'read',
		description: 'Get Magento HTML for a selected signup form',
	},
	'signupForms.getMagentoHTMLDropdown': {
		riskLevel: 'read',
		description: 'Get the Magento signup form dropdown HTML',
	},
	'signupForms.getSignupFormButtonCode': {
		riskLevel: 'read',
		description: 'Get the code for the signup form button',
	},
	'signupForms.getSignupFormContactFields': {
		riskLevel: 'read',
		description: 'Get the contact fields of a signup form',
	},
	'signupForms.getSignupFormDetails': {
		riskLevel: 'read',
		description: 'Get the details of a signup form',
	},
	'signupForms.getSignupFormLink': {
		riskLevel: 'read',
		description: 'Get the public link URL for a signup form',
	},
	'signupForms.getSignupFormList': {
		riskLevel: 'read',
		description: 'Retrieve all signup forms',
	},
	'signupForms.getSignupFormsForContactList': {
		riskLevel: 'read',
		description: 'Get signup forms for a contact list',
	},
	'signupForms.getSignupFormForUnbounce': {
		riskLevel: 'read',
		description: 'Get signup form data for Unbounce',
	},
	'signupForms.getSignupFormTumbler': {
		riskLevel: 'read',
		description: 'Get signup form Tumbler parameters',
	},
	'signupForms.getSignupFormForMagento': {
		riskLevel: 'read',
		description: 'Get signup form data for Magento',
	},
	'signupForms.getTemplatesForSignupFormClassic': {
		riskLevel: 'read',
		description: 'Get templates for classic signup forms',
	},
	'signupForms.getTumblerLists': {
		riskLevel: 'read',
		description: 'Get Tumbler signup form lists',
	},
	'signupForms.sendTestEmailForSignupForm': {
		riskLevel: 'write',
		description: 'Send a test email for a signup form',
	},
	'surveys.deleteSurvey': {
		riskLevel: 'destructive',
		description: 'Delete a survey',
	},
	'surveys.getSurveyDetails': {
		riskLevel: 'read',
		description: 'Retrieve the details of a survey',
	},
	'surveys.getSurveyTemplateList': {
		riskLevel: 'read',
		description: 'Retrieve the list of survey templates',
	},
	'surveys.getSurveyReportList': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of survey reports',
	},
	'surveys.getSurveyFullReport': {
		riskLevel: 'read',
		description: 'Retrieve the full report of a survey',
	},
	'surveys.getSurveyIndividualResults': {
		riskLevel: 'read',
		description: 'Retrieve paginated individual survey results',
	},
	'surveys.getSurveyIndividualQuestionResult': {
		riskLevel: 'read',
		description: 'Get individual question results for a survey respondent',
	},
	'surveys.getSurveyReportAnswerText': {
		riskLevel: 'read',
		description: 'Retrieve text answers from a survey report',
	},
	'surveys.getSurveyReportAnswerComment': {
		riskLevel: 'read',
		description: 'Retrieve comment answers from a survey report',
	},
	'surveys.getSurveyReportAnswerOther': {
		riskLevel: 'read',
		description: 'Retrieve other answers from a survey report',
	},
	'surveys.getSurveyReportDetail': {
		riskLevel: 'read',
		description: 'Get the report detail of a survey',
	},
	'surveys.updateSurveyStatus': {
		riskLevel: 'write',
		description: 'Update the status of a survey',
	},
	'polls.copyPoll': {
		riskLevel: 'write',
		description: 'Copy an existing poll',
	},
	'polls.createPoll': {
		riskLevel: 'write',
		description: 'Create a new poll',
	},
	'polls.deletePoll': {
		riskLevel: 'destructive',
		description: 'Delete a poll',
	},
	'polls.getPollDetails': {
		riskLevel: 'read',
		description: 'Retrieve the details of a poll',
	},
	'polls.getPolls': {
		riskLevel: 'read',
		description: 'Retrieve a list of polls',
	},
	'polls.getPollPreview': {
		riskLevel: 'read',
		description: 'Get a preview of a poll',
	},
	'polls.getPollResponseReport': {
		riskLevel: 'read',
		description: 'Retrieve the response report of a poll',
	},
	'polls.updatePoll': {
		riskLevel: 'write',
		description: 'Update a poll',
	},
	'media.deleteImage': {
		riskLevel: 'destructive',
		description: 'Delete an image',
	},
	'media.deleteVideo': {
		riskLevel: 'destructive',
		description: 'Delete a video',
	},
	'media.getVideoDetails': {
		riskLevel: 'read',
		description: 'Get the details of a video',
	},
	'media.getImages': {
		riskLevel: 'read',
		description: 'Retrieve a list of images',
	},
	'media.getImageDetails': {
		riskLevel: 'read',
		description: 'Get the details of an image',
	},
	'media.getGiphyImages': {
		riskLevel: 'read',
		description: 'Get the list of Giphy images',
	},
	'media.shareVideo': {
		riskLevel: 'write',
		description: 'Share a video',
	},
	'media.uploadVideo': {
		riskLevel: 'write',
		description: 'Upload a video',
	},
	'media.createInbox': {
		riskLevel: 'write',
		description: 'Create a new inbox for email testing',
	},
	'media.deleteInbox': {
		riskLevel: 'destructive',
		description: 'Delete an inbox',
	},
	'media.getInboxList': {
		riskLevel: 'read',
		description: 'Retrieve the inbox list',
	},
	'media.getInboxMasterResult': {
		riskLevel: 'read',
		description: 'Get an inbox master result',
	},
	'media.getInboxDetailResult': {
		riskLevel: 'read',
		description: 'Get inbox detail test statistics',
	},
	'account.addRemoveInboxTestsFromSubAccount': {
		riskLevel: 'write',
		description: 'Add or remove inbox tests from a sub-account',
	},
	'account.copyImageToSubAccount': {
		riskLevel: 'write',
		description: 'Copy an image to sub-accounts',
	},
	'account.deleteLinkedAgencyAccount': {
		riskLevel: 'destructive',
		description: 'Delete a linked agency account',
	},
	'account.getCommissionList': {
		riskLevel: 'read',
		description: 'Get the partner commission list',
	},
	'account.getLinkedAgencyAccountDetails': {
		riskLevel: 'read',
		description: 'Get the details of a linked agency account',
	},
	'account.getLinkedAgencyAccounts': {
		riskLevel: 'read',
		description: 'Get the list of linked agency accounts',
	},
	'account.getPartnerProfileDetails': {
		riskLevel: 'read',
		description: 'Get partner profile details',
	},
	'account.getReferralsList': {
		riskLevel: 'read',
		description: 'Retrieve the list of partner referrals',
	},
	'account.getSubAccountHistory': {
		riskLevel: 'read',
		description: 'Get sub-account history',
	},
	'account.getSubAccounts': {
		riskLevel: 'read',
		description: 'Retrieve all sub-accounts',
	},
	'account.getSubAccountsPlanList': {
		riskLevel: 'read',
		description: 'Retrieve available plans for a sub-account',
	},
	'account.getReferralsLevel1List': {
		riskLevel: 'read',
		description: 'Get the level 1 referrals list',
	},
	'account.getSubAccountBalance': {
		riskLevel: 'read',
		description: 'Get a sub-account balance',
	},
	'account.getSubAccountDetails': {
		riskLevel: 'read',
		description: 'Get sub-account details',
	},
	'account.getSubAccountHistoryDetails': {
		riskLevel: 'read',
		description: 'Get sub-account history details',
	},
	'account.linkAgencyAccount': {
		riskLevel: 'write',
		description: 'Link an agency account',
	},
	'account.shareListsWithSubAccounts': {
		riskLevel: 'write',
		description: 'Share contact lists with sub-accounts',
	},
	'account.updateLinkedAgencyAccount': {
		riskLevel: 'write',
		description: 'Update a linked agency account',
	},
	'account.updatePartnerProfile': {
		riskLevel: 'write',
		description: 'Update the partner profile',
	},
	'account.changePassword': {
		riskLevel: 'write',
		description: 'Change the password for the client account',
	},
	'account.changeSecurityPIN': {
		riskLevel: 'write',
		description: 'Change the security PIN for the client account',
	},
	'account.checkIfResponsive': {
		riskLevel: 'read',
		description: 'Check whether the client is responsive',
	},
	'account.disableSecurityPIN': {
		riskLevel: 'write',
		description: 'Disable the security PIN for the client account',
	},
	'account.getAllConfirmedEmails': {
		riskLevel: 'read',
		description: 'Retrieve all confirmed email addresses',
	},
	'account.getClientAccountSettings': {
		riskLevel: 'read',
		description: 'Get client account settings',
	},
	'account.getClientPlanInformation': {
		riskLevel: 'read',
		description: 'Get client plan information',
	},
	'account.getCurrentEmailAtTimeOfReset': {
		riskLevel: 'read',
		description: 'Get the current email at the time of a reset',
	},
	'account.getDMARCList': {
		riskLevel: 'read',
		description: 'Retrieve the DMARC list for the client account',
	},
	'account.getListOfConfirmedEmails': {
		riskLevel: 'read',
		description: 'Retrieve the list of confirmed email addresses',
	},
	'account.getClientDetails': {
		riskLevel: 'read',
		description: 'Get client details',
	},
	'account.getClientFilterDomain': {
		riskLevel: 'read',
		description: 'Get client filter domains',
	},
	'account.getClientProfileDetails': {
		riskLevel: 'read',
		description: 'Get client profile details',
	},
	'account.getClientsRatingRange': {
		riskLevel: 'read',
		description: 'Get the clients rating range',
	},
	'account.loginRedirectUsingToken': {
		riskLevel: 'write',
		description: 'Generate a login redirect token',
	},
	'account.patchUpdateClientSettings': {
		riskLevel: 'write',
		description: 'Update client account settings',
	},
	'account.resendConfirmEmail': {
		riskLevel: 'read',
		description: 'Resend a confirm email',
	},
	'account.saveSecurityPIN': {
		riskLevel: 'write',
		description: 'Save the security PIN',
	},
	'account.saveWebsiteDomain': {
		riskLevel: 'write',
		description: 'Save the website domain',
	},
	'account.sendPINViaEmail': {
		riskLevel: 'write',
		description: 'Send the security PIN via email',
	},
	'account.sendResetEmail': {
		riskLevel: 'write',
		description: 'Send a reset email',
	},
	'account.setResponsive': {
		riskLevel: 'write',
		description: 'Set the responsive flag',
	},
	'account.updateEditProfile': {
		riskLevel: 'write',
		description: 'Update the client profile',
	},
	'account.updateResetEmail': {
		riskLevel: 'write',
		description: 'Update or reset the account email',
	},
	'account.getNotification': {
		riskLevel: 'read',
		description: 'Get client notifications',
	},
	'account.getWebPageAdsDetail': {
		riskLevel: 'read',
		description: 'Get web page ads details',
	},
	'account.getHelpTopics': {
		riskLevel: 'read',
		description: 'Retrieve the list of help topics',
	},
	'account.generateSupportTicket': {
		riskLevel: 'write',
		description: 'Generate a support ticket',
	},
	'account.sendSupportFeedback': {
		riskLevel: 'write',
		description: 'Send support feedback',
	},
	'account.getCommunityDomain': {
		riskLevel: 'read',
		description: 'Get the community domain name for the client',
	},
	'account.getAccountSummary': {
		riskLevel: 'read',
		description: 'Get the account summary including image storage',
	},
	'integrations.assignProductToList': {
		riskLevel: 'write',
		description: 'Assign a Shopify product to a list',
	},
	'integrations.configureShopifyPurchaseList': {
		riskLevel: 'write',
		description: 'Configure the Shopify purchase list',
	},
	'integrations.connectService': {
		riskLevel: 'write',
		description: 'Connect a third-party service via OAuth URL',
	},
	'integrations.deleteProductAssociation': {
		riskLevel: 'destructive',
		description: 'Delete a Shopify product association',
	},
	'integrations.disconnectEtsyIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the Etsy integration',
	},
	'integrations.disconnectEventbriteIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the Eventbrite integration',
	},
	'integrations.disconnectFacebookEvents': {
		riskLevel: 'destructive',
		description: 'Disconnect the Facebook Events integration',
	},
	'integrations.disconnectFacebookIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the Facebook integration',
	},
	'integrations.disconnectInstagramIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the Instagram integration',
	},
	'integrations.disconnectLinkedInIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the LinkedIn integration',
	},
	'integrations.disconnectPinterestConnection': {
		riskLevel: 'destructive',
		description: 'Disconnect the Pinterest integration',
	},
	'integrations.disconnectSalesforceIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the Salesforce integration',
	},
	'integrations.disconnectShopify': {
		riskLevel: 'destructive',
		description: 'Disconnect the Shopify integration',
	},
	'integrations.disconnectTwitterIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the Twitter integration',
	},
	'integrations.disconnectEbayIntegration': {
		riskLevel: 'destructive',
		description: 'Disconnect the eBay integration',
	},
	'integrations.logOutTwitterTweets': {
		riskLevel: 'destructive',
		description: 'Log out of Twitter Tweets',
	},
	'integrations.getContactListsForShopify': {
		riskLevel: 'read',
		description: 'Get Shopify integration contact lists',
	},
	'integrations.getDigiohUsername': {
		riskLevel: 'read',
		description: 'Get the Digioh username',
	},
	'integrations.getEtsyStoreName': {
		riskLevel: 'read',
		description: 'Get the connected Etsy store name',
	},
	'integrations.getEventbriteUsername': {
		riskLevel: 'read',
		description: 'Get the Eventbrite username',
	},
	'integrations.getFacebookAccountHolder': {
		riskLevel: 'read',
		description: 'Get the Facebook account holder',
	},
	'integrations.getFacebookAccountName': {
		riskLevel: 'read',
		description: 'Get the Facebook account name',
	},
	'integrations.getIntegrationAuthURL': {
		riskLevel: 'read',
		description: 'Get the OAuth authorization URL for a service',
	},
	'integrations.getIntegrationConnectionList': {
		riskLevel: 'read',
		description: 'Get the editor integration connection list',
	},
	'integrations.getLinkedInToken': {
		riskLevel: 'read',
		description: 'Get LinkedIn integration token information',
	},
	'integrations.getShopifyProducts': {
		riskLevel: 'read',
		description: 'Get the list of Shopify products',
	},
	'integrations.getPaypalLists': {
		riskLevel: 'read',
		description: 'Get contact lists formatted for PayPal',
	},
	'integrations.getPaypalLink': {
		riskLevel: 'read',
		description: 'Get the PayPal integration link for a list',
	},
	'integrations.getPinterestUsername': {
		riskLevel: 'read',
		description: 'Get the Pinterest username',
	},
	'integrations.getSalesforceStatus': {
		riskLevel: 'read',
		description: 'Get the Salesforce integration status',
	},
	'integrations.getShopifyProductGrid': {
		riskLevel: 'read',
		description: 'Get the Shopify product list in tabular format',
	},
	'integrations.getTwitterLogin': {
		riskLevel: 'read',
		description: 'Get the Twitter login status',
	},
	'integrations.getUnbounceLink': {
		riskLevel: 'read',
		description: 'Get the Unbounce integration URL for a list',
	},
	'integrations.getUnbounceLists': {
		riskLevel: 'read',
		description: 'Get Unbounce contact lists',
	},
	'integrations.getEbaySellerID': {
		riskLevel: 'read',
		description: 'Get the eBay seller ID',
	},
	'integrations.getEbaySiteList': {
		riskLevel: 'read',
		description: 'Get the eBay site list',
	},
	'integrations.testEtsyIntegration': {
		riskLevel: 'read',
		description: 'Test the Etsy integration',
	},
	'integrations.testEventbriteIntegration': {
		riskLevel: 'read',
		description: 'Test the Eventbrite integration',
	},
	'integrations.testFacebookEventsIntegration': {
		riskLevel: 'read',
		description: 'Test the Facebook Events integration',
	},
	'integrations.testFacebookIntegration': {
		riskLevel: 'read',
		description: 'Test the Facebook integration',
	},
	'integrations.testLinkedInConnection': {
		riskLevel: 'read',
		description: 'Test the LinkedIn connection',
	},
	'integrations.testPinterestIntegration': {
		riskLevel: 'read',
		description: 'Test the Pinterest integration',
	},
	'integrations.testSalesforceIntegration': {
		riskLevel: 'read',
		description: 'Test the Salesforce integration',
	},
	'integrations.testTwitterIntegration': {
		riskLevel: 'read',
		description: 'Test the Twitter integration',
	},
	'integrations.testTwitterTweets': {
		riskLevel: 'read',
		description: 'Test Twitter Tweets',
	},
	'integrations.testEbayIntegration': {
		riskLevel: 'read',
		description: 'Test the eBay integration',
	},
	'webhooks.createWebhook': {
		riskLevel: 'write',
		description: 'Create a webhook for a contact list',
	},
	'webhooks.getWebhooks': {
		riskLevel: 'read',
		description: 'Retrieve all webhooks for a contact list',
	},
	'webhooks.deleteWebhook': {
		riskLevel: 'destructive',
		description: 'Delete a webhook from a contact list',
	},
	'webhooks.updateWebhook': {
		riskLevel: 'write',
		description: 'Update a webhook for a contact list',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof benchmarkEmailEndpointsNested
>;

export const benchmarkEmailAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBenchmarkEmailPlugin<T extends BenchmarkEmailPluginOptions> =
	CorsairPlugin<
		'benchmarkemail',
		typeof BenchmarkEmailSchema,
		typeof benchmarkEmailEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalBenchmarkEmailPlugin =
	BaseBenchmarkEmailPlugin<BenchmarkEmailPluginOptions>;

export type ExternalBenchmarkEmailPlugin<
	T extends BenchmarkEmailPluginOptions,
> = BaseBenchmarkEmailPlugin<T>;

export function benchmarkemail<const T extends BenchmarkEmailPluginOptions>(
	incomingOptions: BenchmarkEmailPluginOptions &
		T = {} as BenchmarkEmailPluginOptions & T,
): ExternalBenchmarkEmailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'benchmarkemail',
		authConfig: benchmarkEmailAuthConfig,
		schema: BenchmarkEmailSchema,
		options: options,
		hooks: options.hooks,
		endpoints: benchmarkEmailEndpointsNested,
		endpointMeta: benchmarkEmailEndpointMeta,
		endpointSchemas: benchmarkEmailEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BenchmarkEmailKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('benchmarkemail', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('benchmarkemail', 'api_key');
		},
	} satisfies InternalBenchmarkEmailPlugin;
}

export type {
	accountAddRemoveInboxTestsFromSubAccountInput,
	accountAddRemoveInboxTestsFromSubAccountResponse,
	accountChangePasswordInput,
	accountChangePasswordResponse,
	accountChangeSecurityPINInput,
	accountChangeSecurityPINResponse,
	accountCheckIfResponsiveInput,
	accountCheckIfResponsiveResponse,
	accountCopyImageToSubAccountInput,
	accountCopyImageToSubAccountResponse,
	accountDeleteLinkedAgencyAccountInput,
	accountDeleteLinkedAgencyAccountResponse,
	accountDisableSecurityPINInput,
	accountDisableSecurityPINResponse,
	accountGenerateSupportTicketInput,
	accountGenerateSupportTicketResponse,
	accountGetAccountSummaryInput,
	accountGetAccountSummaryResponse,
	accountGetAllConfirmedEmailsInput,
	accountGetAllConfirmedEmailsResponse,
	accountGetClientAccountSettingsInput,
	accountGetClientAccountSettingsResponse,
	accountGetClientDetailsInput,
	accountGetClientDetailsResponse,
	accountGetClientFilterDomainInput,
	accountGetClientFilterDomainResponse,
	accountGetClientPlanInformationInput,
	accountGetClientPlanInformationResponse,
	accountGetClientProfileDetailsInput,
	accountGetClientProfileDetailsResponse,
	accountGetClientsRatingRangeInput,
	accountGetClientsRatingRangeResponse,
	accountGetCommissionListInput,
	accountGetCommissionListResponse,
	accountGetCommunityDomainInput,
	accountGetCommunityDomainResponse,
	accountGetCurrentEmailAtTimeOfResetInput,
	accountGetCurrentEmailAtTimeOfResetResponse,
	accountGetDMARCListInput,
	accountGetDMARCListResponse,
	accountGetHelpTopicsInput,
	accountGetHelpTopicsResponse,
	accountGetLinkedAgencyAccountDetailsInput,
	accountGetLinkedAgencyAccountDetailsResponse,
	accountGetLinkedAgencyAccountsInput,
	accountGetLinkedAgencyAccountsResponse,
	accountGetListOfConfirmedEmailsInput,
	accountGetListOfConfirmedEmailsResponse,
	accountGetNotificationInput,
	accountGetNotificationResponse,
	accountGetPartnerProfileDetailsInput,
	accountGetPartnerProfileDetailsResponse,
	accountGetReferralsLevel1ListInput,
	accountGetReferralsLevel1ListResponse,
	accountGetReferralsListInput,
	accountGetReferralsListResponse,
	accountGetSubAccountBalanceInput,
	accountGetSubAccountBalanceResponse,
	accountGetSubAccountDetailsInput,
	accountGetSubAccountDetailsResponse,
	accountGetSubAccountHistoryDetailsInput,
	accountGetSubAccountHistoryDetailsResponse,
	accountGetSubAccountHistoryInput,
	accountGetSubAccountHistoryResponse,
	accountGetSubAccountsInput,
	accountGetSubAccountsPlanListInput,
	accountGetSubAccountsPlanListResponse,
	accountGetSubAccountsResponse,
	accountGetWebPageAdsDetailInput,
	accountGetWebPageAdsDetailResponse,
	accountLinkAgencyAccountInput,
	accountLinkAgencyAccountResponse,
	accountLoginRedirectUsingTokenInput,
	accountLoginRedirectUsingTokenResponse,
	accountPatchUpdateClientSettingsInput,
	accountPatchUpdateClientSettingsResponse,
	accountResendConfirmEmailInput,
	accountResendConfirmEmailResponse,
	accountSaveSecurityPINInput,
	accountSaveSecurityPINResponse,
	accountSaveWebsiteDomainInput,
	accountSaveWebsiteDomainResponse,
	accountSendPINViaEmailInput,
	accountSendPINViaEmailResponse,
	accountSendResetEmailInput,
	accountSendResetEmailResponse,
	accountSendSupportFeedbackInput,
	accountSendSupportFeedbackResponse,
	accountSetResponsiveInput,
	accountSetResponsiveResponse,
	accountShareListsWithSubAccountsInput,
	accountShareListsWithSubAccountsResponse,
	accountUpdateEditProfileInput,
	accountUpdateEditProfileResponse,
	accountUpdateLinkedAgencyAccountInput,
	accountUpdateLinkedAgencyAccountResponse,
	accountUpdatePartnerProfileInput,
	accountUpdatePartnerProfileResponse,
	accountUpdateResetEmailInput,
	accountUpdateResetEmailResponse,
	archiveAddEmailToArchiveInput,
	archiveAddEmailToArchiveResponse,
	archiveDeleteEmailFromArchiveInput,
	archiveDeleteEmailFromArchiveResponse,
	archiveGetArchiveDomainNameInput,
	archiveGetArchiveDomainNameResponse,
	archiveGetArchiveEmailDetailsInput,
	archiveGetArchiveEmailDetailsResponse,
	archiveGetArchiveEmailsInput,
	archiveGetArchiveEmailsResponse,
	archiveGetArchiveHomeDataInput,
	archiveGetArchiveHomeDataResponse,
	archiveGetArchiveHomePageInput,
	archiveGetArchiveHomePageResponse,
	archiveGetArchivePagesInput,
	archiveGetArchivePagesResponse,
	archiveGetDetailsAboutArchivePageInput,
	archiveGetDetailsAboutArchivePageResponse,
	archiveGetHTMLForArchiveNewsletterInput,
	archiveGetHTMLForArchiveNewsletterResponse,
	archiveGetHTMLForButtonInput,
	archiveGetHTMLForButtonResponse,
	archiveGetImageForButtonInput,
	archiveGetImageForButtonResponse,
	archiveUpdateArchiveHomePageDataInput,
	archiveUpdateArchiveHomePageDataResponse,
	archiveUpdateArchiveHomePageInput,
	archiveUpdateArchiveHomePageResponse,
	automationsAddEmailInAutomationInput,
	automationsAddEmailInAutomationResponse,
	automationsCopyEmailInAutomationInput,
	automationsCopyEmailInAutomationResponse,
	automationsCreateAutomationCopyInput,
	automationsCreateAutomationCopyResponse,
	automationsDeleteAutomationEmailInput,
	automationsDeleteAutomationEmailResponse,
	automationsDeleteAutomationInput,
	automationsDeleteAutomationResponse,
	automationsGetAutomationDetailsInput,
	automationsGetAutomationDetailsResponse,
	automationsGetAutomationEmailDetailsInput,
	automationsGetAutomationEmailDetailsResponse,
	automationsGetAutomationSummaryReportInput,
	automationsGetAutomationSummaryReportResponse,
	automationsUpdateEmailContentForAutomationInput,
	automationsUpdateEmailContentForAutomationResponse,
	BenchmarkEmailEndpointInputs,
	BenchmarkEmailEndpointOutputs,
	contactsAddContactToListInput,
	contactsAddContactToListResponse,
	contactsCleanContactListInput,
	contactsCleanContactListResponse,
	contactsCompareContactsInput,
	contactsCompareContactsResponse,
	contactsCopyBulkContactsInput,
	contactsCopyBulkContactsResponse,
	contactsCopyContactInput,
	contactsCopyContactResponse,
	contactsCreateSegmentCriteriaInput,
	contactsCreateSegmentCriteriaResponse,
	contactsCreateSegmentFromContactIDsInput,
	contactsCreateSegmentFromContactIDsResponse,
	contactsDeleteContactFromAllListsByIDInput,
	contactsDeleteContactFromAllListsByIDResponse,
	contactsDeleteContactFromListInput,
	contactsDeleteContactFromListResponse,
	contactsDeleteContactFromSearchInput,
	contactsDeleteContactFromSearchResponse,
	contactsDeleteContactsFromAllListsInput,
	contactsDeleteContactsFromAllListsResponse,
	contactsDeleteContactsFromCurrentListsInput,
	contactsDeleteContactsFromCurrentListsResponse,
	contactsDeleteSegmentCriteriaInput,
	contactsDeleteSegmentCriteriaResponse,
	contactsDeleteSegmentInput,
	contactsDeleteSegmentResponse,
	contactsDeleteTrashListInput,
	contactsDeleteTrashListResponse,
	contactsGetActiveContactCountInput,
	contactsGetActiveContactCountResponse,
	contactsGetCleanCountInput,
	contactsGetCleanCountResponse,
	contactsGetContactAuditHistoryDetailInput,
	contactsGetContactAuditHistoryDetailResponse,
	contactsGetContactAuditHistoryInput,
	contactsGetContactAuditHistoryResponse,
	contactsGetContactDetailsInput,
	contactsGetContactDetailsResponse,
	contactsGetContactImportStatusInput,
	contactsGetContactImportStatusResponse,
	contactsGetContactMergeListInput,
	contactsGetContactMergeListResponse,
	contactsGetContactsCountInput,
	contactsGetContactsCountResponse,
	contactsGetDownloadSegmentDataInput,
	contactsGetDownloadSegmentDataResponse,
	contactsGetFilteredContactsInput,
	contactsGetFilteredContactsResponse,
	contactsGetFilteredContactsWithExtraFieldsInput,
	contactsGetFilteredContactsWithExtraFieldsResponse,
	contactsGetNonContactCountInput,
	contactsGetNonContactCountResponse,
	contactsGetSegmentAutoGenerateNameInput,
	contactsGetSegmentAutoGenerateNameResponse,
	contactsGetSegmentByIDInput,
	contactsGetSegmentByIDResponse,
	contactsGetSegmentDetailsInput,
	contactsGetSegmentDetailsResponse,
	contactsGetSegmentListInput,
	contactsGetSegmentListResponse,
	contactsGetSegmentsInput,
	contactsGetSegmentsResponse,
	contactsGetTrashCountInput,
	contactsGetTrashCountResponse,
	contactsGetUniqueContactCountInput,
	contactsGetUniqueContactCountResponse,
	contactsMergeContactsIntoExistingListInput,
	contactsMergeContactsIntoExistingListResponse,
	contactsMergeContactsIntoNewListInput,
	contactsMergeContactsIntoNewListResponse,
	contactsMoveBulkContactsInput,
	contactsMoveBulkContactsResponse,
	contactsMoveContactsInput,
	contactsMoveContactsResponse,
	contactsMoveContactToDoNotContactListInput,
	contactsMoveContactToDoNotContactListResponse,
	contactsResendEmailsInput,
	contactsResendEmailsResponse,
	contactsSaveEmailAddressInput,
	contactsSaveEmailAddressResponse,
	contactsSaveVerifiedEmailAddressesInput,
	contactsSaveVerifiedEmailAddressesResponse,
	contactsSearchContactDetailsByEmailInput,
	contactsSearchContactDetailsByEmailResponse,
	contactsSendConfirmEmailVerificationInput,
	contactsSendConfirmEmailVerificationResponse,
	contactsUpdateContactDetailsInput,
	contactsUpdateContactDetailsResponse,
	contactsUpdateSegmentInput,
	contactsUpdateSegmentResponse,
	emailsAddEmailToCommunityInput,
	emailsAddEmailToCommunityResponse,
	emailsAddOrUpdateSchemeInput,
	emailsAddOrUpdateSchemeResponse,
	emailsCopyExistingEmailInput,
	emailsCopyExistingEmailResponse,
	emailsDeleteABSplitCampaignInput,
	emailsDeleteABSplitCampaignResponse,
	emailsDeleteABTestEmailInput,
	emailsDeleteABTestEmailResponse,
	emailsDeleteEmailCampaignInput,
	emailsDeleteEmailCampaignResponse,
	emailsGetABSplitDetailsInput,
	emailsGetABSplitDetailsResponse,
	emailsGetABSplitResultsInput,
	emailsGetABSplitResultsResponse,
	emailsGetABTestsInput,
	emailsGetABTestsResponse,
	emailsGetBadgesListInput,
	emailsGetBadgesListResponse,
	emailsGetCommunityCategoryInput,
	emailsGetCommunityCategoryResponse,
	emailsGetCommunityEmailByIDInput,
	emailsGetCommunityEmailByIDResponse,
	emailsGetEmailDetailsInput,
	emailsGetEmailDetailsResponse,
	emailsGetEmailPreviewInput,
	emailsGetEmailPreviewResponse,
	emailsGetEmailRecipientCountInput,
	emailsGetEmailRecipientCountResponse,
	emailsGetEmailSpamCheckInput,
	emailsGetEmailSpamCheckResponse,
	emailsGetEmailsInput,
	emailsGetEmailsResponse,
	emailsGetEmailTemplatesInput,
	emailsGetEmailTemplatesResponse,
	emailsGetLayoutListInput,
	emailsGetLayoutListResponse,
	emailsGetRSSHistoryByEmailIDInput,
	emailsGetRSSHistoryByEmailIDResponse,
	emailsGetSchemeInput,
	emailsGetSchemeResponse,
	emailsGetTemplateByIDInput,
	emailsGetTemplateByIDResponse,
	emailsGetTemplateCategoryByIDInput,
	emailsGetTemplateCategoryByIDResponse,
	emailsGetTemplateCategoryListInput,
	emailsGetTemplateCategoryListResponse,
	emailsInitiateEmailScreenCaptureInput,
	emailsInitiateEmailScreenCaptureResponse,
	emailsPermanentlyDeleteEmailFromTrashInput,
	emailsPermanentlyDeleteEmailFromTrashResponse,
	emailsRestoreEmailFromTrashInput,
	emailsRestoreEmailFromTrashResponse,
	emailsScheduleEmailCampaignInput,
	emailsScheduleEmailCampaignResponse,
	emailsShareTemplateToSubAccountsInput,
	emailsShareTemplateToSubAccountsResponse,
	emailsUpdateEmailCampaignInput,
	emailsUpdateEmailCampaignResponse,
	integrationsAssignProductToListInput,
	integrationsAssignProductToListResponse,
	integrationsConfigureShopifyPurchaseListInput,
	integrationsConfigureShopifyPurchaseListResponse,
	integrationsConnectServiceInput,
	integrationsConnectServiceResponse,
	integrationsDeleteProductAssociationInput,
	integrationsDeleteProductAssociationResponse,
	integrationsDisconnectEbayIntegrationInput,
	integrationsDisconnectEbayIntegrationResponse,
	integrationsDisconnectEtsyIntegrationInput,
	integrationsDisconnectEtsyIntegrationResponse,
	integrationsDisconnectEventbriteIntegrationInput,
	integrationsDisconnectEventbriteIntegrationResponse,
	integrationsDisconnectFacebookEventsInput,
	integrationsDisconnectFacebookEventsResponse,
	integrationsDisconnectFacebookIntegrationInput,
	integrationsDisconnectFacebookIntegrationResponse,
	integrationsDisconnectInstagramIntegrationInput,
	integrationsDisconnectInstagramIntegrationResponse,
	integrationsDisconnectLinkedInIntegrationInput,
	integrationsDisconnectLinkedInIntegrationResponse,
	integrationsDisconnectPinterestConnectionInput,
	integrationsDisconnectPinterestConnectionResponse,
	integrationsDisconnectSalesforceIntegrationInput,
	integrationsDisconnectSalesforceIntegrationResponse,
	integrationsDisconnectShopifyInput,
	integrationsDisconnectShopifyResponse,
	integrationsDisconnectTwitterIntegrationInput,
	integrationsDisconnectTwitterIntegrationResponse,
	integrationsGetContactListsForShopifyInput,
	integrationsGetContactListsForShopifyResponse,
	integrationsGetDigiohUsernameInput,
	integrationsGetDigiohUsernameResponse,
	integrationsGetEbaySellerIDInput,
	integrationsGetEbaySellerIDResponse,
	integrationsGetEbaySiteListInput,
	integrationsGetEbaySiteListResponse,
	integrationsGetEtsyStoreNameInput,
	integrationsGetEtsyStoreNameResponse,
	integrationsGetEventbriteUsernameInput,
	integrationsGetEventbriteUsernameResponse,
	integrationsGetFacebookAccountHolderInput,
	integrationsGetFacebookAccountHolderResponse,
	integrationsGetFacebookAccountNameInput,
	integrationsGetFacebookAccountNameResponse,
	integrationsGetIntegrationAuthURLInput,
	integrationsGetIntegrationAuthURLResponse,
	integrationsGetIntegrationConnectionListInput,
	integrationsGetIntegrationConnectionListResponse,
	integrationsGetLinkedInTokenInput,
	integrationsGetLinkedInTokenResponse,
	integrationsGetPaypalLinkInput,
	integrationsGetPaypalLinkResponse,
	integrationsGetPaypalListsInput,
	integrationsGetPaypalListsResponse,
	integrationsGetPinterestUsernameInput,
	integrationsGetPinterestUsernameResponse,
	integrationsGetSalesforceStatusInput,
	integrationsGetSalesforceStatusResponse,
	integrationsGetShopifyProductGridInput,
	integrationsGetShopifyProductGridResponse,
	integrationsGetShopifyProductsInput,
	integrationsGetShopifyProductsResponse,
	integrationsGetTwitterLoginInput,
	integrationsGetTwitterLoginResponse,
	integrationsGetUnbounceLinkInput,
	integrationsGetUnbounceLinkResponse,
	integrationsGetUnbounceListsInput,
	integrationsGetUnbounceListsResponse,
	integrationsLogOutTwitterTweetsInput,
	integrationsLogOutTwitterTweetsResponse,
	integrationsTestEbayIntegrationInput,
	integrationsTestEbayIntegrationResponse,
	integrationsTestEtsyIntegrationInput,
	integrationsTestEtsyIntegrationResponse,
	integrationsTestEventbriteIntegrationInput,
	integrationsTestEventbriteIntegrationResponse,
	integrationsTestFacebookEventsIntegrationInput,
	integrationsTestFacebookEventsIntegrationResponse,
	integrationsTestFacebookIntegrationInput,
	integrationsTestFacebookIntegrationResponse,
	integrationsTestLinkedInConnectionInput,
	integrationsTestLinkedInConnectionResponse,
	integrationsTestPinterestIntegrationInput,
	integrationsTestPinterestIntegrationResponse,
	integrationsTestSalesforceIntegrationInput,
	integrationsTestSalesforceIntegrationResponse,
	integrationsTestTwitterIntegrationInput,
	integrationsTestTwitterIntegrationResponse,
	integrationsTestTwitterTweetsInput,
	integrationsTestTwitterTweetsResponse,
	listsCreateContactListInput,
	listsCreateContactListResponse,
	listsDeleteContactListInput,
	listsDeleteContactListResponse,
	listsDeleteListInput,
	listsDeleteListResponse,
	listsGetContactListDeepViewInput,
	listsGetContactListDeepViewResponse,
	listsGetContactListDetailsInput,
	listsGetContactListDetailsResponse,
	listsGetContactListFieldNamesInput,
	listsGetContactListFieldNamesResponse,
	listsGetContactListSummaryInput,
	listsGetContactListSummaryResponse,
	listsGetContactListsInput,
	listsGetContactListsResponse,
	listsGetDeleteListCheckInput,
	listsGetDeleteListCheckResponse,
	listsGetListUploadTermsInput,
	listsGetListUploadTermsResponse,
	listsRestoreTrashListInput,
	listsRestoreTrashListResponse,
	listsUpdateContactListInput,
	listsUpdateContactListResponse,
	mediaCreateInboxInput,
	mediaCreateInboxResponse,
	mediaDeleteImageInput,
	mediaDeleteImageResponse,
	mediaDeleteInboxInput,
	mediaDeleteInboxResponse,
	mediaDeleteVideoInput,
	mediaDeleteVideoResponse,
	mediaGetGiphyImagesInput,
	mediaGetGiphyImagesResponse,
	mediaGetImageDetailsInput,
	mediaGetImageDetailsResponse,
	mediaGetImagesInput,
	mediaGetImagesResponse,
	mediaGetInboxDetailResultInput,
	mediaGetInboxDetailResultResponse,
	mediaGetInboxListInput,
	mediaGetInboxListResponse,
	mediaGetInboxMasterResultInput,
	mediaGetInboxMasterResultResponse,
	mediaGetVideoDetailsInput,
	mediaGetVideoDetailsResponse,
	mediaShareVideoInput,
	mediaShareVideoResponse,
	mediaUploadVideoInput,
	mediaUploadVideoResponse,
	pollsCopyPollInput,
	pollsCopyPollResponse,
	pollsCreatePollInput,
	pollsCreatePollResponse,
	pollsDeletePollInput,
	pollsDeletePollResponse,
	pollsGetPollDetailsInput,
	pollsGetPollDetailsResponse,
	pollsGetPollPreviewInput,
	pollsGetPollPreviewResponse,
	pollsGetPollResponseReportInput,
	pollsGetPollResponseReportResponse,
	pollsGetPollsInput,
	pollsGetPollsResponse,
	pollsUpdatePollInput,
	pollsUpdatePollResponse,
	reportsDownloadContactReportInput,
	reportsDownloadContactReportResponse,
	reportsGetABTestReportInput,
	reportsGetABTestReportResponse,
	reportsGetAbuseCampaignReportByEmailIDInput,
	reportsGetAbuseCampaignReportByEmailIDResponse,
	reportsGetAbuseReportInput,
	reportsGetAbuseReportResponse,
	reportsGetBouncesReportByEmailIDInput,
	reportsGetBouncesReportByEmailIDResponse,
	reportsGetCampaignEngagementListInput,
	reportsGetCampaignEngagementListResponse,
	reportsGetCampaignHistoryByEmailIDInput,
	reportsGetCampaignHistoryByEmailIDResponse,
	reportsGetClickContactCountInput,
	reportsGetClickContactCountResponse,
	reportsGetClickHeatMapByEmailIDInput,
	reportsGetClickHeatMapByEmailIDResponse,
	reportsGetClickPerformanceByEmailIDInput,
	reportsGetClickPerformanceByEmailIDResponse,
	reportsGetClickPerformanceDetailsByEmailInput,
	reportsGetClickPerformanceDetailsByEmailResponse,
	reportsGetClicksReportByEmailIDInput,
	reportsGetClicksReportByEmailIDResponse,
	reportsGetClickURLContactCountInput,
	reportsGetClickURLContactCountResponse,
	reportsGetContactReportHistoryInput,
	reportsGetContactReportHistoryResponse,
	reportsGetDownloadReportInput,
	reportsGetDownloadReportResponse,
	reportsGetEmailOpensByCountryRegionInput,
	reportsGetEmailOpensByCountryRegionResponse,
	reportsGetEmailReportForwardsInput,
	reportsGetEmailReportForwardsResponse,
	reportsGetEmailReportInput,
	reportsGetEmailReportResponse,
	reportsGetForwardsReportByEmailIDInput,
	reportsGetForwardsReportByEmailIDResponse,
	reportsGetLinkDetailByEmailIDInput,
	reportsGetLinkDetailByEmailIDResponse,
	reportsGetOpenContactCountInput,
	reportsGetOpenContactCountResponse,
	reportsGetOpensHourlyReportByEmailInput,
	reportsGetOpensHourlyReportByEmailResponse,
	reportsGetOpensLocationReportByEmailInput,
	reportsGetOpensLocationReportByEmailResponse,
	reportsGetOpensLocationReportInput,
	reportsGetOpensLocationReportResponse,
	reportsGetOpensReportInput,
	reportsGetOpensReportResponse,
	reportsGetReportDetailsByABTestInput,
	reportsGetReportDetailsByABTestResponse,
	reportsGetReportDetailsByEmailIDInput,
	reportsGetReportDetailsByEmailIDResponse,
	reportsGetReportDownloadInput,
	reportsGetReportDownloadResponse,
	reportsGetReportsForAutorespondersInput,
	reportsGetReportsForAutorespondersResponse,
	reportsGetSaveAsListInput,
	reportsGetSaveAsListResponse,
	reportsGetSocialPerformanceReportInput,
	reportsGetSocialPerformanceReportResponse,
	reportsGetUnopensReportByEmailIDInput,
	reportsGetUnopensReportByEmailIDResponse,
	reportsGetUnopensReportInput,
	reportsGetUnopensReportResponse,
	reportsGetUnsubscribeReportByEmailIDInput,
	reportsGetUnsubscribeReportByEmailIDResponse,
	reportsGetURLEngagementListInput,
	reportsGetURLEngagementListResponse,
	reportsGetURLListByEmailIDInput,
	reportsGetURLListByEmailIDResponse,
	reportsUpdateListCompilationDetailsInput,
	reportsUpdateListCompilationDetailsResponse,
	signupFormsCopySignupFormInput,
	signupFormsCopySignupFormResponse,
	signupFormsCreateSignupFormInput,
	signupFormsCreateSignupFormResponse,
	signupFormsGetHTMLSignupFormInput,
	signupFormsGetHTMLSignupFormResponse,
	signupFormsGetMagentoHTMLDropdownInput,
	signupFormsGetMagentoHTMLDropdownResponse,
	signupFormsGetMagentoHTMLSelectedInput,
	signupFormsGetMagentoHTMLSelectedResponse,
	signupFormsGetSignupFormButtonCodeInput,
	signupFormsGetSignupFormButtonCodeResponse,
	signupFormsGetSignupFormContactFieldsInput,
	signupFormsGetSignupFormContactFieldsResponse,
	signupFormsGetSignupFormDetailsInput,
	signupFormsGetSignupFormDetailsResponse,
	signupFormsGetSignupFormForMagentoInput,
	signupFormsGetSignupFormForMagentoResponse,
	signupFormsGetSignupFormForUnbounceInput,
	signupFormsGetSignupFormForUnbounceResponse,
	signupFormsGetSignupFormLinkInput,
	signupFormsGetSignupFormLinkResponse,
	signupFormsGetSignupFormListInput,
	signupFormsGetSignupFormListResponse,
	signupFormsGetSignupFormsForContactListInput,
	signupFormsGetSignupFormsForContactListResponse,
	signupFormsGetSignupFormTumblerInput,
	signupFormsGetSignupFormTumblerResponse,
	signupFormsGetTemplatesForSignupFormClassicInput,
	signupFormsGetTemplatesForSignupFormClassicResponse,
	signupFormsGetTumblerListsInput,
	signupFormsGetTumblerListsResponse,
	signupFormsSendTestEmailForSignupFormInput,
	signupFormsSendTestEmailForSignupFormResponse,
	surveysDeleteSurveyInput,
	surveysDeleteSurveyResponse,
	surveysGetSurveyDetailsInput,
	surveysGetSurveyDetailsResponse,
	surveysGetSurveyFullReportInput,
	surveysGetSurveyFullReportResponse,
	surveysGetSurveyIndividualQuestionResultInput,
	surveysGetSurveyIndividualQuestionResultResponse,
	surveysGetSurveyIndividualResultsInput,
	surveysGetSurveyIndividualResultsResponse,
	surveysGetSurveyReportAnswerCommentInput,
	surveysGetSurveyReportAnswerCommentResponse,
	surveysGetSurveyReportAnswerOtherInput,
	surveysGetSurveyReportAnswerOtherResponse,
	surveysGetSurveyReportAnswerTextInput,
	surveysGetSurveyReportAnswerTextResponse,
	surveysGetSurveyReportDetailInput,
	surveysGetSurveyReportDetailResponse,
	surveysGetSurveyReportListInput,
	surveysGetSurveyReportListResponse,
	surveysGetSurveyTemplateListInput,
	surveysGetSurveyTemplateListResponse,
	surveysUpdateSurveyStatusInput,
	surveysUpdateSurveyStatusResponse,
	webhooksCreateWebhookInput,
	webhooksCreateWebhookResponse,
	webhooksDeleteWebhookInput,
	webhooksDeleteWebhookResponse,
	webhooksGetWebhooksInput,
	webhooksGetWebhooksResponse,
	webhooksUpdateWebhookInput,
	webhooksUpdateWebhookResponse,
} from './endpoints/types';
