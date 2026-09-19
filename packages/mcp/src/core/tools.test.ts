import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildHostedToolDefs } from './tools.js';

// A fake tenant-scoped corsair: only the plugin.api call tree the hosted tools
// walk. list_operations/get_schema need a real instance, so they aren't invoked
// here — we assert their presence and exercise call_operation/run_batch.
function fakeCorsair() {
	const calls: Array<{ op: string; args: unknown }> = [];
	const corsair = {
		slack: {
			api: {
				channels: {
					list: async (args: unknown) => {
						calls.push({ op: 'channels.list', args });
						return { channels: [{ id: 'C1', name: 'general' }] };
					},
				},
				chat: {
					postMessage: async (args: unknown) => {
						calls.push({ op: 'chat.postMessage', args });
						return { ok: true };
					},
				},
			},
		},
	} as unknown as { [k: string]: unknown };
	return { corsair, calls };
}

function text(result: { content: Array<{ type: string; text?: string }> }) {
	return result.content.map((c) => c.text ?? '').join('');
}

test('hosted defs are list/schema/call_operation/run_batch and exclude run_script', () => {
	const { corsair } = fakeCorsair();
	const names = buildHostedToolDefs({ corsair }).map((d) => d.name);
	assert.deepEqual(names, [
		'list_operations',
		'get_schema',
		'call_operation',
		'run_batch',
	]);
	assert.ok(!names.includes('run_script'));
});

test('call_operation walks plugin.api and invokes the op with args', async () => {
	const { corsair, calls } = fakeCorsair();
	const def = buildHostedToolDefs({ corsair }).find(
		(d) => d.name === 'call_operation',
	)!;
	const out = await def.handler({
		plugin: 'slack',
		op: 'channels.list',
		args: { limit: 5 },
	});
	assert.deepEqual(calls, [{ op: 'channels.list', args: { limit: 5 } }]);
	assert.match(text(out), /general/);
});

test('call_operation tolerates a leading "api." on the op path', async () => {
	const { corsair, calls } = fakeCorsair();
	const def = buildHostedToolDefs({ corsair }).find(
		(d) => d.name === 'call_operation',
	)!;
	await def.handler({ plugin: 'slack', op: 'api.channels.list', args: {} });
	assert.equal(calls[0]?.op, 'channels.list');
});

test('call_operation returns an error result for an unknown op (no throw)', async () => {
	const { corsair } = fakeCorsair();
	const def = buildHostedToolDefs({ corsair }).find(
		(d) => d.name === 'call_operation',
	)!;
	const out = (await def.handler({
		plugin: 'slack',
		op: 'channels.nope',
		args: {},
	})) as { isError?: boolean; content: Array<{ type: string; text?: string }> };
	assert.equal(out.isError, true);
	assert.match(text(out), /unknown operation/i);
});

test('run_batch runs ops in order and returns a result per op', async () => {
	const { corsair, calls } = fakeCorsair();
	const def = buildHostedToolDefs({ corsair }).find(
		(d) => d.name === 'run_batch',
	)!;
	const out = await def.handler({
		ops: [
			{ plugin: 'slack', op: 'channels.list', args: {} },
			{ plugin: 'slack', op: 'chat.postMessage', args: { text: 'hi' } },
		],
	});
	assert.deepEqual(
		calls.map((c) => c.op),
		['channels.list', 'chat.postMessage'],
	);
	const parsed = JSON.parse(text(out)) as Array<{ ok: boolean }>;
	assert.equal(parsed.length, 2);
	assert.equal(parsed[0]?.ok, true);
	assert.equal(parsed[1]?.ok, true);
});

test('run_batch reports a failing op without aborting the rest', async () => {
	const { corsair } = fakeCorsair();
	const def = buildHostedToolDefs({ corsair }).find(
		(d) => d.name === 'run_batch',
	)!;
	const out = await def.handler({
		ops: [
			{ plugin: 'slack', op: 'channels.nope', args: {} },
			{ plugin: 'slack', op: 'channels.list', args: {} },
		],
	});
	const parsed = JSON.parse(text(out)) as Array<{
		ok: boolean;
		error?: string;
	}>;
	assert.equal(parsed[0]?.ok, false);
	assert.match(parsed[0]?.error ?? '', /unknown operation/i);
	assert.equal(parsed[1]?.ok, true);
});
