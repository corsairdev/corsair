// Use cases: one job an agent does with Corsair, as a prompt to paste.
//
// One list feeds /use-cases, /use-cases/<slug>, the "Try these" section on each
// integration page and (later) the homepage. URLs are flat on purpose: the
// category is only a heading, so regrouping never moves a page Google has
// indexed.
//
// Every operation listed here must exist in the catalog
// (`_integration_operations.short_path` for that app); use-cases.test.ts checks
// the shape, and the catalog check runs against the database before a release.

export type UseCaseCategory =
	| 'Daily briefings'
	| 'Engineering'
	| 'Sales'
	| 'Team updates';

export const USE_CASE_CATEGORIES: UseCaseCategory[] = [
	'Daily briefings',
	'Team updates',
	'Engineering',
	'Sales',
];

export type UseCaseOperation = {
	/** Catalog integration id, e.g. "slack". */
	app: string;
	/** Catalog operation short path, e.g. "messages.post". */
	id: string;
	/** What the agent uses it for, in this job. */
	why: string;
};

export type UseCaseFaq = { id: string; question: string; answer: string };

export type UseCase = {
	slug: string;
	category: UseCaseCategory;
	/** The H1. Leads with the words people search for. */
	title: string;
	/** The page title, 50 characters or fewer (the layout adds " | Corsair"). */
	metaTitle: string;
	/** Short name for cards and links. */
	name: string;
	/** One or two sentences: the meta description and the card text. */
	summary: string;
	/** Catalog integration ids; the first one is the main app. */
	apps: string[];
	/** The prompt to paste into Claude, ChatGPT, Cursor or any MCP client. */
	prompt: string;
	/** Set when the prompt asks for a routine: when it runs, in plain words. */
	runs?: string;
	operations: UseCaseOperation[];
	/** Why the prompt is written the way it is. Three or four short points. */
	notes: { title: string; body: string }[];
	/** Honest limits: what this does not do, or where it gets stuck. */
	limits: string[];
	faqs: UseCaseFaq[];
};

const ROUTINE_FAQ: UseCaseFaq = {
	id: 'routine-runs-when',
	question: 'Does my chat have to stay open for it to run?',
	answer:
		'No. When a prompt says when to run, your agent hands it to Corsair as a routine. Corsair builds and tests it, then runs it on its own. Ask your agent to list your routines, to pause or remove one, or whether one ran ("did the Slack summary run this morning?").',
};

// Hub runs routine schedules as UTC cron and stores no time zone
// (packages/api/src/workflows/schedule.ts), so the prompts name one.
const TIME_ZONE_FAQ: UseCaseFaq = {
	id: 'routine-time-zone',
	question: 'What time zone does the schedule use?',
	answer:
		"Corsair runs schedules in UTC. Name your city or time zone in the prompt, as these prompts do with New York, and ask your agent to list your routines to check the time: Corsair shows it in UTC. A UTC schedule doesn't move when daylight saving time starts or ends, so update the routine then if the hour matters.",
};

