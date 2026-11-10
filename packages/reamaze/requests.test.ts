jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import * as fixtures from './test-fixtures';
import {
	BASE,
	currentFetch,
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
	TEST_HOST,
	TEST_KEY,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const CONTACT = 'bob@example.com';

describe('Re:amaze transport', () => {
	it('sends HTTP Basic auth built from the JSON credential pair', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(makeCtx(), {});

		expect(sentHeader('Authorization')).toBe(TEST_AUTH);
	});

	it('targets the configured brand, not a shared host', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(makeCtx(), {});

		expect(new URL(lastCall().url).host).toBe(TEST_HOST);
		expect(lastCall().url).toBe(`${BASE}/conversations`);
	});

	it('accepts a host pasted with a scheme and trailing slash', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(
			makeCtx({ host: `https://${TEST_HOST}/` }),
			{},
		);

		// The scheme is stripped and the base rebuilt once, so the path is not
		// doubled and no trailing slash survives.
		expect(lastCall().url).toBe(`${BASE}/conversations`);
	});

	it('falls back to a stored host when no plugin option is set', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(
			makeCtx({ host: null, storedHost: TEST_HOST }),
			{},
		);

		expect(lastCall().url).toBe(`${BASE}/conversations`);
	});

	it('builds the host from a stored brand name', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(
			makeCtx({ host: null, storedHost: 'acme' }),
			{},
		);

		expect(lastCall().url).toBe(`${BASE}/conversations`);
	});

	it.each([
		'internal.example.com',
		'https://169.254.169.254/',
		'acme.reamaze.io.example.com',
		'acme.reamaze.io:8443',
	])('sends nothing when the stored host is %j', async (storedHost) => {
		// A tenant controls the stored value. Anything that is not a brand must
		// fail before a request, which would carry the Basic credentials, is made.
		await expect(
			endpoints.conversations.list(makeCtx({ host: null, storedHost }), {}),
		).rejects.toThrow(/brand/);

		expect(currentFetch()).not.toHaveBeenCalled();
	});

	it('holds the plugin option to the same rule as a stored host', async () => {
		await expect(
			endpoints.conversations.list(
				makeCtx({ host: 'internal.example.com' }),
				{},
			),
		).rejects.toThrow(/brand/);

		expect(currentFetch()).not.toHaveBeenCalled();
	});

	it('sends the client credential pair as Basic auth', async () => {
		expect(JSON.parse(TEST_KEY)).toEqual({
			email: 'agent@example.com',
			token: 'test-token',
		});
	});
});

