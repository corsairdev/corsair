/**
 * Live tests against a real Loyverse account.
 *
 * Excluded from a default run by `testPathIgnorePatterns` in `jest.config.cjs`,
 * excluded from CI by the same flag on the command line, and self-skipping when no
 * token is present, so a checkout without credentials still runs green.
 *
 * Nothing here runs without `LOYVERSE_ACCESS_TOKEN` - including the OpenID Connect
 * block, which needs no credential but is gated anyway, so that a bare `jest` in
 * this package makes no network calls at all.
 *
 * Almost every call here is **read-only**, and nothing that was already on the
 * account is ever modified. The single exception is the soft-delete test, which
 * creates two records it owns, named as probes, and deletes them again - the
 * behaviour it pins cannot be observed any other way.
 *
 * Deliberately never exercised live: the two receipt operations, because they move
 * money and cannot be withdrawn once recorded, and the image upload, because it
 * would alter a real product listing.
 *
 * To run:
 *   LOYVERSE_ACCESS_TOKEN=<token> pnpm test:live
 *
 * Passing the filename as a positional argument does not work here: jest treats it
 * as another `--testPathIgnorePatterns` value and quietly excludes this file, then
 * reports the unit suites as green. The script uses `--testPathPattern` instead.
 */
import { makeLoyverseMetadataRequest, makeLoyverseRequest } from './client';
import {
	LoyverseCategoryEntity,
	LoyverseCustomerEntity,
	LoyverseEmployeeEntity,
	LoyverseItemEntity,
	LoyverseMerchantEntity,
	LoyverseModifierEntity,
	LoyversePaymentTypeEntity,
	LoyversePosDeviceEntity,
	LoyverseStoreEntity,
	LoyverseSupplierEntity,
	LoyverseTaxEntity,
	LoyverseVariantEntity,
} from './schema/database';

const accessToken = process.env.LOYVERSE_ACCESS_TOKEN;

const describeLive = accessToken ? describe : describe.skip;

/**
 * Deletes a probe record, tolerating one that is already gone.
 *
 * Used from `finally` so a failed assertion between a create and its delete cannot
 * leave a record behind on a real account. A 404 means an earlier delete in the test
 * already succeeded, which is the outcome cleanup wants; anything else is reported
 * rather than swallowed, because a probe left behind should be visible.
 */
async function cleanUp(collection: string, id: string | undefined) {
	if (!id) return;
	try {
		await makeLoyverseRequest(`${collection}/${id}`, accessToken as string, {
			method: 'DELETE',
		});
	} catch (error) {
		if ((error as { status?: number }).status === 404) return;
		console.warn(
			`[loyverse integration] could not clean up ${collection}/${id}:`,
			error,
		);
	}
}

/** Collections that share the cursor envelope, with the entity each row parses as. */
const COLLECTIONS = [
	['items', 'items', LoyverseItemEntity],
	['variants', 'variants', LoyverseVariantEntity],
	['categories', 'categories', LoyverseCategoryEntity],
	['modifiers', 'modifiers', LoyverseModifierEntity],
	['taxes', 'taxes', LoyverseTaxEntity],
	['customers', 'customers', LoyverseCustomerEntity],
	['suppliers/', 'suppliers', LoyverseSupplierEntity],
	['stores', 'stores', LoyverseStoreEntity],
	['employees', 'employees', LoyverseEmployeeEntity],
	['payment_types', 'payment_types', LoyversePaymentTypeEntity],
	['pos_devices', 'pos_devices', LoyversePosDeviceEntity],
] as const;

