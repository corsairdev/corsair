/**
 * Live tests against a real Formbricks Cloud workspace.
 *
 * Excluded from a default run by `testPathIgnorePatterns` in `jest.config.cjs`, excluded from CI by
 * the same flag on the command line, and self-skipping when no key is present, so a checkout without
 * credentials runs green and reaches no network at all.
 *
 * **This suite writes, and every write is cleaned up.** That is a deliberate difference from a
 * read-only live suite, and it is justified by what Formbricks is: an empty workspace has no
 * surveys, responses, contacts or webhooks to read, so a read-only suite would assert almost
 * nothing. Each test creates what it needs, verifies it, and deletes it in a `finally`; the counts
 * are compared before and after, and a mismatch fails the run rather than being tidied away.
 *
 * What is **not** exercised: pre-existing records. The seeded survey the workspace starts with
 * is read but never modified or deleted. Contact cleanup deletes only ids or emails this suite
 * created — never `GET management/contacts` followed by a wipe of every row.
 *
 * To run:
 *   FORMBRICKS_API_KEY=<key> pnpm test:live
 *
 * The key must be **workspace-scoped**. An organization-scoped key returns 401 on most management
 * routes, and `v1/management/me` says so explicitly - see the scope test below.
 */
import { makeFormbricksRequest } from './client';
import {
	FormbricksActionClassEntity,
	FormbricksContactAttributeKeyEntity,
	FormbricksSurveyEntity,
	FormbricksTeamEntity,
	FormbricksWebhookEntity,
} from './schema/database';
import {
	FormbricksContact,
	FormbricksHealth,
	FormbricksMe,
	FormbricksResponse,
	FormbricksRole,
} from './schema/responses';

const apiKey = process.env.FORMBRICKS_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

/** Unwraps the `{ data }` envelope, as the plugin's own call helper does. */
async function call<T>(
	version: 'v1' | 'v2',
	path: string,
	options: Parameters<typeof makeFormbricksRequest>[3] = {},
): Promise<T> {
	const payload = await makeFormbricksRequest<{ data?: T } | T>(
		version,
		path,
		apiKey as string,
		options,
	);
	return payload !== null && typeof payload === 'object' && 'data' in payload
		? (payload as { data: T }).data
		: (payload as T);
}

/**
 * Asserts a call fails with a given status, and optionally that the API's own explanation appears in
 * the error **body**.
 *
 * Matching on the message does not work, and finding that out is worth recording: for a status
 * Corsair maps, `ApiError.message` is the generic name of the status - a 403 arrives as `"Forbidden"`,
 * not as Formbricks' `"Survey is not accepting submissions"`. For an unmapped status like 422, the
 * message is built by interpolating the body into a string, so an object body renders as the literal
 * text `"[object Object]"` and the field-level detail is lost from the message entirely.
 *
 * `ApiError.body` keeps the parsed payload in both cases, so that is what these assertions read. A
 * thunk rather than a promise, so a rejection is never created before there is a handler for it.
 */
