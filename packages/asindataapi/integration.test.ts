/**
 * Live checks against ASIN Data API.
 *
 * Skipped unless ASINDATAAPI_API_KEY is set. Default `pnpm test` ignores this
 * file. Run with `pnpm test:live`.
 *
 * Creates a probe collection, exercises the six documented ops, then deletes
 * the probe. Does not start collections (that spends product credits) and does
 * not create destinations (that needs real cloud credentials).
 */
import { AsinDataApiAPIError, makeAsinDataApiRequest } from './client';
import {
	AsinDataApiEndpointOutputSchemas,
	DestinationsListResponseSchema,
	RequestsListResponseSchema,
} from './endpoints/types';
import {
	AsinDataApiCollection,
	AsinDataApiCollectionRequest,
	AsinDataApiDestination,
} from './schema/database';

const apiKey = process.env.ASINDATAAPI_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

const PROBE = 'corsair-asindataapi-probe-safe-to-delete';

function describeIssues(error: { issues: readonly unknown[] }): string[] {
	return error.issues.map((raw) => {
		const issue = raw as { path?: unknown[]; code?: string; message?: string };
		const where = (issue.path ?? []).join('.') || '(root)';
		return `${where}: ${issue.code ?? 'invalid'} - ${issue.message ?? ''}`;
	});
}

describeLive('ASIN Data API live', () => {
	let collectionId = '';
	let requestId = '';

	afterAll(async () => {
		if (!apiKey || !collectionId) return;
		try {
			await makeAsinDataApiRequest(
				'collections/' + encodeURIComponent(collectionId),
				apiKey,
				{
					method: 'DELETE',
				},
			);
		} catch (error) {
			if (
				error instanceof AsinDataApiAPIError &&
				(error.status === 404 || /not found/i.test(error.message))
			) {
				return;
			}
			throw error;
		}
	});

	it('LIST_DESTINATIONS matches the official destination entity', async () => {
		const raw = await makeAsinDataApiRequest<unknown>(
			'destinations',
			apiKey as string,
			{
				query: { page: 1 },
			},
		);
		const parsed = DestinationsListResponseSchema.safeParse(raw);
		if (!parsed.success) console.error(describeIssues(parsed.error));
		expect(parsed.success).toBe(true);
		for (const dest of parsed.data?.destinations ?? []) {
			const entity = AsinDataApiDestination.safeParse(dest);
			if (!entity.success) console.error(describeIssues(entity.error));
			expect(entity.success).toBe(true);
		}
	});

	it('creates a probe collection and GET_COLLECTION parses it', async () => {
		const created = await makeAsinDataApiRequest<unknown>(
			'collections',
			apiKey as string,
			{
				method: 'POST',
				body: { name: PROBE, schedule_type: 'manual', enabled: true },
			},
		);
		const createdId = (created as { collection?: { id?: unknown } }).collection
			?.id;
		if (typeof createdId === 'string' && createdId) {
			collectionId = createdId;
		}
		const createdParsed =
			AsinDataApiEndpointOutputSchemas.collectionsCreate.safeParse(created);
		if (!createdParsed.success)
			console.error(describeIssues(createdParsed.error));
		expect(createdParsed.success).toBe(true);
		expect(collectionId).toBeTruthy();

		const raw = await makeAsinDataApiRequest<unknown>(
			`collections/${encodeURIComponent(collectionId)}`,
			apiKey as string,
		);
		const parsed =
			AsinDataApiEndpointOutputSchemas.collectionsGet.safeParse(raw);
		if (!parsed.success) console.error(describeIssues(parsed.error));
		expect(parsed.success).toBe(true);
		const entity = AsinDataApiCollection.safeParse(parsed.data?.collection);
		if (!entity.success) console.error(describeIssues(entity.error));
		expect(entity.success).toBe(true);
		expect(entity.data?.name).toBe(PROBE);
	});

	it('adds a request then LIST_COLLECTION_REQUESTS parses it', async () => {
		expect(collectionId).toBeTruthy();
		await makeAsinDataApiRequest(
			`collections/${encodeURIComponent(collectionId)}`,
			apiKey as string,
			{
				method: 'PUT',
				body: {
					requests: [
						{
							type: 'product',
							asin: 'B00I8RKMSM',
							amazon_domain: 'amazon.com',
							custom_id: 'corsair-probe-1',
						},
					],
				},
			},
		);

		const raw = await makeAsinDataApiRequest<unknown>(
			`collections/${encodeURIComponent(collectionId)}/requests/1`,
			apiKey as string,
		);
		const parsed = RequestsListResponseSchema.safeParse(raw);
		if (!parsed.success) console.error(describeIssues(parsed.error));
		expect(parsed.success).toBe(true);
		expect((parsed.data?.requests ?? []).length).toBeGreaterThan(0);
		const first = parsed.data?.requests?.[0];
		const entity = AsinDataApiCollectionRequest.safeParse(first);
		if (!entity.success) console.error(describeIssues(entity.error));
		expect(entity.success).toBe(true);
		requestId = entity.data?.id ?? '';
		expect(requestId).toBeTruthy();
	});

	it('CLEAR_COLLECTION_REQUESTS deletes the probe request', async () => {
		expect(collectionId).toBeTruthy();
		expect(requestId).toBeTruthy();
		const raw = await makeAsinDataApiRequest<unknown>(
			`collections/${encodeURIComponent(collectionId)}/requests`,
			apiKey as string,
			{ method: 'DELETE', body: [requestId] },
		);
		const parsed =
			AsinDataApiEndpointOutputSchemas.requestsClear.safeParse(raw);
		if (!parsed.success) console.error(describeIssues(parsed.error));
		expect(parsed.success).toBe(true);
		expect(parsed.data?.request_info.success).toBe(true);
	});
});
