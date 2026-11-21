import {
	Account,
	AccountStats,
	ApiKeys,
	Briefing,
	Companies,
	CompanyLists,
	CompanyTags,
	DiscoverViews,
	DomainSearch,
	EmailVerifier,
	Leads,
	LeadsLists,
	MonitoredSignals,
	Opportunities,
	Signals,
	Tags,
	TeamMembers,
	Usage,
} from './endpoints';
import type { HunterioContext } from './index';

// Live tests against the real Hunter API. They run only when a key is set:
//   HUNTERIO_API_KEY=<key> pnpm test:live
// Every call goes through the plugin's own handlers (input schema, request,
// output schema). Writes only touch records the suite creates and deletes
// again, with a per-run name. Calls that spend credits (Domain Search found,
// Email Verifier: 1.5 credits in all) also need HUNTERIO_LIVE_CREDITS=1.
jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const LIVE_KEY = process.env.HUNTERIO_API_KEY ?? '';
const SPEND_CREDITS = process.env.HUNTERIO_LIVE_CREDITS === '1';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;
if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping Hunter.io live tests: set HUNTERIO_API_KEY to run them.',
	);
}
const itCredits = SPEND_CREDITS ? it : it.skip;

const RUN = `corsair-live-${Date.now().toString(36)}`;

