import type {
	AuthTypes,
	BindEndpoints,
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
import type { ForceManagerEnvironment } from './client';
import { ForceManagerEndpoints as forceManagerEndpointsNested } from './endpoints';
import { operationDefinitions } from './endpoints/definitions';
import type {
	ForceManagerEndpointInputs,
	ForceManagerEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ForceManagerSchema } from './schema';

export type ForceManagerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	environment?: ForceManagerEnvironment;
	hooks?: InternalForceManagerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof forceManagerEndpointsNested>;
};

export type ForceManagerContext = CorsairPluginContext<
	typeof ForceManagerSchema,
	ForceManagerPluginOptions
>;
export type ForceManagerKeyBuilderContext =
	KeyBuilderContext<ForceManagerPluginOptions>;
export type ForceManagerBoundEndpoints = BindEndpoints<
	typeof forceManagerEndpointsNested
>;
export type ForceManagerEndpoints = ForceManagerBoundEndpoints;

export const forceManagerEndpointSchemas = {
	'accountAddresses.accountAddressesSchema': {
		input: operationDefinitions['accountAddressesSchema'].input,
		output: operationDefinitions['accountAddressesSchema'].output,
	},
	'accountAddresses.listAccountAddresses': {
		input: operationDefinitions['listAccountAddresses'].input,
		output: operationDefinitions['listAccountAddresses'].output,
	},
	'accountAddresses.createAccountAddress': {
		input: operationDefinitions['createAccountAddress'].input,
		output: operationDefinitions['createAccountAddress'].output,
	},
	'accountAddresses.getAccountAddress': {
		input: operationDefinitions['getAccountAddress'].input,
		output: operationDefinitions['getAccountAddress'].output,
	},
	'accountAddresses.updateAccountAddress': {
		input: operationDefinitions['updateAccountAddress'].input,
		output: operationDefinitions['updateAccountAddress'].output,
	},
	'accountAddresses.deleteAccountAddress': {
		input: operationDefinitions['deleteAccountAddress'].input,
		output: operationDefinitions['deleteAccountAddress'].output,
	},
	'accountsEntity.accountsSchema': {
		input: operationDefinitions['accountsSchema'].input,
		output: operationDefinitions['accountsSchema'].output,
	},
	'accountsEntity.listAccounts': {
		input: operationDefinitions['listAccounts'].input,
		output: operationDefinitions['listAccounts'].output,
	},
	'accountsEntity.createAccount': {
		input: operationDefinitions['createAccount'].input,
		output: operationDefinitions['createAccount'].output,
	},
	'accountsEntity.getAccount': {
		input: operationDefinitions['getAccount'].input,
		output: operationDefinitions['getAccount'].output,
	},
	'accountsEntity.updateAccount': {
		input: operationDefinitions['updateAccount'].input,
		output: operationDefinitions['updateAccount'].output,
	},
	'accountsEntity.deleteAccount': {
		input: operationDefinitions['deleteAccount'].input,
		output: operationDefinitions['deleteAccount'].output,
	},
	'accountsTypes.accountTypesSchema': {
		input: operationDefinitions['accountTypesSchema'].input,
		output: operationDefinitions['accountTypesSchema'].output,
	},
	'accountsTypes.listAccountTypes': {
		input: operationDefinitions['listAccountTypes'].input,
		output: operationDefinitions['listAccountTypes'].output,
	},
	'accountsTypes.createAccountType': {
		input: operationDefinitions['createAccountType'].input,
		output: operationDefinitions['createAccountType'].output,
	},
	'accountsTypes.getAccountType': {
		input: operationDefinitions['getAccountType'].input,
		output: operationDefinitions['getAccountType'].output,
	},
	'accountsTypes.updateAccountType': {
		input: operationDefinitions['updateAccountType'].input,
		output: operationDefinitions['updateAccountType'].output,
	},
	'accountsTypes.deleteAccountType': {
		input: operationDefinitions['deleteAccountType'].input,
		output: operationDefinitions['deleteAccountType'].output,
	},
	'accountsSegments.accountSegmentsSchema': {
		input: operationDefinitions['accountSegmentsSchema'].input,
		output: operationDefinitions['accountSegmentsSchema'].output,
	},
	'accountsSegments.listAccountSegments': {
		input: operationDefinitions['listAccountSegments'].input,
		output: operationDefinitions['listAccountSegments'].output,
	},
	'accountsSegments.createAccountSegment': {
		input: operationDefinitions['createAccountSegment'].input,
		output: operationDefinitions['createAccountSegment'].output,
	},
	'accountsSegments.getAccountSegment': {
		input: operationDefinitions['getAccountSegment'].input,
		output: operationDefinitions['getAccountSegment'].output,
	},
	'accountsSegments.updateAccountSegment': {
		input: operationDefinitions['updateAccountSegment'].input,
		output: operationDefinitions['updateAccountSegment'].output,
	},
	'accountsSegments.deleteAccountSegment': {
		input: operationDefinitions['deleteAccountSegment'].input,
		output: operationDefinitions['deleteAccountSegment'].output,
	},
	'accountsStatuses.accountStatusesSchema': {
		input: operationDefinitions['accountStatusesSchema'].input,
		output: operationDefinitions['accountStatusesSchema'].output,
	},
	'accountsStatuses.listAccountStatuses': {
		input: operationDefinitions['listAccountStatuses'].input,
		output: operationDefinitions['listAccountStatuses'].output,
	},
	'accountsStatuses.createAccountStatus': {
		input: operationDefinitions['createAccountStatus'].input,
		output: operationDefinitions['createAccountStatus'].output,
	},
	'accountsStatuses.getAccountStatus': {
		input: operationDefinitions['getAccountStatus'].input,
		output: operationDefinitions['getAccountStatus'].output,
	},
	'accountsStatuses.updateAccountStatus': {
		input: operationDefinitions['updateAccountStatus'].input,
		output: operationDefinitions['updateAccountStatus'].output,
	},
	'accountsStatuses.deleteAccountStatus': {
		input: operationDefinitions['deleteAccountStatus'].input,
		output: operationDefinitions['deleteAccountStatus'].output,
	},
	'activitiesEntity.activitiesSchema': {
		input: operationDefinitions['activitiesSchema'].input,
		output: operationDefinitions['activitiesSchema'].output,
	},
	'activitiesEntity.listActivities': {
		input: operationDefinitions['listActivities'].input,
		output: operationDefinitions['listActivities'].output,
	},
	'activitiesEntity.createActivity': {
		input: operationDefinitions['createActivity'].input,
		output: operationDefinitions['createActivity'].output,
	},
	'activitiesEntity.getActivity': {
		input: operationDefinitions['getActivity'].input,
		output: operationDefinitions['getActivity'].output,
	},
	'activitiesEntity.updateActivity': {
		input: operationDefinitions['updateActivity'].input,
		output: operationDefinitions['updateActivity'].output,
	},
	'activitiesEntity.deleteActivity': {
		input: operationDefinitions['deleteActivity'].input,
		output: operationDefinitions['deleteActivity'].output,
	},
	'activitiesTypes.activityTypesSchema': {
		input: operationDefinitions['activityTypesSchema'].input,
		output: operationDefinitions['activityTypesSchema'].output,
	},
	'activitiesTypes.listActivityTypes': {
		input: operationDefinitions['listActivityTypes'].input,
		output: operationDefinitions['listActivityTypes'].output,
	},
	'activitiesTypes.createActivityType': {
		input: operationDefinitions['createActivityType'].input,
		output: operationDefinitions['createActivityType'].output,
	},
	'activitiesTypes.getActivityType': {
		input: operationDefinitions['getActivityType'].input,
		output: operationDefinitions['getActivityType'].output,
	},
	'activitiesTypes.updateActivityType': {
		input: operationDefinitions['updateActivityType'].input,
		output: operationDefinitions['updateActivityType'].output,
	},
	'activitiesTypes.deleteActivityType': {
		input: operationDefinitions['deleteActivityType'].input,
		output: operationDefinitions['deleteActivityType'].output,
	},
	'activitiesPoints.listActivityPoints': {
		input: operationDefinitions['listActivityPoints'].input,
		output: operationDefinitions['listActivityPoints'].output,
	},
	'activitiesPoints.updateActivityPoints': {
		input: operationDefinitions['updateActivityPoints'].input,
		output: operationDefinitions['updateActivityPoints'].output,
	},
	'branches.branchesSchema': {
		input: operationDefinitions['branchesSchema'].input,
		output: operationDefinitions['branchesSchema'].output,
	},
	'branches.listBranches': {
		input: operationDefinitions['listBranches'].input,
		output: operationDefinitions['listBranches'].output,
	},
	'branches.getBranch': {
		input: operationDefinitions['getBranch'].input,
		output: operationDefinitions['getBranch'].output,
	},
	'branches.deleteBranch': {
		input: operationDefinitions['deleteBranch'].input,
		output: operationDefinitions['deleteBranch'].output,
	},
	'bulks.bulkCreateResources': {
		input: operationDefinitions['bulkCreateResources'].input,
		output: operationDefinitions['bulkCreateResources'].output,
	},
	'bulks.bulkUpdateResources': {
		input: operationDefinitions['bulkUpdateResources'].input,
		output: operationDefinitions['bulkUpdateResources'].output,
	},
	'bulks.bulkDeleteResources': {
		input: operationDefinitions['bulkDeleteResources'].input,
		output: operationDefinitions['bulkDeleteResources'].output,
	},
	'calls.listCalls': {
		input: operationDefinitions['listCalls'].input,
		output: operationDefinitions['listCalls'].output,
	},
	'calls.createCallByUserId': {
		input: operationDefinitions['createCallByUserId'].input,
		output: operationDefinitions['createCallByUserId'].output,
	},
	'calls.createCallByUserPhoneNumber': {
		input: operationDefinitions['createCallByUserPhoneNumber'].input,
		output: operationDefinitions['createCallByUserPhoneNumber'].output,
	},
	'calls.getCall': {
		input: operationDefinitions['getCall'].input,
		output: operationDefinitions['getCall'].output,
	},
	'calls.updateCall': {
		input: operationDefinitions['updateCall'].input,
		output: operationDefinitions['updateCall'].output,
	},
	'calls.deleteCall': {
		input: operationDefinitions['deleteCall'].input,
		output: operationDefinitions['deleteCall'].output,
	},
	'calls.getResourcesByPhoneNumber': {
		input: operationDefinitions['getResourcesByPhoneNumber'].input,
		output: operationDefinitions['getResourcesByPhoneNumber'].output,
	},
	'campaignsEntity.listCampaigns': {
		input: operationDefinitions['listCampaigns'].input,
		output: operationDefinitions['listCampaigns'].output,
	},
	'campaignsEntity.createCampaign': {
		input: operationDefinitions['createCampaign'].input,
		output: operationDefinitions['createCampaign'].output,
	},
	'campaignsEntity.getCampaign': {
		input: operationDefinitions['getCampaign'].input,
		output: operationDefinitions['getCampaign'].output,
	},
	'campaignsEntity.updateCampaign': {
		input: operationDefinitions['updateCampaign'].input,
		output: operationDefinitions['updateCampaign'].output,
	},
	'campaignsEntity.deleteCampaign': {
		input: operationDefinitions['deleteCampaign'].input,
		output: operationDefinitions['deleteCampaign'].output,
	},
	'opportunitiesTypes.listOpportunityTypes': {
		input: operationDefinitions['listOpportunityTypes'].input,
		output: operationDefinitions['listOpportunityTypes'].output,
	},
	'opportunitiesTypes.createOpportunityType': {
		input: operationDefinitions['createOpportunityType'].input,
		output: operationDefinitions['createOpportunityType'].output,
	},
	'campaignsStatuses.listCampaignStatuses': {
		input: operationDefinitions['listCampaignStatuses'].input,
		output: operationDefinitions['listCampaignStatuses'].output,
	},
	'campaignsAccounts.listCampaignAccounts': {
		input: operationDefinitions['listCampaignAccounts'].input,
		output: operationDefinitions['listCampaignAccounts'].output,
	},
	'campaignsAccounts.createCampaignAccount': {
		input: operationDefinitions['createCampaignAccount'].input,
		output: operationDefinitions['createCampaignAccount'].output,
	},
	'campaignsAccounts.getCampaignAccount': {
		input: operationDefinitions['getCampaignAccount'].input,
		output: operationDefinitions['getCampaignAccount'].output,
	},
	'campaignsAccounts.updateCampaignAccount': {
		input: operationDefinitions['updateCampaignAccount'].input,
		output: operationDefinitions['updateCampaignAccount'].output,
	},
	'campaignsAccounts.deleteCampaignAccount': {
		input: operationDefinitions['deleteCampaignAccount'].input,
		output: operationDefinitions['deleteCampaignAccount'].output,
	},
	'campaignsQuestions.listCampaignQuestions': {
		input: operationDefinitions['listCampaignQuestions'].input,
		output: operationDefinitions['listCampaignQuestions'].output,
	},
	'campaignsQuestions.createCampaignQuestion': {
		input: operationDefinitions['createCampaignQuestion'].input,
		output: operationDefinitions['createCampaignQuestion'].output,
	},
	'campaignsQuestions.getCampaignQuestion': {
		input: operationDefinitions['getCampaignQuestion'].input,
		output: operationDefinitions['getCampaignQuestion'].output,
	},
	'campaignsQuestions.updateCampaignQuestion': {
		input: operationDefinitions['updateCampaignQuestion'].input,
		output: operationDefinitions['updateCampaignQuestion'].output,
	},
	'campaignsQuestions.deleteCampaignQuestion': {
		input: operationDefinitions['deleteCampaignQuestion'].input,
		output: operationDefinitions['deleteCampaignQuestion'].output,
	},
	'campaignsQuestionAnswers.listQuestionAnswers': {
		input: operationDefinitions['listQuestionAnswers'].input,
		output: operationDefinitions['listQuestionAnswers'].output,
	},
	'campaignsQuestionAnswers.createQuestionAnswer': {
		input: operationDefinitions['createQuestionAnswer'].input,
		output: operationDefinitions['createQuestionAnswer'].output,
	},
	'campaignsQuestionAnswers.getQuestionAnswer': {
		input: operationDefinitions['getQuestionAnswer'].input,
		output: operationDefinitions['getQuestionAnswer'].output,
	},
	'campaignsQuestionAnswers.updateQuestionAnswer': {
		input: operationDefinitions['updateQuestionAnswer'].input,
		output: operationDefinitions['updateQuestionAnswer'].output,
	},
	'campaignsQuestionAnswers.deleteQuestionAnswer': {
		input: operationDefinitions['deleteQuestionAnswer'].input,
		output: operationDefinitions['deleteQuestionAnswer'].output,
	},
	'campaignsQuestionValues.listQuestionValues': {
		input: operationDefinitions['listQuestionValues'].input,
		output: operationDefinitions['listQuestionValues'].output,
	},
	'campaignsQuestionValues.createQuestionValue': {
		input: operationDefinitions['createQuestionValue'].input,
		output: operationDefinitions['createQuestionValue'].output,
	},
	'campaignsQuestionValues.getQuestionValue': {
		input: operationDefinitions['getQuestionValue'].input,
		output: operationDefinitions['getQuestionValue'].output,
	},
	'campaignsQuestionValues.updateQuestionValue': {
		input: operationDefinitions['updateQuestionValue'].input,
		output: operationDefinitions['updateQuestionValue'].output,
	},
	'campaignsQuestionValues.deleteQuestionValue': {
		input: operationDefinitions['deleteQuestionValue'].input,
		output: operationDefinitions['deleteQuestionValue'].output,
	},
	'contactsEntity.contactsSchema': {
		input: operationDefinitions['contactsSchema'].input,
		output: operationDefinitions['contactsSchema'].output,
	},
	'contactsEntity.listContacts': {
		input: operationDefinitions['listContacts'].input,
		output: operationDefinitions['listContacts'].output,
	},
	'contactsEntity.createContact': {
		input: operationDefinitions['createContact'].input,
		output: operationDefinitions['createContact'].output,
	},
	'contactsEntity.getContact': {
		input: operationDefinitions['getContact'].input,
		output: operationDefinitions['getContact'].output,
	},
	'contactsEntity.updateContact': {
		input: operationDefinitions['updateContact'].input,
		output: operationDefinitions['updateContact'].output,
	},
	'contactsEntity.deleteContact': {
		input: operationDefinitions['deleteContact'].input,
		output: operationDefinitions['deleteContact'].output,
	},
	'contactsTypes.contactTypesSchema': {
		input: operationDefinitions['contactTypesSchema'].input,
		output: operationDefinitions['contactTypesSchema'].output,
	},
	'contactsTypes.listContactTypes': {
		input: operationDefinitions['listContactTypes'].input,
		output: operationDefinitions['listContactTypes'].output,
	},
	'contactsTypes.createContactType': {
		input: operationDefinitions['createContactType'].input,
		output: operationDefinitions['createContactType'].output,
	},
	'contactsTypes.getContactType': {
		input: operationDefinitions['getContactType'].input,
		output: operationDefinitions['getContactType'].output,
	},
	'contactsTypes.updateContactType': {
		input: operationDefinitions['updateContactType'].input,
		output: operationDefinitions['updateContactType'].output,
	},
	'contactsTypes.deleteContactType': {
		input: operationDefinitions['deleteContactType'].input,
		output: operationDefinitions['deleteContactType'].output,
	},
	'countries.countriesSchema': {
		input: operationDefinitions['countriesSchema'].input,
		output: operationDefinitions['countriesSchema'].output,
	},
	'countries.listCountries': {
		input: operationDefinitions['listCountries'].input,
		output: operationDefinitions['listCountries'].output,
	},
	'currencies.currenciesSchema': {
		input: operationDefinitions['currenciesSchema'].input,
		output: operationDefinitions['currenciesSchema'].output,
	},
	'currencies.listCurrencies': {
		input: operationDefinitions['listCurrencies'].input,
		output: operationDefinitions['listCurrencies'].output,
	},
	'documentsEntity.listDocuments': {
		input: operationDefinitions['listDocuments'].input,
		output: operationDefinitions['listDocuments'].output,
	},
	'documentsEntity.listDocumentsOfAResource': {
		input: operationDefinitions['listDocumentsOfAResource'].input,
		output: operationDefinitions['listDocumentsOfAResource'].output,
	},
	'productsCarousel.deletePicture': {
		input: operationDefinitions['deletePicture'].input,
		output: operationDefinitions['deletePicture'].output,
	},
	'documentsFolders.listFolders': {
		input: operationDefinitions['listFolders'].input,
		output: operationDefinitions['listFolders'].output,
	},
	'documentsFolders.createFolder': {
		input: operationDefinitions['createFolder'].input,
		output: operationDefinitions['createFolder'].output,
	},
	'documentsFolders.listFoldersOfAResource': {
		input: operationDefinitions['listFoldersOfAResource'].input,
		output: operationDefinitions['listFoldersOfAResource'].output,
	},
	'documentsFolders.createFolderForAResource': {
		input: operationDefinitions['createFolderForAResource'].input,
		output: operationDefinitions['createFolderForAResource'].output,
	},
	'emails.emailsSchema': {
		input: operationDefinitions['emailsSchema'].input,
		output: operationDefinitions['emailsSchema'].output,
	},
	'emails.listEmails': {
		input: operationDefinitions['listEmails'].input,
		output: operationDefinitions['listEmails'].output,
	},
	'emails.createEmail': {
		input: operationDefinitions['createEmail'].input,
		output: operationDefinitions['createEmail'].output,
	},
	'emails.getEmail': {
		input: operationDefinitions['getEmail'].input,
		output: operationDefinitions['getEmail'].output,
	},
	'entityContacts.entityContactsSchema': {
		input: operationDefinitions['entityContactsSchema'].input,
		output: operationDefinitions['entityContactsSchema'].output,
	},
	'entityContacts.listEntityContacts': {
		input: operationDefinitions['listEntityContacts'].input,
		output: operationDefinitions['listEntityContacts'].output,
	},
	'entityOwners.entityOwnersSchema': {
		input: operationDefinitions['entityOwnersSchema'].input,
		output: operationDefinitions['entityOwnersSchema'].output,
	},
	'entityOwners.listEntityOwners': {
		input: operationDefinitions['listEntityOwners'].input,
		output: operationDefinitions['listEntityOwners'].output,
	},
	'eventsTasks.calendarSchema': {
		input: operationDefinitions['calendarSchema'].input,
		output: operationDefinitions['calendarSchema'].output,
	},
	'eventsTasks.listCalendar': {
		input: operationDefinitions['listCalendar'].input,
		output: operationDefinitions['listCalendar'].output,
	},
	'eventsTasks.createCalendar': {
		input: operationDefinitions['createCalendar'].input,
		output: operationDefinitions['createCalendar'].output,
	},
	'eventsTasks.getCalendar': {
		input: operationDefinitions['getCalendar'].input,
		output: operationDefinitions['getCalendar'].output,
	},
	'eventsTasks.updateCalendar': {
		input: operationDefinitions['updateCalendar'].input,
		output: operationDefinitions['updateCalendar'].output,
	},
	'eventsTasks.deleteCalendar': {
		input: operationDefinitions['deleteCalendar'].input,
		output: operationDefinitions['deleteCalendar'].output,
	},
	'extraFieldsEntity.extraFieldsSchemaByResource': {
		input: operationDefinitions['extraFieldsSchemaByResource'].input,
		output: operationDefinitions['extraFieldsSchemaByResource'].output,
	},
	'extraFieldsEntity.listExtraFieldsByResource': {
		input: operationDefinitions['listExtraFieldsByResource'].input,
		output: operationDefinitions['listExtraFieldsByResource'].output,
	},
	'extraFieldsEntity.createExtraFieldForResource': {
		input: operationDefinitions['createExtraFieldForResource'].input,
		output: operationDefinitions['createExtraFieldForResource'].output,
	},
	'extraFieldsTabs.listTabs': {
		input: operationDefinitions['listTabs'].input,
		output: operationDefinitions['listTabs'].output,
	},
	'extraFieldsTabs.createTabs': {
		input: operationDefinitions['createTabs'].input,
		output: operationDefinitions['createTabs'].output,
	},
	'extraFieldsTabs.getTabs': {
		input: operationDefinitions['getTabs'].input,
		output: operationDefinitions['getTabs'].output,
	},
	'extraFieldsTabs.updateTabs': {
		input: operationDefinitions['updateTabs'].input,
		output: operationDefinitions['updateTabs'].output,
	},
	'extraFieldsTabs.deleteTabs': {
		input: operationDefinitions['deleteTabs'].input,
		output: operationDefinitions['deleteTabs'].output,
	},
	'formsEntity.getForm': {
		input: operationDefinitions['getForm'].input,
		output: operationDefinitions['getForm'].output,
	},
	'formsStates.getFormState': {
		input: operationDefinitions['getFormState'].input,
		output: operationDefinitions['getFormState'].output,
	},
	'formsTemplates.getFormTemplate': {
		input: operationDefinitions['getFormTemplate'].input,
		output: operationDefinitions['getFormTemplate'].output,
	},
	'news.listNews': {
		input: operationDefinitions['listNews'].input,
		output: operationDefinitions['listNews'].output,
	},
	'opportunitiesEntity.opportunitiesSchema': {
		input: operationDefinitions['opportunitiesSchema'].input,
		output: operationDefinitions['opportunitiesSchema'].output,
	},
	'opportunitiesEntity.listOpportunities': {
		input: operationDefinitions['listOpportunities'].input,
		output: operationDefinitions['listOpportunities'].output,
	},
	'opportunitiesEntity.createOpportunity': {
		input: operationDefinitions['createOpportunity'].input,
		output: operationDefinitions['createOpportunity'].output,
	},
	'opportunitiesEntity.getOpportunity': {
		input: operationDefinitions['getOpportunity'].input,
		output: operationDefinitions['getOpportunity'].output,
	},
	'opportunitiesEntity.updateOpportunity': {
		input: operationDefinitions['updateOpportunity'].input,
		output: operationDefinitions['updateOpportunity'].output,
	},
	'opportunitiesEntity.deleteOpportunity': {
		input: operationDefinitions['deleteOpportunity'].input,
		output: operationDefinitions['deleteOpportunity'].output,
	},
	'opportunitiesTypes.opportunityTypesSchema': {
		input: operationDefinitions['opportunityTypesSchema'].input,
		output: operationDefinitions['opportunityTypesSchema'].output,
	},
	'opportunitiesTypes.getOpportunityTypes': {
		input: operationDefinitions['getOpportunityTypes'].input,
		output: operationDefinitions['getOpportunityTypes'].output,
	},
	'opportunitiesTypes.updateOpportunityType': {
		input: operationDefinitions['updateOpportunityType'].input,
		output: operationDefinitions['updateOpportunityType'].output,
	},
	'opportunitiesTypes.deleteOpportunityType': {
		input: operationDefinitions['deleteOpportunityType'].input,
		output: operationDefinitions['deleteOpportunityType'].output,
	},
	'opportunitiesStatuses.opportunityStatusesSchema': {
		input: operationDefinitions['opportunityStatusesSchema'].input,
		output: operationDefinitions['opportunityStatusesSchema'].output,
	},
	'opportunitiesStatuses.listOpportunityStatuses': {
		input: operationDefinitions['listOpportunityStatuses'].input,
		output: operationDefinitions['listOpportunityStatuses'].output,
	},
	'opportunitiesStatuses.createOpportunityStatus': {
		input: operationDefinitions['createOpportunityStatus'].input,
		output: operationDefinitions['createOpportunityStatus'].output,
	},
	'opportunitiesStatuses.getOpportunityStatus': {
		input: operationDefinitions['getOpportunityStatus'].input,
		output: operationDefinitions['getOpportunityStatus'].output,
	},
	'opportunitiesStatuses.updateOpportunityStatus': {
		input: operationDefinitions['updateOpportunityStatus'].input,
		output: operationDefinitions['updateOpportunityStatus'].output,
	},
	'opportunitiesStatuses.deleteOpportunityStatus': {
		input: operationDefinitions['deleteOpportunityStatus'].input,
		output: operationDefinitions['deleteOpportunityStatus'].output,
	},
	'ordersEntity.orderHeadersSchema': {
		input: operationDefinitions['orderHeadersSchema'].input,
		output: operationDefinitions['orderHeadersSchema'].output,
	},
	'ordersEntity.listOrderHeaders': {
		input: operationDefinitions['listOrderHeaders'].input,
		output: operationDefinitions['listOrderHeaders'].output,
	},
	'ordersEntity.createOrderHeader': {
		input: operationDefinitions['createOrderHeader'].input,
		output: operationDefinitions['createOrderHeader'].output,
	},
	'ordersEntity.getOrderHeader': {
		input: operationDefinitions['getOrderHeader'].input,
		output: operationDefinitions['getOrderHeader'].output,
	},
	'ordersEntity.updateOrderHeader': {
		input: operationDefinitions['updateOrderHeader'].input,
		output: operationDefinitions['updateOrderHeader'].output,
	},
	'ordersEntity.deleteOrderHeader': {
		input: operationDefinitions['deleteOrderHeader'].input,
		output: operationDefinitions['deleteOrderHeader'].output,
	},
	'ordersEntity.orderLinesSchema': {
		input: operationDefinitions['orderLinesSchema'].input,
		output: operationDefinitions['orderLinesSchema'].output,
	},
	'ordersEntity.listOrderLines': {
		input: operationDefinitions['listOrderLines'].input,
		output: operationDefinitions['listOrderLines'].output,
	},
	'ordersEntity.createOrderLine': {
		input: operationDefinitions['createOrderLine'].input,
		output: operationDefinitions['createOrderLine'].output,
	},
	'ordersEntity.getOrderLine': {
		input: operationDefinitions['getOrderLine'].input,
		output: operationDefinitions['getOrderLine'].output,
	},
	'ordersEntity.updateOrderLine': {
		input: operationDefinitions['updateOrderLine'].input,
		output: operationDefinitions['updateOrderLine'].output,
	},
	'ordersEntity.deleteOrderLine': {
		input: operationDefinitions['deleteOrderLine'].input,
		output: operationDefinitions['deleteOrderLine'].output,
	},
	'ordersStatuses.orderStatusesSchema': {
		input: operationDefinitions['orderStatusesSchema'].input,
		output: operationDefinitions['orderStatusesSchema'].output,
	},
	'ordersStatuses.listOrderStatuses': {
		input: operationDefinitions['listOrderStatuses'].input,
		output: operationDefinitions['listOrderStatuses'].output,
	},
	'ordersStatuses.createOrderStatus': {
		input: operationDefinitions['createOrderStatus'].input,
		output: operationDefinitions['createOrderStatus'].output,
	},
	'ordersStatuses.getOrderStatus': {
		input: operationDefinitions['getOrderStatus'].input,
		output: operationDefinitions['getOrderStatus'].output,
	},
	'ordersStatuses.updateOrderStatus': {
		input: operationDefinitions['updateOrderStatus'].input,
		output: operationDefinitions['updateOrderStatus'].output,
	},
	'ordersStatuses.deleteOrderStatus': {
		input: operationDefinitions['deleteOrderStatus'].input,
		output: operationDefinitions['deleteOrderStatus'].output,
	},
	'ordersTypes.orderTypesSchema': {
		input: operationDefinitions['orderTypesSchema'].input,
		output: operationDefinitions['orderTypesSchema'].output,
	},
	'ordersTypes.listOrderTypes': {
		input: operationDefinitions['listOrderTypes'].input,
		output: operationDefinitions['listOrderTypes'].output,
	},
	'ordersTypes.createOrderTypes': {
		input: operationDefinitions['createOrderTypes'].input,
		output: operationDefinitions['createOrderTypes'].output,
	},
	'ordersTypes.getOrderTypes': {
		input: operationDefinitions['getOrderTypes'].input,
		output: operationDefinitions['getOrderTypes'].output,
	},
	'ordersTypes.updateOrderTypes': {
		input: operationDefinitions['updateOrderTypes'].input,
		output: operationDefinitions['updateOrderTypes'].output,
	},
	'ordersTypes.deleteOrderTypes': {
		input: operationDefinitions['deleteOrderTypes'].input,
		output: operationDefinitions['deleteOrderTypes'].output,
	},
	'productsEntity.productsSchema': {
		input: operationDefinitions['productsSchema'].input,
		output: operationDefinitions['productsSchema'].output,
	},
	'productsEntity.listProducts': {
		input: operationDefinitions['listProducts'].input,
		output: operationDefinitions['listProducts'].output,
	},
	'productsEntity.createProduct': {
		input: operationDefinitions['createProduct'].input,
		output: operationDefinitions['createProduct'].output,
	},
	'productsEntity.getProduct': {
		input: operationDefinitions['getProduct'].input,
		output: operationDefinitions['getProduct'].output,
	},
	'productsEntity.updateProduct': {
		input: operationDefinitions['updateProduct'].input,
		output: operationDefinitions['updateProduct'].output,
	},
	'productsEntity.deleteProduct': {
		input: operationDefinitions['deleteProduct'].input,
		output: operationDefinitions['deleteProduct'].output,
	},
	'productsEntity.bulkCreateProducts': {
		input: operationDefinitions['bulkCreateProducts'].input,
		output: operationDefinitions['bulkCreateProducts'].output,
	},
	'productsEntity.bulkUpdateProducts': {
		input: operationDefinitions['bulkUpdateProducts'].input,
		output: operationDefinitions['bulkUpdateProducts'].output,
	},
	'productsEntity.bulkDeleteProducts': {
		input: operationDefinitions['bulkDeleteProducts'].input,
		output: operationDefinitions['bulkDeleteProducts'].output,
	},
	'productsFamilies.productFamiliesSchema': {
		input: operationDefinitions['productFamiliesSchema'].input,
		output: operationDefinitions['productFamiliesSchema'].output,
	},
	'productsFamilies.listProductFamilies': {
		input: operationDefinitions['listProductFamilies'].input,
		output: operationDefinitions['listProductFamilies'].output,
	},
	'productsFamilies.createProductFamily': {
		input: operationDefinitions['createProductFamily'].input,
		output: operationDefinitions['createProductFamily'].output,
	},
	'productsFamilies.getProductFamily': {
		input: operationDefinitions['getProductFamily'].input,
		output: operationDefinitions['getProductFamily'].output,
	},
	'productsFamilies.updateProductFamily': {
		input: operationDefinitions['updateProductFamily'].input,
		output: operationDefinitions['updateProductFamily'].output,
	},
	'productUnitsOfMeasure.productUnitsOfMeasureSchema': {
		input: operationDefinitions['productUnitsOfMeasureSchema'].input,
		output: operationDefinitions['productUnitsOfMeasureSchema'].output,
	},
	'productUnitsOfMeasure.listProductUnitsOfMeasure': {
		input: operationDefinitions['listProductUnitsOfMeasure'].input,
		output: operationDefinitions['listProductUnitsOfMeasure'].output,
	},
	'productUnitsOfMeasure.createProductUnitOfMeasure': {
		input: operationDefinitions['createProductUnitOfMeasure'].input,
		output: operationDefinitions['createProductUnitOfMeasure'].output,
	},
	'productUnitsOfMeasure.getProductUnitOfMeasure': {
		input: operationDefinitions['getProductUnitOfMeasure'].input,
		output: operationDefinitions['getProductUnitOfMeasure'].output,
	},
	'productUnitsOfMeasure.updateProductUnitOfMeasure': {
		input: operationDefinitions['updateProductUnitOfMeasure'].input,
		output: operationDefinitions['updateProductUnitOfMeasure'].output,
	},
	'productUnitsOfMeasure.deleteProductUnitOfMeasure': {
		input: operationDefinitions['deleteProductUnitOfMeasure'].input,
		output: operationDefinitions['deleteProductUnitOfMeasure'].output,
	},
	'unitsOfMeasure.unitsOfMeasureSchema': {
		input: operationDefinitions['unitsOfMeasureSchema'].input,
		output: operationDefinitions['unitsOfMeasureSchema'].output,
	},
	'unitsOfMeasure.listUnitsOfMeasure': {
		input: operationDefinitions['listUnitsOfMeasure'].input,
		output: operationDefinitions['listUnitsOfMeasure'].output,
	},
	'unitsOfMeasure.createUnitOfMeasure': {
		input: operationDefinitions['createUnitOfMeasure'].input,
		output: operationDefinitions['createUnitOfMeasure'].output,
	},
	'unitsOfMeasure.getUnitOfMeasure': {
		input: operationDefinitions['getUnitOfMeasure'].input,
		output: operationDefinitions['getUnitOfMeasure'].output,
	},
	'unitsOfMeasure.updateUnitOfMeasure': {
		input: operationDefinitions['updateUnitOfMeasure'].input,
		output: operationDefinitions['updateUnitOfMeasure'].output,
	},
	'unitsOfMeasure.deleteUnitOfMeasure': {
		input: operationDefinitions['deleteUnitOfMeasure'].input,
		output: operationDefinitions['deleteUnitOfMeasure'].output,
	},
	'taxRates.taxRatesSchema': {
		input: operationDefinitions['taxRatesSchema'].input,
		output: operationDefinitions['taxRatesSchema'].output,
	},
	'taxRates.listTaxRates': {
		input: operationDefinitions['listTaxRates'].input,
		output: operationDefinitions['listTaxRates'].output,
	},
	'taxRates.createTaxRate': {
		input: operationDefinitions['createTaxRate'].input,
		output: operationDefinitions['createTaxRate'].output,
	},
	'taxRates.getTaxRate': {
		input: operationDefinitions['getTaxRate'].input,
		output: operationDefinitions['getTaxRate'].output,
	},
	'taxRates.updateTaxRate': {
		input: operationDefinitions['updateTaxRate'].input,
		output: operationDefinitions['updateTaxRate'].output,
	},
	'taxRates.deleteTaxRate': {
		input: operationDefinitions['deleteTaxRate'].input,
		output: operationDefinitions['deleteTaxRate'].output,
	},
	'taxProfiles.taxProfilesSchema': {
		input: operationDefinitions['taxProfilesSchema'].input,
		output: operationDefinitions['taxProfilesSchema'].output,
	},
	'taxProfiles.listTaxProfiles': {
		input: operationDefinitions['listTaxProfiles'].input,
		output: operationDefinitions['listTaxProfiles'].output,
	},
	'taxProfiles.getTaxProfile': {
		input: operationDefinitions['getTaxProfile'].input,
		output: operationDefinitions['getTaxProfile'].output,
	},
	'productFamiliesBranches.productFamiliesBranchesSchema': {
		input: operationDefinitions['productFamiliesBranchesSchema'].input,
		output: operationDefinitions['productFamiliesBranchesSchema'].output,
	},
	'productFamiliesBranches.listProductFamiliesBranches': {
		input: operationDefinitions['listProductFamiliesBranches'].input,
		output: operationDefinitions['listProductFamiliesBranches'].output,
	},
	'productFamiliesBranches.createProductFamiliesBranch': {
		input: operationDefinitions['createProductFamiliesBranch'].input,
		output: operationDefinitions['createProductFamiliesBranch'].output,
	},
	'productFamiliesBranches.getProductFamiliesBranch': {
		input: operationDefinitions['getProductFamiliesBranch'].input,
		output: operationDefinitions['getProductFamiliesBranch'].output,
	},
	'productFamiliesBranches.updateProductFamiliesBranch': {
		input: operationDefinitions['updateProductFamiliesBranch'].input,
		output: operationDefinitions['updateProductFamiliesBranch'].output,
	},
	'productFamiliesBranches.deleteProductFamiliesBranch': {
		input: operationDefinitions['deleteProductFamiliesBranch'].input,
		output: operationDefinitions['deleteProductFamiliesBranch'].output,
	},
	'productEnvironments.productEnvironmentsSchema': {
		input: operationDefinitions['productEnvironmentsSchema'].input,
		output: operationDefinitions['productEnvironmentsSchema'].output,
	},
	'productEnvironments.listProductEnvironments': {
		input: operationDefinitions['listProductEnvironments'].input,
		output: operationDefinitions['listProductEnvironments'].output,
	},
	'productEnvironments.createProductEnvironment': {
		input: operationDefinitions['createProductEnvironment'].input,
		output: operationDefinitions['createProductEnvironment'].output,
	},
	'productEnvironments.getProductEnvironment': {
		input: operationDefinitions['getProductEnvironment'].input,
		output: operationDefinitions['getProductEnvironment'].output,
	},
	'productEnvironments.updateProductEnvironment': {
		input: operationDefinitions['updateProductEnvironment'].input,
		output: operationDefinitions['updateProductEnvironment'].output,
	},
	'productEnvironments.deleteProductEnvironment': {
		input: operationDefinitions['deleteProductEnvironment'].input,
		output: operationDefinitions['deleteProductEnvironment'].output,
	},
	'productsCategories.productCategoriesSchema': {
		input: operationDefinitions['productCategoriesSchema'].input,
		output: operationDefinitions['productCategoriesSchema'].output,
	},
	'productsCategories.listProductCategories': {
		input: operationDefinitions['listProductCategories'].input,
		output: operationDefinitions['listProductCategories'].output,
	},
	'productsCategories.createProductCategory': {
		input: operationDefinitions['createProductCategory'].input,
		output: operationDefinitions['createProductCategory'].output,
	},
	'productsCategories.getProductCategory': {
		input: operationDefinitions['getProductCategory'].input,
		output: operationDefinitions['getProductCategory'].output,
	},
	'productsCategories.updateProductCategory': {
		input: operationDefinitions['updateProductCategory'].input,
		output: operationDefinitions['updateProductCategory'].output,
	},
	'productsCategories.deleteProductCategory': {
		input: operationDefinitions['deleteProductCategory'].input,
		output: operationDefinitions['deleteProductCategory'].output,
	},
	'productsRates.productRatesSchema': {
		input: operationDefinitions['productRatesSchema'].input,
		output: operationDefinitions['productRatesSchema'].output,
	},
	'productsRates.listProductRates': {
		input: operationDefinitions['listProductRates'].input,
		output: operationDefinitions['listProductRates'].output,
	},
	'productsRates.createProductRate': {
		input: operationDefinitions['createProductRate'].input,
		output: operationDefinitions['createProductRate'].output,
	},
	'productsRates.getProductRate': {
		input: operationDefinitions['getProductRate'].input,
		output: operationDefinitions['getProductRate'].output,
	},
	'productsRates.updateProductRate': {
		input: operationDefinitions['updateProductRate'].input,
		output: operationDefinitions['updateProductRate'].output,
	},
	'productsRates.deleteProductRate': {
		input: operationDefinitions['deleteProductRate'].input,
		output: operationDefinitions['deleteProductRate'].output,
	},
	'rates.ratesSchema': {
		input: operationDefinitions['ratesSchema'].input,
		output: operationDefinitions['ratesSchema'].output,
	},
	'rates.listRates': {
		input: operationDefinitions['listRates'].input,
		output: operationDefinitions['listRates'].output,
	},
	'rates.createRate': {
		input: operationDefinitions['createRate'].input,
		output: operationDefinitions['createRate'].output,
	},
	'rates.getRate': {
		input: operationDefinitions['getRate'].input,
		output: operationDefinitions['getRate'].output,
	},
	'rates.updateRate': {
		input: operationDefinitions['updateRate'].input,
		output: operationDefinitions['updateRate'].output,
	},
	'rates.deleteRate': {
		input: operationDefinitions['deleteRate'].input,
		output: operationDefinitions['deleteRate'].output,
	},
	'relatedAccountsEntity.relatedAccountsSchema': {
		input: operationDefinitions['relatedAccountsSchema'].input,
		output: operationDefinitions['relatedAccountsSchema'].output,
	},
	'relatedAccountsEntity.listRelatedAccounts': {
		input: operationDefinitions['listRelatedAccounts'].input,
		output: operationDefinitions['listRelatedAccounts'].output,
	},
	'relatedAccountsEntity.createRelatedAccount': {
		input: operationDefinitions['createRelatedAccount'].input,
		output: operationDefinitions['createRelatedAccount'].output,
	},
	'relatedAccountsEntity.retrieveRelatedAccount': {
		input: operationDefinitions['retrieveRelatedAccount'].input,
		output: operationDefinitions['retrieveRelatedAccount'].output,
	},
	'relatedAccountsEntity.updateRelatedAccount': {
		input: operationDefinitions['updateRelatedAccount'].input,
		output: operationDefinitions['updateRelatedAccount'].output,
	},
	'relatedAccountsEntity.deleteRelatedAccount': {
		input: operationDefinitions['deleteRelatedAccount'].input,
		output: operationDefinitions['deleteRelatedAccount'].output,
	},
	'relatedAccountsTypes.relatedAccountTypesSchema': {
		input: operationDefinitions['relatedAccountTypesSchema'].input,
		output: operationDefinitions['relatedAccountTypesSchema'].output,
	},
	'relatedAccountsTypes.listRelatedAccountTypes': {
		input: operationDefinitions['listRelatedAccountTypes'].input,
		output: operationDefinitions['listRelatedAccountTypes'].output,
	},
	'relatedAccountsTypes.createRelatedAccountType': {
		input: operationDefinitions['createRelatedAccountType'].input,
		output: operationDefinitions['createRelatedAccountType'].output,
	},
	'relatedAccountsTypes.retrieveRelatedAccountType': {
		input: operationDefinitions['retrieveRelatedAccountType'].input,
		output: operationDefinitions['retrieveRelatedAccountType'].output,
	},
	'relatedAccountsTypes.updateRelatedAccountType': {
		input: operationDefinitions['updateRelatedAccountType'].input,
		output: operationDefinitions['updateRelatedAccountType'].output,
	},
	'relatedAccountsTypes.deleteRelatedAccountType': {
		input: operationDefinitions['deleteRelatedAccountType'].input,
		output: operationDefinitions['deleteRelatedAccountType'].output,
	},
	'resources.getResources': {
		input: operationDefinitions['getResources'].input,
		output: operationDefinitions['getResources'].output,
	},
	'roles.rolesSchema': {
		input: operationDefinitions['rolesSchema'].input,
		output: operationDefinitions['rolesSchema'].output,
	},
	'roles.listRoles': {
		input: operationDefinitions['listRoles'].input,
		output: operationDefinitions['listRoles'].output,
	},
	'roles.getRole': {
		input: operationDefinitions['getRole'].input,
		output: operationDefinitions['getRole'].output,
	},
	'roles.listRolesOfUser': {
		input: operationDefinitions['listRolesOfUser'].input,
		output: operationDefinitions['listRolesOfUser'].output,
	},
	'roles.addRolesInUser': {
		input: operationDefinitions['addRolesInUser'].input,
		output: operationDefinitions['addRolesInUser'].output,
	},
	'roles.deleteRolesInUser': {
		input: operationDefinitions['deleteRolesInUser'].input,
		output: operationDefinitions['deleteRolesInUser'].output,
	},
	'roles.listUsersInRole': {
		input: operationDefinitions['listUsersInRole'].input,
		output: operationDefinitions['listUsersInRole'].output,
	},
	'sales.salesSchema': {
		input: operationDefinitions['salesSchema'].input,
		output: operationDefinitions['salesSchema'].output,
	},
	'sales.listSales': {
		input: operationDefinitions['listSales'].input,
		output: operationDefinitions['listSales'].output,
	},
	'sales.createSale': {
		input: operationDefinitions['createSale'].input,
		output: operationDefinitions['createSale'].output,
	},
	'sales.getSale': {
		input: operationDefinitions['getSale'].input,
		output: operationDefinitions['getSale'].output,
	},
	'sales.updateSale': {
		input: operationDefinitions['updateSale'].input,
		output: operationDefinitions['updateSale'].output,
	},
	'sales.deleteSale': {
		input: operationDefinitions['deleteSale'].input,
		output: operationDefinitions['deleteSale'].output,
	},
	'timeZones.listTimezones': {
		input: operationDefinitions['listTimezones'].input,
		output: operationDefinitions['listTimezones'].output,
	},
	'usersEntity.usersSchema': {
		input: operationDefinitions['usersSchema'].input,
		output: operationDefinitions['usersSchema'].output,
	},
	'usersEntity.listUsers': {
		input: operationDefinitions['listUsers'].input,
		output: operationDefinitions['listUsers'].output,
	},
	'usersEntity.createUser': {
		input: operationDefinitions['createUser'].input,
		output: operationDefinitions['createUser'].output,
	},
	'usersEntity.getUser': {
		input: operationDefinitions['getUser'].input,
		output: operationDefinitions['getUser'].output,
	},
	'usersEntity.updateUser': {
		input: operationDefinitions['updateUser'].input,
		output: operationDefinitions['updateUser'].output,
	},
	'usersEntity.deleteUser': {
		input: operationDefinitions['deleteUser'].input,
		output: operationDefinitions['deleteUser'].output,
	},
	'usersEntity.listUserHierarchy': {
		input: operationDefinitions['listUserHierarchy'].input,
		output: operationDefinitions['listUserHierarchy'].output,
	},
	'usersEntity.listUsersScores': {
		input: operationDefinitions['listUsersScores'].input,
		output: operationDefinitions['listUsersScores'].output,
	},
	'usersTypes.userTypesSchema': {
		input: operationDefinitions['userTypesSchema'].input,
		output: operationDefinitions['userTypesSchema'].output,
	},
	'usersTypes.listUserTypes': {
		input: operationDefinitions['listUserTypes'].input,
		output: operationDefinitions['listUserTypes'].output,
	},
	'usersTypes.createUserType': {
		input: operationDefinitions['createUserType'].input,
		output: operationDefinitions['createUserType'].output,
	},
	'usersTypes.getUserType': {
		input: operationDefinitions['getUserType'].input,
		output: operationDefinitions['getUserType'].output,
	},
	'usersTypes.updateUserType': {
		input: operationDefinitions['updateUserType'].input,
		output: operationDefinitions['updateUserType'].output,
	},
	'valueListsEntity.listLists': {
		input: operationDefinitions['listLists'].input,
		output: operationDefinitions['listLists'].output,
	},
	'valueListsEntity.createList': {
		input: operationDefinitions['createList'].input,
		output: operationDefinitions['createList'].output,
	},
	'valueListsEntity.updateList': {
		input: operationDefinitions['updateList'].input,
		output: operationDefinitions['updateList'].output,
	},
	'valueListsEntity.deleteList': {
		input: operationDefinitions['deleteList'].input,
		output: operationDefinitions['deleteList'].output,
	},
	'valueListsValues.listValues': {
		input: operationDefinitions['listValues'].input,
		output: operationDefinitions['listValues'].output,
	},
	'valueListsValues.createValue': {
		input: operationDefinitions['createValue'].input,
		output: operationDefinitions['createValue'].output,
	},
	'valueListsValues.valuesListSchema': {
		input: operationDefinitions['valuesListSchema'].input,
		output: operationDefinitions['valuesListSchema'].output,
	},
	'valueListsValues.getValue': {
		input: operationDefinitions['getValue'].input,
		output: operationDefinitions['getValue'].output,
	},
	'valueListsValues.updateValue': {
		input: operationDefinitions['updateValue'].input,
		output: operationDefinitions['updateValue'].output,
	},
	'valueListsValues.deleteValue': {
		input: operationDefinitions['deleteValue'].input,
		output: operationDefinitions['deleteValue'].output,
	},
	'warnings.listWarningsOfAResource': {
		input: operationDefinitions['listWarningsOfAResource'].input,
		output: operationDefinitions['listWarningsOfAResource'].output,
	},
	'warnings.createWarningForAResourceCopy': {
		input: operationDefinitions['createWarningForAResourceCopy'].input,
		output: operationDefinitions['createWarningForAResourceCopy'].output,
	},
	'warnings.updateWarningOfAResource': {
		input: operationDefinitions['updateWarningOfAResource'].input,
		output: operationDefinitions['updateWarningOfAResource'].output,
	},
	'warnings.deleteWarningOfAResource': {
		input: operationDefinitions['deleteWarningOfAResource'].input,
		output: operationDefinitions['deleteWarningOfAResource'].output,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof forceManagerEndpointsNested
>;

export const forceManagerEndpointMeta = {
	'accountAddresses.accountAddressesSchema': {
		riskLevel: 'read',
		description: 'Account Addresses schema (GET /accountAddresses/schema)',
	},
	'accountAddresses.listAccountAddresses': {
		riskLevel: 'read',
		description: 'List Account Addresses (GET /accountAddresses)',
	},
	'accountAddresses.createAccountAddress': {
		riskLevel: 'write',
		description: 'Create Account Address (POST /accountAddresses)',
	},
	'accountAddresses.getAccountAddress': {
		riskLevel: 'read',
		description: 'Get Account Address (GET /accountAddresses/{ID})',
	},
	'accountAddresses.updateAccountAddress': {
		riskLevel: 'write',
		description: 'Update Account Address (PUT /accountAddresses/{ID})',
	},
	'accountAddresses.deleteAccountAddress': {
		riskLevel: 'destructive',
		description: 'Delete Account Address (DELETE /accountAddresses/{ID})',
	},
	'accountsEntity.accountsSchema': {
		riskLevel: 'read',
		description: 'Accounts schema (GET /accounts/schema)',
	},
	'accountsEntity.listAccounts': {
		riskLevel: 'read',
		description: 'List Accounts (GET /accounts)',
	},
	'accountsEntity.createAccount': {
		riskLevel: 'write',
		description: 'Create Account (POST /accounts)',
	},
	'accountsEntity.getAccount': {
		riskLevel: 'read',
		description: 'Get Account (GET /accounts/{ID})',
	},
	'accountsEntity.updateAccount': {
		riskLevel: 'write',
		description: 'Update Account (PUT /accounts/{ID})',
	},
	'accountsEntity.deleteAccount': {
		riskLevel: 'destructive',
		description: 'Delete Account (DELETE /accounts/{ID})',
	},
	'accountsTypes.accountTypesSchema': {
		riskLevel: 'read',
		description: 'Account Types schema (GET /accountTypes/schema)',
	},
	'accountsTypes.listAccountTypes': {
		riskLevel: 'read',
		description: 'List Account Types (GET /accountTypes)',
	},
	'accountsTypes.createAccountType': {
		riskLevel: 'write',
		description: 'Create Account Type (POST /accountTypes)',
	},
	'accountsTypes.getAccountType': {
		riskLevel: 'read',
		description: 'Get Account Type (GET /accountTypes/{ID})',
	},
	'accountsTypes.updateAccountType': {
		riskLevel: 'write',
		description: 'Update Account Type (PUT /list/accountTypes/{ID})',
	},
	'accountsTypes.deleteAccountType': {
		riskLevel: 'destructive',
		description: 'Delete Account Type (DELETE /list/accountTypes/{ID})',
	},
	'accountsSegments.accountSegmentsSchema': {
		riskLevel: 'read',
		description: 'Account Segments schema (GET /accountSegments/schema)',
	},
	'accountsSegments.listAccountSegments': {
		riskLevel: 'read',
		description: 'List Account Segments (GET /accountSegments)',
	},
	'accountsSegments.createAccountSegment': {
		riskLevel: 'write',
		description: 'Create Account Segment (POST /accountSegments)',
	},
	'accountsSegments.getAccountSegment': {
		riskLevel: 'read',
		description: 'Get Account Segment (GET /accountSegments/{ID})',
	},
	'accountsSegments.updateAccountSegment': {
		riskLevel: 'write',
		description: 'Update Account Segment (PUT /accountSegments/{ID})',
	},
	'accountsSegments.deleteAccountSegment': {
		riskLevel: 'destructive',
		description: 'Delete Account Segment (DELETE /accountSegments/{ID})',
	},
	'accountsStatuses.accountStatusesSchema': {
		riskLevel: 'read',
		description: 'Account Statuses schema (GET /accountStatuses/schema)',
	},
	'accountsStatuses.listAccountStatuses': {
		riskLevel: 'read',
		description: 'List Account Statuses (GET /accountStatuses)',
	},
	'accountsStatuses.createAccountStatus': {
		riskLevel: 'write',
		description: 'Create Account Status (POST /accountStatuses)',
	},
	'accountsStatuses.getAccountStatus': {
		riskLevel: 'read',
		description: 'Get Account Status (GET /accountStatuses/{ID})',
	},
	'accountsStatuses.updateAccountStatus': {
		riskLevel: 'write',
		description: 'Update Account Status (PUT /accountStatuses/{ID})',
	},
	'accountsStatuses.deleteAccountStatus': {
		riskLevel: 'destructive',
		description: 'Delete Account Status (DELETE /accountStatuses/{ID})',
	},
	'activitiesEntity.activitiesSchema': {
		riskLevel: 'read',
		description: 'Activities schema (GET /activities/schema)',
	},
	'activitiesEntity.listActivities': {
		riskLevel: 'read',
		description: 'List Activities (GET /activities)',
	},
	'activitiesEntity.createActivity': {
		riskLevel: 'write',
		description: 'Create Activity (POST /activities)',
	},
	'activitiesEntity.getActivity': {
		riskLevel: 'read',
		description: 'Get Activity (GET /activities/{ID})',
	},
	'activitiesEntity.updateActivity': {
		riskLevel: 'write',
		description: 'Update Activity (PUT /activities/{ID})',
	},
	'activitiesEntity.deleteActivity': {
		riskLevel: 'destructive',
		description: 'Delete Activity (DELETE /activities/{ID})',
	},
	'activitiesTypes.activityTypesSchema': {
		riskLevel: 'read',
		description: 'Activity Types schema (GET /activityTypes/schema)',
	},
	'activitiesTypes.listActivityTypes': {
		riskLevel: 'read',
		description: 'List Activity Types (GET /activityTypes)',
	},
	'activitiesTypes.createActivityType': {
		riskLevel: 'write',
		description: 'Create Activity Type (POST /activityTypes)',
	},
	'activitiesTypes.getActivityType': {
		riskLevel: 'read',
		description: 'Get Activity Type (GET /activityTypes/{ID})',
	},
	'activitiesTypes.updateActivityType': {
		riskLevel: 'write',
		description: 'Update Activity Type (PUT /activityTypes/{ID})',
	},
	'activitiesTypes.deleteActivityType': {
		riskLevel: 'destructive',
		description: 'Delete Activity Type (DELETE /activityTypes/{ID})',
	},
	'activitiesPoints.listActivityPoints': {
		riskLevel: 'read',
		description: 'List Activity Points (GET /activity/points)',
	},
	'activitiesPoints.updateActivityPoints': {
		riskLevel: 'write',
		description: 'Update Activity Points (PUT /activity/points)',
	},
	'branches.branchesSchema': {
		riskLevel: 'read',
		description: 'Branches schema (GET /branches/schema)',
	},
	'branches.listBranches': {
		riskLevel: 'read',
		description: 'List Branches (GET /branches)',
	},
	'branches.getBranch': {
		riskLevel: 'read',
		description: 'Get Branch (GET /branches/{ID})',
	},
	'branches.deleteBranch': {
		riskLevel: 'destructive',
		description: 'Delete Branch (DELETE /branches/{ID})',
	},
	'bulks.bulkCreateResources': {
		riskLevel: 'write',
		description: 'Bulk Create Resources (POST /VALUE/bulk)',
	},
	'bulks.bulkUpdateResources': {
		riskLevel: 'write',
		description: 'Bulk Update Resources (PUT /VALUE/bulk)',
	},
	'bulks.bulkDeleteResources': {
		riskLevel: 'destructive',
		description: 'Bulk Delete Resources (DELETE /VALUE/bulk)',
	},
	'calls.listCalls': {
		riskLevel: 'read',
		description: 'List Calls (GET /calls)',
	},
	'calls.createCallByUserId': {
		riskLevel: 'write',
		description: 'Create Call by User ID (POST /calls)',
	},
	'calls.createCallByUserPhoneNumber': {
		riskLevel: 'write',
		description: 'Create Call by User Phone Number (POST /calls/identify)',
	},
	'calls.getCall': {
		riskLevel: 'read',
		description: 'Get Call (GET /calls/{ID})',
	},
	'calls.updateCall': {
		riskLevel: 'write',
		description: 'Update Call (PUT /calls/{ID})',
	},
	'calls.deleteCall': {
		riskLevel: 'destructive',
		description: 'Delete Call (DELETE /calls/{ID})',
	},
	'calls.getResourcesByPhoneNumber': {
		riskLevel: 'read',
		description: 'Get Resources by Phone Number (GET /calls/phone/VALUE)',
	},
	'campaignsEntity.listCampaigns': {
		riskLevel: 'read',
		description: 'List Campaigns (GET /campaigns)',
	},
	'campaignsEntity.createCampaign': {
		riskLevel: 'write',
		description: 'Create Campaign (POST /campaigns)',
	},
	'campaignsEntity.getCampaign': {
		riskLevel: 'read',
		description: 'Get Campaign (GET /campaigns/{ID})',
	},
	'campaignsEntity.updateCampaign': {
		riskLevel: 'write',
		description: 'Update Campaign (PUT /campaigns/{ID})',
	},
	'campaignsEntity.deleteCampaign': {
		riskLevel: 'destructive',
		description: 'Delete Campaign (DELETE /campaigns/{ID})',
	},
	'opportunitiesTypes.listOpportunityTypes': {
		riskLevel: 'read',
		description: 'List Opportunity Types (GET /opportunityTypes)',
	},
	'opportunitiesTypes.createOpportunityType': {
		riskLevel: 'write',
		description: 'Create Opportunity Type (POST /opportunityTypes)',
	},
	'campaignsStatuses.listCampaignStatuses': {
		riskLevel: 'read',
		description: 'List Campaign Statuses (GET /campaignStatuses)',
	},
	'campaignsAccounts.listCampaignAccounts': {
		riskLevel: 'read',
		description: 'List Campaign Accounts (GET /campaigns/{ID}/entities)',
	},
	'campaignsAccounts.createCampaignAccount': {
		riskLevel: 'write',
		description:
			'Create Campaign Account (POST /campaigns/{ID}/entities/VALUE)',
	},
	'campaignsAccounts.getCampaignAccount': {
		riskLevel: 'read',
		description: 'Get Campaign Account (GET /campaigns/{ID}/entities/VALUE)',
	},
	'campaignsAccounts.updateCampaignAccount': {
		riskLevel: 'write',
		description: 'Update Campaign Account (PUT /campaigns/{ID}/entities/VALUE)',
	},
	'campaignsAccounts.deleteCampaignAccount': {
		riskLevel: 'destructive',
		description:
			'Delete Campaign Account (DELETE /campaigns/{ID}/entities/VALUE)',
	},
	'campaignsQuestions.listCampaignQuestions': {
		riskLevel: 'read',
		description: 'List Campaign Questions (GET /campaignQuestions)',
	},
	'campaignsQuestions.createCampaignQuestion': {
		riskLevel: 'write',
		description: 'Create Campaign Question (POST /campaignQuestions)',
	},
	'campaignsQuestions.getCampaignQuestion': {
		riskLevel: 'read',
		description: 'Get Campaign Question (GET /campaignQuestions/{ID})',
	},
	'campaignsQuestions.updateCampaignQuestion': {
		riskLevel: 'write',
		description: 'Update Campaign Question (PUT /campaignQuestions/{ID})',
	},
	'campaignsQuestions.deleteCampaignQuestion': {
		riskLevel: 'destructive',
		description: 'Delete Campaign Question (DELETE /campaignQuestions/{ID})',
	},
	'campaignsQuestionAnswers.listQuestionAnswers': {
		riskLevel: 'read',
		description: 'List Question Answers (GET /campaignQuestions/VALUE/answers)',
	},
	'campaignsQuestionAnswers.createQuestionAnswer': {
		riskLevel: 'write',
		description:
			'Create Question Answer (POST /campaignQuestions/VALUE/answers)',
	},
	'campaignsQuestionAnswers.getQuestionAnswer': {
		riskLevel: 'read',
		description:
			'Get Question Answer (GET /campaignQuestions/VALUE/answers/{ID})',
	},
	'campaignsQuestionAnswers.updateQuestionAnswer': {
		riskLevel: 'write',
		description:
			'Update Question Answer (PUT /campaignQuestions/VALUE/answers/{ID})',
	},
	'campaignsQuestionAnswers.deleteQuestionAnswer': {
		riskLevel: 'destructive',
		description:
			'Delete Question Answer (DELETE /campaignQuestions/VALUE/answers/{ID})',
	},
	'campaignsQuestionValues.listQuestionValues': {
		riskLevel: 'read',
		description: 'List Question Values (GET /campaignQuestions/VALUE/values)',
	},
	'campaignsQuestionValues.createQuestionValue': {
		riskLevel: 'write',
		description: 'Create Question Value (POST /campaignQuestions/{ID}/values)',
	},
	'campaignsQuestionValues.getQuestionValue': {
		riskLevel: 'read',
		description:
			'Get Question Value (GET /campaignQuestions/VALUE/values/{ID})',
	},
	'campaignsQuestionValues.updateQuestionValue': {
		riskLevel: 'write',
		description:
			'Update Question Value (PUT /campaignQuestions/VALUE/values/{ID})',
	},
	'campaignsQuestionValues.deleteQuestionValue': {
		riskLevel: 'destructive',
		description:
			'Delete Question Value (DELETE /campaignQuestions/VALUE/values/{ID})',
	},
	'contactsEntity.contactsSchema': {
		riskLevel: 'read',
		description: 'Contacts schema (GET /contacts/schema)',
	},
	'contactsEntity.listContacts': {
		riskLevel: 'read',
		description: 'List Contacts (GET /contacts)',
	},
	'contactsEntity.createContact': {
		riskLevel: 'write',
		description: 'Create Contact (POST /contacts)',
	},
	'contactsEntity.getContact': {
		riskLevel: 'read',
		description: 'Get Contact (GET /contacts/{ID})',
	},
	'contactsEntity.updateContact': {
		riskLevel: 'write',
		description: 'Update Contact (PUT /contacts/{ID})',
	},
	'contactsEntity.deleteContact': {
		riskLevel: 'destructive',
		description: 'Delete Contact (DELETE /contacts/{ID})',
	},
	'contactsTypes.contactTypesSchema': {
		riskLevel: 'read',
		description: 'Contact Types schema (GET /contactTypes/schema)',
	},
	'contactsTypes.listContactTypes': {
		riskLevel: 'read',
		description: 'List Contact Types (GET /contactTypes)',
	},
	'contactsTypes.createContactType': {
		riskLevel: 'write',
		description: 'Create Contact Type (POST /contactTypes)',
	},
	'contactsTypes.getContactType': {
		riskLevel: 'read',
		description: 'Get Contact Type (GET /contactTypes/{ID})',
	},
	'contactsTypes.updateContactType': {
		riskLevel: 'write',
		description: 'Update Contact Type (PUT /contactTypes/{ID})',
	},
	'contactsTypes.deleteContactType': {
		riskLevel: 'destructive',
		description: 'Delete Contact Type (DELETE /contactTypes/{ID})',
	},
	'countries.countriesSchema': {
		riskLevel: 'read',
		description: 'Countries schema (GET /countries/schema)',
	},
	'countries.listCountries': {
		riskLevel: 'read',
		description: 'List Countries (GET /countries)',
	},
	'currencies.currenciesSchema': {
		riskLevel: 'read',
		description: 'Currencies schema (GET /currencies/schema)',
	},
	'currencies.listCurrencies': {
		riskLevel: 'read',
		description: 'List Currencies (GET /currencies)',
	},
	'documentsEntity.listDocuments': {
		riskLevel: 'read',
		description: 'List Documents (GET /documents)',
	},
	'documentsEntity.listDocumentsOfAResource': {
		riskLevel: 'read',
		description: 'List Documents of a Resource (GET /VALUE/VALUE/documents)',
	},
	'productsCarousel.deletePicture': {
		riskLevel: 'destructive',
		description: 'Delete Picture (DELETE /documents/{ID})',
	},
	'documentsFolders.listFolders': {
		riskLevel: 'read',
		description: 'List Folders (GET /documents/folders)',
	},
	'documentsFolders.createFolder': {
		riskLevel: 'write',
		description: 'Create Folder (POST /documents/folders)',
	},
	'documentsFolders.listFoldersOfAResource': {
		riskLevel: 'read',
		description:
			'List Folders of a Resource (GET /VALUE/VALUE/documents/folders)',
	},
	'documentsFolders.createFolderForAResource': {
		riskLevel: 'write',
		description:
			'Create Folder for a Resource (POST /VALUE/VALUE/documents/folders)',
	},
	'emails.emailsSchema': {
		riskLevel: 'read',
		description: 'Emails schema (GET /emails/schema)',
	},
	'emails.listEmails': {
		riskLevel: 'read',
		description: 'List Emails (GET /emails)',
	},
	'emails.createEmail': {
		riskLevel: 'write',
		description: 'Create Email (POST /emails)',
	},
	'emails.getEmail': {
		riskLevel: 'read',
		description: 'Get Email (GET /emails/{ID})',
	},
	'entityContacts.entityContactsSchema': {
		riskLevel: 'read',
		description: 'Entity Contacts schema (GET /contactsEntities/schema)',
	},
	'entityContacts.listEntityContacts': {
		riskLevel: 'read',
		description: 'List Entity Contacts (GET /contactsEntities)',
	},
	'entityOwners.entityOwnersSchema': {
		riskLevel: 'read',
		description: 'Entity Owners schema (GET /entityOwners/schema)',
	},
	'entityOwners.listEntityOwners': {
		riskLevel: 'read',
		description: 'List Entity Owners (GET /entityOwners)',
	},
	'eventsTasks.calendarSchema': {
		riskLevel: 'read',
		description: 'Calendar schema (GET /calendar/schema)',
	},
	'eventsTasks.listCalendar': {
		riskLevel: 'read',
		description: 'List Calendar (GET /calendar)',
	},
	'eventsTasks.createCalendar': {
		riskLevel: 'write',
		description: 'Create Calendar (POST /calendar)',
	},
	'eventsTasks.getCalendar': {
		riskLevel: 'read',
		description: 'Get Calendar (GET /calendar/{ID})',
	},
	'eventsTasks.updateCalendar': {
		riskLevel: 'write',
		description: 'Update Calendar (PUT /calendar/{ID})',
	},
	'eventsTasks.deleteCalendar': {
		riskLevel: 'destructive',
		description: 'Delete Calendar (DELETE /calendar/{ID})',
	},
	'extraFieldsEntity.extraFieldsSchemaByResource': {
		riskLevel: 'read',
		description:
			'Extra Fields schema by Resource (GET /extrafields/VALUE/schema)',
	},
	'extraFieldsEntity.listExtraFieldsByResource': {
		riskLevel: 'read',
		description: 'List Extra Fields by Resource (GET /extrafields/VALUE)',
	},
	'extraFieldsEntity.createExtraFieldForResource': {
		riskLevel: 'write',
		description: 'Create Extra Field for Resource (POST /extrafields/VALUE)',
	},
	'extraFieldsTabs.listTabs': {
		riskLevel: 'read',
		description: 'List Tabs (GET /extrafieldsTabs)',
	},
	'extraFieldsTabs.createTabs': {
		riskLevel: 'write',
		description: 'Create Tabs (POST /extrafieldsTabs)',
	},
	'extraFieldsTabs.getTabs': {
		riskLevel: 'read',
		description: 'Get Tabs (GET /extrafieldsTabs/{ID})',
	},
	'extraFieldsTabs.updateTabs': {
		riskLevel: 'write',
		description: 'Update Tabs (PUT /extrafieldsTabs/{ID})',
	},
	'extraFieldsTabs.deleteTabs': {
		riskLevel: 'destructive',
		description: 'Delete Tabs (DELETE /extrafieldsTabs/{ID})',
	},
	'formsEntity.getForm': {
		riskLevel: 'read',
		description: 'Get Form (GET /forms/{ID})',
	},
	'formsStates.getFormState': {
		riskLevel: 'read',
		description: 'Get Form State (GET /forms/{ID}/state)',
	},
	'formsTemplates.getFormTemplate': {
		riskLevel: 'read',
		description: 'Get Form Template (GET /forms/{ID}/template)',
	},
	'news.listNews': { riskLevel: 'read', description: 'List News (GET /news)' },
	'opportunitiesEntity.opportunitiesSchema': {
		riskLevel: 'read',
		description: 'Opportunities schema (GET /opportunities/schema)',
	},
	'opportunitiesEntity.listOpportunities': {
		riskLevel: 'read',
		description: 'List Opportunities (GET /opportunities)',
	},
	'opportunitiesEntity.createOpportunity': {
		riskLevel: 'write',
		description: 'Create Opportunity (POST /opportunities)',
	},
	'opportunitiesEntity.getOpportunity': {
		riskLevel: 'read',
		description: 'Get Opportunity (GET /opportunities/{ID})',
	},
	'opportunitiesEntity.updateOpportunity': {
		riskLevel: 'write',
		description: 'Update Opportunity (PUT /opportunities/{ID})',
	},
	'opportunitiesEntity.deleteOpportunity': {
		riskLevel: 'destructive',
		description: 'Delete Opportunity (DELETE /opportunities/{ID})',
	},
	'opportunitiesTypes.opportunityTypesSchema': {
		riskLevel: 'read',
		description: 'Opportunity Types schema (GET /opportunityTypes/schema)',
	},
	'opportunitiesTypes.getOpportunityTypes': {
		riskLevel: 'read',
		description: 'Get Opportunity Types (GET /opportunityTypes/{ID})',
	},
	'opportunitiesTypes.updateOpportunityType': {
		riskLevel: 'write',
		description: 'Update Opportunity Type (PUT /opportunityTypes/{ID})',
	},
	'opportunitiesTypes.deleteOpportunityType': {
		riskLevel: 'destructive',
		description: 'Delete Opportunity Type (DELETE /opportunityTypes/{ID})',
	},
	'opportunitiesStatuses.opportunityStatusesSchema': {
		riskLevel: 'read',
		description:
			'Opportunity Statuses schema (GET /opportunityStatuses/schema)',
	},
	'opportunitiesStatuses.listOpportunityStatuses': {
		riskLevel: 'read',
		description: 'List Opportunity Statuses (GET /opportunityStatuses)',
	},
	'opportunitiesStatuses.createOpportunityStatus': {
		riskLevel: 'write',
		description: 'Create Opportunity Status (POST /opportunityStatuses)',
	},
	'opportunitiesStatuses.getOpportunityStatus': {
		riskLevel: 'read',
		description: 'Get Opportunity Status (GET /opportunityStatuses/{ID})',
	},
	'opportunitiesStatuses.updateOpportunityStatus': {
		riskLevel: 'write',
		description: 'Update Opportunity Status (PUT /opportunityStatuses/{ID})',
	},
	'opportunitiesStatuses.deleteOpportunityStatus': {
		riskLevel: 'destructive',
		description: 'Delete Opportunity Status (DELETE /opportunityStatuses/{ID})',
	},
	'ordersEntity.orderHeadersSchema': {
		riskLevel: 'read',
		description: 'Order Headers schema (GET /salesorders/schema)',
	},
	'ordersEntity.listOrderHeaders': {
		riskLevel: 'read',
		description: 'List Order Headers (GET /salesorders)',
	},
	'ordersEntity.createOrderHeader': {
		riskLevel: 'write',
		description: 'Create Order Header (POST /salesorders)',
	},
	'ordersEntity.getOrderHeader': {
		riskLevel: 'read',
		description: 'Get Order Header (GET /salesorders/{ID})',
	},
	'ordersEntity.updateOrderHeader': {
		riskLevel: 'write',
		description: 'Update Order Header (PUT /salesorders/{ID})',
	},
	'ordersEntity.deleteOrderHeader': {
		riskLevel: 'destructive',
		description: 'Delete Order Header (DELETE /salesorders/{ID})',
	},
	'ordersEntity.orderLinesSchema': {
		riskLevel: 'read',
		description: 'Order Lines schema (GET /salesordersLines/schema)',
	},
	'ordersEntity.listOrderLines': {
		riskLevel: 'read',
		description: 'List Order Lines (GET /salesordersLines)',
	},
	'ordersEntity.createOrderLine': {
		riskLevel: 'write',
		description: 'Create Order Line (POST /salesOrdersLines)',
	},
	'ordersEntity.getOrderLine': {
		riskLevel: 'read',
		description: 'Get Order Line (GET /salesordersLines/{ID})',
	},
	'ordersEntity.updateOrderLine': {
		riskLevel: 'write',
		description: 'Update Order Line (PUT /salesordersLines/{ID})',
	},
	'ordersEntity.deleteOrderLine': {
		riskLevel: 'destructive',
		description: 'Delete Order Line (DELETE /salesordersLines/{ID})',
	},
	'ordersStatuses.orderStatusesSchema': {
		riskLevel: 'read',
		description: 'Order Statuses schema (GET /salesorderStatuses/schema)',
	},
	'ordersStatuses.listOrderStatuses': {
		riskLevel: 'read',
		description: 'List Order Statuses (GET /salesorderStatuses)',
	},
	'ordersStatuses.createOrderStatus': {
		riskLevel: 'write',
		description: 'Create Order Status (POST /salesorderStatuses)',
	},
	'ordersStatuses.getOrderStatus': {
		riskLevel: 'read',
		description: 'Get Order Status (GET /salesorderStatuses/{ID})',
	},
	'ordersStatuses.updateOrderStatus': {
		riskLevel: 'write',
		description: 'Update Order Status (PUT /salesorderStatuses/{ID})',
	},
	'ordersStatuses.deleteOrderStatus': {
		riskLevel: 'destructive',
		description: 'Delete Order Status (DELETE /salesorderStatuses/{ID})',
	},
	'ordersTypes.orderTypesSchema': {
		riskLevel: 'read',
		description: 'Order Types schema (GET /orderTypes/schema)',
	},
	'ordersTypes.listOrderTypes': {
		riskLevel: 'read',
		description: 'List Order Types (GET /orderTypes)',
	},
	'ordersTypes.createOrderTypes': {
		riskLevel: 'write',
		description: 'Create Order Types (POST /orderTypes)',
	},
	'ordersTypes.getOrderTypes': {
		riskLevel: 'read',
		description: 'Get Order Types (GET /orderTypes/{ID})',
	},
	'ordersTypes.updateOrderTypes': {
		riskLevel: 'write',
		description: 'Update Order Types (PUT /orderTypes/{ID})',
	},
	'ordersTypes.deleteOrderTypes': {
		riskLevel: 'destructive',
		description: 'Delete Order Types (DELETE /orderTypes/{ID})',
	},
	'productsEntity.productsSchema': {
		riskLevel: 'read',
		description: 'Products schema (GET /products/schema)',
	},
	'productsEntity.listProducts': {
		riskLevel: 'read',
		description: 'List Products (GET /products)',
	},
	'productsEntity.createProduct': {
		riskLevel: 'write',
		description: 'Create Product (POST /products)',
	},
	'productsEntity.getProduct': {
		riskLevel: 'read',
		description: 'Get Product (GET /products/{ID})',
	},
	'productsEntity.updateProduct': {
		riskLevel: 'write',
		description: 'Update Product (PUT /products/{ID})',
	},
	'productsEntity.deleteProduct': {
		riskLevel: 'destructive',
		description: 'Delete Product (DELETE /products/{ID})',
	},
	'productsEntity.bulkCreateProducts': {
		riskLevel: 'write',
		description: 'Bulk Create Products (POST /products/bulk)',
	},
	'productsEntity.bulkUpdateProducts': {
		riskLevel: 'write',
		description: 'Bulk Update Products (PUT /products/bulk)',
	},
	'productsEntity.bulkDeleteProducts': {
		riskLevel: 'destructive',
		description: 'Bulk Delete Products (DELETE /products/bulk)',
	},
	'productsFamilies.productFamiliesSchema': {
		riskLevel: 'read',
		description: 'Product Families schema (GET /productFamilies/schema)',
	},
	'productsFamilies.listProductFamilies': {
		riskLevel: 'read',
		description: 'List Product Families (GET /productFamilies)',
	},
	'productsFamilies.createProductFamily': {
		riskLevel: 'write',
		description: 'Create Product Family (POST /productFamilies)',
	},
	'productsFamilies.getProductFamily': {
		riskLevel: 'read',
		description: 'Get Product Family (GET /productFamilies/{ID})',
	},
	'productsFamilies.updateProductFamily': {
		riskLevel: 'write',
		description: 'Update Product Family (PUT /productFamilies/{ID})',
	},
	'productUnitsOfMeasure.productUnitsOfMeasureSchema': {
		riskLevel: 'read',
		description:
			'Product Units Of Measure schema (GET /productUnitsOfMeasure/schema)',
	},
	'productUnitsOfMeasure.listProductUnitsOfMeasure': {
		riskLevel: 'read',
		description: 'List Product Units Of Measure (GET /productUnitsOfMeasure)',
	},
	'productUnitsOfMeasure.createProductUnitOfMeasure': {
		riskLevel: 'write',
		description: 'Create Product Unit Of Measure (POST /productUnitsOfMeasure)',
	},
	'productUnitsOfMeasure.getProductUnitOfMeasure': {
		riskLevel: 'read',
		description:
			'Get Product Unit Of Measure (GET /productUnitsOfMeasure/{ID})',
	},
	'productUnitsOfMeasure.updateProductUnitOfMeasure': {
		riskLevel: 'write',
		description:
			'Update Product Unit Of Measure (PUT /productUnitsOfMeasure/{ID})',
	},
	'productUnitsOfMeasure.deleteProductUnitOfMeasure': {
		riskLevel: 'destructive',
		description:
			'Delete Product Unit Of Measure (DELETE /productUnitsOfMeasure/{ID})',
	},
	'unitsOfMeasure.unitsOfMeasureSchema': {
		riskLevel: 'read',
		description: 'Units Of Measure schema (GET /unitsOfMeasure/schema)',
	},
	'unitsOfMeasure.listUnitsOfMeasure': {
		riskLevel: 'read',
		description: 'List Units Of Measure (GET /unitsOfMeasure)',
	},
	'unitsOfMeasure.createUnitOfMeasure': {
		riskLevel: 'write',
		description: 'Create Unit Of Measure (POST /unitsOfMeasure)',
	},
	'unitsOfMeasure.getUnitOfMeasure': {
		riskLevel: 'read',
		description: 'Get Unit Of Measure (GET /unitsOfMeasure/{ID})',
	},
	'unitsOfMeasure.updateUnitOfMeasure': {
		riskLevel: 'write',
		description: 'Update Unit Of Measure (PUT /unitsOfMeasure/{ID})',
	},
	'unitsOfMeasure.deleteUnitOfMeasure': {
		riskLevel: 'destructive',
		description: 'Delete Unit Of Measure (DELETE /unitsOfMeasure/{ID})',
	},
	'taxRates.taxRatesSchema': {
		riskLevel: 'read',
		description: 'Tax Rates schema (GET /taxRates/schema)',
	},
	'taxRates.listTaxRates': {
		riskLevel: 'read',
		description: 'List Tax Rates (GET /taxRates)',
	},
	'taxRates.createTaxRate': {
		riskLevel: 'write',
		description: 'Create Tax Rate (POST /taxRates)',
	},
	'taxRates.getTaxRate': {
		riskLevel: 'read',
		description: 'Get Tax Rate (GET /taxRates/{ID})',
	},
	'taxRates.updateTaxRate': {
		riskLevel: 'write',
		description: 'Update Tax Rate (PUT /taxRates/{ID})',
	},
	'taxRates.deleteTaxRate': {
		riskLevel: 'destructive',
		description: 'Delete Tax Rate (DELETE /taxRates/{ID})',
	},
	'taxProfiles.taxProfilesSchema': {
		riskLevel: 'read',
		description: 'Tax Profiles schema (GET /taxProfiles/schema)',
	},
	'taxProfiles.listTaxProfiles': {
		riskLevel: 'read',
		description: 'List Tax Profiles (GET /taxProfiles)',
	},
	'taxProfiles.getTaxProfile': {
		riskLevel: 'read',
		description: 'Get Tax Profile (GET /taxProfiles/{ID})',
	},
	'productFamiliesBranches.productFamiliesBranchesSchema': {
		riskLevel: 'read',
		description:
			'Product Families Branches schema (GET /productFamiliesBranches/schema)',
	},
	'productFamiliesBranches.listProductFamiliesBranches': {
		riskLevel: 'read',
		description:
			'List Product Families Branches (GET /productFamiliesBranches)',
	},
	'productFamiliesBranches.createProductFamiliesBranch': {
		riskLevel: 'write',
		description:
			'Create Product Families Branch (POST /productFamiliesBranches)',
	},
	'productFamiliesBranches.getProductFamiliesBranch': {
		riskLevel: 'read',
		description:
			'Get Product Families Branch (GET /productFamiliesBranches/{ID})',
	},
	'productFamiliesBranches.updateProductFamiliesBranch': {
		riskLevel: 'write',
		description:
			'Update Product Families Branch (PUT /productFamiliesBranches/{ID})',
	},
	'productFamiliesBranches.deleteProductFamiliesBranch': {
		riskLevel: 'destructive',
		description:
			'Delete Product Families Branch (DELETE /productFamiliesBranches/{ID})',
	},
	'productEnvironments.productEnvironmentsSchema': {
		riskLevel: 'read',
		description:
			'Product Environments schema (GET /productEnvironments/schema)',
	},
	'productEnvironments.listProductEnvironments': {
		riskLevel: 'read',
		description: 'List Product Environments (GET /productEnvironments)',
	},
	'productEnvironments.createProductEnvironment': {
		riskLevel: 'write',
		description: 'Create Product Environment (POST /productEnvironments)',
	},
	'productEnvironments.getProductEnvironment': {
		riskLevel: 'read',
		description: 'Get Product Environment (GET /productEnvironments/{ID})',
	},
	'productEnvironments.updateProductEnvironment': {
		riskLevel: 'write',
		description: 'Update Product Environment (PUT /productEnvironments/{ID})',
	},
	'productEnvironments.deleteProductEnvironment': {
		riskLevel: 'destructive',
		description:
			'Delete Product Environment (DELETE /productEnvironments/{ID})',
	},
	'productsCategories.productCategoriesSchema': {
		riskLevel: 'read',
		description: 'Product Categories schema (GET /productCategories/schema)',
	},
	'productsCategories.listProductCategories': {
		riskLevel: 'read',
		description: 'List Product Categories (GET /productCategories)',
	},
	'productsCategories.createProductCategory': {
		riskLevel: 'write',
		description: 'Create Product Category (POST /productCategories)',
	},
	'productsCategories.getProductCategory': {
		riskLevel: 'read',
		description: 'Get Product Category (GET /productCategories/{ID})',
	},
	'productsCategories.updateProductCategory': {
		riskLevel: 'write',
		description: 'Update Product Category (PUT /productCategories/{ID})',
	},
	'productsCategories.deleteProductCategory': {
		riskLevel: 'destructive',
		description: 'Delete Product Category (DELETE /productCategories/{ID})',
	},
	'productsRates.productRatesSchema': {
		riskLevel: 'read',
		description: 'Product Rates schema (GET /productRates/schema)',
	},
	'productsRates.listProductRates': {
		riskLevel: 'read',
		description: 'List Product Rates (GET /productRates)',
	},
	'productsRates.createProductRate': {
		riskLevel: 'write',
		description: 'Create Product Rate (POST /productRates)',
	},
	'productsRates.getProductRate': {
		riskLevel: 'read',
		description: 'Get Product Rate (GET /productRates/{ID})',
	},
	'productsRates.updateProductRate': {
		riskLevel: 'write',
		description: 'Update Product Rate (PUT /productRates/{ID})',
	},
	'productsRates.deleteProductRate': {
		riskLevel: 'destructive',
		description: 'Delete Product Rate (DELETE /productRates/{ID})',
	},
	'rates.ratesSchema': {
		riskLevel: 'read',
		description: 'Rates schema (GET /rates/schema)',
	},
	'rates.listRates': {
		riskLevel: 'read',
		description: 'List Rates (GET /rates)',
	},
	'rates.createRate': {
		riskLevel: 'write',
		description: 'Create Rate (POST /rates)',
	},
	'rates.getRate': {
		riskLevel: 'read',
		description: 'Get Rate (GET /rates/{ID})',
	},
	'rates.updateRate': {
		riskLevel: 'write',
		description: 'Update Rate (PUT /rates/{ID})',
	},
	'rates.deleteRate': {
		riskLevel: 'destructive',
		description: 'Delete Rate (DELETE /rates/{ID})',
	},
	'relatedAccountsEntity.relatedAccountsSchema': {
		riskLevel: 'read',
		description: 'Related Accounts schema (GET /accountsRelated/schema)',
	},
	'relatedAccountsEntity.listRelatedAccounts': {
		riskLevel: 'read',
		description: 'List Related Accounts (GET /accountsRelated)',
	},
	'relatedAccountsEntity.createRelatedAccount': {
		riskLevel: 'write',
		description: 'Create Related Account (POST /accountsRelated)',
	},
	'relatedAccountsEntity.retrieveRelatedAccount': {
		riskLevel: 'read',
		description: 'Retrieve Related Account (GET /accountsRelated/{ID})',
	},
	'relatedAccountsEntity.updateRelatedAccount': {
		riskLevel: 'write',
		description: 'Update Related Account (PUT /accountsRelated/{ID})',
	},
	'relatedAccountsEntity.deleteRelatedAccount': {
		riskLevel: 'destructive',
		description: 'Delete Related Account (DELETE /accountsRelated/{ID})',
	},
	'relatedAccountsTypes.relatedAccountTypesSchema': {
		riskLevel: 'read',
		description: 'Related Account Types schema (GET /accountsRelations/schema)',
	},
	'relatedAccountsTypes.listRelatedAccountTypes': {
		riskLevel: 'read',
		description: 'List Related Account Types (GET /accountsRelations)',
	},
	'relatedAccountsTypes.createRelatedAccountType': {
		riskLevel: 'write',
		description: 'Create Related Account Type (POST /accountsRelations)',
	},
	'relatedAccountsTypes.retrieveRelatedAccountType': {
		riskLevel: 'read',
		description: 'Retrieve Related Account Type (GET /accountsRelations/{ID})',
	},
	'relatedAccountsTypes.updateRelatedAccountType': {
		riskLevel: 'write',
		description: 'Update Related Account Type (PUT /accountsRelations/{ID})',
	},
	'relatedAccountsTypes.deleteRelatedAccountType': {
		riskLevel: 'destructive',
		description: 'Delete Related Account Type (DELETE /accountsRelations/{ID})',
	},
	'resources.getResources': {
		riskLevel: 'read',
		description: 'Get Resources (GET /resources)',
	},
	'roles.rolesSchema': {
		riskLevel: 'read',
		description: 'Roles schema (GET /roles/schema)',
	},
	'roles.listRoles': {
		riskLevel: 'read',
		description: 'List Roles (GET /roles)',
	},
	'roles.getRole': {
		riskLevel: 'read',
		description: 'Get Role (GET /roles/{ID})',
	},
	'roles.listRolesOfUser': {
		riskLevel: 'read',
		description: 'List Roles of User (GET /users/{ID}/roles)',
	},
	'roles.addRolesInUser': {
		riskLevel: 'write',
		description: 'Add Roles in User (PUT /users/{ID}/roles)',
	},
	'roles.deleteRolesInUser': {
		riskLevel: 'destructive',
		description: 'Delete Roles in User (DELETE /users/{ID}/roles)',
	},
	'roles.listUsersInRole': {
		riskLevel: 'read',
		description: 'List Users in Role (GET /roles/{ID}/users)',
	},
	'sales.salesSchema': {
		riskLevel: 'read',
		description: 'Sales schema (GET /sales/schema)',
	},
	'sales.listSales': {
		riskLevel: 'read',
		description: 'List Sales (GET /sales)',
	},
	'sales.createSale': {
		riskLevel: 'write',
		description: 'Create Sale (POST /sales)',
	},
	'sales.getSale': {
		riskLevel: 'read',
		description: 'Get Sale (GET /sales/{ID})',
	},
	'sales.updateSale': {
		riskLevel: 'write',
		description: 'Update Sale (PUT /sales/{ID})',
	},
	'sales.deleteSale': {
		riskLevel: 'destructive',
		description: 'Delete Sale (DELETE /sales/{ID})',
	},
	'timeZones.listTimezones': {
		riskLevel: 'read',
		description: 'List TimeZones (GET /timezones)',
	},
	'usersEntity.usersSchema': {
		riskLevel: 'read',
		description: 'Users schema (GET /users/schema)',
	},
	'usersEntity.listUsers': {
		riskLevel: 'read',
		description: 'List Users (GET /users)',
	},
	'usersEntity.createUser': {
		riskLevel: 'write',
		description: 'Create User (POST /users)',
	},
	'usersEntity.getUser': {
		riskLevel: 'read',
		description: 'Get User (GET /users/{ID})',
	},
	'usersEntity.updateUser': {
		riskLevel: 'write',
		description: 'Update User (PUT /users/{ID})',
	},
	'usersEntity.deleteUser': {
		riskLevel: 'destructive',
		description: 'Delete User (DELETE /users/{ID})',
	},
	'usersEntity.listUserHierarchy': {
		riskLevel: 'read',
		description: 'List User Hierarchy (GET /users/{ID}/hierarchy)',
	},
	'usersEntity.listUsersScores': {
		riskLevel: 'read',
		description: 'List Users Scores (GET /users/scores)',
	},
	'usersTypes.userTypesSchema': {
		riskLevel: 'read',
		description: 'User Types schema (GET /userTypes/schema)',
	},
	'usersTypes.listUserTypes': {
		riskLevel: 'read',
		description: 'List User Types (GET /userTypes)',
	},
	'usersTypes.createUserType': {
		riskLevel: 'write',
		description: 'Create User Type (POST /userTypes)',
	},
	'usersTypes.getUserType': {
		riskLevel: 'read',
		description: 'Get User Type (GET /userTypes/{ID})',
	},
	'usersTypes.updateUserType': {
		riskLevel: 'write',
		description: 'Update User Type (PUT /userTypes/{ID})',
	},
	'valueListsEntity.listLists': {
		riskLevel: 'read',
		description: 'List Lists (GET /list)',
	},
	'valueListsEntity.createList': {
		riskLevel: 'write',
		description: 'Create List (POST /list)',
	},
	'valueListsEntity.updateList': {
		riskLevel: 'write',
		description: 'Update List (PUT /list/VALUE)',
	},
	'valueListsEntity.deleteList': {
		riskLevel: 'destructive',
		description: 'Delete List (DELETE /list/VALUE)',
	},
	'valueListsValues.listValues': {
		riskLevel: 'read',
		description: 'List Values (GET /list/VALUE)',
	},
	'valueListsValues.createValue': {
		riskLevel: 'write',
		description: 'Create Value (POST /list/VALUE)',
	},
	'valueListsValues.valuesListSchema': {
		riskLevel: 'read',
		description: 'Values List schema (GET /list/VALUE/schema)',
	},
	'valueListsValues.getValue': {
		riskLevel: 'read',
		description: 'Get Value (GET /list/VALUE/{ID})',
	},
	'valueListsValues.updateValue': {
		riskLevel: 'write',
		description: 'Update Value (PUT /list/VALUE/{ID})',
	},
	'valueListsValues.deleteValue': {
		riskLevel: 'destructive',
		description: 'Delete Value (DELETE /list/VALUE/{ID})',
	},
	'warnings.listWarningsOfAResource': {
		riskLevel: 'read',
		description: 'List Warnings of a Resource (GET /VALUE/VALUE/warnings)',
	},
	'warnings.createWarningForAResourceCopy': {
		riskLevel: 'write',
		description:
			'Create Warning for a Resource Copy (POST /VALUE/VALUE/warnings)',
	},
	'warnings.updateWarningOfAResource': {
		riskLevel: 'write',
		description:
			'Update Warning of a Resource (PUT /VALUE/VALUE/warnings/VALUE)',
	},
	'warnings.deleteWarningOfAResource': {
		riskLevel: 'destructive',
		description:
			'Delete Warning of a Resource (DELETE /VALUE/VALUE/warnings/VALUE)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof forceManagerEndpointsNested
>;

export const forceManagerAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

type BaseForceManagerPlugin<T extends ForceManagerPluginOptions> =
	CorsairPlugin<
		'forcemanager',
		typeof ForceManagerSchema,
		typeof forceManagerEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
type InternalForceManagerPlugin =
	BaseForceManagerPlugin<ForceManagerPluginOptions>;
export type ExternalForceManagerPlugin<T extends ForceManagerPluginOptions> =
	BaseForceManagerPlugin<T>;
const defaultAuthType: AuthTypes = 'api_key';

export function forcemanager<const T extends ForceManagerPluginOptions>(
	incomingOptions: ForceManagerPluginOptions &
		T = {} as ForceManagerPluginOptions & T,
): ExternalForceManagerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'forcemanager',
		authConfig: forceManagerAuthConfig,
		schema: ForceManagerSchema,
		options,
		hooks: options.hooks,
		endpoints: forceManagerEndpointsNested,
		webhooks: {},
		endpointMeta: forceManagerEndpointMeta,
		endpointSchemas: forceManagerEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ForceManagerKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('forcemanager', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('forcemanager', 'api_key');
			return apiKey;
		},
	} satisfies InternalForceManagerPlugin;
}

export type { ForceManagerEndpointInputs, ForceManagerEndpointOutputs };
