// The homepage FAQ. Also rendered into /index.md.

export const FAQ_ITEMS = [
	{
		id: 'different-from-others',
		question: 'How is this different from existing integration products?',
		answer: `Most are closed source. If they're missing an integration, you wait for them to add it. Corsair is open source. Add any integration yourself.

			Also, if you're using Corsair Hub, none of your credentials stay with us. We are a relay between you and your integration. If our database is hacked tomorrow, it has none of your data.`,
	},
	{
		id: 'vibe-code',
		question: 'Why not just vibe code integrations myself?',
		answer: `You can get 80% there fast. The other 20% (token refresh, webhook signature verification, API deprecations, rate limit handling, multi-tenant credential isolation) compounds into a maintenance burden that distracts from your actual product. Corsair is an easy drop-in that takes away all of those headaches.`,
	},
	{
		id: 'api-keys',
		question: 'Does my agent ever see my API keys?',
		answer:
			'No. Corsair resolves credentials internally at call time. Your agent sees method names and results only.',
	},
	{
		id: 'caching',
		question: 'How does caching work?',
		answer:
			'Data flowing through Corsair is stored and kept fresh via webhooks and polling, partitioned per tenant. This is useful if you need to query the same data repeatedly and are worried about rate limits. Reads hit the database, not the third-party API on every request.',
	},
	{
		id: 'without-agent',
		question: 'Can I use this without an AI agent?',
		answer:
			'Yes. Call it like any typed library. Add a "Sync from Airtable" button, a "Create calendar invite" action, a "Post to Slack" trigger. No agent required.',
	},
	{
		id: 'missing-integration',
		question: "What if I need an integration you don't have?",
		answer:
			"Open a PR, fork the repo, or scaffold a new plugin with one command and build it yourself. It's all open source TypeScript.",
	},
	{
		id: 'hosted-security',
		question: 'Is the hosted version secure?',
		answer:
			"The hosted version holds none of your credentials or data. All of that lives in your own database. That means if our database was suddenly opened up tomorrow, your data (and your customers' data) and credentials would not be compromised.",
	},
] as const;
