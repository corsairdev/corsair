import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { fly } from './index';
import { fixtures } from './test-fixtures';

const BASE = 'https://api.machines.dev';
const APP = 'corsair-plugin-test-342359';
const M = '8655775c930318';
const VOL = 'vol_40om2pydqxzy3en4';
const HOST = 'corsair-plugin-test-342359.example.com';

type Sent = {
	method: string;
	url: string;
	headers: Headers;
	body: unknown;
};
let sent: Sent[] = [];
let replies: Response[] = [];

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
// Fly sends a JSON content type with an empty body on 202 and 204.
const empty = (status: number) =>
	new Response(status === 204 ? null : '', {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});

beforeEach(() => {
	sent = [];
	replies = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		sent.push({
			method: init?.method ?? 'GET',
			url: String(input),
			headers: new Headers(init?.headers),
			body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
		});
		const reply = replies.shift();
		// No test may reach the network: an unplanned request fails loudly.
		if (!reply) throw new Error(`unexpected request ${String(input)}`);
		return reply;
	});
	jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

const apiWith = (key: string) =>
	createCorsair({ plugins: [fly({ key })] }).fly.api;
const api = apiWith('FlyV1 fm2_test-token');

// The table mixes every operation's input and output; each call below is
// still typed by its own endpoint and validated against its own schema.
type Case = {
	op: string;
	reply: Response;
	call: () => Promise<unknown>;
	method: string;
	path: string;
	body?: unknown;
	expectOut: (out: never) => void;
};

const t = { app_name: APP, machine_id: M };
const v = { app_name: APP, volume_id: VOL };
const mp = `/v1/apps/${APP}/machines/${M}`;
const vp = `/v1/apps/${APP}/volumes/${VOL}`;

