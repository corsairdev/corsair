import { resetShotstackEnvironmentCache } from './client';
import { shotstack } from './index';
import {
	CALLBACK_OWNER,
	callbackHeaders,
	renderCallback,
	serveCallback,
	sourceCallback,
} from './test-fixtures';
import {
	isShotstackDelivery,
	shotstackWebhookIdOf,
	shotstackWebhooksNested,
} from './webhooks';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function ctx(options: Record<string, unknown> = {}, key = 'stage-key') {
	return { key, options: { environment: 'stage', ...options } } as never;
}

// unknown: the payload is whatever the sender posted.
function delivery(eventType: string, payload: unknown, extra = {}) {
	return {
		headers: callbackHeaders(eventType),
		payload,
		...extra,
	} as never;
}

const renderFromApi = {
	success: true,
	message: 'OK',
	response: {
		id: renderCallback.id,
		owner: CALLBACK_OWNER,
		status: 'done',
		url: 'https://shotstack-api-stage-output.s3.ap-southeast-2.amazonaws.com/real.jpg',
		error: '',
	},
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	resetShotstackEnvironmentCache();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('matching', () => {
	it.each([
		['render', renderCallback],
		['source', sourceCallback],
		['serve', serveCallback],
	] as const)('routes a %s callback by its event-type header', (id, body) => {
		const raw = { headers: callbackHeaders(id), body };
		expect(shotstackWebhookIdOf(raw)).toBe(id);
		expect(isShotstackDelivery(raw)).toBe(true);
		for (const other of ['render', 'source', 'serve'] as const) {
			expect(shotstackWebhooksNested[other].match(raw)).toBe(other === id);
		}
	});

	it('falls back to the body type when only the user agent says Shotstack', () => {
		const raw = {
			headers: { 'user-agent': 'Shotstack-Webhook/1.0' },
			body: JSON.stringify(sourceCallback),
		};
		expect(shotstackWebhookIdOf(raw)).toBe('source');
	});

	it('ignores other senders', () => {
		expect(isShotstackDelivery({ headers: {}, body: renderCallback })).toBe(
			false,
		);
		expect(
			isShotstackDelivery({
				headers: { 'x-shotstack-event-type': 'something-else' },
				body: {},
			}),
		).toBe(false);
	});
});

describe('render callback', () => {
	it('checks the render with the API and answers with its status and URL', async () => {
		respond(renderFromApi);
		const result = await shotstackWebhooksNested.render.handler(
			ctx(),
			delivery('render', renderCallback),
		);
		expect(result).toMatchObject({
			success: true,
			data: {
				id: renderCallback.id,
				status: 'done',
				url: renderFromApi.response.url,
				error: null,
			},
		});
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			`https://api.shotstack.io/edit/stage/render/${renderCallback.id}?data=false`,
		);
	});

	it('replaces a forged status with the one the API reports', async () => {
		respond({
			...renderFromApi,
			response: {
				...renderFromApi.response,
				status: 'failed',
				error: 'Bad asset',
			},
		});
		const result = await shotstackWebhooksNested.render.handler(
			ctx(),
			delivery('render', renderCallback),
		);
		expect(result).toMatchObject({
			success: true,
			data: { status: 'failed', error: 'Bad asset' },
		});
	});

	it('refuses a callback for a render the account does not have', async () => {
		respond({ success: false, message: 'Render not found', response: {} }, 404);
		const result = await shotstackWebhooksNested.render.handler(
			ctx(),
			delivery('render', renderCallback),
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('refuses a callback that names another account', async () => {
		respond({
			...renderFromApi,
			response: { ...renderFromApi.response, owner: 'someoneelse' },
		});
		const result = await shotstackWebhooksNested.render.handler(
			ctx(),
			delivery('render', renderCallback),
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('asks Shotstack to resend when the check itself fails', async () => {
		respond({ message: 'down' }, 503);
		const result = await shotstackWebhooksNested.render.handler(
			ctx(),
			delivery('render', renderCallback),
		);
		expect(result).toMatchObject({ success: false, statusCode: 503 });
	});

	it('refuses a callback when there is no key to check it with', async () => {
		const result = await shotstackWebhooksNested.render.handler(
			ctx({}, ''),
			delivery('render', renderCallback),
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a body that is not a render callback', async () => {
		const result = await shotstackWebhooksNested.render.handler(
			ctx(),
			delivery('render', { type: 'edit', action: 'render' }),
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('skips the check when the Hub verified the delivery or verifyWebhooks is false', async () => {
		for (const [options, extra] of [
			[{}, { hubVerified: true }],
			[{ verifyWebhooks: false }, {}],
		] as const) {
			const result = await shotstackWebhooksNested.render.handler(
				ctx(options),
				delivery('render', renderCallback, extra),
			);
			expect(result).toMatchObject({ success: true, data: renderCallback });
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('source and serve callbacks', () => {
	it('checks a source with the Ingest API and reads its file URL', async () => {
		respond({
			data: {
				type: 'source',
				id: sourceCallback.id,
				attributes: {
					id: sourceCallback.id,
					owner: CALLBACK_OWNER,
					status: 'ready',
					source: 'https://example.com/real-source.jpg',
				},
			},
		});
		const result = await shotstackWebhooksNested.source.handler(
			ctx(),
			delivery('source', sourceCallback),
		);
		expect(result).toMatchObject({
			success: true,
			data: { status: 'ready', url: 'https://example.com/real-source.jpg' },
		});
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			`https://api.shotstack.io/ingest/stage/sources/${sourceCallback.id}`,
		);
	});

	it('checks a hosted copy with the Serve API', async () => {
		respond({
			data: {
				type: 'asset',
				attributes: {
					id: serveCallback.id,
					owner: CALLBACK_OWNER,
					status: 'ready',
					url: serveCallback.url,
					renderId: serveCallback.render,
				},
			},
		});
		const result = await shotstackWebhooksNested.serve.handler(
			ctx(),
			delivery('serve', serveCallback),
		);
		expect(result).toMatchObject({
			success: true,
			data: { status: 'ready', render: serveCallback.render },
		});
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			`https://api.shotstack.io/serve/stage/assets/${serveCallback.id}`,
		);
	});
});

describe('plugin wiring', () => {
	it('matches Shotstack deliveries at the plugin level', () => {
		const plugin = shotstack();
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: callbackHeaders('render'),
				body: renderCallback,
			}),
		).toBe(true);
	});
});
