import crypto from 'node:crypto';
import { ApiError } from 'corsair/http';
import {
	KALSHI_API_BASES,
	KalshiAPIError,
	makeKalshiRequest,
	parseKalshiCredentials,
	serializeKalshiCredentials,
} from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {
		constructor(
			request: unknown,
			response: {
				url: string;
				status: number;
				statusText: string;
				body: unknown;
			},
			message: string,
			rateLimitInfo?: { retryAfter?: number },
		) {
			super(message);
			this.name = 'ApiError';
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.body = response.body;
			this.request = request;
			this.retryAfter = rateLimitInfo?.retryAfter;
		}
		url: string;
		status: number;
		statusText: string;
		body: unknown;
		request: unknown;
		retryAfter?: number;
	},
}));

import { request } from 'corsair/http';

const mockRequest = request as jest.MockedFunction<typeof request>;

const rsa = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const pem = rsa.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

function credentials(environment: 'demo' | 'production' = 'demo') {
	return serializeKalshiCredentials({
		keyId: 'test-key-id',
		privateKey: pem,
		environment,
	});
}

function lastCall() {
	const [config, options] = mockRequest.mock.calls[0] ?? [];
	if (!config || !options) throw new Error('request was not called');
	return {
		config,
		options,
		headers: config.HEADERS as Record<string, string>,
	};
}

describe('makeKalshiRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends the three Kalshi auth headers', async () => {
		await makeKalshiRequest('/exchange/status', credentials());

		const { headers } = lastCall();
		expect(headers['KALSHI-ACCESS-KEY']).toBe('test-key-id');
		expect(headers['KALSHI-ACCESS-TIMESTAMP']).toMatch(/^\d{13}$/);
		expect(headers['KALSHI-ACCESS-SIGNATURE']).toMatch(/^[A-Za-z0-9+/]+=*$/);
	});

	it('signs timestamp + method + full path from the API root', async () => {
		await makeKalshiRequest('/portfolio/balance', credentials());

		const { headers } = lastCall();
		const signedString = `${headers['KALSHI-ACCESS-TIMESTAMP']}GET/trade-api/v2/portfolio/balance`;
		const valid = crypto.verify(
			'sha256',
			Buffer.from(signedString),
			{
				key: rsa.publicKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
				saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
			},
			Buffer.from(headers['KALSHI-ACCESS-SIGNATURE'] ?? '', 'base64'),
		);
		expect(valid).toBe(true);
	});

	it('leaves the query string out of the signature but still sends it', async () => {
		await makeKalshiRequest('/portfolio/orders', credentials(), {
			query: { limit: 5, status: 'resting' },
		});

		const { headers, options } = lastCall();
		expect(options.query).toEqual({ limit: 5, status: 'resting' });
		const signedString = `${headers['KALSHI-ACCESS-TIMESTAMP']}GET/trade-api/v2/portfolio/orders`;
		const valid = crypto.verify(
			'sha256',
			Buffer.from(signedString),
			{
				key: rsa.publicKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
				saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
			},
			Buffer.from(headers['KALSHI-ACCESS-SIGNATURE'] ?? '', 'base64'),
		);
		expect(valid).toBe(true);
	});

	it('uses the demo base URL for the demo environment', async () => {
		await makeKalshiRequest('/exchange/status', credentials('demo'));
		expect(lastCall().config.BASE).toBe(KALSHI_API_BASES.demo);
		expect(KALSHI_API_BASES.demo).toContain('demo.kalshi.co');
	});

	it('uses the production base URL for the production environment', async () => {
		await makeKalshiRequest('/exchange/status', credentials('production'));
		expect(lastCall().config.BASE).toBe(KALSHI_API_BASES.production);
	});

	it('only sends a body on POST, PUT and PATCH', async () => {
		await makeKalshiRequest('/portfolio/events/orders', credentials(), {
			method: 'POST',
			body: { ticker: 'T' },
		});
		expect(lastCall().options.body).toEqual({ ticker: 'T' });

		jest.clearAllMocks();
		await makeKalshiRequest('/portfolio/events/orders/abc', credentials(), {
			method: 'DELETE',
			body: { ignored: true },
		});
		expect(lastCall().options.body).toBeUndefined();
	});

	it('produces a fresh signature for every call', async () => {
		await makeKalshiRequest('/exchange/status', credentials());
		const first = lastCall().headers['KALSHI-ACCESS-SIGNATURE'];
		jest.clearAllMocks();
		await new Promise((resolve) => setTimeout(resolve, 5));
		await makeKalshiRequest('/exchange/status', credentials());
		const second = lastCall().headers['KALSHI-ACCESS-SIGNATURE'];

		expect(first).not.toBe(second);
	});

	it('wraps an ApiError and keeps its status for the 429 handler', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/exchange/status' },
				{
					url: 'u',
					status: 429,
					statusText: 'Too Many Requests',
					body: { error: 'too many requests' },
				} as never,
				'Too Many Requests',
			),
		);

		const error = await makeKalshiRequest(
			'/exchange/status',
			credentials(),
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(KalshiAPIError);
		expect((error as KalshiAPIError).status).toBe(429);
	});
});

describe('parseKalshiCredentials', () => {
	it('defaults the environment to production', () => {
		const parsed = parseKalshiCredentials(
			JSON.stringify({ keyId: 'k', privateKey: 'p' }),
		);
		expect(parsed.environment).toBe('production');
	});

	it('turns literal \\n sequences in a pasted PEM into real newlines', () => {
		const parsed = parseKalshiCredentials(
			JSON.stringify({ keyId: 'k', privateKey: 'line1\\nline2' }),
		);
		expect(parsed.privateKey).toBe('line1\nline2');
	});

	it('rejects credentials that are missing the private key', () => {
		expect(() =>
			parseKalshiCredentials(JSON.stringify({ keyId: 'k' })),
		).toThrow(/Invalid Kalshi credentials/);
	});

	it('rejects text that is not JSON', () => {
		expect(() => parseKalshiCredentials('just-a-token')).toThrow(
			/Invalid Kalshi credentials/,
		);
	});
});
