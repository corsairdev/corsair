import * as client from '../client';
import type { ChaserContext } from '../index';
import {
	getInvoice,
	getOrganization,
	listCreditNotes,
	listCustomers,
	listInvoices,
} from './chaser';
import type { ChaserEndpointOutputs } from './types';

jest.mock('../client', () => ({
	makeChaserRequest: jest.fn(),
}));

// jest.mocked() retypes the mocked request without a type assertion,
// so the mock keeps the exact signature of makeChaserRequest.
const mockedRequest = jest.mocked(client.makeChaserRequest);

function createTestKeys(): ChaserContext['keys'] {
	const resolveNull = (): Promise<string | null> => Promise.resolve(null);
	const resolveVoid = (): Promise<void> => Promise.resolve();
	const resolveDek = (): Promise<string> => Promise.resolve('test-dek');
	return {
		get_dek: resolveDek,
		issue_new_dek: resolveDek,
		get_api_key: resolveNull,
		set_api_key: resolveVoid,
		get_webhook_signature: resolveNull,
		set_webhook_signature: resolveVoid,
		get_tenant_external_id: resolveNull,
		set_tenant_external_id: resolveVoid,
		get_api_secret: resolveNull,
		set_api_secret: resolveVoid,
	};
}

function createContext(): ChaserContext {
	return {
		key: 'chaser-test-api-key',
		$getAccountId: (): Promise<string> => Promise.resolve('test-account'),
		options: {},
		db: {},
		endpoints: {},
		keys: createTestKeys(),
	};
}

describe('Chaser endpoints', (): void => {
	beforeEach((): void => {
		jest.clearAllMocks();
	});

	describe('customers', (): void => {
		it('lists all customers', async (): Promise<void> => {
			const response: ChaserEndpointOutputs['listCustomers'] = {
				data: [{ id: 'cust_1', name: 'Acme Corp' }],
				total: 1,
			};
			mockedRequest.mockResolvedValueOnce(response);
			const result: ChaserEndpointOutputs['listCustomers'] =
				await listCustomers(createContext(), {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/customers',
				'chaser-test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});

	describe('invoices', (): void => {
		it('lists all invoices', async (): Promise<void> => {
			const response: ChaserEndpointOutputs['listInvoices'] = {
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
			const result: ChaserEndpointOutputs['listInvoices'] = await listInvoices(
				createContext(),
				{
					customer_external_id: 'external-customer-1',
				},
			);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/invoices',
				'chaser-test-api-key',
				expect.objectContaining({
					method: 'GET',
					query: { customer_external_id: 'external-customer-1' },
				}),
			);
			expect(result).toEqual(response);
		});

		it('gets an invoice by ID', async (): Promise<void> => {
			const response: ChaserEndpointOutputs['getInvoice'] = {
				id: 'inv_1',
				customer_id: 'cust_1',
				amount: 100,
				currency: 'GBP',
				status: 'open',
			};
			mockedRequest.mockResolvedValueOnce(response);
			const result: ChaserEndpointOutputs['getInvoice'] = await getInvoice(
				createContext(),
				{ id: 'inv_1' },
			);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/invoices/inv_1',
				'chaser-test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});

	describe('credit notes', (): void => {
		it('lists all credit notes', async (): Promise<void> => {
			const response: ChaserEndpointOutputs['listCreditNotes'] = {
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
			const result: ChaserEndpointOutputs['listCreditNotes'] =
				await listCreditNotes(createContext(), {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/credit-notes',
				'chaser-test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});

	describe('organization', (): void => {
		it('gets organization details', async (): Promise<void> => {
			const response: ChaserEndpointOutputs['getOrganization'] = {
				id: 'org_1',
				name: 'Test Org',
			};
			mockedRequest.mockResolvedValueOnce(response);
			const result: ChaserEndpointOutputs['getOrganization'] =
				await getOrganization(createContext(), {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/organization',
				'chaser-test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
		});
	});
});
