import type { InternalParadymPlugin } from './index';
import { paradym } from './index';

/**
 * Live smoke: read-only, few calls. Both PARADYM_API_KEY and PARADYM_WALLET_ID
 * are needed (every wallet-scoped route takes the wallet id in its path); a
 * skipped run is not a pass, so a partial setup is reported. Every answer
 * comes back through the endpoint's output schema, so a field typed wrongly
 * fails here and not for a caller.
 */
const apiKey = process.env.PARADYM_API_KEY;
const walletId = process.env.PARADYM_WALLET_ID;
const describeIfKey = apiKey && walletId ? describe : describe.skip;

const missing = [
	!apiKey && 'PARADYM_API_KEY',
	!walletId && 'PARADYM_WALLET_ID',
].filter(Boolean);
if (missing.length > 0) {
	console.warn(
		`Paradym live smoke skipped: missing ${missing.join(', ')} (create an API key at https://app.paradym.id)`,
	);
}

describeIfKey('paradym live smoke', () => {
	const plugin: InternalParadymPlugin = paradym({
		key: apiKey as string,
		walletId: walletId as string,
	});

	// The endpoints read the key and the wallet id off the context; a direct
	// call supplies both rather than going through the runtime.
	const ctx = {
		key: apiKey as string,
		options: { walletId: walletId as string },
	} as never;

	it('lists wallets through the output schema', async () => {
		const page = await plugin.endpoints!.wallets.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists credential templates through the output schema', async () => {
		const page = await plugin.endpoints!.credentialTemplates.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists issuance sessions through the output schema', async () => {
		const page = await plugin.endpoints!.issuance.listSessions(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists verification sessions through the output schema', async () => {
		const page = await plugin.endpoints!.verification.listSessions(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists trusted entities through the output schema', async () => {
		const page = await plugin.endpoints!.trustedEntities.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists webhook deliveries through the output schema', async () => {
		const page = await plugin.endpoints!.webhooks.listDeliveries(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});
});
