import 'dotenv/config';

import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';

import { pool } from '@/db';

export const corsair = createCorsair({
	plugins: [github(), slack()],
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});
