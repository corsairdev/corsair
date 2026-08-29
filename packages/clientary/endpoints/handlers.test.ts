import { logEventFromContext } from 'corsair/core';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import {
	create as createContact,
	listForClient as listContactsForClient,
} from './contacts';
import { create as createInvoice, update as updateInvoice } from './invoices';
import { create as createTask, list as listTasks } from './tasks';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	getClientaryCredentials: jest.fn(),
	makeClientaryRequest: jest.fn(),
}));

const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const mockCreds = getClientaryCredentials as jest.MockedFunction<
	typeof getClientaryCredentials
>;
const mockRequest = makeClientaryRequest as jest.MockedFunction<
	typeof makeClientaryRequest
>;

function makeCtx() {
	return {
		key: 'token',
		options: { domain: 'acme' },
		db: {},
	} as never;
}

beforeEach(() => {
	mockLog.mockReset().mockResolvedValue(null);
	mockCreds.mockReset().mockResolvedValue({ apiKey: 'token', domain: 'acme' });
	mockRequest.mockReset();
});

describe('Clientary endpoint request shapes', () => {
	it('creates a contact under the client path with a client_user body', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 9,
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			client_id: 3,
		});

		await createContact(makeCtx(), {
			client_id: 3,
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			phone: '555-0100',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'clients/3/contacts',
			'token',
			'acme',
			{
				method: 'POST',
				body: {
					client_user: {
						name: 'Ada Lovelace',
						email: 'ada@example.com',
						phone: '555-0100',
					},
				},
			},
		);
	});

	it('creates a task at the singular task path', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 4,
			title: 'Ship it',
			complete: false,
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-01T00:00:00Z',
		});

		await createTask(makeCtx(), { title: 'Ship it' });

		expect(mockRequest).toHaveBeenCalledWith('task', 'token', 'acme', {
			method: 'POST',
			body: { task: { title: 'Ship it' } },
		});
	});

	it('updates an invoice at the singular invoice path', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 12,
			date: '2026-02-01',
			status: 0,
			currency_code: 'USD',
			subtotal: 100,
			total_cost: 100,
			balance: 100,
			total_payments: 0,
			tax: 0,
			tax2: 0,
			tax3: 0,
			compound_tax: false,
		});

		await updateInvoice(makeCtx(), { id: 12, note: 'updated' });

		expect(mockRequest).toHaveBeenCalledWith('invoice/12', 'token', 'acme', {
			method: 'PUT',
			body: { invoice: { note: 'updated' } },
		});
	});

	it('forwards page and page_size on scoped contact lists', async () => {
		mockRequest.mockResolvedValueOnce({
			page_count: 1,
			page_size: 10,
			total_count: 0,
			contacts: [],
		});

		await listContactsForClient(makeCtx(), {
			client_id: 3,
			page: 2,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'clients/3/contacts',
			'token',
			'acme',
			{ query: { page: 2, page_size: 10 } },
		);
	});

	it('forwards page and page_size on the global task list', async () => {
		mockRequest.mockResolvedValueOnce({
			total_count: 0,
			page_count: 1,
			page_size: 25,
			tasks: [],
		});

		await listTasks(makeCtx(), { page: 1, page_size: 25 });

		expect(mockRequest).toHaveBeenCalledWith('tasks', 'token', 'acme', {
			query: { page: 1, page_size: 25 },
		});
	});

	it('logs only ids after creating a contact', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 9,
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			client_id: 3,
		});

		await createContact(makeCtx(), {
			client_id: 3,
			name: 'Ada Lovelace',
			email: 'ada@example.com',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'clientary.contacts.create',
			{ id: 9, client_id: 3 },
			'completed',
		);
		const logged = mockLog.mock.calls[0]![2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('email');
		expect(logged).not.toHaveProperty('name');
	});

	it('logs only ids after creating an invoice', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 12,
			date: '2026-02-01',
			status: 0,
			currency_code: 'USD',
			subtotal: 100,
			total_cost: 100,
			balance: 100,
			total_payments: 0,
			tax: 0,
			tax2: 0,
			tax3: 0,
			compound_tax: false,
			client_id: 3,
		});

		await createInvoice(makeCtx(), {
			date: '2026-02-01',
			due_date: '2026-02-15',
			currency_code: 'USD',
			client_id: 3,
			invoice_items_attributes: [{ title: 'Work', price: 100, quantity: 1 }],
		});

		const logged = mockLog.mock.calls[0]![2] as Record<string, unknown>;
		expect(logged).toEqual({ id: 12, client_id: 3 });
		expect(logged).not.toHaveProperty('invoice_items_attributes');
	});
});
