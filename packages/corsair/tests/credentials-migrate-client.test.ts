import {
	decryptDEK,
	decryptWithDEK,
	encryptDEK,
	encryptWithDEK,
	generateDEK,
} from '../core/auth/encryption';
import {
	buildMigrationPayload,
	generateProdKek,
	MIGRATE_HUB_PATH,
	postMigrationToHub,
} from '../hub/credentials-migrate-client';

const DEV_KEK = 'dev-master-key-with-at-least-32-chars!!';
const PROD_KEK = 'prod-master-key-with-at-least-32-chars!';

describe('generateProdKek', () => {
	it('returns a fresh 256-bit key each call', () => {
		const a = generateProdKek();
		const b = generateProdKek();
		expect(a).not.toBe(b);
		expect(Buffer.from(a, 'base64')).toHaveLength(32);
	});
});

describe('buildMigrationPayload', () => {
	it('re-wraps each row so secrets stay decryptable under the prod KEK', async () => {
		const rawDek = generateDEK();
		const rows = [
			{
				name: 'slack',
				dek: await encryptDEK(rawDek, DEV_KEK),
				config: { bot_token: encryptWithDEK('xoxb-secret', rawDek) },
			},
		];

		const payload = await buildMigrationPayload(rows, DEV_KEK, PROD_KEK);

		expect(payload.integrations).toHaveLength(1);
		const [migrated] = payload.integrations;
		if (!migrated) throw new Error('expected one migrated integration');
		const prodRaw = await decryptDEK(migrated.dek, PROD_KEK);
		expect(decryptWithDEK(migrated.config.bot_token as string, prodRaw)).toBe(
			'xoxb-secret',
		);
	});

	it('skips rows with no DEK (nothing to migrate)', async () => {
		const rawDek = generateDEK();
		const rows = [
			{
				name: 'slack',
				dek: await encryptDEK(rawDek, DEV_KEK),
				config: { bot_token: encryptWithDEK('xoxb-secret', rawDek) },
			},
			{
				name: 'empty',
				dek: null,
				config: { token: encryptWithDEK('unused', rawDek) },
			},
		];

		const payload = await buildMigrationPayload(rows, DEV_KEK, PROD_KEK);

		expect(payload.integrations.map((i) => i.name)).toEqual(['slack']);
		expect(payload.skipped).toEqual([
			{ name: 'empty', reason: 'no stored credentials' },
		]);
	});

	it('skips a row with a DEK but no sealed config — never blanks a prod row', async () => {
		const rawDek = generateDEK();
		const rows = [
			{
				name: 'configured',
				dek: await encryptDEK(rawDek, DEV_KEK),
				config: { bot_token: encryptWithDEK('xoxb-secret', rawDek) },
			},
			{ name: 'blank', dek: await encryptDEK(rawDek, DEV_KEK), config: {} },
		];

		const payload = await buildMigrationPayload(rows, DEV_KEK, PROD_KEK);

		expect(payload.integrations.map((i) => i.name)).toEqual(['configured']);
		expect(payload.skipped).toEqual([
			{ name: 'blank', reason: 'empty config' },
		]);
	});

	it('never leaks a KEK or plaintext secret into the payload', async () => {
		const rawDek = generateDEK();
		const rows = [
			{
				name: 'slack',
				dek: await encryptDEK(rawDek, DEV_KEK),
				config: { bot_token: encryptWithDEK('xoxb-PLAINTEXT-SECRET', rawDek) },
			},
		];

		const serialized = JSON.stringify(
			await buildMigrationPayload(rows, DEV_KEK, PROD_KEK),
		);

		expect(serialized).not.toContain('xoxb-PLAINTEXT-SECRET');
		expect(serialized).not.toContain(DEV_KEK);
		expect(serialized).not.toContain(PROD_KEK);
	});
});

describe('postMigrationToHub', () => {
	const hub = {
		apiUrl: 'https://hub.example',
		projectApiKey: 'ck_dev_test',
		signingSecret: 'signing-secret',
	};
	const realFetch = global.fetch;

	afterEach(() => {
		global.fetch = realFetch;
	});

	function mockFetch(response: {
		ok: boolean;
		status: number;
		body: unknown;
	}): { calls: { url: string; init: RequestInit }[] } {
		const calls: { url: string; init: RequestInit }[] = [];
		global.fetch = ((url: string, init: RequestInit) => {
			calls.push({ url, init });
			return Promise.resolve({
				ok: response.ok,
				status: response.status,
				headers: { get: () => 'application/json' },
				text: () => Promise.resolve(JSON.stringify(response.body)),
			});
		}) as unknown as typeof fetch;
		return { calls };
	}

	it('posts the payload to the migrate path with bearer auth, forwarding it untouched', async () => {
		const { calls } = mockFetch({
			ok: true,
			status: 200,
			body: { ok: true, migrated: 2 },
		});
		const payload = {
			integrations: [{ name: 'slack', dek: 'wrapped', config: { a: 'b' } }],
		};

		const result = await postMigrationToHub({ hub, payload });

		expect(result).toEqual({ ok: true, migrated: 2 });
		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(`https://hub.example${MIGRATE_HUB_PATH}`);
		expect(
			(calls[0]?.init.headers as Record<string, string>).authorization,
		).toBe('Bearer ck_dev_test');
		expect(JSON.parse(calls[0]?.init.body as string)).toEqual(payload);
	});

	it('throws on a non-ok response so the CLI can tell the user to fix prod', async () => {
		mockFetch({ ok: false, status: 409, body: { error: 'no production env' } });
		await expect(
			postMigrationToHub({ hub, payload: { integrations: [] } }),
		).rejects.toThrow();
	});
});
