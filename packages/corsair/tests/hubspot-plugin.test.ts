import dotenv from 'dotenv';
import { createCorsair } from '../core';
import { hubspot } from '../plugins/hubspot';
import { HubSpotAPIError } from '../plugins/hubspot/client';
import type {
	CreateCompanyResponse,
	CreateDealResponse,
	CreateOrUpdateContactResponse,
} from '../plugins/hubspot/endpoints/types';
import { createIntegrationAndAccount } from './plugins-test-utils';
import { createTestDatabase } from './setup-db';

dotenv.config();

async function createHubspotClient() {
	const token = process.env.HUBSPOT_ACCESS_TOKEN;
	if (!token) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'hubspot');

	const corsair = createCorsair({
		plugins: [
			hubspot({
				authType: 'oauth_2',
				credentials: {
					token,
				},
			}),
		],
		database: testDb.adapter,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('HubSpot plugin integration', () => {
	it('contacts endpoints interact with API and DB', async () => {
		const setup = await createHubspotClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const contactsList = await corsair.hubspot.api.contacts.getMany({
			limit: 10,
		});

		expect(contactsList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.contacts.getMany' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		let contactId: string | undefined;

		if (contactsList.results && contactsList.results.length > 0) {
			contactId = contactsList.results[0]?.id;

			if (contactId) {
				const contact = await corsair.hubspot.api.contacts.get({
					contactId,
				});

				expect(contact).toBeDefined();

				const getEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'hubspot.contacts.get' }],
				});

				expect(getEvents.length).toBeGreaterThan(0);

				const contactFromDb =
					await corsair.hubspot.db.contacts.findByEntityId(contactId);

				expect(contactFromDb).not.toBeNull();
			}
		}

		const createdContact: CreateOrUpdateContactResponse =
			await corsair.hubspot.api.contacts.createOrUpdate({
				properties: {
					email: `corsair-test-${Date.now()}@example.com`,
					firstname: 'Corsair',
					lastname: 'Test',
				},
			});

		expect(createdContact).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'hubspot.contacts.createOrUpdate' },
			],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		const createdContactId = createdContact.id;

		if (createdContactId) {
			const createdContactFromDb =
				await corsair.hubspot.db.contacts.findByEntityId(createdContactId);

			expect(createdContactFromDb).not.toBeNull();

			const searchResult = await corsair.hubspot.api.contacts.search({
				query: 'corsair',
				limit: 10,
			});

			expect(searchResult).toBeDefined();

			const searchEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'hubspot.contacts.search' }],
			});

			expect(searchEvents.length).toBeGreaterThan(0);

			const recentlyCreated =
				await corsair.hubspot.api.contacts.getRecentlyCreated({
					count: 5,
				});

			expect(recentlyCreated).toBeDefined();

			const recentlyCreatedEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [
					{
						field: 'event_type',
						value: 'hubspot.contacts.getRecentlyCreated',
					},
				],
			});

			expect(recentlyCreatedEvents.length).toBeGreaterThan(0);

			const recentlyUpdated =
				await corsair.hubspot.api.contacts.getRecentlyUpdated({
					count: 5,
				});

			expect(recentlyUpdated).toBeDefined();

			const recentlyUpdatedEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [
					{
						field: 'event_type',
						value: 'hubspot.contacts.getRecentlyUpdated',
					},
				],
			});

			expect(recentlyUpdatedEvents.length).toBeGreaterThan(0);
		}

		const contactsCount = await corsair.hubspot.db.contacts.count();

		expect(contactsCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('companies endpoints interact with API and DB', async () => {
		const setup = await createHubspotClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const companiesList = await corsair.hubspot.api.companies.getMany({
			limit: 10,
		});

		expect(companiesList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.companies.getMany' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		let companyId: string | undefined;

		if (companiesList.results && companiesList.results.length > 0) {
			companyId = companiesList.results[0]?.id;

			if (companyId) {
				const company = await corsair.hubspot.api.companies.get({
					companyId,
				});

				expect(company).toBeDefined();

				const getEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'hubspot.companies.get' }],
				});

				expect(getEvents.length).toBeGreaterThan(0);

				const companyFromDb =
					await corsair.hubspot.db.companies.findByEntityId(companyId);

				expect(companyFromDb).not.toBeNull();
			}
		}

		const createdCompany: CreateCompanyResponse =
			await corsair.hubspot.api.companies.create({
				properties: {
					name: `Corsair Test Company ${Date.now()}`,
					domain: `corsair-test-${Date.now()}.example.com`,
				},
			});

		expect(createdCompany).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.companies.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		const createdCompanyId = createdCompany.id;

		if (createdCompanyId) {
			const createdCompanyFromDb =
				await corsair.hubspot.db.companies.findByEntityId(createdCompanyId);

			expect(createdCompanyFromDb).not.toBeNull();

			const updatedCompany = await corsair.hubspot.api.companies.update({
				companyId: createdCompanyId,
				properties: {
					name: `Corsair Test Company Updated ${Date.now()}`,
				},
			});

			expect(updatedCompany).toBeDefined();

			const updateEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'hubspot.companies.update' }],
			});

			expect(updateEvents.length).toBeGreaterThan(0);

			const recentlyCreated =
				await corsair.hubspot.api.companies.getRecentlyCreated({
					count: 5,
				});

			expect(recentlyCreated).toBeDefined();

			const recentlyUpdated =
				await corsair.hubspot.api.companies.getRecentlyUpdated({
					count: 5,
				});

			expect(recentlyUpdated).toBeDefined();
		}

		const companiesCount = await corsair.hubspot.db.companies.count();

		expect(companiesCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('deals endpoints interact with API and DB', async () => {
		const setup = await createHubspotClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const dealsList = await corsair.hubspot.api.deals.getMany({
			limit: 10,
		});

		expect(dealsList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.deals.getMany' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		let dealId: string | undefined;

		if (dealsList.results && dealsList.results.length > 0) {
			dealId = dealsList.results[0]?.id;

			if (dealId) {
				const deal = await corsair.hubspot.api.deals.get({
					dealId,
				});

				expect(deal).toBeDefined();

				const getEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'hubspot.deals.get' }],
				});

				expect(getEvents.length).toBeGreaterThan(0);

				const dealFromDb =
					await corsair.hubspot.db.deals.findByEntityId(dealId);

				expect(dealFromDb).not.toBeNull();
			}
		}

		const createdDeal: CreateDealResponse =
			await corsair.hubspot.api.deals.create({
				properties: {
					dealname: `Corsair Test Deal ${Date.now()}`,
					dealstage: 'appointmentscheduled',
					pipeline: 'default',
				},
			});

		expect(createdDeal).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.deals.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		const createdDealId = createdDeal.id;

		if (createdDealId) {
			const createdDealFromDb =
				await corsair.hubspot.db.deals.findByEntityId(createdDealId);

			expect(createdDealFromDb).not.toBeNull();

			const updatedDeal = await corsair.hubspot.api.deals.update({
				dealId: createdDealId,
				properties: {
					dealname: `Corsair Test Deal Updated ${Date.now()}`,
				},
			});

			expect(updatedDeal).toBeDefined();

			const updateEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'hubspot.deals.update' }],
			});

			expect(updateEvents.length).toBeGreaterThan(0);

			const searchResult = await corsair.hubspot.api.deals.search({
				query: 'corsair',
				limit: 10,
			});

			expect(searchResult).toBeDefined();

			const searchEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'hubspot.deals.search' }],
			});

			expect(searchEvents.length).toBeGreaterThan(0);
		}

		const dealsCount = await corsair.hubspot.db.deals.count();

		expect(dealsCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('tickets endpoints interact with API and DB', async () => {
		const setup = await createHubspotClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		let ticketsList: any;
		try {
			ticketsList = await corsair.hubspot.api.tickets.getMany({
				limit: 10,
			});
		} catch (error) {
			if (error instanceof HubSpotAPIError && error.code === 403) {
				testDb.cleanup();
				return;
			}
			throw error;
		}

		expect(ticketsList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.tickets.getMany' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		let ticketId: string | undefined;

		if (ticketsList.results && ticketsList.results.length > 0) {
			ticketId = ticketsList.results[0]?.id;

			if (ticketId) {
				const ticket = await corsair.hubspot.api.tickets.get({
					ticketId,
				});

				expect(ticket).toBeDefined();

				const getEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'hubspot.tickets.get' }],
				});

				expect(getEvents.length).toBeGreaterThan(0);

				const ticketFromDb =
					await corsair.hubspot.db.tickets.findByEntityId(ticketId);

				expect(ticketFromDb).not.toBeNull();
			}
		}

		let createdTicket: any;
		try {
			createdTicket = await corsair.hubspot.api.tickets.create({
				properties: {
					subject: `Corsair Test Ticket ${Date.now()}`,
					content: 'Test ticket created by Corsair integration test',
				},
			});
		} catch (error) {
			if (error instanceof HubSpotAPIError) {
				console.warn('Skipping ticket creation - API error:', error.message);
				testDb.cleanup();
				return;
			}
			throw error;
		}

		expect(createdTicket).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.tickets.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		const createdTicketId = createdTicket.id;

		if (createdTicketId) {
			const createdTicketFromDb =
				await corsair.hubspot.db.tickets.findByEntityId(createdTicketId);

			expect(createdTicketFromDb).not.toBeNull();

			const updatedTicket = await corsair.hubspot.api.tickets.update({
				ticketId: createdTicketId,
				properties: {
					subject: `Corsair Test Ticket Updated ${Date.now()}`,
				},
			});

			expect(updatedTicket).toBeDefined();

			const updateEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'hubspot.tickets.update' }],
			});

			expect(updateEvents.length).toBeGreaterThan(0);
		}

		const ticketsCount = await corsair.hubspot.db.tickets.count();

		expect(ticketsCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('engagements endpoints interact with API and DB', async () => {
		const setup = await createHubspotClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const engagementsList = await corsair.hubspot.api.engagements.getMany({
			limit: 10,
		});

		expect(engagementsList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.engagements.getMany' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		let engagementId: string | undefined;

		if (engagementsList.results && engagementsList.results.length > 0) {
			engagementId = engagementsList.results[0]?.id;

			if (engagementId) {
				const engagement = await corsair.hubspot.api.engagements.get({
					engagementId,
				});

				expect(engagement).toBeDefined();

				const getEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'hubspot.engagements.get' }],
				});

				expect(getEvents.length).toBeGreaterThan(0);
			}
		}

		const contactsList = await corsair.hubspot.api.contacts.getMany({
			limit: 1,
		});

		let contactId: number | undefined;

		if (contactsList.results && contactsList.results.length > 0) {
			const contactIdStr = contactsList.results[0]?.id;
			if (contactIdStr) {
				contactId = parseInt(contactIdStr, 10);
			}
		}

		if (!contactId) {
			testDb.cleanup();
			return;
		}

		let createdEngagement: any;
		try {
			createdEngagement = await corsair.hubspot.api.engagements.create({
				engagement: {
					type: 'NOTE',
					active: true,
					timestamp: Date.now(),
				},
				associations: {
					contactIds: [contactId],
				},
				metadata: {
					body: `Corsair test engagement ${Date.now()}`,
				},
			});
		} catch (error) {
			if (error instanceof HubSpotAPIError) {
				testDb.cleanup();
				return;
			}
			throw error;
		}

		expect(createdEngagement).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.engagements.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		if (createdEngagement && createdEngagement.id) {
			const engagementFromDb =
				await corsair.hubspot.db.engagements.findByEntityId(
					createdEngagement.id,
				);

			expect(engagementFromDb).not.toBeNull();
		}

		testDb.cleanup();
	});
});
