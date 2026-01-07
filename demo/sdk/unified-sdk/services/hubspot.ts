import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type {
	AddContactToListArgs,
	AddContactToListResponse,
	CreateCompanyArgs,
	CreateCompanyResponse,
	CreateDealArgs,
	CreateDealResponse,
	CreateEngagementArgs,
	CreateEngagementResponse,
	CreateOrUpdateContactArgs,
	CreateOrUpdateContactResponse,
	CreateTicketArgs,
	CreateTicketResponse,
	DeleteCompanyArgs,
	DeleteContactArgs,
	DeleteDealArgs,
	DeleteEngagementArgs,
	DeleteTicketArgs,
	GetCompanyArgs,
	GetCompanyResponse,
	GetContactArgs,
	GetContactResponse,
	GetDealArgs,
	GetDealResponse,
	GetEngagementArgs,
	GetEngagementResponse,
	GetManyCompaniesArgs,
	GetManyCompaniesResponse,
	GetManyContactsArgs,
	GetManyContactsResponse,
	GetManyDealsArgs,
	GetManyDealsResponse,
	GetManyEngagementsArgs,
	GetManyEngagementsResponse,
	GetManyTicketsArgs,
	GetManyTicketsResponse,
	GetRecentlyCreatedCompaniesArgs,
	GetRecentlyCreatedCompaniesResponse,
	GetRecentlyCreatedContactsArgs,
	GetRecentlyCreatedContactsResponse,
	GetRecentlyCreatedDealsArgs,
	GetRecentlyCreatedDealsResponse,
	GetRecentlyUpdatedCompaniesArgs,
	GetRecentlyUpdatedCompaniesResponse,
	GetRecentlyUpdatedContactsArgs,
	GetRecentlyUpdatedContactsResponse,
	GetRecentlyUpdatedDealsArgs,
	GetRecentlyUpdatedDealsResponse,
	GetTicketArgs,
	GetTicketResponse,
	RemoveContactFromListArgs,
	RemoveContactFromListResponse,
	SearchCompanyByDomainArgs,
	SearchCompanyByDomainResponse,
	SearchContactsArgs,
	SearchContactsResponse,
	SearchDealsArgs,
	SearchDealsResponse,
	UpdateCompanyArgs,
	UpdateCompanyResponse,
	UpdateDealArgs,
	UpdateDealResponse,
	UpdateTicketArgs,
	UpdateTicketResponse,
} from '../models/hubspot';

export class ContactsService {
	public static getContact(
		args: GetContactArgs,
	): CancelablePromise<GetContactResponse> {
		const { contactId, token, ...queryParams } = args;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/contacts/{contactId}',
			path: {
				contactId,
			},
			query: queryParams,
			headers: token
				? { Authorization: `Bearer ${token}` }
				: undefined,
		});
	}

	public static getManyContacts(
		args?: GetManyContactsArgs,
	): CancelablePromise<GetManyContactsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/contacts',
			query: queryParams,
			headers: token
				? { Authorization: `Bearer ${token}` }
				: undefined,
		});
	}

	public static createOrUpdateContact(
		args: CreateOrUpdateContactArgs,
	): CancelablePromise<CreateOrUpdateContactResponse> {
		const { token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/crm/v3/objects/contacts',
			body,
			mediaType: 'application/json',
			headers: token
				? { Authorization: `Bearer ${token}` }
				: undefined,
		});
	}

	public static deleteContact(
		args: DeleteContactArgs,
	): CancelablePromise<void> {
		const { contactId, token } = args;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/crm/v3/objects/contacts/{contactId}',
			path: {
				contactId,
			},
			headers: token
				? { Authorization: `Bearer ${token}` }
				: undefined,
		});
	}

	public static getRecentlyCreatedContacts(
		args?: GetRecentlyCreatedContactsArgs,
	): CancelablePromise<GetRecentlyCreatedContactsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/contacts',
			query: {
				...queryParams,
			},
			headers: token
				? { Authorization: `Bearer ${token}` }
				: undefined,
		});
	}

	public static getRecentlyUpdatedContacts(
		args?: GetRecentlyUpdatedContactsArgs,
	): CancelablePromise<GetRecentlyUpdatedContactsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/contacts',
			query: {
				...queryParams,
			},
			headers: token
				? { Authorization: `Bearer ${token}` }
				: undefined,
		});
	}

	public static searchContacts(
		args: SearchContactsArgs,
	): CancelablePromise<SearchContactsResponse> {
		const { token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/crm/v3/objects/contacts/search',
			body,
			mediaType: 'application/json',
			headers: token
				? { Authorization: `Bearer ${token}` }
				: undefined,
		});
	}
}

