import { ApiError } from 'corsair/http';
import {
	omnisendEndpointsNested as api,
	omnisendEndpointMeta,
} from './endpoints/catalog';
import type { OmnisendContext } from './index';

// Routes, headers and shapes written by hand from Omnisend's API reference
// (api-docs.omnisend.com, version 2026-03-15), not read from the manifest.

type Captured = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or a FormData.
	body: unknown;
};
let calls: Captured[] = [];

function reply(
	// `unknown` because each case answers its own body.
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: new URL(String(input)),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		return new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'omnisend-test-key',
	options: {},
	keys: {},
	db: {},
	// `unknown` because a test context fills only the fields the endpoints read.
} as unknown as OmnisendContext;

beforeEach(() => {
	calls = [];
});
afterEach(() => jest.restoreAllMocks());

describe('omnisend requests', () => {
	it('sends the API key and the pinned version on every call', async () => {
		reply({
			contacts: [{ contactID: '6650a1b2c3d4e5f6a7b8c9d0' }],
			paging: { limit: 2, hasMore: true, cursors: { after: 'eyJpZCI6MX0' } },
		});
		const out = await api.contacts.list(ctx, { limit: 2, after: 'abc' });
		expect(out).toMatchObject({ paging: { hasMore: true } });
		expect(calls[0]?.method).toBe('GET');
		expect(`${calls[0]?.url.origin}${calls[0]?.url.pathname}`).toBe(
			'https://api.omnisend.com/api/contacts',
		);
		expect(calls[0]?.url.searchParams.get('limit')).toBe('2');
		expect(calls[0]?.url.searchParams.get('after')).toBe('abc');
		expect(calls[0]?.headers.authorization).toBe(
			'Omnisend-API-Key omnisend-test-key',
		);
		expect(calls[0]?.headers['omnisend-version']).toBe('2026-03-15');
	});

	it('queues tags for contacts by email and reads the empty 202', async () => {
		reply(undefined, 202);
		const out = await api.contacts.addTags(ctx, {
			emails: ['ada@example.com'],
			tags: ['vip'],
		});
		expect(out).toEqual({ success: true });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe('/api/contacts/tags');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			emails: ['ada@example.com'],
			tags: ['vip'],
		});
	});

	it('removes tags with DELETE and a JSON body', async () => {
		reply(undefined, 202);
		await api.contacts.removeTags(ctx, {
			segmentID: '6650a1b2c3d4e5f6a7b8c9d1',
			tags: ['vip'],
		});
		expect(calls[0]?.method).toBe('DELETE');
		expect(calls[0]?.url.pathname).toBe('/api/contacts/tags');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			segmentID: '6650a1b2c3d4e5f6a7b8c9d1',
			tags: ['vip'],
		});
	});

	it('sends a campaign by id', async () => {
		reply({ campaignID: '6650a1b2c3d4e5f6a7b8c9d0', status: 'inProgress' });
		await api.campaigns.send(ctx, { id: '6650a1b2c3d4e5f6a7b8c9d0' });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe(
			'/api/campaigns/6650a1b2c3d4e5f6a7b8c9d0/send',
		);
	});

	it('uses the product id the caller chose in the path', async () => {
		reply(undefined, 204);
		await api.products.delete(ctx, { productID: 'prod 1001/a' });
		expect(calls[0]?.method).toBe('DELETE');
		expect(calls[0]?.url.pathname).toBe('/api/products/prod%201001%2Fa');
	});

	it('uploads an image file as multipart form data', async () => {
		reply({ imageID: 'img-1', url: 'https://cdn.example.com/a.png' }, 201);
		await api.images.upload(ctx, {
			file: {
				base64: Buffer.from('png').toString('base64'),
				filename: 'a.png',
				contentType: 'image/png',
			},
			name: 'Logo',
		});
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe('/api/images/upload');
		expect(calls[0]?.body).toBeInstanceOf(FormData);
		const form = calls[0]?.body as FormData;
		expect(form.get('name')).toBe('Logo');
		expect(form.get('file')).toBeInstanceOf(Blob);
	});

	it('throws core ApiError with the RFC 9457 detail and without the sent email', async () => {
		reply(
			{
				type: 'about:blank',
				title: 'Bad Request',
				status: 400,
				detail: 'contact ada@example.com has an invalid phone',
				errors: [{ field: 'phone', message: 'invalid' }],
			},
			400,
			'application/problem+json',
		);
		const call = api.contacts.upsert(ctx, {
			identifiers: [{ type: 'email', id: 'ada@example.com' }],
		});
		await expect(call).rejects.toBeInstanceOf(ApiError);
		await call.catch((error: ApiError) => {
			expect(error.status).toBe(400);
			expect(error.message).toContain('invalid phone');
			expect(error.message).not.toContain('ada@example.com');
		});
	});
});

describe('omnisend risk levels', () => {
	it('marks sending and messaging operations destructive', () => {
		for (const id of [
			'campaigns.send',
			'campaigns.sendTestEmail',
			'campaigns.selectAbTestWinner',
			'campaigns.resumeAbTest',
			'automations.enable',
			'automations.sendBlockTestEmail',
			'events.send',
		] as const) {
			expect(omnisendEndpointMeta[id].riskLevel).toBe('destructive');
		}
		expect(omnisendEndpointMeta['campaigns.send'].irreversible).toBe(true);
	});

	it('keeps renders and reports read-only', () => {
		for (const id of [
			'templates.render',
			'emailContent.render',
			'forms.render',
			'analytics.generateReport',
			'events.queryMetadata',
		] as const) {
			expect(omnisendEndpointMeta[id].riskLevel).toBe('read');
		}
	});

	it('follows a batch to its end with batches.get', () => {
		expect(omnisendEndpointMeta['batches.create']).toMatchObject({
			job: {
				idPath: 'batchID',
				status: { op: 'batches.get', idArg: 'batchID', done: ['finished'] },
			},
		});
	});
});
