import { z } from 'zod';
import type {
	CompanyResponse,
	ContactResponse,
	DealResponse,
	EngagementResponse,
	PagingResponse,
	TicketResponse,
} from '../types';

export type GetContactResponse = ContactResponse;
export type GetManyContactsResponse = {
	results: Array<ContactResponse>;
	paging?: PagingResponse;
};
export type CreateOrUpdateContactResponse = ContactResponse;

export type GetCompanyResponse = CompanyResponse;
export type GetManyCompaniesResponse = {
	results: Array<CompanyResponse>;
	paging?: PagingResponse;
};
export type CreateCompanyResponse = CompanyResponse;
export type UpdateCompanyResponse = CompanyResponse;
export type SearchCompanyByDomainResponse = {
	results: Array<CompanyResponse>;
};

export type GetDealResponse = DealResponse;
export type GetManyDealsResponse = {
	results: Array<DealResponse>;
	paging?: PagingResponse;
};
export type CreateDealResponse = DealResponse;
export type UpdateDealResponse = DealResponse;

export type GetTicketResponse = TicketResponse;
export type GetManyTicketsResponse = {
	results: Array<TicketResponse>;
	paging?: PagingResponse;
};
export type CreateTicketResponse = TicketResponse;
export type UpdateTicketResponse = TicketResponse;

export type GetEngagementResponse = EngagementResponse;
export type GetManyEngagementsResponse = {
	results: Array<EngagementResponse>;
	paging?: PagingResponse;
};
export type CreateEngagementResponse = EngagementResponse;

export type AddContactToListResponse = {
	updated?: Array<number>;
	discarded?: Array<number>;
	invalidVids?: Array<number>;
	invalidEmails?: Array<string>;
};
export type RemoveContactFromListResponse = AddContactToListResponse;

export type HubSpotEndpointOutputs = {
	contactsGet: GetContactResponse;
	contactsGetMany: GetManyContactsResponse;
	contactsCreateOrUpdate: CreateOrUpdateContactResponse;
	contactsDelete: void;
	contactsGetRecentlyCreated: GetManyContactsResponse;
	contactsGetRecentlyUpdated: GetManyContactsResponse;
	contactsSearch: GetManyContactsResponse;
	companiesGet: GetCompanyResponse;
	companiesGetMany: GetManyCompaniesResponse;
	companiesCreate: CreateCompanyResponse;
	companiesUpdate: UpdateCompanyResponse;
	companiesDelete: void;
	companiesGetRecentlyCreated: GetManyCompaniesResponse;
	companiesGetRecentlyUpdated: GetManyCompaniesResponse;
	companiesSearchByDomain: SearchCompanyByDomainResponse;
	dealsGet: GetDealResponse;
	dealsGetMany: GetManyDealsResponse;
	dealsCreate: CreateDealResponse;
	dealsUpdate: UpdateDealResponse;
	dealsDelete: void;
	dealsGetRecentlyCreated: GetManyDealsResponse;
	dealsGetRecentlyUpdated: GetManyDealsResponse;
	dealsSearch: GetManyDealsResponse;
	ticketsGet: GetTicketResponse;
	ticketsGetMany: GetManyTicketsResponse;
	ticketsCreate: CreateTicketResponse;
	ticketsUpdate: UpdateTicketResponse;
	ticketsDelete: void;
	engagementsGet: GetEngagementResponse;
	engagementsGetMany: GetManyEngagementsResponse;
	engagementsCreate: CreateEngagementResponse;
	engagementsDelete: void;
	contactListsAddContact: AddContactToListResponse;
	contactListsRemoveContact: RemoveContactFromListResponse;
};

const ContactResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	updatedAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	archived: z.boolean().optional(),
}).passthrough();

const CompanyResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	updatedAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	archived: z.boolean().optional(),
}).passthrough();

const DealResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	updatedAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	archived: z.boolean().optional(),
}).passthrough();

const TicketResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	updatedAt: z.union([z.string(), z.date(), z.coerce.date()]).optional(),
	archived: z.boolean().optional(),
}).passthrough();

const EngagementResponseSchema = z.object({
	id: z.string(),
	engagement: z.object({
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
	}).optional(),
	associations: z.record(z.any()).optional(),
	metadata: z.record(z.any()).optional(),
}).passthrough();

const PagingResponseSchema = z.object({
	next: z.object({
		after: z.string(),
	}).optional(),
	prev: z.object({
		before: z.string(),
	}).optional(),
});

const GetManyContactsResponseSchema = z.object({
	results: z.array(ContactResponseSchema).optional(),
	paging: PagingResponseSchema.optional(),
}).passthrough();

const GetManyCompaniesResponseSchema = z.object({
	results: z.array(CompanyResponseSchema).optional(),
	paging: PagingResponseSchema.optional(),
}).passthrough();

const GetManyDealsResponseSchema = z.object({
	results: z.array(DealResponseSchema).optional(),
	paging: PagingResponseSchema.optional(),
}).passthrough();

const GetManyTicketsResponseSchema = z.object({
	results: z.array(TicketResponseSchema).optional(),
	paging: PagingResponseSchema.optional(),
}).passthrough();

const GetManyEngagementsResponseSchema = z.object({
	results: z.array(EngagementResponseSchema).optional(),
	paging: PagingResponseSchema.optional(),
}).passthrough();

const SearchCompanyByDomainResponseSchema = z.object({
	results: z.array(CompanyResponseSchema).optional(),
}).passthrough();

const AddContactToListResponseSchema = z.object({
	updated: z.array(z.number()).optional(),
	discarded: z.array(z.number()).optional(),
	invalidVids: z.array(z.number()).optional(),
	invalidEmails: z.array(z.string()).optional(),
});

export const HubSpotEndpointOutputSchemas: {
	[K in keyof HubSpotEndpointOutputs]: z.ZodType<unknown>;
} = {
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
};
