import { z } from 'zod';
import { BetterProposalsCover } from '../schema';

// ============================================================================
// Common & Entity Schemas
// ============================================================================

export const PaginationQuerySchema = z.object({
	page: z.union([z.number(), z.string()]).optional(),
	per_page: z.union([z.number(), z.string()]).optional(),
});

export const ProposalFilterQuerySchema = PaginationQuerySchema.extend({
	type: z.union([z.number(), z.string()]).optional(),
});

export const ContactSchema = z
	.object({
		Email: z.string().optional().nullable(),
		FirstName: z.string().optional().nullable(),
		Surname: z.string().optional().nullable(),
		Link: z.string().optional().nullable(),
		Signature: z
			.union([z.boolean(), z.string(), z.number()])
			.optional()
			.nullable(),
	})
	.passthrough();

export const PriceTableItemSchema = z
	.object({
		ID: z.union([z.string(), z.number()]).optional().nullable(),
		Label: z.string().optional().nullable(),
		Description: z.string().optional().nullable(),
		Date: z.string().optional().nullable(),
		PriceType: z.string().optional().nullable(),
		UnitCost: z.string().optional().nullable(),
		Cost: z.string().optional().nullable(),
		RecurringType: z.string().optional().nullable(),
		MonthlyCost: z.string().optional().nullable(),
		ShowQuantity: z.boolean().optional().nullable(),
		CanClientSetQuantity: z.boolean().optional().nullable(),
		Quantity: z.union([z.string(), z.number()]).optional().nullable(),
		isQuantityLimited: z.boolean().optional().nullable(),
		QuantityMin: z.union([z.string(), z.number()]).optional().nullable(),
		QuantityMax: z.union([z.string(), z.number()]).optional().nullable(),
		Optional: z.boolean().optional().nullable(),
		Selected: z.boolean().optional().nullable(),
		Selectable: z.boolean().optional().nullable(),
		Discount: z
			.union([z.boolean(), z.string(), z.number()])
			.optional()
			.nullable(),
		DiscountType: z
			.union([z.boolean(), z.string(), z.number()])
			.optional()
			.nullable(),
		DiscountAmount: z.string().optional().nullable(),
		TableDiscount: z
			.union([z.boolean(), z.string(), z.number()])
			.optional()
			.nullable(),
		TableDiscountType: z
			.union([z.boolean(), z.string(), z.number()])
			.optional()
			.nullable(),
		TableDiscountAmount: z.string().optional().nullable(),
		TaxExemptionStatus: z.boolean().optional().nullable(),
		DisplayOrder: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.passthrough();

export const PriceTableSchema = z
	.object({
		ID: z.union([z.string(), z.number()]).optional().nullable(),
		Title: z.string().optional().nullable(),
		Show: z.boolean().optional().nullable(),
		ForceClientChoice: z.boolean().optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		DisplayOrder: z.union([z.string(), z.number()]).optional().nullable(),
		Items: z.array(PriceTableItemSchema).optional().nullable(),
	})
	.passthrough();

export const ProposalSummarySchema = z
	.object({
		ID: z.union([z.string(), z.number()]),
		AssignedTo: z.union([z.string(), z.number()]).optional().nullable(),
		BrandID: z.union([z.string(), z.number()]).optional().nullable(),
		ViewType: z.string().optional().nullable(),
		CurrencyCode: z.string().optional().nullable(),
		Tax: z.union([z.string(), z.number()]).optional().nullable(),
		TaxLabel: z.string().optional().nullable(),
		TaxAmount: z.string().optional().nullable(),
		TaxPercentage: z.string().optional().nullable(),
		TaxName: z.string().optional().nullable(),
		Amount: z.string().optional().nullable(),
		AmountDesc: z.string().optional().nullable(),
		Paid: z.union([z.string(), z.number()]).optional().nullable(),
		DatePaid: z.string().optional().nullable(),
		CoverID: z.union([z.string(), z.number()]).optional().nullable(),
		TypeID: z.union([z.string(), z.number()]).optional().nullable(),
		Description: z.string().optional().nullable(),
		SubjectLine: z.string().optional().nullable(),
		PersonalMessage: z.string().optional().nullable(),
		CustomerJourneyID: z.union([z.string(), z.number()]).optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		SignOrder: z.union([z.string(), z.number()]).optional().nullable(),
		OriginalDateSent: z.string().optional().nullable(),
		DateSent: z.string().optional().nullable(),
		QuoteID: z.union([z.string(), z.number()]).optional().nullable(),
		Signed: z.union([z.string(), z.number()]).optional().nullable(),
		SignedName: z.string().optional().nullable(),
		SignedDate: z.string().optional().nullable(),
		SignedTime: z.string().optional().nullable(),
		EditLock: z.union([z.string(), z.number()]).optional().nullable(),
		ProposalPassword: z.string().optional().nullable(),
		CompanyName: z.string().optional().nullable(),
		CompanyCRMID: z.string().optional().nullable(),
		OneOffTotal: z.string().optional().nullable(),
		MonthlyTotal: z.string().optional().nullable(),
		QuarterlyTotal: z.string().optional().nullable(),
		AnnualTotal: z.string().optional().nullable(),
		SignedFirstName: z.string().optional().nullable(),
		SignedSurname: z.string().optional().nullable(),
		SignedEmail: z.string().optional().nullable(),
		CurrencyName: z.string().optional().nullable(),
		CurrencySymbol: z.string().optional().nullable(),
		CRMOpportunityID: z.union([z.string(), z.number()]).optional().nullable(),
		Preview: z.string().optional().nullable(),
		ProposalView: z.string().optional().nullable(),
		Contacts: z.array(ContactSchema).optional().nullable(),
		PriceTables: z.array(PriceTableSchema).optional().nullable(),
	})
	.passthrough();

export const ProposalDetailSchema = ProposalSummarySchema;

export const TemplateSchema = z
	.object({
		ID: z.union([z.string(), z.number()]),
		AccountID: z.union([z.string(), z.number()]).optional().nullable(),
		CoverID: z.union([z.string(), z.number()]).optional().nullable(),
		BrandID: z.union([z.string(), z.number()]).optional().nullable(),
		TemplateName: z.string().optional().nullable(),
		Description: z.string().optional().nullable(),
		QuoteAmount: z.string().optional().nullable(),
		MonthlyAmount: z.string().optional().nullable(),
		QuarterlyAmount: z.string().optional().nullable(),
		AnnualAmount: z.string().optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		CreatedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateEdited: z.string().optional().nullable(),
		EditedBy: z.union([z.string(), z.number()]).optional().nullable(),
		Default: z.union([z.string(), z.number()]).optional().nullable(),
		Deleted: z.union([z.string(), z.number()]).optional().nullable(),
		IndustryID: z.union([z.string(), z.number()]).optional().nullable(),
		SampleTemplate: z.union([z.string(), z.number()]).optional().nullable(),
		FromMarketplace: z.union([z.string(), z.number()]).optional().nullable(),
		CategoryID: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.passthrough();

export const DocumentTypeSchema = z
	.object({
		ID: z.union([z.string(), z.number()]),
		AccountID: z.union([z.string(), z.number()]).optional().nullable(),
		TypeName: z.string(),
		TypeIcon: z.string().optional().nullable(),
		TypeColour: z.string().optional().nullable(),
		TypeNameSingular: z.string().optional().nullable(),
		CategoryIcon: z.string().optional().nullable(),
		DisplayOrder: z.union([z.string(), z.number()]).optional().nullable(),
		NumberOfOutstandingDocuments: z.number().optional().nullable(),
		NumberOfTemplates: z.number().optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		CreatedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateEdited: z.string().optional().nullable(),
		EditedBy: z.union([z.string(), z.number()]).optional().nullable(),
		Deleted: z.union([z.string(), z.number()]).optional().nullable(),
		DateDeleted: z.string().optional().nullable(),
		DeletedBy: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.passthrough();

export const QuoteSchema = z
	.object({
		ID: z.union([z.string(), z.number()]),
		AccountID: z.union([z.string(), z.number()]).optional().nullable(),
		Status: z.union([z.string(), z.number()]).optional().nullable(),
		MarkDead: z.union([z.string(), z.number()]).optional().nullable(),
		MarkedDeadBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateMarkedDead: z.string().optional().nullable(),
		CompanyID: z.union([z.string(), z.number()]).optional().nullable(),
		QuoteAmount: z.string().optional().nullable(),
		MonthlyAmount: z.string().optional().nullable(),
		QuarterlyAmount: z.string().optional().nullable(),
		AnnualAmount: z.string().optional().nullable(),
		VatAmount: z.string().optional().nullable(),
		QuoteTotal: z.string().optional().nullable(),
		CreatedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		DateEdited: z.string().optional().nullable(),
		EditedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateAccepted: z.string().optional().nullable(),
		DateCompleted: z.string().optional().nullable(),
		Archived: z.union([z.string(), z.number()]).optional().nullable(),
		ArchivedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateArchived: z.string().optional().nullable(),
		Deleted: z.union([z.string(), z.number()]).optional().nullable(),
		DeletedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateDeleted: z.string().optional().nullable(),
	})
	.passthrough();

export const CompanySchema = z
	.object({
		ID: z.union([z.string(), z.number()]),
		AccountID: z.union([z.string(), z.number()]).optional().nullable(),
		DemoCompany: z.union([z.string(), z.number()]).optional().nullable(),
		CompanyName: z.string(),
		CompanyCRMID: z.string().optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		CreatedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateEdited: z.string().optional().nullable(),
		EditedBy: z.union([z.string(), z.number()]).optional().nullable(),
		Deleted: z.union([z.string(), z.number()]).optional().nullable(),
		DeletedBy: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.passthrough();

export const CurrencySchema = z
	.object({
		ID: z.union([z.string(), z.number()]),
		CurrencyName: z.string().optional().nullable(),
		CurrencySymbol: z.string().optional().nullable(),
		CurrencyCode: z.string().optional().nullable(),
		ZeroDecimal: z.union([z.string(), z.number()]).optional().nullable(),
		StripeSupport: z.union([z.string(), z.number()]).optional().nullable(),
		PaypalSupport: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.passthrough();

export const SettingsSchema = z
	.object({
		ID: z.union([z.string(), z.number()]).optional().nullable(),
		AccountID: z.union([z.string(), z.number()]).optional().nullable(),
		CurrencyID: z.union([z.string(), z.number()]).optional().nullable(),
		Tax: z.union([z.string(), z.number()]).optional().nullable(),
		TaxLabel: z.string().optional().nullable(),
		TaxAmount: z.string().optional().nullable(),
		TimeZone: z.string().optional().nullable(),
		CustomerJourneysActive: z
			.union([z.string(), z.number()])
			.optional()
			.nullable(),
		CustomerJourneysDefault: z
			.union([z.string(), z.number()])
			.optional()
			.nullable(),
		EditedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateEdited: z.string().optional().nullable(),
	})
	.passthrough();

export const BrandSettingsSchema = z
	.object({
		ID: z.union([z.string(), z.number()]).optional().nullable(),
		AccountID: z.union([z.string(), z.number()]).optional().nullable(),
		Default: z.union([z.string(), z.number()]).optional().nullable(),
		PageTitle: z.string().optional().nullable(),
		Name: z.string().optional().nullable(),
		CurrencyID: z.union([z.string(), z.number()]).optional().nullable(),
		Tax: z.union([z.string(), z.number()]).optional().nullable(),
		TaxLabel: z.string().optional().nullable(),
		TaxAmount: z.string().optional().nullable(),
		ShowBadge: z.union([z.string(), z.number()]).optional().nullable(),
		CompanyName: z.string().optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		CreatedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateEdited: z.string().optional().nullable(),
		EditedBy: z.union([z.string(), z.number()]).optional().nullable(),
		Deleted: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.passthrough();

export const MergeTagSchema = z
	.object({
		ID: z.union([z.string(), z.number()]),
		AccountID: z.union([z.string(), z.number()]).optional().nullable(),
		Name: z.string().optional().nullable(),
		Tag: z.string().optional().nullable(),
		Fallback: z.string().optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		CreatedBy: z.union([z.string(), z.number()]).optional().nullable(),
		DateEdited: z.string().optional().nullable(),
		EditedBy: z.union([z.string(), z.number()]).optional().nullable(),
		Archived: z.union([z.string(), z.number()]).optional().nullable(),
		DateArchived: z.string().optional().nullable(),
		ArchivedBy: z.union([z.string(), z.number()]).optional().nullable(),
		CRMSync: z.union([z.string(), z.number()]).optional().nullable(),
		CRMTagName: z.string().optional().nullable(),
		CRMTagId: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.passthrough();

// ============================================================================
// Endpoint Inputs and Outputs
// ============================================================================

// 1. BETTER_PROPOSALS_GET_ALL_PROPOSALS
export const ProposalsListInputSchema = ProposalFilterQuerySchema.optional();
export const ProposalsListResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(ProposalSummarySchema),
	})
	.passthrough();

// 2. BETTER_PROPOSALS_GET_NEW_PROPOSALS
export const ProposalsGetNewInputSchema = ProposalFilterQuerySchema.optional();
export const ProposalsGetNewResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(ProposalSummarySchema),
	})
	.passthrough();

// 3. BETTER_PROPOSALS_GET_OPENED_PROPOSALS
export const ProposalsGetOpenedInputSchema =
	ProposalFilterQuerySchema.optional();
export const ProposalsGetOpenedResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(ProposalSummarySchema),
	})
	.passthrough();

// 4. BETTER_PROPOSALS_GET_SENT_PROPOSALS
export const ProposalsGetSentInputSchema = ProposalFilterQuerySchema.optional();
export const ProposalsGetSentResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(ProposalSummarySchema),
	})
	.passthrough();

// 5. BETTER_PROPOSALS_GET_SIGNED_PROPOSALS
export const ProposalsGetSignedInputSchema =
	ProposalFilterQuerySchema.optional();
export const ProposalsGetSignedResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(ProposalSummarySchema),
	})
	.passthrough();

// 6. BETTER_PROPOSALS_GET_PAID_PROPOSALS
export const ProposalsGetPaidInputSchema = ProposalFilterQuerySchema.optional();
export const ProposalsGetPaidResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(ProposalSummarySchema),
	})
	.passthrough();

// 7. BETTER_PROPOSALS_GET_PROPOSAL
export const ProposalsGetInputSchema = z.object({
	proposal_id: z.union([z.string(), z.number()]),
});
export const ProposalsGetResponseSchema = z
	.object({
		status: z.string(),
		data: ProposalDetailSchema,
	})
	.passthrough();

// 8. BETTER_PROPOSALS_GET_PROPOSAL_COUNT
export const ProposalsGetCountInputSchema = z.object({}).optional();
export const ProposalsGetCountResponseSchema = z
	.object({
		status: z.string(),
		count: z.number(),
	})
	.passthrough();

// 9. BETTER_PROPOSALS_CREATE_PROPOSAL_COVER
export const ProposalsCreateCoverInputSchema = z.object({
	BrandID: z.union([z.string(), z.number()]).optional(),
	CoverName: z.string().optional(),
	BGColour: z.union([z.string(), z.number()]).optional(),
	Headline: z.string().optional(),
	Subheader: z.string().optional(),
	TextColour: z.string().optional(),
	TextAlign: z.enum(['left', 'center', 'right']).or(z.string()).optional(),
	ButtonStyle: z.string().optional(),
	ButtonText: z.string().optional(),
});
export const ProposalsCreateCoverResponseSchema = z
	.object({
		status: z.string(),
		data: BetterProposalsCover.optional(),
	})
	.passthrough();

// 10. BETTER_PROPOSALS_GET_ALL_TEMPLATES
export const TemplatesListInputSchema = PaginationQuerySchema.optional();
export const TemplatesListResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(TemplateSchema),
	})
	.passthrough();

