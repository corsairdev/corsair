import { createCorsair } from 'corsair';
import { linear, resend, slack } from 'corsair/plugins';
import { pool } from '../db';

export const corsair = createCorsair({
	multiTenancy: true,
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	plugins: [slack(), linear(), resend()],
});
