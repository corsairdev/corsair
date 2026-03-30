import { createCorsair } from 'corsair';
import { slack } from 'corsair/plugins/slack';
import { linear } from 'corsair/plugins/linear';
import { jira } from 'corsair/plugins/jira';
import { fireflies } from 'corsair/plugins/fireflies';
import { twitterapiio } from 'corsair/plugins/twitterapiio';
import { sqlite } from '../db';

export const corsair = createCorsair({
	multiTenancy: true,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [twitterapiio(), slack(), linear(), fireflies(), jira()],
});
