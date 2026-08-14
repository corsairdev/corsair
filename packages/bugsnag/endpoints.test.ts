/**
 * Covers every operation: the method and path it calls, what it writes to the local
 * mirror, what it evicts, and exactly what reaches the event log.
 *
 * The coverage sweep asserts that the operations exercised here are precisely the
 * operations registered, so an operation cannot be added without a test.
 *
 * All ids and values are fictional.
 */
import { readFileSync } from 'node:fs';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { Collaborators, Organizations, Projects } from './endpoints';
import { BugsnagMirrorEvictionError } from './endpoints/persist';
import {
	errorHandlers,
	isNonIdempotent,
	isRouteMissing,
} from './error-handlers';
import { bugsnagEndpointMeta } from './index';

// The event-log payload is asserted directly further down: it is the one place
// caller-supplied text or a secret could leak into durable storage, so it needs to
// be inspected rather than inferred.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const BASE = 'https://api.bugsnag.com';
const ORG = 'organization-1';
const PROJECT = 'project-1';
const COLLABORATOR = 'collaborator-1';

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

const makeStore = (): Store => ({
	upsertByEntityId: jest.fn(async () => undefined),
	deleteByEntityId: jest.fn(async () => true),
});

type Ctx = Parameters<typeof Organizations.list>[0];

function makeCtx() {
	const db = {
		organizations: makeStore(),
		projects: makeStore(),
		collaborators: makeStore(),
	};
	const ctx = { key: 'test-token', db } as unknown as Ctx;
	return { ctx, db };
}

let captured: { url: string; method: string; body?: string } | undefined;

/** Answers every request with `payload`, recording what was asked for. */
function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

/* ------------------------------ canned records ---------------------------- */

const organization = {
	id: ORG,
	name: 'Example Org',
	slug: 'example-org',
	api_key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	billing_emails: ['billing@example.com'],
	creator: {
		id: COLLABORATOR,
		name: 'Test Tester',
		email: 'tester@example.com',
	},
};
const project = {
	id: PROJECT,
	organization_id: ORG,
	name: 'Example App',
	type: 'android',
	api_key: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
	upload_api_key: 'cccccccccccccccccccccccccccccccc',
};
const collaborator = {
	id: COLLABORATOR,
	name: 'Test Tester',
	email: 'tester@example.com',
	project_ids: [PROJECT],
};

/** Every registered operation with the request it is expected to make. */
const OPERATIONS: Array<
	[
		op: string,
		method: string,
		path: string,
		run: (ctx: Ctx) => Promise<unknown>,
	]
