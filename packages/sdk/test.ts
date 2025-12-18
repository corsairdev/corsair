import 'dotenv/config';
import { OpenAPI, Slack } from './slack';

// Set the token globally
OpenAPI.TOKEN = process.env.SLACK_BOT_TOKEN;

const main = async () => {
	const channels = await Slack.Channels.list({});

	const generalChannel = channels?.channels?.find(
		(val) => val?.name === 'general',
	);
	console.log(JSON.stringify(generalChannel, null, 2));
};

await main();

const corsair = ({ database: {} }) => {};

export const api = corsair({
	database: {},
});
