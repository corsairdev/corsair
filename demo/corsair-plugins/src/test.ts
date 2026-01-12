import { corsair } from './';

const main = async () => {
	const res = await corsair.slack.postMessage({
		channel: 'C0A3ZTB9X7X',
		text: 'Hello, world!',
	});
	console.log(res);
};

main();
