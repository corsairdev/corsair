import { z } from 'zod';

// Accounts
export const CreateAccountInputSchema = z.object({
	Name: z.string(),
	Type: z.string().optional(),
	Industry: z.string().optional(),
	Phone: z.string().optional(),
	Website: z.string().optional(),
	BillingStreet: z.string().optional(),
	BillingCity: z.string().optional(),
	BillingState: z.string().optional(),
	BillingPostalCode: z.string().optional(),
	BillingCountry: z.string().optional(),
	CustomFields: z.record(z.string(), z.unknown()).optional(),
});
export type CreateAccountInput = z.infer<typeof CreateAccountInputSchema>;

export const CreateAccountResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
		errors: z.array(z.unknown()).optional(),
	})
	.passthrough();
export type CreateAccountResponse = z.infer<typeof CreateAccountResponseSchema>;

export const GetAccountInputSchema = z.object({
	id: z.string(),
	fields: z.array(z.string()).optional(),
});
export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;

export const GetAccountResponseSchema = z
	.object({
		Id: z.string(),
		Name: z.string().optional(),
	})
	.passthrough();
export type GetAccountResponse = z.infer<typeof GetAccountResponseSchema>;

export const ListAccountsInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	fields: z.array(z.string()).optional(),
});
export type ListAccountsInput = z.infer<typeof ListAccountsInputSchema>;

export const ListAccountsResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
		nextRecordsUrl: z.string().optional(),
	})
	.passthrough();
export type ListAccountsResponse = z.infer<typeof ListAccountsResponseSchema>;

export const SearchAccountsInputSchema = z.object({
	name: z.string().optional(),
	industry: z.string().optional(),
	type: z.string().optional(),
	phone: z.string().optional(),
	limit: z.number().optional(),
});
export type SearchAccountsInput = z.infer<typeof SearchAccountsInputSchema>;

export const SearchAccountsResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type SearchAccountsResponse = z.infer<
	typeof SearchAccountsResponseSchema
>;

export const DeleteAccountInputSchema = z.object({
	id: z.string(),
});
export type DeleteAccountInput = z.infer<typeof DeleteAccountInputSchema>;

export const DeleteAccountResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;

export const AccountCreationWithContentTypeOptionInputSchema = z
	.object({
		Name: z.string(),
	})
	.passthrough();
export type AccountCreationWithContentTypeOptionInput = z.infer<
	typeof AccountCreationWithContentTypeOptionInputSchema
>;

export const AccountCreationWithContentTypeOptionResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type AccountCreationWithContentTypeOptionResponse = z.infer<
	typeof AccountCreationWithContentTypeOptionResponseSchema
>;

export const FetchAccountByIdWithQueryInputSchema = z.object({
	id: z.string(),
	fields: z.string().optional(),
});
export type FetchAccountByIdWithQueryInput = z.infer<
	typeof FetchAccountByIdWithQueryInputSchema
>;

export const FetchAccountByIdWithQueryResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type FetchAccountByIdWithQueryResponse = z.infer<
	typeof FetchAccountByIdWithQueryResponseSchema
>;

export const RemoveAccountByUniqueIdentifierInputSchema = z.object({
	id: z.string(),
});
export type RemoveAccountByUniqueIdentifierInput = z.infer<
	typeof RemoveAccountByUniqueIdentifierInputSchema
>;

export const RemoveAccountByUniqueIdentifierResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type RemoveAccountByUniqueIdentifierResponse = z.infer<
	typeof RemoveAccountByUniqueIdentifierResponseSchema
>;

export const RetrieveAccountDataAndErrorResponsesInputSchema = z.object({
	id: z.string().optional(),
});
export type RetrieveAccountDataAndErrorResponsesInput = z.infer<
	typeof RetrieveAccountDataAndErrorResponsesInputSchema
>;

export const RetrieveAccountDataAndErrorResponsesResponseSchema = z
	.object({
		objectDescribe: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type RetrieveAccountDataAndErrorResponsesResponse = z.infer<
	typeof RetrieveAccountDataAndErrorResponsesResponseSchema
>;

// Contacts
export const CreateContactInputSchema = z.object({
	LastName: z.string(),
	FirstName: z.string().optional(),
	Email: z.string().optional(),
	Phone: z.string().optional(),
	AccountId: z.string().optional(),
	Title: z.string().optional(),
	CustomFields: z.record(z.string(), z.unknown()).optional(),
});
export type CreateContactInput = z.infer<typeof CreateContactInputSchema>;

export const CreateContactResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;

export const GetContactInputSchema = z.object({
	id: z.string(),
	fields: z.array(z.string()).optional(),
});
export type GetContactInput = z.infer<typeof GetContactInputSchema>;

export const GetContactResponseSchema = z
	.object({
		Id: z.string(),
		LastName: z.string().optional(),
	})
	.passthrough();
export type GetContactResponse = z.infer<typeof GetContactResponseSchema>;

export const ListContactsInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	accountId: z.string().optional(),
});
export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;

export const ListContactsResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
		nextRecordsUrl: z.string().optional(),
	})
	.passthrough();
export type ListContactsResponse = z.infer<typeof ListContactsResponseSchema>;

export const DeleteContactInputSchema = z.object({
	id: z.string(),
});
export type DeleteContactInput = z.infer<typeof DeleteContactInputSchema>;

export const DeleteContactResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteContactResponse = z.infer<typeof DeleteContactResponseSchema>;

export const AssociateContactToAccountInputSchema = z.object({
	contactId: z.string(),
	accountId: z.string(),
});
export type AssociateContactToAccountInput = z.infer<
	typeof AssociateContactToAccountInputSchema
>;

export const AssociateContactToAccountResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type AssociateContactToAccountResponse = z.infer<
	typeof AssociateContactToAccountResponseSchema
>;

export const CreateNewContactWithJsonHeaderInputSchema = z
	.object({
		LastName: z.string(),
		AccountId: z.string().optional(),
	})
	.passthrough();
export type CreateNewContactWithJsonHeaderInput = z.infer<
	typeof CreateNewContactWithJsonHeaderInputSchema
>;

export const CreateNewContactWithJsonHeaderResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type CreateNewContactWithJsonHeaderResponse = z.infer<
	typeof CreateNewContactWithJsonHeaderResponseSchema
>;

export const QueryContactsByNameInputSchema = z.object({
	name: z.string(),
});
export type QueryContactsByNameInput = z.infer<
	typeof QueryContactsByNameInputSchema
>;

export const QueryContactsByNameResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type QueryContactsByNameResponse = z.infer<
	typeof QueryContactsByNameResponseSchema
>;

export const RemoveASpecificContactByIdInputSchema = z.object({
	id: z.string(),
});
export type RemoveASpecificContactByIdInput = z.infer<
	typeof RemoveASpecificContactByIdInputSchema
>;

export const RemoveASpecificContactByIdResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type RemoveASpecificContactByIdResponse = z.infer<
	typeof RemoveASpecificContactByIdResponseSchema
>;

export const RetrieveContactInfoWithStandardResponsesInputSchema = z.object({
	id: z.string().optional(),
});
export type RetrieveContactInfoWithStandardResponsesInput = z.infer<
	typeof RetrieveContactInfoWithStandardResponsesInputSchema
>;

export const RetrieveContactInfoWithStandardResponsesResponseSchema = z
	.object({
		metadata: z.record(z.string(), z.unknown()),
	})
	.passthrough();
export type RetrieveContactInfoWithStandardResponsesResponse = z.infer<
	typeof RetrieveContactInfoWithStandardResponsesResponseSchema
>;

export const GetContactByIdInputSchema = z.object({
	id: z.string(),
});
export type GetContactByIdInput = z.infer<typeof GetContactByIdInputSchema>;

export const GetContactByIdResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type GetContactByIdResponse = z.infer<
	typeof GetContactByIdResponseSchema
>;

// Leads
export const CreateLeadInputSchema = z.object({
	LastName: z.string(),
	Company: z.string(),
	FirstName: z.string().optional(),
	Email: z.string().optional(),
	Phone: z.string().optional(),
	Status: z.string().optional(),
	Title: z.string().optional(),
	CustomFields: z.record(z.string(), z.unknown()).optional(),
});
export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;

export const CreateLeadResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateLeadResponse = z.infer<typeof CreateLeadResponseSchema>;

export const GetLeadInputSchema = z.object({
	id: z.string(),
});
export type GetLeadInput = z.infer<typeof GetLeadInputSchema>;

export const GetLeadResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type GetLeadResponse = z.infer<typeof GetLeadResponseSchema>;

export const ListLeadsInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});
export type ListLeadsInput = z.infer<typeof ListLeadsInputSchema>;

export const ListLeadsResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
		nextRecordsUrl: z.string().optional(),
	})
	.passthrough();
export type ListLeadsResponse = z.infer<typeof ListLeadsResponseSchema>;

export const DeleteLeadInputSchema = z.object({
	id: z.string(),
});
export type DeleteLeadInput = z.infer<typeof DeleteLeadInputSchema>;

export const DeleteLeadResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteLeadResponse = z.infer<typeof DeleteLeadResponseSchema>;

export const ApplyLeadAssignmentRulesInputSchema = z.object({
	leadId: z.string(),
	assignmentRuleId: z.string().optional(),
});
export type ApplyLeadAssignmentRulesInput = z.infer<
	typeof ApplyLeadAssignmentRulesInputSchema
>;

export const ApplyLeadAssignmentRulesResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type ApplyLeadAssignmentRulesResponse = z.infer<
	typeof ApplyLeadAssignmentRulesResponseSchema
>;

export const CreateLeadWithSpecifiedContentTypeInputSchema = z
	.object({
		LastName: z.string(),
		Company: z.string(),
	})
	.passthrough();
export type CreateLeadWithSpecifiedContentTypeInput = z.infer<
	typeof CreateLeadWithSpecifiedContentTypeInputSchema
>;

export const CreateLeadWithSpecifiedContentTypeResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type CreateLeadWithSpecifiedContentTypeResponse = z.infer<
	typeof CreateLeadWithSpecifiedContentTypeResponseSchema
>;

export const DeleteALeadObjectByItsIdInputSchema = z.object({
	id: z.string(),
});
export type DeleteALeadObjectByItsIdInput = z.infer<
	typeof DeleteALeadObjectByItsIdInputSchema
>;

export const DeleteALeadObjectByItsIdResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteALeadObjectByItsIdResponse = z.infer<
	typeof DeleteALeadObjectByItsIdResponseSchema
>;

export const RetrieveLeadByIdInputSchema = z.object({
	id: z.string(),
});
export type RetrieveLeadByIdInput = z.infer<typeof RetrieveLeadByIdInputSchema>;

export const RetrieveLeadByIdResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type RetrieveLeadByIdResponse = z.infer<
	typeof RetrieveLeadByIdResponseSchema
>;

export const RetrieveLeadDataWithVariousResponsesInputSchema = z.object({
	id: z.string().optional(),
});
export type RetrieveLeadDataWithVariousResponsesInput = z.infer<
	typeof RetrieveLeadDataWithVariousResponsesInputSchema
>;

export const RetrieveLeadDataWithVariousResponsesResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type RetrieveLeadDataWithVariousResponsesResponse = z.infer<
	typeof RetrieveLeadDataWithVariousResponsesResponseSchema
>;

// Opportunities
export const CreateOpportunityInputSchema = z.object({
	Name: z.string(),
	StageName: z.string(),
	CloseDate: z.string(),
	AccountId: z.string().optional(),
	Amount: z.number().optional(),
	Probability: z.number().optional(),
	CustomFields: z.record(z.string(), z.unknown()).optional(),
});
export type CreateOpportunityInput = z.infer<
	typeof CreateOpportunityInputSchema
>;

export const CreateOpportunityResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateOpportunityResponse = z.infer<
	typeof CreateOpportunityResponseSchema
>;

export const GetOpportunityInputSchema = z.object({
	id: z.string(),
});
export type GetOpportunityInput = z.infer<typeof GetOpportunityInputSchema>;

export const GetOpportunityResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type GetOpportunityResponse = z.infer<
	typeof GetOpportunityResponseSchema
>;

export const ListOpportunitiesInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});
export type ListOpportunitiesInput = z.infer<
	typeof ListOpportunitiesInputSchema
>;

export const ListOpportunitiesResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
		nextRecordsUrl: z.string().optional(),
	})
	.passthrough();
export type ListOpportunitiesResponse = z.infer<
	typeof ListOpportunitiesResponseSchema
>;

export const DeleteOpportunityInputSchema = z.object({
	id: z.string(),
});
export type DeleteOpportunityInput = z.infer<
	typeof DeleteOpportunityInputSchema
>;

export const DeleteOpportunityResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteOpportunityResponse = z.infer<
	typeof DeleteOpportunityResponseSchema
>;

export const AddOpportunityLineItemInputSchema = z.object({
	OpportunityId: z.string(),
	PricebookEntryId: z.string(),
	Quantity: z.number(),
	UnitPrice: z.number().optional(),
	TotalPrice: z.number().optional(),
});
export type AddOpportunityLineItemInput = z.infer<
	typeof AddOpportunityLineItemInputSchema
>;

export const AddOpportunityLineItemResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type AddOpportunityLineItemResponse = z.infer<
	typeof AddOpportunityLineItemResponseSchema
>;

export const CloneOpportunityWithProductsInputSchema = z.object({
	opportunityId: z.string(),
	name: z.string().optional(),
	cloneProducts: z.boolean().optional(),
});
export type CloneOpportunityWithProductsInput = z.infer<
	typeof CloneOpportunityWithProductsInputSchema
>;

export const CloneOpportunityWithProductsResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type CloneOpportunityWithProductsResponse = z.infer<
	typeof CloneOpportunityWithProductsResponseSchema
>;

export const ListPricebookEntriesInputSchema = z.object({
	pricebookId: z.string().optional(),
	query: z.string().optional(),
	limit: z.number().optional(),
});
export type ListPricebookEntriesInput = z.infer<
	typeof ListPricebookEntriesInputSchema
>;

export const ListPricebookEntriesResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListPricebookEntriesResponse = z.infer<
	typeof ListPricebookEntriesResponseSchema
>;

export const ListPricebooksInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
});
export type ListPricebooksInput = z.infer<typeof ListPricebooksInputSchema>;

export const ListPricebooksResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListPricebooksResponse = z.infer<
	typeof ListPricebooksResponseSchema
>;

export const CreateOpportunityRecordInputSchema = z
	.object({
		Name: z.string(),
		StageName: z.string(),
		CloseDate: z.string(),
	})
	.passthrough();
export type CreateOpportunityRecordInput = z.infer<
	typeof CreateOpportunityRecordInputSchema
>;

