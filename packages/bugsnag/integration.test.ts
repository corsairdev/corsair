/**
 * Live tests against a real BugSnag account.
 *
 * Excluded from a default run by `testPathIgnorePatterns` in `jest.config.cjs`,
 * excluded from CI by the same flag on the command line, and self-skipping when no
 * token is present, so a checkout without credentials still runs green and reaches
 * no network at all.
 *
 * **Every call here is read-only.** Nothing is created, changed or deleted. That
 * matters more on this API than most: the operation surface can delete an
 * organization, delete a project with its entire error history, erase every error in
 * a project, run GDPR data deletions, and regenerate a project's API key - which
 * would invalidate the key every deployed notifier uses. None of those is exercised
 * here; the write and destructive paths are covered by mocked unit tests instead.
 *
 * During development the destructive operations *were* verified live, but only ever
 * against a project created for the purpose and deleted immediately, and never from
 * this suite. Four were deliberately never run at all: deleting an organization,
 * inviting a collaborator (it emails a real person), and updating or removing a
 * collaborator (the account has one, who is also its only admin).
 *
 * To run:
 *   BUGSNAG_AUTH_TOKEN=<token> pnpm test:live
 *
 * Passing the filename as a positional argument does not work: jest treats it as
 * another `--testPathIgnorePatterns` value and quietly excludes this file, then
 * reports the unit suites as green. The script uses `--testPathPattern` instead.
 */
import { BUGSNAG_API_BASE, makeBugsnagRequest, readRateLimit } from './client';
import { buildQuery, withQuery } from './endpoints/shared';
import {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
	BugsnagTeamEntity,
} from './schema/database';
import {
	BugsnagError,
	BugsnagEvent,
	BugsnagEventField,
	BugsnagPivot,
	BugsnagProjectAccess,
	BugsnagProjectAccessCount,
	BugsnagRelease,
	BugsnagReleaseGroup,
	BugsnagSupportedIntegration,
	BugsnagTrendBucket,
} from './schema/responses';

const authToken = process.env.BUGSNAG_AUTH_TOKEN;

const describeLive = authToken ? describe : describe.skip;

/**
 * A raw `fetch` against the API, for the two tests that need the **response headers**
 * rather than the parsed body - which `makeBugsnagRequest` cannot return, because
 * `request()` yields the body or one header, never both.
 *
 * It reuses `BUGSNAG_API_BASE` and mirrors the client's auth headers rather than
 * hard-coding them, so a change to the base URL or the auth scheme fails here too
 * instead of leaving the tests quietly asserting against the old one.
 */
async function rawFetch(path: string): Promise<Response> {
	return await fetch(`${BUGSNAG_API_BASE}/${path}`, {
		headers: {
			Authorization: `token ${authToken as string}`,
			'X-Version': '2',
		},
	});
}

/** Parses every row, naming the offending field rather than just failing red. */
function expectEveryRowParses(
	rows: unknown,
	schema: {
		safeParse: (value: unknown) => { success: boolean; error?: unknown };
	},
	label: string,
) {
	expect(Array.isArray(rows)).toBe(true);
	for (const row of rows as unknown[]) {
		const parsed = schema.safeParse(row);
		if (!parsed.success) {
			throw new Error(
				`${label} failed its schema: ${JSON.stringify(
					(parsed.error as { issues?: unknown })?.issues ?? parsed.error,
				)}`,
			);
		}
	}
}

/**
 * This suite has to be frugal, and the reason is the thing it is testing.
 *
 * `projects/{id}/errors` publishes a budget of **30 requests per minute** - a third of
 * what `/user/organizations` allows - and an earlier version of this file called it
 * thirteen times. It exhausted the budget and two tests failed with a 429, which looked
 * like a product fault and was a fault in the test. So the unfiltered error list is
 * fetched **once** in `beforeAll` and shared, and the budget probe runs before the
 * error-heavy tests rather than after them.
 *
 * That per-endpoint budget is exactly what the plugin exposes `readRateLimit` for.
 *
 * **Running this suite twice inside a minute will fail**, and that is the API's budget
 * rather than a flaky test: the suite makes roughly nine calls against a 30-per-minute
 * endpoint, so two runs plus any manual probing exceeds it and the second run sees
 * `{"errors":["API rate limit exceeded"]}`. Wait a minute between runs. The alternative -
 * treating a 429 as an acceptable outcome everywhere - would mean the suite could pass
 * having verified nothing, which is worse.
 */
