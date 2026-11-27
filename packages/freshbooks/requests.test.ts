import {
	Clients,
	Estimates,
	Expenses,
	Invoices,
	Projects,
	Tasks,
	TimeEntries,
	Users,
} from './endpoints';
import {
	ACCOUNT_ID,
	BUSINESS_ID,
	clientRecord,
	clientsListResponse,
	estimateRecord,
	expenseRecord,
	invoiceRecord,
	invoicesListResponse,
	projectResponse,
	projectsDeleteResponse,
	projectsListResponse,
	taskRecord,
	timeEntriesListResponse,
	timeEntryResponse,
} from './test-fixtures';
import {
	expectBearerAuth,
	installFetchMock,
	invoke,
	lastRequest,
	respondEmpty,
	respondJson,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const fetchMock = installFetchMock();

// One test per operation: URL, method, auth placement, and every query or
// body field sent.

describe('users', () => {
	it('users.me asks the auth API for the identity', async () => {
		respondJson(fetchMock, {
			response: { id: 712052, business_memberships: [] },
		});

		await invoke(Users.me, {});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/auth/api/v1/users/me');
		expect(sent.query).toEqual({});
		expectBearerAuth(fetchMock);
	});
});

describe('clients', () => {
	it('clients.list pages over the accounting clients', async () => {
		respondJson(fetchMock, clientsListResponse);

		await invoke(Clients.list, {
			accountId: ACCOUNT_ID,
			page: 1,
			per_page: 100,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/accounting/account/${ACCOUNT_ID}/users/clients`);
		expect(sent.query).toEqual({ page: '1', per_page: '100' });
		expectBearerAuth(fetchMock);
	});

	it('clients.get reads one client', async () => {
		respondJson(fetchMock, { response: { result: { client: clientRecord } } });

		await invoke(Clients.get, { accountId: ACCOUNT_ID, customerId: 238951 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/users/clients/238951`,
		);
		expectBearerAuth(fetchMock);
	});

	it('clients.create POSTs the wrapped client', async () => {
		respondJson(fetchMock, { response: { result: { client: clientRecord } } });

		await invoke(Clients.create, {
			accountId: ACCOUNT_ID,
			client: {
				fname: 'first1',
				lname: 'last1',
				email: 'email1@freshbooks.com',
			},
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/accounting/account/${ACCOUNT_ID}/users/clients`);
		expect(sent.body).toEqual({
			client: {
				fname: 'first1',
				lname: 'last1',
				email: 'email1@freshbooks.com',
			},
		});
		expectBearerAuth(fetchMock);
	});

	it('clients.update PUTs the partial client', async () => {
		respondJson(fetchMock, { response: { result: { client: clientRecord } } });

		await invoke(Clients.update, {
			accountId: ACCOUNT_ID,
			customerId: 238951,
			client: { organization: 'Company 2' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/users/clients/238951`,
		);
		expect(sent.body).toEqual({ client: { organization: 'Company 2' } });
		expectBearerAuth(fetchMock);
	});

	it('clients.delete soft-deletes with vis_state 1', async () => {
		respondJson(fetchMock, { response: { result: { client: clientRecord } } });

		await invoke(Clients.remove, { accountId: ACCOUNT_ID, customerId: 238951 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/users/clients/238951`,
		);
		expect(sent.body).toEqual({ client: { vis_state: 1 } });
		expectBearerAuth(fetchMock);
	});

	it('tasks.delete soft-deletes with vis_state 1', async () => {
		respondJson(fetchMock, {
			response: { result: { task: { ...taskRecord, vis_state: 1 } } },
		});

		await invoke(Tasks.remove, { accountId: ACCOUNT_ID, taskId: 159361 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/projects/tasks/159361`,
		);
		expect(sent.body).toEqual({ task: { vis_state: 1 } });
		expectBearerAuth(fetchMock);
	});
});

describe('invoices', () => {
	it('invoices.list pages over invoices', async () => {
		respondJson(fetchMock, invoicesListResponse);

		await invoke(Invoices.list, { accountId: ACCOUNT_ID, page: 2 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/invoices/invoices`,
		);
		expect(sent.queryPairs).toEqual([['page', '2']]);
		expectBearerAuth(fetchMock);
	});

	it('invoices.get reads one invoice', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		await invoke(Invoices.get, { accountId: ACCOUNT_ID, invoiceId: 152429 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/invoices/invoices/152429`,
		);
		expectBearerAuth(fetchMock);
	});

	it('invoices.create POSTs the wrapped invoice with lines', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		await invoke(Invoices.create, {
			accountId: ACCOUNT_ID,
			invoice: {
				customerid: 960771,
				create_date: '2026-01-31',
				currency_code: 'CAD',
				lines: [{ name: 'Consulting', qty: 2, unit_cost: 50 }],
			},
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/invoices/invoices`,
		);
		expect(sent.body).toEqual({
			invoice: {
				customerid: 960771,
				create_date: '2026-01-31',
				currency_code: 'CAD',
				lines: [{ name: 'Consulting', qty: 2, unit_cost: 50 }],
			},
		});
		expectBearerAuth(fetchMock);
	});

	it('invoices.update PUTs the partial invoice', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		await invoke(Invoices.update, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
			invoice: { notes: 'Net 30' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/invoices/invoices/152429`,
		);
		expect(sent.body).toEqual({ invoice: { notes: 'Net 30' } });
		expectBearerAuth(fetchMock);
	});

	it('invoices.markSent PUTs action_mark_as_sent', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		await invoke(Invoices.markSent, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ invoice: { action_mark_as_sent: true } });
		expectBearerAuth(fetchMock);
	});

	it('invoices.sendEmail PUTs action_email with the recipients', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		await invoke(Invoices.sendEmail, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
			email_recipients: ['client@example.com'],
			email_include_pdf: true,
			invoice_customized_email: { subject: 'Invoice', body: 'Thanks!' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({
			invoice: {
				action_email: true,
				email_recipients: ['client@example.com'],
				email_include_pdf: true,
				invoice_customized_email: { subject: 'Invoice', body: 'Thanks!' },
			},
		});
		expectBearerAuth(fetchMock);
	});

	it('invoices.delete soft-deletes with vis_state 1', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		await invoke(Invoices.remove, { accountId: ACCOUNT_ID, invoiceId: 152429 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ invoice: { vis_state: 1 } });
		expectBearerAuth(fetchMock);
	});
});

describe('estimates', () => {
	it('estimates.list pages over estimates', async () => {
		respondJson(fetchMock, {
			response: {
				result: {
					estimates: [estimateRecord],
					page: 1,
					pages: 1,
					per_page: 15,
					total: 1,
				},
			},
		});

		await invoke(Estimates.list, { accountId: ACCOUNT_ID });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/estimates/estimates`,
		);
		expect(sent.queryPairs).toEqual([]);
		expectBearerAuth(fetchMock);
	});

	it('estimates.get reads one estimate', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: estimateRecord } },
		});

		await invoke(Estimates.get, { accountId: ACCOUNT_ID, estimateId: 152430 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/estimates/estimates/152430`,
		);
		expectBearerAuth(fetchMock);
	});

	it('estimates.create POSTs the wrapped estimate', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: estimateRecord } },
		});

		await invoke(Estimates.create, {
			accountId: ACCOUNT_ID,
			estimate: { customerid: 960771, create_date: '2026-01-31' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			estimate: { customerid: 960771, create_date: '2026-01-31' },
		});
		expectBearerAuth(fetchMock);
	});

	it('estimates.update PUTs the partial estimate', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: estimateRecord } },
		});

		await invoke(Estimates.update, {
			accountId: ACCOUNT_ID,
			estimateId: 152430,
			estimate: { terms: 'Net 15' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ estimate: { terms: 'Net 15' } });
		expectBearerAuth(fetchMock);
	});

	it('estimates.delete soft-deletes with vis_state 1', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: estimateRecord } },
		});

		await invoke(Estimates.remove, {
			accountId: ACCOUNT_ID,
			estimateId: 152430,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ estimate: { vis_state: 1 } });
		expectBearerAuth(fetchMock);
	});
});

