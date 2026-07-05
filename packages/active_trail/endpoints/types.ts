import { z } from 'zod';

// addGroupMember
const AddGroupMemberInputSchema = z.object({
	fax: z.string().optional(),
	city: z.string().optional(),
	ext1: z.string().optional(),
	ext2: z.string().optional(),
	ext3: z.string().optional(),
	ext4: z.string().optional(),
	ext5: z.string().optional(),
	ext6: z.string().optional(),
	email: z.string(),
	phone1: z.string().optional(),
	phone2: z.string().optional(),
	status: z.string().optional(),
	street: z.string().optional(),
	birthday: z.string().optional(),
	group_id: z.number().int(),
	zip_code: z.string().optional(),
	last_name: z.string().optional(),
	first_name: z.string().optional(),
	anniversary: z.string().optional(),
	campaign_id: z.number().int().optional(),
	encryptedext1: z.string().optional(),
	encryptedext2: z.string().optional(),
	encryptedext3: z.string().optional(),
	encryptedext4: z.string().optional(),
	is_do_not_mail: z.boolean().optional(),
	is_trigger_events: z.boolean().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type AddGroupMemberInput = z.infer<typeof AddGroupMemberInputSchema>;
const AddGroupMemberResponseSchema = z.unknown();
export type AddGroupMemberResponse = z.infer<typeof AddGroupMemberResponseSchema>;

// addMailinglistMember
const AddMailinglistMemberInputSchema = z.object({
	fax: z.string().optional(),
	sms: z.string().optional(),
	city: z.string().optional(),
	ext1: z.string().optional(),
	ext2: z.string().optional(),
	ext3: z.string().optional(),
	ext4: z.string().optional(),
	ext5: z.string().optional(),
	ext6: z.string().optional(),
	ext7: z.string().optional(),
	ext8: z.string().optional(),
	ext9: z.string().optional(),
	num1: z.string().optional(),
	num2: z.string().optional(),
	num3: z.string().optional(),
	num4: z.string().optional(),
	num5: z.string().optional(),
	date1: z.string().optional(),
	date2: z.string().optional(),
	date3: z.string().optional(),
	date4: z.string().optional(),
	date5: z.string().optional(),
	email: z.string().optional(),
	ext10: z.string().optional(),
	ext11: z.string().optional(),
	ext12: z.string().optional(),
	ext13: z.string().optional(),
	ext14: z.string().optional(),
	ext15: z.string().optional(),
	ext16: z.string().optional(),
	ext17: z.string().optional(),
	ext18: z.string().optional(),
	ext19: z.string().optional(),
	ext20: z.string().optional(),
	ext21: z.string().optional(),
	ext22: z.string().optional(),
	ext23: z.string().optional(),
	ext24: z.string().optional(),
	ext25: z.string().optional(),
	phone1: z.string().optional(),
	phone2: z.string().optional(),
	status: z.string().optional(),
	street: z.string().optional(),
	birthday: z.string().optional(),
	zip_code: z.string().optional(),
	group_ids: z.array(z.unknown()),
	last_name: z.string().optional(),
	first_name: z.string().optional(),
	is_deleted: z.boolean().optional(),
	sms_status: z.string().optional(),
	anniversary: z.string().optional(),
	subscribe_ip: z.string().optional(),
	mailinglist_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type AddMailinglistMemberInput = z.infer<typeof AddMailinglistMemberInputSchema>;
const AddMailinglistMemberResponseSchema = z.unknown();
export type AddMailinglistMemberResponse = z.infer<typeof AddMailinglistMemberResponseSchema>;

// contactGrowth
const ContactGrowthInputSchema = z.object({
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type ContactGrowthInput = z.infer<typeof ContactGrowthInputSchema>;
const ContactGrowthResponseSchema = z.unknown();
export type ContactGrowthResponse = z.infer<typeof ContactGrowthResponseSchema>;

// createANewGroup
const CreateANewGroupInputSchema = z.object({
	name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateANewGroupInput = z.infer<typeof CreateANewGroupInputSchema>;
const CreateANewGroupResponseSchema = z.unknown();
export type CreateANewGroupResponse = z.infer<typeof CreateANewGroupResponseSchema>;

// createCampaign
const CreateCampaignInputSchema = z.object({
	carts: z.record(z.string(), z.unknown()).optional(),
	pairs: z.array(z.unknown()).optional(),
	design: z.record(z.string(), z.unknown()),
	details: z.record(z.string(), z.unknown()),
	segment: z.record(z.string(), z.unknown()).optional(),
	template: z.record(z.string(), z.unknown()).optional(),
	send_test: z.string().optional(),
	scheduling: z.record(z.string(), z.unknown()),
	a_b_settings: z.record(z.string(), z.unknown()).optional(),
	Id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateCampaignInput = z.infer<typeof CreateCampaignInputSchema>;
const CreateCampaignResponseSchema = z.unknown();
export type CreateCampaignResponse = z.infer<typeof CreateCampaignResponseSchema>;

// createCampaignForContacts
const CreateCampaignForContactsInputSchema = z.object({
	campaign: z.record(z.string(), z.unknown()),
	campaign_contacts: z.record(z.string(), z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateCampaignForContactsInput = z.infer<typeof CreateCampaignForContactsInputSchema>;
const CreateCampaignForContactsResponseSchema = z.unknown();
export type CreateCampaignForContactsResponse = z.infer<typeof CreateCampaignForContactsResponseSchema>;

// createContact
const CreateContactInputSchema = z.object({
	fax: z.string().optional(),
	sms: z.string().optional(),
	city: z.string().optional(),
	ext1: z.string().optional(),
	ext2: z.string().optional(),
	ext3: z.string().optional(),
	ext4: z.string().optional(),
	ext5: z.string().optional(),
	ext6: z.string().optional(),
	ext7: z.string().optional(),
	ext8: z.string().optional(),
	ext9: z.string().optional(),
	num1: z.number().int().optional(),
	num2: z.number().int().optional(),
	num3: z.number().int().optional(),
	num4: z.number().int().optional(),
	num5: z.number().int().optional(),
	date1: z.string().optional(),
	date2: z.string().optional(),
	date3: z.string().optional(),
	date4: z.string().optional(),
	date5: z.string().optional(),
	email: z.string().optional(),
	ext10: z.string().optional(),
	ext11: z.string().optional(),
	ext12: z.string().optional(),
	ext13: z.string().optional(),
	ext14: z.string().optional(),
	ext15: z.string().optional(),
	ext16: z.string().optional(),
	ext17: z.string().optional(),
	ext18: z.string().optional(),
	ext19: z.string().optional(),
	ext20: z.string().optional(),
	ext21: z.string().optional(),
	ext22: z.string().optional(),
	ext23: z.string().optional(),
	ext24: z.string().optional(),
	ext25: z.string().optional(),
	phone1: z.string().optional(),
	phone2: z.string().optional(),
	street: z.string().optional(),
	birthday: z.string().optional(),
	zip_code: z.string().optional(),
	last_name: z.string().optional(),
	first_name: z.string().optional(),
	anniversary: z.string().optional(),
	subscribe_ip: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateContactInput = z.infer<typeof CreateContactInputSchema>;
const CreateContactResponseSchema = z.unknown();
export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;

// createContentCategory
const CreateContentCategoryInputSchema = z.object({
	name: z.string(),
	is_default: z.boolean().optional(),
	display_order: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateContentCategoryInput = z.infer<typeof CreateContentCategoryInputSchema>;
const CreateContentCategoryResponseSchema = z.unknown();
export type CreateContentCategoryResponse = z.infer<typeof CreateContentCategoryResponseSchema>;

// createNewMailingList
const CreateNewMailingListInputSchema = z.object({
	name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateNewMailingListInput = z.infer<typeof CreateNewMailingListInputSchema>;
const CreateNewMailingListResponseSchema = z.unknown();
export type CreateNewMailingListResponse = z.infer<typeof CreateNewMailingListResponseSchema>;

// createOrder
const CreateOrderInputSchema = z.object({
	orders: z.array(z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;
const CreateOrderResponseSchema = z.unknown();
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;

// createSegmentation
const CreateSegmentationInputSchema = z.object({
	name: z.string(),
	rules_segment: z.record(z.string(), z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateSegmentationInput = z.infer<typeof CreateSegmentationInputSchema>;
const CreateSegmentationResponseSchema = z.unknown();
export type CreateSegmentationResponse = z.infer<typeof CreateSegmentationResponseSchema>;

// createSmartCodeSite
const CreateSmartCodeSiteInputSchema = z.object({
	name: z.string(),
	domains: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateSmartCodeSiteInput = z.infer<typeof CreateSmartCodeSiteInputSchema>;
const CreateSmartCodeSiteResponseSchema = z.unknown();
export type CreateSmartCodeSiteResponse = z.infer<typeof CreateSmartCodeSiteResponseSchema>;

// createSmsCampaign
const CreateSmsCampaignInputSchema = z.object({
	name: z.string(),
	content: z.string(),
	segment: z.record(z.string(), z.unknown()),
	from_name: z.string().optional(),
	scheduling: z.record(z.string(), z.unknown()),
	can_unsubscribe: z.boolean().optional(),
	is_link_tracking: z.boolean().optional(),
	unsubscribe_text: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateSmsCampaignInput = z.infer<typeof CreateSmsCampaignInputSchema>;
const CreateSmsCampaignResponseSchema = z.unknown();
export type CreateSmsCampaignResponse = z.infer<typeof CreateSmsCampaignResponseSchema>;

// createSmsOperationalMessage
const CreateSmsOperationalMessageInputSchema = z.object({
	name: z.string(),
	content: z.string(),
	from_name: z.string(),
	can_unsubscribe: z.boolean().optional(),
	unsubscribe_text: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateSmsOperationalMessageInput = z.infer<typeof CreateSmsOperationalMessageInputSchema>;
const CreateSmsOperationalMessageResponseSchema = z.unknown();
export type CreateSmsOperationalMessageResponse = z.infer<typeof CreateSmsOperationalMessageResponseSchema>;

// createWebhook
const CreateWebhookInputSchema = z.object({
	url: z.string(),
	name: z.string(),
	event_type: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;
const CreateWebhookResponseSchema = z.unknown();
export type CreateWebhookResponse = z.infer<typeof CreateWebhookResponseSchema>;

// deleteAccountContentCategories
const DeleteAccountContentCategoriesInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteAccountContentCategoriesInput = z.infer<typeof DeleteAccountContentCategoriesInputSchema>;
const DeleteAccountContentCategoriesResponseSchema = z.unknown();
export type DeleteAccountContentCategoriesResponse = z.infer<typeof DeleteAccountContentCategoriesResponseSchema>;

// deleteAMemberInAGroup
const DeleteAMemberInAGroupInputSchema = z.object({
	group_id: z.number().int(),
	contact_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteAMemberInAGroupInput = z.infer<typeof DeleteAMemberInAGroupInputSchema>;
const DeleteAMemberInAGroupResponseSchema = z.unknown();
export type DeleteAMemberInAGroupResponse = z.infer<typeof DeleteAMemberInAGroupResponseSchema>;

// deleteAutomations
const DeleteAutomationsInputSchema = z.object({
	ids: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteAutomationsInput = z.infer<typeof DeleteAutomationsInputSchema>;
const DeleteAutomationsResponseSchema = z.unknown();
export type DeleteAutomationsResponse = z.infer<typeof DeleteAutomationsResponseSchema>;

// deleteCampaign
const DeleteCampaignInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteCampaignInput = z.infer<typeof DeleteCampaignInputSchema>;
const DeleteCampaignResponseSchema = z.unknown();
export type DeleteCampaignResponse = z.infer<typeof DeleteCampaignResponseSchema>;

// deleteContact
const DeleteContactInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteContactInput = z.infer<typeof DeleteContactInputSchema>;
const DeleteContactResponseSchema = z.unknown();
export type DeleteContactResponse = z.infer<typeof DeleteContactResponseSchema>;

// deleteGroupById
const DeleteGroupByIdInputSchema = z.object({
	group_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteGroupByIdInput = z.infer<typeof DeleteGroupByIdInputSchema>;
const DeleteGroupByIdResponseSchema = z.unknown();
export type DeleteGroupByIdResponse = z.infer<typeof DeleteGroupByIdResponseSchema>;

// deleteMailingList
const DeleteMailingListInputSchema = z.object({
	id: z.string(),
	mailinglist_id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteMailingListInput = z.infer<typeof DeleteMailingListInputSchema>;
const DeleteMailingListResponseSchema = z.unknown();
export type DeleteMailingListResponse = z.infer<typeof DeleteMailingListResponseSchema>;

// deleteSmartCodeSite
const DeleteSmartCodeSiteInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteSmartCodeSiteInput = z.infer<typeof DeleteSmartCodeSiteInputSchema>;
const DeleteSmartCodeSiteResponseSchema = z.unknown();
export type DeleteSmartCodeSiteResponse = z.infer<typeof DeleteSmartCodeSiteResponseSchema>;

// deleteTemplate
const DeleteTemplateInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;
const DeleteTemplateResponseSchema = z.unknown();
export type DeleteTemplateResponse = z.infer<typeof DeleteTemplateResponseSchema>;

// deleteTemplatesTemplateCategory
const DeleteTemplatesTemplateCategoryInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteTemplatesTemplateCategoryInput = z.infer<typeof DeleteTemplatesTemplateCategoryInputSchema>;
const DeleteTemplatesTemplateCategoryResponseSchema = z.unknown();
export type DeleteTemplatesTemplateCategoryResponse = z.infer<typeof DeleteTemplatesTemplateCategoryResponseSchema>;

// deleteWebhook
const DeleteWebhookInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;
const DeleteWebhookResponseSchema = z.unknown();
export type DeleteWebhookResponse = z.infer<typeof DeleteWebhookResponseSchema>;

// deleteWebhooksParameters
const DeleteWebhooksParametersInputSchema = z.object({
	webhook_id: z.number().int(),
	parameter_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteWebhooksParametersInput = z.infer<typeof DeleteWebhooksParametersInputSchema>;
const DeleteWebhooksParametersResponseSchema = z.unknown();
export type DeleteWebhooksParametersResponse = z.infer<typeof DeleteWebhooksParametersResponseSchema>;

// getAccountBalance
const GetAccountBalanceInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAccountBalanceInput = z.infer<typeof GetAccountBalanceInputSchema>;
const GetAccountBalanceResponseSchema = z.unknown();
export type GetAccountBalanceResponse = z.infer<typeof GetAccountBalanceResponseSchema>;

// getAccountContentCategories2
const GetAccountContentCategories2InputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAccountContentCategories2Input = z.infer<typeof GetAccountContentCategories2InputSchema>;
const GetAccountContentCategories2ResponseSchema = z.unknown();
export type GetAccountContentCategories2Response = z.infer<typeof GetAccountContentCategories2ResponseSchema>;

// getAccountIntegrationdata
const GetAccountIntegrationdataInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAccountIntegrationdataInput = z.infer<typeof GetAccountIntegrationdataInputSchema>;
const GetAccountIntegrationdataResponseSchema = z.unknown();
export type GetAccountIntegrationdataResponse = z.infer<typeof GetAccountIntegrationdataResponseSchema>;

// getAccountMerge
const GetAccountMergeInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAccountMergeInput = z.infer<typeof GetAccountMergeInputSchema>;
const GetAccountMergeResponseSchema = z.unknown();
export type GetAccountMergeResponse = z.infer<typeof GetAccountMergeResponseSchema>;

// getAllCampaignReports
const GetAllCampaignReportsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAllCampaignReportsInput = z.infer<typeof GetAllCampaignReportsInputSchema>;
const GetAllCampaignReportsResponseSchema = z.unknown();
export type GetAllCampaignReportsResponse = z.infer<typeof GetAllCampaignReportsResponseSchema>;

// getAllGroups
const GetAllGroupsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAllGroupsInput = z.infer<typeof GetAllGroupsInputSchema>;
const GetAllGroupsResponseSchema = z.unknown();
export type GetAllGroupsResponse = z.infer<typeof GetAllGroupsResponseSchema>;

// getAllSentCampaigns
const GetAllSentCampaignsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	mailing_list_id: z.string().optional(),
	content_category_id: z.string().optional(),
	groupid: z.union([z.string(), z.number()]).optional(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAllSentCampaignsInput = z.infer<typeof GetAllSentCampaignsInputSchema>;
const GetAllSentCampaignsResponseSchema = z.unknown();
export type GetAllSentCampaignsResponse = z.infer<typeof GetAllSentCampaignsResponseSchema>;

// getAutomationLog
const GetAutomationLogInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationLogInput = z.infer<typeof GetAutomationLogInputSchema>;
const GetAutomationLogResponseSchema = z.unknown();
export type GetAutomationLogResponse = z.infer<typeof GetAutomationLogResponseSchema>;

// getAutomationReportsLogAutomationQueue
const GetAutomationReportsLogAutomationQueueInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationReportsLogAutomationQueueInput = z.infer<typeof GetAutomationReportsLogAutomationQueueInputSchema>;
const GetAutomationReportsLogAutomationQueueResponseSchema = z.unknown();
export type GetAutomationReportsLogAutomationQueueResponse = z.infer<typeof GetAutomationReportsLogAutomationQueueResponseSchema>;

// getAutomationReportsSmsCampaignSummary
const GetAutomationReportsSmsCampaignSummaryInputSchema = z.object({
	id: z.number().int(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationReportsSmsCampaignSummaryInput = z.infer<typeof GetAutomationReportsSmsCampaignSummaryInputSchema>;
const GetAutomationReportsSmsCampaignSummaryResponseSchema = z.unknown();
export type GetAutomationReportsSmsCampaignSummaryResponse = z.infer<typeof GetAutomationReportsSmsCampaignSummaryResponseSchema>;

// getAutomationReportsSummaryReport
const GetAutomationReportsSummaryReportInputSchema = z.object({
	id: z.number().int(),
	to_date: z.string(),
	from_date: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationReportsSummaryReportInput = z.infer<typeof GetAutomationReportsSummaryReportInputSchema>;
const GetAutomationReportsSummaryReportResponseSchema = z.unknown();
export type GetAutomationReportsSummaryReportResponse = z.infer<typeof GetAutomationReportsSummaryReportResponseSchema>;

// getAutomations
const GetAutomationsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	state_type: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationsInput = z.infer<typeof GetAutomationsInputSchema>;
const GetAutomationsResponseSchema = z.unknown();
export type GetAutomationsResponse = z.infer<typeof GetAutomationsResponseSchema>;

// getAutomationsDetails
const GetAutomationsDetailsInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationsDetailsInput = z.infer<typeof GetAutomationsDetailsInputSchema>;
const GetAutomationsDetailsResponseSchema = z.unknown();
export type GetAutomationsDetailsResponse = z.infer<typeof GetAutomationsDetailsResponseSchema>;

// getAutomationsEmailCampaignSteps
const GetAutomationsEmailCampaignStepsInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationsEmailCampaignStepsInput = z.infer<typeof GetAutomationsEmailCampaignStepsInputSchema>;
const GetAutomationsEmailCampaignStepsResponseSchema = z.unknown();
export type GetAutomationsEmailCampaignStepsResponse = z.infer<typeof GetAutomationsEmailCampaignStepsResponseSchema>;

// getAutomationsSmsCampaignSteps
const GetAutomationsSmsCampaignStepsInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationsSmsCampaignStepsInput = z.infer<typeof GetAutomationsSmsCampaignStepsInputSchema>;
const GetAutomationsSmsCampaignStepsResponseSchema = z.unknown();
export type GetAutomationsSmsCampaignStepsResponse = z.infer<typeof GetAutomationsSmsCampaignStepsResponseSchema>;

// getAutomationTriggerTypes
const GetAutomationTriggerTypesInputSchema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetAutomationTriggerTypesInput = z.infer<typeof GetAutomationTriggerTypesInputSchema>;
const GetAutomationTriggerTypesResponseSchema = z.unknown();
export type GetAutomationTriggerTypesResponse = z.infer<typeof GetAutomationTriggerTypesResponseSchema>;

// getCampaignBounces
const GetCampaignBouncesInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	bounce_type: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignBouncesInput = z.infer<typeof GetCampaignBouncesInputSchema>;
const GetCampaignBouncesResponseSchema = z.unknown();
export type GetCampaignBouncesResponse = z.infer<typeof GetCampaignBouncesResponseSchema>;

// getCampaignClicks
const GetCampaignClicksInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	link_id: z.string().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignClicksInput = z.infer<typeof GetCampaignClicksInputSchema>;
const GetCampaignClicksResponseSchema = z.unknown();
export type GetCampaignClicksResponse = z.infer<typeof GetCampaignClicksResponseSchema>;

// getCampaignDesign
const GetCampaignDesignInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignDesignInput = z.infer<typeof GetCampaignDesignInputSchema>;
const GetCampaignDesignResponseSchema = z.unknown();
export type GetCampaignDesignResponse = z.infer<typeof GetCampaignDesignResponseSchema>;

// getCampaignDomainsReport
const GetCampaignDomainsReportInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	campaign_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignDomainsReportInput = z.infer<typeof GetCampaignDomainsReportInputSchema>;
const GetCampaignDomainsReportResponseSchema = z.unknown();
export type GetCampaignDomainsReportResponse = z.infer<typeof GetCampaignDomainsReportResponseSchema>;

// getCampaignOpens
const GetCampaignOpensInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	groupid: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	campaign_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignOpensInput = z.infer<typeof GetCampaignOpensInputSchema>;
const GetCampaignOpensResponseSchema = z.unknown();
export type GetCampaignOpensResponse = z.infer<typeof GetCampaignOpensResponseSchema>;

// getCampaignReport
const GetCampaignReportInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignReportInput = z.infer<typeof GetCampaignReportInputSchema>;
const GetCampaignReportResponseSchema = z.unknown();
export type GetCampaignReportResponse = z.infer<typeof GetCampaignReportResponseSchema>;

// getCampaignReportsBounced
const GetCampaignReportsBouncedInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	bounce_type: z.unknown().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignReportsBouncedInput = z.infer<typeof GetCampaignReportsBouncedInputSchema>;
const GetCampaignReportsBouncedResponseSchema = z.unknown();
export type GetCampaignReportsBouncedResponse = z.infer<typeof GetCampaignReportsBouncedResponseSchema>;

// getCampaignReportsComplaints
const GetCampaignReportsComplaintsInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	groupid: z.string().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignReportsComplaintsInput = z.infer<typeof GetCampaignReportsComplaintsInputSchema>;
const GetCampaignReportsComplaintsResponseSchema = z.unknown();
export type GetCampaignReportsComplaintsResponse = z.infer<typeof GetCampaignReportsComplaintsResponseSchema>;

// getCampaignReportsEmailActivity
const GetCampaignReportsEmailActivityInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignReportsEmailActivityInput = z.infer<typeof GetCampaignReportsEmailActivityInputSchema>;
const GetCampaignReportsEmailActivityResponseSchema = z.unknown();
export type GetCampaignReportsEmailActivityResponse = z.infer<typeof GetCampaignReportsEmailActivityResponseSchema>;

// getCampaignReportsSent
const GetCampaignReportsSentInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	groupid: z.string().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignReportsSentInput = z.infer<typeof GetCampaignReportsSentInputSchema>;
const GetCampaignReportsSentResponseSchema = z.unknown();
export type GetCampaignReportsSentResponse = z.infer<typeof GetCampaignReportsSentResponseSchema>;

// getCampaignReportsUnopened
const GetCampaignReportsUnopenedInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	groupid: z.string().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignReportsUnopenedInput = z.infer<typeof GetCampaignReportsUnopenedInputSchema>;
const GetCampaignReportsUnopenedResponseSchema = z.unknown();
export type GetCampaignReportsUnopenedResponse = z.infer<typeof GetCampaignReportsUnopenedResponseSchema>;

// getCampaignScheduling
const GetCampaignSchedulingInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignSchedulingInput = z.infer<typeof GetCampaignSchedulingInputSchema>;
const GetCampaignSchedulingResponseSchema = z.unknown();
export type GetCampaignSchedulingResponse = z.infer<typeof GetCampaignSchedulingResponseSchema>;

// getCampaignSDetails
const GetCampaignSDetailsInputSchema = z.object({
	campaign_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignSDetailsInput = z.infer<typeof GetCampaignSDetailsInputSchema>;
const GetCampaignSDetailsResponseSchema = z.unknown();
export type GetCampaignSDetailsResponse = z.infer<typeof GetCampaignSDetailsResponseSchema>;

// getCampaignsDetails
const GetCampaignsDetailsInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignsDetailsInput = z.infer<typeof GetCampaignsDetailsInputSchema>;
const GetCampaignsDetailsResponseSchema = z.unknown();
export type GetCampaignsDetailsResponse = z.infer<typeof GetCampaignsDetailsResponseSchema>;

// getCampaignsSegment
const GetCampaignsSegmentInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignsSegmentInput = z.infer<typeof GetCampaignsSegmentInputSchema>;
const GetCampaignsSegmentResponseSchema = z.unknown();
export type GetCampaignsSegmentResponse = z.infer<typeof GetCampaignsSegmentResponseSchema>;

// getCampaignsSentCampaigns
const GetCampaignsSentCampaignsInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignsSentCampaignsInput = z.infer<typeof GetCampaignsSentCampaignsInputSchema>;
const GetCampaignsSentCampaignsResponseSchema = z.unknown();
export type GetCampaignsSentCampaignsResponse = z.infer<typeof GetCampaignsSentCampaignsResponseSchema>;

// getCampaignTemplate
const GetCampaignTemplateInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignTemplateInput = z.infer<typeof GetCampaignTemplateInputSchema>;
const GetCampaignTemplateResponseSchema = z.unknown();
export type GetCampaignTemplateResponse = z.infer<typeof GetCampaignTemplateResponseSchema>;

// getCampaignUnsubscribed
const GetCampaignUnsubscribedInputSchema = z.object({
	id: z.number().int(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCampaignUnsubscribedInput = z.infer<typeof GetCampaignUnsubscribedInputSchema>;
const GetCampaignUnsubscribedResponseSchema = z.unknown();
export type GetCampaignUnsubscribedResponse = z.infer<typeof GetCampaignUnsubscribedResponseSchema>;

// getCommerceSchema
const GetCommerceSchemaInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCommerceSchemaInput = z.infer<typeof GetCommerceSchemaInputSchema>;
const GetCommerceSchemaResponseSchema = z.unknown();
export type GetCommerceSchemaResponse = z.infer<typeof GetCommerceSchemaResponseSchema>;

// getContactActivity
const GetContactActivityInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactActivityInput = z.infer<typeof GetContactActivityInputSchema>;
const GetContactActivityResponseSchema = z.unknown();
export type GetContactActivityResponse = z.infer<typeof GetContactActivityResponseSchema>;

// getContactDetails
const GetContactDetailsInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactDetailsInput = z.infer<typeof GetContactDetailsInputSchema>;
const GetContactDetailsResponseSchema = z.unknown();
export type GetContactDetailsResponse = z.infer<typeof GetContactDetailsResponseSchema>;

// getContactFields
const GetContactFieldsInputSchema = z.object({
	fields_type: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactFieldsInput = z.infer<typeof GetContactFieldsInputSchema>;
const GetContactFieldsResponseSchema = z.unknown();
export type GetContactFieldsResponse = z.infer<typeof GetContactFieldsResponseSchema>;

// getContactGroups
const GetContactGroupsInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactGroupsInput = z.infer<typeof GetContactGroupsInputSchema>;
const GetContactGroupsResponseSchema = z.unknown();
export type GetContactGroupsResponse = z.infer<typeof GetContactGroupsResponseSchema>;

// getContactList
const GetContactListInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	search_term: z.string().optional(),
	customer_states: z.string().optional(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactListInput = z.infer<typeof GetContactListInputSchema>;
const GetContactListResponseSchema = z.unknown();
export type GetContactListResponse = z.infer<typeof GetContactListResponseSchema>;

// getContactsErrors
const GetContactsErrorsInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsErrorsInput = z.infer<typeof GetContactsErrorsInputSchema>;
const GetContactsErrorsResponseSchema = z.unknown();
export type GetContactsErrorsResponse = z.infer<typeof GetContactsErrorsResponseSchema>;

// getContactsMailinglists
const GetContactsMailinglistsInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsMailinglistsInput = z.infer<typeof GetContactsMailinglistsInputSchema>;
const GetContactsMailinglistsResponseSchema = z.unknown();
export type GetContactsMailinglistsResponse = z.infer<typeof GetContactsMailinglistsResponseSchema>;

// getContactsMerges
const GetContactsMergesInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	state_type: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsMergesInput = z.infer<typeof GetContactsMergesInputSchema>;
const GetContactsMergesResponseSchema = z.unknown();
export type GetContactsMergesResponse = z.infer<typeof GetContactsMergesResponseSchema>;

// getContactSmsStatistics
const GetContactSmsStatisticsInputSchema = z.object({
	contact_id: z.number().int(),
	message_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactSmsStatisticsInput = z.infer<typeof GetContactSmsStatisticsInputSchema>;
const GetContactSmsStatisticsResponseSchema = z.unknown();
export type GetContactSmsStatisticsResponse = z.infer<typeof GetContactSmsStatisticsResponseSchema>;

// getContactsStatisticsCampaign
const GetContactsStatisticsCampaignInputSchema = z.object({
	id: z.number().int(),
	campaign_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsStatisticsCampaignInput = z.infer<typeof GetContactsStatisticsCampaignInputSchema>;
const GetContactsStatisticsCampaignResponseSchema = z.unknown();
export type GetContactsStatisticsCampaignResponse = z.infer<typeof GetContactsStatisticsCampaignResponseSchema>;

// getContactsSubscriptionAllContacts
const GetContactsSubscriptionAllContactsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsSubscriptionAllContactsInput = z.infer<typeof GetContactsSubscriptionAllContactsInputSchema>;
const GetContactsSubscriptionAllContactsResponseSchema = z.unknown();
export type GetContactsSubscriptionAllContactsResponse = z.infer<typeof GetContactsSubscriptionAllContactsResponseSchema>;

// getContactsSubscriptionCustomersStatus
const GetContactsSubscriptionCustomersStatusInputSchema = z.object({
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	page: z.union([z.string(), z.number()]).optional(),
	limit: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsSubscriptionCustomersStatusInput = z.infer<typeof GetContactsSubscriptionCustomersStatusInputSchema>;
const GetContactsSubscriptionCustomersStatusResponseSchema = z.unknown();
export type GetContactsSubscriptionCustomersStatusResponse = z.infer<typeof GetContactsSubscriptionCustomersStatusResponseSchema>;

// getContactsSubscriptionSubscribers
const GetContactsSubscriptionSubscribersInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsSubscriptionSubscribersInput = z.infer<typeof GetContactsSubscriptionSubscribersInputSchema>;
const GetContactsSubscriptionSubscribersResponseSchema = z.unknown();
export type GetContactsSubscriptionSubscribersResponse = z.infer<typeof GetContactsSubscriptionSubscribersResponseSchema>;

// getContactsSubscriptionUnsubscribers
const GetContactsSubscriptionUnsubscribersInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsSubscriptionUnsubscribersInput = z.infer<typeof GetContactsSubscriptionUnsubscribersInputSchema>;
const GetContactsSubscriptionUnsubscribersResponseSchema = z.unknown();
export type GetContactsSubscriptionUnsubscribersResponse = z.infer<typeof GetContactsSubscriptionUnsubscribersResponseSchema>;

// getContactsUnsubscribersSms
const GetContactsUnsubscribersSmsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsUnsubscribersSmsInput = z.infer<typeof GetContactsUnsubscribersSmsInputSchema>;
const GetContactsUnsubscribersSmsResponseSchema = z.unknown();
export type GetContactsUnsubscribersSmsResponse = z.infer<typeof GetContactsUnsubscribersSmsResponseSchema>;

// getContactsWithSmsState
const GetContactsWithSmsStateInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	search_term: z.string().optional(),
	customer_states: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContactsWithSmsStateInput = z.infer<typeof GetContactsWithSmsStateInputSchema>;
const GetContactsWithSmsStateResponseSchema = z.unknown();
export type GetContactsWithSmsStateResponse = z.infer<typeof GetContactsWithSmsStateResponseSchema>;

// getContentCategories
const GetContentCategoriesInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetContentCategoriesInput = z.infer<typeof GetContentCategoriesInputSchema>;
const GetContentCategoriesResponseSchema = z.unknown();
export type GetContentCategoriesResponse = z.infer<typeof GetContentCategoriesResponseSchema>;

// getCustomerStatsForTransactionalMessage
const GetCustomerStatsForTransactionalMessageInputSchema = z.object({
	contact_id: z.number().int(),
	transactional_id: z.number().int(),
	message_id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetCustomerStatsForTransactionalMessageInput = z.infer<typeof GetCustomerStatsForTransactionalMessageInputSchema>;
const GetCustomerStatsForTransactionalMessageResponseSchema = z.unknown();
export type GetCustomerStatsForTransactionalMessageResponse = z.infer<typeof GetCustomerStatsForTransactionalMessageResponseSchema>;

// getExecutiveReport
const GetExecutiveReportInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetExecutiveReportInput = z.infer<typeof GetExecutiveReportInputSchema>;
const GetExecutiveReportResponseSchema = z.unknown();
export type GetExecutiveReportResponse = z.infer<typeof GetExecutiveReportResponseSchema>;

// getExternalSchema
const GetExternalSchemaInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetExternalSchemaInput = z.infer<typeof GetExternalSchemaInputSchema>;
const GetExternalSchemaResponseSchema = z.unknown();
export type GetExternalSchemaResponse = z.infer<typeof GetExternalSchemaResponseSchema>;

// getGroup
const GetGroupInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetGroupInput = z.infer<typeof GetGroupInputSchema>;
const GetGroupResponseSchema = z.unknown();
export type GetGroupResponse = z.infer<typeof GetGroupResponseSchema>;

// getGroupContentsById
const GetGroupContentsByIdInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	group_id: z.number().int(),
	from_date: z.string().optional(),
	search_term: z.string().optional(),
	customer_states: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetGroupContentsByIdInput = z.infer<typeof GetGroupContentsByIdInputSchema>;
const GetGroupContentsByIdResponseSchema = z.unknown();
export type GetGroupContentsByIdResponse = z.infer<typeof GetGroupContentsByIdResponseSchema>;

// getGroupsEvents
const GetGroupsEventsInputSchema = z.object({
	id: z.number().int(),
	event_type: z.string().optional(),
	event_to_date: z.string().optional(),
	created_to_date: z.string().optional(),
	event_from_date: z.string().optional(),
	created_from_date: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetGroupsEventsInput = z.infer<typeof GetGroupsEventsInputSchema>;
const GetGroupsEventsResponseSchema = z.unknown();
export type GetGroupsEventsResponse = z.infer<typeof GetGroupsEventsResponseSchema>;

// getLandingPages
const GetLandingPagesInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetLandingPagesInput = z.infer<typeof GetLandingPagesInputSchema>;
const GetLandingPagesResponseSchema = z.unknown();
export type GetLandingPagesResponse = z.infer<typeof GetLandingPagesResponseSchema>;

// getMailingList
const GetMailingListInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetMailingListInput = z.infer<typeof GetMailingListInputSchema>;
const GetMailingListResponseSchema = z.unknown();
export type GetMailingListResponse = z.infer<typeof GetMailingListResponseSchema>;

// getMailingListMembers
const GetMailingListMembersInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	customer_states: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetMailingListMembersInput = z.infer<typeof GetMailingListMembersInputSchema>;
const GetMailingListMembersResponseSchema = z.unknown();
export type GetMailingListMembersResponse = z.infer<typeof GetMailingListMembersResponseSchema>;

// getMailingLists
const GetMailingListsInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetMailingListsInput = z.infer<typeof GetMailingListsInputSchema>;
const GetMailingListsResponseSchema = z.unknown();
export type GetMailingListsResponse = z.infer<typeof GetMailingListsResponseSchema>;

// getOrder
const GetOrderInputSchema = z.object({
	order_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetOrderInput = z.infer<typeof GetOrderInputSchema>;
const GetOrderResponseSchema = z.unknown();
export type GetOrderResponse = z.infer<typeof GetOrderResponseSchema>;

// getPushCampaignOpens
const GetPushCampaignOpensInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetPushCampaignOpensInput = z.infer<typeof GetPushCampaignOpensInputSchema>;
const GetPushCampaignOpensResponseSchema = z.unknown();
export type GetPushCampaignOpensResponse = z.infer<typeof GetPushCampaignOpensResponseSchema>;

// getPushCampaignReportDelivered
const GetPushCampaignReportDeliveredInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetPushCampaignReportDeliveredInput = z.infer<typeof GetPushCampaignReportDeliveredInputSchema>;
const GetPushCampaignReportDeliveredResponseSchema = z.unknown();
export type GetPushCampaignReportDeliveredResponse = z.infer<typeof GetPushCampaignReportDeliveredResponseSchema>;

// getPushCampaignReportFailed
const GetPushCampaignReportFailedInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetPushCampaignReportFailedInput = z.infer<typeof GetPushCampaignReportFailedInputSchema>;
const GetPushCampaignReportFailedResponseSchema = z.unknown();
export type GetPushCampaignReportFailedResponse = z.infer<typeof GetPushCampaignReportFailedResponseSchema>;

// getPushCampaignReports
const GetPushCampaignReportsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetPushCampaignReportsInput = z.infer<typeof GetPushCampaignReportsInputSchema>;
const GetPushCampaignReportsResponseSchema = z.unknown();
export type GetPushCampaignReportsResponse = z.infer<typeof GetPushCampaignReportsResponseSchema>;

// getPushCampaignReportSent
const GetPushCampaignReportSentInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetPushCampaignReportSentInput = z.infer<typeof GetPushCampaignReportSentInputSchema>;
const GetPushCampaignReportSentResponseSchema = z.unknown();
export type GetPushCampaignReportSentResponse = z.infer<typeof GetPushCampaignReportSentResponseSchema>;

// getPushCampaignReportSummary
const GetPushCampaignReportSummaryInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetPushCampaignReportSummaryInput = z.infer<typeof GetPushCampaignReportSummaryInputSchema>;
const GetPushCampaignReportSummaryResponseSchema = z.unknown();
export type GetPushCampaignReportSummaryResponse = z.infer<typeof GetPushCampaignReportSummaryResponseSchema>;

// getPushCampaigns
const GetPushCampaignsInputSchema = z.object({
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	page_size: z.number().int().optional(),
	campaign_id: z.string().optional(),
	filter_type: z.string().optional(),
	page_number: z.number().int().optional(),
	search_term: z.string().optional(),
	include_deleted: z.boolean().optional(),
	include_not_sent: z.boolean().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetPushCampaignsInput = z.infer<typeof GetPushCampaignsInputSchema>;
const GetPushCampaignsResponseSchema = z.unknown();
export type GetPushCampaignsResponse = z.infer<typeof GetPushCampaignsResponseSchema>;

// getSegmentationRuleFieldTypes
const GetSegmentationRuleFieldTypesInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSegmentationRuleFieldTypesInput = z.infer<typeof GetSegmentationRuleFieldTypesInputSchema>;
const GetSegmentationRuleFieldTypesResponseSchema = z.unknown();
export type GetSegmentationRuleFieldTypesResponse = z.infer<typeof GetSegmentationRuleFieldTypesResponseSchema>;

// getSegmentationRuleOperations
const GetSegmentationRuleOperationsInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSegmentationRuleOperationsInput = z.infer<typeof GetSegmentationRuleOperationsInputSchema>;
const GetSegmentationRuleOperationsResponseSchema = z.unknown();
export type GetSegmentationRuleOperationsResponse = z.infer<typeof GetSegmentationRuleOperationsResponseSchema>;

// getSegmentationRuleTypes
const GetSegmentationRuleTypesInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSegmentationRuleTypesInput = z.infer<typeof GetSegmentationRuleTypesInputSchema>;
const GetSegmentationRuleTypesResponseSchema = z.unknown();
export type GetSegmentationRuleTypesResponse = z.infer<typeof GetSegmentationRuleTypesResponseSchema>;

// getSegmentationRuleTypesMapping
const GetSegmentationRuleTypesMappingInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSegmentationRuleTypesMappingInput = z.infer<typeof GetSegmentationRuleTypesMappingInputSchema>;
const GetSegmentationRuleTypesMappingResponseSchema = z.unknown();
export type GetSegmentationRuleTypesMappingResponse = z.infer<typeof GetSegmentationRuleTypesMappingResponseSchema>;

// getSegmentations
const GetSegmentationsInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSegmentationsInput = z.infer<typeof GetSegmentationsInputSchema>;
const GetSegmentationsResponseSchema = z.unknown();
export type GetSegmentationsResponse = z.infer<typeof GetSegmentationsResponseSchema>;

// getSendingProfiles
const GetSendingProfilesInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSendingProfilesInput = z.infer<typeof GetSendingProfilesInputSchema>;
const GetSendingProfilesResponseSchema = z.unknown();
export type GetSendingProfilesResponse = z.infer<typeof GetSendingProfilesResponseSchema>;

// getSignupForms
const GetSignupFormsInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSignupFormsInput = z.infer<typeof GetSignupFormsInputSchema>;
const GetSignupFormsResponseSchema = z.unknown();
export type GetSignupFormsResponse = z.infer<typeof GetSignupFormsResponseSchema>;

// getSmartCodeSites
const GetSmartCodeSitesInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmartCodeSitesInput = z.infer<typeof GetSmartCodeSitesInputSchema>;
const GetSmartCodeSitesResponseSchema = z.unknown();
export type GetSmartCodeSitesResponse = z.infer<typeof GetSmartCodeSitesResponseSchema>;

// getSmsCampaign
const GetSmsCampaignInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignInput = z.infer<typeof GetSmsCampaignInputSchema>;
const GetSmsCampaignResponseSchema = z.unknown();
export type GetSmsCampaignResponse = z.infer<typeof GetSmsCampaignResponseSchema>;

// getSmsCampaignClickers
const GetSmsCampaignClickersInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	link_id: z.string().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	rows_affected: z.number().int().optional(),
	previous_row_count: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignClickersInput = z.infer<typeof GetSmsCampaignClickersInputSchema>;
const GetSmsCampaignClickersResponseSchema = z.unknown();
export type GetSmsCampaignClickersResponse = z.infer<typeof GetSmsCampaignClickersResponseSchema>;

// getSmsCampaignDelivered
const GetSmsCampaignDeliveredInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	rows_affected: z.number().int().optional(),
	previous_row_count: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignDeliveredInput = z.infer<typeof GetSmsCampaignDeliveredInputSchema>;
const GetSmsCampaignDeliveredResponseSchema = z.unknown();
export type GetSmsCampaignDeliveredResponse = z.infer<typeof GetSmsCampaignDeliveredResponseSchema>;

// getSmsCampaignEstimate
const GetSmsCampaignEstimateInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignEstimateInput = z.infer<typeof GetSmsCampaignEstimateInputSchema>;
const GetSmsCampaignEstimateResponseSchema = z.unknown();
export type GetSmsCampaignEstimateResponse = z.infer<typeof GetSmsCampaignEstimateResponseSchema>;

// getSmsCampaignReport
const GetSmsCampaignReportInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignReportInput = z.infer<typeof GetSmsCampaignReportInputSchema>;
const GetSmsCampaignReportResponseSchema = z.unknown();
export type GetSmsCampaignReportResponse = z.infer<typeof GetSmsCampaignReportResponseSchema>;

// getSmsCampaignReportClicks
const GetSmsCampaignReportClicksInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	rows_affected: z.number().int().optional(),
	previous_row_count: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignReportClicksInput = z.infer<typeof GetSmsCampaignReportClicksInputSchema>;
const GetSmsCampaignReportClicksResponseSchema = z.unknown();
export type GetSmsCampaignReportClicksResponse = z.infer<typeof GetSmsCampaignReportClicksResponseSchema>;

// getSmsCampaignReportFailed
const GetSmsCampaignReportFailedInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignReportFailedInput = z.infer<typeof GetSmsCampaignReportFailedInputSchema>;
const GetSmsCampaignReportFailedResponseSchema = z.unknown();
export type GetSmsCampaignReportFailedResponse = z.infer<typeof GetSmsCampaignReportFailedResponseSchema>;

// getSmsCampaignReports
const GetSmsCampaignReportsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	rows_affected: z.number().int().optional(),
	previous_row_count: z.number().int().optional(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignReportsInput = z.infer<typeof GetSmsCampaignReportsInputSchema>;
const GetSmsCampaignReportsResponseSchema = z.unknown();
export type GetSmsCampaignReportsResponse = z.infer<typeof GetSmsCampaignReportsResponseSchema>;

// getSmsCampaignReportSent
const GetSmsCampaignReportSentInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	rows_affected: z.number().int().optional(),
	previous_row_count: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignReportSentInput = z.infer<typeof GetSmsCampaignReportSentInputSchema>;
const GetSmsCampaignReportSentResponseSchema = z.unknown();
export type GetSmsCampaignReportSentResponse = z.infer<typeof GetSmsCampaignReportSentResponseSchema>;

// getSmsCampaignReportSummary
const GetSmsCampaignReportSummaryInputSchema = z.object({
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignReportSummaryInput = z.infer<typeof GetSmsCampaignReportSummaryInputSchema>;
const GetSmsCampaignReportSummaryResponseSchema = z.unknown();
export type GetSmsCampaignReportSummaryResponse = z.infer<typeof GetSmsCampaignReportSummaryResponseSchema>;

// getSmsCampaignReportUnsubscribed
const GetSmsCampaignReportUnsubscribedInputSchema = z.object({
	id: z.string(),
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	send_type: z.string().optional(),
	search_term: z.string().optional(),
	rows_affected: z.number().int().optional(),
	previous_row_count: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsCampaignReportUnsubscribedInput = z.infer<typeof GetSmsCampaignReportUnsubscribedInputSchema>;
const GetSmsCampaignReportUnsubscribedResponseSchema = z.unknown();
export type GetSmsCampaignReportUnsubscribedResponse = z.infer<typeof GetSmsCampaignReportUnsubscribedResponseSchema>;

// getSmsSendingProfiles
const GetSmsSendingProfilesInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetSmsSendingProfilesInput = z.infer<typeof GetSmsSendingProfilesInputSchema>;
const GetSmsSendingProfilesResponseSchema = z.unknown();
export type GetSmsSendingProfilesResponse = z.infer<typeof GetSmsSendingProfilesResponseSchema>;

// getTemplate
const GetTemplateInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;
const GetTemplateResponseSchema = z.unknown();
export type GetTemplateResponse = z.infer<typeof GetTemplateResponseSchema>;

// getTemplateContent
const GetTemplateContentInputSchema = z.object({
	id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetTemplateContentInput = z.infer<typeof GetTemplateContentInputSchema>;
const GetTemplateContentResponseSchema = z.unknown();
export type GetTemplateContentResponse = z.infer<typeof GetTemplateContentResponseSchema>;

// getTemplates
const GetTemplatesInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetTemplatesInput = z.infer<typeof GetTemplatesInputSchema>;
const GetTemplatesResponseSchema = z.unknown();
export type GetTemplatesResponse = z.infer<typeof GetTemplatesResponseSchema>;

// getTemplatesTemplateCategory
const GetTemplatesTemplateCategoryInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetTemplatesTemplateCategoryInput = z.infer<typeof GetTemplatesTemplateCategoryInputSchema>;
const GetTemplatesTemplateCategoryResponseSchema = z.unknown();
export type GetTemplatesTemplateCategoryResponse = z.infer<typeof GetTemplatesTemplateCategoryResponseSchema>;

// getTransactionalMessagesClassification
const GetTransactionalMessagesClassificationInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetTransactionalMessagesClassificationInput = z.infer<typeof GetTransactionalMessagesClassificationInputSchema>;
const GetTransactionalMessagesClassificationResponseSchema = z.unknown();
export type GetTransactionalMessagesClassificationResponse = z.infer<typeof GetTransactionalMessagesClassificationResponseSchema>;

// getTransactionalSmsMessage
const GetTransactionalSmsMessageInputSchema = z.object({
	transactional_sms_id: z.number().int(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetTransactionalSmsMessageInput = z.infer<typeof GetTransactionalSmsMessageInputSchema>;
const GetTransactionalSmsMessageResponseSchema = z.unknown();
export type GetTransactionalSmsMessageResponse = z.infer<typeof GetTransactionalSmsMessageResponseSchema>;

// getTwoWaySmsReplies
const GetTwoWaySmsRepliesInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	campaign_id: z.number().int().optional(),
	search_term: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetTwoWaySmsRepliesInput = z.infer<typeof GetTwoWaySmsRepliesInputSchema>;
const GetTwoWaySmsRepliesResponseSchema = z.unknown();
export type GetTwoWaySmsRepliesResponse = z.infer<typeof GetTwoWaySmsRepliesResponseSchema>;

// getUpdateActions
const GetUpdateActionsInputSchema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetUpdateActionsInput = z.infer<typeof GetUpdateActionsInputSchema>;
const GetUpdateActionsResponseSchema = z.unknown();
export type GetUpdateActionsResponse = z.infer<typeof GetUpdateActionsResponseSchema>;

// getUserSocialAccountsGet
const GetUserSocialAccountsGetInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetUserSocialAccountsGetInput = z.infer<typeof GetUserSocialAccountsGetInputSchema>;
const GetUserSocialAccountsGetResponseSchema = z.unknown();
export type GetUserSocialAccountsGetResponse = z.infer<typeof GetUserSocialAccountsGetResponseSchema>;

// getWebhook
const GetWebhookInputSchema = z.object({
	webhook_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;
const GetWebhookResponseSchema = z.unknown();
export type GetWebhookResponse = z.infer<typeof GetWebhookResponseSchema>;

// getWebhooks
const GetWebhooksInputSchema = z.object({
	event_type: z.string().optional(),
	state_type: z.string().optional(),
	target_type: z.string().optional(),
	is_ignore_parameters: z.boolean().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetWebhooksInput = z.infer<typeof GetWebhooksInputSchema>;
const GetWebhooksResponseSchema = z.unknown();
export type GetWebhooksResponse = z.infer<typeof GetWebhooksResponseSchema>;

// getWebhooksParameters
const GetWebhooksParametersInputSchema = z.object({
	webhook_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type GetWebhooksParametersInput = z.infer<typeof GetWebhooksParametersInputSchema>;
const GetWebhooksParametersResponseSchema = z.unknown();
export type GetWebhooksParametersResponse = z.infer<typeof GetWebhooksParametersResponseSchema>;

// importNewContacts
const ImportNewContactsInputSchema = z.object({
	group: z.number().int(),
	contacts: z.array(z.unknown()),
	mailing_list: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type ImportNewContactsInput = z.infer<typeof ImportNewContactsInputSchema>;
const ImportNewContactsResponseSchema = z.unknown();
export type ImportNewContactsResponse = z.infer<typeof ImportNewContactsResponseSchema>;

// listSmsCampaigns
const ListSmsCampaignsInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	to_date: z.string().optional(),
	from_date: z.string().optional(),
	filter_type: z.string().optional(),
	search_term: z.string().optional(),
	is_include_not_sent: z.boolean().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type ListSmsCampaignsInput = z.infer<typeof ListSmsCampaignsInputSchema>;
const ListSmsCampaignsResponseSchema = z.unknown();
export type ListSmsCampaignsResponse = z.infer<typeof ListSmsCampaignsResponseSchema>;

// listTransactionalSmsMessages
const ListTransactionalSmsMessagesInputSchema = z.object({
	page: z.number().int().optional(),
	limit: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type ListTransactionalSmsMessagesInput = z.infer<typeof ListTransactionalSmsMessagesInputSchema>;
const ListTransactionalSmsMessagesResponseSchema = z.unknown();
export type ListTransactionalSmsMessagesResponse = z.infer<typeof ListTransactionalSmsMessagesResponseSchema>;

// postTemplatesCampaign
const PostTemplatesCampaignInputSchema = z.object({
	template_id: z.number().int(),
	campaign_details: z.record(z.string(), z.unknown()),
	Id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type PostTemplatesCampaignInput = z.infer<typeof PostTemplatesCampaignInputSchema>;
const PostTemplatesCampaignResponseSchema = z.unknown();
export type PostTemplatesCampaignResponse = z.infer<typeof PostTemplatesCampaignResponseSchema>;

// postTemplatesTemplateCategory
const PostTemplatesTemplateCategoryInputSchema = z.object({
	name: z.string(),
	name_key: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type PostTemplatesTemplateCategoryInput = z.infer<typeof PostTemplatesTemplateCategoryInputSchema>;
const PostTemplatesTemplateCategoryResponseSchema = z.unknown();
export type PostTemplatesTemplateCategoryResponse = z.infer<typeof PostTemplatesTemplateCategoryResponseSchema>;

// postWebhooksParameters
const PostWebhooksParametersInputSchema = z.object({
	key: z.string(),
	value: z.string(),
	user_field: z.string().optional(),
	webhook_id: z.number().int(),
	event_value_type: z.string(),
	event_parameter_type: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type PostWebhooksParametersInput = z.infer<typeof PostWebhooksParametersInputSchema>;
const PostWebhooksParametersResponseSchema = z.unknown();
export type PostWebhooksParametersResponse = z.infer<typeof PostWebhooksParametersResponseSchema>;

// postWebhooksTest2
const PostWebhooksTest2InputSchema = z.object({
	url: z.string(),
	format: z.number().int(),
	user_id: z.number().int().optional(),
	event_type: z.string(),
	parameters: z.array(z.unknown()).optional(),
	target_type: z.string(),
	id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type PostWebhooksTest2Input = z.infer<typeof PostWebhooksTest2InputSchema>;
const PostWebhooksTest2ResponseSchema = z.unknown();
export type PostWebhooksTest2Response = z.infer<typeof PostWebhooksTest2ResponseSchema>;

// putAccountContentCategories
const PutAccountContentCategoriesInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	display_order: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type PutAccountContentCategoriesInput = z.infer<typeof PutAccountContentCategoriesInputSchema>;
const PutAccountContentCategoriesResponseSchema = z.unknown();
export type PutAccountContentCategoriesResponse = z.infer<typeof PutAccountContentCategoriesResponseSchema>;

// putCampaignsSegment
const PutCampaignsSegmentInputSchema = z.object({
	id: z.number().int(),
	group_ids: z.array(z.unknown()),
	restricted_group_ids: z.array(z.unknown()).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type PutCampaignsSegmentInput = z.infer<typeof PutCampaignsSegmentInputSchema>;
const PutCampaignsSegmentResponseSchema = z.unknown();
export type PutCampaignsSegmentResponse = z.infer<typeof PutCampaignsSegmentResponseSchema>;

// removeAContactFromAMailingList
const RemoveAContactFromAMailingListInputSchema = z.object({
	contact_id: z.string(),
	mailinglist_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type RemoveAContactFromAMailingListInput = z.infer<typeof RemoveAContactFromAMailingListInputSchema>;
const RemoveAContactFromAMailingListResponseSchema = z.unknown();
export type RemoveAContactFromAMailingListResponse = z.infer<typeof RemoveAContactFromAMailingListResponseSchema>;

// removeExternalContactFromGroup
const RemoveExternalContactFromGroupInputSchema = z.object({
	group_id: z.string(),
	external_contacts: z.array(z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type RemoveExternalContactFromGroupInput = z.infer<typeof RemoveExternalContactFromGroupInputSchema>;
const RemoveExternalContactFromGroupResponseSchema = z.unknown();
export type RemoveExternalContactFromGroupResponse = z.infer<typeof RemoveExternalContactFromGroupResponseSchema>;

// sendOperationalMessage
const SendOperationalMessageInputSchema = z.object({
	bcc: z.record(z.string(), z.unknown()).optional(),
	design: z.record(z.string(), z.unknown()),
	details: z.record(z.string(), z.unknown()),
	email_package: z.array(z.unknown()).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type SendOperationalMessageInput = z.infer<typeof SendOperationalMessageInputSchema>;
const SendOperationalMessageResponseSchema = z.unknown();
export type SendOperationalMessageResponse = z.infer<typeof SendOperationalMessageResponseSchema>;

// sendOperationalMessageEmail
const SendOperationalMessageEmailInputSchema = z.object({
	bcc: z.record(z.string(), z.unknown()).optional(),
	design: z.record(z.string(), z.unknown()),
	details: z.record(z.string(), z.unknown()),
	email_package: z.array(z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type SendOperationalMessageEmailInput = z.infer<typeof SendOperationalMessageEmailInputSchema>;
const SendOperationalMessageEmailResponseSchema = z.unknown();
export type SendOperationalMessageEmailResponse = z.infer<typeof SendOperationalMessageEmailResponseSchema>;

// testWebhook
const TestWebhookInputSchema = z.object({
	id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type TestWebhookInput = z.infer<typeof TestWebhookInputSchema>;
const TestWebhookResponseSchema = z.unknown();
export type TestWebhookResponse = z.infer<typeof TestWebhookResponseSchema>;

// updateCampaign
const UpdateCampaignInputSchema = z.object({
	id: z.number().int(),
	design: z.record(z.string(), z.unknown()),
	details: z.record(z.string(), z.unknown()),
	send_test: z.string().optional(),
	send_type: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignInputSchema>;
const UpdateCampaignResponseSchema = z.unknown();
export type UpdateCampaignResponse = z.infer<typeof UpdateCampaignResponseSchema>;

// updateCampaignDesign
const UpdateCampaignDesignInputSchema = z.object({
	id: z.number().int(),
	content: z.string(),
	language_type: z.string().optional(),
	is_add_print_email: z.boolean().optional(),
	is_auto_css_inliner: z.boolean().optional(),
	is_remove_system_links: z.boolean().optional(),
	header_footer_language_type: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateCampaignDesignInput = z.infer<typeof UpdateCampaignDesignInputSchema>;
const UpdateCampaignDesignResponseSchema = z.unknown();
export type UpdateCampaignDesignResponse = z.infer<typeof UpdateCampaignDesignResponseSchema>;

// updateCampaignScheduling
const UpdateCampaignSchedulingInputSchema = z.object({
	id: z.number().int(),
	is_sent: z.boolean(),
	scheduled_date_utc: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateCampaignSchedulingInput = z.infer<typeof UpdateCampaignSchedulingInputSchema>;
const UpdateCampaignSchedulingResponseSchema = z.unknown();
export type UpdateCampaignSchedulingResponse = z.infer<typeof UpdateCampaignSchedulingResponseSchema>;

// updateCampaignSDetails
const UpdateCampaignSDetailsInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	subject: z.string(),
	preheader: z.string().optional(),
	user_profile_id: z.number().int(),
	content_category_id: z.number().int(),
	predictive_delivery: z.boolean(),
	google_analytics_name: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateCampaignSDetailsInput = z.infer<typeof UpdateCampaignSDetailsInputSchema>;
const UpdateCampaignSDetailsResponseSchema = z.unknown();
export type UpdateCampaignSDetailsResponse = z.infer<typeof UpdateCampaignSDetailsResponseSchema>;

// updateCampaignTemplate
const UpdateCampaignTemplateInputSchema = z.object({
	campaign_id: z.number().int(),
	template_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateCampaignTemplateInput = z.infer<typeof UpdateCampaignTemplateInputSchema>;
const UpdateCampaignTemplateResponseSchema = z.unknown();
export type UpdateCampaignTemplateResponse = z.infer<typeof UpdateCampaignTemplateResponseSchema>;

// updateContact
const UpdateContactInputSchema = z.object({
	id: z.number().int(),
	fax: z.string().optional(),
	sms: z.string().optional(),
	city: z.string().optional(),
	ext1: z.string().optional(),
	ext2: z.string().optional(),
	ext3: z.string().optional(),
	ext4: z.string().optional(),
	ext5: z.string().optional(),
	ext6: z.string().optional(),
	ext7: z.string().optional(),
	ext8: z.string().optional(),
	ext9: z.string().optional(),
	num1: z.number().int().optional(),
	num2: z.number().int().optional(),
	num3: z.number().int().optional(),
	num4: z.number().int().optional(),
	num5: z.number().int().optional(),
	date1: z.string().optional(),
	date2: z.string().optional(),
	date3: z.string().optional(),
	date4: z.string().optional(),
	date5: z.string().optional(),
	email: z.string().optional(),
	ext10: z.string().optional(),
	ext11: z.string().optional(),
	ext12: z.string().optional(),
	ext13: z.string().optional(),
	ext14: z.string().optional(),
	ext15: z.string().optional(),
	ext16: z.string().optional(),
	ext17: z.string().optional(),
	ext18: z.string().optional(),
	ext19: z.string().optional(),
	ext20: z.string().optional(),
	ext21: z.string().optional(),
	ext22: z.string().optional(),
	ext23: z.string().optional(),
	ext24: z.string().optional(),
	ext25: z.string().optional(),
	phone1: z.string().optional(),
	phone2: z.string().optional(),
	status: z.string().optional(),
	street: z.string().optional(),
	birthday: z.string().optional(),
	zip_code: z.string().optional(),
	last_name: z.string().optional(),
	first_name: z.string().optional(),
	is_deleted: z.boolean().optional(),
	sms_status: z.string().optional(),
	anniversary: z.string().optional(),
	subscribe_ip: z.string().optional(),
	double_opt_in_config: z.record(z.string(), z.unknown()).optional(),
	external_name: z.union([z.string(), z.number()]).optional(),
	external_id: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateContactInput = z.infer<typeof UpdateContactInputSchema>;
const UpdateContactResponseSchema = z.unknown();
export type UpdateContactResponse = z.infer<typeof UpdateContactResponseSchema>;

// updateGroup
const UpdateGroupInputSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateGroupInput = z.infer<typeof UpdateGroupInputSchema>;
const UpdateGroupResponseSchema = z.unknown();
export type UpdateGroupResponse = z.infer<typeof UpdateGroupResponseSchema>;

// updateOrder
const UpdateOrderInputSchema = z.object({
	tax: z.number().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	items: z.array(z.unknown()).optional(),
	mobile: z.string().optional(),
	status: z.string().optional(),
	address: z.string().optional(),
	orderId: z.string().optional(),
	currency: z.string().optional(),
	lastName: z.string().optional(),
	order_id: z.string(),
	firstName: z.string().optional(),
	netAmount: z.number().optional(),
	orderName: z.string().optional(),
	totalPrice: z.number().optional(),
	totalAmount: z.number().optional(),
	purchaseDate: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateOrderInput = z.infer<typeof UpdateOrderInputSchema>;
const UpdateOrderResponseSchema = z.unknown();
export type UpdateOrderResponse = z.infer<typeof UpdateOrderResponseSchema>;

// updateSegmentation
const UpdateSegmentationInputSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	rules_segment: z.record(z.string(), z.unknown()).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateSegmentationInput = z.infer<typeof UpdateSegmentationInputSchema>;
const UpdateSegmentationResponseSchema = z.unknown();
export type UpdateSegmentationResponse = z.infer<typeof UpdateSegmentationResponseSchema>;

// updateSmartCodeSite
const UpdateSmartCodeSiteInputSchema = z.object({
	id: z.string(),
	name: z.string(),
	domains: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateSmartCodeSiteInput = z.infer<typeof UpdateSmartCodeSiteInputSchema>;
const UpdateSmartCodeSiteResponseSchema = z.unknown();
export type UpdateSmartCodeSiteResponse = z.infer<typeof UpdateSmartCodeSiteResponseSchema>;

// updateSmsOperationalMessage
const UpdateSmsOperationalMessageInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	content: z.string(),
	from_name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateSmsOperationalMessageInput = z.infer<typeof UpdateSmsOperationalMessageInputSchema>;
const UpdateSmsOperationalMessageResponseSchema = z.unknown();
export type UpdateSmsOperationalMessageResponse = z.infer<typeof UpdateSmsOperationalMessageResponseSchema>;

// updateTemplate
const UpdateTemplateInputSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	content: z.string().optional(),
	subject: z.string().optional(),
	editor_type: z.string().optional(),
	AddPrintButton: z.boolean().optional(),
	campaign_encoding: z.number().int().optional(),
	template_category_id: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInputSchema>;
const UpdateTemplateResponseSchema = z.unknown();
export type UpdateTemplateResponse = z.infer<typeof UpdateTemplateResponseSchema>;

// updateTemplateCategory
const UpdateTemplateCategoryInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	name_key: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateTemplateCategoryInput = z.infer<typeof UpdateTemplateCategoryInputSchema>;
const UpdateTemplateCategoryResponseSchema = z.unknown();
export type UpdateTemplateCategoryResponse = z.infer<typeof UpdateTemplateCategoryResponseSchema>;

// updateTemplateContent
const UpdateTemplateContentInputSchema = z.object({
	id: z.string(),
	content: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateTemplateContentInput = z.infer<typeof UpdateTemplateContentInputSchema>;
const UpdateTemplateContentResponseSchema = z.unknown();
export type UpdateTemplateContentResponse = z.infer<typeof UpdateTemplateContentResponseSchema>;

// updateWebhook
const UpdateWebhookInputSchema = z.object({
	id: z.number().int(),
	url: z.string(),
	name: z.string(),
	format: z.string().optional(),
	typeid: z.number().int().optional(),
	stateid: z.number().int().optional(),
	is_active: z.boolean().optional(),
	event_type: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;
const UpdateWebhookResponseSchema = z.unknown();
export type UpdateWebhookResponse = z.infer<typeof UpdateWebhookResponseSchema>;

// updateWebhookParameter
const UpdateWebhookParameterInputSchema = z.object({
	key: z.string().optional(),
	value: z.string().optional(),
	user_field: z.string().optional(),
	webhook_id: z.number().int(),
	parameter_id: z.number().int(),
	event_value_type: z.string().optional(),
	event_parameter_type: z.string().optional(),
	parameterid: z.union([z.string(), z.number()]).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateWebhookParameterInput = z.infer<typeof UpdateWebhookParameterInputSchema>;
const UpdateWebhookParameterResponseSchema = z.unknown();
export type UpdateWebhookParameterResponse = z.infer<typeof UpdateWebhookParameterResponseSchema>;

export const ActiveTrailEndpointInputSchemas = {
	addGroupMember: AddGroupMemberInputSchema,
	addMailinglistMember: AddMailinglistMemberInputSchema,
	contactGrowth: ContactGrowthInputSchema,
	createANewGroup: CreateANewGroupInputSchema,
	createCampaign: CreateCampaignInputSchema,
	createCampaignForContacts: CreateCampaignForContactsInputSchema,
	createContact: CreateContactInputSchema,
	createContentCategory: CreateContentCategoryInputSchema,
	createNewMailingList: CreateNewMailingListInputSchema,
	createOrder: CreateOrderInputSchema,
	createSegmentation: CreateSegmentationInputSchema,
	createSmartCodeSite: CreateSmartCodeSiteInputSchema,
	createSmsCampaign: CreateSmsCampaignInputSchema,
	createSmsOperationalMessage: CreateSmsOperationalMessageInputSchema,
	createWebhook: CreateWebhookInputSchema,
	deleteAccountContentCategories: DeleteAccountContentCategoriesInputSchema,
	deleteAMemberInAGroup: DeleteAMemberInAGroupInputSchema,
	deleteAutomations: DeleteAutomationsInputSchema,
	deleteCampaign: DeleteCampaignInputSchema,
	deleteContact: DeleteContactInputSchema,
	deleteGroupById: DeleteGroupByIdInputSchema,
	deleteMailingList: DeleteMailingListInputSchema,
	deleteSmartCodeSite: DeleteSmartCodeSiteInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	deleteTemplatesTemplateCategory: DeleteTemplatesTemplateCategoryInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
	deleteWebhooksParameters: DeleteWebhooksParametersInputSchema,
	getAccountBalance: GetAccountBalanceInputSchema,
	getAccountContentCategories2: GetAccountContentCategories2InputSchema,
	getAccountIntegrationdata: GetAccountIntegrationdataInputSchema,
	getAccountMerge: GetAccountMergeInputSchema,
	getAllCampaignReports: GetAllCampaignReportsInputSchema,
	getAllGroups: GetAllGroupsInputSchema,
	getAllSentCampaigns: GetAllSentCampaignsInputSchema,
	getAutomationLog: GetAutomationLogInputSchema,
	getAutomationReportsLogAutomationQueue: GetAutomationReportsLogAutomationQueueInputSchema,
	getAutomationReportsSmsCampaignSummary: GetAutomationReportsSmsCampaignSummaryInputSchema,
	getAutomationReportsSummaryReport: GetAutomationReportsSummaryReportInputSchema,
	getAutomations: GetAutomationsInputSchema,
	getAutomationsDetails: GetAutomationsDetailsInputSchema,
	getAutomationsEmailCampaignSteps: GetAutomationsEmailCampaignStepsInputSchema,
	getAutomationsSmsCampaignSteps: GetAutomationsSmsCampaignStepsInputSchema,
	getAutomationTriggerTypes: GetAutomationTriggerTypesInputSchema,
	getCampaignBounces: GetCampaignBouncesInputSchema,
	getCampaignClicks: GetCampaignClicksInputSchema,
	getCampaignDesign: GetCampaignDesignInputSchema,
	getCampaignDomainsReport: GetCampaignDomainsReportInputSchema,
	getCampaignOpens: GetCampaignOpensInputSchema,
	getCampaignReport: GetCampaignReportInputSchema,
	getCampaignReportsBounced: GetCampaignReportsBouncedInputSchema,
	getCampaignReportsComplaints: GetCampaignReportsComplaintsInputSchema,
	getCampaignReportsEmailActivity: GetCampaignReportsEmailActivityInputSchema,
	getCampaignReportsSent: GetCampaignReportsSentInputSchema,
	getCampaignReportsUnopened: GetCampaignReportsUnopenedInputSchema,
	getCampaignScheduling: GetCampaignSchedulingInputSchema,
	getCampaignSDetails: GetCampaignSDetailsInputSchema,
	getCampaignsDetails: GetCampaignsDetailsInputSchema,
	getCampaignsSegment: GetCampaignsSegmentInputSchema,
	getCampaignsSentCampaigns: GetCampaignsSentCampaignsInputSchema,
	getCampaignTemplate: GetCampaignTemplateInputSchema,
	getCampaignUnsubscribed: GetCampaignUnsubscribedInputSchema,
	getCommerceSchema: GetCommerceSchemaInputSchema,
	getContactActivity: GetContactActivityInputSchema,
	getContactDetails: GetContactDetailsInputSchema,
	getContactFields: GetContactFieldsInputSchema,
	getContactGroups: GetContactGroupsInputSchema,
	getContactList: GetContactListInputSchema,
	getContactsErrors: GetContactsErrorsInputSchema,
	getContactsMailinglists: GetContactsMailinglistsInputSchema,
	getContactsMerges: GetContactsMergesInputSchema,
	getContactSmsStatistics: GetContactSmsStatisticsInputSchema,
	getContactsStatisticsCampaign: GetContactsStatisticsCampaignInputSchema,
	getContactsSubscriptionAllContacts: GetContactsSubscriptionAllContactsInputSchema,
	getContactsSubscriptionCustomersStatus: GetContactsSubscriptionCustomersStatusInputSchema,
	getContactsSubscriptionSubscribers: GetContactsSubscriptionSubscribersInputSchema,
	getContactsSubscriptionUnsubscribers: GetContactsSubscriptionUnsubscribersInputSchema,
	getContactsUnsubscribersSms: GetContactsUnsubscribersSmsInputSchema,
	getContactsWithSmsState: GetContactsWithSmsStateInputSchema,
	getContentCategories: GetContentCategoriesInputSchema,
	getCustomerStatsForTransactionalMessage: GetCustomerStatsForTransactionalMessageInputSchema,
	getExecutiveReport: GetExecutiveReportInputSchema,
	getExternalSchema: GetExternalSchemaInputSchema,
	getGroup: GetGroupInputSchema,
	getGroupContentsById: GetGroupContentsByIdInputSchema,
	getGroupsEvents: GetGroupsEventsInputSchema,
	getLandingPages: GetLandingPagesInputSchema,
	getMailingList: GetMailingListInputSchema,
	getMailingListMembers: GetMailingListMembersInputSchema,
	getMailingLists: GetMailingListsInputSchema,
	getOrder: GetOrderInputSchema,
	getPushCampaignOpens: GetPushCampaignOpensInputSchema,
	getPushCampaignReportDelivered: GetPushCampaignReportDeliveredInputSchema,
	getPushCampaignReportFailed: GetPushCampaignReportFailedInputSchema,
	getPushCampaignReports: GetPushCampaignReportsInputSchema,
	getPushCampaignReportSent: GetPushCampaignReportSentInputSchema,
	getPushCampaignReportSummary: GetPushCampaignReportSummaryInputSchema,
	getPushCampaigns: GetPushCampaignsInputSchema,
	getSegmentationRuleFieldTypes: GetSegmentationRuleFieldTypesInputSchema,
	getSegmentationRuleOperations: GetSegmentationRuleOperationsInputSchema,
	getSegmentationRuleTypes: GetSegmentationRuleTypesInputSchema,
	getSegmentationRuleTypesMapping: GetSegmentationRuleTypesMappingInputSchema,
	getSegmentations: GetSegmentationsInputSchema,
	getSendingProfiles: GetSendingProfilesInputSchema,
	getSignupForms: GetSignupFormsInputSchema,
	getSmartCodeSites: GetSmartCodeSitesInputSchema,
	getSmsCampaign: GetSmsCampaignInputSchema,
	getSmsCampaignClickers: GetSmsCampaignClickersInputSchema,
	getSmsCampaignDelivered: GetSmsCampaignDeliveredInputSchema,
	getSmsCampaignEstimate: GetSmsCampaignEstimateInputSchema,
	getSmsCampaignReport: GetSmsCampaignReportInputSchema,
	getSmsCampaignReportClicks: GetSmsCampaignReportClicksInputSchema,
	getSmsCampaignReportFailed: GetSmsCampaignReportFailedInputSchema,
	getSmsCampaignReports: GetSmsCampaignReportsInputSchema,
	getSmsCampaignReportSent: GetSmsCampaignReportSentInputSchema,
	getSmsCampaignReportSummary: GetSmsCampaignReportSummaryInputSchema,
	getSmsCampaignReportUnsubscribed: GetSmsCampaignReportUnsubscribedInputSchema,
	getSmsSendingProfiles: GetSmsSendingProfilesInputSchema,
	getTemplate: GetTemplateInputSchema,
	getTemplateContent: GetTemplateContentInputSchema,
	getTemplates: GetTemplatesInputSchema,
	getTemplatesTemplateCategory: GetTemplatesTemplateCategoryInputSchema,
	getTransactionalMessagesClassification: GetTransactionalMessagesClassificationInputSchema,
	getTransactionalSmsMessage: GetTransactionalSmsMessageInputSchema,
	getTwoWaySmsReplies: GetTwoWaySmsRepliesInputSchema,
	getUpdateActions: GetUpdateActionsInputSchema,
	getUserSocialAccountsGet: GetUserSocialAccountsGetInputSchema,
	getWebhook: GetWebhookInputSchema,
	getWebhooks: GetWebhooksInputSchema,
	getWebhooksParameters: GetWebhooksParametersInputSchema,
	importNewContacts: ImportNewContactsInputSchema,
	listSmsCampaigns: ListSmsCampaignsInputSchema,
	listTransactionalSmsMessages: ListTransactionalSmsMessagesInputSchema,
	postTemplatesCampaign: PostTemplatesCampaignInputSchema,
	postTemplatesTemplateCategory: PostTemplatesTemplateCategoryInputSchema,
	postWebhooksParameters: PostWebhooksParametersInputSchema,
	postWebhooksTest2: PostWebhooksTest2InputSchema,
	putAccountContentCategories: PutAccountContentCategoriesInputSchema,
	putCampaignsSegment: PutCampaignsSegmentInputSchema,
	removeAContactFromAMailingList: RemoveAContactFromAMailingListInputSchema,
	removeExternalContactFromGroup: RemoveExternalContactFromGroupInputSchema,
	sendOperationalMessage: SendOperationalMessageInputSchema,
	sendOperationalMessageEmail: SendOperationalMessageEmailInputSchema,
	testWebhook: TestWebhookInputSchema,
	updateCampaign: UpdateCampaignInputSchema,
	updateCampaignDesign: UpdateCampaignDesignInputSchema,
	updateCampaignScheduling: UpdateCampaignSchedulingInputSchema,
	updateCampaignSDetails: UpdateCampaignSDetailsInputSchema,
	updateCampaignTemplate: UpdateCampaignTemplateInputSchema,
	updateContact: UpdateContactInputSchema,
	updateGroup: UpdateGroupInputSchema,
	updateOrder: UpdateOrderInputSchema,
	updateSegmentation: UpdateSegmentationInputSchema,
	updateSmartCodeSite: UpdateSmartCodeSiteInputSchema,
	updateSmsOperationalMessage: UpdateSmsOperationalMessageInputSchema,
	updateTemplate: UpdateTemplateInputSchema,
	updateTemplateCategory: UpdateTemplateCategoryInputSchema,
	updateTemplateContent: UpdateTemplateContentInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	updateWebhookParameter: UpdateWebhookParameterInputSchema,
} as const;

export type ActiveTrailEndpointInputs = {
	[K in keyof typeof ActiveTrailEndpointInputSchemas]: z.infer<(typeof ActiveTrailEndpointInputSchemas)[K]>;
};

export const ActiveTrailEndpointOutputSchemas = {
	addGroupMember: AddGroupMemberResponseSchema,
	addMailinglistMember: AddMailinglistMemberResponseSchema,
	contactGrowth: ContactGrowthResponseSchema,
	createANewGroup: CreateANewGroupResponseSchema,
	createCampaign: CreateCampaignResponseSchema,
	createCampaignForContacts: CreateCampaignForContactsResponseSchema,
	createContact: CreateContactResponseSchema,
	createContentCategory: CreateContentCategoryResponseSchema,
	createNewMailingList: CreateNewMailingListResponseSchema,
	createOrder: CreateOrderResponseSchema,
	createSegmentation: CreateSegmentationResponseSchema,
	createSmartCodeSite: CreateSmartCodeSiteResponseSchema,
	createSmsCampaign: CreateSmsCampaignResponseSchema,
	createSmsOperationalMessage: CreateSmsOperationalMessageResponseSchema,
	createWebhook: CreateWebhookResponseSchema,
	deleteAccountContentCategories: DeleteAccountContentCategoriesResponseSchema,
	deleteAMemberInAGroup: DeleteAMemberInAGroupResponseSchema,
	deleteAutomations: DeleteAutomationsResponseSchema,
	deleteCampaign: DeleteCampaignResponseSchema,
	deleteContact: DeleteContactResponseSchema,
	deleteGroupById: DeleteGroupByIdResponseSchema,
	deleteMailingList: DeleteMailingListResponseSchema,
	deleteSmartCodeSite: DeleteSmartCodeSiteResponseSchema,
	deleteTemplate: DeleteTemplateResponseSchema,
	deleteTemplatesTemplateCategory: DeleteTemplatesTemplateCategoryResponseSchema,
	deleteWebhook: DeleteWebhookResponseSchema,
	deleteWebhooksParameters: DeleteWebhooksParametersResponseSchema,
	getAccountBalance: GetAccountBalanceResponseSchema,
	getAccountContentCategories2: GetAccountContentCategories2ResponseSchema,
	getAccountIntegrationdata: GetAccountIntegrationdataResponseSchema,
	getAccountMerge: GetAccountMergeResponseSchema,
	getAllCampaignReports: GetAllCampaignReportsResponseSchema,
	getAllGroups: GetAllGroupsResponseSchema,
	getAllSentCampaigns: GetAllSentCampaignsResponseSchema,
	getAutomationLog: GetAutomationLogResponseSchema,
	getAutomationReportsLogAutomationQueue: GetAutomationReportsLogAutomationQueueResponseSchema,
	getAutomationReportsSmsCampaignSummary: GetAutomationReportsSmsCampaignSummaryResponseSchema,
	getAutomationReportsSummaryReport: GetAutomationReportsSummaryReportResponseSchema,
	getAutomations: GetAutomationsResponseSchema,
	getAutomationsDetails: GetAutomationsDetailsResponseSchema,
	getAutomationsEmailCampaignSteps: GetAutomationsEmailCampaignStepsResponseSchema,
	getAutomationsSmsCampaignSteps: GetAutomationsSmsCampaignStepsResponseSchema,
	getAutomationTriggerTypes: GetAutomationTriggerTypesResponseSchema,
	getCampaignBounces: GetCampaignBouncesResponseSchema,
	getCampaignClicks: GetCampaignClicksResponseSchema,
	getCampaignDesign: GetCampaignDesignResponseSchema,
	getCampaignDomainsReport: GetCampaignDomainsReportResponseSchema,
	getCampaignOpens: GetCampaignOpensResponseSchema,
	getCampaignReport: GetCampaignReportResponseSchema,
	getCampaignReportsBounced: GetCampaignReportsBouncedResponseSchema,
	getCampaignReportsComplaints: GetCampaignReportsComplaintsResponseSchema,
	getCampaignReportsEmailActivity: GetCampaignReportsEmailActivityResponseSchema,
	getCampaignReportsSent: GetCampaignReportsSentResponseSchema,
	getCampaignReportsUnopened: GetCampaignReportsUnopenedResponseSchema,
	getCampaignScheduling: GetCampaignSchedulingResponseSchema,
	getCampaignSDetails: GetCampaignSDetailsResponseSchema,
	getCampaignsDetails: GetCampaignsDetailsResponseSchema,
	getCampaignsSegment: GetCampaignsSegmentResponseSchema,
	getCampaignsSentCampaigns: GetCampaignsSentCampaignsResponseSchema,
	getCampaignTemplate: GetCampaignTemplateResponseSchema,
	getCampaignUnsubscribed: GetCampaignUnsubscribedResponseSchema,
	getCommerceSchema: GetCommerceSchemaResponseSchema,
	getContactActivity: GetContactActivityResponseSchema,
	getContactDetails: GetContactDetailsResponseSchema,
	getContactFields: GetContactFieldsResponseSchema,
	getContactGroups: GetContactGroupsResponseSchema,
	getContactList: GetContactListResponseSchema,
	getContactsErrors: GetContactsErrorsResponseSchema,
	getContactsMailinglists: GetContactsMailinglistsResponseSchema,
	getContactsMerges: GetContactsMergesResponseSchema,
	getContactSmsStatistics: GetContactSmsStatisticsResponseSchema,
	getContactsStatisticsCampaign: GetContactsStatisticsCampaignResponseSchema,
	getContactsSubscriptionAllContacts: GetContactsSubscriptionAllContactsResponseSchema,
	getContactsSubscriptionCustomersStatus: GetContactsSubscriptionCustomersStatusResponseSchema,
	getContactsSubscriptionSubscribers: GetContactsSubscriptionSubscribersResponseSchema,
	getContactsSubscriptionUnsubscribers: GetContactsSubscriptionUnsubscribersResponseSchema,
	getContactsUnsubscribersSms: GetContactsUnsubscribersSmsResponseSchema,
	getContactsWithSmsState: GetContactsWithSmsStateResponseSchema,
	getContentCategories: GetContentCategoriesResponseSchema,
	getCustomerStatsForTransactionalMessage: GetCustomerStatsForTransactionalMessageResponseSchema,
	getExecutiveReport: GetExecutiveReportResponseSchema,
	getExternalSchema: GetExternalSchemaResponseSchema,
	getGroup: GetGroupResponseSchema,
	getGroupContentsById: GetGroupContentsByIdResponseSchema,
	getGroupsEvents: GetGroupsEventsResponseSchema,
	getLandingPages: GetLandingPagesResponseSchema,
	getMailingList: GetMailingListResponseSchema,
	getMailingListMembers: GetMailingListMembersResponseSchema,
	getMailingLists: GetMailingListsResponseSchema,
	getOrder: GetOrderResponseSchema,
	getPushCampaignOpens: GetPushCampaignOpensResponseSchema,
	getPushCampaignReportDelivered: GetPushCampaignReportDeliveredResponseSchema,
	getPushCampaignReportFailed: GetPushCampaignReportFailedResponseSchema,
	getPushCampaignReports: GetPushCampaignReportsResponseSchema,
	getPushCampaignReportSent: GetPushCampaignReportSentResponseSchema,
	getPushCampaignReportSummary: GetPushCampaignReportSummaryResponseSchema,
	getPushCampaigns: GetPushCampaignsResponseSchema,
	getSegmentationRuleFieldTypes: GetSegmentationRuleFieldTypesResponseSchema,
	getSegmentationRuleOperations: GetSegmentationRuleOperationsResponseSchema,
	getSegmentationRuleTypes: GetSegmentationRuleTypesResponseSchema,
	getSegmentationRuleTypesMapping: GetSegmentationRuleTypesMappingResponseSchema,
	getSegmentations: GetSegmentationsResponseSchema,
	getSendingProfiles: GetSendingProfilesResponseSchema,
	getSignupForms: GetSignupFormsResponseSchema,
	getSmartCodeSites: GetSmartCodeSitesResponseSchema,
	getSmsCampaign: GetSmsCampaignResponseSchema,
	getSmsCampaignClickers: GetSmsCampaignClickersResponseSchema,
	getSmsCampaignDelivered: GetSmsCampaignDeliveredResponseSchema,
	getSmsCampaignEstimate: GetSmsCampaignEstimateResponseSchema,
	getSmsCampaignReport: GetSmsCampaignReportResponseSchema,
	getSmsCampaignReportClicks: GetSmsCampaignReportClicksResponseSchema,
	getSmsCampaignReportFailed: GetSmsCampaignReportFailedResponseSchema,
	getSmsCampaignReports: GetSmsCampaignReportsResponseSchema,
	getSmsCampaignReportSent: GetSmsCampaignReportSentResponseSchema,
	getSmsCampaignReportSummary: GetSmsCampaignReportSummaryResponseSchema,
	getSmsCampaignReportUnsubscribed: GetSmsCampaignReportUnsubscribedResponseSchema,
	getSmsSendingProfiles: GetSmsSendingProfilesResponseSchema,
	getTemplate: GetTemplateResponseSchema,
	getTemplateContent: GetTemplateContentResponseSchema,
	getTemplates: GetTemplatesResponseSchema,
	getTemplatesTemplateCategory: GetTemplatesTemplateCategoryResponseSchema,
	getTransactionalMessagesClassification: GetTransactionalMessagesClassificationResponseSchema,
	getTransactionalSmsMessage: GetTransactionalSmsMessageResponseSchema,
	getTwoWaySmsReplies: GetTwoWaySmsRepliesResponseSchema,
	getUpdateActions: GetUpdateActionsResponseSchema,
	getUserSocialAccountsGet: GetUserSocialAccountsGetResponseSchema,
	getWebhook: GetWebhookResponseSchema,
	getWebhooks: GetWebhooksResponseSchema,
	getWebhooksParameters: GetWebhooksParametersResponseSchema,
	importNewContacts: ImportNewContactsResponseSchema,
	listSmsCampaigns: ListSmsCampaignsResponseSchema,
	listTransactionalSmsMessages: ListTransactionalSmsMessagesResponseSchema,
	postTemplatesCampaign: PostTemplatesCampaignResponseSchema,
	postTemplatesTemplateCategory: PostTemplatesTemplateCategoryResponseSchema,
	postWebhooksParameters: PostWebhooksParametersResponseSchema,
	postWebhooksTest2: PostWebhooksTest2ResponseSchema,
	putAccountContentCategories: PutAccountContentCategoriesResponseSchema,
	putCampaignsSegment: PutCampaignsSegmentResponseSchema,
	removeAContactFromAMailingList: RemoveAContactFromAMailingListResponseSchema,
	removeExternalContactFromGroup: RemoveExternalContactFromGroupResponseSchema,
	sendOperationalMessage: SendOperationalMessageResponseSchema,
	sendOperationalMessageEmail: SendOperationalMessageEmailResponseSchema,
	testWebhook: TestWebhookResponseSchema,
	updateCampaign: UpdateCampaignResponseSchema,
	updateCampaignDesign: UpdateCampaignDesignResponseSchema,
	updateCampaignScheduling: UpdateCampaignSchedulingResponseSchema,
	updateCampaignSDetails: UpdateCampaignSDetailsResponseSchema,
	updateCampaignTemplate: UpdateCampaignTemplateResponseSchema,
	updateContact: UpdateContactResponseSchema,
	updateGroup: UpdateGroupResponseSchema,
	updateOrder: UpdateOrderResponseSchema,
	updateSegmentation: UpdateSegmentationResponseSchema,
	updateSmartCodeSite: UpdateSmartCodeSiteResponseSchema,
	updateSmsOperationalMessage: UpdateSmsOperationalMessageResponseSchema,
	updateTemplate: UpdateTemplateResponseSchema,
	updateTemplateCategory: UpdateTemplateCategoryResponseSchema,
	updateTemplateContent: UpdateTemplateContentResponseSchema,
	updateWebhook: UpdateWebhookResponseSchema,
	updateWebhookParameter: UpdateWebhookParameterResponseSchema,
} as const;

export type ActiveTrailEndpointOutputs = {
	[K in keyof typeof ActiveTrailEndpointOutputSchemas]: z.infer<(typeof ActiveTrailEndpointOutputSchemas)[K]>;
};

export type ActiveTrailEndpointInput = ActiveTrailEndpointInputs[keyof ActiveTrailEndpointInputs] & {
	[key: string]: unknown;
};
