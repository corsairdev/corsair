/**
 * The local cache is best effort: a provider call must still succeed when the
 * mirror cannot be written. These tests pin that contract, including the
 * consequence that a failed eviction leaves a stale record behind.
 */
import {
	cacheClient,
	cacheProject,
	cacheTag,
	cacheWorkspace,
	evictEntity,
} from './endpoints/persist';

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

let warn: jest.SpyInstance;

beforeEach(() => {
	warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('cache writes', () => {
	it('maps the client wid onto workspace_id', async () => {
		const store = makeStore();
		await cacheClient(store, { id: 7, wid: 42, name: 'Acme' });
		expect(store.upsertByEntityId).toHaveBeenCalledWith(
			'7',
			expect.objectContaining({ workspace_id: 42, name: 'Acme' }),
		);
	});

	it('keys the row on the entity id as a string', async () => {
		const store = makeStore();
		await cacheTag(store, { id: 9, workspace_id: 1, name: 'billable' });
		expect(store.upsertByEntityId.mock.calls[0]?.[0]).toBe('9');
	});

	it('skips writing when there is no record', async () => {
		const store = makeStore();
		await cacheProject(store, null);
		await cacheWorkspace(store, undefined);
		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('skips writing when the entity is not configured', async () => {
		// A consumer may register the plugin without the optional entities.
		await expect(
			cacheClient(undefined, { id: 1, wid: 1, name: 'Acme' }),
		).resolves.toBeUndefined();
	});
});

describe('cache failures are swallowed', () => {
	it('does not reject when an upsert fails', async () => {
		const store = makeStore();
		store.upsertByEntityId.mockRejectedValueOnce(new Error('db offline'));

		await expect(
			cacheClient(store, { id: 1, wid: 1, name: 'Acme' }),
		).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalled();
	});

	it('warns once per failed entity in a batch', async () => {
		const store = makeStore();
		store.upsertByEntityId.mockRejectedValue(new Error('db offline'));

		await cacheProject(store, { id: 1, workspace_id: 1, name: 'A' });
		await cacheProject(store, { id: 2, workspace_id: 1, name: 'B' });
		expect(warn).toHaveBeenCalledTimes(2);
	});

	it('does not reject when an eviction fails, leaving the row stale', async () => {
		const store = makeStore();
		store.deleteByEntityId.mockRejectedValueOnce(new Error('db offline'));

		await expect(evictEntity(store, 5, 'client')).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalled();
		// The record was never removed, so a later read still sees it. This is
		// the accepted trade-off: a stale mirror rather than a failed API call.
		expect(store.deleteByEntityId).toHaveBeenCalledWith('5');
	});

	it('is a no-op when the store cannot delete', async () => {
		await expect(
			evictEntity({ deleteByEntityId: undefined }, 5, 'client'),
		).resolves.toBeUndefined();
		expect(warn).not.toHaveBeenCalled();
	});
});
