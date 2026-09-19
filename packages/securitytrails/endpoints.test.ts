import {
	Account,
	Company,
	Domain,
	Ips,
	Projects,
	Scroll,
	Sql,
} from './endpoints';
import { createContext, installFetchHarness } from './test-harness';

/**
 * One block per operation, asserting the method, path, base URL and payload the
 * official OpenAPI definitions specify, plus the entity writes each one makes.
 * https://docs.securitytrails.com/llms.txt
 */
describe('SecurityTrails endpoints', () => {
	let harness: ReturnType<typeof installFetchHarness>;
	let warn: jest.SpyInstance;

	beforeEach(() => {
		harness = installFetchHarness();
		// logEventFromContext has no database in these doubles and warns on the
		// way past; keep the reporter readable.
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		harness.restore();
		warn.mockRestore();
	});

	describe('account.ping', () => {
		it('GETs /v1/ping', async () => {
			harness.queue({ body: { success: true } });
			const { ctx } = createContext();

			const result = await Account.ping(ctx, {});

			expect(harness.requestAt(0).method).toBe('GET');
			expect(harness.requestAt(0).url).toBe(
				'https://api.securitytrails.com/v1/ping',
			);
			expect(result).toEqual({ success: true });
		});
	});

	describe('account.usage', () => {
		it('GETs /v1/account/usage', async () => {
			harness.queue({
				body: { current_monthly_usage: 100, allowed_monthly_usage: 10000 },
			});
			const { ctx } = createContext();

			const result = await Account.usage(ctx, {});

			expect(harness.requestAt(0).url).toBe(
				'https://api.securitytrails.com/v1/account/usage',
			);
			expect(result.current_monthly_usage).toBe(100);
			expect(result.allowed_monthly_usage).toBe(10000);
		});
	});

	describe('domain.get', () => {
		const domainBody = {
			hostname: 'securitytrails.com',
			alexa_rank: 83756,
			current_dns: {
				a: {
					first_seen: '2017-05-26',
					values: [{ ip: '200.121.20.1', ip_count: 10231 }],
				},
				mx: {
					first_seen: '2016-01-02',
					values: [
						{ priority: 50, host: 'aspmx5.googlemail.com', host_count: 102341 },
					],
				},
				ns: {
					first_seen: '2017-05-26',
					values: [
						{ nameserver: 'ns4.dnsmadeeasy.com', nameserver_count: 5213 },
					],
				},
				txt: {
					first_seen: '2017-05-26',
					values: [{ value: 'v=spf1 a mx' }],
				},
			},
		};

		it('GETs /v1/domain/{hostname} and caches the flattened record', async () => {
			harness.queue({ body: domainBody });
			const { ctx, upserts } = createContext();

			await Domain.get(ctx, { hostname: 'securitytrails.com' });

			expect(harness.requestAt(0).url).toBe(
				'https://api.securitytrails.com/v1/domain/securitytrails.com',
			);

			const stored = upserts.domains?.[0];
			expect(stored?.entityId).toBe('securitytrails.com');
			expect(stored?.data.ipv4).toEqual(['200.121.20.1']);
			expect(stored?.data.mail_hosts).toEqual(['aspmx5.googlemail.com']);
			expect(stored?.data.nameservers).toEqual(['ns4.dnsmadeeasy.com']);
			expect(stored?.data.txt_values).toEqual(['v=spf1 a mx']);
			expect(stored?.data.alexa_rank).toBe(83756);
			// Earliest first_seen across every record set, not just the A record.
			expect(stored?.data.dns_first_seen).toEqual(new Date('2016-01-02'));
		});

		it('percent-encodes the hostname into the path', async () => {
			harness.queue({ body: { hostname: 'a b.com' } });
			const { ctx } = createContext();

			await Domain.get(ctx, { hostname: 'a b.com' });

			expect(harness.requestAt(0).url).toContain('/domain/a%20b.com');
		});

		it('rejects an empty hostname without calling the API', async () => {
			const { ctx } = createContext();

			await expect(Domain.get(ctx, { hostname: '   ' })).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});

		it('still returns the response when the entity store fails', async () => {
			harness.queue({ body: domainBody });
			const { ctx } = createContext({ failingEntities: ['domains'] });

			const result = await Domain.get(ctx, { hostname: 'securitytrails.com' });

			expect(result.hostname).toBe('securitytrails.com');
			expect(warn).toHaveBeenCalled();
		});
	});

	describe('domain.ssl', () => {
		const sslBody = {
			endpoint: '/v1/domain/stackoverflow.com/ssl',
			meta: { max_page: 1, page: 1, total_pages: 1 },
			record_count: 1,
			records: [
				{
					dns_names: ['stackoverflow.com'],
					fingerprints: { sha1: 'D112', sha256: 'C19C' },
					issuer: {
						common_name: "Let's Encrypt Authority X3",
						country: ['US'],
						organization: ["Let's Encrypt"],
					},
					not_after: 1587482583,
					not_before: 1579706583,
					serial_number: '2794962283865242955764672279',
					subject: {},
				},
			],
		};

		it('GETs the ssl path and forwards the documented query parameters', async () => {
			harness.queue({ body: sslBody });
			const { ctx } = createContext();

			await Domain.ssl(ctx, {
				hostname: 'stackoverflow.com',
				include_subdomains: true,
				status: 'all',
				page: 2,
			});

			const { url } = harness.requestAt(0);
			expect(url).toContain('/v1/domain/stackoverflow.com/ssl');
			expect(url).toContain('include_subdomains=true');
			expect(url).toContain('status=all');
			expect(url).toContain('page=2');
		});

		it('keys certificates by hostname and SHA-256, and converts Unix seconds to dates', async () => {
			harness.queue({ body: sslBody });
			const { ctx, upserts } = createContext();

			await Domain.ssl(ctx, { hostname: 'stackoverflow.com' });

			const stored = upserts.certificates?.[0];
			expect(stored?.entityId).toBe('stackoverflow.com:C19C');
			expect(stored?.data.hostname).toBe('stackoverflow.com');
			expect(stored?.data.issuer_common_name).toBe(
				"Let's Encrypt Authority X3",
			);
			expect(stored?.data.not_after).toEqual(new Date(1587482583 * 1000));
			expect(stored?.data.not_before).toEqual(new Date(1579706583 * 1000));
		});

		// One SAN certificate covers many hostnames — the documented example for
		// stackoverflow.com/ssl lists 26 in `dns_names`. Keyed on the fingerprint
		// alone, a second lookup would overwrite the first row's `hostname` and
		// destroy the association, because upsertByEntityId replaces the stored
		// data wholesale. Scoping the id by hostname keeps both observations.
		it('keeps one row per hostname when a shared certificate is seen twice', async () => {
			harness.queue({ body: sslBody }, { body: sslBody });
			const { ctx, upserts } = createContext();

			await Domain.ssl(ctx, { hostname: 'stackoverflow.com' });
			await Domain.ssl(ctx, { hostname: 'askubuntu.com' });

			expect(upserts.certificates).toHaveLength(2);
			expect(upserts.certificates?.map((row) => row.entityId)).toEqual([
				'stackoverflow.com:C19C',
				'askubuntu.com:C19C',
			]);
			// Both rows keep their own hostname; neither was clobbered.
			expect(upserts.certificates?.map((row) => row.data.hostname)).toEqual([
				'stackoverflow.com',
				'askubuntu.com',
			]);
			// The certificate's own identity is still recorded on both.
			expect(
				upserts.certificates?.every((row) => row.data.sha256 === 'C19C'),
			).toBe(true);
		});

		it('skips certificate records that carry no SHA-256 fingerprint', async () => {
			harness.queue({
				body: { records: [{ dns_names: ['x.com'], fingerprints: {} }] },
			});
			const { ctx, upserts } = createContext();

			await Domain.ssl(ctx, { hostname: 'x.com' });

			expect(upserts.certificates).toHaveLength(0);
		});

		it('rejects a status outside the documented enum', async () => {
			const { ctx } = createContext();

			await expect(
				Domain.ssl(ctx, {
					hostname: 'x.com',
					status: 'bogus' as unknown as 'valid',
				}),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});
	});

	describe('ips.search', () => {
		const ipsBody = {
			endpoint: '/v1/ips/list',
			record_count: 2,
			records: [
				{ ptr: 'ns1', ip: '109.73.164.63' },
				{ ptr: 'ns1', ports: [21, 22, 80, 443], ip: '138.128.168.3' },
			],
			meta: {
				total_pages: 1,
				query: "ptr_part = 'ns1'",
				page: 1,
				max_page: 100,
			},
		};

		it('POSTs the DSL query in the body and page in the query string', async () => {
			harness.queue({ body: ipsBody });
			const { ctx } = createContext();

			await Ips.search(ctx, { query: "ptr_part = 'ns1'", page: 3 });

			const request = harness.requestAt(0);
			expect(request.method).toBe('POST');
			expect(request.url).toContain('/v1/ips/list');
			expect(request.url).toContain('page=3');
			expect(request.body).toEqual({ query: "ptr_part = 'ns1'" });
		});

		it('caches every returned IP with its ports and originating query', async () => {
			harness.queue({ body: ipsBody });
			const { ctx, upserts } = createContext();

			await Ips.search(ctx, { query: "ptr_part = 'ns1'" });

			expect(upserts.ips).toHaveLength(2);
			expect(upserts.ips?.[1]?.entityId).toBe('138.128.168.3');
			expect(upserts.ips?.[1]?.data.ports).toEqual([21, 22, 80, 443]);
			expect(upserts.ips?.[1]?.data.query).toBe("ptr_part = 'ns1'");
		});

		it('rejects a non-positive page', async () => {
			const { ctx } = createContext();

			await expect(
				Ips.search(ctx, { query: 'ptr_part = "ns1"', page: 0 }),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});
	});

	describe('ips.stats', () => {
		it('POSTs to /v1/ips/stats and caches nothing', async () => {
			harness.queue({
				body: {
					top_ptr_patterns: [{ key: 'x-x.amazon.com', count: 6787 }],
					ports: [{ key: 443, count: 246 }],
					total: 11899,
					endpoint: '/v1/ips/stats',
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Ips.stats(ctx, { query: "ptr_part = 'amazon.com'" });

			expect(harness.requestAt(0).method).toBe('POST');
			expect(harness.requestAt(0).url).toContain('/v1/ips/stats');
			expect(result.total).toBe(11899);
			expect(Object.values(upserts).every((rows) => rows.length === 0)).toBe(
				true,
			);
		});
	});

	describe('scroll.get', () => {
		it('GETs /v1/scroll/{scroll_id} and passes the envelope through', async () => {
			harness.queue({
				body: { records: [{ ip: '1.1.1.1' }], record_count: 1 },
			});
			const { ctx } = createContext();

			const result = await Scroll.get(ctx, { scroll_id: 'abc123' });

			expect(harness.requestAt(0).url).toBe(
				'https://api.securitytrails.com/v1/scroll/abc123',
			);
			expect(result).toEqual({ records: [{ ip: '1.1.1.1' }], record_count: 1 });
		});
	});

	describe('sql.query', () => {
		it('POSTs to /v1/query/scroll with the SQL statement in the body', async () => {
			harness.queue({
				body: {
					query: 'SELECT domain.hostname FROM hosts',
					id: 'bc01cf0b',
					total: { value: '1500', relation: 'lte' },
					records: [{ domain: { hostname: 'gmpg.org' } }],
				},
			});
			const { ctx } = createContext();

			const result = await Sql.query(ctx, {
				query: 'SELECT domain.hostname FROM hosts',
			});

			expect(harness.requestAt(0).method).toBe('POST');
			expect(harness.requestAt(0).url).toContain('/v1/query/scroll');
			expect(harness.requestAt(0).body).toEqual({
				query: 'SELECT domain.hostname FROM hosts',
			});
			expect(result.id).toBe('bc01cf0b');
			// Documented as a string, seen as a number in practice.
			expect(result.total?.value).toBe('1500');
		});

		it('accepts a numeric total.value as well as a string', async () => {
			harness.queue({ body: { total: { value: 1500, relation: 'eq' } } });
			const { ctx } = createContext();

			const result = await Sql.query(ctx, { query: 'SELECT 1' });

			expect(result.total?.value).toBe(1500);
		});
	});

	describe('sql.scroll', () => {
		it('GETs /v1/query/scroll/{id}', async () => {
			harness.queue({ body: { records: [] } });
			const { ctx } = createContext();

			await Sql.scroll(ctx, { id: 'bc01cf0b' });

			expect(harness.requestAt(0).method).toBe('GET');
			expect(harness.requestAt(0).url).toBe(
				'https://api.securitytrails.com/v1/query/scroll/bc01cf0b',
			);
		});
	});

	describe('company.associatedIps', () => {
		it('uses the v2 base URL and paginates', async () => {
			harness.queue({
				body: {
					records: [{ cidr: '52.0.0.0/11' }, { cidr: '54.64.0.0/12' }],
					domain: 'amazon.com',
					record_count: 2,
					page: 1,
					page_size: 100,
				},
			});
			const { ctx, upserts } = createContext();

			await Company.associatedIps(ctx, {
				domain: 'amazon.com',
				page: 1,
				page_size: 100,
			});

			const { url } = harness.requestAt(0);
			expect(url).toContain(
				'https://api.securitytrails.com/v2/company/amazon.com/associated-ips',
			);
			expect(url).toContain('page=1');
			expect(url).toContain('page_size=100');

			// Ids are scoped by company so two companies' ranges cannot collide.
			expect(upserts.companyIpRanges?.[0]?.entityId).toBe(
				'amazon.com:52.0.0.0/11',
			);
			expect(upserts.companyIpRanges?.[1]?.entityId).toBe(
				'amazon.com:54.64.0.0/12',
			);
		});
	});

	describe('projects.list', () => {
		it('uses the v2 base URL and caches each project', async () => {
			harness.queue({
				body: {
					data: [
						{
							id: '1b9e4ec0-0000-4000-8000-000000000000',
							title: 'Primary',
							scanning_enabled: true,
							last_scanned_at: '2026-01-02T03:04:05Z',
							inserted_at: '2025-12-01T00:00:00Z',
							max_exposure_score: 87,
						},
					],
					meta: { counts: { total: 1, returned: 1 } },
				},
			});
			const { ctx, upserts } = createContext();

			await Projects.list(ctx, { sort_direction: 'asc' });

			const { url } = harness.requestAt(0);
			expect(url).toContain('https://api.securitytrails.com/v2/projects');
			expect(url).toContain('sort_direction=asc');

			const stored = upserts.projects?.[0];
			expect(stored?.entityId).toBe('1b9e4ec0-0000-4000-8000-000000000000');
			expect(stored?.data.title).toBe('Primary');
			expect(stored?.data.max_exposure_score).toBe(87);
			expect(stored?.data.last_scanned_at).toEqual(
				new Date('2026-01-02T03:04:05Z'),
			);
		});

		it('works with no arguments at all', async () => {
			harness.queue({ body: { data: [] } });
			const { ctx } = createContext();

			await expect(
				Projects.list(ctx, undefined as unknown as Record<string, never>),
			).resolves.toBeDefined();
		});
	});

	describe('projects.bulkStaticAssetRules', () => {
		const rule = {
			asset: 'example.com',
			membership_type: 'include' as const,
			static_type: 'hostname' as const,
		};

		it('POSTs the rules nested under static_assets on the v2 base', async () => {
			harness.queue({
				body: { data: { added: [rule], removed: [], errors: [] } },
			});
			const { ctx } = createContext();

			await Projects.bulkStaticAssetRules(ctx, {
				project_id: 'proj-1',
				add_rules: [rule],
			});

			const request = harness.requestAt(0);
			expect(request.method).toBe('POST');
			expect(request.url).toBe(
				'https://api.securitytrails.com/v2/projects/proj-1/rules/_bulk_static_assets',
			);
			expect(request.body).toEqual({ static_assets: { add_rules: [rule] } });
		});

		it('omits the operation key that was not supplied', async () => {
			harness.queue({ body: { data: {} } });
			const { ctx } = createContext();

			await Projects.bulkStaticAssetRules(ctx, {
				project_id: 'proj-1',
				remove_rules: [rule],
			});

			expect(harness.requestAt(0).body).toEqual({
				static_assets: { remove_rules: [rule] },
			});
		});

		it('rejects a request with no rules on either side', async () => {
			const { ctx } = createContext();

			await expect(
				Projects.bulkStaticAssetRules(ctx, { project_id: 'proj-1' }),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});

		// The provider documents a hard ceiling of 1000 combined rules.
		it('rejects more than 1000 combined rules before spending a request', async () => {
			const { ctx } = createContext();

			await expect(
				Projects.bulkStaticAssetRules(ctx, {
					project_id: 'proj-1',
					add_rules: new Array(600).fill(rule),
					remove_rules: new Array(401).fill(rule),
				}),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});

		it('accepts exactly 1000 combined rules', async () => {
			harness.queue({ body: { data: {} } });
			const { ctx } = createContext();

			await expect(
				Projects.bulkStaticAssetRules(ctx, {
					project_id: 'proj-1',
					add_rules: new Array(600).fill(rule),
					remove_rules: new Array(400).fill(rule),
				}),
			).resolves.toBeDefined();
		});

		it('rejects a membership_type outside the documented enum', async () => {
			const { ctx } = createContext();

			await expect(
				Projects.bulkStaticAssetRules(ctx, {
					project_id: 'proj-1',
					add_rules: [
						{ ...rule, membership_type: 'maybe' as unknown as 'include' },
					],
				}),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});
	});
});
