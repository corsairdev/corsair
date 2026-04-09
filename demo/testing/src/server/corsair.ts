import 'dotenv/config';

import { dodopayments } from '@corsair-dev/dodopayments';
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
	plugins: [
		dodopayments({ key: process.env.DODO_PAYMENTS_API_KEY }),
	],
});
