import * as client from '../client';
import {
	getInvoice,
	getOrganization,
	listCreditNotes,
	listCustomers,
	listInvoices,
} from './chaser';

jest.mock('../client', () => ({
	makeChaserRequest: jest.fn(),
}));

const mockedRequest = client.makeChaserRequest as jest.MockedFunction<
	typeof client.makeChaserRequest
>;

const createContext = (input: unknown = {}) =>
	({
		key: 'chaser-test-api-key',
		$getAccountId: jest.fn().mockReturnValue('test-account'),
		secret: 'chaser-test-api-secret',
		db: {},
		input,
	}) as any;

describe('Chaser endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('customers', () => {
		it('lists all customers', async () => {
			const response = {
				data: [{ id: 'cust_1', name: 'Acme Corp' }],
				total: 1,
			};
			mockedRequest.mockResolvedValueOnce(response);
			const result = await listCustomers(createContext({}));
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/customers',
				'chaser-test-api-key',
				'chaser-test-api-secret',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});

	describe('invoices', () => {
		it('lists all invoices', async () => {
			const response = {
				data: [
					{
						id: 'inv_1',
						customer_id: 'cust_1',
						amount: 100,
						currency: 'GBP',
						status: 'open',
					},
				],
				total: 1,
			};
			mockedRequest.mockResolvedValueOnce(response);
			const result = await listInvoices(createContext({}));
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/invoices',
				'chaser-test-api-key',
				'chaser-test-api-secret',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});

		it('gets an invoice by ID', async () => {
			const response = {
				id: 'inv_1',
				customer_id: 'cust_1',
				amount: 100,
				currency: 'GBP',
				status: 'open',
			};
			mockedRequest.mockResolvedValueOnce(response);
			const result = await getInvoice(createContext({ id: 'inv_1' }));
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/invoices/inv_1',
				'chaser-test-api-key',
				'chaser-test-api-secret',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});

	describe('credit notes', () => {
		it('lists all credit notes', async () => {
			const response = {
				data: [
					{
						id: 'cn_1',
						customer_id: 'cust_1',
						amount: 50,
						currency: 'GBP',
						status: 'issued',
					},
				],
				total: 1,
			};
			mockedRequest.mockResolvedValueOnce(response);
			const result = await listCreditNotes(createContext({}));
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/credit-notes',
				'chaser-test-api-key',
				'chaser-test-api-secret',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});

	describe('organization', () => {
		it('gets organization details', async () => {
			const response = { id: 'org_1', name: 'Test Org' };
			mockedRequest.mockResolvedValueOnce(response);
			const result = await getOrganization(createContext({}));
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/organization',
				'chaser-test-api-key',
				'chaser-test-api-secret',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});
});
