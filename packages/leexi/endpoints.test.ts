import { redactedCallsListLog } from './endpoints/calls';
import { safeMeetingUrlHost } from './endpoints/meeting-events';
import {
	LeexiEndpointInputSchemas,
	LeexiEndpointOutputSchemas,
} from './endpoints/types';

// Schema-level tests for all 9 Leexi endpoints. These run without mocks or
// network access: every case feeds a plain object through the zod schema and
// asserts accept/reject. Shapes mirror the example payloads in
// docs.public-api.leexi.ai/reference/*.md. No type assertions are used —
// `Schema.parse` takes `unknown`, so invalid payloads are passed directly.

describe('meetingEvents.list schema', () => {
	it('accepts an empty filter object', () => {
		expect(LeexiEndpointInputSchemas.meetingEventsList.parse({})).toEqual({});
	});

	it('accepts the full documented filter set', () => {
		expect(
			LeexiEndpointInputSchemas.meetingEventsList.parse({
				page: 2,
				items: 10,
				order: 'start_time desc',
				origin: 'api',
				date_filter: 'end_time',
				from: '2024-06-20T09:30:00.000Z',
				to: '2024-06-20T10:00:00.000Z',
			}),
		).toBeDefined();
	});

	it('rejects out-of-range pagination', () => {
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsList.parse({ page: 0 }),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsList.parse({ items: 0 }),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsList.parse({ items: 101 }),
		).toThrow();
	});

	it('rejects unknown enum values', () => {
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsList.parse({
				order: 'start_time sideways',
			}),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsList.parse({ origin: 'web' }),
		).toThrow();
	});

	it('accepts list output with and without the pages field', () => {
		const base = {
			data: [{ uuid: 'bcdvde61-b4b5-4c93-96be-aa5162086f4d', title: 'Sync' }],
			pagination: { page: 2, items: 10, count: 12 },
		};
		expect(
			LeexiEndpointOutputSchemas.meetingEventsList.parse(base),
		).toBeDefined();
		const withPages = {
			...base,
			pagination: { ...base.pagination, pages: 2 },
		};
		const parsed =
			LeexiEndpointOutputSchemas.meetingEventsList.parse(withPages);
		expect(parsed.pagination.pages).toBe(2);
	});

	it('rejects list output missing data', () => {
		expect(() =>
			LeexiEndpointOutputSchemas.meetingEventsList.parse({
				pagination: { page: 1, items: 10, count: 0 },
			}),
		).toThrow();
	});
});

describe('meetingEvents.get / delete schemas', () => {
	it('accepts a uuid input and rejects a missing one', () => {
		expect(
			LeexiEndpointInputSchemas.meetingEventsGet.parse({ uuid: 'me_1' }),
		).toEqual({ uuid: 'me_1' });
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsGet.parse({}),
		).toThrow();
		expect(
			LeexiEndpointInputSchemas.meetingEventsDelete.parse({ uuid: 'me_1' }),
		).toEqual({ uuid: 'me_1' });
	});

	it('trims uuids and rejects blank ones', () => {
		expect(
			LeexiEndpointInputSchemas.callsGet.parse({ uuid: '  call_1  ' }),
		).toEqual({ uuid: 'call_1' });
		expect(() =>
			LeexiEndpointInputSchemas.callsGet.parse({ uuid: '' }),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.callsGet.parse({ uuid: '   ' }),
		).toThrow();
	});

	it('accepts a documented get response with integration_user', () => {
		const apiResponse = {
			success: true,
			message: 'Meeting event successfully retrieved',
			data: {
				uuid: 'dfghj586-01c4-dfdf-8a56-bb3c10b153b6',
				title: 'Sync',
				organizer: { email: 'baptiste@leexi.ai' },
				attendees: [{ email: 'matthieu@leexi.ai' }],
				bot_runs: [
					{
						uuid: 'f3d6e1d4-aa2c-489b-9b73-6db6b0e5089a',
						start_time: '2024-06-20T09:30:00.000Z',
						end_time: '2024-06-20T10:30:00.000Z',
						recording_start_time: '2024-06-20T09:35:00.000Z',
						end_reason: 'participants_left',
					},
				],
				integration_user: {
					uuid: 'df1a64f1-dfdf-4429-85c0-f77f18321a78',
					name: 'Baptiste',
					email: 'baptiste@leexi.ai',
					active: true,
					user: {
						uuid: '97b312f5-dfdf-dfdf-a651-157976424fa7',
						name: 'Baptiste',
						email: 'baptiste@leexi.ai',
					},
					integration: {
						uuid: 'dfbd9f34-dfdf-dfdf-8860-d38050c3cf8c',
						name: 'Google Calendar',
						slug: 'google_calendar',
						category: 'calendar',
						active: true,
						url: 'https://calendar.google.com/',
						logo: '...',
					},
					calls: [
						{
							uuid: 'bb21867f-9f82-4a0e-bd36-62c7f0c6a3b2',
							source: 'gmeet_bot',
							source_id: '784783982',
							duration: 184.007,
							direction: 'outbound',
							is_video: false,
							visible: true,
						},
					],
				},
			},
		};
		expect(
			LeexiEndpointOutputSchemas.meetingEventsGet.parse(apiResponse),
		).toBeDefined();
	});

	it('accepts a documented delete response', () => {
		expect(
			LeexiEndpointOutputSchemas.meetingEventsDelete.parse({
				success: true,
				message: 'Meeting event successfully deleted',
				data: {},
			}),
		).toBeDefined();
	});
});