// 11. BETTER_PROPOSALS_GET_TEMPLATE
export const TemplatesGetInputSchema = z.object({
	template_id: z.union([z.string(), z.number()]),
});
export const TemplatesGetResponseSchema = z
	.object({
		status: z.string(),
		// Official missing-id responses return data: [] instead of an object.
		data: TemplateSchema.or(z.array(z.unknown())),
	})
	.passthrough();

// 12. BETTER_PROPOSALS_GET_ALL_DOCUMENT_TYPES
export const DocumentTypesListInputSchema = PaginationQuerySchema.optional();
export const DocumentTypesListResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(DocumentTypeSchema),
	})
	.passthrough();

// 13. BETTER_PROPOSALS_CREATE_DOCUMENT_TYPE
export const DocumentTypesCreateInputSchema = z.object({
	TypeName: z.string(),
	TypeColour: z.string().optional(),
});
export const DocumentTypesCreateResponseSchema = z
	.object({
		status: z.string(),
		data: DocumentTypeSchema,
	})
	.passthrough();

// 14. BETTER_PROPOSALS_GET_ALL_QUOTES
export const QuotesListInputSchema = PaginationQuerySchema.optional();
export const QuotesListResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(QuoteSchema),
	})
	.passthrough();

// 15. BETTER_PROPOSALS_GET_QUOTE
export const QuotesGetInputSchema = z.object({
	quote_id: z.union([z.string(), z.number()]),
});
export const QuotesGetResponseSchema = z
	.object({
		status: z.string(),
		// Official missing-id responses return data: [] instead of an object.
		data: QuoteSchema.or(z.array(z.unknown())),
	})
	.passthrough();

