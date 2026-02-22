import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	// const res = await corsair.withTenant('default').slack.api.channels.list({});
	const res = await corsair.withTenant('default').spotify.api.player.getCurrentlyPlaying({});
	console.log(res);
};

main();
