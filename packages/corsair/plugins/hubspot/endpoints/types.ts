import { z } from 'zod';

const ContactsGetInputSchema = z.object({
	contactId: z.string(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
	idProperty: z.string().optional(),
});

const ContactsGetManyInputSchema = z.object({
	limit: z.number().optional(),
	after: z.string().optional(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
});

const ContactsCreateOrUpdateInputSchema = z.object({
	properties: z.record(z.string(), z.string()).optional(),
	associations: z
		.array(
			z.object({
				to: z.object({ id: z.string() }),
				types: z.array(
					z.object({
						associationCategory: z.string(),
						associationTypeId: z.number(),
					}),
				),
			}),
		)
		.optional(),
});

const ContactsDeleteInputSchema = z.object({
	contactId: z.string(),
});

const ContactsGetRecentlyCreatedInputSchema = z.object({
	count: z.number().optional(),
	after: z.string().optional(),
	since: z.string().optional(),
});

const ContactsGetRecentlyUpdatedInputSchema = z.object({
	count: z.number().optional(),
	after: z.string().optional(),
	since: z.string().optional(),
});

const FilterOperator = z.enum([
	'BETWEEN',
	'CONTAINS_TOKEN',
	'EQ',
	'GT',
	'GTE',
	'HAS_PROPERTY',
	'IN',
	'LT',
	'LTE',
	'NEQ',
	'NOT_CONTAINS_TOKEN',
	'NOT_HAS_PROPERTY',
	'NOT_IN',
]);

const FilterSchema = z.object({
	operator: FilterOperator,
	propertyName: z.string(),
	highValue: z.string().optional(),
	value: z.string().optional(),
	values: z.array(z.string()).optional(),
});

const FilterGroupSchema = z.object({
	filters: z.array(FilterSchema),
});

const AssociationRecords = z.object({
	id: z.string(),
	type: z.string().optional(),
});

const AssociationResults = z.object({
	results: z.array(AssociationRecords),
});

const AssociationsSchema = z.record(
	z.string(),
	z.union([AssociationResults, z.array(z.string())]),
);

const ContactsSearchInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
	after: z.string().optional(),
	sorts: z.array(z.string()).optional(),
	properties: z.array(z.string()).optional(),
	filterGroups: z.array(FilterGroupSchema).optional(),
});

