/**
 * Live SecurityTrails API coverage.
 *
 * CI excludes this file by filename (`--testPathIgnorePatterns="api\.test\.ts"`),
 * so it only runs when a real key is supplied:
 *
 *   SECURITYTRAILS_API_KEY=… npx jest api.test.ts
 *
 * Without the key every block is skipped rather than failed, so the suite stays
 * green for contributors who have no account. Nothing here is mocked.
 *
 * Some surfaces are entitlement-gated. The SQL API and the ASI project
 * endpoints are sold separately from the retail packages, so those blocks
 * tolerate a 403 as a pass — the request shape is still proven correct by the
 * fact that the provider authenticated it and rejected it on plan, not syntax.
 */
import { ApiError } from 'corsair/http';
import { makeSecuritytrailsRequest } from './client';
import { SecuritytrailsEndpointOutputSchemas as Schemas } from './endpoints/types';

const API_KEY = process.env.SECURITYTRAILS_API_KEY;
/** Optional: set to exercise the ASI rule write against a project you own. */
const PROJECT_ID = process.env.SECURITYTRAILS_PROJECT_ID;

const describeLive = API_KEY ? describe : describe.skip;

/** Treats a plan-gated rejection as an acceptable outcome. */
function isEntitlementError(error: unknown): boolean {
	return (
		error instanceof ApiError && (error.status === 403 || error.status === 402)
	);
}

describeLive('SecurityTrails live API', () => {
	const key = API_KEY as string;

	it('ping authenticates', async () => {
		const result = await makeSecuritytrailsRequest('ping', key, {
			schema: Schemas.ping,
		});

		expect(result.success).toBe(true);
	});

	it('account/usage reports the monthly quota', async () => {
		const result = await makeSecuritytrailsRequest('account/usage', key, {
			schema: Schemas.accountUsage,
		});

		expect(typeof result.current_monthly_usage).toBe('number');
		expect(typeof result.allowed_monthly_usage).toBe('number');
	});

	it('domain/{hostname} returns live DNS matching the documented shape', async () => {
		const result = await makeSecuritytrailsRequest(
			'domain/securitytrails.com',
			key,
			{ schema: Schemas.domainGet },
		);

		expect(result.hostname).toBe('securitytrails.com');
		expect(result.current_dns).toBeDefined();
		// Every live domain should resolve to at least one A record.
		expect(result.current_dns?.a?.values?.length ?? 0).toBeGreaterThan(0);
	});

	it('domain/{hostname}/ssl paginates and never echoes the API key back', async () => {
		const result = await makeSecuritytrailsRequest(
			'domain/stackoverflow.com/ssl',
			key,
			{ query: { page: 1, status: 'valid' }, schema: Schemas.domainSsl },
		);

		expect(Array.isArray(result.records)).toBe(true);
		expect(result.meta?.page).toBe(1);
		// The provider echoes meta.query.apikey; the client must have scrubbed it.
		expect(JSON.stringify(result)).not.toContain(key);
	});

	it('ips/list runs a DSL search', async () => {
		const result = await makeSecuritytrailsRequest('ips/list', key, {
			method: 'POST',
			body: { query: "ptr_part = 'ns1'" },
			query: { page: 1 },
			schema: Schemas.ipsSearch,
		});

		expect(Array.isArray(result.records)).toBe(true);
		expect(typeof result.record_count).toBe('number');
	});

	it('ips/stats aggregates a DSL query', async () => {
		const result = await makeSecuritytrailsRequest('ips/stats', key, {
			method: 'POST',
			body: { query: "ptr_part = 'amazon.com'" },
			schema: Schemas.ipsStats,
		});

		expect(typeof result.total).toBe('number');
		expect(Array.isArray(result.ports)).toBe(true);
	});

	it('company/{domain}/associated-ips answers on the v2 base', async () => {
		try {
			const result = await makeSecuritytrailsRequest(
				'company/amazon.com/associated-ips',
				key,
				{
					version: 'v2',
					query: { page: 1, page_size: 10 },
					schema: Schemas.companyAssociatedIps,
				},
			);

			expect(Array.isArray(result.records)).toBe(true);
		} catch (error) {
			if (!isEntitlementError(error)) throw error;
		}
	});

	it('query/scroll runs a SQL statement when the plan includes the SQL API', async () => {
		try {
			const result = await makeSecuritytrailsRequest('query/scroll', key, {
				method: 'POST',
				body: {
					query:
						"SELECT domain.hostname FROM hosts WHERE domain.apex = 'google.com'",
				},
				schema: Schemas.sqlQuery,
			});

			expect(Array.isArray(result.records)).toBe(true);
			// Cursor is only issued when more than one page exists.
			if (result.id) {
				const next = await makeSecuritytrailsRequest(
					`query/scroll/${encodeURIComponent(result.id)}`,
					key,
					{ schema: Schemas.sqlScroll },
				);
				expect(next).toBeDefined();
			}
		} catch (error) {
			if (!isEntitlementError(error)) throw error;
		}
	});

	it('projects lists ASI projects when the plan includes ASI', async () => {
		try {
			const result = await makeSecuritytrailsRequest('projects', key, {
				version: 'v2',
				query: { sort_direction: 'desc' },
				schema: Schemas.projectsList,
			});

			expect(Array.isArray(result.data)).toBe(true);
		} catch (error) {
			if (!isEntitlementError(error)) throw error;
		}
	});

	// Opt-in: this mutates a project's monitoring scope, so it stays off unless a
	// project id is supplied explicitly. It adds then removes the same rule.
	(PROJECT_ID ? it : it.skip)(
		'bulk static asset rules round-trips an add and a remove',
		async () => {
			const rule = {
				asset: 'corsair-plugin-selftest.example.com',
				membership_type: 'exclude' as const,
				static_type: 'hostname' as const,
			};
			const path = `projects/${encodeURIComponent(PROJECT_ID as string)}/rules/_bulk_static_assets`;

			try {
				const added = await makeSecuritytrailsRequest(path, key, {
					method: 'POST',
					version: 'v2',
					body: { static_assets: { add_rules: [rule] } },
					schema: Schemas.projectsBulkStaticAssetRules,
				});
				expect(added.data).toBeDefined();

				const removed = await makeSecuritytrailsRequest(path, key, {
					method: 'POST',
					version: 'v2',
					body: { static_assets: { remove_rules: [rule] } },
					schema: Schemas.projectsBulkStaticAssetRules,
				});
				expect(removed.data).toBeDefined();
			} catch (error) {
				if (!isEntitlementError(error)) throw error;
			}
		},
	);
});
