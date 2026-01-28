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
