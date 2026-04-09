import 'dotenv/config';

import { createCorsair } from 'corsair';
import { sqlite } from '../db';
import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';
import { googlesheets } from '@corsair-dev/googlesheets';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { gmail } from '@corsair-dev/gmail';
import { linear } from '@corsair-dev/linear';
import { notion } from '@corsair-dev/notion';

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [github(), slack(), googlesheets(), googlecalendar(), gmail(), linear(), notion({authType: 'oauth_2'})],
});