describeLive('BugSnag Data Access API (live, read-only)', () => {
	let orgId: string;
	let projectId: string;
	let collaboratorId: string;
	/** Fetched once, because this endpoint has the tightest budget on the API. */
	let allErrors: { id: string }[];

	/**
	 * Fails immediately with a clear message when a precondition is missing, rather than
	 * letting an `undefined` id be interpolated into the next URL.
	 *
	 * Without this, an account with no project would produce a request for
	 * `projects/undefined`, which answers 404 - and every later test would fail with a
	 * confusing not-found instead of "this account has no project to read".
	 */
	const requireFirst = <T extends { id: string }>(
		rows: T[],
		what: string,
	): string => {
		const id = rows[0]?.id;
		if (!id) {
			throw new Error(
				`live suite precondition failed: the account has no ${what}, so there is ` +
					`nothing to read. Seed one before running the live suite.`,
			);
		}
		return id;
	};

	beforeAll(async () => {
		orgId = requireFirst(
			await makeBugsnagRequest<{ id: string }[]>(
				'user/organizations',
				authToken as string,
			),
			'organization',
		);
		projectId = requireFirst(
			await makeBugsnagRequest<{ id: string }[]>(
				`organizations/${orgId}/projects`,
				authToken as string,
			),
			'project',
		);
		collaboratorId = requireFirst(
			await makeBugsnagRequest<{ id: string }[]>(
				`organizations/${orgId}/collaborators`,
				authToken as string,
			),
			'collaborator',
		);
		allErrors = await makeBugsnagRequest<{ id: string }[]>(
			`projects/${projectId}/errors`,
			authToken as string,
		);
	});

	it('authenticates and resolves the account it will read', async () => {
		expect(orgId).toBeTruthy();
		expect(projectId).toBeTruthy();
		expect(collaboratorId).toBeTruthy();
		expect(allErrors.length).toBeGreaterThan(0);
	});

	/**
	 * The budget is reported on every response and is **per-endpoint rather than
	 * global**, which is what lets a caller pace itself proactively instead of only
	 * reacting to a 429.
	 *
	 * Declared early on purpose: jest runs tests in declaration order, and the
	 * error-list tests below spend most of the tightest budget on the API.
	 *
	 * A 429 is tolerated rather than treated as a failure. It still carries the budget
	 * headers, and on an endpoint limited to 30/minute it is a legitimate answer rather
	 * than evidence of a bug - which is the whole point being asserted.
	 */
	it('reports a rate-limit budget that differs by endpoint', async () => {
		const seen: Record<string, string | null> = {};

		for (const path of ['user/organizations', `projects/${projectId}/errors`]) {
			const response = await rawFetch(path);
			expect([200, 429]).toContain(response.status);
			seen[path] = response.headers.get('x-ratelimit-limit');
		}

		for (const value of Object.values(seen)) {
			expect(value).not.toBeNull();
			expect(Number(value)).toBeGreaterThan(0);
		}
		// Different endpoints, different budgets - so a single hard-coded figure would be
		// wrong, which is why the plugin reads the headers instead.
		expect(new Set(Object.values(seen)).size).toBeGreaterThan(1);
	});

	it('lists the organizations the token can reach, and every row parses', async () => {
		const orgs = await makeBugsnagRequest<unknown[]>(
			'user/organizations',
			authToken as string,
		);

		expect(orgs.length).toBeGreaterThan(0);
		expectEveryRowParses(orgs, BugsnagOrganizationEntity, 'organization');
	});

	it('lists projects, collaborators and teams, and every row parses', async () => {
		expectEveryRowParses(
			await makeBugsnagRequest(
				`organizations/${orgId}/projects`,
				authToken as string,
			),
			BugsnagProjectEntity,
			'project',
		);
		expectEveryRowParses(
			await makeBugsnagRequest(
				`organizations/${orgId}/collaborators`,
				authToken as string,
			),
			BugsnagCollaboratorEntity,
			'collaborator',
		);
		// Teams may legitimately be empty; the schema still has to accept the shape.
		expectEveryRowParses(
			await makeBugsnagRequest(
				`organizations/${orgId}/teams`,
				authToken as string,
			),
			BugsnagTeamEntity,
			'team',
		);
	});

	/**
	 * The project-scoped collaborator reads, which recon had only from documentation.
	 * Both return the same 18-field collaborator shape as the organization-scoped ones.
	 */
	it('reads collaborators through a project as well as an organization', async () => {
		expectEveryRowParses(
			await makeBugsnagRequest(
				`projects/${projectId}/collaborators`,
				authToken as string,
			),
			BugsnagCollaboratorEntity,
			'project collaborator',
		);

		const one = await makeBugsnagRequest<unknown>(
			`projects/${projectId}/collaborators/${collaboratorId}`,
			authToken as string,
		);
		expect(BugsnagCollaboratorEntity.safeParse(one).success).toBe(true);
	});

	/**
	 * `project_accesses`, not `access_details` - the path recon had wrong. The three role
	 * fields are the point of the operation: effective, individually granted, and
	 * inherited through a team.
	 */
	it('reads how a collaborator reaches each project', async () => {
		const accesses = await makeBugsnagRequest<unknown[]>(
			`organizations/${orgId}/collaborators/${collaboratorId}/project_accesses`,
			authToken as string,
		);
		expectEveryRowParses(accesses, BugsnagProjectAccess, 'project access');

		const one = await makeBugsnagRequest<Record<string, unknown>>(
			`organizations/${orgId}/collaborators/${collaboratorId}/project_accesses/${projectId}`,
			authToken as string,
		);
		expect(BugsnagProjectAccess.safeParse(one).success).toBe(true);
		expect(Object.keys(one)).toContain('project_role');
		expect(Object.keys(one)).toContain('individual_project_role');
	});

	/**
	 * `collaborator_ids` must reach the API as a bracketed array. This asserts the query
	 * the plugin actually builds, rather than a hand-written string - so a regression in
	 * `buildQuery` fails here too.
	 */
	it('sends an array parameter in the bracketed form the API requires', async () => {
		const counts = await makeBugsnagRequest<unknown[]>(
			withQuery(`organizations/${orgId}/collaborators/project_access_counts`, {
				collaborator_ids: [collaboratorId],
			}),
			authToken as string,
		);

		expectEveryRowParses(counts, BugsnagProjectAccessCount, 'access count');
		expect(counts.length).toBeGreaterThan(0);

		// And the bare form the shared transport would have produced is rejected, which
		// is why the plugin builds its own query strings.
		await expect(
			makeBugsnagRequest(
				`organizations/${orgId}/collaborators/project_access_counts?collaborator_ids=${collaboratorId}`,
				authToken as string,
			),
		).rejects.toMatchObject({ status: 400 });
	});

	it('reads errors, events, event fields and pivots, and every row parses', async () => {
		// Reuses the list fetched once in beforeAll, rather than spending another request
		// on the tightest budget on this API.
		expectEveryRowParses(allErrors, BugsnagError, 'error');
		expect(allErrors.length).toBeGreaterThan(0);

		expectEveryRowParses(
			await makeBugsnagRequest(
				`projects/${projectId}/errors/${allErrors[0]?.id}/events`,
				authToken as string,
			),
			BugsnagEvent,
			'event',
		);
		expectEveryRowParses(
			await makeBugsnagRequest(
				`projects/${projectId}/event_fields`,
				authToken as string,
			),
			BugsnagEventField,
			'event field',
		);
		expectEveryRowParses(
			await makeBugsnagRequest(
				`projects/${projectId}/pivots`,
				authToken as string,
			),
			BugsnagPivot,
			'pivot',
		);
	});

	/**
	 * A pivot is addressed by `event_field_display_id`. Asserted live because the
	 * alternative - addressing by `name` - fails with the resource-missing envelope,
	 * which looks like an empty pivot rather than a wrong key.
	 */
	it('addresses a pivot by its event field display id', async () => {
		const pivots = await makeBugsnagRequest<
			{ event_field_display_id: string; name: string }[]
		>(`projects/${projectId}/pivots`, authToken as string);
		const withValues = pivots.find((p) => p.event_field_display_id === 'error');
		expect(withValues).toBeTruthy();

		const values = await makeBugsnagRequest<unknown[]>(
			`projects/${projectId}/pivots/${withValues?.event_field_display_id}/values`,
			authToken as string,
		);
		expect(Array.isArray(values)).toBe(true);
	});

	it('reads releases, and release groups only with a release stage', async () => {
		expectEveryRowParses(
			await makeBugsnagRequest(
				`projects/${projectId}/releases`,
				authToken as string,
			),
			BugsnagRelease,
			'release',
		);

		// Required, not optional: the endpoint answers 400 without it.
		await expect(
			makeBugsnagRequest(
				`projects/${projectId}/release_groups`,
				authToken as string,
			),
		).rejects.toMatchObject({ status: 400 });

		expectEveryRowParses(
			await makeBugsnagRequest(
				withQuery(`projects/${projectId}/release_groups`, {
					release_stage_name: 'production',
				}),
				authToken as string,
			),
			BugsnagReleaseGroup,
			'release group',
		);
	});

	it('reads a trend only when told how many buckets to use', async () => {
		const buckets = await makeBugsnagRequest<unknown[]>(
			withQuery(`projects/${projectId}/trend`, { buckets_count: 3 }),
			authToken as string,
		);

		expectEveryRowParses(buckets, BugsnagTrendBucket, 'trend bucket');
		expect(buckets).toHaveLength(3);
	});

	it('reads the supported integrations catalogue', async () => {
		const integrations = await makeBugsnagRequest<unknown[]>(
			'integrations',
			authToken as string,
		);

		expectEveryRowParses(
			integrations,
			BugsnagSupportedIntegration,
			'supported integration',
		);
		expect(integrations.length).toBeGreaterThan(10);
	});

	/**
	 * Both operations that were wrongly recorded as enterprise-only. They answer 200 on a
	 * free account; the earlier conclusion came from probing paths that do not exist.
	 * Pinned here so that mistake cannot be reintroduced quietly.
	 */
	it('reads the network grouping ruleset, which is not plan-gated', async () => {
		const ruleset = await makeBugsnagRequest<Record<string, unknown>>(
			`projects/${projectId}/network_endpoint_grouping`,
			authToken as string,
		);

		expect(Object.keys(ruleset)).toContain('project_id');
		expect(Object.keys(ruleset)).toContain('endpoints');
	});

	it('reads feature flag summaries from their own collection', async () => {
		// Its own path. `feature_flags/summaries` answers 400 because `summaries` is
		// parsed as a feature flag id.
		const summaries = await makeBugsnagRequest<unknown[]>(
			`projects/${projectId}/feature_flag_summaries`,
			authToken as string,
		);
		expect(Array.isArray(summaries)).toBe(true);

		await expect(
			makeBugsnagRequest(
				`projects/${projectId}/feature_flags/summaries`,
				authToken as string,
			),
		).rejects.toMatchObject({ status: 400 });
	});

	/**
	 * A list response is a bare array, not an envelope. Asserted because a provider
	 * adding a wrapper later would break every list schema, and this is the cheapest
	 * place to notice.
	 */
	it('returns a bare array from a list, with no envelope', async () => {
		const orgs = await makeBugsnagRequest<unknown>(
			'user/organizations',
			authToken as string,
		);

		expect(Array.isArray(orgs)).toBe(true);
	});

	/**
	 * Paging is by `offset` and `per_page` because the `Link` header cannot be surfaced
	 * through the shared transport.
	 *
	 * **What this can and cannot prove.** On the organization, project and collaborator
	 * lists the account holds exactly one record each, so an out-of-range offset cannot
	 * be distinguished from an ignored one - an earlier version asserted that
	 * `offset=9999` returns an empty page, and it does not. Paging *is* demonstrable on
	 * `errors`, where three records exist, so that is where the strong claim is made and
	 * the weaker one is made elsewhere.
	 */
	it('pages through the error list one record at a time', async () => {
		expect(allErrors.length).toBeGreaterThanOrEqual(3);

		const seen: string[] = [];
		for (let offset = 0; offset < 3; offset++) {
			const page = await makeBugsnagRequest<{ id: string }[]>(
				withQuery(`projects/${projectId}/errors`, { per_page: 1, offset }),
				authToken as string,
			);
			expect(page).toHaveLength(1);
			seen.push(page[0]?.id as string);
		}

		// Three different rows, so the offset genuinely advances.
		expect(new Set(seen).size).toBe(3);

		// Just past the end: an empty page, which is how a caller knows to stop.
		const past = await makeBugsnagRequest<unknown[]>(
			withQuery(`projects/${projectId}/errors`, {
				per_page: 1,
				offset: allErrors.length,
			}),
			authToken as string,
		);
		expect(past).toHaveLength(0);
	});

	/**
	 * A **deep** offset is a different case from one just past the end, and the boundary
	 * is real rather than theoretical. Mapped live on the error list:
	 *
	 * ```
	 * offset 0..2     -> 1 row each   (3 records exist)
	 * offset 3..100   -> empty array
	 * offset 1000+    -> 422 {"errors":["Unable to return complete results ..."], code 60000}
	 * ```
	 *
	 * So an empty page means "past the end" but a 422 means "too deep to answer", and a
	 * caller paging by offset has to treat them differently - the second is not a signal
	 * to stop, it is a refusal.
	 *
	 * It depends on `offset` alone, not on `offset x per_page`: `per_page=100&offset=100`
	 * answers 200 while `per_page=100&offset=9999` answers 422.
	 *
	 * The message suggests `sort=unsorted`, and that is a dead end for this access
	 * pattern: with an offset it answers `{"errors":["Pagination Offset is invalid"]}`.
	 * Offset paging and unsorted results are mutually exclusive, so deep paging needs the
	 * `base`/`Link` cursor - which the shared transport cannot surface. Recorded here
	 * because it is a real limit on this plugin, not a gap in the tests.
	 */
	it('refuses a very deep offset rather than returning an empty page', async () => {
		const deep = withQuery(`projects/${projectId}/errors`, {
			per_page: 1,
			offset: 9999,
		});
		await expect(
			makeBugsnagRequest(deep, authToken as string),
		).rejects.toMatchObject({ status: 422 });

		// And the suggested remedy does not apply to offset paging.
		await expect(
			makeBugsnagRequest(`${deep}&sort=unsorted`, authToken as string),
		).rejects.toMatchObject({ status: 400 });
	});

	/**
	 * The project list **ignores `offset` entirely**: with one project on the account,
	 * `offset=9999` returns that project rather than an empty page - and unlike the error
	 * list it does not 422 either. So offset paging is not uniform across this API, and
	 * the honest claim here is the weak one: the parameters are accepted and the response
	 * stays a well-formed array.
	 *
	 * Asserted as "same rows regardless of offset" rather than "empty at a high offset",
	 * because an earlier version asserted the latter and it was simply untrue.
	 */
	it('accepts paging parameters on other lists and still returns arrays', async () => {
		const baseline = await makeBugsnagRequest<unknown[]>(
			`organizations/${orgId}/projects`,
			authToken as string,
		);

		for (const query of [
			{ per_page: 1 },
			{ per_page: 1, offset: 0 },
			{ per_page: 100, offset: 9999 },
		]) {
			const page = await makeBugsnagRequest<unknown[]>(
				withQuery(`organizations/${orgId}/projects`, query),
				authToken as string,
			);
			expect(Array.isArray(page)).toBe(true);
			expect(page.length).toBeLessThanOrEqual(100);
		}

		// The account holds one project, so a high offset returning it is the observed
		// behaviour rather than a bug - and it is why the strong paging claim is made
		// against the error list instead.
		const deep = await makeBugsnagRequest<unknown[]>(
			withQuery(`organizations/${orgId}/projects`, { offset: 9999 }),
			authToken as string,
		);
		expect(deep).toHaveLength(baseline.length);
	});

	/**
	 * Two comparisons on one field, which only works when each `type`/`value` pair stays
	 * adjacent. The grouped ordering a generic serialiser produces is answered 400, so
	 * this is what justifies the plugin building its own query strings.
	 */
	it('sends two comparisons on one field in an order the API accepts', async () => {
		const query = buildQuery(
			{},
			{
				'error.status': [
					{ type: 'eq', value: 'open' },
					{ type: 'eq', value: 'fixed' },
				],
			},
		);

		const rows = await makeBugsnagRequest<unknown[]>(
			`projects/${projectId}/errors${query}`,
			authToken as string,
		);
		expect(Array.isArray(rows)).toBe(true);

		// The grouped form, which the API rejects outright.
		const grouped =
			'?filters[error.status][][type]=eq&filters[error.status][][type]=eq' +
			'&filters[error.status][][value]=open&filters[error.status][][value]=fixed';
		await expect(
			makeBugsnagRequest(
				`projects/${projectId}/errors${grouped}`,
				authToken as string,
			),
		).rejects.toMatchObject({ status: 400 });
	});

	/**
	 * An unrecognised filter field returns everything with a 200 instead of failing.
	 * Pinned because it is a trap for any caller: a mistyped field name does not error,
	 * it silently disables the filter.
	 *
	 * Folded into the same test as the real-field comparison on purpose. Each is one
	 * request against the endpoint with the tightest budget on the API, and the pair is
	 * only meaningful together anyway - "the filter was applied" and "an invented field is
	 * not" are the two halves of one claim.
	 */
	it('ignores an invented filter field while honouring a real one', async () => {
		const rows = async (field: string, value: string) =>
			await makeBugsnagRequest<unknown[]>(
				withQuery(
					`projects/${projectId}/errors`,
					{},
					{ [field]: { type: 'eq', value } },
				),
				authToken as string,
			);

		// A field the project does not define: every row comes back, with a 200.
		expect(await rows('not.a.real.field', 'anything')).toHaveLength(
			allErrors.length,
		);

		// A real field whose value matches nothing: zero rows, so the filter is genuinely
		// read rather than discarded. Without this half, the assertion above could not
		// distinguish "filters work but this field is unknown" from "filters never work".
		expect(await rows('error.status', 'fixed')).toHaveLength(0);
	});

	it('rejects a bad token with 401', async () => {
		await expect(
			makeBugsnagRequest('user/organizations', 'not-a-real-token'),
		).rejects.toMatchObject({ status: 401 });
	});

	/**
	 * The two 404 shapes mean different things, and the error handler branches on the
	 * difference. The rule is narrower than it looks: a garbage **path parameter** still
	 * matches its route and so yields the resource-missing shape, while only a path
	 * matching no route at all yields route-absent. Misreading that produced two false
	 * "enterprise-only" verdicts, so both halves are pinned here - and the bodies are
	 * asserted, not merely the status, which an earlier version did and which proved
	 * nothing.
	 */
	it('distinguishes a missing route from a missing resource', async () => {
		const absentId = '000000000000000000000000';

		// The route exists; the record does not.
		await expect(
			makeBugsnagRequest(`projects/${absentId}`, authToken as string),
		).rejects.toMatchObject({
			status: 404,
			body: { errors: expect.arrayContaining([expect.any(String)]) },
		});

		// No route at this path at all.
		await expect(
			makeBugsnagRequest(
				`projects/${projectId}/not_a_collection_here`,
				authToken as string,
			),
		).rejects.toMatchObject({
			status: 404,
			body: { status: 404, error: 'Not Found' },
		});
	});

	/**
	 * `readRateLimit` parses the headers the budget test above reads directly. Asserted
	 * against a live response so the header names cannot drift out of the client
	 * unnoticed - they are lowercase on the wire, and `Headers.get` is case-insensitive,
	 * but the names themselves are the thing being pinned.
	 */
	it('parses the live rate-limit headers through readRateLimit', async () => {
		const response = await rawFetch('user/organizations');

		const budget = readRateLimit(response.headers);
		expect(budget.limit).toBeGreaterThan(0);
		expect(typeof budget.remaining).toBe('number');
		expect(budget.remaining).toBeLessThanOrEqual(budget.limit as number);
	});
});
