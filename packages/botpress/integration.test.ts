/**
 * Live checks against a real Botpress account.
 *
 * Skipped unless `BOTPRESS_PERSONAL_ACCESS_TOKEN` is set (`BOTPRESS_WORKSPACE_ID`
 * is optional — workspace discovery is exercised when it is absent), so CI and
 * contributors without credentials are unaffected. Every operation here is
 * read-only or has no persisted side effect (`tools.runVrl`): nothing is
 * created, changed or deleted, and `billing.chargeUnpaidInvoices` in
 * particular is never called.
 */
import {
	Account,
	Billing,
	Hub,
	Integrations,
	Plugins,
	Tools,
	Workspaces,
} from './endpoints';
import {
	BotpressAccountSchema,
	BotpressHandleAvailabilitySchema,
	BotpressPublicIntegrationSchema,
	BotpressPublicPluginSchema,
	BotpressVrlResultSchema,
	BotpressWorkspaceSchema,
} from './endpoints/types';

const personalAccessToken = process.env.BOTPRESS_PERSONAL_ACCESS_TOKEN;
const workspaceId = process.env.BOTPRESS_WORKSPACE_ID;

const describeLive = personalAccessToken ? describe : describe.skip;

type Ctx = Parameters<typeof Account.get>[0];

function makeStore() {
	return {
		upsertByEntityId: async (_id: string, _data: unknown) => undefined,
		// Never reached: every operation below is read-only.
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: personalAccessToken ?? '',
		options: { workspaceId },
		db: {
			workspaces: makeStore(),
			bots: makeStore(),
			integrations: makeStore(),
		},
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

describeLive('Botpress live API', () => {
	it('returns the authenticated account matching the declared schema', async () => {
		const result = await Account.get(makeCtx(), {});

		expect(BotpressAccountSchema.safeParse(result).success).toBe(true);
		expect(result.id).toBeTruthy();
	});

	it('resolves a workspace and returns it matching the declared schema', async () => {
		const list = await Workspaces.list(makeCtx(), {});
		expect(Array.isArray(list.workspaces)).toBe(true);
		expect(list.workspaces.length).toBeGreaterThan(0);

		const first = list.workspaces[0];
		expect(first).toBeDefined();
		expect(BotpressWorkspaceSchema.safeParse(first).success).toBe(true);

		if (!first?.id) return;
		const single = await Workspaces.get(makeCtx(), { id: first.id });
		expect(single.id).toBe(first.id);
	});

	it('reports a workspace quota completion map', async () => {
		const result = await Workspaces.getAllQuotaCompletion(makeCtx(), {});
		expect(typeof result).toBe('object');
	});

	it('checks handle availability without side effects', async () => {
		const result = await Workspaces.checkHandleAvailability(makeCtx(), {
			handle: `corsair-live-check-${Date.now()}`,
		});

		expect(BotpressHandleAvailabilitySchema.safeParse(result).success).toBe(
			true,
		);
	});

	it('lists integrations owned by the workspace', async () => {
		const result = await Integrations.list(makeCtx(), {});
		expect(Array.isArray(result.integrations)).toBe(true);
	});

	it('gets an integration by name+version, scoped by x-workspace-id', async () => {
		// This workspace owns no integrations, so the real assertion is that the
		// call reaches the API and is rejected as "not found" rather than as
		// "missing x-workspace-id" (status 400) - confirming the corrected
		// by-name route and its scoping header both work end to end.
		let failure: { error: unknown } | undefined;
		try {
			await Integrations.get(makeCtx(), {
				name: 'corsair-live-check-nonexistent',
				version: '1.0.0',
			});
		} catch (error) {
			failure = { error };
		}

		expect(failure).toBeDefined();
		const status = (failure?.error as { status?: number } | undefined)?.status;
		expect(status).toBe(404);
	});

	it('lists plugins installed in the workspace', async () => {
		const result = await Plugins.list(makeCtx(), {});
		expect(Array.isArray(result.plugins)).toBe(true);
	});

	it('lists workspace invoices without charging anything', async () => {
		const { workspaces } = await Workspaces.list(makeCtx(), {});
		const target = workspaces[0];
		// A deliberate, visible skip rather than a silent pass: this account is
		// expected to always own at least one workspace, so a missing id means
		// the fixture account changed, not that the assertion below is unneeded.
		if (!target?.id) {
			console.warn(
				'[integration.test] skipping invoice check: live account has no workspace',
			);
			return;
		}

		const invoices = await Billing.listInvoices(makeCtx(), {
			workspaceId: target.id,
		});
		expect(Array.isArray(invoices)).toBe(true);
	});

	it('browses the public hub with no workspace scoping', async () => {
		const { integrations } = await Hub.listIntegrations(makeCtx(), {
			pageSize: 1,
		});
		expect(Array.isArray(integrations)).toBe(true);
		if (integrations[0]) {
			expect(
				BotpressPublicIntegrationSchema.safeParse(integrations[0]).success,
			).toBe(true);
		}

		const { plugins } = await Hub.listPlugins(makeCtx(), { pageSize: 1 });
		expect(Array.isArray(plugins)).toBe(true);
		if (plugins[0]) {
			expect(BotpressPublicPluginSchema.safeParse(plugins[0]).success).toBe(
				true,
			);
		}
	});

	it('runs a VRL script with no persisted side effect', async () => {
		const result = await Tools.runVrl(makeCtx(), {
			data: { a: 1 },
			// A self-referential arithmetic script (`.a = .a + 1`) 500s server
			// side; a literal assignment is the confirmed-working shape.
			script: '.a = 99',
		});

		expect(BotpressVrlResultSchema.safeParse(result).success).toBe(true);
	});
});