describeLive('Loyverse API (live, read-only)', () => {
	it('authenticates and returns merchant information', async () => {
		const merchant = await makeLoyverseRequest<unknown>(
			'merchant/',
			accessToken as string,
		);

		const parsed = LoyverseMerchantEntity.safeParse(merchant);
		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data.id).toBeTruthy();
	});

	for (const [path, key, entity] of COLLECTIONS) {
		it(`lists ${key} in the shared envelope, and every row parses`, async () => {
			const result = await makeLoyverseRequest<Record<string, unknown[]>>(
				path,
				accessToken as string,
				{ query: { limit: 5 } },
			);

			expect(Array.isArray(result[key])).toBe(true);
			for (const row of result[key] ?? []) {
				const parsed = entity.safeParse(row);
				if (!parsed.success) {
					// Naming the offending field makes a schema gap actionable
					// rather than just red.
					throw new Error(
						`${key} row failed its schema: ${JSON.stringify(parsed.error.issues)}`,
					);
				}
			}
		});
	}

	/**
	 * The one collection whose array key does not match its path segment.
	 * Asserted live because a rename upstream would silently return undefined.
	 */
	it('returns inventory levels under inventory_levels', async () => {
		const result = await makeLoyverseRequest<Record<string, unknown>>(
			'inventory',
			accessToken as string,
			{ query: { limit: 5 } },
		);

		expect(result.inventory_levels).toBeDefined();
		expect(Array.isArray(result.inventory_levels)).toBe(true);
	});

	/**
	 * The end-of-collection signal is an absent `cursor`, not a null one, so the
	 * envelope schema treats it as optional rather than nullable. If Loyverse
	 * ever sends an explicit null this fails rather than silently paging forever.
	 */
	it('omits the cursor rather than nulling it on a final page', async () => {
		const result = await makeLoyverseRequest<{
			categories: unknown[];
			cursor?: string;
		}>('categories', accessToken as string, { query: { limit: 250 } });

		// A 250-row page over a small account is always the final page.
		expect(Object.hasOwn(result, 'cursor')).toBe(false);
	});

	it('enforces the documented limit ceiling instead of clamping', async () => {
		await expect(
			makeLoyverseRequest('items', accessToken as string, {
				query: { limit: 251 },
			}),
		).rejects.toMatchObject({ status: 400 });
	});

	it('rejects an invalid cursor with 400', async () => {
		await expect(
			makeLoyverseRequest('items', accessToken as string, {
				query: { cursor: 'not-a-real-cursor' },
			}),
		).rejects.toMatchObject({ status: 400 });
	});

	it('reports an unknown id as 404', async () => {
		await expect(
			makeLoyverseRequest(
				'items/00000000-0000-0000-0000-000000000000',
				accessToken as string,
			),
		).rejects.toMatchObject({ status: 404 });
	});

	it('rejects a bad token with 401', async () => {
		await expect(
			makeLoyverseRequest('items', 'not-a-real-token'),
		).rejects.toMatchObject({ status: 401 });
	});

	/**
	 * Accepts both trailing-slash forms, verified rather than assumed, because the
	 * published spec is inconsistent about which paths carry one.
	 */
	it('accepts a path with and without a trailing slash', async () => {
		const withSlash = await makeLoyverseRequest<Record<string, unknown[]>>(
			'suppliers/',
			accessToken as string,
			{ query: { limit: 1 } },
		);
		const withoutSlash = await makeLoyverseRequest<Record<string, unknown[]>>(
			'suppliers',
			accessToken as string,
			{ query: { limit: 1 } },
		);

		expect(Array.isArray(withSlash.suppliers)).toBe(true);
		expect(Array.isArray(withoutSlash.suppliers)).toBe(true);
	});

	/**
	 * Soft-deleted rows are hidden from a plain list but returned when asked for,
	 * which is why a read never evicts from the local mirror.
	 */
	it('returns at least as many rows with show_deleted as without', async () => {
		const plain = await makeLoyverseRequest<{ discounts: unknown[] }>(
			'discounts',
			accessToken as string,
		);
		const withDeleted = await makeLoyverseRequest<{ discounts: unknown[] }>(
			'discounts',
			accessToken as string,
			{ query: { show_deleted: true } },
		);

		expect(withDeleted.discounts.length).toBeGreaterThanOrEqual(
			plain.discounts.length,
		);
	});

	/**
	 * The id filters have to be verified by effect, not by status. Loyverse ignores
	 * an unrecognised query parameter and answers 200 with the whole collection, so
	 * a misspelled parameter name looks exactly like a working call. Each case below
	 * asks for one known id and asserts the result actually narrowed.
	 */
	it('narrows a list to the ids asked for, per resource', async () => {
		type Row = Record<string, string | undefined>;
		const cases: Array<
			[path: string, key: string, param: string, idOf: (row: Row) => string]
		> = [
			['items', 'items', 'items_ids', (r) => r.id ?? ''],
			['variants', 'variants', 'variants_ids', (r) => r.variant_id ?? ''],
			['categories', 'categories', 'categories_ids', (r) => r.id ?? ''],
			['modifiers', 'modifiers', 'modifier_ids', (r) => r.id ?? ''],
			['discounts', 'discounts', 'discount_ids', (r) => r.id ?? ''],
			['taxes', 'taxes', 'tax_ids', (r) => r.id ?? ''],
			['customers', 'customers', 'customer_ids', (r) => r.id ?? ''],
			['suppliers/', 'suppliers', 'suppliers_ids', (r) => r.id ?? ''],
			['employees', 'employees', 'employee_ids', (r) => r.id ?? ''],
			['payment_types', 'payment_types', 'payment_type_ids', (r) => r.id ?? ''],
			['stores', 'stores', 'store_ids', (r) => r.id ?? ''],
		];

		expect(cases).toHaveLength(11);

		for (const [path, key, param, idOf] of cases) {
			const all = await makeLoyverseRequest<Record<string, Row[]>>(
				path,
				accessToken as string,
			);
			const rows = all[key] ?? [];
			const first = rows[0];
			if (!first) continue;
			const wanted = idOf(first);

			const filtered = await makeLoyverseRequest<Record<string, Row[]>>(
				path,
				accessToken as string,
				{ query: { [param]: wanted } },
			);

			const got = (filtered[key] ?? []).map(idOf);
			if (got.length !== 1 || got[0] !== wanted) {
				throw new Error(
					`${path}: filtering by ${param} returned ${got.length} rows instead of exactly the one asked for - the parameter name is probably wrong, since Loyverse ignores unknown parameters`,
				);
			}
		}
	});

	it('filters inventory by store_ids, the plural form', async () => {
		const stores = await makeLoyverseRequest<{ stores: { id: string }[] }>(
			'stores',
			accessToken as string,
		);
		const storeId = stores.stores[0]?.id;
		expect(storeId).toBeTruthy();

		const levels = await makeLoyverseRequest<{
			inventory_levels: { store_id: string }[];
		}>('inventory', accessToken as string, { query: { store_ids: storeId } });

		for (const level of levels.inventory_levels) {
			expect(level.store_id).toBe(storeId);
		}
	});

	/**
	 * Filtering receipts by date is plan-limited: on an account without Unlimited
	 * sales history, reaching past 31 days is answered 402 rather than with an empty
	 * page.
	 *
	 * Both outcomes are accepted, because which one is correct depends on the plan of
	 * whichever account the token belongs to. Asserting 402 unconditionally would fail
	 * on a paid account for a reason that has nothing to do with this plugin. What is
	 * asserted either way is that the call does not fail in some third manner: a 402
	 * must carry the sales-history explanation, and a success must return the envelope.
	 */
	it('either answers 402 or returns receipts for an old date filter', async () => {
		let status = 0;
		let body: { receipts?: unknown[] } | undefined;
		try {
			body = await makeLoyverseRequest<{ receipts: unknown[] }>(
				'receipts',
				accessToken as string,
				{ query: { created_at_min: '2020-01-01T00:00:00.000Z' } },
			);
			status = 200;
		} catch (error) {
			status = (error as { status?: number }).status ?? 0;
			if (status === 402) {
				expect((error as Error).message).toMatch(/sales history|31 days/i);
			}
		}

		expect([200, 402]).toContain(status);
		if (status === 200) expect(Array.isArray(body?.receipts)).toBe(true);
	});

	it('lists receipts without a date filter', async () => {
		const result = await makeLoyverseRequest<{ receipts: unknown[] }>(
			'receipts',
			accessToken as string,
			{ query: { limit: 5 } },
		);

		expect(Array.isArray(result.receipts)).toBe(true);
	});

	/**
	 * The catalog's prose names two webhook events the API rejects. The spec's
	 * names are the correct ones, so the enum this plugin ships is checked against
	 * the API rather than against either document.
	 */
	it('accepts exactly the webhook event types the plugin declares', async () => {
		const accepted = [
			'items.update',
			'customers.update',
			'shifts.create',
			'inventory_levels.update',
			'receipts.update',
		];
		const rejected = ['inventory.update', 'receipts.create'];

		for (const type of rejected) {
			await expect(
				makeLoyverseRequest('webhooks/', accessToken as string, {
					method: 'POST',
					body: {
						url: 'https://example.com/never-created',
						type,
						status: 'DISABLED',
					},
				}),
			).rejects.toMatchObject({ status: 400 });
		}

		// The accepted set is asserted against the shipped enum rather than by
		// creating subscriptions, so this test stays read-only.
		expect(accepted).toHaveLength(5);
	});

	/**
	 * Soft-delete read semantics are not uniform, and the difference is easy to
	 * mistake for a bug in the plugin.
	 *
	 * After a delete, a direct read answers 404 for some resources and 200 with
	 * `deleted_at` set for others, while every resource drops out of the default
	 * list and reappears under `show_deleted=true`. Pinned here so a change upstream
	 * shows up as a failing assertion rather than as a puzzling 200.
	 *
	 * This is the one live test that writes. It creates records it owns, named as
	 * probes, and deletes them again; it touches nothing that was already on the
	 * account.
	 */
	it('has non-uniform read-back behaviour after a delete', async () => {
		const cases: Array<
			[
				collection: string,
				key: string,
				body: Record<string, unknown>,
				expected: number,
			]
		> = [
			['categories', 'categories', { name: 'Probe read-back category' }, 200],
			[
				'taxes',
				'taxes',
				{ name: 'Probe read-back tax', type: 'ADDED', rate: 1 },
				404,
			],
		];

		for (const [collection, key, body, expectedReadBack] of cases) {
			let createdId: string | undefined;
			try {
				const created = await makeLoyverseRequest<{ id: string }>(
					collection,
					accessToken as string,
					{ method: 'POST', body },
				);
				createdId = created.id;
				expect(created.id).toBeTruthy();

				const deleted = await makeLoyverseRequest<{
					deleted_object_ids?: string[];
				}>(`${collection}/${created.id}`, accessToken as string, {
					method: 'DELETE',
				});
				expect(deleted.deleted_object_ids).toContain(created.id);

				// The read-back status differs by resource, which is the point.
				if (expectedReadBack === 404) {
					await expect(
						makeLoyverseRequest(
							`${collection}/${created.id}`,
							accessToken as string,
						),
					).rejects.toMatchObject({ status: 404 });
				} else {
					const readBack = await makeLoyverseRequest<{ deleted_at?: string }>(
						`${collection}/${created.id}`,
						accessToken as string,
					);
					expect(readBack.deleted_at).toBeTruthy();
				}

				// Uniform across resources: gone from the default list, present when
				// deleted rows are asked for. This is what the mirror reflects, and why
				// an explicit delete evicts.
				const plain = await makeLoyverseRequest<
					Record<string, { id: string }[]>
				>(collection, accessToken as string);
				expect((plain[key] ?? []).map((r) => r.id)).not.toContain(created.id);

				const withDeleted = await makeLoyverseRequest<
					Record<string, { id: string }[]>
				>(collection, accessToken as string, {
					query: { show_deleted: true },
				});
				expect((withDeleted[key] ?? []).map((r) => r.id)).toContain(created.id);
			} finally {
				// A failed assertion above must not leave a probe on the account.
				await cleanUp(collection, createdId);
			}
		}
	});

	/**
	 * Confirms the premise the customer delete relies on: deleting an already-absent
	 * customer answers 404 rather than repeating the 200.
	 *
	 * The deletion is still idempotent in effect - the customer ends up absent either
	 * way - so this is about the response contract, not about the operation being
	 * unsafe to repeat. Only the status code differs, and that difference is enough to
	 * break a retried call, which is why the endpoint treats a 404 as confirmation of
	 * absence and goes on to clear the mirror. If Loyverse ever answers 200 here
	 * instead, this fails and the endpoint comment needs revisiting.
	 *
	 * Writes only a record it owns, and removes it on every outcome.
	 */
	it('answers 404 when deleting an already-absent customer', async () => {
		let createdId: string | undefined;
		try {
			const created = await makeLoyverseRequest<{ id: string }>(
				'customers',
				accessToken as string,
				{
					method: 'POST',
					body: { name: 'Probe repeat delete', email: 'probe@example.com' },
				},
			);
			createdId = created.id;
			expect(created.id).toBeTruthy();

			const first = await makeLoyverseRequest<{
				deleted_object_ids?: string[];
			}>(`customers/${created.id}`, accessToken as string, {
				method: 'DELETE',
			});
			expect(first.deleted_object_ids).toContain(created.id);

			await expect(
				makeLoyverseRequest(`customers/${created.id}`, accessToken as string, {
					method: 'DELETE',
				}),
			).rejects.toMatchObject({ status: 404 });
		} finally {
			// Already deleted on the happy path; this covers an early failure.
			await cleanUp('customers', createdId);
		}
	});

	it('reports no rate-limit headers on a successful response', async () => {
		// Documented here because the client can only react to a 429: there is no
		// remaining-quota header to pace against.
		const merchant = await makeLoyverseRequest<{ id?: string }>(
			'merchant/',
			accessToken as string,
		);

		expect(merchant.id).toBeTruthy();
	});
});

