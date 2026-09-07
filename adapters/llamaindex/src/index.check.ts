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
assert.equal(list.metadata.name, 'demo_api_channels_list');
assert.equal(list.metadata.description, 'List channels');

// The tool invokes the operation and returns the JSON-encoded result as content.
const out = await list.call({ channel: 'C1' });
assert.deepEqual(calls, [{ channel: 'C1' }]);
assert.equal(out, JSON.stringify({ ok: true, args: { channel: 'C1' } }));

console.log('ok: @corsair-dev/llamaindex');
