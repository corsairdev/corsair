export * from './adapters';
export * from './core';
export * from './orm';

export { slack } from './plugins/slack';
import { createCorsair } from './core';
import { slack } from './plugins/slack';
import dotenv from 'dotenv';

dotenv.config();

const corsair = createCorsair({
	multiTenancy: false,
	plugins: [
		slack({
			credentials: {
				botToken: process.env.SLACK_TOKEN!,
			},
			hooks: {
				postMessage: {
					before: async (_ctx, input) => {
						// input is strongly typed: { channel: string; text: string }
						void input;
					},
					after: async (_ctx, res) => {
						// res is strongly typed as the awaited endpoint result
						void res;
					},
				},
			},
		}),
	],
});

// example usage

(async () => {
	const test = await corsair.slack.messagesDelete({
		channel: 'C0A3ZTB9X7X',
		ts: '1767855020.532059',
	});

	console.log(test);
})();
// const res = await corsair.withTenant('').slack.channels.count()
