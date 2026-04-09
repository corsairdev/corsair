import 'dotenv/config';

import { github } from '@corsair-dev/github';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { googlesheets } from '@corsair-dev/googlesheets';
import { linear } from '@corsair-dev/linear';
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';
import { sqlite } from '../db';

import { apify } from '@corsair-dev/apify';
import { onedrive } from '@corsair-dev/onedrive';

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [
		github(),
		slack(),
		googlesheets(),
		googlecalendar(),
		gmail(),
		linear(),
		apify(),
		onedrive(),
	],
});