export const CreateOpportunityRecordResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type CreateOpportunityRecordResponse = z.infer<
	typeof CreateOpportunityRecordResponseSchema
>;

export const RemoveOpportunityByIdInputSchema = z.object({
	id: z.string(),
});
export type RemoveOpportunityByIdInput = z.infer<
	typeof RemoveOpportunityByIdInputSchema
>;

export const RemoveOpportunityByIdResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type RemoveOpportunityByIdResponse = z.infer<
	typeof RemoveOpportunityByIdResponseSchema
>;

export const RetrieveOpportunitiesDataInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().int().positive().optional(),
});
export type RetrieveOpportunitiesDataInput = z.infer<
	typeof RetrieveOpportunitiesDataInputSchema
>;

export const RetrieveOpportunitiesDataResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type RetrieveOpportunitiesDataResponse = z.infer<
	typeof RetrieveOpportunitiesDataResponseSchema
>;

export const RetrieveOpportunityByIdWithOptionalFieldsInputSchema = z.object({
	id: z.string(),
	fields: z.array(z.string()).optional(),
});
export type RetrieveOpportunityByIdWithOptionalFieldsInput = z.infer<
	typeof RetrieveOpportunityByIdWithOptionalFieldsInputSchema
>;

export const RetrieveOpportunityByIdWithOptionalFieldsResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type RetrieveOpportunityByIdWithOptionalFieldsResponse = z.infer<
	typeof RetrieveOpportunityByIdWithOptionalFieldsResponseSchema
>;

// Campaigns
export const CreateCampaignInputSchema = z.object({
	Name: z.string(),
	Type: z.string().optional(),
	Status: z.string().optional(),
	StartDate: z.string().optional(),
	EndDate: z.string().optional(),
	IsActive: z.boolean().optional(),
	ParentId: z.string().optional(),
});
export type CreateCampaignInput = z.infer<typeof CreateCampaignInputSchema>;

export const CreateCampaignResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateCampaignResponse = z.infer<
	typeof CreateCampaignResponseSchema
>;

export const GetCampaignInputSchema = z.object({
	id: z.string(),
});
export type GetCampaignInput = z.infer<typeof GetCampaignInputSchema>;

export const GetCampaignResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type GetCampaignResponse = z.infer<typeof GetCampaignResponseSchema>;

export const ListCampaignsInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
});
export type ListCampaignsInput = z.infer<typeof ListCampaignsInputSchema>;

export const ListCampaignsResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListCampaignsResponse = z.infer<typeof ListCampaignsResponseSchema>;

export const DeleteCampaignInputSchema = z.object({
	id: z.string(),
});
export type DeleteCampaignInput = z.infer<typeof DeleteCampaignInputSchema>;

export const DeleteCampaignResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteCampaignResponse = z.infer<
	typeof DeleteCampaignResponseSchema
>;

export const AddContactToCampaignInputSchema = z.object({
	campaignId: z.string(),
	contactId: z.string(),
	status: z.string().optional(),
});
export type AddContactToCampaignInput = z.infer<
	typeof AddContactToCampaignInputSchema
>;

export const AddContactToCampaignResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type AddContactToCampaignResponse = z.infer<
	typeof AddContactToCampaignResponseSchema
>;

export const AddLeadToCampaignInputSchema = z.object({
	campaign_id: z.string(),
	lead_id: z.string(),
	status: z.string().optional(),
});
export type AddLeadToCampaignInput = z.infer<
	typeof AddLeadToCampaignInputSchema
>;

export const AddLeadToCampaignResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type AddLeadToCampaignResponse = z.infer<
	typeof AddLeadToCampaignResponseSchema
>;

export const RemoveFromCampaignInputSchema = z.object({
	member_id: z.string().optional(),
	campaign_member_id: z.string().optional(),
	campaign_id: z.string().optional(),
});
export type RemoveFromCampaignInput = z.infer<
	typeof RemoveFromCampaignInputSchema
>;

export const RemoveFromCampaignResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type RemoveFromCampaignResponse = z.infer<
	typeof RemoveFromCampaignResponseSchema
>;

export const SearchCampaignsInputSchema = z.object({
	name: z.string().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
	limit: z.number().int().positive().optional(),
});
export type SearchCampaignsInput = z.infer<typeof SearchCampaignsInputSchema>;

export const SearchCampaignsResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type SearchCampaignsResponse = z.infer<
	typeof SearchCampaignsResponseSchema
>;

export const CreateCampaignRecordViaPostInputSchema = z
	.object({
		Name: z.string(),
		ParentId: z.string().optional(),
		OwnerId: z.string().optional(),
	})
	.passthrough();
export type CreateCampaignRecordViaPostInput = z.infer<
	typeof CreateCampaignRecordViaPostInputSchema
>;

export const CreateCampaignRecordViaPostResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type CreateCampaignRecordViaPostResponse = z.infer<
	typeof CreateCampaignRecordViaPostResponseSchema
>;

export const RemoveCampaignObjectByIdInputSchema = z.object({
	id: z.string(),
});
export type RemoveCampaignObjectByIdInput = z.infer<
	typeof RemoveCampaignObjectByIdInputSchema
>;

export const RemoveCampaignObjectByIdResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type RemoveCampaignObjectByIdResponse = z.infer<
	typeof RemoveCampaignObjectByIdResponseSchema
>;

export const RetrieveCampaignDataWithErrorHandlingInputSchema = z.object({
	id: z.string().optional(),
});
export type RetrieveCampaignDataWithErrorHandlingInput = z.infer<
	typeof RetrieveCampaignDataWithErrorHandlingInputSchema
>;

export const RetrieveCampaignDataWithErrorHandlingResponseSchema = z
	.object({
		metadata: z.record(z.string(), z.unknown()),
	})
	.passthrough();
export type RetrieveCampaignDataWithErrorHandlingResponse = z.infer<
	typeof RetrieveCampaignDataWithErrorHandlingResponseSchema
>;

export const RetrieveSpecificCampaignObjectDetailsInputSchema = z.object({
	id: z.string(),
	fields: z.array(z.string()).optional(),
});
export type RetrieveSpecificCampaignObjectDetailsInput = z.infer<
	typeof RetrieveSpecificCampaignObjectDetailsInputSchema
>;

export const RetrieveSpecificCampaignObjectDetailsResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type RetrieveSpecificCampaignObjectDetailsResponse = z.infer<
	typeof RetrieveSpecificCampaignObjectDetailsResponseSchema
>;

// Notes
export const CreateNoteInputSchema = z.object({
	Title: z.string(),
	Body: z.string().optional(),
	ParentId: z.string().optional(),
	IsPrivate: z.boolean().optional(),
});
export type CreateNoteInput = z.infer<typeof CreateNoteInputSchema>;

export const CreateNoteResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateNoteResponse = z.infer<typeof CreateNoteResponseSchema>;

export const GetNoteInputSchema = z.object({
	id: z.string(),
});
export type GetNoteInput = z.infer<typeof GetNoteInputSchema>;

export const GetNoteResponseSchema = z
	.object({
		Id: z.string(),
		Title: z.string().optional(),
		Body: z.string().optional(),
	})
	.passthrough();
export type GetNoteResponse = z.infer<typeof GetNoteResponseSchema>;

export const ListNotesInputSchema = z.object({
	parentId: z.string().optional(),
	query: z.string().optional(),
	limit: z.number().optional(),
});
export type ListNotesInput = z.infer<typeof ListNotesInputSchema>;

export const ListNotesResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListNotesResponse = z.infer<typeof ListNotesResponseSchema>;

export const DeleteNoteInputSchema = z.object({
	id: z.string(),
});
export type DeleteNoteInput = z.infer<typeof DeleteNoteInputSchema>;

export const DeleteNoteResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteNoteResponse = z.infer<typeof DeleteNoteResponseSchema>;

export const CreateNoteRecordWithContentTypeHeaderInputSchema = z
	.object({
		Title: z.string(),
		ParentId: z.string(),
		Body: z.string().optional(),
	})
	.passthrough();
export type CreateNoteRecordWithContentTypeHeaderInput = z.infer<
	typeof CreateNoteRecordWithContentTypeHeaderInputSchema
>;

export const CreateNoteRecordWithContentTypeHeaderResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type CreateNoteRecordWithContentTypeHeaderResponse = z.infer<
	typeof CreateNoteRecordWithContentTypeHeaderResponseSchema
>;

export const RemoveNoteObjectByIdInputSchema = z.object({
	id: z.string(),
});
export type RemoveNoteObjectByIdInput = z.infer<
	typeof RemoveNoteObjectByIdInputSchema
>;

export const RemoveNoteObjectByIdResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type RemoveNoteObjectByIdResponse = z.infer<
	typeof RemoveNoteObjectByIdResponseSchema
>;

export const GetNoteByIdWithFieldsInputSchema = z.object({
	id: z.string(),
	fields: z.array(z.string()).optional(),
});
export type GetNoteByIdWithFieldsInput = z.infer<
	typeof GetNoteByIdWithFieldsInputSchema
>;

export const GetNoteByIdWithFieldsResponseSchema = z
	.object({
		Id: z.string(),
	})
	.passthrough();
export type GetNoteByIdWithFieldsResponse = z.infer<
	typeof GetNoteByIdWithFieldsResponseSchema
>;

export const RetrieveNoteObjectInformationInputSchema = z.object({
	id: z.string().optional(),
});
export type RetrieveNoteObjectInformationInput = z.infer<
	typeof RetrieveNoteObjectInformationInputSchema
>;

export const RetrieveNoteObjectInformationResponseSchema = z
	.object({
		metadata: z.record(z.string(), z.unknown()),
	})
	.passthrough();
export type RetrieveNoteObjectInformationResponse = z.infer<
	typeof RetrieveNoteObjectInformationResponseSchema
>;

// Tasks
export const CreateTaskInputSchema = z.object({
	Subject: z.string(),
	Status: z.string().optional(),
	Priority: z.string().optional(),
	WhoId: z.string().optional(),
	WhatId: z.string().optional(),
	OwnerId: z.string().optional(),
	ActivityDate: z.string().optional(),
	Description: z.string().optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const CreateTaskResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

export const CompleteTaskInputSchema = z.object({
	taskId: z.string(),
	completionNotes: z.string().optional(),
});
export type CompleteTaskInput = z.infer<typeof CompleteTaskInputSchema>;

export const CompleteTaskResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type CompleteTaskResponse = z.infer<typeof CompleteTaskResponseSchema>;

export const LogCallInputSchema = z.object({
	Subject: z.string(),
	CallDurationInSeconds: z.number().optional(),
	CallType: z.string().optional(),
	CallDisposition: z.string().optional(),
	Description: z.string().optional(),
	WhoId: z.string().optional(),
	WhatId: z.string().optional(),
});
export type LogCallInput = z.infer<typeof LogCallInputSchema>;

export const LogCallResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type LogCallResponse = z.infer<typeof LogCallResponseSchema>;

export const LogEmailActivityInputSchema = z.object({
	Subject: z.string(),
	TextBody: z.string().optional(),
	HtmlBody: z.string().optional(),
	FromAddress: z.string().optional(),
	ToAddress: z.string().optional(),
	RelatedToId: z.string().optional(),
});
export type LogEmailActivityInput = z.infer<typeof LogEmailActivityInputSchema>;

export const LogEmailActivityResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type LogEmailActivityResponse = z.infer<
	typeof LogEmailActivityResponseSchema
>;

// Jobs
export const CloseOrAbortJobInputSchema = z.object({
	jobId: z.string(),
	state: z.enum(['UploadComplete', 'Aborted']),
});
export type CloseOrAbortJobInput = z.infer<typeof CloseOrAbortJobInputSchema>;

export const CloseOrAbortJobResponseSchema = z
	.object({
		id: z.string(),
		state: z.string(),
	})
	.passthrough();
export type CloseOrAbortJobResponse = z.infer<
	typeof CloseOrAbortJobResponseSchema
>;

export const DeleteJobQueryInputSchema = z.object({
	jobId: z.string(),
});
export type DeleteJobQueryInput = z.infer<typeof DeleteJobQueryInputSchema>;

export const DeleteJobQueryResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteJobQueryResponse = z.infer<
	typeof DeleteJobQueryResponseSchema
>;

export const GetJobFailedRecordResultsInputSchema = z.object({
	jobId: z.string(),
});
export type GetJobFailedRecordResultsInput = z.infer<
	typeof GetJobFailedRecordResultsInputSchema
>;

export const GetJobFailedRecordResultsResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetJobFailedRecordResultsResponse = z.infer<
	typeof GetJobFailedRecordResultsResponseSchema
>;

export const GetQueryJobInfoInputSchema = z.object({
	jobId: z.string(),
});
export type GetQueryJobInfoInput = z.infer<typeof GetQueryJobInfoInputSchema>;

export const GetQueryJobInfoResponseSchema = z
	.object({
		id: z.string(),
		state: z.string(),
	})
	.passthrough();
export type GetQueryJobInfoResponse = z.infer<
	typeof GetQueryJobInfoResponseSchema
>;

export const GetQueryJobResultsInputSchema = z.object({
	jobId: z.string(),
	maxRecords: z.number().optional(),
	locator: z.string().optional(),
});
export type GetQueryJobResultsInput = z.infer<
	typeof GetQueryJobResultsInputSchema
>;

export const GetQueryJobResultsResponseSchema = z
	.object({
		data: z.string().or(z.array(z.record(z.string(), z.unknown()))),
	})
	.passthrough();
export type GetQueryJobResultsResponse = z.infer<
	typeof GetQueryJobResultsResponseSchema
>;

export const GetJobSuccessfulRecordResultsInputSchema = z.object({
	jobId: z.string(),
});
export type GetJobSuccessfulRecordResultsInput = z.infer<
	typeof GetJobSuccessfulRecordResultsInputSchema
>;

export const GetJobSuccessfulRecordResultsResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetJobSuccessfulRecordResultsResponse = z.infer<
	typeof GetJobSuccessfulRecordResultsResponseSchema
>;

export const GetJobUnprocessedRecordResultsInputSchema = z.object({
	jobId: z.string(),
});
export type GetJobUnprocessedRecordResultsInput = z.infer<
	typeof GetJobUnprocessedRecordResultsInputSchema
>;

export const GetJobUnprocessedRecordResultsResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetJobUnprocessedRecordResultsResponse = z.infer<
	typeof GetJobUnprocessedRecordResultsResponseSchema
>;

// SOQL / SOSL
export const RunSoqlQueryInputSchema = z.object({
	q: z.string(),
});
export type RunSoqlQueryInput = z.infer<typeof RunSoqlQueryInputSchema>;

export const RunSoqlQueryResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
		nextRecordsUrl: z.string().optional(),
	})
	.passthrough();
export type RunSoqlQueryResponse = z.infer<typeof RunSoqlQueryResponseSchema>;

