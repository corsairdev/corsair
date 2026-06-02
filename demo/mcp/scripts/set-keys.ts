import { corsair } from '../corsair';

async function main() {
	await corsair.slack.keys.set_api_key(process.env.SLACK_BOT_TOKEN!);
	console.log('Slack bot token set');
}

main();