const CompaniesGetInputSchema = z.object({
	companyId: z.string(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
	idProperty: z.string().optional(),
});

const CompaniesGetManyInputSchema = z.object({
	limit: z.number().optional(),
	after: z.string().optional(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
});

const CompaniesCreateInputSchema = z.object({
	properties: z.record(z.string(), z.string()).optional(),
	associations: z
		.array(
			z.object({
				to: z.object({ id: z.string() }),
				types: z.array(
					z.object({
						associationCategory: z.string(),
						associationTypeId: z.number(),
					}),
				),
			}),
		)
		.optional(),
});

const CompaniesUpdateInputSchema = z.object({
	companyId: z.string(),
	properties: z.record(z.string(), z.string()).optional(),
});

const CompaniesDeleteInputSchema = z.object({
	companyId: z.string(),
});

const CompaniesGetRecentlyCreatedInputSchema = z.object({
	count: z.number().optional(),
	after: z.string().optional(),
	since: z.string().optional(),
});

const CompaniesGetRecentlyUpdatedInputSchema = z.object({
	count: z.number().optional(),
	after: z.string().optional(),
	since: z.string().optional(),
});

const CompaniesSearchByDomainInputSchema = z.object({
	domain: z.string(),
	properties: z.array(z.string()).optional(),
});

const DealsGetInputSchema = z.object({
	dealId: z.string(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
	idProperty: z.string().optional(),
});

const DealsGetManyInputSchema = z.object({
	limit: z.number().optional(),
	after: z.string().optional(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
});

const DealsCreateInputSchema = z.object({
	properties: z.record(z.string(), z.string()).optional(),
	associations: z
		.array(
			z.object({
				to: z.object({ id: z.string() }),
				types: z.array(
					z.object({
						associationCategory: z.string(),
						associationTypeId: z.number(),
					}),
				),
			}),
		)
		.optional(),
});

const DealsUpdateInputSchema = z.object({
	dealId: z.string(),
	properties: z.record(z.string(), z.string()).optional(),
});

const DealsDeleteInputSchema = z.object({
	dealId: z.string(),
});

const DealsGetRecentlyCreatedInputSchema = z.object({
	count: z.number().optional(),
	after: z.string().optional(),
	since: z.string().optional(),
});

const DealsGetRecentlyUpdatedInputSchema = z.object({
	count: z.number().optional(),
	after: z.string().optional(),
	since: z.string().optional(),
});

const DealsSearchInputSchema = z.object({
	query: z.string().optional(),
	limit: z.number().optional(),
	after: z.string().optional(),
	sorts: z.array(z.string()).optional(),
	properties: z.array(z.string()).optional(),
	filterGroups: z.array(FilterGroupSchema).optional(),
});

const TicketsGetInputSchema = z.object({
	ticketId: z.string(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
	idProperty: z.string().optional(),
});

const TicketsGetManyInputSchema = z.object({
	limit: z.number().optional(),
	after: z.string().optional(),
	properties: z.array(z.string()).optional(),
	propertiesWithHistory: z.array(z.string()).optional(),
	associations: z.array(z.string()).optional(),
	archived: z.boolean().optional(),
});

const TicketsCreateInputSchema = z.object({
	properties: z.record(z.string(), z.string()).optional(),
	associations: z
		.array(
			z.object({
				to: z.object({ id: z.string() }),
				types: z.array(
					z.object({
						associationCategory: z.string(),
						associationTypeId: z.number(),
					}),
				),
			}),
		)
		.optional(),
});

const TicketsUpdateInputSchema = z.object({
	ticketId: z.string(),
	properties: z.record(z.string(), z.string()).optional(),
});

const TicketsDeleteInputSchema = z.object({
	ticketId: z.string(),
});

const EngagementsGetInputSchema = z.object({
	engagementId: z.string(),
});

const EngagementsGetManyInputSchema = z.object({
	limit: z.number().optional(),
	after: z.string().optional(),
});

const EngagementsCreateInputSchema = z.object({
	engagement: z.object({
		active: z.boolean().optional(),
		type: z.string(),
		timestamp: z.number().optional(),
	}),
	associations: z
		.object({
			contactIds: z.array(z.number()).optional(),
			companyIds: z.array(z.number()).optional(),
			dealIds: z.array(z.number()).optional(),
			ownerIds: z.array(z.number()).optional(),
		})
		.optional(),
	// keeping metadata as any for now
	metadata: z.record(z.any()).optional(),
});

const EngagementsDeleteInputSchema = z.object({
	engagementId: z.string(),
});

const ContactListsAddContactInputSchema = z.object({
	listId: z.string(),
	emails: z.array(z.string()).optional(),
	vids: z.array(z.number()).optional(),
});

const ContactListsRemoveContactInputSchema = z.object({
	listId: z.string(),
	emails: z.array(z.string()).optional(),
	vids: z.array(z.number()).optional(),
});

export const HubSpotEndpointInputSchemas = {
	contactsGet: ContactsGetInputSchema,
	contactsGetMany: ContactsGetManyInputSchema,
	contactsCreateOrUpdate: ContactsCreateOrUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsGetRecentlyCreated: ContactsGetRecentlyCreatedInputSchema,
	contactsGetRecentlyUpdated: ContactsGetRecentlyUpdatedInputSchema,
	contactsSearch: ContactsSearchInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesGetMany: CompaniesGetManyInputSchema,
	companiesCreate: CompaniesCreateInputSchema,
	companiesUpdate: CompaniesUpdateInputSchema,
	companiesDelete: CompaniesDeleteInputSchema,
	companiesGetRecentlyCreated: CompaniesGetRecentlyCreatedInputSchema,
	companiesGetRecentlyUpdated: CompaniesGetRecentlyUpdatedInputSchema,
	companiesSearchByDomain: CompaniesSearchByDomainInputSchema,
	dealsGet: DealsGetInputSchema,
	dealsGetMany: DealsGetManyInputSchema,
	dealsCreate: DealsCreateInputSchema,
	dealsUpdate: DealsUpdateInputSchema,
	dealsDelete: DealsDeleteInputSchema,
	dealsGetRecentlyCreated: DealsGetRecentlyCreatedInputSchema,
	dealsGetRecentlyUpdated: DealsGetRecentlyUpdatedInputSchema,
	dealsSearch: DealsSearchInputSchema,
	ticketsGet: TicketsGetInputSchema,
	ticketsGetMany: TicketsGetManyInputSchema,
	ticketsCreate: TicketsCreateInputSchema,
	ticketsUpdate: TicketsUpdateInputSchema,
	ticketsDelete: TicketsDeleteInputSchema,
	engagementsGet: EngagementsGetInputSchema,
	engagementsGetMany: EngagementsGetManyInputSchema,
	engagementsCreate: EngagementsCreateInputSchema,
	engagementsDelete: EngagementsDeleteInputSchema,
	contactListsAddContact: ContactListsAddContactInputSchema,
	contactListsRemoveContact: ContactListsRemoveContactInputSchema,
} as const;

export type HubSpotEndpointInputs = {
	[K in keyof typeof HubSpotEndpointInputSchemas]: z.infer<
		(typeof HubSpotEndpointInputSchemas)[K]
	>;
};

const ContactResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.string(), z.string()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
		associations: AssociationsSchema.optional(),
	})
	.passthrough();

const CompanyResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.string(), z.string()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
		associations: AssociationsSchema.optional(),
	})
	.passthrough();

const DealResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.string(), z.string()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
		associations: AssociationsSchema.optional(),
	})
	.passthrough();

const TicketResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.string(), z.string()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
		associations: AssociationsSchema.optional(),
	})
	.passthrough();

const EngagementResponseSchema = z
	.object({
		id: z.string(),
		engagement: z
			.object({
				id: z.number().optional(),
				portalId: z.number().optional(),
				active: z.boolean().optional(),
				createdAt: z.number().optional(),
				lastUpdated: z.number().optional(),
				createdBy: z.number().optional(),
				modifiedBy: z.number().optional(),
				ownerId: z.number().optional(),
				type: z.string().optional(),
				timestamp: z.number().optional(),
			})
			.optional(),
		associations: AssociationsSchema.optional(),
		// keeping metadata as any for now
		metadata: z.record(z.any()).optional(),
	})
	.passthrough();

const PagingResponseSchema = z.object({
	next: z
		.object({
			after: z.string(),
		})
		.optional(),
	prev: z
		.object({
			before: z.string(),
		})
		.optional(),
});

const GetManyContactsResponseSchema = z
	.object({
		results: z.array(ContactResponseSchema).optional(),
		paging: PagingResponseSchema.optional(),
	})
	.passthrough();

const GetManyCompaniesResponseSchema = z
	.object({
		results: z.array(CompanyResponseSchema).optional(),
		paging: PagingResponseSchema.optional(),
	})
	.passthrough();

const GetManyDealsResponseSchema = z
	.object({
		results: z.array(DealResponseSchema).optional(),
		paging: PagingResponseSchema.optional(),
	})
	.passthrough();

const GetManyTicketsResponseSchema = z
	.object({
		results: z.array(TicketResponseSchema).optional(),
		paging: PagingResponseSchema.optional(),
	})
	.passthrough();

const GetManyEngagementsResponseSchema = z
	.object({
		results: z.array(EngagementResponseSchema).optional(),
		paging: PagingResponseSchema.optional(),
	})
	.passthrough();

