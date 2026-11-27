import { FreshBooksAPIError } from './client';
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
	accountNotFound,
	BUSINESS_ID,
	clientRecord,
	estimateRecord,
	expenseRecord,
	invoiceRecord,
	projectResponse,
	projectsDeleteResponse,
	projectsListResponse,
	taskRecord,
	timeEntriesListResponse,
	timeEntryResponse,
	usersMeResponse,
} from './test-fixtures';
import {
	failureOf,
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

describe('output parsing per operation', () => {
	it('users.me surfaces accountId and businessId from the memberships', async () => {
		respondJson(fetchMock, usersMeResponse);

		const result = await invoke(Users.me, {});

		expect(result.accountId).toBe('zDmNq');
		expect(result.businessId).toBe(77128);
		expect(result.email).toBe('b@example.com');
	});

	it('users.me leaves accountId and businessId out when there are no memberships', async () => {
		respondJson(fetchMock, {
			response: { id: 712052, business_memberships: [] },
		});

		const result = await invoke(Users.me, {});

		expect(result.accountId).toBeUndefined();
		expect(result.businessId).toBeUndefined();
	});

	it('clients.list parses the wrapped page', async () => {
		respondJson(fetchMock, {
			response: {
				result: {
					clients: [clientRecord],
					page: 1,
					pages: 3,
					per_page: 15,
					total: 40,
				},
			},
		});

		const result = await invoke(Clients.list, { accountId: ACCOUNT_ID });

		expect(result.clients).toHaveLength(1);
		expect(result.clients[0]).toMatchObject({ id: 238951, fname: 'first1' });
		expect(result).toMatchObject({
			page: 1,
			pages: 3,
			per_page: 15,
			total: 40,
		});
	});

	it('clients.get parses the client', async () => {
		respondJson(fetchMock, { response: { result: { client: clientRecord } } });

		const result = await invoke(Clients.get, {
			accountId: ACCOUNT_ID,
			customerId: 238951,
		});

		expect(result.client.organization).toBe('Company 1');
		expect(result.client.vat_name).toBeNull();
	});

	it('clients.create returns the created client', async () => {
		respondJson(fetchMock, { response: { result: { client: clientRecord } } });

		const result = await invoke(Clients.create, {
			accountId: ACCOUNT_ID,
			client: { fname: 'first1' },
		});

		expect(result.client.id).toBe(238951);
	});

	it('clients.update returns the changed client', async () => {
		respondJson(fetchMock, { response: { result: { client: clientRecord } } });

		const result = await invoke(Clients.update, {
			accountId: ACCOUNT_ID,
			customerId: 238951,
			client: { organization: 'Company 2' },
		});

		expect(result.client.email).toBe('email1@freshbooks.com');
	});

	it('clients.delete returns the client marked deleted', async () => {
		respondJson(fetchMock, {
			response: { result: { client: { ...clientRecord, vis_state: 1 } } },
		});

		const result = await invoke(Clients.remove, {
			accountId: ACCOUNT_ID,
			customerId: 238951,
		});

		expect(result.client.vis_state).toBe(1);
	});

	it('invoices.list parses the wrapped page', async () => {
		respondJson(fetchMock, {
			response: {
				result: {
					invoices: [invoiceRecord],
					page: 1,
					pages: 1,
					per_page: 15,
					total: 1,
				},
			},
		});

		const result = await invoke(Invoices.list, { accountId: ACCOUNT_ID });

		expect(result.invoices[0]).toMatchObject({
			id: 152429,
			status: 1,
			vis_state: 0,
		});
		expect(result.invoices[0]?.amount).toEqual({
			amount: '104.50',
			code: 'CAD',
		});
	});

	it('invoices.get parses the invoice with money objects', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		const result = await invoke(Invoices.get, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
		});

		expect(result.invoice.outstanding).toEqual({
			amount: '104.50',
			code: 'CAD',
		});
	});

	it('invoices.create returns the draft invoice', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		const result = await invoke(Invoices.create, {
			accountId: ACCOUNT_ID,
			invoice: { customerid: 960771 },
		});

		expect(result.invoice.invoice_number).toBe('0000003');
	});

	it('invoices.update returns the changed invoice', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		const result = await invoke(Invoices.update, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
			invoice: { notes: 'Net 30' },
		});

		expect(result.invoice.id).toBe(152429);
	});

	it('invoices.markSent returns the invoice with status sent', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: { ...invoiceRecord, status: 2 } } },
		});

		const result = await invoke(Invoices.markSent, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
		});

		expect(result.invoice.status).toBe(2);
	});

	it('invoices.sendEmail returns the invoice', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: invoiceRecord } },
		});

		const result = await invoke(Invoices.sendEmail, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
			email_recipients: ['client@example.com'],
		});

		expect(result.invoice.customerid).toBe(960771);
	});

	it('invoices.delete returns the invoice marked deleted', async () => {
		respondJson(fetchMock, {
			response: { result: { invoice: { ...invoiceRecord, vis_state: 1 } } },
		});

		const result = await invoke(Invoices.remove, {
			accountId: ACCOUNT_ID,
			invoiceId: 152429,
		});

		expect(result.invoice.vis_state).toBe(1);
	});

	it('estimates.list parses the wrapped page', async () => {
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

		const result = await invoke(Estimates.list, { accountId: ACCOUNT_ID });

		expect(result.estimates[0]).toMatchObject({ id: 152430, status: 1 });
	});

	it('estimates.get parses the estimate', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: estimateRecord } },
		});

		const result = await invoke(Estimates.get, {
			accountId: ACCOUNT_ID,
			estimateId: 152430,
		});

		expect(result.estimate.estimate_number).toBe('0000002');
	});

	it('estimates.create returns the draft estimate', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: estimateRecord } },
		});

		const result = await invoke(Estimates.create, {
			accountId: ACCOUNT_ID,
			estimate: { customerid: 960771 },
		});

		expect(result.estimate.id).toBe(152430);
	});

	it('estimates.update returns the changed estimate', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: estimateRecord } },
		});

		const result = await invoke(Estimates.update, {
			accountId: ACCOUNT_ID,
			estimateId: 152430,
			estimate: { terms: 'Net 15' },
		});

		expect(result.estimate.ui_status).toBe('sent');
	});

	it('estimates.delete returns the estimate marked deleted', async () => {
		respondJson(fetchMock, {
			response: { result: { estimate: { ...estimateRecord, vis_state: 1 } } },
		});

		const result = await invoke(Estimates.remove, {
			accountId: ACCOUNT_ID,
			estimateId: 152430,
		});

		expect(result.estimate.vis_state).toBe(1);
	});

	it('expenses.list parses the wrapped page', async () => {
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

		const result = await invoke(Expenses.list, { accountId: ACCOUNT_ID });

		expect(result.expenses[0]).toMatchObject({
			id: 123456,
			categoryid: 50104404,
		});
	});

	it('expenses.get parses the expense', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: expenseRecord } },
		});

		const result = await invoke(Expenses.get, {
			accountId: ACCOUNT_ID,
			expenseId: 123456,
		});

		expect(result.expense.amount).toEqual({ amount: '39.991', code: 'USD' });
	});

	it('expenses.create returns the recorded expense', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: expenseRecord } },
		});

		const result = await invoke(Expenses.create, {
			accountId: ACCOUNT_ID,
			expense: { amount: { amount: '39.99' }, categoryid: 50104404 },
		});

		expect(result.expense.vendor).toBe('Internet Co.');
	});

	it('expenses.update returns the changed expense', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: expenseRecord } },
		});

		const result = await invoke(Expenses.update, {
			accountId: ACCOUNT_ID,
			expenseId: 123456,
			expense: { vendor: 'Other Co.' },
		});

		expect(result.expense.id).toBe(123456);
	});

	it('expenses.delete returns the expense marked deleted', async () => {
		respondJson(fetchMock, {
			response: { result: { expense: { ...expenseRecord, vis_state: 1 } } },
		});

		const result = await invoke(Expenses.remove, {
			accountId: ACCOUNT_ID,
			expenseId: 123456,
		});

		expect(result.expense.vis_state).toBe(1);
	});

	it('tasks.list parses the wrapped page', async () => {
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

		const result = await invoke(Tasks.list, { accountId: ACCOUNT_ID });

		expect(result.tasks[0]).toMatchObject({ id: 159361, billable: true });
	});

	it('tasks.get parses the task with its rate', async () => {
		respondJson(fetchMock, { response: { result: { task: taskRecord } } });

		const result = await invoke(Tasks.get, {
			accountId: ACCOUNT_ID,
			taskId: 159361,
		});

		expect(result.task.rate).toEqual({ amount: '100.00', code: 'CAD' });
	});

	it('tasks.create returns the created task', async () => {
		respondJson(fetchMock, { response: { result: { task: taskRecord } } });

		const result = await invoke(Tasks.create, {
			accountId: ACCOUNT_ID,
			task: { name: 'Piloting' },
		});

		expect(result.task.taskid).toBe(159361);
	});

	it('tasks.update returns the changed task', async () => {
		respondJson(fetchMock, { response: { result: { task: taskRecord } } });

		const result = await invoke(Tasks.update, {
			accountId: ACCOUNT_ID,
			taskId: 159361,
			task: { billable: false },
		});

		expect(result.task.name).toBe('Piloting');
	});

	it('tasks.delete returns the task marked deleted', async () => {
		respondJson(fetchMock, {
			response: { result: { task: { ...taskRecord, vis_state: 1 } } },
		});

		const result = await invoke(Tasks.remove, {
			accountId: ACCOUNT_ID,
			taskId: 159361,
		});

		expect(result.task.vis_state).toBe(1);
	});

	it('projects.list parses the bare page with meta', async () => {
		respondJson(fetchMock, projectsListResponse);

		const result = await invoke(Projects.list, { businessId: BUSINESS_ID });

		expect(result.projects).toHaveLength(1);
		expect(result.projects[0]).toMatchObject({
			id: 779803,
			project_type: 'fixed_price',
		});
		expect(result.meta).toMatchObject({ page: 0, pages: 1, total: 7 });
	});

	it('projects.get parses the bare project', async () => {
		respondJson(fetchMock, projectResponse);

		const result = await invoke(Projects.get, {
			businessId: BUSINESS_ID,
			projectId: 779803,
		});

		expect(result.project.services).toHaveLength(1);
		expect(result.project.group).toMatchObject({ id: 439081 });
	});

	it('projects.create returns the created project', async () => {
		respondJson(fetchMock, projectResponse);

		const result = await invoke(Projects.create, {
			businessId: BUSINESS_ID,
			project: { title: 'My Cool Project', project_type: 'fixed_price' },
		});

		expect(result.project.fixed_price).toBe('500');
	});

	it('projects.update returns the changed project', async () => {
		respondJson(fetchMock, projectResponse);

		const result = await invoke(Projects.update, {
			businessId: BUSINESS_ID,
			projectId: 779803,
			project: { title: 'Renamed' },
		});

		expect(result.project.id).toBe(779803);
	});

	it('projects.delete reports success from the empty response wrapper', async () => {
		respondJson(fetchMock, projectsDeleteResponse);

		const result = await invoke(Projects.remove, {
			businessId: BUSINESS_ID,
			projectId: 779803,
		});

		expect(result).toEqual({ success: true, projectId: 779803 });
	});

	it('timeEntries.list parses the bare page with the logged totals', async () => {
		respondJson(fetchMock, timeEntriesListResponse);

		const result = await invoke(TimeEntries.list, { businessId: BUSINESS_ID });

		expect(result.time_entries).toHaveLength(1);
		expect(result.time_entries[0]).toMatchObject({ id: 5095, duration: 30 });
		expect(result.meta).toMatchObject({ page: 1, total_logged: 30 });
	});

	it('timeEntries.get parses the bare entry', async () => {
		respondJson(fetchMock, timeEntryResponse);

		const result = await invoke(TimeEntries.get, {
			businessId: BUSINESS_ID,
			timeEntryId: 5095,
		});

		expect(result.time_entry.started_at).toBe('2016-08-16T18:03:28Z');
		expect(result.time_entry.timer).toEqual({ id: 2936, is_running: false });
	});

	it('timeEntries.create returns the created entry', async () => {
		respondJson(fetchMock, timeEntryResponse);

		const result = await invoke(TimeEntries.create, {
			businessId: BUSINESS_ID,
			time_entry: {
				is_logged: true,
				duration: 7200,
				started_at: '2016-08-16T20:00:00Z',
			},
		});

		expect(result.time_entry.id).toBe(5095);
	});

	it('timeEntries.update returns the changed entry', async () => {
		respondJson(fetchMock, timeEntryResponse);

		const result = await invoke(TimeEntries.update, {
			businessId: BUSINESS_ID,
			timeEntryId: 5095,
			time_entry: { note: 'Updated' },
		});

		expect(result.time_entry.project_id).toBe(153125);
	});

	it('timeEntries.delete reports success from an empty 204', async () => {
		respondEmpty(fetchMock, 204);

		const result = await invoke(TimeEntries.remove, {
			businessId: BUSINESS_ID,
			timeEntryId: 5095,
		});

		expect(result).toEqual({ success: true, timeEntryId: 5095 });
	});
});

