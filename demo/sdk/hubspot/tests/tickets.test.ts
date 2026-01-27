import { HubSpot } from '../api';
import { TicketsService } from '../services';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
	sleep,
} from './setup';

describe('HubSpot.Tickets - Tickets API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have all ticket methods defined', () => {
			expect(typeof TicketsService.getTicket).toBe('function');
			expect(typeof TicketsService.getManyTickets).toBe('function');
			expect(typeof TicketsService.createTicket).toBe('function');
			expect(typeof TicketsService.updateTicket).toBe('function');
			expect(typeof TicketsService.deleteTicket).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all ticket methods through facade', () => {
			expect(typeof HubSpot.Tickets.get).toBe('function');
			expect(typeof HubSpot.Tickets.getMany).toBe('function');
			expect(typeof HubSpot.Tickets.create).toBe('function');
			expect(typeof HubSpot.Tickets.update).toBe('function');
			expect(typeof HubSpot.Tickets.delete).toBe('function');
		});
	});

	describe('Integration tests', () => {
		let createdTicketId: string | undefined;

		afterAll(async () => {
			if (createdTicketId && !requireToken()) {
				try {
					await HubSpot.Tickets.delete({ ticketId: createdTicketId });
					console.log(`Cleanup: Deleted ticket ${createdTicketId}`);
				} catch (e) {
					console.warn(`Cleanup failed for ticket ${createdTicketId}`);
				}
			}
		});

		it('should get many tickets', async () => {
			if (requireToken()) return;

			try {
				const response = await HubSpot.Tickets.getMany({ limit: 10 });
				expect(response).toBeDefined();
				expect(Array.isArray(response.results)).toBe(true);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should create a ticket', async () => {
			if (requireToken()) return;

			try {
				const testSubject = `Test Ticket ${generateTestId()}`;
				const response = await HubSpot.Tickets.create({
					properties: {
						subject: testSubject,
						content: 'Test ticket content',
					},
				});
				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
				createdTicketId = response.id;
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should get a ticket by ID', async () => {
			if (requireToken() || !createdTicketId) return;

			try {
				await sleep(1000); // Wait for ticket to be available
				const response = await HubSpot.Tickets.get({
					ticketId: createdTicketId,
				});
				expect(response).toBeDefined();
				expect(response.id).toBe(createdTicketId);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});

