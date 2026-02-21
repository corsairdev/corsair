// ─────────────────────────────────────────────────────────────────────────────
// Code examples for the agent
//
// Each example has:
// - description: A natural language description of what the code does
// - code: The TypeScript code example
// ─────────────────────────────────────────────────────────────────────────────

export interface CodeExample {
	description: string;
	code: string;
}

export const codeExamples: CodeExample[] = [
	{
		description:
			'Send a message to a Slack channel. This example shows how to post a message to the general channel using the Slack API. Note that we are using #general as the channel name. Do not assume the channel and do not use #general by default.',
		code: `async function main() {
  const channelsApiResponse = await corsair.slack.api.channels.list({});

	const channelId = channelsApiResponse.channels?.find(
		(channel) => channel.name === 'general',
	)?.name;

	if (!channelId) {
		const channelsList = channelsApiResponse?.channels?.map(
			(channel) => channel.name,
		);
		console.log(
			'Channel id not found. Here is a list of the existing channels',
			channelsList,
		);

		return;
	}

	const message = await corsair.slack.api.messages.post({
		text: 'Hi!',
		channel: channelId,
	});

	console.log(message);
}
main().catch(console.error);`,
	},
	{
		description:
			'Create a Linear issue in a team. This example demonstrates creating a new issue with a title, description, and priority level.',
		code: `async function main() {
  const allLinearTeams = await corsair.linear.api.teams.list({});

	const teams = allLinearTeams.nodes.map((team) => ({
		teamId: team.id,
		teamName: team.name,
	}));

	if (teams.length > 1) {
		const teamNames = teams.map((team) => team.teamName);
		console.log('Which team? Here is a list of the teams', teamNames);

		return;
	} else if (teams.length === 0) {
		console.log('No Linear teams found');

		return;
	}

	const postedIssue = await corsair.linear.api.issues.create({
		teamId: teams[0]?.teamId!,
		title: 'This is the title of the Linear issue',
		priority: 1, // if the user indicates a priority
		description: "here's a description",
	});

	console.log(postedIssue.id);

	return;
}
main().catch(console.error);`,
	},
	{
		description:
			'Create a Google Calendar event on the primary calendar with a description, start/end time, timezone, and attendee. Sends notifications to invited attendees.',
		code: `async function main() {
	const createEvent = await corsair.googlecalendar.api.events.create({
		calendarId: 'primary',
		event: {
			description: 'description',
			start: {
				dateTime: '2026-02-27T09:00:00-07:00',
				timeZone: 'America/Los_Angeles',
			},
			end: {
				dateTime: '2026-02-27T09:00:00-07:30',
				timeZone: 'America/Los_Angeles',
			},
			attendees: [{ email: 'johndoe@gmail.com' }],
		},
		sendNotifications: true,
	});
	
	console.log(createEvent);
}
main().catch(console.error);`,
	},
];
