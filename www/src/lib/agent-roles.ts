// "Turn Claude into a sales rep": a job title, the apps it needs connected in
// Corsair, and the calls an agent makes with them. The homepage plays each
// role as a chat: the prompt, one line per call with what came back, and the
// agent's answer. Tests check that every app shown is used by a call and named
// in the prompt, so no logo sits on the page without a job.
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
	/** What came back, shown next to the call, e.g. "20 companies". */
	result: string;
	/** A write Corsair held until the user approved it. */
	approved?: boolean;
};

export type AgentRole = {
	id: string;
	/** Finishes "Turn Claude into …". */
	title: string;
	/** Every app a step uses, in the order the steps first use them. */
	apps: AgentRoleApp[];
	steps: AgentRoleStep[];
	prompt: string;
	/** The agent's reply once the calls are done. */
	answer: string;
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
			{ id: 'slack', name: 'Slack' },
		],
		steps: [
			{
				text: 'find companies that fit the ICP',
				app: 'apollo',
				tool: 'organizations.search',
				result: '20 companies',
			},
			{
				text: 'find the decision-makers',
				app: 'apollo',
				tool: 'people.search',
				result: '20 people',
			},
			{
				text: 'skip anyone already in HubSpot',
				app: 'hubspot',
				tool: 'contacts.search',
				result: '3 already in HubSpot',
			},
			{
				text: 'draft a first email to each',
				app: 'gmail',
				tool: 'drafts.create',
				result: '17 drafts',
			},
			{
				text: 'post the list for the team',
				app: 'slack',
				tool: 'messages.post',
				result: 'posted in #sales',
			},
		],
		prompt:
			'Using Corsair, find 20 US fintech companies with 50 to 200 people in Apollo and their heads of engineering. Skip anyone already in HubSpot, draft a short first email to each in Gmail, and post the list in #sales on Slack.',
		answer:
			'Found 20 companies and their heads of engineering. 3 were already in HubSpot, so I drafted 17 emails in Gmail and posted the list in #sales.',
		useCase: 'sales-call-prep-hubspot',
	},
	{
		id: 'recruiter',
		title: 'a recruiter',
		apps: [
			{ id: 'ashby', name: 'Ashby' },
			{ id: 'calendly', name: 'Calendly' },
			{ id: 'gmail', name: 'Gmail' },
		],
		steps: [
			{
				text: "read this week's applicants",
				app: 'ashby',
				tool: 'application.list',
				result: '42 applicants',
			},
			{
				text: 'compare them with the job',
				app: 'ashby',
				tool: 'job.info',
				result: 'job description',
			},
			{
				text: 'move them to screen when you approve',
				app: 'ashby',
				tool: 'application.changeStage',
				result: '5 moved',
				approved: true,
			},
			{
				text: 'make each a booking link',
				app: 'calendly',
				tool: 'schedulingLinks.createSingleUse',
				result: '5 links',
			},
			{
				text: 'draft an invite to each',
				app: 'gmail',
				tool: 'drafts.create',
				result: '5 drafts',
			},
		],
		prompt:
			"Using Corsair, read this week's applicants for the Senior Backend Engineer job in Ashby and pick the five closest to the job description. Once I approve, move them to Phone screen and draft each an invite in Gmail with a Calendly link.",
		answer:
			'Moved the five you approved to Phone screen. Each has a Gmail draft with a single-use Calendly link, ready for you to send.',
	},
	{
		id: 'executive-assistant',
		title: 'an executive assistant',
		apps: [
			{ id: 'googlecalendar', name: 'Google Calendar' },
			{ id: 'gmail', name: 'Gmail' },
			{ id: 'notion', name: 'Notion' },
			{ id: 'slack', name: 'Slack' },
		],
		steps: [
			{
				text: "read today's calendar",
				app: 'googlecalendar',
				tool: 'events.getMany',
				result: '5 meetings',
			},
			{
				text: 'find the emails that need a reply',
				app: 'gmail',
				tool: 'messages.list',
				result: '4 need a reply',
			},
			{
				text: 'pull the notes for each meeting',
				app: 'notion',
				tool: 'pages.searchPage',
				result: '3 pages',
			},
			{
				text: 'send the morning briefing',
				app: 'slack',
				tool: 'messages.post',
				result: 'sent to you',
			},
		],
		prompt:
			'Using Corsair, brief me on today: my Google Calendar meetings, the Notion notes for each, and the Gmail threads that need a reply. Send it to me on Slack.',
		answer:
			'Sent your briefing on Slack: 5 meetings, notes for 3 of them, and 4 emails to answer. Want this every weekday at 7:30am?',
		useCase: 'executive-assistant-morning-briefing',
	},
	{
		id: 'support-lead',
		title: 'a support lead',
		apps: [
			{ id: 'zendesk', name: 'Zendesk' },
			{ id: 'linear', name: 'Linear' },
			{ id: 'slack', name: 'Slack' },
		],
		steps: [
			{
				text: "read yesterday's tickets",
				app: 'zendesk',
				tool: 'tickets.list',
				result: '38 tickets',
			},
			{
				text: 'group the ones about the same bug',
				app: 'zendesk',
				tool: 'comments.list',
				result: '4 bugs',
			},
			{
				text: 'file a Linear issue per bug',
				app: 'linear',
				tool: 'issues.create',
				result: '4 issues',
			},
			{
				text: 'post the summary in #support',
				app: 'slack',
				tool: 'messages.post',
				result: 'posted in #support',
			},
		],
		prompt:
			"Using Corsair, read yesterday's Zendesk tickets, group the ones that describe the same bug, and file one Linear issue per bug with the ticket links. Then post a short summary in #support on Slack.",
		answer:
			'38 tickets came down to 4 bugs. I filed a Linear issue for each with the ticket links and posted the summary in #support.',
		useCase: 'slack-thread-to-linear-issue',
	},
	{
		id: 'engineering-manager',
		title: 'an engineering manager',
		apps: [
			{ id: 'sentry', name: 'Sentry' },
			{ id: 'linear', name: 'Linear' },
			{ id: 'github', name: 'GitHub' },
		],
		steps: [
			{
				text: "read this week's Sentry issues",
				app: 'sentry',
				tool: 'issues.list',
				result: '11 issues',
			},
			{
				text: 'check which ones have a Linear issue',
				app: 'linear',
				tool: 'issues.list',
				result: '7 tracked',
			},
			{
				text: 'open issues for the rest',
				app: 'linear',
				tool: 'issues.create',
				result: '4 opened',
			},
			{
				text: 'list the pull requests waiting on review',
				app: 'github',
				tool: 'pullRequests.list',
				result: '3 waiting',
			},
		],
		prompt:
			'Using Corsair, list the Sentry issues from this week that have no Linear issue yet and open one for each in the Platform team. Then list the GitHub pull requests in acme/api waiting more than two days for review.',
		answer:
			'Opened 4 Linear issues for the Sentry errors nobody was tracking. 3 pull requests in acme/api have waited more than two days for review.',
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
		],
		steps: [
			{
				text: 'find keywords ranking 11 to 20',
				app: 'ahrefs',
				tool: 'siteExplorer.organicKeywords',
				result: '64 keywords',
			},
			{
				text: 'check their search volume',
				app: 'dataforseo',
				tool: 'keywords.searchVolume',
				result: '64 volumes',
			},
			{
				text: 'compare with real traffic',
				app: 'googleanalytics',
				tool: 'reports.run',
				result: "last month's traffic",
			},
			{
				text: 'write the plan to a sheet',
				app: 'googlesheets',
				tool: 'sheets.appendRow',
				result: '10 rows',
			},
		],
		prompt:
			'Using Corsair, find the keywords where example.com ranks 11 to 20 in Ahrefs, check their US search volume in DataForSEO, compare with last month\'s landing page traffic in Google Analytics, and add the ten best to the "SEO plan" sheet in Google Sheets.',
		answer:
			'Added the ten best keywords to "SEO plan", with search volume and last month\'s traffic next to each.',
	},
];