describe('meetingEvents.create schema', () => {
	const validInput = {
		meeting_url: 'https://meet.google.com/abc-defg-hij',
		user_uuid: '4321867f-9f82-4a0e-bd36-62c7f0c6a3b2',
		start_time: '2024-06-13T11:00:00.000Z',
		end_time: '2024-06-13T11:30:00.000Z',
		owned: true,
		internal: true,
		to_record: true,
		organizer: 'bob@sdf.com',
		attendees: ['alice@sdf.com'],
		title: 'Test title',
		description: 'Test description',
	};

	it('accepts the documented example payload', () => {
		expect(
			LeexiEndpointInputSchemas.meetingEventsCreate.parse(validInput),
		).toEqual(validInput);
	});

	it('rejects missing required booleans and bad emails', () => {
		const { owned: _owned, ...withoutOwned } = validInput;
		expect(Object.keys(withoutOwned)).not.toContain('owned');
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsCreate.parse(withoutOwned),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsCreate.parse({
				...validInput,
				organizer: 'not-an-email',
			}),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsCreate.parse({
				...validInput,
				attendees: ['not-an-email'],
			}),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.meetingEventsCreate.parse({
				...validInput,
				direction: 'sideways',
			}),
		).toThrow();
	});

	it('accepts inbound/outbound directions', () => {
		expect(
			LeexiEndpointInputSchemas.meetingEventsCreate.parse({
				...validInput,
				direction: 'inbound',
			}).direction,
		).toBe('inbound');
	});

	it('rejects non-web schemes and malformed URLs', () => {
		for (const meeting_url of [
			'ftp://files.example.com/meeting.mp4',
			'mailto:host@example.com',
			'data:text/plain,hello',
			'not-a-valid-url',
		]) {
			expect(() =>
				LeexiEndpointInputSchemas.meetingEventsCreate.parse({
					...validInput,
					meeting_url,
				}),
			).toThrow();
		}
		expect(
			LeexiEndpointInputSchemas.meetingEventsCreate.parse({
				...validInput,
				meeting_url: 'http://meet.example.com/abc',
			}).meeting_url,
		).toBe('http://meet.example.com/abc');
	});

	it('accepts a documented create response', () => {
		expect(
			LeexiEndpointOutputSchemas.meetingEventsCreate.parse({
				success: true,
				message: 'Meeting event successfully created',
				data: {
					uuid: 'b980db78-sdsd-dfdf-8c97-fb3a0c3d4e49',
					meeting_url: 'https://meet.google.com/abc-dsfs-mar',
					origin: 'api',
					active: true,
				},
			}),
		).toBeDefined();
	});
});

