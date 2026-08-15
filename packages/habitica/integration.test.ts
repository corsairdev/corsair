/**
 * Live tests against a real Habitica account.
 *
 * Excluded from a default run by `testPathIgnorePatterns` in `jest.config.cjs`,
 * excluded from CI by the same flag on the command line, and self-skipping when
 * no credential is present, so a checkout without one still runs green.
 *
 * Nothing here runs without **both** halves of the credential - including the
 * anonymous blocks, which need none, so that a bare `jest` in this package
 * makes no network calls at all.
 *
 * **Pacing matters here more than on any previous integration.** Habitica
 * allows 30 authenticated requests per minute per user id and answers 429
 * beyond that, so every call goes through `paced()` below. Without it the suite
 * throttles itself halfway through and the failures look like API bugs.
 *
 * Almost everything here is read-only, and nothing already on the account is
 * modified. The exceptions create objects they own, named as probes, and delete
 * them again in `finally`.
 *
 * Deliberately never exercised live:
 *
 * - `user.reset` - it deletes every task on the account and cannot be undone.
 * - `auth.register` / `auth.login` / `auth.social` - their inputs are
 *   credentials, and registering would create a real account on someone's
 *   service.
 * - `tasks.score` - it permanently alters the character's experience and gold.
 *   Exercised once by hand during development; not repeated on every run.
 * - `exports.userData` - it returns the account holder's email address. Its
 *   *reachability* is asserted below without reading the body.
 * - Anything that removes a group, a member or a chat message someone else owns.
 *
 * To run:
 *   HABITICA_USER_ID=<uuid> HABITICA_API_TOKEN=<token> pnpm test:live
 *
 * Passing the filename as a positional argument does not work: jest treats it
 * as another `--testPathIgnorePatterns` value and quietly excludes this file,
 * then reports the unit suites as green. The script uses `--testPathPattern`.
 */
import {
	HABITICA_API_BASE,
	HABITICA_CLIENT_ID,
	HABITICA_ROOT_BASE,
	makeHabiticaAnonymousRequest,
	makeHabiticaExportRequest,
	makeHabiticaRequest,
} from './client';
import {
	HabiticaChallengeEntity,
	HabiticaGroupEntity,
	HabiticaTagEntity,
	HabiticaTaskEntity,
	HabiticaWebhookEntity,
} from './schema/database';

const userId = process.env.HABITICA_USER_ID;
const apiToken = process.env.HABITICA_API_TOKEN;
const credentials = { userId: userId ?? '', apiToken: apiToken ?? '' };

const describeLive = userId && apiToken ? describe : describe.skip;

/**
 * Keeps the suite under Habitica's 30-requests-per-minute ceiling.
 *
 * This is a real constraint rather than politeness, and the margin is not
 * generous: an early version of this suite paced at 2.1 seconds and still drew
 * a 429 partway through, because the limit counts the *whole run* inside a
 * rolling minute rather than the gap between calls. The failure surfaced as an
 * unrelated assertion getting a 429 where it expected a 400 - exactly the kind
 * of result that gets misread as an API bug.
 *
 * Two things keep the run under the ceiling: this interval, and fetching the
 * 2.65 MB content catalogue once rather than per test.
 */
const PACE_MS = 2600;
let lastCall = 0;
async function paced<T>(operation: () => Promise<T>): Promise<T> {
	const wait = lastCall + PACE_MS - Date.now();
	if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
	lastCall = Date.now();
	return await operation();
}

const unwrap = <T>(response: unknown): T =>
	(response as { data: T }).data ?? (response as T);

/**
 * Reports a schema failure without printing the data that failed.
 *
 * This suite runs against a real account, so an offending value could be a task
 * title, a profile line or a message. Zod issues can carry the input alongside
 * the diagnosis, and the diagnosis is the only part worth seeing: which field,
 * what rule, what went wrong.
 */
function describeIssues(error: { issues: readonly unknown[] }): string[] {
	return error.issues.map((raw) => {
		const issue = raw as { path?: unknown[]; code?: string; message?: string };
		const where = (issue.path ?? []).join('.') || '(root)';
		return `${where}: ${issue.code ?? 'invalid'} - ${issue.message ?? ''}`;
	});
}

/**
 * A raw request, for the few checks that must bypass the plugin's transport.
 *
 * Those checks look at status codes and headers the helpers deliberately hide -
 * whether a route exists at all, what the rate-limit headers say - so they call
 * `fetch` directly. Building the URL and headers from the exported constants
 * keeps them pointed at the same API the plugin uses.
 */
const apiUrl = (path: string) => `${HABITICA_API_BASE}/${path}`;
const authHeaders = () => ({
	'x-api-user': credentials.userId,
	'x-api-key': credentials.apiToken,
	'x-client': HABITICA_CLIENT_ID,
});

/** Probe objects are named so anything left behind is obvious on the account. */
const PROBE = 'corsair integration probe - safe to delete';

