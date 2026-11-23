// Live Amika API tests. Excluded from the default run by
// `testPathIgnorePatterns` in jest.config.cjs; run them with:
//
//   AMIKA_API_KEY=sk_... pnpm test:live
//
// By default they read the whole organization and make only changes they
// undo: a generic secret, an SSH public key, an API key and a paused job, each
// named `corsair-plugin-test-<run>` and deleted in afterAll. Nothing runs and
// nothing is billed.
//
// With AMIKA_LIVE_RIGS=1 they also create one small rig on Amika Cloud (or on
// your own host with AMIKA_LIVE_HOST_ID), wait for it to boot, run a shell
// command on it and read the output, expose a port as a service, stop it and
// delete it. Amika Cloud bills a running rig by the second (about $0.18 an
// hour for 2 vCPUs), so a run costs a cent or two. AMIKA_LIVE_RIG_SIZE picks
// the size (default: the provider's own default).
//
// With AMIKA_LIVE_RIGS=1 and AMIKA_LIVE_CLAUDE_CREDENTIAL=<name of a Claude
// credential stored in Amika>, they also create a second rig with that
// credential and talk to Claude Code in it through agentSessions.send: one
// message, then a follow-up in the same session (Haiku, low effort, a few
// cents of the credential's Anthropic usage).
//
// Calls go through createCorsair, so the plugin's error handlers and core's
// retries apply as in production. Failing assertions never print a secret or
// key value: those are checked as booleans.
import { generateKeyPairSync, randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { amika } from './index';

const key = process.env.AMIKA_API_KEY?.trim() ?? '';
const hasKey = key.length > 0;
if (!hasKey) {
	console.warn(
		'[amika] live API tests skipped: set AMIKA_API_KEY to enable them.',
	);
}
const live = hasKey ? describe : describe.skip;

const rigsOn = process.env.AMIKA_LIVE_RIGS === '1';
if (hasKey && !rigsOn) {
	console.warn(
		'[amika] rig tests skipped: set AMIKA_LIVE_RIGS=1 to create, run and delete one billed rig.',
	);
}
const liveRigs = hasKey && rigsOn ? describe : describe.skip;
const hostId = process.env.AMIKA_LIVE_HOST_ID?.trim() || undefined;
const claudeCredential =
	process.env.AMIKA_LIVE_CLAUDE_CREDENTIAL?.trim() || undefined;
if (hasKey && rigsOn && !claudeCredential) {
	console.warn(
		'[amika] agent session tests skipped: set AMIKA_LIVE_CLAUDE_CREDENTIAL to the name of a Claude credential stored in Amika.',
	);
}
const liveAgent =
	hasKey && rigsOn && claudeCredential ? describe : describe.skip;
const rigSize = process.env.AMIKA_LIVE_RIG_SIZE?.trim() || undefined;

// Random, so two runs started at once never share a fixture name.
const RUN = randomBytes(4).toString('hex');
const NAME = `corsair-plugin-test-${RUN}`;

/** Ops this file ran against the live API, for the PR's evidence. */
const ran = new Set<string>();

/** Records every operation called through the returned tree. */
function recording<T extends object>(target: T, path: string[] = []): T {
	return new Proxy(target, {
		get(object, property) {
			const value = Reflect.get(object, property);
			const next = [...path, String(property)];
			if (typeof value === 'function') {
				// `unknown` because each endpoint takes its own input.
				return (...args: unknown[]) => {
					ran.add(next.join('.'));
					return (value as (...a: unknown[]) => unknown)(...args);
				};
			}
			if (value && typeof value === 'object') return recording(value, next);
			return value;
		},
	});
}

/** The HTTP status of a failed call. */
// `unknown` because a rejected promise can carry anything.
async function statusOf(promise: Promise<unknown>): Promise<number | 'ok'> {
	try {
		await promise;
		return 'ok';
	} catch (error) {
		const status = (error as { status?: unknown }).status;
		if (typeof status === 'number') return status;
		throw error;
	}
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** An OpenSSH ed25519 public key line made fresh for this run. */
function sshPublicKey(): string {
	const der = generateKeyPairSync('ed25519').publicKey.export({
		format: 'der',
		type: 'spki',
	});
	const raw = der.subarray(der.length - 32);
	const field = (bytes: Buffer) => {
		const length = Buffer.alloc(4);
		length.writeUInt32BE(bytes.length);
		return Buffer.concat([length, bytes]);
	};
	const blob = Buffer.concat([field(Buffer.from('ssh-ed25519')), field(raw)]);
	return `ssh-ed25519 ${blob.toString('base64')} ${NAME}`;
}

const api = recording(createCorsair({ plugins: [amika({ key })] }).amika.api);

afterAll(() => {
	if (!hasKey) return;
	const out = process.env.AMIKA_LIVE_OPS_FILE;
	if (out) writeFileSync(out, `${[...ran].sort().join('\n')}\n`);
	console.log(`[amika] live operations run: ${ran.size}`);
});

live('Amika live API: reads', () => {
	jest.setTimeout(60_000);

	it('lists rigs, sessions, repositories, hosts, snapshots, runs and jobs', async () => {
		expect(Array.isArray(await api.rigs.list({}))).toBe(true);
		const sessions = await api.agentSessions.list({ limit: 5 });
		expect(Array.isArray(sessions.sessions)).toBe(true);
		expect(typeof sessions.total).toBe('number');
		expect(Array.isArray(await api.repositories.list({}))).toBe(true);
		expect(Array.isArray(await api.hosts.list({}))).toBe(true);
		expect(Array.isArray((await api.snapshots.list({})).items)).toBe(true);
		expect(
			Array.isArray((await api.commandRuns.list({ limit: 5 })).items),
		).toBe(true);
		const jobs = await api.jobs.list({});
		expect(Array.isArray(jobs.items)).toBe(true);
		expect(Array.isArray((await api.jobRuns.list({ limit: 5 })).items)).toBe(
			true,
		);
		expect(Array.isArray((await api.services.list({})).items)).toBe(true);
		expect(typeof (await api.rigs.getSlackMetadata({})).metadata).toBe(
			'object',
		);
	});

	it('lists credentials and keys by name only', async () => {
		expect(Array.isArray(await api.secrets.list({}))).toBe(true);
		expect(Array.isArray(await api.agentCredentials.claude.list({}))).toBe(
			true,
		);
		expect(Array.isArray(await api.agentCredentials.codex.list({}))).toBe(true);
		expect(typeof (await api.agentCredentials.pi.get({})).configured).toBe(
			'boolean',
		);
		const keys = await api.apiKeys.list({});
		expect(Array.isArray(keys.data)).toBe(true);
		// Listed keys are obfuscated: the key these tests run with never shows.
		expect(JSON.stringify(keys).includes(key)).toBe(false);
		expect(Array.isArray(await api.secrets.sshPublicKeys.list({}))).toBe(true);
		expect(
			Array.isArray(await api.cloudAccounts.list({}).then((r) => r.items)),
		).toBe(true);
		expect(typeof (await api.gitUserSettings.get({})).configured).toBe(
			'boolean',
		);
		const integrations = await api.integrations.list({});
		expect(Array.isArray(integrations)).toBe(true);
		const channels = await api.slack.channelSettings.list({});
		expect(Array.isArray(channels.settings)).toBe(true);
	});

	it('reports unset Slack and Linear defaults, and a missing rig, as 404s', async () => {
		// Settings the org never saved answer 404, not an empty object.
		for (const status of [
			await statusOf(api.slack.settings.get({})),
			await statusOf(api.linear.settings.get({})),
		]) {
			expect([404, 'ok']).toContain(status);
		}
		expect(await statusOf(api.rigs.get({ id: `${NAME}-missing` }))).toBe(404);
	});

	it('answers a bad key with a 401 that names no key', async () => {
		const bad = createCorsair({
			plugins: [amika({ key: 'sk_invalid_corsair_test' })],
		}).amika.api;
		const error = (await bad.rigs
			.list({})
			.catch((e: unknown) => e)) as Error & {
			status?: number;
		};
		expect(error.status).toBe(401);
		expect(error.message).toBe('Amika 401: Invalid API key');
		expect(JSON.stringify(error).includes('sk_invalid_corsair_test')).toBe(
			false,
		);
	});
});

live('Amika live API: writes it undoes', () => {
	jest.setTimeout(60_000);
	const created = {
		secret: '',
		sshKey: '',
		apiKey: '',
		job: '',
	};

	afterAll(async () => {
		// Each one only if this run made it, and only by the id this run got back.
		if (created.job)
			await api.jobs.delete({ job: created.job }).catch(() => {});
		if (created.apiKey)
			await api.apiKeys
				.delete({ id: created.apiKey, scope: 'user' })
				.catch(() => {});
		if (created.sshKey)
			await api.secrets.sshPublicKeys
				.delete({ id: created.sshKey })
				.catch(() => {});
		if (created.secret)
			await api.secrets.delete({ id: created.secret }).catch(() => {});
	});

	it('creates, updates and deletes a generic secret without reading its value back', async () => {
		const secret = await api.secrets.create({
			name: NAME.toUpperCase().replace(/-/g, '_'),
			value: `value-${RUN}`,
			scope: 'user',
		});
		created.secret = String(secret.id ?? '');
		expect(created.secret.length > 0).toBe(true);
		expect(JSON.stringify(secret).includes(`value-${RUN}`)).toBe(false);
		const updated = await api.secrets.update({
			id: created.secret,
			value: `value2-${RUN}`,
		});
		expect(updated.id).toBe(created.secret);
		const listed = await api.secrets.list({});
		expect(listed.some((s) => s?.id === created.secret)).toBe(true);
		await expect(api.secrets.delete({ id: created.secret })).resolves.toEqual({
			success: true,
		});
		created.secret = '';
		const after = await api.secrets.list({});
		expect(after.some((s) => s?.name === secret.name)).toBe(false);
	});

	it('adds and deletes an SSH public key', async () => {
		const added = await api.secrets.sshPublicKeys.upsert({
			name: NAME,
			public_key: sshPublicKey(),
		});
		created.sshKey = String(added.id ?? '');
		expect(created.sshKey.length > 0).toBe(true);
		const listed = await api.secrets.sshPublicKeys.list({});
		expect(listed.some((k) => k?.id === created.sshKey)).toBe(true);
		await expect(
			api.secrets.sshPublicKeys.delete({ id: created.sshKey }),
		).resolves.toEqual({ success: true });
		created.sshKey = '';
	});

	it('creates an API key (value returned once) and deletes it', async () => {
		const made = await api.apiKeys.create({ name: NAME, scope: 'user' });
		created.apiKey = String(made.id ?? '');
		expect(created.apiKey.length > 0).toBe(true);
		// The value comes back once; checked as a boolean, never printed.
		expect(JSON.stringify(made).includes('sk_')).toBe(true);
		await expect(
			api.apiKeys.delete({ id: created.apiKey, scope: 'user' }),
		).resolves.toEqual({
			success: true,
		});
		created.apiKey = '';
		const keys = await api.apiKeys.list({});
		expect(keys.data?.some((k) => k?.name === NAME)).toBe(false);
	});

	it('creates a paused job, reads, updates and deletes it (it never runs)', async () => {
		const job = await api.jobs.create({
			name: NAME,
			description: 'corsair plugin live test, paused',
			trigger: { kind: 'cron', schedule: '0 3 1 1 *', timezone: 'UTC' },
			steps: [
				{
					rig_create: { name: `${NAME}-job` },
					command: 'echo never-runs',
					timeout_ms: 60_000,
				},
			],
			enabled: false,
		});
		created.job = String(job.id ?? '');
		expect(created.job.length > 0).toBe(true);
		expect(job.enabled).toBe(false);
		const read = await api.jobs.get({ job: NAME, by: 'name' });
		expect(read.id).toBe(created.job);
		const updated = await api.jobs.update({
			job: created.job,
			description: 'corsair plugin live test, updated',
		});
		expect(updated.description).toBe('corsair plugin live test, updated');
		expect(updated.enabled).toBe(false);
		const runs = await api.jobRuns.list({ job_id: created.job });
		expect(runs.items).toEqual([]);
		await expect(api.jobs.delete({ job: created.job })).resolves.toEqual({
			success: true,
		});
		created.job = '';
		expect(await statusOf(api.jobs.get({ job: NAME, by: 'name' }))).toBe(404);
	});
});

liveRigs('Amika live API: one rig, end to end', () => {
	jest.setTimeout(20 * 60_000);
	const RIG = `${NAME}-rig`;
	const SNAPSHOT = `${NAME}-snap`;
	let rigId = '';
	let snapshotMade = false;

	afterAll(async () => {
		if (snapshotMade)
			await api.snapshots.delete({ ref: SNAPSHOT }).catch(() => {});
		if (rigId) await api.rigs.delete({ id: rigId }).catch(() => {});
	});

	/**
	 * Polls rigs.get until the rig reaches a status, and for `running` until
	 * setup is done too. A failed setup (`git-failed`, `setup-failed`,
	 * `sys-setup-failed`) fails the test at once instead of waiting it out.
	 */
	async function waitFor(status: string, limitMs = 12 * 60_000) {
		const start = Date.now();
		for (;;) {
			const rig = await api.rigs.get({ id: rigId, by: 'id' });
			if (String(rig.setup_status ?? '').endsWith('-failed')) {
				throw new Error(`rig setup ${rig.setup_status}`);
			}
			const setupDone =
				status !== 'running' ||
				rig.setup_status === 'ok' ||
				rig.setup_status == null;
			if (rig.status === status && setupDone) return rig;
			if (rig.status === 'failed' || rig.status === 'error') {
				throw new Error(`rig went to ${rig.status}`);
			}
			if (Date.now() - start > limitMs) {
				throw new Error(`rig still ${rig.status} after ${limitMs} ms`);
			}
			await sleep(5_000);
		}
	}

	it('creates a rig and waits for it to boot', async () => {
		const rig = await api.rigs.create({
			name: RIG,
			preset: 'coder',
			...(rigSize ? { size: rigSize } : {}),
			...(hostId ? { host_id: hostId } : {}),
			// No Amika key inside the rig: this test never needs one.
			amika_api_key: { mode: 'none' },
			auto_stop_interval: 10,
		});
		rigId = String(rig.id ?? '');
		expect(rigId.length > 0).toBe(true);
		const running = await waitFor('running');
		expect(running.name).toBe(RIG);
		const byName = await api.rigs.get({ id: RIG, by: 'name' });
		expect(byName.id).toBe(rigId);
		expect((await api.rigs.list({})).some((r) => r?.id === rigId)).toBe(true);
		const events = await api.rigs.listLifecycleEvents({ id: rigId });
		expect(JSON.stringify(events).length > 2).toBe(true);
	});

	it('runs a shell command on the rig and reads its output', async () => {
		const marker = `corsair-${RUN}`;
		const run = await api.commandRuns.create({
			rig_id: rigId,
			command: `echo ${marker} && uname -s && nproc`,
			timeout_ms: 120_000,
		});
		const runId = String(run.id ?? '');
		expect(runId.length > 0).toBe(true);
		// status is queued → in_progress → completed; conclusion says how it ended.
		let current = await api.commandRuns.get({ id: runId });
		const start = Date.now();
		while (current.status !== 'completed') {
			if (Date.now() - start > 5 * 60_000)
				throw new Error(`run still ${current.status}`);
			await sleep(2_000);
			current = await api.commandRuns.get({ id: runId });
		}
		expect(current.conclusion).toBe('success');
		expect(current.exit_code).toBe(0);
		const events = await api.commandRuns.listEvents({ id: runId, after: 0 });
		expect(typeof events.next_sequence).toBe('number');
		const text = JSON.stringify(events.items);
		expect(text.includes(marker)).toBe(true);
		expect(text.includes('Linux')).toBe(true);
		const listed = await api.commandRuns.list({ rig: rigId, rig_by: 'id' });
		expect(listed.items?.some((r) => r?.id === runId)).toBe(true);
	});

	it('cancels a running command', async () => {
		const run = await api.commandRuns.create({
			rig_id: rigId,
			command: 'sleep 300',
			timeout_ms: 600_000,
		});
		const runId = String(run.id ?? '');
		let current = await api.commandRuns.get({ id: runId });
		const start = Date.now();
		while (current.status === 'queued') {
			if (Date.now() - start > 2 * 60_000) throw new Error('run never started');
			await sleep(1_000);
			current = await api.commandRuns.get({ id: runId });
		}
		await api.commandRuns.cancel({ id: runId });
		while (current.status !== 'completed') {
			if (Date.now() - start > 4 * 60_000) throw new Error('run not cancelled');
			await sleep(2_000);
			current = await api.commandRuns.get({ id: runId });
		}
		expect(current.conclusion).toBe('cancelled');
	});

	it("reads the rig's sessions and integrations, and mints a web terminal ticket", async () => {
		const sessions = await api.rigs.sessions.list({
			id: rigId,
			sandbox_by: 'id',
		});
		expect(Array.isArray(sessions.sessions)).toBe(true);
		expect(
			Array.isArray(
				await api.rigs.listIntegrations({ id: rigId, sandbox_by: 'id' }),
			),
		).toBe(true);
		const ticket = await api.rigs.createTerminalTicket({
			id: rigId,
			sandbox_by: 'id',
		});
		// A single-use credential: checked, never printed.
		expect(typeof ticket.ticket === 'string' && ticket.ticket.length > 0).toBe(
			true,
		);
	});

	it('exposes a port as a service and removes it', async () => {
		const service = await api.rigs.services.create({
			id: rigId,
			sandbox_by: 'id',
			name: 'web',
			port: 8080,
			url_scheme: 'https',
		});
		expect(service.name).toBe('web');
		const listed = await api.rigs.services.list({
			id: rigId,
			sandbox_by: 'id',
		});
		expect(JSON.stringify(listed).includes('8080')).toBe(true);
		await expect(
			api.rigs.services.delete({ id: rigId, ref: 'web', sandbox_by: 'id' }),
		).resolves.toEqual({ success: true });
	});

	it('previews what a snapshot would scrub', async () => {
		const preview = await api.snapshots.previewScrub({
			sandbox: rigId,
			by: 'id',
		});
		expect(typeof preview).toBe('object');
	});

	it('stops the rig and starts it again with its files', async () => {
		// In the home folder: /tmp is cleared when the VM boots again.
		const marker = `~/corsair-${RUN}.txt`;
		const write = await api.commandRuns.create({
			rig_id: rigId,
			command: `echo kept > ${marker}`,
			timeout_ms: 60_000,
		});
		let current = await api.commandRuns.get({ id: String(write.id) });
		while (current.status !== 'completed') {
			await sleep(2_000);
			current = await api.commandRuns.get({ id: String(write.id) });
		}
		await api.rigs.stop({ id: rigId, by: 'id' });
		await waitFor('stopped', 5 * 60_000);
		await api.rigs.start({ id: rigId, by: 'id' });
		await waitFor('running');
		const read = await api.commandRuns.create({
			rig_id: rigId,
			command: `cat ${marker}`,
			timeout_ms: 60_000,
		});
		current = await api.commandRuns.get({ id: String(read.id) });
		while (current.status !== 'completed') {
			await sleep(2_000);
			current = await api.commandRuns.get({ id: String(read.id) });
		}
		expect(current.conclusion).toBe('success');
		const events = await api.commandRuns.listEvents({ id: String(read.id) });
		expect(JSON.stringify(events.items).includes('kept')).toBe(true);
	});

	it('snapshots the rig (keeping it), reads the snapshot and deletes it', async () => {
		const snapshotName = SNAPSHOT;
		const made = await api.snapshots.create({
			sandbox_id: rigId,
			name: snapshotName,
			mode: 'full',
			description: 'corsair plugin live test',
		});
		// Registered before anything else can fail, so afterAll removes it.
		snapshotMade = true;
		expect(made.snapshot ?? made.id).toBeTruthy();
		let snapshot = await api.snapshots.get({ ref: snapshotName });
		const start = Date.now();
		while (/pend|progress|captur|creat|queue/i.test(String(snapshot.state))) {
			if (Date.now() - start > 10 * 60_000)
				throw new Error(`snapshot still ${snapshot.state}`);
			await sleep(5_000);
			snapshot = await api.snapshots.get({ ref: snapshotName });
		}
		console.log(`[amika] snapshot state: ${snapshot.state}`);
		expect(/fail|error/i.test(String(snapshot.state))).toBe(false);
		const listed = await api.snapshots.list({});
		expect(JSON.stringify(listed.items).includes(snapshotName)).toBe(true);
		await expect(api.snapshots.delete({ ref: snapshotName })).resolves.toEqual({
			success: true,
		});
		snapshotMade = false;
		expect(await statusOf(api.snapshots.get({ ref: snapshotName }))).toBe(404);
	});

	it('deletes the rig', async () => {
		await api.rigs.delete({ id: rigId, by: 'id' });
		const id = rigId;
		rigId = '';
		const start = Date.now();
		for (;;) {
			const status = await statusOf(api.rigs.get({ id, by: 'id' }));
			if (status === 404) break;
			const rig = await api.rigs.get({ id, by: 'id' }).catch(() => undefined);
			if (rig?.status === 'deleted') break;
			if (Date.now() - start > 3 * 60_000) throw new Error('rig not deleted');
			await sleep(3_000);
		}
	});
});

liveAgent('Amika live API: Claude Code in a rig', () => {
	jest.setTimeout(20 * 60_000);
	const RIG = `${NAME}-agent`;
	let rigId = '';

	afterAll(async () => {
		if (rigId) await api.rigs.delete({ id: rigId, by: 'id' }).catch(() => {});
	});

	it('checks that the stored Claude credential can authenticate', async () => {
		const credentials = await api.agentCredentials.claude.list({});
		const credential = credentials.find((c) => c?.name === claudeCredential);
		expect(credential?.id).toBeTruthy();
		const check = await api.agentCredentials.claude.check({
			id: String(credential?.id),
		});
		expect(check.status).toBe('ok');
	});

	it('sends Claude Code a message in a new rig, then a follow-up in the same session', async () => {
		const rig = await api.rigs.create({
			name: RIG,
			preset: 'coder',
			amika_api_key: { mode: 'none' },
			auto_stop_interval: 10,
			agent_credentials: [
				// No `type`: Amika uses the named credential's own (OAuth or API key).
				{ kind: 'claude', name: claudeCredential },
			],
		});
		rigId = String(rig.id ?? '');
		let current = await api.rigs.get({ id: rigId, by: 'id' });
		const start = Date.now();
		while (
			current.status !== 'running' ||
			(current.setup_status != null && current.setup_status !== 'ok')
		) {
			if (String(current.setup_status ?? '').endsWith('-failed'))
				throw new Error(`rig setup ${current.setup_status}`);
			if (Date.now() - start > 10 * 60_000)
				throw new Error(`rig still ${current.status}`);
			await sleep(5_000);
			current = await api.rigs.get({ id: rigId, by: 'id' });
		}

		const word = `pong-${RUN}`;
		const first = await api.agentSessions.send({
			sandbox_id: rigId,
			agent: 'claude',
			model: 'haiku',
			effort: 'low',
			new_session: true,
			message: `Reply with exactly this word and nothing else: ${word}`,
		});
		expect(first.is_error).toBe(false);
		expect(first.sandbox_id).toBe(rigId);
		expect(first.created_sandbox).toBe(false);
		expect(String(first.response ?? '').includes(word)).toBe(true);
		expect(typeof first.usage?.output_tokens).toBe('number');

		const second = await api.agentSessions.send({
			sandbox_id: rigId,
			session_id: String(first.session_id ?? ''),
			agent: 'claude',
			model: 'haiku',
			effort: 'low',
			message:
				'What exact word did you reply with in your previous message? Answer with that word only.',
		});
		expect(second.is_error).toBe(false);
		expect(second.session_id).toBe(first.session_id);
		expect(second.is_new_session).toBe(false);
		// The second turn remembers the first: the session carries its context.
		expect(String(second.response ?? '').includes(word)).toBe(true);

		const session = await api.agentSessions.get({
			id: String(first.session_id ?? ''),
		});
		expect((session.messages?.length ?? 0) >= 2).toBe(true);
		expect(JSON.stringify(session.messages).includes(word)).toBe(true);
		const listed = await api.agentSessions.list({ limit: 10 });
		expect(
			(listed.sessions ?? []).some((s) => s?.session_id === first.session_id),
		).toBe(true);
		const onRig = await api.rigs.sessions.list({ id: rigId, sandbox_by: 'id' });
		expect(
			JSON.stringify(onRig.sessions).includes(String(first.session_id)),
		).toBe(true);
		const latest = await api.rigs.sessions.getLatest({
			id: rigId,
			sandbox_by: 'id',
		});
		expect(JSON.stringify(latest).length > 2).toBe(true);
	});

	it('deletes the rig', async () => {
		await api.rigs.delete({ id: rigId, by: 'id' });
		rigId = '';
	});
});
