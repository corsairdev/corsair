import { request } from 'corsair/http';
import { makeEmeliaRestRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function lastCall() {
	const calls = mockRequest.mock.calls;
	const first = calls[0];
	if (first === undefined) {
		throw new Error('expected corsair/http request to be called');
	}
	return { config: first[0], options: first[1] };
}

describe('Emelia REST client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends the raw API key in the Authorization header', async () => {
		mockRequest.mockResolvedValue({ success: true, jobId: 'job_1' });
		await makeEmeliaRestRequest<{ success: boolean; jobId: string }>(
			'/tools/find/email',
			'live-key-123',
			{ method: 'POST', body: { fullname: 'A B' } },
		);

		const { config, options } = lastCall();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/tools/find/email');
		const headers = config.HEADERS;
		if (typeof headers === 'function' || headers === undefined) {
			throw new Error('expected static request headers');
		}
		expect(headers.Authorization).toBe('live-key-123');
		expect(options.body).toEqual({ fullname: 'A B' });
	});

	it('passes query params on GET and omits the body', async () => {
		mockRequest.mockResolvedValue([]);
		await makeEmeliaRestRequest<ReadonlyArray<{ id?: string }>>(
			'/advanced/campaigns',
			'k',
			{ method: 'GET', query: { page: 2, limit: 25 } },
		);

		const { options } = lastCall();
		expect(options.method).toBe('GET');
		expect(options.query).toEqual({ page: 2, limit: 25 });
		expect(options.body).toBeUndefined();
	});

	it('sends a JSON body on DELETE (blacklist/webhook legacy endpoints)', async () => {
		mockRequest.mockResolvedValue({ success: true });
		await makeEmeliaRestRequest<{ success?: boolean }>(
			'/emails/blacklists/contact',
			'k',
			{ method: 'DELETE', body: { email: 'x@example.com' } },
		);

		const { options } = lastCall();
		expect(options.method).toBe('DELETE');
		expect(options.body).toEqual({ email: 'x@example.com' });
	});

	it('targets the REST host, not the GraphQL host', async () => {
		mockRequest.mockResolvedValue({});
		await makeEmeliaRestRequest<Record<string, string>>(
			'/email-providers',
			'k',
			{ method: 'GET' },
		);

		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://api.emelia.io');
		expect(options.url).toBe('/email-providers');
	});
});
