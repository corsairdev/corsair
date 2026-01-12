export * from './adapters';
export * from './core';
export * from './orm';

export {
	type SlackBoundEndpoints,
	type SlackContext,
	type SlackEndpoints,
	type SlackPluginOptions,
	slack,
} from './plugins/slack';

import dotenv from 'dotenv';
import { createCorsair } from './core';
import { slack } from './plugins/slack';

dotenv.config();

const corsair = createCorsair({
	multiTenancy: false,
	// database: drizzleAdapter(db, { provider: 'pg', schema }),
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

// (async () => {
// 	const test = await corsair.slack.postMessage({
// 		channel: 'C0A3ZTB9X7X',
// 		text: 'Hello, world!',
// 	});

// 	console.log(test);
// })();
// const res = await corsair.withTenant('').slack.channels.count()