describe('expenses', () => {
	it('expenses.list pages over expenses', async () => {
		respondJson(fetchMock, {
			response: {
				result: {
					expenses: [expenseRecord],
					page: 1,
					pages: 1,
					per_page: 15,
					total: 1,
				},
			},
		});

		await invoke(Expenses.list, { accountId: ACCOUNT_ID, per_page: 25 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/expenses/expenses`,
		);
		expect(sent.queryPairs).toEqual([['per_page', '25']]);
		expectBearerAuth(fetchMock);
	});

	it('expenses.get reads one expense', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: expenseRecord } },
		});

		await invoke(Expenses.get, { accountId: ACCOUNT_ID, expenseId: 123456 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/expenses/expenses/123456`,
		);
		expectBearerAuth(fetchMock);
	});

	it('expenses.create POSTs the wrapped expense', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: expenseRecord } },
		});

		await invoke(Expenses.create, {
			accountId: ACCOUNT_ID,
			expense: {
				amount: { amount: '39.99', code: 'USD' },
				categoryid: 50104404,
				staffid: 1,
				date: '2026-01-31',
			},
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			expense: {
				amount: { amount: '39.99', code: 'USD' },
				categoryid: 50104404,
				staffid: 1,
				date: '2026-01-31',
			},
		});
		expectBearerAuth(fetchMock);
	});

	it('expenses.update PUTs the partial expense', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: expenseRecord } },
		});

		await invoke(Expenses.update, {
			accountId: ACCOUNT_ID,
			expenseId: 123456,
			expense: { vendor: 'Other Co.' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ expense: { vendor: 'Other Co.' } });
		expectBearerAuth(fetchMock);
	});

	it('expenses.delete soft-deletes with vis_state 1', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: expenseRecord } },
		});

		await invoke(Expenses.remove, { accountId: ACCOUNT_ID, expenseId: 123456 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ expense: { vis_state: 1 } });
		expectBearerAuth(fetchMock);
	});
});

