import { HubSpot } from '../hubspot-api';
import { CompaniesService } from '../../services/hubspot';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
	sleep,
} from './setup';

describe('HubSpot.Companies - Companies API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have all company methods defined', () => {
			expect(typeof CompaniesService.getCompany).toBe('function');
			expect(typeof CompaniesService.getManyCompanies).toBe('function');
			expect(typeof CompaniesService.createCompany).toBe('function');
			expect(typeof CompaniesService.updateCompany).toBe('function');
			expect(typeof CompaniesService.deleteCompany).toBe('function');
			expect(typeof CompaniesService.getRecentlyCreatedCompanies).toBe(
				'function',
			);
			expect(typeof CompaniesService.getRecentlyUpdatedCompanies).toBe(
				'function',
			);
			expect(typeof CompaniesService.searchCompanyByDomain).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all company methods through facade', () => {
			expect(typeof HubSpot.Companies.get).toBe('function');
			expect(typeof HubSpot.Companies.getMany).toBe('function');
			expect(typeof HubSpot.Companies.create).toBe('function');
			expect(typeof HubSpot.Companies.update).toBe('function');
			expect(typeof HubSpot.Companies.delete).toBe('function');
			expect(typeof HubSpot.Companies.getRecentlyCreated).toBe('function');
			expect(typeof HubSpot.Companies.getRecentlyUpdated).toBe('function');
			expect(typeof HubSpot.Companies.searchByDomain).toBe('function');
		});
	});

	describe('Integration tests', () => {
		let createdCompanyId: string | undefined;

		afterAll(async () => {
			if (createdCompanyId && !requireToken()) {
				try {
					await HubSpot.Companies.delete({ companyId: createdCompanyId });
					console.log(`Cleanup: Deleted company ${createdCompanyId}`);
				} catch (e) {
					console.warn(`Cleanup failed for company ${createdCompanyId}`);
				}
			}
		});

		it('should get many companies', async () => {
			if (requireToken()) return;

			try {
				const response = await HubSpot.Companies.getMany({ limit: 10 });
				expect(response).toBeDefined();
				expect(Array.isArray(response.results)).toBe(true);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should create a company', async () => {
			if (requireToken()) return;

			try {
				const testName = `Test Company ${generateTestId()}`;
				const response = await HubSpot.Companies.create({
					properties: {
						name: testName,
						domain: 'example.com',
					},
				});
				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
				createdCompanyId = response.id;
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should get a company by ID', async () => {
			if (requireToken() || !createdCompanyId) return;

			try {
				await sleep(1000); // Wait for company to be available
				const response = await HubSpot.Companies.get({
					companyId: createdCompanyId,
				});
				expect(response).toBeDefined();
				expect(response.id).toBe(createdCompanyId);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});

