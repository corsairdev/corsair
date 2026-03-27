import { createCorsair, linear, slack, twitterapiio, fireflies, asana, onedrive } from 'corsair';
import { sqlite } from '../db';

export const corsair = createCorsair({
	multiTenancy: true,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [twitterapiio(), slack(), linear(), fireflies(), asana(), onedrive()],
});
