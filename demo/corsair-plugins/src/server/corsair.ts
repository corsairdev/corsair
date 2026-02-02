import { createCorsair, linear, resend, slack } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters';
import { db } from '../db';
import * as schema from '../db/schema';

export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	kek: process.env.CORSAIR_KEK!,
	plugins: [
		linear({
			webhookHooks: {
				issues: {
					create: {
						after: async (ctx, res) => {
							// some logic to fire after the channels.created webhook goes off
							console.log(res.data?.type, 'type');
						},
					}
				},
			},
		}),
		slack(),
		resend(),
	],
});
