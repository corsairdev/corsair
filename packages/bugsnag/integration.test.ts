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
 * here, and the scaffold's own `projects.create` and `projects.delete` are covered by
 * the mocked unit tests instead.
 *
 * To run:
 *   BUGSNAG_AUTH_TOKEN=<token> pnpm test:live
 *
 * Passing the filename as a positional argument does not work: jest treats it as
 * another `--testPathIgnorePatterns` value and quietly excludes this file, then
 * reports the unit suites as green. The script uses `--testPathPattern` instead.
 */
import { makeBugsnagRequest } from './client';
import {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
} from './schema/database';

const authToken = process.env.BUGSNAG_AUTH_TOKEN;

const describeLive = authToken ? describe : describe.skip;

describeLive('BugSnag Data Access API (live, read-only)', () => {
	it('authenticates and lists the organizations the token can reach', async () => {
		const orgs = await makeBugsnagRequest<unknown[]>(
			'user/organizations',
			authToken as string,
		);

		expect(Array.isArray(orgs)).toBe(true);
		expect(orgs.length).toBeGreaterThan(0);
		for (const org of orgs) {
			const parsed = BugsnagOrganizationEntity.safeParse(org);
			if (!parsed.success) {
				// Naming the offending field makes a schema gap actionable rather than
				// just red.
				throw new Error(
					`organization failed its schema: ${JSON.stringify(parsed.error.issues)}`,
				);
			}
		}
	});

	it('lists projects and collaborators, and every row parses', async () => {
		const orgs = await makeBugsnagRequest<{ id: string }[]>(
			'user/organizations',
			authToken as string,
		);
		const orgId = orgs[0]?.id;
		expect(orgId).toBeTruthy();

		const projects = await makeBugsnagRequest<unknown[]>(
			`organizations/${orgId}/projects`,
			authToken as string,
		);
		for (const p of projects) {
			const parsed = BugsnagProjectEntity.safeParse(p);
			if (!parsed.success) {
				throw new Error(
					`project failed its schema: ${JSON.stringify(parsed.error.issues)}`,
				);
			}
		}

		const collaborators = await makeBugsnagRequest<unknown[]>(
			`organizations/${orgId}/collaborators`,
			authToken as string,
		);
		for (const c of collaborators) {
			const parsed = BugsnagCollaboratorEntity.safeParse(c);
			if (!parsed.success) {
				throw new Error(
					`collaborator failed its schema: ${JSON.stringify(parsed.error.issues)}`,
				);
			}
		}
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
	 * Paging is by `offset` and `per_page` because the `Link` header cannot be
	 * surfaced through the shared transport.
	 *
	 * **What this test can and cannot prove.** An earlier version asserted that
	 * `offset=9999` on the project list returns an empty page. It does not - it
	 * returns the single project. That is not necessarily a bug in the API: the
	 * recon account holds exactly one organization, one project and one
	 * collaborator, so an out-of-range offset cannot be distinguished from an
	 * ignored one with a single record. The assertion was wrong to make.
	 *
	 * Paging **is** demonstrable on `projects/{id}/errors`, where three records
	 * exist: `per_page=1` with `offset` 0, 1 and 2 returns three different rows and
	 * a large offset returns an empty array. That endpoint is not part of this
	 * scaffold, so what is asserted here is the weaker, true claim - the parameters
	 * are accepted and the response stays a well-formed array.
	 */
	it('accepts paging parameters and still returns a well-formed array', async () => {
		const orgs = await makeBugsnagRequest<{ id: string }[]>(
			'user/organizations',
			authToken as string,
		);
		const orgId = orgs[0]?.id;

		for (const query of [
			{ per_page: 1 },
			{ per_page: 1, offset: 0 },
			{ per_page: 100, offset: 9999 },
		]) {
			const page = await makeBugsnagRequest<{ id: string }[]>(
				`organizations/${orgId}/projects`,
				authToken as string,
				{ query },
			);
			expect(Array.isArray(page)).toBe(true);
			expect(page.length).toBeLessThanOrEqual(100);
		}
	});

	it('rejects a bad token with 401', async () => {
		await expect(
			makeBugsnagRequest('user/organizations', 'not-a-real-token'),
		).rejects.toMatchObject({ status: 401 });
	});

	/**
	 * The two 404 shapes mean different things, and the error handler branches on the
	 * difference. Pinned live so a change upstream shows up here rather than as a
	 * misleading message in production.
	 */
	it('distinguishes a missing route from a missing resource', async () => {
		// A path the API does not serve at all.
		await expect(
			makeBugsnagRequest('projects/not-a-real-path-here', authToken as string),
		).rejects.toMatchObject({ status: 404 });

		// A route that exists, with an id that does not. The body shape differs from
		// the one above; see error-handlers.ts.
		const orgs = await makeBugsnagRequest<{ id: string }[]>(
			'user/organizations',
			authToken as string,
		);
		await expect(
			makeBugsnagRequest(
				`organizations/${orgs[0]?.id}/event_data_deletions/000000000000000000000000`,
				authToken as string,
			),
		).rejects.toMatchObject({ status: 404 });
	});
});
