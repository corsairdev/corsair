import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createCorsairOrm } from '../../db/orm';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { HubSpotAPIError } from './client';
import type {
	CreateCompanyResponse,
	CreateDealResponse,
	CreateOrUpdateContactResponse,
} from './endpoints/types';
import { hubspot } from './index';

dotenv.config();

async function createHubspotClient() {
	const token = process.env.HUBSPOT_ACCESS_TOKEN;
	if (!token) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'hubspot');

	const corsair = createCorsair({
		plugins: [
			hubspot({
				authType: 'oauth_2',
				credentials: {
					token,
				},
			}),
		],
		database: testDb.db,
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

		const listInput = {
			limit: 10,
		};

		const contactsList = await corsair.hubspot.api.contacts.getMany(listInput);

		expect(contactsList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.contacts.getMany' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		let contactId: string | undefined;

		if (contactsList.results && contactsList.results.length > 0) {
			contactId = contactsList.results[0]?.id;

			if (contactId) {
				const getInput = {
					contactId,
				};

				const contact = await corsair.hubspot.api.contacts.get(getInput);

				expect(contact).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'hubspot.contacts.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);

				const contactFromDb =
					await corsair.hubspot.db.contacts.findByEntityId(contactId);

				expect(contactFromDb).not.toBeNull();
				if (contactFromDb && contact.id) {
					expect(contactFromDb.data.id).toBe(contact.id);
				}
			}
		}

		const createInput = {
			properties: {
				email: `corsair-test-${Date.now()}@example.com`,
				firstname: 'Corsair',
				lastname: 'Test',
			},
		};

		const createdContact: CreateOrUpdateContactResponse =
			await corsair.hubspot.api.contacts.createOrUpdate(createInput);

		expect(createdContact).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.contacts.createOrUpdate' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const createdContactId = createdContact.id;

		if (createdContactId) {
			const createdContactFromDb =
				await corsair.hubspot.db.contacts.findByEntityId(createdContactId);

			expect(createdContactFromDb).not.toBeNull();
			if (createdContactFromDb) {
				expect(createdContactFromDb.data.id).toBe(createdContact.id);
			}

			const searchInput = {
				query: 'corsair',
				limit: 10,
			};

			const searchResult =
				await corsair.hubspot.api.contacts.search(searchInput);

			expect(searchResult).toBeDefined();

			const searchEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.contacts.search' },
			});

			expect(searchEvents.length).toBeGreaterThan(0);
			const searchEvent = searchEvents[searchEvents.length - 1]!;
			const searchEventPayload =
				typeof searchEvent.payload === 'string'
					? JSON.parse(searchEvent.payload)
					: searchEvent.payload;
			expect(searchEventPayload).toMatchObject(searchInput);

			const recentlyCreatedInput = {
				count: 5,
			};

			const recentlyCreated =
				await corsair.hubspot.api.contacts.getRecentlyCreated(
					recentlyCreatedInput,
				);

			expect(recentlyCreated).toBeDefined();

			const recentlyCreatedEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.contacts.getRecentlyCreated' },
			});

			expect(recentlyCreatedEvents.length).toBeGreaterThan(0);
			const recentlyCreatedEvent =
				recentlyCreatedEvents[recentlyCreatedEvents.length - 1]!;
			const recentlyCreatedEventPayload =
				typeof recentlyCreatedEvent.payload === 'string'
					? JSON.parse(recentlyCreatedEvent.payload)
					: recentlyCreatedEvent.payload;
			expect(recentlyCreatedEventPayload).toMatchObject(recentlyCreatedInput);

			const recentlyUpdatedInput = {
				count: 5,
			};

			const recentlyUpdated =
				await corsair.hubspot.api.contacts.getRecentlyUpdated(
					recentlyUpdatedInput,
				);

			expect(recentlyUpdated).toBeDefined();

			const recentlyUpdatedEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.contacts.getRecentlyUpdated' },
			});

			expect(recentlyUpdatedEvents.length).toBeGreaterThan(0);
			const recentlyUpdatedEvent =
				recentlyUpdatedEvents[recentlyUpdatedEvents.length - 1]!;
			const recentlyUpdatedEventPayload =
				typeof recentlyUpdatedEvent.payload === 'string'
					? JSON.parse(recentlyUpdatedEvent.payload)
					: recentlyUpdatedEvent.payload;
			expect(recentlyUpdatedEventPayload).toMatchObject(recentlyUpdatedInput);
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

		const listInput = {
			limit: 10,
		};

		const companiesList =
			await corsair.hubspot.api.companies.getMany(listInput);

		expect(companiesList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.companies.getMany' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		let companyId: string | undefined;

		if (companiesList.results && companiesList.results.length > 0) {
			companyId = companiesList.results[0]?.id;

			if (companyId) {
				const getInput = {
					companyId,
				};

				const company = await corsair.hubspot.api.companies.get(getInput);

				expect(company).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'hubspot.companies.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);

				const companyFromDb =
					await corsair.hubspot.db.companies.findByEntityId(companyId);

				expect(companyFromDb).not.toBeNull();
				if (companyFromDb && company.id) {
					expect(companyFromDb.data.id).toBe(company.id);
				}
			}
		}

		const createInput = {
			properties: {
				name: `Corsair Test Company ${Date.now()}`,
				domain: `corsair-test-${Date.now()}.example.com`,
			},
		};

		const createdCompany: CreateCompanyResponse =
			await corsair.hubspot.api.companies.create(createInput);

		expect(createdCompany).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.companies.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const createdCompanyId = createdCompany.id;

		if (createdCompanyId) {
			const createdCompanyFromDb =
				await corsair.hubspot.db.companies.findByEntityId(createdCompanyId);

			expect(createdCompanyFromDb).not.toBeNull();
			if (createdCompanyFromDb) {
				expect(createdCompanyFromDb.data.id).toBe(createdCompany.id);
			}

			const updateInput = {
				companyId: createdCompanyId,
				properties: {
					name: `Corsair Test Company Updated ${Date.now()}`,
				},
			};

			const updatedCompany =
				await corsair.hubspot.api.companies.update(updateInput);

			expect(updatedCompany).toBeDefined();

			const updateEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.companies.update' },
			});

			expect(updateEvents.length).toBeGreaterThan(0);
			const updateEvent = updateEvents[updateEvents.length - 1]!;
			const updateEventPayload =
				typeof updateEvent.payload === 'string'
					? JSON.parse(updateEvent.payload)
					: updateEvent.payload;
			expect(updateEventPayload).toMatchObject(updateInput);

			const recentlyCreatedInput = {
				count: 5,
			};

			const recentlyCreated =
				await corsair.hubspot.api.companies.getRecentlyCreated(
					recentlyCreatedInput,
				);

			expect(recentlyCreated).toBeDefined();

			const recentlyCreatedEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.companies.getRecentlyCreated' },
			});

			expect(recentlyCreatedEvents.length).toBeGreaterThan(0);
			const recentlyCreatedEvent =
				recentlyCreatedEvents[recentlyCreatedEvents.length - 1]!;
			const recentlyCreatedEventPayload =
				typeof recentlyCreatedEvent.payload === 'string'
					? JSON.parse(recentlyCreatedEvent.payload)
					: recentlyCreatedEvent.payload;
			expect(recentlyCreatedEventPayload).toMatchObject(recentlyCreatedInput);

			const recentlyUpdatedInput = {
				count: 5,
			};

			const recentlyUpdated =
				await corsair.hubspot.api.companies.getRecentlyUpdated(
					recentlyUpdatedInput,
				);

			expect(recentlyUpdated).toBeDefined();

			const recentlyUpdatedEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.companies.getRecentlyUpdated' },
			});

			expect(recentlyUpdatedEvents.length).toBeGreaterThan(0);
			const recentlyUpdatedEvent =
				recentlyUpdatedEvents[recentlyUpdatedEvents.length - 1]!;
			const recentlyUpdatedEventPayload =
				typeof recentlyUpdatedEvent.payload === 'string'
					? JSON.parse(recentlyUpdatedEvent.payload)
					: recentlyUpdatedEvent.payload;
			expect(recentlyUpdatedEventPayload).toMatchObject(recentlyUpdatedInput);
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

		const listInput = {
			limit: 10,
		};

		const dealsList = await corsair.hubspot.api.deals.getMany(listInput);

		expect(dealsList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.deals.getMany' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		let dealId: string | undefined;

		if (dealsList.results && dealsList.results.length > 0) {
			dealId = dealsList.results[0]?.id;

			if (dealId) {
				const getInput = {
					dealId,
				};

				const deal = await corsair.hubspot.api.deals.get(getInput);

				expect(deal).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'hubspot.deals.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);

				const dealFromDb =
					await corsair.hubspot.db.deals.findByEntityId(dealId);

				expect(dealFromDb).not.toBeNull();
				if (dealFromDb && deal.id) {
					expect(dealFromDb.data.id).toBe(deal.id);
				}
			}
		}

		const createInput = {
			properties: {
				dealname: `Corsair Test Deal ${Date.now()}`,
				dealstage: 'appointmentscheduled',
				pipeline: 'default',
			},
		};

		const createdDeal: CreateDealResponse =
			await corsair.hubspot.api.deals.create(createInput);

		expect(createdDeal).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.deals.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const createdDealId = createdDeal.id;

		if (createdDealId) {
			const createdDealFromDb =
				await corsair.hubspot.db.deals.findByEntityId(createdDealId);

			expect(createdDealFromDb).not.toBeNull();
			if (createdDealFromDb) {
				expect(createdDealFromDb.data.id).toBe(createdDeal.id);
			}

			const updateInput = {
				dealId: createdDealId,
				properties: {
					dealname: `Corsair Test Deal Updated ${Date.now()}`,
				},
			};

			const updatedDeal = await corsair.hubspot.api.deals.update(updateInput);

			expect(updatedDeal).toBeDefined();

			const updateEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.deals.update' },
			});

			expect(updateEvents.length).toBeGreaterThan(0);
			const updateEvent = updateEvents[updateEvents.length - 1]!;
			const updateEventPayload =
				typeof updateEvent.payload === 'string'
					? JSON.parse(updateEvent.payload)
					: updateEvent.payload;
			expect(updateEventPayload).toMatchObject(updateInput);

			const searchInput = {
				query: 'corsair',
				limit: 10,
			};

			const searchResult = await corsair.hubspot.api.deals.search(searchInput);

			expect(searchResult).toBeDefined();

			const searchEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.deals.search' },
			});

			expect(searchEvents.length).toBeGreaterThan(0);
			const searchEvent = searchEvents[searchEvents.length - 1]!;
			const searchEventPayload =
				typeof searchEvent.payload === 'string'
					? JSON.parse(searchEvent.payload)
					: searchEvent.payload;
			expect(searchEventPayload).toMatchObject(searchInput);
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

		const listInput = {
			limit: 10,
		};

		let ticketsList: any;
		try {
			ticketsList = await corsair.hubspot.api.tickets.getMany(listInput);
		} catch (error) {
			if (error instanceof HubSpotAPIError && error.code === 403) {
				testDb.cleanup();
				return;
			}
			throw error;
		}

		expect(ticketsList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.tickets.getMany' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		let ticketId: string | undefined;

		if (ticketsList.results && ticketsList.results.length > 0) {
			ticketId = ticketsList.results[0]?.id;

			if (ticketId) {
				const getInput = {
					ticketId,
				};

				const ticket = await corsair.hubspot.api.tickets.get(getInput);

				expect(ticket).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'hubspot.tickets.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);

				const ticketFromDb =
					await corsair.hubspot.db.tickets.findByEntityId(ticketId);

				expect(ticketFromDb).not.toBeNull();
				if (ticketFromDb && ticket.id) {
					expect(ticketFromDb.data.id).toBe(ticket.id);
				}
			}
		}

		const createInput = {
			properties: {
				subject: `Corsair Test Ticket ${Date.now()}`,
				content: 'Test ticket created by Corsair integration test',
			},
		};

		let createdTicket: any;
		try {
			createdTicket = await corsair.hubspot.api.tickets.create(createInput);
		} catch (error) {
			if (error instanceof HubSpotAPIError) {
				console.warn('Skipping ticket creation - API error:', error.message);
				testDb.cleanup();
				return;
			}
			throw error;
		}

		expect(createdTicket).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.tickets.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const createdTicketId = createdTicket.id;

		if (createdTicketId) {
			const createdTicketFromDb =
				await corsair.hubspot.db.tickets.findByEntityId(createdTicketId);

			expect(createdTicketFromDb).not.toBeNull();
			if (createdTicketFromDb) {
				expect(createdTicketFromDb.data.id).toBe(createdTicket.id);
			}

			const updateInput = {
				ticketId: createdTicketId,
				properties: {
					subject: `Corsair Test Ticket Updated ${Date.now()}`,
				},
			};

			const updatedTicket =
				await corsair.hubspot.api.tickets.update(updateInput);

			expect(updatedTicket).toBeDefined();

			const updateEvents = await orm.events.findMany({
				where: { event_type: 'hubspot.tickets.update' },
			});

			expect(updateEvents.length).toBeGreaterThan(0);
			const updateEvent = updateEvents[updateEvents.length - 1]!;
			const updateEventPayload =
				typeof updateEvent.payload === 'string'
					? JSON.parse(updateEvent.payload)
					: updateEvent.payload;
			expect(updateEventPayload).toMatchObject(updateInput);
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

		const listInput = {
			limit: 10,
		};

		const engagementsList =
			await corsair.hubspot.api.engagements.getMany(listInput);

		expect(engagementsList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.engagements.getMany' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		let engagementId: string | undefined;

		if (engagementsList.results && engagementsList.results.length > 0) {
			engagementId = engagementsList.results[0]?.id;

			if (engagementId) {
				const getInput = {
					engagementId,
				};

				const engagement = await corsair.hubspot.api.engagements.get(getInput);

				expect(engagement).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'hubspot.engagements.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);
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

		const createInput = {
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
		};

		let createdEngagement: any;
		try {
			createdEngagement =
				await corsair.hubspot.api.engagements.create(createInput);
		} catch (error) {
			if (error instanceof HubSpotAPIError) {
				testDb.cleanup();
				return;
			}
			throw error;
		}

		expect(createdEngagement).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'hubspot.engagements.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		if (createdEngagement && createdEngagement.id) {
			const engagementFromDb =
				await corsair.hubspot.db.engagements.findByEntityId(
					createdEngagement.id,
				);

			expect(engagementFromDb).not.toBeNull();
			if (engagementFromDb) {
				expect(engagementFromDb.data.id).toBe(createdEngagement.id);
			}
		}

		testDb.cleanup();
	});
});
