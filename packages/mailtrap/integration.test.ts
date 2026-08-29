/**
 * Live checks against a real Mailtrap account.
 *
 * Skipped unless `MAILTRAP_API_TOKEN` is set (`MAILTRAP_ACCOUNT_ID` is
 * optional — account discovery is exercised when it is absent), so CI and
 * contributors without credentials are unaffected. Every operation here is
 * read-only: nothing is created, changed or deleted.
 */
import {
	Account,
	ContactFields,
	ContactLists,
	EmailTemplates,
	Inboxes,
	Messages,
	Projects,
	SendingDomains,
	Stats,
	Suppressions,
} from './endpoints';
import {
	MailtrapBillingUsageSchema,
	MailtrapContactFieldSchema,
	MailtrapContactListSchema,
	MailtrapInboxSchema,
	MailtrapProjectSchema,
	MailtrapSendingDomainSchema,
	MailtrapUserSchema,
} from './endpoints/types';

const apiToken = process.env.MAILTRAP_API_TOKEN;
const accountId = process.env.MAILTRAP_ACCOUNT_ID;

const describeLive = apiToken ? describe : describe.skip;

type Ctx = Parameters<typeof Account.listAccounts>[0];

function makeStore() {
	return {
		upsertByEntityId: async (_id: string, _data: unknown) => undefined,
		// Never reached: every operation below is read-only.
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: apiToken ?? '',
		options: { accountId },
		db: {
			contacts: makeStore(),
			contactLists: makeStore(),
			contactFields: makeStore(),
			emailTemplates: makeStore(),
			sendingDomains: makeStore(),
			projects: makeStore(),
			inboxes: makeStore(),
		},
	} as unknown as Ctx;
}

describeLive('Mailtrap live API', () => {
	it('lists accounts the token can reach, matching the declared schema', async () => {
		const result = await Account.listAccounts(makeCtx(), {});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(MailtrapUserSchema.safeParse(result[0]).success).toBe(true);
	});

	it('reports billing usage matching the declared schema', async () => {
		const result = await Account.getBillingUsage(makeCtx(), {});

		expect(MailtrapBillingUsageSchema.safeParse(result).success).toBe(true);
	});

	/**
	 * `GET_PERMISSION_RESOURCES` 403s "Unavailable on your plan" on this
	 * account's free tier (see `MAILTRAP-PLAN.md`) — a real, correctly-routed
	 * operation that a paid-plan account would answer with 200. Both
	 * outcomes are accepted so this test does not fail once the fixture
	 * account's plan changes; a transport-layer failure (a wrong path, a
	 * missing account id) is the only thing it treats as a bug.
	 */
	it('resolves the permission-resources route, plan-gate or not', async () => {
		try {
			const result = await Account.getPermissionResources(makeCtx(), {});
			expect(Array.isArray(result)).toBe(true);
		} catch (error) {
			const status = (error as { status?: number } | undefined)?.status;
			expect(status).toBe(403);
		}
	});

	it('lists contact lists matching the declared schema', async () => {
		const result = await ContactLists.list(makeCtx(), {});

		expect(Array.isArray(result)).toBe(true);
		if (result[0]) {
			expect(MailtrapContactListSchema.safeParse(result[0]).success).toBe(true);
		}
	});

	it('lists contact fields matching the declared schema', async () => {
		const result = await ContactFields.list(makeCtx(), {});

		// Every account gets default fields (e.g. "First name"/"Last name").
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(MailtrapContactFieldSchema.safeParse(result[0]).success).toBe(true);
	});

	it('lists email templates', async () => {
		const result = await EmailTemplates.list(makeCtx(), {});
		expect(Array.isArray(result)).toBe(true);
	});

	it('lists sending domains matching the declared schema', async () => {
		const result = await SendingDomains.list(makeCtx(), {});

		// Every account has the pre-provisioned demo sending domain.
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(MailtrapSendingDomainSchema.safeParse(result[0]).success).toBe(true);
	});

	it('lists suppressions', async () => {
		const result = await Suppressions.list(makeCtx(), {});
		expect(Array.isArray(result)).toBe(true);
	});

	it('lists and gets a project matching the declared schema', async () => {
		const list = await Projects.list(makeCtx(), {});
		expect(Array.isArray(list)).toBe(true);
		expect(list.length).toBeGreaterThan(0);

		const first = list[0];
		expect(first).toBeDefined();
		expect(MailtrapProjectSchema.safeParse(first).success).toBe(true);

		if (!first?.id) return;
		const single = await Projects.get(makeCtx(), { project_id: first.id });
		expect(single.id).toBe(first.id);
	});

	it('lists sandbox inboxes matching the declared schema', async () => {
		const result = await Inboxes.list(makeCtx(), {});

		// Every account has the pre-provisioned "My Sandbox" inbox.
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(MailtrapInboxSchema.safeParse(result[0]).success).toBe(true);
	});

	it('lists messages in the sandbox inbox without erroring', async () => {
		const inboxes = await Inboxes.list(makeCtx(), {});
		const target = inboxes[0];
		// A deliberate, visible skip rather than a silent pass: this account is
		// expected to always own at least one inbox, so a missing id means the
		// fixture account changed, not that the assertion below is unneeded.
		if (!target?.id) {
			console.warn(
				'[integration.test] skipping message list: live account has no inbox',
			);
			return;
		}

		const messages = await Messages.list(makeCtx(), { inbox_id: target.id });
		expect(Array.isArray(messages)).toBe(true);
	});

	it('gets aggregated sending stats for the current billing cycle', async () => {
		const end = new Date().toISOString().slice(0, 10);
		const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
			.toISOString()
			.slice(0, 10);

		const result = await Stats.get(makeCtx(), {
			start_date: start,
			end_date: end,
		});
		expect(typeof result).toBe('object');
	});
});
