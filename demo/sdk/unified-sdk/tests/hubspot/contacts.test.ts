import { HubSpot } from '../hubspot-api';
import { ContactsService } from '../../services/hubspot';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
	sleep,
} from './setup';

describe('HubSpot.Contacts - Contacts API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have all contact methods defined', () => {
			expect(typeof ContactsService.getContact).toBe('function');
			expect(typeof ContactsService.getManyContacts).toBe('function');
			expect(typeof ContactsService.createOrUpdateContact).toBe('function');
			expect(typeof ContactsService.deleteContact).toBe('function');
			expect(typeof ContactsService.getRecentlyCreatedContacts).toBe(
				'function',
			);
			expect(typeof ContactsService.getRecentlyUpdatedContacts).toBe(
				'function',
			);
			expect(typeof ContactsService.searchContacts).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all contact methods through facade', () => {
			expect(typeof HubSpot.Contacts.get).toBe('function');
			expect(typeof HubSpot.Contacts.getMany).toBe('function');
			expect(typeof HubSpot.Contacts.createOrUpdate).toBe('function');
			expect(typeof HubSpot.Contacts.delete).toBe('function');
			expect(typeof HubSpot.Contacts.getRecentlyCreated).toBe('function');
			expect(typeof HubSpot.Contacts.getRecentlyUpdated).toBe('function');
			expect(typeof HubSpot.Contacts.search).toBe('function');
		});
	});

	describe('Integration tests', () => {
		let createdContactId: string | undefined;

		afterAll(async () => {
			if (createdContactId && !requireToken()) {
				try {
					await HubSpot.Contacts.delete({ contactId: createdContactId });
					console.log(`Cleanup: Deleted contact ${createdContactId}`);
				} catch (e) {
					console.warn(`Cleanup failed for contact ${createdContactId}`);
				}
			}
		});

		it('should get many contacts', async () => {
			if (requireToken()) return;

			try {
                const response = await HubSpot.Contacts.getMany({ limit: 10 });
                console.log(response);
				expect(response).toBeDefined();
				expect(Array.isArray(response.results)).toBe(true);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should create or update a contact', async () => {
			if (requireToken()) return;

			try {
				const testEmail = `test-${generateTestId()}@example.com`;
				const response = await HubSpot.Contacts.createOrUpdate({
					properties: {
						email: testEmail,
						firstname: 'Test',
						lastname: 'Contact',
					},
				});
				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
				createdContactId = response.id;
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should get a contact by ID', async () => {
			if (requireToken() || !createdContactId) return;

			try {
				await sleep(1000); // Wait for contact to be available
				const response = await HubSpot.Contacts.get({
					contactId: createdContactId,
				});
				expect(response).toBeDefined();
				expect(response.id).toBe(createdContactId);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});

