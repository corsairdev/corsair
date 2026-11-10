import { Attendees, Events, Questions, TicketClasses } from './endpoints';
import {
	attendee,
	cannedQuestion,
	eventbriteEvent,
	paidTicketClass,
	question,
	ticketClass,
	ticketClassesPage,
} from './test-fixtures';
import { createHarness, invoke } from './test-helpers';

// Hoisted by ts-jest into this file; a mock declared in test-helpers.ts would
// run after these imports and leave the real logger bound.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const EVENT = '2000937221092';

const h = createHarness();

beforeEach(() => {
	h.mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('output parsing', () => {
	it('parses an event with every nullish field kept as sent', async () => {
		h.respond(eventbriteEvent);

		const result = await invoke(Events.get, { event_id: EVENT });

		// Eventbrite sends explicit nulls here; a schema that coerced them to
		// undefined would hide the difference from a caller.
		expect(result.capacity).toBeNull();
		expect(result.version).toBeNull();
		expect(result.start?.timezone).toBe('Asia/Tokyo');
		expect(result.status).toBe('live');
	});

	it('keeps unknown fields, so a new field Eventbrite adds is not dropped', async () => {
		h.respond({ ...eventbriteEvent, some_new_field: 'kept' });

		const result = await invoke(Events.get, { event_id: EVENT });

		// `.loose()` output means a field the plugin does not name still arrives,
		// so a caller can read a field Eventbrite added after this release.
		// unknown: the field is not in the schema, which is exactly the point.
		expect((result as Record<string, string>).some_new_field).toBe('kept');
	});

	it('parses the flat ticket-class cost fields the wire sends', async () => {
		h.respond(ticketClassesPage);

		const result = await invoke(TicketClasses.list, { event_id: EVENT });

		const first = result.ticket_classes[0];
		expect(first?.event_id).toBe(EVENT);
		expect(first?.on_sale_status).toBe('AVAILABLE');
		// `free` is the provider's own field, kept as sent.
		expect(first?.free).toBe(true);
	});

	it('parses an attendee whose answer is a string and whose barcode is present', async () => {
		h.respond(attendee);

		const result = await invoke(Attendees.get, {
			event_id: EVENT,
			attendee_id: '1234567890',
		});

		expect(result.profile?.email).toBe('jordan@example.com');
		expect(result.answers?.[0]?.answer).toBe('accepted');
		expect(result.barcodes?.[0]?.status).toBe('unused');
	});

	it('accepts an address answer, which is an object rather than a string', async () => {
		h.respond({
			id: '1',
			answers: [
				{
					question_id: '2',
					type: 'address',
					answer: { address_1: '1 Main St', city: 'Austin', country: 'US' },
				},
			],
		});

		const result = await invoke(Attendees.get, {
			event_id: EVENT,
			attendee_id: '1',
		});

		expect(result.answers?.[0]?.answer).toMatchObject({ city: 'Austin' });
	});

	it('parses a waiver question and a canned question with a string id', async () => {
		h.respond(question);
		const parsedQuestion = (await invoke(Questions.get, {
			event_id: EVENT,
			question_id: '323787959',
		})) as { type: string; waiver: string };

		expect(parsedQuestion.type).toBe('waiver');
		expect(parsedQuestion.waiver).toContain('Welcome');

		h.respond({ questions: [cannedQuestion], pagination: {} });
		const parsedCanned = await invoke(Questions.listCanned, {
			event_id: EVENT,
		});

		expect(parsedCanned.questions[0]?.id).toBe('first_name');
		expect(parsedCanned.questions[0]?.include).toBe(true);
	});

	it('parses a paid ticket class, whose price fields are flat on the wire', async () => {
		h.respond(paidTicketClass);

		const result = await invoke(TicketClasses.get, {
			event_id: '1990052725272',
			ticket_class_id: '3433869327',
		});

		// Eventbrite sends `cost`, `fee` and `tax` as siblings of `free`, not
		// nested under a `cost` wrapper; reading them through the declared type
		// is what this pins.
		expect(result.cost?.value).toBe(12500);
		expect(result.fee?.display).toBe('$10.23');
		expect(result.tax?.value).toBe(0);
		expect(result.actual_cost).toBeNull();
		expect(result.free).toBe(false);
	});

	it('fails a list element that is a bare string rather than an object', async () => {
		// A wrong-shaped body must throw: mapping it to a blank row would look
		// like a page of real records.
		h.respond({ ticket_classes: ['General Admission'] });

		const caught = await h.failure<Error>(
			invoke(TicketClasses.list, {
				event_id: EVENT,
			}),
		);

		expect(caught.name).toBe('ZodError');
	});

	it('fails a list that is missing its envelope key instead of inventing an empty page', async () => {
		// `page_size=0` is answered with a 500 by Eventbrite, and a body without
		// the array should never be read as "no events".
		h.respond({ pagination: { object_count: 0 } });

		const caught = await h.failure<Error>(
			invoke(Events.listByOrganization, {
				organization_id: '154830740213',
			}),
		);

		expect(caught.name).toBe('ZodError');
	});

	it('fails a known field with the wrong type', async () => {
		h.respond({ ...ticketClass, free: 'yes' });

		const caught = await h.failure<Error>(
			invoke(TicketClasses.get, {
				event_id: EVENT,
				ticket_class_id: '3453243480',
			}),
		);

		expect(caught.name).toBe('ZodError');
	});

	it('fails a publish answer of `published: false`, the shape a 200 refusal would use', async () => {
		h.respond({ published: false });

		const caught = await h.failure<Error>(
			invoke(Events.publish, {
				event_id: EVENT,
			}),
		);

		expect(caught.name).toBe('ZodError');
	});

	it('accepts a 200 body that carries an empty events array as a real empty page', async () => {
		h.respond({ events: [], pagination: { object_count: 0, page_count: 1 } });

		const result = await invoke(Events.listByOrganization, {
			organization_id: '154830740213',
		});

		expect(result.events).toEqual([]);
	});
});
