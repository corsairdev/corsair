export * from './core';
export * from './orm';

export { slack } from './plugins/slack';

import { createCorsair } from './core';
import { slack } from './plugins/slack';

export const corsair = createCorsair({
	multiTenancy: true,
	plugins: [
		slack({
			credentials: {
				botToken: '',
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
