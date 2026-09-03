# @corsair-dev/salesforce

Salesforce plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/salesforce
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.accountCreationWithContentTypeOption` | `salesforce.api.accounts.accountCreationWithContentTypeOption` | `write` | Create account (deprecated) |
| `accounts.createAccount` | `salesforce.api.accounts.createAccount` | `write` | Create account in Salesforce |
| `accounts.deleteAccount` | `salesforce.api.accounts.deleteAccount` | `destructive` | Delete account |
| `accounts.fetchAccountByIdWithQuery` | `salesforce.api.accounts.fetchAccountByIdWithQuery` | `read` | Fetch account by ID with query (deprecated) |
| `accounts.getAccount` | `salesforce.api.accounts.getAccount` | `read` | Get account by ID |
| `accounts.listAccounts` | `salesforce.api.accounts.listAccounts` | `read` | List accounts |
| `accounts.removeAccountByUniqueIdentifier` | `salesforce.api.accounts.removeAccountByUniqueIdentifier` | `destructive` | Remove account by unique identifier (deprecated) |
| `accounts.retrieveAccountDataAndErrorResponses` | `salesforce.api.accounts.retrieveAccountDataAndErrorResponses` | `read` | Retrieve account data and error responses (deprecated) |
| `accounts.searchAccounts` | `salesforce.api.accounts.searchAccounts` | `read` | Search accounts |
| `accounts.updateAccount` | `salesforce.api.accounts.updateAccount` | `write` | Update account |
| `accounts.updateAccountObjectById` | `salesforce.api.accounts.updateAccountObjectById` | `write` | Update account by id (deprecated) |
| `analyticsReports.getDashboard` | `salesforce.api.analyticsReports.getDashboard` | `read` | Get dashboard metadata |
| `analyticsReports.getReport` | `salesforce.api.analyticsReports.getReport` | `read` | Get report metadata (deprecated) |
| `analyticsReports.getReportInstance` | `salesforce.api.analyticsReports.getReportInstance` | `read` | Get report instance results (deprecated) |
| `analyticsReports.listAnalyticsTemplates` | `salesforce.api.analyticsReports.listAnalyticsTemplates` | `read` | List CRM Analytics templates |
| `analyticsReports.listDashboards` | `salesforce.api.analyticsReports.listDashboards` | `read` | List all dashboards |
| `analyticsReports.listEmailTemplates` | `salesforce.api.analyticsReports.listEmailTemplates` | `read` | List email templates |
| `analyticsReports.listReports` | `salesforce.api.analyticsReports.listReports` | `read` | List all reports |
| `analyticsReports.queryReport` | `salesforce.api.analyticsReports.queryReport` | `read` | Query report (deprecated) |
| `analyticsReports.runReport` | `salesforce.api.analyticsReports.runReport` | `read` | Run report and return results |
| `campaigns.addContactToCampaign` | `salesforce.api.campaigns.addContactToCampaign` | `write` | Add contact to campaign |
| `campaigns.addLeadToCampaign` | `salesforce.api.campaigns.addLeadToCampaign` | `write` | Add lead to campaign |
| `campaigns.createCampaign` | `salesforce.api.campaigns.createCampaign` | `write` | Create campaign |
| `campaigns.createCampaignRecordViaPost` | `salesforce.api.campaigns.createCampaignRecordViaPost` | `write` | Create campaign record via POST (deprecated) |
| `campaigns.deleteCampaign` | `salesforce.api.campaigns.deleteCampaign` | `destructive` | Delete campaign |
| `campaigns.getCampaign` | `salesforce.api.campaigns.getCampaign` | `read` | Get campaign by ID |
| `campaigns.listCampaigns` | `salesforce.api.campaigns.listCampaigns` | `read` | List campaigns |
| `campaigns.removeCampaignObjectById` | `salesforce.api.campaigns.removeCampaignObjectById` | `destructive` | Remove campaign object by ID (deprecated) |
| `campaigns.removeFromCampaign` | `salesforce.api.campaigns.removeFromCampaign` | `destructive` | Remove member from campaign |
| `campaigns.retrieveCampaignDataWithErrorHandling` | `salesforce.api.campaigns.retrieveCampaignDataWithErrorHandling` | `read` | Retrieve campaign data (deprecated) |
| `campaigns.retrieveSpecificCampaignObjectDetails` | `salesforce.api.campaigns.retrieveSpecificCampaignObjectDetails` | `read` | Retrieve specific campaign details (deprecated) |
| `campaigns.searchCampaigns` | `salesforce.api.campaigns.searchCampaigns` | `read` | Search campaigns |
| `campaigns.updateCampaign` | `salesforce.api.campaigns.updateCampaign` | `write` | Update campaign |
| `campaigns.updateCampaignByIdWithJson` | `salesforce.api.campaigns.updateCampaignByIdWithJson` | `write` | Update campaign by id (deprecated) |
| `composite.compositeGraphAction` | `salesforce.api.composite.compositeGraphAction` | `write` | Execute composite graph (deprecated) |
| `composite.createSobjectTree` | `salesforce.api.composite.createSobjectTree` | `write` | Create sObject tree |
| `composite.deleteSobjectCollections` | `salesforce.api.composite.deleteSobjectCollections` | `destructive` | Delete sObject collections |
| `composite.getABatchOfRecords` | `salesforce.api.composite.getABatchOfRecords` | `read` | Get batch of UI API records |
| `composite.getCompositeResources` | `salesforce.api.composite.getCompositeResources` | `read` | Get composite resources |
| `composite.getCompositeSobjects` | `salesforce.api.composite.getCompositeSobjects` | `read` | Get composite sObjects |
| `composite.getSobjectCollections` | `salesforce.api.composite.getSobjectCollections` | `read` | Get sObject collections |
| `composite.patchCompositeSobjects` | `salesforce.api.composite.patchCompositeSobjects` | `write` | Upsert records using external ID |
| `composite.postCompositeGraph` | `salesforce.api.composite.postCompositeGraph` | `write` | Execute composite graph |
| `composite.postCompositeSobjects` | `salesforce.api.composite.postCompositeSobjects` | `write` | Create records using sObject Collections |
| `contacts.associateContactToAccount` | `salesforce.api.contacts.associateContactToAccount` | `write` | Associate contact to account |
| `contacts.createContact` | `salesforce.api.contacts.createContact` | `write` | Create contact |
| `contacts.createNewContactWithJsonHeader` | `salesforce.api.contacts.createNewContactWithJsonHeader` | `write` | Create new contact with JSON header (deprecated) |
| `contacts.deleteContact` | `salesforce.api.contacts.deleteContact` | `destructive` | Delete contact |
| `contacts.getContact` | `salesforce.api.contacts.getContact` | `read` | Get contact by ID |
| `contacts.getContactById` | `salesforce.api.contacts.getContactById` | `read` | Get contact by ID |
| `contacts.listContacts` | `salesforce.api.contacts.listContacts` | `read` | List contacts |
| `contacts.queryContactsByName` | `salesforce.api.contacts.queryContactsByName` | `read` | Query contacts by name (deprecated) |
| `contacts.removeASpecificContactById` | `salesforce.api.contacts.removeASpecificContactById` | `destructive` | Remove contact by ID (deprecated) |
| `contacts.retrieveContactInfoWithStandardResponses` | `salesforce.api.contacts.retrieveContactInfoWithStandardResponses` | `read` | Retrieve contact info (deprecated) |
| `contacts.searchContacts` | `salesforce.api.contacts.searchContacts` | `read` | Search contacts |
| `contacts.updateContact` | `salesforce.api.contacts.updateContact` | `write` | Update contact |
| `contacts.updateContactById` | `salesforce.api.contacts.updateContactById` | `write` | Update contact by id (deprecated) |
| `files.deleteFile` | `salesforce.api.files.deleteFile` | `destructive` | Delete file permanently |
| `files.getFileContent` | `salesforce.api.files.getFileContent` | `read` | Get binary file content |
| `files.getFileInformation` | `salesforce.api.files.getFileInformation` | `read` | Get file metadata information |
| `files.getFileShares` | `salesforce.api.files.getFileShares` | `read` | Get file shares information |
| `files.uploadFile` | `salesforce.api.files.uploadFile` | `write` | Upload a file to Salesforce Files |
| `jobs.closeOrAbortJob` | `salesforce.api.jobs.closeOrAbortJob` | `write` | Close or abort bulk job |
| `jobs.deleteJobQuery` | `salesforce.api.jobs.deleteJobQuery` | `destructive` | Delete query job |
| `jobs.getJobFailedRecordResults` | `salesforce.api.jobs.getJobFailedRecordResults` | `read` | Get job failed record results |
| `jobs.getJobSuccessfulRecordResults` | `salesforce.api.jobs.getJobSuccessfulRecordResults` | `read` | Get job successful record results |
| `jobs.getJobUnprocessedRecordResults` | `salesforce.api.jobs.getJobUnprocessedRecordResults` | `read` | Get job unprocessed record results |
| `jobs.getQueryJobInfo` | `salesforce.api.jobs.getQueryJobInfo` | `read` | Get query job info |
| `jobs.getQueryJobResults` | `salesforce.api.jobs.getQueryJobResults` | `read` | Get query job results |
| `jobs.uploadJobData` | `salesforce.api.jobs.uploadJobData` | `write` | Upload CSV data to a bulk ingest job |
| `leads.applyLeadAssignmentRules` | `salesforce.api.leads.applyLeadAssignmentRules` | `write` | Apply lead assignment rules |
| `leads.createLead` | `salesforce.api.leads.createLead` | `write` | Create lead |
| `leads.createLeadWithSpecifiedContentType` | `salesforce.api.leads.createLeadWithSpecifiedContentType` | `write` | Create lead with content type (deprecated) |
| `leads.deleteALeadObjectByItsId` | `salesforce.api.leads.deleteALeadObjectByItsId` | `destructive` | Delete lead object by ID (deprecated) |
| `leads.deleteLead` | `salesforce.api.leads.deleteLead` | `destructive` | Delete lead |
| `leads.getLead` | `salesforce.api.leads.getLead` | `read` | Get lead by ID |
| `leads.listLeads` | `salesforce.api.leads.listLeads` | `read` | List leads |
| `leads.retrieveLeadById` | `salesforce.api.leads.retrieveLeadById` | `read` | Retrieve lead by ID |
| `leads.retrieveLeadDataWithVariousResponses` | `salesforce.api.leads.retrieveLeadDataWithVariousResponses` | `read` | Retrieve lead data (deprecated) |
| `leads.searchLeads` | `salesforce.api.leads.searchLeads` | `read` | Search leads |
| `leads.updateLead` | `salesforce.api.leads.updateLead` | `write` | Update lead |
| `leads.updateLeadByIdWithJsonPayload` | `salesforce.api.leads.updateLeadByIdWithJsonPayload` | `write` | Update lead by id (deprecated) |
| `metadata.cloneRecord` | `salesforce.api.metadata.cloneRecord` | `write` | Clone record |
| `metadata.createCustomField` | `salesforce.api.metadata.createCustomField` | `write` | Create custom field via Tooling API |
| `metadata.createCustomObject` | `salesforce.api.metadata.createCustomObject` | `write` | Create custom object via Metadata API |
| `metadata.createSObjectRecord` | `salesforce.api.metadata.createSObjectRecord` | `write` | Create sObject record |
| `metadata.deleteSobject` | `salesforce.api.metadata.deleteSobject` | `destructive` | Delete sObject record |
| `metadata.deleteSobjectRows` | `salesforce.api.metadata.deleteSobjectRows` | `destructive` | Delete sObject rows |
| `metadata.executeSobjectQuickAction` | `salesforce.api.metadata.executeSobjectQuickAction` | `write` | Execute sObject quick action |
| `metadata.getAllCustomObjects` | `salesforce.api.metadata.getAllCustomObjects` | `read` | Get all custom objects |
| `metadata.getAllFieldsForObject` | `salesforce.api.metadata.getAllFieldsForObject` | `read` | Get all fields for object |
| `metadata.getApi` | `salesforce.api.metadata.getApi` | `read` | Get API resources by version |
| `metadata.getChatterResources` | `salesforce.api.metadata.getChatterResources` | `read` | Get Chatter resources |
| `metadata.getChildRecords` | `salesforce.api.metadata.getChildRecords` | `read` | Get child records |
| `metadata.getConsentAction` | `salesforce.api.metadata.getConsentAction` | `read` | Get consent action preferences |
| `metadata.getGlobalActions` | `salesforce.api.metadata.getGlobalActions` | `read` | Get global actions |
| `metadata.getOrgLimits` | `salesforce.api.metadata.getOrgLimits` | `read` | Get org limits |
| `metadata.getPicklistValuesByRecordType` | `salesforce.api.metadata.getPicklistValuesByRecordType` | `read` | Get picklist values by record type |
| `metadata.getQuickActions` | `salesforce.api.metadata.getQuickActions` | `read` | Get quick actions |
| `metadata.getRecordCounts` | `salesforce.api.metadata.getRecordCounts` | `read` | Get record counts |
| `metadata.getSobjectApprovalLayouts` | `salesforce.api.metadata.getSobjectApprovalLayouts` | `read` | Get approval layouts for sObject |
| `metadata.getSobjectByExternalId` | `salesforce.api.metadata.getSobjectByExternalId` | `read` | Get sObject by external ID |
| `metadata.getSobjectPlatformaction` | `salesforce.api.metadata.getSobjectPlatformaction` | `read` | Get PlatformAction metadata |
| `metadata.getSobjectQuickActionDefaultValues` | `salesforce.api.metadata.getSobjectQuickActionDefaultValues` | `read` | Get quick action default values |
| `metadata.getSObjectQuickActionDefaultValues` | `salesforce.api.metadata.getSObjectQuickActionDefaultValues` | `read` | Get quick action default values |
| `metadata.getSObjectRecord` | `salesforce.api.metadata.getSObjectRecord` | `read` | Get sObject record by ID |
| `metadata.getSobjectRelationship` | `salesforce.api.metadata.getSobjectRelationship` | `read` | Get sObject relationship |
| `metadata.getSobjects` | `salesforce.api.metadata.getSobjects` | `read` | Describe global sObjects |
| `metadata.getSObjectsDescribeLayoutsRecordTypeId` | `salesforce.api.metadata.getSObjectsDescribeLayoutsRecordTypeId` | `read` | Get layouts for object with record type |
| `metadata.getSobjectsSobjectDescribeApprovallayouts` | `salesforce.api.metadata.getSobjectsSobjectDescribeApprovallayouts` | `read` | Get approval layouts for object |
| `metadata.getSObjectsUpdated` | `salesforce.api.metadata.getSObjectsUpdated` | `read` | Get updated sObject records |
| `metadata.getSupport` | `salesforce.api.metadata.getSupport` | `read` | Get support knowledge root |
| `metadata.getSupportedObjectsDirectory` | `salesforce.api.metadata.getSupportedObjectsDirectory` | `read` | Get supported objects directory |
| `metadata.getSupportKnowledgeArticles` | `salesforce.api.metadata.getSupportKnowledgeArticles` | `read` | Get support knowledge articles |
| `metadata.getTheme` | `salesforce.api.metadata.getTheme` | `read` | Get theme metadata |
| `metadata.getUserInfo` | `salesforce.api.metadata.getUserInfo` | `read` | Get user info |
| `metadata.headActionsCustom` | `salesforce.api.metadata.headActionsCustom` | `read` | Head custom actions |
| `metadata.headActionsStandard` | `salesforce.api.metadata.headActionsStandard` | `read` | Head standard actions |
| `metadata.headProcessRulesSObject` | `salesforce.api.metadata.headProcessRulesSObject` | `read` | Head process rules for sObject |
| `metadata.headQuickActions` | `salesforce.api.metadata.headQuickActions` | `read` | Head Quick Actions |
| `metadata.headSobjectQuickActionDefaultValues` | `salesforce.api.metadata.headSobjectQuickActionDefaultValues` | `read` | Head quick action default values |
| `metadata.headSobjectsGlobalDescribeLayouts` | `salesforce.api.metadata.headSobjectsGlobalDescribeLayouts` | `read` | Head global describe layouts |
| `metadata.headSobjectsQuickAction` | `salesforce.api.metadata.headSobjectsQuickAction` | `read` | Head sObject quick action |
| `metadata.headSobjectsUserPassword` | `salesforce.api.metadata.headSobjectsUserPassword` | `read` | Head user password status |
| `metadata.listCustomInvocableActions` | `salesforce.api.metadata.listCustomInvocableActions` | `read` | List custom invocable actions |
| `metadata.listStandardInvocableActions` | `salesforce.api.metadata.listStandardInvocableActions` | `read` | List standard invocable actions |
| `metadata.massTransferOwnership` | `salesforce.api.metadata.massTransferOwnership` | `write` | Mass transfer record ownership |
| `metadata.setUserPassword` | `salesforce.api.metadata.setUserPassword` | `write` | Set user password |
| `metadata.sobjectRowsUpdate` | `salesforce.api.metadata.sobjectRowsUpdate` | `write` | Update sObject rows |
| `metadata.sobjectUserPassword` | `salesforce.api.metadata.sobjectUserPassword` | `read` | Check user password expiration status |
| `metadata.updateSobject` | `salesforce.api.metadata.updateSobject` | `write` | Update sObject fields |
| `metadata.upsertSobjectByExternalId` | `salesforce.api.metadata.upsertSobjectByExternalId` | `write` | Upsert sObject by external ID |
| `notes.createNote` | `salesforce.api.notes.createNote` | `write` | Create note |
| `notes.createNoteRecordWithContentTypeHeader` | `salesforce.api.notes.createNoteRecordWithContentTypeHeader` | `write` | Create note record (deprecated) |
| `notes.deleteNote` | `salesforce.api.notes.deleteNote` | `destructive` | Delete note |
| `notes.getNote` | `salesforce.api.notes.getNote` | `read` | Get note by ID |
| `notes.getNoteByIdWithFields` | `salesforce.api.notes.getNoteByIdWithFields` | `read` | Get note by ID with fields (deprecated) |
| `notes.listNotes` | `salesforce.api.notes.listNotes` | `read` | List notes |
| `notes.removeNoteObjectById` | `salesforce.api.notes.removeNoteObjectById` | `destructive` | Remove note object by ID (deprecated) |
| `notes.retrieveNoteObjectInformation` | `salesforce.api.notes.retrieveNoteObjectInformation` | `read` | Retrieve note object info (deprecated) |
| `notes.searchNotes` | `salesforce.api.notes.searchNotes` | `read` | Search notes |
| `notes.updateNote` | `salesforce.api.notes.updateNote` | `write` | Update note |
| `notes.updateSpecificNoteById` | `salesforce.api.notes.updateSpecificNoteById` | `write` | Update note by id (deprecated) |
| `opportunities.addOpportunityLineItem` | `salesforce.api.opportunities.addOpportunityLineItem` | `write` | Add line item to opportunity |
| `opportunities.cloneOpportunityWithProducts` | `salesforce.api.opportunities.cloneOpportunityWithProducts` | `write` | Clone opportunity with products |
| `opportunities.createOpportunity` | `salesforce.api.opportunities.createOpportunity` | `write` | Create opportunity |
| `opportunities.createOpportunityRecord` | `salesforce.api.opportunities.createOpportunityRecord` | `write` | Create opportunity record (deprecated) |
| `opportunities.deleteOpportunity` | `salesforce.api.opportunities.deleteOpportunity` | `destructive` | Delete opportunity |
| `opportunities.getOpportunity` | `salesforce.api.opportunities.getOpportunity` | `read` | Get opportunity by ID |
| `opportunities.listOpportunities` | `salesforce.api.opportunities.listOpportunities` | `read` | List opportunities |
| `opportunities.listPricebookEntries` | `salesforce.api.opportunities.listPricebookEntries` | `read` | List pricebook entries |
| `opportunities.listPricebooks` | `salesforce.api.opportunities.listPricebooks` | `read` | List pricebooks |
| `opportunities.removeOpportunityById` | `salesforce.api.opportunities.removeOpportunityById` | `destructive` | Remove opportunity by ID (deprecated) |
| `opportunities.retrieveOpportunitiesData` | `salesforce.api.opportunities.retrieveOpportunitiesData` | `read` | Retrieve opportunities data |
| `opportunities.retrieveOpportunityByIdWithOptionalFields` | `salesforce.api.opportunities.retrieveOpportunityByIdWithOptionalFields` | `read` | Retrieve opportunity by ID with fields (deprecated) |
| `opportunities.searchOpportunities` | `salesforce.api.opportunities.searchOpportunities` | `read` | Search opportunities |
| `opportunities.updateOpportunity` | `salesforce.api.opportunities.updateOpportunity` | `write` | Update opportunity |
| `opportunities.updateOpportunityById` | `salesforce.api.opportunities.updateOpportunityById` | `write` | Update opportunity by id (deprecated) |
| `soqlSosl.executeSoqlQuery` | `salesforce.api.soqlSosl.executeSoqlQuery` | `read` | Execute SOQL query (deprecated) |
| `soqlSosl.executeSoslSearch` | `salesforce.api.soqlSosl.executeSoslSearch` | `read` | Execute SOSL search |
| `soqlSosl.getParameterizedSearch` | `salesforce.api.soqlSosl.getParameterizedSearch` | `read` | Parameterized search via GET |
| `soqlSosl.getSearchLayout` | `salesforce.api.soqlSosl.getSearchLayout` | `read` | Get search layout |
| `soqlSosl.getSearchSuggestions` | `salesforce.api.soqlSosl.getSearchSuggestions` | `read` | Get search suggestions |
| `soqlSosl.parameterizedSearch` | `salesforce.api.soqlSosl.parameterizedSearch` | `read` | Run parameterized search |
| `soqlSosl.postParameterizedSearch` | `salesforce.api.soqlSosl.postParameterizedSearch` | `read` | Post parameterized search |
| `soqlSosl.query` | `salesforce.api.soqlSosl.query` | `read` | Execute SOQL query (deprecated) |
| `soqlSosl.queryAll` | `salesforce.api.soqlSosl.queryAll` | `read` | Run queryAll including deleted records |
| `soqlSosl.runSoqlQuery` | `salesforce.api.soqlSosl.runSoqlQuery` | `read` | Run SOQL query |
| `soqlSosl.search` | `salesforce.api.soqlSosl.search` | `read` | Run SOSL search |
| `soqlSosl.searchKnowledgeArticles` | `salesforce.api.soqlSosl.searchKnowledgeArticles` | `read` | Search knowledge articles |
| `soqlSosl.toolingQuery` | `salesforce.api.soqlSosl.toolingQuery` | `read` | Run Tooling API SOQL query |
| `tasks.completeTask` | `salesforce.api.tasks.completeTask` | `write` | Complete task |
| `tasks.createTask` | `salesforce.api.tasks.createTask` | `write` | Create task |
| `tasks.logCall` | `salesforce.api.tasks.logCall` | `write` | Log phone call activity |
| `tasks.logEmailActivity` | `salesforce.api.tasks.logEmailActivity` | `write` | Log email activity |
| `tasks.searchTasks` | `salesforce.api.tasks.searchTasks` | `read` | Search tasks |
| `tasks.sendEmail` | `salesforce.api.tasks.sendEmail` | `write` | Send email |
| `tasks.sendEmailFromTemplate` | `salesforce.api.tasks.sendEmailFromTemplate` | `write` | Send email from template |
| `tasks.sendMassEmail` | `salesforce.api.tasks.sendMassEmail` | `write` | Send mass email |
| `tasks.updateTask` | `salesforce.api.tasks.updateTask` | `write` | Update task |
| `uiApi.createARecord` | `salesforce.api.uiApi.createARecord` | `write` | Create record via UI API |
| `uiApi.createRecordUiApi` | `salesforce.api.uiApi.createRecordUiApi` | `write` | Create record using UI API |
| `uiApi.getAllNavigationItems` | `salesforce.api.uiApi.getAllNavigationItems` | `read` | Get all navigation items |
| `uiApi.getApp` | `salesforce.api.uiApi.getApp` | `read` | Get app metadata |
| `uiApi.getApps` | `salesforce.api.uiApi.getApps` | `read` | Get apps metadata |
| `uiApi.getCompactLayouts` | `salesforce.api.uiApi.getCompactLayouts` | `read` | Get compact layouts |
| `uiApi.getLastSelectedApp` | `salesforce.api.uiApi.getLastSelectedApp` | `read` | Get last selected app |
| `uiApi.getListViewActions` | `salesforce.api.uiApi.getListViewActions` | `read` | Get list view actions |
| `uiApi.getListViewMetadataBatch` | `salesforce.api.uiApi.getListViewMetadataBatch` | `read` | Get batch list view metadata |
| `uiApi.getListViewMetadataByName` | `salesforce.api.uiApi.getListViewMetadataByName` | `read` | Get list view metadata by API name |
| `uiApi.getListViewRecordsById` | `salesforce.api.uiApi.getListViewRecordsById` | `read` | Get list view records by ID |
| `uiApi.getListViewRecordsByName` | `salesforce.api.uiApi.getListViewRecordsByName` | `read` | Get list view records by API name |
| `uiApi.getListViewResults` | `salesforce.api.uiApi.getListViewResults` | `read` | Get list view results by sObject |
| `uiApi.getLookupFieldSuggestions` | `salesforce.api.uiApi.getLookupFieldSuggestions` | `read` | Get lookup field suggestions |
| `uiApi.getLookupSuggestionsCaseContact` | `salesforce.api.uiApi.getLookupSuggestionsCaseContact` | `read` | Get lookup field suggestions for Case ContactId with POST |
| `uiApi.getLookupSuggestionsOpportunityAccount` | `salesforce.api.uiApi.getLookupSuggestionsOpportunityAccount` | `read` | Get lookup field suggestions for Opportunity AccountId with POST |
| `uiApi.getMruListViewMetadata` | `salesforce.api.uiApi.getMruListViewMetadata` | `read` | Get MRU list view metadata |
| `uiApi.getMruListViewRecords` | `salesforce.api.uiApi.getMruListViewRecords` | `read` | Get MRU list view records |
| `uiApi.getObjectListViews` | `salesforce.api.uiApi.getObjectListViews` | `read` | Get list views for an object |
| `uiApi.getPhotoActions` | `salesforce.api.uiApi.getPhotoActions` | `read` | Get photo actions |
| `uiApi.getRecordEditPageActions` | `salesforce.api.uiApi.getRecordEditPageActions` | `read` | Get record edit page actions |
| `uiApi.getRecordUiDataAndMetadata` | `salesforce.api.uiApi.getRecordUiDataAndMetadata` | `read` | Get record UI data and metadata |
| `uiApi.getRelatedListActions` | `salesforce.api.uiApi.getRelatedListActions` | `read` | Get related list actions |
| `uiApi.getRelatedListPreferencesBatch` | `salesforce.api.uiApi.getRelatedListPreferencesBatch` | `read` | Get batch related list user preferences |
| `uiApi.getRelatedListRecordsContacts` | `salesforce.api.uiApi.getRelatedListRecordsContacts` | `read` | Get related list records for Contacts |
| `uiApi.getSobjectListView` | `salesforce.api.uiApi.getSobjectListView` | `read` | Get sObject list view information |
| `uiApi.getSobjectListViews` | `salesforce.api.uiApi.getSobjectListViews` | `read` | Get list views for sObject |
| `uiApi.getUiApiActionsLookupAccount` | `salesforce.api.uiApi.getUiApiActionsLookupAccount` | `read` | Get lookup field actions for Account |
| `uiApi.getUiapiActionsMruListAccount` | `salesforce.api.uiApi.getUiapiActionsMruListAccount` | `read` | Get MRU list view actions |
| `uiApi.getUiApiActionsRecordRelatedList` | `salesforce.api.uiApi.getUiApiActionsRecordRelatedList` | `read` | Get record related list actions |
| `uiApi.getUiApiAppsUserNavItems` | `salesforce.api.uiApi.getUiApiAppsUserNavItems` | `read` | Get user navigation items |
| `uiApi.getUiapiListInfoAccountAllAccounts` | `salesforce.api.uiApi.getUiapiListInfoAccountAllAccounts` | `read` | Get Account AllAccounts list view metadata |
| `uiApi.getUiapiListInfoAccountRecent` | `salesforce.api.uiApi.getUiapiListInfoAccountRecent` | `read` | Get Account Recent list view metadata |
| `uiApi.getUiapiListInfoAccountSearchResult` | `salesforce.api.uiApi.getUiapiListInfoAccountSearchResult` | `read` | Get Account SearchResult list view metadata |
| `uiApi.getUiApiListInfoRecent` | `salesforce.api.uiApi.getUiApiListInfoRecent` | `read` | Get Recent list view metadata for object |
| `uiApi.getUiapiLookupsOpportunityAccountId` | `salesforce.api.uiApi.getUiapiLookupsOpportunityAccountId` | `read` | Get lookup field suggestions for Opportunity AccountId |
| `uiApi.getUiapimruListInfoAccount` | `salesforce.api.uiApi.getUiapimruListInfoAccount` | `read` | Get MRU list info for Account (deprecated) |
| `uiApi.getUiApiMruListRecordsAccount` | `salesforce.api.uiApi.getUiApiMruListRecordsAccount` | `read` | Get MRU list records for Account (deprecated) |
| `uiApi.getUiapiRelatedListPreferences` | `salesforce.api.uiApi.getUiapiRelatedListPreferences` | `read` | Get related list user preferences |
| `uiApi.headAppmenuSalesforce1` | `salesforce.api.uiApi.headAppmenuSalesforce1` | `read` | Head AppMenu Salesforce1 |
| `uiApi.listViewResults` | `salesforce.api.uiApi.listViewResults` | `read` | Get list view results |
| `uiApi.updateFavorite` | `salesforce.api.uiApi.updateFavorite` | `write` | Update a favorite |
| `uiApi.updateListViewPreferences` | `salesforce.api.uiApi.updateListViewPreferences` | `write` | Update list view preferences |
| `uiApi.updateRecord` | `salesforce.api.uiApi.updateRecord` | `write` | Update a record via UI API |
| `uiApi.updateRelatedListPreferences` | `salesforce.api.uiApi.updateRelatedListPreferences` | `write` | Update related list preferences |

## Auth

Auth: API key, OAuth 2.0 (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 7 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/salesforce

## License

Apache-2.0
