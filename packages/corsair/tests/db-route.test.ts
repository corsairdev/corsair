import type { CorsairInternalConfig } from '../core';
import { managementHandler } from '../core/management';
import {
	callPluginDb,
	decodeDbArgs,
	encodeDbArgs,
} from '../core/management/db';

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
