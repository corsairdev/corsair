import assert from 'node:assert/strict';
import { z } from 'zod';
import { corsairTools } from './index.js';

// Offline fake Corsair instance: inspect helpers read `internal.plugins` off the
// global CORSAIR_INTERNAL symbol, and invocation walks `instance[id].api.<path>`.
// (Mirrors packages/corsair/tests/adapters.test.ts — no database or network.)
const CORSAIR_INTERNAL = Symbol.for('corsair:internal');
const calls: unknown[] = [];
const plugin = {
	id: 'demo',
	endpoints: { channels: { list: () => {} } },
	endpointMeta: {
		'channels.list': { riskLevel: 'low', description: 'List channels' },
	},
	endpointSchemas: {
		'channels.list': {
			input: z.object({ channel: z.string() }),
			output: z.object({ ok: z.boolean() }),
		},
	},
};
const instance = {
	[CORSAIR_INTERNAL]: { plugins: [plugin] },
	demo: {
		api: {
			channels: {
				list: async (args: unknown) => {
					calls.push(args);
					return { ok: true, args };
				},
			},
		},
	},
};

const tools = await corsairTools({
	corsair: instance as never,
	operations: ['demo.api.channels.list'],
});
assert.equal(tools.length, 1);
const [list] = tools;
assert.ok(list);
assert.equal(list.name, 'demo_api_channels_list');
assert.equal(list.description, 'List channels');

// The tool validates args against the schema, invokes the operation, and returns
// the JSON-encoded result as model-visible content.
const out = await list.invoke({ channel: 'C1' });
assert.deepEqual(calls, [{ channel: 'C1' }]);
assert.equal(out, JSON.stringify({ ok: true, args: { channel: 'C1' } }));

// A bad arg is rejected by the schema before the operation runs.
await assert.rejects(() => list.invoke({} as never));
assert.deepEqual(calls, [{ channel: 'C1' }]);

console.log('ok: @corsair-dev/langchain');
