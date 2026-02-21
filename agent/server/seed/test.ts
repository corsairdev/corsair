import { corsair } from '../corsair';

async function main() {
	// 1. Get all Linear teams
	const allLinearTeams = await corsair.linear.api.teams.list({});
	const teams = allLinearTeams.nodes.map((team) => ({
		teamId: team.id,
		teamName: team.name,
	}));
	//2. Find the team with name matching 'join demeter' (case-insensitive)
	const targetTeam = teams.find(
		(team) => team.teamName.toLowerCase() === 'join demeter',
	);
	if (!targetTeam) {
		console.log(
			'Could not find a Linear team named \\\"join demeter\\\". Available teams:',
			teams.map((t) => t.teamName),
		);
		return;
	}
	//3. List all issues for the team
	const issuesResponse = await corsair.linear.api.issues.list({
		teamId: targetTeam.teamId,
	});
	const completedIssues = (issuesResponse.nodes || []).filter(
		(issue) => issue.state?.name?.toLowerCase() === 'completed',
	);
	if (completedIssues.length === 0) {
		console.log('No completed issues found for team join demeter.');
		return;
	}
	//4. Build a summary
	const summary = completedIssues
		.map(
			(issue) =>
				`• ${issue.title} (ID: ${issue.identifier})${
					issue.description
						? `\\
${issue.description}`
						: ''
				}`,
		)
		.join('\\\\');
	const messageText = `*Completed issues for team join demeter:*\\${summary}`;
	//5. Find Slack channel 'sdk-test'
	const channelsApiResponse = await corsair.slack.api.channels.list({});
	const channelId = channelsApiResponse.channels?.find(
		(channel) => channel.name === 'sdk-test',
	)?.name;
	if (!channelId) {
		const channelsList = channelsApiResponse?.channels?.map(
			(channel) => channel.name,
		);
		console.log(
			'Slack channel sdk-test not found. Here is a list of the existing channels',
			channelsList,
		);
		return;
	}
	//6. Post the summary to Slack
	await corsair.slack.api.messages.post({
		channel: channelId,
		text: messageText,
	});
	console.log('Summary of completed issues sent to sdk-test.');
}
main().catch(console.error);
