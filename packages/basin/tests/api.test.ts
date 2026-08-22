/**
 * Live Basin API coverage.
 *
 * CI excludes this file by filename (`--testPathIgnorePatterns="api\.test\.ts"`),
 * so it only runs when a real key is supplied:
 *
 *   BASIN_API_KEY=… npx jest tests/api.test.ts
 *
 * Without the key every block is skipped rather than failed, so the suite stays
 * green for contributors with no account. Nothing here is mocked — the mocked
 * handler coverage lives in `endpoints.test.ts`, which CI does run.
 *
 * The write blocks create a project, a form and a webhook, then delete all
 * three in `afterAll`, so a completed run leaves the account as it found it.
 */
import { makeBasinRequest } from '../client';

const API_KEY = process.env.BASIN_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

type Listing<K extends string> = Record<K, unknown[]> & {
	meta?: Record<string, unknown>;
};

describeLive('Basin live API', () => {
	const key = API_KEY as string;

	// Basin authenticates with `Authorization: Token <key>`. It answers a Bearer
	// header with 401 invalid_token, which is why the client must not set
	// OpenAPIConfig.TOKEN — the transport would overwrite the scheme.
	it('authenticates with the Token scheme', async () => {
		const result = await makeBasinRequest<Listing<'projects'>>(
			'projects',
			key,
			{ method: 'GET' },
		);

		expect(Array.isArray(result.projects)).toBe(true);
	});

	it('rejects a Bearer-style credential', async () => {
		await expect(
			makeBasinRequest('projects', `Bearer ${key}`, { method: 'GET' }),
		).rejects.toMatchObject({ status: 401 });
	});

	describe('list endpoints', () => {
		const resources = [
			['projects', 'projects'],
			['forms', 'forms'],
			['submissions', 'submissions'],
			['form_webhooks', 'form_webhooks'],
			['form_views', 'form_views'],
			['domains', 'domains'],
		] as const;

		it.each(resources)(
			'GET %s returns a %s array with pagination meta',
			async (path, collection) => {
				const result = await makeBasinRequest<Listing<typeof collection>>(
					path,
					key,
					{ method: 'GET' },
				);

				expect(Array.isArray(result[collection])).toBe(true);
				expect(result.meta).toBeDefined();
			},
		);

		it('accepts the documented page parameter', async () => {
			const result = await makeBasinRequest<Listing<'forms'>>('forms', key, {
				method: 'GET',
				query: { page: 1 },
			});

			expect(Array.isArray(result.forms)).toBe(true);
		});
	});

	describe('project, form and webhook lifecycle', () => {
		const stamp = Date.now();
		let projectId: number | undefined;
		let formId: number | undefined;
		let webhookId: number | undefined;

		afterAll(async () => {
			// Delete children before parents; ignore failures so one bad teardown
			// cannot mask the others.
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

		it('creates, reads, updates and deletes a project', async () => {
			const created = await makeBasinRequest<{ id: number; name: string }>(
				'projects',
				key,
				{ method: 'POST', body: { name: `corsair-live-${stamp}` } },
			);
			expect(typeof created.id).toBe('number');
			projectId = created.id;

			const fetched = await makeBasinRequest<{ id: number; name: string }>(
				`projects/${created.id}`,
				key,
				{ method: 'GET' },
			);
			expect(fetched.id).toBe(created.id);
			expect(fetched.name).toBe(`corsair-live-${stamp}`);

			const updated = await makeBasinRequest<{ name: string }>(
				`projects/${created.id}`,
				key,
				{ method: 'PUT', body: { name: `corsair-live-${stamp}-renamed` } },
			);
			expect(updated.name).toBe(`corsair-live-${stamp}-renamed`);
		});

		it('creates a form inside the project and updates it', async () => {
			expect(projectId).toBeDefined();

			const created = await makeBasinRequest<{ id: number; uuid: string }>(
				'forms',
				key,
				{
					method: 'POST',
					body: {
						name: `corsair-live-form-${stamp}`,
						project_id: projectId,
						timezone: 'UTC',
					},
				},
			);
			expect(typeof created.id).toBe('number');
			expect(typeof created.uuid).toBe('string');
			formId = created.id;

			const updated = await makeBasinRequest<{ name: string }>(
				`forms/${created.id}`,
				key,
				{ method: 'PUT', body: { name: `corsair-live-form-${stamp}-v2` } },
			);
			expect(updated.name).toBe(`corsair-live-form-${stamp}-v2`);
		});

		it('creates, reads and updates a webhook on the form', async () => {
			expect(formId).toBeDefined();

			const created = await makeBasinRequest<{ id: number; url: string }>(
				'form_webhooks',
				key,
				{
					method: 'POST',
					body: {
						form_id: formId,
						url: 'https://example.com/corsair-live-test',
						name: 'corsair-live',
					},
				},
			);
			expect(typeof created.id).toBe('number');
			webhookId = created.id;

			const fetched = await makeBasinRequest<{ id: number; url: string }>(
				`form_webhooks/${created.id}`,
				key,
				{ method: 'GET' },
			);
			expect(fetched.id).toBe(created.id);
			expect(fetched.url).toBe('https://example.com/corsair-live-test');

			const updated = await makeBasinRequest<{ name: string }>(
				`form_webhooks/${created.id}`,
				key,
				{ method: 'PUT', body: { name: 'corsair-live-renamed' } },
			);
			expect(updated.name).toBe('corsair-live-renamed');
		});
	});

	describe('error surfaces', () => {
		it('reports 404 for an unknown project id', async () => {
			await expect(
				makeBasinRequest('projects/999999999', key, { method: 'GET' }),
			).rejects.toMatchObject({ status: 404 });
		});
	});
});
