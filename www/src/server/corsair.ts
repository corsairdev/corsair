import 'dotenv/config';

import { close } from '@corsair-dev/close';
import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';

import { pool } from '@/db';

export const corsair = createCorsair({
	plugins: [close({ key: process.env.CLOSE_API_KEY }), github(), slack()],
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});