// 16. BETTER_PROPOSALS_GET_ALL_COMPANIES
export const CompaniesListInputSchema = PaginationQuerySchema.optional();
export const CompaniesListResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(CompanySchema),
	})
	.passthrough();

// 17. BETTER_PROPOSALS_GET_COMPANY
export const CompaniesGetInputSchema = z.object({
	company_id: z.union([z.string(), z.number()]),
});
export const CompaniesGetResponseSchema = z
	.object({
		status: z.string(),
		data: CompanySchema,
	})
	.passthrough();

// 18. BETTER_PROPOSALS_CREATE_COMPANY
export const CompaniesCreateInputSchema = z.object({
	CompanyName: z.string(),
});
export const CompaniesCreateResponseSchema = z
	.object({
		status: z.string(),
		data: CompanySchema.or(z.record(z.string(), z.unknown())),
	})
	.passthrough();

// 19. BETTER_PROPOSALS_GET_ALL_CURRENCIES
export const CurrenciesListInputSchema = PaginationQuerySchema.optional();
export const CurrenciesListResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(CurrencySchema),
	})
	.passthrough();

// 20. BETTER_PROPOSALS_GET_CURRENCY
export const CurrenciesGetInputSchema = z.object({
	currency_id: z.union([z.string(), z.number()]),
});
export const CurrenciesGetResponseSchema = z
	.object({
		status: z.string(),
		data: CurrencySchema,
	})
	.passthrough();