export class CompaniesService {
	public static getCompany(
		args: GetCompanyArgs,
	): CancelablePromise<GetCompanyResponse> {
		const { companyId, token, ...queryParams } = args;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/companies/{companyId}',
			path: {
				companyId,
			},
			query: queryParams,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getManyCompanies(
		args?: GetManyCompaniesArgs,
	): CancelablePromise<GetManyCompaniesResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/companies',
			query: queryParams,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static createCompany(
		args: CreateCompanyArgs,
	): CancelablePromise<CreateCompanyResponse> {
		const { token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/crm/v3/objects/companies',
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static updateCompany(
		args: UpdateCompanyArgs,
	): CancelablePromise<UpdateCompanyResponse> {
		const { companyId, token, ...body } = args;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/crm/v3/objects/companies/{companyId}',
			path: {
				companyId,
			},
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static deleteCompany(
		args: DeleteCompanyArgs,
	): CancelablePromise<void> {
		const { companyId, token } = args;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/crm/v3/objects/companies/{companyId}',
			path: {
				companyId,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getRecentlyCreatedCompanies(
		args?: GetRecentlyCreatedCompaniesArgs,
	): CancelablePromise<GetRecentlyCreatedCompaniesResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/companies',
			query: {
				...queryParams,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getRecentlyUpdatedCompanies(
		args?: GetRecentlyUpdatedCompaniesArgs,
	): CancelablePromise<GetRecentlyUpdatedCompaniesResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/companies',
			query: {
				...queryParams,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static searchCompanyByDomain(
		args: SearchCompanyByDomainArgs,
	): CancelablePromise<SearchCompanyByDomainResponse> {
		const { domain, token, ...queryParams } = args;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/companies/search',
			query: {
				...queryParams,
				domain,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}
}

export class DealsService {
	public static getDeal(
		args: GetDealArgs,
	): CancelablePromise<GetDealResponse> {
		const { dealId, token, ...queryParams } = args;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/deals/{dealId}',
			path: {
				dealId,
			},
			query: queryParams,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getManyDeals(
		args?: GetManyDealsArgs,
	): CancelablePromise<GetManyDealsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/deals',
			query: queryParams,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static createDeal(
		args: CreateDealArgs,
	): CancelablePromise<CreateDealResponse> {
		const { token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/crm/v3/objects/deals',
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static updateDeal(
		args: UpdateDealArgs,
	): CancelablePromise<UpdateDealResponse> {
		const { dealId, token, ...body } = args;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/crm/v3/objects/deals/{dealId}',
			path: {
				dealId,
			},
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static deleteDeal(args: DeleteDealArgs): CancelablePromise<void> {
		const { dealId, token } = args;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/crm/v3/objects/deals/{dealId}',
			path: {
				dealId,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getRecentlyCreatedDeals(
		args?: GetRecentlyCreatedDealsArgs,
	): CancelablePromise<GetRecentlyCreatedDealsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/deals',
			query: {
				...queryParams,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getRecentlyUpdatedDeals(
		args?: GetRecentlyUpdatedDealsArgs,
	): CancelablePromise<GetRecentlyUpdatedDealsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/deals',
			query: {
				...queryParams,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static searchDeals(
		args: SearchDealsArgs,
	): CancelablePromise<SearchDealsResponse> {
		const { token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/crm/v3/objects/deals/search',
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}
}

export class TicketsService {
	public static getTicket(
		args: GetTicketArgs,
	): CancelablePromise<GetTicketResponse> {
		const { ticketId, token, ...queryParams } = args;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/tickets/{ticketId}',
			path: {
				ticketId,
			},
			query: queryParams,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getManyTickets(
		args?: GetManyTicketsArgs,
	): CancelablePromise<GetManyTicketsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/tickets',
			query: queryParams,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static createTicket(
		args: CreateTicketArgs,
	): CancelablePromise<CreateTicketResponse> {
		const { token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/crm/v3/objects/tickets',
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static updateTicket(
		args: UpdateTicketArgs,
	): CancelablePromise<UpdateTicketResponse> {
		const { ticketId, token, ...body } = args;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/crm/v3/objects/tickets/{ticketId}',
			path: {
				ticketId,
			},
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static deleteTicket(
		args: DeleteTicketArgs,
	): CancelablePromise<void> {
		const { ticketId, token } = args;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/crm/v3/objects/tickets/{ticketId}',
			path: {
				ticketId,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}
}

export class EngagementsService {
	public static getEngagement(
		args: GetEngagementArgs,
	): CancelablePromise<GetEngagementResponse> {
		const { engagementId, token } = args;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/engagements/{engagementId}',
			path: {
				engagementId,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static getManyEngagements(
		args?: GetManyEngagementsArgs,
	): CancelablePromise<GetManyEngagementsResponse> {
		const { token, ...queryParams } = args || {};
		return __request(OpenAPI, {
			method: 'GET',
			url: '/crm/v3/objects/engagements',
			query: queryParams,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static createEngagement(
		args: CreateEngagementArgs,
	): CancelablePromise<CreateEngagementResponse> {
		const { token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/crm/v3/objects/engagements',
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static deleteEngagement(
		args: DeleteEngagementArgs,
	): CancelablePromise<void> {
		const { engagementId, token } = args;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/crm/v3/objects/engagements/{engagementId}',
			path: {
				engagementId,
			},
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}
}

export class ContactListsService {
	public static addContactToList(
		args: AddContactToListArgs,
	): CancelablePromise<AddContactToListResponse> {
		const { listId, token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/contacts/v1/lists/{listId}/add',
			path: {
				listId,
			},
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}

	public static removeContactFromList(
		args: RemoveContactFromListArgs,
	): CancelablePromise<RemoveContactFromListResponse> {
		const { listId, token, ...body } = args;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/contacts/v1/lists/{listId}/remove',
			path: {
				listId,
			},
			body,
			mediaType: 'application/json',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
	}
}

