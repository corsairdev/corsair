#!/usr/bin/env node
/**
 * Drives `corsairCloud().manage.*` against a live Corsair Cloud project.
 *
 * The HTTP surface has its own smoke (hub `scripts/v1-smoke.mjs`); this one
 * exercises the typed client over the same routes, so it catches what that
 * cannot: base-URL derivation, snake_case mapping, cursor round-trips,
 * idempotency headers, and the error envelope becoming a ManagementApiError.
 *
 *   CORSAIR_CLOUD_KEY=ck_cloud_<slug>.<secret> node packages/corsair/scripts/cloud-smoke.mjs
 *
 * Writes only resources named `smoke-<rand>` and deletes them again. Pass
 * --keep to leave them for inspection, --verbose to print every payload.
 */
import { corsairCloud } from '../dist/index.js';

const KEY = process.env.CORSAIR_CLOUD_KEY?.trim();
if (!KEY) {
	console.error('CORSAIR_CLOUD_KEY is required (ck_cloud_<slug>.<secret>).');
	process.exit(2);
}

const argv = new Set(process.argv.slice(2));
const KEEP = argv.has('--keep');
const VERBOSE = argv.has('--verbose');
// Writes that mark the project `pending` and trigger a real re-apply stay
// opt-in, matching the HTTP smoke.
const WRITE_INSTANCES = argv.has('--write-instances');

const tag = `smoke-${Math.random().toString(36).slice(2, 8)}`;
const corsair = corsairCloud({ apiKey: KEY });

let pass = 0;
const failures = [];
const timings = [];

async function check(name, fn) {
	const started = Date.now();
	try {
		const value = await fn();
		timings.push(Date.now() - started);
		pass++;
		console.log(`  ok   ${name}`);
		if (VERBOSE) console.log(`       ${JSON.stringify(value)?.slice(0, 300)}`);
		return value;
	} catch (err) {
		timings.push(Date.now() - started);
		const detail = err?.status
			? `${err.status} ${err.code}: ${err.message}`
			: err?.message;
		failures.push(`${name} — ${detail}`);
		console.log(`  FAIL ${name}\n       ${detail}`);
		return undefined;
	}
}

/** Asserts inside a check: throws so the check records the reason. */
function expect(cond, why) {
	if (!cond) throw new Error(why);
}

const section = (name) => console.log(`\n${name}`);

// ---------------------------------------------------------------- read paths

section('project');

const project = await check(
	'project.get returns the slug and limits',
	async () => {
		const p = await corsair.manage.project.get();
		expect(typeof p.id === 'string' && p.id.length > 0, 'no id');
		expect(typeof p.instanceCount === 'number', 'instanceCount not a number');
		expect(
			p.managedIntegrations && 'used' in p.managedIntegrations,
			'no managedIntegrations',
		);
		return p;
	},
);

// Embeds were written from reading the hub's toObject, never from a real
// response — so their shape is the thing most worth asserting here.
await check('project.get embeds the five preview lists', async () => {
	expect(project, 'project.get failed');
	for (const k of ['instances', 'tenants', 'access', 'connections', 'links']) {
		expect(Array.isArray(project[k]?.data), `${k} is not a page`);
		expect(project[k].nextCursor === null, `${k} carried a cursor`);
	}
	return Object.fromEntries(
		['instances', 'tenants', 'access', 'connections', 'links'].map((k) => [
			k,
			project[k].data.length,
		]),
	);
});

await check('keys.get returns this project key', async () => {
	const k = await corsair.manage.keys.get();
	expect(k.projectKey === KEY, 'returned key is not the one we sent');
	return { projectKey: `${k.projectKey.slice(0, 16)}…` };
});

section('instances');

const instances = await check('instances.list pages', async () => {
	const page = await corsair.manage.instances.list();
	expect(Array.isArray(page.data), 'not a page');
	expect(typeof page.hasMore === 'boolean', 'hasMore missing');
	return page.data.map((i) => i.instanceKey);
});

const instanceKey = instances?.[0];

await check('instances.get round-trips one instance', async () => {
	expect(instanceKey, 'project has no instances');
	const i = await corsair.manage.instances.get(instanceKey);
	expect(i.instanceKey === instanceKey, 'wrong instance');
	// null until deployed; either is valid, a missing field is not
	expect('url' in i, 'url field absent');
	return {
		key: i.instanceKey,
		url: i.url,
		credentialSource: i.credentialSource,
	};
});

await check('instances.list honours limit', async () => {
	const page = await corsair.manage.instances.list({ limit: 1 });
	expect(page.data.length <= 1, 'limit ignored');
	return { got: page.data.length, hasMore: page.hasMore };
});