// 21. BETTER_PROPOSALS_GET_SETTINGS
export const SettingsGetInputSchema = z.object({}).optional();
export const SettingsGetResponseSchema = z
	.object({
		status: z.string(),
		data: SettingsSchema,
	})
	.passthrough();

// 22. BETTER_PROPOSALS_GET_BRAND_SETTINGS
export const SettingsGetBrandInputSchema = z.object({}).optional();
export const SettingsGetBrandResponseSchema = z
	.object({
		status: z.string(),
		data: BrandSettingsSchema,
	})
	.passthrough();

// 23. BETTER_PROPOSALS_LIST_MERGE_TAGS
export const SettingsListMergeTagsInputSchema =
	PaginationQuerySchema.optional();
export const SettingsListMergeTagsResponseSchema = z
	.object({
		status: z.string(),
		data: z.array(MergeTagSchema),
	})
	.passthrough();

// ============================================================================
// Types
// ============================================================================

export type ProposalsListInput = z.infer<typeof ProposalsListInputSchema>;
export type ProposalsListResponse = z.infer<typeof ProposalsListResponseSchema>;

export type ProposalsGetNewInput = z.infer<typeof ProposalsGetNewInputSchema>;
export type ProposalsGetNewResponse = z.infer<
	typeof ProposalsGetNewResponseSchema
