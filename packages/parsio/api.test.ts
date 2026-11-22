import type { InternalParsioPlugin } from './index';
import { parsio } from './index';

/**
 * Live smoke: read-only, few calls. PARSIO_API_KEY comes from the Parsio
 * account page; PARSIO_MAILBOX_ID is the mailbox the reads run against
 * (create one with mailboxes.create, or read the id from the app URL).
 * Without both, the whole suite skips (a skipped run is not a pass); every
 * answer goes through its output schema so a wrongly typed field fails here
 * rather than for a caller.
 */
const apiKey = process.env.PARSIO_API_KEY;
const mailboxId = process.env.PARSIO_MAILBOX_ID;
const describeIfKey = apiKey && mailboxId ? describe : describe.skip;

const missing = [
	!apiKey && 'PARSIO_API_KEY',
	!mailboxId && 'PARSIO_MAILBOX_ID',
].filter(Boolean);
if (missing.length > 0) {
	console.warn(
		`Parsio live smoke skipped: missing ${missing.join(', ')} (your API key is on https://app.parsio.io/account)`,
	);
}

describeIfKey('parsio live smoke', () => {
	const plugin: InternalParsioPlugin = parsio({
		key: apiKey as string,
	});

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists mailboxes through the output schema', async () => {
		const mailboxes = await plugin.endpoints!.mailboxes.list(ctx, {});
		expect(Array.isArray(mailboxes)).toBe(true);
	});

	it('reads the configured mailbox through the output schema', async () => {
		const mailbox = await plugin.endpoints!.mailboxes.get(ctx, {
			mailboxId: mailboxId as string,
		});
		expect(mailbox._id).toBeDefined();
	});

	it('lists the mailbox documents through the output schema', async () => {
		const docs = await plugin.endpoints!.documents.list(ctx, {
			mailboxId: mailboxId as string,
			per_page: 5,
		});
		expect(Array.isArray(docs.docs)).toBe(true);
	});

	it('lists the mailbox webhooks through the output schema', async () => {
		const hooks = await plugin.endpoints!.webhooks.listForMailbox(ctx, {
			mailboxId: mailboxId as string,
		});
		expect(Array.isArray(hooks)).toBe(true);
	});
});
