import 'dotenv/config';

import { github } from '@corsair-dev/github';
import { createCorsair } from 'corsair';

import { pool } from '@/db';

export const corsair = createCorsair({
	plugins: [github()],
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});
