// "Turn Claude into a sales rep": a job title, the apps it needs connected in
// Corsair, and the steps an agent runs with them. Shown on the homepage.
//
// Every step names the catalog tool it uses (`_integration_operations`), so
// the page never claims a job Corsair can't do. Ads roles (media buyer) are
// left out until Corsair has Google, Meta or TikTok Ads plugins.

export type AgentRoleApp = { id: string; name: string };

export type AgentRoleStep = {
	/** What the agent did, as a line in its checklist. */
	text: string;
	app: string;
	/** Catalog operation short path, e.g. "people.search". */
	tool: string;
};

export type AgentRole = {
	id: string;
	/** Finishes "Turn Claude into …". */
	title: string;
	apps: AgentRoleApp[];
	steps: AgentRoleStep[];
	prompt: string;
	/** A use case page that goes deeper, if there is one. */
	useCase?: string;
};

export const AGENT_ROLES: AgentRole[] = [
	{
		id: 'sales-rep',
		title: 'a sales rep',
		apps: [
			{ id: 'apollo', name: 'Apollo' },
			{ id: 'hubspot', name: 'HubSpot' },
			{ id: 'gmail', name: 'Gmail' },
			{ id: 'googlecalendar', name: 'Google Calendar' },
			{ id: 'instantly', name: 'Instantly' },
			{ id: 'slack', name: 'Slack' },
		],
		steps: [
			{
				text: 'find companies that fit the ICP',
				app: 'apollo',
				tool: 'organizations.search',
			},
			{
				text: 'find the decision-makers',
				app: 'apollo',
				tool: 'people.search',
			},
			{
				text: 'skip anyone already in HubSpot',
				app: 'hubspot',
				tool: 'contacts.search',
			},
			{
				text: 'draft a first email to each',
				app: 'gmail',
				tool: 'drafts.create',
			},
		],
		prompt:
			'Using Corsair, find 20 US fintech companies with 50 to 200 people in Apollo and their heads of engineering. Skip anyone already in HubSpot, then draft a short first email to each in Gmail.',
		useCase: 'sales-call-prep-hubspot',
	},
	{
		id: 'recruiter',
		title: 'a recruiter',
		apps: [
			{ id: 'ashby', name: 'Ashby' },
			{ id: 'gmail', name: 'Gmail' },
			{ id: 'calendly', name: 'Calendly' },
			{ id: 'googlecalendar', name: 'Google Calendar' },
			{ id: 'slack', name: 'Slack' },
			{ id: 'notion', name: 'Notion' },
		],
		steps: [
			{
				text: "read this week's applicants",
				app: 'ashby',
				tool: 'application.list',
			},
			{ text: 'compare them with the job', app: 'ashby', tool: 'job.info' },
			{
				text: 'move them to screen when you approve',
				app: 'ashby',
				tool: 'application.changeStage',
			},
			{
				text: 'send each a booking link',
				app: 'calendly',
				tool: 'schedulingLinks.createSingleUse',
			},
		],
		prompt:
			"Using Corsair, read this week's applicants for the Senior Backend Engineer job in Ashby. List the five closest to the job description with one line on why, and wait for me before moving anyone.",
	},
	{
		id: 'executive-assistant',
		title: 'an executive assistant',
		apps: [
			{ id: 'gmail', name: 'Gmail' },
			{ id: 'googlecalendar', name: 'Google Calendar' },
			{ id: 'slack', name: 'Slack' },
			{ id: 'notion', name: 'Notion' },
			{ id: 'zoom', name: 'Zoom' },
			{ id: 'calendly', name: 'Calendly' },
		],
		steps: [
			{
				text: "read today's calendar",
				app: 'googlecalendar',
				tool: 'events.getMany',
			},
			{
				text: 'find the emails that need a reply',
				app: 'gmail',
				tool: 'messages.list',
			},
			{
				text: 'pull the notes for each meeting',
				app: 'notion',
				tool: 'pages.searchPage',
			},
			{
				text: 'send the morning briefing',
				app: 'slack',
				tool: 'messages.post',
			},
		],
		prompt:
			"Using Corsair, every weekday at 7:30am New York time send me a Slack message with today's meetings, the notes I have in Notion for each, and the emails that need a reply today.",
		useCase: 'executive-assistant-morning-briefing',
	},
	{
		id: 'support-lead',
		title: 'a support lead',
		apps: [
			{ id: 'zendesk', name: 'Zendesk' },
			{ id: 'intercom', name: 'Intercom' },
			{ id: 'linear', name: 'Linear' },
			{ id: 'slack', name: 'Slack' },
			{ id: 'stripe', name: 'Stripe' },
			{ id: 'notion', name: 'Notion' },
		],
		steps: [
			{
				text: "read yesterday's tickets",
				app: 'zendesk',
				tool: 'tickets.list',
			},
			{
				text: 'group the ones about the same bug',
				app: 'zendesk',
				tool: 'comments.list',
			},
			{
				text: 'file a Linear issue per bug',
				app: 'linear',
				tool: 'issues.create',
			},
			{
				text: 'post the summary in #support',
				app: 'slack',
				tool: 'messages.post',
			},
		],
		prompt:
			"Using Corsair, read yesterday's Zendesk tickets, group the ones that describe the same bug, and file one Linear issue per bug with the ticket links. Then post a short summary in #support.",
		useCase: 'slack-thread-to-linear-issue',
	},
	{
		id: 'engineering-manager',
		title: 'an engineering manager',
		apps: [
			{ id: 'github', name: 'GitHub' },
			{ id: 'linear', name: 'Linear' },
			{ id: 'sentry', name: 'Sentry' },
			{ id: 'slack', name: 'Slack' },
			{ id: 'notion', name: 'Notion' },
			{ id: 'jira', name: 'Jira' },
		],
		steps: [
			{
				text: "read this week's Sentry issues",
				app: 'sentry',
				tool: 'issues.list',
			},
			{
				text: 'check which ones have a Linear issue',
				app: 'linear',
				tool: 'issues.list',
			},
			{
				text: 'open issues for the rest',
				app: 'linear',
				tool: 'issues.create',
			},
			{
				text: 'list the pull requests waiting on review',
				app: 'github',
				tool: 'pullRequests.list',
			},
		],
		prompt:
			'Using Corsair, list the Sentry issues from this week that have no Linear issue yet and open one for each in the Platform team. Then list the pull requests in acme/api waiting more than two days for review.',
		useCase: 'github-pull-request-digest-slack',
	},
	{
		id: 'seo-marketer',
		title: 'an SEO marketer',
		apps: [
			{ id: 'ahrefs', name: 'Ahrefs' },
			{ id: 'dataforseo', name: 'DataForSEO' },
			{ id: 'googleanalytics', name: 'Google Analytics' },
			{ id: 'googlesheets', name: 'Google Sheets' },
			{ id: 'webflow', name: 'Webflow' },
			{ id: 'slack', name: 'Slack' },
		],
		steps: [
			{
				text: 'find keywords ranking 11 to 20',
				app: 'ahrefs',
				tool: 'siteExplorer.organicKeywords',
			},
			{
				text: 'check their search volume',
				app: 'dataforseo',
				tool: 'keywords.searchVolume',
			},
			{
				text: 'compare with real traffic',
				app: 'googleanalytics',
				tool: 'reports.run',
			},
			{
				text: 'write the plan to a sheet',
				app: 'googlesheets',
				tool: 'sheets.appendRow',
			},
		],
		prompt:
			'Using Corsair, find the keywords where example.com ranks 11 to 20 in Ahrefs, check their US search volume, compare with last month\'s landing page traffic in Google Analytics, and add the ten best to a Google Sheet called "SEO plan".',
	},
];
