import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	attachment,
	forwardingAddress,
	ticketsResponse,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const ctx = makeCtx();

beforeEach(() => {
	installFetchMock();
	mockLog.mockClear();
});
afterEach(restoreFetchMock);

// R8: customer data stays out of event payloads.
function logged(): string {
	return JSON.stringify(mockLog.mock.calls.map((call) => call.slice(1)));
}

describe('supportbee event fields', () => {
	it('leaves label names out of the label events', async () => {
		mockFetch(
			jsonResponse(
				{ label: { id: 1, label: 'Jane-Doe-medical-records', ticket: 7 } },
				{ status: 201 },
			),
		);
		await endpoints.tickets.addLabel(ctx, {
			ticket_id: 7,
			label_name: 'Jane-Doe-medical-records',
		});
		mockFetch(new Response(null, { status: 204 }));
		await endpoints.tickets.removeLabel(ctx, {
			ticket_id: 7,
			label_name: 'Jane-Doe-medical-records',
		});

		expect(mockLog).toHaveBeenCalledTimes(2);
		expect(logged()).not.toContain('Jane-Doe');
	});

	it('leaves the search query out, since it is often an email', async () => {
		mockFetch(jsonResponse(ticketsResponse));
		await endpoints.tickets.search(ctx, { query: 'bob@example.com' });

		expect(mockLog).toHaveBeenCalled();
		expect(logged()).not.toContain('bob@example.com');
	});

	it('leaves the forwarding address out', async () => {
		mockFetch(
			jsonResponse({ forwarding_address: forwardingAddress }, { status: 201 }),
		);
		await endpoints.emails.create(ctx, { email: 'jane.private@example.com' });

		expect(logged()).not.toContain('jane.private@example.com');
	});

	it('leaves the attachment filename out', async () => {
		mockFetch(jsonResponse(attachment, { status: 201 }));
		await endpoints.attachments.create(ctx, {
			filename: 'Jane-Doe-medical-report.pdf',
			content: Buffer.from('hello').toString('base64'),
		});

		expect(logged()).not.toContain('Jane-Doe');
	});
});

describe('supportbee error URLs', () => {
	it('drops the query, which can hold the search text', async () => {
		mockFetch(jsonResponse({ error: 'Unauthorized' }, { status: 401 }));
		const error = await endpoints.tickets
			.search(ctx, { query: 'bob@example.com' })
			.catch(
				(caught: unknown) => caught, // unknown: rejection reason, checked by text
			);

		// The client percent-encodes the query, so check the URL itself.
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).url).not.toContain('?');
		expect(JSON.stringify(error)).not.toContain('bob%40example.com');
	});
});

describe('supportbee ticket counts', () => {
	it('returns the total alone when total_only is set', async () => {
		mockFetch(jsonResponse({ total: 42 }));
		const result = await endpoints.tickets.list(ctx, { total_only: true });

		expect(result.total).toBe(42);
		expect(result.tickets).toBeUndefined();
	});
});