async function expectApiError(
	run: () => Promise<unknown>,
	status: number,
	detail?: RegExp,
): Promise<void> {
	try {
		await run();
	} catch (error) {
		const apiError = error as {
			status?: number;
			body?: unknown;
			message?: string;
		};
		expect(apiError.status).toBe(status);
		if (detail) {
			expect(JSON.stringify(apiError.body)).toMatch(detail);
		}
		return;
	}
	throw new Error(`expected the call to fail with ${status}, but it succeeded`);
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

/** Deletes one contact this suite created. No-op when the id never arrived. */
async function deleteCreatedContact(
	id: string | null | undefined,
): Promise<void> {
	if (!id) return;
	await call('v1', `management/contacts/${id}`, { method: 'DELETE' });
}

/**
 * Deletes contacts whose email attribute matches one this test uploaded.
 * Looks up by attribute value so a bulk create that does not return ids can still be scoped.
 */
async function deleteCreatedContactsByEmail(emails: string[]): Promise<void> {
	const wanted = new Set(emails);
	const keys =
		(await call<Array<{ id: string; key: string }>>(
			'v2',
			'management/contact-attribute-keys',
		)) ?? [];
	const emailKeyId = keys.find((key) => key.key === 'email')?.id;
	if (!emailKeyId) return;
	const values =
		(await call<
			Array<{ contactId: string; attributeKeyId: string; value: string }>
		>('v1', 'management/contact-attributes')) ?? [];
	const ids = [
		...new Set(
			values
				.filter(
					(row) => row.attributeKeyId === emailKeyId && wanted.has(row.value),
				)
				.map((row) => row.contactId),
		),
	];
	for (const id of ids) {
		await deleteCreatedContact(id);
	}
}

const QUESTION = {
	id: 'q1',
	type: 'openText',
	headline: { default: 'Probe question' },
	required: false,
	inputType: 'text',
	charLimit: { enabled: false },
};

describeLive('Formbricks API (live)', () => {
	let workspaceId: string;
	let organizationId: string;

	/** Counts of everything this suite creates, so leftovers are detectable. */
	const counts = async () => ({
		surveys: ((await call<unknown[]>('v1', 'management/surveys')) ?? []).length,
		responses: ((await call<unknown[]>('v1', 'management/responses')) ?? [])
			.length,
		actionClasses: (
			(await call<unknown[]>('v1', 'management/action-classes')) ?? []
		).length,
		webhooks: ((await call<unknown[]>('v2', 'management/webhooks')) ?? [])
			.length,
		contacts: ((await call<unknown[]>('v1', 'management/contacts')) ?? [])
			.length,
		attributeKeys: (
			(await call<unknown[]>('v1', 'management/contact-attribute-keys')) ?? []
		).length,
		// Teams are counted because the paging sweep creates them. `POST organizations/{id}/teams` is
		// not a catalog operation and was only found while looking for a way to seed the teams list, so
		// a leftover team is exactly the kind of residue nothing else here would notice.
		teams: (
			(await call<unknown[]>('v2', `organizations/${organizationId}/teams`)) ??
			[]
		).length,
		workspaceTeams: (
			(await call<unknown[]>(
				'v2',
				`organizations/${organizationId}/workspace-teams`,
			)) ?? []
		).length,
	});
	let before: Awaited<ReturnType<typeof counts>>;

	beforeAll(async () => {
		const me = await call<{
			organizationId: string;
			workspacePermissions: { workspaceId: string }[];
		}>('v2', 'me');

		const first = me.workspacePermissions?.[0]?.workspaceId;
		if (!first) {
			throw new Error(
				'live suite precondition failed: this API key has no workspace permissions, so ' +
					'every workspace-scoped route will answer 401. Create a workspace-scoped key.',
			);
		}
		workspaceId = first;
		organizationId = me.organizationId;
		before = await counts();
	});

	afterAll(async () => {
		const after = await counts();
		expect(after).toEqual(before);
	});

	it('authenticates and resolves the workspace and organization', () => {
		expect(workspaceId).toBeTruthy();
		expect(organizationId).toBeTruthy();
		// The two are different values, and using one where the other is wanted is a 400.
		expect(workspaceId).not.toBe(organizationId);
	});

	/**
	 * The key's scope is the single most common way this plugin fails, so it is pinned. An
	 * organization-scoped key answers 401 on workspace-scoped routes, and v1's `me` route says so in
	 * words rather than just failing.
	 */
	it('reports the key scope, which decides what the key can reach', async () => {
		const me = await call<Record<string, unknown>>('v2', 'me');

		expect(FormbricksMe.safeParse(me).success).toBe(true);
		expect(Array.isArray(me.workspacePermissions)).toBe(true);
		expect((me.workspacePermissions as unknown[]).length).toBeGreaterThan(0);
	});

	it('reads health, and it is snake_case unlike the rest of the API', async () => {
		const health = await call<Record<string, unknown>>('v2', 'health');

		expect(FormbricksHealth.safeParse(health).success).toBe(true);
		expect(Object.keys(health)).toContain('main_database');
	});

	/** Roles are bare strings, not objects. */
	it('returns roles as plain strings', async () => {
		const roles = await call<unknown[]>('v2', 'roles');

		expect(Array.isArray(roles)).toBe(true);
		expect(roles.length).toBeGreaterThan(0);
		for (const role of roles) {
			expect(typeof role).toBe('string');
			expect(FormbricksRole.safeParse(role).success).toBe(true);
		}
	});

	it('reads the existing surveys, and every row parses', async () => {
		expectEveryRowParses(
			await call('v1', 'management/surveys'),
			FormbricksSurveyEntity,
			'survey',
		);
	});

	it('reads contact attribute keys, and every row parses', async () => {
		const keys = await call<unknown[]>(
			'v1',
			'management/contact-attribute-keys',
		);

		expectEveryRowParses(
			keys,
			FormbricksContactAttributeKeyEntity,
			'attribute key',
		);
		// A new workspace starts with five: userId, email, firstName, lastName, language.
		expect(keys.length).toBeGreaterThanOrEqual(5);
	});

	it('reads organization teams, and every row parses', async () => {
		expectEveryRowParses(
			await call('v2', `organizations/${organizationId}/teams`),
			FormbricksTeamEntity,
			'team',
		);
	});

	/**
	 * `workspaceId` is required in the body of most writes - not merely in the key's scope. Asserted
	 * because it is the single most common validation failure on this API and the v1 error does not
	 * name the field.
	 */
	it('rejects a create with no workspaceId in the body', async () => {
		await expect(
			call('v1', 'management/surveys', {
				method: 'POST',
				body: { name: 'should not be created', questions: [QUESTION] },
			}),
		).rejects.toMatchObject({ status: 400 });
	});

	/**
	 * A survey round trip: create, read, update, delete.
	 *
	 * The update method is the interesting part - **PUT**, not POST. The v1 documentation says POST,
	 * and POST on the item route answers 405.
	 */
	it('creates, updates and deletes a survey', async () => {
		let surveyId: string | undefined;
		try {
			const created = await call<{ id: string; name: string }>(
				'v1',
				'management/surveys',
				{
					method: 'POST',
					body: {
						workspaceId,
						name: 'corsair live probe',
						questions: [QUESTION],
					},
				},
			);
			surveyId = created.id;
			expect(FormbricksSurveyEntity.safeParse(created).success).toBe(true);

			const updated = await call<{ name: string }>(
				'v1',
				`management/surveys/${surveyId}`,
				{ method: 'PUT', body: { name: 'corsair live probe renamed' } },
			);
			expect(updated.name).toBe('corsair live probe renamed');
		} finally {
			if (surveyId) {
				await call('v1', `management/surveys/${surveyId}`, {
					method: 'DELETE',
				});
			}
		}
	});

	/** POST on an item route is not an update - it is a 405. Pinned so the method cannot drift. */
	it('answers 405 to a POST on a survey item route', async () => {
		let surveyId: string | undefined;
		try {
			const created = await call<{ id: string }>('v1', 'management/surveys', {
				method: 'POST',
				body: { workspaceId, name: 'corsair 405 probe', questions: [QUESTION] },
			});
			surveyId = created.id;

			await expect(
				call('v1', `management/surveys/${surveyId}`, {
					method: 'POST',
					body: { name: 'via POST' },
				}),
			).rejects.toMatchObject({ status: 405 });
		} finally {
			if (surveyId) {
				await call('v1', `management/surveys/${surveyId}`, {
					method: 'DELETE',
				});
			}
		}
	});

	/**
	 * The server bug the input schema works around: `PUT responses/{id}` answers **500** when `data`
	 * is absent, where every sibling endpoint answers 422.
	 *
	 * Pinned live so that if Formbricks fixes it, this test fails and the `data` requirement can be
	 * relaxed - rather than the workaround outliving the bug silently.
	 */
	it('500s on a response update without data, which is why the schema requires it', async () => {
		let surveyId: string | undefined;
		let responseId: string | undefined;
		try {
			const survey = await call<{ id: string }>('v1', 'management/surveys', {
				method: 'POST',
				body: {
					workspaceId,
					name: 'corsair response probe',
					questions: [QUESTION],
				},
			});
			surveyId = survey.id;

			const response = await call<{ id: string }>(
				'v1',
				'management/responses',
				{
					method: 'POST',
					body: {
						workspaceId,
						surveyId,
						finished: false,
						data: { q1: 'probe' },
					},
				},
			);
			responseId = response.id;
			expect(FormbricksResponse.safeParse(response).success).toBe(true);

			// Without `data`: a 500, not a 422.
			await expect(
				call('v1', `management/responses/${responseId}`, {
					method: 'PUT',
					body: { finished: true },
				}),
			).rejects.toMatchObject({ status: 500 });

			// With `data`, even an empty object: fine.
			const updated = await call<{ finished: boolean }>(
				'v1',
				`management/responses/${responseId}`,
				{ method: 'PUT', body: { data: {}, finished: true } },
			);
			expect(updated.finished).toBe(true);
		} finally {
			if (responseId) {
				await call('v1', `management/responses/${responseId}`, {
					method: 'DELETE',
				});
			}
			if (surveyId) {
				await call('v1', `management/surveys/${surveyId}`, {
					method: 'DELETE',
				});
			}
		}
	});

	/**
	 * Contacts and attribute keys, which an earlier reading of the code and the pricing page
	 * concluded were Pro-only. They are not - full CRUD works on this plan. Pinned so the wrong
	 * conclusion cannot be re-drawn from the same two facts.
	 */
	/**
	 * The two versions disagree about whether an attribute-key update may be partial, and the plugin's
	 * input schema declares both fields optional - so the version it calls is load-bearing.
	 *
	 * v2 re-validates the whole object; v1 patches. The plugin called v2 while advertising optional
	 * fields, which meant updating one field answered 422 every time. Pinned here so the API behaviour
	 * this depends on is asserted rather than remembered.
	 */
	it('accepts a partial attribute-key update on v1 and rejects it on v2', async () => {
		const created = await call<{
			id: string;
			name: string;
			description: string;
		}>('v2', 'management/contact-attribute-keys', {
			method: 'POST',
			body: {
				workspaceId,
				key: 'corsair_partial_probe',
				name: 'Corsair Probe',
				description: 'probe',
			},
		});

		try {
			// v2 refuses a body missing either field, naming the one it wants.
			await expectApiError(
				() =>
					call('v2', `management/contact-attribute-keys/${created.id}`, {
						method: 'PUT',
						body: { name: 'Renamed On v2' },
					}),
				422,
				/description/,
			);

			// v1 applies it and leaves the untouched field alone - which is what makes the plugin's
			// "both fields optional" contract honest.
			const patched = await call<{ name: string; description: string }>(
				'v1',
				`management/contact-attribute-keys/${created.id}`,
				{ method: 'PUT', body: { name: 'Renamed On v1' } },
			);
			expect(patched.name).toBe('Renamed On v1');
			expect(patched.description).toBe('probe');
		} finally {
			await call('v1', `management/contact-attribute-keys/${created.id}`, {
				method: 'DELETE',
			});
		}
	});

	it('creates and deletes a contact and an attribute key', async () => {
		let contactId: string | undefined;
		let keyId: string | undefined;
		try {
			const contact = await call<{ id: string }>('v2', 'management/contacts', {
				method: 'POST',
				body: { workspaceId, attributes: { email: 'live.probe@example.com' } },
			});
			contactId = contact.id;
			expect(FormbricksContact.safeParse(contact).success).toBe(true);

			// `description` is required - a 422 without it.
			await expect(
				call('v2', 'management/contact-attribute-keys', {
					method: 'POST',
					body: { workspaceId, key: 'corsair_live', name: 'Corsair Live' },
				}),
			).rejects.toMatchObject({ status: 422 });

			const key = await call<{ id: string }>(
				'v2',
				'management/contact-attribute-keys',
				{
					method: 'POST',
					body: {
						workspaceId,
						key: 'corsair_live',
						name: 'Corsair Live',
						description: 'temporary, created by the live suite',
					},
				},
			);
			keyId = key.id;
			expect(FormbricksContactAttributeKeyEntity.safeParse(key).success).toBe(
				true,
			);
		} finally {
			if (contactId) {
				await call('v1', `management/contacts/${contactId}`, {
					method: 'DELETE',
				});
			}
			if (keyId) {
				await call('v2', `management/contact-attribute-keys/${keyId}`, {
					method: 'DELETE',
				});
			}
		}
	});

	/**
	 * v1 and v2 webhooks are the **same resource**, not two. Verified by creating through one version
	 * and reading through the other - which is why the plugin uses v2 throughout rather than
	 * registering both.
	 *
	 * Also confirms the create returns a `secret` that the list does not, which is why the plugin
	 * strips it before mirroring.
	 */
	it('shares webhook storage between v1 and v2, and returns a secret only on create', async () => {
		let webhookId: string | undefined;
		try {
			const created = await call<{ id: string; secret?: string; url: string }>(
				'v1',
				'webhooks',
				{
					method: 'POST',
					body: {
						workspaceId,
						url: 'https://example.com/corsair-live-probe',
						triggers: ['responseCreated'],
					},
				},
			);
			webhookId = created.id;
			expect(FormbricksWebhookEntity.safeParse(created).success).toBe(true);
			// The create carries a signing secret.
			expect(typeof created.secret).toBe('string');

			// And v2 sees the v1-created record.
			const viaV2 = await call<{ id: string; secret?: string }[]>(
				'v2',
				'management/webhooks',
			);
			const found = viaV2.find((w) => w.id === webhookId);
			expect(found).toBeDefined();
			// But the list projection does not carry the secret.
			expect(found?.secret).toBeUndefined();
		} finally {
			if (webhookId) {
				await call('v1', `webhooks/${webhookId}`, { method: 'DELETE' });
			}
		}
	});

	it('creates and deletes an action class', async () => {
		let actionId: string | undefined;
		try {
			const created = await call<{ id: string }>(
				'v1',
				'management/action-classes',
				{
					method: 'POST',
					body: {
						workspaceId,
						name: 'corsair live action',
						description: 'temporary',
						type: 'code',
						key: 'corsair_live_action',
					},
				},
			);
			actionId = created.id;
			expect(FormbricksActionClassEntity.safeParse(created).success).toBe(true);
		} finally {
			if (actionId) {
				await call('v1', `management/action-classes/${actionId}`, {
					method: 'DELETE',
				});
			}
		}
	});

	/**
	 * Paging, judged **by effect**, on **every list route rather than one**.
	 *
	 * The first version of this test seeded three surveys, established `limit` + `offset`, saw `skip`
	 * ignored, and stopped. The input schemas then generalised that single result to all nine list
	 * operations - and `v1 management/surveys` turns out to be the *only* route in the API that honours
	 * `offset`. Six operations shipped paging with the wrong parameter, each returning page one with a
	 * 200.
	 *
	 * So the sweep is the point of the test, not the assertions about any one route. Judged by effect
	 * because a discarded parameter is a 200: only comparing the returned ids distinguishes a cursor
	 * that moved from one that did not.
	 */
	it('honours skip on every pageable route except surveys, which takes offset', async () => {
		const created: { surveys: string[]; webhooks: string[]; teams: string[] } =
			{
				surveys: [],
				webhooks: [],
				teams: [],
			};

		/** Ids of one page, so two pages can be compared for identity. */
		const pageIds = async (
			version: 'v1' | 'v2',
			path: string,
			query: string,
		) => {
			const rows = await call<Array<{ id?: string }>>(
				version,
				`${path}${query}`,
			);
			return (rows ?? []).map((row) => row.id ?? JSON.stringify(row));
		};

		/**
		 * Returns which cursor name actually advances the page.
		 *
		 * `'none'` means `limit` itself is ignored - the route returns every row regardless - which is
		 * true of four v1 routes and is why those operations expose no paging parameters at all.
		 */
		const cursorStyle = async (version: 'v1' | 'v2', path: string) => {
			const all = await pageIds(version, path, '');
			if (all.length < 2) return 'indeterminate';

			const first = await pageIds(version, path, '?limit=1');
			if (first.length !== 1) return 'none';

			const byOffset = await pageIds(version, path, '?limit=1&offset=1');
			const bySkip = await pageIds(version, path, '?limit=1&skip=1');
			const offsetMoved = byOffset[0] !== undefined && byOffset[0] !== first[0];
			const skipMoved = bySkip[0] !== undefined && bySkip[0] !== first[0];

			if (offsetMoved && skipMoved) return 'both';
			if (offsetMoved) return 'offset';
			if (skipMoved) return 'skip';
			return 'neither';
		};

		try {
			// Three rows per route, because with fewer than two every cursor looks like it works.
			for (const n of [1, 2, 3]) {
				const survey = await call<{ id: string }>('v1', 'management/surveys', {
					method: 'POST',
					body: {
						workspaceId,
						name: `corsair page ${n}`,
						questions: [QUESTION],
					},
				});
				created.surveys.push(survey.id);

				const webhook = await call<{ id: string }>(
					'v2',
					'management/webhooks',
					{
						method: 'POST',
						body: {
							workspaceId,
							name: `corsair page hook ${n}`,
							url: `https://example.com/corsair-page-${n}`,
							source: 'user',
							triggers: ['responseCreated'],
							surveyIds: [],
						},
					},
				);
				created.webhooks.push(webhook.id);

				const team = await call<{ id: string }>(
					'v2',
					`organizations/${organizationId}/teams`,
					{ method: 'POST', body: { name: `corsair page team ${n}` } },
				);
				created.teams.push(team.id);
			}

			expect(await cursorStyle('v1', 'management/surveys')).toBe('offset');

			for (const [version, path] of [
				['v2', 'management/webhooks'],
				['v2', `organizations/${organizationId}/teams`],
				['v2', 'management/contact-attribute-keys'],
			] as const) {
				expect(await cursorStyle(version, path)).toBe('skip');
			}

			// And the routes that page not at all. Asserted rather than assumed, because these are the
			// operations whose input schemas deliberately omit `limit` and `offset` - if a route started
			// honouring them, that omission would become the inaccuracy instead.
			for (const [version, path] of [
				['v1', 'management/contacts'],
				['v1', 'management/action-classes'],
				['v1', 'management/contact-attributes'],
				['v1', 'management/contact-attribute-keys'],
			] as const) {
				const style = await cursorStyle(version, path);
				expect(['none', 'indeterminate']).toContain(style);
			}

			// `meta` reports an `offset` on the very routes that ignore it. Pinned, because reading the
			// envelope instead of testing the effect is exactly how the original mistake survived.
			const enveloped = await makeFormbricksRequest<{ meta?: unknown }>(
				'v2',
				'management/webhooks',
				apiKey as string,
			);
			expect(enveloped.meta).toMatchObject({ offset: expect.any(Number) });
		} finally {
			for (const id of created.webhooks) {
				await call('v2', `management/webhooks/${id}`, { method: 'DELETE' });
			}
			for (const id of created.surveys) {
				await call('v1', `management/surveys/${id}`, { method: 'DELETE' });
			}
			for (const id of created.teams) {
				await call('v2', `organizations/${organizationId}/teams/${id}`, {
					method: 'DELETE',
				});
			}
		}
	});

	/**
	 * `PUT` on a webhook re-validates the whole body, so a partial update is a 422 naming the fields
	 * left out. This is the check the plugin shipped without: `webhooks.update` omitted `source` and
	 * therefore failed every call, and nothing noticed because no test sent an update body.
	 */
	it('rejects a partial webhook update and accepts a complete one', async () => {
		const webhook = await call<{ id: string; secret?: string }>(
			'v2',
			'management/webhooks',
			{
				method: 'POST',
				body: {
					workspaceId,
					name: 'corsair update probe',
					url: 'https://example.com/corsair-update',
					source: 'user',
					triggers: ['responseCreated'],
					surveyIds: [],
				},
			},
		);

		try {
			// Exactly the body the first draft sent: everything but `source`.
			await expectApiError(
				() =>
					call('v2', `management/webhooks/${webhook.id}`, {
						method: 'PUT',
						body: {
							name: 'corsair renamed',
							url: 'https://example.com/corsair-renamed',
							triggers: ['responseCreated'],
							surveyIds: [],
						},
					}),
				422,
				/source/,
			);

			const updated = await call<{ name: string; source: string }>(
				'v2',
				`management/webhooks/${webhook.id}`,
				{
					method: 'PUT',
					body: {
						workspaceId,
						name: 'corsair renamed',
						url: 'https://example.com/corsair-renamed',
						source: 'user',
						triggers: ['responseFinished'],
						surveyIds: [],
					},
				},
			);
			expect(updated.name).toBe('corsair renamed');
		} finally {
			await call('v2', `management/webhooks/${webhook.id}`, {
				method: 'DELETE',
			});
		}
	});

	/**
	 * Storage returns an S3 **presigned POST** grant from the management route for both access types.
	 * The client-scoped route the plugin first used for private uploads answers 400 to every body.
	 */
	it('returns a presigned POST grant for both access types', async () => {
		for (const accessType of ['public', 'private'] as const) {
			const grant = await call<{
				signedUrl: string;
				presignedFields: Record<string, string>;
				fileUrl: string;
			}>('v1', 'management/storage', {
				method: 'POST',
				body: {
					workspaceId,
					fileName: 'corsair-probe.png',
					fileType: 'image/png',
					accessType,
				},
			});

			expect(typeof grant.signedUrl).toBe('string');
			expect(typeof grant.fileUrl).toBe('string');
			// The fields carry the signature - this is the part the earlier schema omitted entirely.
			expect(Object.keys(grant.presignedFields)).toEqual(
				expect.arrayContaining(['key', 'Policy', 'X-Amz-Signature']),
			);
			// And the two fields the earlier schema declared are not returned at all.
			expect('url' in grant).toBe(false);
			expect('fileName' in grant).toBe(false);
		}

		// The route the plugin used to call for private uploads, pinned so a "restore the client route"
		// change fails here rather than in production.
		await expectApiError(
			() =>
				call('v1', `client/${workspaceId}/storage`, {
					method: 'POST',
					body: {
						fileName: 'corsair-probe.pdf',
						fileType: 'application/pdf',
					},
				}),
			400,
		);
	});

	/**
	 * A display links by `userId`. Passing a real `contactId` is accepted with a 200 and **ignored** -
	 * the display is stored unlinked - which is what the plugin originally sent.
	 *
	 * Also pins the 403 that made the first attempt give up on this family: a `draft` survey refuses
	 * submissions, and the message reads like a permissions failure rather than a status one.
	 */
	it('links a display by userId and ignores contactId', async () => {
		let createdContactId: string | undefined;
		const survey = await call<{ id: string; status: string }>(
			'v1',
			'management/surveys',
			{
				method: 'POST',
				body: {
					workspaceId,
					name: 'corsair display probe',
					type: 'link',
					questions: [QUESTION],
				},
			},
		);

		try {
			// Draft surveys refuse displays, which is why respondent state looked unreachable at first.
			// A 403 whose message is the word "Forbidden" once Corsair has mapped the status - the
			// explanation survives only in the body.
			await expectApiError(
				() =>
					call('v1', `client/${workspaceId}/displays`, {
						method: 'POST',
						body: { surveyId: survey.id },
					}),
				403,
				/not accepting submissions/,
			);

			await call('v1', `management/surveys/${survey.id}`, {
				method: 'PUT',
				body: { status: 'inProgress' },
			});

			const anonymous = await call<{
				id: string;
				contactId: string | null;
				surveyId: string;
			}>('v1', `client/${workspaceId}/displays`, {
				method: 'POST',
				body: { surveyId: survey.id },
			});
			expect(anonymous.contactId).toBeNull();
			// Three fields and no timestamps, unlike every other record in this API.
			expect('createdAt' in anonymous).toBe(false);

			const identified = await call<{ contactId: string | null }>(
				'v1',
				`client/${workspaceId}/displays`,
				{
					method: 'POST',
					body: { surveyId: survey.id, userId: 'corsair-display-user' },
				},
			);
			expect(typeof identified.contactId).toBe('string');
			if (typeof identified.contactId === 'string') {
				createdContactId = identified.contactId;
			}

			// The parameter the plugin used to send: accepted, and silently not applied.
			const withContactId = await call<{ contactId: string | null }>(
				'v1',
				`client/${workspaceId}/displays`,
				{
					method: 'POST',
					body: { surveyId: survey.id, contactId: identified.contactId },
				},
			);
			expect(withContactId.contactId).toBeNull();
		} finally {
			await call('v1', `management/surveys/${survey.id}`, {
				method: 'DELETE',
			});
			await deleteCreatedContact(createdContactId);
		}
	});

	/**
	 * Respondent state comes from `POST client/{workspaceId}/user`, not from the environment bundle the
	 * plugin originally read, and every `GET` spelling of it is a 404.
	 */
	it('reads contact state from the client user route, and no GET route exists', async () => {
		let createdContactId: string | undefined;
		try {
			const state = await call<{
				state?: { data?: Record<string, unknown>; expiresAt?: string };
			}>('v2', `client/${workspaceId}/user`, {
				method: 'POST',
				body: { userId: 'corsair-state-user' },
			});
			const contactId = state.state?.data?.contactId;
			if (typeof contactId === 'string') createdContactId = contactId;

			// Segments, displays and response history - the payload the catalog describes, and nothing
			// the environment bundle contains.
			expect(Object.keys(state.state?.data ?? {})).toEqual(
				expect.arrayContaining([
					'contactId',
					'userId',
					'segments',
					'displays',
					'responses',
				]),
			);

			for (const path of [
				`client/${workspaceId}/contacts/corsair-state-user/state`,
				`client/${workspaceId}/user/corsair-state-user/state`,
				`client/${workspaceId}/contacts/state`,
			]) {
				await expectApiError(() => call('v2', path), 404);
			}
		} finally {
			await deleteCreatedContact(createdContactId);
		}
	});

	/**
	 * Bulk upload answers `{status, message}` - never the uploaded contacts, which is what the plugin's
	 * output schema originally declared. Its two limits are enforced server-side, and the plugin now
	 * checks both locally so the caller gets the error without the round trip.
	 */
	/**
	 * `UPDATE_CONTACT_ATTRIBUTES` has no management route, so the operation posts to the client user
	 * route. This pins both halves of that: the management candidates really do all fail, and the
	 * client route really does change the stored value.
	 *
	 * Judged by reading the value back through `contact-attributes`, because
	 * `GET management/contacts/{id}` returns no `attributes` field at all - the values are a separate
	 * resource.
	 */
	it('sets a contact attribute through the client route, and nowhere else', async () => {
		let createdContactId: string | undefined;
		try {
			const contact = await call<{ id: string }>('v2', 'management/contacts', {
				method: 'POST',
				body: {
					workspaceId,
					attributes: {
						email: 'corsair.attr@example.com',
						userId: 'corsair-attr-user',
						firstName: 'Before',
					},
				},
			});
			createdContactId = contact.id;

			const readFirstName = async () => {
				const values =
					(await call<
						Array<{ contactId: string; attributeKeyId: string; value: string }>
					>('v1', 'management/contact-attributes')) ?? [];
				const keys =
					(await call<Array<{ id: string; key: string }>>(
						'v2',
						'management/contact-attribute-keys',
					)) ?? [];
				const keyId = keys.find((k) => k.key === 'firstName')?.id;
				return values.find(
					(v) => v.contactId === contact.id && v.attributeKeyId === keyId,
				)?.value;
			};

			expect(await readFirstName()).toBe('Before');

			// Every management candidate, so a future "surely there's a proper endpoint" change has the
			// evidence in front of it.
			for (const [status, version, path, body] of [
				[
					404,
					'v2',
					`management/contacts/${contact.id}`,
					{ workspaceId, attributes: { firstName: 'After' } },
				],
				[
					405,
					'v1',
					`management/contacts/${contact.id}`,
					{ attributes: { firstName: 'After' } },
				],
				[
					404,
					'v2',
					`management/contacts/${contact.id}/attributes`,
					{ workspaceId, attributes: { firstName: 'After' } },
				],
				[
					405,
					'v1',
					'management/contact-attributes',
					{ contactId: contact.id, attributes: { firstName: 'After' } },
				],
			] as Array<[number, 'v1' | 'v2', string, Record<string, unknown>]>) {
				await expectApiError(
					() => call(version, path, { method: 'PUT', body }),
					status,
				);
			}
			expect(await readFirstName()).toBe('Before');

			// And the route that works.
			await call('v2', `client/${workspaceId}/user`, {
				method: 'POST',
				body: {
					userId: 'corsair-attr-user',
					attributes: { firstName: 'After' },
				},
			});
			expect(await readFirstName()).toBe('After');
		} finally {
			await deleteCreatedContact(createdContactId);
		}
	});

	it('answers a bulk upload with a status, and enforces its own limits', async () => {
		const uploadedEmails = ['corsair.bulk@example.com'];
		const row = (email: string) => ({
			attributes: [
				{ attributeKey: { key: 'email', name: 'Email' }, value: email },
			],
		});

		try {
			const result = await call<{ status: string; message: string }>(
				'v2',
				'management/contacts/bulk',
				{
					method: 'PUT',
					body: { workspaceId, contacts: [row('corsair.bulk@example.com')] },
				},
			);
			expect(result.status).toBe('success');
			// Not an array of contacts: there are no ids here to mirror or return.
			expect(Array.isArray(result)).toBe(false);

			await expectApiError(
				() =>
					call('v2', 'management/contacts/bulk', {
						method: 'PUT',
						body: {
							workspaceId,
							contacts: Array.from({ length: 251 }, (_, i) =>
								row(`corsair.over.${i}@example.com`),
							),
						},
					}),
				422,
				/Maximum 250/,
			);

			await expectApiError(
				() =>
					call('v2', 'management/contacts/bulk', {
						method: 'PUT',
						body: {
							workspaceId,
							contacts: [
								{
									attributes: [
										{
											attributeKey: { key: 'userId', name: 'User Id' },
											value: 'corsair-no-email',
										},
									],
								},
							],
						},
					}),
				422,
				/Email attribute is required/,
			);
		} finally {
			await deleteCreatedContactsByEmail(uploadedEmails);
		}
	});

	/**
	 * The two account routes answer different questions, which is what decides where the catalog's
	 * account-info operation belongs. Only v1 returns the environment type, project and setup flag its
	 * description names.
	 */
	it('returns environment type and project from v1 me, and neither from v2', async () => {
		const v1 = await call<{
			type: string;
			appSetupCompleted: boolean;
			project: unknown;
			workspace: unknown;
		}>('v1', 'management/me');

		expect(['production', 'development']).toContain(v1.type);
		expect(v1.project).toBeDefined();
		expect(v1.workspace).toBeDefined();
		expect(typeof v1.appSetupCompleted).toBe('boolean');

		const v2 = await call<Record<string, unknown>>('v2', 'me');
		for (const field of ['type', 'project', 'appSetupCompleted']) {
			expect(field in v2).toBe(false);
		}
	});

	/**
	 * The filters the catalog documents for responses, judged by effect. Every one is accepted with a
	 * 200 and ignored, which is why the input schema declares only `surveyId`.
	 *
	 * `contactId` is the one that matters: a caller asking for one respondent's answers receives
	 * everybody's, with no signal that the filter was dropped.
	 */
	it('ignores the response filters the catalog documents, except surveyId', async () => {
		const survey = await call<{ id: string }>('v1', 'management/surveys', {
			method: 'POST',
			body: {
				workspaceId,
				name: 'corsair filter probe',
				questions: [QUESTION],
			},
		});
		const responses: string[] = [];

		try {
			for (const n of [1, 2]) {
				const created = await call<{ id: string }>(
					'v1',
					'management/responses',
					{
						method: 'POST',
						body: {
							workspaceId,
							surveyId: survey.id,
							finished: false,
							data: { q1: `answer ${n}` },
						},
					},
				);
				responses.push(created.id);
			}

			const total = (
				(await call<unknown[]>('v1', 'management/responses')) ?? []
			).length;
			expect(total).toBeGreaterThanOrEqual(2);

			// Applied: a survey filter really filters.
			const filtered = await call<unknown[]>(
				'v1',
				`management/responses?surveyId=${survey.id}`,
			);
			expect(filtered).toHaveLength(2);

			// Ignored: each of these returns every row, including an impossible date range.
			for (const query of [
				'?contactId=cxxxxxxxxxxxxxxxxxxxxxxx',
				'?startDate=1990-01-01T00:00:00.000Z&endDate=1990-01-02T00:00:00.000Z',
				'?filterDateField=createdAt&startDate=1990-01-01T00:00:00.000Z',
				'?startDate=2099-01-01T00:00:00.000Z',
			]) {
				const rows =
					(await call<unknown[]>('v1', `management/responses${query}`)) ?? [];
				expect(rows).toHaveLength(total);
			}

			// And sorting has no effect either: the same row leads both directions.
			const ascending =
				(await call<Array<{ id: string }>>(
					'v1',
					'management/responses?sortBy=createdAt&order=asc',
				)) ?? [];
			const descending =
				(await call<Array<{ id: string }>>(
					'v1',
					'management/responses?sortBy=createdAt&order=desc',
				)) ?? [];
			expect(ascending[0]?.id).toBe(descending[0]?.id);
		} finally {
			for (const id of responses) {
				await call('v1', `management/responses/${id}`, { method: 'DELETE' });
			}
			await call('v1', `management/surveys/${survey.id}`, { method: 'DELETE' });
		}
	});

	/** Both versions wrap in `{ data }`, which is why the call helper unwraps centrally. */
	it('wraps every response in a data envelope', async () => {
		for (const [version, path] of [
			['v1', 'management/surveys'],
			['v2', 'me'],
			['v2', 'health'],
		] as const) {
			const raw = await makeFormbricksRequest<Record<string, unknown>>(
				version,
				path,
				apiKey as string,
			);
			expect(Object.keys(raw)).toContain('data');
		}
	});

	it('rejects a bad key with 401', async () => {
		await expect(
			makeFormbricksRequest('v1', 'management/surveys', 'fbk_not_a_real_key'),
		).rejects.toMatchObject({ status: 401 });
	});

	/**
	 * The v2 OpenAPI document names this operation `workspace-state`; that path 404s and the live
	 * route is `environment`. Pinned so the plugin cannot be "corrected" to match the document.
	 */
	it('serves the client bundle at environment, not workspace-state', async () => {
		const env = await call<Record<string, unknown>>(
			'v1',
			`client/${workspaceId}/environment`,
		);
		expect(Object.keys(env)).toContain('expiresAt');

		await expect(
			call('v2', `client/${workspaceId}/workspace-state`),
		).rejects.toMatchObject({ status: 404 });
	});

	/**
	 * Not supported on Cloud, and the API says so in words rather than by failing vaguely. No catalog
	 * operation maps to it; recorded because an unexplained 400 here would otherwise look like a bug
	 * in this plugin.
	 */
	it('reports organization users as unsupported on Cloud', async () => {
		await expect(
			call('v2', `organizations/${organizationId}/users`),
		).rejects.toMatchObject({ status: 400 });
	});
});
