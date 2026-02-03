import { makeHubSpotRequest, HubSpotAPIError } from './client';
import type {
	CreateCompanyResponse,
	CreateDealResponse,
	CreateEngagementResponse,
	CreateOrUpdateContactResponse,
	CreateTicketResponse,
	GetCompanyResponse,
	GetContactResponse,
	GetDealResponse,
	GetEngagementResponse,
	GetManyCompaniesResponse,
	GetManyContactsResponse,
	GetManyDealsResponse,
	GetManyEngagementsResponse,
	GetManyTicketsResponse,
	GetTicketResponse,
	HubSpotEndpointOutputs,
	SearchCompanyByDomainResponse,
	UpdateCompanyResponse,
	UpdateDealResponse,
	UpdateTicketResponse,
} from './endpoints/types';
import { HubSpotEndpointOutputSchemas } from './endpoints/types';
import dotenv from 'dotenv';
dotenv.config();

type AssertExactType<T, U> = T extends U ? (U extends T ? true : never) : never;

const TEST_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

describe('HubSpot API Type Tests', () => {
	describe('contacts', () => {
		it('contactsGetMany returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyContactsResponse>(
				'/crm/v3/objects/contacts',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.contactsGetMany.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['contactsGetMany']
			>;
			const _assert: _Check = true;
		});

		it('contactsGet returns correct type', async () => {
			const contactsListResponse = await makeHubSpotRequest<GetManyContactsResponse>(
				'/crm/v3/objects/contacts',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const contactId = contactsListResponse.results[0]?.id;
			if (!contactId) {
				return;
			}

			const response = await makeHubSpotRequest<GetContactResponse>(
				`/crm/v3/objects/contacts/${contactId}`,
				TEST_TOKEN,
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.contactsGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['contactsGet']
			>;
			const _assert: _Check = true;
		});

		it('contactsCreateOrUpdate returns correct type', async () => {
			const response = await makeHubSpotRequest<CreateOrUpdateContactResponse>(
				'/crm/v3/objects/contacts',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						properties: {
							email: `test-${Date.now()}@example.com`,
						},
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.contactsCreateOrUpdate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['contactsCreateOrUpdate']
			>;
			const _assert: _Check = true;
		});

		it('contactsGetRecentlyCreated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyContactsResponse>(
				'/crm/v3/objects/contacts',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.contactsGetRecentlyCreated.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['contactsGetRecentlyCreated']
			>;
			const _assert: _Check = true;
		});

		it('contactsGetRecentlyUpdated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyContactsResponse>(
				'/crm/v3/objects/contacts',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.contactsGetRecentlyUpdated.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['contactsGetRecentlyUpdated']
			>;
			const _assert: _Check = true;
		});

		it('contactsSearch returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyContactsResponse>(
				'/crm/v3/objects/contacts/search',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						limit: 10,
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.contactsSearch.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['contactsSearch']
			>;
			const _assert: _Check = true;
		});
	});

	describe('companies', () => {
		it('companiesGetMany returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyCompaniesResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.companiesGetMany.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['companiesGetMany']
			>;
			const _assert: _Check = true;
		});

		it('companiesGet returns correct type', async () => {
			const companiesListResponse = await makeHubSpotRequest<GetManyCompaniesResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const companyId = companiesListResponse.results[0]?.id;
			if (!companyId) {
				return;
			}

			const response = await makeHubSpotRequest<GetCompanyResponse>(
				`/crm/v3/objects/companies/${companyId}`,
				TEST_TOKEN,
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.companiesGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['companiesGet']
			>;
			const _assert: _Check = true;
		});

		it('companiesCreate returns correct type', async () => {
			const response = await makeHubSpotRequest<CreateCompanyResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						properties: {
							name: `Test Company ${Date.now()}`,
						},
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.companiesCreate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['companiesCreate']
			>;
			const _assert: _Check = true;
		});

		it('companiesUpdate returns correct type', async () => {
			const companiesListResponse = await makeHubSpotRequest<GetManyCompaniesResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const companyId = companiesListResponse.results[0]?.id;
			if (!companyId) {
				return;
			}

			const response = await makeHubSpotRequest<UpdateCompanyResponse>(
				`/crm/v3/objects/companies/${companyId}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {
						properties: {
							name: `Updated Company ${Date.now()}`,
						},
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.companiesUpdate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['companiesUpdate']
			>;
			const _assert: _Check = true;
		});

		it('companiesGetRecentlyCreated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyCompaniesResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.companiesGetRecentlyCreated.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['companiesGetRecentlyCreated']
			>;
			const _assert: _Check = true;
		});

		it('companiesGetRecentlyUpdated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyCompaniesResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.companiesGetRecentlyUpdated.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['companiesGetRecentlyUpdated']
			>;
			const _assert: _Check = true;
		});

		it('companiesSearchByDomain returns correct type', async () => {
			const response = await makeHubSpotRequest<SearchCompanyByDomainResponse>(
				'/crm/v3/objects/companies/search',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						requestOptions: {
							properties: ['domain'],
						},
						query: 'example.com',
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.companiesSearchByDomain.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['companiesSearchByDomain']
			>;
			const _assert: _Check = true;
		});
	});

	describe('deals', () => {
		it('dealsGetMany returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.dealsGetMany.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['dealsGetMany']
			>;
			const _assert: _Check = true;
		});

		it('dealsGet returns correct type', async () => {
			const dealsListResponse = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const dealId = dealsListResponse.results[0]?.id;
			if (!dealId) {
				return;
			}

			const response = await makeHubSpotRequest<GetDealResponse>(
				`/crm/v3/objects/deals/${dealId}`,
				TEST_TOKEN,
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.dealsGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['dealsGet']
			>;
			const _assert: _Check = true;
		});

		it('dealsCreate returns correct type', async () => {
			const response = await makeHubSpotRequest<CreateDealResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						properties: {
							dealname: `Test Deal ${Date.now()}`,
						},
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.dealsCreate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['dealsCreate']
			>;
			const _assert: _Check = true;
		});

		it('dealsUpdate returns correct type', async () => {
			const dealsListResponse = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const dealId = dealsListResponse.results[0]?.id;
			if (!dealId) {
				return;
			}

			const response = await makeHubSpotRequest<UpdateDealResponse>(
				`/crm/v3/objects/deals/${dealId}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {
						properties: {
							dealname: `Updated Deal ${Date.now()}`,
						},
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.dealsUpdate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['dealsUpdate']
			>;
			const _assert: _Check = true;
		});

		it('dealsGetRecentlyCreated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.dealsGetRecentlyCreated.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['dealsGetRecentlyCreated']
			>;
			const _assert: _Check = true;
		});

		it('dealsGetRecentlyUpdated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.dealsGetRecentlyUpdated.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['dealsGetRecentlyUpdated']
			>;
			const _assert: _Check = true;
		});

		it('dealsSearch returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals/search',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						limit: 10,
					},
				},
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.dealsSearch.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['dealsSearch']
			>;
			const _assert: _Check = true;
		});
	});

	describe('tickets', () => {
		it('ticketsGetMany returns correct type', async () => {
				const response = await makeHubSpotRequest<GetManyTicketsResponse>(
					'/crm/v3/objects/tickets',
					TEST_TOKEN,
					{ query: { limit: 10 } },
				);
				const result = response;
				
				const validated = HubSpotEndpointOutputSchemas.ticketsGetMany.parse(result);
				
				type _Check = AssertExactType<
					typeof result,
					HubSpotEndpointOutputs['ticketsGetMany']
				>;
				const _assert: _Check = true;
			
		});

		it('ticketsGet returns correct type', async () => {
				const ticketsListResponse = await makeHubSpotRequest<GetManyTicketsResponse>(
					'/crm/v3/objects/tickets',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);
				const ticketId = ticketsListResponse.results[0]?.id;
				if (!ticketId) {
					return;
				}

				const response = await makeHubSpotRequest<GetTicketResponse>(
					`/crm/v3/objects/tickets/${ticketId}`,
					TEST_TOKEN,
				);
				const result = response;
				
				const validated = HubSpotEndpointOutputSchemas.ticketsGet.parse(result);
				
				type _Check = AssertExactType<
					typeof result,
					HubSpotEndpointOutputs['ticketsGet']
				>;
				const _assert: _Check = true;
			
		});

		it('ticketsCreate returns correct type', async () => {
				const response = await makeHubSpotRequest<CreateTicketResponse>(
					'/crm/v3/objects/tickets',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							properties: {
								subject: `Test Ticket ${Date.now()}`,
							},
						},
					},
				);
				const result = response;
				
				const validated = HubSpotEndpointOutputSchemas.ticketsCreate.parse(result);
				
				type _Check = AssertExactType<
					typeof result,
					HubSpotEndpointOutputs['ticketsCreate']
				>;
				const _assert: _Check = true;
			
		});

		it('ticketsUpdate returns correct type', async () => {
				const ticketsListResponse = await makeHubSpotRequest<GetManyTicketsResponse>(
					'/crm/v3/objects/tickets',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);
				const ticketId = ticketsListResponse.results[0]?.id;
				if (!ticketId) {
					return;
				}

				const response = await makeHubSpotRequest<UpdateTicketResponse>(
					`/crm/v3/objects/tickets/${ticketId}`,
					TEST_TOKEN,
					{
						method: 'PATCH',
						body: {
							properties: {
								subject: `Updated Ticket ${Date.now()}`,
							},
						},
					},
				);
				const result = response;
				
				const validated = HubSpotEndpointOutputSchemas.ticketsUpdate.parse(result);
				
				type _Check = AssertExactType<
					typeof result,
					HubSpotEndpointOutputs['ticketsUpdate']
				>;
				const _assert: _Check = true;
			
		});
	});

	describe('engagements', () => {
		it('engagementsGetMany returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyEngagementsResponse>(
				'/crm/v3/objects/engagements',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.engagementsGetMany.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['engagementsGetMany']
			>;
			const _assert: _Check = true;
		});

		it('engagementsGet returns correct type', async () => {
			const engagementsListResponse = await makeHubSpotRequest<GetManyEngagementsResponse>(
				'/crm/v3/objects/engagements',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const engagementId = engagementsListResponse.results[0]?.id;
			if (!engagementId) {
				return;
			}

			const response = await makeHubSpotRequest<GetEngagementResponse>(
				`/crm/v3/objects/engagements/${engagementId}`,
				TEST_TOKEN,
			);
			const result = response;
			
			const validated = HubSpotEndpointOutputSchemas.engagementsGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				HubSpotEndpointOutputs['engagementsGet']
			>;
			const _assert: _Check = true;
		});

		it('engagementsCreate returns correct type', async () => {
			try {
				const response = await makeHubSpotRequest<CreateEngagementResponse>(
					'/crm/v3/objects/engagements',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							engagement: {
								type: 'NOTE',
							},
							metadata: {
								body: `Test engagement note ${Date.now()}`,
							},
						},
					},
				);
				const result = response;
				
				const validated = HubSpotEndpointOutputSchemas.engagementsCreate.parse(result);
				
				type _Check = AssertExactType<
					typeof result,
					HubSpotEndpointOutputs['engagementsCreate']
				>;
				const _assert: _Check = true;
			} catch (error) {
				if (error instanceof HubSpotAPIError && (error.code === 400 || error.code === 403)) {
					return;
				}
				throw error;
			}
		});
	});
});