const cases: Case[] = [
	// apps
	{
		op: 'apps.list',
		reply: json(fixtures.appsList),
		call: () => api.apps.list({ org_slug: 'personal', limit: 1 }),
		method: 'GET',
		path: '/v1/apps?org_slug=personal&limit=1',
		expectOut: (out: { apps: { name: string }[]; total_apps: number }) => {
			expect(out.apps[0]?.name).toBe(APP);
			expect(out.total_apps).toBe(1);
		},
	},
	{
		op: 'apps.create',
		reply: json(fixtures.appCreated, 201),
		call: () => api.apps.create({ name: APP, org_slug: 'personal' }),
		method: 'POST',
		path: '/v1/apps',
		body: { name: APP, org_slug: 'personal' },
		expectOut: (out: { id: string; created_at: number }) =>
			expect(out).toEqual({
				id: 'mkp2980dz2wpqorx',
				created_at: 1794768062000,
			}),
	},
	{
		op: 'apps.get',
		reply: json(fixtures.app),
		call: () => api.apps.get({ app_name: APP }),
		method: 'GET',
		path: `/v1/apps/${APP}`,
		expectOut: (out: { status: string; organization: { slug: string } }) => {
			expect(out.status).toBe('pending');
			expect(out.organization.slug).toBe('corsair-plugin-test');
		},
	},
	{
		op: 'apps.delete',
		reply: empty(202),
		call: () => api.apps.delete({ app_name: APP }),
		method: 'DELETE',
		path: `/v1/apps/${APP}`,
		expectOut: (out: unknown) =>
			expect(out).toEqual({ app_name: APP, accepted: true }),
	},
	// machines
	{
		op: 'machines.list',
		reply: json(fixtures.machinesList),
		call: () =>
			api.machines.list({
				app_name: APP,
				state: ['started', 'stopped'],
				metadata: { purpose: 'corsair-plugin-test' },
			}),
		method: 'GET',
		path: `/v1/apps/${APP}/machines?state=started%2Cstopped&metadata.purpose=corsair-plugin-test`,
		expectOut: (out: { id: string }[]) => expect(out[0]?.id).toBe(M),
	},
	{
		op: 'machines.listForOrg',
		reply: json(fixtures.orgMachines),
		call: () =>
			api.machines.listForOrg({
				org_slug: 'corsair-plugin-test',
				region: 'iad',
				limit: 5,
			}),
		method: 'GET',
		path: '/v1/orgs/corsair-plugin-test/machines?region=iad&limit=5',
		expectOut: (out: {
			machines: { app_name: string }[];
			next_cursor?: string;
		}) => {
			expect(out.machines[0]?.app_name).toBe(APP);
			expect(out.next_cursor).toBeUndefined();
		},
	},
	{
		op: 'machines.create',
		reply: json(fixtures.machine),
		call: () =>
			api.machines.create({
				app_name: APP,
				region: 'iad',
				config: {
					image: 'nginx:alpine',
					guest: { cpu_kind: 'shared', cpus: 1, memory_mb: 256 },
					mounts: [{ volume: VOL, path: '/data' }],
				},
			}),
		method: 'POST',
		path: `/v1/apps/${APP}/machines`,
		body: {
			region: 'iad',
			config: {
				image: 'nginx:alpine',
				guest: { cpu_kind: 'shared', cpus: 1, memory_mb: 256 },
				mounts: [{ volume: VOL, path: '/data' }],
			},
		},
		expectOut: (out: {
			state: string;
			config: { mounts: { volume: string }[] };
			image_ref: { repository: string };
		}) => {
			expect(out.state).toBe('created');
			expect(out.config.mounts[0]?.volume).toBe(VOL);
			expect(out.image_ref.repository).toBe('library/nginx');
		},
	},
	{
		op: 'machines.get',
		reply: json(fixtures.machine),
		call: () => api.machines.get({ ...t, include_leases: true }),
		method: 'GET',
		path: `${mp}?include_leases=true`,
		expectOut: (out: { id: string; events: unknown[] }) => {
			expect(out.id).toBe(M);
			expect(out.events).toHaveLength(3);
		},
	},
	{
		op: 'machines.update',
		reply: json(fixtures.machine),
		call: () =>
			api.machines.update({
				...t,
				config: { image: 'nginx:alpine', env: { A: '1' } },
				skip_launch: true,
				current_version: '01M7G872N0SMQY8VVCWXZCAWE3',
				lease_nonce: 'ba8da990b30a',
			}),
		method: 'POST',
		path: mp,
		body: {
			config: { image: 'nginx:alpine', env: { A: '1' } },
			skip_launch: true,
			current_version: '01M7G872N0SMQY8VVCWXZCAWE3',
		},
		expectOut: (out: { id: string }) => expect(out.id).toBe(M),
	},
	{
		op: 'machines.delete',
		reply: json(fixtures.ok),
		call: () => api.machines.delete({ ...t, force: true }),
		method: 'DELETE',
		path: `${mp}?force=true`,
		expectOut: (out: unknown) => expect(out).toEqual({ ok: true }),
	},
	{
		op: 'machines.start',
		reply: json(fixtures.started),
		call: () => api.machines.start(t),
		method: 'POST',
		path: `${mp}/start`,
		expectOut: (out: { previous_state: string }) =>
			expect(out.previous_state).toBe('suspended'),
	},
	{
		op: 'machines.stop',
		reply: json(fixtures.ok),
		call: () => api.machines.stop({ ...t, signal: 'SIGTERM', timeout: '5s' }),
		method: 'POST',
		path: `${mp}/stop`,
		body: { signal: 'SIGTERM', timeout: '5s' },
		expectOut: (out: unknown) => expect(out).toEqual({ ok: true }),
	},
	{
		op: 'machines.restart',
		reply: json(fixtures.ok),
		call: () => api.machines.restart({ ...t, signal: 'SIGINT' }),
		method: 'POST',
		path: `${mp}/restart?signal=SIGINT`,
		expectOut: (out: unknown) => expect(out).toEqual({ ok: true }),
	},
	{
		op: 'machines.suspend',
		reply: json(fixtures.ok),
		call: () => api.machines.suspend(t),
		method: 'POST',
		path: `${mp}/suspend`,
		expectOut: (out: unknown) => expect(out).toEqual({ ok: true }),
	},
	{
		op: 'machines.signal',
		reply: json(fixtures.ok),
		call: () => api.machines.signal({ ...t, signal: 'SIGHUP' }),
		method: 'POST',
		path: `${mp}/signal`,
		body: { signal: 'SIGHUP' },
		expectOut: (out: unknown) => expect(out).toEqual({ ok: true }),
	},
	{
		op: 'machines.wait',
		reply: json(fixtures.waited),
		call: () => api.machines.wait({ ...t, state: ['started'], timeout: 30 }),
		method: 'GET',
		path: `${mp}/wait?timeout=30&state=started`,
		expectOut: (out: { state: string }) => expect(out.state).toBe('started'),
	},
	{
		op: 'machines.cordon',
		reply: json(fixtures.ok),
		call: () => api.machines.cordon(t),
		method: 'POST',
		path: `${mp}/cordon`,
		expectOut: (out: unknown) => expect(out).toEqual({ ok: true }),
	},
	{
		op: 'machines.uncordon',
		reply: json(fixtures.ok),
		call: () => api.machines.uncordon(t),
		method: 'POST',
		path: `${mp}/uncordon`,
		expectOut: (out: unknown) => expect(out).toEqual({ ok: true }),
	},
	{
		op: 'machines.exec',
		reply: json(fixtures.exec),
		call: () => api.machines.exec({ ...t, command: ['nginx', '-v'] }),
		method: 'POST',
		path: `${mp}/exec`,
		body: { command: ['nginx', '-v'] },
		expectOut: (out: { exit_code: number; stderr: string }) => {
			expect(out.exit_code).toBe(0);
			expect(out.stderr).toContain('nginx version');
		},
	},
	{
		op: 'machines.getLease',
		reply: json(fixtures.lease),
		call: () => api.machines.getLease(t),
		method: 'GET',
		path: `${mp}/lease`,
		expectOut: (out: { status: string }) => expect(out.status).toBe('success'),
	},
	{
		op: 'machines.createLease',
		reply: json(fixtures.leaseCreated, 201),
		call: () =>
			api.machines.createLease({ ...t, ttl: 60, description: 'test' }),
		method: 'POST',
		path: `${mp}/lease`,
		body: { ttl: 60, description: 'test' },
		expectOut: (out: { data: { nonce: string; expires_at: number } }) => {
			expect(out.data.nonce).toBe('ba8da990b30a');
			expect(out.data.expires_at).toBe(1794768158);
		},
	},
	{
		op: 'machines.releaseLease',
		reply: json(fixtures.leaseReleased),
		call: () =>
			api.machines.releaseLease({ ...t, lease_nonce: 'ba8da990b30a' }),
		method: 'DELETE',
		path: `${mp}/lease`,
		expectOut: (out: unknown) =>
			expect(out).toEqual({ status: 'success', data: { ok: true } }),
	},
	{
		op: 'machines.getMetadata',
		reply: json(fixtures.metadata),
		call: () => api.machines.getMetadata(t),
		method: 'GET',
		path: `${mp}/metadata`,
		expectOut: (out: Record<string, string>) =>
			expect(out.purpose).toBe('corsair-plugin-test'),
	},
	{
		op: 'machines.getMetadataKey',
		reply: json(fixtures.metadataValue),
		call: () => api.machines.getMetadataKey({ ...t, key: 'role' }),
		method: 'GET',
		path: `${mp}/metadata/role`,
		expectOut: (out: unknown) => expect(out).toEqual({ value: 'test' }),
	},
	{
		op: 'machines.updateMetadata',
		reply: empty(204),
		call: () =>
			api.machines.updateMetadata({
				...t,
				metadata: { tier: 'free', role: '' },
			}),
		method: 'PATCH',
		path: `${mp}/metadata`,
		body: { metadata: { tier: 'free', role: '' } },
		expectOut: (out: unknown) =>
			expect(out).toEqual({ updated: ['tier', 'role'] }),
	},
	{
		op: 'machines.setMetadataKey',
		reply: empty(204),
		call: () =>
			api.machines.setMetadataKey({ ...t, key: 'role', value: 'test' }),
		method: 'POST',
		path: `${mp}/metadata/role`,
		body: { value: 'test' },
		expectOut: (out: unknown) =>
			expect(out).toEqual({ key: 'role', value: 'test' }),
	},
	{
		op: 'machines.deleteMetadataKey',
		reply: empty(204),
		call: () => api.machines.deleteMetadataKey({ ...t, key: 'tier' }),
		method: 'DELETE',
		path: `${mp}/metadata/tier`,
		expectOut: (out: unknown) => expect(out).toEqual({ deleted: 'tier' }),
	},
	{
		op: 'machines.listEvents',
		reply: json(fixtures.events),
		call: () => api.machines.listEvents({ ...t, limit: 10 }),
		method: 'GET',
		path: `${mp}/events?limit=10`,
		expectOut: (out: { type: string; request?: unknown }[]) => {
			expect(out).toHaveLength(4);
			expect(out[0]?.type).toBe('start');
		},
	},
	{
		op: 'machines.listProcesses',
		reply: json(fixtures.processes),
		call: () =>
			api.machines.listProcesses({ ...t, sort_by: 'cpu', order: 'desc' }),
		method: 'GET',
		path: `${mp}/ps?sort_by=cpu&order=desc`,
		expectOut: (out: { listen_sockets: { address: string }[] }[]) =>
			expect(out[0]?.listen_sockets[0]?.address).toBe('0.0.0.0:80'),
	},
	{
		op: 'machines.listVersions',
		reply: json(fixtures.versions),
		call: () => api.machines.listVersions(t),
		method: 'GET',
		path: `${mp}/versions`,
		expectOut: (out: { version: string }[]) =>
			expect(out[0]?.version).toBe('01M7G872N0SMQY8VVCWXZCAWE3'),
	},
	// volumes
	{
		op: 'volumes.list',
		reply: json(fixtures.volumesList),
		call: () => api.volumes.list({ app_name: APP }),
		method: 'GET',
		path: `/v1/apps/${APP}/volumes`,
		expectOut: (out: { id: string }[]) => expect(out[0]?.id).toBe(VOL),
	},
	{
		op: 'volumes.listForOrg',
		reply: json(fixtures.orgVolumes),
		call: () =>
			api.volumes.listForOrg({ org_slug: 'corsair-plugin-test', limit: 5 }),
		method: 'GET',
		path: '/v1/orgs/corsair-plugin-test/volumes?limit=5',
		expectOut: (out: { volumes: { app_name: string }[] }) =>
			expect(out.volumes[0]?.app_name).toBe(APP),
	},
	{
		op: 'volumes.create',
		reply: json(fixtures.volume),
		call: () =>
			api.volumes.create({
				app_name: APP,
				name: 'plugin_test',
				size_gb: 1,
				region: 'iad',
			}),
		method: 'POST',
		path: `/v1/apps/${APP}/volumes`,
		body: { name: 'plugin_test', size_gb: 1, region: 'iad' },
		expectOut: (out: { state: string; size_gb: number }) => {
			expect(out.state).toBe('created');
			expect(out.size_gb).toBe(1);
		},
	},
	{
		op: 'volumes.get',
		reply: json(fixtures.volume),
		call: () => api.volumes.get(v),
		method: 'GET',
		path: vp,
		expectOut: (out: { id: string }) => expect(out.id).toBe(VOL),
	},
	{
		op: 'volumes.update',
		reply: json({ ...fixtures.volume, snapshot_retention: 1 }),
		call: () => api.volumes.update({ ...v, snapshot_retention: 1 }),
		method: 'PUT',
		path: vp,
		body: { snapshot_retention: 1 },
		expectOut: (out: { snapshot_retention: number }) =>
			expect(out.snapshot_retention).toBe(1),
	},
	{
		op: 'volumes.delete',
		reply: json(fixtures.volumeDeleted),
		call: () => api.volumes.delete(v),
		method: 'DELETE',
		path: vp,
		expectOut: (out: { state: string }) => expect(out.state).toBe('destroyed'),
	},
	{
		op: 'volumes.extend',
		reply: json(fixtures.volumeExtended),
		call: () => api.volumes.extend({ ...v, size_gb: 2 }),
		method: 'PUT',
		path: `${vp}/extend`,
		body: { size_gb: 2 },
		expectOut: (out: {
			volume: { size_gb: number };
			needs_restart: boolean;
		}) => {
			expect(out.volume.size_gb).toBe(2);
			expect(out.needs_restart).toBe(false);
		},
	},
	{
		op: 'volumes.listSnapshots',
		reply: json(fixtures.snapshots),
		call: () => api.volumes.listSnapshots(v),
		method: 'GET',
		path: `${vp}/snapshots`,
		expectOut: (out: { id: string; status: string }[]) =>
			expect(out[0]).toMatchObject({
				id: 'vs_KDPAL5K6GPlbczmgAaq27',
				status: 'running',
			}),
	},
	{
		op: 'volumes.createSnapshot',
		reply: json(fixtures.snapshotCreated),
		call: () => api.volumes.createSnapshot(v),
		method: 'POST',
		path: `${vp}/snapshots`,
		expectOut: (out: unknown) =>
			expect(out).toEqual({
				volume_id: VOL,
				snapshot_id: 'vs_KDPAL5K6GPlbczmgAaq27',
				state: 'prepare',
			}),
	},
	// secrets
	{
		op: 'secrets.list',
		reply: json(fixtures.secretsList),
		call: () => api.secrets.list({ app_name: APP }),
		method: 'GET',
		path: `/v1/apps/${APP}/secrets`,
		expectOut: (out: { secrets: { name: string }[] }) =>
			expect(out.secrets[0]?.name).toBe('TEST_SECRET'),
	},
	{
		op: 'secrets.get',
		reply: json(fixtures.secretGet),
		call: () => api.secrets.get({ app_name: APP, name: 'TEST_SECRET' }),
		method: 'GET',
		path: `/v1/apps/${APP}/secrets/TEST_SECRET`,
		expectOut: (out: { digest: string }) => expect(out.digest).toBeTruthy(),
	},
	{
		op: 'secrets.set',
		reply: json(fixtures.secretSet, 201),
		call: () =>
			api.secrets.set({
				app_name: APP,
				name: 'TEST_SECRET',
				value: 'plugin-test-value',
			}),
		method: 'POST',
		path: `/v1/apps/${APP}/secrets/TEST_SECRET`,
		body: { value: 'plugin-test-value' },
		expectOut: (out: Record<string, unknown>) => {
			expect(out.version).toBe(140586326);
			// Fly echoes the value; the plugin never returns it.
			expect(out).not.toHaveProperty('value');
			expect(JSON.stringify(out)).not.toContain('plugin-test-value');
		},
	},
	{
		op: 'secrets.update',
		reply: json(fixtures.secretsUpdate),
		call: () =>
			api.secrets.update({
				app_name: APP,
				values: { SECOND_SECRET: 'b', TEST_SECRET: null },
			}),
		method: 'POST',
		path: `/v1/apps/${APP}/secrets`,
		body: { values: { SECOND_SECRET: 'b', TEST_SECRET: null } },
		expectOut: (out: {
			version: number;
			secrets: Record<string, unknown>[];
		}) => {
			expect(out.version).toBe(140586346);
			expect(out.secrets[0]).not.toHaveProperty('value');
		},
	},
	{
		op: 'secrets.delete',
		reply: json(fixtures.secretDeleted),
		call: () => api.secrets.delete({ app_name: APP, name: 'SECOND_SECRET' }),
		method: 'DELETE',
		path: `/v1/apps/${APP}/secrets/SECOND_SECRET`,
		expectOut: (out: unknown) => expect(out).toEqual({ version: 140586356 }),
	},
	// certificates
	{
		op: 'certificates.list',
		reply: json(fixtures.certificatesList),
		call: () => api.certificates.list({ app_name: APP, filter: 'example' }),
		method: 'GET',
		path: `/v1/apps/${APP}/certificates?filter=example`,
		expectOut: (out: { certificates: { hostname: string }[] }) =>
			expect(out.certificates[0]?.hostname).toBe(HOST),
	},
	{
		op: 'certificates.get',
		reply: json(fixtures.certificate),
		call: () => api.certificates.get({ app_name: APP, hostname: HOST }),
		method: 'GET',
		path: `/v1/apps/${APP}/certificates/${HOST}`,
		expectOut: (out: { status: string; configured: boolean }) =>
			expect(out).toMatchObject({
				status: 'Awaiting configuration',
				configured: false,
			}),
	},
	{
		op: 'certificates.request',
		reply: json(fixtures.certificateRequested, 201),
		call: () => api.certificates.request({ app_name: APP, hostname: HOST }),
		method: 'POST',
		path: `/v1/apps/${APP}/certificates/acme`,
		body: { hostname: HOST },
		expectOut: (out: {
			acme_requested: boolean;
			dns_requirements: { a: string[] };
		}) => {
			expect(out.acme_requested).toBe(true);
			expect(out.dns_requirements.a).toEqual(['66.241.124.47']);
		},
	},
	{
		op: 'certificates.check',
		reply: json(fixtures.certificateCheck),
		call: () => api.certificates.check({ app_name: APP, hostname: HOST }),
		method: 'POST',
		path: `/v1/apps/${APP}/certificates/${HOST}/check`,
		expectOut: (out: {
			dns_records: { soa: string };
			validation_errors: { code: string }[];
		}) => {
			expect(out.dns_records.soa).toBe('elliott.ns.cloudflare.com');
			expect(out.validation_errors[0]?.code).toBe('IPV6_NOT_ALLOCATED');
		},
	},
	{
		op: 'certificates.delete',
		reply: empty(204),
		call: () => api.certificates.delete({ app_name: APP, hostname: HOST }),
		method: 'DELETE',
		path: `/v1/apps/${APP}/certificates/${HOST}`,
		expectOut: (out: unknown) =>
			expect(out).toEqual({ hostname: HOST, deleted: true }),
	},
	// IP assignments
	{
		op: 'ipAssignments.list',
		reply: json(fixtures.ipList),
		call: () => api.ipAssignments.list({ app_name: APP }),
		method: 'GET',
		path: `/v1/apps/${APP}/ip_assignments`,
		expectOut: (out: {
			ips: { shared: boolean; created_at: string | null }[];
		}) => {
			expect(out.ips).toHaveLength(2);
			expect(out.ips[1]).toMatchObject({ shared: true, created_at: null });
		},
	},
	{
		op: 'ipAssignments.create',
		reply: json(fixtures.ipCreated),
		call: () => api.ipAssignments.create({ app_name: APP, type: 'v6' }),
		method: 'POST',
		path: `/v1/apps/${APP}/ip_assignments`,
		body: { type: 'v6' },
		expectOut: (out: { region: string }) => expect(out.region).toBe('global'),
	},
	{
		op: 'ipAssignments.delete',
		reply: empty(204),
		call: () =>
			api.ipAssignments.delete({
				app_name: APP,
				ip: '2a09:8280:1::207:cc01:0',
			}),
		method: 'DELETE',
		path: `/v1/apps/${APP}/ip_assignments/2a09%3A8280%3A1%3A%3A207%3Acc01%3A0`,
		expectOut: (out: unknown) =>
			expect(out).toEqual({ ip: '2a09:8280:1::207:cc01:0', released: true }),
	},
	// tokens and platform
	{
		op: 'tokens.current',
		reply: json(fixtures.tokenCurrent),
		call: () => api.tokens.current({}),
		method: 'GET',
		path: '/v1/tokens/current',
		expectOut: (out: { tokens: { org_slug: string }[] }) =>
			expect(out.tokens[0]?.org_slug).toBe('corsair-plugin-test'),
	},
	{
		op: 'platform.regions',
		reply: json(fixtures.regions),
		call: () => api.platform.regions({}),
		method: 'GET',
		path: '/v1/platform/regions',
		expectOut: (out: { Regions: { code: string }[]; nearest: string }) => {
			expect(out.Regions[0]?.code).toBe('ams');
			expect(out.nearest).toBeTruthy();
		},
	},
];

