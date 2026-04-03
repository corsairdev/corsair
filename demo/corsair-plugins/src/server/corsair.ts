import { createCorsair } from 'corsair';
import { slack } from 'corsair/plugins/slack';
import { linear } from 'corsair/plugins/linear';
import { asana } from 'corsair/plugins/asana';
import { fireflies } from 'corsair/plugins/fireflies';
import { twitterapiio } from 'corsair/plugins/twitterapiio';
import { gmail } from 'corsair/plugins/gmail';
import { sqlite } from '../db';
import { outlook } from 'corsair/plugins/outlook';

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [twitterapiio(), slack(), linear(), fireflies(), asana(), gmail(), outlook()],
});
