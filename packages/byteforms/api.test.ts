// Live API tests for the ByteForms plugin.
//
// These tests call the real ByteForms API. CI ignores api.test.ts files (see
// pr-checks.yml testPathIgnorePatterns), so they only run when invoked
// explicitly with a key:
//
//   BYTEFORMS_API_KEY=<your-key> pnpm --filter @corsair-dev/byteforms test
//
// Pattern follows packages/slack/api.test.ts: call the plugin's own client,
// validate every live response through the plugin's zod output schemas, and
// clean up created resources in afterAll.
import { makeByteFormsRequest } from './client';
import { ByteFormsEndpointOutputSchemas } from './endpoints/types';

describe('ByteForms live API', () => {
	const key = process.env.BYTEFORMS_API_KEY ?? '';
	let createdFormId: number | undefined;
	const uniqueName = `corsair-live-test-${Date.now()}`;

	afterAll(async () => {
		// Cleanup: remove any form this suite created.
		if (createdFormId !== undefined) {
			try {
				await makeByteFormsRequest<{ status: string }>(
					`form/${createdFormId}`,
					key,
					{ method: 'DELETE' },
				);
			} catch {
				// Best effort — the suite already failed if we got here.
			}
		}
	});

	it('forms.list returns a valid envelope with real forms', async () => {
		const response = await makeByteFormsRequest<unknown>('form', key, {
			method: 'GET',
		});

		const parsed = ByteFormsEndpointOutputSchemas.formsList.parse(response);
		expect(parsed.status).toBe('success');
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('forms.create creates a form and the output schema validates', async () => {
		const response = await makeByteFormsRequest<unknown>('form', key, {
			method: 'POST',
			body: {
				name: uniqueName,
				body: [
					{
						component: 'input',
						type: 'email',
						label: 'Email',
						id: 'email',
						required: true,
					},
				],
				options: { thank_you_message: 'Thanks from corsair tests!' },
			},
		});

		const parsed = ByteFormsEndpointOutputSchemas.formsCreate.parse(response);
		expect(parsed.status).toBe('success');
		expect(parsed.data).toBeDefined();

		createdFormId = parsed.data?.id;

		expect(typeof createdFormId).toBe('number');
		expect(createdFormId).toBeGreaterThan(0);
	});

	it('forms.get fetches the created form by numeric id', async () => {
		if (createdFormId === undefined) {
			throw new Error('Create test did not produce a form id');
		}

		const response = await makeByteFormsRequest<unknown>(
			`form/${createdFormId}`,
			key,
			{ method: 'GET' },
		);

		const parsed = ByteFormsEndpointOutputSchemas.formsGet.parse(response);
		expect(parsed.data.id).toBe(createdFormId);
		expect(parsed.data.name).toBe(uniqueName);
		expect(parsed.status).toBe('success');
		expect(Array.isArray(parsed.data.body)).toBe(true);
		expect(parsed.data.body.length).toBeGreaterThan(0);
		const firstField = parsed.data.body[0];
		if (!firstField) {
			throw new Error('Created form has no fields');
		}
		expect(firstField.component).toBe('input');
		expect(firstField.type).toBe('email');
	});

	it('forms.responses returns a valid paginated envelope', async () => {
		if (createdFormId === undefined) {
			throw new Error('Create test did not produce a form id');
		}

		const response = await makeByteFormsRequest<unknown>(
			`form/responses/${createdFormId}`,
			key,
			{
				method: 'GET',
				query: { limit: 10, order: 'desc' },
			},
		);

		const parsed =
			ByteFormsEndpointOutputSchemas.formsResponses.parse(response);
		expect(parsed.status).toBe('success');
		expect(typeof parsed.count).toBe('number');
		expect(parsed.count).toBeGreaterThanOrEqual(0);
		expect(parsed.cursor).toHaveProperty('after');
		expect(parsed.cursor).toHaveProperty('before');
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('forms.get on a nonexistent id surfaces a provider error', async () => {
		await expect(
			makeByteFormsRequest<unknown>('form/999999999', key, {
				method: 'GET',
			}),
		).rejects.toThrow();
	});

	it('an invalid API key is rejected by the provider', async () => {
		await expect(
			makeByteFormsRequest<unknown>('form', 'definitely-not-a-valid-key', {
				method: 'GET',
			}),
		).rejects.toThrow();
	});

	it('forms.delete removes the created form and it is no longer fetchable', async () => {
		if (createdFormId === undefined) {
			throw new Error('Create test did not produce a form id');
		}

		const response = await makeByteFormsRequest<unknown>(
			`form/${createdFormId}`,
			key,
			{ method: 'DELETE' },
		);

		const parsed = ByteFormsEndpointOutputSchemas.formsDelete.parse(response);
		expect(parsed.status).toBe('success');

		// Mark cleaned up before the negative check so afterAll does not retry.
		const deletedId = createdFormId;
		createdFormId = undefined;

		// The deleted form should no longer be retrievable.
		await expect(
			makeByteFormsRequest<unknown>(`form/${deletedId}`, key, {
				method: 'GET',
			}),
		).rejects.toThrow();
	});
});
