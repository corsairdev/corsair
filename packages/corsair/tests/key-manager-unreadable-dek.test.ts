import { z } from 'zod';
import { createCorsair } from '../core';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { SEAL_KEY } from '../db/data-at-rest';
import { createCorsairDatabase } from '../db/kysely/database';
import { logEvent } from '../plugins/utils/events';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

// A workspace that moved to a new kek still holds rows whose DEKs were wrapped
// under the old one. Nothing can open those DEKs again.
const OLD_KEK = 'old-kek-from-before-the-cutover!!!';
const NEW_KEK = 'new-kek-after-the-cutover-123456!!';

const contactsSchema = {
	version: '1',
	entities: {
		contacts: z.object({ name: z.string() }),
	},
};

const apollo = {
	id: 'apollo' as const,
	options: { authType: 'api_key' as const },
	schema: contactsSchema,
};

const slack = {
	id: 'slack' as const,
	options: { authType: 'oauth_2' as const },
	schema: contactsSchema,
};

function corsairWith(
	kek: string,
	db: ReturnType<typeof createTestDatabase>['db'],
) {
	return createCorsair({
		kek,
		plugins: [apollo, slack],
		database: db,
		encryptDataAtRest: true,
	});
}

// unknown: the key managers' setters are generated per auth type, and the
// public client type does not expose the integration-level `keys` map.
type Keys = Record<string, (...args: unknown[]) => Promise<unknown>>;
const accountKeys = (corsair: object, app: string): Keys =>
	(corsair as unknown as Record<string, { keys: Keys }>)[app]!.keys;
const integrationKeys = (corsair: object, app: string): Keys =>
	(corsair as unknown as { keys: Record<string, Keys> }).keys[app]!;

describe('a DEK the kek can no longer open', () => {
	let testDb: ReturnType<typeof createTestDatabase>;

	beforeEach(async () => {
		testDb = createTestDatabase();
		const before = corsairWith(OLD_KEK, testDb.db);
		await setupCorsair(before, { silent: true });
		await accountKeys(before, 'apollo').set_api_key!('old-apollo-key');
		await before.apollo.db.contacts.upsertByEntityId('p1', { name: 'Ada' });
		const account = await testDb.db
			.selectFrom('corsair_accounts')
			.innerJoin(
				'corsair_integrations',
				'corsair_integrations.id',
				'corsair_accounts.integration_id',
			)
			.where('corsair_integrations.name', '=', 'apollo')
			.select('corsair_accounts.id')
			.executeTakeFirstOrThrow();
		await logEvent(
			createCorsairDatabase(testDb.db),
			account.id,
			'contact.created',
			{ name: 'Ada' },
			'pending',
			OLD_KEK,
		);
		await integrationKeys(before, 'slack').set_client_id!('old-client');
		await accountKeys(before, 'slack').set_access_token!('old-token');
	});

	afterEach(() => {
		testDb.cleanup();
	});

	async function apolloAccount() {
		return testDb.db
			.selectFrom('corsair_accounts')
			.innerJoin(
				'corsair_integrations',
				'corsair_integrations.id',
				'corsair_accounts.integration_id',
			)
			.where('corsair_integrations.name', '=', 'apollo')
			.select(['corsair_accounts.id', 'corsair_accounts.dek'])
			.executeTakeFirstOrThrow();
	}

	it('a read names the app and asks for a reconnect', async () => {
		const after = corsairWith(NEW_KEK, testDb.db);
		await expect(accountKeys(after, 'apollo').get_api_key!()).rejects.toThrow(
			/apollo.*reconnect/i,
		);
	});

	it('a reconnect stores the new key under a fresh DEK', async () => {
		const after = corsairWith(NEW_KEK, testDb.db);
		const { dek: oldDek } = await apolloAccount();

		await accountKeys(after, 'apollo').set_api_key!('new-apollo-key');

		await expect(accountKeys(after, 'apollo').get_api_key!()).resolves.toBe(
			'new-apollo-key',
		);
		const { dek: newDek } = await apolloAccount();
		expect(newDek).not.toBe(oldDek);
	});

	it('drops the rows sealed under the lost DEK, so reads work again', async () => {
		const after = corsairWith(NEW_KEK, testDb.db);
		const { id } = await apolloAccount();

		await accountKeys(after, 'apollo').set_api_key!('new-apollo-key');

		const sealedLeft = await testDb.db
			.selectFrom('corsair_entities')
			.select('id')
			.where('account_id', '=', id)
			.where('data', 'like', `%${SEAL_KEY}%`)
			.execute();
		expect(sealedLeft).toHaveLength(0);
		const eventsLeft = await testDb.db
			.selectFrom('corsair_events')
			.select('id')
			.where('account_id', '=', id)
			.execute();
		expect(eventsLeft).toHaveLength(0);

		await after.apollo.db.contacts.upsertByEntityId('p2', { name: 'Grace' });
		const listed = await after.apollo.db.contacts.list();
		expect(listed.map((row) => row.data.name)).toEqual(['Grace']);
	});

	it('issue_new_dek starts from an empty config', async () => {
		const after = corsairWith(NEW_KEK, testDb.db);
		await accountKeys(after, 'apollo').issue_new_dek!();
		await expect(
			accountKeys(after, 'apollo').get_api_key!(),
		).resolves.toBeFalsy();
		await accountKeys(after, 'apollo').set_api_key!('new-apollo-key');
		await expect(accountKeys(after, 'apollo').get_api_key!()).resolves.toBe(
			'new-apollo-key',
		);
	});

	it('an integration write replaces an integration DEK it cannot open', async () => {
		const after = corsairWith(NEW_KEK, testDb.db);
		await expect(
			integrationKeys(after, 'slack').get_client_id!(),
		).rejects.toThrow(/slack.*reconnect/i);

		await integrationKeys(after, 'slack').set_client_id!('new-client');
		await expect(
			integrationKeys(after, 'slack').get_client_id!(),
		).resolves.toBe('new-client');

		await accountKeys(after, 'slack').set_access_token!('new-token');
		await expect(accountKeys(after, 'slack').get_access_token!()).resolves.toBe(
			'new-token',
		);
	});

	it('leaves a DEK the kek can open alone', async () => {
		const same = corsairWith(OLD_KEK, testDb.db);
		const { id, dek } = await apolloAccount();

		await accountKeys(same, 'apollo').set_api_key!('rotated-apollo-key');

		const row = await apolloAccount();
		expect(row.dek).toBe(dek);
		const kept = await same.apollo.db.contacts.findByEntityId('p1');
		expect(kept?.data).toEqual({ name: 'Ada' });
		const events = await testDb.db
			.selectFrom('corsair_events')
			.select('id')
			.where('account_id', '=', id)
			.execute();
		expect(events).toHaveLength(1);
	});

	it('never replaces a DEK when no kek is set', async () => {
		const { id, dek } = await apolloAccount();
		const km = createAccountKeyManager({
			authType: 'api_key',
			integrationName: 'apollo',
			tenantId: 'default',
			kek: '',
			database: createCorsairDatabase(testDb.db),
		});

		await expect(km.set_api_key('new-apollo-key')).rejects.toThrow();

		const row = await apolloAccount();
		expect(row.dek).toBe(dek);
		const entities = await testDb.db
			.selectFrom('corsair_entities')
			.select('id')
			.where('account_id', '=', id)
			.execute();
		expect(entities).toHaveLength(1);
	});
});
