import { createHmac } from 'node:crypto';
import { processWebhook, resolveTenantIdFromWebhookLink } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { fluxguard } from './index';
import { changeEvent } from './test-fixtures';
import { matchFluxguardTenantWebhook } from './webhooks/tenant-matcher';
import { FLUXGUARD_SIGNATURE_HEADER } from './webhooks/types';

const SECRET = 'whsec-fluxguard-integration-secret';
const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

function signedHeaders(
	body: string,
	secret = SECRET,
	timestamp = Math.floor(Date.now() / 1000),
) {
	const signature = createHmac('sha256', secret)
		.update(`${timestamp}.${body}`)
		.digest('hex');
	return { [FLUXGUARD_SIGNATURE_HEADER]: `t=${timestamp},v1=${signature}` };
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'fluxguard', 'default');
	const corsair = createCorsair({
		plugins: [fluxguard({ key: 'fg-test-key', webhookSecret: SECRET })],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

jest.spyOn(console, 'error').mockImplementation(() => undefined);

/**
 * These run the real `processWebhook`, because the failure path is what the
 * docs example depends on: core answers `{ success: true }` for a returned
 * `success: false` and keeps only a thrown error, so only an end-to-end check
 * proves a forged delivery is reported as failed.
 */
describe('Fluxguard change webhook through processWebhook', () => {
	it('routes a correctly signed delivery to change.detected', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(corsair, signedHeaders(body), body);

			expect(result.plugin).toBe('fluxguard');
			expect(result.action).toBe('change.detected');
			expect(result.response).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a delivery signed with the wrong secret as a failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(
				corsair,
				signedHeaders(body, 'whsec-wrong-secret'),
				body,
			);

			// The plugin still claims the route (the header is present), but the
			// handler throws, so the route can answer non-2xx instead of 200.
			expect(result.response).toMatchObject({
				success: false,
				error: 'Invalid webhook signature',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a tampered body as a failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const signedBody = JSON.stringify(changeEvent);
			const tamperedBody = JSON.stringify({
				...changeEvent,
				url: 'https://attacker.test/',
			});

			const result = await processWebhook(
				corsair,
				signedHeaders(signedBody),
				tamperedBody,
			);

			expect(result.response).toMatchObject({
				success: false,
				error: 'Invalid webhook signature',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a correctly signed but malformed payload as a failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify({ url: 42, capturedAt: 'not-a-date' });

			const result = await processWebhook(corsair, signedHeaders(body), body);

			expect(result.response).toMatchObject({
				success: false,
				error: 'Invalid Fluxguard change payload',
			});
		} finally {
			testDb.cleanup();
		}
	});
});

/**
 * The docs tell users to store the webhook's secret with
 * `keys.set_webhook_signature`. These run without the `webhookSecret` option
 * and through the real key manager, so they prove the stored secret is the one
 * the handler verifies with.
 */
describe('Fluxguard change webhook with a stored secret', () => {
	async function createStoredSecretClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'fluxguard', 'default');
		const corsair = createCorsair({
			plugins: [fluxguard({ key: 'fg-test-key' })],
			database: testDb.db,
			kek: KEK,
		});
		await corsair.fluxguard.keys.issue_new_dek();
		return { corsair, testDb };
	}

	it('accepts a delivery signed with the stored secret', async () => {
		const { corsair, testDb } = await createStoredSecretClient();
		try {
			await corsair.fluxguard.keys.set_webhook_signature(SECRET);
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(corsair, signedHeaders(body), body);

			expect(result.action).toBe('change.detected');
			expect(result.response).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects a delivery signed with any other secret', async () => {
		const { corsair, testDb } = await createStoredSecretClient();
		try {
			await corsair.fluxguard.keys.set_webhook_signature(SECRET);
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(
				corsair,
				signedHeaders(body, 'whsec-wrong-secret'),
				body,
			);

			expect(result.response).toMatchObject({
				success: false,
				error: 'Invalid webhook signature',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects an unsigned delivery', async () => {
		const { corsair, testDb } = await createStoredSecretClient();
		try {
			await corsair.fluxguard.keys.set_webhook_signature(SECRET);

			const result = await processWebhook(
				corsair,
				{},
				JSON.stringify(changeEvent),
			);

			expect(result.plugin).toBe('fluxguard');
			expect(result.response).toMatchObject({
				success: false,
				error: `Missing or malformed ${FLUXGUARD_SIGNATURE_HEADER} header`,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects every delivery while no secret is stored', async () => {
		const { corsair, testDb } = await createStoredSecretClient();
		try {
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(corsair, signedHeaders(body), body);

			expect(result.response).toMatchObject({ success: false });
			expect(String(result.response?.error)).toContain(
				'No Fluxguard webhook secret is set',
			);
		} finally {
			testDb.cleanup();
		}
	});
});

/**
 * With `multiTenancy`, `processWebhook` takes the tenant from `query.tenantId`
 * and falls back to `default`; only Hub looks a tenant up by `orgId`, and only
 * once the org id was stored with `keys.set_tenant_external_id`.
 */
describe('Fluxguard change webhook with tenants', () => {
	async function createTenantClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'fluxguard', 'acme');
		const corsair = createCorsair({
			plugins: [fluxguard({ key: 'fg-test-key' })],
			database: testDb.db,
			kek: KEK,
			multiTenancy: true,
		});
		const tenant = corsair.withTenant('acme');
		await tenant.fluxguard.keys.issue_new_dek();
		await tenant.fluxguard.keys.set_webhook_signature(SECRET);
		return { corsair, tenant, testDb };
	}

	it('verifies with the secret of the tenant named in the query', async () => {
		const { corsair, testDb } = await createTenantClient();
		try {
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(corsair, signedHeaders(body), body, {
				tenantId: 'acme',
			});

			expect(result.response).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('fails closed when the route names no tenant', async () => {
		const { corsair, testDb } = await createTenantClient();
		try {
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(corsair, signedHeaders(body), body);

			// No tenant means `default`, which has no stored secret.
			expect(result.response).toMatchObject({ success: false });
			expect(String(result.response?.error)).toContain(
				'No Fluxguard webhook secret is set',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('resolves the tenant from orgId once the org id is stored', async () => {
		const { tenant, testDb } = await createTenantClient();
		try {
			const match = matchFluxguardTenantWebhook({
				headers: {},
				body: JSON.stringify(changeEvent),
			});
			expect(match).toEqual({
				linkType: 'tenant_external_id',
				externalId: changeEvent.orgId,
			});
			const lookup = {
				database: testDb.database,
				kek: KEK,
				pluginId: 'fluxguard',
				linkType: match!.linkType,
				externalId: match!.externalId,
			};

			await expect(resolveTenantIdFromWebhookLink(lookup)).resolves.toBeNull();

			await tenant.fluxguard.keys.set_tenant_external_id(changeEvent.orgId);

			await expect(resolveTenantIdFromWebhookLink(lookup)).resolves.toBe(
				'acme',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
