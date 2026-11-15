import { logEventFromContext } from 'corsair/core';
import { TaveAPIError } from './client';
import { Billing, Jobs, Organization, Work } from './endpoints';
import {
	brandsList,
	htmlResponse,
	job,
	jobsList,
	jobTypesList,
	note,
	notesList,
	notFoundResponse,
	payment,
	paymentsList,
	product,
	productsList,
	studio,
	task,
	taskListsList,
	tasksList,
	unauthorizedResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'tave-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or an HTML page.
function respond(body: unknown, status = 200) {
	const isString = typeof body === 'string';
	fetchMock.mockResolvedValueOnce(
		new Response(isString ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': isString ? 'text/html' : 'application/json',
			},
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://workspace.vsco.co');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

/**
 * Resolves to the rejection reason, narrowed to the plugin's own error type.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before it is narrowed.
 */
async function rejection(promise: Promise<unknown>): Promise<TaveAPIError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	expect(caught).toBeInstanceOf(TaveAPIError);
	return caught as TaveAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('jobs.list', () => {
	it('GETs /api/v2/job with paging and the comma-joined stage filter', async () => {
		respond(jobsList);

		const result = await invoke(Jobs.list, {
			page: 2,
			pageSize: 50,
			includeClosed: true,
			stage: ['lead', 'booked'],
			eventDateFrom: '2024-01-01',
			eventDateTo: '2024-12-31',
			sortBy: 'modified desc',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v2/job',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			page: '2',
			pageSize: '50',
			includeClosed: 'true',
			// The API takes one comma-separated parameter, not repeated keys.
			stage: 'lead,booked',
			eventDateFrom: '2024-01-01',
			eventDateTo: '2024-12-31',
			sortBy: 'modified desc',
		});
		expect(result.type).toBe('job-collection');
		expect(result.items[0]?.title).toBe('Smith wedding');
		// Paging on the body, not a header.
		expect(result.meta?.totalItems).toBe(2);
	});

	it('keeps integer amounts as the API sends them', async () => {
		respond(jobsList);

		const result = await invoke(Jobs.list, {});

		expect(result.items[0]?.totalRevenue).toBe(150000);
	});

	it('rejects a pageSize under the documented minimum', async () => {
		await expect(invoke(Jobs.list, { pageSize: 5 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown stage', async () => {
		await expect(invoke(Jobs.list, { stage: ['cancelled'] })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('jobs.get, create, update and delete', () => {
	it('GETs one job by its ULID and sends no query, because the route takes none', async () => {
		respond(job);

		const result = await invoke(Jobs.get, { jobId: job.id });

		expect(lastRequest()).toMatchObject({
			path: `/api/v2/job/${job.id}`,
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({});
		expect(result.id).toBe(job.id);
	});

	it('POSTs a new job with its stage and type', async () => {
		respond(job);

		await invoke(Jobs.create, {
			title: 'Smith wedding',
			stage: 'lead',
			jobTypeId: '01h35ccwymj5ctckp8px1azhg8',
			eventDate: '2024-06-15',
			guestCount: 120,
		});

		expect(lastRequest()).toMatchObject({
			path: '/api/v2/job',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			title: 'Smith wedding',
			stage: 'lead',
			jobTypeId: '01h35ccwymj5ctckp8px1azhg8',
			eventDate: '2024-06-15',
			guestCount: 120,
		});
	});

	it('PUTs only the changed fields, never the id', async () => {
		respond({ ...job, stage: 'completed', closed: true });

		const result = await invoke(Jobs.update, {
			jobId: job.id,
			stage: 'completed',
			closed: true,
		});

		expect(lastRequest()).toMatchObject({
			path: `/api/v2/job/${job.id}`,
			method: 'PUT',
		});
		expect(lastRequest().body).toEqual({ stage: 'completed', closed: true });
		expect(result.stage).toBe('completed');
	});

	it('rejects an update that changes nothing', async () => {
		await expect(invoke(Jobs.update, { jobId: job.id })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('DELETEs a job and reports success for the 204', async () => {
		respondEmpty(204);

		const result = await invoke(Jobs.remove, { jobId: job.id });

		expect(lastRequest()).toMatchObject({
			path: `/api/v2/job/${job.id}`,
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it("lists a job's payments", async () => {
		respond(paymentsList);

		const result = await invoke(Jobs.payments, { jobId: job.id });

		expect(lastRequest()).toMatchObject({
			path: `/api/v2/job/${job.id}/payment`,
			method: 'GET',
		});
		expect(result.items[0]?.amount).toBe(75000);
	});
});

describe('products', () => {
	it('lists and gets products', async () => {
		respond(productsList);
		const listed = await invoke(Billing.productsList, {});
		expect(lastRequest()).toMatchObject({
			path: '/api/v2/product',
			method: 'GET',
		});
		// This route documents only sortBy, so it must not send page or pageSize.
		expect(lastRequest().query).toEqual({});
		expect(listed.items[0]?.sku).toBe('ALBUM-01');

		respond(product);
		const one = await invoke(Billing.productsGet, { productId: product.id });
		expect(lastRequest().path).toBe(`/api/v2/product/${product.id}`);
		expect(one.price).toBe(25000);
	});

	it('passes sortBy to the product list and refuses paging', async () => {
		respond(productsList);

		await invoke(Billing.productsList, { sortBy: 'name asc' });
		expect(lastRequest().query).toEqual({ sortBy: 'name asc' });

		// The route has no paging, so the schema must reject one rather than
		// accept it and have the API ignore it.
		await expect(invoke(Billing.productsList, { page: 2 })).rejects.toThrow();
	});

	it('creates a product and rejects a decimal price', async () => {
		respond(product);

		await invoke(Billing.productsCreate, {
			name: 'Wedding album',
			price: 25000,
			taxable: true,
		});
		expect(lastRequest().body).toEqual({
			name: 'Wedding album',
			price: 25000,
			taxable: true,
		});

		// Amounts are integers in the studio currency.
		await expect(
			invoke(Billing.productsCreate, { name: 'Album', price: 250.5 }),
		).rejects.toThrow();
	});

	it('updates and deletes a product', async () => {
		respond({ ...product, price: 30000 });
		await invoke(Billing.productsUpdate, {
			productId: product.id,
			price: 30000,
		});
		expect(lastRequest()).toMatchObject({ method: 'PUT' });
		expect(lastRequest().body).toEqual({ price: 30000 });

		respondEmpty(204);
		const result = await invoke(Billing.productsRemove, {
			productId: product.id,
		});
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
		expect(result).toEqual({ success: true });
	});
});

describe('payments', () => {
	it('creates a payment against a job', async () => {
		respond(payment);

		const result = await invoke(Billing.paymentsCreate, {
			jobId: job.id,
			amount: 75000,
			status: 'posted',
			memo: 'Deposit',
		});

		expect(lastRequest()).toMatchObject({
			path: '/api/v2/payment',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			jobId: job.id,
			amount: 75000,
			status: 'posted',
			memo: 'Deposit',
		});
		expect(result.amount).toBe(75000);
	});

	it('rejects a payment with no job or a zero amount', async () => {
		await expect(
			invoke(Billing.paymentsCreate, { amount: 100 }),
		).rejects.toThrow();
		await expect(
			invoke(Billing.paymentsCreate, { jobId: job.id, amount: 0 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown payment status', async () => {
		await expect(
			invoke(Billing.paymentsCreate, {
				jobId: job.id,
				amount: 100,
				status: 'refunded',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lists, gets, updates and deletes payments', async () => {
		respond(paymentsList);
		const listed = await invoke(Billing.paymentsList, {});
		expect(lastRequest().path).toBe('/api/v2/payment');
		expect(listed.items[0]?.memo).toBe('Deposit');

		respond(payment);
		await invoke(Billing.paymentsGet, { paymentId: payment.id });
		expect(lastRequest().path).toBe(`/api/v2/payment/${payment.id}`);

		respond({ ...payment, amount: 80000 });
		await invoke(Billing.paymentsUpdate, {
			paymentId: payment.id,
			amount: 80000,
		});
		expect(lastRequest().body).toEqual({ amount: 80000 });

		respondEmpty(204);
		await invoke(Billing.paymentsRemove, { paymentId: payment.id });
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});
});

describe('tasks, task lists and notes', () => {
	it('creates a task with the required list and name', async () => {
		respond(task);

		await invoke(Work.tasksCreate, {
			name: 'Send the contract',
			taskListId: '01h35ccwymj5ctckp8px1azhgf',
			jobId: job.id,
			dueDate: '2024-02-01',
		});

		expect(lastRequest()).toMatchObject({
			path: '/api/v2/task',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			name: 'Send the contract',
			taskListId: '01h35ccwymj5ctckp8px1azhgf',
			dueDate: '2024-02-01',
		});
	});

	it('rejects a task without a task list', async () => {
		await expect(invoke(Work.tasksCreate, { name: 'x' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lists, updates and deletes tasks', async () => {
		respond(tasksList);
		const listed = await invoke(Work.tasksList, {});
		expect(lastRequest().path).toBe('/api/v2/task');
		expect(listed.items[0]?.name).toBe('Send the contract');

		respond({ ...task, completed: true });
		await invoke(Work.tasksUpdate, {
			taskId: task.id,
			completed: true,
		});
		expect(lastRequest().body).toEqual({ completed: true });

		respondEmpty(204);
		await invoke(Work.tasksRemove, { taskId: task.id });
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});

	it('lists task lists', async () => {
		respond(taskListsList);

		const result = await invoke(Work.taskListsList, {});

		expect(lastRequest().path).toBe('/api/v2/task-list');
		expect(result.items[0]?.name).toBe('Onboarding');
	});

	it('creates a note with HTML content and lists notes by job', async () => {
		respond(note);

		await invoke(Work.notesCreate, {
			contentHtml: '<p>Called about the timeline.</p>',
			jobId: job.id,
		});
		expect(lastRequest().body).toEqual({
			contentHtml: '<p>Called about the timeline.</p>',
			jobId: job.id,
		});

		respond(notesList);
		const listed = await invoke(Work.notesList, { jobId: job.id });
		expect(lastRequest().path).toBe('/api/v2/note');
		expect(lastRequest().query).toEqual({ jobId: job.id });
		expect(listed.items[0]?.author).toBe('Mia Black');
	});

	it('deletes a note', async () => {
		respondEmpty(204);

		const result = await invoke(Work.notesRemove, { noteId: note.id });

		expect(lastRequest().path).toBe(`/api/v2/note/${note.id}`);
		expect(result).toEqual({ success: true });
	});
});

describe('reference data and studio', () => {
	it('lists job types, lead sources, lead statuses and brands', async () => {
		respond(jobTypesList);
		const types = await invoke(Organization.jobTypesList, {});
		expect(lastRequest().path).toBe('/api/v2/job-type');
		expect(types.items[0]?.name).toBe('Wedding');

		respond({ type: 'lead-source-collection', items: [], meta: {} });
		await invoke(Organization.leadSourcesList, {});
		expect(lastRequest().path).toBe('/api/v2/lead-source');

		respond({ type: 'lead-status-collection', items: [], meta: {} });
		await invoke(Organization.leadStatusesList, {});
		expect(lastRequest().path).toBe('/api/v2/lead-status');

		respond(brandsList);
		const brands = await invoke(Organization.brandsList, {});
		expect(lastRequest().path).toBe('/api/v2/brand');
		expect(brands.items[0]?.alias).toBe('studio');
	});

	it('reads the studio profile', async () => {
		respond(studio);

		const result = await invoke(Organization.studioGet, {});

		expect(lastRequest().path).toBe('/api/v2/studio/me');
		expect(result.currency).toBe('USD');
	});
});

describe('error handling', () => {
	it('parses the failure envelope for a refused key', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(invoke(Jobs.get, { jobId: job.id }));

		expect(error.status).toBe(401);
		expect(error.message).toContain('VSCO Workspace 401');
		expect(error.message).toContain('Unauthorized');
	});

	it('parses a 404 for an unknown record', async () => {
		respond(notFoundResponse, 404);

		const error = await rejection(invoke(Jobs.get, { jobId: 'missing' }));

		expect(error.status).toBe(404);
		expect(error.isHtmlResponse).toBe(false);
	});

	it('turns a 200 documentation page into a missing-route error', async () => {
		// A path that is not an API route answers 200 with the docs HTML, so a
		// caller must not receive a page it cannot parse.
		respond(htmlResponse, 200);

		const error = await rejection(invoke(Jobs.get, { jobId: job.id }));

		expect(error.isHtmlResponse).toBe(true);
		expect(error.message).toContain('HTML instead of JSON');
	});

	it('never leaks the key through the error', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(invoke(Jobs.get, { jobId: job.id }));

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('fails loudly when a collection has no items array', async () => {
		respond({ type: 'job-collection', meta: {} });

		await expect(invoke(Jobs.list, {})).rejects.toThrow();
	});
});

describe('logging', () => {
	it('logs the operation without the input', async () => {
		respond(job);

		await invoke(Jobs.get, { jobId: job.id });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'tave.jobs.get',
			{},
			'completed',
		);
	});
});
