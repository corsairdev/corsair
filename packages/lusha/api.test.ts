/**
 * Live tests against Lusha. They run when LUSHA_API_KEY is set (CI has none,
 * so they skip). Only free, read-only calls are made: account usage, a job
 * poll for a nonexistent id, and the free discovery reads (filters, signal
 * types, recommendation filters, ICP profiles, the table column catalog,
 * webhook subscriptions and audit stats), plus one free contact table round
 * trip (create, get, update, delete) when LUSHA_LOGIN_EMAIL names the account
 * user. Every search, enrich, prospecting, signal and score call charges
 * credits, so none belongs in the default suite.
 *
 * The billed block at the end runs only with LUSHA_LIVE_BILLED=1. It spends
 * real credits (about 20 of the free plan's 40 per month) and one request of
 * the free plan's 100 a day per step, so check account usage first and pick
 * steps with `-t`. Its inputs are Lusha's own documentation examples (Lusha's
 * people and well-known companies). With LUSHA_LIVE_CAPTURE_DIR set, every
 * response body is written there (it holds personal data: keep it outside the
 * repo and delete it after use) with a summary.jsonl of op, status, result
 * count and credits charged.
 */

import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApiError } from 'corsair/http';
import { z } from 'zod';
import { getAccountUsage } from './endpoints/account';
import { LushaSpecOutputSchemas as SpecOutputs } from './endpoints/generated/spec-schemas';
import { getContactsEnrichJob } from './endpoints/jobs';
import { LushaEndpointOutputSchemas as Outputs } from './endpoints/types';
import { lusha } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.LUSHA_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;

if (!KEY.success) {
	// A skipped run must not be mistakable for a green one.
	console.warn(
		'lusha api.test.ts: LUSHA_API_KEY is not set, so the live suite is skipped.',
	);
}

// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: KEY.data ?? '' } as unknown as Parameters<
	typeof getAccountUsage
>[0];

