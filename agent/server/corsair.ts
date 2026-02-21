import { createCorsair, googlecalendar, linear, resend, slack } from 'corsair';
import { pool } from './db';

export const corsair = createCorsair({
	plugins: [slack(), linear(), resend(), googlecalendar()],
	database: pool,
	kek: process.env.CORSAIR_MASTER_KEY!,
	multiTenancy: false,
});
