/**
 * Live Basin API coverage.
 *
 * CI excludes this file by filename (`--testPathIgnorePatterns="api\.test\.ts"`),
 * so it only runs when a real key is supplied:
 *
 *   BASIN_API_KEY=… npx jest tests/api.test.ts
 *
 * Without the key every block is skipped rather than failed, so the suite stays
 * green for contributors with no account. Nothing here is mocked.
 *
 * These tests call the **endpoint handlers**, not `makeBasinRequest` directly.
 * That matters: the handlers run `BasinEndpointOutputSchemas.*.parse(...)`, so a
 * response schema that disagrees with the wire fails here. An earlier version of
 * this file called the transport directly and therefore could not catch the list
 * schemas modelling a bare array when Basin returns `{ <collection>, meta }`.
 *
 * The write blocks create a project, a form and a webhook, then delete all three
 * in `afterAll`, so a completed run leaves the account as it found it.
 */
import { makeBasinRequest } from '../client';
import {
	Domains,
	Forms,
	FormViews,
	Projects,
	Submissions,
	Webhooks,
} from '../endpoints';
import { errorHandlers } from '../error-handlers';
import type { BasinContext } from '../index';

const API_KEY = process.env.BASIN_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

function liveContext(key: string): BasinContext {
	return {
		key,
		db: {},
		database: undefined,
		$getAccountId: async () => 'live-test-account',
	} as unknown as BasinContext;
}

describeLive('Basin live API', () => {
	const key = API_KEY as string;
	const ctx = liveContext(key);

	describe('authentication', () => {
		// Basin authenticates with `Authorization: Token <key>` and answers a
		// Bearer header with 401 invalid_token, which is why the client must not
		// set OpenAPIConfig.TOKEN — the transport would overwrite the scheme.
		it('accepts the Token scheme', async () => {
			const result = await Projects.list(ctx, {});
			expect(Array.isArray(result.projects)).toBe(true);
		});

		// The client strips a pasted prefix, so this must still succeed.
		it('normalises a Bearer-prefixed key rather than failing', async () => {
			const result = await Projects.list(liveContext(`Bearer ${key}`), {});
			expect(Array.isArray(result.projects)).toBe(true);
		});

		// Basin reports a bad key as 400, not 401, with the detail in the body.
		it('rejects a genuinely invalid key and classifies it as auth', async () => {
			await expect(
				makeBasinRequest('projects', 'not-a-real-key', { method: 'GET' }),
			).rejects.toMatchObject({ status: 400 });

			const error = await makeBasinRequest('projects', 'not-a-real-key', {
				method: 'GET',
			}).catch((caught: Error) => caught);

			expect(JSON.stringify((error as { body?: unknown }).body)).toContain(
				'API key',
			);
			// Without the body check in AUTH_ERROR this lands on VALIDATION_ERROR
			// and the caller never sees the "check your API key" guidance.
			expect(errorHandlers.AUTH_ERROR.match(error as Error)).toBe(true);
		});
	});

	// Each of these parses the live body through the endpoint's output schema.
	describe('list endpoints parse the live response shape', () => {
		it('forms.list', async () => {
			const result = await Forms.list(ctx, {});
			expect(Array.isArray(result.forms)).toBe(true);
			expect(typeof result.meta?.per_page).toBe('number');
		});

		it('projects.list', async () => {
			const result = await Projects.list(ctx, {});
			expect(Array.isArray(result.projects)).toBe(true);
			expect(typeof result.meta?.count).toBe('number');
		});

		it('submissions.list', async () => {
			const result = await Submissions.list(ctx, {});
			expect(Array.isArray(result.submissions)).toBe(true);
		});

		it('webhooks.list', async () => {
			const result = await Webhooks.list(ctx, {});
			expect(Array.isArray(result.form_webhooks)).toBe(true);
		});

		it('formViews.list', async () => {
			const result = await FormViews.list(ctx, {});
			expect(Array.isArray(result.form_views)).toBe(true);
		});

		it('domains.list', async () => {
			const result = await Domains.list(ctx, {});
			expect(Array.isArray(result.domains)).toBe(true);
		});

		it('honours the documented page parameter', async () => {
			const result = await Forms.list(ctx, { page: 1 });
			expect(result.meta?.page).toBe(1);
		});
	});

	describe('project, form and webhook lifecycle', () => {
		const stamp = Date.now();
		let projectId: number | undefined;
		let formId: number | undefined;
		let webhookId: number | undefined;

		afterAll(async () => {
			// Children before parents; ignore failures so one bad teardown cannot
			// mask the others.
			const cleanup: Array<[string, number | undefined]> = [
				['form_webhooks', webhookId],
				['forms', formId],
				['projects', projectId],
			];
			for (const [resource, id] of cleanup) {
				if (!id) continue;
				await makeBasinRequest(`${resource}/${id}`, key, {
					method: 'DELETE',
				}).catch(() => undefined);
			}
		});

		it('creates, reads and updates a project', async () => {
			const created = await Projects.create(ctx, {
				name: `corsair-live-${stamp}`,
			});
			expect(typeof created.id).toBe('number');
			projectId = created.id as number;

			const fetched = await Projects.get(ctx, { id: created.id as number });
			expect(fetched.name).toBe(`corsair-live-${stamp}`);

			const updated = await Projects.update(ctx, {
				id: created.id as number,
				name: `corsair-live-${stamp}-renamed`,
			});
			expect(updated.name).toBe(`corsair-live-${stamp}-renamed`);
		});

		it('rejects an empty project payload before it reaches Basin', async () => {
			// Basin answers `{project:{name:''}}` with 422 "Name can't be blank",
			// so the schema refuses it locally rather than spending a request.
			await expect(
				Projects.create(ctx, {} as Parameters<typeof Projects.create>[1]),
			).rejects.toThrow();
		});

		it('creates and updates a form inside the project', async () => {
			expect(projectId).toBeDefined();

			const created = await Forms.create(ctx, {
				name: `corsair-live-form-${stamp}`,
				project_id: projectId,
				timezone: 'UTC',
			});
			expect(typeof created.id).toBe('number');
			formId = created.id as number;

			const updated = await Forms.update(ctx, {
				id: created.id as number,
				name: `corsair-live-form-${stamp}-v2`,
			});
			expect(updated.name).toBe(`corsair-live-form-${stamp}-v2`);
		});

		it('creates, reads and updates a webhook on the form', async () => {
			expect(formId).toBeDefined();

			const created = await Webhooks.create(ctx, {
				form_id: formId,
				url: 'https://example.com/corsair-live-test',
				name: 'corsair-live',
			});
			expect(typeof created.id).toBe('number');
			webhookId = created.id as number;

			const fetched = await Webhooks.get(ctx, { id: created.id as number });
			expect(fetched.url).toBe('https://example.com/corsair-live-test');

			const updated = await Webhooks.update(ctx, {
				id: created.id as number,
				name: 'corsair-live-renamed',
			});
			expect(updated.name).toBe('corsair-live-renamed');
		});
	});

	describe('error surfaces', () => {
		it('reports 404 for an unknown project id', async () => {
			await expect(Projects.get(ctx, { id: 999999999 })).rejects.toMatchObject({
				status: 404,
			});
		});
	});
});
