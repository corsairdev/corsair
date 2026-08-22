import 'dotenv/config';

import { beaconchain } from '@corsair-dev/beaconchain';
import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';

import { pool } from '@/db';

export const corsair = createCorsair({
	plugins: [
		beaconchain({ key: process.env.BEACONCHAIN_API_KEY }),
		github(),
		slack(),
	],
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});
