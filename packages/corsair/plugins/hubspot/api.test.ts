import dotenv from 'dotenv';
import { makeHubSpotRequest } from './client';
import type {
	CreateCompanyResponse,
	CreateDealResponse,
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
	SearchCompanyByDomainResponse,
	UpdateCompanyResponse,
	UpdateDealResponse,
	UpdateTicketResponse,
} from './endpoints/types';
import { HubSpotEndpointOutputSchemas } from './endpoints/types';

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

			HubSpotEndpointOutputSchemas.contactsGetMany.parse(result);
		});

		it('contactsGet returns correct type', async () => {
			const contactsListResponse =
				await makeHubSpotRequest<GetManyContactsResponse>(
					'/crm/v3/objects/contacts',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);

			if (!contactsListResponse.results) {
				return;
			}
			const contactId = contactsListResponse.results[0]?.id;
			if (!contactId) {
				return;
			}

			const response = await makeHubSpotRequest<GetContactResponse>(
				`/crm/v3/objects/contacts/${contactId}`,
				TEST_TOKEN,
			);
			const result = response;

			HubSpotEndpointOutputSchemas.contactsGet.parse(result);
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

			HubSpotEndpointOutputSchemas.contactsCreateOrUpdate.parse(result);
		});

		it('contactsGetRecentlyCreated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyContactsResponse>(
				'/crm/v3/objects/contacts',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			HubSpotEndpointOutputSchemas.contactsGetRecentlyCreated.parse(result);
		});

		it('contactsGetRecentlyUpdated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyContactsResponse>(
				'/crm/v3/objects/contacts',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			HubSpotEndpointOutputSchemas.contactsGetRecentlyUpdated.parse(result);
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

			HubSpotEndpointOutputSchemas.contactsSearch.parse(result);
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

			HubSpotEndpointOutputSchemas.companiesGetMany.parse(result);
		});

		it('companiesGet returns correct type', async () => {
			const companiesListResponse =
				await makeHubSpotRequest<GetManyCompaniesResponse>(
					'/crm/v3/objects/companies',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);

			if (!companiesListResponse.results) {
				return;
			}
			const companyId = companiesListResponse.results[0]?.id;
			if (!companyId) {
				return;
			}

			const response = await makeHubSpotRequest<GetCompanyResponse>(
				`/crm/v3/objects/companies/${companyId}`,
				TEST_TOKEN,
			);
			const result = response;

			HubSpotEndpointOutputSchemas.companiesGet.parse(result);
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

			HubSpotEndpointOutputSchemas.companiesCreate.parse(result);
		});

		it('companiesUpdate returns correct type', async () => {
			const companiesListResponse =
				await makeHubSpotRequest<GetManyCompaniesResponse>(
					'/crm/v3/objects/companies',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);
			if (!companiesListResponse.results) {
				return;
			}
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

			HubSpotEndpointOutputSchemas.companiesUpdate.parse(result);
		});

		it('companiesGetRecentlyCreated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyCompaniesResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			HubSpotEndpointOutputSchemas.companiesGetRecentlyCreated.parse(result);
		});

		it('companiesGetRecentlyUpdated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyCompaniesResponse>(
				'/crm/v3/objects/companies',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			HubSpotEndpointOutputSchemas.companiesGetRecentlyUpdated.parse(result);
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

			HubSpotEndpointOutputSchemas.companiesSearchByDomain.parse(result);
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

			HubSpotEndpointOutputSchemas.dealsGetMany.parse(result);
		});

		it('dealsGet returns correct type', async () => {
			const dealsListResponse = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			if (!dealsListResponse.results) {
				return;
			}
			const dealId = dealsListResponse.results[0]?.id;
			if (!dealId) {
				return;
			}

			const response = await makeHubSpotRequest<GetDealResponse>(
				`/crm/v3/objects/deals/${dealId}`,
				TEST_TOKEN,
			);
			const result = response;

			HubSpotEndpointOutputSchemas.dealsGet.parse(result);
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

			HubSpotEndpointOutputSchemas.dealsCreate.parse(result);
		});

		it('dealsUpdate returns correct type', async () => {
			const dealsListResponse = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			if (!dealsListResponse.results) {
				return;
			}
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

			HubSpotEndpointOutputSchemas.dealsUpdate.parse(result);
		});

		it('dealsGetRecentlyCreated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			HubSpotEndpointOutputSchemas.dealsGetRecentlyCreated.parse(result);
		});

		it('dealsGetRecentlyUpdated returns correct type', async () => {
			const response = await makeHubSpotRequest<GetManyDealsResponse>(
				'/crm/v3/objects/deals',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			HubSpotEndpointOutputSchemas.dealsGetRecentlyUpdated.parse(result);
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

			HubSpotEndpointOutputSchemas.dealsSearch.parse(result);
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

			HubSpotEndpointOutputSchemas.ticketsGetMany.parse(result);
		});

		it('ticketsGet returns correct type', async () => {
			const ticketsListResponse =
				await makeHubSpotRequest<GetManyTicketsResponse>(
					'/crm/v3/objects/tickets',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);
			if (!ticketsListResponse.results) {
				return;
			}
			const ticketId = ticketsListResponse.results[0]?.id;
			if (!ticketId) {
				return;
			}

			const response = await makeHubSpotRequest<GetTicketResponse>(
				`/crm/v3/objects/tickets/${ticketId}`,
				TEST_TOKEN,
			);
			const result = response;

			HubSpotEndpointOutputSchemas.ticketsGet.parse(result);
		});

		it('ticketsCreate returns correct type', async () => {
			// First, get an existing ticket to extract the pipeline stage
			const existingTickets = await makeHubSpotRequest<GetManyTicketsResponse>(
				'/crm/v3/objects/tickets',
				TEST_TOKEN,
				{
					query: {
						limit: 1,
					},
				},
			);

			if (!existingTickets.results) {
				return;
			}
			const ticketId = existingTickets.results[0]?.id;
			if (!ticketId) {
				return;
			}

			// Get the full ticket with all properties to see the pipeline stage format
			const existingTicket = await makeHubSpotRequest<GetTicketResponse>(
				`/crm/v3/objects/tickets/${ticketId}`,
				TEST_TOKEN,
				{
					query: {
						properties: 'hs_pipeline_stage,hs_pipeline',
					},
				},
			);

			// Extract pipeline stage from existing ticket
			const pipelineStage = existingTicket.properties?.hs_pipeline_stage;
			const pipeline = existingTicket.properties?.hs_pipeline;

			if (!pipelineStage) {
				return;
			}

			const response = await makeHubSpotRequest<CreateTicketResponse>(
				'/crm/v3/objects/tickets',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						properties: {
							subject: `Test Ticket ${Date.now()}`,
							hs_pipeline_stage: pipelineStage,
							...(pipeline && { hs_pipeline: pipeline }),
						},
					},
				},
			);
			const result = response;

			HubSpotEndpointOutputSchemas.ticketsCreate.parse(result);
		});

		it('ticketsUpdate returns correct type', async () => {
			const ticketsListResponse =
				await makeHubSpotRequest<GetManyTicketsResponse>(
					'/crm/v3/objects/tickets',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);
			if (!ticketsListResponse.results) {
				return;
			}
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

			HubSpotEndpointOutputSchemas.ticketsUpdate.parse(result);
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

			HubSpotEndpointOutputSchemas.engagementsGetMany.parse(result);
		});

		it('engagementsGet returns correct type', async () => {
			const engagementsListResponse =
				await makeHubSpotRequest<GetManyEngagementsResponse>(
					'/crm/v3/objects/engagements',
					TEST_TOKEN,
					{ query: { limit: 1 } },
				);
			if (!engagementsListResponse.results) {
				return;
			}
			const engagementId = engagementsListResponse.results[0]?.id;
			if (!engagementId) {
				return;
			}

			const response = await makeHubSpotRequest<GetEngagementResponse>(
				`/crm/v3/objects/engagements/${engagementId}`,
				TEST_TOKEN,
			);
			const result = response;

			HubSpotEndpointOutputSchemas.engagementsGet.parse(result);
		});
	});
});
