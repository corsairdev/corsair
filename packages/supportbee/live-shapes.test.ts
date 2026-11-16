import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
	TEST_KEY,
} from './test-helpers';

/**
 * Response shapes from a live run against a trial company (11-16), trimmed.
 * They differ from the docs the plugin was built from.
 */
const ctx = makeCtx();
beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const liveTicket = {
	id: 56435560,
	subject: 'Sample Ticket: How to use SupportBee',
	unanswered: true,
	archived: false,
	spam: false,
	created_at: '2026-11-16T06:01:57Z',
	replies_count: 0,
	comments_count: 0,
	source: { web: 'corsairplugintest-support@supportbeemail.com' },
	content: { html: '<p>Hi</p>', text: 'Hi', truncated: false, attachments: [] },
	labels: [],
	current_team_assignee: null,
	current_user_assignee: null,
	customer_rating: {},
	cc: [],
	bcc: [],
};

describe('supportbee live response shapes', () => {
	it('reads a ticket whose source is an object, not an array', async () => {
		mockFetch(
			jsonResponse({
				total: 1,
				current_page: 1,
				per_page: 5,
				total_pages: 1,
				tickets: [liveTicket],
			}),
		);
		const result = await endpoints.tickets.list(ctx, { per_page: 5 });
		expect(result.tickets?.[0]?.source).toEqual({
			web: 'corsairplugintest-support@supportbeemail.com',
		});
	});

	it('reads ticket labels sent as objects', async () => {
		mockFetch(
			jsonResponse({
				ticket: {
					...liveTicket,
					labels: [{ id: 66750, name: 'important', color: '#FF0000' }],
				},
			}),
		);
		const result = await endpoints.tickets.get(ctx, { id: 56435560 });
		expect(result.ticket.labels).toEqual([
			{ id: 66750, name: 'important', color: '#FF0000' },
		]);
	});

	it('unwraps the { reply } body that replies.get answers with', async () => {
		mockFetch(
			jsonResponse({
				reply: {
					id: 35851163,
					created_at: '2026-11-16T06:25:01Z',
					summary: 'corsair-plugin-test reply',
					cc: [],
					bcc: [],
				},
			}),
		);
		const result = await endpoints.replies.get(ctx, {
			ticket_id: 56435621,
			id: 35851163,
		});
		expect(result.id).toBe(35851163);
	});

	it('reads the { member } body that users.addMember answers with', async () => {
		mockFetch(
			jsonResponse({
				member: {
					id: 18458326,
					type: 'user',
					name: 'corsair-plugin-test',
					role: 'customer',
					agent: false,
				},
			}),
		);
		const result = await endpoints.users.addMember(ctx, {
			id: 18458330,
			member_id: 18458326,
		});
		expect(result.user.id).toBe(18458326);
	});

	it('unwraps the { ticket } body that tickets.create answers with', async () => {
		mockFetch(jsonResponse({ ticket: liveTicket }, { status: 201 }));
		const result = await endpoints.tickets.create(ctx, {
			subject: 'corsair-plugin-test ticket',
			notify_requester: false,
		});
		expect(result.id).toBe(56435560);
	});

	it('still accepts a bare ticket from tickets.create', async () => {
		mockFetch(jsonResponse(liveTicket, { status: 201 }));
		const result = await endpoints.tickets.create(ctx, { subject: 'x' });
		expect(result.id).toBe(56435560);
	});

	it('reports the filter id from the { filter } body', async () => {
		mockFetch(
			jsonResponse(
				{
					filter: {
						id: '30710_20261116062326308',
						name: null,
						rule: { id: '30710_1' },
						consequence: { id: '30710_2' },
					},
				},
				{ status: 201 },
			),
		);
		const result = await endpoints.filters.create(ctx, {
			rule_id: '30710_1',
			consequence_id: '30710_2',
		});
		expect(result).toEqual({
			rule_id: '30710_1',
			consequence_id: '30710_2',
			filter_id: '30710_20261116062326308',
			created: true,
		});
	});
});

describe('supportbee review round on da1ad302b', () => {
	it('refuses a filter body that does not carry a string id', async () => {
		mockFetch(jsonResponse({ filter: { id: [] } }, { status: 201 }));
		await expect(
			endpoints.filters.create(ctx, { rule_id: 'r', consequence_id: 'c' }),
		).rejects.toThrow(/filter/);
	});

	it('keeps the key out of a transport error message and cause', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch');
		fetchSpy.mockRejectedValue(
			new TypeError(
				`Headers.append: "Bearer ${TEST_KEY}" is an invalid header value.`,
			),
		);
		const error = await endpoints.tickets.list(ctx, {}).catch(
			(caught: unknown) => caught, // unknown: rejection reason, narrowed below
		);
		expect(error).toBeInstanceOf(Error);
		expect((error as Error).message).not.toContain(TEST_KEY);
		expect(String((error as Error).cause ?? '')).not.toContain(TEST_KEY);
		fetchSpy.mockReset();
	});
});
