import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { GET } from '../app/api/lug-handle/route';
import { readLugHandleAnswer } from './lug-handle';

describe('readLugHandleAnswer', () => {
	it('keeps the fields the page shows', () => {
		assert.deepEqual(readLugHandleAnswer({ available: true, extra: 1 }), {
			available: true,
		});
		assert.deepEqual(
			readLugHandleAnswer({
				available: false,
				reason: 'taken',
				suggestion: 'pranay2',
			}),
			{ available: false, reason: 'taken', suggestion: 'pranay2' },
		);
	});

	it('drops a malformed suggestion and rejects unknown answers', () => {
		assert.deepEqual(
			readLugHandleAnswer({
				available: false,
				reason: 'taken',
				suggestion: '<b>x',
			}),
			{ available: false, reason: 'taken' },
		);
		assert.equal(
			readLugHandleAnswer({ available: false, reason: 'nope' }),
			null,
		);
		assert.equal(readLugHandleAnswer({ error: 'unconfigured' }), null);
		assert.equal(readLugHandleAnswer(null), null);
	});
});

describe('GET /api/lug-handle', () => {
	const realFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = realFetch;
	});

	// Swap fetch for one that answers from `reply`, recording each URL asked.
	const stubFetch = (reply: (url: string) => Promise<Response>) => {
		const asked: string[] = [];
		globalThis.fetch = Object.assign(
			(input: string | URL | Request) => {
				asked.push(String(input));
				return reply(String(input));
			},
			{ preconnect: () => {} },
		) as typeof fetch;
		return asked;
	};

	const ask = (handle: string) =>
		GET(new Request(`http://localhost/api/lug-handle?handle=${handle}`));

	it('answers bad and reserved names without asking lug.dev', async () => {
		const asked = stubFetch(async () => Response.json({}));
		assert.deepEqual(await (await ask('Bad_Name')).json(), {
			available: false,
			reason: 'format',
		});
		assert.deepEqual(await (await ask('admin')).json(), {
			available: false,
			reason: 'reserved',
		});
		assert.deepEqual(asked, []);
	});

	it("passes lug.dev's answer through", async () => {
		const asked = stubFetch(async () =>
			Response.json({
				available: false,
				reason: 'taken',
				suggestion: 'pranay2',
			}),
		);
		const res = await ask('pranay');
		assert.equal(res.status, 200);
		assert.deepEqual(await res.json(), {
			available: false,
			reason: 'taken',
			suggestion: 'pranay2',
		});
		assert.deepEqual(asked, ['https://www.lug.dev/api/handle?handle=pranay']);
	});

	it('says it could not check when lug.dev fails', async () => {
		stubFetch(async () => {
			throw new Error('network');
		});
		assert.equal((await ask('pranay')).status, 502);
		stubFetch(async () =>
			Response.json({ error: 'unconfigured' }, { status: 503 }),
		);
		assert.equal((await ask('pranay')).status, 502);
	});
});