function liveCtx(): HunterioContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('live'),
		key: LIVE_KEY,
		options: {},
		keys: {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_api_key: () => Promise.resolve(LIVE_KEY),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

function need<T>(value: T | undefined, what: string): T {
	if (value === undefined) throw new Error(`Hunter returned no ${what}`);
	return value;
}

// Hunter answers 403 with one of these ids when the plan lacks a feature.
function planErrorId(error: unknown): string | undefined {
	const body = (error as { body?: { errors?: Array<{ id?: string }> } }).body;
	return body?.errors?.[0]?.id;
}

describeLive('Hunter.io live API', () => {
	const ctx = liveCtx();

	// GET /leads/exist misses auto-saved leads that sit in no list, so look
	// the address up in /leads. The search index can lag a write by a few
	// seconds: retry before concluding the lead is not there.
	async function leadIdFor(
		email: string,
		attempts = 1,
	): Promise<string | number | undefined> {
		for (let attempt = 0; attempt < attempts; attempt++) {
			if (attempt > 0) await new Promise((r) => setTimeout(r, 2000));
			const found = await Leads.list(ctx, { email });
			const lead = found.data.leads.find((entry) => entry.email === email);
			if (lead?.id !== undefined) return lead.id;
		}
		return undefined;
	}

	describe('free reads', () => {
		it('account, account stats, usage and usage history', async () => {
			const account = await Account.get(ctx, {});
			expect(account.data.plan_name).toEqual(expect.any(String));
			const stats = await AccountStats.get(ctx, {});
			expect(stats.data).toBeDefined();
			const usage = await Usage.get(ctx, {});
			expect(usage.data).toBeDefined();
			const history = await Usage.history(ctx, {});
			expect(history).toBeDefined();
		});

		it('team members', async () => {
			const members = await TeamMembers.list(ctx, {});
			expect(members.data).toBeDefined();
		});

		it('API keys list (Bearer auth; X-API-KEY got 401 here)', async () => {
			const keys = await ApiKeys.list(ctx, { limit: 1 });
			expect(Array.isArray(keys.data) || typeof keys.data === 'object').toBe(
				true,
			);
		});

		it('discover views and company tags parse the real envelopes', async () => {
			const views = await DiscoverViews.list(ctx, {});
			expect(Array.isArray(views.data.views)).toBe(true);
			const tags = await CompanyTags.list(ctx, {});
			expect(Array.isArray(tags.data.company_tags)).toBe(true);
		});

		it('briefing counts with follow-up calls', async () => {
			const briefing = await Briefing.get(ctx, {});
			expect(briefing.data.needs_attention.items.length).toBeGreaterThan(0);
			expect(briefing.data.account.status).toEqual(expect.any(String));
			expect(briefing.meta.next_since).toEqual(expect.any(String));
		});

		it('signals for leads and for Monitored Signals', async () => {
			const leads = await Signals.list(ctx, { source: 'leads', limit: 5 });
			expect(Array.isArray(leads.data)).toBe(true);
			expect(leads.meta.window_start).toEqual(expect.any(String));
			const monitored = await Signals.list(ctx, {
				source: 'monitored',
				types: ['funding_round', 'job_posted'],
			});
			expect(Array.isArray(monitored.data)).toBe(true);
		});

		it('Monitored Signals list', async () => {
			const signals = await MonitoredSignals.list(ctx, { limit: 5 });
			expect(signals.meta.limit).toBe(5);
		});

		it('opportunities, or a 403 plan refusal that is not retried', async () => {
			const started = Date.now();
			try {
				const list = await Opportunities.list(ctx, { limit: 1 });
				expect(Array.isArray(list.data)).toBe(true);
				const first = list.data[0];
				if (first) {
					const results = await Opportunities.results(ctx, {
						id: first.id,
						limit: 1,
					});
					expect(['people', 'companies']).toContain(results.meta.type);
				}
			} catch (error) {
				expect(planErrorId(error)).toBe('no_opportunities_access');
				// A plan refusal comes back at once, without throttle retries.
				expect(Date.now() - started).toBeLessThan(5000);
			}
		});
	});

	describe('round-trips on records the suite creates', () => {
		it('lead tags: create, get, delete', async () => {
			const created = await Tags.create(ctx, { name: `${RUN}-tag` });
			const id = need(created.data.id, 'tag id');
			try {
				const fetched = await Tags.get(ctx, { id });
				expect(fetched.data.name).toBe(`${RUN}-tag`);
			} finally {
				await Tags.delete(ctx, { id });
			}
		});

		it('company tags: create, list, delete', async () => {
			const created = await CompanyTags.create(ctx, { name: `${RUN}-ctag` });
			const id = need(created.data.id, 'tag id');
			try {
				const list = await CompanyTags.list(ctx, {});
				expect(list.data.company_tags.map((tag) => tag.id)).toContain(id);
			} finally {
				await CompanyTags.delete(ctx, { id });
			}
		});

		it('leads lists: merge moves the leads and deletes the source list', async () => {
			const source = await LeadsLists.create(ctx, { name: `${RUN}-from` });
			const destination = await LeadsLists.create(ctx, { name: `${RUN}-to` });
			const sourceId = need(source.data.id, 'list id');
			const destinationId = need(destination.data.id, 'list id');
			let leadId: string | number | undefined;
			try {
				const lead = await Leads.create(ctx, {
					email: `${RUN}@example.com`,
					first_name: 'Live',
					leads_list_id: sourceId,
				});
				leadId = lead.data.id;
				await LeadsLists.merge(ctx, {
					id: sourceId,
					destination_leads_list_id: destinationId,
				});
				// GET /leads_lists/:id embeds no leads; leads_count shows the move.
				const merged = await LeadsLists.get(ctx, { id: destinationId });
				expect(merged.data.leads_count).toBe(1);
				await expect(
					LeadsLists.get(ctx, { id: sourceId }),
				).rejects.toMatchObject({ status: 404 });
			} finally {
				leadId ??= await leadIdFor(`${RUN}@example.com`, 4);
				if (leadId !== undefined) await Leads.delete(ctx, { id: leadId });
				await LeadsLists.delete(ctx, { id: destinationId }).catch(() => {});
				await LeadsLists.delete(ctx, { id: sourceId }).catch(() => {});
			}
		});

		it('company lists: add a company, list it, remove it', async () => {
			const list = await CompanyLists.create(ctx, {
				name: `${RUN}-companies`,
				type: 'static',
			});
			const listId = need(list.data.id, 'list id');
			let companyId: string | number | undefined;
			try {
				const company = await Companies.create(ctx, { domain: 'stripe.com' });
				companyId = need(company.data.id, 'company id');
				await CompanyLists.addCompany(ctx, {
					company_list_id: listId,
					company_id: companyId,
				});
				const companies = await CompanyLists.listCompanies(ctx, {
					company_list_id: listId,
				});
				expect(companies.data.map((entry) => entry.domain)).toContain(
					'stripe.com',
				);
				await CompanyLists.removeCompany(ctx, {
					company_list_id: listId,
					company_id: companyId,
				});
			} finally {
				await CompanyLists.delete(ctx, { id: listId });
				if (companyId !== undefined) {
					await Companies.delete(ctx, { id: companyId }).catch(() => {});
				}
			}
		});
	});

	describe('credit-spending calls (HUNTERIO_LIVE_CREDITS=1)', () => {
		itCredits(
			'domainSearch.found returns found addresses (1 credit)',
			async () => {
				const result = await DomainSearch.found(ctx, {
					domain: 'stripe.com',
					limit: 1,
				});
				expect(result.data.domain).toBe('stripe.com');
			},
		);

		itCredits('emailVerifier.verify (0.5 credit)', async () => {
			const email = 'patrick@stripe.com';
			const savedBefore = await leadIdFor(email);
			try {
				const result = await EmailVerifier.verify(ctx, { email });
				expect(result.data?.status).toEqual(expect.any(String));
			} finally {
				// With automatic lead saving on, Hunter saves the verified address
				// as a lead. Remove it unless it was a lead before the test.
				const savedAfter = await leadIdFor(email, 4);
				if (savedBefore === undefined && savedAfter !== undefined) {
					await Leads.delete(ctx, { id: savedAfter });
				}
			}
		});
	});
});
