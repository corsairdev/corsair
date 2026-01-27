import { HubSpot } from '../hubspot-api';
import { ContactListsService } from '../../services/hubspot';
import { handleRateLimit, requireToken } from './setup';

describe('HubSpot.ContactLists - Contact Lists API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have all contact list methods defined', () => {
			expect(typeof ContactListsService.addContactToList).toBe('function');
			expect(typeof ContactListsService.removeContactFromList).toBe(
				'function',
			);
		});
	});

	describe('API facade methods', () => {
		it('should expose all contact list methods through facade', () => {
			expect(typeof HubSpot.ContactLists.addContact).toBe('function');
			expect(typeof HubSpot.ContactLists.removeContact).toBe('function');
		});
	});

	describe('Integration tests', () => {
		// Note: These tests require a valid list ID
		// They are skipped by default unless TEST_LIST_ID is set
		const testListId = process.env.TEST_LIST_ID;

		it.skip('should add contact to list', async () => {
			if (requireToken() || !testListId) return;

			try {
				const response = await HubSpot.ContactLists.addContact({
					listId: testListId,
					emails: ['test@example.com'],
				});
				expect(response).toBeDefined();
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it.skip('should remove contact from list', async () => {
			if (requireToken() || !testListId) return;

			try {
				const response = await HubSpot.ContactLists.removeContact({
					listId: testListId,
					emails: ['test@example.com'],
				});
				expect(response).toBeDefined();
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});

