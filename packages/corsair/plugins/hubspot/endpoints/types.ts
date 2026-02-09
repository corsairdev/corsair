import { z } from 'zod';

const ContactResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.any()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.passthrough();

const CompanyResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.any()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.passthrough();

const DealResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.any()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.passthrough();

const TicketResponseSchema = z
	.object({
		id: z.string(),
		properties: z.record(z.any()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archived: z.boolean().optional(),
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
		associations: z.record(z.any()).optional(),
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