export const USE_CASES: UseCase[] = [
	{
		slug: 'slack-reminders',
		category: 'Daily briefings',
		title: 'Slack reminders from Claude or ChatGPT, with your calendar in them',
		metaTitle: 'Slack Reminders from Claude or ChatGPT',
		name: 'Slack reminders with your meetings',
		summary:
			"Have your agent post a Slack reminder every morning with the day's meetings, who's attending and what to prepare. Set it once in plain words.",
		apps: ['slack', 'googlecalendar'],
		prompt:
			"Using Corsair, every weekday at 9am New York time send me a Slack message with today's meetings from my Google Calendar: the time, the title and who's attending. Mark any meeting with someone outside my company.",
		runs: 'Every weekday at 9:00 New York time',
		operations: [
			{
				app: 'googlecalendar',
				id: 'events.getMany',
				why: "Reads the day's events",
			},
			{
				app: 'slack',
				id: 'messages.post',
				why: 'Sends you the reminder',
			},
		],
		notes: [
			{
				title: 'Say when, in your words',
				body: '"Every weekday at 9am New York time" is enough. Use your own city: Corsair runs schedules in UTC, so the time zone is what makes 9am your 9am.',
			},
			{
				title: 'Say where it goes',
				body: '"Send me a Slack message" goes to you. Name a channel instead, like #standup, to remind the whole team.',
			},
			{
				title: 'Say what to include',
				body: 'Time, title and attendees keep it short. Add "the agenda from the invite" if your meetings have one.',
			},
		],
		limits: [
			"For a fixed reminder with nothing from another app, Slack's own /remind command is simpler. Use this when the reminder needs your calendar or other data.",
			'It reads the calendar of the Google account you connected in Corsair, not shared calendars you have not been invited to.',
		],
		faqs: [
			ROUTINE_FAQ,
			TIME_ZONE_FAQ,
			{
				id: 'slack-reminder-vs-remind',
				question: "How is this different from Slack's /remind?",
				answer:
					'/remind posts the same text at a set time. This reads your calendar each morning and writes a new message from it, so the reminder changes with your day. You can also change it later by asking your agent in plain words.',
			},
		],
	},
	{
		slug: 'summarize-slack-channels',
		category: 'Team updates',
		title: 'Summarize Slack channels every morning with Claude',
		metaTitle: 'Summarize Slack Channels Every Morning',
		name: 'Morning summary of Slack channels',
		summary:
			"Get one Slack message each morning with yesterday's open questions, decisions and anything waiting on you, read from the channels you pick.",
		apps: ['slack'],
		prompt:
			"Using Corsair, every weekday at 8:30am New York time read yesterday's messages and threads in #support and #product, then send me one Slack message with: open questions and who asked them, decisions that were made, and anything waiting on me. Link each item to its message.",
		runs: 'Every weekday at 8:30 New York time',
		operations: [
			{ app: 'slack', id: 'channels.list', why: 'Finds the channels by name' },
			{
				app: 'slack',
				id: 'channels.getHistory',
				why: "Reads yesterday's messages",
			},
			{ app: 'slack', id: 'channels.getReplies', why: 'Reads the threads' },
			{
				app: 'slack',
				id: 'messages.getPermalink',
				why: 'Links each item to its message',
			},
			{ app: 'slack', id: 'messages.post', why: 'Sends you the summary' },
		],
		notes: [
			{
				title: 'Name the channels',
				body: 'Two or three named channels give a short, useful summary. "All my channels" gives a long one.',
			},
			{
				title: 'Ask for sections',
				body: 'Open questions, decisions and things waiting on you are the three lists people act on. Change them to fit your team.',
			},
			{
				title: 'Ask for links',
				body: 'A link per item lets you jump into the thread instead of trusting the summary.',
			},
		],
		limits: [
			'It reads only channels the Slack account you connected can see. Add the account to a private channel first.',
			'Very busy channels are read in pages, so a summary of a long day can take a minute to arrive.',
		],
		faqs: [
			ROUTINE_FAQ,
			TIME_ZONE_FAQ,
			{
				id: 'summary-where',
				question: 'Can the summary go to a channel instead of me?',
				answer:
					'Yes. Replace "send me one Slack message" with "post it in #team-digest". The connected account must be able to post in that channel.',
			},
		],
	},
	{
		slug: 'executive-assistant-morning-briefing',
		category: 'Daily briefings',
		title:
			'AI executive assistant: a morning briefing from Gmail and Google Calendar',
		metaTitle: 'AI Executive Assistant for Gmail and Calendar',
		name: 'Morning briefing from Gmail and Calendar',
		summary:
			"An email draft waiting for you each morning: today's meetings, the emails that need a reply today, and what changed overnight.",
		apps: ['gmail', 'googlecalendar'],
		prompt:
			"Using Corsair, every weekday at 7:30am New York time write me a briefing and save it as a Gmail draft to myself. Include today's meetings with who's attending, unread emails that need a reply today, and anything from people I'm meeting today. Keep it under 200 words.",
		runs: 'Every weekday at 7:30 New York time',
		operations: [
			{
				app: 'googlecalendar',
				id: 'events.getMany',
				why: "Reads today's meetings",
			},
			{ app: 'gmail', id: 'messages.list', why: 'Finds unread email' },
			{ app: 'gmail', id: 'threads.get', why: 'Reads the threads that matter' },
			{
				app: 'gmail',
				id: 'drafts.create',
				why: 'Leaves the briefing in your Drafts',
			},
		],
		notes: [
			{
				title: 'A draft, not a sent email',
				body: 'Saving it as a draft means nothing leaves your account. You read it in Gmail like any other email.',
			},
			{
				title: 'Connect the two apps',
				body: '"Anything from people I\'m meeting today" is the line that makes it useful: the agent matches attendees to your inbox.',
			},
			{
				title: 'Cap the length',
				body: 'A word limit keeps a briefing a briefing. Raise it on busy days.',
			},
		],
		limits: [
			'It reads the Gmail and Google Calendar accounts you connected in Corsair. A second work account needs its own connection.',
			'"Needs a reply today" is the model\'s judgment from the email text. Check the list before you rely on it.',
		],
		faqs: [
			ROUTINE_FAQ,
			TIME_ZONE_FAQ,
			{
				id: 'briefing-slack',
				question: 'Can I get the briefing in Slack instead?',
				answer:
					'Yes. Connect Slack in Corsair and change the last part to "send it to me in Slack".',
			},
		],
	},
	{
		slug: 'draft-gmail-replies-with-claude',
		category: 'Daily briefings',
		title: 'Draft Gmail replies with Claude, ready for you to send',
		metaTitle: 'Draft Gmail Replies with Claude',
		name: 'Draft replies to unread Gmail',
		summary:
			'Your agent reads the unread emails that need an answer and leaves a draft reply in each thread. Nothing is sent until you send it.',
		apps: ['gmail'],
		prompt:
			"Using Corsair, go through my unread Gmail from the last two days. For each email that needs a reply from me, write a short draft reply in the same thread and leave it in Drafts. Don't send anything. Then list which emails you drafted replies for.",
		operations: [
			{ app: 'gmail', id: 'messages.list', why: 'Finds unread email' },
			{ app: 'gmail', id: 'threads.get', why: 'Reads each conversation' },
			{
				app: 'gmail',
				id: 'drafts.create',
				why: 'Saves each reply as a draft in its thread',
			},
		],
		notes: [
			{
				title: '"Don\'t send anything"',
				body: 'Drafts keep you in control. Sending is a separate operation, and on a Strict link Corsair asks you first anyway.',
			},
			{
				title: 'A time window',
				body: '"The last two days" keeps the run quick. Widen it once you trust the drafts.',
			},
			{
				title: 'Ask for a list',
				body: "The list at the end tells you which drafts to review, so you don't have to open every thread.",
			},
		],
		limits: [
			'Drafts are written from the thread alone. Tell the agent your usual sign-off or tone if it matters.',
			'Newsletters and receipts usually need no reply; the agent skips them, but check the list.',
		],
		faqs: [
			{
				id: 'gmail-send-approval',
				question: 'Can the agent send email without asking me?',
				answer:
					'Only if your link allows it. In the default Cautious mode, sending runs right away; put Gmail on a Strict link and every write, including sending, waits for your approval. This prompt asks for drafts only.',
			},
			{
				id: 'gmail-every-day',
				question: 'Can it do this every morning?',
				answer:
					'Yes. Start the prompt with "Every weekday at 8am New York time," and Corsair saves it as a routine that runs on its own.',
			},
		],
	},
	{
		slug: 'sales-call-prep-hubspot',
		category: 'Sales',
		title:
			'AI sales assistant: prep notes for every call from HubSpot and Gmail',
		metaTitle: 'AI Sales Assistant for HubSpot Call Prep',
		name: 'Sales call prep from HubSpot',
		summary:
			"Before each external meeting, a short prep note: who you're meeting, the company and open deals in HubSpot, and your last emails with them.",
		apps: ['hubspot', 'googlecalendar', 'gmail'],
		prompt:
			"Using Corsair, every weekday at 8am New York time look at today's meetings in my Google Calendar with people outside my company. For each one, find the contact and company in HubSpot, any open deals, and my last email thread with them in Gmail. Save one prep note per meeting as a Gmail draft to myself: who they are, where the deal stands, and what we last talked about.",
		runs: 'Every weekday at 8:00 New York time',
		operations: [
			{
				app: 'googlecalendar',
				id: 'events.getMany',
				why: "Finds today's external meetings",
			},
			{ app: 'hubspot', id: 'contacts.search', why: 'Finds each attendee' },
			{
				app: 'hubspot',
				id: 'companies.searchByDomain',
				why: 'Finds their company from the email domain',
			},
			{ app: 'hubspot', id: 'deals.search', why: 'Finds open deals' },
			{
				app: 'gmail',
				id: 'messages.list',
				why: 'Finds your last emails with them',
			},
			{ app: 'gmail', id: 'threads.get', why: 'Reads that thread' },
			{
				app: 'gmail',
				id: 'drafts.create',
				why: 'Leaves the prep notes in Drafts',
			},
		],
		notes: [
			{
				title: '"Outside my company"',
				body: 'The agent compares attendee email domains with yours, so internal meetings are skipped.',
			},
			{
				title: 'Three questions per note',
				body: 'Who they are, where the deal stands, what you last discussed. That fits on one screen before the call.',
			},
			{
				title: 'Only reads HubSpot',
				body: 'Its one write is the Gmail draft, so nothing changes in your CRM.',
			},
		],
		limits: [
			'A contact missing from HubSpot gets a note from the calendar invite and email alone.',
			'It reads deals your HubSpot user can see; team permissions in HubSpot still apply.',
		],
		faqs: [
			ROUTINE_FAQ,
			TIME_ZONE_FAQ,
			{
				id: 'hubspot-log',
				question: 'Can it also log the meeting in HubSpot afterwards?',
				answer:
					"Yes. Ask it to create a HubSpot engagement for each meeting after it ends. That is a write, so it follows your link's approval mode.",
			},
		],
	},
	{
		slug: 'github-issues-to-linear',
		category: 'Engineering',
		title: 'Linear GitHub integration: send new GitHub issues to Linear',
		metaTitle: 'Linear GitHub Integration for New Issues',
		name: 'New GitHub issues into Linear',
		summary:
			'When someone opens an issue in your GitHub repo, a Linear issue is created in the right team with a summary, and each issue links to the other.',
		apps: ['github', 'linear'],
		prompt:
			'Using Corsair, whenever a new issue is opened in our GitHub repo acme/api, create a Linear issue in the Platform team with the same title, a one-line summary and a link to the GitHub issue. Then comment on the GitHub issue with the Linear link.',
		runs: 'When a GitHub issue is opened',
		operations: [
			{ app: 'github', id: 'issues.get', why: 'Reads the new issue' },
			{ app: 'linear', id: 'teams.list', why: 'Finds the Platform team' },
			{ app: 'linear', id: 'issues.create', why: 'Creates the Linear issue' },
			{
				app: 'github',
				id: 'issues.createComment',
				why: 'Posts the Linear link on GitHub',
			},
		],
		notes: [
			{
				title: 'Name the repo and the team',
				body: '"acme/api" and "the Platform team" leave nothing to guess. Use your own names.',
			},
			{
				title: 'Link both ways',
				body: 'The comment on GitHub tells the reporter where the work is tracked; the link in Linear takes engineers back to the report.',
			},
			{
				title: 'Add your own rules',
				body: 'For example: "only issues labeled bug", or "set priority to urgent if the title says crash".',
			},
		],
		limits: [
			"Linear's built-in GitHub integration links pull requests to issues. Use this when you want your own rules for which GitHub issues become Linear work.",
			'It runs for repos the GitHub account you connected can read.',
		],
		faqs: [
			{
				id: 'github-linear-trigger',
				question: 'Does it run on its own when an issue is opened?',
				answer:
					'Yes. "Whenever a new issue is opened" becomes a routine that starts on GitHub\'s issue event. Corsair receives the event and runs the steps, with no chat open.',
			},
			{
				id: 'github-linear-existing',
				question: 'Can it move issues that are already open?',
				answer:
					'Yes, as a one-off: ask "create Linear issues for the open GitHub issues in acme/api labeled bug" without the "whenever" part.',
			},
		],
	},
	{
		slug: 'github-pull-request-digest-slack',
		category: 'Engineering',
		title: 'Weekly GitHub pull request digest in Slack, written by Claude',
		metaTitle: 'Weekly GitHub Pull Request Digest in Slack',
		name: 'Weekly pull request digest in Slack',
		summary:
			"Every Monday, one Slack post with last week's merged pull requests and the ones waiting on review for too long.",
		apps: ['github', 'slack'],
		prompt:
			'Using Corsair, every Monday at 9am New York time list the pull requests in acme/web that were merged last week and the ones that have been open for more than three days. Post them in #engineering in Slack, grouped as "Shipped" and "Waiting on review", with links and authors.',
		runs: 'Every Monday at 9:00 New York time',
		operations: [
			{
				app: 'github',
				id: 'pullRequests.list',
				why: 'Lists merged and open pull requests',
			},
			{
				app: 'github',
				id: 'pullRequests.listReviews',
				why: 'Checks which ones have reviews',
			},
			{ app: 'slack', id: 'messages.post', why: 'Posts the digest' },
		],
		notes: [
			{
				title: 'Two groups',
				body: '"Shipped" is for the team\'s morale; "Waiting on review" is the part that gets things moving.',
			},
			{
				title: 'A threshold',
				body: '"Open for more than three days" keeps the waiting list to the ones that need a nudge.',
			},
			{
				title: 'One channel',
				body: 'Post where the team already talks about code, not in a new channel nobody reads.',
			},
		],
		limits: [
			'One repo per line works best. For several repos, name each one.',
			'It reads repos the GitHub account you connected can see.',
		],
		faqs: [
			ROUTINE_FAQ,
			TIME_ZONE_FAQ,
			{
				id: 'pr-digest-dm',
				question: 'Can each author get their own reminder instead?',
				answer:
					'Yes. Ask it to message each author in Slack about their pull requests waiting on review. The agent matches GitHub authors to Slack users by name, so check the first run.',
			},
		],
	},
	{
		slug: 'slack-thread-to-linear-issue',
		category: 'Engineering',
		title: 'Turn a Slack thread into a Linear issue with Claude',
		metaTitle: 'Turn Slack Threads into Linear Issues',
		name: 'Slack thread into a Linear issue',
		summary:
			'Paste a Slack thread link and get a Linear issue with a clear title, the problem in two sentences and a link back to the conversation.',
		apps: ['slack', 'linear'],
		prompt:
			'Using Corsair, read this Slack thread: <paste the thread link>. Create a Linear issue in the Product team with a short title, the problem in two sentences, what people suggested, and a link to the thread. Then reply in the thread with the Linear link.',
		operations: [
			{
				app: 'slack',
				id: 'channels.getReplies',
				why: 'Reads the whole thread',
			},
			{ app: 'linear', id: 'teams.list', why: 'Finds the Product team' },
			{ app: 'linear', id: 'issues.create', why: 'Creates the issue' },
			{
				app: 'slack',
				id: 'messages.post',
				why: 'Replies in the thread with the link',
			},
		],
		notes: [
			{
				title: 'Paste the link',
				body: 'In Slack, open the thread menu and copy the link. The agent reads every reply, not just the first message.',
			},
			{
				title: 'Two sentences',
				body: 'A short problem statement is easier to triage than a pasted conversation.',
			},
			{
				title: 'Close the loop',
				body: 'The reply in the thread tells everyone it is tracked, so nobody files it twice.',
			},
		],
		limits: [
			'The Slack account you connected must be in the channel to read the thread.',
			'It writes in Linear and Slack, so on a Strict link both steps wait for your approval.',
		],
		faqs: [
			{
				id: 'thread-linear-auto',
				question: 'Can it watch a channel and do this on its own?',
				answer:
					'Yes. Ask: "whenever someone reacts with :ticket: to a message in #support, create a Linear issue from its thread". Corsair saves that as a routine on Slack\'s reaction event.',
			},
		],
	},
	{
		slug: 'weekly-update-notion-from-linear',
		category: 'Team updates',
		title: 'Weekly project update in Notion, written from Linear',
		metaTitle: 'Weekly Notion Update Written from Linear',
		name: 'Weekly Notion update from Linear',
		summary:
			'Every Friday, a new Notion page with what the team finished, started and is blocked on this week, grouped by Linear project.',
		apps: ['linear', 'notion'],
		prompt:
			'Using Corsair, every Friday at 4pm New York time write this week\'s update for the Platform team from Linear: issues completed, issues started, and anything blocked, grouped by project. Add it as a new page called "Week of <date>" under the "Weekly updates" page in Notion.',
		runs: 'Every Friday at 16:00 New York time',
		operations: [
			{ app: 'linear', id: 'issues.list', why: "Reads the week's issues" },
			{ app: 'linear', id: 'projects.list', why: 'Groups them by project' },
			{
				app: 'notion',
				id: 'pages.searchPage',
				why: 'Finds the "Weekly updates" page',
			},
			{ app: 'notion', id: 'pages.createPage', why: 'Creates the new update' },
			{ app: 'notion', id: 'blocks.appendBlock', why: 'Writes the sections' },
		],
		notes: [
			{
				title: 'Name the parent page',
				body: 'The agent files every update under one page, so they stay in one place and in order.',
			},
			{
				title: 'Three lists',
				body: 'Completed, started and blocked answer what a manager asks on Friday.',
			},
			{
				title: 'Group by project',
				body: 'Grouping turns a list of tickets into something a reader outside the team can follow.',
			},
		],
		limits: [
			'Notion only lets the agent write to pages shared with the Notion connection. Share the "Weekly updates" page with it first.',
			"Blocked means issues in a blocked state or with a blocking relation in Linear; it can't know about blockers nobody wrote down.",
		],
		faqs: [
			ROUTINE_FAQ,
			TIME_ZONE_FAQ,
			{
				id: 'notion-slack-too',
				question: 'Can it also post the link in Slack?',
				answer:
					'Yes. Add "and post the page link in #platform" and connect Slack in Corsair.',
			},
		],
	},
];

