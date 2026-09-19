import { logEventFromContext } from 'corsair/core';
import { getClientaryCredentials, makeClientaryRequest } from './client';
import {
	remove as deleteClient,
	list as listClients,
} from './endpoints/clients';
import { remove as deleteContact } from './endpoints/contacts';
import {
	remove as deleteEstimate,
	list as listEstimates,
} from './endpoints/estimates';
import {
	remove as deleteInvoice,
	list as listInvoices,
} from './endpoints/invoices';
import { remove as deleteProject } from './endpoints/projects';
import { remove as deleteTask } from './endpoints/tasks';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
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

type CachedRow = {
	entity_id: string;
	data: { client_id?: number | string; client?: { id: number } };
};

function makeStore() {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
		list: jest.fn(async (): Promise<CachedRow[]> => []),
	};
}

function makeStores() {
	return {
		clients: makeStore(),
		contacts: makeStore(),
		projects: makeStore(),
		invoices: makeStore(),
		estimates: makeStore(),
		tasks: makeStore(),
	};
}

function makeCtx(stores: Record<string, ReturnType<typeof makeStore>>) {
	return {
		key: 'token',
		options: { domain: 'acme' },
		db: stores,
	} as never;
}

const client = { id: 1, name: 'Acme' };
const estimate = {
	id: 3,
	date: '2026-01-15',
	status: 0,
	currency_code: 'USD',
	subtotal: 100,
	total_cost: 107,
	tax: 7,
	tax2: 0,
	tax3: 0,
	compound_tax: false,
	client_id: 1,
};
const invoice = {
	id: 6,
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
	client_id: 1,
};

beforeEach(() => {
	mockLog.mockReset().mockResolvedValue(null);
	mockCreds.mockReset().mockResolvedValue({ apiKey: 'token', domain: 'acme' });
	mockRequest.mockReset();
	jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Clientary local cache', () => {
	it('upserts estimates returned by estimates.list', async () => {
		const estimates = makeStore();
		mockRequest.mockResolvedValueOnce({
			page_count: 1,
			page_size: 30,
			total_count: 1,
			estimates: [estimate],
		});

		await listEstimates(makeCtx({ estimates }), {});

		expect(estimates.upsertByEntityId).toHaveBeenCalledWith('3', estimate);
	});

	it('upserts invoices returned by invoices.list', async () => {
		const invoices = makeStore();
		mockRequest.mockResolvedValueOnce({
			page_count: 1,
			page_size: 25,
			total_count: 1,
			invoices: [invoice],
		});

		await listInvoices(makeCtx({ invoices }), {});

		expect(invoices.upsertByEntityId).toHaveBeenCalledWith('6', invoice);
	});

	it('evicts the local row after a remote delete', async () => {
		mockRequest.mockResolvedValue({});
		const stores = makeStores();

		await deleteClient(makeCtx(stores), { id: 1 });
		expect(stores.clients.deleteByEntityId).toHaveBeenCalledWith('1');

		await deleteContact(makeCtx(stores), { id: 2 });
		expect(stores.contacts.deleteByEntityId).toHaveBeenCalledWith('2');

		await deleteProject(makeCtx(stores), { id: 7 });
		expect(stores.projects.deleteByEntityId).toHaveBeenCalledWith('7');

		await deleteInvoice(makeCtx(stores), { id: 6 });
		expect(stores.invoices.deleteByEntityId).toHaveBeenCalledWith('6');

		await deleteEstimate(makeCtx(stores), { id: 3 });
		expect(stores.estimates.deleteByEntityId).toHaveBeenCalledWith('3');

		await deleteTask(makeCtx(stores), { id: 12 });
		expect(stores.tasks.deleteByEntityId).toHaveBeenCalledWith('12');
	});

	it('evicts related local rows after a cascading client delete', async () => {
		mockRequest.mockResolvedValue({});
		const stores = makeStores();
		stores.contacts.list.mockResolvedValueOnce([
			{ entity_id: '2', data: { client_id: 1 } },
		]);
		// Clientary projects nest `client.id` rather than a top-level client_id.
		stores.projects.list.mockResolvedValueOnce([
			{ entity_id: '7', data: { client: { id: 1 } } },
		]);
		stores.invoices.list.mockResolvedValueOnce([
			{ entity_id: '6', data: { client_id: '1' } },
		]);
		stores.estimates.list.mockResolvedValueOnce([
			{ entity_id: '3', data: { client_id: 1 } },
		]);
		stores.tasks.list.mockResolvedValueOnce([
			{ entity_id: '12', data: { client_id: 1 } },
		]);

		await deleteClient(makeCtx(stores), { id: 1 });

		expect(stores.contacts.list).toHaveBeenCalledWith({
			limit: 100,
			offset: 0,
		});
		expect(stores.contacts.deleteByEntityId).toHaveBeenCalledWith('2');
		expect(stores.projects.deleteByEntityId).toHaveBeenCalledWith('7');
		expect(stores.invoices.deleteByEntityId).toHaveBeenCalledWith('6');
		expect(stores.estimates.deleteByEntityId).toHaveBeenCalledWith('3');
		expect(stores.tasks.deleteByEntityId).toHaveBeenCalledWith('12');
	});

	it('pages through related rows when evicting after a client delete', async () => {
		mockRequest.mockResolvedValue({});
		const stores = makeStores();
		const firstPage = Array.from({ length: 100 }, (_, i) => ({
			entity_id: String(i + 100),
			data: { client_id: 99 },
		}));
		stores.contacts.list
			.mockResolvedValueOnce(firstPage)
			.mockResolvedValueOnce([{ entity_id: '2', data: { client_id: 1 } }]);

		await deleteClient(makeCtx(stores), { id: 1 });

		expect(stores.contacts.list).toHaveBeenNthCalledWith(1, {
			limit: 100,
			offset: 0,
		});
		expect(stores.contacts.list).toHaveBeenNthCalledWith(2, {
			limit: 100,
			offset: 100,
		});
		expect(stores.contacts.deleteByEntityId).toHaveBeenCalledWith('2');
		expect(stores.contacts.deleteByEntityId).not.toHaveBeenCalledWith('100');
	});

	it('does not fail the API call when a cache write fails', async () => {
		const clients = makeStore();
		clients.upsertByEntityId.mockRejectedValueOnce(new Error('db offline'));
		mockRequest.mockResolvedValueOnce({
			page_count: 1,
			page_size: 25,
			total_count: 1,
			clients: [client],
		});

		await expect(listClients(makeCtx({ clients }), {})).resolves.toEqual(
			expect.objectContaining({ clients: [client] }),
		);
	});
});
