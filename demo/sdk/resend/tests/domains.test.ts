import { Resend } from '../api';
import { DomainsService } from '../services';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('Resend.Domains - Domains API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have domain methods defined', () => {
			expect(typeof DomainsService.createDomain).toBe('function');
			expect(typeof DomainsService.getDomain).toBe('function');
			expect(typeof DomainsService.listDomains).toBe('function');
			expect(typeof DomainsService.deleteDomain).toBe('function');
			expect(typeof DomainsService.verifyDomain).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose domain methods through facade', () => {
			expect(typeof Resend.Domains.create).toBe('function');
			expect(typeof Resend.Domains.get).toBe('function');
			expect(typeof Resend.Domains.list).toBe('function');
			expect(typeof Resend.Domains.delete).toBe('function');
			expect(typeof Resend.Domains.verify).toBe('function');
		});
	});

	describe('Integration tests', () => {
		it('should list domains', async () => {
			if (requireToken()) return;

			try {
				const response = await Resend.Domains.list();

				expect(response).toBeDefined();
				expect(response.data).toBeDefined();
				expect(Array.isArray(response.data)).toBe(true);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});
