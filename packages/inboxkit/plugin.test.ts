import { AuthMissingError } from 'corsair/core';
import {
	INBOXKIT_OPERATIONS,
	InboxkitEndpointInputSchemas,
	InboxkitEndpointOutputSchemas,
} from './endpoints/types';
import { inboxkit, inboxkitEndpointSchemas } from './index';
import { InboxkitSchema } from './schema';
import {
	RETURNS_SECRETS,
	SENDS_ELSEWHERE,
	SPENDS_MONEY,
	TEST_ROUTES,
} from './test-routes';

const plugin = inboxkit({ key: 'k' });
// unknown: the meta's exact literal type adds nothing to these checks.
const meta = plugin.endpointMeta as unknown as Record<
	string,
	{ riskLevel: string; description: string; irreversible?: boolean }
>;
const entryFor = (operation: string) => {
	const entry = meta[operation];
	if (!entry) throw new Error(`no meta for ${operation}`);
	return entry;
};

describe('every operation is declared everywhere', () => {
	const paths = TEST_ROUTES.map((route) => route.operation).sort();

	it('in the risk levels and descriptions', () => {
		expect(Object.keys(meta).sort()).toEqual(paths);
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('in the schemas', () => {
		expect(Object.keys(inboxkitEndpointSchemas).sort()).toEqual(paths);
		for (const route of TEST_ROUTES) {
			expect(InboxkitEndpointInputSchemas).toHaveProperty(route.key);
			expect(InboxkitEndpointOutputSchemas).toHaveProperty(route.key);
		}
	});

	it('in the endpoints', () => {
		for (const route of TEST_ROUTES) {
			const [group = '', name = ''] = route.operation.split('.');
			// unknown: a test double; the real types add nothing to this check.
			const endpoints = plugin.endpoints as unknown as Record<
				string,
				// unknown: a test double; the real types add nothing to this check.
				Record<string, unknown>
			>;
			expect(typeof endpoints[group]?.[name]).toBe('function');
		}
	});
});

describe('risk levels', () => {
	it('agree with what call.ts retries: only reads', () => {
		for (const route of TEST_ROUTES) {
			const { read, path } =
				INBOXKIT_OPERATIONS[route.key as keyof typeof INBOXKIT_OPERATIONS];
			expect(path).toBe(route.operation);
			expect(read).toBe(entryFor(route.operation).riskLevel === 'read');
		}
	});

	it('agree with the workspace column of the route table', () => {
		for (const route of TEST_ROUTES) {
			expect(
				INBOXKIT_OPERATIONS[route.key as keyof typeof INBOXKIT_OPERATIONS]
					.workspace,
			).toBe(route.workspace);
		}
	});

	it.each(SPENDS_MONEY.map((path) => [path]))(
		'%s can spend money, so it is destructive and says so',
		(path) => {
			const entry = entryFor(path);
			expect(entry.riskLevel).toBe('destructive');
			expect(entry.description).toMatch(/SPEND/);
		},
	);

	it('has found every purchase', () => {
		expect([...SPENDS_MONEY].sort()).toEqual(
			[
				'billing.addCredits',
				'billing.changeSubscription',
				'billing.updateAutoTopup',
				'domains.register',
				'domains.requestRenewal',
				'inboxPlacement.createTest',
				'inboxPlacement.resumeScheduled',
				'infraGuard.enable',
				'mailboxes.buy',
				'mailboxes.reactivate',
				'mailboxes.reactivateRebuy',
				'mailboxes.uncancel',
				'orders.place',
				'prewarm.buy',
				'warmup.add',
				'warmup.addSmtpMailboxes',
				'warmup.createConnectLink',
			].sort(),
		);
	});

	it.each(RETURNS_SECRETS.map((path) => [path]))(
		'%s returns a credential or a link that grants access, so cautious mode asks',
		(path) => {
			expect(entryFor(path).riskLevel).toBe('destructive');
		},
	);

	it('counts the two credential reads among those', () => {
		expect(RETURNS_SECRETS).toEqual(
			expect.arrayContaining([
				'mailboxes.showCredentials',
				'mailboxes.generateTotp',
				'billing.getPortalLink',
			]),
		);
	});

	it.each(SENDS_ELSEWHERE.map((path) => [path]))(
		'%s can send mail or credentials elsewhere, so it is never a read',
		(path) => {
			expect(entryFor(path).riskLevel).not.toBe('read');
		},
	);

	it('gives nothing that sounds like a change the read level', () => {
		const verbs =
			/\.(add|buy|cancel|change|connect|create|delete|disconnect|enable|invite|move|pause|place|reactivate|register|remove|repair|resetup|resume|rotate|set|setup|uncancel|update|delete)/i;
		const allowed = new Set(['domains.search']);
		for (const [path, entry] of Object.entries(meta)) {
			if (entry.riskLevel === 'read' && !allowed.has(path)) {
				expect(path).not.toMatch(verbs);
			}
		}
	});
});

describe('local data', () => {
	it('has no field that could hold a credential', () => {
		for (const entity of Object.values(InboxkitSchema.entities)) {
			for (const field of Object.keys(entity.shape)) {
				expect(field).not.toMatch(
					/pass|secret|token|credential|totp|api_?key/i,
				);
			}
		}
	});
});

describe('the key', () => {
	const context = (stored?: string) =>
		({
			authType: 'api_key',
			keys: { get_api_key: async () => stored },
		}) as never;

	it('prefers the option', async () => {
		await expect(
			inboxkit({ key: 'option' }).keyBuilder?.(context('stored'), 'endpoint'),
		).resolves.toBe('option');
	});

	it('falls back to the stored key', async () => {
		await expect(
			inboxkit().keyBuilder?.(context('stored'), 'endpoint'),
		).resolves.toBe('stored');
	});

	it('uses the API key for webhooks: the signature is its hash', async () => {
		await expect(
			inboxkit().keyBuilder?.(context('stored'), 'webhook'),
		).resolves.toBe('stored');
	});

	it('throws for a call with no key', async () => {
		await expect(
			inboxkit().keyBuilder?.(context(), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('gives a webhook an empty key instead, so the handler can refuse it clearly', async () => {
		await expect(inboxkit().keyBuilder?.(context(), 'webhook')).resolves.toBe(
			'',
		);
	});
});
