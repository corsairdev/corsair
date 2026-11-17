import {
	attachment,
	auditEntry,
	comment,
	dataPoint,
	draft,
	forwardingAddress,
	reply,
	snippet,
	team,
	ticket,
	ticketsResponse,
	user,
} from './test-fixtures';
import {
	BASE,
	emptyResponse,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	queryParam,
	restoreFetchMock,
	sentBody,
	sentHeader,
	TEST_AUTH,
} from './test-helpers';

const ctx = makeCtx();

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('supportbee tickets', () => {
	it('lists tickets with only the filters that were set', async () => {
		mockFetch(jsonResponse(ticketsResponse));
		const result = await endpoints.tickets.list(ctx, {
			page: 2,
			per_page: 30,
			assigned_user: '19',
			spam: false,
		});

		expect(lastCall().url).toBe(
			`${BASE}/tickets?per_page=30&page=2&spam=false&assigned_user=19`,
		);
		expect(sentHeader('Authorization')).toBe(TEST_AUTH);
		expect(sentHeader('Accept')).toBe('application/json');
		expect(result.tickets).toHaveLength(1);
		expect(result.total).toBe(1);
	});

	it('never sends an unset filter as an empty value', async () => {
		mockFetch(jsonResponse(ticketsResponse));
		await endpoints.tickets.list(ctx, {});

		const url = new URL(lastCall().url);
		expect([...url.searchParams.keys()]).toEqual([]);
	});

	it('creates a ticket inside a ticket wrapper', async () => {
		mockFetch(jsonResponse(ticket, { status: 201 }));
		await endpoints.tickets.create(ctx, {
			subject: 'Printer offline',
			requester_email: 'bob@example.com',
			content: { text: 'The printer on floor 3 is offline.' },
		});

		expect(lastCall().url).toBe(`${BASE}/tickets`);
		expect(sentBody()).toEqual({
			ticket: {
				subject: 'Printer offline',
				requester_email: 'bob@example.com',
				content: { text: 'The printer on floor 3 is offline.' },
			},
		});
	});

	it('leaves content out of the payload when it was not given', async () => {
		mockFetch(jsonResponse(ticket, { status: 201 }));
		await endpoints.tickets.create(ctx, { subject: 'No body' });

		expect(sentBody()).toEqual({ ticket: { subject: 'No body' } });
	});

	it('searches by the query parameter, not q', async () => {
		mockFetch(jsonResponse(ticketsResponse));
		await endpoints.tickets.search(ctx, { query: 'printer', page: 1 });

		expect(new URL(lastCall().url).pathname).toBe('/tickets/search');
		expect(queryParam('query')).toBe('printer');
		expect(queryParam('q')).toBeNull();
	});

	it('refuses a blank search query before sending', async () => {
		await expect(endpoints.tickets.search(ctx, { query: '' })).rejects.toThrow(
			/Too small/,
		);
		expect(currentFetchCount()).toBe(0);
	});

	it('reads one ticket from its wrapper', async () => {
		mockFetch(jsonResponse({ ticket }));
		const result = await endpoints.tickets.get(ctx, { id: 1 });

		expect(lastCall().url).toBe(`${BASE}/tickets/1`);
		expect(result.ticket.subject).toBe('Welcome to SupportBee');
	});

	it('reports a delete instead of reading an empty 204', async () => {
		mockFetch(emptyResponse());
		await expect(endpoints.tickets.delete(ctx, { id: 1 })).resolves.toEqual({
			id: 1,
			deleted: true,
		});
		expect(lastCall().init.method).toBe('DELETE');
	});

	it('archives with POST and unarchives with DELETE on the same path', async () => {
		mockFetch(emptyResponse());
		await endpoints.tickets.archive(ctx, { id: 7 });
		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/tickets/7/archive`);

		mockFetch(emptyResponse());
		await endpoints.tickets.unarchive(ctx, { id: 7 });
		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(`${BASE}/tickets/7/archive`);
	});

	it('flips the answered, spam and trash flags with the right verb', async () => {
		const cases = [
			['markAnswered', 'POST', '/tickets/3/answered'],
			['markUnanswered', 'DELETE', '/tickets/3/answered'],
			['markSpam', 'POST', '/tickets/3/spam'],
			['unmarkSpam', 'DELETE', '/tickets/3/spam'],
			['trash', 'POST', '/tickets/3/trash'],
			['untrash', 'DELETE', '/tickets/3/trash'],
		] as const;

		for (const [name, method, path] of cases) {
			mockFetch(emptyResponse());
			await endpoints.tickets[name](ctx, { id: 3 });
			expect(lastCall().init.method).toBe(method);
			expect(new URL(lastCall().url).pathname).toBe(path);
		}
	});

	it('assigns a user through a wrapped user_assignment body', async () => {
		mockFetch(
			jsonResponse(
				{
					user_assignment: { id: 2, ticket: { id: 1 } },
					asignee: { user },
				},
				{ status: 201 },
			),
		);
		await endpoints.tickets.assignUser(ctx, { id: 1, user_id: 19 });

		expect(lastCall().url).toBe(`${BASE}/tickets/1/user_assignment`);
		expect(sentBody()).toEqual({ user_assignment: { user_id: 19 } });
	});

	it('assigns a team through a wrapped team_assignment body', async () => {
		mockFetch(
			jsonResponse(
				{
					team_assignment: { id: 2, ticket: { id: 1 } },
					asignee: { team },
				},
				{ status: 201 },
			),
		);
		await endpoints.tickets.assignTeam(ctx, { id: 1, team_id: 2 });

		expect(sentBody()).toEqual({ team_assignment: { team_id: 2 } });
	});

	it('unassigns a user and a team with DELETE on the assignment path', async () => {
		mockFetch(emptyResponse());
		await endpoints.tickets.unassignUser(ctx, { id: 1 });
		expect(lastCall().init.method).toBe('DELETE');
		expect(new URL(lastCall().url).pathname).toBe('/tickets/1/user_assignment');

		mockFetch(emptyResponse());
		await endpoints.tickets.unassignTeam(ctx, { id: 1 });
		expect(new URL(lastCall().url).pathname).toBe('/tickets/1/team_assignment');
	});

	it('reads the audit trail', async () => {
		mockFetch(jsonResponse({ audit: [auditEntry] }));
		const result = await endpoints.tickets.audit(ctx, { id: 1 });

		expect(new URL(lastCall().url).pathname).toBe('/tickets/1/audit');
		expect(result.audit[0]?.action).toBe('Commented');
	});

	it('puts the label name in the path, encoded', async () => {
		mockFetch(
			jsonResponse(
				{ label: { id: 5, label: 'needs review', ticket: 1 } },
				{ status: 201 },
			),
		);
		await endpoints.tickets.addLabel(ctx, {
			ticket_id: 1,
			label_name: 'needs review',
		});

		expect(new URL(lastCall().url).pathname).toBe(
			'/tickets/1/labels/needs%20review',
		);
	});

	it('reports a removed label instead of an empty 204', async () => {
		mockFetch(emptyResponse());
		await expect(
			endpoints.tickets.removeLabel(ctx, { ticket_id: 1, label_name: 'imp' }),
		).resolves.toEqual({
			ticket_id: 1,
			label_name: 'imp',
			removed: true,
		});
	});
});

describe('supportbee replies, comments and drafts', () => {
	it('lists replies under the ticket', async () => {
		mockFetch(jsonResponse({ replies: [reply] }));
		const result = await endpoints.replies.list(ctx, { ticket_id: 1 });

		expect(new URL(lastCall().url).pathname).toBe('/tickets/1/replies');
		expect(result.replies[0]?.summary).toBe('Reply Content');
	});

	it('reads one reply by ticket and reply id', async () => {
		mockFetch(jsonResponse(reply));
		await endpoints.replies.get(ctx, { ticket_id: 1, id: 9 });

		expect(new URL(lastCall().url).pathname).toBe('/tickets/1/replies/9');
	});

	it('creates a reply inside a reply wrapper', async () => {
		mockFetch(jsonResponse({ reply }, { status: 201 }));
		await endpoints.replies.create(ctx, {
			ticket_id: 1,
			content: { text: 'Thanks for reaching out.' },
			cc: ['lead@example.com'],
		});

		expect(sentBody()).toEqual({
			reply: {
				content: { text: 'Thanks for reaching out.' },
				cc: ['lead@example.com'],
			},
		});
	});

	it('lists and creates internal comments', async () => {
		mockFetch(jsonResponse({ comments: [comment] }));
		const listed = await endpoints.comments.list(ctx, { ticket_id: 1 });
		expect(listed.comments[0]?.id).toBe(1);

		mockFetch(jsonResponse({ comment }, { status: 201 }));
		await endpoints.comments.create(ctx, {
			ticket_id: 1,
			content: { text: 'Called the customer.' },
		});
		expect(sentBody()).toEqual({
			comment: { content: { text: 'Called the customer.' } },
		});
	});

	it('reads a draft, sending quote and time_zone only when set', async () => {
		mockFetch(jsonResponse({ draft }));
		await endpoints.drafts.get(ctx, { ticket_id: 1 });
		expect([...new URL(lastCall().url).searchParams.keys()]).toEqual([]);

		mockFetch(jsonResponse({ draft }));
		await endpoints.drafts.get(ctx, { ticket_id: 1, quote: true });
		expect(queryParam('quote')).toBe('true');
	});

	it('creates with POST and updates with PUT on the same path', async () => {
		mockFetch(jsonResponse({ draft }, { status: 201 }));
		await endpoints.drafts.create(ctx, {
			ticket_id: 1,
			content: { text: 'Draft reply content' },
			cc: 'a@example.com,b@example.com',
		});
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			draft: {
				content: { text: 'Draft reply content' },
				cc: 'a@example.com,b@example.com',
			},
		});

		mockFetch(jsonResponse({ draft }));
		await endpoints.drafts.update(ctx, {
			ticket_id: 1,
			content: { text: 'New text' },
		});
		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe('/tickets/1/draft');
	});

	it('reports a deleted draft instead of an empty 204', async () => {
		mockFetch(emptyResponse());
		await expect(
			endpoints.drafts.delete(ctx, { ticket_id: 1 }),
		).resolves.toEqual({ ticket_id: 1, deleted: true });
	});
});

describe('supportbee users and teams', () => {
	it('lists users with the invited and role filters', async () => {
		mockFetch(jsonResponse({ users: [user] }));
		const result = await endpoints.users.list(ctx, {
			with_invited: true,
			with_roles: 'agent',
		});

		expect(queryParam('with_invited')).toBe('true');
		expect(queryParam('with_roles')).toBe('agent');
		expect(result.users[0]?.role).toBe('agent');
	});

	it('creates a user inside a user wrapper', async () => {
		mockFetch(jsonResponse({ user }, { status: 201 }));
		await endpoints.users.create(ctx, {
			name: 'Test Name',
			email: 'test@example.com',
			role: 10,
			team_ids: [2],
		});

		expect(sentBody()).toEqual({
			user: {
				name: 'Test Name',
				email: 'test@example.com',
				role: 10,
				team_ids: [2],
			},
		});
	});

	it('sends null for a cleared group setting', async () => {
		mockFetch(jsonResponse({ user }, { status: 201 }));
		await endpoints.users.create(ctx, {
			name: 'Group',
			type: 'customer_group',
			can_members_access_group_tickets: null,
		});

		expect(sentBody()).toEqual({
			user: {
				name: 'Group',
				type: 'customer_group',
				can_members_access_group_tickets: null,
			},
		});
	});

	it('reads and updates one user', async () => {
		mockFetch(jsonResponse({ user }));
		const result = await endpoints.users.get(ctx, { id: 1, max_tickets: 5 });
		expect(result.user.id).toBe(1);
		expect(queryParam('max_tickets')).toBe('5');

		mockFetch(jsonResponse({ user }));
		await endpoints.users.update(ctx, { id: 1, name: 'Sarah C.' });
		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({ user: { name: 'Sarah C.' } });
	});

	it('lists members and adds one inside a member wrapper', async () => {
		mockFetch(jsonResponse({ users: [user] }));
		const listed = await endpoints.users.listMembers(ctx, { id: 4 });
		expect(listed.users).toHaveLength(1);
		expect(new URL(lastCall().url).pathname).toBe('/users/4/members');

		mockFetch(jsonResponse({ user }, { status: 201 }));
		await endpoints.users.addMember(ctx, { id: 4, member_id: 1 });
		expect(sentBody()).toEqual({ member: { id: 1 } });
	});

	it('lists teams', async () => {
		mockFetch(jsonResponse({ teams: [team] }));
		const result = await endpoints.teams.list(ctx, { with_users: true });

		expect(queryParam('with_users')).toBe('true');
		expect(result.teams[0]?.name).toBe('Team 1');
	});
});

describe('supportbee attachments, snippets, filters, emails, reports and labels', () => {
	it('uploads a file as multipart under files[]', async () => {
		mockFetch(jsonResponse(attachment, { status: 201 }));
		await endpoints.attachments.create(ctx, {
			filename: 'logo.png',
			content: Buffer.from('hello').toString('base64'),
			content_type: 'image/png',
		});

		const body = lastCall().init.body;
		expect(body).toBeInstanceOf(FormData);
		const file = (body as FormData).get('files[]');
		expect(file).toBeInstanceOf(Blob);
		expect((file as File).name).toBe('logo.png');
	});

	it('accepts base64 with a data URI prefix', async () => {
		mockFetch(jsonResponse(attachment, { status: 201 }));
		await endpoints.attachments.create(ctx, {
			filename: 'logo.png',
			content: `data:image/png;base64,${Buffer.from('hello').toString('base64')}`,
		});

		expect(lastCall().init.body).toBeInstanceOf(FormData);
	});

	it('rejects content that is not base64 before sending', async () => {
		await expect(
			endpoints.attachments.create(ctx, {
				filename: 'x.txt',
				content: 'not base64!',
			}),
		).rejects.toThrow(/base64/);
		expect(currentFetchCount()).toBe(0);
	});

	it('lists, creates, updates and deletes snippets', async () => {
		mockFetch(jsonResponse({ snippets: [snippet] }));
		const listed = await endpoints.snippets.list(ctx, {});
		expect(listed.snippets[0]?.tags).toBe('facebook, link');

		mockFetch(jsonResponse({ snippet }, { status: 201 }));
		await endpoints.snippets.create(ctx, {
			name: 'Facebook Link',
			tags: 'facebook, link',
			content: { text: 'Facebook' },
		});
		expect(sentBody()).toEqual({
			snippet: {
				name: 'Facebook Link',
				tags: 'facebook, link',
				content: { text: 'Facebook' },
			},
		});

		mockFetch(jsonResponse({ snippet }));
		await endpoints.snippets.update(ctx, {
			id: 4,
			name: 'New name',
			content: { html: '<p>Facebook</p>' },
		});
		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe('/snippets/4');

		mockFetch(emptyResponse());
		await expect(endpoints.snippets.delete(ctx, { id: 4 })).resolves.toEqual({
			id: 4,
			deleted: true,
		});
	});

	it('refuses a snippet with neither text nor html', async () => {
		await expect(
			endpoints.snippets.create(ctx, { name: 'Empty', content: {} }),
		).rejects.toThrow(/needs text or html/);
		expect(currentFetchCount()).toBe(0);
	});

	it('creates a rule, a consequence and the filter linking them', async () => {
		mockFetch(jsonResponse({ rule: { id: '5_1' } }, { status: 201 }));
		await endpoints.filters.createRule(ctx, {
			requester_email: 'a@example.com',
		});
		expect(new URL(lastCall().url).pathname).toBe('/rules');
		expect(sentBody()).toEqual({
			rule: { requester_email: 'a@example.com' },
		});

		mockFetch(jsonResponse({ consequence: { id: '5_2' } }, { status: 201 }));
		await endpoints.filters.createConsequence(ctx, {
			archive: true,
			label: 'spam-like',
		});
		expect(new URL(lastCall().url).pathname).toBe('/consequences');

		mockFetch(new Response(null, { status: 201 }));
		await expect(
			endpoints.filters.create(ctx, {
				rule_id: '5_1',
				consequence_id: '5_2',
			}),
		).resolves.toEqual({
			rule_id: '5_1',
			consequence_id: '5_2',
			created: true,
		});
		// Live run 11-16: the top-level ids the docs show answer 500; the API
		// creates the filter only with them under `filter`.
		expect(sentBody()).toEqual({
			filter: { rule_id: '5_1', consequence_id: '5_2' },
		});
	});

	it('refuses a consequence that assigns both a user and a team', async () => {
		await expect(
			endpoints.filters.createConsequence(ctx, {
				assign_user: '1',
				assign_team: '2',
			}),
		).rejects.toThrow(/not both/);
	});

	it('lists and creates forwarding addresses', async () => {
		mockFetch(jsonResponse({ forwarding_addresses: [forwardingAddress] }));
		const listed = await endpoints.emails.list(ctx, {});
		expect(listed.forwarding_addresses[0]?.forward_to).toContain(
			'@supportbeemail.com',
		);

		mockFetch(
			jsonResponse({ forwarding_address: forwardingAddress }, { status: 201 }),
		);
		await endpoints.emails.create(ctx, {
			email: 'example@example.com',
			name: 'Company Inc',
			filter_spam: true,
		});
		expect(sentBody()).toEqual({
			forwarding_address: {
				email: 'example@example.com',
				name: 'Company Inc',
				filter_spam: true,
			},
		});
	});

	it('reads the three reports', async () => {
		for (const [name, path] of [
			['avgFirstResponseTime', '/reports/avg_first_response_time'],
			['ticketsCount', '/reports/tickets_count'],
			['repliesCount', '/reports/replies_count'],
		] as const) {
			mockFetch(jsonResponse({ data_points: [dataPoint] }));
			const result = await endpoints.reports[name](ctx, {
				user: 4,
				since: '2026-10-11',
			});
			expect(new URL(lastCall().url).pathname).toBe(path);
			expect(queryParam('user')).toBe('4');
			expect(queryParam('since')).toBe('2026-10-11');
			expect(result.data_points).toHaveLength(1);
		}
	});

	it('lists labels with their colours', async () => {
		mockFetch(jsonResponse({ labels: [{ name: 'urgent', color: '#ff0000' }] }));
		const result = await endpoints.labels.list(ctx, {});

		expect(new URL(lastCall().url).pathname).toBe('/labels');
		expect(result.labels[0]).toEqual({ name: 'urgent', color: '#ff0000' });
	});

	it('refuses a list body that is not the documented wrapper', async () => {
		mockFetch(jsonResponse(['not', 'a', 'wrapper']));
		await expect(endpoints.tickets.list(ctx, {})).rejects.toThrow(
			/unexpected ticket list body/,
		);
	});

	it('refuses a list body with no collection key', async () => {
		mockFetch(jsonResponse({ total: 0 }));
		await expect(endpoints.tickets.list(ctx, {})).rejects.toThrow(
			/no tickets array/,
		);
	});
});

/** The fetch mock counts calls, so a rejected input can assert nothing was sent. */
function currentFetchCount(): number {
	return jest.mocked(globalThis.fetch).mock.calls.length;
}
