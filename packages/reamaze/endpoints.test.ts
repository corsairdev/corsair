// unknown: response bodies are arbitrary JSON, so each test states its own.
jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { logEventFromContext } from 'corsair/core';
import * as fixtures from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const CONTACT = 'bob@example.com';

describe('Re:amaze output parsing', () => {
	it('unwraps a conversation list with its paging fields', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		const result = await endpoints.conversations.list(makeCtx(), {});

		expect(result.conversations).toHaveLength(1);
		expect(result.conversations[0]!.slug).toBe('knock-knock');
		expect(result.page_size).toBe(30);
		expect(result.page_count).toBe(1);
		expect(result.total_count).toBe(1);
	});

	it('keeps a null assignee and the nested category', async () => {
		mockFetch(jsonResponse(fixtures.conversationsResponse));

		const result = await endpoints.conversations.list(makeCtx(), {});
		const first = result.conversations[0]!;

		expect(first.assignee).toBeNull();
		expect(first.category).toEqual({
			name: 'Support',
			slug: 'support',
			email: 'support@example.com',
			channel: 1,
		});
	});

	it('parses one conversation with its data attributes', async () => {
		mockFetch(jsonResponse(fixtures.conversationResponse));

		const result = await endpoints.conversations.get(makeCtx(), {
			slug: 'knock-knock',
		});

		expect(result.slug).toBe('knock-knock');
		expect(result.data).toEqual({ custom_attribute: 'custom data' });
	});

	it('parses a created conversation', async () => {
		mockFetch(jsonResponse(fixtures.createdConversationResponse));

		const result = await endpoints.conversations.create(makeCtx(), {
			subject: 'Printer offline',
			category: 'support',
			message: { body: 'Printer on floor 3 is offline.' },
			user: { name: 'bob', email: 'bob@example.com' },
		});

		expect(result.slug).toBe('printer-offline');
		expect(result.subject).toBe('Printer offline');
	});

	it('parses an updated conversation', async () => {
		mockFetch(jsonResponse(fixtures.updatedConversationResponse));

		const result = await endpoints.conversations.update(makeCtx(), {
			slug: 'knock-knock',
			status: 2,
		});

		expect(result.status).toBe(2);
		expect(result.tag_list).toEqual(['joke', 'resolved']);
	});

	it('parses a message list with its attachments and conversation', async () => {
		mockFetch(jsonResponse(fixtures.messagesResponse));

		const result = await endpoints.messages.list(makeCtx(), {});
		const first = result.messages[0]!;

		expect(result.messages).toHaveLength(1);
		expect(first.attachments?.[0]?.file_file_name).toBe('secret.png');
		expect(first.conversation?.slug).toBe('do-you-read-me');
		expect(result.total_count).toBe(1);
	});

	it('parses a created message', async () => {
		mockFetch(jsonResponse(fixtures.createdMessageResponse));

		const result = await endpoints.messages.create(makeCtx(), {
			slug: 'do-you-read-me',
			body: 'This is the body of the new message you just posted!',
		});

		expect(result.body).toBe(
			'This is the body of the new message you just posted!',
		);
		expect(result.visibility).toBe(0);
	});

	it('parses a contact list with its nested notes', async () => {
		mockFetch(jsonResponse(fixtures.contactsResponse));

		const result = await endpoints.contacts.list(makeCtx(), {});

		expect(result.contacts).toHaveLength(1);
		expect(result.contacts[0]!.notes?.[0]?.note).toBe('this is a note');
	});

	it('parses a created contact from its wrapper', async () => {
		mockFetch(jsonResponse(fixtures.createdContactResponse));

		const result = await endpoints.contacts.create(makeCtx(), {
			name: 'bob',
			email: 'bob@example.com',
		});

		expect(result.contact.id).toBe('123');
		expect(result.contact.notes).toHaveLength(2);
	});

	it('parses an updated contact', async () => {
		mockFetch(jsonResponse(fixtures.updatedContactResponse));

		const result = await endpoints.contacts.update(makeCtx(), {
			email: CONTACT,
			friendly_name: 'Bobby',
		});

		expect(result.contact.friendly_name).toBe('Bobby');
	});

	it('parses an identity list from its wrapper', async () => {
		mockFetch(jsonResponse(fixtures.identitiesResponse));

		const result = await endpoints.identities.list(makeCtx(), {
			email: CONTACT,
		});

		expect(result.identities).toHaveLength(2);
		expect(result.identities[0]).toEqual({
			type: 'email',
			identifier: 'johndoe@example.com',
		});
	});

	it('wraps a bare notes array under notes', async () => {
		// Verified live: the route answers a raw JSON array, not { notes: [...] }.
		mockFetch(jsonResponse(fixtures.notesResponse));

		const result = await endpoints.notes.list(makeCtx(), { contact: CONTACT });

		expect(result.notes).toHaveLength(2);
		expect(result.notes[0]!.note).toBe('this is a note');
		expect(result.notes[1]!.creator?.email).toBe('sally@mail.com');
	});

	it('parses an empty bare notes array', async () => {
		mockFetch(jsonResponse(fixtures.emptyNotesResponse));

		const result = await endpoints.notes.list(makeCtx(), { contact: CONTACT });

		expect(result.notes).toEqual([]);
	});

	it('parses a created note from the bare array it answers', async () => {
		mockFetch(jsonResponse(fixtures.notesResponse));

		const result = await endpoints.notes.create(makeCtx(), {
			contact: CONTACT,
			body: 'New note body',
		});

		expect(result.notes).toHaveLength(2);
	});

	it('reports a note delete from the identifiers, since the body is empty', async () => {
		mockFetch(new Response(null, { status: 200 }));

		const result = await endpoints.notes.delete(makeCtx(), {
			contact: CONTACT,
			id: 123,
		});

		expect(result).toEqual({ deleted: true, contact: CONTACT, id: 123 });
	});

	it('returns the write even when the success log throws', async () => {
		// `logEvent` throws when encryptDataAtRest is configured without a kek. The
		// log runs outside the request try, so a completed write is still returned
		// rather than reported as failed and retried into a duplicate.
		const log = jest.mocked(logEventFromContext);
		log.mockRejectedValueOnce(new Error('encryptDataAtRest requires kek'));
		mockFetch(jsonResponse(fixtures.notesResponse));

		const result = await endpoints.notes.create(makeCtx(), {
			contact: CONTACT,
			body: 'a note',
		});

		expect(result.notes.length).toBeGreaterThan(0);
	});

	it('logs a failed event and rethrows the original error', async () => {
		const log = jest.mocked(logEventFromContext);
		log.mockClear();
		mockFetch(jsonResponse({ errors: 'Not Found' }, { status: 404 }));

		await expect(
			endpoints.conversations.get(makeCtx(), { slug: 'nope' }),
		).rejects.toThrow(/Not Found/);

		// One failed event, recorded before the rethrow.
		const failed = log.mock.calls.filter((call) => call[3] === 'failed');
		expect(failed).toHaveLength(1);
	});

	it('rejects a non-empty body on a note delete', async () => {
		// An error page or a plain-text message is not a successful delete; before
		// this, any string body was reported as one.
		mockFetch(new Response('something went wrong', { status: 200 }));

		await expect(
			endpoints.notes.delete(makeCtx(), { contact: CONTACT, id: 123 }),
		).rejects.toThrow(/unexpected note delete body/);
	});

	it('parses a channel list that sends only total_count', async () => {
		mockFetch(jsonResponse(fixtures.channelsResponse));

		const result = await endpoints.channels.list(makeCtx(), {});

		expect(result.channels).toHaveLength(1);
		expect(result.total_count).toBe(1);
		// Verified live: this route has no page_size or page_count.
		expect(result.page_size).toBeUndefined();
		expect(result.page_count).toBeUndefined();
	});

	it('parses one channel with its brand', async () => {
		mockFetch(jsonResponse(fixtures.channelResponse));

		const result = await endpoints.channels.get(makeCtx(), { slug: 'support' });

		expect(result.slug).toBe('support');
		expect(result.brand).toEqual({ name: 'Example', url: 'example' });
	});

	it('parses an article list', async () => {
		mockFetch(jsonResponse(fixtures.articlesResponse));

		const result = await endpoints.articles.list(makeCtx(), {});

		expect(result.articles[0]!.slug).toBe('advantage-of-the-union');
		expect(result.articles[0]!.topic?.slug).toBe('the-federalist-papers');
	});

	it('parses one article', async () => {
		mockFetch(jsonResponse(fixtures.articleResponse));

		const result = await endpoints.articles.get(makeCtx(), {
			slug: 'advantage-of-the-union',
		});

		expect(result.status).toBe(0);
		expect(result.author?.name).toBe('Alexander Hamilton');
	});

	it('parses the volume report, whose counts are keyed by date', async () => {
		mockFetch(jsonResponse(fixtures.volumeResponse));

		const result = await endpoints.reports.volume(makeCtx(), {});

		expect(result.conversation_counts).toEqual({
			'2026-11-08': 3,
			'2026-11-09': 5,
		});
		expect(result.start_date).toBe('2026-10-11');
		expect(result.end_date).toBe('2026-11-09');
	});

	it('parses the response time report, which has response_times and summary', async () => {
		mockFetch(jsonResponse(fixtures.responseTimeResponse));

		const result = await endpoints.reports.responseTime(makeCtx(), {});

		expect(result.response_times).toEqual({
			'2026-11-08': 600,
			'2026-11-09': 1200,
		});
		expect(result.summary).toBeDefined();
	});

	it('parses the staff report, which is keyed report', async () => {
		mockFetch(jsonResponse(fixtures.staffReportResponse));

		const result = await endpoints.reports.staff(makeCtx(), {});

		expect(Object.keys(result.report ?? {})).toEqual(['John Doe']);
	});

	it('parses the tags report, whose tags are a name-to-count map', async () => {
		mockFetch(jsonResponse(fixtures.tagsReportResponse));

		const result = await endpoints.reports.tags(makeCtx(), {});

		expect(result.tags).toEqual({ 'Reamaze Tutorial': 5, Billing: 2 });
	});

	it('parses the channel summary, which is keyed channels', async () => {
		mockFetch(jsonResponse(fixtures.channelSummaryResponse));

		const result = await endpoints.reports.channelSummary(makeCtx(), {});

		expect(Object.keys(result.channels ?? {})).toEqual(['12345']);
	});

	it('parses a response template list', async () => {
		mockFetch(jsonResponse(fixtures.responseTemplatesResponse));

		const result = await endpoints.responseTemplates.list(makeCtx(), {});

		expect(result.response_templates[0]!.name).toBe('Returns Instructions');
		expect(result.response_templates[0]!.response_template_group?.name).toBe(
			'Returns',
		);
	});

	it('parses a staff list with its opaque role hash', async () => {
		mockFetch(jsonResponse(fixtures.staffResponse));

		const result = await endpoints.staff.list(makeCtx(), {});

		expect(result.staff[0]!.email).toBe('jean@example.com');
		expect(result.staff[0]!.role).toEqual({ admin: true });
	});

	it('parses a satisfaction rating list', async () => {
		mockFetch(jsonResponse(fixtures.satisfactionRatingsResponse));

		const result = await endpoints.satisfaction.list(makeCtx(), {});

		expect(result.satisfaction_ratings[0]!.rating).toBe(5);
		expect(result.total_count).toBe(1);
	});

	it('wraps the bare incident array under incidents', async () => {
		mockFetch(jsonResponse(fixtures.incidentsResponse));

		const result = await endpoints.incidents.list(makeCtx(), {});

		expect(result.incidents).toHaveLength(1);
		expect(result.incidents[0]!.status).toBe('investigating');
	});

	it('parses empty incident and system arrays, which a quiet brand returns', async () => {
		mockFetch(jsonResponse(fixtures.emptyIncidentsResponse));
		const incidents = await endpoints.incidents.list(makeCtx(), {});
		expect(incidents.incidents).toEqual([]);

		mockFetch(jsonResponse(fixtures.emptySystemsResponse));
		const systems = await endpoints.systems.list(makeCtx(), {});
		expect(systems.systems).toEqual([]);
	});

	it('parses one incident with its updates and systems', async () => {
		mockFetch(jsonResponse(fixtures.incidentResponse));

		const result = await endpoints.incidents.get(makeCtx(), {
			identifier: 'inc-1',
		});

		expect(result.updates?.[0]?.status).toBe('investigating');
		expect(result.incidents_systems?.[0]?.system?.title).toBe(
			'Shipment Providers',
		);
	});

	it('reads an incident or system status the vendor adds later', async () => {
		// Only the inputs are held to the documented statuses. A read must not
		// fail because Re:amaze started sending a new one.
		mockFetch(
			jsonResponse([
				{
					...fixtures.incidentResponse,
					status: 'scheduled',
					updates: [{ id: 'u-1', status: 'scheduled', message: 'Planned' }],
					incidents_systems: [
						{ id: 'is-1', system_id: 'sys-1', status: 'planned_maintenance' },
					],
				},
			]),
		);
		const incidents = await endpoints.incidents.list(makeCtx(), {});
		expect(incidents.incidents[0]!.status).toBe('scheduled');
		expect(incidents.incidents[0]!.updates?.[0]?.status).toBe('scheduled');
		expect(incidents.incidents[0]!.incidents_systems?.[0]?.status).toBe(
			'planned_maintenance',
		);

		mockFetch(
			jsonResponse([
				{ id: 'sys-1', title: 'Neat', status: 'planned_maintenance' },
			]),
		);
		const systems = await endpoints.systems.list(makeCtx(), {});
		expect(systems.systems[0]!.status).toBe('planned_maintenance');
	});

	it('wraps the bare system array under systems', async () => {
		mockFetch(jsonResponse(fixtures.systemsResponse));

		const result = await endpoints.systems.list(makeCtx(), {});

		expect(result.systems[0]!.title).toBe('Neat');
		expect(result.systems[0]!.active_incidents).toHaveLength(1);
	});
});

