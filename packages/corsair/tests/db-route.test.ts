import type { CorsairInternalConfig } from '../core';
import { AuthMissingError } from '../core/auth/errors/auth-missing';
import { managementHandler } from '../core/management';
import {
	callPluginDb,
	decodeDbArgs,
	encodeDbArgs,
} from '../core/management/db';
import { runReadonly } from '../core/permissions';

const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

function fakeCorsair(withTenant: () => unknown): unknown {
	return Object.defineProperty({ withTenant }, CORSAIR_INTERNAL, {
		value: {
			plugins: [{ id: 'slack' }],
			kek: '',
			multiTenancy: true,
		} as unknown as CorsairInternalConfig,
	});
}

describe('encodeDbArgs / decodeDbArgs', () => {
	it('round-trips a Date through JSON', () => {
		const args = [{ data: { created_at: { after: new Date(0) } } }];
		const wire = JSON.parse(JSON.stringify(encodeDbArgs(args)));
		const back = decodeDbArgs(wire) as typeof args;
		expect(back[0]!.data.created_at.after).toBeInstanceOf(Date);
		expect(back[0]!.data.created_at.after.toISOString()).toBe(
			new Date(0).toISOString(),
		);
	});

	it('leaves an ordinary ISO string a string', () => {
		expect(decodeDbArgs([{ note: '2026-01-01T00:00:00.000Z' }])).toEqual([
			{ note: '2026-01-01T00:00:00.000Z' },
		]);
	});

	it('does not revive an object that carries other keys alongside $date', () => {
		expect(decodeDbArgs({ $date: '2026-01-01', tz: 'UTC' })).toEqual({
			$date: '2026-01-01',
			tz: 'UTC',
		});
	});

	it('round-trips user data that is itself shaped like the marker', () => {
		// Every escape depth, not just the first two: the ladder used to run out
		// and rewrite `$$$date` as `$$date`.
		for (const payload of [
			{ meta: { $date: 'Q3' } },
			{ meta: { $date: '2026-01-01' } },
			{ meta: { $$date: 'already escaped' } },
			{ meta: { $$$date: 'deeper' } },
			{ meta: { $$$$$date: 'deeper still' } },
		]) {
			const wire = JSON.parse(JSON.stringify(encodeDbArgs(payload)));
			expect(decodeDbArgs(wire)).toEqual(payload);
		}
	});

	it('rejects a $date that is not a timestamp', () => {
		expect(() =>
			decodeDbArgs([{ created_at: { after: { $date: 'Q3' } } }]),
		).toThrow(/Invalid \$date/);
	});

	it('does not pollute the prototype through a crafted key', () => {
		decodeDbArgs(JSON.parse('{"__proto__":{"polluted":true}}'));
		expect(({} as Record<string, unknown>).polluted).toBeUndefined();
	});
});

describe('callPluginDb', () => {
	const client = {
		slack: { db: { channels: { count: async () => 7 } } },
	};

	it('invokes the method on the entity client', async () => {
		await expect(
			callPluginDb(
				client,
				{ plugin: 'slack', entityType: 'channels', method: 'count' },
				[],
			),
		).resolves.toBe(7);
	});

	it('refuses a method outside the entity-client surface', async () => {
		await expect(
			callPluginDb(
				client,
				{ plugin: 'slack', entityType: 'channels', method: 'constructor' },
				[],
			),
		).rejects.toMatchObject({ status: 404, code: 'unknown_db_method' });
	});

	it('refuses an inherited property as an entity type', async () => {
		await expect(
			callPluginDb(
				client,
				{ plugin: 'slack', entityType: 'constructor', method: 'count' },
				[],
			),
		).rejects.toMatchObject({ status: 404, code: 'unknown_entity_type' });
	});

	it('404s a plugin with no entity store', async () => {
		await expect(
			callPluginDb(
				{ slack: {} },
				{ plugin: 'slack', entityType: 'channels', method: 'count' },
				[],
			),
		).rejects.toMatchObject({ status: 404, code: 'unknown_plugin' });
	});

	it('allows a read inside a readonly scope', async () => {
		await expect(
			runReadonly(() =>
				callPluginDb(
					client,
					{ plugin: 'slack', entityType: 'channels', method: 'count' },
					[],
				),
			),
		).resolves.toBe(7);
	});

	it('refuses a write and a delete inside a readonly scope', async () => {
		const writing = {
			slack: {
				db: {
					channels: {
						upsertByEntityId: async () => ({ id: 'x' }),
						deleteByEntityId: async () => true,
					},
				},
			},
		};
		for (const method of ['upsertByEntityId', 'deleteByEntityId']) {
			await expect(
				runReadonly(() =>
					callPluginDb(
						writing,
						{ plugin: 'slack', entityType: 'channels', method },
						['C1'],
					),
				),
			).rejects.toThrow(/readonly|read-only/i);
		}
	});
});

