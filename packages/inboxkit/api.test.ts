/**
 * Live tests against InboxKit. They run when INBOXKIT_API_KEY is set (CI has none,
 * so they skip). Everything here but the last block only reads, and never reads a
 * credential. With INBOXKIT_LIVE_WRITE=1 the last block also creates a throwaway
 * workspace named corsair-plugin-test-*, works inside it and deletes it. Nothing
 * here spends money or touches any other workspace: the key is team-wide, so this
 * file refuses to write anywhere it did not create.
 */
import { z } from 'zod';
import { inboxkit } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.INBOXKIT_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;
const writes = KEY.success && process.env.INBOXKIT_LIVE_WRITE === '1';
const describeWrites = writes ? describe : describe.skip;

const key = KEY.data ?? '';
// unknown: endpoints read ctx.key and ctx.options; the rest is the runtime's.
const ctx = (workspaceId?: string) =>
	({ key, options: { workspaceId } }) as never;

// any: each operation's answer is checked by its own schema at run time, and these tests read nested fields.
type Live = (ctx: never, input?: unknown) => Promise<Record<string, any>>;
const api = inboxkit({ key: key || 'none' }).endpoints as unknown as Record<
	string,
	Record<string, Live>
>;
// unknown: a test double; the real types add nothing to this check.
const run = (operation: string, context: never, input: unknown = {}) => {
	const [group = '', name = ''] = operation.split('.');
	return (api[group]?.[name] as Live)(context, input);
};

// unknown: a test double; the real types add nothing to this check.
const noWarning = (result: Record<string, unknown>) =>
	expect(result.parse_warning).toBeUndefined();

describeLive('InboxKit, reads', () => {
	let workspace: string;

	beforeAll(async () => {
		const answer = await run('workspaces.list', ctx());
		workspace = answer.workspaces[0].uid;
	});

	it('account.get', async () => {
		const account = await run('account.get', ctx());
		noWarning(account);
		expect(typeof account.credits_remaining).toBe('number');
	});

	it.each([
		'billing.getWallet',
		'billing.getWalletLogs',
		'billing.listTransactions',
		'billing.getPricingPlans',
		'billing.getSubscription',
		'workspaces.list',
		'verifiedDomains.list',
		'inboxPlacement.listTests',
	])('%s', async (operation) => {
		noWarning(await run(operation, ctx()));
	});

	it.each([
		'domains.list',
		'domains.listAssignable',
		'mailboxes.list',
		'sequencers.list',
		'sequencers.listPlatforms',
		'warmup.list',
		'warmup.getStats',
		'warmup.getPricing',
		'tags.list',
		'cloudflare.list',
		'infraGuard.list',
		'infraGuard.getStats',
		'infraGuard.getPricing',
		'infraGuard.listAlerts',
		'infraGuard.listActionItems',
		'infraGuard.getActionItemStats',
		'emailInsights.getOverview',
		'emailInsights.getDailyStats',
		'emailInsights.getMailboxesHealth',
		'emailInsights.getWorkspaceActivity',
		'consentRequests.list',
		'clientIdRequests.list',
		'forwarding.getCapabilities',
		'forwarding.listRules',
		'forwarding.listJobs',
		'inboxPlacement.listScheduled',
	])('%s', async (operation) => {
		noWarning(await run(operation, ctx(workspace)));
	});

	it('a mailbox list carries no credentials', async () => {
		const answer = await run('mailboxes.list', ctx(workspace), { limit: 50 });
		expect(JSON.stringify(answer)).not.toMatch(
			/"(password|app_password|secret|refresh_token)"/,
		);
	});

	it('finds a domain for sale', async () => {
		const answer = await run('domains.checkAvailability', ctx(), {
			domain: 'corsair-plugin-test-available-check.com',
		});
		noWarning(answer);
	});

	it('searches by domain alone, which the docs wrongly refuse', async () => {
		noWarning(
			await run('domains.search', ctx(), {
				num: 2,
				domain: 'corsair-plugin-test-available-check.com',
			}),
		);
	});

	it('reports a missing mailbox as InboxKit words it', async () => {
		await expect(
			run('mailboxes.get', ctx(workspace), {
				uid: '00000000-0000-4000-8000-000000000000',
			}),
		).rejects.toThrow('InboxKit 404: Mailbox not found');
	});

	it('names the error for a workspace that does not exist', async () => {
		await expect(
			run('domains.list', ctx('00000000-0000-4000-8000-000000000000')),
		).rejects.toThrow('Invalid workspace');
	});
});