describe('calls.list schema', () => {
	it('accepts the full documented filter set', () => {
		const parsed = LeexiEndpointInputSchemas.callsList.parse({
			page: 1,
			items: 10,
			order: 'performed_at desc',
			date_filter: 'updated_at',
			from: '2024-06-13T10:49:47.000Z',
			to: '2024-06-14T10:49:47.000Z',
			source: 'aircall',
			source_id: ['4231481288'],
			owner_uuid: ['a4ce7181-07f3-451c-8593-c067209efe4c'],
			participating_user_uuid: ['a4ce7181-07f3-451c-8593-c067209efe4c'],
			conversation_type_uuid: '79af83f0-467c-4f65-8320-401c74978dff',
			customer_phone_number: ['+132'],
			customer_email_address: ['admin@leexi.ai'],
			with_simple_transcript: true,
		});
		expect(parsed.with_simple_transcript).toBe(true);
	});

	it('rejects bad order values and oversized pages', () => {
		expect(() =>
			LeexiEndpointInputSchemas.callsList.parse({
				order: 'duration desc',
			}),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.callsList.parse({ items: 101 }),
		).toThrow();
	});

	it('accepts a documented list response with AI-era fields', () => {
		const apiResponse = {
			data: [
				{
					uuid: '422dda3c-6e1b-4868-b96e-acd12fdf9139',
					title: 'Call',
					duration: 123.716,
					chapters: [
						{
							uuid: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
							index: 0,
							title: 'Chapter 1: Intro',
							text: 'Content for chapter 1',
							start_time: 10,
						},
					],
					customers: [
						{
							uuid: 'f1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6',
							name: 'Wei Kemmer',
							email: null,
							phone_number: '+1...',
						},
					],
					custom_fields: { plan: 'business', seats: 12, trial: false },
					summary: 'Modi sint ea aliquam.',
					simple_transcript: 'Bob (00:00 - 00:10)\nHello.',
					speakers: [
						{
							uuid: '22cd0302-e459-468d-9e03-54532d996552',
							name: 'Philippe',
							index: 0,
							is_user: true,
							email_address: 'philippe@leexi.ai',
							duration: 100.3,
							longest_monologue: 10.2,
						},
					],
				},
			],
			pagination: { page: 1, items: 10, count: 42, pages: 5 },
		};
		const parsed = LeexiEndpointOutputSchemas.callsList.parse(apiResponse);
		expect(parsed.pagination.pages).toBe(5);
		expect(parsed.data[0]?.summary).toBe('Modi sint ea aliquam.');
	});
});

describe('calls.get schema', () => {
	it('accepts a uuid input and rejects a missing one', () => {
		expect(
			LeexiEndpointInputSchemas.callsGet.parse({ uuid: 'call_1' }),
		).toEqual({ uuid: 'call_1' });
		expect(() => LeexiEndpointInputSchemas.callsGet.parse({})).toThrow();
	});

	it('accepts transcript, call_ai_topics, and summary', () => {
		const apiResponse = {
			data: {
				uuid: '422dda3c-6e1b-4868-b96e-acd12fdf9139',
				transcript: [
					{
						speaker_index: 0,
						start_time: 3.05,
						end_time: 16.773,
						items: [{ content: 'How', start_time: 3.05, end_time: 3.8 }],
					},
				],
				call_topics: [],
				call_ai_topics: [
					{
						uuid: 'fg3cb38c-a0a1-40fg-b273-7c8618fb5534',
						sentence: 'The price would be 100 a month.',
						start_time: 26.32,
						end_time: 26.56,
						ai_topics: [
							{
								uuid: 'aa3cb38c-a0a1-40aa-b273-7c8618fb5534',
								name: 'pricing',
								color: 'blue',
							},
						],
						speaker: {
							uuid: 'fg9edfb7-dc61-fg27-9c99-3e42f4bb1de0',
							name: 'Wei Kemmer',
							index: 1,
							is_user: false,
							phone_number: '+35841760286113555',
						},
						created_at: '2024-06-13T11:00:32.379Z',
						updated_at: '2024-06-13T11:00:32.379Z',
					},
				],
				summary: 'Modi sint ea aliquam.',
				deal: null,
				feedbacks: [],
				scorecards: [],
			},
		};
		const parsed = LeexiEndpointOutputSchemas.callsGet.parse(apiResponse);
		expect(parsed.data.call_ai_topics?.length).toBe(1);
		expect(parsed.data.call_ai_topics?.[0]?.sentence).toBe(
			'The price would be 100 a month.',
		);
	});

	it('rejects a response missing data', () => {
		expect(() => LeexiEndpointOutputSchemas.callsGet.parse({})).toThrow();
	});
});