describe('Re:amaze shape rejections', () => {
	it('rejects a conversation list whose wrapper is missing', async () => {
		mockFetch(jsonResponse({ page_size: 30, total_count: 0 }));

		await expect(endpoints.conversations.list(makeCtx(), {})).rejects.toThrow(
			/no conversations array/,
		);
	});

	it('rejects an unrelated object as one conversation', async () => {
		// Every other field is optional, so `slug` is what proves this is a
		// conversation rather than some other resource's body.
		mockFetch(jsonResponse({ unrelated: true }));

		await expect(
			endpoints.conversations.get(makeCtx(), { slug: 'knock-knock' }),
		).rejects.toThrow();
	});

	it('rejects an empty object as one conversation', async () => {
		mockFetch(jsonResponse({}));

		await expect(
			endpoints.conversations.get(makeCtx(), { slug: 'knock-knock' }),
		).rejects.toThrow();
	});

	it('rejects a conversation list whose wrapper is not an array', async () => {
		mockFetch(jsonResponse({ conversations: { slug: 'knock-knock' } }));

		await expect(endpoints.conversations.list(makeCtx(), {})).rejects.toThrow(
			/no conversations array/,
		);
	});

	it('rejects a message list whose wrapper is not an array', async () => {
		mockFetch(jsonResponse({ messages: 'nope' }));

		await expect(endpoints.messages.list(makeCtx(), {})).rejects.toThrow(
			/no messages array/,
		);
	});

	it('rejects a non-object conversation list body', async () => {
		mockFetch(jsonResponse(['not', 'an', 'envelope']));

		await expect(endpoints.conversations.list(makeCtx(), {})).rejects.toThrow(
			/unexpected conversation list body/,
		);
	});

	it('rejects a non-object single conversation body', async () => {
		mockFetch(jsonResponse(['not', 'a', 'conversation']));

		await expect(
			endpoints.conversations.get(makeCtx(), { slug: 'knock-knock' }),
		).rejects.toThrow(/unexpected conversation body/);
	});

	it('rejects a notes body that is not an array', async () => {
		// An object here is the wrapper the route does not send, so it is a hard
		// failure rather than an empty list.
		mockFetch(jsonResponse({ notes: [] }));

		await expect(
			endpoints.notes.list(makeCtx(), { contact: CONTACT }),
		).rejects.toThrow(/non-array contact notes body/);
	});

	it('rejects a systems body that is not an array', async () => {
		mockFetch(jsonResponse({ systems: [] }));

		await expect(endpoints.systems.list(makeCtx(), {})).rejects.toThrow(
			/non-array system list body/,
		);
	});

	it('rejects an incidents body that is not an array', async () => {
		mockFetch(jsonResponse({ incidents: [] }));

		await expect(endpoints.incidents.list(makeCtx(), {})).rejects.toThrow(
			/non-array incident list body/,
		);
	});

	it('rejects a tag report whose tags are not counts', async () => {
		// Verified live, `tags` is a name-to-count map. An array is the shape the
		// older docs implied and would break a caller that iterates entries.
		mockFetch(
			jsonResponse({ tags: ['Reamaze Tutorial'], start_date: '2026-10-11' }),
		);

		await expect(endpoints.reports.tags(makeCtx(), {})).rejects.toThrow();
	});

	it('rejects a volume report whose counts are not numbers', async () => {
		mockFetch(
			jsonResponse({
				conversation_counts: { '2026-11-09': 'five' },
				start_date: '2026-10-11',
				end_date: '2026-11-09',
			}),
		);

		await expect(endpoints.reports.volume(makeCtx(), {})).rejects.toThrow();
	});

	it('rejects an empty conversation slug before sending', async () => {
		await expect(
			endpoints.conversations.get(makeCtx(), { slug: '' }),
		).rejects.toThrow();
	});

	it('rejects an out-of-range conversation status before sending', async () => {
		await expect(
			endpoints.conversations.update(makeCtx(), {
				slug: 'knock-knock',
				status: 99,
			}),
		).rejects.toThrow();
	});

	it('rejects a satisfaction rating outside 1 to 5', async () => {
		await expect(
			endpoints.satisfaction.list(makeCtx(), { rating: 6 }),
		).rejects.toThrow();
	});

	it('rejects an incident update status the vendor does not accept', async () => {
		await expect(
			endpoints.incidents.create(makeCtx(), {
				title: 'Shipment issues',
				// @ts-expect-error the status is a closed enum the API documents
				updates_attributes: [{ status: 'exploded', message: 'nope' }],
			}),
		).rejects.toThrow();
	});

	it('throws when neither the option nor the store has a host', async () => {
		await expect(
			endpoints.conversations.list(makeCtx({ host: null }), {}),
		).rejects.toThrow(/brand host is required/);
	});

	it('names both places to set the host in the error', async () => {
		await expect(
			endpoints.conversations.list(makeCtx({ host: null }), {}),
		).rejects.toThrow(/reamaze\(\{ host \}\).*set_host/);
	});
});