describe('Fly Machines API endpoints', () => {
	it('has one case for every operation', () => {
		const ops = Object.keys(fly().endpointMeta ?? {}).sort();
		expect([...new Set(cases.map((c) => c.op))].sort()).toEqual(ops);
		expect(ops).toHaveLength(54);
	});

	it.each(cases.map((c) => [c.op, c] as const))(
		'%s sends the documented request and parses the live response',
		async (_op, c) => {
			replies.push(c.reply);
			const out = await c.call();
			expect(sent).toHaveLength(1);
			const [req] = sent;
			expect(req?.method).toBe(c.method);
			expect(req?.url).toBe(`${BASE}${c.path}`);
			expect(req?.headers.get('authorization')).toBe('FlyV1 fm2_test-token');
			expect(req?.body).toEqual(c.body);
			c.expectOut(out as never);
		},
	);
});

describe('Fly requests', () => {
	it('sends a plain token after Bearer and a FlyV1 macaroon unchanged', async () => {
		replies.push(json(fixtures.tokenCurrent), json(fixtures.tokenCurrent));
		await apiWith('plain-org-token').tokens.current({});
		await apiWith('  FlyV1 fm2_abc  ').tokens.current({});
		expect(sent[0]?.headers.get('authorization')).toBe(
			'Bearer plain-org-token',
		);
		expect(sent[1]?.headers.get('authorization')).toBe('FlyV1 fm2_abc');
	});

	it('sends the lease nonce header only when one is given', async () => {
		replies.push(json(fixtures.ok), json(fixtures.ok));
		await api.machines.delete({ ...t, lease_nonce: 'nonce-1' });
		await api.machines.delete(t);
		expect(sent[0]?.headers.get('fly-machine-lease-nonce')).toBe('nonce-1');
		expect(sent[1]?.headers.get('fly-machine-lease-nonce')).toBeNull();
	});

	it('encodes path values so input cannot reach another route', async () => {
		replies.push(json(fixtures.app));
		await api.apps.get({ app_name: '../orgs/x?y' });
		expect(sent[0]?.url).toBe(`${BASE}/v1/apps/..%2Forgs%2Fx%3Fy`);
	});

	it('passes core ApiError through with status and Fly message', async () => {
		replies.push(
			json({ error: 'machine not found' }, 404),
			json({ error: 'failed to delete: machine still active, refusing' }, 412),
		);
		const notFound = await api.machines.get(t).catch((e: unknown) => e);
		expect(notFound).toBeInstanceOf(ApiError);
		expect((notFound as ApiError).status).toBe(404);
		const precondition = await api.machines.delete(t).catch((e: unknown) => e);
		expect(precondition).toBeInstanceOf(ApiError);
		expect((precondition as ApiError).status).toBe(412);
	});

	it('rejects bad input before any request', async () => {
		await expect(api.apps.get({ app_name: ' ' })).rejects.toThrow();
		await expect(
			api.volumes.create({ app_name: APP, name: 'Bad-Name', size_gb: 1 }),
		).rejects.toThrow();
		await expect(
			api.certificates.request({ app_name: APP, hostname: 'x.fly.dev' }),
		).rejects.toThrow();
		await expect(api.machines.wait({ ...t, timeout: 120 })).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});

	it('raises AuthMissingError when no key is stored', async () => {
		const plugin = fly();
		const keys = { get_api_key: async () => null };
		await expect(
			plugin.keyBuilder?.({ authType: 'api_key', keys } as never, 'endpoint'),
		).rejects.toThrow(/fly/i);
	});
});
