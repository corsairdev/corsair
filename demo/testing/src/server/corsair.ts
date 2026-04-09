import 'dotenv/config';

import { github } from '@corsair-dev/github';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { googlesheets } from '@corsair-dev/googlesheets';
import { linear } from '@corsair-dev/linear';
import { sharepoint } from '@corsair-dev/sharepoint';
import { outlook } from '@corsair-dev/outlook';
import { slack } from '@corsair-dev/slack';
import { onedrive } from '@corsair-dev/onedrive'
import { teams } from '@corsair-dev/teams'
import { createCorsair } from 'corsair';
import { sqlite } from '../db';

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [github(), slack(), googlesheets(), googlecalendar(), gmail(), linear(), sharepoint(), onedrive()],
});