describe('management handler db route', () => {
	const post = (
		handler: (r: Request) => Promise<Response>,
		path: string,
		body: unknown,
	) =>
		handler(
			new Request(`https://app.test${path}`, {
				method: 'POST',
				headers: {
					authorization: 'Bearer k',
					'content-type': 'application/json',
				},
				body: JSON.stringify(body),
			}),
		);

	it('routes to <plugin>.db.<entity>.<method> for the URL tenant', async () => {
		const search = jest.fn(async () => [{ id: 'row' }]);
		const withTenant = jest.fn(() => ({
			slack: { db: { channels: { search } } },
		}));
		const handler = managementHandler(fakeCorsair(withTenant), {
			authenticate: () => true,
		});
		const res = await post(handler, '/acme/slack/db/channels/search', {
			args: [
				{
					data: { created_at: { after: { $date: new Date(0).toISOString() } } },
				},
			],
		});
		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({ data: [{ id: 'row' }] });
		expect(withTenant).toHaveBeenCalledWith('acme');
		const filter = search.mock.calls[0]![0] as {
			data: { created_at: { after: unknown } };
		};
		expect(filter.data.created_at.after).toBeInstanceOf(Date);
	});

	it('answers 400 for an args that is not an array', async () => {
		const count = jest.fn(async () => 1);
		const handler = managementHandler(
			fakeCorsair(() => ({ slack: { db: { channels: { count } } } })),
			{ authenticate: () => true },
		);
		// apply() would take this as an empty argument list and report success.
		const res = await post(handler, '/acme/slack/db/channels/count', {
			args: { id: 'C1' },
		});
		expect(res.status).toBe(400);
		expect(count).not.toHaveBeenCalled();
	});

	it('answers 400 for a $date that is not a timestamp', async () => {
		const search = jest.fn(async () => []);
		const handler = managementHandler(
			fakeCorsair(() => ({ slack: { db: { channels: { search } } } })),
			{ authenticate: () => true },
		);
		const res = await post(handler, '/acme/slack/db/channels/search', {
			args: [{ data: { created_at: { after: { $date: 'Q3' } } } }],
		});
		expect(res.status).toBe(400);
		expect(search).not.toHaveBeenCalled();
	});

	it('is off in end-user mode, where a browser could reach it', async () => {
		const count = jest.fn(async () => 1);
		const handler = managementHandler(
			fakeCorsair(() => ({ slack: { db: { channels: { count } } } })),
			{ authenticate: () => true, resolveTenant: () => 'acme' },
		);
		const res = await post(handler, '/acme/slack/db/channels/count', {});
		expect(res.status).toBe(403);
		expect(count).not.toHaveBeenCalled();
	});

	it('404s an unregistered plugin before touching the client', async () => {
		const handler = managementHandler(
			fakeCorsair(() => ({ nope: { db: { x: { count: async () => 1 } } } })),
			{ authenticate: () => true },
		);
		const res = await post(handler, '/acme/nope/db/x/count', {});
		expect(res.status).toBe(404);
	});

	it('answers 401 not_connected rather than 500 for an unconnected tenant', async () => {
		const handler = managementHandler(
			fakeCorsair(() => ({
				slack: {
					db: {
						channels: {
							count: async () => {
								throw new AuthMissingError('slack');
							},
						},
					},
				},
			})),
			{ authenticate: () => true },
		);
		const res = await post(handler, '/acme/slack/db/channels/count', {});
		expect(res.status).toBe(401);
		await expect(res.json()).resolves.toMatchObject({ error: 'not_connected' });
	});

	it('encodes a Date in the response so the client gets a Date back', async () => {
		const handler = managementHandler(
			fakeCorsair(() => ({
				slack: {
					db: {
						channels: {
							findByEntityId: async () => ({
								entityId: 'C1',
								createdAt: new Date(0),
							}),
						},
					},
				},
			})),
			{ authenticate: () => true },
		);
		const res = await post(handler, '/acme/slack/db/channels/findByEntityId', {
			args: ['C1'],
		});
		await expect(res.json()).resolves.toEqual({
			data: { entityId: 'C1', createdAt: { $date: new Date(0).toISOString() } },
		});
	});

	it('is off when calls are disabled', async () => {
		const handler = managementHandler(
			fakeCorsair(() => ({
				slack: { db: { channels: { count: async () => 1 } } },
			})),
			{},
		);
		const res = await post(handler, '/acme/slack/db/channels/count', {});
		expect(res.status).toBeGreaterThanOrEqual(400);
	});
});