describe('rejections', () => {
	it('fails an accounting call whose body lost the response wrapper', async () => {
		respondJson(fetchMock, { result: { clients: [] } });

		await expect(
			invoke(Clients.list, { accountId: ACCOUNT_ID }),
		).rejects.toBeInstanceOf(FreshBooksAPIError);
	});

	it('fails a page whose resource array is missing', async () => {
		respondJson(fetchMock, { response: { result: { page: 1 } } });

		await expect(
			invoke(Invoices.list, { accountId: ACCOUNT_ID }),
		).rejects.toThrow(/invoices/);
	});

	it('fails a client whose id came back as text', async () => {
		respondJson(fetchMock, {
			response: { result: { client: { ...clientRecord, id: '238951' } } },
		});

		await expect(
			invoke(Clients.get, { accountId: ACCOUNT_ID, customerId: 238951 }),
		).rejects.toThrow(/id/);
	});

	it('surfaces the errno of an error envelope sent on a 200', async () => {
		respondJson(fetchMock, accountNotFound, 200);

		const error = await failureOf(
			invoke(Clients.list, { accountId: ACCOUNT_ID }),
		);

		expect(error).toBeInstanceOf(FreshBooksAPIError);
		if (!(error instanceof FreshBooksAPIError)) throw error;
		expect(error.errno).toBe(404);
		expect(error.message).toContain('Account not found');
		expect(lastRequest(fetchMock).method).toBe('GET');
	});

	it('rejects per_page above the silent cap before sending', async () => {
		await expect(
			// never: the whole point is an input the schema must reject.
			invoke(Clients.list, {
				accountId: ACCOUNT_ID,
				per_page: 101,
			} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a non-numeric businessId before sending', async () => {
		await expect(
			// never: the probe showed a string id hits a generic 404, so the
			// schema must refuse it.
			invoke(Projects.list, { businessId: 'FAKEBIZ' } as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a projects.create without a project_type before sending', async () => {
		await expect(
			// never: the create schema requires project_type; this input is the
			// rejection case.
			invoke(Projects.create, {
				businessId: BUSINESS_ID,
				project: { title: 'No type' },
			} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a 401 projects answer whose error field carries the text', async () => {
		respondJson(
			fetchMock,
			{ error: 'Authentication is required to complete this request.' },
			401,
		);

		const error = await failureOf(
			invoke(Projects.list, { businessId: BUSINESS_ID }),
		);

		expect(error).toBeInstanceOf(FreshBooksAPIError);
		if (!(error instanceof FreshBooksAPIError)) throw error;
		expect(error.status).toBe(401);
		expect(error.message).toContain('Authentication is required');
	});

	it('fails a timeEntries.delete that answered with a body', async () => {
		respondJson(fetchMock, { time_entry: { id: 5095 } }, 200);

		await expect(
			invoke(TimeEntries.remove, {
				businessId: BUSINESS_ID,
				timeEntryId: 5095,
			}),
		).rejects.toBeInstanceOf(FreshBooksAPIError);
	});
});
