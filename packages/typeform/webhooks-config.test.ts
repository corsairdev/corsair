/**
 * `webhooksConfigDelete` must remove the local `webhookConfigs` row.
 *
 * The delete pre-fetched the row with `search()` and then passed the result's
 * `id` to `deleteByEntityId()`. `search()` returns `CorsairEntity` rows, where
 * `id` is the internal row UUID and `entity_id` is the entity key that the
 * upserts stored (`list`/`get`/`createOrUpdate` all key by the webhook's own
 * id). `deleteByEntityId` matches on `entity_id`, so the UUID matched nothing
 * and the delete was a silent no-op: deleted webhooks stayed in the local store
 * forever. Passing `entity_id` is the field the store is keyed by, and matches
 * what `packages/zoom/endpoints/recordings.ts` does for the same pattern.
 *
 * Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import { deleteWebhookConfig } from './endpoints/webhooks-config';

/**
 * The factory omits `requireActual`: the built `corsair/core` is ESM and jest
 * cannot transform a package outside its own transform patterns, so loading the
 * real module only to replace one export fails the suite before any assertion.
 */
jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof deleteWebhookConfig>[0];

/**
 * A store whose `search` returns a real `CorsairEntity` row: the internal UUID
 * and the entity key are different values, which is what the bug turned on.
 */
function makeCtx() {
	const ROW_UUID = '8f3d1c2a-0000-4000-8000-000000000001';
	const ENTITY_ID = 'wh_abc123';

	const webhookConfigs = {
		search: jest.fn(async () => [
			{
				id: ROW_UUID,
				entity_id: ENTITY_ID,
				entity_type: 'webhookConfigs',
				account_id: 'acct_1',
				version: '1',
				created_at: new Date(0),
				updated_at: new Date(0),
				data: { id: ENTITY_ID, tag: 'orders', form_id: 'frm1' },
			},
		]),
		deleteByEntityId: jest.fn(async () => true),
	};

	const ctx = {
		key: 'test-typeform-token',
		options: { accountId: 'acct_1' },
		db: { webhookConfigs },
	} as unknown as Ctx;

	return { ctx, webhookConfigs, ROW_UUID, ENTITY_ID };
}

let lastUrl = '';
let lastMethod = '';

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({}),
			text: async () => '{}',
		};
	}) as unknown as typeof global.fetch;
});

it('deletes the local row by the entity key, not the internal UUID', async () => {
	const { ctx, webhookConfigs, ROW_UUID, ENTITY_ID } = makeCtx();

	await deleteWebhookConfig(ctx, { form_id: 'frm1', tag: 'orders' });

	expect(lastMethod).toBe('DELETE');
	expect(lastUrl).toContain('/forms/frm1/webhooks/orders');
	expect(webhookConfigs.deleteByEntityId).toHaveBeenCalledTimes(1);
	expect(webhookConfigs.deleteByEntityId).toHaveBeenCalledWith(ENTITY_ID);
	// The UUID is the value the store cannot match on; keep it out of the call
	// so a regression that reintroduces `existing[0]?.id` fails here.
	expect(webhookConfigs.deleteByEntityId).not.toHaveBeenCalledWith(ROW_UUID);
});

it('still deletes when the pre-fetch finds the row by tag and form', async () => {
	const { ctx, webhookConfigs } = makeCtx();

	await deleteWebhookConfig(ctx, { form_id: 'frm1', tag: 'orders' });

	expect(webhookConfigs.search).toHaveBeenCalledWith({
		data: { tag: 'orders', form_id: 'frm1' },
	});
	expect(mockLogEvent).toHaveBeenCalledWith(
		ctx,
		'typeform.webhooksConfig.delete',
		{ form_id: 'frm1', tag: 'orders' },
		'completed',
	);
});