describe('Re:amaze error surfaces', () => {
	it('surfaces a 404 for an unknown resource, which sends { errors }', async () => {
		mockFetch(jsonResponse(fixtures.notFoundResourceBody, { status: 404 }));

		await expect(
			endpoints.conversations.get(makeCtx(), { slug: 'missing' }),
		).rejects.toThrow(/Re:amaze 404: Not Found/);
	});

	it('surfaces a 404 for a route that does not exist, which sends { status, error }', async () => {
		mockFetch(jsonResponse(fixtures.notFoundRouteBody, { status: 404 }));

		await expect(endpoints.systems.list(makeCtx(), {})).rejects.toThrow(
			/Re:amaze 404: Not Found/,
		);
	});

	it('surfaces a 422 with each field message', async () => {
		mockFetch(jsonResponse(fixtures.validationErrorBody, { status: 422 }));

		const error = await endpoints.contacts
			.create(makeCtx(), { name: 'bob', email: 'bob@example.com' })
			.catch((e: Error) => e);

		expect(error).toBeInstanceOf(Error);
		expect(error.message).toMatch(/can't be blank/);
		expect(error.message).toMatch(/422/);
	});

	it('surfaces a 403 from a role without the required permission', async () => {
		mockFetch(jsonResponse(fixtures.forbiddenBody, { status: 403 }));

		await expect(endpoints.satisfaction.list(makeCtx(), {})).rejects.toThrow(
			/do not have permission/,
		);
	});

	it('falls back to a readable message when the body is HTML', async () => {
		// A route that does not exist answers the site's HTML page, so the body
		// can be unparseable and the status still has to classify the failure.
		mockFetch(
			new Response('<html><body>Not Found</body></html>', {
				status: 404,
				headers: { 'Content-Type': 'text/html' },
			}),
		);

		await expect(
			endpoints.conversations.get(makeCtx(), { slug: 'missing' }),
		).rejects.toThrow(/Re:amaze 404/);
	});
});