> = [
	[
		'organizations.list',
		'GET',
		'user/organizations',
		(c) => Organizations.list(c, {}),
	],
	[
		'organizations.get',
		'GET',
		`organizations/${ORG}`,
		(c) => Organizations.get(c, { organization_id: ORG }),
	],
	[
		'projects.list',
		'GET',
		`organizations/${ORG}/projects`,
		(c) => Projects.list(c, { organization_id: ORG }),
	],
	[
		'projects.get',
		'GET',
		`projects/${PROJECT}`,
		(c) => Projects.get(c, { project_id: PROJECT }),
	],
	[
		'projects.create',
		'POST',
		`organizations/${ORG}/projects`,
		(c) =>
			Projects.create(c, {
				organization_id: ORG,
				name: 'Example App',
				type: 'android',
			}),
	],
	[
		'projects.delete',
		'DELETE',
		`projects/${PROJECT}`,
		(c) => Projects.remove(c, { project_id: PROJECT }),
	],
	[
		'collaborators.list',
		'GET',
		`organizations/${ORG}/collaborators`,
		(c) => Collaborators.list(c, { organization_id: ORG }),
	],
	[
		'collaborators.get',
		'GET',
		`organizations/${ORG}/collaborators/${COLLABORATOR}`,
		(c) =>
			Collaborators.get(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
	],
];

/** A response body plausible enough for each operation to parse. */
function payloadFor(op: string): unknown {
	if (op === 'organizations.list') return [organization];
	if (op === 'projects.list') return [project];
	if (op === 'collaborators.list') return [collaborator];
	if (op.startsWith('organizations')) return organization;
	if (op.startsWith('projects')) return project;
	if (op.startsWith('collaborators')) return collaborator;
	return {};
}

beforeEach(() => {
	mockLogEvent.mockClear();
});

describe('routing', () => {
	for (const [op, method, path, run] of OPERATIONS) {
		it(`${op} calls ${method} ${path}`, async () => {
			mockFetch(payloadFor(op));
			const { ctx } = makeCtx();

			await run(ctx);

			expect(captured?.method).toBe(method);
			expect(captured?.url.startsWith(`${BASE}/${path}`)).toBe(true);
		});
	}

	/**
	 * Organizations are reached relative to the token's owner. There is no way to
	 * list organizations globally, so the path is asserted rather than assumed.
	 */
	it('lists organizations relative to the token owner', async () => {
		mockFetch([organization]);
		const { ctx } = makeCtx();

		await Organizations.list(ctx, {});

		expect(captured?.url).toBe(`${BASE}/user/organizations`);
		expect(captured?.url).not.toContain('/organizations?');
	});
});

describe('coverage', () => {
	it('exercises every registered operation and no others', () => {
		const exercised = OPERATIONS.map(([op]) => op).sort();
		const registered = Object.keys(bugsnagEndpointMeta).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(8);
	});

	it('has no duplicate entries in the routing table', () => {
		const ops = OPERATIONS.map(([op]) => op);
		expect(new Set(ops).size).toBe(ops.length);
	});

	it('assigns every operation a risk level and a description', () => {
		const entries = Object.entries(bugsnagEndpointMeta);

		expect(entries).toHaveLength(8);
		for (const [op, meta] of entries) {
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description.length).toBeGreaterThan(0);
			expect(op).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});
});

describe('risk levels', () => {
	/**
	 * Deleting a project removes its entire error history irreversibly, so it is
	 * destructive rather than merely a write.
	 */
	it('marks the project delete destructive', () => {
		const deletes = Object.entries(bugsnagEndpointMeta).filter(([op]) =>
			op.endsWith('.delete'),
		);

		// Without this the loop would pass trivially on an empty list.
		expect(deletes).toHaveLength(1);
		for (const [, meta] of deletes) {
			expect(meta.riskLevel).toBe('destructive');
		}
	});

	it('marks every read read', () => {
		const reads = Object.entries(bugsnagEndpointMeta).filter(
			([op]) => op.endsWith('.list') || op.endsWith('.get'),
		);

		expect(reads).toHaveLength(6);
		for (const [, meta] of reads) {
			expect(meta.riskLevel).toBe('read');
		}
	});
});

describe('retry safety', () => {
	/**
	 * Creating a project is the only write here that a replay could duplicate: it
	 * would produce a second project rather than returning the first. A delete of a
	 * named project is not a duplication risk.
	 */
	it('treats the project create as unsafe to replay and the delete as safe', () => {
		expect(isNonIdempotent('projects.create')).toBe(true);
		expect(isNonIdempotent('projects.delete')).toBe(false);
	});

	it('never marks a read unsafe to replay', () => {
		const reads = OPERATIONS.filter(([, method]) => method === 'GET').map(
			([op]) => op,
		);

		expect(reads).toHaveLength(6);
		for (const op of reads) {
			expect(isNonIdempotent(op)).toBe(false);
		}
	});

	it('does not match an operation name it does not know', () => {
		expect(isNonIdempotent('projects.somethingElse')).toBe(false);
	});
});

describe('the two 404 shapes', () => {
	/**
	 * BugSnag returns `{"status":404,"error":"Not Found"}` when the route does not
	 * exist and `{"errors":["... not found"]}` when the route exists and the resource
	 * does not. The distinction was used during recon to map the GDPR endpoints, and
	 * an operator needs it: a wrong path and a missing record need different fixes.
	 */
	const apiError = (status: number, body: unknown) =>
		Object.assign(new ApiError({} as never, {} as never, 'boom'), {
			status,
			body,
		});

	it('recognises a missing route', () => {
		expect(
			isRouteMissing(apiError(404, { status: 404, error: 'Not Found' })),
		).toBe(true);
	});

	it('does not mistake a missing resource for a missing route', () => {
		expect(
			isRouteMissing(
				apiError(404, { errors: ['Event data deletion not found'] }),
			),
		).toBe(false);
	});

	it('reports neither for a non-404', () => {
		expect(isRouteMissing(apiError(500, { errors: ['boom'] }))).toBe(false);
		expect(isRouteMissing(new Error('plain error'))).toBe(false);
	});

	it('never retries either shape', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const context = { operation: 'projects.get' } as unknown as Parameters<
			typeof errorHandlers.NOT_FOUND_ERROR.handler
		>[1];

		const missingRoute = await errorHandlers.NOT_FOUND_ERROR.handler(
			apiError(404, { status: 404, error: 'Not Found' }),
			context,
		);
		const missingRecord = await errorHandlers.NOT_FOUND_ERROR.handler(
			apiError(404, { errors: ['not found'] }),
			context,
		);

		expect(missingRoute.maxRetries).toBe(0);
		expect(missingRecord.maxRetries).toBe(0);
		warn.mockRestore();
	});
});