>;

export type ProposalsGetOpenedInput = z.infer<
	typeof ProposalsGetOpenedInputSchema
>;
export type ProposalsGetOpenedResponse = z.infer<
	typeof ProposalsGetOpenedResponseSchema
>;

export type ProposalsGetSentInput = z.infer<typeof ProposalsGetSentInputSchema>;
export type ProposalsGetSentResponse = z.infer<
	typeof ProposalsGetSentResponseSchema
>;

export type ProposalsGetSignedInput = z.infer<
	typeof ProposalsGetSignedInputSchema
>;
export type ProposalsGetSignedResponse = z.infer<
	typeof ProposalsGetSignedResponseSchema
>;

export type ProposalsGetPaidInput = z.infer<typeof ProposalsGetPaidInputSchema>;
export type ProposalsGetPaidResponse = z.infer<
	typeof ProposalsGetPaidResponseSchema
>;

export type ProposalsGetInput = z.infer<typeof ProposalsGetInputSchema>;
export type ProposalsGetResponse = z.infer<typeof ProposalsGetResponseSchema>;

export type ProposalsGetCountInput = z.infer<
	typeof ProposalsGetCountInputSchema
>;
export type ProposalsGetCountResponse = z.infer<
	typeof ProposalsGetCountResponseSchema
