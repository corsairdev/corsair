/**
 * Live tests against a real CircleCI account.
 *
 * Excluded from a default run by `testPathIgnorePatterns` in
 * `jest.config.cjs`, excluded from CI by the same flag on the command line,
 * and self-skipping when no token is present, so a checkout without one
 * still runs green.
 *
 * **Paced at one request every 2.5 seconds.** CircleCI's own rate-limit
 * headers report 300 requests per window; the window's length was not
 * determined live (see `client.ts`), so this suite paces conservatively
 * rather than risk a 429 mid-run.
 *
 * Covers all four transports with real requests: v2, v3, GraphQL and v1.1.
 * Read-only throughout except two create-then-delete probes (a context, a
 * project env var), both cleaned up in `finally`.
 *
 * Deliberately never exercised live:
 * - `projects.delete` / `namespace.delete` - irreversible, and this account
 *   has exactly one followed project and no spare namespace to lose.
 * - `groups.create` - confirmed live during recon to answer 403 on this
 *   account; re-confirming it on every run would spend a request to learn
 *   nothing new.
 * - `pipelines.trigger` - starts a real CI run and spends build minutes.
 * - `usageExport.create` - the catalog documents a 10/hour rate limit
 *   independent of this suite's own pacing.
 * - `contextsGraphQL.delete` / `removeEnvVar` / `storeEnvironmentVariable` -
 *   confirmed working during recon against a real context; not repeated here
 *   to keep this suite's total request count well under the budget.
 *
 * To run:
 *   CIRCLECI_TOKEN=<token> CIRCLECI_ORG_ID=<uuid> CIRCLECI_PROJECT_SLUG=<gh/org/repo> pnpm test:live
 */
import {
	Contexts,
	ContextsGraphQL,
	Namespaces,
	Orbs,
	Organization,
	Pipelines,
	ProjectEnvVars,
	Projects,
	User,
} from './endpoints';
import { CircleCIProjectEntity } from './schema/database';

const token = process.env.CIRCLECI_TOKEN;
const orgId = process.env.CIRCLECI_ORG_ID;
const projectSlug = process.env.CIRCLECI_PROJECT_SLUG;

const describeLive = token && orgId && projectSlug ? describe : describe.skip;

const PACE_MS = 2500;
let lastCall = 0;
async function paced<T>(operation: () => Promise<T>): Promise<T> {
	const wait = lastCall + PACE_MS - Date.now();
	if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
	lastCall = Date.now();
	return await operation();
}

function makeCtx() {
	// `database` is left undefined on purpose: `logEventFromContext` no-ops
	// cleanly on that (see `corsair/plugins/utils/events.ts`), so audit
	// logging is exercised for control flow without a real events table to
	// write into. `$getAccountId` only needs to resolve - persisting to a
	// real account's audit log is exactly what the mocked suite already
	// covers, not something this live suite needs to duplicate.
	return {
		key: token ?? '',
		db: {},
		$getAccountId: async () => 'circleci-integration-test-account',
	} as unknown as Parameters<typeof Projects.get>[0];
}

const PROBE = 'corsair-integration-probe-delete-me';

