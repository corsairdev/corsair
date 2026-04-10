import 'dotenv/config';

import { createCorsair } from 'corsair';
import { ConvexDatabaseAdapter } from 'corsair/db';
import { ConvexHttpClient } from 'convex/browser';
import { makeFunctionReference } from 'convex/server';
import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';
import { googlesheets } from '@corsair-dev/googlesheets';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { gmail } from '@corsair-dev/gmail';
import { linear } from '@corsair-dev/linear';
import { onedrive } from '@corsair-dev/onedrive';

const convexAdapter = new ConvexDatabaseAdapter({
	client: new ConvexHttpClient(process.env.CONVEX_URL!),
	makeFunctionRef: (_type, name) => makeFunctionReference(name),
});

export const corsair = createCorsair({
	multiTenancy: false,
	database: convexAdapter,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [github(), slack(), googlesheets(), googlecalendar(), gmail(), linear(), onedrive()],
});
