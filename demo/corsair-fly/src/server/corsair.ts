import { createCorsair } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters';
import { linear, resend, slack } from 'corsair/plugins';
import { db } from '../db';
import * as schema from '../db/schema';

export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	kek: process.env.CORSAIR_KEK!,
	plugins: [slack(), linear(), resend()],
});
