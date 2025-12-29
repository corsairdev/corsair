import * as dotenv from 'dotenv';
import { Linear, OpenAPI } from './index';

dotenv.config();
OpenAPI.BASE = process.env.LINEAR_BASE_URL || 'https://api.linear.app/graphql';
OpenAPI.TOKEN = process.env.LINEAR_API_KEY;

async function getTeams() {
	const teams = await Linear.teams.list(10);
	teams.nodes.forEach((team) => {
		console.log(`${team.name} (${team.key}): ${team.id}`);
	});
}

// getTeams();
