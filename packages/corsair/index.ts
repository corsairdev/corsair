export * from './adapters';
export * from './core';
export * from './orm';
export * from './plugins';

export {
	type LinearBoundEndpoints,
	type LinearContext,
	type LinearEndpoints,
	type LinearPluginOptions,
	linear,
} from './plugins/linear';

import dotenv from 'dotenv';

dotenv.config();

// const corsair = createCorsair({
// 	multiTenancy: false,
// 	// database: drizzleAdapter(db, { provider: 'pg', schema }),
// 	plugins: [
// 		slack({
// 			credentials: {
// 				botToken: process.env.SLACK_TOKEN!,
// 			},
// 			hooks: {
// 				postMessage: {
// 					before: async (_ctx, input) => {
// 						// input is strongly typed: { channel: string; text: string }
// 						void input;
// 					},
// 					after: async (_ctx, res) => {
// 						// res is strongly typed as the awaited endpoint result
// 						void res;
// 					},
// 				},
// 			},
// 		}),
// 		linear({
// 			credentials: {
// 				apiKey: process.env.LINEAR_API_KEY!,
// 			},
// 		}),
// 	],
// });

// example usage

// (async () => {
// 	const test = await corsair.slack.postMessage({
// 		channel: 'C0A3ZTB9X7X',
// 		text: 'Hello, world!',
// 	});
// })();

// (async () => {
// 	const test = await corsair.linear.issuesCreate({
// 		title: 'Test issue',
// 		description: 'This is a test issue',
// 		teamId: '2bf0f1b7-001a-4dcd-9cd5-2a16fe044c43',
// 	});
// })();

// const res = await corsair.withTenant('').slack.channels.count()