describeWrites('InboxKit, inside a throwaway workspace', () => {
	const name = `corsair-plugin-test-${Date.now()}`;
	const domain = `corsair-plugin-test-${Date.now() % 1_000_000}.com`;
	let scratch: string;
	let existing: Set<string>;
	let domainUid: string | undefined;

	beforeAll(async () => {
		const before = await run('workspaces.list', ctx());
		existing = new Set(
			before.workspaces.map((row: { uid: string }) => row.uid),
		);
		const created = await run('workspaces.create', ctx(), { name });
		noWarning(created);
		scratch = created.workspace?.uid ?? created.uid ?? created.data?.uid;
		if (!scratch || existing.has(scratch)) {
			throw new Error('workspaces.create did not return a new workspace');
		}
	});

	afterAll(async () => {
		if (!scratch || existing.has(scratch)) return;
		if (domainUid) {
			await run('domains.remove', ctx(scratch), {
				domains: [domain],
				uids: [domainUid],
			}).catch(() => undefined);
		}
		await run('workspaces.delete', ctx(), { uid: scratch });
	});

	it('updates the workspace', async () => {
		noWarning(
			await run('workspaces.update', ctx(), {
				uid: scratch,
				name: `${name}-renamed`,
				webhook_url: '',
			}),
		);
	});

	it('creates, assigns and deletes a tag, and connects a domain', async () => {
		const tag = await run('tags.create', ctx(scratch), { name: 'plugin-test' });
		noWarning(tag);
		const tagUid = tag.tag?.uid ?? tag.uid ?? tag.data?.uid;

		noWarning(
			await run('domains.connect', ctx(scratch), { domains: [domain] }),
		);
		const listed = await run('domains.list', ctx(scratch));
		domainUid = listed.domains.find(
			(row: { name: string }) => row.name === domain,
		)?.uid;
		expect(domainUid).toBeTruthy();

		noWarning(
			await run('tags.assign', ctx(scratch), {
				entityType: 'domains',
				entityUids: [domainUid],
				tagUids: [tagUid],
				action: 'add',
			}),
		);
		noWarning(await run('tags.delete', ctx(scratch), { uid: tagUid }));
	});

	it('adds, updates and deletes a DNS record', async () => {
		noWarning(
			await run('dns.add', ctx(scratch), {
				uid: domainUid,
				records: [
					{
						host: 'plugin-test',
						type: 'TXT',
						value: 'corsair-plugin-test',
						ttl: 300,
					},
				],
			}),
		);
		const records = async () =>
			(await run('dns.list', ctx(scratch), { uid: domainUid })).dns_record
				.records as Array<{ _id: string; host: string; value: string }>;
		const added = (await records()).find((row) =>
			row.host.startsWith('plugin-test'),
		);
		expect(added?.value).toBe('corsair-plugin-test');

		noWarning(
			await run('dns.update', ctx(scratch), {
				uid: domainUid,
				records: [
					{
						record_id: added?._id,
						host: added?.host,
						type: 'TXT',
						value: 'corsair-plugin-test-2',
						ttl: 300,
					},
				],
			}),
		);
		expect((await records()).find((row) => row._id === added?._id)?.value).toBe(
			'corsair-plugin-test-2',
		);

		noWarning(
			await run('dns.deleteRecords', ctx(scratch), {
				uid: domainUid,
				record_ids: [added?._id],
			}),
		);
		expect((await records()).some((row) => row._id === added?._id)).toBe(false);
	});

	it('sets and removes forwarding, catch-all and DMARC', async () => {
		const uids = [domainUid];
		noWarning(
			await run('domains.setForwarding', ctx(scratch), {
				uids,
				forwarding_url: 'https://example.com',
			}),
		);
		noWarning(
			await run('domains.setCatchAll', ctx(scratch), {
				uids,
				email: 'nobody@example.com',
			}),
		);
		noWarning(await run('domains.removeCatchAll', ctx(scratch), { uids }));
		noWarning(
			await run('domains.setDmarc', ctx(scratch), {
				uids,
				reportingEmail: 'nobody@example.com',
			}),
		);
		noWarning(await run('domains.removeDmarc', ctx(scratch), { uids }));
	});

	it('leaves other workspaces alone: the count has only grown by this one', async () => {
		const now = await run('workspaces.list', ctx());
		for (const uid of existing) {
			expect(
				now.workspaces.some((row: { uid: string }) => row.uid === uid),
			).toBe(true);
		}
		expect(now.workspaces).toHaveLength(existing.size + 1);
	});
});