describeLive('CircleCI live API', () => {
	describe('v2 - the shape of what comes back', () => {
		it('returns the authenticated user', async () => {
			const ctx = makeCtx();
			const user = await paced(() => User.getCurrent(ctx, {}));
			expect(typeof user.id).toBe('string');
			expect(typeof user.login).toBe('string');
		});

		it('returns collaborations including the configured org', async () => {
			const ctx = makeCtx();
			const collabs = await paced(() => User.listCollaborations(ctx, {}));
			expect(Array.isArray(collabs)).toBe(true);
			expect(collabs.length).toBeGreaterThan(0);
		});

		it('returns a project that parses as the project entity', async () => {
			const ctx = makeCtx();
			const project = await paced(() =>
				Projects.get(ctx, { projectSlug: projectSlug ?? '' }),
			);
			const parsed = CircleCIProjectEntity.safeParse(project);
			if (!parsed.success) console.error(parsed.error.issues);
			expect(parsed.success).toBe(true);
		});

		it('lists pipelines for the project without error, with the real pagination envelope', async () => {
			const ctx = makeCtx();
			const result = await paced(() =>
				Pipelines.listForProject(ctx, { projectSlug: projectSlug ?? '' }),
			);
			// The regression this guards: an earlier version of this operation
			// unwrapped CircleCI's real `{items, next_page_token}` response down
			// to a bare array before returning it, discarding the continuation
			// token. Confirming `result` is the envelope - not an array - is what
			// proves the fix reached the real API, not just the mocks.
			expect(Array.isArray(result)).toBe(false);
			expect(Array.isArray(result.items)).toBe(true);
		});
	});

	describe('v3 - the undocumented base, confirmed reachable', () => {
		it('a real namespace exists', async () => {
			const ctx = makeCtx();
			const result = await paced(() =>
				Namespaces.queryExists(ctx, { name: 'circleci' }),
			);
			expect(result.exists).toBe(true);
		});

		it('a fabricated namespace does not exist - 404, not a thrown parse error', async () => {
			const ctx = makeCtx();
			const result = await paced(() =>
				Namespaces.queryExists(ctx, {
					name: 'corsair-recon-definitely-fake-namespace-xyz',
				}),
			);
			expect(result.exists).toBe(false);
		});
	});

	describe('GraphQL - introspection disabled, confirmed live via real fields', () => {
		it('a well-known public orb resolves', async () => {
			const ctx = makeCtx();
			const orb = await paced(() =>
				Orbs.getDetails(ctx, { name: 'circleci/node' }),
			);
			expect(orb.name).toBe('circleci/node');
			expect(Array.isArray(orb.versions)).toBe(true);
		});

		it('a fabricated orb name resolves to not-found, not an error', async () => {
			const ctx = makeCtx();
			const result = await paced(() =>
				Orbs.queryExists(ctx, {
					name: 'corsair-recon/definitely-not-a-real-orb',
				}),
			);
			expect(result.exists).toBe(false);
		});

		it('validates real orb YAML via the orbConfig query', async () => {
			const ctx = makeCtx();
			const result = await paced(() =>
				Orbs.validateConfig(ctx, { orbYaml: 'version: 2.1' }),
			);
			expect(result.valid).toBe(true);
		});

		it('resolves an organization by id', async () => {
			const ctx = makeCtx();
			const org = await paced(() => Organization.get(ctx, { id: orgId ?? '' }));
			expect(org.id).toBe(orgId);
		});
	});

	describe('a write, created and cleaned up', () => {
		it('creates, reads, and deletes a context (REST v2)', async () => {
			const ctx = makeCtx();
			let contextId: string | undefined;
			try {
				const created = await paced(() =>
					Contexts.create(ctx, {
						name: PROBE,
						ownerId: orgId ?? '',
						ownerType: 'organization',
					}),
				);
				contextId = created.id;
				expect(typeof contextId).toBe('string');

				const read = await paced(() =>
					Contexts.get(ctx, { contextId: contextId ?? '' }),
				);
				expect(read.name).toBe(PROBE);
			} finally {
				if (contextId) {
					// The REST DELETE route, confirmed live during recon to answer
					// 403 - not 404 - for a context that no longer exists. Cleanup
					// here uses the GraphQL delete instead, which is what the recon
					// confirmed actually removes a context.
					await paced(() =>
						ContextsGraphQL.remove(ctx, { contextId: contextId ?? '' }),
					).catch((error) => {
						console.error('failed to clean up probe context', contextId, error);
					});
				}
			}
		});

		it('creates, lists, and deletes a project environment variable', async () => {
			const ctx = makeCtx();
			try {
				const created = await paced(() =>
					ProjectEnvVars.create(ctx, {
						projectSlug: projectSlug ?? '',
						name: 'CORSAIR_INTEGRATION_PROBE',
						value: 'placeholder',
					}),
				);
				// Confirmed masked, never the plaintext back - even immediately
				// after setting it.
				expect(created.value).not.toBe('placeholder');

				const listed = await paced(() =>
					ProjectEnvVars.list(ctx, { projectSlug: projectSlug ?? '' }),
				);
				expect(
					listed.items.some((v) => v.name === 'CORSAIR_INTEGRATION_PROBE'),
				).toBe(true);
			} finally {
				await paced(() =>
					ProjectEnvVars.remove(ctx, {
						projectSlug: projectSlug ?? '',
						name: 'CORSAIR_INTEGRATION_PROBE',
					}),
				).catch((error) => {
					console.error('failed to clean up probe env var', error);
				});
			}
		});
	});

	describe('rate limiting', () => {
		it('reports a rate limit in response headers', async () => {
			// Asserts the header exists and is a real number, not the specific
			// value 300 documented in client.ts and this session's own recon -
			// CircleCI can change that number at any time, and this suite should
			// not fail over a fact about CircleCI's account plan rather than a
			// fact about this plugin's own behaviour.
			const res = await paced(() =>
				fetch('https://circleci.com/api/v2/me', {
					headers: { Authorization: `Bearer ${token}` },
				}),
			);
			const limit = res.headers.get('x-ratelimit-limit');
			expect(limit).not.toBeNull();
			expect(Number.isInteger(Number(limit))).toBe(true);
			expect(Number(limit)).toBeGreaterThan(0);
		});
	});
});