export const QueryAllInputSchema = z.object({
	q: z.string(),
});
export type QueryAllInput = z.infer<typeof QueryAllInputSchema>;

export const QueryAllResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type QueryAllResponse = z.infer<typeof QueryAllResponseSchema>;

export const SearchInputSchema = z.object({
	q: z.string(),
});
export type SearchInput = z.infer<typeof SearchInputSchema>;

export const SearchResponseSchema = z
	.object({
		searchRecords: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const ExecuteSoslSearchInputSchema = z.object({
	q: z.string(),
});
export type ExecuteSoslSearchInput = z.infer<
	typeof ExecuteSoslSearchInputSchema
>;

export const ExecuteSoslSearchResponseSchema = z
	.object({
		searchRecords: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ExecuteSoslSearchResponse = z.infer<
	typeof ExecuteSoslSearchResponseSchema
>;

export const ToolingQueryInputSchema = z.object({
	q: z.string(),
});
export type ToolingQueryInput = z.infer<typeof ToolingQueryInputSchema>;

export const ToolingQueryResponseSchema = z
	.object({
		totalSize: z.number(),
		done: z.boolean(),
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ToolingQueryResponse = z.infer<typeof ToolingQueryResponseSchema>;

export const ParameterizedSearchInputSchema = z.object({
	q: z.string().optional(),
	sobjects: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type ParameterizedSearchInput = z.infer<
	typeof ParameterizedSearchInputSchema
>;

export const ParameterizedSearchResponseSchema = z
	.object({
		searchRecords: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ParameterizedSearchResponse = z.infer<
	typeof ParameterizedSearchResponseSchema
>;

export const PostParameterizedSearchInputSchema = z
	.object({
		q: z.string(),
		fields: z.array(z.string()).optional(),
	})
	.passthrough();
export type PostParameterizedSearchInput = z.infer<
	typeof PostParameterizedSearchInputSchema
>;

export const PostParameterizedSearchResponseSchema = z
	.object({
		searchRecords: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type PostParameterizedSearchResponse = z.infer<
	typeof PostParameterizedSearchResponseSchema
>;

export const GetSearchLayoutInputSchema = z.object({
	sobjects: z.string(),
});
export type GetSearchLayoutInput = z.infer<typeof GetSearchLayoutInputSchema>;

export const GetSearchLayoutResponseSchema = z.array(
	z.record(z.string(), z.unknown()),
);
export type GetSearchLayoutResponse = z.infer<
	typeof GetSearchLayoutResponseSchema
>;

export const QueryInputSchema = z.object({
	q: z.string(),
});
export type QueryInput = z.infer<typeof QueryInputSchema>;

export const QueryResponseSchema = z
	.object({
		totalSize: z.number(),
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type QueryResponse = z.infer<typeof QueryResponseSchema>;

export const ExecuteSoqlQueryInputSchema = z.object({
	q: z.string(),
});
export type ExecuteSoqlQueryInput = z.infer<typeof ExecuteSoqlQueryInputSchema>;

export const ExecuteSoqlQueryResponseSchema = z
	.object({
		totalSize: z.number(),
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ExecuteSoqlQueryResponse = z.infer<
	typeof ExecuteSoqlQueryResponseSchema
>;

// Composite
export const PostCompositeSobjectsInputSchema = z.object({
	allOrNone: z.boolean().optional(),
	records: z.array(z.record(z.string(), z.unknown())),
});
export type PostCompositeSobjectsInput = z.infer<
	typeof PostCompositeSobjectsInputSchema
>;

export const PostCompositeSobjectsResponseSchema = z.array(
	z.record(z.string(), z.unknown()),
);
export type PostCompositeSobjectsResponse = z.infer<
	typeof PostCompositeSobjectsResponseSchema
>;

export const CreateSobjectTreeInputSchema = z.object({
	sobject: z.string(),
	records: z.array(z.record(z.string(), z.unknown())),
});
export type CreateSobjectTreeInput = z.infer<
	typeof CreateSobjectTreeInputSchema
>;

export const CreateSobjectTreeResponseSchema = z
	.object({
		hasErrors: z.boolean(),
		results: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type CreateSobjectTreeResponse = z.infer<
	typeof CreateSobjectTreeResponseSchema
>;

export const DeleteSobjectCollectionsInputSchema = z.object({
	ids: z.array(z.string()),
	allOrNone: z.boolean().optional(),
});
export type DeleteSobjectCollectionsInput = z.infer<
	typeof DeleteSobjectCollectionsInputSchema
>;

export const DeleteSobjectCollectionsResponseSchema = z.array(
	z.record(z.string(), z.unknown()),
);
export type DeleteSobjectCollectionsResponse = z.infer<
	typeof DeleteSobjectCollectionsResponseSchema
>;

export const PostCompositeGraphInputSchema = z.object({
	graphs: z.array(z.record(z.string(), z.unknown())),
});
export type PostCompositeGraphInput = z.infer<
	typeof PostCompositeGraphInputSchema
>;

export const PostCompositeGraphResponseSchema = z
	.object({
		graphs: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type PostCompositeGraphResponse = z.infer<
	typeof PostCompositeGraphResponseSchema
>;

export const CompositeGraphActionInputSchema = z
	.object({
		graphs: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type CompositeGraphActionInput = z.infer<
	typeof CompositeGraphActionInputSchema
>;

export const CompositeGraphActionResponseSchema = z
	.object({
		graphs: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type CompositeGraphActionResponse = z.infer<
	typeof CompositeGraphActionResponseSchema
>;

export const GetABatchOfRecordsInputSchema = z.object({
	ids: z.array(z.string()),
	fields: z.array(z.string()).optional(),
});
export type GetABatchOfRecordsInput = z.infer<
	typeof GetABatchOfRecordsInputSchema
>;

export const GetABatchOfRecordsResponseSchema = z
	.object({
		results: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetABatchOfRecordsResponse = z.infer<
	typeof GetABatchOfRecordsResponseSchema
>;

export const GetCompositeResourcesInputSchema = z.object({});
export type GetCompositeResourcesInput = z.infer<
	typeof GetCompositeResourcesInputSchema
>;

export const GetCompositeResourcesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetCompositeResourcesResponse = z.infer<
	typeof GetCompositeResourcesResponseSchema
>;

export const GetCompositeSobjectsInputSchema = z.object({
	ids: z.array(z.string()),
	fields: z.array(z.string()).optional(),
});
export type GetCompositeSobjectsInput = z.infer<
	typeof GetCompositeSobjectsInputSchema
>;

export const GetCompositeSobjectsResponseSchema = z.array(
	z.record(z.string(), z.unknown()),
);
export type GetCompositeSobjectsResponse = z.infer<
	typeof GetCompositeSobjectsResponseSchema
>;

export const GetSobjectCollectionsInputSchema = z.object({
	ids: z.array(z.string()),
	fields: z.array(z.string()).optional(),
});
export type GetSobjectCollectionsInput = z.infer<
	typeof GetSobjectCollectionsInputSchema
>;

export const GetSobjectCollectionsResponseSchema = z.array(
	z.record(z.string(), z.unknown()),
);
export type GetSobjectCollectionsResponse = z.infer<
	typeof GetSobjectCollectionsResponseSchema
>;

// Metadata & Tooling
export const CreateSObjectRecordInputSchema = z.object({
	sobject: z.string(),
	fields: z.record(z.string(), z.unknown()),
});
export type CreateSObjectRecordInput = z.infer<
	typeof CreateSObjectRecordInputSchema
>;

export const CreateSObjectRecordResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateSObjectRecordResponse = z.infer<
	typeof CreateSObjectRecordResponseSchema
>;

export const CloneRecordInputSchema = z.object({
	sobject: z.string(),
	recordId: z.string(),
	overrides: z.record(z.string(), z.unknown()).optional(),
});
export type CloneRecordInput = z.infer<typeof CloneRecordInputSchema>;

export const CloneRecordResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type CloneRecordResponse = z.infer<typeof CloneRecordResponseSchema>;

export const CreateCustomFieldInputSchema = z.object({
	sobject: z.string(),
	developerName: z.string(),
	label: z.string(),
	type: z.string(),
	length: z.number().optional(),
});
export type CreateCustomFieldInput = z.infer<
	typeof CreateCustomFieldInputSchema
>;

export const CreateCustomFieldResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateCustomFieldResponse = z.infer<
	typeof CreateCustomFieldResponseSchema
>;

export const CreateCustomObjectInputSchema = z.object({
	developerName: z.string(),
	label: z.string(),
	pluralLabel: z.string(),
});
export type CreateCustomObjectInput = z.infer<
	typeof CreateCustomObjectInputSchema
>;

export const CreateCustomObjectResponseSchema = z
	.object({
		id: z.string(),
		success: z.boolean().optional(),
	})
	.passthrough();
export type CreateCustomObjectResponse = z.infer<
	typeof CreateCustomObjectResponseSchema
>;

export const DeleteSobjectInputSchema = z.object({
	sobject: z.string(),
	id: z.string(),
});
export type DeleteSobjectInput = z.infer<typeof DeleteSobjectInputSchema>;

export const DeleteSobjectResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteSobjectResponse = z.infer<typeof DeleteSobjectResponseSchema>;

export const DeleteSobjectRowsInputSchema = z.object({
	sobject: z.string(),
	id: z.string(),
});
export type DeleteSobjectRowsInput = z.infer<
	typeof DeleteSobjectRowsInputSchema
>;

export const DeleteSobjectRowsResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteSobjectRowsResponse = z.infer<
	typeof DeleteSobjectRowsResponseSchema
>;

export const GetSobjectsInputSchema = z.object({});
export type GetSobjectsInput = z.infer<typeof GetSobjectsInputSchema>;

export const GetSobjectsResponseSchema = z
	.object({
		encoding: z.string().optional(),
		maxBatchSize: z.number().optional(),
		sobjects: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetSobjectsResponse = z.infer<typeof GetSobjectsResponseSchema>;

export const ExecuteSobjectQuickActionInputSchema = z.object({
	sobject: z.string(),
	actionName: z.string(),
	contextId: z.string().optional(),
	record: z.record(z.string(), z.unknown()).optional(),
});
export type ExecuteSobjectQuickActionInput = z.infer<
	typeof ExecuteSobjectQuickActionInputSchema
>;

export const ExecuteSobjectQuickActionResponseSchema = z
	.object({
		success: z.boolean(),
		recordId: z.string().optional(),
	})
	.passthrough();
export type ExecuteSobjectQuickActionResponse = z.infer<
	typeof ExecuteSobjectQuickActionResponseSchema
>;

export const GetApiInputSchema = z.object({
	version: z.string().optional(),
});
export type GetApiInput = z.infer<typeof GetApiInputSchema>;

export const GetApiResponseSchema = z.record(z.string(), z.unknown());
export type GetApiResponse = z.infer<typeof GetApiResponseSchema>;

export const GetChatterResourcesInputSchema = z.object({});
export type GetChatterResourcesInput = z.infer<
	typeof GetChatterResourcesInputSchema
>;

export const GetChatterResourcesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetChatterResourcesResponse = z.infer<
	typeof GetChatterResourcesResponseSchema
>;

export const GetSobjectPlatformactionInputSchema = z.object({});
export type GetSobjectPlatformactionInput = z.infer<
	typeof GetSobjectPlatformactionInputSchema
>;

export const GetSobjectPlatformactionResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectPlatformactionResponse = z.infer<
	typeof GetSobjectPlatformactionResponseSchema
>;

export const HeadQuickActionsInputSchema = z.object({});
export type HeadQuickActionsInput = z.infer<typeof HeadQuickActionsInputSchema>;

export const HeadQuickActionsResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadQuickActionsResponse = z.infer<
	typeof HeadQuickActionsResponseSchema
>;

export const HeadSobjectsUserPasswordInputSchema = z.object({
	userId: z.string(),
});
export type HeadSobjectsUserPasswordInput = z.infer<
	typeof HeadSobjectsUserPasswordInputSchema
>;

export const HeadSobjectsUserPasswordResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadSobjectsUserPasswordResponse = z.infer<
	typeof HeadSobjectsUserPasswordResponseSchema
>;

export const GetPicklistValuesByRecordTypeInputSchema = z.object({
	sobject: z.string(),
	recordTypeId: z.string(),
});
export type GetPicklistValuesByRecordTypeInput = z.infer<
	typeof GetPicklistValuesByRecordTypeInputSchema
>;

export const GetPicklistValuesByRecordTypeResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetPicklistValuesByRecordTypeResponse = z.infer<
	typeof GetPicklistValuesByRecordTypeResponseSchema
>;

export const GetAllFieldsForObjectInputSchema = z.object({
	sobject: z.string(),
});
export type GetAllFieldsForObjectInput = z.infer<
	typeof GetAllFieldsForObjectInputSchema
>;

export const GetAllFieldsForObjectResponseSchema = z
	.object({
		fields: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetAllFieldsForObjectResponse = z.infer<
	typeof GetAllFieldsForObjectResponseSchema
>;

export const GetAllCustomObjectsInputSchema = z.object({});
export type GetAllCustomObjectsInput = z.infer<
	typeof GetAllCustomObjectsInputSchema
>;

export const GetAllCustomObjectsResponseSchema = z
	.object({
		sobjects: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetAllCustomObjectsResponse = z.infer<
	typeof GetAllCustomObjectsResponseSchema
>;

export const GetSobjectsSobjectDescribeApprovallayoutsInputSchema = z.object({
	sobject: z.string(),
});
export type GetSobjectsSobjectDescribeApprovallayoutsInput = z.infer<
	typeof GetSobjectsSobjectDescribeApprovallayoutsInputSchema
>;

export const GetSobjectsSobjectDescribeApprovallayoutsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectsSobjectDescribeApprovallayoutsResponse = z.infer<
	typeof GetSobjectsSobjectDescribeApprovallayoutsResponseSchema
>;

export const GetSobjectApprovalLayoutsInputSchema = z.object({
	sobject: z.string(),
});
export type GetSobjectApprovalLayoutsInput = z.infer<
	typeof GetSobjectApprovalLayoutsInputSchema
>;

export const GetSobjectApprovalLayoutsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectApprovalLayoutsResponse = z.infer<
	typeof GetSobjectApprovalLayoutsResponseSchema
>;

export const GetChildRecordsInputSchema = z.object({
	parentId: z.string(),
	relationshipName: z.string(),
});
export type GetChildRecordsInput = z.infer<typeof GetChildRecordsInputSchema>;

export const GetChildRecordsResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetChildRecordsResponse = z.infer<
	typeof GetChildRecordsResponseSchema
>;

export const GetConsentActionInputSchema = z.object({
	action: z.string(),
	ids: z.array(z.string()),
});
export type GetConsentActionInput = z.infer<typeof GetConsentActionInputSchema>;

export const GetConsentActionResponseSchema = z.record(z.string(), z.unknown());
export type GetConsentActionResponse = z.infer<
	typeof GetConsentActionResponseSchema
>;

export const HeadActionsCustomInputSchema = z.object({});
export type HeadActionsCustomInput = z.infer<
	typeof HeadActionsCustomInputSchema
>;

export const HeadActionsCustomResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadActionsCustomResponse = z.infer<
	typeof HeadActionsCustomResponseSchema
>;

export const ListCustomInvocableActionsInputSchema = z.object({});
export type ListCustomInvocableActionsInput = z.infer<
	typeof ListCustomInvocableActionsInputSchema
>;

export const ListCustomInvocableActionsResponseSchema = z
	.object({
		actions: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListCustomInvocableActionsResponse = z.infer<
	typeof ListCustomInvocableActionsResponseSchema
>;

export const GetSupportedObjectsDirectoryInputSchema = z.object({});
export type GetSupportedObjectsDirectoryInput = z.infer<
	typeof GetSupportedObjectsDirectoryInputSchema
>;

export const GetSupportedObjectsDirectoryResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSupportedObjectsDirectoryResponse = z.infer<
	typeof GetSupportedObjectsDirectoryResponseSchema
>;

export const GetGlobalActionsInputSchema = z.object({});
export type GetGlobalActionsInput = z.infer<typeof GetGlobalActionsInputSchema>;

export const GetGlobalActionsResponseSchema = z
	.object({
		actions: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetGlobalActionsResponse = z.infer<
	typeof GetGlobalActionsResponseSchema
>;

export const HeadSobjectsGlobalDescribeLayoutsInputSchema = z.object({});
export type HeadSobjectsGlobalDescribeLayoutsInput = z.infer<
	typeof HeadSobjectsGlobalDescribeLayoutsInputSchema
>;

export const HeadSobjectsGlobalDescribeLayoutsResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadSobjectsGlobalDescribeLayoutsResponse = z.infer<
	typeof HeadSobjectsGlobalDescribeLayoutsResponseSchema
>;

export const GetSObjectsDescribeLayoutsRecordTypeIdInputSchema = z.object({
	sobject: z.string(),
	recordTypeId: z.string(),
});
export type GetSObjectsDescribeLayoutsRecordTypeIdInput = z.infer<
	typeof GetSObjectsDescribeLayoutsRecordTypeIdInputSchema
>;

export const GetSObjectsDescribeLayoutsRecordTypeIdResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSObjectsDescribeLayoutsRecordTypeIdResponse = z.infer<
	typeof GetSObjectsDescribeLayoutsRecordTypeIdResponseSchema
>;

export const GetOrgLimitsInputSchema = z.object({});
export type GetOrgLimitsInput = z.infer<typeof GetOrgLimitsInputSchema>;

export const GetOrgLimitsResponseSchema = z.record(z.string(), z.unknown());
export type GetOrgLimitsResponse = z.infer<typeof GetOrgLimitsResponseSchema>;

export const HeadProcessRulesSObjectInputSchema = z.object({
	sobject: z.string(),
});
export type HeadProcessRulesSObjectInput = z.infer<
	typeof HeadProcessRulesSObjectInputSchema
>;

export const HeadProcessRulesSObjectResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadProcessRulesSObjectResponse = z.infer<
	typeof HeadProcessRulesSObjectResponseSchema
>;

export const HeadSobjectQuickActionDefaultValuesInputSchema = z.object({
	sobject: z.string(),
	actionName: z.string(),
	contextId: z.string().optional(),
});
export type HeadSobjectQuickActionDefaultValuesInput = z.infer<
	typeof HeadSobjectQuickActionDefaultValuesInputSchema
>;

export const HeadSobjectQuickActionDefaultValuesResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadSobjectQuickActionDefaultValuesResponse = z.infer<
	typeof HeadSobjectQuickActionDefaultValuesResponseSchema
>;

export const GetQuickActionsInputSchema = z.object({});
export type GetQuickActionsInput = z.infer<typeof GetQuickActionsInputSchema>;

export const GetQuickActionsResponseSchema = z
	.object({
		actions: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetQuickActionsResponse = z.infer<
	typeof GetQuickActionsResponseSchema
>;

export const GetRecordCountsInputSchema = z.object({
	sobjects: z.array(z.string()),
});
export type GetRecordCountsInput = z.infer<typeof GetRecordCountsInputSchema>;

export const GetRecordCountsResponseSchema = z
	.object({
		sObjects: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetRecordCountsResponse = z.infer<
	typeof GetRecordCountsResponseSchema
>;

export const GetSobjectRelationshipInputSchema = z.object({
	sobject: z.string(),
	id: z.string(),
	fieldName: z.string(),
});
export type GetSobjectRelationshipInput = z.infer<
	typeof GetSobjectRelationshipInputSchema
>;

export const GetSobjectRelationshipResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectRelationshipResponse = z.infer<
	typeof GetSobjectRelationshipResponseSchema
>;

export const GetSobjectQuickActionDefaultValuesInputSchema = z.object({
	sobject: z.string(),
	actionName: z.string(),
});
export type GetSobjectQuickActionDefaultValuesInput = z.infer<
	typeof GetSobjectQuickActionDefaultValuesInputSchema
>;

export const GetSobjectQuickActionDefaultValuesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectQuickActionDefaultValuesResponse = z.infer<
	typeof GetSobjectQuickActionDefaultValuesResponseSchema
>;

export const GetSObjectQuickActionDefaultValuesInputSchema = z.object({
	sobject: z.string(),
	actionName: z.string(),
	contextId: z.string().optional(),
});
export type GetSObjectQuickActionDefaultValuesInput = z.infer<
	typeof GetSObjectQuickActionDefaultValuesInputSchema
>;

export const GetSObjectQuickActionDefaultValuesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSObjectQuickActionDefaultValuesResponse = z.infer<
	typeof GetSObjectQuickActionDefaultValuesResponseSchema
>;

export const GetSobjectByExternalIdInputSchema = z.object({
	sobject: z.string(),
	fieldName: z.string(),
	fieldValue: z.string(),
});
export type GetSobjectByExternalIdInput = z.infer<
	typeof GetSobjectByExternalIdInputSchema
>;

export const GetSobjectByExternalIdResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectByExternalIdResponse = z.infer<
	typeof GetSobjectByExternalIdResponseSchema
>;

export const HeadSobjectsQuickActionInputSchema = z.object({
	sobject: z.string(),
	actionName: z.string(),
});
export type HeadSobjectsQuickActionInput = z.infer<
	typeof HeadSobjectsQuickActionInputSchema
>;

export const HeadSobjectsQuickActionResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadSobjectsQuickActionResponse = z.infer<
	typeof HeadSobjectsQuickActionResponseSchema
>;

export const GetSObjectRecordInputSchema = z.object({
	sobject: z.string(),
	id: z.string(),
	fields: z.array(z.string()).optional(),
});
export type GetSObjectRecordInput = z.infer<typeof GetSObjectRecordInputSchema>;

export const GetSObjectRecordResponseSchema = z.record(z.string(), z.unknown());
export type GetSObjectRecordResponse = z.infer<
	typeof GetSObjectRecordResponseSchema
>;

export const HeadActionsStandardInputSchema = z.object({});
export type HeadActionsStandardInput = z.infer<
	typeof HeadActionsStandardInputSchema
>;

export const HeadActionsStandardResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadActionsStandardResponse = z.infer<
	typeof HeadActionsStandardResponseSchema
>;

export const ListStandardInvocableActionsInputSchema = z.object({});
export type ListStandardInvocableActionsInput = z.infer<
	typeof ListStandardInvocableActionsInputSchema
>;

export const ListStandardInvocableActionsResponseSchema = z
	.object({
		actions: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListStandardInvocableActionsResponse = z.infer<
	typeof ListStandardInvocableActionsResponseSchema
>;

export const GetSupportInputSchema = z.object({});
export type GetSupportInput = z.infer<typeof GetSupportInputSchema>;

export const GetSupportResponseSchema = z.record(z.string(), z.unknown());
export type GetSupportResponse = z.infer<typeof GetSupportResponseSchema>;

export const GetSupportKnowledgeArticlesInputSchema = z.object({});
export type GetSupportKnowledgeArticlesInput = z.infer<
	typeof GetSupportKnowledgeArticlesInputSchema
>;

export const GetSupportKnowledgeArticlesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSupportKnowledgeArticlesResponse = z.infer<
	typeof GetSupportKnowledgeArticlesResponseSchema
>;

export const GetThemeInputSchema = z.object({});
export type GetThemeInput = z.infer<typeof GetThemeInputSchema>;

export const GetThemeResponseSchema = z.record(z.string(), z.unknown());
export type GetThemeResponse = z.infer<typeof GetThemeResponseSchema>;

export const GetSObjectsUpdatedInputSchema = z.object({
	sobject: z.string(),
	start: z.string(),
	end: z.string(),
});
export type GetSObjectsUpdatedInput = z.infer<
	typeof GetSObjectsUpdatedInputSchema
>;

export const GetSObjectsUpdatedResponseSchema = z
	.object({
		ids: z.array(z.string()),
		latestDateCovered: z.string(),
	})
	.passthrough();
export type GetSObjectsUpdatedResponse = z.infer<
	typeof GetSObjectsUpdatedResponseSchema
>;

export const GetUserInfoInputSchema = z.object({
	userId: z.string().optional(),
});
export type GetUserInfoInput = z.infer<typeof GetUserInfoInputSchema>;

export const GetUserInfoResponseSchema = z.record(z.string(), z.unknown());
export type GetUserInfoResponse = z.infer<typeof GetUserInfoResponseSchema>;

export const SobjectUserPasswordInputSchema = z.object({
	userId: z.string(),
});
export type SobjectUserPasswordInput = z.infer<
	typeof SobjectUserPasswordInputSchema
>;

export const SobjectUserPasswordResponseSchema = z
	.object({
		isExpired: z.boolean().optional(),
	})
	.passthrough();
export type SobjectUserPasswordResponse = z.infer<
	typeof SobjectUserPasswordResponseSchema
>;

export const MassTransferOwnershipInputSchema = z.object({
	sobject: z.string(),
	fromUserId: z.string(),
	toUserId: z.string(),
	recordIds: z.array(z.string()).optional(),
});
export type MassTransferOwnershipInput = z.infer<
	typeof MassTransferOwnershipInputSchema
>;

export const MassTransferOwnershipResponseSchema = z
	.object({
		success: z.boolean(),
		transferred: z.number().optional(),
		failed: z
			.array(
				z.object({
					id: z.string().optional(),
					errors: z.unknown().optional(),
				}),
			)
			.optional(),
	})
	.passthrough();
export type MassTransferOwnershipResponse = z.infer<
	typeof MassTransferOwnershipResponseSchema
>;

// UI API
export const CreateARecordInputSchema = z.object({
	apiName: z.string(),
	fields: z.record(z.string(), z.unknown()),
});
export type CreateARecordInput = z.infer<typeof CreateARecordInputSchema>;

export const CreateARecordResponseSchema = z
	.object({
		id: z.string(),
		apiName: z.string().optional(),
	})
	.passthrough();
export type CreateARecordResponse = z.infer<typeof CreateARecordResponseSchema>;

export const CreateRecordUiApiInputSchema = z.object({
	apiName: z.string(),
	fields: z.record(z.string(), z.unknown()),
});
export type CreateRecordUiApiInput = z.infer<
	typeof CreateRecordUiApiInputSchema
>;

export const CreateRecordUiApiResponseSchema = z
	.object({
		id: z.string(),
		apiName: z.string().optional(),
	})
	.passthrough();
export type CreateRecordUiApiResponse = z.infer<
	typeof CreateRecordUiApiResponseSchema
>;

export const GetUiapiListInfoAccountAllAccountsInputSchema = z.object({});
export type GetUiapiListInfoAccountAllAccountsInput = z.infer<
	typeof GetUiapiListInfoAccountAllAccountsInputSchema
>;

export const GetUiapiListInfoAccountAllAccountsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiapiListInfoAccountAllAccountsResponse = z.infer<
	typeof GetUiapiListInfoAccountAllAccountsResponseSchema
>;

export const GetUiapiListInfoAccountSearchResultInputSchema = z.object({});
export type GetUiapiListInfoAccountSearchResultInput = z.infer<
	typeof GetUiapiListInfoAccountSearchResultInputSchema
>;

export const GetUiapiListInfoAccountSearchResultResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiapiListInfoAccountSearchResultResponse = z.infer<
	typeof GetUiapiListInfoAccountSearchResultResponseSchema
>;

export const HeadAppmenuSalesforce1InputSchema = z.object({});
export type HeadAppmenuSalesforce1Input = z.infer<
	typeof HeadAppmenuSalesforce1InputSchema
>;

export const HeadAppmenuSalesforce1ResponseSchema = z
	.object({
		status: z.number().optional(),
	})
	.passthrough();
export type HeadAppmenuSalesforce1Response = z.infer<
	typeof HeadAppmenuSalesforce1ResponseSchema
>;

export const GetCompactLayoutsInputSchema = z.object({
	sobjects: z.array(z.string()),
});
export type GetCompactLayoutsInput = z.infer<
	typeof GetCompactLayoutsInputSchema
>;

export const GetCompactLayoutsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetCompactLayoutsResponse = z.infer<
	typeof GetCompactLayoutsResponseSchema
>;

export const GetListViewActionsInputSchema = z.object({
	sobject: z.string(),
});
export type GetListViewActionsInput = z.infer<
	typeof GetListViewActionsInputSchema
>;

export const GetListViewActionsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetListViewActionsResponse = z.infer<
	typeof GetListViewActionsResponseSchema
>;

export const GetUiapiListInfoAccountRecentInputSchema = z.object({});
export type GetUiapiListInfoAccountRecentInput = z.infer<
	typeof GetUiapiListInfoAccountRecentInputSchema
>;

export const GetUiapiListInfoAccountRecentResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiapiListInfoAccountRecentResponse = z.infer<
	typeof GetUiapiListInfoAccountRecentResponseSchema
>;

export const GetUiApiListInfoRecentInputSchema = z.object({
	sobject: z.string(),
});
export type GetUiApiListInfoRecentInput = z.infer<
	typeof GetUiApiListInfoRecentInputSchema
>;

export const GetUiApiListInfoRecentResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiApiListInfoRecentResponse = z.infer<
	typeof GetUiApiListInfoRecentResponseSchema
>;

export const GetUiapimruListInfoAccountInputSchema = z.object({});
export type GetUiapimruListInfoAccountInput = z.infer<
	typeof GetUiapimruListInfoAccountInputSchema
>;

export const GetUiapimruListInfoAccountResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiapimruListInfoAccountResponse = z.infer<
	typeof GetUiapimruListInfoAccountResponseSchema
>;

export const GetUiApiMruListRecordsAccountInputSchema = z.object({});
export type GetUiApiMruListRecordsAccountInput = z.infer<
	typeof GetUiApiMruListRecordsAccountInputSchema
>;

export const GetUiApiMruListRecordsAccountResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiApiMruListRecordsAccountResponse = z.infer<
	typeof GetUiApiMruListRecordsAccountResponseSchema
>;

export const GetUiapiActionsMruListAccountInputSchema = z.object({});
export type GetUiapiActionsMruListAccountInput = z.infer<
	typeof GetUiapiActionsMruListAccountInputSchema
>;

export const GetUiapiActionsMruListAccountResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiapiActionsMruListAccountResponse = z.infer<
	typeof GetUiapiActionsMruListAccountResponseSchema
>;

export const GetMruListViewMetadataInputSchema = z.object({
	sobject: z.string(),
});
export type GetMruListViewMetadataInput = z.infer<
	typeof GetMruListViewMetadataInputSchema
>;

export const GetMruListViewMetadataResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetMruListViewMetadataResponse = z.infer<
	typeof GetMruListViewMetadataResponseSchema
>;

export const GetUiApiAppsUserNavItemsInputSchema = z.object({
	appId: z.string().optional(),
});
export type GetUiApiAppsUserNavItemsInput = z.infer<
	typeof GetUiApiAppsUserNavItemsInputSchema
>;

export const GetUiApiAppsUserNavItemsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiApiAppsUserNavItemsResponse = z.infer<
	typeof GetUiApiAppsUserNavItemsResponseSchema
>;

export const GetAllNavigationItemsInputSchema = z.object({});
export type GetAllNavigationItemsInput = z.infer<
	typeof GetAllNavigationItemsInputSchema
>;

export const GetAllNavigationItemsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetAllNavigationItemsResponse = z.infer<
	typeof GetAllNavigationItemsResponseSchema
>;

export const GetAppInputSchema = z.object({
	appId: z.string(),
});
export type GetAppInput = z.infer<typeof GetAppInputSchema>;

export const GetAppResponseSchema = z.record(z.string(), z.unknown());
export type GetAppResponse = z.infer<typeof GetAppResponseSchema>;

export const GetAppsInputSchema = z.object({});
export type GetAppsInput = z.infer<typeof GetAppsInputSchema>;

export const GetAppsResponseSchema = z.record(z.string(), z.unknown());
export type GetAppsResponse = z.infer<typeof GetAppsResponseSchema>;

export const GetListViewMetadataBatchInputSchema = z.object({
	listViewIds: z.array(z.string()),
});
export type GetListViewMetadataBatchInput = z.infer<
	typeof GetListViewMetadataBatchInputSchema
>;

export const GetListViewMetadataBatchResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetListViewMetadataBatchResponse = z.infer<
	typeof GetListViewMetadataBatchResponseSchema
>;

export const GetRelatedListPreferencesBatchInputSchema = z.object({
	relatedListIds: z.array(z.string()),
});
export type GetRelatedListPreferencesBatchInput = z.infer<
	typeof GetRelatedListPreferencesBatchInputSchema
>;

export const GetRelatedListPreferencesBatchResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetRelatedListPreferencesBatchResponse = z.infer<
	typeof GetRelatedListPreferencesBatchResponseSchema
>;

export const GetLastSelectedAppInputSchema = z.object({});
export type GetLastSelectedAppInput = z.infer<
	typeof GetLastSelectedAppInputSchema
>;

export const GetLastSelectedAppResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetLastSelectedAppResponse = z.infer<
	typeof GetLastSelectedAppResponseSchema
>;

export const GetListViewMetadataByNameInputSchema = z.object({
	sobject: z.string(),
	listViewName: z.string(),
});
export type GetListViewMetadataByNameInput = z.infer<
	typeof GetListViewMetadataByNameInputSchema
>;

export const GetListViewMetadataByNameResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetListViewMetadataByNameResponse = z.infer<
	typeof GetListViewMetadataByNameResponseSchema
>;

export const GetListViewRecordsByNameInputSchema = z.object({
	sobject: z.string(),
	listViewName: z.string(),
});
export type GetListViewRecordsByNameInput = z.infer<
	typeof GetListViewRecordsByNameInputSchema
>;

export const GetListViewRecordsByNameResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetListViewRecordsByNameResponse = z.infer<
	typeof GetListViewRecordsByNameResponseSchema
>;

export const GetListViewRecordsByIdInputSchema = z.object({
	listViewId: z.string(),
});
export type GetListViewRecordsByIdInput = z.infer<
	typeof GetListViewRecordsByIdInputSchema
>;

export const GetListViewRecordsByIdResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetListViewRecordsByIdResponse = z.infer<
	typeof GetListViewRecordsByIdResponseSchema
>;

export const ListViewResultsInputSchema = z.object({
	listViewId: z.string(),
});
export type ListViewResultsInput = z.infer<typeof ListViewResultsInputSchema>;

export const ListViewResultsResponseSchema = z.record(z.string(), z.unknown());
export type ListViewResultsResponse = z.infer<
	typeof ListViewResultsResponseSchema
>;

export const GetListViewResultsInputSchema = z.object({
	sobject: z.string(),
	listViewId: z.string(),
});
export type GetListViewResultsInput = z.infer<
	typeof GetListViewResultsInputSchema
>;

export const GetListViewResultsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetListViewResultsResponse = z.infer<
	typeof GetListViewResultsResponseSchema
>;

export const GetObjectListViewsInputSchema = z.object({
	sobject: z.string(),
});
export type GetObjectListViewsInput = z.infer<
	typeof GetObjectListViewsInputSchema
>;

export const GetObjectListViewsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetObjectListViewsResponse = z.infer<
	typeof GetObjectListViewsResponseSchema
>;

export const GetSobjectListViewsInputSchema = z.object({
	sobject: z.string(),
});
export type GetSobjectListViewsInput = z.infer<
	typeof GetSobjectListViewsInputSchema
>;

export const GetSobjectListViewsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectListViewsResponse = z.infer<
	typeof GetSobjectListViewsResponseSchema
>;

export const GetUiApiActionsLookupAccountInputSchema = z.object({});
export type GetUiApiActionsLookupAccountInput = z.infer<
	typeof GetUiApiActionsLookupAccountInputSchema
>;

export const GetUiApiActionsLookupAccountResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiApiActionsLookupAccountResponse = z.infer<
	typeof GetUiApiActionsLookupAccountResponseSchema
>;

export const GetUiapiLookupsOpportunityAccountIdInputSchema = z.object({});
export type GetUiapiLookupsOpportunityAccountIdInput = z.infer<
	typeof GetUiapiLookupsOpportunityAccountIdInputSchema
>;

export const GetUiapiLookupsOpportunityAccountIdResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiapiLookupsOpportunityAccountIdResponse = z.infer<
	typeof GetUiapiLookupsOpportunityAccountIdResponseSchema
>;

export const GetLookupFieldSuggestionsInputSchema = z.object({
	sobject: z.string(),
	field: z.string(),
	q: z.string().optional(),
});
export type GetLookupFieldSuggestionsInput = z.infer<
	typeof GetLookupFieldSuggestionsInputSchema
>;

export const GetLookupFieldSuggestionsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetLookupFieldSuggestionsResponse = z.infer<
	typeof GetLookupFieldSuggestionsResponseSchema
>;

export const GetLookupSuggestionsOpportunityAccountInputSchema = z.object({
	q: z.string().optional(),
});
export type GetLookupSuggestionsOpportunityAccountInput = z.infer<
	typeof GetLookupSuggestionsOpportunityAccountInputSchema
>;

export const GetLookupSuggestionsOpportunityAccountResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetLookupSuggestionsOpportunityAccountResponse = z.infer<
	typeof GetLookupSuggestionsOpportunityAccountResponseSchema
>;

export const GetLookupSuggestionsCaseContactInputSchema = z.object({
	q: z.string().optional(),
});
export type GetLookupSuggestionsCaseContactInput = z.infer<
	typeof GetLookupSuggestionsCaseContactInputSchema
>;

export const GetLookupSuggestionsCaseContactResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetLookupSuggestionsCaseContactResponse = z.infer<
	typeof GetLookupSuggestionsCaseContactResponseSchema
>;

export const GetMruListViewRecordsInputSchema = z.object({
	sobject: z.string(),
});
export type GetMruListViewRecordsInput = z.infer<
	typeof GetMruListViewRecordsInputSchema
>;

export const GetMruListViewRecordsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetMruListViewRecordsResponse = z.infer<
	typeof GetMruListViewRecordsResponseSchema
>;

export const GetPhotoActionsInputSchema = z.object({
	pageId: z.string().optional(),
});
export type GetPhotoActionsInput = z.infer<typeof GetPhotoActionsInputSchema>;

export const GetPhotoActionsResponseSchema = z.record(z.string(), z.unknown());
export type GetPhotoActionsResponse = z.infer<
	typeof GetPhotoActionsResponseSchema
>;

export const GetRecordUiDataAndMetadataInputSchema = z.object({
	recordId: z.string(),
});
export type GetRecordUiDataAndMetadataInput = z.infer<
	typeof GetRecordUiDataAndMetadataInputSchema
>;

export const GetRecordUiDataAndMetadataResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetRecordUiDataAndMetadataResponse = z.infer<
	typeof GetRecordUiDataAndMetadataResponseSchema
>;

export const GetRecordEditPageActionsInputSchema = z.object({
	sobject: z.string(),
	recordId: z.string().optional(),
});
export type GetRecordEditPageActionsInput = z.infer<
	typeof GetRecordEditPageActionsInputSchema
>;

export const GetRecordEditPageActionsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetRecordEditPageActionsResponse = z.infer<
	typeof GetRecordEditPageActionsResponseSchema
>;

export const GetUiApiActionsRecordRelatedListInputSchema = z.object({
	parentRecordId: z.string(),
	relationshipName: z.string(),
});
export type GetUiApiActionsRecordRelatedListInput = z.infer<
	typeof GetUiApiActionsRecordRelatedListInputSchema
>;

export const GetUiApiActionsRecordRelatedListResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiApiActionsRecordRelatedListResponse = z.infer<
	typeof GetUiApiActionsRecordRelatedListResponseSchema
>;

export const GetRelatedListActionsInputSchema = z.object({
	parentRecordId: z.string(),
	relationshipName: z.string(),
});
export type GetRelatedListActionsInput = z.infer<
	typeof GetRelatedListActionsInputSchema
>;

export const GetRelatedListActionsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetRelatedListActionsResponse = z.infer<
	typeof GetRelatedListActionsResponseSchema
>;

export const GetRelatedListRecordsContactsInputSchema = z.object({
	parentRecordId: z.string(),
});
export type GetRelatedListRecordsContactsInput = z.infer<
	typeof GetRelatedListRecordsContactsInputSchema
>;

export const GetRelatedListRecordsContactsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetRelatedListRecordsContactsResponse = z.infer<
	typeof GetRelatedListRecordsContactsResponseSchema
>;

export const GetUiapiRelatedListPreferencesInputSchema = z.object({
	parentRecordId: z.string(),
	relationshipName: z.string(),
});
export type GetUiapiRelatedListPreferencesInput = z.infer<
	typeof GetUiapiRelatedListPreferencesInputSchema
>;

export const GetUiapiRelatedListPreferencesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetUiapiRelatedListPreferencesResponse = z.infer<
	typeof GetUiapiRelatedListPreferencesResponseSchema
>;

export const GetSobjectListViewInputSchema = z.object({
	sobject: z.string(),
	listViewId: z.string(),
});
export type GetSobjectListViewInput = z.infer<
	typeof GetSobjectListViewInputSchema
>;

export const GetSobjectListViewResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetSobjectListViewResponse = z.infer<
	typeof GetSobjectListViewResponseSchema
>;

// Files
export const GetFileContentInputSchema = z.object({
	fileId: z.string(),
});
export type GetFileContentInput = z.infer<typeof GetFileContentInputSchema>;

export const GetFileContentResponseSchema = z
	.object({
		content: z.string(),
	})
	.passthrough();
export type GetFileContentResponse = z.infer<
	typeof GetFileContentResponseSchema
>;

export const GetFileInformationInputSchema = z.object({
	fileId: z.string(),
});
export type GetFileInformationInput = z.infer<
	typeof GetFileInformationInputSchema
>;

export const GetFileInformationResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetFileInformationResponse = z.infer<
	typeof GetFileInformationResponseSchema
>;

export const GetFileSharesInputSchema = z.object({
	fileId: z.string(),
});
export type GetFileSharesInput = z.infer<typeof GetFileSharesInputSchema>;

export const GetFileSharesResponseSchema = z
	.object({
		shares: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type GetFileSharesResponse = z.infer<typeof GetFileSharesResponseSchema>;

export const DeleteFileInputSchema = z.object({
	fileId: z.string(),
});
export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

export const DeleteFileResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();
export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;

// Analytics & Reports
export const GetDashboardInputSchema = z.object({
	dashboardId: z.string(),
});
export type GetDashboardInput = z.infer<typeof GetDashboardInputSchema>;

export const GetDashboardResponseSchema = z.record(z.string(), z.unknown());
export type GetDashboardResponse = z.infer<typeof GetDashboardResponseSchema>;

export const ListDashboardsInputSchema = z.object({});
export type ListDashboardsInput = z.infer<typeof ListDashboardsInputSchema>;

export const ListDashboardsResponseSchema = z
	.object({
		dashboards: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListDashboardsResponse = z.infer<
	typeof ListDashboardsResponseSchema
>;

export const ListEmailTemplatesInputSchema = z.object({
	name: z.string().optional(),
	developerName: z.string().optional(),
	folderId: z.string().optional(),
});
export type ListEmailTemplatesInput = z.infer<
	typeof ListEmailTemplatesInputSchema
>;

export const ListEmailTemplatesResponseSchema = z
	.object({
		templates: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListEmailTemplatesResponse = z.infer<
	typeof ListEmailTemplatesResponseSchema
>;

export const ListReportsInputSchema = z.object({});
export type ListReportsInput = z.infer<typeof ListReportsInputSchema>;

export const ListReportsResponseSchema = z
	.object({
		reports: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListReportsResponse = z.infer<typeof ListReportsResponseSchema>;

export const RunReportInputSchema = z.object({
	reportId: z.string(),
});
export type RunReportInput = z.infer<typeof RunReportInputSchema>;

export const RunReportResponseSchema = z.record(z.string(), z.unknown());
export type RunReportResponse = z.infer<typeof RunReportResponseSchema>;

export const ListAnalyticsTemplatesInputSchema = z.object({});
export type ListAnalyticsTemplatesInput = z.infer<
	typeof ListAnalyticsTemplatesInputSchema
>;

export const ListAnalyticsTemplatesResponseSchema = z
	.object({
		templates: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type ListAnalyticsTemplatesResponse = z.infer<
	typeof ListAnalyticsTemplatesResponseSchema
>;

export const GetReportInstanceInputSchema = z.object({
	reportId: z.string(),
	instanceId: z.string(),
});
export type GetReportInstanceInput = z.infer<
	typeof GetReportInstanceInputSchema
>;

export const GetReportInstanceResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetReportInstanceResponse = z.infer<
	typeof GetReportInstanceResponseSchema
>;

export const GetReportInputSchema = z.object({
	reportId: z.string(),
});
export type GetReportInput = z.infer<typeof GetReportInputSchema>;

export const GetReportResponseSchema = z.record(z.string(), z.unknown());
export type GetReportResponse = z.infer<typeof GetReportResponseSchema>;

export const QueryReportInputSchema = z.object({
	id: z.string(),
	reportType: z.string().optional(),
});
export type QueryReportInput = z.infer<typeof QueryReportInputSchema>;

export const QueryReportResponseSchema = z.record(z.string(), z.unknown());
export type QueryReportResponse = z.infer<typeof QueryReportResponseSchema>;

const SuccessResponseSchema = z.object({ success: z.boolean() }).passthrough();
const RecordsResponseSchema = z
	.object({ records: z.array(z.record(z.string(), z.unknown())) })
	.passthrough();
const ResultResponseSchema = z
	.object({ result: z.unknown().optional() })
	.passthrough();

export const UpdateAccountInputSchema =
	CreateAccountInputSchema.partial().extend({
		id: z.string(),
	});
export type UpdateAccountInput = z.infer<typeof UpdateAccountInputSchema>;
export const UpdateAccountResponseSchema = SuccessResponseSchema;
export type UpdateAccountResponse = z.infer<typeof UpdateAccountResponseSchema>;
export const UpdateAccountObjectByIdInputSchema = UpdateAccountInputSchema;
export const UpdateAccountObjectByIdResponseSchema = SuccessResponseSchema;

export const UpdateContactInputSchema =
	CreateContactInputSchema.partial().extend({
		id: z.string(),
	});
export type UpdateContactInput = z.infer<typeof UpdateContactInputSchema>;
export const UpdateContactResponseSchema = SuccessResponseSchema;
export const UpdateContactByIdInputSchema = UpdateContactInputSchema;
export const UpdateContactByIdResponseSchema = SuccessResponseSchema;

export const SearchContactsInputSchema = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	accountId: z.string().optional(),
	title: z.string().optional(),
	limit: z.number().optional(),
});
export type SearchContactsInput = z.infer<typeof SearchContactsInputSchema>;
export const SearchContactsResponseSchema = RecordsResponseSchema;

export const UpdateLeadInputSchema = CreateLeadInputSchema.partial().extend({
	id: z.string(),
});
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;
export const UpdateLeadResponseSchema = SuccessResponseSchema;
export const UpdateLeadByIdWithJsonPayloadInputSchema = UpdateLeadInputSchema;
export const UpdateLeadByIdWithJsonPayloadResponseSchema =
	SuccessResponseSchema;

export const SearchLeadsInputSchema = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	company: z.string().optional(),
	status: z.string().optional(),
	title: z.string().optional(),
	limit: z.number().optional(),
});
export type SearchLeadsInput = z.infer<typeof SearchLeadsInputSchema>;
export const SearchLeadsResponseSchema = RecordsResponseSchema;

export const UpdateOpportunityInputSchema =
	CreateOpportunityInputSchema.partial().extend({
		id: z.string(),
	});
export type UpdateOpportunityInput = z.infer<
	typeof UpdateOpportunityInputSchema
>;
export const UpdateOpportunityResponseSchema = SuccessResponseSchema;
export const UpdateOpportunityByIdInputSchema = UpdateOpportunityInputSchema;
export const UpdateOpportunityByIdResponseSchema = SuccessResponseSchema;

export const SearchOpportunitiesInputSchema = z.object({
	name: z.string().optional(),
	accountId: z.string().optional(),
	stageName: z.string().optional(),
	isClosed: z.boolean().optional(),
	limit: z.number().optional(),
});
export type SearchOpportunitiesInput = z.infer<
	typeof SearchOpportunitiesInputSchema
>;
export const SearchOpportunitiesResponseSchema = RecordsResponseSchema;

export const UpdateCampaignInputSchema =
	CreateCampaignInputSchema.partial().extend({
		id: z.string(),
	});
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignInputSchema>;
export const UpdateCampaignResponseSchema = SuccessResponseSchema;
export const UpdateCampaignByIdWithJsonInputSchema = UpdateCampaignInputSchema;
export const UpdateCampaignByIdWithJsonResponseSchema = SuccessResponseSchema;

export const UpdateNoteInputSchema = CreateNoteInputSchema.partial().extend({
	id: z.string(),
});
export type UpdateNoteInput = z.infer<typeof UpdateNoteInputSchema>;
export const UpdateNoteResponseSchema = SuccessResponseSchema;
export const UpdateSpecificNoteByIdInputSchema = UpdateNoteInputSchema;
export const UpdateSpecificNoteByIdResponseSchema = SuccessResponseSchema;

export const SearchNotesInputSchema = z.object({
	title: z.string().optional(),
	body: z.string().optional(),
	parentId: z.string().optional(),
	limit: z.number().optional(),
});
export type SearchNotesInput = z.infer<typeof SearchNotesInputSchema>;
export const SearchNotesResponseSchema = RecordsResponseSchema;

export const UpdateTaskInputSchema = CreateTaskInputSchema.partial().extend({
	id: z.string(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;
export const UpdateTaskResponseSchema = SuccessResponseSchema;

export const SearchTasksInputSchema = z.object({
	subject: z.string().optional(),
	status: z.string().optional(),
	priority: z.string().optional(),
	whoId: z.string().optional(),
	whatId: z.string().optional(),
	limit: z.number().optional(),
});
export type SearchTasksInput = z.infer<typeof SearchTasksInputSchema>;
export const SearchTasksResponseSchema = RecordsResponseSchema;

export const SendEmailInputSchema = z.object({
	toAddresses: z.array(z.string()).optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
	senderType: z.string().optional(),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;
export const SendEmailResponseSchema = ResultResponseSchema;

export const SendEmailFromTemplateInputSchema = z.object({
	toAddresses: z.array(z.string()).optional(),
	templateId: z.string(),
	targetObjectId: z.string().optional(),
	senderType: z.string().optional(),
});
export type SendEmailFromTemplateInput = z.infer<
	typeof SendEmailFromTemplateInputSchema
>;
export const SendEmailFromTemplateResponseSchema = ResultResponseSchema;

export const SendMassEmailInputSchema = z.object({
	toAddresses: z.array(z.string()).optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
	templateId: z.string().optional(),
});
export type SendMassEmailInput = z.infer<typeof SendMassEmailInputSchema>;
export const SendMassEmailResponseSchema = ResultResponseSchema;

export const UploadFileInputSchema = z.object({
	title: z.string(),
	versionData: z.string(),
	pathOnClient: z.string().optional(),
	firstPublishLocationId: z.string().optional(),
});
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;
export const UploadFileResponseSchema = z
	.object({ id: z.string(), success: z.boolean().optional() })
	.passthrough();

export const UploadJobDataInputSchema = z.object({
	jobId: z.string(),
	csv: z.string(),
});
export type UploadJobDataInput = z.infer<typeof UploadJobDataInputSchema>;
export const UploadJobDataResponseSchema = SuccessResponseSchema;

export const PatchCompositeSobjectsInputSchema = z.object({
	allOrNone: z.boolean().optional(),
	records: z.array(z.record(z.string(), z.unknown())),
});
export type PatchCompositeSobjectsInput = z.infer<
	typeof PatchCompositeSobjectsInputSchema
>;
export const PatchCompositeSobjectsResponseSchema = ResultResponseSchema;

export const UpdateSobjectInputSchema = z.object({
	sobject: z.string(),
	id: z.string(),
	fields: z.record(z.string(), z.unknown()),
});
export type UpdateSobjectInput = z.infer<typeof UpdateSobjectInputSchema>;
export const UpdateSobjectResponseSchema = SuccessResponseSchema;
export const SobjectRowsUpdateInputSchema = UpdateSobjectInputSchema;
export const SobjectRowsUpdateResponseSchema = SuccessResponseSchema;

export const UpsertSobjectByExternalIdInputSchema = z.object({
	sobject: z.string(),
	fieldName: z.string(),
	fieldValue: z.string(),
	fields: z.record(z.string(), z.unknown()),
});
export type UpsertSobjectByExternalIdInput = z.infer<
	typeof UpsertSobjectByExternalIdInputSchema
>;
export const UpsertSobjectByExternalIdResponseSchema = z
	.object({
		id: z.string().optional(),
		created: z.boolean().optional(),
		success: z.boolean().optional(),
	})
	.passthrough();

export const SetUserPasswordInputSchema = z.object({
	userId: z.string(),
	password: z.string().optional(),
});
export type SetUserPasswordInput = z.infer<typeof SetUserPasswordInputSchema>;
export const SetUserPasswordResponseSchema = ResultResponseSchema;

export const GetSearchSuggestionsInputSchema = z.object({
	q: z.string(),
	sobject: z.string().optional(),
});
export type GetSearchSuggestionsInput = z.infer<
	typeof GetSearchSuggestionsInputSchema
>;
export const GetSearchSuggestionsResponseSchema = ResultResponseSchema;

export const SearchKnowledgeArticlesInputSchema = z.object({
	q: z.string(),
});
export type SearchKnowledgeArticlesInput = z.infer<
	typeof SearchKnowledgeArticlesInputSchema
>;
export const SearchKnowledgeArticlesResponseSchema = ResultResponseSchema;

export const GetParameterizedSearchInputSchema = ParameterizedSearchInputSchema;
export const GetParameterizedSearchResponseSchema =
	ParameterizedSearchResponseSchema;

export const UpdateRecordInputSchema = z.object({
	recordId: z.string(),
	apiName: z.string(),
	fields: z.record(z.string(), z.unknown()),
	ifUnmodifiedSince: z.string().optional(),
});
export type UpdateRecordInput = z.infer<typeof UpdateRecordInputSchema>;
export const UpdateRecordResponseSchema = SuccessResponseSchema;

export const UpdateFavoriteInputSchema = z.object({
	favoriteId: z.string(),
	fields: z.record(z.string(), z.unknown()),
});
export type UpdateFavoriteInput = z.infer<typeof UpdateFavoriteInputSchema>;
export const UpdateFavoriteResponseSchema = ResultResponseSchema;

export const UpdateRelatedListPreferencesInputSchema = z.object({
	relatedListId: z.string(),
	preferences: z.record(z.string(), z.unknown()),
});
export type UpdateRelatedListPreferencesInput = z.infer<
	typeof UpdateRelatedListPreferencesInputSchema
>;
export const UpdateRelatedListPreferencesResponseSchema = ResultResponseSchema;

export const UpdateListViewPreferencesInputSchema = z.object({
	sobject: z.string(),
	listViewId: z.string(),
	preferences: z.record(z.string(), z.unknown()),
});
export type UpdateListViewPreferencesInput = z.infer<
	typeof UpdateListViewPreferencesInputSchema
>;
export const UpdateListViewPreferencesResponseSchema = ResultResponseSchema;

// Map Objects
export const SalesforceEndpointInputSchemas = {
	// Accounts
	createAccount: CreateAccountInputSchema,
	getAccount: GetAccountInputSchema,
	listAccounts: ListAccountsInputSchema,
	searchAccounts: SearchAccountsInputSchema,
	updateAccount: UpdateAccountInputSchema,
	updateAccountObjectById: UpdateAccountObjectByIdInputSchema,
	deleteAccount: DeleteAccountInputSchema,
	accountCreationWithContentTypeOption:
		AccountCreationWithContentTypeOptionInputSchema,
	fetchAccountByIdWithQuery: FetchAccountByIdWithQueryInputSchema,
	removeAccountByUniqueIdentifier: RemoveAccountByUniqueIdentifierInputSchema,
	retrieveAccountDataAndErrorResponses:
		RetrieveAccountDataAndErrorResponsesInputSchema,

	// Contacts
	createContact: CreateContactInputSchema,
	getContact: GetContactInputSchema,
	listContacts: ListContactsInputSchema,
	deleteContact: DeleteContactInputSchema,
	associateContactToAccount: AssociateContactToAccountInputSchema,
	updateContact: UpdateContactInputSchema,
	updateContactById: UpdateContactByIdInputSchema,
	searchContacts: SearchContactsInputSchema,
	createNewContactWithJsonHeader: CreateNewContactWithJsonHeaderInputSchema,
	queryContactsByName: QueryContactsByNameInputSchema,
	removeASpecificContactById: RemoveASpecificContactByIdInputSchema,
	retrieveContactInfoWithStandardResponses:
		RetrieveContactInfoWithStandardResponsesInputSchema,
	getContactById: GetContactByIdInputSchema,

	// Leads
	createLead: CreateLeadInputSchema,
	getLead: GetLeadInputSchema,
	listLeads: ListLeadsInputSchema,
	deleteLead: DeleteLeadInputSchema,
	applyLeadAssignmentRules: ApplyLeadAssignmentRulesInputSchema,
	updateLead: UpdateLeadInputSchema,
	updateLeadByIdWithJsonPayload: UpdateLeadByIdWithJsonPayloadInputSchema,
	searchLeads: SearchLeadsInputSchema,
	createLeadWithSpecifiedContentType:
		CreateLeadWithSpecifiedContentTypeInputSchema,
	deleteALeadObjectByItsId: DeleteALeadObjectByItsIdInputSchema,
	retrieveLeadById: RetrieveLeadByIdInputSchema,
	retrieveLeadDataWithVariousResponses:
		RetrieveLeadDataWithVariousResponsesInputSchema,

	// Opportunities
	createOpportunity: CreateOpportunityInputSchema,
	getOpportunity: GetOpportunityInputSchema,
	listOpportunities: ListOpportunitiesInputSchema,
	deleteOpportunity: DeleteOpportunityInputSchema,
	addOpportunityLineItem: AddOpportunityLineItemInputSchema,
	updateOpportunity: UpdateOpportunityInputSchema,
	updateOpportunityById: UpdateOpportunityByIdInputSchema,
	searchOpportunities: SearchOpportunitiesInputSchema,
	cloneOpportunityWithProducts: CloneOpportunityWithProductsInputSchema,
	listPricebookEntries: ListPricebookEntriesInputSchema,
	listPricebooks: ListPricebooksInputSchema,
	createOpportunityRecord: CreateOpportunityRecordInputSchema,
	removeOpportunityById: RemoveOpportunityByIdInputSchema,
	retrieveOpportunitiesData: RetrieveOpportunitiesDataInputSchema,
	retrieveOpportunityByIdWithOptionalFields:
		RetrieveOpportunityByIdWithOptionalFieldsInputSchema,

	// Campaigns
	createCampaign: CreateCampaignInputSchema,
	getCampaign: GetCampaignInputSchema,
	listCampaigns: ListCampaignsInputSchema,
	deleteCampaign: DeleteCampaignInputSchema,
	addContactToCampaign: AddContactToCampaignInputSchema,
	updateCampaign: UpdateCampaignInputSchema,
	updateCampaignByIdWithJson: UpdateCampaignByIdWithJsonInputSchema,
	addLeadToCampaign: AddLeadToCampaignInputSchema,
	removeFromCampaign: RemoveFromCampaignInputSchema,
	searchCampaigns: SearchCampaignsInputSchema,
	createCampaignRecordViaPost: CreateCampaignRecordViaPostInputSchema,
	removeCampaignObjectById: RemoveCampaignObjectByIdInputSchema,
	retrieveCampaignDataWithErrorHandling:
		RetrieveCampaignDataWithErrorHandlingInputSchema,
	retrieveSpecificCampaignObjectDetails:
		RetrieveSpecificCampaignObjectDetailsInputSchema,

	// Notes
	createNote: CreateNoteInputSchema,
	updateNote: UpdateNoteInputSchema,
	updateSpecificNoteById: UpdateSpecificNoteByIdInputSchema,
	searchNotes: SearchNotesInputSchema,
	getNote: GetNoteInputSchema,
	listNotes: ListNotesInputSchema,
	deleteNote: DeleteNoteInputSchema,
	createNoteRecordWithContentTypeHeader:
		CreateNoteRecordWithContentTypeHeaderInputSchema,
	removeNoteObjectById: RemoveNoteObjectByIdInputSchema,
	getNoteByIdWithFields: GetNoteByIdWithFieldsInputSchema,
	retrieveNoteObjectInformation: RetrieveNoteObjectInformationInputSchema,

	// Tasks
	createTask: CreateTaskInputSchema,
	completeTask: CompleteTaskInputSchema,
	logCall: LogCallInputSchema,
	logEmailActivity: LogEmailActivityInputSchema,
	updateTask: UpdateTaskInputSchema,
	searchTasks: SearchTasksInputSchema,
	sendEmail: SendEmailInputSchema,
	sendEmailFromTemplate: SendEmailFromTemplateInputSchema,
	sendMassEmail: SendMassEmailInputSchema,

	// Jobs
	closeOrAbortJob: CloseOrAbortJobInputSchema,
	deleteJobQuery: DeleteJobQueryInputSchema,
	getJobFailedRecordResults: GetJobFailedRecordResultsInputSchema,
	getQueryJobInfo: GetQueryJobInfoInputSchema,
	getQueryJobResults: GetQueryJobResultsInputSchema,
	getJobSuccessfulRecordResults: GetJobSuccessfulRecordResultsInputSchema,
	getJobUnprocessedRecordResults: GetJobUnprocessedRecordResultsInputSchema,
	uploadJobData: UploadJobDataInputSchema,

	// SOQL / SOSL
	runSoqlQuery: RunSoqlQueryInputSchema,
	queryAll: QueryAllInputSchema,
	search: SearchInputSchema,
	executeSoslSearch: ExecuteSoslSearchInputSchema,
	toolingQuery: ToolingQueryInputSchema,
	parameterizedSearch: ParameterizedSearchInputSchema,
	postParameterizedSearch: PostParameterizedSearchInputSchema,
	getSearchLayout: GetSearchLayoutInputSchema,
	query: QueryInputSchema,
	executeSoqlQuery: ExecuteSoqlQueryInputSchema,
	getSearchSuggestions: GetSearchSuggestionsInputSchema,
	searchKnowledgeArticles: SearchKnowledgeArticlesInputSchema,
	getParameterizedSearch: GetParameterizedSearchInputSchema,

	// Composite
	postCompositeSobjects: PostCompositeSobjectsInputSchema,
	createSobjectTree: CreateSobjectTreeInputSchema,
	deleteSobjectCollections: DeleteSobjectCollectionsInputSchema,
	postCompositeGraph: PostCompositeGraphInputSchema,
	compositeGraphAction: CompositeGraphActionInputSchema,
	getABatchOfRecords: GetABatchOfRecordsInputSchema,
	getCompositeResources: GetCompositeResourcesInputSchema,
	getCompositeSobjects: GetCompositeSobjectsInputSchema,
	getSobjectCollections: GetSobjectCollectionsInputSchema,
	patchCompositeSobjects: PatchCompositeSobjectsInputSchema,

	// Metadata
	createSObjectRecord: CreateSObjectRecordInputSchema,
	cloneRecord: CloneRecordInputSchema,
	createCustomField: CreateCustomFieldInputSchema,
	createCustomObject: CreateCustomObjectInputSchema,
	deleteSobject: DeleteSobjectInputSchema,
	deleteSobjectRows: DeleteSobjectRowsInputSchema,
	getSobjects: GetSobjectsInputSchema,
	executeSobjectQuickAction: ExecuteSobjectQuickActionInputSchema,
	getApi: GetApiInputSchema,
	getChatterResources: GetChatterResourcesInputSchema,
	getSobjectPlatformaction: GetSobjectPlatformactionInputSchema,
	headQuickActions: HeadQuickActionsInputSchema,
	headSobjectsUserPassword: HeadSobjectsUserPasswordInputSchema,
	getPicklistValuesByRecordType: GetPicklistValuesByRecordTypeInputSchema,
	getAllFieldsForObject: GetAllFieldsForObjectInputSchema,
	getAllCustomObjects: GetAllCustomObjectsInputSchema,
	getSobjectsSobjectDescribeApprovallayouts:
		GetSobjectsSobjectDescribeApprovallayoutsInputSchema,
	getSobjectApprovalLayouts: GetSobjectApprovalLayoutsInputSchema,
	getChildRecords: GetChildRecordsInputSchema,
	getConsentAction: GetConsentActionInputSchema,
	headActionsCustom: HeadActionsCustomInputSchema,
	listCustomInvocableActions: ListCustomInvocableActionsInputSchema,
	getSupportedObjectsDirectory: GetSupportedObjectsDirectoryInputSchema,
	getGlobalActions: GetGlobalActionsInputSchema,
	headSobjectsGlobalDescribeLayouts:
		HeadSobjectsGlobalDescribeLayoutsInputSchema,
	getSObjectsDescribeLayoutsRecordTypeId:
		GetSObjectsDescribeLayoutsRecordTypeIdInputSchema,
	getOrgLimits: GetOrgLimitsInputSchema,
	headProcessRulesSObject: HeadProcessRulesSObjectInputSchema,
	headSobjectQuickActionDefaultValues:
		HeadSobjectQuickActionDefaultValuesInputSchema,
	getQuickActions: GetQuickActionsInputSchema,
	getRecordCounts: GetRecordCountsInputSchema,
	getSobjectRelationship: GetSobjectRelationshipInputSchema,
	getSobjectQuickActionDefaultValues:
		GetSobjectQuickActionDefaultValuesInputSchema,
	getSObjectQuickActionDefaultValues:
		GetSObjectQuickActionDefaultValuesInputSchema,
	getSobjectByExternalId: GetSobjectByExternalIdInputSchema,
	headSobjectsQuickAction: HeadSobjectsQuickActionInputSchema,
	getSObjectRecord: GetSObjectRecordInputSchema,
	headActionsStandard: HeadActionsStandardInputSchema,
	listStandardInvocableActions: ListStandardInvocableActionsInputSchema,
	getSupport: GetSupportInputSchema,
	getSupportKnowledgeArticles: GetSupportKnowledgeArticlesInputSchema,
	getTheme: GetThemeInputSchema,
	getSObjectsUpdated: GetSObjectsUpdatedInputSchema,
	getUserInfo: GetUserInfoInputSchema,
	sobjectUserPassword: SobjectUserPasswordInputSchema,
	massTransferOwnership: MassTransferOwnershipInputSchema,
	updateSobject: UpdateSobjectInputSchema,
	sobjectRowsUpdate: SobjectRowsUpdateInputSchema,
	upsertSobjectByExternalId: UpsertSobjectByExternalIdInputSchema,
	setUserPassword: SetUserPasswordInputSchema,

	// UI API
	createARecord: CreateARecordInputSchema,
	createRecordUiApi: CreateRecordUiApiInputSchema,
	getUiapiListInfoAccountAllAccounts:
		GetUiapiListInfoAccountAllAccountsInputSchema,
	getUiapiListInfoAccountSearchResult:
		GetUiapiListInfoAccountSearchResultInputSchema,
	headAppmenuSalesforce1: HeadAppmenuSalesforce1InputSchema,
	getCompactLayouts: GetCompactLayoutsInputSchema,
	getListViewActions: GetListViewActionsInputSchema,
	getUiapiListInfoAccountRecent: GetUiapiListInfoAccountRecentInputSchema,
	getUiApiListInfoRecent: GetUiApiListInfoRecentInputSchema,
	getUiapimruListInfoAccount: GetUiapimruListInfoAccountInputSchema,
	getUiApiMruListRecordsAccount: GetUiApiMruListRecordsAccountInputSchema,
	getUiapiActionsMruListAccount: GetUiapiActionsMruListAccountInputSchema,
	getMruListViewMetadata: GetMruListViewMetadataInputSchema,
	getUiApiAppsUserNavItems: GetUiApiAppsUserNavItemsInputSchema,
	getAllNavigationItems: GetAllNavigationItemsInputSchema,
	getApp: GetAppInputSchema,
	getApps: GetAppsInputSchema,
	getListViewMetadataBatch: GetListViewMetadataBatchInputSchema,
	getRelatedListPreferencesBatch: GetRelatedListPreferencesBatchInputSchema,
	getLastSelectedApp: GetLastSelectedAppInputSchema,
	getListViewMetadataByName: GetListViewMetadataByNameInputSchema,
	getListViewRecordsByName: GetListViewRecordsByNameInputSchema,
	getListViewRecordsById: GetListViewRecordsByIdInputSchema,
	listViewResults: ListViewResultsInputSchema,
	getListViewResults: GetListViewResultsInputSchema,
	getObjectListViews: GetObjectListViewsInputSchema,
	getSobjectListViews: GetSobjectListViewsInputSchema,
	getUiApiActionsLookupAccount: GetUiApiActionsLookupAccountInputSchema,
	getUiapiLookupsOpportunityAccountId:
		GetUiapiLookupsOpportunityAccountIdInputSchema,
	getLookupFieldSuggestions: GetLookupFieldSuggestionsInputSchema,
	getLookupSuggestionsOpportunityAccount:
		GetLookupSuggestionsOpportunityAccountInputSchema,
	getLookupSuggestionsCaseContact: GetLookupSuggestionsCaseContactInputSchema,
	getMruListViewRecords: GetMruListViewRecordsInputSchema,
	getPhotoActions: GetPhotoActionsInputSchema,
	getRecordUiDataAndMetadata: GetRecordUiDataAndMetadataInputSchema,
	getRecordEditPageActions: GetRecordEditPageActionsInputSchema,
	getUiApiActionsRecordRelatedList: GetUiApiActionsRecordRelatedListInputSchema,
	getRelatedListActions: GetRelatedListActionsInputSchema,
	getRelatedListRecordsContacts: GetRelatedListRecordsContactsInputSchema,
	getUiapiRelatedListPreferences: GetUiapiRelatedListPreferencesInputSchema,
	getSobjectListView: GetSobjectListViewInputSchema,
	updateRecord: UpdateRecordInputSchema,
	updateFavorite: UpdateFavoriteInputSchema,
	updateRelatedListPreferences: UpdateRelatedListPreferencesInputSchema,
	updateListViewPreferences: UpdateListViewPreferencesInputSchema,

	// Files
	getFileContent: GetFileContentInputSchema,
	getFileInformation: GetFileInformationInputSchema,
	getFileShares: GetFileSharesInputSchema,
	deleteFile: DeleteFileInputSchema,
	uploadFile: UploadFileInputSchema,

	// Analytics & Reports
	getDashboard: GetDashboardInputSchema,
	listDashboards: ListDashboardsInputSchema,
	listEmailTemplates: ListEmailTemplatesInputSchema,
	listReports: ListReportsInputSchema,
	runReport: RunReportInputSchema,
	listAnalyticsTemplates: ListAnalyticsTemplatesInputSchema,
	getReportInstance: GetReportInstanceInputSchema,
	getReport: GetReportInputSchema,
	queryReport: QueryReportInputSchema,
} as const;

export type SalesforceEndpointInputs = {
	[K in keyof typeof SalesforceEndpointInputSchemas]: z.infer<
		(typeof SalesforceEndpointInputSchemas)[K]
	>;
};

export const SalesforceEndpointOutputSchemas = {
	// Accounts
	createAccount: CreateAccountResponseSchema,
	getAccount: GetAccountResponseSchema,
	listAccounts: ListAccountsResponseSchema,
	searchAccounts: SearchAccountsResponseSchema,
	updateAccount: UpdateAccountResponseSchema,
	updateAccountObjectById: UpdateAccountObjectByIdResponseSchema,
	deleteAccount: DeleteAccountResponseSchema,
	accountCreationWithContentTypeOption:
		AccountCreationWithContentTypeOptionResponseSchema,
	fetchAccountByIdWithQuery: FetchAccountByIdWithQueryResponseSchema,
	removeAccountByUniqueIdentifier:
		RemoveAccountByUniqueIdentifierResponseSchema,
	retrieveAccountDataAndErrorResponses:
		RetrieveAccountDataAndErrorResponsesResponseSchema,

	// Contacts
	createContact: CreateContactResponseSchema,
	getContact: GetContactResponseSchema,
	listContacts: ListContactsResponseSchema,
	deleteContact: DeleteContactResponseSchema,
	associateContactToAccount: AssociateContactToAccountResponseSchema,
	updateContact: UpdateContactResponseSchema,
	updateContactById: UpdateContactByIdResponseSchema,
	searchContacts: SearchContactsResponseSchema,
	createNewContactWithJsonHeader: CreateNewContactWithJsonHeaderResponseSchema,
	queryContactsByName: QueryContactsByNameResponseSchema,
	removeASpecificContactById: RemoveASpecificContactByIdResponseSchema,
	retrieveContactInfoWithStandardResponses:
		RetrieveContactInfoWithStandardResponsesResponseSchema,
	getContactById: GetContactByIdResponseSchema,

	// Leads
	createLead: CreateLeadResponseSchema,
	getLead: GetLeadResponseSchema,
	listLeads: ListLeadsResponseSchema,
	deleteLead: DeleteLeadResponseSchema,
	applyLeadAssignmentRules: ApplyLeadAssignmentRulesResponseSchema,
	updateLead: UpdateLeadResponseSchema,
	updateLeadByIdWithJsonPayload: UpdateLeadByIdWithJsonPayloadResponseSchema,
	searchLeads: SearchLeadsResponseSchema,
	createLeadWithSpecifiedContentType:
		CreateLeadWithSpecifiedContentTypeResponseSchema,
	deleteALeadObjectByItsId: DeleteALeadObjectByItsIdResponseSchema,
	retrieveLeadById: RetrieveLeadByIdResponseSchema,
	retrieveLeadDataWithVariousResponses:
		RetrieveLeadDataWithVariousResponsesResponseSchema,

	// Opportunities
	createOpportunity: CreateOpportunityResponseSchema,
	getOpportunity: GetOpportunityResponseSchema,
	listOpportunities: ListOpportunitiesResponseSchema,
	deleteOpportunity: DeleteOpportunityResponseSchema,
	addOpportunityLineItem: AddOpportunityLineItemResponseSchema,
	updateOpportunity: UpdateOpportunityResponseSchema,
	updateOpportunityById: UpdateOpportunityByIdResponseSchema,
	searchOpportunities: SearchOpportunitiesResponseSchema,
	cloneOpportunityWithProducts: CloneOpportunityWithProductsResponseSchema,
	listPricebookEntries: ListPricebookEntriesResponseSchema,
	listPricebooks: ListPricebooksResponseSchema,
	createOpportunityRecord: CreateOpportunityRecordResponseSchema,
	removeOpportunityById: RemoveOpportunityByIdResponseSchema,
	retrieveOpportunitiesData: RetrieveOpportunitiesDataResponseSchema,
	retrieveOpportunityByIdWithOptionalFields:
		RetrieveOpportunityByIdWithOptionalFieldsResponseSchema,

	// Campaigns
	createCampaign: CreateCampaignResponseSchema,
	getCampaign: GetCampaignResponseSchema,
	listCampaigns: ListCampaignsResponseSchema,
	deleteCampaign: DeleteCampaignResponseSchema,
	addContactToCampaign: AddContactToCampaignResponseSchema,
	updateCampaign: UpdateCampaignResponseSchema,
	updateCampaignByIdWithJson: UpdateCampaignByIdWithJsonResponseSchema,
	addLeadToCampaign: AddLeadToCampaignResponseSchema,
	removeFromCampaign: RemoveFromCampaignResponseSchema,
	searchCampaigns: SearchCampaignsResponseSchema,
	createCampaignRecordViaPost: CreateCampaignRecordViaPostResponseSchema,
	removeCampaignObjectById: RemoveCampaignObjectByIdResponseSchema,
	retrieveCampaignDataWithErrorHandling:
		RetrieveCampaignDataWithErrorHandlingResponseSchema,
	retrieveSpecificCampaignObjectDetails:
		RetrieveSpecificCampaignObjectDetailsResponseSchema,

	// Notes
	createNote: CreateNoteResponseSchema,
	updateNote: UpdateNoteResponseSchema,
	updateSpecificNoteById: UpdateSpecificNoteByIdResponseSchema,
	searchNotes: SearchNotesResponseSchema,
	getNote: GetNoteResponseSchema,
	listNotes: ListNotesResponseSchema,
	deleteNote: DeleteNoteResponseSchema,
	createNoteRecordWithContentTypeHeader:
		CreateNoteRecordWithContentTypeHeaderResponseSchema,
	removeNoteObjectById: RemoveNoteObjectByIdResponseSchema,
	getNoteByIdWithFields: GetNoteByIdWithFieldsResponseSchema,
	retrieveNoteObjectInformation: RetrieveNoteObjectInformationResponseSchema,

	// Tasks
	createTask: CreateTaskResponseSchema,
	completeTask: CompleteTaskResponseSchema,
	logCall: LogCallResponseSchema,
	logEmailActivity: LogEmailActivityResponseSchema,
	updateTask: UpdateTaskResponseSchema,
	searchTasks: SearchTasksResponseSchema,
	sendEmail: SendEmailResponseSchema,
	sendEmailFromTemplate: SendEmailFromTemplateResponseSchema,
	sendMassEmail: SendMassEmailResponseSchema,

	// Jobs
	closeOrAbortJob: CloseOrAbortJobResponseSchema,
	deleteJobQuery: DeleteJobQueryResponseSchema,
	getJobFailedRecordResults: GetJobFailedRecordResultsResponseSchema,
	getQueryJobInfo: GetQueryJobInfoResponseSchema,
	getQueryJobResults: GetQueryJobResultsResponseSchema,
	getJobSuccessfulRecordResults: GetJobSuccessfulRecordResultsResponseSchema,
	getJobUnprocessedRecordResults: GetJobUnprocessedRecordResultsResponseSchema,
	uploadJobData: UploadJobDataResponseSchema,

	// SOQL / SOSL
	runSoqlQuery: RunSoqlQueryResponseSchema,
	queryAll: QueryAllResponseSchema,
	search: SearchResponseSchema,
	executeSoslSearch: ExecuteSoslSearchResponseSchema,
	toolingQuery: ToolingQueryResponseSchema,
	parameterizedSearch: ParameterizedSearchResponseSchema,
	postParameterizedSearch: PostParameterizedSearchResponseSchema,
	getSearchLayout: GetSearchLayoutResponseSchema,
	query: QueryResponseSchema,
	executeSoqlQuery: ExecuteSoqlQueryResponseSchema,
	getSearchSuggestions: GetSearchSuggestionsResponseSchema,
	searchKnowledgeArticles: SearchKnowledgeArticlesResponseSchema,
	getParameterizedSearch: GetParameterizedSearchResponseSchema,

	// Composite
	postCompositeSobjects: PostCompositeSobjectsResponseSchema,
	createSobjectTree: CreateSobjectTreeResponseSchema,
	deleteSobjectCollections: DeleteSobjectCollectionsResponseSchema,
	postCompositeGraph: PostCompositeGraphResponseSchema,
	compositeGraphAction: CompositeGraphActionResponseSchema,
	getABatchOfRecords: GetABatchOfRecordsResponseSchema,
	getCompositeResources: GetCompositeResourcesResponseSchema,
	getCompositeSobjects: GetCompositeSobjectsResponseSchema,
	getSobjectCollections: GetSobjectCollectionsResponseSchema,
	patchCompositeSobjects: PatchCompositeSobjectsResponseSchema,

	// Metadata
	createSObjectRecord: CreateSObjectRecordResponseSchema,
	cloneRecord: CloneRecordResponseSchema,
	createCustomField: CreateCustomFieldResponseSchema,
	createCustomObject: CreateCustomObjectResponseSchema,
	deleteSobject: DeleteSobjectResponseSchema,
	deleteSobjectRows: DeleteSobjectRowsResponseSchema,
	getSobjects: GetSobjectsResponseSchema,
	executeSobjectQuickAction: ExecuteSobjectQuickActionResponseSchema,
	getApi: GetApiResponseSchema,
	getChatterResources: GetChatterResourcesResponseSchema,
	getSobjectPlatformaction: GetSobjectPlatformactionResponseSchema,
	headQuickActions: HeadQuickActionsResponseSchema,
	headSobjectsUserPassword: HeadSobjectsUserPasswordResponseSchema,
	getPicklistValuesByRecordType: GetPicklistValuesByRecordTypeResponseSchema,
	getAllFieldsForObject: GetAllFieldsForObjectResponseSchema,
	getAllCustomObjects: GetAllCustomObjectsResponseSchema,
	getSobjectsSobjectDescribeApprovallayouts:
		GetSobjectsSobjectDescribeApprovallayoutsResponseSchema,
	getSobjectApprovalLayouts: GetSobjectApprovalLayoutsResponseSchema,
	getChildRecords: GetChildRecordsResponseSchema,
	getConsentAction: GetConsentActionResponseSchema,
	headActionsCustom: HeadActionsCustomResponseSchema,
	listCustomInvocableActions: ListCustomInvocableActionsResponseSchema,
	getSupportedObjectsDirectory: GetSupportedObjectsDirectoryResponseSchema,
	getGlobalActions: GetGlobalActionsResponseSchema,
	headSobjectsGlobalDescribeLayouts:
		HeadSobjectsGlobalDescribeLayoutsResponseSchema,
	getSObjectsDescribeLayoutsRecordTypeId:
		GetSObjectsDescribeLayoutsRecordTypeIdResponseSchema,
	getOrgLimits: GetOrgLimitsResponseSchema,
	headProcessRulesSObject: HeadProcessRulesSObjectResponseSchema,
	headSobjectQuickActionDefaultValues:
		HeadSobjectQuickActionDefaultValuesResponseSchema,
	getQuickActions: GetQuickActionsResponseSchema,
	getRecordCounts: GetRecordCountsResponseSchema,
	getSobjectRelationship: GetSobjectRelationshipResponseSchema,
	getSobjectQuickActionDefaultValues:
		GetSobjectQuickActionDefaultValuesResponseSchema,
	getSObjectQuickActionDefaultValues:
		GetSObjectQuickActionDefaultValuesResponseSchema,
	getSobjectByExternalId: GetSobjectByExternalIdResponseSchema,
	headSobjectsQuickAction: HeadSobjectsQuickActionResponseSchema,
	getSObjectRecord: GetSObjectRecordResponseSchema,
	headActionsStandard: HeadActionsStandardResponseSchema,
	listStandardInvocableActions: ListStandardInvocableActionsResponseSchema,
	getSupport: GetSupportResponseSchema,
	getSupportKnowledgeArticles: GetSupportKnowledgeArticlesResponseSchema,
	getTheme: GetThemeResponseSchema,
	getSObjectsUpdated: GetSObjectsUpdatedResponseSchema,
	getUserInfo: GetUserInfoResponseSchema,
	sobjectUserPassword: SobjectUserPasswordResponseSchema,
	massTransferOwnership: MassTransferOwnershipResponseSchema,
	updateSobject: UpdateSobjectResponseSchema,
	sobjectRowsUpdate: SobjectRowsUpdateResponseSchema,
	upsertSobjectByExternalId: UpsertSobjectByExternalIdResponseSchema,
	setUserPassword: SetUserPasswordResponseSchema,

	// UI API
	createARecord: CreateARecordResponseSchema,
	createRecordUiApi: CreateRecordUiApiResponseSchema,
	getUiapiListInfoAccountAllAccounts:
		GetUiapiListInfoAccountAllAccountsResponseSchema,
	getUiapiListInfoAccountSearchResult:
		GetUiapiListInfoAccountSearchResultResponseSchema,
	headAppmenuSalesforce1: HeadAppmenuSalesforce1ResponseSchema,
	getCompactLayouts: GetCompactLayoutsResponseSchema,
	getListViewActions: GetListViewActionsResponseSchema,
	getUiapiListInfoAccountRecent: GetUiapiListInfoAccountRecentResponseSchema,
	getUiApiListInfoRecent: GetUiApiListInfoRecentResponseSchema,
	getUiapimruListInfoAccount: GetUiapimruListInfoAccountResponseSchema,
	getUiApiMruListRecordsAccount: GetUiApiMruListRecordsAccountResponseSchema,
	getUiapiActionsMruListAccount: GetUiapiActionsMruListAccountResponseSchema,
	getMruListViewMetadata: GetMruListViewMetadataResponseSchema,
	getUiApiAppsUserNavItems: GetUiApiAppsUserNavItemsResponseSchema,
	getAllNavigationItems: GetAllNavigationItemsResponseSchema,
	getApp: GetAppResponseSchema,
	getApps: GetAppsResponseSchema,
	getListViewMetadataBatch: GetListViewMetadataBatchResponseSchema,
	getRelatedListPreferencesBatch: GetRelatedListPreferencesBatchResponseSchema,
	getLastSelectedApp: GetLastSelectedAppResponseSchema,
	getListViewMetadataByName: GetListViewMetadataByNameResponseSchema,
	getListViewRecordsByName: GetListViewRecordsByNameResponseSchema,
	getListViewRecordsById: GetListViewRecordsByIdResponseSchema,
	listViewResults: ListViewResultsResponseSchema,
	getListViewResults: GetListViewResultsResponseSchema,
	getObjectListViews: GetObjectListViewsResponseSchema,
	getSobjectListViews: GetSobjectListViewsResponseSchema,
	getUiApiActionsLookupAccount: GetUiApiActionsLookupAccountResponseSchema,
	getUiapiLookupsOpportunityAccountId:
		GetUiapiLookupsOpportunityAccountIdResponseSchema,
	getLookupFieldSuggestions: GetLookupFieldSuggestionsResponseSchema,
	getLookupSuggestionsOpportunityAccount:
		GetLookupSuggestionsOpportunityAccountResponseSchema,
	getLookupSuggestionsCaseContact:
		GetLookupSuggestionsCaseContactResponseSchema,
	getMruListViewRecords: GetMruListViewRecordsResponseSchema,
	getPhotoActions: GetPhotoActionsResponseSchema,
	getRecordUiDataAndMetadata: GetRecordUiDataAndMetadataResponseSchema,
	getRecordEditPageActions: GetRecordEditPageActionsResponseSchema,
	getUiApiActionsRecordRelatedList:
		GetUiApiActionsRecordRelatedListResponseSchema,
	getRelatedListActions: GetRelatedListActionsResponseSchema,
	getRelatedListRecordsContacts: GetRelatedListRecordsContactsResponseSchema,
	getUiapiRelatedListPreferences: GetUiapiRelatedListPreferencesResponseSchema,
	getSobjectListView: GetSobjectListViewResponseSchema,
	updateRecord: UpdateRecordResponseSchema,
	updateFavorite: UpdateFavoriteResponseSchema,
	updateRelatedListPreferences: UpdateRelatedListPreferencesResponseSchema,
	updateListViewPreferences: UpdateListViewPreferencesResponseSchema,

	// Files
	getFileContent: GetFileContentResponseSchema,
	getFileInformation: GetFileInformationResponseSchema,
	getFileShares: GetFileSharesResponseSchema,
	deleteFile: DeleteFileResponseSchema,
	uploadFile: UploadFileResponseSchema,

	// Analytics & Reports
	getDashboard: GetDashboardResponseSchema,
	listDashboards: ListDashboardsResponseSchema,
	listEmailTemplates: ListEmailTemplatesResponseSchema,
	listReports: ListReportsResponseSchema,
	runReport: RunReportResponseSchema,
	listAnalyticsTemplates: ListAnalyticsTemplatesResponseSchema,
	getReportInstance: GetReportInstanceResponseSchema,
	getReport: GetReportResponseSchema,
	queryReport: QueryReportResponseSchema,
} as const;

export type SalesforceEndpointOutputs = {
	[K in keyof typeof SalesforceEndpointOutputSchemas]: z.infer<
		(typeof SalesforceEndpointOutputSchemas)[K]
	>;
};