describe('caching', () => {
	it('mirrors a fetched project under its id', async () => {
		mockFetch(project);
		const { ctx, db } = makeCtx();

		await Projects.get(ctx, { project_id: PROJECT });

		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			PROJECT,
			expect.objectContaining({ id: PROJECT }),
		);
	});

	it('mirrors every row of a list response', async () => {
		mockFetch([project, { ...project, id: 'project-2' }]);
		const { ctx, db } = makeCtx();

		await Projects.list(ctx, { organization_id: ORG });

		expect(db.projects.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	it('skips a row the entity schema rejects rather than storing it', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		// No id, so the schema cannot accept it.
		mockFetch([{ name: 'Nameless' }]);
		const { ctx, db } = makeCtx();

		await Projects.list(ctx, { organization_id: ORG });

		expect(db.projects.upsertByEntityId).not.toHaveBeenCalled();
		// Silence would turn a schema gap into a row that simply never appears.
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('does not fail the call when a cache write throws', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch(project);
		const { ctx, db } = makeCtx();
		db.projects.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));

		await expect(
			Projects.get(ctx, { project_id: PROJECT }),
		).resolves.toMatchObject({ id: PROJECT });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('evicts the mirrored project on delete', async () => {
		mockFetch({});
		const { ctx, db } = makeCtx();

		await Projects.remove(ctx, { project_id: PROJECT });

		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith(PROJECT);
	});

	/**
	 * A read must not evict. A project or collaborator dropping out of a list is
	 * usually a permissions change rather than a deletion, and the row still resolves
	 * ids that older errors reference.
	 */
	it('never evicts on a read', async () => {
		mockFetch([project]);
		const { ctx, db } = makeCtx();

		await Projects.list(ctx, { organization_id: ORG });
		mockFetch(project);
		await Projects.get(ctx, { project_id: PROJECT });

		for (const store of Object.values(db)) {
			expect(store.deleteByEntityId).not.toHaveBeenCalled();
		}
	});

	/**
	 * The project eviction is best-effort: a project carries no personal data of its
	 * own, so a stale row is untidy rather than a privacy problem. The required
	 * variant exists for entities that do - see the collaborator note in persist.ts.
	 */
	it('does not fail the delete when the eviction throws', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch({});
		const { ctx, db } = makeCtx();
		db.projects.deleteByEntityId.mockRejectedValueOnce(new Error('db down'));

		await expect(
			Projects.remove(ctx, { project_id: PROJECT }),
		).resolves.toMatchObject({ success: true });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('exposes a typed error for a required eviction failure', () => {
		const error = new BugsnagMirrorEvictionError(
			'collaborator',
			COLLABORATOR,
			new Error('db down'),
		);

		expect(error.message).toContain('BugSnag removed the collaborator');
		expect(error.message).toContain('local mirror');
		expect(error.message).toContain('does not need repeating');
		expect(error.message).toContain('db down');
	});
});

describe('request bodies and queries', () => {
	it('omits unset fields rather than sending null', async () => {
		mockFetch(project);
		const { ctx } = makeCtx();

		await Projects.create(ctx, {
			organization_id: ORG,
			name: 'Example App',
			type: 'android',
		});

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toEqual({ name: 'Example App', type: 'android' });
		// The organization id addresses the URL, so it must not also be in the body.
		expect('organization_id' in body).toBe(false);
	});

	it('passes offset paging through as query parameters', async () => {
		mockFetch([project]);
		const { ctx } = makeCtx();

		await Projects.list(ctx, {
			organization_id: ORG,
			per_page: 50,
			offset: 100,
		});

		expect(captured?.url).toContain('per_page=50');
		expect(captured?.url).toContain('offset=100');
	});

	it('sends no paging parameters when none are given', async () => {
		mockFetch([project]);
		const { ctx } = makeCtx();

		await Projects.list(ctx, { organization_id: ORG });

		expect(captured?.url).not.toContain('per_page');
		expect(captured?.url).not.toContain('offset');
	});
});

describe('event payloads', () => {
	/**
	 * These assertions are the point of the file. BugSnag carries collaborator
	 * identities and two kinds of API key, and `logEventFromContext` persists
	 * whatever it is handed.
	 */
	it('records no secret when an organization is read', async () => {
		mockFetch(organization);
		const { ctx } = makeCtx();

		await Organizations.get(ctx, { organization_id: ORG });

		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain(organization.api_key);
		expect(payload).not.toContain('billing@example.com');
		expect(payload).toContain(ORG);
	});

	it('records neither api key when a project is created', async () => {
		mockFetch(project);
		const { ctx } = makeCtx();

		await Projects.create(ctx, {
			organization_id: ORG,
			name: 'Example App',
			type: 'android',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bugsnag.projects.create',
			{ project_id: PROJECT, type: 'android' },
			'completed',
		);
		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain(project.api_key);
		expect(payload).not.toContain(project.upload_api_key);
		// The name is caller-authored, so it is not recorded either.
		expect(payload).not.toContain('Example App');
	});

	it('records only ids when a collaborator is read', async () => {
		mockFetch(collaborator);
		const { ctx } = makeCtx();

		await Collaborators.get(ctx, {
			organization_id: ORG,
			collaborator_id: COLLABORATOR,
		});

		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain('Test Tester');
		expect(payload).not.toContain('tester@example.com');
		expect(payload).toContain(COLLABORATOR);
	});

	it('logs every operation exactly once, under its own event name', async () => {
		for (const [op, , , run] of OPERATIONS) {
			mockLogEvent.mockClear();
			mockFetch(payloadFor(op));
			const { ctx } = makeCtx();

			await run(ctx);

			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(`bugsnag.${op}`);
		}
	});
});

describe('the scaffold is honest about its scope', () => {
	/**
	 * This PR is the scaffold that secures the claim, not the finished plugin. The
	 * catalog lists 60 operations and 8 are implemented here. Asserting the count
	 * keeps the code and the PR description from drifting apart, which `greptile.json`
	 * treats as a P1.
	 */
	it('registers 8 of the 60 catalog operations', () => {
		expect(Object.keys(bugsnagEndpointMeta)).toHaveLength(8);
	});

	it('carries no generator or template residue', () => {
		for (const file of [
			'client.ts',
			'error-handlers.ts',
			'index.ts',
			'endpoints/shared.ts',
			'endpoints/persist.ts',
			'endpoints/logging.ts',
			'schema/database.ts',
		]) {
			const source = readFileSync(`${__dirname}/${file}`, 'utf8');
			expect(source).not.toMatch(/TODO|FIXME|example\.com\/api|loyverse/i);
		}
	});
});