section('integrations');

await check('integrations.catalog lists providers', async () => {
	const page = await corsair.manage.integrations.catalog({ limit: 5 });
	expect(page.data.length > 0, 'empty catalog');
	const e = page.data[0];
	expect(typeof e.name === 'string', 'no display name');
	expect(Array.isArray(e.authTypes), 'authTypes not an array');
	expect(typeof e.managedAvailable === 'boolean', 'managedAvailable missing');
	return page.data.slice(0, 3).map((x) => `${x.id}(${x.authTypes.join('|')})`);
});

const integrations = await check(
	'integrations.list filters by instance',
	async () => {
		expect(instanceKey, 'no instance');
		const page = await corsair.manage.integrations.list({
			instance: instanceKey,
		});
		for (const i of page.data)
			expect(i.instance === instanceKey, 'filter leaked');
		return page.data.map((i) => `${i.integration}:${i.authType}`);
	},
);

await check(
	'integrations.get round-trips an instance:integration ref',
	async () => {
		const ref = integrations?.length
			? `${instanceKey}:${integrations[0].split(':')[0]}`
			: null;
		if (!ref) return 'skipped — no integrations configured';
		const got = await corsair.manage.integrations.get(ref);
		expect(got.id === ref, `id mismatch: ${got.id}`);
		// Credentials are write-only; only their presence may come back.
		expect(!('credentials' in got), 'credentials echoed back');
		return got;
	},
);

section('tenants and access');

const tenants = await check('tenants.list pages', async () => {
	const page = await corsair.manage.tenants.list({ limit: 5 });
	expect(Array.isArray(page.data), 'not a page');
	return page.data.map((t) => t.id);
});

// access.set upserts the tenant, so this is the one call that registers a
// user and grants it reach.
const accessRef = instanceKey ? `${instanceKey}:${tag}` : null;

await check('access.set creates the tenant and the line', async () => {
	expect(accessRef, 'no instance to grant on');
	const line = await corsair.manage.access.set(accessRef, {
		permission: 'readonly',
		label: 'v1 client smoke',
	});
	expect(line.id === accessRef, `id mismatch: ${line.id}`);
	expect(line.permission === 'readonly', 'permission not applied');
	expect(Array.isArray(line.connected), 'connected is not a list');
	expect(Array.isArray(line.expired), 'expired is not a list');
	return line;
});

await check('tenants.get finds the tenant access.set created', async () => {
	const t = await corsair.manage.tenants.get(tag);
	expect(t.id === tag, 'wrong tenant');
	return t;
});

await check('tenants.update changes the label', async () => {
	const t = await corsair.manage.tenants.update(tag, {
		label: 'v1 client smoke 2',
	});
	expect(t.label === 'v1 client smoke 2', `label not applied: ${t.label}`);
	return t;
});

await check('access.list filters by tenant', async () => {
	const page = await corsair.manage.access.list({ tenant: tag });
	expect(page.data.length >= 1, 'line not listed');
	for (const l of page.data) expect(l.tenant === tag, 'filter leaked');
	return page.data.map((l) => `${l.id}=${l.permission}`);
});

await check('access.set is an upsert, not a duplicate', async () => {
	const line = await corsair.manage.access.set(accessRef, {
		permission: 'readwrite',
	});
	expect(line.permission === 'readwrite', 'permission not raised');
	const page = await corsair.manage.access.list({ tenant: tag });
	expect(page.data.length === 1, `duplicated into ${page.data.length} lines`);
	return line;
});

section('connections');

await check('connections.list filters by tenant', async () => {
	const page = await corsair.manage.connections.list({ tenant: tag });
	// A fresh tenant has connected nothing; an empty page is the correct answer.
	expect(Array.isArray(page.data), 'not a page');
	expect(page.data.length === 0, 'fresh tenant already has connections');
	return page.data;
});

section('mcp links');

const link = await check('mcp.links.mint returns a scoped URL', async () => {
	const minted = await corsair.manage.mcp.links.mint({
		recipient: `${tag}@smoke.invalid`,
		instances: [{ instance: instanceKey, tenant: tag, permission: 'readonly' }],
		idempotencyKey: `${tag}-mint`,
	});
	expect(minted.url.includes('/mcp'), `url looks wrong: ${minted.url}`);
	expect(minted.instances.length === 1, 'line count wrong');
	expect(minted.instances[0].lostAccess === false, 'line reported as dead');
	return { id: minted.id, url: minted.url };
});

