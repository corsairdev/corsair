import { Resend } from '../api';
import { ApiError } from '../core/ApiError';
import { EmailsService } from '../services';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('Resend.Emails - Emails API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have email methods defined', () => {
			expect(typeof EmailsService.sendEmail).toBe('function');
			expect(typeof EmailsService.getEmail).toBe('function');
			expect(typeof EmailsService.listEmails).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose email methods through facade', () => {
			expect(typeof Resend.Emails.send).toBe('function');
			expect(typeof Resend.Emails.get).toBe('function');
			expect(typeof Resend.Emails.list).toBe('function');
		});
	});

	describe('Integration tests', () => {
		it('should send an email', async () => {
			if (requireToken()) return;

			try {
				const response = await Resend.Emails.send({
					from: 'onboarding@resend.dev',
					to: 'delivered@resend.dev',
					subject: `Test Email ${generateTestId()}`,
					html: '<p>This is a test email from the Resend SDK.</p>',
				});

				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
				expect(typeof response.id).toBe('string');
			} catch (error) {
				await handleRateLimit(error);
				if (error instanceof ApiError && error.status === 429) {
					return;
				}
				throw error;
			}
		});

		it('should send an email with text content', async () => {
			if (requireToken()) return;

			try {
				const response = await Resend.Emails.send({
					from: 'onboarding@resend.dev',
					to: 'delivered@resend.dev',
					subject: `Test Email Text ${generateTestId()}`,
					text: 'This is a test email with text content.',
				});

				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
			} catch (error) {
				await handleRateLimit(error);
				if (error instanceof ApiError && error.status === 429) {
					return;
				}
				throw error;
			}
		});

		it('should list emails', async () => {
			if (requireToken()) return;

			try {
				const response = await Resend.Emails.list();

				expect(response).toBeDefined();
				expect(response.data).toBeDefined();
				expect(Array.isArray(response.data)).toBe(true);
			} catch (error) {
				await handleRateLimit(error);
				if (error instanceof ApiError && error.status === 429) {
					return;
				}
				throw error;
			}
		});
	});
});