describeLive('lusha live API', () => {
	it('account.getAccountUsage returns the credit balance', async () => {
		const result = Outputs.accountGetAccountUsage.parse(
			await getAccountUsage(ctx, {}),
		);
		// Free plan or paid: some credit accounting always exists.
		expect(result.credits?.total).toBeDefined();
	});

	it('jobs.getContactsEnrichJob reports 404 for a job id that does not exist', async () => {
		// Free to call. 404 means the job does not exist, expired, or belongs
		// to another account - not distinguished, per the docs.
		await expect(
			getContactsEnrichJob(ctx, { jobId: 'wf_doesnotexist123' }),
		).rejects.toBeInstanceOf(ApiError);
		await expect(
			getContactsEnrichJob(ctx, { jobId: 'wf_doesnotexist123' }),
		).rejects.toMatchObject({ status: 404 });
	});

	// unknown: each endpoint has its own input and output types; these free
	// reads are called through one signature and their outputs parsed by the
	// endpoint itself.
	type AnyEndpoint = (c: unknown, input: unknown) => Promise<unknown>;
	const tree = lusha({ key: KEY.data ?? '' }).endpoints as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	>;
	const FREE_READS: [string, string, Record<string, unknown>][] = [
		['person', 'getContactFilterTypes', {}],
		['person', 'getContactFilterValues', { filterType: 'departments' }],
		['company', 'getCompanyFilterTypes', {}],
		['person', 'getContactSignalTypes', {}],
		['company', 'getCompanySignalTypes', {}],
		['company', 'getCompanySignalFilters', {}],
		['person', 'getContactRecommendationFilters', {}],
		['company', 'getCompanyRecommendationFilters', {}],
		['icp', 'listProfiles', {}],
		['contactTables', 'getColumnCatalog', {}],
		['companyTables', 'getColumnCatalog', {}],
	];

	it.each(FREE_READS)('%s.%s (free) parses', async (group, name, input) => {
		const endpoint = tree[group]?.[name];
		expect(endpoint).toBeDefined();
		await expect(endpoint!(ctx, input)).resolves.toBeDefined();
	});

	// The webhook API (subscriptions, audit logs) is a plan feature. On a plan
	// without it Lusha answers 403 "Webhooks are not enabled for this account";
	// the route and the error message are still checked.
	const WEBHOOK_READS: [string, string, Record<string, unknown>][] = [
		['subscriptions', 'list', { limit: 10 }],
		['auditLogs', 'getStats', {}],
	];

	it.each(WEBHOOK_READS)(
		'%s.%s (free) parses, or names the missing plan feature',
		async (group, name, input) => {
			const endpoint = tree[group]?.[name];
			expect(endpoint).toBeDefined();
			try {
				await expect(endpoint!(ctx, input)).resolves.toBeDefined();
			} catch {
				await expect(endpoint!(ctx, input)).rejects.toMatchObject({
					status: 403,
					message: expect.stringMatching(/webhooks are not enabled/i),
				});
			}
		},
	);

	const OWNER = z.email().safeParse(process.env.LUSHA_LOGIN_EMAIL);
	const itOwner = OWNER.success ? it : it.skip;

	// Free (Lusha bills no table-route call except adding entities and
	// running columns). Creates one empty table and deletes it again.
	itOwner('contactTables create -> get -> update -> delete', async () => {
		const email = OWNER.data ?? '';
		const tables = tree.contactTables!;
		const created = SpecOutputs.contactTablesCreate.parse(
			await tables.create!(ctx, {
				name: 'corsair-plugin-test',
				visibility: 'private',
				owner: { email },
			}),
		);
		const tableId = String(created.data?.tableId ?? '');
		expect(tableId).not.toBe('');
		try {
			const read = SpecOutputs.contactTablesGet.parse(
				await tables.get!(ctx, { tableId, ownerEmail: email }),
			);
			expect(read.data?.name).toBe('corsair-plugin-test');
			const updated = SpecOutputs.contactTablesUpdate.parse(
				await tables.update!(ctx, {
					tableId,
					name: 'corsair-plugin-test-renamed',
					owner: { email },
				}),
			);
			expect(updated.data?.name).toBe('corsair-plugin-test-renamed');
		} finally {
			const deleted = SpecOutputs.contactTablesDelete.parse(
				await tables.delete!(ctx, { tableId, ownerEmail: email }),
			);
			expect(String(deleted.data?.tableId ?? tableId)).toBe(tableId);
		}
	});
});

// ── billed (opt-in) ─────────────────────────────────────────────────────────

const BILLED = KEY.success && process.env.LUSHA_LIVE_BILLED === '1';
const describeBilled = BILLED ? describe : describe.skip;
const CAPTURE_DIR = process.env.LUSHA_LIVE_CAPTURE_DIR;

/** Ids and examples from Lusha's API reference (docs.lusha.com). */
const DOCS = {
	lushaCompanyId: '16303253',
	contactIds: ['4389064654', '4389064624'],
};

type Summary = {
	op: string;
	outcome: 'ok' | 'plan-gated' | 'failed';
	status?: number;
	results?: number;
	creditsCharged?: number | null;
	note?: string;
};