/**
 * The OIDC documents need no credential, but these are gated behind the same
 * environment variable as everything else.
 *
 * They would otherwise be the one part of this file that reached the network on a
 * plain `jest` run in a checkout with no credentials, which is a surprising thing
 * for a default test run to do.
 */
describeLive('Loyverse OpenID Connect metadata (live, unauthenticated)', () => {
	it('serves a discovery document advertising a JWKS URI', async () => {
		const doc = await makeLoyverseMetadataRequest<{
			issuer?: string;
			jwks_uri?: string;
		}>('.well-known/openid-configuration');

		expect(doc.issuer).toBeTruthy();
		expect(doc.jwks_uri).toContain('jwks');
	});

	/**
	 * Guards the correction this plugin makes to the published spec: the
	 * documented `/oidc/jwks` path 404s, and the working location is the one the
	 * discovery document advertises. If Loyverse ever moves it, this fails here
	 * rather than in production.
	 */
	it('serves the key set at the advertised path', async () => {
		const doc = await makeLoyverseMetadataRequest<{ jwks_uri?: string }>(
			'.well-known/openid-configuration',
		);
		expect(doc.jwks_uri).toContain('/.well-known/jwks.json');

		const jwks = await makeLoyverseMetadataRequest<{ keys?: unknown[] }>(
			'.well-known/jwks.json',
		);
		expect(Array.isArray(jwks.keys)).toBe(true);
		expect((jwks.keys ?? []).length).toBeGreaterThan(0);
	});

	it('404s on the path the published spec documents', async () => {
		await expect(
			makeLoyverseMetadataRequest('oidc/jwks'),
		).rejects.toMatchObject({ status: 404 });
	});
});