describe('calls.requestPresignedUrl schema', () => {
	it('accepts an empty input (endpoint defaults to .mp4)', () => {
		expect(
			LeexiEndpointInputSchemas.callsRequestPresignedUrl.parse({}),
		).toEqual({});
	});

	it('accepts documented audio and video extensions', () => {
		expect(
			LeexiEndpointInputSchemas.callsRequestPresignedUrl.parse({
				extension: '.mp3',
			}).extension,
		).toBe('.mp3');
		expect(
			LeexiEndpointInputSchemas.callsRequestPresignedUrl.parse({
				extension: '.mkv',
			}).extension,
		).toBe('.mkv');
	});

	it('rejects unsupported extensions', () => {
		expect(() =>
			LeexiEndpointInputSchemas.callsRequestPresignedUrl.parse({
				extension: '.exe',
			}),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.callsRequestPresignedUrl.parse({
				extension: 'mp3',
			}),
		).toThrow();
	});

	it('accepts a documented presigned-url response', () => {
		expect(
			LeexiEndpointOutputSchemas.callsRequestPresignedUrl.parse({
				success: true,
				message: 'recording url presigned',
				data: {
					recording_s3_key:
						'acme/recordings/upload/bec9d04c-ba91-43c1-8a46-79f690a844c1.mp3',
					url: 'https://foo.s3.eu-west-3.amazonaws.com/acme/recordings/upload/file.mp3',
					headers: { 'x-amz-tagging': 'temporary=true' },
				},
			}),
		).toBeDefined();
	});
});

describe('teams.list and users.list schemas', () => {
	it('accepts pagination input and rejects oversized pages', () => {
		expect(LeexiEndpointInputSchemas.teamsList.parse({ page: 1 })).toEqual({
			page: 1,
		});
		expect(() =>
			LeexiEndpointInputSchemas.teamsList.parse({ items: 101 }),
		).toThrow();
		expect(() =>
			LeexiEndpointInputSchemas.usersList.parse({ page: 0 }),
		).toThrow();
	});

	it('accepts a documented teams response', () => {
		expect(
			LeexiEndpointOutputSchemas.teamsList.parse({
				data: [
					{
						uuid: '5290728d-b3c4-4330-918d-d8f153e9500d',
						name: 'Sales Team',
						active: true,
						created_at: '2024-06-14T11:00:33.534Z',
						updated_at: '2024-06-14T11:00:33.534Z',
					},
				],
				pagination: { page: 1, items: 10, count: 1, pages: 1 },
			}),
		).toBeDefined();
	});

	it('accepts a documented users response', () => {
		const parsed = LeexiEndpointOutputSchemas.usersList.parse({
			data: [
				{
					uuid: 'befb9860-8661-442a-9496-8743de9e17cd',
					name: 'John Smith',
					email: 'john.smith@acme.com',
					active: true,
					license: 'business',
					roles: ['member'],
					team: {
						uuid: '5290728d-b3c4-4330-918d-d8f153e9500d',
						name: 'Sales Team',
						active: true,
					},
					created_at: '2024-06-14T11:00:33.534Z',
					updated_at: '2024-06-14T11:00:33.534Z',
				},
			],
			pagination: { page: 1, items: 10, count: 1, pages: 1 },
		});
		expect(parsed.data[0]?.team?.name).toBe('Sales Team');
	});
});

describe('calls list audit-log redaction', () => {
	it('replaces customer PII filter values with counts', () => {
		const logged = redactedCallsListLog({
			page: 1,
			customer_email_address: ['admin@leexi.ai', 'support@leexi.ai'],
			customer_phone_number: ['+132'],
		});
		expect(logged).toEqual({
			page: 1,
			customer_email_address_count: 2,
			customer_phone_number_count: 1,
		});
		const loggedJson = JSON.stringify(logged);
		expect(loggedJson).not.toContain('admin@leexi.ai');
		expect(loggedJson).not.toContain('+132');
	});

	it('keeps non-PII filters untouched when no PII is present', () => {
		expect(
			redactedCallsListLog({
				page: 2,
				items: 25,
				owner_uuid: ['a4ce7181-07f3-451c-8593-c067209efe4c'],
			}),
		).toEqual({
			page: 2,
			items: 25,
			owner_uuid: ['a4ce7181-07f3-451c-8593-c067209efe4c'],
		});
	});
});

describe('meeting URL hostname redaction', () => {
	it('returns only the hostname for URLs with secrets in query', () => {
		expect(
			safeMeetingUrlHost(
				'https://zoom.us/j/123456789?pwd=SuperSecretPasscode&tk=signed-token',
			),
		).toBe('zoom.us');
	});

	it('returns undefined for unparsable input, never a raw fallback', () => {
		expect(safeMeetingUrlHost('not-a-valid-url')).toBeUndefined();
		expect(safeMeetingUrlHost('')).toBeUndefined();
	});
});