const SearchCompanyByDomainResponseSchema = z
	.object({
		results: z.array(CompanyResponseSchema).optional(),
	})
	.passthrough();

const AddContactToListResponseSchema = z.object({
	updated: z.array(z.number()).optional(),
	discarded: z.array(z.number()).optional(),
	invalidVids: z.array(z.number()).optional(),
	invalidEmails: z.array(z.string()).optional(),
});

export const HubSpotEndpointOutputSchemas = {
	contactsGet: ContactResponseSchema,
	contactsGetMany: GetManyContactsResponseSchema,
	contactsCreateOrUpdate: ContactResponseSchema,
	contactsDelete: z.void(),
	contactsGetRecentlyCreated: GetManyContactsResponseSchema,
	contactsGetRecentlyUpdated: GetManyContactsResponseSchema,
	contactsSearch: GetManyContactsResponseSchema,
	companiesGet: CompanyResponseSchema,
	companiesGetMany: GetManyCompaniesResponseSchema,
	companiesCreate: CompanyResponseSchema,
	companiesUpdate: CompanyResponseSchema,
	companiesDelete: z.void(),
	companiesGetRecentlyCreated: GetManyCompaniesResponseSchema,
	companiesGetRecentlyUpdated: GetManyCompaniesResponseSchema,
	companiesSearchByDomain: SearchCompanyByDomainResponseSchema,
	dealsGet: DealResponseSchema,
	dealsGetMany: GetManyDealsResponseSchema,
	dealsCreate: DealResponseSchema,
	dealsUpdate: DealResponseSchema,
	dealsDelete: z.void(),
	dealsGetRecentlyCreated: GetManyDealsResponseSchema,
	dealsGetRecentlyUpdated: GetManyDealsResponseSchema,
	dealsSearch: GetManyDealsResponseSchema,
	ticketsGet: TicketResponseSchema,
	ticketsGetMany: GetManyTicketsResponseSchema,
	ticketsCreate: TicketResponseSchema,
	ticketsUpdate: TicketResponseSchema,
	ticketsDelete: z.void(),
	engagementsGet: EngagementResponseSchema,
	engagementsGetMany: GetManyEngagementsResponseSchema,
	engagementsCreate: EngagementResponseSchema,
	engagementsDelete: z.void(),
	contactListsAddContact: AddContactToListResponseSchema,
	contactListsRemoveContact: AddContactToListResponseSchema,
} as const;

export type HubSpotEndpointOutputs = {
	[K in keyof typeof HubSpotEndpointOutputSchemas]: z.infer<
		(typeof HubSpotEndpointOutputSchemas)[K]
	>;
};

export type GetContactResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.contactsGet
>;
export type GetManyContactsResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.contactsGetMany
>;
export type CreateOrUpdateContactResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.contactsCreateOrUpdate
>;
export type GetCompanyResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.companiesGet
>;
export type GetManyCompaniesResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.companiesGetMany
>;
export type CreateCompanyResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.companiesCreate
>;
export type UpdateCompanyResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.companiesUpdate
>;
export type SearchCompanyByDomainResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.companiesSearchByDomain
>;
export type GetDealResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.dealsGet
>;
export type GetManyDealsResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.dealsGetMany
>;
export type CreateDealResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.dealsCreate
>;
export type UpdateDealResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.dealsUpdate
>;
export type GetTicketResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.ticketsGet
>;
export type GetManyTicketsResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.ticketsGetMany
>;
export type CreateTicketResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.ticketsCreate
>;
export type UpdateTicketResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.ticketsUpdate
>;
export type GetEngagementResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.engagementsGet
>;
export type GetManyEngagementsResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.engagementsGetMany
>;
export type CreateEngagementResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.engagementsCreate
>;
export type AddContactToListResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.contactListsAddContact
>;
export type RemoveContactFromListResponse = z.infer<
	typeof HubSpotEndpointOutputSchemas.contactListsRemoveContact
>;
