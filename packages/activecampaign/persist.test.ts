import { z } from 'zod';
import { evictRow, persistRow, persistRows } from './endpoints/persist';

/**
 * The caching rules, tested directly.
 *
 * These are the behaviours a reviewer cannot verify by reading the endpoint
 * files, because the endpoints delegate to these helpers: an unrecognised row
 * is skipped rather than stored, a skip is audible, a mirror failure never
 * fails the call, and only an explicit delete evicts.
 */

const Entity = z
	.object({ id: z.string(), name: z.string().nullable().optional() })
	.loose();

interface FakeStore {
	rows: Map<string, Record<string, unknown>>;
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
}

function makeStore(options: { failWrites?: boolean } = {}): FakeStore {
	const rows = new Map<string, Record<string, unknown>>();
	return {
		rows,
		upsertByEntityId: jest.fn(
			async (id: string, data: Record<string, unknown>) => {
				if (options.failWrites) throw new Error('database unavailable');
				rows.set(id, data);
				return data;
			},
		),
		deleteByEntityId: jest.fn(async (id: string) => {
			if (options.failWrites) throw new Error('database unavailable');
			rows.delete(id);
			return true;
		}),
	};
}

describe('persistRow', () => {
	let warn: jest.SpyInstance;

	beforeEach(() => {
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('writes a row that matches the entity schema', async () => {
		const store = makeStore();
		await persistRow(store, Entity, { id: '7', name: 'kept' }, 'thing');
		expect(store.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(store.rows.get('7')).toMatchObject({ id: '7', name: 'kept' });
	});

	it('skips a row that does not match, and says so', async () => {
		const store = makeStore();
		await persistRow(store, Entity, { name: 'no id here' }, 'thing');
		expect(store.upsertByEntityId).not.toHaveBeenCalled();
		expect(warn).toHaveBeenCalledTimes(1);
		expect(String(warn.mock.calls[0][0])).toContain('thing');
	});

	it('skips a row whose id is not a usable string', async () => {
		const Numeric = z.object({ id: z.union([z.string(), z.number()]) }).loose();
		const store = makeStore();
		await persistRow(store, Numeric, { id: 5 }, 'thing');
		expect(store.upsertByEntityId).not.toHaveBeenCalled();
		expect(warn).toHaveBeenCalled();
	});

	/**
	 * A mirror is a convenience. Losing it must never fail the API call the
	 * caller actually made.
	 */
	it('does not throw when the store write fails', async () => {
		const store = makeStore({ failWrites: true });
		await expect(
			persistRow(store, Entity, { id: '7' }, 'thing'),
		).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalled();
	});

	it('does nothing when there is no store for the entity', async () => {
		await expect(
			persistRow(undefined, Entity, { id: '7' }, 'thing'),
		).resolves.toBeUndefined();
		expect(warn).not.toHaveBeenCalled();
	});

	it.each([[null], [undefined]])('ignores a %s row', async (row) => {
		const store = makeStore();
		await persistRow(store, Entity, row, 'thing');
		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});
});

describe('persistRows', () => {
	let warn: jest.SpyInstance;
	beforeEach(() => {
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('writes every valid row in a page', async () => {
		const store = makeStore();
		const rows = Array.from({ length: 40 }, (_, i) => ({ id: String(i) }));
		await persistRows(store, Entity, rows, 'thing');
		expect(store.upsertByEntityId).toHaveBeenCalledTimes(40);
		expect(store.rows.size).toBe(40);
	});

	/**
	 * One bad row in a page must not cost the other rows - that would turn a
	 * schema gap into silent data loss across the whole page.
	 */
	it('keeps the good rows when one row is invalid', async () => {
		const store = makeStore();
		await persistRows(
			store,
			Entity,
			[{ id: '1' }, { name: 'broken' }, { id: '3' }],
			'thing',
		);
		expect(store.rows.size).toBe(2);
		expect([...store.rows.keys()].sort()).toEqual(['1', '3']);
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it.each([[[]], [null], [undefined], ['not an array']])(
		'ignores a non-array page: %s',
		async (rows) => {
			const store = makeStore();
			await persistRows(store, Entity, rows, 'thing');
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		},
	);

	it('bounds concurrency rather than opening one write per row', async () => {
		let inFlight = 0;
		let peak = 0;
		const store = {
			upsertByEntityId: jest.fn(async () => {
				inFlight++;
				peak = Math.max(peak, inFlight);
				await new Promise((r) => setTimeout(r, 1));
				inFlight--;
			}),
			deleteByEntityId: jest.fn(),
		};
		const rows = Array.from({ length: 100 }, (_, i) => ({ id: String(i) }));
		await persistRows(store, Entity, rows, 'thing');
		expect(store.upsertByEntityId).toHaveBeenCalledTimes(100);
		expect(peak).toBeLessThanOrEqual(16);
	});
});

describe('evictRow', () => {
	let warn: jest.SpyInstance;
	beforeEach(() => {
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('removes the row from the mirror', async () => {
		const store = makeStore();
		await persistRow(store, Entity, { id: '7' }, 'thing');
		await evictRow(store, '7', 'thing');
		expect(store.deleteByEntityId).toHaveBeenCalledWith('7');
		expect(store.rows.has('7')).toBe(false);
	});

	it('does not throw when the eviction fails', async () => {
		const store = makeStore({ failWrites: true });
		await expect(evictRow(store, '7', 'thing')).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalled();
	});

	it('does nothing without a store or an id', async () => {
		const store = makeStore();
		await evictRow(undefined, '7', 'thing');
		await evictRow(store, '', 'thing');
		expect(store.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('tolerates a store that cannot delete', async () => {
		const store = { upsertByEntityId: jest.fn() };
		await expect(evictRow(store, '7', 'thing')).resolves.toBeUndefined();
	});
});
