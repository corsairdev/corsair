import { processWebhook } from '../webhooks/index';

// MS Graph notifications are shape-identical across outlook/onedrive/
// sharepoint/teams, and sharepoint's pluginWebhookMatcher accepts any JSON —
// so shape-matching misroutes hub-delivered events. Hub already knows the
// plugin; the hint must win.
function makeCorsair(calls: string[]) {
	const bound = (name: string) => ({
		match: () => true,
		handler: async () => {
			calls.push(name);
			return {};
		},
	});
	return {
		sharepoint: {
			webhooks: { lists: { listChanged: bound('sharepoint') } },
			pluginWebhookMatcher: () => true,
		},
		teams: {
			webhooks: { chats: { message: bound('teams') } },
			pluginWebhookMatcher: () => true,
		},
	} as any;
}

const headers = { 'content-type': 'application/json' };
const graphBody = {
	value: [{ subscriptionId: 'sub-1', resource: "chats('19:x')/messages('1')" }],
};

describe('processWebhook plugin hint (hub-verified deliveries)', () => {
	it('dispatches to the hinted plugin instead of shape-matching', async () => {
		const calls: string[] = [];
		const result = await processWebhook(
			makeCorsair(calls),
			headers,
			graphBody,
			undefined,
			{ plugin: 'teams' },
		);
		expect(result.plugin).toBe('teams');
		expect(calls).toEqual(['teams']);
	});

	it('does not fall back to other plugins when the hinted one has no match', async () => {
		const calls: string[] = [];
		const corsair = makeCorsair(calls);
		corsair.teams.webhooks.chats.message.match = () => false;
		const result = await processWebhook(
			corsair,
			headers,
			graphBody,
			undefined,
			{
				plugin: 'teams',
			},
		);
		expect(result.plugin).toBeNull();
		expect(calls).toEqual([]);
	});

	it('keeps shape-matching for direct (non-hub) webhooks', async () => {
		const calls: string[] = [];
		const result = await processWebhook(makeCorsair(calls), headers, graphBody);
		// wildcard matchers still win order-first on direct routes — the hint
		// exists because hub deliveries must not depend on this
		expect(result.plugin).toBe('sharepoint');
	});
});