await check('mcp.links.mint replays on the same idempotency key', async () => {
	expect(link, 'mint failed');
	const again = await corsair.manage.mcp.links.mint({
		recipient: `${tag}@smoke.invalid`,
		instances: [{ instance: instanceKey, tenant: tag, permission: 'readonly' }],
		idempotencyKey: `${tag}-mint`,
	});
	expect(
		again.id === link.id,
		`minted a second link: ${again.id} vs ${link.id}`,
	);
	return { id: again.id, replayed: true };
});

await check('mcp.links.update renames without resending lines', async () => {
	const updated = await corsair.manage.mcp.links.update(link.id, {
		recipient: `${tag}-renamed@smoke.invalid`,
	});
	expect(updated.recipient === `${tag}-renamed@smoke.invalid`, 'rename failed');
	expect(
		updated.instances.length === 1,
		'lines were dropped by a partial update',
	);
	return updated.recipient;
});

await check(
	'mcp.links.rotate issues a new url for the same access',
	async () => {
		const rotated = await corsair.manage.mcp.links.rotate(link.id);
		expect(rotated.url !== link.url, 'url did not change');
		expect(rotated.instances.length === 1, 'access changed during rotate');
		link.id = rotated.id;
		return { id: rotated.id };
	},
);

await check('mcp.links.list finds it', async () => {
	const page = await corsair.manage.mcp.links.list({ tenant: tag });
	expect(
		page.data.some((l) => l.id === link.id),
		'rotated link not listed',
	);
	return page.data.map((l) => l.id);
});

section('errors');

await check('an unknown instance is a typed 404', async () => {
	try {
		await corsair.manage.instances.get(`${tag}-nope`);
	} catch (err) {
		expect(err.status === 404, `status ${err.status}`);
		expect(
			typeof err.code === 'string' && err.code.length > 0,
			'no machine code',
		);
		return { status: err.status, code: err.code, message: err.message };
	}
	throw new Error('expected a 404');
});

await check(
	'minting on an access line that does not exist is a 400',
	async () => {
		try {
			await corsair.manage.mcp.links.mint({
				instances: [
					{
						instance: instanceKey,
						tenant: `${tag}-absent`,
						permission: 'readonly',
					},
				],
			});
		} catch (err) {
			expect(err.status === 400, `status ${err.status}`);
			return { status: err.status, code: err.code, message: err.message };
		}
		throw new Error(
			'expected a 400 — a link must not name a line it does not hold',
		);
	},
);

await check('a bad key is a typed 401', async () => {
	const bad = corsairCloud({ apiKey: `${KEY}xxx` });
	try {
		await bad.manage.project.get();
	} catch (err) {
		expect(err.status === 401, `status ${err.status}`);
		return { status: err.status, code: err.code };
	}
	throw new Error('expected a 401');
});

if (WRITE_INSTANCES) {
	section('instances (write — marks the project pending)');
	await check('instances.create is idempotent by key', async () => {
		const made = await corsair.manage.instances.create({
			instanceKey: tag.replace(/_/g, '-'),
			idempotencyKey: `${tag}-inst`,
		});
		const again = await corsair.manage.instances.create({
			instanceKey: tag.replace(/_/g, '-'),
		});
		expect(again.instanceKey === made.instanceKey, 'second create diverged');
		return made.instanceKey;
	});
	await check('instances.delete removes it', async () => {
		const gone = await corsair.manage.instances.delete(tag.replace(/_/g, '-'));
		expect(gone.deleted === true, 'not deleted');
		return gone;
	});
}

// ------------------------------------------------------------------- cleanup

if (!KEEP) {
	section('cleanup');
	if (link?.id) {
		await check('mcp.links.revoke', async () => {
			const gone = await corsair.manage.mcp.links.revoke(link.id);
			expect(gone.deleted === true, 'not deleted');
			return gone;
		});
	}
	if (accessRef) {
		await check('access.delete', async () => {
			const gone = await corsair.manage.access.delete(accessRef);
			expect(gone.deleted === true, 'not deleted');
			return gone;
		});
	}
	await check('tenants.delete', async () => {
		const gone = await corsair.manage.tenants.delete(tag);
		expect(gone.deleted === true, 'not deleted');
		return gone;
	});
} else {
	console.log(
		`\nkeeping smoke resources: tenant ${tag}, link ${link?.id ?? '—'}`,
	);
}

// -------------------------------------------------------------------- report

const sorted = [...timings].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)] ?? 0;

console.log(
	`\n${pass} passed, ${failures.length} failed  ·  median ${median}ms`,
);
if (failures.length) {
	console.log('\nfailures:');
	for (const f of failures) console.log(`  - ${f}`);
	process.exit(1);
}