describe('tasks', () => {
	it('tasks.list pages over accounting tasks', async () => {
		respondJson(fetchMock, {
			response: {
				result: {
					tasks: [taskRecord],
					page: 1,
					pages: 1,
					per_page: 15,
					total: 1,
				},
			},
		});

		await invoke(Tasks.list, { accountId: ACCOUNT_ID });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/accounting/account/${ACCOUNT_ID}/projects/tasks`);
		expect(sent.queryPairs).toEqual([]);
		expectBearerAuth(fetchMock);
	});

	it('tasks.get reads one task', async () => {
		respondJson(fetchMock, { response: { result: { task: taskRecord } } });

		await invoke(Tasks.get, { accountId: ACCOUNT_ID, taskId: 159361 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/accounting/account/${ACCOUNT_ID}/projects/tasks/159361`,
		);
		expectBearerAuth(fetchMock);
	});

	it('tasks.create POSTs the wrapped task', async () => {
		respondJson(fetchMock, { response: { result: { task: taskRecord } } });

		await invoke(Tasks.create, {
			accountId: ACCOUNT_ID,
			task: { name: 'Consulting' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({ task: { name: 'Consulting' } });
		expectBearerAuth(fetchMock);
	});

	it('tasks.update PUTs the partial task', async () => {
		respondJson(fetchMock, { response: { result: { task: taskRecord } } });

		await invoke(Tasks.update, {
			accountId: ACCOUNT_ID,
			taskId: 159361,
			task: { billable: false },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ task: { billable: false } });
		expectBearerAuth(fetchMock);
	});
});

describe('projects', () => {
	it('projects.list pages from page 0', async () => {
		respondJson(fetchMock, projectsListResponse);

		await invoke(Projects.list, { businessId: BUSINESS_ID, page: 0 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/projects/business/${BUSINESS_ID}/projects`);
		expect(sent.queryPairs).toEqual([['page', '0']]);
		expectBearerAuth(fetchMock);
	});

	it('projects.get reads one project', async () => {
		respondJson(fetchMock, projectResponse);

		await invoke(Projects.get, { businessId: BUSINESS_ID, projectId: 779803 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/projects/business/${BUSINESS_ID}/project/779803`);
		expectBearerAuth(fetchMock);
	});

	it('projects.create POSTs the wrapped project', async () => {
		respondJson(fetchMock, projectResponse);

		await invoke(Projects.create, {
			businessId: BUSINESS_ID,
			project: {
				title: 'My Cool Project',
				project_type: 'fixed_price',
				client_id: '97499',
				fixed_price: '500',
			},
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/projects/business/${BUSINESS_ID}/project`);
		expect(sent.body).toEqual({
			project: {
				title: 'My Cool Project',
				project_type: 'fixed_price',
				client_id: '97499',
				fixed_price: '500',
			},
		});
		expectBearerAuth(fetchMock);
	});

	it('projects.update PUTs the partial project', async () => {
		respondJson(fetchMock, projectResponse);

		await invoke(Projects.update, {
			businessId: BUSINESS_ID,
			projectId: 779803,
			project: { title: 'Renamed' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ project: { title: 'Renamed' } });
		expectBearerAuth(fetchMock);
	});

	it('projects.delete sends DELETE with no body', async () => {
		respondJson(fetchMock, projectsDeleteResponse);

		await invoke(Projects.remove, {
			businessId: BUSINESS_ID,
			projectId: 779803,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe(`/projects/business/${BUSINESS_ID}/project/779803`);
		expect(sent.body).toBeUndefined();
		expectBearerAuth(fetchMock);
	});
});

describe('timeEntries', () => {
	it('timeEntries.list sends the time filters', async () => {
		respondJson(fetchMock, timeEntriesListResponse);

		await invoke(TimeEntries.list, {
			businessId: BUSINESS_ID,
			started_from: '2016-08-17T00:00:00Z',
			started_to: '2016-08-18T00:00:00Z',
			billed: false,
			include_deleted: true,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/timetracking/business/${BUSINESS_ID}/time_entries`,
		);
		expect(sent.query).toEqual({
			started_from: '2016-08-17T00:00:00Z',
			started_to: '2016-08-18T00:00:00Z',
			billed: 'false',
			include_deleted: '1',
		});
		expectBearerAuth(fetchMock);
	});

	it('timeEntries.get reads one entry', async () => {
		respondJson(fetchMock, timeEntryResponse);

		await invoke(TimeEntries.get, {
			businessId: BUSINESS_ID,
			timeEntryId: 5095,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			`/timetracking/business/${BUSINESS_ID}/time_entries/5095`,
		);
		expectBearerAuth(fetchMock);
	});

	it('timeEntries.create POSTs the wrapped entry', async () => {
		respondJson(fetchMock, timeEntryResponse);

		await invoke(TimeEntries.create, {
			businessId: BUSINESS_ID,
			time_entry: {
				is_logged: true,
				duration: 7200,
				note: 'Stuff',
				started_at: '2016-08-16T20:00:00.000Z',
				project_id: 153125,
			},
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			time_entry: {
				is_logged: true,
				duration: 7200,
				note: 'Stuff',
				started_at: '2016-08-16T20:00:00.000Z',
				project_id: 153125,
			},
		});
		expectBearerAuth(fetchMock);
	});

	it('timeEntries.update PUTs the partial entry', async () => {
		respondJson(fetchMock, timeEntryResponse);

		await invoke(TimeEntries.update, {
			businessId: BUSINESS_ID,
			timeEntryId: 5095,
			time_entry: { note: 'Updated' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ time_entry: { note: 'Updated' } });
		expectBearerAuth(fetchMock);
	});

	it('timeEntries.delete sends DELETE with no body', async () => {
		respondEmpty(fetchMock, 204);

		await invoke(TimeEntries.remove, {
			businessId: BUSINESS_ID,
			timeEntryId: 5095,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe(
			`/timetracking/business/${BUSINESS_ID}/time_entries/5095`,
		);
		expect(sent.body).toBeUndefined();
		expectBearerAuth(fetchMock);
	});
});
