import { createCorsair, linear, resend, slack } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters';
import { db } from '../db';
import * as schema from '../db/schema';

export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	kek: process.env.CORSAIR_KEK!,
	plugins: [
		slack({
			authType: 'api_key',
			hooks: {
				channels: {
					invite: {
						after: async (ctx, res) => {
							// some logic to fire after the channels.created webhook goes off
						},
					},
				},
			},
		}),
		linear({
			webhookHooks: {
				issues: {
					create: {
						after(ctx, response) {},
					},
					update: {
						after(ctx, response) {},
					},
				},
			},
		}),
		resend(),
	],
});