>;

export type ProposalsCreateCoverInput = z.infer<
	typeof ProposalsCreateCoverInputSchema
>;
export type ProposalsCreateCoverResponse = z.infer<
	typeof ProposalsCreateCoverResponseSchema
>;

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;
export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;
export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

export type DocumentTypesListInput = z.infer<
	typeof DocumentTypesListInputSchema
>;
export type DocumentTypesListResponse = z.infer<
	typeof DocumentTypesListResponseSchema
>;

export type DocumentTypesCreateInput = z.infer<
	typeof DocumentTypesCreateInputSchema
>;
export type DocumentTypesCreateResponse = z.infer<
	typeof DocumentTypesCreateResponseSchema
>;

export type QuotesListInput = z.infer<typeof QuotesListInputSchema>;
export type QuotesListResponse = z.infer<typeof QuotesListResponseSchema>;

export type QuotesGetInput = z.infer<typeof QuotesGetInputSchema>;
export type QuotesGetResponse = z.infer<typeof QuotesGetResponseSchema>;

export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;
export type CompaniesListResponse = z.infer<typeof CompaniesListResponseSchema>;

export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;
export type CompaniesGetResponse = z.infer<typeof CompaniesGetResponseSchema>;

export type CompaniesCreateInput = z.infer<typeof CompaniesCreateInputSchema>;
export type CompaniesCreateResponse = z.infer<
	typeof CompaniesCreateResponseSchema
>;

export type CurrenciesListInput = z.infer<typeof CurrenciesListInputSchema>;
export type CurrenciesListResponse = z.infer<
	typeof CurrenciesListResponseSchema
>;

export type CurrenciesGetInput = z.infer<typeof CurrenciesGetInputSchema>;
export type CurrenciesGetResponse = z.infer<typeof CurrenciesGetResponseSchema>;

export type SettingsGetInput = z.infer<typeof SettingsGetInputSchema>;
export type SettingsGetResponse = z.infer<typeof SettingsGetResponseSchema>;

export type SettingsGetBrandInput = z.infer<typeof SettingsGetBrandInputSchema>;
export type SettingsGetBrandResponse = z.infer<
	typeof SettingsGetBrandResponseSchema
>;

export type SettingsListMergeTagsInput = z.infer<
	typeof SettingsListMergeTagsInputSchema
>;
export type SettingsListMergeTagsResponse = z.infer<
	typeof SettingsListMergeTagsResponseSchema
>;

// Endpoint input & output map
export type BetterProposalsEndpointInputs = {
	proposalsList: ProposalsListInput;
	proposalsGetNew: ProposalsGetNewInput;
	proposalsGetOpened: ProposalsGetOpenedInput;
	proposalsGetSent: ProposalsGetSentInput;
	proposalsGetSigned: ProposalsGetSignedInput;
	proposalsGetPaid: ProposalsGetPaidInput;
	proposalsGet: ProposalsGetInput;
	proposalsGetCount: ProposalsGetCountInput;
	proposalsCreateCover: ProposalsCreateCoverInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	documentTypesList: DocumentTypesListInput;
	documentTypesCreate: DocumentTypesCreateInput;
	quotesList: QuotesListInput;
	quotesGet: QuotesGetInput;
	companiesList: CompaniesListInput;
	companiesGet: CompaniesGetInput;
	companiesCreate: CompaniesCreateInput;
	currenciesList: CurrenciesListInput;
	currenciesGet: CurrenciesGetInput;
	settingsGet: SettingsGetInput;
	settingsGetBrand: SettingsGetBrandInput;
	settingsListMergeTags: SettingsListMergeTagsInput;
};

