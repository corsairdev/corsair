import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Calls, MeetingEvents, Teams, Users } from './endpoints';
import { LeexiEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { LeexiContext } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLogEvent = jest.mocked(logEventFromContext);

function createMockContext(
	keyId = 'test-key-id',
	keySecret: string | null = 'test-key-secret',
): LeexiContext {
	return {
		key: keyId,
		options: {},
		keys: {
			get_key_secret: jest.fn().mockResolvedValue(keySecret),
		},
	} as unknown as LeexiContext;
}

function lastRequestOptions() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	if (!call) throw new Error('request was not called');
	const [config, options] = call;
	return { config, options };
}

describe('Leexi Meeting Events endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists meeting events with query params and Basic auth', async () => {
		const apiResponse = {
			data: [{ uuid: 'me_1', title: 'Sync' }],
			pagination: { page: 1, items: 10, count: 1 },
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await MeetingEvents.list(ctx, { page: 1, items: 10 });

		expect(result).toEqual(apiResponse);
		const { config, options } = lastRequestOptions();
		expect(config.BASE).toBe('https://public-api.leexi.ai/v1');
		expect(options.method).toBe('GET');
		expect(options.url).toBe('meeting_events');
		expect(options.query).toEqual({ page: 1, items: 10 });
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'leexi.meetingEvents.list',
			{ page: 1, items: 10 },
			'completed',
		);
	});

	it('gets a meeting event by uuid', async () => {
		const apiResponse = {
			success: true,
			message: 'ok',
			data: { uuid: 'me_1' },
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await MeetingEvents.get(ctx, { uuid: 'me_1' });

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('meeting_events/me_1');
	});

	it('creates a meeting event with the required fields', async () => {
		const apiResponse = {
			success: true,
			message: 'Meeting event successfully created',
			data: {
				uuid: 'me_2',
				meeting_url: 'https://zoom.us/j/123',
				start_time: '2026-09-10T10:00:00.000Z',
				end_time: '2026-09-10T10:30:00.000Z',
				owned: false,
				internal: false,
				to_record: true,
				created_at: '2026-09-08T00:00:00.000Z',
				updated_at: '2026-09-08T00:00:00.000Z',
				active: true,
				bot_scheduled: false,
				bot_running: false,
				origin: 'api',
			},
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const input = {
			meeting_url: 'https://zoom.us/j/123',
			user_uuid: 'user_1',
			start_time: '2026-09-10T10:00:00.000Z',
			end_time: '2026-09-10T10:30:00.000Z',
			owned: false,
			internal: false,
			to_record: true,
			organizer: 'organizer@example.com',
		};
		const result = await MeetingEvents.create(ctx, input);

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('meeting_events');
		expect(options.body).toEqual(input);
	});

	it('rejects create input missing required fields before calling the API', async () => {
		const ctx = createMockContext();
		await expect(
			MeetingEvents.create(ctx, { organizer: 'not-an-email' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('deletes a meeting event by uuid', async () => {
		const apiResponse = {
			success: true,
			message: 'Meeting event successfully deleted',
			data: {},
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await MeetingEvents.deleteMeetingEvent(ctx, {
			uuid: 'me_1',
		});

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.method).toBe('DELETE');
		expect(options.url).toBe('meeting_events/me_1');
	});
});

describe('Leexi Calls endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists calls with filters', async () => {
		const apiResponse = {
			data: [{ uuid: 'call_1', duration: 60 }],
			pagination: { page: 1, items: 10, count: 1 },
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await Calls.list(ctx, {
			source_id: ['abc'],
			with_simple_transcript: true,
		});

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.url).toBe('calls');
		expect(options.query).toEqual({
			source_id: ['abc'],
			with_simple_transcript: true,
		});
		expect(() =>
			LeexiEndpointOutputSchemas.callsList.parse(apiResponse),
		).not.toThrow();
	});

	it('gets a call by uuid, including transcript and topics', async () => {
		const apiResponse = {
			data: {
				uuid: 'call_1',
				transcript: [
					{
						speaker_index: 0,
						start_time: 0,
						end_time: 5,
						items: [{ content: 'Hello', start_time: 0, end_time: 1 }],
					},
				],
				call_topics: [{ uuid: 'topic_1', topic_name: 'Pricing' }],
			},
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await Calls.get(ctx, { uuid: 'call_1' });

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.url).toBe('calls/call_1');
	});

	it('requests a presigned upload URL, defaulting the extension to .mp4', async () => {
		const apiResponse = {
			success: true,
			message: 'ok',
			data: {
				url: 'https://s3.example.com/upload',
				recording_s3_key: 'recordings/abc.mp4',
				headers: { 'x-amz-tagging': 'temporary=true' },
			},
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await Calls.requestPresignedUrl(ctx, {});

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('calls/presign_recording_url');
		expect(options.body).toEqual({ extension: '.mp4' });
	});

	it('rejects an unsupported file extension before calling the API', async () => {
		const ctx = createMockContext();
		await expect(
			Calls.requestPresignedUrl(ctx, { extension: '.exe' as never }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('Leexi Teams and Users endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists teams', async () => {
		const apiResponse = {
			data: [{ uuid: 'team_1', name: 'Sales', active: true }],
			pagination: { page: 1, items: 10, count: 1 },
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await Teams.list(ctx, {});

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.url).toBe('teams');
	});

	it('lists users', async () => {
		const apiResponse = {
			data: [
				{
					uuid: 'user_1',
					name: 'Ada',
					email: 'ada@example.com',
					active: true,
					roles: ['admin'],
				},
			],
			pagination: { page: 1, items: 10, count: 1 },
		};
		mockRequest.mockResolvedValueOnce(apiResponse);
		const ctx = createMockContext();

		const result = await Users.list(ctx, { page: 2, items: 25 });

		expect(result).toEqual(apiResponse);
		const { options } = lastRequestOptions();
		expect(options.url).toBe('users');
		expect(options.query).toEqual({ page: 2, items: 25 });
	});
});

describe('Leexi Basic auth credentials', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('builds the Authorization header from ctx.key and the stored key_secret', async () => {
		mockRequest.mockResolvedValueOnce({
			data: [],
			pagination: { page: 1, items: 10, count: 0 },
		});
		const ctx = createMockContext('key-id-abc', 'key-secret-xyz');

		await Teams.list(ctx, {});

		const expectedHeader = `Basic ${Buffer.from('key-id-abc:key-secret-xyz').toString('base64')}`;
		const { config } = lastRequestOptions();
		const headers = config.HEADERS as Record<string, string>;
		expect(headers.Authorization).toBe(expectedHeader);
	});

	it('propagates auth failures so AUTH_ERROR matches with no retries', async () => {
		const transportError = new ApiError(
			{ method: 'GET', url: 'teams' },
			{
				body: { message: 'Unauthorized' },
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				url: 'https://public-api.leexi.ai/v1/teams',
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValueOnce(transportError);
		const ctx = createMockContext();

		let caught: Error;
		try {
			await Teams.list(ctx, {});
			throw new Error('expected Teams.list to throw');
		} catch (error) {
			if (!(error instanceof Error)) throw new Error('expected an Error');
			caught = error;
		}
		expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(true);
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
	});
});
