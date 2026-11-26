/**
 * Live tests against Lusha. They run when LUSHA_API_KEY is set (CI has none,
 * so they skip). Only free, read-only calls are made: account usage, a job
 * poll for a nonexistent id, and the free discovery reads (filters, signal
 * types, recommendation filters, ICP profiles, the table column catalog,
 * webhook subscriptions and audit stats), plus one free contact table round
 * trip (create, get, update, delete) when LUSHA_LOGIN_EMAIL names the account
 * user. Every search, enrich, prospecting, signal and score call charges
 * credits, so none belongs in a smoke suite.
 */

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
