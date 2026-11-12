import { request } from 'corsair/http';
import {
	addCall,
	addCallRecording,
	getCall,
	getCallTranscripts,
	listCalls,
	listCallsExtensive,
} from './calls';
import { GongCallsInputSchemas, GongCallsOutputSchemas } from './calls-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'access-key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'access-key',
		accessKeySecret: 'secret',
		baseUrl: 'https://us-123.api.gong.io',
	},
	$getAccountId: async () => 'account-id',
} as never;

describe('Gong calls contract', () => {
	beforeEach(() => mockedRequest.mockReset());

	it('validates list calls input and output schemas', () => {
		expect(GongCallsInputSchemas.listCalls.safeParse({}).success).toBe(false);
		expect(
			GongCallsInputSchemas.listCalls.safeParse({
				fromDateTime: '2025-01-01T00:00:00Z',
				toDateTime: '2025-01-02T00:00:00Z',
			}).success,
		).toBe(true);
		expect(
			GongCallsOutputSchemas.listCalls.safeParse({
				requestId: 'r1',
				records: {},
				calls: [],
			}).success,
		).toBe(true);
	});

	it('sends list query fields to the configured regional host', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r1',
			records: {},
			calls: [],
		});
		const result = await listCalls(ctx, {
			fromDateTime: '2025-01-01T00:00:00Z',
			toDateTime: '2025-01-02T00:00:00Z',
			cursor: 'next',
		});
		expect(result?.calls).toEqual([]);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://us-123.api.gong.io',
				USERNAME: 'access-key',
				PASSWORD: 'secret',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/calls',
				query: expect.objectContaining({ cursor: 'next' }),
			}),
		);
	});

	it('retrieves one call by an encoded numeric identifier', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r2', call: { id: '123' } });
		await getCall(ctx, { id: '123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/v2/calls/123' }),
		);
	});

	it('posts the detailed call filter as the documented body', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r3',
			records: {},
			calls: [],
		});
		const body = {
			filter: {
				fromDateTime: '2025-01-01T00:00:00Z',
				toDateTime: '2025-01-02T00:00:00Z',
			},
		};
		await listCallsExtensive(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/calls/extensive',
				body,
			}),
		);
	});

	it('posts a transcript filter', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r4', callTranscripts: [] });
		const body = { filter: { callIds: ['123'] } };
		await getCallTranscripts(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/calls/transcript',
				body,
			}),
		);
	});

	it('creates a call with the documented JSON body', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r5', callId: '123' });
		const body = {
			clientUniqueId: 'external-1',
			actualStart: '2025-01-01T00:00:00Z',
			parties: [],
			direction: 'Outbound',
			primaryUser: 'u1',
		};
		await addCall(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'POST', url: '/v2/calls', body }),
		);
		expect(
			GongCallsOutputSchemas.addCall.safeParse({
				requestId: 'r5',
				callId: '123',
			}).success,
		).toBe(true);
	});

	it('uploads call media as multipart form data', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r6',
			callId: '123',
			url: 'https://media.example/file',
		});
		const mediaFile = new Blob(['audio'], { type: 'audio/mpeg' });
		await addCallRecording(ctx, { id: '123', mediaFile });
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: '/v2/calls/123/media',
				formData: { mediaFile },
			}),
		);
		expect(
			GongCallsOutputSchemas.addCallRecording.safeParse({
				requestId: 'r6',
				callId: '123',
				url: 'https://media.example/file',
			}).success,
		).toBe(true);
	});
	it.each(['', '.', '..', '/', '\\', 'a/b', 'a\\b', '"x"', "'x'"])(
		'rejects unsafe call id %s',
		async (id) => {
			await expect(getCall(ctx, { id })).rejects.toThrow('Unsafe Gong call id');
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);
});
