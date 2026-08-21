import 'dotenv/config';
import { makeClientaryRequest } from './client';
import { ClientaryEndpointOutputSchemas } from './endpoints/types';

/**
 * Live API tests for Clientary. These only run when credentials are present:
 *   - CLIENTARY_API_KEY: the API token (Basic auth username+password)
 *   - CLIENTARY_DOMAIN:   the account subdomain (e.g. "acme")
 *
 * Without them, the whole suite is skipped so CI stays green offline.
 * Read-only endpoints are exercised when only read credentials are available;
 * write endpoints additionally require CLIENTARY_WRITE_ENABLED=true.
 */
const API_KEY = process.env.CLIENTARY_API_KEY;
const DOMAIN = process.env.CLIENTARY_DOMAIN;
const WRITE_ENABLED = process.env.CLIENTARY_WRITE_ENABLED === 'true';

const describeWhenCreds = API_KEY && DOMAIN ? describe : describe.skip;
const itWhenWritable = WRITE_ENABLED ? it : it.skip;

describeWhenCreds('Clientary API Type Tests', () => {
	describe('clients', () => {
		it('clientsList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'clients',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1, page_size: 5 } },
			);
			ClientaryEndpointOutputSchemas.clientsList.parse(response);
		});

		it('clientsGet returns correct type', async () => {
			const listResponse = await makeClientaryRequest<{
				clients?: Array<{ id: number }>;
			}>('clients', API_KEY!, DOMAIN!, {
				query: { page: 1, page_size: 1 },
			});
			const firstId = listResponse.clients?.[0]?.id;
			if (!firstId) {
				return console.warn('Skipping clientsGet - no clients in account');
			}
			const response = await makeClientaryRequest<unknown>(
				`clients/${firstId}`,
				API_KEY!,
				DOMAIN!,
			);
			ClientaryEndpointOutputSchemas.clientsGet.parse(response);
		});
	});

	describe('projects', () => {
		it('projectsList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'projects',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1, page_size: 5 } },
			);
			ClientaryEndpointOutputSchemas.projectsList.parse(response);
		});
	});

	describe('invoices', () => {
		it('invoicesList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'invoices',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1, page_size: 5 } },
			);
			ClientaryEndpointOutputSchemas.invoicesList.parse(response);
		});
	});

	describe('estimates', () => {
		it('estimatesList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'estimates',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1 } },
			);
			ClientaryEndpointOutputSchemas.estimatesList.parse(response);
		});
	});

	describe('expenses', () => {
		it('expensesList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'expenses',
				API_KEY!,
				DOMAIN!,
			);
			ClientaryEndpointOutputSchemas.expensesList.parse(response);
		});
	});

	describe('payments', () => {
		it('paymentsList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'payments',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1, page_size: 5 } },
			);
			ClientaryEndpointOutputSchemas.paymentsList.parse(response);
		});
	});

	describe('recurring', () => {
		it('recurringList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'recurring',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1 } },
			);
			ClientaryEndpointOutputSchemas.recurringList.parse(response);
		});
	});

	describe('staff', () => {
		it('staffList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'staff',
				API_KEY!,
				DOMAIN!,
			);
			ClientaryEndpointOutputSchemas.staffList.parse(response);
		});
	});

	describe('tasks', () => {
		it('tasksList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'tasks',
				API_KEY!,
				DOMAIN!,
			);
			ClientaryEndpointOutputSchemas.tasksList.parse(response);
		});
	});

	describe('contacts', () => {
		it('contactsList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'contacts',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1, page_size: 5 } },
			);
			ClientaryEndpointOutputSchemas.contactsList.parse(response);
		});
	});

	describe('leads', () => {
		it('leadsList returns correct type', async () => {
			const response = await makeClientaryRequest<unknown>(
				'leads',
				API_KEY!,
				DOMAIN!,
				{ query: { page: 1, page_size: 5 } },
			);
			ClientaryEndpointOutputSchemas.leadsList.parse(response);
		});
	});

	describe('write operations (gated)', () => {
		itWhenWritable('clientsCreate + clientsDelete round-trip', async () => {
			const created = await makeClientaryRequest<{ id: number; name: string }>(
				'clients',
				API_KEY!,
				DOMAIN!,
				{ method: 'POST', body: { client: { name: 'Corsair Test Client' } } },
			);
			try {
				ClientaryEndpointOutputSchemas.clientsCreate.parse(created);
			} finally {
				if (created.id) {
					await makeClientaryRequest<unknown>(
						`clients/${created.id}`,
						API_KEY!,
						DOMAIN!,
						{ method: 'DELETE' },
					);
				}
			}
		});

		itWhenWritable('tasksCreate + tasksDelete round-trip', async () => {
			const created = await makeClientaryRequest<{ id: number; title: string }>(
				'task',
				API_KEY!,
				DOMAIN!,
				{ method: 'POST', body: { task: { title: 'Corsair Test Task' } } },
			);
			try {
				ClientaryEndpointOutputSchemas.tasksCreate.parse(created);
			} finally {
				if (created.id) {
					await makeClientaryRequest<unknown>(
						`tasks/${created.id}`,
						API_KEY!,
						DOMAIN!,
						{ method: 'DELETE' },
					);
				}
			}
		});
	});
});
