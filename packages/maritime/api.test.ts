import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { maritimeOperations } from './endpoints/manifest';
import { maritime } from './index';

/**
 * Live run against a Maritime account. Skipped unless MARITIME_API_KEY is set
 * (CI never runs files named api.test.ts):
 *
 *   MARITIME_API_KEY=mk_... npx jest api.test.ts
 *
 * Reads every GET that takes no arguments, then round trips on throwaway
 * records: two small virtual machines (commands, files, keys, a snapshot,
 * pause), account secrets, both kinds of webhook endpoint (pointed at
 * example.com, never tested), an end user, a network preset and an API key.
 * MARITIME_LIVE_AGENTS=1 also creates an agent box and MARITIME_LIVE_COMPUTER=1
 * a Linux computer. Everything created is deleted at the end, even when a
 * step fails. A run costs a fraction of a cent: the machines are the
 * smallest size and live for a few minutes.
 *
 * Never run here: plan, trial, wallet and credit purchases, swarms and swarm
 * servers ($1 a minute), chat (spends LLM credit), invites and feedback
 * (they email people), and deleting the account.
 * MARITIME_LIVE_REPORT=<file> writes each step's outcome as JSON.
 */
const key = process.env.MARITIME_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Maritime live run: set MARITIME_API_KEY.');

const NAME = `corsair-plugin-test-${Date.now()}`;

