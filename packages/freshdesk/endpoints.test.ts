import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { makeFreshdeskRequest } from './client';
import { Routes } from './endpoints';
import { FRESHDESK_OPERATIONS } from './endpoints/operations';
import type { FreshdeskContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);
const mockedLog = jest.mocked(logEventFromContext);

function buildContext(): FreshdeskContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-key',
		options: { domain: 'acme.freshdesk.com' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
	mockedRequest.mockResolvedValue([
		{ id: 21, subject: 'Private customer data' },
	]);
});

describe('Freshdesk v2 route endpoints', () => {
	it.each(Object.values(FRESHDESK_OPERATIONS))(
		'calls documented $method $path',
		async (definition) => {
			const pathParams = Object.fromEntries(
				definition.pathParams.map((name) => [name, 'fixture-id']),
			);
			const query = {
				...definition.queryDefaults,
				...Object.fromEntries(
					definition.requiredQuery.map((name) => [name, 'fixture-value']),
				),
			};
			const expectedPath = definition.path.replace(
				/\[([^\]]+)\]/g,
				'fixture-id',
			);
			await makeFreshdeskRequest(ctx, 'test-key', definition, {
				pathParams,
				query,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://acme.freshdesk.com' }),
				expect.objectContaining({
					method: definition.method,
					url: expectedPath,
				}),
				expect.anything(),
			);
		},
	);

	it('forwards list pagination and parses the response', async () => {
		const result = await Routes.listAllTicketsGetTickets.run(ctx, {
			query: { page: 2, per_page: 25 },
		});

		expect(result).toEqual([{ id: 21, subject: 'Private customer data' }]);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://acme.freshdesk.com' }),
			expect.objectContaining({
				method: 'GET',
				url: '/api/v2/tickets',
				query: { page: 2, per_page: 25 },
			}),
			expect.anything(),
		);
	});

	it('encodes path IDs and sends the operation method and body', async () => {
		mockedRequest.mockResolvedValue({ id: 42, subject: 'Updated' });
		await Routes.updateTicketPut.run(ctx, {
			pathParams: { id: 'ticket/42' },
			body: { subject: 'Updated' },
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PUT',
				url: '/api/v2/tickets/ticket%2F42',
				body: { subject: 'Updated' },
			}),
			expect.anything(),
		);
	});

	it('rejects missing path parameters, extra input keys, and page sizes over 100 before I/O', async () => {
		await expect(Routes.viewATicketGet.run(ctx, {})).rejects.toThrow();
		await expect(
			Routes.filterTicketsGetTickets.run(ctx, { query: {} }),
		).rejects.toThrow('Missing required query parameter');
		await expect(
			Routes.listAllTicketsGetTickets.run(ctx, { query: { per_page: 101 } }),
		).rejects.toThrow();
		await expect(
			Routes.createTicketPostTickets.run(ctx, {
				body: { undocumented_field: 'reject me' },
			}),
		).rejects.toThrow('Undocumented Freshdesk request field');
		await expect(
			Routes.createTicketPostTickets.run(ctx, { body: { email: 123 } }),
		).rejects.toThrow('Invalid value for Freshdesk request field');

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('does not log customer input or response data', async () => {
		await Routes.createTicketPostTickets.run(ctx, {
			body: {
				email: 'private-user@freshdesk.invalid',
				subject: 'Sensitive subject',
			},
		});

		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'freshdesk.api',
			{ method: 'POST', title: 'Create a Ticket' },
			'completed',
		);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'private-user@freshdesk.invalid',
		);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'Sensitive subject',
		);
	});
});
