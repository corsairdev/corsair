import type { IntegrationId } from '../data/companies-data';

export type UseCaseId =
	| 'personal-assistant'
	| 'workflow-automation'
	| 'knowledge-base'
	| 'agent-chatbot';

export type UseCaseDefinition = {
	id: UseCaseId;
	label: string;
	headline: string;
	description: string;
	integrations: IntegrationId[];
};

export const USE_CASES: UseCaseDefinition[] = [
	{
		id: 'personal-assistant',
		label: 'Personal assistant',
		headline: 'One assistant, every app your users rely on.',
		description:
			'Personal assistants only work when they can read calendars, send messages, update CRMs, and search docs. Corsair connects every integration so your assistant can coordinate across tools — without you maintaining each API.',
		integrations: ['gmail', 'slack', 'gcal', 'notion', 'linear', 'hubspot'],
	},
	{
		id: 'workflow-automation',
		label: 'Workflow automation',
		headline: 'Chain actions across tools without brittle glue code.',
		description:
			'Workflow builders need reliable triggers, credentials, and retries on every step. Corsair is the shared integration layer that keeps each node in your pipeline connected and authenticated.',
		integrations: ['slack', 'linear', 'gmail', 'notion', 'stripe'],
	},
	{
		id: 'knowledge-base',
		label: 'Knowledge base',
		headline: 'Sync context from everywhere your team works.',
		description:
			'Knowledge bases are only as good as the sources they ingest. Corsair handles auth, webhooks, and sync for every integration so your search layer stays fresh without custom ETL per provider.',
		integrations: ['gmail', 'notion', 'slack', 'gcal', 'github'],
	},
	{
		id: 'agent-chatbot',
		label: 'Agent chatbot',
		headline: 'Give agents tools, not API keys.',
		description:
			'Agent chatbots call integrations constantly — reading data, taking actions, waiting for approval. Corsair exposes typed methods with permissions built in, so your agent sees results, never credentials.',
		integrations: ['airtable', 'slack', 'gmail', 'linear'],
	},
];

export const CORSAIR_CAPABILITIES = [
	'Auth',
	'Credentials',
	'Permissions',
	'Webhooks',
	'Sync',
] as const;
