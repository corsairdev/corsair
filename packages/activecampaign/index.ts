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
	Accounts,
	Contacts,
	Content,
	Deals,
	Fields,
	Imports,
	Lists,
	Platform,
	SegmentsV2,
	Tags,
} from './endpoints';
import type {
	ActiveCampaignEndpointInputs,
	ActiveCampaignEndpointOutputs,
} from './endpoints/types';
import {
	ActiveCampaignEndpointInputSchemas,
	ActiveCampaignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ActiveCampaignSchema } from './schema';

export type ActiveCampaignPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The account slug - the subdomain of the account's API URL,
	 * `https://<account>.api-us1.com`. ActiveCampaign hosts every account on
	 * its own subdomain, so this is required alongside the API token and
	 * cannot be derived from it.
	 */
	account?: string;
	hooks?: InternalActiveCampaignPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof activecampaignEndpointsNested>;
};

/**
 * Declaring `account: ['account']` generates `ctx.keys.get_account()`, which is
 * how the second half of the credential reaches an endpoint when it is not
 * passed as a plugin option.
 */
export const activecampaignAuthConfig = {
	api_key: {
		account: ['account'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ActiveCampaignContext = CorsairPluginContext<
	typeof ActiveCampaignSchema,
	ActiveCampaignPluginOptions,
	undefined,
	typeof activecampaignAuthConfig
>;

export type ActiveCampaignKeyBuilderContext = KeyBuilderContext<
	ActiveCampaignPluginOptions,
	typeof activecampaignAuthConfig
>;

export type ActiveCampaignBoundEndpoints = BindEndpoints<
	typeof activecampaignEndpointsNested
>;

type ActiveCampaignEndpoint<K extends keyof ActiveCampaignEndpointOutputs> =
	CorsairEndpoint<
		ActiveCampaignContext,
		ActiveCampaignEndpointInputs[K],
		ActiveCampaignEndpointOutputs[K]
	>;

export type ActiveCampaignEndpoints = {
	contactsList: ActiveCampaignEndpoint<'contactsList'>;
	contactsGet: ActiveCampaignEndpoint<'contactsGet'>;
	contactsFind: ActiveCampaignEndpoint<'contactsFind'>;
	contactsCreateOrUpdate: ActiveCampaignEndpoint<'contactsCreateOrUpdate'>;
	contactsUpdate: ActiveCampaignEndpoint<'contactsUpdate'>;
	contactsDelete: ActiveCampaignEndpoint<'contactsDelete'>;
	contactsGetLists: ActiveCampaignEndpoint<'contactsGetLists'>;
	contactsGetTags: ActiveCampaignEndpoint<'contactsGetTags'>;
	contactsGetFieldValues: ActiveCampaignEndpoint<'contactsGetFieldValues'>;
	contactsGetAutomations: ActiveCampaignEndpoint<'contactsGetAutomations'>;
	contactsGetGeoIps: ActiveCampaignEndpoint<'contactsGetGeoIps'>;
	contactsGetScoreValues: ActiveCampaignEndpoint<'contactsGetScoreValues'>;
	contactsGetDeals: ActiveCampaignEndpoint<'contactsGetDeals'>;
	listsList: ActiveCampaignEndpoint<'listsList'>;
	listsGet: ActiveCampaignEndpoint<'listsGet'>;
	listsCreate: ActiveCampaignEndpoint<'listsCreate'>;
	listsDelete: ActiveCampaignEndpoint<'listsDelete'>;
	listsUpdateSubscription: ActiveCampaignEndpoint<'listsUpdateSubscription'>;
	contactListsList: ActiveCampaignEndpoint<'contactListsList'>;
	tagsList: ActiveCampaignEndpoint<'tagsList'>;
	tagsGet: ActiveCampaignEndpoint<'tagsGet'>;
	tagsCreate: ActiveCampaignEndpoint<'tagsCreate'>;
	tagsUpdate: ActiveCampaignEndpoint<'tagsUpdate'>;
	tagsDelete: ActiveCampaignEndpoint<'tagsDelete'>;
	tagsAddToContact: ActiveCampaignEndpoint<'tagsAddToContact'>;
	tagsRemoveFromContact: ActiveCampaignEndpoint<'tagsRemoveFromContact'>;
	contactTagsList: ActiveCampaignEndpoint<'contactTagsList'>;
	fieldsList: ActiveCampaignEndpoint<'fieldsList'>;
	fieldsGet: ActiveCampaignEndpoint<'fieldsGet'>;
	fieldsCreate: ActiveCampaignEndpoint<'fieldsCreate'>;
	fieldsUpdate: ActiveCampaignEndpoint<'fieldsUpdate'>;
	fieldsDelete: ActiveCampaignEndpoint<'fieldsDelete'>;
	fieldOptionsCreateBulk: ActiveCampaignEndpoint<'fieldOptionsCreateBulk'>;
	fieldValuesList: ActiveCampaignEndpoint<'fieldValuesList'>;
	fieldValuesGet: ActiveCampaignEndpoint<'fieldValuesGet'>;
	fieldValuesSetForContact: ActiveCampaignEndpoint<'fieldValuesSetForContact'>;
	fieldValuesUpdate: ActiveCampaignEndpoint<'fieldValuesUpdate'>;
	fieldValuesDelete: ActiveCampaignEndpoint<'fieldValuesDelete'>;
	fieldRelsList: ActiveCampaignEndpoint<'fieldRelsList'>;
	fieldRelsCreate: ActiveCampaignEndpoint<'fieldRelsCreate'>;
	fieldRelsDelete: ActiveCampaignEndpoint<'fieldRelsDelete'>;
	groupMembersList: ActiveCampaignEndpoint<'groupMembersList'>;
	groupMembersCreate: ActiveCampaignEndpoint<'groupMembersCreate'>;
	groupMembersUpdate: ActiveCampaignEndpoint<'groupMembersUpdate'>;
	groupMembersDelete: ActiveCampaignEndpoint<'groupMembersDelete'>;
	contactsGetLogs: ActiveCampaignEndpoint<'contactsGetLogs'>;
	contactsGetTrackingLogs: ActiveCampaignEndpoint<'contactsGetTrackingLogs'>;
	contactsGetGoals: ActiveCampaignEndpoint<'contactsGetGoals'>;
	contactsGetAccountContacts: ActiveCampaignEndpoint<'contactsGetAccountContacts'>;
	contactsGetNotes: ActiveCampaignEndpoint<'contactsGetNotes'>;
	contactsGetData: ActiveCampaignEndpoint<'contactsGetData'>;
	contactsGetOrganization: ActiveCampaignEndpoint<'contactsGetOrganization'>;
	contactsGetPlusAppend: ActiveCampaignEndpoint<'contactsGetPlusAppend'>;
	activitiesList: ActiveCampaignEndpoint<'activitiesList'>;
	importsCreateBulk: ActiveCampaignEndpoint<'importsCreateBulk'>;
	importsList: ActiveCampaignEndpoint<'importsList'>;
	importsGetStatus: ActiveCampaignEndpoint<'importsGetStatus'>;
	listGroupsCreate: ActiveCampaignEndpoint<'listGroupsCreate'>;
	dealsList: ActiveCampaignEndpoint<'dealsList'>;
	dealsListFiltered: ActiveCampaignEndpoint<'dealsListFiltered'>;
	dealsGet: ActiveCampaignEndpoint<'dealsGet'>;
	dealsUpdate: ActiveCampaignEndpoint<'dealsUpdate'>;
	dealsDelete: ActiveCampaignEndpoint<'dealsDelete'>;
	dealsUpdateOwnersBulk: ActiveCampaignEndpoint<'dealsUpdateOwnersBulk'>;
	dealGroupsList: ActiveCampaignEndpoint<'dealGroupsList'>;
	dealGroupsGet: ActiveCampaignEndpoint<'dealGroupsGet'>;
	dealGroupsCreate: ActiveCampaignEndpoint<'dealGroupsCreate'>;
	dealGroupsUpdate: ActiveCampaignEndpoint<'dealGroupsUpdate'>;
	dealGroupsDelete: ActiveCampaignEndpoint<'dealGroupsDelete'>;
	dealStagesList: ActiveCampaignEndpoint<'dealStagesList'>;
	dealStagesGet: ActiveCampaignEndpoint<'dealStagesGet'>;
	dealStagesCreate: ActiveCampaignEndpoint<'dealStagesCreate'>;
	dealStagesUpdate: ActiveCampaignEndpoint<'dealStagesUpdate'>;
	dealStagesDelete: ActiveCampaignEndpoint<'dealStagesDelete'>;
	dealStagesMoveDeals: ActiveCampaignEndpoint<'dealStagesMoveDeals'>;
	dealStagesDeleteWithDeals: ActiveCampaignEndpoint<'dealStagesDeleteWithDeals'>;
	dealTasksList: ActiveCampaignEndpoint<'dealTasksList'>;
	dealTasksGet: ActiveCampaignEndpoint<'dealTasksGet'>;
	dealTasksCreate: ActiveCampaignEndpoint<'dealTasksCreate'>;
	dealTasksUpdate: ActiveCampaignEndpoint<'dealTasksUpdate'>;
	dealTasksDelete: ActiveCampaignEndpoint<'dealTasksDelete'>;
	dealTaskTypesList: ActiveCampaignEndpoint<'dealTaskTypesList'>;
	dealTaskTypesGet: ActiveCampaignEndpoint<'dealTaskTypesGet'>;
	dealTaskTypesCreate: ActiveCampaignEndpoint<'dealTaskTypesCreate'>;
	dealTaskTypesUpdate: ActiveCampaignEndpoint<'dealTaskTypesUpdate'>;
	taskOutcomesList: ActiveCampaignEndpoint<'taskOutcomesList'>;
	taskOutcomesGet: ActiveCampaignEndpoint<'taskOutcomesGet'>;
	taskOutcomesCreate: ActiveCampaignEndpoint<'taskOutcomesCreate'>;
	dealRolesList: ActiveCampaignEndpoint<'dealRolesList'>;
	dealRolesCreate: ActiveCampaignEndpoint<'dealRolesCreate'>;
	dealRolesDelete: ActiveCampaignEndpoint<'dealRolesDelete'>;
	contactDealsList: ActiveCampaignEndpoint<'contactDealsList'>;
	contactDealsGet: ActiveCampaignEndpoint<'contactDealsGet'>;
	contactDealsCreate: ActiveCampaignEndpoint<'contactDealsCreate'>;
	contactDealsUpdate: ActiveCampaignEndpoint<'contactDealsUpdate'>;
	contactDealsDelete: ActiveCampaignEndpoint<'contactDealsDelete'>;
	dealCustomFieldMetaList: ActiveCampaignEndpoint<'dealCustomFieldMetaList'>;
	dealCustomFieldMetaGet: ActiveCampaignEndpoint<'dealCustomFieldMetaGet'>;
	dealCustomFieldMetaCreate: ActiveCampaignEndpoint<'dealCustomFieldMetaCreate'>;
	dealCustomFieldMetaUpdate: ActiveCampaignEndpoint<'dealCustomFieldMetaUpdate'>;
	dealCustomFieldMetaDelete: ActiveCampaignEndpoint<'dealCustomFieldMetaDelete'>;
	dealCustomFieldDataList: ActiveCampaignEndpoint<'dealCustomFieldDataList'>;
	dealCustomFieldDataGet: ActiveCampaignEndpoint<'dealCustomFieldDataGet'>;
	dealCustomFieldDataUpdate: ActiveCampaignEndpoint<'dealCustomFieldDataUpdate'>;
	dealCustomFieldDataDelete: ActiveCampaignEndpoint<'dealCustomFieldDataDelete'>;
	dealActivitiesList: ActiveCampaignEndpoint<'dealActivitiesList'>;
	accountsList: ActiveCampaignEndpoint<'accountsList'>;
	accountsGet: ActiveCampaignEndpoint<'accountsGet'>;
	accountsCreate: ActiveCampaignEndpoint<'accountsCreate'>;
	accountsUpdate: ActiveCampaignEndpoint<'accountsUpdate'>;
	accountsDelete: ActiveCampaignEndpoint<'accountsDelete'>;
	accountsUpsert: ActiveCampaignEndpoint<'accountsUpsert'>;
	accountsDeleteBulk: ActiveCampaignEndpoint<'accountsDeleteBulk'>;
	accountContactsList: ActiveCampaignEndpoint<'accountContactsList'>;
	accountContactsGet: ActiveCampaignEndpoint<'accountContactsGet'>;
	accountContactsCreate: ActiveCampaignEndpoint<'accountContactsCreate'>;
	accountContactsUpdate: ActiveCampaignEndpoint<'accountContactsUpdate'>;
	accountContactsDelete: ActiveCampaignEndpoint<'accountContactsDelete'>;
	accountCustomFieldMetaList: ActiveCampaignEndpoint<'accountCustomFieldMetaList'>;
	accountCustomFieldMetaGet: ActiveCampaignEndpoint<'accountCustomFieldMetaGet'>;
	accountCustomFieldMetaCreate: ActiveCampaignEndpoint<'accountCustomFieldMetaCreate'>;
	accountCustomFieldMetaUpdate: ActiveCampaignEndpoint<'accountCustomFieldMetaUpdate'>;
	accountCustomFieldMetaDelete: ActiveCampaignEndpoint<'accountCustomFieldMetaDelete'>;
	accountCustomFieldDataList: ActiveCampaignEndpoint<'accountCustomFieldDataList'>;
	accountCustomFieldDataGet: ActiveCampaignEndpoint<'accountCustomFieldDataGet'>;
	accountCustomFieldDataCreate: ActiveCampaignEndpoint<'accountCustomFieldDataCreate'>;
	accountCustomFieldDataUpdate: ActiveCampaignEndpoint<'accountCustomFieldDataUpdate'>;
	accountCustomFieldDataDelete: ActiveCampaignEndpoint<'accountCustomFieldDataDelete'>;
	accountCustomFieldDataCreateBulk: ActiveCampaignEndpoint<'accountCustomFieldDataCreateBulk'>;
	accountCustomFieldDataUpdateBulk: ActiveCampaignEndpoint<'accountCustomFieldDataUpdateBulk'>;
	notesList: ActiveCampaignEndpoint<'notesList'>;
	notesGet: ActiveCampaignEndpoint<'notesGet'>;
	notesCreate: ActiveCampaignEndpoint<'notesCreate'>;
	notesUpdate: ActiveCampaignEndpoint<'notesUpdate'>;
	notesDelete: ActiveCampaignEndpoint<'notesDelete'>;
	notesAddToContact: ActiveCampaignEndpoint<'notesAddToContact'>;
	campaignsList: ActiveCampaignEndpoint<'campaignsList'>;
	campaignsGet: ActiveCampaignEndpoint<'campaignsGet'>;
	campaignsCreate: ActiveCampaignEndpoint<'campaignsCreate'>;
	campaignsUpdate: ActiveCampaignEndpoint<'campaignsUpdate'>;
	campaignsDuplicate: ActiveCampaignEndpoint<'campaignsDuplicate'>;
	campaignsGetLinks: ActiveCampaignEndpoint<'campaignsGetLinks'>;
	campaignsGetMessages: ActiveCampaignEndpoint<'campaignsGetMessages'>;
	campaignsGetAutomations: ActiveCampaignEndpoint<'campaignsGetAutomations'>;
	campaignsGetAutomationLists: ActiveCampaignEndpoint<'campaignsGetAutomationLists'>;
	campaignsGetUser: ActiveCampaignEndpoint<'campaignsGetUser'>;
	messagesList: ActiveCampaignEndpoint<'messagesList'>;
	messagesGet: ActiveCampaignEndpoint<'messagesGet'>;
	messagesCreate: ActiveCampaignEndpoint<'messagesCreate'>;
	messagesUpdate: ActiveCampaignEndpoint<'messagesUpdate'>;
	messagesDelete: ActiveCampaignEndpoint<'messagesDelete'>;
	savedResponsesList: ActiveCampaignEndpoint<'savedResponsesList'>;
	savedResponsesGet: ActiveCampaignEndpoint<'savedResponsesGet'>;
	savedResponsesCreate: ActiveCampaignEndpoint<'savedResponsesCreate'>;
	savedResponsesUpdate: ActiveCampaignEndpoint<'savedResponsesUpdate'>;
	savedResponsesDelete: ActiveCampaignEndpoint<'savedResponsesDelete'>;
	formsList: ActiveCampaignEndpoint<'formsList'>;
	formsGet: ActiveCampaignEndpoint<'formsGet'>;
	formsDelete: ActiveCampaignEndpoint<'formsDelete'>;
	formsCreateOptin: ActiveCampaignEndpoint<'formsCreateOptin'>;
	personalizationsList: ActiveCampaignEndpoint<'personalizationsList'>;
	personalizationsGet: ActiveCampaignEndpoint<'personalizationsGet'>;
	personalizationsCreate: ActiveCampaignEndpoint<'personalizationsCreate'>;
	personalizationsUpdate: ActiveCampaignEndpoint<'personalizationsUpdate'>;
	personalizationsDelete: ActiveCampaignEndpoint<'personalizationsDelete'>;
	personalizationsDeleteBulk: ActiveCampaignEndpoint<'personalizationsDeleteBulk'>;
	personalizationsLock: ActiveCampaignEndpoint<'personalizationsLock'>;
	personalizationsUnlock: ActiveCampaignEndpoint<'personalizationsUnlock'>;
	templatesGet: ActiveCampaignEndpoint<'templatesGet'>;
	templatesCreateShareLink: ActiveCampaignEndpoint<'templatesCreateShareLink'>;
	automationsList: ActiveCampaignEndpoint<'automationsList'>;
	contactAutomationsList: ActiveCampaignEndpoint<'contactAutomationsList'>;
	contactAutomationsGet: ActiveCampaignEndpoint<'contactAutomationsGet'>;
	contactAutomationsEntryCounts: ActiveCampaignEndpoint<'contactAutomationsEntryCounts'>;
	contactAutomationsAdd: ActiveCampaignEndpoint<'contactAutomationsAdd'>;
	contactAutomationsRemove: ActiveCampaignEndpoint<'contactAutomationsRemove'>;
	segmentsList: ActiveCampaignEndpoint<'segmentsList'>;
	segmentsGet: ActiveCampaignEndpoint<'segmentsGet'>;
	segmentsCreate: ActiveCampaignEndpoint<'segmentsCreate'>;
	segmentsUpdate: ActiveCampaignEndpoint<'segmentsUpdate'>;
	segmentsDelete: ActiveCampaignEndpoint<'segmentsDelete'>;
	segmentsListAudiences: ActiveCampaignEndpoint<'segmentsListAudiences'>;
	connectionsList: ActiveCampaignEndpoint<'connectionsList'>;
	connectionsGet: ActiveCampaignEndpoint<'connectionsGet'>;
	connectionsCreate: ActiveCampaignEndpoint<'connectionsCreate'>;
	connectionsUpdate: ActiveCampaignEndpoint<'connectionsUpdate'>;
	connectionsDelete: ActiveCampaignEndpoint<'connectionsDelete'>;
	ecomCustomersList: ActiveCampaignEndpoint<'ecomCustomersList'>;
	ecomCustomersGet: ActiveCampaignEndpoint<'ecomCustomersGet'>;
	ecomCustomersCreate: ActiveCampaignEndpoint<'ecomCustomersCreate'>;
	ecomCustomersUpdate: ActiveCampaignEndpoint<'ecomCustomersUpdate'>;
	ecomCustomersDelete: ActiveCampaignEndpoint<'ecomCustomersDelete'>;
	ecomOrdersList: ActiveCampaignEndpoint<'ecomOrdersList'>;
	ecomOrdersGet: ActiveCampaignEndpoint<'ecomOrdersGet'>;
	ecomOrdersCreate: ActiveCampaignEndpoint<'ecomOrdersCreate'>;
	ecomOrdersUpdate: ActiveCampaignEndpoint<'ecomOrdersUpdate'>;
	ecomOrdersDelete: ActiveCampaignEndpoint<'ecomOrdersDelete'>;
	ecomOrderProductsList: ActiveCampaignEndpoint<'ecomOrderProductsList'>;
	ecomOrderProductsGet: ActiveCampaignEndpoint<'ecomOrderProductsGet'>;
	customObjectSchemasList: ActiveCampaignEndpoint<'customObjectSchemasList'>;
	customObjectSchemasGet: ActiveCampaignEndpoint<'customObjectSchemasGet'>;
	customObjectSchemasCreate: ActiveCampaignEndpoint<'customObjectSchemasCreate'>;
	customObjectSchemasUpdate: ActiveCampaignEndpoint<'customObjectSchemasUpdate'>;
	customObjectSchemasDelete: ActiveCampaignEndpoint<'customObjectSchemasDelete'>;
	customObjectRecordsList: ActiveCampaignEndpoint<'customObjectRecordsList'>;
	customObjectRecordsUpsert: ActiveCampaignEndpoint<'customObjectRecordsUpsert'>;
	customObjectRecordsGet: ActiveCampaignEndpoint<'customObjectRecordsGet'>;
	customObjectRecordsGetByExternalId: ActiveCampaignEndpoint<'customObjectRecordsGetByExternalId'>;
	customObjectRecordsDelete: ActiveCampaignEndpoint<'customObjectRecordsDelete'>;
	customObjectRecordsDeleteByExternalId: ActiveCampaignEndpoint<'customObjectRecordsDeleteByExternalId'>;
	webhooksList: ActiveCampaignEndpoint<'webhooksList'>;
	webhooksGet: ActiveCampaignEndpoint<'webhooksGet'>;
	webhooksCreate: ActiveCampaignEndpoint<'webhooksCreate'>;
	webhooksUpdate: ActiveCampaignEndpoint<'webhooksUpdate'>;
	webhooksDelete: ActiveCampaignEndpoint<'webhooksDelete'>;
	usersList: ActiveCampaignEndpoint<'usersList'>;
	usersGet: ActiveCampaignEndpoint<'usersGet'>;
	usersCreate: ActiveCampaignEndpoint<'usersCreate'>;
	usersUpdate: ActiveCampaignEndpoint<'usersUpdate'>;
	usersDelete: ActiveCampaignEndpoint<'usersDelete'>;
	usersGetMe: ActiveCampaignEndpoint<'usersGetMe'>;
	usersGetByUsername: ActiveCampaignEndpoint<'usersGetByUsername'>;
	groupsList: ActiveCampaignEndpoint<'groupsList'>;
	groupsGet: ActiveCampaignEndpoint<'groupsGet'>;
	groupsCreate: ActiveCampaignEndpoint<'groupsCreate'>;
	groupsUpdate: ActiveCampaignEndpoint<'groupsUpdate'>;
	groupsDelete: ActiveCampaignEndpoint<'groupsDelete'>;
	groupLimitsList: ActiveCampaignEndpoint<'groupLimitsList'>;
	addressesList: ActiveCampaignEndpoint<'addressesList'>;
	addressesGet: ActiveCampaignEndpoint<'addressesGet'>;
	addressesCreate: ActiveCampaignEndpoint<'addressesCreate'>;
	addressesUpdate: ActiveCampaignEndpoint<'addressesUpdate'>;
	addressesDelete: ActiveCampaignEndpoint<'addressesDelete'>;
	calendarsList: ActiveCampaignEndpoint<'calendarsList'>;
	calendarsGet: ActiveCampaignEndpoint<'calendarsGet'>;
	calendarsCreate: ActiveCampaignEndpoint<'calendarsCreate'>;
	calendarsUpdate: ActiveCampaignEndpoint<'calendarsUpdate'>;
	calendarsDelete: ActiveCampaignEndpoint<'calendarsDelete'>;
	eventTrackingEventsList: ActiveCampaignEndpoint<'eventTrackingEventsList'>;
	eventTrackingEventsCreate: ActiveCampaignEndpoint<'eventTrackingEventsCreate'>;
	eventTrackingEventsDelete: ActiveCampaignEndpoint<'eventTrackingEventsDelete'>;
	trackingGetSiteStatus: ActiveCampaignEndpoint<'trackingGetSiteStatus'>;
	trackingGetEventStatus: ActiveCampaignEndpoint<'trackingGetEventStatus'>;
	trackingSetSiteStatus: ActiveCampaignEndpoint<'trackingSetSiteStatus'>;
	trackingSetEventStatus: ActiveCampaignEndpoint<'trackingSetEventStatus'>;
	trackingTrackEvent: ActiveCampaignEndpoint<'trackingTrackEvent'>;
	trackingListWhitelist: ActiveCampaignEndpoint<'trackingListWhitelist'>;
	trackingAddWhitelist: ActiveCampaignEndpoint<'trackingAddWhitelist'>;
	trackingRemoveWhitelist: ActiveCampaignEndpoint<'trackingRemoveWhitelist'>;
	scoresList: ActiveCampaignEndpoint<'scoresList'>;
	emailActivitiesList: ActiveCampaignEndpoint<'emailActivitiesList'>;
	brandingsGet: ActiveCampaignEndpoint<'brandingsGet'>;
	brandingsUpdate: ActiveCampaignEndpoint<'brandingsUpdate'>;
	configsUpdate: ActiveCampaignEndpoint<'configsUpdate'>;
	productsSearch: ActiveCampaignEndpoint<'productsSearch'>;
	productsGet: ActiveCampaignEndpoint<'productsGet'>;
	productsCreate: ActiveCampaignEndpoint<'productsCreate'>;
	productsUpdate: ActiveCampaignEndpoint<'productsUpdate'>;
	productsDelete: ActiveCampaignEndpoint<'productsDelete'>;
	productsUpsertBulk: ActiveCampaignEndpoint<'productsUpsertBulk'>;
	ordersUpsertBulk: ActiveCampaignEndpoint<'ordersUpsertBulk'>;
	ordersUpsertBulkAsync: ActiveCampaignEndpoint<'ordersUpsertBulkAsync'>;
	recurringPaymentsSearch: ActiveCampaignEndpoint<'recurringPaymentsSearch'>;
	recurringPaymentsUpsertBulk: ActiveCampaignEndpoint<'recurringPaymentsUpsertBulk'>;
	browseSessionsSearch: ActiveCampaignEndpoint<'browseSessionsSearch'>;
	browseSessionsSave: ActiveCampaignEndpoint<'browseSessionsSave'>;
	browseSessionsAddToCart: ActiveCampaignEndpoint<'browseSessionsAddToCart'>;
	smsBroadcastsList: ActiveCampaignEndpoint<'smsBroadcastsList'>;
	smsBroadcastsGetMetrics: ActiveCampaignEndpoint<'smsBroadcastsGetMetrics'>;
	smsBroadcastsGetSnapshot: ActiveCampaignEndpoint<'smsBroadcastsGetSnapshot'>;
	smsBroadcastsCreateSnapshot: ActiveCampaignEndpoint<'smsBroadcastsCreateSnapshot'>;
	smsBroadcastsGetFailures: ActiveCampaignEndpoint<'smsBroadcastsGetFailures'>;
	smsBroadcastsGetRecipients: ActiveCampaignEndpoint<'smsBroadcastsGetRecipients'>;
	smsCreditsGet: ActiveCampaignEndpoint<'smsCreditsGet'>;
	trackingGetCode: ActiveCampaignEndpoint<'trackingGetCode'>;
	smsBroadcastListsList: ActiveCampaignEndpoint<'smsBroadcastListsList'>;
	addressGroupsDelete: ActiveCampaignEndpoint<'addressGroupsDelete'>;
	ecomOrdersFind: ActiveCampaignEndpoint<'ecomOrdersFind'>;
	ecomOrdersUpsert: ActiveCampaignEndpoint<'ecomOrdersUpsert'>;
	ecomOrderProductsListForOrder: ActiveCampaignEndpoint<'ecomOrderProductsListForOrder'>;
	notesCreateForAccount: ActiveCampaignEndpoint<'notesCreateForAccount'>;
	notesCreateForDeal: ActiveCampaignEndpoint<'notesCreateForDeal'>;
	notesUpdateForAccount: ActiveCampaignEndpoint<'notesUpdateForAccount'>;
	notesUpdateForDeal: ActiveCampaignEndpoint<'notesUpdateForDeal'>;
	contactTasksCreate: ActiveCampaignEndpoint<'contactTasksCreate'>;
	contactTasksFind: ActiveCampaignEndpoint<'contactTasksFind'>;
	segmentsV2Create: ActiveCampaignEndpoint<'segmentsV2Create'>;
	segmentsV2Get: ActiveCampaignEndpoint<'segmentsV2Get'>;
	segmentsV2Update: ActiveCampaignEndpoint<'segmentsV2Update'>;
	segmentsV2Delete: ActiveCampaignEndpoint<'segmentsV2Delete'>;
	segmentsV2GetAtTimestamp: ActiveCampaignEndpoint<'segmentsV2GetAtTimestamp'>;
	segmentsV2RevertToTimestamp: ActiveCampaignEndpoint<'segmentsV2RevertToTimestamp'>;
	segmentsV2RecentCounts: ActiveCampaignEndpoint<'segmentsV2RecentCounts'>;
	segmentsV2CountHistory: ActiveCampaignEndpoint<'segmentsV2CountHistory'>;
	segmentsV2CountAtTimestamp: ActiveCampaignEndpoint<'segmentsV2CountAtTimestamp'>;
	segmentsV2Match: ActiveCampaignEndpoint<'segmentsV2Match'>;
	segmentsV2MatchByExternalId: ActiveCampaignEndpoint<'segmentsV2MatchByExternalId'>;
	segmentsV2MatchAll: ActiveCampaignEndpoint<'segmentsV2MatchAll'>;
	segmentsV2MatchAllResult: ActiveCampaignEndpoint<'segmentsV2MatchAllResult'>;
	segmentsV2MatchSomeResult: ActiveCampaignEndpoint<'segmentsV2MatchSomeResult'>;
	taskRemindersCreate: ActiveCampaignEndpoint<'taskRemindersCreate'>;
	customObjectSchemasCreateChild: ActiveCampaignEndpoint<'customObjectSchemasCreateChild'>;
	importsListAggregate: ActiveCampaignEndpoint<'importsListAggregate'>;
	browseSessionsTestEvent: ActiveCampaignEndpoint<'browseSessionsTestEvent'>;
};

/**
 * The nested tree is grouped by API resource, and each leaf is named so that
 * `<group>.<leaf>` camel-cased gives exactly the operation key used by the
 * schema registry - `fieldValues.setForContact` -> `fieldValuesSetForContact`.
 * `endpoints.test.ts` asserts that mapping holds for every path, because the
 * retry-safety check depends on translating one into the other.
 */
const activecampaignEndpointsNested = {
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		find: Contacts.find,
		createOrUpdate: Contacts.createOrUpdate,
		update: Contacts.update,
		delete: Contacts.remove,
		getLists: Contacts.getLists,
		getTags: Contacts.getTags,
		getFieldValues: Contacts.getFieldValues,
		getAutomations: Contacts.getAutomations,
		getGeoIps: Contacts.getGeoIps,
		getScoreValues: Contacts.getScoreValues,
		getDeals: Contacts.getDeals,
		getLogs: Contacts.getLogs,
		getTrackingLogs: Contacts.getTrackingLogs,
		getGoals: Contacts.getGoals,
		getAccountContacts: Contacts.getAccountContacts,
		getNotes: Contacts.getNotes,
		getData: Contacts.getData,
		getOrganization: Contacts.getOrganization,
		getPlusAppend: Contacts.getPlusAppend,
	},
	lists: {
		list: Lists.list,
		get: Lists.get,
		create: Lists.create,
		delete: Lists.remove,
		updateSubscription: Lists.updateSubscription,
	},
	contactLists: {
		list: Lists.listContactLists,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
		create: Tags.create,
		update: Tags.update,
		delete: Tags.remove,
		addToContact: Tags.addToContact,
		removeFromContact: Tags.removeFromContact,
	},
	contactTags: {
		list: Tags.listContactTags,
	},
	fields: {
		list: Fields.list,
		get: Fields.get,
		create: Fields.create,
		update: Fields.update,
		delete: Fields.remove,
	},
	fieldOptions: {
		createBulk: Fields.createOptionsBulk,
	},
	fieldValues: {
		list: Fields.listValues,
		get: Fields.getValue,
		setForContact: Fields.setValueForContact,
		update: Fields.updateValue,
		delete: Fields.removeValue,
	},
	fieldRels: {
		list: Fields.listRels,
		create: Fields.createRel,
		delete: Fields.removeRel,
	},
	groupMembers: {
		list: Fields.listGroupMembers,
		create: Fields.createGroupMember,
		update: Fields.updateGroupMember,
		delete: Fields.removeGroupMember,
	},
	activities: {
		list: Contacts.listActivities,
	},
	imports: {
		listAggregate: Platform.listImportAggregate,
		createBulk: Imports.createBulk,
		list: Imports.list,
		getStatus: Imports.getStatus,
	},
	listGroups: {
		create: Lists.createListGroup,
	},
	deals: {
		list: Deals.list,
		listFiltered: Deals.listFiltered,
		get: Deals.get,
		update: Deals.update,
		delete: Deals.remove,
		updateOwnersBulk: Deals.updateOwnersBulk,
	},
	dealGroups: {
		list: Deals.listGroups,
		get: Deals.getGroup,
		create: Deals.createGroup,
		update: Deals.updateGroup,
		delete: Deals.removeGroup,
	},
	dealStages: {
		list: Deals.listStages,
		get: Deals.getStage,
		create: Deals.createStage,
		update: Deals.updateStage,
		delete: Deals.removeStage,
		moveDeals: Deals.moveStageDeals,
		deleteWithDeals: Deals.removeStageWithDeals,
	},
	dealTasks: {
		list: Deals.listTasks,
		get: Deals.getTask,
		create: Deals.createTask,
		update: Deals.updateTask,
		delete: Deals.removeTask,
	},
	dealTaskTypes: {
		list: Deals.listTaskTypes,
		get: Deals.getTaskType,
		create: Deals.createTaskType,
		update: Deals.updateTaskType,
	},
	taskOutcomes: {
		list: Deals.listOutcomes,
		get: Deals.getOutcome,
		create: Deals.createOutcome,
	},
	dealRoles: {
		list: Deals.listRoles,
		create: Deals.createRole,
		delete: Deals.removeRole,
	},
	contactDeals: {
		list: Deals.listSecondaryContacts,
		get: Deals.getSecondaryContact,
		create: Deals.addSecondaryContact,
		update: Deals.updateSecondaryContact,
		delete: Deals.removeSecondaryContact,
	},
	dealCustomFieldMeta: {
		list: Deals.listFieldMeta,
		get: Deals.getFieldMeta,
		create: Deals.createFieldMeta,
		update: Deals.updateFieldMeta,
		delete: Deals.removeFieldMeta,
	},
	dealCustomFieldData: {
		list: Deals.listFieldData,
		get: Deals.getFieldData,
		update: Deals.updateFieldData,
		delete: Deals.removeFieldData,
	},
	dealActivities: {
		list: Deals.listActivities,
	},
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		create: Accounts.create,
		update: Accounts.update,
		delete: Accounts.remove,
		upsert: Accounts.upsert,
		deleteBulk: Accounts.removeBulk,
	},
	accountContacts: {
		list: Accounts.listContacts,
		get: Accounts.getContact,
		create: Accounts.createContact,
		update: Accounts.updateContact,
		delete: Accounts.removeContact,
	},
	accountCustomFieldMeta: {
		list: Accounts.listFieldMeta,
		get: Accounts.getFieldMeta,
		create: Accounts.createFieldMeta,
		update: Accounts.updateFieldMeta,
		delete: Accounts.removeFieldMeta,
	},
	accountCustomFieldData: {
		list: Accounts.listFieldData,
		get: Accounts.getFieldData,
		create: Accounts.createFieldData,
		update: Accounts.updateFieldData,
		delete: Accounts.removeFieldData,
		createBulk: Accounts.createFieldDataBulk,
		updateBulk: Accounts.updateFieldDataBulk,
	},
	notes: {
		createForAccount: Accounts.createAccountNote,
		createForDeal: Accounts.createDealNote,
		updateForAccount: Accounts.updateAccountNote,
		updateForDeal: Accounts.updateDealNote,
		list: Accounts.listNotes,
		get: Accounts.getNote,
		create: Accounts.createNote,
		update: Accounts.updateNote,
		delete: Accounts.removeNote,
		addToContact: Accounts.addContactNote,
	},
	campaigns: {
		list: Content.listCampaigns,
		get: Content.getCampaign,
		create: Content.createCampaign,
		update: Content.updateCampaign,
		duplicate: Content.duplicateCampaign,
		getLinks: Content.getCampaignLinks,
		getMessages: Content.getCampaignMessages,
		getAutomations: Content.getCampaignAutomations,
		getAutomationLists: Content.getCampaignAutomationLists,
		getUser: Content.getCampaignUser,
	},
	messages: {
		list: Content.listMessages,
		get: Content.getMessage,
		create: Content.createMessage,
		update: Content.updateMessage,
		delete: Content.removeMessage,
	},
	savedResponses: {
		list: Content.listSavedResponses,
		get: Content.getSavedResponse,
		create: Content.createSavedResponse,
		update: Content.updateSavedResponse,
		delete: Content.removeSavedResponse,
	},
	forms: {
		list: Content.listForms,
		get: Content.getForm,
		delete: Content.removeForm,
		createOptin: Content.createFormOptin,
	},
	personalizations: {
		list: Content.listVariables,
		get: Content.getVariable,
		create: Content.createVariable,
		update: Content.updateVariable,
		delete: Content.removeVariable,
		deleteBulk: Content.removeVariablesBulk,
		lock: Content.lockVariable,
		unlock: Content.unlockVariable,
	},
	templates: {
		get: Content.getTemplate,
		createShareLink: Content.createTemplateShareLink,
	},
	automations: {
		list: Content.listAutomations,
	},
	contactAutomations: {
		list: Content.listContactAutomations,
		get: Content.getContactAutomation,
		entryCounts: Content.getAutomationEntryCounts,
		add: Content.addContactToAutomation,
		remove: Content.removeContactFromAutomation,
	},
	segments: {
		list: Content.listSegments,
		get: Content.getSegment,
		create: Content.createSegment,
		update: Content.updateSegment,
		delete: Content.removeSegment,
		listAudiences: Content.listAudiences,
	},
	connections: {
		list: Platform.listConnections,
		get: Platform.getConnection,
		create: Platform.createConnection,
		update: Platform.updateConnection,
		delete: Platform.removeConnection,
	},
	ecomCustomers: {
		list: Platform.listCustomers,
		get: Platform.getCustomer,
		create: Platform.createCustomer,
		update: Platform.updateCustomer,
		delete: Platform.removeCustomer,
	},
	ecomOrders: {
		find: Platform.findOrder,
		upsert: Platform.upsertOrder,
		list: Platform.listOrders,
		get: Platform.getOrder,
		create: Platform.createOrder,
		update: Platform.updateOrder,
		delete: Platform.removeOrder,
	},
	ecomOrderProducts: {
		listForOrder: Platform.listProductsForOrder,
		list: Platform.listOrderProducts,
		get: Platform.getOrderProduct,
	},
	customObjectSchemas: {
		createChild: Platform.createChildSchema,
		list: Platform.listSchemas,
		get: Platform.getSchema,
		create: Platform.createSchema,
		update: Platform.updateSchema,
		delete: Platform.removeSchema,
	},
	customObjectRecords: {
		list: Platform.listRecords,
		upsert: Platform.upsertRecord,
		get: Platform.getRecord,
		getByExternalId: Platform.getRecordByExternalId,
		delete: Platform.removeRecord,
		deleteByExternalId: Platform.removeRecordByExternalId,
	},
	webhooks: {
		list: Platform.listWebhooks,
		get: Platform.getWebhook,
		create: Platform.createWebhook,
		update: Platform.updateWebhook,
		delete: Platform.removeWebhook,
	},
	users: {
		list: Platform.listUsers,
		get: Platform.getUser,
		create: Platform.createUser,
		update: Platform.updateUser,
		delete: Platform.removeUser,
		getMe: Platform.getLoggedInUser,
		getByUsername: Platform.getUserByUsername,
	},
	groups: {
		list: Platform.listGroups,
		get: Platform.getGroup,
		create: Platform.createGroup,
		update: Platform.updateGroup,
		delete: Platform.removeGroup,
	},
	groupLimits: {
		list: Platform.listGroupLimits,
	},
	addresses: {
		list: Platform.listAddresses,
		get: Platform.getAddress,
		create: Platform.createAddress,
		update: Platform.updateAddress,
		delete: Platform.removeAddress,
	},
	calendars: {
		list: Platform.listCalendars,
		get: Platform.getCalendar,
		create: Platform.createCalendar,
		update: Platform.updateCalendar,
		delete: Platform.removeCalendar,
	},
	eventTrackingEvents: {
		list: Platform.listEvents,
		create: Platform.createEvent,
		delete: Platform.removeEvent,
	},
	tracking: {
		getCode: Platform.getSiteTrackingCode,
		getSiteStatus: Platform.getSiteTrackingStatus,
		getEventStatus: Platform.getEventTrackingStatus,
		setSiteStatus: Platform.setSiteTrackingStatus,
		setEventStatus: Platform.setEventTrackingStatus,
		trackEvent: Platform.trackEvent,
		listWhitelist: Platform.listWhitelistedDomains,
		addWhitelist: Platform.addWhitelistedDomain,
		removeWhitelist: Platform.removeWhitelistedDomain,
	},
	scores: {
		list: Platform.listScores,
	},
	emailActivities: {
		list: Platform.listEmailActivities,
	},
	brandings: {
		get: Platform.getBranding,
		update: Platform.updateBranding,
	},
	configs: {
		update: Platform.updateConfig,
	},
	products: {
		search: Platform.searchProducts,
		get: Platform.getProduct,
		create: Platform.createProduct,
		update: Platform.updateProduct,
		delete: Platform.removeProduct,
		upsertBulk: Platform.upsertProductsBulk,
	},
	orders: {
		upsertBulk: Platform.upsertOrdersBulk,
		upsertBulkAsync: Platform.upsertOrdersBulkAsync,
	},
	recurringPayments: {
		search: Platform.searchRecurringPayments,
		upsertBulk: Platform.upsertRecurringPaymentsBulk,
	},
	browseSessions: {
		testEvent: Platform.testTrackingEvent,
		search: Platform.searchBrowseSessions,
		save: Platform.saveBrowseSession,
		addToCart: Platform.addBrowseSessionToCart,
	},
	smsBroadcasts: {
		list: Platform.listSmsBroadcasts,
		getMetrics: Platform.getSmsMetrics,
		getSnapshot: Platform.getSmsMetricsSnapshot,
		createSnapshot: Platform.createSmsMetricsSnapshot,
		getFailures: Platform.getSmsFailures,
		getRecipients: Platform.getSmsRecipients,
	},
	smsCredits: {
		get: Platform.getSmsCredits,
	},
	smsBroadcastLists: {
		list: Platform.listSmsBroadcastLists,
	},
	addressGroups: {
		delete: Platform.removeAddressGroup,
	},
	contactTasks: {
		create: Deals.createContactTask,
		find: Deals.findContactTask,
	},
	segmentsV2: {
		create: SegmentsV2.create,
		get: SegmentsV2.get,
		update: SegmentsV2.update,
		delete: SegmentsV2.remove,
		getAtTimestamp: SegmentsV2.getAtTimestamp,
		revertToTimestamp: SegmentsV2.revertToTimestamp,
		recentCounts: SegmentsV2.recentCounts,
		countHistory: SegmentsV2.countHistory,
		countAtTimestamp: SegmentsV2.countAtTimestamp,
		match: SegmentsV2.match,
		matchByExternalId: SegmentsV2.matchByExternalId,
		matchAll: SegmentsV2.matchAll,
		matchAllResult: SegmentsV2.matchAllResult,
		matchSomeResult: SegmentsV2.matchSomeResult,
	},
	taskReminders: {
		create: Platform.createTaskReminder,
	},
} as const;

const I = ActiveCampaignEndpointInputSchemas;
const O = ActiveCampaignEndpointOutputSchemas;

export const activecampaignEndpointSchemas = {
	'contacts.list': { input: I.contactsList, output: O.contactsList },
	'contacts.get': { input: I.contactsGet, output: O.contactsGet },
	'contacts.find': { input: I.contactsFind, output: O.contactsFind },
	'contacts.createOrUpdate': {
		input: I.contactsCreateOrUpdate,
		output: O.contactsCreateOrUpdate,
	},
	'contacts.update': { input: I.contactsUpdate, output: O.contactsUpdate },
	'contacts.delete': { input: I.contactsDelete, output: O.contactsDelete },
	'contacts.getLists': {
		input: I.contactsGetLists,
		output: O.contactsGetLists,
	},
	'contacts.getTags': { input: I.contactsGetTags, output: O.contactsGetTags },
	'contacts.getFieldValues': {
		input: I.contactsGetFieldValues,
		output: O.contactsGetFieldValues,
	},
	'contacts.getAutomations': {
		input: I.contactsGetAutomations,
		output: O.contactsGetAutomations,
	},
	'contacts.getGeoIps': {
		input: I.contactsGetGeoIps,
		output: O.contactsGetGeoIps,
	},
	'contacts.getScoreValues': {
		input: I.contactsGetScoreValues,
		output: O.contactsGetScoreValues,
	},
	'contacts.getDeals': {
		input: I.contactsGetDeals,
		output: O.contactsGetDeals,
	},
	'lists.list': { input: I.listsList, output: O.listsList },
	'lists.get': { input: I.listsGet, output: O.listsGet },
	'lists.create': { input: I.listsCreate, output: O.listsCreate },
	'lists.delete': { input: I.listsDelete, output: O.listsDelete },
	'lists.updateSubscription': {
		input: I.listsUpdateSubscription,
		output: O.listsUpdateSubscription,
	},
	'contactLists.list': {
		input: I.contactListsList,
		output: O.contactListsList,
	},
	'tags.list': { input: I.tagsList, output: O.tagsList },
	'tags.get': { input: I.tagsGet, output: O.tagsGet },
	'tags.create': { input: I.tagsCreate, output: O.tagsCreate },
	'tags.update': { input: I.tagsUpdate, output: O.tagsUpdate },
	'tags.delete': { input: I.tagsDelete, output: O.tagsDelete },
	'tags.addToContact': {
		input: I.tagsAddToContact,
		output: O.tagsAddToContact,
	},
	'tags.removeFromContact': {
		input: I.tagsRemoveFromContact,
		output: O.tagsRemoveFromContact,
	},
	'contactTags.list': { input: I.contactTagsList, output: O.contactTagsList },
	'fields.list': { input: I.fieldsList, output: O.fieldsList },
	'fields.get': { input: I.fieldsGet, output: O.fieldsGet },
	'fields.create': { input: I.fieldsCreate, output: O.fieldsCreate },
	'fields.update': { input: I.fieldsUpdate, output: O.fieldsUpdate },
	'fields.delete': { input: I.fieldsDelete, output: O.fieldsDelete },
	'fieldOptions.createBulk': {
		input: I.fieldOptionsCreateBulk,
		output: O.fieldOptionsCreateBulk,
	},
	'fieldValues.list': { input: I.fieldValuesList, output: O.fieldValuesList },
	'fieldValues.get': { input: I.fieldValuesGet, output: O.fieldValuesGet },
	'fieldValues.setForContact': {
		input: I.fieldValuesSetForContact,
		output: O.fieldValuesSetForContact,
	},
	'fieldValues.update': {
		input: I.fieldValuesUpdate,
		output: O.fieldValuesUpdate,
	},
	'fieldValues.delete': {
		input: I.fieldValuesDelete,
		output: O.fieldValuesDelete,
	},
	'fieldRels.list': { input: I.fieldRelsList, output: O.fieldRelsList },
	'fieldRels.create': { input: I.fieldRelsCreate, output: O.fieldRelsCreate },
	'fieldRels.delete': { input: I.fieldRelsDelete, output: O.fieldRelsDelete },
	'groupMembers.list': {
		input: I.groupMembersList,
		output: O.groupMembersList,
	},
	'groupMembers.create': {
		input: I.groupMembersCreate,
		output: O.groupMembersCreate,
	},
	'groupMembers.update': {
		input: I.groupMembersUpdate,
		output: O.groupMembersUpdate,
	},
	'groupMembers.delete': {
		input: I.groupMembersDelete,
		output: O.groupMembersDelete,
	},
	'contacts.getLogs': { input: I.contactsGetLogs, output: O.contactsGetLogs },
	'contacts.getTrackingLogs': {
		input: I.contactsGetTrackingLogs,
		output: O.contactsGetTrackingLogs,
	},
	'contacts.getGoals': {
		input: I.contactsGetGoals,
		output: O.contactsGetGoals,
	},
	'contacts.getAccountContacts': {
		input: I.contactsGetAccountContacts,
		output: O.contactsGetAccountContacts,
	},
	'contacts.getNotes': {
		input: I.contactsGetNotes,
		output: O.contactsGetNotes,
	},
	'contacts.getData': { input: I.contactsGetData, output: O.contactsGetData },
	'contacts.getOrganization': {
		input: I.contactsGetOrganization,
		output: O.contactsGetOrganization,
	},
	'contacts.getPlusAppend': {
		input: I.contactsGetPlusAppend,
		output: O.contactsGetPlusAppend,
	},
	'activities.list': { input: I.activitiesList, output: O.activitiesList },
	'imports.createBulk': {
		input: I.importsCreateBulk,
		output: O.importsCreateBulk,
	},
	'imports.list': { input: I.importsList, output: O.importsList },
	'imports.getStatus': {
		input: I.importsGetStatus,
		output: O.importsGetStatus,
	},
	'listGroups.create': {
		input: I.listGroupsCreate,
		output: O.listGroupsCreate,
	},
	'deals.list': { input: I.dealsList, output: O.dealsList },
	'deals.listFiltered': {
		input: I.dealsListFiltered,
		output: O.dealsListFiltered,
	},
	'deals.get': { input: I.dealsGet, output: O.dealsGet },
	'deals.update': { input: I.dealsUpdate, output: O.dealsUpdate },
	'deals.delete': { input: I.dealsDelete, output: O.dealsDelete },
	'deals.updateOwnersBulk': {
		input: I.dealsUpdateOwnersBulk,
		output: O.dealsUpdateOwnersBulk,
	},
	'dealGroups.list': { input: I.dealGroupsList, output: O.dealGroupsList },
	'dealGroups.get': { input: I.dealGroupsGet, output: O.dealGroupsGet },
	'dealGroups.create': {
		input: I.dealGroupsCreate,
		output: O.dealGroupsCreate,
	},
	'dealGroups.update': {
		input: I.dealGroupsUpdate,
		output: O.dealGroupsUpdate,
	},
	'dealGroups.delete': {
		input: I.dealGroupsDelete,
		output: O.dealGroupsDelete,
	},
	'dealStages.list': { input: I.dealStagesList, output: O.dealStagesList },
	'dealStages.get': { input: I.dealStagesGet, output: O.dealStagesGet },
	'dealStages.create': {
		input: I.dealStagesCreate,
		output: O.dealStagesCreate,
	},
	'dealStages.update': {
		input: I.dealStagesUpdate,
		output: O.dealStagesUpdate,
	},
	'dealStages.delete': {
		input: I.dealStagesDelete,
		output: O.dealStagesDelete,
	},
	'dealStages.moveDeals': {
		input: I.dealStagesMoveDeals,
		output: O.dealStagesMoveDeals,
	},
	'dealStages.deleteWithDeals': {
		input: I.dealStagesDeleteWithDeals,
		output: O.dealStagesDeleteWithDeals,
	},
	'dealTasks.list': { input: I.dealTasksList, output: O.dealTasksList },
	'dealTasks.get': { input: I.dealTasksGet, output: O.dealTasksGet },
	'dealTasks.create': { input: I.dealTasksCreate, output: O.dealTasksCreate },
	'dealTasks.update': { input: I.dealTasksUpdate, output: O.dealTasksUpdate },
	'dealTasks.delete': { input: I.dealTasksDelete, output: O.dealTasksDelete },
	'dealTaskTypes.list': {
		input: I.dealTaskTypesList,
		output: O.dealTaskTypesList,
	},
	'dealTaskTypes.get': {
		input: I.dealTaskTypesGet,
		output: O.dealTaskTypesGet,
	},
	'dealTaskTypes.create': {
		input: I.dealTaskTypesCreate,
		output: O.dealTaskTypesCreate,
	},
	'dealTaskTypes.update': {
		input: I.dealTaskTypesUpdate,
		output: O.dealTaskTypesUpdate,
	},
	'taskOutcomes.list': {
		input: I.taskOutcomesList,
		output: O.taskOutcomesList,
	},
	'taskOutcomes.get': { input: I.taskOutcomesGet, output: O.taskOutcomesGet },
	'taskOutcomes.create': {
		input: I.taskOutcomesCreate,
		output: O.taskOutcomesCreate,
	},
	'dealRoles.list': { input: I.dealRolesList, output: O.dealRolesList },
	'dealRoles.create': { input: I.dealRolesCreate, output: O.dealRolesCreate },
	'dealRoles.delete': { input: I.dealRolesDelete, output: O.dealRolesDelete },
	'contactDeals.list': {
		input: I.contactDealsList,
		output: O.contactDealsList,
	},
	'contactDeals.get': { input: I.contactDealsGet, output: O.contactDealsGet },
	'contactDeals.create': {
		input: I.contactDealsCreate,
		output: O.contactDealsCreate,
	},
	'contactDeals.update': {
		input: I.contactDealsUpdate,
		output: O.contactDealsUpdate,
	},
	'contactDeals.delete': {
		input: I.contactDealsDelete,
		output: O.contactDealsDelete,
	},
	'dealCustomFieldMeta.list': {
		input: I.dealCustomFieldMetaList,
		output: O.dealCustomFieldMetaList,
	},
	'dealCustomFieldMeta.get': {
		input: I.dealCustomFieldMetaGet,
		output: O.dealCustomFieldMetaGet,
	},
	'dealCustomFieldMeta.create': {
		input: I.dealCustomFieldMetaCreate,
		output: O.dealCustomFieldMetaCreate,
	},
	'dealCustomFieldMeta.update': {
		input: I.dealCustomFieldMetaUpdate,
		output: O.dealCustomFieldMetaUpdate,
	},
	'dealCustomFieldMeta.delete': {
		input: I.dealCustomFieldMetaDelete,
		output: O.dealCustomFieldMetaDelete,
	},
	'dealCustomFieldData.list': {
		input: I.dealCustomFieldDataList,
		output: O.dealCustomFieldDataList,
	},
	'dealCustomFieldData.get': {
		input: I.dealCustomFieldDataGet,
		output: O.dealCustomFieldDataGet,
	},
	'dealCustomFieldData.update': {
		input: I.dealCustomFieldDataUpdate,
		output: O.dealCustomFieldDataUpdate,
	},
	'dealCustomFieldData.delete': {
		input: I.dealCustomFieldDataDelete,
		output: O.dealCustomFieldDataDelete,
	},
	'dealActivities.list': {
		input: I.dealActivitiesList,
		output: O.dealActivitiesList,
	},
	'accounts.list': { input: I.accountsList, output: O.accountsList },
	'accounts.get': { input: I.accountsGet, output: O.accountsGet },
	'accounts.create': { input: I.accountsCreate, output: O.accountsCreate },
	'accounts.update': { input: I.accountsUpdate, output: O.accountsUpdate },
	'accounts.delete': { input: I.accountsDelete, output: O.accountsDelete },
	'accounts.upsert': { input: I.accountsUpsert, output: O.accountsUpsert },
	'accounts.deleteBulk': {
		input: I.accountsDeleteBulk,
		output: O.accountsDeleteBulk,
	},
	'accountContacts.list': {
		input: I.accountContactsList,
		output: O.accountContactsList,
	},
	'accountContacts.get': {
		input: I.accountContactsGet,
		output: O.accountContactsGet,
	},
	'accountContacts.create': {
		input: I.accountContactsCreate,
		output: O.accountContactsCreate,
	},
	'accountContacts.update': {
		input: I.accountContactsUpdate,
		output: O.accountContactsUpdate,
	},
	'accountContacts.delete': {
		input: I.accountContactsDelete,
		output: O.accountContactsDelete,
	},
	'accountCustomFieldMeta.list': {
		input: I.accountCustomFieldMetaList,
		output: O.accountCustomFieldMetaList,
	},
	'accountCustomFieldMeta.get': {
		input: I.accountCustomFieldMetaGet,
		output: O.accountCustomFieldMetaGet,
	},
	'accountCustomFieldMeta.create': {
		input: I.accountCustomFieldMetaCreate,
		output: O.accountCustomFieldMetaCreate,
	},
	'accountCustomFieldMeta.update': {
		input: I.accountCustomFieldMetaUpdate,
		output: O.accountCustomFieldMetaUpdate,
	},
	'accountCustomFieldMeta.delete': {
		input: I.accountCustomFieldMetaDelete,
		output: O.accountCustomFieldMetaDelete,
	},
	'accountCustomFieldData.list': {
		input: I.accountCustomFieldDataList,
		output: O.accountCustomFieldDataList,
	},
	'accountCustomFieldData.get': {
		input: I.accountCustomFieldDataGet,
		output: O.accountCustomFieldDataGet,
	},
	'accountCustomFieldData.create': {
		input: I.accountCustomFieldDataCreate,
		output: O.accountCustomFieldDataCreate,
	},
	'accountCustomFieldData.update': {
		input: I.accountCustomFieldDataUpdate,
		output: O.accountCustomFieldDataUpdate,
	},
	'accountCustomFieldData.delete': {
		input: I.accountCustomFieldDataDelete,
		output: O.accountCustomFieldDataDelete,
	},
	'accountCustomFieldData.createBulk': {
		input: I.accountCustomFieldDataCreateBulk,
		output: O.accountCustomFieldDataCreateBulk,
	},
	'accountCustomFieldData.updateBulk': {
		input: I.accountCustomFieldDataUpdateBulk,
		output: O.accountCustomFieldDataUpdateBulk,
	},
	'notes.list': { input: I.notesList, output: O.notesList },
	'notes.get': { input: I.notesGet, output: O.notesGet },
	'notes.create': { input: I.notesCreate, output: O.notesCreate },
	'notes.update': { input: I.notesUpdate, output: O.notesUpdate },
	'notes.delete': { input: I.notesDelete, output: O.notesDelete },
	'notes.addToContact': {
		input: I.notesAddToContact,
		output: O.notesAddToContact,
	},
	'campaigns.list': { input: I.campaignsList, output: O.campaignsList },
	'campaigns.get': { input: I.campaignsGet, output: O.campaignsGet },
	'campaigns.create': { input: I.campaignsCreate, output: O.campaignsCreate },
	'campaigns.update': { input: I.campaignsUpdate, output: O.campaignsUpdate },
	'campaigns.duplicate': {
		input: I.campaignsDuplicate,
		output: O.campaignsDuplicate,
	},
	'campaigns.getLinks': {
		input: I.campaignsGetLinks,
		output: O.campaignsGetLinks,
	},
	'campaigns.getMessages': {
		input: I.campaignsGetMessages,
		output: O.campaignsGetMessages,
	},
	'campaigns.getAutomations': {
		input: I.campaignsGetAutomations,
		output: O.campaignsGetAutomations,
	},
	'campaigns.getAutomationLists': {
		input: I.campaignsGetAutomationLists,
		output: O.campaignsGetAutomationLists,
	},
	'campaigns.getUser': {
		input: I.campaignsGetUser,
		output: O.campaignsGetUser,
	},
	'messages.list': { input: I.messagesList, output: O.messagesList },
	'messages.get': { input: I.messagesGet, output: O.messagesGet },
	'messages.create': { input: I.messagesCreate, output: O.messagesCreate },
	'messages.update': { input: I.messagesUpdate, output: O.messagesUpdate },
	'messages.delete': { input: I.messagesDelete, output: O.messagesDelete },
	'savedResponses.list': {
		input: I.savedResponsesList,
		output: O.savedResponsesList,
	},
	'savedResponses.get': {
		input: I.savedResponsesGet,
		output: O.savedResponsesGet,
	},
	'savedResponses.create': {
		input: I.savedResponsesCreate,
		output: O.savedResponsesCreate,
	},
	'savedResponses.update': {
		input: I.savedResponsesUpdate,
		output: O.savedResponsesUpdate,
	},
	'savedResponses.delete': {
		input: I.savedResponsesDelete,
		output: O.savedResponsesDelete,
	},
	'forms.list': { input: I.formsList, output: O.formsList },
	'forms.get': { input: I.formsGet, output: O.formsGet },
	'forms.delete': { input: I.formsDelete, output: O.formsDelete },
	'forms.createOptin': {
		input: I.formsCreateOptin,
		output: O.formsCreateOptin,
	},
	'personalizations.list': {
		input: I.personalizationsList,
		output: O.personalizationsList,
	},
	'personalizations.get': {
		input: I.personalizationsGet,
		output: O.personalizationsGet,
	},
	'personalizations.create': {
		input: I.personalizationsCreate,
		output: O.personalizationsCreate,
	},
	'personalizations.update': {
		input: I.personalizationsUpdate,
		output: O.personalizationsUpdate,
	},
	'personalizations.delete': {
		input: I.personalizationsDelete,
		output: O.personalizationsDelete,
	},
	'personalizations.deleteBulk': {
		input: I.personalizationsDeleteBulk,
		output: O.personalizationsDeleteBulk,
	},
	'personalizations.lock': {
		input: I.personalizationsLock,
		output: O.personalizationsLock,
	},
	'personalizations.unlock': {
		input: I.personalizationsUnlock,
		output: O.personalizationsUnlock,
	},
	'templates.get': { input: I.templatesGet, output: O.templatesGet },
	'templates.createShareLink': {
		input: I.templatesCreateShareLink,
		output: O.templatesCreateShareLink,
	},
	'automations.list': { input: I.automationsList, output: O.automationsList },
	'contactAutomations.list': {
		input: I.contactAutomationsList,
		output: O.contactAutomationsList,
	},
	'contactAutomations.get': {
		input: I.contactAutomationsGet,
		output: O.contactAutomationsGet,
	},
	'contactAutomations.entryCounts': {
		input: I.contactAutomationsEntryCounts,
		output: O.contactAutomationsEntryCounts,
	},
	'contactAutomations.add': {
		input: I.contactAutomationsAdd,
		output: O.contactAutomationsAdd,
	},
	'contactAutomations.remove': {
		input: I.contactAutomationsRemove,
		output: O.contactAutomationsRemove,
	},
	'segments.list': { input: I.segmentsList, output: O.segmentsList },
	'segments.get': { input: I.segmentsGet, output: O.segmentsGet },
	'segments.create': { input: I.segmentsCreate, output: O.segmentsCreate },
	'segments.update': { input: I.segmentsUpdate, output: O.segmentsUpdate },
	'segments.delete': { input: I.segmentsDelete, output: O.segmentsDelete },
	'segments.listAudiences': {
		input: I.segmentsListAudiences,
		output: O.segmentsListAudiences,
	},
	'connections.list': { input: I.connectionsList, output: O.connectionsList },
	'connections.get': { input: I.connectionsGet, output: O.connectionsGet },
	'connections.create': {
		input: I.connectionsCreate,
		output: O.connectionsCreate,
	},
	'connections.update': {
		input: I.connectionsUpdate,
		output: O.connectionsUpdate,
	},
	'connections.delete': {
		input: I.connectionsDelete,
		output: O.connectionsDelete,
	},
	'ecomCustomers.list': {
		input: I.ecomCustomersList,
		output: O.ecomCustomersList,
	},
	'ecomCustomers.get': {
		input: I.ecomCustomersGet,
		output: O.ecomCustomersGet,
	},
	'ecomCustomers.create': {
		input: I.ecomCustomersCreate,
		output: O.ecomCustomersCreate,
	},
	'ecomCustomers.update': {
		input: I.ecomCustomersUpdate,
		output: O.ecomCustomersUpdate,
	},
	'ecomCustomers.delete': {
		input: I.ecomCustomersDelete,
		output: O.ecomCustomersDelete,
	},
	'ecomOrders.list': { input: I.ecomOrdersList, output: O.ecomOrdersList },
	'ecomOrders.get': { input: I.ecomOrdersGet, output: O.ecomOrdersGet },
	'ecomOrders.create': {
		input: I.ecomOrdersCreate,
		output: O.ecomOrdersCreate,
	},
	'ecomOrders.update': {
		input: I.ecomOrdersUpdate,
		output: O.ecomOrdersUpdate,
	},
	'ecomOrders.delete': {
		input: I.ecomOrdersDelete,
		output: O.ecomOrdersDelete,
	},
	'ecomOrderProducts.list': {
		input: I.ecomOrderProductsList,
		output: O.ecomOrderProductsList,
	},
	'ecomOrderProducts.get': {
		input: I.ecomOrderProductsGet,
		output: O.ecomOrderProductsGet,
	},
	'customObjectSchemas.list': {
		input: I.customObjectSchemasList,
		output: O.customObjectSchemasList,
	},
	'customObjectSchemas.get': {
		input: I.customObjectSchemasGet,
		output: O.customObjectSchemasGet,
	},
	'customObjectSchemas.create': {
		input: I.customObjectSchemasCreate,
		output: O.customObjectSchemasCreate,
	},
	'customObjectSchemas.update': {
		input: I.customObjectSchemasUpdate,
		output: O.customObjectSchemasUpdate,
	},
	'customObjectSchemas.delete': {
		input: I.customObjectSchemasDelete,
		output: O.customObjectSchemasDelete,
	},
	'customObjectRecords.list': {
		input: I.customObjectRecordsList,
		output: O.customObjectRecordsList,
	},
	'customObjectRecords.upsert': {
		input: I.customObjectRecordsUpsert,
		output: O.customObjectRecordsUpsert,
	},
	'customObjectRecords.get': {
		input: I.customObjectRecordsGet,
		output: O.customObjectRecordsGet,
	},
	'customObjectRecords.getByExternalId': {
		input: I.customObjectRecordsGetByExternalId,
		output: O.customObjectRecordsGetByExternalId,
	},
	'customObjectRecords.delete': {
		input: I.customObjectRecordsDelete,
		output: O.customObjectRecordsDelete,
	},
	'customObjectRecords.deleteByExternalId': {
		input: I.customObjectRecordsDeleteByExternalId,
		output: O.customObjectRecordsDeleteByExternalId,
	},
	'webhooks.list': { input: I.webhooksList, output: O.webhooksList },
	'webhooks.get': { input: I.webhooksGet, output: O.webhooksGet },
	'webhooks.create': { input: I.webhooksCreate, output: O.webhooksCreate },
	'webhooks.update': { input: I.webhooksUpdate, output: O.webhooksUpdate },
	'webhooks.delete': { input: I.webhooksDelete, output: O.webhooksDelete },
	'users.list': { input: I.usersList, output: O.usersList },
	'users.get': { input: I.usersGet, output: O.usersGet },
	'users.create': { input: I.usersCreate, output: O.usersCreate },
	'users.update': { input: I.usersUpdate, output: O.usersUpdate },
	'users.delete': { input: I.usersDelete, output: O.usersDelete },
	'users.getMe': { input: I.usersGetMe, output: O.usersGetMe },
	'users.getByUsername': {
		input: I.usersGetByUsername,
		output: O.usersGetByUsername,
	},
	'groups.list': { input: I.groupsList, output: O.groupsList },
	'groups.get': { input: I.groupsGet, output: O.groupsGet },
	'groups.create': { input: I.groupsCreate, output: O.groupsCreate },
	'groups.update': { input: I.groupsUpdate, output: O.groupsUpdate },
	'groups.delete': { input: I.groupsDelete, output: O.groupsDelete },
	'groupLimits.list': { input: I.groupLimitsList, output: O.groupLimitsList },
	'addresses.list': { input: I.addressesList, output: O.addressesList },
	'addresses.get': { input: I.addressesGet, output: O.addressesGet },
	'addresses.create': { input: I.addressesCreate, output: O.addressesCreate },
	'addresses.update': { input: I.addressesUpdate, output: O.addressesUpdate },
	'addresses.delete': { input: I.addressesDelete, output: O.addressesDelete },
	'calendars.list': { input: I.calendarsList, output: O.calendarsList },
	'calendars.get': { input: I.calendarsGet, output: O.calendarsGet },
	'calendars.create': { input: I.calendarsCreate, output: O.calendarsCreate },
	'calendars.update': { input: I.calendarsUpdate, output: O.calendarsUpdate },
	'calendars.delete': { input: I.calendarsDelete, output: O.calendarsDelete },
	'eventTrackingEvents.list': {
		input: I.eventTrackingEventsList,
		output: O.eventTrackingEventsList,
	},
	'eventTrackingEvents.create': {
		input: I.eventTrackingEventsCreate,
		output: O.eventTrackingEventsCreate,
	},
	'eventTrackingEvents.delete': {
		input: I.eventTrackingEventsDelete,
		output: O.eventTrackingEventsDelete,
	},
	'tracking.getSiteStatus': {
		input: I.trackingGetSiteStatus,
		output: O.trackingGetSiteStatus,
	},
	'tracking.getEventStatus': {
		input: I.trackingGetEventStatus,
		output: O.trackingGetEventStatus,
	},
	'tracking.setSiteStatus': {
		input: I.trackingSetSiteStatus,
		output: O.trackingSetSiteStatus,
	},
	'tracking.setEventStatus': {
		input: I.trackingSetEventStatus,
		output: O.trackingSetEventStatus,
	},
	'tracking.trackEvent': {
		input: I.trackingTrackEvent,
		output: O.trackingTrackEvent,
	},
	'tracking.listWhitelist': {
		input: I.trackingListWhitelist,
		output: O.trackingListWhitelist,
	},
	'tracking.addWhitelist': {
		input: I.trackingAddWhitelist,
		output: O.trackingAddWhitelist,
	},
	'tracking.removeWhitelist': {
		input: I.trackingRemoveWhitelist,
		output: O.trackingRemoveWhitelist,
	},
	'scores.list': { input: I.scoresList, output: O.scoresList },
	'emailActivities.list': {
		input: I.emailActivitiesList,
		output: O.emailActivitiesList,
	},
	'brandings.get': { input: I.brandingsGet, output: O.brandingsGet },
	'brandings.update': { input: I.brandingsUpdate, output: O.brandingsUpdate },
	'configs.update': { input: I.configsUpdate, output: O.configsUpdate },
	'products.search': { input: I.productsSearch, output: O.productsSearch },
	'products.get': { input: I.productsGet, output: O.productsGet },
	'products.create': { input: I.productsCreate, output: O.productsCreate },
	'products.update': { input: I.productsUpdate, output: O.productsUpdate },
	'products.delete': { input: I.productsDelete, output: O.productsDelete },
	'products.upsertBulk': {
		input: I.productsUpsertBulk,
		output: O.productsUpsertBulk,
	},
	'orders.upsertBulk': {
		input: I.ordersUpsertBulk,
		output: O.ordersUpsertBulk,
	},
	'orders.upsertBulkAsync': {
		input: I.ordersUpsertBulkAsync,
		output: O.ordersUpsertBulkAsync,
	},
	'recurringPayments.search': {
		input: I.recurringPaymentsSearch,
		output: O.recurringPaymentsSearch,
	},
	'recurringPayments.upsertBulk': {
		input: I.recurringPaymentsUpsertBulk,
		output: O.recurringPaymentsUpsertBulk,
	},
	'browseSessions.search': {
		input: I.browseSessionsSearch,
		output: O.browseSessionsSearch,
	},
	'browseSessions.save': {
		input: I.browseSessionsSave,
		output: O.browseSessionsSave,
	},
	'browseSessions.addToCart': {
		input: I.browseSessionsAddToCart,
		output: O.browseSessionsAddToCart,
	},
	'smsBroadcasts.list': {
		input: I.smsBroadcastsList,
		output: O.smsBroadcastsList,
	},
	'smsBroadcasts.getMetrics': {
		input: I.smsBroadcastsGetMetrics,
		output: O.smsBroadcastsGetMetrics,
	},
	'smsBroadcasts.getSnapshot': {
		input: I.smsBroadcastsGetSnapshot,
		output: O.smsBroadcastsGetSnapshot,
	},
	'smsBroadcasts.createSnapshot': {
		input: I.smsBroadcastsCreateSnapshot,
		output: O.smsBroadcastsCreateSnapshot,
	},
	'smsBroadcasts.getFailures': {
		input: I.smsBroadcastsGetFailures,
		output: O.smsBroadcastsGetFailures,
	},
	'smsBroadcasts.getRecipients': {
		input: I.smsBroadcastsGetRecipients,
		output: O.smsBroadcastsGetRecipients,
	},
	'smsCredits.get': { input: I.smsCreditsGet, output: O.smsCreditsGet },
	'tracking.getCode': { input: I.trackingGetCode, output: O.trackingGetCode },
	'smsBroadcastLists.list': {
		input: I.smsBroadcastListsList,
		output: O.smsBroadcastListsList,
	},
	'addressGroups.delete': {
		input: I.addressGroupsDelete,
		output: O.addressGroupsDelete,
	},
	'ecomOrders.find': { input: I.ecomOrdersFind, output: O.ecomOrdersFind },
	'ecomOrders.upsert': {
		input: I.ecomOrdersUpsert,
		output: O.ecomOrdersUpsert,
	},
	'ecomOrderProducts.listForOrder': {
		input: I.ecomOrderProductsListForOrder,
		output: O.ecomOrderProductsListForOrder,
	},
	'notes.createForAccount': {
		input: I.notesCreateForAccount,
		output: O.notesCreateForAccount,
	},
	'notes.createForDeal': {
		input: I.notesCreateForDeal,
		output: O.notesCreateForDeal,
	},
	'notes.updateForAccount': {
		input: I.notesUpdateForAccount,
		output: O.notesUpdateForAccount,
	},
	'notes.updateForDeal': {
		input: I.notesUpdateForDeal,
		output: O.notesUpdateForDeal,
	},
	'contactTasks.create': {
		input: I.contactTasksCreate,
		output: O.contactTasksCreate,
	},
	'contactTasks.find': {
		input: I.contactTasksFind,
		output: O.contactTasksFind,
	},
	'segmentsV2.create': {
		input: I.segmentsV2Create,
		output: O.segmentsV2Create,
	},
	'segmentsV2.get': {
		input: I.segmentsV2Get,
		output: O.segmentsV2Get,
	},
	'segmentsV2.update': {
		input: I.segmentsV2Update,
		output: O.segmentsV2Update,
	},
	'segmentsV2.delete': {
		input: I.segmentsV2Delete,
		output: O.segmentsV2Delete,
	},
	'segmentsV2.getAtTimestamp': {
		input: I.segmentsV2GetAtTimestamp,
		output: O.segmentsV2GetAtTimestamp,
	},
	'segmentsV2.revertToTimestamp': {
		input: I.segmentsV2RevertToTimestamp,
		output: O.segmentsV2RevertToTimestamp,
	},
	'segmentsV2.recentCounts': {
		input: I.segmentsV2RecentCounts,
		output: O.segmentsV2RecentCounts,
	},
	'segmentsV2.countHistory': {
		input: I.segmentsV2CountHistory,
		output: O.segmentsV2CountHistory,
	},
	'segmentsV2.countAtTimestamp': {
		input: I.segmentsV2CountAtTimestamp,
		output: O.segmentsV2CountAtTimestamp,
	},
	'segmentsV2.match': {
		input: I.segmentsV2Match,
		output: O.segmentsV2Match,
	},
	'segmentsV2.matchByExternalId': {
		input: I.segmentsV2MatchByExternalId,
		output: O.segmentsV2MatchByExternalId,
	},
	'segmentsV2.matchAll': {
		input: I.segmentsV2MatchAll,
		output: O.segmentsV2MatchAll,
	},
	'segmentsV2.matchAllResult': {
		input: I.segmentsV2MatchAllResult,
		output: O.segmentsV2MatchAllResult,
	},
	'segmentsV2.matchSomeResult': {
		input: I.segmentsV2MatchSomeResult,
		output: O.segmentsV2MatchSomeResult,
	},
	'taskReminders.create': {
		input: I.taskRemindersCreate,
		output: O.taskRemindersCreate,
	},
	'customObjectSchemas.createChild': {
		input: I.customObjectSchemasCreateChild,
		output: O.customObjectSchemasCreateChild,
	},
	'imports.listAggregate': {
		input: I.importsListAggregate,
		output: O.importsListAggregate,
	},
	'browseSessions.testEvent': {
		input: I.browseSessionsTestEvent,
		output: O.browseSessionsTestEvent,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof activecampaignEndpointsNested
>;

/**
 * ActiveCampaign does offer webhooks, but this plugin exposes no Corsair
 * triggers - the webhook operations in the catalog manage subscriptions rather
 * than deliver events here. The tree is declared empty so the plugin still
 * satisfies the webhook-shaped generics, and the matcher returns false so no
 * incoming request is ever routed to this plugin.
 */
const activecampaignWebhooksNested = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const activecampaignEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with pagination and filters',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve a contact by its ID',
	},
	'contacts.find': {
		riskLevel: 'read',
		description: 'Find a contact by email address',
	},
	'contacts.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create a contact, or update it if the email already exists',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact by its ID',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact by its ID',
	},
	'contacts.getLists': {
		riskLevel: 'read',
		description: 'List the list memberships of a contact',
	},
	'contacts.getTags': {
		riskLevel: 'read',
		description: 'List the tags applied to a contact',
	},
	'contacts.getFieldValues': {
		riskLevel: 'read',
		description: 'List the custom field values of a contact',
	},
	'contacts.getAutomations': {
		riskLevel: 'read',
		description: 'List the automations a contact is enrolled in',
	},
	'contacts.getGeoIps': {
		riskLevel: 'read',
		description: 'List the geo IP records associated with a contact',
	},
	'contacts.getScoreValues': {
		riskLevel: 'read',
		description: 'List the score values of a contact',
	},
	'contacts.getDeals': {
		riskLevel: 'read',
		description: 'List the deals associated with a contact',
	},
	'lists.list': {
		riskLevel: 'read',
		description: 'List mailing lists with pagination',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Retrieve a mailing list by its ID',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a new mailing list',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mailing list by its ID',
	},
	'lists.updateSubscription': {
		riskLevel: 'write',
		description: 'Subscribe or unsubscribe a contact to or from a list',
	},
	'contactLists.list': {
		riskLevel: 'read',
		description: 'List all contact-to-list memberships',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags with pagination and search',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Retrieve a tag by its ID',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a new tag',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Update an existing tag by its ID',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tag by its ID',
	},
	'tags.addToContact': {
		riskLevel: 'write',
		description: 'Apply a tag to a contact',
	},
	'tags.removeFromContact': {
		riskLevel: 'destructive',
		description: 'Remove a tag from a contact by its contactTag ID',
	},
	'contactTags.list': {
		riskLevel: 'read',
		description: 'List all contact-to-tag associations',
	},
	'fields.list': {
		riskLevel: 'read',
		description: 'List custom field definitions with pagination',
	},
	'fields.get': {
		riskLevel: 'read',
		description: 'Retrieve a custom field definition by its ID',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Create a new custom contact field',
	},
	'fields.update': {
		riskLevel: 'write',
		description: 'Update an existing custom field definition',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field and every value stored against it',
	},
	'fieldOptions.createBulk': {
		riskLevel: 'write',
		description: 'Create options in bulk for a dropdown or listbox field',
	},
	'fieldValues.list': {
		riskLevel: 'read',
		description: 'List custom field values across all contacts',
	},
	'fieldValues.get': {
		riskLevel: 'read',
		description: 'Retrieve a single custom field value by its ID',
	},
	'fieldValues.setForContact': {
		riskLevel: 'write',
		description: 'Set a custom field value on a contact',
	},
	'fieldValues.update': {
		riskLevel: 'write',
		description: 'Update an existing custom field value by its ID',
	},
	'fieldValues.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field value by its ID',
	},
	'fieldRels.list': {
		riskLevel: 'read',
		description: 'List relationships between custom fields and lists',
	},
	'fieldRels.create': {
		riskLevel: 'write',
		description: 'Associate a custom field with a list',
	},
	'fieldRels.delete': {
		riskLevel: 'destructive',
		description: 'Remove the association between a custom field and a list',
	},
	'groupMembers.list': {
		riskLevel: 'read',
		description: 'List which custom fields belong to which display groups',
	},
	'groupMembers.create': {
		riskLevel: 'write',
		description: 'Add a custom field to a display group so it becomes visible',
	},
	'groupMembers.update': {
		riskLevel: 'write',
		description: 'Change the display group or ordering of a custom field',
	},
	'groupMembers.delete': {
		riskLevel: 'destructive',
		description: 'Remove a custom field from its display group',
	},
	'contacts.getLogs': {
		riskLevel: 'read',
		description: 'List the activity log entries for a contact',
	},
	'contacts.getTrackingLogs': {
		riskLevel: 'read',
		description: 'List site and event tracking records for a contact',
	},
	'contacts.getGoals': {
		riskLevel: 'read',
		description: 'List the automation goals a contact has completed',
	},
	'contacts.getAccountContacts': {
		riskLevel: 'read',
		description: 'List the accounts a contact is associated with',
	},
	'contacts.getNotes': {
		riskLevel: 'read',
		description: 'List the notes attached to a contact',
	},
	'contacts.getData': {
		riskLevel: 'read',
		description: 'Retrieve the geographic and tracking data of a contact',
	},
	'contacts.getOrganization': {
		riskLevel: 'read',
		description: 'Retrieve the organization a contact belongs to',
	},
	'contacts.getPlusAppend': {
		riskLevel: 'read',
		description: 'Retrieve third-party enrichment data for a contact',
	},
	'activities.list': {
		riskLevel: 'read',
		description: 'List account activity, optionally narrowed to one contact',
	},
	'imports.createBulk': {
		riskLevel: 'write',
		description:
			'Queue up to 250 contacts per call (payload under 400 KB) for asynchronous import',
	},
	'imports.list': {
		riskLevel: 'read',
		description: 'List outstanding and recently completed import batches',
	},
	'imports.getStatus': {
		riskLevel: 'read',
		description: 'Retrieve the progress of a single import batch by its ID',
	},
	'listGroups.create': {
		riskLevel: 'write',
		description: 'Grant a user group permissions over a mailing list',
	},
	'deals.list': {
		riskLevel: 'read',
		description: 'List deals with pagination and filters',
	},
	'deals.listFiltered': {
		riskLevel: 'read',
		description:
			'Search deals by title or filter by stage, pipeline, owner or status',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Retrieve a deal by its ID',
	},
	'deals.update': {
		riskLevel: 'write',
		description: 'Update an existing deal by its ID',
	},
	'deals.delete': {
		riskLevel: 'destructive',
		description: 'Delete a deal by its ID',
	},
	'deals.updateOwnersBulk': {
		riskLevel: 'write',
		description: 'Reassign many deals to new owners in one request',
	},
	'dealGroups.list': {
		riskLevel: 'read',
		description: 'List deal pipelines, optionally filtered by title',
	},
	'dealGroups.get': {
		riskLevel: 'read',
		description: 'Retrieve a deal pipeline by its ID',
	},
	'dealGroups.create': {
		riskLevel: 'write',
		description: 'Create a deal pipeline with its three default stages',
	},
	'dealGroups.update': {
		riskLevel: 'write',
		description: 'Update a deal pipeline by its ID',
	},
	'dealGroups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a pipeline and every stage and deal in it',
	},
	'dealStages.list': {
		riskLevel: 'read',
		description: 'List deal pipeline stages',
	},
	'dealStages.get': {
		riskLevel: 'read',
		description: 'Retrieve a pipeline stage by its ID',
	},
	'dealStages.create': {
		riskLevel: 'write',
		description: 'Create a stage in a deal pipeline',
	},
	'dealStages.update': {
		riskLevel: 'write',
		description: 'Update a pipeline stage by its ID',
	},
	'dealStages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a pipeline stage by its ID',
	},
	'dealStages.moveDeals': {
		riskLevel: 'write',
		description: 'Move every deal in one stage to another stage',
	},
	'dealStages.deleteWithDeals': {
		riskLevel: 'destructive',
		description: 'Delete a stage, optionally relocating its deals first',
	},
	'dealTasks.list': {
		riskLevel: 'read',
		description: 'List deal tasks with pagination',
	},
	'dealTasks.get': {
		riskLevel: 'read',
		description: 'Retrieve a deal task by its ID',
	},
	'dealTasks.create': {
		riskLevel: 'write',
		description: 'Create a task against a deal, contact or account',
	},
	'dealTasks.update': {
		riskLevel: 'write',
		description: 'Update an existing deal task by its ID',
	},
	'dealTasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a deal task by its ID',
	},
	'dealTaskTypes.list': {
		riskLevel: 'read',
		description: 'List the task types available for deals',
	},
	'dealTaskTypes.get': {
		riskLevel: 'read',
		description: 'Retrieve a deal task type by its ID',
	},
	'dealTaskTypes.create': {
		riskLevel: 'write',
		description: 'Create a task type for categorising deal tasks',
	},
	'dealTaskTypes.update': {
		riskLevel: 'write',
		description: 'Update a deal task type by its ID',
	},
	'taskOutcomes.list': {
		riskLevel: 'read',
		description: 'List the outcomes that can be assigned to tasks',
	},
	'taskOutcomes.get': {
		riskLevel: 'read',
		description: 'Retrieve a task outcome by its ID',
	},
	'taskOutcomes.create': {
		riskLevel: 'write',
		description: 'Create a task outcome with an associated sentiment',
	},
	'dealRoles.list': {
		riskLevel: 'read',
		description: 'List the roles a contact can hold on a deal',
	},
	'dealRoles.create': {
		riskLevel: 'write',
		description: 'Create a deal role such as Decision Maker',
	},
	'dealRoles.delete': {
		riskLevel: 'destructive',
		description: 'Delete a deal role by its ID',
	},
	'contactDeals.list': {
		riskLevel: 'read',
		description: 'List secondary contacts associated with deals',
	},
	'contactDeals.get': {
		riskLevel: 'read',
		description: 'Retrieve a secondary contact association by its ID',
	},
	'contactDeals.create': {
		riskLevel: 'write',
		description: 'Add a secondary contact to a deal',
	},
	'contactDeals.update': {
		riskLevel: 'write',
		description: 'Update a secondary contact association',
	},
	'contactDeals.delete': {
		riskLevel: 'destructive',
		description: 'Remove a secondary contact from a deal',
	},
	'dealCustomFieldMeta.list': {
		riskLevel: 'read',
		description: 'List custom field definitions for deals',
	},
	'dealCustomFieldMeta.get': {
		riskLevel: 'read',
		description: 'Retrieve a deal custom field definition by its ID',
	},
	'dealCustomFieldMeta.create': {
		riskLevel: 'write',
		description: 'Create a custom field definition for deals',
	},
	'dealCustomFieldMeta.update': {
		riskLevel: 'write',
		description: 'Update a deal custom field definition',
	},
	'dealCustomFieldMeta.delete': {
		riskLevel: 'destructive',
		description: 'Delete a deal custom field definition',
	},
	'dealCustomFieldData.list': {
		riskLevel: 'read',
		description: 'List custom field values stored against deals',
	},
	'dealCustomFieldData.get': {
		riskLevel: 'read',
		description: 'Retrieve a deal custom field value by its ID',
	},
	'dealCustomFieldData.update': {
		riskLevel: 'write',
		description: 'Update a custom field value on a deal',
	},
	'dealCustomFieldData.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field value from a deal',
	},
	'dealActivities.list': {
		riskLevel: 'read',
		description: 'List recent activity across deals',
	},
	'accounts.list': {
		riskLevel: 'read',
		description: 'List CRM accounts, optionally filtered by name',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Retrieve a CRM account by its ID',
	},
	'accounts.create': {
		riskLevel: 'write',
		description: 'Create a CRM account with a unique name',
	},
	'accounts.update': {
		riskLevel: 'write',
		description: 'Update an existing CRM account by its ID',
	},
	'accounts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a CRM account and its associated data',
	},
	'accounts.upsert': {
		riskLevel: 'write',
		description: 'Create a CRM account, or update the one with the same name',
	},
	'accounts.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Delete many CRM accounts in one request',
	},
	'accountContacts.list': {
		riskLevel: 'read',
		description: 'List associations between accounts and contacts',
	},
	'accountContacts.get': {
		riskLevel: 'read',
		description: 'Retrieve an account-contact association by its ID',
	},
	'accountContacts.create': {
		riskLevel: 'write',
		description: 'Link a contact to an account with an optional job title',
	},
	'accountContacts.update': {
		riskLevel: 'write',
		description: 'Update an account-contact association',
	},
	'accountContacts.delete': {
		riskLevel: 'destructive',
		description: 'Remove the link between an account and a contact',
	},
	'accountCustomFieldMeta.list': {
		riskLevel: 'read',
		description: 'List custom field definitions for accounts',
	},
	'accountCustomFieldMeta.get': {
		riskLevel: 'read',
		description: 'Retrieve an account custom field definition by its ID',
	},
	'accountCustomFieldMeta.create': {
		riskLevel: 'write',
		description: 'Define a new custom field for accounts',
	},
	'accountCustomFieldMeta.update': {
		riskLevel: 'write',
		description: 'Update an account custom field definition',
	},
	'accountCustomFieldMeta.delete': {
		riskLevel: 'destructive',
		description: 'Delete an account custom field definition',
	},
	'accountCustomFieldData.list': {
		riskLevel: 'read',
		description: 'List custom field values stored against accounts',
	},
	'accountCustomFieldData.get': {
		riskLevel: 'read',
		description: 'Retrieve an account custom field value by its ID',
	},
	'accountCustomFieldData.create': {
		riskLevel: 'write',
		description: 'Set a custom field value on an account',
	},
	'accountCustomFieldData.update': {
		riskLevel: 'write',
		description: 'Update a custom field value on an account',
	},
	'accountCustomFieldData.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field value from an account',
	},
	'accountCustomFieldData.createBulk': {
		riskLevel: 'write',
		description: 'Set many account custom field values in one request',
	},
	'accountCustomFieldData.updateBulk': {
		riskLevel: 'write',
		description: 'Update many account custom field values in one request',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'List notes across contacts, deals and accounts',
	},
	'notes.get': {
		riskLevel: 'read',
		description: 'Retrieve a note by its ID',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Create a note against a contact, deal or account',
	},
	'notes.update': {
		riskLevel: 'write',
		description: 'Update the body of an existing note',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a note by its ID',
	},
	'notes.addToContact': {
		riskLevel: 'write',
		description: 'Add a note to a contact identified by email address',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List campaigns with pagination and filters',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve a campaign by its ID with engagement metrics',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description: 'Create a broadcast or automation campaign',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description: 'Edit an existing campaign, such as its name',
	},
	'campaigns.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a campaign with its content and configuration',
	},
	'campaigns.getLinks': {
		riskLevel: 'read',
		description: 'List the tracked links belonging to a campaign',
	},
	'campaigns.getMessages': {
		riskLevel: 'read',
		description: 'List the messages attached to a campaign',
	},
	'campaigns.getAutomations': {
		riskLevel: 'read',
		description: 'List automations linked to a campaign',
	},
	'campaigns.getAutomationLists': {
		riskLevel: 'read',
		description: 'List the lists a campaign automation sends to',
	},
	'campaigns.getUser': {
		riskLevel: 'read',
		description: 'Retrieve the user who owns a campaign',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List email messages with pagination',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Retrieve an email message by its ID',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Create an email message with subject, sender and content',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Update an existing email message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete an email message by its ID',
	},
	'savedResponses.list': {
		riskLevel: 'read',
		description: 'List saved response templates',
	},
	'savedResponses.get': {
		riskLevel: 'read',
		description: 'Retrieve a saved response by its ID',
	},
	'savedResponses.create': {
		riskLevel: 'write',
		description: 'Create a reusable saved response template',
	},
	'savedResponses.update': {
		riskLevel: 'write',
		description: 'Update a saved response template',
	},
	'savedResponses.delete': {
		riskLevel: 'destructive',
		description: 'Delete a saved response template',
	},
	'forms.list': {
		riskLevel: 'read',
		description: 'List forms with their field configuration',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'Retrieve a form by its ID',
	},
	'forms.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form and its associated data',
	},
	'forms.createOptin': {
		riskLevel: 'write',
		description: 'Record a form opt-in on behalf of a contact',
	},
	'personalizations.list': {
		riskLevel: 'read',
		description: 'List personalization variables',
	},
	'personalizations.get': {
		riskLevel: 'read',
		description: 'Retrieve a personalization variable by its ID',
	},
	'personalizations.create': {
		riskLevel: 'write',
		description: 'Create a personalization variable',
	},
	'personalizations.update': {
		riskLevel: 'write',
		description: 'Edit an existing personalization variable',
	},
	'personalizations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a personalization variable',
	},
	'personalizations.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Delete many personalization variables at once',
	},
	'personalizations.lock': {
		riskLevel: 'write',
		description: 'Lock a personalization variable against edits',
	},
	'personalizations.unlock': {
		riskLevel: 'write',
		description: 'Unlock a personalization variable for editing',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Retrieve a campaign template by its ID',
	},
	'templates.createShareLink': {
		riskLevel: 'write',
		description: 'Create a shareable link for a campaign template',
	},
	'automations.list': {
		riskLevel: 'read',
		description: 'List automation workflows',
	},
	'contactAutomations.list': {
		riskLevel: 'read',
		description: 'List contact enrolments across automations',
	},
	'contactAutomations.get': {
		riskLevel: 'read',
		description: 'Retrieve a contact automation enrolment by its ID',
	},
	'contactAutomations.entryCounts': {
		riskLevel: 'read',
		description: 'Count how many times a contact entered each automation',
	},
	'contactAutomations.add': {
		riskLevel: 'write',
		description: 'Enrol a contact in an automation by email address',
	},
	'contactAutomations.remove': {
		riskLevel: 'destructive',
		description: 'Remove a contact from an automation, one run or all',
	},
	'segments.list': {
		riskLevel: 'read',
		description: 'List contact segments',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Retrieve a segment by its ID',
	},
	'segments.create': {
		riskLevel: 'write',
		description: 'Create a segment with filtering conditions',
	},
	'segments.update': {
		riskLevel: 'write',
		description: 'Update a segment definition',
	},
	'segments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a segment and its history',
	},
	'segments.listAudiences': {
		riskLevel: 'read',
		description: 'List saved segment summaries, known as audiences',
	},
	'connections.list': {
		riskLevel: 'read',
		description: 'List Deep Data connections to external services',
	},
	'connections.get': {
		riskLevel: 'read',
		description: 'Retrieve a connection by its ID',
	},
	'connections.create': {
		riskLevel: 'write',
		description: 'Create a connection to an external e-commerce service',
	},
	'connections.update': {
		riskLevel: 'write',
		description: 'Update an existing connection',
	},
	'connections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a connection by its ID',
	},
	'ecomCustomers.list': {
		riskLevel: 'read',
		description: 'List e-commerce customers with revenue metrics',
	},
	'ecomCustomers.get': {
		riskLevel: 'read',
		description: 'Retrieve an e-commerce customer by its ID',
	},
	'ecomCustomers.create': {
		riskLevel: 'write',
		description: 'Register an e-commerce customer against a connection',
	},
	'ecomCustomers.update': {
		riskLevel: 'write',
		description: 'Update an e-commerce customer record',
	},
	'ecomCustomers.delete': {
		riskLevel: 'destructive',
		description: 'Delete an e-commerce customer and its data',
	},
	'ecomOrders.list': {
		riskLevel: 'read',
		description: 'List e-commerce orders with pagination',
	},
	'ecomOrders.get': {
		riskLevel: 'read',
		description: 'Retrieve an e-commerce order by its ID',
	},
	'ecomOrders.create': {
		riskLevel: 'write',
		description: 'Record an e-commerce order for automation triggers',
	},
	'ecomOrders.update': {
		riskLevel: 'write',
		description: 'Update an existing e-commerce order',
	},
	'ecomOrders.delete': {
		riskLevel: 'destructive',
		description: 'Delete an e-commerce order by its ID',
	},
	'ecomOrderProducts.list': {
		riskLevel: 'read',
		description: 'List the products attached to e-commerce orders',
	},
	'ecomOrderProducts.get': {
		riskLevel: 'read',
		description: 'Retrieve an order product line by its ID',
	},
	'customObjectSchemas.list': {
		riskLevel: 'read',
		description: 'List custom object schema definitions',
	},
	'customObjectSchemas.get': {
		riskLevel: 'read',
		description: 'Retrieve a custom object schema by its ID',
	},
	'customObjectSchemas.create': {
		riskLevel: 'write',
		description: 'Create a custom object schema',
	},
	'customObjectSchemas.update': {
		riskLevel: 'write',
		description: 'Update a custom object schema or add field options',
	},
	'customObjectSchemas.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom object schema and all its records',
	},
	'customObjectRecords.list': {
		riskLevel: 'read',
		description: 'List the records belonging to a custom object schema',
	},
	'customObjectRecords.upsert': {
		riskLevel: 'write',
		description: 'Create or update a custom object record by external ID',
	},
	'customObjectRecords.get': {
		riskLevel: 'read',
		description: 'Retrieve a custom object record by its ID',
	},
	'customObjectRecords.getByExternalId': {
		riskLevel: 'read',
		description: 'Retrieve a custom object record by its external ID',
	},
	'customObjectRecords.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom object record by its ID',
	},
	'customObjectRecords.deleteByExternalId': {
		riskLevel: 'destructive',
		description: 'Delete a custom object record by its external ID',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List configured webhook subscriptions',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Retrieve a webhook subscription by its ID',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook subscription for account events',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a webhook subscription',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription by its ID',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List account users with pagination and sorting',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieve an account user by their ID',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create an account user who can sign in',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update an account user, including group assignment',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete an account user by their ID',
	},
	'users.getMe': {
		riskLevel: 'read',
		description: 'Retrieve the user the API token belongs to',
	},
	'users.getByUsername': {
		riskLevel: 'read',
		description: 'Retrieve an account user by their username',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List permission groups with their settings',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Retrieve a permission group by its ID',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a permission group',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update a permission group title or description',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a permission group by its ID',
	},
	'groupLimits.list': {
		riskLevel: 'read',
		description: 'List the resource limits configured per group',
	},
	'addresses.list': {
		riskLevel: 'read',
		description: 'List the company addresses used in campaigns',
	},
	'addresses.get': {
		riskLevel: 'read',
		description: 'Retrieve a company address by its ID',
	},
	'addresses.create': {
		riskLevel: 'write',
		description: 'Create a company address for campaign footers',
	},
	'addresses.update': {
		riskLevel: 'write',
		description: 'Update an existing company address',
	},
	'addresses.delete': {
		riskLevel: 'destructive',
		description: 'Delete a company address by its ID',
	},
	'calendars.list': {
		riskLevel: 'read',
		description: 'List calendar feeds configured on the account',
	},
	'calendars.get': {
		riskLevel: 'read',
		description: 'Retrieve a calendar feed by its ID',
	},
	'calendars.create': {
		riskLevel: 'write',
		description: 'Create a calendar feed for external calendar apps',
	},
	'calendars.update': {
		riskLevel: 'write',
		description: 'Update a calendar feed by its ID',
	},
	'calendars.delete': {
		riskLevel: 'destructive',
		description: 'Delete a calendar feed by its ID',
	},
	'eventTrackingEvents.list': {
		riskLevel: 'read',
		description: 'List the whitelisted event tracking event names',
	},
	'eventTrackingEvents.create': {
		riskLevel: 'write',
		description: 'Whitelist a new event name for tracking',
	},
	'eventTrackingEvents.delete': {
		riskLevel: 'destructive',
		description: 'Remove an event name from the tracking whitelist',
	},
	'tracking.getSiteStatus': {
		riskLevel: 'read',
		description: 'Check whether site tracking is enabled',
	},
	'tracking.getEventStatus': {
		riskLevel: 'read',
		description: 'Check whether event tracking is enabled',
	},
	'tracking.setSiteStatus': {
		riskLevel: 'write',
		description: 'Enable or disable site tracking for the account',
	},
	'tracking.setEventStatus': {
		riskLevel: 'write',
		description: 'Enable or disable event tracking for the account',
	},
	'tracking.trackEvent': {
		riskLevel: 'write',
		description: 'Record a custom event against a contact',
	},
	'tracking.listWhitelist': {
		riskLevel: 'read',
		description: 'List the domains allowed for site tracking',
	},
	'tracking.addWhitelist': {
		riskLevel: 'write',
		description: 'Add a domain to the site tracking whitelist',
	},
	'tracking.removeWhitelist': {
		riskLevel: 'destructive',
		description: 'Remove a domain from the site tracking whitelist',
	},
	'scores.list': {
		riskLevel: 'read',
		description: 'List the scoring rules configured on the account',
	},
	'emailActivities.list': {
		riskLevel: 'read',
		description: 'List email activity for a subscriber or deal',
	},
	'brandings.get': {
		riskLevel: 'read',
		description: 'Retrieve a branding configuration by its ID',
	},
	'brandings.update': {
		riskLevel: 'write',
		description: 'Update branding such as site name, logo and favicon',
	},
	'configs.update': {
		riskLevel: 'write',
		description: 'Update an account configuration value',
	},
	'products.search': {
		riskLevel: 'read',
		description: 'Search the e-commerce product catalog',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Retrieve a catalog product by its ID',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a product in the e-commerce catalog',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update a catalog product',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product from the e-commerce catalog',
	},
	'products.upsertBulk': {
		riskLevel: 'write',
		description: 'Create or update many catalog products in one request',
	},
	'orders.upsertBulk': {
		riskLevel: 'write',
		description: 'Create or update many orders synchronously',
	},
	'orders.upsertBulkAsync': {
		riskLevel: 'write',
		description: 'Create or update many orders asynchronously',
	},
	'recurringPayments.search': {
		riskLevel: 'read',
		description: 'Search recurring payment records by filter',
	},
	'recurringPayments.upsertBulk': {
		riskLevel: 'write',
		description: 'Create or update many recurring payments at once',
	},
	'browseSessions.search': {
		riskLevel: 'read',
		description: 'Search browse sessions for a contact and connection',
	},
	'browseSessions.save': {
		riskLevel: 'write',
		description: 'Create a browse session in a specified state',
	},
	'browseSessions.addToCart': {
		riskLevel: 'write',
		description: 'Flag a browse session as having items added to cart',
	},
	'smsBroadcasts.list': {
		riskLevel: 'read',
		description: 'List SMS broadcasts with optional name and status filters',
	},
	'smsBroadcasts.getMetrics': {
		riskLevel: 'read',
		description: 'Retrieve delivery metrics for specific SMS broadcasts',
	},
	'smsBroadcasts.getSnapshot': {
		riskLevel: 'read',
		description: 'Retrieve aggregate metrics across all SMS broadcasts',
	},
	'smsBroadcasts.createSnapshot': {
		riskLevel: 'write',
		description: 'Request a metrics snapshot for specific SMS broadcasts',
	},
	'smsBroadcasts.getFailures': {
		riskLevel: 'read',
		description: 'Group and count SMS delivery failures for a broadcast',
	},
	'smsBroadcasts.getRecipients': {
		riskLevel: 'read',
		description: 'List the contacts an SMS broadcast was sent to',
	},
	'smsCredits.get': {
		riskLevel: 'read',
		description: 'Retrieve SMS credit usage and remaining balance',
	},
	'tracking.getCode': {
		riskLevel: 'read',
		description: 'Retrieve the site tracking JavaScript snippet',
	},
	'smsBroadcastLists.list': {
		riskLevel: 'read',
		description: 'List the SMS broadcast lists available on the account',
	},
	'addressGroups.delete': {
		riskLevel: 'destructive',
		description: 'Delete an address group by its ID',
	},
	'ecomOrders.find': {
		riskLevel: 'read',
		description: 'Find one order by its store order ID within a connection',
	},
	'ecomOrders.upsert': {
		riskLevel: 'write',
		description:
			'Create an order, or update the one with the same store order ID. Concurrent upserts for the same connectionid and externalid can duplicate; serialize them or use orders.upsertBulk',
	},
	'ecomOrderProducts.listForOrder': {
		riskLevel: 'read',
		description: 'List the product lines belonging to one order',
	},
	'notes.createForAccount': {
		riskLevel: 'write',
		description: 'Add a note to a CRM account',
	},
	'notes.createForDeal': {
		riskLevel: 'write',
		description: 'Add a note to a deal',
	},
	'notes.updateForAccount': {
		riskLevel: 'write',
		description: 'Update a note attached to a CRM account',
	},
	'notes.updateForDeal': {
		riskLevel: 'write',
		description: 'Update a note attached to a deal',
	},
	'contactTasks.create': {
		riskLevel: 'write',
		description: 'Create a task against a contact',
	},
	'contactTasks.find': {
		riskLevel: 'read',
		description: 'Find contact tasks by title, optionally for one contact',
	},
	'segmentsV2.create': {
		riskLevel: 'write',
		description: 'Create an advanced segment with filtering conditions',
	},
	'segmentsV2.get': {
		riskLevel: 'read',
		description: 'Retrieve a V2 segment by its UUID',
	},
	'segmentsV2.update': {
		riskLevel: 'write',
		description: 'Update a V2 segment definition',
	},
	'segmentsV2.delete': {
		riskLevel: 'destructive',
		description: 'Delete a segment and every historic version of it',
	},
	'segmentsV2.getAtTimestamp': {
		riskLevel: 'read',
		description: 'Retrieve a segment as it stood at a point in time',
	},
	'segmentsV2.revertToTimestamp': {
		riskLevel: 'write',
		description: 'Revert a segment to how it looked at a point in time',
	},
	'segmentsV2.recentCounts': {
		riskLevel: 'read',
		description: 'Retrieve the most recent result count per segment',
	},
	'segmentsV2.countHistory': {
		riskLevel: 'read',
		description: 'List historic result counts for one segment',
	},
	'segmentsV2.countAtTimestamp': {
		riskLevel: 'read',
		description: 'Retrieve segment counts recorded before a timestamp',
	},
	'segmentsV2.match': {
		riskLevel: 'read',
		description: 'Check whether a contact matches a segment',
	},
	'segmentsV2.matchByExternalId': {
		riskLevel: 'read',
		description: 'Check segment membership using an external contact ID',
	},
	'segmentsV2.matchAll': {
		riskLevel: 'write',
		description: 'Start a match-all evaluation for every contact in a segment',
	},
	'segmentsV2.matchAllResult': {
		riskLevel: 'read',
		description: 'Fetch a match-all result set by its run ID',
	},
	'segmentsV2.matchSomeResult': {
		riskLevel: 'read',
		description: 'Fetch a partial segment match result set by run ID',
	},
	'taskReminders.create': {
		riskLevel: 'write',
		description: 'Create a reminder ahead of a deal task due date',
	},
	'customObjectSchemas.createChild': {
		riskLevel: 'write',
		description: 'Create a child schema under a public parent schema',
	},
	'imports.listAggregate': {
		riskLevel: 'read',
		description: 'Retrieve aggregate progress across all bulk import batches',
	},
	'browseSessions.testEvent': {
		riskLevel: 'write',
		description: 'Simulate a tracking event and return its debug output',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof activecampaignEndpointsNested
>;

export type BaseActiveCampaignPlugin<T extends ActiveCampaignPluginOptions> =
	CorsairPlugin<
		'activecampaign',
		typeof ActiveCampaignSchema,
		typeof activecampaignEndpointsNested,
		typeof activecampaignWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof activecampaignAuthConfig
	>;

export type InternalActiveCampaignPlugin =
	BaseActiveCampaignPlugin<ActiveCampaignPluginOptions>;

export type ExternalActiveCampaignPlugin<
	T extends ActiveCampaignPluginOptions,
> = BaseActiveCampaignPlugin<T>;

export function activecampaign<const T extends ActiveCampaignPluginOptions>(
	incomingOptions: ActiveCampaignPluginOptions &
		T = {} as ActiveCampaignPluginOptions & T,
): ExternalActiveCampaignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'activecampaign',
		schema: ActiveCampaignSchema,
		options: options,
		hooks: options.hooks,
		endpoints: activecampaignEndpointsNested,
		webhooks: activecampaignWebhooksNested,
		authConfig: activecampaignAuthConfig,
		endpointMeta: activecampaignEndpointMeta,
		endpointSchemas: activecampaignEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ActiveCampaignKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('activecampaign', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('activecampaign', 'api_key');
		},
	};
}

export { activecampaignEndpointMeta };
export type { ActiveCampaignEndpointInputs, ActiveCampaignEndpointOutputs };