// GETs that need no input, minus the ones that only redirect a browser.
const NO_ARGUMENT_READS = maritimeOperations
	.filter(
		(op) =>
			op.method === 'GET' &&
			((op.input.required as string[] | undefined) ?? []).length === 0,
	)
	.map((op) => op.id);

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'maritime', 'default');
	const corsair = createCorsair({
		plugins: [maritime({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>['corsair'];
// `unknown` because a step's result is any parsed response.
type Step = { id: string; ok: boolean; note?: string; value?: unknown };

// `unknown` because the value is any parsed response.
function field(value: unknown, name: string): string {
	const found =
		typeof value === 'object' && value !== null && name in value
			? (value as Record<string, unknown>)[name]
			: undefined;
	if (typeof found !== 'string' && typeof found !== 'number') {
		throw new Error(`response has no ${name}`);
	}
	return String(found);
}

describeIfKey('maritime live', () => {
	jest.setTimeout(600_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const api = () => (client as NonNullable<typeof client>).corsair.maritime.api;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = api();
		for (const part of id.split('.')) {
			node = (node as Record<string, unknown>)[part];
		}
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];
	const cleanup = (what: string, run: () => Promise<unknown>) =>
		cleanups.push({ what, run });

	/** Runs one operation and records the outcome; returns undefined when it failed. */
	// `unknown` because each operation takes and returns its own shapes.
	async function step(id: string, input: unknown = {}): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({ id, ok: true });
			return value;
		} catch (error) {
			steps.push({
				id,
				ok: false,
				note: (error as Error).message.slice(0, 200),
			});
			return undefined;
		}
	}

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			try {
				await item.run();
			} catch (error) {
				// A 404 is a record the run already deleted.
				if (!/Maritime 404/.test((error as Error).message)) {
					left.push(`${item.what}: ${(error as Error).message}`);
				}
			}
		}
		await client?.testDb.cleanup?.();
		if (left.length > 0) {
			console.warn(`Maritime records left behind:\n${left.join('\n')}`);
		}
		const report = process.env.MARITIME_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify(steps, null, 2));
		const failed = steps.filter((s) => !s.ok);
		console.log(
			`Maritime live: ${steps.length - failed.length}/${steps.length} ok\n${failed
				.map((s) => `  ${s.id}: ${s.note}`)
				.join('\n')}`,
		);
	});

	it('reads every GET that takes no arguments', async () => {
		for (const id of NO_ARGUMENT_READS) await step(id);
		expect(steps.some((s) => s.ok)).toBe(true);
	});

	it('runs a virtual machine end to end', async () => {
		const box = await step('sandboxes.ephemeral.create', {
			name: `${NAME}-eph`,
			size: 'small',
			idleMinutes: 3,
			timeLimitMinutes: 10,
			metadata: { corsair: 'plugin-test' },
		});
		const id = field(box, 'id');
		cleanup('ephemeral sandbox', () =>
			op('sandboxes.ephemeral.kill')({ sandbox_id: id }),
		);
		await step('sandboxes.get', { id_or_name: id });
		await step('sandboxes.info', { sandbox_id: id });
		await step('sandboxes.usage', { sandbox_id: id });
		await step('sandboxes.update', {
			sandbox_id: id,
			metadata: { corsair: 'updated' },
		});
		await step('sandboxes.list', {
			state: ['running'],
			metadata: { corsair: 'updated' },
		});
		await step('sandboxes.ephemeral.list');
		await step('sandboxes.ephemeral.extend', {
			sandbox_id: id,
			timeLimitMinutes: 10,
		});
		const run = await step('sandboxes.commands.run', {
			sandbox_id: id,
			cmd: 'uname -s && echo $HOME',
			timeoutSeconds: 30,
		});
		expect(field(run, 'stdout')).toContain('Linux');
		const background = await step('sandboxes.commands.run', {
			sandbox_id: id,
			cmd: ['sleep', '30'],
			background: true,
		});
		const commandId = field(background, 'id');
		await step('sandboxes.commands.get', {
			sandbox_id: id,
			command_id: commandId,
		});
		await step('sandboxes.commands.kill', {
			sandbox_id: id,
			command_id: commandId,
			signal: 'SIGKILL',
		});
		await step('sandboxes.commands.history', { sandbox_id: id, limit: 5 });
		await step('sandboxes.files.write', {
			sandbox_id: id,
			path: '/home/user/corsair.txt',
			content: 'hello from Corsair',
		});
		await step('sandboxes.files.write', {
			sandbox_id: id,
			path: '/home/user/bytes.bin',
			content: 'AAEC/w==',
			encoding: 'base64',
		});
		await step('sandboxes.files.list', { sandbox_id: id, path: '/home/user' });
		const file = await step('sandboxes.files.read', {
			sandbox_id: id,
			path: '/home/user/corsair.txt',
		});
		expect(file).toBeDefined();
		await step('sandboxes.files.delete', {
			sandbox_id: id,
			path: '/home/user/corsair.txt',
		});
		await step('sandboxes.createUrl', { sandbox_id: id, port: 8080 });
		const sandboxKey = await step('sandboxKeys.create', {
			sandbox: id,
			ttlSeconds: 300,
		});
		await step('sandboxKeys.list', { sandbox: id });
		if (sandboxKey)
			await step('sandboxKeys.revoke', { key_id: field(sandboxKey, 'id') });
		await step('sandboxes.rotateSecret', { sandbox_id: id });
		// The data plane must still work after the rotation: the plugin reads the secret fresh.
		await step('sandboxes.commands.run', { sandbox_id: id, cmd: 'true' });
		const snapshot = `${NAME}-snap`;
		if (await step('sandboxes.save', { sandbox_id: id, name: snapshot })) {
			cleanup('snapshot', () => op('snapshots.delete')({ name: snapshot }));
			await step('snapshots.get', { name: snapshot });
		}
		await step('sandboxes.ephemeral.kill', { sandbox_id: id });

		const vm = await step('sandboxes.create', {
			name: `${NAME}-vm`,
			size: 'small',
			idleTimeoutSeconds: 60,
			onIdle: 'kill',
			timeLimitSeconds: 300,
		});
		const vmId = field(vm, 'id');
		cleanup('sandbox', () => op('sandboxes.kill')({ sandbox_id: vmId }));
		await step('sandboxes.pause', { sandbox_id: vmId });
		await step('sandboxes.get', { id_or_name: vmId });
		await step('sandboxes.kill', { sandbox_id: vmId });
		// Python runs only on a code-interpreter machine.
		const interpreter = await step('sandboxes.ephemeral.create', {
			name: `${NAME}-code`,
			from: 'code-interpreter',
			idleMinutes: 2,
			timeLimitMinutes: 5,
		});
		if (interpreter) {
			const codeId = field(interpreter, 'id');
			cleanup('code sandbox', () =>
				op('sandboxes.ephemeral.kill')({ sandbox_id: codeId }),
			);
			const result = await step('sandboxes.code.run', {
				sandbox_id: codeId,
				code: 'print(6 * 7)',
			});
			expect(JSON.stringify(result)).toContain('42');
			await step('sandboxes.ephemeral.kill', { sandbox_id: codeId });
		}
		await step('usage.sandboxes', {
			from: new Date(Date.now() - 86_400_000).toISOString(),
			to: new Date().toISOString(),
			sandbox: id,
		});
	});

	it('round trips account settings', async () => {
		const secret = `CORSAIR_TEST_${Date.now()}`;
		if (
			await step('secrets.set', { name: secret, value: 'not-a-real-secret' })
		) {
			cleanup('secret', () => op('secrets.delete')({ name: secret }));
			await step('secrets.list', { limit: 100 });
			await step('secrets.delete', { name: secret });
		}
		const endpoint = await step('sandboxWebhooks.create', {
			url: 'https://example.com/corsair-plugin-test/sandbox-events',
			events: ['sandbox.ended'],
		});
		if (endpoint) {
			const endpointId = field(endpoint, 'id');
			cleanup('sandbox webhook', () =>
				op('sandboxWebhooks.delete')({ webhook_id: endpointId }),
			);
			await step('sandboxWebhooks.list');
			await step('sandboxWebhooks.deliveries', { webhook_id: endpointId });
			await step('sandboxWebhooks.delete', { webhook_id: endpointId });
		}
		const hook = await step('webhooks.create', {
			url: 'https://example.com/corsair-plugin-test/maritime',
			events: ['agent.error'],
		});
		if (hook) {
			const hookId = field(hook, 'id');
			cleanup('webhook', () => op('webhooks.delete')({ sub_id: hookId }));
			await step('webhooks.update', {
				sub_id: hookId,
				events: ['agent.error', 'exec.finished'],
			});
			await step('webhooks.deliveries.list', { sub_id: hookId });
			await step('webhooks.delete', { sub_id: hookId });
		}
		const user = `${NAME}-user`;
		if (
			await step('endUsers.upsert', {
				external_id: user,
				displayName: 'Corsair plugin test',
			})
		) {
			cleanup('end user', () => op('endUsers.delete')({ external_id: user }));
			await step('endUsers.get', { external_id: user });
			await step('endUsers.policy.get', { external_id: user });
			await step('endUsers.agents.list', { external_id: user });
			await step('endUsers.activity', { external_id: user });
			await step('endUsers.delete', { external_id: user });
		}
		const preset = await step('network.presets.create', {
			name: `${NAME}-preset`,
			allow: ['example.com'],
		});
		if (preset) {
			const presetId = field(preset, 'id');
			cleanup('network preset', () =>
				op('network.presets.delete')({ preset_id: presetId }),
			);
			await step('network.presets.delete', { preset_id: presetId });
		}
		const apiKey = await step('apiKeys.create', {
			name: `${NAME}-key`,
			scopes: ['provision'],
			expires_in_days: 1,
		});
		if (apiKey) {
			const keyId = field(apiKey, 'id');
			cleanup('api key', () => op('apiKeys.revoke')({ key_id: keyId }));
			await step('apiKeys.revoke', { key_id: keyId });
		}
	});

	const itAgents = process.env.MARITIME_LIVE_AGENTS === '1' ? it : it.skip;
	itAgents('runs an agent box end to end', async () => {
		const agent = await step('agents.create', {
			name: `${NAME}-agent`,
			templateId: 'zeroclaw',
			useMaritimeLlm: false,
		});
		const id = field(agent, 'id');
		cleanup('agent', () => op('agents.delete')({ agent_id: id }));
		// Deploying takes a minute or two; files and exec need a running box.
		for (let i = 0; i < 40; i++) {
			const current = await op('agents.get')({ agent_id: id });
			const status = field(current, 'status');
			if (status === 'active' || status === 'sleeping') break;
			if (status === 'error') break;
			await new Promise((resolve) => setTimeout(resolve, 6000));
		}
		await step('agents.get', { agent_id: id });
		await step('agents.diagnostic', { agent_id: id });
		await step('agents.exec.run', {
			agent_id: id,
			command: ['printf', 'hello'],
			timeout: 30,
		});
		const detached = await step('agents.exec.run', {
			agent_id: id,
			command: 'sleep 1; echo done',
			detached: true,
		});
		if (detached)
			await step('agents.exec.get', {
				agent_id: id,
				execution_id: field(detached, 'executionId'),
			});
		const listing = await step('agents.files.list', { agent_id: id });
		const root = listing ? field(listing, 'root') : '/data';
		await step('agents.files.mkdir', { agent_id: id, path: `${root}/corsair` });
		await step('agents.files.write', {
			agent_id: id,
			path: `${root}/corsair/a.txt`,
			content: 'hello from Corsair',
		});
		await step('agents.files.move', {
			agent_id: id,
			from: `${root}/corsair/a.txt`,
			to: `${root}/corsair/b.txt`,
		});
		await step('agents.files.download', {
			agent_id: id,
			path: `${root}/corsair/b.txt`,
		});
		await step('agents.files.upload', {
			agent_id: id,
			file: { base64: 'aGVsbG8=', filename: 'up.txt' },
			dest_dir: `${root}/corsair`,
		});
		await step('agents.files.delete', {
			agent_id: id,
			path: `${root}/corsair`,
		});
		if (
			await step('agents.env.create', {
				agent_id: id,
				key: 'CORSAIR_TEST',
				value: 'x',
				isSecret: false,
			})
		) {
			await step('agents.env.list', { agent_id: id });
			await step('agents.env.delete', { agent_id: id, key: 'CORSAIR_TEST' });
		}
		await step('agents.logs', { agent_id: id, limit: 20 });
		await step('agents.stats', { agent_id: id });
		await step('agents.activity', { agent_id: id });
		await step('agents.triggers.list', { agent_id: id });
		await step('agents.capabilities.get', { agent_id: id });
		await step('agents.channels.get', { agent_id: id });
		await step('agents.webhookToken.get', { agent_id: id });
		await step('agents.llm.status', { agent_id: id });
		await step('agents.llm.getSpendLimit', { agent_id: id });
		await step('agents.skills.list', { agent_id: id });
		await step('agents.signedWebhook.get', { agent_id: id });
		await step('deployments.listForAgent', { agent_id: id });
		await step('agents.sleep', { agent_id: id });
		await step('agents.delete', { agent_id: id });
		await step('deletedAgents.get', { agent_id: id });
	});

	const itComputer = process.env.MARITIME_LIVE_COMPUTER === '1' ? it : it.skip;
	itComputer('drives a Linux computer', async () => {
		const computer = await step('computers.create', {
			externalUserId: `${NAME}-user`,
			name: `${NAME}-pc`,
			os: 'linux',
		});
		const id = field(computer, 'id');
		cleanup('computer', () => op('computers.delete')({ computer_id: id }));
		await step('computers.get', { computer_id: id });
		await step('computers.wake', { computer_id: id });
		await step('computers.screenshot', { computer_id: id });
		await step('computers.actions', {
			computer_id: id,
			action: 'key',
			key: 'Escape',
			noScreenshot: true,
		});
		await step('computers.exec', { computer_id: id, command: 'uname -s' });
		await step('computers.files.write', {
			computer_id: id,
			path: '/home/desk/corsair.txt',
			content: 'hello from Corsair',
		});
		await step('computers.files.read', {
			computer_id: id,
			path: '/home/desk/corsair.txt',
		});
		await step('computers.files.list', { computer_id: id, path: '/home/desk' });
		await step('computers.createViewer', {
			computer_id: id,
			mode: 'watch',
			ttlS: 60,
		});
		await step('computers.tools.list', { computer_id: id });
		await step('computers.sessions.list', { computer_id: id });
		await step('computers.sessions.close', { computer_id: id });
		await step('computers.sleep', { computer_id: id });
		await step('computers.delete', { computer_id: id });
	});
});