describeLive('Habitica live API', () => {
	describe('the shape of what comes back', () => {
		it('returns tasks that parse as the task entity', async () => {
			const tasks = unwrap<unknown[]>(
				await paced(() => makeHabiticaRequest('tasks/user', credentials)),
			);
			expect(Array.isArray(tasks)).toBe(true);
			for (const task of tasks) {
				const parsed = HabiticaTaskEntity.safeParse(task);
				if (!parsed.success) console.error(describeIssues(parsed.error));
				expect(parsed.success).toBe(true);
			}
		});

		it('returns tags that parse as the tag entity', async () => {
			const tags = unwrap<unknown[]>(
				await paced(() => makeHabiticaRequest('tags', credentials)),
			);
			for (const tag of tags) {
				expect(HabiticaTagEntity.safeParse(tag).success).toBe(true);
			}
		});

		it('returns the Tavern as a group entity', async () => {
			const group = unwrap<unknown>(
				await paced(() => makeHabiticaRequest('groups/habitrpg', credentials)),
			);
			const parsed = HabiticaGroupEntity.safeParse(group);
			if (!parsed.success) console.error(describeIssues(parsed.error));
			expect(parsed.success).toBe(true);
		});

		it('returns challenges that parse as the challenge entity', async () => {
			const challenges = unwrap<unknown[]>(
				await paced(() =>
					makeHabiticaRequest('challenges/user?page=0', credentials),
				),
			);
			for (const challenge of challenges) {
				const parsed = HabiticaChallengeEntity.safeParse(challenge);
				if (!parsed.success) console.error(describeIssues(parsed.error));
				expect(parsed.success).toBe(true);
			}
		});
	});

	describe('the behaviours this plugin documents', () => {
		/**
		 * The unfiltered catalogue, fetched once and shared.
		 *
		 * Not premature tidying: the response is 2.65 MB and the rate limit is 30
		 * requests a minute for the whole suite. Fetching it per test pushed the
		 * run over the ceiling and produced a 429 that looked like a failed
		 * assertion.
		 */
		let allContentKeys: string[] = [];

		beforeAll(async () => {
			allContentKeys = Object.keys(
				unwrap<Record<string, unknown>>(
					await paced(() => makeHabiticaAnonymousRequest('content')),
				),
			);
		});

		it('EXCLUDES the categories named in the content filter', async () => {
			// The catalog says `filter` selects a category. It removes one. This is
			// the single most consequential finding in the integration, so it is
			// pinned live: if Habitica ever fixes it, this test fails and the
			// documentation in content.ts stops being a lie.
			const filtered = unwrap<Record<string, unknown>>(
				await paced(() =>
					makeHabiticaAnonymousRequest('content?filter=quests'),
				),
			);

			expect(allContentKeys).toContain('quests');
			// Judged by comparing key sets, never by the status code - both are 200.
			expect(Object.keys(filtered)).not.toContain('quests');
			expect(Object.keys(filtered).length).toBe(allContentKeys.length - 1);
		});

		it('ignores an unrecognised content filter key silently', async () => {
			const bogus = unwrap<Record<string, unknown>>(
				await paced(() =>
					makeHabiticaAnonymousRequest('content?filter=notARealContentKey'),
				),
			);
			expect(Object.keys(bogus).length).toBe(allContentKeys.length);
		});

		it('rejects `task` as a model, which the catalog lists as valid', async () => {
			await expect(
				paced(() => makeHabiticaAnonymousRequest('models/task/paths')),
			).rejects.toBeDefined();

			// The four task types are addressed individually instead.
			const daily = unwrap<Record<string, unknown>>(
				await paced(() => makeHabiticaAnonymousRequest('models/daily/paths')),
			);
			expect(Object.keys(daily).length).toBeGreaterThan(0);
		});

		it('requires `page` on the user challenge list', async () => {
			await expect(
				paced(() => makeHabiticaRequest('challenges/user', credentials)),
			).rejects.toBeDefined();

			await expect(
				paced(() => makeHabiticaRequest('challenges/user?page=0', credentials)),
			).resolves.toBeDefined();
		});

		it('has no DELETE /groups/:groupId, so the catalog fallback is dead', async () => {
			// A ghost id, so nothing real can be affected. Both requests 404 - the
			// status settles nothing and the message is the discriminator.
			const ghost = '11111111-2222-4333-8444-555555555555';

			const unrouted = await paced(async () => {
				const res = await fetch(apiUrl(`groups/${ghost}`), {
					method: 'DELETE',
					headers: authHeaders(),
				});
				return (await res.json()) as { message?: string };
			});

			const realRoute = await paced(async () => {
				const res = await fetch(apiUrl(`groups/${ghost}`), {
					method: 'GET',
					headers: authHeaders(),
				});
				return (await res.json()) as { message?: string };
			});

			// A real route with a missing record says so; an unrouted path does not.
			expect(realRoute.message).toMatch(/Group not found/i);
			expect(unrouted.message).toBe('Not found.');
			expect(unrouted.message).not.toBe(realRoute.message);
		});

		it('rejects a request with no x-client header, even unauthenticated', async () => {
			const res = await paced(() => fetch(apiUrl('content')));
			expect(res.status).toBe(400);
			const body = (await res.json()) as { message?: string };
			expect(body.message).toMatch(/x-client/i);
		});
	});

	describe('the export documents', () => {
		it('reaches all three with header auth, despite authWithSession in the source', async () => {
			// Asserted by reachability and content type only. The bodies are the
			// account holder's data - userdata.json carries their email address -
			// so nothing here reads or prints them.
			const history = await paced(() =>
				makeHabiticaExportRequest('history.csv', credentials),
			);
			expect(history.contentType).toContain('text/csv');
			expect(history.body.length).toBeGreaterThan(0);

			const inbox = await paced(() =>
				makeHabiticaExportRequest('inbox.html', credentials),
			);
			expect(inbox.contentType).toContain('text/html');

			const userData = await paced(() =>
				makeHabiticaExportRequest('userdata.json', credentials),
			);
			expect(userData.contentType).toContain('application/json');
			// Parses as JSON, without inspecting or logging any field.
			expect(() => JSON.parse(userData.body)).not.toThrow();
		});

		it('serves the exports from outside the versioned base', () => {
			expect(HABITICA_ROOT_BASE).not.toContain('/api/v3');
		});
	});

	describe('a write, created and cleaned up', () => {
		it('creates, reads, renames and deletes a tag', async () => {
			let tagId: string | undefined;
			try {
				const created = unwrap<{ id: string; name: string }>(
					await paced(() =>
						makeHabiticaRequest('tags', credentials, {
							method: 'POST',
							body: { name: PROBE },
						}),
					),
				);
				tagId = created.id;
				expect(HabiticaTagEntity.safeParse(created).success).toBe(true);

				const renamed = unwrap<{ name: string }>(
					await paced(() =>
						makeHabiticaRequest(`tags/${tagId}`, credentials, {
							method: 'PUT',
							body: { name: `${PROBE} (renamed)` },
						}),
					),
				);
				expect(renamed.name).toContain('renamed');
			} finally {
				if (tagId) {
					await paced(() =>
						makeHabiticaRequest(`tags/${tagId}`, credentials, {
							method: 'DELETE',
						}),
					).catch((error) => {
						// A probe left behind on a real account should be visible.
						console.error('failed to clean up probe tag', tagId, error);
					});
				}
			}
		});

		it('creates and deletes a webhook, and reads its failure counter', async () => {
			let webhookId: string | undefined;
			try {
				const created = unwrap<{ id: string; failures?: number }>(
					await paced(() =>
						makeHabiticaRequest('user/webhook', credentials, {
							method: 'POST',
							body: {
								url: 'https://example.com/corsair-integration-probe',
								label: PROBE,
								type: 'taskActivity',
								enabled: false,
							},
						}),
					),
				);
				webhookId = created.id;
				expect(HabiticaWebhookEntity.safeParse(created).success).toBe(true);

				// `failures` is the only webhook health signal Habitica offers, and
				// the reason webhooks are mirrored at all.
				expect(created.failures).toBe(0);

				// Subscribe is an update setting enabled=true, not its own route.
				const enabled = unwrap<{ enabled: boolean }>(
					await paced(() =>
						makeHabiticaRequest(`user/webhook/${webhookId}`, credentials, {
							method: 'PUT',
							body: { enabled: true },
						}),
					),
				);
				expect(enabled.enabled).toBe(true);
			} finally {
				if (webhookId) {
					await paced(() =>
						makeHabiticaRequest(`user/webhook/${webhookId}`, credentials, {
							method: 'DELETE',
						}),
					).catch((error) => {
						console.error('failed to clean up probe webhook', webhookId, error);
					});
				}
			}
		});
	});

	describe('rate limiting', () => {
		it('reports a limit of 30 per minute in the response headers', async () => {
			const res = await paced(() =>
				fetch(apiUrl('user?userFields=_id'), { headers: authHeaders() }),
			);
			expect(res.headers.get('x-ratelimit-limit')).toBe('30');
			expect(Number(res.headers.get('x-ratelimit-remaining'))).toBeLessThan(30);
		});

		it('sends x-ratelimit-reset as a date string, which is why it is unconfigured', async () => {
			const res = await paced(() =>
				fetch(apiUrl('user?userFields=_id'), { headers: authHeaders() }),
			);
			const reset = res.headers.get('x-ratelimit-reset');
			expect(reset).toBeTruthy();
			// A number is what the shared helper expects; this is not one.
			expect(Number.isNaN(Number.parseInt(reset ?? '', 10))).toBe(true);
			expect(Number.isNaN(new Date(reset ?? '').getTime())).toBe(false);
		});
	});
});