/** Display names for the apps above, so cards render without a catalog query. */
export const USE_CASE_APP_NAMES: Record<string, string> = {
	github: 'GitHub',
	gmail: 'Gmail',
	googlecalendar: 'Google Calendar',
	hubspot: 'HubSpot',
	linear: 'Linear',
	notion: 'Notion',
	slack: 'Slack',
};

export function useCaseAppName(appId: string): string {
	return USE_CASE_APP_NAMES[appId] ?? appId;
}

/** The prompt for an app with no written use case yet. */
export function starterPrompt(displayName: string): string {
	return `Using Corsair, show me what you can do in ${displayName} on my account, then run one read-only example and show me the result.`;
}

export function getUseCase(slug: string): UseCase | undefined {
	return USE_CASES.find((useCase) => useCase.slug === slug);
}

/** Use cases that involve an app, the ones where it is the main app first. */
export function useCasesForApp(appId: string): UseCase[] {
	const id = appId.toLowerCase();
	return USE_CASES.filter((useCase) => useCase.apps.includes(id)).sort(
		(a, b) => Number(b.apps[0] === id) - Number(a.apps[0] === id),
	);
}

export function useCasesByCategory(): {
	category: UseCaseCategory;
	useCases: UseCase[];
}[] {
	return USE_CASE_CATEGORIES.map((category) => ({
		category,
		useCases: USE_CASES.filter((useCase) => useCase.category === category),
	})).filter((group) => group.useCases.length > 0);
}

/** Operation ids an app's use cases rely on, in first-use order. */
export function featuredOperationIds(appId: string): string[] {
	const id = appId.toLowerCase();
	const seen = new Set<string>();
	for (const useCase of useCasesForApp(id)) {
		for (const operation of useCase.operations) {
			if (operation.app === id) seen.add(operation.id);
		}
	}
	return [...seen];
}

export function categorySlug(category: UseCaseCategory): string {
	return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
