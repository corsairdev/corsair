import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	// Create a Linear issue in a team. This example demonstrates creating a new issue with a title, description, and priority level.
	// const res = await corsair.keys.gmail.get_topic_id();

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
	});

	console.log(postedIssue.id);

	return;
};

main();