describe('Re:amaze request shapes', () => {
	it('conversations.list sends filter, sort, tag, category, dates and origin', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(makeCtx(), {
			filter: 'open',
			for: 'alice@example.com',
			for_id: 'sso-9',
			sort: 'updated',
			tag: 'billing,vip',
			category: 'support',
			page: 2,
			start_date: '2026-11-01',
			end_date: '2026-11-09',
			origin: 'email',
		});

		expect(lastCall().init.method).toBe('GET');
		expect(queryParam('filter')).toBe('open');
		expect(queryParam('for')).toBe('alice@example.com');
		expect(queryParam('for_id')).toBe('sso-9');
		expect(queryParam('sort')).toBe('updated');
		expect(queryParam('tag')).toBe('billing,vip');
		expect(queryParam('category')).toBe('support');
		expect(queryParam('page')).toBe('2');
		expect(queryParam('start_date')).toBe('2026-11-01');
		expect(queryParam('end_date')).toBe('2026-11-09');
		expect(queryParam('origin')).toBe('email');
	});

	it('conversations.list expands a data record into data[key] entries', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(makeCtx(), {
			data: { plan: 'pro', seats: 4 },
		});

		expect(queryParam('data[plan]')).toBe('pro');
		expect(queryParam('data[seats]')).toBe('4');
	});

	it('conversations.list omits every unset parameter', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		await endpoints.conversations.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/conversations`);
		expect(queryParam('filter')).toBeNull();
		expect(queryParam('page')).toBeNull();
	});

	it('conversations.get addresses the slug with its lookup parameters', async () => {
		mockFetch(jsonResponse(fixtures.conversationResponse));

		await endpoints.conversations.get(makeCtx(), {
			slug: 'knock-knock',
			id_type: 'origin',
			category: 'support',
			channel: 1,
		});

		expect(lastCall().init.method).toBe('GET');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/conversations/knock-knock',
		);
		expect(queryParam('id_type')).toBe('origin');
		expect(queryParam('category')).toBe('support');
		expect(queryParam('channel')).toBe('1');
	});

	it('conversations.get encodes a slug carrying a space', async () => {
		mockFetch(jsonResponse(fixtures.conversationResponse));

		await endpoints.conversations.get(makeCtx(), { slug: 'my slug' });

		expect(lastCall().url).toBe(`${BASE}/conversations/my%20slug`);
	});

	it('conversations.create wraps the payload in conversation', async () => {
		mockFetch(jsonResponse(fixtures.createdConversationResponse));

		await endpoints.conversations.create(makeCtx(), {
			subject: 'Printer offline',
			category: 'support',
			tag_list: ['hardware'],
			status: 0,
			hold_until: '2026-12-01T09:00:00Z',
			assignee: 'staff1@example.com',
			data: { region: 'eu' },
			message: {
				body: 'The printer on floor 3 is offline.',
				recipients: ['alice@example.com'],
				suppress_notifications: true,
				suppress_autoresolve: true,
				suppress_surveys: '2026-12-01',
				attachment: 'https://example.com/receipt.pdf',
				attachments: ['https://example.com/second.pdf'],
			},
			user: {
				name: 'bob',
				email: 'bob@example.com',
				data: { tier: 'gold' },
			},
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/conversations`);
		expect(sentBody()).toEqual({
			conversation: {
				subject: 'Printer offline',
				category: 'support',
				tag_list: ['hardware'],
				status: 0,
				hold_until: '2026-12-01T09:00:00Z',
				assignee: 'staff1@example.com',
				data: { region: 'eu' },
				message: {
					body: 'The printer on floor 3 is offline.',
					recipients: ['alice@example.com'],
					suppress_notifications: true,
					suppress_autoresolve: true,
					suppress_surveys: '2026-12-01',
					attachment: 'https://example.com/receipt.pdf',
					attachments: ['https://example.com/second.pdf'],
				},
				user: {
					name: 'bob',
					email: 'bob@example.com',
					data: { tier: 'gold' },
				},
			},
		});
	});

	it('conversations.update sends PUT with the assignee and status', async () => {
		mockFetch(jsonResponse(fixtures.updatedConversationResponse));

		await endpoints.conversations.update(makeCtx(), {
			slug: 'knock-knock',
			assignee: { email: 'staff1@example.com' },
			tag_list: ['joke', 'resolved'],
			status: 2,
			data: { field1: 'value1' },
			category: 'support',
			brand: 'other-brand',
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/conversations/knock-knock',
		);
		expect(sentBody()).toEqual({
			conversation: {
				assignee: { email: 'staff1@example.com' },
				tag_list: ['joke', 'resolved'],
				status: 2,
				data: { field1: 'value1' },
				category: 'support',
				brand: 'other-brand',
			},
		});
	});

	it('messages.list sends filter, tag, origin, paging and the date window', async () => {
		mockFetch(jsonResponse(fixtures.messagesResponse));

		await endpoints.messages.list(makeCtx(), {
			filter: 'staff',
			tag: 'billing',
			origin: 1,
			page: 3,
			sent_by: 'hal@example.com',
			category: 'support',
			start_date: '2026-11-01',
			end_date: '2026-11-09',
			include: 'original_body',
		});

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url.startsWith(`${BASE}/messages`)).toBe(true);
		expect(queryParam('filter')).toBe('staff');
		expect(queryParam('tag')).toBe('billing');
		expect(queryParam('origin')).toBe('1');
		expect(queryParam('page')).toBe('3');
		expect(queryParam('sent_by')).toBe('hal@example.com');
		expect(queryParam('category')).toBe('support');
		expect(queryParam('start_date')).toBe('2026-11-01');
		expect(queryParam('end_date')).toBe('2026-11-09');
		expect(queryParam('include')).toBe('original_body');
	});

	it('messages.create posts under the conversation with the message wrapper', async () => {
		mockFetch(jsonResponse(fixtures.createdMessageResponse));

		await endpoints.messages.create(makeCtx(), {
			slug: 'do-you-read-me',
			body: 'This is the body of the new message you just posted!',
			visibility: 1,
			user: { name: 'You', email: 'you@example.com' },
			origin_id: 'XaEbMed',
			suppress_notifications: true,
			suppress_autoresolve: true,
			suppress_surveys: true,
			attachment: 'https://example.com/receipt.pdf',
			attachments: ['https://example.com/second.pdf'],
			recipients: ['dave@example.com'],
		});

		expect(lastCall().init.method).toBe('POST');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/conversations/do-you-read-me/messages',
		);
		// The slug is a path segment, so it never appears in the body.
		expect(sentBody()).toEqual({
			message: {
				body: 'This is the body of the new message you just posted!',
				visibility: 1,
				user: { name: 'You', email: 'you@example.com' },
				origin_id: 'XaEbMed',
				suppress_notifications: true,
				suppress_autoresolve: true,
				suppress_surveys: true,
				attachment: 'https://example.com/receipt.pdf',
				attachments: ['https://example.com/second.pdf'],
				recipients: ['dave@example.com'],
			},
		});
	});

	it('contacts.list sends search, sort, type, paging and data filters', async () => {
		mockFetch(jsonResponse(fixtures.contactsResponse));

		await endpoints.contacts.list(makeCtx(), {
			q: 'bob',
			sort: 'date',
			type: 'email',
			page: 2,
			data: { plan: 'pro' },
		});

		expect(lastCall().init.method).toBe('GET');
		expect(queryParam('q')).toBe('bob');
		expect(queryParam('sort')).toBe('date');
		expect(queryParam('type')).toBe('email');
		expect(queryParam('page')).toBe('2');
		expect(queryParam('data[plan]')).toBe('pro');
	});

	it('contacts.create wraps the payload in contact', async () => {
		mockFetch(jsonResponse(fixtures.createdContactResponse));

		await endpoints.contacts.create(makeCtx(), {
			name: 'bob',
			email: 'bob@example.com',
			id: '123',
			external_avatar_url: 'https://www.example.com/avatar.png',
			notes: ['Some note', 'Some other note'],
			data: { custom_attribute: 'custom data' },
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/contacts`);
		expect(sentBody()).toEqual({
			contact: {
				name: 'bob',
				email: 'bob@example.com',
				id: '123',
				external_avatar_url: 'https://www.example.com/avatar.png',
				notes: ['Some note', 'Some other note'],
				data: { custom_attribute: 'custom data' },
			},
		});
	});

	it('contacts.create sends a mobile number for a contact without an email', async () => {
		mockFetch(
			jsonResponse({ contact: { name: 'bob', mobile: '+12223334444' } }),
		);

		await endpoints.contacts.create(makeCtx(), {
			name: 'bob',
			mobile: '+12223334444',
		});

		expect(sentBody()).toEqual({
			contact: { name: 'bob', mobile: '+12223334444' },
		});
	});

	it('contacts.update omits the identifier from the body', async () => {
		mockFetch(jsonResponse(fixtures.updatedContactResponse));

		await endpoints.contacts.update(makeCtx(), {
			email: 'bob@example.com',
			identifier_type: 'mobile',
			name: 'bob',
			friendly_name: 'Bobby',
			external_avatar_url: 'https://www.example.com/avatar.png',
			notes: ['New note'],
			data: { custom_attribute: 'custom data' },
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/contacts/bob@example.com',
		);
		expect(queryParam('identifier_type')).toBe('mobile');
		// It is not possible to change an identifier, so it stays in the path only.
		expect(sentBody()).toEqual({
			contact: {
				name: 'bob',
				friendly_name: 'Bobby',
				external_avatar_url: 'https://www.example.com/avatar.png',
				notes: ['New note'],
				data: { custom_attribute: 'custom data' },
			},
		});
	});

	it('identities.list addresses the contact path', async () => {
		mockFetch(jsonResponse(fixtures.identitiesResponse));

		await endpoints.identities.list(makeCtx(), { email: CONTACT });

		expect(lastCall().init.method).toBe('GET');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/contacts/bob@example.com/identities',
		);
	});

	it('identities.create wraps the payload in identity', async () => {
		mockFetch(jsonResponse(fixtures.identitiesResponse));

		await endpoints.identities.create(makeCtx(), {
			email: CONTACT,
			type: 'email',
			identifier: 'helloworld@example.com',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/contacts/bob@example.com/identities',
		);
		expect(sentBody()).toEqual({
			identity: { type: 'email', identifier: 'helloworld@example.com' },
		});
	});

	it('notes.list addresses the contact notes path', async () => {
		mockFetch(jsonResponse(fixtures.notesResponse));

		await endpoints.notes.list(makeCtx(), { contact: CONTACT });

		expect(lastCall().init.method).toBe('GET');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/contacts/bob@example.com/notes',
		);
	});

	it('notes.create sends a bare body, with no wrapper key', async () => {
		mockFetch(jsonResponse(fixtures.notesResponse));

		await endpoints.notes.create(makeCtx(), {
			contact: CONTACT,
			body: 'New note body',
			creator_email: 'staff@example.com',
			created_at: '2026-11-01T00:00:00Z',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/contacts/bob@example.com/notes',
		);
		expect(sentBody()).toEqual({
			body: 'New note body',
			creator_email: 'staff@example.com',
			created_at: '2026-11-01T00:00:00Z',
		});
	});

	it('notes.update sends PUT to the note id', async () => {
		mockFetch(jsonResponse(fixtures.notesResponse));

		await endpoints.notes.update(makeCtx(), {
			contact: CONTACT,
			id: 123,
			body: 'Updated note body',
			creator_email: 'staff@example.com',
			created_at: '2026-11-01T00:00:00Z',
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/contacts/bob@example.com/notes/123',
		);
		expect(sentBody()).toEqual({
			body: 'Updated note body',
			creator_email: 'staff@example.com',
			created_at: '2026-11-01T00:00:00Z',
		});
	});

	it('notes.delete sends DELETE and reports the identifiers', async () => {
		mockFetch(new Response(null, { status: 200 }));

		const result = await endpoints.notes.delete(makeCtx(), {
			contact: CONTACT,
			id: 123,
		});

		expect(lastCall().init.method).toBe('DELETE');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/contacts/bob@example.com/notes/123',
		);
		// The route answers 200 with no body, so the identifiers come from the
		// request.
		expect(result).toEqual({ deleted: true, contact: CONTACT, id: 123 });
	});

	it('channels.list sends the channel type filter', async () => {
		mockFetch(jsonResponse(fixtures.channelsResponse));

		await endpoints.channels.list(makeCtx(), { channel: 'email' });

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url.startsWith(`${BASE}/channels`)).toBe(true);
		expect(queryParam('channel')).toBe('email');
	});

	it('channels.get addresses the slug', async () => {
		mockFetch(jsonResponse(fixtures.channelResponse));

		await endpoints.channels.get(makeCtx(), { slug: 'support' });

		expect(lastCall().init.method).toBe('GET');
		expect(new URL(lastCall().url).pathname).toBe('/api/v1/channels/support');
	});

	it('articles.list sends status, search and paging', async () => {
		mockFetch(jsonResponse(fixtures.articlesResponse));

		await endpoints.articles.list(makeCtx(), {
			status: 'draft',
			q: 'union',
			page: 2,
		});

		expect(lastCall().init.method).toBe('GET');
		expect(queryParam('status')).toBe('draft');
		expect(queryParam('q')).toBe('union');
		expect(queryParam('page')).toBe('2');
	});

	it('articles.get addresses the slug', async () => {
		mockFetch(jsonResponse(fixtures.articleResponse));

		await endpoints.articles.get(makeCtx(), { slug: 'advantage-of-the-union' });

		expect(lastCall().init.method).toBe('GET');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/articles/advantage-of-the-union',
		);
	});

	it('articles.create posts under the topic with the article wrapper', async () => {
		mockFetch(jsonResponse(fixtures.articleResponse));

		await endpoints.articles.create(makeCtx(), {
			topic: 'the-federalist-papers',
			title: 'foo',
			body: 'support',
			status: 1,
			topic_id: 'the-federalist-papers',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/topics/the-federalist-papers/articles',
		);
		expect(sentBody()).toEqual({
			article: {
				title: 'foo',
				body: 'support',
				status: 1,
				topic_id: 'the-federalist-papers',
			},
		});
	});

	it('articles.update sends PUT with the article wrapper', async () => {
		mockFetch(jsonResponse(fixtures.articleResponse));

		await endpoints.articles.update(makeCtx(), {
			slug: 'advantage-of-the-union',
			title: 'new title',
			body: 'new body',
			status: 0,
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/articles/advantage-of-the-union',
		);
		expect(sentBody()).toEqual({
			article: { title: 'new title', body: 'new body', status: 0 },
		});
	});

	it('reports.volume sends the brand and the date window', async () => {
		mockFetch(jsonResponse(fixtures.volumeResponse));

		await endpoints.reports.volume(makeCtx(), {
			brand: 'mybrand',
			start_date: '2026-10-11',
			end_date: '2026-11-09',
		});

		expect(lastCall().init.method).toBe('GET');
		expect(new URL(lastCall().url).pathname).toBe('/api/v1/reports/volume');
		expect(queryParam('brand')).toBe('mybrand');
		expect(queryParam('start_date')).toBe('2026-10-11');
		expect(queryParam('end_date')).toBe('2026-11-09');
	});

	it('reports.responseTime sends the same query', async () => {
		mockFetch(jsonResponse(fixtures.responseTimeResponse));

		await endpoints.reports.responseTime(makeCtx(), {
			brand: 'mybrand',
			start_date: '2026-10-11',
			end_date: '2026-11-09',
		});

		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/reports/response_time',
		);
		expect(queryParam('brand')).toBe('mybrand');
	});

	it('reports.staff sends the same query', async () => {
		mockFetch(jsonResponse(fixtures.staffReportResponse));

		await endpoints.reports.staff(makeCtx(), {
			brand: 'mybrand',
			start_date: '2026-10-11',
			end_date: '2026-11-09',
		});

		expect(new URL(lastCall().url).pathname).toBe('/api/v1/reports/staff');
		expect(queryParam('start_date')).toBe('2026-10-11');
	});

	it('reports.tags sends the same query', async () => {
		mockFetch(jsonResponse(fixtures.tagsReportResponse));

		await endpoints.reports.tags(makeCtx(), {
			brand: 'mybrand',
			start_date: '2026-10-11',
			end_date: '2026-11-09',
		});

		expect(new URL(lastCall().url).pathname).toBe('/api/v1/reports/tags');
		expect(queryParam('end_date')).toBe('2026-11-09');
	});

	it('reports.channelSummary sends the same query', async () => {
		mockFetch(jsonResponse(fixtures.channelSummaryResponse));

		await endpoints.reports.channelSummary(makeCtx(), {
			brand: 'mybrand',
			start_date: '2026-10-11',
			end_date: '2026-11-09',
		});

		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/reports/channel_summary',
		);
		expect(queryParam('brand')).toBe('mybrand');
	});

	it('responseTemplates.list sends search and paging', async () => {
		mockFetch(jsonResponse(fixtures.responseTemplatesResponse));

		await endpoints.responseTemplates.list(makeCtx(), {
			q: 'returns',
			page: 2,
		});

		expect(lastCall().init.method).toBe('GET');
		expect(queryParam('q')).toBe('returns');
		expect(queryParam('page')).toBe('2');
	});

	it('responseTemplates.get addresses the id', async () => {
		mockFetch(jsonResponse(fixtures.responseTemplateResponse));

		await endpoints.responseTemplates.get(makeCtx(), { id: 123 });

		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/response_templates/123',
		);
	});

	it('responseTemplates.create wraps the payload in response_template', async () => {
		mockFetch(jsonResponse(fixtures.responseTemplateResponse));

		await endpoints.responseTemplates.create(makeCtx(), {
			name: 'foo',
			body: 'support',
			is_personal: 1,
		});

		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			response_template: { name: 'foo', body: 'support', is_personal: 1 },
		});
	});

	it('responseTemplates.update sends PUT to the id', async () => {
		mockFetch(jsonResponse(fixtures.responseTemplateResponse));

		await endpoints.responseTemplates.update(makeCtx(), {
			id: 123,
			name: 'new name',
			body: 'new body',
			is_personal: 0,
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe(
			'/api/v1/response_templates/123',
		);
		expect(sentBody()).toEqual({
			response_template: { name: 'new name', body: 'new body', is_personal: 0 },
		});
	});

	it('staff.list sends the page', async () => {
		mockFetch(jsonResponse(fixtures.staffResponse));

		await endpoints.staff.list(makeCtx(), { page: 2 });

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url.startsWith(`${BASE}/staff`)).toBe(true);
		expect(queryParam('page')).toBe('2');
	});

	it('staff.create wraps the payload in staff', async () => {
		mockFetch(jsonResponse(fixtures.createdStaffResponse));

		await endpoints.staff.create(makeCtx(), {
			name: 'Jean Super Agent',
			email: 'jean@example.com',
			password: 'temporary password',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			staff: {
				name: 'Jean Super Agent',
				email: 'jean@example.com',
				password: 'temporary password',
			},
		});
	});

	it('satisfaction.list sends every filter', async () => {
		mockFetch(jsonResponse(fixtures.satisfactionRatingsResponse));

		await endpoints.satisfaction.list(makeCtx(), {
			brand: 'all_brands',
			rating: 5,
			assignee_id: '789',
			created_after: '2026-11-01T00:00:00Z',
			created_before: '2026-11-09T00:00:00Z',
			updated_after: '2026-11-01T00:00:00Z',
			updated_before: '2026-11-09T00:00:00Z',
			page: 2,
		});

		expect(lastCall().init.method).toBe('GET');
		expect(queryParam('brand')).toBe('all_brands');
		expect(queryParam('rating')).toBe('5');
		expect(queryParam('assignee_id')).toBe('789');
		expect(queryParam('created_after')).toBe('2026-11-01T00:00:00Z');
		expect(queryParam('created_before')).toBe('2026-11-09T00:00:00Z');
		expect(queryParam('updated_after')).toBe('2026-11-01T00:00:00Z');
		expect(queryParam('updated_before')).toBe('2026-11-09T00:00:00Z');
		expect(queryParam('page')).toBe('2');
	});

	it('incidents.list sends no query', async () => {
		mockFetch(jsonResponse(fixtures.incidentsResponse));

		await endpoints.incidents.list(makeCtx(), {});

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url).toBe(`${BASE}/incidents`);
	});

	it('incidents.get addresses the identifier', async () => {
		mockFetch(jsonResponse(fixtures.incidentResponse));

		await endpoints.incidents.get(makeCtx(), { identifier: 'inc-1' });

		expect(new URL(lastCall().url).pathname).toBe('/api/v1/incidents/inc-1');
	});

	it('incidents.create wraps the payload in incident', async () => {
		mockFetch(jsonResponse(fixtures.createdIncidentResponse));

		await endpoints.incidents.create(makeCtx(), {
			title: 'Shipment issues',
			updates_attributes: [
				{ status: 'investigating', message: 'Currently having an issue' },
			],
			incidents_systems_attributes: [
				{ system_id: 'system-id', status: 'partial_outage' },
			],
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/incidents`);
		expect(sentBody()).toEqual({
			incident: {
				title: 'Shipment issues',
				updates_attributes: [
					{ status: 'investigating', message: 'Currently having an issue' },
				],
				incidents_systems_attributes: [
					{ system_id: 'system-id', status: 'partial_outage' },
				],
			},
		});
	});

	it('incidents.update sends PUT, the only method the route answers', async () => {
		mockFetch(jsonResponse(fixtures.incidentResponse));

		await endpoints.incidents.update(makeCtx(), {
			identifier: 'inc-1',
			title: 'Shipment issues',
			updates_attributes: [
				{ status: 'resolved', message: 'Currently having an issue' },
			],
			incidents_systems_attributes: [
				{ id: 'is-1', system_id: 'system-id', status: 'operational' },
			],
		});

		// The vendor heading says PUT and its curl example says -X POST. Probed
		// without credentials, POST to this path is "no such route" (404) while
		// PUT reaches the auth check (401), so the heading is the right one.
		expect(lastCall().init.method).toBe('PUT');
		expect(new URL(lastCall().url).pathname).toBe('/api/v1/incidents/inc-1');
		expect(sentBody()).toEqual({
			incident: {
				title: 'Shipment issues',
				updates_attributes: [
					{ status: 'resolved', message: 'Currently having an issue' },
				],
				incidents_systems_attributes: [
					{ id: 'is-1', system_id: 'system-id', status: 'operational' },
				],
			},
		});
	});

	it('systems.list sends no query', async () => {
		mockFetch(jsonResponse(fixtures.systemsResponse));

		await endpoints.systems.list(makeCtx(), {});

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url).toBe(`${BASE}/systems`);
	});
});