export type BetterProposalsEndpointOutputs = {
	proposalsList: ProposalsListResponse;
	proposalsGetNew: ProposalsGetNewResponse;
	proposalsGetOpened: ProposalsGetOpenedResponse;
	proposalsGetSent: ProposalsGetSentResponse;
	proposalsGetSigned: ProposalsGetSignedResponse;
	proposalsGetPaid: ProposalsGetPaidResponse;
	proposalsGet: ProposalsGetResponse;
	proposalsGetCount: ProposalsGetCountResponse;
	proposalsCreateCover: ProposalsCreateCoverResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplatesGetResponse;
	documentTypesList: DocumentTypesListResponse;
	documentTypesCreate: DocumentTypesCreateResponse;
	quotesList: QuotesListResponse;
	quotesGet: QuotesGetResponse;
	companiesList: CompaniesListResponse;
	companiesGet: CompaniesGetResponse;
	companiesCreate: CompaniesCreateResponse;
	currenciesList: CurrenciesListResponse;
	currenciesGet: CurrenciesGetResponse;
	settingsGet: SettingsGetResponse;
	settingsGetBrand: SettingsGetBrandResponse;
	settingsListMergeTags: SettingsListMergeTagsResponse;
};

export const BetterProposalsEndpointInputSchemas = {
	proposalsList: ProposalsListInputSchema,
	proposalsGetNew: ProposalsGetNewInputSchema,
	proposalsGetOpened: ProposalsGetOpenedInputSchema,
	proposalsGetSent: ProposalsGetSentInputSchema,
	proposalsGetSigned: ProposalsGetSignedInputSchema,
	proposalsGetPaid: ProposalsGetPaidInputSchema,
	proposalsGet: ProposalsGetInputSchema,
	proposalsGetCount: ProposalsGetCountInputSchema,
	proposalsCreateCover: ProposalsCreateCoverInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	documentTypesList: DocumentTypesListInputSchema,
	documentTypesCreate: DocumentTypesCreateInputSchema,
	quotesList: QuotesListInputSchema,
	quotesGet: QuotesGetInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesCreate: CompaniesCreateInputSchema,
	currenciesList: CurrenciesListInputSchema,
	currenciesGet: CurrenciesGetInputSchema,
	settingsGet: SettingsGetInputSchema,
	settingsGetBrand: SettingsGetBrandInputSchema,
	settingsListMergeTags: SettingsListMergeTagsInputSchema,
} as const;

export const BetterProposalsEndpointOutputSchemas = {
	proposalsList: ProposalsListResponseSchema,
	proposalsGetNew: ProposalsGetNewResponseSchema,
	proposalsGetOpened: ProposalsGetOpenedResponseSchema,
	proposalsGetSent: ProposalsGetSentResponseSchema,
	proposalsGetSigned: ProposalsGetSignedResponseSchema,
	proposalsGetPaid: ProposalsGetPaidResponseSchema,
	proposalsGet: ProposalsGetResponseSchema,
	proposalsGetCount: ProposalsGetCountResponseSchema,
	proposalsCreateCover: ProposalsCreateCoverResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	documentTypesList: DocumentTypesListResponseSchema,
	documentTypesCreate: DocumentTypesCreateResponseSchema,
	quotesList: QuotesListResponseSchema,
	quotesGet: QuotesGetResponseSchema,
	companiesList: CompaniesListResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	companiesCreate: CompaniesCreateResponseSchema,
	currenciesList: CurrenciesListResponseSchema,
	currenciesGet: CurrenciesGetResponseSchema,
	settingsGet: SettingsGetResponseSchema,
	settingsGetBrand: SettingsGetBrandResponseSchema,
	settingsListMergeTags: SettingsListMergeTagsResponseSchema,
} as const;
