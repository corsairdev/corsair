import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { moneybirdOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { moneybird } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof moneybird>): KeyBuilder {
	// `unknown` because the key builder's real context type is wider than what these cases build.
	return plugin.keyBuilder as unknown as KeyBuilder;
}

function apiError(status: number, method = 'GET'): ApiError {
	return new ApiError(
		{ method: method as 'GET', url: '/{administration_id}/projects/{id}.json' },
		{
			url: 'https://moneybird.com/api/v2/{administration_id}/projects/{id}.json',
			ok: false,
			status,
			statusText: 'x',
			body: {},
		},
		`Moneybird ${status}`,
	);
}

describe('moneybird plugin', () => {
	it('registers every operation with meta and schemas', () => {
		const plugin = moneybird();
		expect(plugin.id).toBe('moneybird');
		const ids = moneybirdOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(ids).toHaveLength(298);
		expect(plugin.endpoints?.contacts.contactPeople.create).toEqual(
			expect.any(Function),
		);
		expect(plugin.endpoints?.salesInvoices.send).toEqual(expect.any(Function));
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['administration_id'] },
		});
	});

	it('keeps the names the first version of the plugin used', () => {
		const ids = new Set(moneybirdOperations.map((o) => o.id));
		for (const group of ['contacts', 'timeEntries', 'products', 'projects']) {
			for (const verb of ['list', 'get', 'create', 'update', 'delete']) {
				expect(ids.has(`${group}.${verb}`)).toBe(true);
			}
		}
		for (const verb of ['list', 'get', 'create', 'update', 'send', 'delete']) {
			expect(ids.has(`salesInvoices.${verb}`)).toBe(true);
		}
		expect(ids.has('administrations.list')).toBe(true);
	});

	it('marks sends, money and deletes destructive and reads read', () => {
		const meta = moneybird().endpointMeta as Record<
			string,
			{ riskLevel: string }
		>;
		for (const id of [
			'salesInvoices.send',
			'salesInvoices.sendReminders',
			'estimates.send',
			'contacts.paymentsMandate.request',
			'subscriptions.create',
			'recurringSalesInvoices.create',
			'purchaseTransactionBatches.createFromSepaFile',
			'contacts.delete',
			'webhooks.delete',
		]) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'destructive']);
		}
		for (const id of [
			'contacts.list',
			'salesInvoices.downloadPdf',
			'salesInvoices.fetchByIds',
			'downloads.download',
			'reports.profitLoss',
		]) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'read']);
		}
		for (const id of ['contacts.create', 'salesInvoices.create']) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'write']);
		}
	});

	it('prefers the key from options', async () => {
		const plugin = moneybird({ key: 'opt-key' });
		await expect(keyBuilderOf(plugin)({}, 'endpoint')).resolves.toBe('opt-key');
	});

	it('reads the stored key', async () => {
		const plugin = moneybird();
		await expect(
			keyBuilderOf(plugin)(
				{ keys: { get_api_key: async () => 'stored' } },
				'endpoint',
			),
		).resolves.toBe('stored');
	});

	it('asks for a connection when no key is stored', async () => {
		const plugin = moneybird();
		await expect(
			keyBuilderOf(plugin)(
				{ keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilderOf(plugin)(
				{
					keys: {
						get_api_key: async () => {
							throw new Error('No DEK found for account');
						},
					},
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keeps a caller DEFAULT handler last', () => {
		const plugin = moneybird({
			errorHandlers: {
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 1 }),
				},
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys).toContain('CUSTOM');
	});
});

describe('error handlers', () => {
	it('does not retry a 429 again (core already did)', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches auth, not found and validation statuses', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(422))).toBe(true);
		// 402: the account limit is reached; no retry clears it.
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(402))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(406))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(500))).toBe(false);
	});

	it('retries a 5xx only for reads', async () => {
		expect(errorHandlers.SERVER_ERROR.match(apiError(502))).toBe(true);
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(502, 'GET')),
		).resolves.toMatchObject({ maxRetries: 2 });
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(502, 'POST')),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
