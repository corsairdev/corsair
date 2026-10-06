import * as client from '../client';
import { Contacts } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

jest.mock('../client', () => ({
	makeIntercomRequest: jest.fn(),
}));

const mockedRequest = client.makeIntercomRequest as jest.MockedFunction<
	typeof client.makeIntercomRequest
>;

const company = {
	type: 'company',
	id: 'company-123',
	name: 'Acme',
};

describe('Intercom contacts endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue(company as never);
	});

	describe('attachToCompany', () => {
		it('sends the company id as `id` in the request body', async () => {
			const ctx = { key: 'test-token', db: {} } as any;

			await Contacts.attachToCompany(ctx, {
				contact_id: 'contact-1',
				company_id: 'company-123',
			});

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				'contacts/contact-1/companies',
				'test-token',
				{ method: 'POST', body: { id: 'company-123' } },
			);
		});

		it('does not send `company_id` in the request body', async () => {
			const ctx = { key: 'test-token', db: {} } as any;

			await Contacts.attachToCompany(ctx, {
				contact_id: 'contact-1',
				company_id: 'company-123',
			});

			const options = mockedRequest.mock.calls[0]?.[2];
			expect(options?.body).not.toHaveProperty('company_id');
			expect(options?.body).not.toHaveProperty('contact_id');
		});

		it('returns the attached company and saves it to the database', async () => {
			const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
			const ctx = {
				key: 'test-token',
				db: { companies: { upsertByEntityId } },
			} as any;

			const result = await Contacts.attachToCompany(ctx, {
				contact_id: 'contact-1',
				company_id: 'company-123',
			});

			expect(result).toEqual(company);
			expect(upsertByEntityId).toHaveBeenCalledWith('company-123', company);
		});
	});

	describe('detachFromCompany', () => {
		it('sends the company id in the URL path', async () => {
			const ctx = { key: 'test-token', db: {} } as any;

			await Contacts.detachFromCompany(ctx, {
				contact_id: 'contact-1',
				company_id: 'company-123',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'contacts/contact-1/companies/company-123',
				'test-token',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});
});