describeBilled('lusha live API, billed', () => {
	type AnyEndpoint = (c: unknown, input: unknown) => Promise<unknown>;
	const tree = lusha({ key: KEY.data ?? '' }).endpoints as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	>;
	const owner = z.email().safeParse(process.env.LUSHA_LOGIN_EMAIL);
	const itOwner = owner.success ? it : it.skip;

	// Ids handed from one step to the next; the docs' ids stand in when an
	// earlier step was not selected with -t.
	const found = {
		companyIds: [] as string[],
		prospectCompanyIds: [] as string[],
		contactIds: [] as string[],
		/** The company id of each found contact, for table adds. */
		contactCompanyIds: [] as string[],
		prospectContactIds: [] as string[],
	};

	let exchange = 0;
	let lastDailyLeft: string | null = null;
	const realFetch = globalThis.fetch;
	beforeAll(() => {
		if (CAPTURE_DIR) mkdirSync(CAPTURE_DIR, { recursive: true });
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			const res = await realFetch(input, init);
			lastDailyLeft = res.headers.get('x-daily-requests-left');
			if (CAPTURE_DIR) {
				exchange += 1;
				const url = new URL(String(input));
				writeFileSync(
					join(CAPTURE_DIR, `${String(exchange).padStart(2, '0')}.json`),
					JSON.stringify({
						method: init?.method ?? 'GET',
						path: url.pathname,
						status: res.status,
						dailyLeft: lastDailyLeft,
						requestBody: init?.body ?? null,
						body: await res.clone().text(),
					}),
				);
			}
			return res;
		});
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	function record(entry: Summary): void {
		if (CAPTURE_DIR) {
			appendFileSync(
				join(CAPTURE_DIR, 'summary.jsonl'),
				`${JSON.stringify({ ...entry, dailyLeft: lastDailyLeft })}\n`,
			);
		}
	}

	type Billed = {
		results?: unknown[] | null;
		billing?: { creditsCharged?: number | null } | null;
	};

	/**
	 * Runs one billed call. A 402/403 is the plan saying no (recorded, not a
	 * plugin failure); anything else that throws (a schema mismatch, a wrong
	 * route or body) fails the step.
	 */
	async function billed<T extends Billed>(
		op: string,
		input: Record<string, unknown>,
	): Promise<T | undefined> {
		const [group, name] = op.split('.') as [string, string];
		const endpoint = tree[group]?.[name];
		expect(endpoint).toBeDefined();
		try {
			const result = (await endpoint!({ key: KEY.data }, input)) as T;
			record({
				op,
				outcome: 'ok',
				results: Array.isArray(result.results)
					? result.results.length
					: undefined,
				creditsCharged: result.billing?.creditsCharged,
			});
			return result;
		} catch (error) {
			if (
				error instanceof ApiError &&
				(error.status === 402 || error.status === 403)
			) {
				record({
					op,
					outcome: 'plan-gated',
					status: error.status,
					note: error.message.slice(0, 160),
				});
				return undefined;
			}
			record({
				op,
				outcome: 'failed',
				status: error instanceof ApiError ? error.status : undefined,
				note: String(error instanceof Error ? error.message : error).slice(
					0,
					300,
				),
			});
			throw error;
		}
	}

	function ids(result: Billed | undefined): string[] {
		return (result?.results ?? [])
			.map((r) => (r as { id?: unknown; error?: unknown }) ?? {})
			.filter((r) => r.error == null && r.id != null)
			.map((r) => String(r.id));
	}

	it('billed company.searchCompanies (bulk: name, domain, id)', async () => {
		const result = await billed('company.searchCompanies', {
			companies: [
				{ clientReferenceId: 'comp-ref-1', name: 'Lusha' },
				{ clientReferenceId: 'comp-ref-2', domain: 'salesforce.com' },
				{ clientReferenceId: 'comp-ref-3', domain: 'hubspot.com' },
			],
			options: { includePartialProfiles: true },
		});
		found.companyIds = ids(result);
		if (result) expect(result.results?.length).toBe(3);
	});

	it('billed company.prospectCompanies', async () => {
		const result = await billed('company.prospectCompanies', {
			pagination: { page: 0, size: 10 },
			filters: {
				companies: {
					include: {
						locations: [{ country: 'Israel' }],
						keywords: ['sales intelligence'],
					},
				},
			},
		});
		found.prospectCompanyIds = ids(result);
	});

	it('billed company.enrichCompanies (bulk, one premium reveal)', async () => {
		const companyIds = [
			...(found.companyIds.length
				? found.companyIds.slice(0, 2)
				: [DOCS.lushaCompanyId]),
			...found.prospectCompanyIds.slice(0, 1),
		];
		const result = await billed('company.enrichCompanies', {
			ids: [...new Set(companyIds)],
			reveal: ['competitors'],
		});
		if (result) expect(result.results?.length).toBeGreaterThan(0);
	});

	it('billed company.searchAndEnrichCompanies (bulk)', async () => {
		await billed('company.searchAndEnrichCompanies', {
			companies: [
				{ clientReferenceId: 'comp-ref-1', name: 'Lusha' },
				{ clientReferenceId: 'comp-ref-2', domain: 'monday.com' },
			],
			options: { includePartialProfiles: true },
		});
	});

	it('billed person.searchContacts (bulk: name + company, LinkedIn, email)', async () => {
		const result = await billed('person.searchContacts', {
			contacts: [
				{
					clientReferenceId: 'my-ref-1',
					firstName: 'Orit',
					lastName: 'Shilvock',
					companyName: 'Lusha',
					companyDomain: 'lusha.com',
				},
				{
					clientReferenceId: 'my-ref-2',
					linkedinUrl: 'https://www.linkedin.com/in/shmulikwillinger',
				},
				{ clientReferenceId: 'my-ref-3', email: 'gal.ashkelon@lusha.com' },
			],
			options: { includePartialProfiles: true },
		});
		found.contactIds = ids(result);
		found.contactCompanyIds = (result?.results ?? [])
			.map(
				(r) =>
					r as {
						id?: unknown;
						error?: unknown;
						company?: { id?: unknown } | null;
					},
			)
			.filter((r) => r.error == null && r.id != null)
			.map((r) => String(r.company?.id ?? DOCS.lushaCompanyId));
		if (result) expect(result.results?.length).toBe(3);
	});

	it('billed person.prospectContacts', async () => {
		const result = await billed('person.prospectContacts', {
			pagination: { page: 0, size: 10 },
			filters: {
				contacts: { include: { departments: ['Sales'] } },
				companies: { include: { domains: ['lusha.com'] } },
			},
		});
		found.prospectContactIds = ids(result);
	});

	it('billed person.enrichContacts (bulk, emails) and polls any waterfall job', async () => {
		const contactIds = [
			...(found.contactIds.length
				? found.contactIds.slice(0, 2)
				: DOCS.contactIds),
			...found.prospectContactIds.slice(0, 1),
		];
		const result = await billed<
			Billed & { job?: { id?: string | null; retryAfter?: number | null } }
		>('person.enrichContacts', {
			ids: [...new Set(contactIds)],
			reveal: ['emails'],
		});
		const jobId = result?.job?.id;
		if (!jobId) return;
		// Polling is free; Lusha asks to wait retryAfter seconds between polls.
		for (let poll = 0; poll < 2; poll += 1) {
			const wait = Math.min(result?.job?.retryAfter ?? 5, 10);
			await new Promise((r) => setTimeout(r, wait * 1000));
			const job = await getContactsEnrichJob(ctx, { jobId });
			record({
				op: 'jobs.getContactsEnrichJob',
				outcome: 'ok',
				note: job.status ?? '',
			});
			if (job.status !== 'processing') break;
		}
	}, 60_000);

	it('billed person.searchAndEnrichContacts (bulk, emails)', async () => {
		await billed('person.searchAndEnrichContacts', {
			contacts: [
				{
					clientReferenceId: 'my-ref-1',
					firstName: 'Orit',
					lastName: 'Shilvock',
					companyName: 'Lusha',
					companyDomain: 'lusha.com',
				},
				{
					clientReferenceId: 'my-ref-2',
					linkedinUrl: 'https://www.linkedin.com/in/shmulikwillinger',
				},
			],
			reveal: ['emails'],
			options: { includePartialProfiles: true },
		});
	});

	it('billed company.getCompanySignals', async () => {
		await billed('company.getCompanySignals', {
			ids: [found.companyIds[0] ?? DOCS.lushaCompanyId],
			signalTypes: ['allSignals'],
			startDate: '2026-01-01',
			maxResultsPerSignal: 5,
		});
	});

	it('billed person.getContactSignals', async () => {
		await billed('person.getContactSignals', {
			ids: found.contactIds.length ? found.contactIds : DOCS.contactIds,
			signalTypes: ['allSignals'],
			startDate: '2026-01-01',
		});
	});

	it('billed person.getContactRecommendations (account defaults)', async () => {
		await billed('person.getContactRecommendations', {});
	});

	it('billed company.getCompanyRecommendations (account defaults)', async () => {
		await billed('company.getCompanyRecommendations', {});
	});

	it('billed company.getCompanyLookalikes', async () => {
		await billed('company.getCompanyLookalikes', {
			seeds: { domains: ['lusha.com', 'zoominfo.com'] },
			limit: 5,
		});
	});

	it('billed person.getContactLookalikes', async () => {
		await billed('person.getContactLookalikes', {
			seeds: {
				ids: found.contactIds.length ? found.contactIds : DOCS.contactIds,
			},
			limit: 5,
		});
	});

	it('billed person.getBuyingGroup', async () => {
		await billed('person.getBuyingGroup', {
			companies: [{ clientReferenceId: 'comp-ref-1', domain: 'lusha.com' }],
			personas: ['decision_maker'],
			contactsLimit: 5,
		});
	});

	it('billed company.getCompanySignalScores', async () => {
		await billed('company.getCompanySignalScores', {
			companies: [
				{
					clientReferenceId: 'comp-ref-1',
					id: found.companyIds[0] ?? DOCS.lushaCompanyId,
				},
			],
		});
	});

	it('billed company.getWebsiteVisits', async () => {
		// Needs a domain set up for tracking in the Lusha dashboard.
		await billed('company.getWebsiteVisits', {
			domains: ['lusha.com'],
			startDate: '2026-09-01',
			endDate: '2026-11-25',
			pagination: { page: 0, size: 10 },
		});
	});

	// Contact table with entities and a column run: create (free), add the
	// found contacts, add a work-email column, run it on them (charged per
	// row), read the rows back, then delete the table.
	itOwner(
		'billed contactTables entities + column run',
		async () => {
			const email = owner.data ?? '';
			const tables = tree.contactTables!;
			const created = SpecOutputs.contactTablesCreate.parse(
				await tables.create!(ctx, {
					name: 'corsair-plugin-billed-test',
					visibility: 'private',
					owner: { email },
				}),
			);
			const tableId = String(created.data?.tableId ?? '');
			expect(tableId).not.toBe('');
			try {
				const entityIds = (
					found.contactIds.length ? found.contactIds : DOCS.contactIds
				).slice(0, 2);
				await billed('contactTables.addEntities', {
					tableId,
					entityIds,
					companyIds: entityIds.map(
						(_, i) => found.contactCompanyIds[i] ?? DOCS.lushaCompanyId,
					),
					owner: { email },
				});
				const columns = (await billed('contactTables.addColumns', {
					tableId,
					columnKey: 'workEmail',
					owner: { email },
				})) as { data?: unknown } | undefined;
				const columnId = JSON.stringify(columns?.data ?? '').match(
					/"(?:columnId|id)":"?([^",}]+)/,
				)?.[1];
				if (columnId) {
					await billed('contactTables.runColumn', {
						tableId,
						columnId,
						runScope: 'specific',
						entityIds,
						owner: { email },
					});
				}
				await billed('contactTables.listEntities', {
					tableId,
					ownerEmail: email,
				});
			} finally {
				await tables.delete!(ctx, { tableId, ownerEmail: email });
			}
		},
		60_000,
	);

	it('billed account.getAccountUsage after the billed steps', async () => {
		const usage = Outputs.accountGetAccountUsage.parse(
			await getAccountUsage(ctx, {}),
		);
		record({
			op: 'account.getAccountUsage',
			outcome: 'ok',
			note: `credits used ${usage.credits?.used} of ${usage.credits?.total}`,
		});
		expect(usage.credits?.used).toBeDefined();
	});
});
